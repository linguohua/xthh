import {
    AnimationMgr, CommonFunction,
    CreateRoomParams, DataStore,
    Dialog, GameModuleInterface, GameModuleLaunchArgs, GResLoader, JoinRoomParams,
    KeyConstants, LobbyModuleInterface, Logger, Message, MsgQueue, MsgType, UserInfo
} from "../lobby/lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../lobby/protobufjs/long");
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { GameError } from "./GameError";
import { Replay } from "./Replay";
import { msgHandlers, Room } from "./Room";

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

    public getLobbyModuleLoader(): GResLoader {
        return this.lm.loader;
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

        // 加载游戏界面
        this.loader.fguiAddPackage("lobby/fui_lobby_mahjong/lobby_mahjong");
        this.loader.fguiAddPackage("gameb/dafeng");

        const view = fgui.UIPackage.createObject("dafeng", "desk").asCom;
        fgui.GRoot.inst.addChild(view);

        let x = CommonFunction.setBaseViewInCenter(view);
        const newIPhone = DataStore.getString(KeyConstants.ADAPTIVE_PHONE_KEY);
        if (newIPhone === "1") {
            // i phone x 的黑边为  CommonFunction.IOS_ADAPTER_WIDTH
            x = x - CommonFunction.IOS_ADAPTER_WIDTH;
        }
        let bg = view.getChild("blueBg");

        CommonFunction.setBgFullScreenSize(bg);
        bg = view.getChild("classBg");
        CommonFunction.setBgFullScreenSize(bg);

        // 兼容底部背景
        const diBg = view.getChild('diBg');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        this.view = view;

        this.mAnimationMgr = new AnimationMgr(this.lm.loader);

        if (args.jsonString === "replay") {
            // TODO: use correct parameters
            const chairID = 0;
            await this.tryEnterReplayRoom(args.userInfo.userID, args.record, chairID);
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

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
    }

    protected start(): void {
        // nothing to do
    }

    protected onDestroy(): void {
        this.unsubMsg();

        this.eventTarget.emit("destroy");

        fgui.GRoot.inst.removeChild(this.view);
        this.view.dispose();

        this.lm.eventTarget.off("reconnect", this.onReconnect, this);
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
                Logger.debug("create new room");
            } else {
                Logger.error("doEnterRoom, creat room failed:", createRoomAck);
                await this.showEnterRoomError(createRoomAck.ret);
            }
        } else if (joinRoomParams !== undefined && joinRoomParams !== null) {
            // 加入房间
            const joinRoomAck = await this.waitJoinRoom(joinRoomParams);
            //如果当前轮到别人出牌。。。joinRoomAck 先不写。。。 不知道怎么写
            if (joinRoomAck.ret === protoHH.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
                table = joinRoomAck.tdata;
                reconnect = joinRoomAck.reconnect;

                DataStore.setItem("tableID", "");

                Logger.debug("re-enter room");
            } else {
                Logger.error("doEnterRoom, join room failed:", joinRoomAck);

                await this.showEnterRoomError(joinRoomAck.ret);
            }
        }

        if (table === null) {
            return;
        }

        Logger.debug("doEnterRoom ------------:", table);

        // 创建房间View
        if (this.mRoom === null || this.mRoom === undefined) {
            this.createRoom(myUser, table);
        } else {
            this.mRoom.updateRoom(table);
            reconnect = true;
            Dialog.hideWaiting();
        }

        this.mRoom.showOrHideReadyButton(!reconnect);

        if (reconnect) {
            this.mRoom.restrorePlayerOperation();
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
    private joinRoomReq(joinRoomParams: JoinRoomParams): void {
        let tableID = long.ZERO;
        if (joinRoomParams.tableID !== undefined && joinRoomParams.tableID !== "") {
            tableID = long.fromString(joinRoomParams.tableID, true);
        }

        let roomNumberInt: number = 0;
        if (joinRoomParams.roomNumber !== undefined && joinRoomParams.roomNumber !== "") {
            roomNumberInt = parseInt(joinRoomParams.roomNumber, 10);
        }

        const playerID = DataStore.getString("playerID");
        const req = {
            player_id: +playerID,
            table_id: tableID,
            tag: roomNumberInt
        };

        const req2 = new protoHH.casino.packet_table_join_req(req);
        const buf = protoHH.casino.packet_table_join_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
    }

    private async waitJoinRoom(joinRoomParams: JoinRoomParams): Promise<protoHH.casino.packet_table_join_ack> {
        this.joinRoomReq(joinRoomParams);

        this.blockNormal();
        const msg = await this.mq.waitMsg();
        this.unblockNormal();
        if (msg.mt === MsgType.wsData) {
            const pmsg = <protoHH.casino.ProxyMessage>msg.data;

            if (pmsg.Ops === protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK) {

                return protoHH.casino.packet_table_join_ack.decode(pmsg.Data);
            } else {
                Logger.error("Wait msg not join room ack");
            }
        } else {
            Logger.error("expected normal websocket msg, but got:", msg);
        }

        return null;
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
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onMsg, this); // 加入房间

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
        myUserID: string,
        msgAccLoadReplayRecord: { replayRecordBytes: ByteBuffer; roomJSONConfig: string },
        chairID: number): Promise<void> {

        // const msgHandRecord = proto.mahjong.SRMsgHandRecorder.decode(msgAccLoadReplayRecord.replayRecordBytes);
        // msgHandRecord.roomConfigID = msgAccLoadReplayRecord.roomJSONConfig;

        // Logger.debug(" sr-actions count:", msgHandRecord.actions.length);
        // // 如果不提供userID,则必须提供chairID，然后根据chairID获得userID
        // let userID = myUserID;
        // if (userID === null) {
        //     Logger.debug(" userID is nil, use chairID to find userID");
        //     msgHandRecord.players.forEach((p) => {
        //         if (p.chairID === chairID) {
        //             userID = p.userID;
        //         }
        //     });
        // }

        // if (userID === null || userID === undefined) {
        //     Dialog.prompt("您输入的回放码不存在,或录像已过期!");
        // }

        // Logger.debug(" tryEnterReplayRoom userID:", userID);
        // this.mUser = { userID: userID };
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

        // const replay = new Replay(msgHandRecord);
        // // 新建room和绑定roomView
        // this.createRoom(this.user, roomInfo, replay);

        // await replay.gogogo(this.room);

        this.backToLobby();
    }

    private async onReconnect(): Promise<void> {
        Logger.debug("onReconnect");
        // const playerID = DataStore.getString("playerID");

        // const myUser = { userID: `${playerID}` };
        Dialog.showWaiting();

        const joinRoomParams = {
            tableID: `${this.mRoom.roomInfo.id}`
        };

        this.mJoinRoomParams = joinRoomParams;
        this.mCreateRoomParams = null;
        // await this.doEnterRoom(myUser, joinRoomParams, null);

        if (this.mq !== undefined && this.mq !== null) {
            const msg = new Message(MsgType.wsClosed);
            this.mq.pushMessage(msg);
        }

    }
}
