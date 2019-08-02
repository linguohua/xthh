import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 更新
 */
export namespace HandlerMsgTableUpdateA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino.packet_table_update.decode(msgData);
        Logger.debug("HandlerMsgTableUpdate----------------------- ", reply);
    };
}
