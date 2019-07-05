import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 发牌处理
 */
export namespace HandlerMsgDeal {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const msgDeal = proto.casino_xtsj.packet_sc_start_play.decode(msgData);
        console.log("HandlerMsgDeal---------------- ", msgDeal);
        //清理
        room.resetForNewHand();
        room.laiziID = msgDeal.laizi;
        room.laigenID = msgDeal.fanpai;
        room.setRoundMask();
        const players = room.getPlayers();
        //保存每一个玩家的牌列表
        const playersKeyArr = Object.keys(players);
        for (const key of playersKeyArr) {
            const p = <Player>players[key];
            if (p.isMe()) {
                p.addHandTiles(msgDeal.cards);
                p.sortHands(false);
            } else {
                p.tileCountInHand = 13;
            }
            p.hand2UI(false);
        }

        //等待庄家出牌
        const player = <Player>room.getPlayerByUserID(msgDeal.lord_id.toString());
        room.setWaitingPlayer(player.chairID, msgDeal.time);

        room.mAlgorithm.setMahjongLaiZi(msgDeal.laizi);
        room.mAlgorithm.setMahjongFan(msgDeal.fanpai);
        room.mAlgorithm.setFlagPiao(false);
    };
}
