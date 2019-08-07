import { Dialog, Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 玩家进入
 */
export namespace HandlerMsgUpdateCoordinate {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const coordinate = proto.casino.packet_coordinate.decode(msgData);
        const player = <Player>room.getPlayerByUserID(`${coordinate.player_id}`);
        player.coordinate = <proto.casino.coordinate>coordinate;

        Dialog.hideWaiting();
        Logger.debug("HandlerMsgUpdateCoordinate:", coordinate);
        // player.coodinate = <proto.casino.coordinate>coordinate;
        // Logger.debug("HandlerMsgTableEntry----------------------- ", d);
        // room.createPlayerByInfo(d.pdata, d.idx);

        // const players = room.roomInfo.players;
        // players[d.idx] = d.pdata;
        // room.updateReadView(room.roomInfo, players);
    };
}
