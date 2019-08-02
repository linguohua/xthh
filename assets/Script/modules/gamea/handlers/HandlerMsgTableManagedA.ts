import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 托管
 */
export namespace HandlerMsgTableManagedA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino.packet_table_managed.decode(msgData);
        Logger.debug("HandlerMsgTableManaged----------------------- ", reply);
    };
}
