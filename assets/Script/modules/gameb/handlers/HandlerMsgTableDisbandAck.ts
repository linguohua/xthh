import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 解散回复
 */
export namespace HandlerMsgTableDisbandAck {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const disbandAck = proto.casino.packet_table_disband_ack.decode(msgData);
        Logger.debug("HandlerMsgTableDisbandAck----------------------- ", disbandAck);

        room.updateDisbandVoteView(null, disbandAck);
    };
}
