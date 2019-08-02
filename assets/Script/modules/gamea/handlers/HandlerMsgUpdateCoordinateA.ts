import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 玩家进入
 */
export namespace HandlerMsgUpdateCoordinateA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const coordinate = proto.casino.packet_coordinate.decode(msgData);
        const player = <PlayerA>room.getPlayerByUserID(`${coordinate.player_id}`);
        player.coordinate = <proto.casino.coordinate>coordinate;

        Logger.debug("HandlerMsgUpdateCoordinate:", coordinate);
        // player.coodinate = <proto.casino.coordinate>coordinate;
        // Logger.debug("HandlerMsgTableEntry----------------------- ", d);
        // room.createPlayerByInfo(d.pdata, d.idx);

        // const players = room.roomInfo.players;
        // players[d.idx] = d.pdata;
        // room.updateReadView(room.roomInfo, players);
    };
}
