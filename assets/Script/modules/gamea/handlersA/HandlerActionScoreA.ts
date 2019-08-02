import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 响应服务器分数改变通知
 */
export namespace HandlerActionScoreA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino_gdy.packet_sc_score.decode(msgData);
        Logger.debug("HandlerActionScore----------------------- ", reply);
        const players: PlayerA[] = [];
        for (const score of reply.scores) {
            const player = <PlayerA>room.getPlayerByUserID(`${score.player_id}`);
            if (player !== undefined) {
                player.piaoScore(score.score_add);
            }
            players.push(player);
        }
        // await room.coWaitSeconds(1);
        //等待
        // for (const player of players) {
        // player.playerView.showScore();
        // }
    };
}
