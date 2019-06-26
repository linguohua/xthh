import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 操作服务器回复
 */
export namespace HandlerMsgActionOPAck {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_op_ack.decode(msgData);
        Logger.debug("HandlerMsgActionOPAck----------------------- ", reply);
    };
}
