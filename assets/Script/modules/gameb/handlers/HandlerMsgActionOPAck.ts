import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { TypeOfOP } from "../PlayerInterface";
import { RoomInterface } from "../RoomInterface";

/**
 * 操作服务器回复
 */
export namespace HandlerMsgActionOPAck {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_op_ack.decode(msgData);
        Logger.debug("HandlerMsgActionOPAck----------------------- ", reply);
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);
        if (reply.op === TypeOfOP.Pong || reply.op === TypeOfOP.Kong) {
            //清理吃牌界面
            room.cleanUI();
            //从手牌移除
            for (const card of reply.cards) {
                player.removeTileFromHand(card);
            }
            const meld = player.getMeld(reply.cards[0], TypeOfOP.Pong);
            if (meld !== null) {
                //说明是加杠
                meld.op = TypeOfOP.Kong; // 改成杠
                meld.cards.push(reply.cards[0]);
            } else {
                player.addMeld(reply);
            }
            //手牌列表更新UI
            player.hand2UI(true);

            //从贡献者（出牌者）的打出牌列表中移除最后一张牌
            const contributorPlayer = <Player>room.getPlayerByUserID(`${reply.target_id}`);
            //更新贡献者的打出牌列表到UI
            contributorPlayer.removeLatestDiscarded(reply.cards[0]);
            contributorPlayer.discarded2UI(false, false);
            //隐藏箭头
            room.setArrowByParent(null);
            room.hideDiscardedTips();
        } else {
            //胡 等其他情况
        }
        //播放动画
        await player.exposedResultAnimation(reply.op);
    };
}
