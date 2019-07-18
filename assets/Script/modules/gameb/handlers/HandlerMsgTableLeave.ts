import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 玩家离开
 */
export namespace HandlerMsgTableLeave {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
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
            const player = <Player>room.getPlayerByUserID(playerID);
            player.unbindView();
            room.removePlayer(playerID);
        }

    };
}
