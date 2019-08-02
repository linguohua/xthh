import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 玩家离开
 */
export namespace HandlerMsgTableLeaveA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const d = proto.casino.packet_table_leave.decode(msgData);
        Logger.debug("HandlerMsgTableLeave----------------------- ", d);
        // room.createPlayerByInfo(d.pdata, d.idx);

        const players = room.roomInfo.players;
        if (players[d.idx] !== null && players[d.idx].id !== null) {
            players[d.idx] = null;
        }
        room.updateReadView(room.roomInfo, players);

        const playerID = `${d.player_id}`;
        if (room.isMe(playerID)) {
            room.getRoomHost().eventTarget.emit("leave");
        } else {
            const player = <PlayerA>room.getPlayerByUserID(playerID);
            player.unbindView();
            room.removePlayer(playerID);
        }

    };
}
