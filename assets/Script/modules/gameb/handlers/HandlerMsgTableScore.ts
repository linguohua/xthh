import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";
import { Player } from "../Player";

const eXTSJ_OP_TYPE = proto.casino_xtsj.eXTSJ_OP_TYPE;
/**
 * 结算
 */
export namespace HandlerMsgTableScore {

    const showHu = async (reply: proto.casino.packet_table_score, room: RoomInterface): Promise<void> => {

        for (const score of reply.scores) {
            if (score.hupai_card > 0) {
                let hu_type = eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO;
                const opscores = score.opscores;
                for (const opscore of opscores) {
                    if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_ZHUOCHONG ||
                        opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO ||
                        opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO ||
                        opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_QIANGXIAO) {
                        hu_type = opscore.type;
                    } else if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMOX2) {
                        hu_type = eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO;
                    } else if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMOX2) {
                        hu_type = eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO;
                    }
                }
                //播放动画
                const player = <Player>room.getPlayerByUserID(`${score.data.id}`);
                await player.exposedResultAnimation(hu_type, true);
            }
        }

    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_score.decode(msgData);
        Logger.debug("HandlerMsgTableScore----------------------- ", reply);
        // const play_total = reply.tdata.play_total;
        // const round = reply.tdata.round;
        const disband_type = reply.tdata.disband_type;
        if (disband_type !== null) {
            // if (room.isDisband || play_total >= round) {
            //解散  会显示大结算界面
            room.loadGameOverResultView(reply);
        } else {
            await showHu(reply, room);
            await room.coWaitSeconds(2);
            // 显示手牌输赢结果
            room.loadHandResultView(reply);
        }
    };
}
