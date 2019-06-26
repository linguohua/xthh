import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 更新
 */
export namespace HandlerMsgTableUpdate {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_update.decode(msgData);
        Logger.debug("HandlerMsgTableUpdate----------------------- ", reply);
    };
}
