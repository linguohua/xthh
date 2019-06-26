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
        //保存一些房间属性
        // room.bankerChairID = msgDeal.bankerChairID;
        // //是否连庄
        // room.isContinuousBanker = msgDeal.isContinuousBanker;
        // room.windFlowerID = msgDeal.windFlowerID;
        // room.tilesInWall = msgDeal.tilesInWall;
        // room.markup = msgDeal.markup;
        // room.updateTilesInWallUI();

        const players = room.getPlayers();
        // //TODO:修改家家庄标志
        // room.setJiaJiaZhuang();
        // //根据风圈修改
        // room.setRoundMask();
        // //修改庄家标志
        // room.setBankerFlag();

        // //清理吃牌界面
        // room.cleanUI();
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

        // //自己手牌排一下序
        // const mySelf = <Player>room.getMyPlayer();
        // mySelf.sortHands(mySelf.chairID === room.bankerChairID);

        // //显示各个玩家的手牌（对手只显示暗牌）和花牌

        // Object.keys(players).forEach((key: string) => {
        //     const p = <Player>players[key];
        //     p.hand2UI(false);
        //     p.flower2UI();
        // });
    };
}
