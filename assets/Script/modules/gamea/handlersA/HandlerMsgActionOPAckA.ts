import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { TypeOfOP } from "../PlayerInterfaceA";
import { RoomInterfaceA } from "../RoomInterfaceA";

const OP_TYPE = proto.casino_gdy.eGDY_OP_TYPE;
/**
 * 操作服务器回复
 */
export namespace HandlerMsgActionOPAckA {
    const pong = async (room: RoomInterfaceA, player: PlayerA, pAck: proto.casino_gdy.packet_sc_op_ack): Promise<void> => {
        //从手牌移除
        for (let i = 0; i < 2; i++) {
            player.removeTileFromHand(pAck.cards[0]);
        }
        player.addMeld(pAck);
        // player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
        player.hand2UI(true); //手牌列表更新UI
        const contributorPlayer = <PlayerA>room.getPlayerByPlayerID(pAck.target_id);
        const a = pAck.cards[0];
        contributorPlayer.removeLatestDiscarded(a); //从贡献者（出牌者）的打出牌列表中移除最后一张牌
        await contributorPlayer.discarded2UI(false, false); //更新贡献者的打出牌列表到UI
        // if (player.isMe()) {
        //     room.mAlgorithm.push_back([], pAck.cards, 1, 2);
        //     if (player.getMahjongCount_withV(a) > 0) {
        //         room.myMahjong_addForgo(0, a, false);
        //     }
        // }
    };
    const kong2 = async (
        room: RoomInterfaceA, t: number, player: PlayerA, pAck: proto.casino_gdy.packet_sc_op_ack, array: number[]): Promise<void> => {
        const mahjong = pAck.cards[0];
        //从手牌移除
        for (const card of array) {
            player.removeTileFromHand(card);
        }
        //只有明杠才需要补充一张牌，自己要在这里先加
        // if (t === TypeOfOP.DEF_GDY_OP_GANG_M) {
        //     player.addHandTile(mahjong);
        // }
        if (t === TypeOfOP.DEF_GDY_OP_GANG_B) { //加杠
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
        const contributorPlayer = <PlayerA>room.getPlayerByPlayerID(pAck.target_id);
        if (contributorPlayer !== undefined && contributorPlayer !== null) {
            contributorPlayer.removeLatestDiscarded(mahjong); //从贡献者（出牌者）的打出牌列表中移除最后一张牌
            await contributorPlayer.discarded2UI(false, false); //更新贡献者的打出牌列表到UI
        }
        // player.sortHands(false); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
        player.hand2UI(true); //手牌列表更新UI
    };
    const kong = async (room: RoomInterfaceA, player: PlayerA, pAck: proto.casino_gdy.packet_sc_op_ack): Promise<number> => {
        if (pAck.type === OP_TYPE.GDY_OP_TYPE_DIANXIAO || pAck.type === OP_TYPE.GDY_OP_TYPE_MENGXIAO ||
            pAck.type === OP_TYPE.GDY_OP_TYPE_XIAOCHAOTIAN || pAck.type === OP_TYPE.GDY_OP_TYPE_DACHAOTIAN) {
            //检测三种可能的错误（小于等于1张牌，三张牌但是闷笑，三张牌但是点笑）
            if (pAck.cards.length <= 1) {
                pAck.type = OP_TYPE.GDY_OP_TYPE_HUITOUXIAO;
            } else if (pAck.cards.length === 3 && pAck.type === OP_TYPE.GDY_OP_TYPE_MENGXIAO) {
                pAck.type = OP_TYPE.GDY_OP_TYPE_DACHAOTIAN;
            } else if (pAck.cards.length === 3 && pAck.type === OP_TYPE.GDY_OP_TYPE_DIANXIAO) {
                pAck.type = OP_TYPE.GDY_OP_TYPE_DACHAOTIAN;
            }
        }
        const mahjong = pAck.cards[0];
        //pAck.cards[1], pAck.type, self:changeOrder( index), pAck.target_id
        let sCount = 0;
        let vCount = 0;
        let t = 0;
        if (pAck.type === OP_TYPE.GDY_OP_TYPE_DIANXIAO) { //点笑
            sCount = 4;
            vCount = 3;
            t = TypeOfOP.DEF_GDY_OP_GANG_M;
        } else if (pAck.type === OP_TYPE.GDY_OP_TYPE_MENGXIAO) { //闷笑
            sCount = 4;
            vCount = 4;
            t = TypeOfOP.DEF_GDY_OP_GANG_A;
        } else if (pAck.type === OP_TYPE.GDY_OP_TYPE_HUITOUXIAO) { //回头笑
            sCount = 1;
            vCount = 1;
            t = TypeOfOP.DEF_GDY_OP_GANG_B;
        } else if (pAck.type === OP_TYPE.GDY_OP_TYPE_XIAOCHAOTIAN) { //翻牌点笑
            sCount = 3;
            vCount = 2;
            t = TypeOfOP.DEF_GDY_OP_GANG_M;
        } else if (pAck.type === OP_TYPE.GDY_OP_TYPE_DACHAOTIAN) { //翻牌闷笑
            sCount = 3;
            vCount = 3;
            t = TypeOfOP.DEF_GDY_OP_GANG_A;
        }
        if (sCount === 0) {
            return pAck.type;
        }
        const array: number[] = [];
        for (let index = 0; index < vCount; index++) {
            array.push(mahjong);
        }
        await kong2(room, t, player, pAck, array);

        return pAck.type;
    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const pAck = proto.casino_gdy.packet_sc_op_ack.decode(msgData);
        Logger.debug("HandlerMsgActionOPAck----------------------- ", pAck);
        const player = <PlayerA>room.getPlayerByPlayerID(pAck.player_id);
        if (player.isMe()) {
            player.playerView.setLanOfHands(false);
            if (pAck.op === TypeOfOP.Guo) {                //假如没有操作
                if (player.canKongs !== undefined && player.canKongs.length > 0) {
                    // player.notKongs = player.canKongs;
                    let have = false;
                    for (const nokong of player.notKongs) {
                        if (nokong === player.canKongs[0]) {
                            have = true;
                            break;
                        }
                    }
                    if (!have) {
                        player.notKongs.push(player.canKongs[0]);
                    }
                    // Logger.debug("----player.notKongs----------------------- ", player.notKongs);
                }
                if (player.isCanPong && room.lastDisCardTile !== 0) {
                    player.notPong = room.lastDisCardTile;
                }
                // room.setDiscardAble();
            } else if (pAck.op === TypeOfOP.BUZHUOCHONG) {
                // player.setNotCatch(true);
                // room.m_bSaveZCHFlag = false;
                player.cancelZhuochong = true;
            }
            room.roomView.showOrHideTipsOfMe(false);
        }
        if (pAck.op === TypeOfOP.Pong) {
            await pong(room, player, pAck);
            //播放动画
            await player.exposedResultAnimation(1001);
        } else if (pAck.op === TypeOfOP.Kong) {
            const pAckType = await kong(room, player, pAck); //在这个函数里面 pAck.type 会改变
            //播放动画
            await player.exposedResultAnimation(pAckType);
        } else if (pAck.op === TypeOfOP.ZiMo || pAck.op === TypeOfOP.Hu || pAck.op === TypeOfOP.QIANGXIAO) {
            //其他的是各种胡牌
            //胡的类型 是要在结算那边获取。。。
        }
    };
}
