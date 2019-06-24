import {
    AnimationMgr, GameModuleInterface,
    GameModuleLaunchArgs, GResLoader,
    LobbyModuleInterface, Logger, Message, MsgQueue, MsgType, RoomInfo, UserInfo
} from "../lobby/lcore/LCoreExports";
import { proto } from "../lobby/protoHH/protoHH";
import { Replay } from "./Replay";
import { Room } from "./Room";

// const mc = proto.mahjong.MessageCode;
// const priorityMap: { [key: number]: number } = {
//     [mc.OPDisbandRequest]: 1, [mc.OPDisbandNotify]: 1, [mc.OPDisbandAnswer]: 1
// };
// 添加需要优先级管理的消息码
const priorityMap: { [key: number]: number } = {};

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
            await this.doEnterRoom(args.userInfo, args.roomInfo);
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
        roomInfo: RoomInfo): Promise<void> {
        //
        Logger.debug("doEnterRoom enter---");
        // 每次进入本函数时都重置retry为false

        // this.room可能不为null，因为如果断线重入，room以及roomview就可能已经加载
        if (this.mRoom === null || this.mRoom === undefined) {
            this.createRoom(myUser, roomInfo);
        }

        // 显示登录房间等待进度框
        // 显示于界面的等待信息
        // const showProgressTips = "正在进入房间";

        const mq = new MsgQueue(priorityMap);
        this.mq = mq;

        // 1. 订阅消息
        this.subMsg();

        // 2. 等待房间消息

        await this.pumpMsg();
        Logger.debug("doEnterRoom leave---");
    }

    private createRoom(
        myUser: UserInfo,
        roomInfo: RoomInfo,
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
        // this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK, this.onMsg, this); // 创建房间

        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_READY, this.onMsg, this); // 玩家准备
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_ENTRY, this.onMsg, this);  // 玩家进入桌子
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_LEAVE, this.onMsg, this);  // 玩家离开桌子
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_PAUSE, this.onMsg, this);  // 桌子操作暂停（就是等待某人动作啥的）
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_UPDATE, this.onMsg, this);  // 桌子更新
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_SCORE, this.onMsg, this);  // 桌子结算
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_MANAGED, this.onMsg, this); // 桌子进入托管

        this.lm.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_STARTPLAY, this.onMsg, this); // 发牌
        this.lm.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_DRAWCARD, this.onMsg, this); // 抽牌
        this.lm.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OUTCARD_ACK, this.onMsg, this); // 出牌服务器回复
        this.lm.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP_ACK, this.onMsg, this); // 玩家操作结果
        this.lm.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_SCORE, this.onMsg, this); // 积分状态
    }

    private onMsg(pmsg: proto.casino.ProxyMessage): void {
        const msg = new Message(MsgType.wsData, pmsg);
        this.mq.pushMessage(msg);
    }

    // private async showEnterRoomError(code: number): Promise<void> {
    //     const msg = this.getEnterRoomErrorCode(code);
    //     Logger.warn("enter mRoom failed, server return error：", msg);
    //     await Dialog.coShowDialog(msg, true, false);
    // }

    // private getEnterRoomErrorCode(code: number): string {
    //     const mahjong = proto.mahjong.EnterRoomStatus;
    //     const enterRoomErrorMap: { [key: number]: string } = {
    //         [mahjong.RoomNotExist]: "房间不存在",
    //         [mahjong.RoomIsFulled]: "你输入的房间已满，无法加入",
    //         [mahjong.RoomPlaying]: "房间正在游戏中",
    //         [mahjong.InAnotherRoom]: "您已经再另一个房间",
    //         [mahjong.MonkeyRoomUserIDNotMatch]: "测试房间userID不匹配",
    //         [mahjong.MonkeyRoomUserLoginSeqNotMatch]: "测试房间进入顺序不匹配",
    //         [mahjong.AppModuleNeedUpgrade]: "您的APP版本过老，请升级到最新版本",
    //         [mahjong.InRoomBlackList]: "您被房主踢出房间，10分钟内无法再次加入此房间",
    //         [mahjong.TakeoffDiamondFailedNotEnough]: "您的钻石不足，不能进入房间，请充值",
    //         [mahjong.TakeoffDiamondFailedIO]: "抱歉，系统扣除钻石失败，不能进入房间",
    //         [mahjong.RoomInApplicateDisband]: "房间正在解散"
    //     };

    //     return enterRoomErrorMap[code] !== undefined ? enterRoomErrorMap[code] : "未知错误";
    // }

    // private subMsg(): void {

    // }

    private async pumpMsg(): Promise<void> {
        let loop = true;
        while (loop) {
            const mq = this.mq;
            const msg = await mq.waitMsg();
            if (msg.mt === MsgType.quit) {
                break;
            }

            if (msg.mt === MsgType.wsData) {
                const data = <proto.casino.ProxyMessage>msg.data;

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
