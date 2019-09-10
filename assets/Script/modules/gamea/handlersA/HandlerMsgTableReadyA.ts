import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 玩家准备
 */
export namespace HandlerMsgTableReadyA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino.packet_table_ready.decode(msgData);
        Logger.debug("HandlerMsgTableReady----------------------- ", reply);
        // const player = <Player>room.getPlayerByPlayerID(`${reply.player_id}`);
        // if (player.isMe()) {
        //     //清理
        //     room.resetForNewHand();
        // }
    };
}
