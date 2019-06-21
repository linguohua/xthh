import {
    AnimationMgr, DataStore, Dialog, GameModuleInterface,
    GameModuleLaunchArgs, GResLoader, LEnv,
    LobbyModuleInterface, Logger, MsgQueue, MsgType, RoomInfo, UserInfo, WS
} from "../lobby/lcore/LCoreExports";
import { proto } from "./proto/protoGame";
import { Replay } from "./Replay";
import { Room } from "./Room";

const mc = proto.mahjong.MessageCode;
const priorityMap: { [key: number]: number } = {
    [mc.OPDisbandRequest]: 1, [mc.OPDisbandNotify]: 1, [mc.OPDisbandAnswer]: 1
};

/**
 * 子游戏入口
 */
export class GameModule extends cc.Component implements GameModuleInterface {
    public eventTarget: cc.EventTarget;

    public loader: GResLoader;

    public timeElapsed: number = 0;

    private view: fgui.GComponent;

    private ws: WS;
    private mq: MsgQueue;
    private connectErrorCount: number;
    private retry: boolean = false;
    private forceExit: boolean = false;
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
            await this.tryEnterRoom(args.userInfo, args.roomInfo);
        }
    }

    public sendBinary(buf: ByteBuffer): void {
        this.ws.ww.send(buf.toArrayBuffer());
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

    private async tryEnterRoom(
        myUser: UserInfo,
        roomInfo: RoomInfo): Promise<void> {

        // 测试用
        const host = LEnv.gameHost;
        const tk = DataStore.getString("token", "");
        let url;
        const rID = roomInfo.roomID;
        const uID = myUser.userID;

        let path;
        if (roomInfo.roomID === "monkey-room") {
            path = LEnv.cfmt(LEnv.gameWebsocketMonkey, roomInfo.gameServerID);
        } else {
            path = LEnv.cfmt(LEnv.gameWebsocketPlay, roomInfo.gameServerID);
        }

        url = `${host}${path}?userID=${uID}&roomID=${rID}&tk=${tk}&web=1`;

        Logger.debug("tryEnterRoom, url:", url);

        // 保存一下，以便重连时使用
        // this.url = url;
        this.mUser = myUser;
        this.ws = null;
        this.mRoom = null;
        this.connectErrorCount = 0;

        let loop = true;
        while (loop) {
            await this.doEnterRoom(url, myUser, roomInfo);
            Logger.debug("doEnterRoom return, retry:", this.retry, ", forceExit:", this.forceExit);

            this.connectErrorCount++;
            if (this.ws !== null) {
                const ws = this.ws;
                this.ws = null;
                ws.ww.close();
            }

            if (!this.retry || this.forceExit) {
                loop = false;
            }
        }

        if (this.mRoom !== null) {
            this.mRoom = null;
        }

        // 退出到大厅
        this.backToLobby();
    }

    private backToLobby(): void {
        this.destroy();
    }

    private async doEnterRoom(
        url: string,
        myUser: UserInfo,
        roomInfo: RoomInfo): Promise<void> {
        //
        Logger.debug("doEnterRoom enter---");
        // 每次进入本函数时都重置retry为false
        // 如果发生断线重连且用户选择了重连那么后面的代码
        // 会置retry为true
        this.retry = false;

        // this.room可能不为null，因为如果断线重入，room以及roomview就可能已经加载
        if (this.mRoom === null) {
            this.createRoom(myUser, roomInfo);
        }

        // 显示登录房间等待进度框
        // 显示于界面的等待信息
        const showProgressTips = "正在进入房间";

        // host 结构
        const host = {
            comp: this,
            destroyListener: this.eventTarget,
            startPing: true,
            pingFrequency: 3, // 3秒
            pingPacketProvider: (pingData: ByteBuffer) => {
                const msg = {
                    Ops: proto.mahjong.MessageCode.OPPing,
                    Data: pingData
                };

                return proto.mahjong.GameMessage.encode(msg).toArrayBuffer();
            }
        };
        // ping pong 结构
        const pp = {
            pingCmd: mc.OPPing,
            pongCmd: mc.OPPong,
            decode: proto.mahjong.GameMessage.decode,
            encode: proto.mahjong.GameMessage.encode
        };

        const mq = new MsgQueue(priorityMap);
        const ws = new WS(url, mq, host, pp);
        this.mq = mq;
        this.ws = ws;

        const rt = await this.waitConnect(showProgressTips);
        let enterRoomReplyMsg;
        let enterRoomResult;
        if (rt !== 0) {
            this.retry = true;
            if (this.connectErrorCount > 0) {
                await this.showRetryMsgBox();
            }

            return;
        } else {
            Logger.debug("waitWebsocketMessage wait mRoom reply");
            enterRoomReplyMsg = await this.waitWebsocketMessage(showProgressTips);
        }

        if (enterRoomReplyMsg === null) {
            // 连接超时提示和处理（用户选择是否重连，重连的话下一帧重新执行tryEnterRoom）
            Logger.debug(" waitWebsocketMessage return nil");
            this.retry = true;
            if (this.connectErrorCount > 0) {
                await this.showRetryMsgBox();
            }

            return;
        }

        enterRoomResult = proto.mahjong.MsgEnterRoomResult.decode(enterRoomReplyMsg.Data);
        Logger.debug(" server reply enter mRoom status:", enterRoomResult.status);
        if (enterRoomResult.status !== 0) {
            // 进入房间错误提示
            Logger.debug(" server return enter mRoom ~= 0");
            //  进入房间错误清除保留的房间信息
            DataStore.setItem("RoomInfoData", "");
            await this.showEnterRoomError(enterRoomResult.status);

            return;
        }

        //  进入房间错误清除保留的房间信息
        DataStore.setItem("RoomInfoData", "");
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

    private async waitConnect(showProgressTips: string): Promise<number> {
        Logger.debug("Game.waitConnect, ", showProgressTips);

        const msg = await this.mq.waitMsg();

        Logger.debug("Game.waitConnect, mq.waitMsg return:", msg);

        if (msg.mt === MsgType.wsOpen) {
            return 0;
        }

        return -1;
    }

    private async showRetryMsgBox(msg?: string): Promise<void> {
        const msgShow = msg !== undefined ? msg : "连接游戏服务器失败，是否重连？";
        const yesno = await Dialog.coShowDialog(msgShow, true, true);

        this.retry = yesno;
    }

    private async showEnterRoomError(code: number): Promise<void> {
        const msg = this.getEnterRoomErrorCode(code);
        Logger.warn("enter mRoom failed, server return error：", msg);
        await Dialog.coShowDialog(msg, true, false);
    }

    private getEnterRoomErrorCode(code: number): string {
        const mahjong = proto.mahjong.EnterRoomStatus;
        const enterRoomErrorMap: { [key: number]: string } = {
            [mahjong.RoomNotExist]: "房间不存在",
            [mahjong.RoomIsFulled]: "你输入的房间已满，无法加入",
            [mahjong.RoomPlaying]: "房间正在游戏中",
            [mahjong.InAnotherRoom]: "您已经再另一个房间",
            [mahjong.MonkeyRoomUserIDNotMatch]: "测试房间userID不匹配",
            [mahjong.MonkeyRoomUserLoginSeqNotMatch]: "测试房间进入顺序不匹配",
            [mahjong.AppModuleNeedUpgrade]: "您的APP版本过老，请升级到最新版本",
            [mahjong.InRoomBlackList]: "您被房主踢出房间，10分钟内无法再次加入此房间",
            [mahjong.TakeoffDiamondFailedNotEnough]: "您的钻石不足，不能进入房间，请充值",
            [mahjong.TakeoffDiamondFailedIO]: "抱歉，系统扣除钻石失败，不能进入房间",
            [mahjong.RoomInApplicateDisband]: "房间正在解散"
        };

        return enterRoomErrorMap[code] !== undefined ? enterRoomErrorMap[code] : "未知错误";
    }

    private async waitWebsocketMessage(showProgressTips: string): Promise<proto.mahjong.GameMessage> {
        Logger.debug("SG:waitWebsocketMessage, ", showProgressTips);
        const msg = await this.mq.waitMsg();
        if (msg.mt === MsgType.wsData) {
            return <proto.mahjong.GameMessage>msg.data;
        } else {
            Logger.error("expected normal websocket msg, but got:", msg);
        }

        return null;
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

                const data = <proto.mahjong.GameMessage>msg.data;
                if (data.Ops === proto.mahjong.MessageCode.OPPlayerLeaveRoom) {

                    if (data.Data !== undefined && data.Data !== null) {
                        const leaveReplyMsg = proto.mahjong.MsgEnterRoomResult.decode(data.Data);
                        Logger.debug("用户主动离开房间--------------- leaveReplyMsg = ", leaveReplyMsg);
                        if (leaveReplyMsg.status !== undefined && leaveReplyMsg.status !== null
                            && leaveReplyMsg.status !== 0) {
                            Logger.debug("游戏已经开始或者房间正在申请解散，不能退出");
                        }
                    } else {
                        loop = false;
                        break;
                    }
                }

                await this.mRoom.dispatchWebsocketMsg(<proto.mahjong.GameMessage>msg.data);
            } else if (msg.mt === MsgType.wsClosed || msg.mt === MsgType.wsError) {
                Logger.debug(" websocket connection has broken");
                if (this.mRoom.isDestroy) {
                    // 用户主动离开房间，不再做重入
                    Logger.debug(" mRoom has been destroy");
                    break;
                }

                // 网络连接断开，重新登入
                await this.showRetryMsgBox("与游戏服务器连接断开，是否重连？");
                this.retry = true;

                if (this.connectErrorCount > 2) {
                    await this.showRetryMsgBox();
                }

                loop = false;
            }
        }
    }

    private async tryEnterReplayRoom(
        myUserID: string,
        msgAccLoadReplayRecord: { replayRecordBytes: ByteBuffer; roomJSONConfig: string },
        chairID: number): Promise<void> {

        const msgHandRecord = proto.mahjong.SRMsgHandRecorder.decode(msgAccLoadReplayRecord.replayRecordBytes);
        msgHandRecord.roomConfigID = msgAccLoadReplayRecord.roomJSONConfig;

        Logger.debug(" sr-actions count:", msgHandRecord.actions.length);
        // 如果不提供userID,则必须提供chairID，然后根据chairID获得userID
        let userID = myUserID;
        if (userID === null) {
            Logger.debug(" userID is nil, use chairID to find userID");
            msgHandRecord.players.forEach((p) => {
                if (p.chairID === chairID) {
                    userID = p.userID;
                }
            });
        }

        if (userID === null || userID === undefined) {
            Dialog.prompt("您输入的回放码不存在,或录像已过期!");
        }

        Logger.debug(" tryEnterReplayRoom userID:", userID);
        this.mUser = { userID: userID };
        const roomInfo = {
            roomID: "",
            roomNumber: msgHandRecord.roomNumber,
            config: msgAccLoadReplayRecord.roomJSONConfig,
            gameServerID: "",
            state: 1,
            roomConfigID: msgHandRecord.roomConfigID,
            timeStamp: "",
            handStartted: msgHandRecord.handNum,
            lastActiveTime: 0
        };

        const replay = new Replay(msgHandRecord);
        // 新建room和绑定roomView
        this.createRoom(this.user, roomInfo, replay);

        await replay.gogogo(this.room);

        this.backToLobby();
    }
}
