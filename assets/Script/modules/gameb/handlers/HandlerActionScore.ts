import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器分数改变通知
 */
export namespace HandlerActionScore {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_score.decode(msgData);
        Logger.debug("HandlerActionScore----------------------- ", reply);
        const players: Player[] = [];
        for (const score of reply.scores) {
            const player = <Player>room.getPlayerByPlayerID(score.player_id);
            if (player !== undefined) {
                player.piaoScore(score.score_add);
            }
            players.push(player);
        }
        // await room.coWaitSeconds(1);
        //等待
        // for (const player of players) {
        //     player.playerView.showScore();
        // }
    };
}
