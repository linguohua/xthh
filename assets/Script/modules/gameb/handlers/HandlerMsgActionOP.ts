import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 服务器询问玩家操作
 */
export namespace HandlerMsgActionOP {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_op.decode(msgData);
        Logger.debug("HandlerMsgActionOP----------------------- ", reply);
    };
}
