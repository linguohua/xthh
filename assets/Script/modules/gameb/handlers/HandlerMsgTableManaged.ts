import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";
import { Player } from "../Player";

/**
 * 托管
 */
export namespace HandlerMsgTableManaged {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_managed.decode(msgData);
        Logger.debug("HandlerMsgTableManaged----------------------- ", reply);
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);
        player.playerView.head.headView.grayed = reply.managed;
    };
}
