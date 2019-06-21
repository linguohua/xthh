import { AnimationMgr, GResLoader, UserInfo } from "../lcore/LCoreExports";

/**
 * room对外接口
 */
export interface RoomHost {
    eventTarget: cc.EventTarget;
    timeElapsed: number;
    animationMgr: AnimationMgr;
    quit: Function;
    unblockNormal: Function;
    blockNormal: Function;
    user: UserInfo;
    component: cc.Component;
    loader: GResLoader;
    sendBinary(buf: ByteBuffer): void;
    getLobbyModuleLoader(): GResLoader;
}
