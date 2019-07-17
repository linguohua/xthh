import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 玩家进入
 */
export namespace HandlerMsgTableEntry {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const d = proto.casino.packet_table_entry.decode(msgData);
        Logger.debug("HandlerMsgTableEntry----------------------- ", d);
        room.createPlayerByInfo(d.pdata, d.idx);

        const players = room.roomInfo.players;
        players[d.idx] = d.pdata;
        room.updateReadView(room.roomInfo, players);
    };
}
