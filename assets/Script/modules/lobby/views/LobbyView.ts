import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import {
    CommonFunction,
    DataStore, Dialog, GameModuleLaunchArgs, KeyConstants, LobbyModuleInterface, Logger, NewRoomViewPath
} from "../lcore/LCoreExports";

import { proto } from "../protoHH/protoHH";
import { ClubView } from "./club/ClubView";
import { EmailView } from "./EmailView";
import { GameRecordView } from "./GameRecordView";
import { JoinRoom } from "./JoinRoom";
import { NewRoomView } from "./NewRoomView";
import { UserInfoView } from "./UserInfoView";
const { ccclass } = cc._decorator;

/**
 * 大厅视图
 */
@ccclass
export class LobbyView extends cc.Component {
    private view: fgui.GComponent;
    private diamondText: fgui.GObject;
    private lm: LobbyModuleInterface;

    private nameText: fgui.GTextField;
    private beansText: fgui.GTextField;

    private fkText: fgui.GTextField;

    // private msgCenter: LMsgCenter;

    // private onMessageFunc: Function;
    private wxShowCallBackFunction: (res: showRes) => void;

    // public onMessage(data: ByteBuffer): void {
    //     Logger.debug("LobbyView.onMessage");
    //     const diamondBody = proto.lobby.MsgUpdateUserDiamond.decode(data);
    //     const diamond = diamondBody.diamond;
    //     this.updateDiamond(diamond);
    // }

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
        this.lm = lm;
        const loader = lm.loader;

        loader.fguiAddPackage("lobby/fui/lobby_main");
        // 加载共用背景包
        loader.fguiAddPackage("lobby/fui_bg/lobby_bg_package");

        const view = fgui.UIPackage.createObject("lobby_main", "Main").asCom;

        fgui.GRoot.inst.addChild(view);

        let x = CommonFunction.setBaseViewInCenter(view);
        this.view = view;

        const newIPhone = DataStore.getString(KeyConstants.ADAPTIVE_PHONE_KEY);
        if (newIPhone === "1") {
            // i phone x 的黑边为 CommonFunction.IOS_ADAPTER_WIDTH
            x = x - CommonFunction.IOS_ADAPTER_WIDTH;
        }
        const bg = this.view.getChild('bg');
        bg.setPosition(-x, 0);
        CommonFunction.setBgFullScreen(bg);

        // 兼容底部背景
        const diBg = view.getChild('bg1');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        this.view = view;
        this.initView();
        this.testJoinGame();
        // await this.startWebSocket();

        // TODO: 如果已经在房间，则拉进房间
    }

    protected onDestroy(): void {

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

        this.nameText = this.view.getChild("nameText").asTextField;
        this.beansText = this.view.getChild("douText").asTextField;
        this.fkText = this.view.getChild("fkText").asTextField;

        this.nameText.text = DataStore.getString("playerID");
        this.beansText.text = DataStore.getString("beans");
        this.fkText.text = DataStore.getString("card");
        // const createBtn = this.view.getChild("n4");
        // createBtn.onClick(this.onCreateClick, this);

        // const coinBtn = this.view.getChild("n5");
        // coinBtn.onClick(this.onCoinClick, this);

        // //--const listView = this.view.getChild("n29")
        // const dfTestBtn = this.view.getChild("n8");
        // dfTestBtn.onClick(this.openRecordView, this);

        // const emailBtn = this.view.getChild("n9");
        // emailBtn.onClick(this.openEmailView, this);

        // const joinRoomBtn = this.view.getChild("n12");
        // joinRoomBtn.onClick(this.onJoinRoom, this);

        // const createRoom = this.view.getChild("createRoom");
        // createRoom.onClick(this.onCreateRoom, this);

        // const returnGameBtn = this.view.getChild("returnGameBtn");
        // returnGameBtn.onClick(this.onReturnGameBtnClick, this);

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

    // private async startWebSocket(): Promise<void> {
    //     const tk = DataStore.getString("token", "");
    //     const webSocketURL = `${LEnv.lobbyWebsocket}?&tk=${tk}`;

    //     this.msgCenter = new LMsgCenter(webSocketURL, this, this.lm);
    //     await this.msgCenter.start();
    // }
    private onFriendClick(): void {
        this.addComponent(ClubView);
    }

    private testJoinGame(): void {
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onJoinGameAck, this); // 加入游戏

        const req2 = new proto.casino.packet_player_join_req({});
        const buf = proto.casino.packet_player_join_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_REQ);
    }

    private testDisband(): void {
        const playerID = DataStore.getString("playerID");
        const playerIDInt = parseInt(playerID, 10);
        Logger.debug("playerIDInt:", playerIDInt);

        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_DISBAND_ACK, this.onDisbandAck, this);
        const req2 = new proto.casino.packet_table_disband_req({ player_id: playerIDInt });
        const buf = proto.casino.packet_table_disband_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    private onDisbandAck(msg: proto.casino.ProxyMessage): void {
        console.log("onDisbandAck");
        const reply = proto.casino.packet_table_disband_ack.decode(msg.Data);
        console.log(reply);
    }

    private onCreateClick(): void {
        // TODO:
        this.testDisband();
    }

    private onCoinClick(): void {
        // TODO:
        Dialog.showWaiting();

        this.scheduleOnce(
            () => {
                Dialog.hideWaiting();
            },
            5);
    }

    private openRecordView(): void {
        // TODO:
        this.addComponent(GameRecordView);
    }

    private openEmailView(): void {
        const emailBtn = this.view.getChild("n9").asCom;
        const redPoint = emailBtn.getChild("redPoint");
        redPoint.visible = false;
        this.addComponent(EmailView);
    }

    private onJoinRoom(): void {
        this.addComponent(JoinRoom);

    }

    private onCreateRoom(): void {
        const newRoomView = this.addComponent(NewRoomView);
        newRoomView.showView();
        // const playerID = DataStore.getString("playerID");
        // const myUser = { userID: playerID };

        // const createRoomParams = {
        //     casinoID: 16,
        //     roomID: 2103,
        //     base: 1,
        //     round: 2,
        //     allowJoin: 0
        // };

        // const params: GameModuleLaunchArgs = {
        //     jsonString: "",
        //     userInfo: myUser,
        //     joinRoomParams: null,
        //     createRoomParams: createRoomParams,
        //     record: null
        // };

        // this.lm.switchToGame(params, "gameb");
    }

    private onJoinGameAck(msg: proto.casino.ProxyMessage): void {
        console.log("onJoinGameAck");
        const reply = proto.casino.packet_player_join_ack.decode(msg.Data);

        const tableID = DataStore.getString("tableID", "");
        if (tableID === "") {
            return;
        }

        Logger.debug("Aready in room, tableID:", tableID);
        // Dialog.showDialog("已经在房间, 正在进入房间");

        const myUser = { userID: `${reply.player_id}` };

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

    private onReturnGameBtnClick(): void {
        const jsonStr = DataStore.getString("RoomInfoData");
        Logger.debug("jsonStr:", jsonStr);
        if (jsonStr !== "") {
            try {
                // const config = <{ [key: string]: string }>JSON.parse(jsonStr);
                // const myRoomInfo = {
                //     roomID: config.roomID,
                //     roomNumber: config.roomNumber,
                //     config: config.config,
                //     gameServerID: config.gameServerID
                // };

                // this.lm.enterGame(myRoomInfo);
            } catch (e) {
                Logger.error("parse config error:", e);
                // 如果解析不了，则清理数据
                DataStore.setItem("RoomInfoData", "");
            }
        }
    }

    private openUserInfoView(): void {
        // TODO:
        this.addComponent(UserInfoView);
    }

    private initInfoView(userInfo: fgui.GComponent): void {
        const nameLab = userInfo.getChild("name");
        const idLab = userInfo.getChild("id");

        if (DataStore.hasKey("nickName")) {
            const name = DataStore.getString("nickName");

            if (name.length < 1) {
                nameLab.text = "默认用户名字";
            } else {
                nameLab.text = DataStore.getString("userID");
            }

        }

        const gender = +DataStore.getString("sex");
        const iconLoader = userInfo.getChild("loader").asLoader;
        const headImgUrl = DataStore.getString("headImgUrl");
        CommonFunction.setHead(iconLoader, headImgUrl, +gender);

        idLab.text = `ID: ${DataStore.getString("userID")}`;
        const diamondNode = this.view.getChild("diamondNode").asCom;
        const diamondText = diamondNode.getChild("diamond");
        this.diamondText = diamondText;
        this.diamondText.text = DataStore.getString("diamond");

        const addDiamond = diamondNode.getChild("addDiamond");
        addDiamond.onClick(this.goShop, this);

        this.registerDiamondChange();
    }

    private goShop(): void {
        // TODO:
    }

    private registerDiamondChange(): void {
        // TODO:
    }

    private checkRoomInfo(): void {
        //
        const jsonStr = DataStore.getString("RoomInfoData");
        Logger.debug("checkRoomInfo jsonStr:", jsonStr);
        if (jsonStr !== "") {
            this.view.getController("inRoom").selectedIndex = 1;
        } else {
            this.view.getController("inRoom").selectedIndex = 0;
        }
    }
}
