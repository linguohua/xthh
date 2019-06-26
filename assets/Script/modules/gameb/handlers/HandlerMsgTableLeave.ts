import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 玩家离开
 */
export namespace HandlerMsgTableLeave {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const d = proto.casino.packet_table_leave.decode(msgData);
        Logger.debug("HandlerMsgTableLeave----------------------- ", d);
        // room.createPlayerByInfo(d.pdata, d.idx);
    };
}
