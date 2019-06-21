import { proto } from "../proto/protoLobby";

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

/**
 * 大厅模块
 */
export interface LobbyModuleInterface {
    loader: GResLoader;
    eventTarget: cc.EventTarget;
    returnFromGame(): void;
    switchToGame(args: GameModuleLaunchArgs, moduleName: string): void;
    enterGame(roomInfo: proto.lobby.IRoomInfo): void;
    requetJoinRoom(roomNumber: string): void;
}

/**
 * 游戏启动参数
 */
export interface GameModuleLaunchArgs {
    userInfo: UserInfo;
    roomInfo: RoomInfo;
    jsonString: string;
    loader?: GResLoader;
    lm?: LobbyModuleInterface;

    record: Record;
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
