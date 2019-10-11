import { NimSDK } from "../chanelSdk/nimSdk/NimSDKExports";
import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import { GameError } from "../errorCode/ErrorCodeExports";
import {
    CommonFunction, DataStore, Dialog, Enum,
    GameModuleLaunchArgs, KeyConstants, LEnv, LobbyModuleInterface, Logger, SoundMgr
} from "../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { proto } from "../protoHH/protoHH";
import { Share } from "../shareUtil/ShareExports";
import { LocalStrings } from "../strings/LocalStringsExports";
import { AgreementView } from "./AgreementView";
import { EmailView } from "./email/EmailView";
import { JoyBeanView } from './JoyBeanView';
import { NewRoomView } from "./NewRoomView";
import { RedPacketView } from "./redPacket/RedPacketView";
import { ShopView, TabType } from "./shop/ShopView";
import { SignView } from "./sign/SignView";
import { UserInfoTabType, UserInfoView } from "./userInfo/UserInfoView";
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
    private headLoader: fgui.GLoader;
    private marqueeAction: cc.Action = null;
    private roomNumberFromShare: string = "";
    private wxShowCallBackFunction: (res: showRes) => void;

    private broadcasts: proto.casino.Ibroadcast_config[];

    private marqueeTextOriginPos: cc.Vec2;
    private announcementText: fgui.GObject;

    private isShowSignView: boolean = false;

    private eventTarget: cc.EventTarget;

    protected async onLoad(): Promise<void> {
        // 加载大厅界面
        this.eventTarget = new cc.EventTarget();
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        this.registerHandler();
        // this.syncBoradcast();

        const loader = lm.loader;

        loader.fguiAddPackage("lobby/fui/lobby_main");
        const view = fgui.UIPackage.createObject("lobby_main", "Main").asCom;
        fgui.GRoot.inst.addChild(view);

        const x = CommonFunction.setViewInCenter(view);
        this.view = view;

        const bg = this.view.getChild('bg');
        //CommonFunction.setBgFullScreenSize(bg);

        // 兼容底部背景
        const diBg = view.getChild('bg1');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        // 兼容跑马灯背景
        const bg3 = view.getChild('bg3');
        bg3.width = bg.width;
        bg3.setPosition(-x, bg3.y);

        const announcementText = this.view.getChild('announcementText');
        announcementText.setPosition(-x + cc.winSize.width + announcementText.width, announcementText.y);

        this.view = view;
        this.initView();
        this.sendDataReq();

        const musicVolume = +DataStore.getString(KeyConstants.MUSIC_VOLUME, "0");
        const effectVolume = +DataStore.getString(KeyConstants.EFFECT_VOLUME, "0");

        SoundMgr.initSound(musicVolume, effectVolume);

        this.initNimSDK();
        this.setLaunchCallBack();
        this.checkGpsSetting();
        this.checkAgreement();

        this.checkLocalRedDot();
    }

    protected onDestroy(): void {
        Logger.debug("LobbyView.onDestroy");
        this.eventTarget.emit("destroy");
        this.lm.nimSDK.close();
        SoundMgr.stopMusic();
        this.unregisterHandler();
        this.announcementText.node.stopAllActions();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Logger.debug("LobbyView wx.offShow(this.wxShowCallBackFunction);");
            wx.offShow(this.wxShowCallBackFunction);
            this.wxShowCallBackFunction = null;
        }

        this.view.dispose();
    }

    private registerHandler(): void {
        this.lm.msgCenter.eventTarget.on("onFastLoginComplete", this.onReconnectOk, this);
        this.lm.msgCenter.eventTarget.on("logout", this.onLogout, this);
        this.lm.eventTarget.on("onUserInfoModify", this.onUserInfoModify, this);
        this.lm.eventTarget.on("returnFromGame", this.onReturnFromGame, this);

        this.lm.eventTarget.on("emailAllRead", this.checkEmailRedDot, this);
        this.lm.eventTarget.on("signSuccess", this.checkSignRedDot, this);

        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_UPDATE, this.onMsgUpdate, this);
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_BROADCAST, this.onBroadcast, this);
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_DATA_ACK, this.onDataAck, this);
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_MAIL_ACK, this.onEmailAck, this);
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onJoinTableAck, this); // 加入桌子
    }

    private unregisterHandler(): void {
        this.lm.eventTarget.off("onUserInfoModify");
        this.lm.eventTarget.off("returnFromGame");
    }

    private checkAgreement(): void {
        const agree = DataStore.getString(KeyConstants.AGREEMENT);
        if (agree !== KeyConstants.RESULT_YES) {
            this.addComponent(AgreementView);

        }
    }

    private wxShowCallBack(res: showRes): void {
        Logger.debug("wxShowCallBack");
        const rKey = "roomNumber";
        const roomNumber = res.query[rKey];
        if (roomNumber !== undefined && roomNumber !== null) {
            this.roomNumberFromShare = roomNumber;
            this.lm.msgCenter.closeWebsocket();
        }

        const musicVolume = +DataStore.getString(KeyConstants.MUSIC_VOLUME, "0");
        if (musicVolume > 0) {
            SoundMgr.stopMusic();
            SoundMgr.playMusic();
        } else {
            SoundMgr.stopMusic();
        }

    }
    private initView(): void {
        const personalRoomBtn = this.view.getChild("personalRoomBtn");
        personalRoomBtn.onClick(this.onCreateRoom, this);

        this.announcementText = this.view.getChild('announcementText');
        this.marqueeTextOriginPos = new cc.Vec2(this.announcementText.node.x, this.announcementText.node.y);

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

        const settingBtn = this.view.getChild("settingBtn");
        settingBtn.onClick(this.onSettingBtnClick, this);

        const addDou = this.view.getChild("addBtn1");
        addDou.onClick(this.onAddDouBtnClick, this);

        const addFK = this.view.getChild("addBtn2");
        addFK.onClick(this.onAddFKBtnClick, this);

        const announcementBtn = this.view.getChild("announcementBtn");
        announcementBtn.onClick(this.onAnnouncementBtnClick, this);

        const applyAgentBtn = this.view.getChild("applyAgentBtn");
        applyAgentBtn.onClick(this.onApplyAgentBtnClick, this);

        const redPacketBtn = this.view.getChild("redPacketBtn");
        redPacketBtn.onClick(this.onRedPacketBtnClick, this);

        this.showButtonAction(applyAgentBtn);
        this.showButtonAction(redPacketBtn);

        const joyBeanHallBtn = this.view.getChild("huanlechangBtn");
        joyBeanHallBtn.onClick(this.onJoyBeanHallBtnClick, this);

        const chsBtn = this.view.getChild("chsBtn");
        chsBtn.onClick(this.onChsBtnClick, this);

        const guildBtn = this.view.getChild("guildBtn");
        guildBtn.onClick(this.onGuildBtnClick, this);

        this.nameText = this.view.getChild("nameText").asTextField;
        this.beansText = this.view.getChild("douText").asTextField;
        this.fkText = this.view.getChild("fkText").asTextField;

        this.nameText.text = CommonFunction.nameFormatWithCount(DataStore.getString(KeyConstants.NICK_NAME), 6);
        this.beansText.text = DataStore.getString(KeyConstants.BEANS);
        this.fkText.text = DataStore.getString(KeyConstants.CARD);

        const gender = DataStore.getString(KeyConstants.GENDER, "");
        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");
        const avatarIndex = DataStore.getString(KeyConstants.AVATAR_INDEX, "0");
        this.headLoader = this.view.getChild("iconLoader").asLoader;
        this.headLoader.onClick(this.onUserInfoClick, this);

        CommonFunction.setHead(this.headLoader, avatarURL, +avatarIndex, +gender);

        // ios 屏蔽掉
        if (cc.sys.os === cc.sys.OS_IOS) {
            shopBtn.visible = false;
            this.view.getChild("tipTextCom").visible = false;

            signBtn.x = 61;
            emailBtn.x = 216;

        }
        const vipTips = this.view.getChild("tipTextCom");

        // 没开发的内容暂时屏蔽
        vipTips.visible = false;
        friendBtn.visible = false;
        questBtn.visible = false;
        committeeBtn.visible = false;
        guildBtn.visible = false;
        announcementBtn.visible = false;
        applyAgentBtn.visible = false;
        redPacketBtn.visible = false;
    }
    private showButtonAction(btn: fgui.GObject): void {
        btn.node.runAction(cc.sequence(
            cc.scaleTo(0.1, 0, 1), cc.scaleTo(0.1, 1, 1), cc.scaleTo(0.1, 0, 1),
            cc.scaleTo(0.1, 1, 1), cc.delayTime(1), cc.scaleTo(0.1, 0, 1),
            cc.scaleTo(0.1, 1, 1), cc.scaleTo(0.1, 0, 1), cc.scaleTo(0.1, 1, 1),
            cc.delayTime(0.3), cc.scaleTo(0.05, 1.1, 1.1), cc.scaleTo(0.05, 1, 1), cc.delayTime(0.5)).repeatForever());
    }

    private checkLocalRedDot(): void {
        this.checkSignRedDot();
    }

    private calcUnReadEmailState(): void {
        const playerEmailsStr = DataStore.getString(KeyConstants.PLAYER_EMAIL);
        const playerEmails = <proto.casino.Iplayer_mail[]>JSON.parse(playerEmailsStr);

        for (const email of playerEmails) {
            if (email.data !== null && CommonFunction.toNumber(email.view_time) === 0) {
                DataStore.setItem(KeyConstants.UNREAD_EMAIL, 1);
                this.checkEmailRedDot();
                break;
            }
        }
    }
    private checkEmailRedDot(): void {
        const unReadEmail = +DataStore.getString(KeyConstants.UNREAD_EMAIL);

        const btn = this.view.getChild("emailBtn");
        if (unReadEmail === 1) {
            btn.asButton.getChild("redDot").visible = true;
        } else {
            btn.asButton.getChild("redDot").visible = false;
        }
    }

    private checkSignRedDot(): void {
        const signBtn = this.view.getChild("signBtn").asButton;
        if (this.isDaySignExist()) {
            signBtn.asButton.getChild("redDot").visible = true;
            this.isShowSignView = true;
        } else {
            signBtn.asButton.getChild("redDot").visible = false;
            this.isShowSignView = false;
        }
    }

    private testJoinGame(): void {
        Logger.debug("testJoinGame");
        // this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onJoinGameAck, this); // 加入游戏
        this.lm.msgCenter.eventTarget.on("onJoinGameAck", this.onJoinGameAck, this);

        const req2 = new proto.casino.packet_player_join_req({});
        const buf = proto.casino.packet_player_join_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_REQ);
    }

    private joinTableReq(tableID: long, roomNumber?: number): void {
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req = new proto.casino.packet_table_join_req();
        req.player_id = +playerID;
        if (tableID !== null) {
            req.table_id = tableID;
        }

        if (roomNumber !== undefined && roomNumber !== null) {
            req.tag = roomNumber;
        }

        Logger.debug("joinTable, req:", req);

        const req2 = new proto.casino.packet_table_join_req(req);
        const buf = proto.casino.packet_table_join_req.encode(req2);
        if (this.lm !== undefined) {
            this.lm.joinRoom(buf);
        } else {
            Logger.error("this.lm === undefined");
        }

        this.lm.msgCenter.blockNormal();

    }

    private onUserInfoClick(): void {
        SoundMgr.buttonTouch();
        const view = this.addComponent(UserInfoView);
        view.showView(UserInfoTabType.BASE_INFO);
    }

    private onSettingBtnClick(): void {
        SoundMgr.buttonTouch();
        const view = this.addComponent(UserInfoView);
        view.showView(UserInfoTabType.GAME_SETTING);
    }

    private onAddDouBtnClick(): void {
        SoundMgr.buttonTouch();
        this.showShopView(TabType.Dou);
    }

    private onAddFKBtnClick(): void {
        SoundMgr.buttonTouch();
        this.showShopView(TabType.FK);
    }

    private onAnnouncementBtnClick(): void {
        SoundMgr.buttonTouch();
    }
    private onApplyAgentBtnClick(): void {
        SoundMgr.buttonTouch();
    }
    private onRedPacketBtnClick(): void {
        SoundMgr.buttonTouch();
        this.addComponent(RedPacketView);
    }

    private onJoyBeanHallBtnClick(): void {
        SoundMgr.buttonTouch();
        const view = this.addComponent(JoyBeanView);
        view.show();
    }

    private onChsBtnClick(): void {
        SoundMgr.buttonTouch();
        Dialog.prompt(LocalStrings.findString("stayTuned"));
    }
    private onGuildBtnClick(): void {
        SoundMgr.buttonTouch();
        Dialog.prompt(LocalStrings.findString("stayTuned"));
    }

    private onFriendClick(): void {
        SoundMgr.buttonTouch();
        // TODO: 显示好友界面
        // this.showMarquee("");
        //this.lm.nimSDK.disconnect();
        // TODO: 显示邮件界面
        //this.showMarquee("测试发送公告测试发送试发送公告");
        //Dialog.showReconnectDialog();
        // let count = 0;
        // const handler = () => {
        //     //
        //     Dialog.showReconnectDialog();
        //     count++;
        //     Logger.debug("showReconnectDialog count =", count);
        // };
        // setInterval(handler, 1000);

    }

    private openEmailClick(): void {
        SoundMgr.buttonTouch();
        this.addComponent(EmailView);
    }

    private onCreateRoom(): void {
        SoundMgr.buttonTouch();
        const newRoomView = this.addComponent(NewRoomView);
        newRoomView.showView();
    }

    private onSignBtnClick(): void {
        // TODO: 需要显示签到界面
        SoundMgr.buttonTouch();
        this.addComponent(SignView);
    }

    private onShopBtnClick(): void {
        SoundMgr.buttonTouch();
        this.showShopView(TabType.Dou);
    }

    private onQuestBtnClick(): void {
        // TODO: 显示任务界面
        SoundMgr.buttonTouch();
    }

    private onCommitteeBtnClick(): void {
        // TODO: 显示居委会界面
        SoundMgr.buttonTouch();
    }

    private onShareBtnClick(): void {
        SoundMgr.buttonTouch();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Share.shareScreenshot("");
        }
    }

    // 相当于游戏的入口，每次重连都跑这里来
    private onJoinGameAck(ack: proto.casino.packet_player_join_ack): void {
        console.log("onJoinGameAck");
        // const reply = proto.casino.packet_player_join_ack.decode(msg.Data);
        this.syncMsg();

        this.checkBuyOrder();
        // 如果是在房间内重连，则发通知让房间重连恢复
        if (this.lm.isGameModuleExist()) {
            let isFromShare: boolean = false;
            if (this.roomNumberFromShare !== "" && this.roomNumberFromShare !== undefined && this.roomNumberFromShare !== null) {
                isFromShare = true;
            }

            this.lm.eventTarget.emit("reconnect", isFromShare);
            this.roomNumberFromShare = "";

            return;
        }

        Dialog.hideReconnectDialog();

        // 如果是登录进入房间，已经在房间则拉回房间
        const tableIDString = DataStore.getString(KeyConstants.TABLE_ID, "");
        if (tableIDString !== "") {
            Logger.debug("already in room, tableID:", tableIDString);

            const tableID = long.fromString(tableIDString, true);
            this.joinTableReq(tableID);

            DataStore.setItem(KeyConstants.TABLE_ID, "");

            return;
        }

        // 如果是从分享进来，则拉进房间
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            if (this.roomNumberFromShare !== "" && this.roomNumberFromShare !== undefined && this.roomNumberFromShare !== null) {
                this.joinTableReq(null, +this.roomNumberFromShare);
                this.roomNumberFromShare = "";

                return;
            }
        }

        if (this.isShowSignView) {
            this.isShowSignView = false;
            const agreementView = this.getComponent(AgreementView);
            if (agreementView === null) {
                this.addComponent(SignView);
            }
        }

    }

    private onEmailAck(msg: proto.casino.ProxyMessage): void {

        const mailData = proto.casino.packet_mail_ack.decode(msg.Data);
        if (mailData.ret === proto.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
            // 拉取邮件列表，id === 0
            if (CommonFunction.toNumber(mailData.mail_id) === 0) {

                const playerEmails = mailData.mails;
                const emailData = JSON.stringify(playerEmails);
                DataStore.setItem(KeyConstants.PLAYER_EMAIL, emailData);
                this.calcUnReadEmailState();

            }
        }

        this.lm.eventTarget.emit("onMailAck", mailData);
    }

    private onDataAck(msg: proto.casino.ProxyMessage): void {
        Logger.debug("onDataAck");
        const reply = proto.casino.packet_data_ack.decode(msg.Data);
        for (const ack of reply.acks) {
            if (ack.name === "act_checkin_day") {
                const checkinDay = proto.casino.act_checkin_day_data.decode(ack.data);
                const json = JSON.stringify(checkinDay);
                DataStore.setItem(KeyConstants.ACT_CHECK_IN_DAY, json);
                Logger.debug("checkinDay:", checkinDay);
            }
        }
        Logger.debug("reply:", reply);

        this.testJoinGame();
    }
    private onJoinTableAck(msg: proto.casino.ProxyMessage): void {
        Logger.debug("LobbyView.onJoinTableAck");

        const joinRoomAck = proto.casino.packet_table_join_ack.decode(msg.Data);
        if (this.lm.isGameModuleExist()) {
            this.lm.eventTarget.emit("onJoinTableAck", joinRoomAck);

            return;
        }

        if (joinRoomAck.ret !== 0) {
            Logger.debug("onJoinTableAck, failed:", joinRoomAck.ret);
            const errMsg = GameError.getErrorString(joinRoomAck.ret);
            Dialog.showDialog(errMsg);

            this.lm.msgCenter.unblockNormal();

            return;
        }

        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const myUser = { userID: playerID };

        const joinRoomParams = {
            table: joinRoomAck.tdata,
            reconnect: joinRoomAck.reconnect
        };

        Logger.debug("joinRoomParams:", joinRoomParams);

        const params: GameModuleLaunchArgs = {
            jsonString: "",
            userInfo: myUser,
            joinRoomParams: joinRoomParams,
            createRoomParams: null,
            record: null,
            roomId: joinRoomAck.tdata.room_id
        };

        const newRoomView = this.getComponent(NewRoomView);
        if (newRoomView !== null) {
            newRoomView.destroy();
        }

        const joyBeanView = this.getComponent(JoyBeanView);
        if (joyBeanView !== null) {
            joyBeanView.hideView();
        }

        const agreementView = this.getComponent(AgreementView);
        if (agreementView !== null) {
            agreementView.destroy();
        }

        const callback = () => {
            const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
            lm.switchToGame(params, "gameb");
        };

        // 等销毁NewRoomView、JoyBeanView下一帧的时候再加入房间
        this.scheduleOnce(callback, 0);

    }

    private onReconnectOk(fastLoginReply: proto.casino.packet_fast_login_ack): void {
        this.saveFastLoginReply(fastLoginReply);
        this.testJoinGame();
    }

    private onUserInfoModify(): void {
        const gender = DataStore.getString(KeyConstants.GENDER, "");
        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");
        const avatarIndex = DataStore.getString(KeyConstants.AVATAR_INDEX, "0");
        const nickName = DataStore.getString(KeyConstants.NICK_NAME, "");

        this.nameText.text = nickName;

        CommonFunction.setHead(this.headLoader, avatarURL, +avatarIndex, +gender);
    }

    private initNimSDK(): void {
        const imaccid = DataStore.getString(KeyConstants.IM_ACCID);
        const imtoken = DataStore.getString(KeyConstants.IM_TOKEN);
        const nimSDK = new NimSDK(LEnv.yunxinAppKey, imaccid, imtoken, this);
        nimSDK.initNimSDK();

        this.lm.nimSDK = nimSDK;
    }

    private showShopView(page: TabType): void {
        // ios 屏蔽掉
        if (cc.sys.os === cc.sys.OS_IOS) {
            return;
        }

        const view = this.addComponent(ShopView);
        view.showView(this.lm.loader, page);
    }

    private showMarquee(announcement: string, duration: number): void {

        if (this.marqueeAction !== null) {
            Logger.debug("showMarquee already had marquee action---------------------");

            return;
        }
        const announcementText = this.announcementText;
        const pos = this.view.getChild('pos');

        announcementText.text = announcement;

        const x = cc.winSize.width / 2 - (cc.winSize.height * 1136 / 640 / 2);
        announcementText.setPosition(-x + cc.winSize.width + announcementText.width, announcementText.y);

        const xPos = announcementText.node.x;
        const yPos = announcementText.node.y;

        const endPos = cc.v2(-cc.winSize.width, pos.node.y);

        const action1 = cc.moveTo(duration, endPos);
        const action3 = cc.callFunc(() => {
            announcementText.node.setPosition(xPos, yPos);
            this.marqueeAction = null;

            if (this.broadcasts.length > 0) {
                const firstBroadcast = this.broadcasts.shift();
                firstBroadcast.play_interval = firstBroadcast.play_interval - 1;
                this.marqueeAction = null;
                this.showMarquee(firstBroadcast.content, firstBroadcast.play_duration);

                if (firstBroadcast.play_interval !== 0) {
                    this.broadcasts.push(firstBroadcast);
                }
                // Logger.debug("broadcasts:", this.broadcasts);
                // Logger.debug(`broadcasts, id:${firstBroadcast.id}, play_interval:${firstBroadcast.play_interval}`);
            }

        });

        announcementText.node.stopAllActions();

        const action0 = cc.sequence(action1, action3);
        this.marqueeAction = announcementText.node.runAction(action0);

    }

    private setLaunchCallBack(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.wxShowCallBackFunction = <(res: showRes) => void>this.wxShowCallBack.bind(this);
            // 点别人的邀请链接 原来就在游戏内 走这里
            wx.onShow(this.wxShowCallBackFunction);
            const query = WeiXinSDK.getLaunchOption();
            const rKey = "roomNumber";
            this.roomNumberFromShare = query[rKey];
            Logger.debug(`share from wx, room number:${this.roomNumberFromShare}`);
            const handler = () => {
                const musicVolume = +DataStore.getString(KeyConstants.MUSIC_VOLUME, "0");
                if (musicVolume > 0) {
                    SoundMgr.stopMusic();
                    SoundMgr.playMusic();

                } else {
                    SoundMgr.stopMusic();
                }
            };

            wx.onAudioInterruptionEnd(handler);
        }
    }

    private onMsgUpdate(msg: proto.casino.ProxyMessage): void {
        const updateMsg = proto.casino.packet_update.decode(msg.Data);

        switch (updateMsg.type) {
            case proto.casino.eTYPE.TYPE_PLAYER_RESOURCE:

                this.updateMoney(updateMsg);
                break;
            case proto.casino.eTYPE.TYPE_PLAYER_ENERGY:

                this.updatePlayerEnergy(updateMsg);
                break;

            case proto.casino.eTYPE.TYPE_PLAYER_RED:

                this.updatePlayerRedData(updateMsg);
                break;

            default:
                Logger.debug("LobbyView.updateMsg unHander msg , type = ", updateMsg.type);

        }

    }

    private updatePlayerRedData(updateMsg: proto.casino.packet_update): void {
        const playerRed = proto.casino.player_red.decode(updateMsg.data);
        const playerRedData = JSON.stringify(playerRed);
        DataStore.setItem(KeyConstants.PLAYER_RED, playerRedData);
        this.lm.eventTarget.emit(KeyConstants.PLAYER_RED);
    }

    private updatePlayerEnergy(updateMsg: proto.casino.packet_update): void {
        const playerEnergy = proto.casino.player_energy.decode(updateMsg.data);
        Logger.debug("updatePlayerEnergy,----------------------------------------- playerEnergy = ", playerEnergy);
        const playerEnergyStr = JSON.stringify(playerEnergy);
        DataStore.setItem(KeyConstants.PLAYER_ENERGY, playerEnergyStr);
        this.lm.eventTarget.emit(KeyConstants.PLAYER_ENERGY, playerEnergy.curr_energy);
    }

    private updateMoney(updateMsg: proto.casino.packet_update): void {
        const playerResource = proto.casino.player_resource.decode(updateMsg.data);
        if (playerResource.type === proto.casino.eRESOURCE.RESOURCE_CARD) {
            DataStore.setItem(KeyConstants.CARD, playerResource.curr.toNumber());
            this.fkText.text = playerResource.curr.toString();
        }

        if (playerResource.type === proto.casino.eRESOURCE.RESOURCE_BEANS) {
            DataStore.setItem(KeyConstants.BEANS, playerResource.curr.toNumber());
            this.beansText.text = playerResource.curr.toString();
        }

        if (playerResource.type === proto.casino.eRESOURCE.RESOURCE_RED) {
            DataStore.setItem(KeyConstants.RED, playerResource.curr.toNumber());
        }

        this.lm.eventTarget.emit("onResourceChange");
        Logger.debug(`LobbyView.updateMsg, resource type:${playerResource.type},   playerResource.curr:${playerResource.curr}`);
    }

    private onBroadcast(msg: proto.casino.ProxyMessage): void {
        const broadcastCfg = proto.casino.packet_broadcast_config.decode(msg.Data);
        Logger.debug("broadcastCfg:", broadcastCfg);
        this.broadcasts = [];
        for (const b of broadcastCfg.broadcast) {
            if (!b.disable) {
                this.broadcasts.push(b);
            }
        }

        if (this.marqueeAction === null && this.broadcasts.length > 0) {
            const firstBroadcast = this.broadcasts.shift();
            firstBroadcast.play_interval = firstBroadcast.play_interval - 1;
            this.showMarquee(firstBroadcast.content, firstBroadcast.play_duration);

            if (firstBroadcast.play_interval !== 0) {
                this.broadcasts.push(firstBroadcast);
            }
        }

    }

    private checkGpsSetting(): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }

        wx.getSetting({
            success: (res: getSettingRes) => {
                console.log(res);
                const authSetting = <{ 'scope.userInfo': boolean; 'scope.userLocation': boolean }>res.authSetting;
                if (!authSetting['scope.userLocation']) {
                    // 如果gps权限没打开，强制把界面上的gps置为关闭状态
                    DataStore.setItem(KeyConstants.GPS, "0");
                } else {
                    const gps = DataStore.getString(KeyConstants.GPS, "0");
                    if (+gps > 0) {
                        wx.getLocation({
                            type: 'wgs84',
                            success: (location: getLocationRes) => {
                                const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
                                const req = new proto.casino.packet_coordinate(
                                    { player_id: +playerID, latitude: location.latitude, longitude: location.longitude }
                                );
                                const buf = proto.casino.packet_coordinate.encode(req);
                                this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_COORDINATE);
                                Logger.debug(`latitude:${location.latitude}, longitude:${location.longitude}`);
                            },

                            // tslint:disable-next-line:no-any
                            fail: (err: any) => {
                                Logger.error("getLocation error:", err);
                            }

                        });
                    }
                }

            },

            // tslint:disable-next-line:no-any
            fail: (err: any) => {
                Logger.error("getSetting error:", err);
                DataStore.setItem(KeyConstants.GPS, "0");
                // this.applyGpsSetting();
            }
        });
    }

    private syncMsg(): void {
        this.syncBroadcast();
        this.syncEmail();
    }
    private sendDataReq(): void {
        const req = new proto.casino.packet_data_req();
        const buf = proto.casino.packet_data_req.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_DATA_REQ);
    }

    private syncBroadcast(): void {
        Logger.debug("syncBroadcast");
        const req = new proto.casino.packet_broadcast_sync();
        const buf = proto.casino.packet_broadcast_sync.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_BROADCAST_SYNC);
    }

    private syncEmail(): void {
        Logger.debug("syncEmail");
        const req2 = new proto.casino.packet_mail_req();
        req2.player_id = 0;
        req2.gain = false;
        const buf = proto.casino.packet_mail_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);
    }

    private resetMarquee(): void {
        this.announcementText.text = "";
        this.announcementText.node.stopAllActions();
        this.announcementText.node.setPosition(this.marqueeTextOriginPos.x, this.marqueeTextOriginPos.y);
        this.marqueeAction = null;

        if (this.broadcasts.length > 0) {
            const firstBroadcast = this.broadcasts.shift();
            firstBroadcast.play_interval = firstBroadcast.play_interval - 1;

            this.showMarquee(firstBroadcast.content, firstBroadcast.play_duration);

            if (firstBroadcast.play_interval !== 0) {
                this.broadcasts.push(firstBroadcast);
            }

        }
    }
    private onReturnFromGame(isFromJoyRoom: boolean): void {
        // this.announcementText.node.resumeAllActions();
        this.resetMarquee();

        const redPacketBtn = this.view.getChild("redPacketBtn");
        const applyAgentBtn = this.view.getChild("applyAgentBtn");
        this.showButtonAction(applyAgentBtn);
        this.showButtonAction(redPacketBtn);

        if (!isFromJoyRoom && this.isDaySignExist()) {
            this.addComponent(SignView);
        }

    }

    private isDaySignExist(): boolean {
        const actStr = DataStore.getString(KeyConstants.PLAYER_ACTS);
        const acts = <proto.casino.player_act[]>JSON.parse(actStr);

        let myAct: proto.casino.player_act = null;
        for (const act of acts) {
            if (act.type === proto.casino.eACT.ACT_SIGN) {
                myAct = act;
            }
        }

        if (myAct.total === 0) {
            return true;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayInSeconds = Date.parse(today.toString());
        if (myAct.act_time.low >= Math.floor(todayInSeconds / 1000)) {
            return false;
        }

        return true;
    }

    private saveFastLoginReply(fastLoginAck: proto.casino.packet_fast_login_ack): void {
        // 桌子ID
        let tableID: string = `${fastLoginAck.pdata.table_id}`;
        if (tableID === "null" || tableID === "0") {
            tableID = "";
        }
        // 获取房卡资源
        let card: number = 0;
        let beans: number = 0;
        let red: number = 0;
        for (const resource of fastLoginAck.pdata.resources) {
            if (resource.type === proto.casino.eRESOURCE.RESOURCE_CARD) {
                card = resource.curr.toNumber();
            }
            if (resource.type === proto.casino.eRESOURCE.RESOURCE_BEANS) {
                beans = resource.curr.toNumber();
            }
            if (resource.type === proto.casino.eRESOURCE.RESOURCE_RED) {
                red = resource.curr.toNumber();
            }
        }

        let nickName = fastLoginAck.pdata.data.nickname;
        if (fastLoginAck.pdata.channel_nickname !== null && fastLoginAck.pdata.channel_nickname !== "") {
            nickName = fastLoginAck.pdata.channel_nickname;
        }

        let avatarUrl = "";
        if (fastLoginAck.pdata.channel_head !== null) {
            avatarUrl = fastLoginAck.pdata.channel_head;
        }

        const gameConfigStr = JSON.stringify(fastLoginAck.config);
        const payDataStr = JSON.stringify(fastLoginAck.paydata);
        const dataGdy = JSON.stringify(fastLoginAck.pdata.data_gdy);

        const rooms: proto.casino.Iroom[] = [];
        //把欢乐场的房间信息提出来
        for (const r of fastLoginAck.rooms) {
            if (r.cost_type === 9) {
                rooms.push(r);
            }
        }
        const etData = JSON.stringify(fastLoginAck.et_data);
        const playerEnergy = JSON.stringify(fastLoginAck.pdata.energy);
        const emailData = JSON.stringify(fastLoginAck.pdata.mails);
        const playerRedData = JSON.stringify(fastLoginAck.pdata.red);
        const redData = JSON.stringify(fastLoginAck.reddata);
        const acts = JSON.stringify(fastLoginAck.pdata.acts);

        DataStore.setItem(KeyConstants.AVATAR_URL, avatarUrl);
        DataStore.setItem(KeyConstants.USER_ID, fastLoginAck.user_id);
        DataStore.setItem(KeyConstants.NICK_NAME, nickName);
        DataStore.setItem(KeyConstants.GENDER, fastLoginAck.pdata.data.sex);
        DataStore.setItem(KeyConstants.PLAYER_ID, fastLoginAck.player_id);
        DataStore.setItem(KeyConstants.PHONE, fastLoginAck.pdata.data.phone);
        DataStore.setItem(KeyConstants.TABLE_ID, tableID);
        DataStore.setItem(KeyConstants.CARD, card);
        DataStore.setItem(KeyConstants.BEANS, beans);
        DataStore.setItem(KeyConstants.RED, red);
        DataStore.setItem(KeyConstants.GAME_CONFIG, gameConfigStr);
        DataStore.setItem(KeyConstants.PAY_DATA, payDataStr);
        DataStore.setItem(KeyConstants.DATA_GDY, dataGdy);
        DataStore.setItem(KeyConstants.ROOMS, JSON.stringify(rooms));
        DataStore.setItem(KeyConstants.AVATAR_INDEX, fastLoginAck.pdata.data.avatar);
        DataStore.setItem(KeyConstants.TURN_TABLE, etData);
        DataStore.setItem(KeyConstants.PLAYER_ENERGY, playerEnergy);
        DataStore.setItem(KeyConstants.PLAYER_EMAIL, emailData);
        DataStore.setItem(KeyConstants.PLAYER_ACTS, acts);
        // 红包提现信息
        DataStore.setItem(KeyConstants.PLAYER_RED, playerRedData);
        // 红包数据
        DataStore.setItem(KeyConstants.RED_DATA, redData);
        // 低保（免费领取欢乐豆）数据
        let helperTime = 0;
        if (fastLoginAck.pdata.helper.helper_time !== undefined && fastLoginAck.pdata.helper.helper_time !== null) {
            helperTime = +fastLoginAck.pdata.helper.helper_time * 1000;
        }

        DataStore.setItem(KeyConstants.HELPER_TIME, helperTime);
        DataStore.setItem(KeyConstants.HELPER_SIZE, fastLoginAck.helperdata.helpers.length);
        DataStore.setItem(KeyConstants.HELPER_MIN, fastLoginAck.helperdata.gold_min);
        DataStore.setItem(KeyConstants.HELPER_PARAM, fastLoginAck.pdata.helper.param);

        if (fastLoginAck.channel === "mac") {
            // 游客登录标志
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.VISITOR);
            DataStore.setItem(KeyConstants.OPEN_UD_ID, fastLoginAck.pdata.data.create_openudid);
        } else if (fastLoginAck.channel === "weixin") {
            // 微信登录标志
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.WECHAT);
        } else if (fastLoginAck.channel === "phone") {
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.PHONE);
        } else {
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.UNKNOWN);
        }

        this.fkText.text = `${card}`;
        this.beansText.text = `${beans}`;
    }
    private onLogout(): void {
        Logger.debug("onLogout");
        this.lm.logout();
        this.destroy();
    }

    private checkBuyOrder(): void {
        const orderIDStrings = DataStore.getString(KeyConstants.ORDERS, "");
        if (orderIDStrings === "") {
            return;
        }

        const orderMap = <{ [key: string]: number }>JSON.parse(orderIDStrings);
        const keys = Object.keys(orderMap);
        for (const key of keys) {
            CommonFunction.requestServerShipments(orderMap[key], key, this.eventTarget);
        }
    }
}
