import { proto as protoHH } from "../protoHH/protoHH";

/**
 * 一些公用数据类型
 */

export class Record {
    public replayRecordBytes: ByteBuffer;
    public roomJSONConfig: string;

}

/**
 * 当前用户信息
 */
export class UserInfo {
    public userID: string;
}

/**
 * 房间信息
 */
export class RoomInfo {
    public roomID: string;
    public roomNumber: string;

    public gameServerID: string;
    public state?: number;
    public config?: string;
    public timeStamp?: string;
    public handStartted?: number;
    public lastActiveTime?: number;
    public propCfg?: string;
    public moduleCfg?: string;
}

export interface GResLoader {
    fguiAddPackage(packageName: string): void;
    loadResDir(dir: string, onCompleted: (error: Error) => void): void;
    loadPrefab(prefabName: string, onCompleted: (error: Error, res: cc.Prefab) => void): void;
}

// type GameMsgHandler = (msg: protoHH.casino.ProxyMessage) => void;
export interface MsgCenter {
    eventTarget: cc.EventTarget;
    sendGameMsg(buf: ByteBuffer, code: number): void;
    setGameMsgHandler(code: number, h: (msg: protoHH.casino.ProxyMessage) => void, target: object): void;

    removeGameMsgHandler(code: number): void;

    getServerTime(): number;

    closeWebsocket(): void;
    unblockNormal(): void;
    blockNormal(): void;
    logout(): void;
}

export interface NimSDKInterface {
    eventTarget: cc.EventTarget;
    initNimSDK(): void;
    close(): void;
    createTeam(imaccids: string[], roomNumber: string): void;
    sendTeamMsg(msgContent: string): void;
    sendTeamAudio(wxFilePath: string): void;
    sendFile(wxFilePath: string): void;
    addMembers(members: string[]): void;
    dismissAllTeam(onDone: Function): void;
}
/**
 * 大厅模块
 */
export interface LobbyModuleInterface {
    loader: GResLoader;
    eventTarget: cc.EventTarget;
    msgCenter: MsgCenter;
    nimSDK: NimSDKInterface;
    returnFromGame(isFromJoyRoom: boolean): void;
    switchToGame(args: GameModuleLaunchArgs, moduleName: string): void;
    enterGame(joinRoomParams: JoinRoomParams, creatRoomParams: CreateRoomParams): void;
    joinRoom(reqBuf: ByteBuffer): void;
    requestJoinRoom(table: protoHH.casino.Itable, reconnect: boolean): void;
    sendGameMsg(buf: ByteBuffer, code: number): void;
    setGameMsgHandler(code: number, h: (msg: protoHH.casino.ProxyMessage) => void, target: object): void;
    isGameModuleExist(): boolean;
    logout(): void;
}

export interface CreateRoomParams {
    // 对应packet_table_create_req中casino_id
    casinoID: number;
    // 对应packet_table_create_req中的room_id
    roomID: number;
    // 对应packet_table_create_req中的base
    base: number;
    // 对应packet_table_create_req中的round
    round: number;
    // 对应packet_table_create_req中的join
    allowJoin: number;
    // 对应packet_table_create_req中的join
    flag: number;
}

export interface JoinRoomParams {
    table: protoHH.casino.Itable;
    reconnect: boolean;
}

/**
 * 游戏启动参数
 */
export interface GameModuleLaunchArgs {
    userInfo: UserInfo;
    joinRoomParams: JoinRoomParams;
    createRoomParams: CreateRoomParams;
    jsonString: string;
    loader?: GResLoader;
    lm?: LobbyModuleInterface;

    record: protoHH.casino.Itable;
    roomId?: number;
}

/**
 * 游戏模块
 */
export interface GameModuleInterface extends cc.Component {
    resLoader: GResLoader;
    launch(args: GameModuleLaunchArgs): void;
}

export enum NewRoomViewPath {
    Normal = 0,
    Form_Club,
    Form_Club_Setting
}
