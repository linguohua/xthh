import { Logger, Dialog } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface, roomStatus } from "../RoomInterface";

const eXTSJ_OP_TYPE = proto.casino_xtsj.eXTSJ_OP_TYPE;
/**
 * 结算
 */
export namespace HandlerMsgTableScore {

    const showHu = async (reply: proto.casino.packet_table_score, room: RoomInterface): Promise<void> => {

        for (const score of reply.scores) {
            const player = <Player>room.getPlayerByUserID(`${score.data.id}`);
            if (score.hupai_card > 0) {
                let huType = eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO;
                const opscores = score.opscores;
                for (const opscore of opscores) {
                    if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_ZHUOCHONG ||
                        opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO ||
                        opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO ||
                        opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_QIANGXIAO) {
                        huType = opscore.type;
                    } else if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMOX2) {
                        huType = eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO;
                    } else if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMOX2) {
                        huType = eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO;
                    }
                }
                //播放动画
                await player.exposedResultAnimation(huType, true);
            }
            //保存分数
            if (score.score_total !== null) {
                player.totalScores = score.score_total;
            }
        }

    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_score.decode(msgData);
        Logger.debug("HandlerMsgTableScore----------------------- ", reply);
        //摊牌
        let huPlayer: Player = null;
        for (const score of reply.scores) {
            const curcards = score.curcards;
            const player = <Player>room.getPlayerByUserID(`${score.data.id}`);
            //胡牌的人才 摊牌
            if (score.hupai_card > 0) {
                // if (!player.isMe()) {
                //     player.tilesHand = curcards;
                // }
                player.hand2Exposed(curcards);
                huPlayer = player;
            }
        }
        const disband_type = reply.tdata.disband_type;
        if (disband_type !== null && !room.isReplayMode()) {
            // 还没开局，不弹大结算界面
            if (reply.tdata.play_total !== null && reply.tdata.play_total > 0) {
                await room.coWaitSeconds(2);
                room.loadGameOverResultView(reply);
            } else {
                await Dialog.coShowDialog("房间已解散", true, false);
            }
        } else {
            await showHu(reply, room);
            await room.coWaitSeconds(1);
            if (huPlayer !== null) {
                await huPlayer.playerView.hideHuoArray();
            }
            // 显示手牌输赢结果
            room.loadHandResultView(reply);
        }
        //房间状态
        room.onUpdateStatus(roomStatus.onWait);
    };
}
