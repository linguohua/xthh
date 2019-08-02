import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 解散回复
 */
export namespace HandlerMsgTableDisbandAckA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const disbandAck = proto.casino.packet_table_disband_ack.decode(msgData);
        Logger.debug("HandlerMsgTableDisbandAck----------------------- ", disbandAck);

        room.updateDisbandVoteView(null, disbandAck);
    };
}
