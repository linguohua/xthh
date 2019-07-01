import {
    AnimationMgr, CreateRoomParams,
    DataStore, Dialog,
    GameModuleInterface, GameModuleLaunchArgs, GResLoader, JoinRoomParams, LobbyModuleInterface,
    Logger, Message, MsgQueue, MsgType, UserInfo
} from "../lobby/lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../lobby/protobufjs/long");
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { GameError } from "./GameError";
import { Replay } from "./Replay";
import { Room } from "./Room";

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
    private connectErrorCount: number;
    // private retry: boolean = false;
    // private forceExit: boolean = false;
    private mRoom: Room;
    private lm: LobbyModuleInterface;
    private mUser: UserInfo;
    private mAnimationMgr: AnimationMgr;

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

        // 加载游戏界面
        this.loader.fguiAddPackage("lobby/fui_lobby_mahjong/lobby_mahjong");
        this.loader.fguiAddPackage("gameb/dafeng");

        const view = fgui.UIPackage.createObject("dafeng", "desk").asCom;
        fgui.GRoot.inst.addChild(view);
        const x = cc.winSize.width / 2 - (cc.winSize.height * 1136 / 640 / 2);
        view.setPosition(x, view.y);
        this.view = view;

        this.mAnimationMgr = new AnimationMgr(this.lm.loader);

        if (args.jsonString === "replay") {
            // TODO: use correct parameters
            const chairID = 0;
            await this.tryEnterReplayRoom(args.userInfo.userID, args.record, chairID);
        } else {
            await this.doEnterRoom(args.userInfo, args.joinRoomParams, args.createRoomParams);
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
        this.eventTarget.emit("destroy");

        fgui.GRoot.inst.removeChild(this.view);
        this.view.dispose();

        this.lm.returnFromGame();
    }

    protected update(dt: number): void {
        this.timeElapsed += dt;
    }

    private backToLobby(): void {
        this.destroy();
    }

    private async doEnterRoom(
        myUser: UserInfo,
        joinRoomParams: JoinRoomParams, createRoomParams: CreateRoomParams): Promise<void> {
        const mq = new MsgQueue(priorityMap);
        this.mq = mq;

        // 订阅消息
        this.subMsg();

        let reconnect = false;
        let table: protoHH.casino.Itable = null;
        if (createRoomParams !== undefined && createRoomParams !== null) {
            // 不存在房间，则创建
            const createRoomAck = await this.waitCreateRoom(createRoomParams);
            if (createRoomAck.ret === protoHH.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
                table = createRoomAck.tdata;
                Logger.debug("create new room");
            } else {
                Logger.error("doEnterRoom, creat room failed:", createRoomAck);

                await this.showEnterRoomError(createRoomAck.ret);
            }
        } else if (joinRoomParams !== undefined && joinRoomParams !== null) {
            // 存在房间，则加入
            const joinRoomAck = await this.waitJoinRoom(joinRoomParams);
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
        }
        //TODO 临时 (创建玩家视图 显示准备按钮)
        this.mRoom.createMyPlayer(table.players[0]);
        for (let i = 1; i < table.players.length; i++) {
            const p = table.players[i];
            if (p !== undefined && p !== null && p.id !== null) {
                this.mRoom.createPlayerByInfo(p, i);
            }
        }
        this.mRoom.showOrHideReadyButton(!reconnect);

        if (reconnect) {
            this.mRoom.setWaitingPlayer(table.cur_idx);
            this.mRoom.setDiscardAble(table.cur_idx); // 如果是轮到我出牌 要让牌可以点击
            //如果到我操作 要显示操作按钮
            if (table.op_id === table.players[0].id) {
                const m = new protoHH.casino_xtsj.packet_sc_op();
                m.card = table.outcard;
                m.player_id = table.op_id;
                m.target_id = table.target_id;
                m.time = table.time;
                m.table_id = table.id;
                const reply = protoHH.casino_xtsj.packet_sc_op.encode(m);

                const msg = new protoHH.casino.ProxyMessage();
                msg.Ops = protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP;
                msg.Data = reply;

                this.onMsg(msg);
            }
        }

        await this.pumpMsg();

        Logger.debug("doEnterRoom leave---");

        this.backToLobby();
    }

    // 请求创建房间
    private testCreateRoom(createRoomParams: CreateRoomParams): void {
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
        this.testCreateRoom(createRoomParams);

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
    private testJoinRoom(joinRoomParams: JoinRoomParams): void {
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
            casino_id: 16,
            room_id: 2103,
            table_id: tableID,
            tag: roomNumberInt
        };

        const req2 = new protoHH.casino.packet_table_join_req(req);
        const buf = protoHH.casino.packet_table_join_req.encode(req2);
        this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
    }

    private async waitJoinRoom(joinRoomParams: JoinRoomParams): Promise<protoHH.casino.packet_table_join_ack> {
        this.testJoinRoom(joinRoomParams);

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
    }

    // private async showRetryMsgBox(msg?: string): Promise<void> {
    //     const msgShow = msg !== undefined ? msg : "连接游戏服务器失败，是否重连？";
    //     const yesno = await Dialog.coShowDialog(msgShow, true, true);

    //     this.retry = yesno;
    // }

    private subMsg(): void {
        // this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onMsg, this); // 加入游戏
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK, this.onMsg, this); // 创建房间
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onMsg, this); // 加入房间

        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_READY, this.onMsg, this); // 玩家准备
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_ENTRY, this.onMsg, this);  // 玩家进入桌子
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_LEAVE, this.onMsg, this);  // 玩家离开桌子
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_PAUSE, this.onMsg, this);  // 桌子操作暂停（就是等待某人动作啥的）
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_UPDATE, this.onMsg, this);  // 桌子更新
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_SCORE, this.onMsg, this);  // 桌子结算
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_MANAGED, this.onMsg, this); // 桌子进入托管

        this.lm.msgCenter.setGameMsgHandler(protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_STARTPLAY, this.onMsg, this); // 发牌
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_DRAWCARD, this.onMsg, this); // 抽牌
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OUTCARD_ACK, this.onMsg, this); // 出牌服务器回复
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP_ACK, this.onMsg, this); // 玩家操作结果
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP, this.onMsg, this); // 等待玩家操作
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_SCORE, this.onMsg, this); // 积分状态

        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_ACK, this.onMsg, this); // 解散吧
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND, this.onMsg, this); // 解散吧
        this.lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ, this.onMsg, this); // 解散吧
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

                // 网络连接断开，重新登入
                // await this.showRetryMsgBox("与游戏服务器连接断开，是否重连？");
                // this.retry = true;

                if (this.connectErrorCount > 2) {
                    // await this.showRetryMsgBox();
                }

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
}
