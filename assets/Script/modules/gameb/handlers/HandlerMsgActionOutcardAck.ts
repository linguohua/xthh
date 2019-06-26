import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 出牌服务器回复
 */
export namespace HandlerMsgActionOutcardAck {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_outcard_ack.decode(msgData);
        Logger.debug("HandlerMsgActionOutcardAck----------------------- ", reply);
    };
}
