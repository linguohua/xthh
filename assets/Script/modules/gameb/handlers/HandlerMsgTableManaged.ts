import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 托管
 */
export namespace HandlerMsgTableManaged {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_managed.decode(msgData);
        Logger.debug("HandlerMsgTableManaged----------------------- ", reply);
        const player = <Player>room.getPlayerByChairID(reply.idx);
        // player.playerView.head.headView.grayed = reply.managed;
        if (player.isMe()) {
            room.roomView.showOrHideTrusteeshipCom(reply.managed);
        }
    };
}
