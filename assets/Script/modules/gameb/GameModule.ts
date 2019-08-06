import { NIMMessage, NimSDK } from "../lobby/chanelSdk/nimSdk/NimSDKExports";
import { GameError } from "../lobby/errorCode/ErrorCodeExports";
import {
    AnimationMgr, CommonFunction,
    CreateRoomParams, DataStore,
    Dialog, GameModuleInterface, GameModuleLaunchArgs, GResLoader, JoinRoomParams,
    LobbyModuleInterface, Logger, Message, MsgQueue, MsgType, UserInfo
} from "../lobby/lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../lobby/protobufjs/long");
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { Replay } from "./Replay";
import { msgHandlers, Room } from "./Room";
// import { roomStatus } from "./RoomInterface";

// const mc = proto.mahjong.MessageCode;
// const priorityMap: { [key: number]: number } = {
//     [mc.OPDisbandRequest]: 1, [mc.OPDisbandNotify]: 1, [mc.OPDisbandAnswer]: 1
// };
// 添加需要优先级管理的消息码
const mc = protoHH.casino.eMSG_TYPE;
const priorityMap: { [key: number]: number } = { [mc.MSG_TABLE_CREATE_ACK]: 1, [mc.MSG_TABLE_JOIN_ACK]: 1 };

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

    public getLobbyModuleLoader(): GResLoader {
        return this.lm.loader;
    }

    public getNimSDK(): NimSDK {
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
        // 尝试进入房间
        this.lm = args.lm;
        this.loader = args.loader;

        this.lm.eventTarget.on("reconnect", this.onReconnect, this);

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

        // bg = view.getChild("classBg");
        // CommonFunction.setBgFullScreenSize(bg);

        bg.onClick(() => { this.room.onBgClick(); }, this);
        // 兼容底部背景
        const diBg = view.getChild('diBg');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        this.view = view;

        this.mAnimationMgr = new AnimationMgr(this.lm.loader);

        this.checkGpsSetting();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.component.schedule(this.getLocation, 1 * 60, cc.macro.REPEAT_FOREVER);
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
        this.lm.nimSDK.dismissAllTeam(() => {
            Logger.debug("dismissAllTeam done");
        });
    }

    public addMember2Team(imaccids: string[]): void {
        if (this.lm.nimSDK === null) {
            Logger.debug("addMember2Team failed,this.lm.nimSDK === null");

            return;
        }

        this.lm.nimSDK.addMembers(imaccids);
    }

    public createTeam(imaccids: string[], roomNumber: string): void {
        // const imaccid = DataStore.getString("imaccid");
        // const roomNumber = this.mRoom.roomInfo.tag;
        // const imaccids: string[] = [];
        this.lm.nimSDK.createTeam(imaccids, `${roomNumber}`);
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

        this.eventTarget.emit("destroy");
        this.eventTarget.off("gpsChange");
        this.lm.eventTarget.off("reconnect");

        this.component.unschedule(this.getLocation);

        fgui.GRoot.inst.removeChild(this.view);
        this.view.dispose();

        this.lm.returnFromGame();
    }

    protected update(dt: number): void {
        this.timeElapsed += dt;
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
            this.mRoom.updateRoom(table);
            reconnect = true;
            Dialog.hideReconnectDialog();
        }

        // this.mRoom.showOrHideReadyButton(!reconnect);
        if (table.status === null) {
            // 显示准备界面
            this.room.updateReadView(table);
            this.room.onReadyButtonClick();
        } else {
            this.room.showRoomBtnsAndBgs();
        }

        if (reconnect) {
            this.mRoom.restrorePlayerOperation();
            // 重连后弹解散对话框
            if (table.disband_id !== null && table.disband_time !== null) {
                this.mRoom.showDisbandVoteForRecconect(table.disband_id, table.disband_time);
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
            join: createRoomParams.allowJoin
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
    private joinRoomReq(tableID: long): void {
        const playerID = DataStore.getString("playerID");
        const req = {
            player_id: +playerID,
            table_id: tableID
        };

        const req2 = new protoHH.casino.packet_table_join_req(req);
        const buf = protoHH.casino.packet_table_join_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
    }

    private createRoom(
        myUser: UserInfo,
        roomInfo: protoHH.casino.Itable,
        rePlay?: Replay): void {
        //
        this.mRoom = new Room(myUser, roomInfo, this, rePlay);
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
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onJoinTable, this); // 加入房间

        // room 用到
        const keys = Object.keys(msgHandlers);
        for (const key of keys) {
            this.lm.msgCenter.setGameMsgHandler(+key, this.onMsg, this); // 玩家准备
        }
    }

    private unsubMsg(): void {
        // 只有gameModule用到
        this.lm.msgCenter.removeGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK); // 创建房间
        this.lm.msgCenter.removeGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK); // 加入房间

        // room 用到的
        const keys = Object.keys(msgHandlers);
        for (const key of keys) {
            this.lm.msgCenter.removeGameMsgHandler(+key); // 玩家准备
        }
    }

    private onMsg(pmsg: protoHH.casino.ProxyMessage): void {
        const msg = new Message(MsgType.wsData, pmsg);
        this.mq.pushMessage(msg);
    }

    private onNimMsg(msg: NIMMessage): void {
        Logger.debug("msg:", msg);

        if (this.mRoom !== null) {
            this.mRoom.onNimMsg(msg);
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
        msgAccLoadReplayRecord: { replayRecordBytes: ByteBuffer; roomJSONConfig: string },
        myUser: UserInfo,
        chairID: number): Promise<void> {
        const table = protoHH.casino.table.decode(msgAccLoadReplayRecord.replayRecordBytes);
        // const msgHandRecord = proto.mahjong.SRMsgHandRecorder.decode(msgAccLoadReplayRecord.replayRecordBytes);
        // msgHandRecord.roomConfigID = msgAccLoadReplayRecord.roomJSONConfig;

        // Logger.debug(" sr-actions count:", msgHandRecord.actions.length);
        // // 如果不提供userID,则必须提供chairID，然后根据chairID获得userID
        let userID = myUser.userID;
        if (userID === null) {
            Logger.debug(" userID is nil, use chairID to find userID");
            const p = table.players[chairID];
            if (p !== undefined) {
                userID = `${p.id}`;
            }
        }

        if (userID === null || userID === undefined) {
            Dialog.prompt("您输入的回放码不存在,或录像已过期!");

            return;
        }

        Logger.debug("table ---------**********--------- :", table);
        this.mUser = { userID: userID };
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

    private onJoinTable(pmsg: protoHH.casino.ProxyMessage): void {
        const joinTableAck = protoHH.casino.packet_table_join_ack.decode(pmsg.Data);
        if (joinTableAck.ret !== 0) {
            Logger.error("onReconnect, join table faild:", joinTableAck.ret);
            this.quit();

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
    private async onReconnect(): Promise<void> {
        Logger.debug("onReconnect");
        if (this.mRoom.isGameOver) {
            return;
        }

        Dialog.showReconnectDialog();

        this.joinRoomReq(this.mRoom.roomInfo.id);
    }

    private getLocation(): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug("platform not wechat, can't get location");

            return;
        }

        if (!this.isGpsOpen) {
            Logger.debug("gps is close");

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
        const playerID = DataStore.getString("playerID");
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
        const gps = DataStore.getString("gps", "0");
        if (+ gps > 0) {
            this.isGpsOpen = true;
        } else {
            this.isGpsOpen = false;
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
                if (!res.authSetting['scope.userLocation']) {
                    DataStore.setItem("gps", "0");
                }

                this.applyGpsSetting();

                this.getLocation();
            },

            // tslint:disable-next-line:no-any
            fail: (err: any) => {
                Logger.error("getSetting error:", err);
                DataStore.setItem("gps", "0");
                this.applyGpsSetting();
            }
        });
    }

    // private createTeam(roomNumber: string): void {
    //     // const imaccid = DataStore.getString("imaccid");
    //     const imaccids: string[] = [];
    //     this.lm.nimSDK.createTeam(imaccids, `${roomNumber}`);
    // }
}
