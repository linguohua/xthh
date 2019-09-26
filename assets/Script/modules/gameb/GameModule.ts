import { NIMMessage } from "../lobby/chanelSdk/nimSdk/NimSDKExports";
import { GameError } from "../lobby/errorCode/ErrorCodeExports";
import {
    AnimationMgr, CommonFunction,
    CreateRoomParams, DataStore,
    Dialog, GameModuleInterface, GameModuleLaunchArgs, GResLoader, JoinRoomParams,
    KeyConstants, LobbyModuleInterface, Logger, Message, MsgQueue, MsgType, NimSDKInterface, UserInfo
} from "../lobby/lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
// import long = require("../lobby/protobufjs/long");
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { LotteryView } from "../lobby/views/lottery/LotteryViewExports";
import { WelfareView } from "../lobby/views/welfare/WelfareViewExports";
import { Replay } from "./Replay";
import { msgHandlers, Room } from "./Room";
// import { roomStatus } from "./RoomInterface";

// const mc = proto.mahjong.MessageCode;
// const priorityMap: { [key: number]: number } = {
//     [mc.OPDisbandRequest]: 1, [mc.OPDisbandNotify]: 1, [mc.OPDisbandAnswer]: 1
// };
// 添加需要优先级管理的消息码
const mc = protoHH.casino.eMSG_TYPE;
const priorityMap: { [key: number]: number } = {
    [mc.MSG_TABLE_CREATE_ACK]: 1, [mc.MSG_TABLE_JOIN_ACK]: 1, [mc.MSG_TABLE_DISBAND_REQ]: 1, [mc.MSG_TABLE_DISBAND_ACK]: 1
};

/**
 * 子游戏入口
 */
export class GameModule extends cc.Component implements GameModuleInterface {
    public eventTarget: cc.EventTarget;

    public loader: GResLoader;

    public timeElapsed: number = 0;

    private view: fgui.GComponent;

    private mq: MsgQueue;
    private connectErrorCount: number = 0;
    // private retry: boolean = false;
    // private forceExit: boolean = false;
    private mRoom: Room;
    private lm: LobbyModuleInterface;
    private mUser: UserInfo;
    private mJoinRoomParams: JoinRoomParams;
    private mCreateRoomParams: CreateRoomParams;
    private mAnimationMgr: AnimationMgr;
    private retry: boolean = false;

    private isGpsOpen: boolean = false;
    private joyRoom: protoHH.casino.Iroom;
    private joyRooms: protoHH.casino.Iroom[];

    public getLobbyModuleLoader(): GResLoader {
        return this.lm.loader;
    }

    public getNimSDK(): NimSDKInterface {
        return this.lm.nimSDK;
    }

    public get room(): Room {
        return this.mRoom;
    }

    public get resLoader(): GResLoader {
        return this.loader;
    }

    public get component(): cc.Component {
        return this;
    }

    public get user(): UserInfo {
        return this.mUser;
    }

    public get animationMgr(): AnimationMgr {
        return this.mAnimationMgr;
    }

    public async launch(args: GameModuleLaunchArgs): Promise<void> {
        //保存欢乐场信息
        const pdataStr = DataStore.getString(KeyConstants.ROOMS, "");
        this.joyRooms = <protoHH.casino.Iroom[]>JSON.parse(pdataStr);
        //判断此房间是否是欢乐场
        this.joyRoom = null;
        for (const r of this.joyRooms) {
            if (r.id === args.roomId) {
                this.joyRoom = r;
                break;
            }
        }
        // 尝试进入房间
        this.lm = args.lm;
        this.loader = args.loader;

        this.lm.eventTarget.on("reconnect", this.onReconnect, this);
        this.lm.eventTarget.on("onJoinTableAck", this.onJoinTableAck, this);

        if (this.lm.nimSDK !== undefined) {
            this.lm.nimSDK.eventTarget.on("onNimMsg", this.onNimMsg, this);
        }

        // 加载游戏界面
        this.loader.fguiAddPackage("lobby/fui_lobby_mahjong/lobby_mahjong");
        this.loader.fguiAddPackage("gameb/dafeng");

        const view = fgui.UIPackage.createObject("dafeng", "desk").asCom;
        fgui.GRoot.inst.addChild(view);

        const x = CommonFunction.setViewInCenter(view);

        const bg = view.getChild("blueBg");
        CommonFunction.setBgFullScreenSize(bg);

        // 进入游戏，置为1
        DataStore.setItem(KeyConstants.VOICE_TAG, 1);

        // bg = view.getChild("classBg");
        // CommonFunction.setBgFullScreenSize(bg);

        bg.onClick(
            () => {
                if (this.room !== null && this.room !== undefined) {
                    this.room.onBgClick();
                }
            },
            this);
        // 兼容底部背景
        const diBg = view.getChild('diBg');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        this.view = view;

        this.mAnimationMgr = new AnimationMgr(this.lm.loader);

        this.registerEventCallBack();

        this.checkGpsSetting();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 90s 获取一次位置信息
            this.component.schedule(this.getLocation, 90, cc.macro.REPEAT_FOREVER);
        }

        if (args.jsonString === "replay") {
            const chairID = 0;
            await this.tryEnterReplayRoom(args.record, args.userInfo, chairID);
        } else {
            await this.tryEnterRoom(args.userInfo, args.joinRoomParams, args.createRoomParams);
        }
    }

    public sendBinary(buf: ByteBuffer, code: number): void {
        if (this.lm !== null) {
            this.lm.msgCenter.sendGameMsg(buf, code);
        } else {
            Logger.error("sendBinary");
        }
    }

    //显示领取福利界面
    public showWelfareView(helperCount: number, refresh: number): void {
        const view = this.addComponent(WelfareView);
        view.showView(this.lm, helperCount, refresh);
    }

    //显示转盘界面
    public showLotteryView(): void {
        const view = this.addComponent(LotteryView);
        view.show(this.lm);
    }

    /**
     * 发送语音
     * @param tempFilePath 微信语音文件路径
     */
    public sendVoice(tempFilePath: string): void {
        if (this.lm === undefined || this.lm === null) {
            Logger.debug("sendVoice failed, this.lm === undefined || this.lm === null");

            return;
        }

        if (this.lm.nimSDK === undefined || this.lm.nimSDK === null) {
            Logger.debug("this.lm.nimSDK === undefined || this.lm.nimSDK === null");

            return;
        }

        this.lm.nimSDK.sendTeamAudio(tempFilePath);
    }

    public quit(): void {
        if (this.mq !== undefined && this.mq !== null) {
            this.mq.pushQuit();
        }
    }
    public unblockNormal(): void {
        if (this.mq !== undefined && this.mq !== null) {
            this.mq.unblockNormal();
        }
    }
    public blockNormal(): void {
        if (this.mq !== undefined && this.mq !== null) {
            this.mq.blockNormal();
        }
    }

    public dismissAllTeam(): void {
        if (this.lm.nimSDK !== undefined && this.lm.nimSDK !== null) {
            this.lm.nimSDK.dismissAllTeam(() => {
                Logger.debug("dismissAllTeam done");
            });
        }
    }

    public addMember2Team(imaccids: string[]): void {
        if (this.lm.nimSDK === null) {
            Logger.debug("addMember2Team failed,this.lm.nimSDK === null");

            return;
        }

        this.lm.nimSDK.addMembers(imaccids);
    }

    public createTeam(imaccids: string[], roomNumber: string): void {
        // const imaccid = DataStore.getString(KeyConstants.IM_ACCID);
        // const roomNumber = this.mRoom.roomInfo.tag;
        // const imaccids: string[] = [];
        if (this.lm.nimSDK !== undefined && this.lm.nimSDK !== null) {
            this.lm.nimSDK.createTeam(imaccids, `${roomNumber}`);
        }
    }

    public getServerTime(): number {
        if (this.lm.msgCenter !== null) {
            return this.lm.msgCenter.getServerTime();
        } else {
            Logger.error("getServerTime faild, this.lm.msgCenter === null");

            return Date.now() / 1000;
        }
    }
    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
        this.eventTarget.on("gpsChange", this.onGpsChange, this);
    }

    protected start(): void {
        // nothing to do
    }

    protected onDestroy(): void {
        this.unsubMsg();

        this.unregisterEvent();

        this.eventTarget.emit("destroy");
        this.eventTarget.off("gpsChange");
        this.lm.eventTarget.off("reconnect");
        this.lm.eventTarget.off("onJoinTableAck");

        this.component.unschedule(this.getLocation);

        fgui.GRoot.inst.removeChild(this.view);
        this.view.dispose();

        this.lm.returnFromGame(this.joyRoom !== null);
    }

    protected update(dt: number): void {
        this.timeElapsed += dt;
    }

    private showEvent(): void {
        const data = new Date();
        const returnAppTime = Date.parse(data.toString());
        Logger.debug("showEvent getMilliseconds returnAppTime = ", returnAppTime);

        if (this.eventTarget === undefined) {
            Logger.debug("showEvent this.eventTarget === undefined");
        }

        if (this.node === undefined) {
            Logger.debug("showEvent this.node === undefined");
        }
        this.eventTarget.emit("returnAppTime", returnAppTime);
    }

    private hideEvent(): void {
        const data = new Date();
        const quitAppTime = Date.parse(data.toString());
        Logger.debug("hideEvent getMilliseconds quitAppTime = ", quitAppTime);

        if (this.eventTarget === undefined) {
            Logger.debug("hideEvent this.eventTarget === undefined");
        }

        if (this.node === undefined) {
            Logger.debug("hideEvent this.node === undefined");
        }
        this.eventTarget.emit("quitAppTime", quitAppTime);
    }

    private async tryEnterRoom(
        myUser: UserInfo,
        joinRoomParams: JoinRoomParams, createRoomParams: CreateRoomParams): Promise<void> {

        this.mUser = myUser;
        this.mJoinRoomParams = joinRoomParams;
        this.mCreateRoomParams = createRoomParams;

        let loop = true;
        while (loop) {
            await this.doEnterRoom(this.mUser, this.mJoinRoomParams, this.mCreateRoomParams);
            Logger.debug("doEnterRoom return, retry:", this.retry);

            this.connectErrorCount++;

            if (!this.retry) {
                loop = false;
            } else {
                Logger.debug("retury connectErrorCount:", this.connectErrorCount);
            }
        }

        if (this.mRoom !== null) {
            this.mRoom.onDestroy();
            this.mRoom = null;
        }

        // 退出到大厅
        this.backToLobby();

        Logger.debug("Exit room");
    }

    private backToLobby(): void {
        this.destroy();
    }

    private async doEnterRoom(
        myUser: UserInfo,
        joinRoomParams: JoinRoomParams, createRoomParams: CreateRoomParams): Promise<void> {
        const mq = new MsgQueue(priorityMap);
        this.mq = mq;

        this.subMsg();

        this.lm.msgCenter.unblockNormal();

        this.retry = false;
        let reconnect = false;
        let table: protoHH.casino.Itable = null;

        if (createRoomParams !== undefined && createRoomParams !== null) {
            // 创建房间
            const createRoomAck = await this.waitCreateRoom(createRoomParams);
            if (createRoomAck.ret === protoHH.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
                table = createRoomAck.tdata;
                // 同时创建群组，用来发送语音
                // this.createTeam(`${createRoomAck.tdata.tag}`);
                Logger.debug("create new room");
            } else {
                Logger.error("doEnterRoom, creat room failed:", createRoomAck);
                await this.showEnterRoomError(createRoomAck.ret);
            }
        } else if (joinRoomParams !== undefined && joinRoomParams !== null) {
            table = joinRoomParams.table;
            reconnect = joinRoomParams.reconnect;
        }

        if (table === null) {
            Dialog.hideWaiting();
            Dialog.hideReconnectDialog();

            return;
        }

        Logger.debug("doEnterRoom ------------:", table);

        // 创建房间View
        if (this.mRoom === null || this.mRoom === undefined) {
            this.createRoom(myUser, table);
        } else {
            //判断此房间是否是欢乐场
            this.joyRoom = null;
            for (const r of this.joyRooms) {
                if (r.id === table.room_id) {
                    this.joyRoom = r;
                    break;
                }
            }

            this.mRoom.joyRoom = this.joyRoom;
            this.mRoom.isJoyRoom = this.joyRoom !== null;

            this.mRoom.updateRoom(table);
            reconnect = true;
            Dialog.hideReconnectDialog();
        }

        if (table.status === null) {
            // 显示准备界面 (欢乐场不显示准备界面)
            if (!this.mRoom.isJoyRoom) {
                this.room.updateReadView(table);
                this.room.onReadyButtonClick();
            }
        } else {
            this.room.roomView.showOrHideReadyView(false);
            this.room.showRoomBtnsAndBgs();

            if (reconnect) {
                await this.mRoom.restorePlayerOperation();
                // 重连后弹解散对话框
                if (table.disband_id !== null && table.disband_time !== null) {
                    this.mRoom.showDisbandVoteForRecconect(table.disband_id, table.disband_time);
                }
            }

        }

        await this.pumpMsg();

        // this.backToLobby();

    }

    // 请求创建房间
    private createRoomReq(createRoomParams: CreateRoomParams): void {
        const req = {
            casino_id: createRoomParams.casinoID,
            room_id: createRoomParams.roomID,
            base: createRoomParams.base,
            round: createRoomParams.round,
            join: createRoomParams.allowJoin,
            flag: createRoomParams.flag
        };

        Logger.debug("testCreateRoom, req:", req);
        const req2 = new protoHH.casino.packet_table_create_req(req);
        const buf = protoHH.casino.packet_table_create_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_CREATE_REQ);
    }

    private async waitCreateRoom(createRoomParams: CreateRoomParams): Promise<protoHH.casino.packet_table_create_ack> {
        this.createRoomReq(createRoomParams);

        this.blockNormal();
        const msg = await this.mq.waitMsg();
        this.unblockNormal();
        if (msg.mt === MsgType.wsData) {
            const pmsg = <protoHH.casino.ProxyMessage>msg.data;

            if (pmsg.Ops === protoHH.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK) {

                return protoHH.casino.packet_table_create_ack.decode(pmsg.Data);
            } else {
                Logger.error("Wait msg not create room ack");
            }
        } else {
            Logger.error("expected normal websocket msg, but got:", msg);
        }

        return null;
    }

    // 请求加入房间
    private joinRoomReq(table: protoHH.casino.Itable): void {
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req = new protoHH.casino.packet_table_join_req();
        req.player_id = +playerID;
        // 私有房在准备阶段，用房间号加入房间，在开局后用table_id
        if (this.mRoom.handStartted > 0) {
            req.table_id = table.id;
        } else {
            req.tag = table.tag;
        }

        // 欢乐场只有table_id
        if (this.joyRoom !== null) {
            req.table_id = table.id;
        }

        Logger.debug("req:", req);
        const buf = protoHH.casino.packet_table_join_req.encode(req);

        this.lm.joinRoom(buf);
    }

    private createRoom(
        myUser: UserInfo,
        roomInfo: protoHH.casino.Itable,
        rePlay?: Replay): void {
        //
        this.mRoom = new Room(myUser, roomInfo, this, rePlay);
        this.mRoom.joyRoom = this.joyRoom;
        this.mRoom.isJoyRoom = this.joyRoom !== null;
        this.mRoom.loadRoomView(this.view);

        // 创建玩家
        this.mRoom.createPlayers();
    }

    // private async showRetryMsgBox(msg?: string): Promise<void> {
    //     const msgShow = msg !== undefined ? msg : "连接游戏服务器失败，是否重连？";
    //     const yesno = await Dialog.coShowDialog(msgShow, true, true);

    //     this.retry = yesno;
    // }

    private subMsg(): void {
        // 只有gameModule用到
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK, this.onMsg, this); // 创建房间

        // room 用到
        const keys = Object.keys(msgHandlers);
        for (const key of keys) {
            this.lm.msgCenter.setGameMsgHandler(+key, this.onMsg, this); // 玩家准备
        }
    }

    private unsubMsg(): void {
        // 只有gameModule用到
        this.lm.msgCenter.removeGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK); // 创建房间

        // room 用到的
        const keys = Object.keys(msgHandlers);
        for (const key of keys) {
            this.lm.msgCenter.removeGameMsgHandler(+key); // 玩家准备
        }
    }

    private onMsg(pmsg: protoHH.casino.ProxyMessage): void {
        const msg = new Message(MsgType.wsData, pmsg);
        this.mq.pushMessage(msg);

        // 如果已经解散了，关闭解散框和小结算框，接着弹大结算框
        if (pmsg.Ops === protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND) {
            this.eventTarget.emit("disband");
        }
    }

    private async onNimMsg(msg: NIMMessage): Promise<void> {
        Logger.debug("msg:", msg);

        if (this.mRoom !== null) {
            await this.mRoom.onNimMsg(msg);
        }
    }
    private async showEnterRoomError(code: number): Promise<void> {
        const msg = GameError.getErrorString(code);
        Logger.warn("enter mRoom failed, server return error：", msg);

        return new Promise<void>((resolve, _) => {
            const myYesCB = () => {
                this.backToLobby();

                resolve();
            };

            Dialog.showDialog(msg, myYesCB);
        });
    }

    private async pumpMsg(): Promise<void> {
        let loop = true;
        while (loop) {
            const mq = this.mq;
            const msg = await mq.waitMsg();
            if (msg.mt === MsgType.quit) {
                break;
            }

            if (msg.mt === MsgType.wsData) {
                const data = <protoHH.casino.ProxyMessage>msg.data;

                await this.mRoom.dispatchWebsocketMsg(data);
            } else if (msg.mt === MsgType.wsClosed || msg.mt === MsgType.wsError) {
                Logger.debug(" websocket connection has broken");
                if (this.mRoom.isDestroy) {
                    // 用户主动离开房间，不再做重入
                    Logger.debug(" mRoom has been destroy");
                    break;
                }

                this.retry = true;

                // 网络连接断开，重新登入
                // await this.showRetryMsgBox("与游戏服务器连接断开，是否重连？");
                // this.retry = true;

                // if (this.connectErrorCount > 2) {
                //     await this.showRetryMsgBox();
                // }

                loop = false;
            }
        }
    }

    private async tryEnterReplayRoom(
        record: protoHH.casino.Itable,
        myUser: UserInfo,
        chairID: number): Promise<void> {
        const table = record;
        // // 如果不提供userID,则必须提供chairID，然后根据chairID获得userID
        // let userID = myUser.userID;
        let playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        let isFind = false;
        if (playerID !== undefined && playerID !== null) {
            for (const player of table.players) {
                if (+playerID === player.id) {
                    isFind = true;
                    break;
                }
            }
        }
        if (!isFind) {
            const p = table.players[chairID];
            if (p !== undefined) {
                playerID = `${p.id}`;
            }
        }
        Logger.debug(playerID, " ; table ---------**********--------- :", table);
        this.mUser = { userID: playerID };
        // const roomInfo = {
        //     roomID: "",
        //     roomNumber: msgHandRecord.roomNumber,
        //     config: msgAccLoadReplayRecord.roomJSONConfig,
        //     gameServerID: "",
        //     state: 1,
        //     roomConfigID: msgHandRecord.roomConfigID,
        //     timeStamp: "",
        //     handStartted: msgHandRecord.handNum,
        //     lastActiveTime: 0
        // };

        const replay = new Replay(table.replay);
        // 新建room和绑定roomView
        this.createRoom(this.user, table, replay);

        await replay.gogogo(this.room);

        this.backToLobby();
    }

    private onJoinTableAck(joinTableAck: protoHH.casino.packet_table_join_ack): void {
        Logger.debug("onJoinTableAck ------------------:", joinTableAck);
        // const joinTableAck = protoHH.casino.packet_table_join_ack.decode(pmsg.Data);
        if (joinTableAck.ret === protoHH.casino.eRETURN_TYPE.RETURN_INVALID) {
            Logger.error("onReconnect, join table faild:", joinTableAck.ret);

            Dialog.hideWaiting();
            Dialog.hideReconnectDialog();

            this.lm.msgCenter.unblockNormal();

            // 不在大结算界面和小结算界面，可以直接退出大厅
            this.quit();

            return;
        }

        // 已经在房间里面，需要指定桌子id,重新进入
        if (joinTableAck.ret === protoHH.casino.eRETURN_TYPE.RETURN_FAILED) {
            const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
            const req = new protoHH.casino.packet_table_join_req();
            req.player_id = +playerID;
            req.table_id = this.mRoom.roomInfo.id;

            const buf = protoHH.casino.packet_table_join_req.encode(req);
            this.lm.joinRoom(buf);

            return;
        }

        const joinRoomParams = {
            table: joinTableAck.tdata,
            reconnect: joinTableAck.reconnect
        };

        this.mJoinRoomParams = joinRoomParams;
        this.mCreateRoomParams = null;

        if (this.mq !== undefined && this.mq !== null) {
            const msg = new Message(MsgType.wsClosed);
            this.mq.pushMessage(msg);
        }
    }
    private async onReconnect(isFromShare: boolean): Promise<void> {
        Logger.debug("onReconnect : ", this.mRoom.isGameOver);
        if (this.mRoom.isReplayMode()) {
            return;
        }

        Dialog.showReconnectDialog();

        Logger.debug("this.mRoom.roomInfo:", this.mRoom.roomInfo);
        this.joinRoomReq(this.mRoom.roomInfo);
    }

    private getLocation(): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug("platform not wechat, can't get location");

            return;
        }

        if (!this.isGpsOpen) {
            Logger.debug("gps is close");
            // 如果gps不同步，则同步gps到服务器
            if (this.mRoom !== null && !this.mRoom.isGpsSync()) {
                this.sendLocation2Server(null, null);
            }

            return;
        }

        // 先获取设置，判断是否已经开启位置功能
        wx.getLocation({
            type: 'wgs84',
            success: (res: getLocationRes) => {
                this.sendLocation2Server(res.latitude, res.longitude);
                Logger.debug(`latitude:${res.latitude}, longitude:${res.longitude}, speed:${res.speed}, accuracy:${res.accuracy}`);
            },

            // tslint:disable-next-line:no-any
            fail: (err: any) => {
                Logger.error("getLocation error:", err);
            }

        });

        Logger.debug("getLocation");
    }

    private sendLocation2Server(latitude: number, longitude: number): void {
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req = new protoHH.casino.packet_coordinate({ player_id: +playerID, latitude: latitude, longitude: longitude });
        const buf = protoHH.casino.packet_coordinate.encode(req);
        this.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_COORDINATE);
        // const req2 = new protoHH.casino.packet_table_ready({ idx: -1 });
        // const buf = protoHH.casino.packet_table_ready.encode(req2);
        // this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_READY);
    }

    private onGpsChange(): void {
        this.applyGpsSetting();
        if (this.isGpsOpen) {
            this.getLocation();
        } else {
            this.sendLocation2Server(null, null);
        }
    }

    private applyGpsSetting(): void {
        const gps = DataStore.getString(KeyConstants.GPS, "0");
        if (+ gps > 0) {
            this.isGpsOpen = true;
        } else {
            this.isGpsOpen = false;
        }

        if (this.mRoom !== null) {
            this.mRoom.showOrHideGpsTag(!this.isGpsOpen);
        }
        Logger.debug("gps status:", gps);
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
                }

                this.applyGpsSetting();

                this.getLocation();
            },

            // tslint:disable-next-line:no-any
            fail: (err: any) => {
                Logger.error("getSetting error:", err);
                DataStore.setItem(KeyConstants.GPS, "0");
                this.applyGpsSetting();
            }
        });
    }

    private unregisterEvent(): void {
        cc.game.off(cc.game.EVENT_HIDE, this.hideEvent, this);
        cc.game.off(cc.game.EVENT_SHOW, this.showEvent, this);

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.offAudioInterruptionEnd(this.showEvent);
            wx.offAudioInterruptionBegin(this.hideEvent);
        }
    }

    private registerEventCallBack(): void {
        cc.game.on(cc.game.EVENT_HIDE, this.hideEvent, this);
        cc.game.on(cc.game.EVENT_SHOW, this.showEvent, this);

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            const showHandler = () => {
                this.showEvent();
            };

            const hideHandler = () => {
                this.hideEvent();
            };

            wx.onAudioInterruptionEnd(showHandler);
            wx.onAudioInterruptionBegin(hideHandler);
        }
    }
}
