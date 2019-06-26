import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 玩家准备
 */
export namespace HandlerMsgTableReady {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_ready.decode(msgData);
        Logger.debug("HandlerMsgTableReady----------------------- ", reply);
    };
}
