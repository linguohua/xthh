import { Logger } from "../../lobby/lcore/LCoreExports";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器整个牌局结束通知
 */
export namespace HandlerMsgTableEntry {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        Logger.debug("HandlerMsgTableEntry");
    };
}
