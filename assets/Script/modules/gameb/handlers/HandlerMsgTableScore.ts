import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 结算
 */
export namespace HandlerMsgTableScore {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_score.decode(msgData);
        Logger.debug("HandlerMsgTableScore----------------------- ", reply);
    };
}
