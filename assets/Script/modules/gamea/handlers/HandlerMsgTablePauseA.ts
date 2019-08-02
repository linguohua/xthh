import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 等待玩家操作
 */
export namespace HandlerMsgTablePauseA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const d = proto.casino.packet_table_pause.decode(msgData);
        Logger.debug("HandlerMsgTablePause----------------------- ", d);
        // room.createPlayerByInfo(d.pdata, d.idx);
    };
}
