import { Dialog, Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { LocalStrings } from "../../lobby/strings/LocalStringsExports";
import { PlayerA } from "../PlayerA";
import { RoomInterfaceA, roomStatus } from "../RoomInterfaceA";

const eGDY_OP_TYPE = proto.casino_gdy.eGDY_OP_TYPE;
/**
 * 结算
 */
export namespace HandlerMsgTableScoreA {

    const showHu = async (reply: proto.casino.packet_table_score, room: RoomInterfaceA): Promise<void> => {

        for (const score of reply.scores) {
            const player = <PlayerA>room.getPlayerByUserID(`${score.data.id}`);
            if (score.hupai_card > 0) {
                let huType = eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO;
                const opscores = score.opscores;
                for (const opscore of opscores) {
                    if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_ZHUOCHONG ||
                        opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO ||
                        opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO ||
                        opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_QIANGXIAO) {
                        huType = opscore.type;
                    } else if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_RUANMOX2) {
                        huType = eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO;
                    } else if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_HEIMOX2) {
                        huType = eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO;
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

    const emitTime = (room: RoomInterfaceA) => {
        const data = new Date();
        const receiveTime = Date.parse(data.toString());
        room.getRoomHost().eventTarget.emit("receiveTime", receiveTime);
        room.getRoomHost().eventTarget.emit("returnAppTime", 0);
        room.getRoomHost().eventTarget.emit("quitAppTime", 0);
    };

    const isTimeOut = (quitAppTime: number, returnAppTime: number): boolean => {

        let timeOut = false;

        if (quitAppTime !== 0 && returnAppTime !== 0) {
            const leaveSeconds = (returnAppTime - quitAppTime) / 1000;
            if (leaveSeconds > 12) {
                timeOut = true;
            }
        }

        return timeOut;
    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino.packet_table_score.decode(msgData);
        Logger.debug("HandlerMsgTableScore----------------------- ", reply);
        //摊牌
        let huPlayer: PlayerA = null;
        for (const score of reply.scores) {
            const curcards = score.curcards;
            const player = <PlayerA>room.getPlayerByUserID(`${score.data.id}`);
            //胡牌的人才 摊牌
            if (score.hupai_card > 0) {
                let haveHeiMo = false;
                const opscores = score.opscores;
                for (const opscore of opscores) {
                    if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_HEIMOX2 ||
                        opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO) {
                        haveHeiMo = true;
                        break;
                    }
                }
                player.hand2Exposed(curcards, haveHeiMo);
                huPlayer = player;
            }
        }
        const disband_type = reply.tdata.disband_type;
        if (disband_type !== null && !room.isReplayMode()) {
            // 还没开局，不弹大结算界面
            if (reply.tdata.play_total !== null && reply.tdata.play_total > 0) {
                // await room.coWaitSeconds(2);
                room.loadGameOverResultView(reply);
            } else {
                if (disband_type === 2) {
                    Dialog.prompt(LocalStrings.findString("autoDisband"));
                    await room.coWaitSeconds(2);
                }
            }
        } else {
            emitTime(room);

            let quitAppTime = 0;
            let returnAppTime = 0;
            const saveQuitAppTime = (time: number) => {
                quitAppTime = time;
            };
            const saveReturnAppTime = (time: number) => {
                returnAppTime = time;
            };
            room.getRoomHost().eventTarget.on("quitAppTime", saveQuitAppTime);
            room.getRoomHost().eventTarget.on("returnAppTime", saveReturnAppTime);

            await showHu(reply, room);
            // 如果在这里超时，直接返回
            if (isTimeOut(quitAppTime, returnAppTime)) {
                return;
            }

            await room.coWaitSeconds(1);
            // 如果在这里超时，直接返回
            if (isTimeOut(quitAppTime, returnAppTime)) {
                return;
            }
            if (huPlayer !== null) {
                await huPlayer.playerView.hideHuoArray();
            }
            // 如果在这里超时，直接返回
            if (isTimeOut(quitAppTime, returnAppTime)) {
                return;
            }
            // 显示手牌输赢结果
            room.loadHandResultView(reply);
        }
        //房间状态
        room.onUpdateStatus(roomStatus.onWait);
    };
}
