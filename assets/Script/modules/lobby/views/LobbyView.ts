import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import {
    CommonFunction,
    DataStore, GameModuleLaunchArgs, LEnv, LobbyModuleInterface, Logger, SoundMgr
} from "../lcore/LCoreExports";

import { NimSDK } from "../chanelSdk/nimSdk/NimSDKExports";
import { proto } from "../protoHH/protoHH";
import { Share } from "../shareUtil/ShareExports";
import { NewRoomView } from "./NewRoomView";
import { ShopView, TabType } from "./ShopView";
const { ccclass } = cc._decorator;

/**
 * 大厅视图
 */
@ccclass
export class LobbyView extends cc.Component {
    private view: fgui.GComponent;
    private lm: LobbyModuleInterface;

    private nameText: fgui.GTextField;
    private beansText: fgui.GTextField;

    private fkText: fgui.GTextField;

    private marqueeAction: cc.Action = null;

    //private marqueeTimer: number = null;

    private isReconnect: boolean = false;

    private wxShowCallBackFunction: (res: showRes) => void;

    protected start(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            //TODO : 目前只有微信 先用这个判断 后面要提取出来判断各种平台
            const query = WeiXinSDK.getLaunchOption();
            const rKey = "roomNumber";
            const roomNumber = query[rKey];
            // 点别人的邀请链接 第一次进游戏 走这里
            if (roomNumber !== undefined && roomNumber !== null) {
                this.lm.requetJoinRoom(roomNumber);
            }

            this.wxShowCallBackFunction = <(res: showRes) => void>this.wxShowCallBack.bind(this);
            // 点别人的邀请链接 原来就在游戏内 走这里
            wx.onShow(this.wxShowCallBackFunction);
        }
    }

    protected async onLoad(): Promise<void> {
        // 加载大厅界面
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.msgCenter.eventTarget.on("onFastLoginComplete", this.onReconnectOk, this);

        this.lm = lm;
        const loader = lm.loader;

        loader.fguiAddPackage("lobby/fui/lobby_main");

        const view = fgui.UIPackage.createObject("lobby_main", "Main").asCom;

        fgui.GRoot.inst.addChild(view);

        const x = CommonFunction.setViewInCenter(view);
        this.view = view;

        const bg = this.view.getChild('bg');
        CommonFunction.setBgFullScreenSize(bg);

        // 兼容底部背景
        const diBg = view.getChild('bg1');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        // 兼容跑马灯背景
        const bg3 = view.getChild('bg3');
        bg3.width = bg.width;
        bg3.setPosition(-x, bg3.y);

        const announcementText = this.view.getChild('announcementText');

        Logger.debug("cc.winSize.width = ", cc.winSize.width);
        announcementText.setPosition(-x + cc.winSize.width + announcementText.width, announcementText.y);

        this.view = view;
        this.initView();
        this.testJoinGame();

        SoundMgr.playMusicAudio("gameb/music_hall", true);

        this.initNimSDK();
        // await this.startWebSocket();

        // TODO: 如果已经在房间，则拉进房间
    }

    protected onDestroy(): void {
        this.isReconnect = false;
        SoundMgr.stopMusic();
        // this.msgCenter.destory();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.offShow(this.wxShowCallBack);
        }
    }

    // private updateEmailRedPoint(): void {
    //     //
    //     const emailBtn = this.view.getChild("n9").asCom;
    //     const redPoint = emailBtn.getChild("redPoint");
    //     redPoint.visible = true;
    // }

    // private updateDiamond(diamond: Long): void {
    //     this.diamondText.text = `${diamond}`;
    // }

    private wxShowCallBack(res: showRes): void {
        const rKey = "roomNumber";
        const roomNumber = res.query[rKey];
        if (roomNumber !== undefined && roomNumber !== null) {
            // Logger.debug("wxShowCallBack : ", this);
            this.lm.requetJoinRoom(roomNumber);
        }
    }
    private initView(): void {
        const personalRoomBtn = this.view.getChild("personalRoomBtn");
        personalRoomBtn.onClick(this.onCreateRoom, this);

        const signBtn = this.view.getChild("signBtn");
        signBtn.onClick(this.onSignBtnClick, this);

        const shopBtn = this.view.getChild("shopBtn");
        shopBtn.onClick(this.onShopBtnClick, this);

        const emailBtn = this.view.getChild("emailBtn");
        emailBtn.onClick(this.openEmailClick, this);

        const friendBtn = this.view.getChild("friendBtn");
        friendBtn.onClick(this.onFriendClick, this);

        const questBtn = this.view.getChild("questBtn");
        questBtn.onClick(this.onQuestBtnClick, this);

        const committeeBtn = this.view.getChild("committeeBtn");
        committeeBtn.onClick(this.onCommitteeBtnClick, this);

        const shareBtn = this.view.getChild("shareBtn");
        shareBtn.onClick(this.onShareBtnClick, this);

        const addDou = this.view.getChild("addBtn1");
        addDou.onClick(this.onAddDouBtnClick, this);

        const addFK = this.view.getChild("addBtn2");
        addFK.onClick(this.onAddFKBtnClick, this);

        this.nameText = this.view.getChild("nameText").asTextField;
        this.beansText = this.view.getChild("douText").asTextField;
        this.fkText = this.view.getChild("fkText").asTextField;

        this.nameText.text = DataStore.getString("nickName");
        this.beansText.text = DataStore.getString("beans");
        this.fkText.text = DataStore.getString("card");

        const gender = DataStore.getString("gender", "");
        const avatarURL = DataStore.getString("avatarURL", "");
        const headLoader = this.view.getChild("iconLoader").asLoader;
        CommonFunction.setHead(headLoader, avatarURL, +gender);
        // const userInfo = this.view.getChild("userInfo").asCom;
        // this.initInfoView(userInfo);
        // userInfo.onClick(this.openUserInfoView, this);

        // const bg = this.view.getChild('n21');
        // bg.setSize(cc.winSize.width, cc.winSize.width * 640 / 1136);
        // const y = -(cc.winSize.width * 640 / 1136 - cc.winSize.height) / 2;
        // const x = (cc.winSize.height * 1136 / 640 / 2) - cc.winSize.width / 2;
        // bg.setPosition(x, y);

        // this.lm.eventTarget.on(`checkRoomInfo`, this.checkRoomInfo, this);

        // this.checkRoomInfo();

    }

    private testJoinGame(): void {
        // this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onJoinGameAck, this); // 加入游戏
        this.lm.msgCenter.eventTarget.on("onJoinGameAck", this.onJoinGameAck, this);

        const req2 = new proto.casino.packet_player_join_req({});
        const buf = proto.casino.packet_player_join_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_REQ);
    }

    private onAddDouBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.Dou);
    }

    private onAddFKBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.FK);
    }

    private onFriendClick(): void {
        // TODO: 显示好友界面
        // this.showMarquee("");

    }

    private openEmailClick(): void {
        // TODO: 显示邮件界面
        //this.showMarquee("测试发送公告asdasd测试发送试发送公告asdasd");

        //Dialog.showReconnectDialog();
    }

    private onCreateRoom(): void {
        const newRoomView = this.addComponent(NewRoomView);
        newRoomView.showView();
    }

    private onSignBtnClick(): void {
        // TODO: 需要显示签到界面
    }

    private onShopBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.Dou);
    }

    private onQuestBtnClick(): void {
        // TODO: 显示任务界面
    }

    private onCommitteeBtnClick(): void {
        // TODO: 显示居委会界面
    }

    private onShareBtnClick(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Share.shareScreenshot("");
        }
    }

    private onJoinGameAck(ack: proto.casino.packet_player_join_ack): void {
        console.log("onJoinGameAck");
        // const reply = proto.casino.packet_player_join_ack.decode(msg.Data);

        if (this.isReconnect) {
            this.lm.eventTarget.emit("reconnect");
            this.isReconnect = false;
        }

        const tableID = DataStore.getString("tableID", "");
        if (tableID === "") {
            return;
        }

        Logger.debug("Aready in room, tableID:", tableID);
        // Dialog.showDialog("已经在房间, 正在进入房间");

        const myUser = { userID: `${ack.player_id}` };

        const joinRoomParams = {
            tableID: tableID
        };

        const params: GameModuleLaunchArgs = {
            jsonString: "",
            userInfo: myUser,
            joinRoomParams: joinRoomParams,
            createRoomParams: null,
            record: null
        };

        this.lm.switchToGame(params, "gameb");
    }

    private onReconnectOk(): void {
        this.isReconnect = true;
        this.testJoinGame();
    }

    private initNimSDK(): void {
        const imaccid = DataStore.getString("imaccid");
        const imtoken = DataStore.getString("imtoken");
        const nimSDK = new NimSDK(LEnv.yunxinAppKey, imaccid, imtoken);
        nimSDK.initNimSDK();

        this.lm.nimSDK = nimSDK;
    }

    private showMarquee(announcement: string): void {

        if (this.marqueeAction !== null) {
            Logger.debug("已经存在Action---------------------");

            return;
        }
        const announcementText = this.view.getChild('announcementText');
        const pos = this.view.getChild('pos');

        announcementText.text = announcement;

        const x = cc.winSize.width / 2 - (cc.winSize.height * 1136 / 640 / 2);
        announcementText.setPosition(-x + cc.winSize.width + announcementText.width, announcementText.y);

        const xPos = announcementText.node.x;
        const yPos = announcementText.node.y;

        // 方案：setInterval
        // const handler = () => {
        //     //
        //     announcementText.setPosition(announcementText.node.x - 1, announcementText.y);

        //     if (announcementText.node.x < pos.node.x) {
        //         announcementText.node.setPosition(xPos, yPos);
        //         clearInterval(this.marqueeTimer);
        //     }
        // };

        // this.marqueeTimer = setInterval(handler, 1);

        // 方案：moveTo
        let duration = announcementText.width * 0.005;
        Logger.debug("duration = ", duration);

        if (duration < 10) {
            duration = 15;
        }

        const action1 = cc.moveTo(duration, pos.node.x - 100, pos.node.y);
        const action3 = cc.callFunc(() => {
            announcementText.node.setPosition(xPos, yPos);
            this.marqueeAction = null;
        });

        const action0 = cc.sequence(action1, action3);
        this.marqueeAction = announcementText.node.runAction(action0);

    }

}
