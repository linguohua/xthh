import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { TypeOfOP } from "../PlayerInterface";
import { RoomInterface } from "../RoomInterface";

const OP_TYPE = proto.casino_xtsj.eXTSJ_OP_TYPE;
/**
 * 操作服务器回复
 */
export namespace HandlerMsgActionOPAck {
    const pong = (room: RoomInterface, player: Player, pAck: proto.casino_xtsj.packet_sc_op_ack): void => {
        //从手牌移除
        for (let i = 0; i < 2; i++) {
            player.removeTileFromHand(pAck.cards[0]);
        }
        player.addMeld(pAck);
        player.hand2UI(true); //手牌列表更新UI
        const contributorPlayer = <Player>room.getPlayerByUserID(`${pAck.target_id}`);
        const a = pAck.cards[0];
        contributorPlayer.removeLatestDiscarded(a); //从贡献者（出牌者）的打出牌列表中移除最后一张牌
        contributorPlayer.discarded2UI(false, false); //更新贡献者的打出牌列表到UI
        if (player.isMe()) {
            room.mAlgorithm.push_back([], pAck.cards, 1, 2);
            if (player.getMahjongCount_withV(a) > 0) {
                room.myMahjong_addForgo(0, a, false);
            }
        }
    };
    const kong2 = (room: RoomInterface, t: number, player: Player, pAck: proto.casino_xtsj.packet_sc_op_ack, array: number[]): void => {
        const mahjong = pAck.cards[0];
        //从手牌移除
        for (const card of array) {
            player.removeTileFromHand(card);
        }
        //只有明杠才需要补充一张牌，自己要在这里先加
        // if (t === TypeOfOP.DEF_XTSJ_OP_GANG_M) {
        //     player.addHandTile(mahjong);
        // }
        if (t === TypeOfOP.DEF_XTSJ_OP_GANG_B) { //加杠
            const meld = player.getMeld(mahjong, TypeOfOP.Pong);
            if (meld !== null) {
                //说明是加杠
                meld.op = TypeOfOP.Kong; // 改成杠
                meld.cards.push(mahjong);
            } else {
                player.addMeld(pAck);
            }
        } else {
            player.addMeld(pAck);
        }
        const contributorPlayer = <Player>room.getPlayerByUserID(`${pAck.target_id}`);
        if (contributorPlayer !== undefined && contributorPlayer !== null) {
            contributorPlayer.removeLatestDiscarded(mahjong); //从贡献者（出牌者）的打出牌列表中移除最后一张牌
            contributorPlayer.discarded2UI(false, false); //更新贡献者的打出牌列表到UI
        }
        player.hand2UI(true); //手牌列表更新UI
    };
    const kong = (room: RoomInterface, player: Player, pAck: proto.casino_xtsj.packet_sc_op_ack): void => {
        if (pAck.type === OP_TYPE.XTSJ_OP_TYPE_DIANXIAO || pAck.type === OP_TYPE.XTSJ_OP_TYPE_MENGXIAO ||
            pAck.type === OP_TYPE.XTSJ_OP_TYPE_XIAOCHAOTIAN || pAck.type === OP_TYPE.XTSJ_OP_TYPE_DACHAOTIAN) {
            //检测三种可能的错误（小于等于1张牌，三张牌但是闷笑，三张牌但是点笑）
            if (pAck.cards.length <= 1) {
                pAck.type = OP_TYPE.XTSJ_OP_TYPE_HUITOUXIAO;
            } else if (pAck.cards.length === 3 && pAck.type === OP_TYPE.XTSJ_OP_TYPE_MENGXIAO) {
                pAck.type = OP_TYPE.XTSJ_OP_TYPE_DACHAOTIAN;
            } else if (pAck.cards.length === 3 && pAck.type === OP_TYPE.XTSJ_OP_TYPE_DIANXIAO) {
                pAck.type = OP_TYPE.XTSJ_OP_TYPE_DACHAOTIAN;
            }
        }
        const mahjong = pAck.cards[0];
        //pAck.cards[1], pAck.type, self:changeOrder( index), pAck.target_id
        let s_count = 0;
        let v_count = 0;
        let t = 0;
        let tag_idx = 0;
        if (pAck.type === OP_TYPE.XTSJ_OP_TYPE_DIANXIAO) { //点笑
            s_count = 4;
            v_count = 3;
            t = TypeOfOP.DEF_XTSJ_OP_GANG_M;
        } else if (pAck.type === OP_TYPE.XTSJ_OP_TYPE_MENGXIAO) { //闷笑
            s_count = 4;
            v_count = 4;
            t = TypeOfOP.DEF_XTSJ_OP_GANG_A;
        } else if (pAck.type === OP_TYPE.XTSJ_OP_TYPE_HUITOUXIAO) { //回头笑
            s_count = 1;
            v_count = 1;
            t = TypeOfOP.DEF_XTSJ_OP_GANG_B;
        } else if (pAck.type === OP_TYPE.XTSJ_OP_TYPE_XIAOCHAOTIAN) { //翻牌点笑
            s_count = 3;
            v_count = 2;
            t = TypeOfOP.DEF_XTSJ_OP_GANG_M;
        } else if (pAck.type === OP_TYPE.XTSJ_OP_TYPE_DACHAOTIAN) { //翻牌闷笑
            s_count = 3;
            v_count = 3;
            t = TypeOfOP.DEF_XTSJ_OP_GANG_A;
        }
        if (s_count === 0) {
            return;
        }
        const array: number[] = [];
        for (let index = 0; index < v_count; index++) {
            array.push(mahjong);
        }
        kong2(room, t, player, pAck, array);
    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const pAck = proto.casino_xtsj.packet_sc_op_ack.decode(msgData);
        Logger.debug("HandlerMsgActionOPAck----------------------- ", pAck);
        const player = <Player>room.getPlayerByUserID(`${pAck.player_id}`);
        if (player.isMe()) {
            if (pAck.op === TypeOfOP.Guo) {                //假如没有操作
                if (room.m_bSaveOPGFlag && room.m_nSaveOPGMahjong !== 0) {
                    room.myMahjong_addForgo(0, room.m_nSaveOPGMahjong, true);
                }
                if (room.m_bSaveOPPFlag && room.m_nSaveOPPMahjong !== 0) {
                    room.myMahjong_addForgo(0, room.m_nSaveOPPMahjong, true);
                }
            } else if (pAck.op === TypeOfOP.BUZHUOCHONG) {
                player.setNotCatch(true);
                room.m_bSaveZCHFlag = false;
            }
        }
        if (pAck.op === TypeOfOP.Pong) {
            pong(room, player, pAck);
        } else if (pAck.op === TypeOfOP.Kong) {
            kong(room, player, pAck);
        } else if (pAck.op === TypeOfOP.ZiMo || pAck.op === TypeOfOP.Hu || pAck.op === TypeOfOP.QIANGXIAO) {
            //其他的是各种胡牌
        }
        //播放动画
        await player.exposedResultAnimation(pAck.op);
        // if (reply.op === TypeOfOP.Pong || reply.op === TypeOfOP.Kong) {
        //     //清理吃牌界面
        //     room.cleanUI();
        //     const meld = player.getMeld(reply.cards[0], TypeOfOP.Pong);
        //     if (meld !== null) {
        //         //说明是加杠
        //         meld.op = TypeOfOP.Kong; // 改成杠
        //         meld.cards.push(reply.cards[0]);
        //     } else {
        //         player.addMeld(reply);
        //     }
        //     //隐藏箭头
        //     room.setArrowByParent(null);
        //     room.hideDiscardedTips();
        // } else {
        //     //胡 等其他情况
        // }
        // //播放动画
        // await player.exposedResultAnimation(reply.op);
    };
}
