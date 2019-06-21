import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器牌局回复
 */
export namespace HandlerMsgRestore {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        //掉线恢复时，是通过MsgRestore下发的
        const msgRestore = proto.mahjong.MsgRestore.decode(msgData);

        // msgRestore:ParseFromString(msgData)

        //首先清空所有玩家的牌列表
        const players = room.getPlayers();
        Object.keys(players).forEach((key: string) => {
            const ps = <Player>players[key];
            ps.resetForNewHand();
        });

        //一手牌数据
        const msgDeal = msgRestore.msgDeal;
        room.bankerChairID = msgDeal.bankerChairID;
        room.isContinuousBanker = msgDeal.isContinuousBanker;
        room.windFlowerID = msgDeal.windFlowerID;
        room.tilesInWall = msgDeal.tilesInWall;
        //大丰 1：就表示家家庄    // 盐城 >0 表示加价局计数
        room.markup = msgDeal.markup;
        // print("llwant,handlerMsgRestore //////////////-" .. tostring(msgDeal.markup))
        //print("llwant,msgDeal.markup : " .. msgDeal.markup)
        // print("llwant , handlerMsgRestore.room.markup : " .. tostring(room.markup))
        //起手听状态
        for (const chairID of msgRestore.readyHandChairs) {
            const player = <Player>room.getPlayerByChairID(chairID);
            player.richiIconShow(true);
        }

        room.updateTilesInWallUI();
        //TODO:根据风圈修改
        room.setRoundMask();
        //TODO:修改家家庄标志
        // room.roomView:setJiaJiaZhuang()
        //TODO:修改庄家标志
        room.setBankerFlag();
        //清理吃牌界面
        room.cleanUI();
        //保存每一个玩家的牌列表
        const playerTileLists = msgDeal.playerTileLists;
        for (const v of playerTileLists) {
            const playerTileList = v;
            const chairID = v.chairID;
            const player = <Player>room.getPlayerByChairID(chairID);
            //填充手牌列表，仅自己有手牌列表，对手只有手牌张数
            if (player.isMe()) {
                player.addHandTiles(playerTileList.tilesHand);
            } else {
                player.tileCountInHand = playerTileList.tileCountInHand;
            }

            //填充花牌列表
            player.addFlowerTiles(playerTileList.tilesFlower);

            //填充打出去的牌列表
            player.addDiscardedTiles(playerTileList.tilesDiscard);

            //填充面子牌列表
            player.addMelds(playerTileList.melds);

            if (player.chairID === room.bankerChairID) {
                room.setWaitingPlayer(player.chairID);
            }
        }

        //自己手牌排一下序
        const mySelf = <Player>room.getMyPlayer();
        const newDraw = msgRestore.isMeNewDraw;
        mySelf.sortHands(newDraw);

        //显示各个玩家的手牌（对手只显示暗牌）和花牌和打出去的牌
        Object.keys(players).forEach((key: string) => {
            const p = <Player>players[key];
            p.hand2UI(!newDraw);

            p.flower2UI();
            let newDiscarded = false;
            if (p.chairID === msgRestore.lastDiscaredChairID) {
                room.setWaitingPlayer(p.chairID);
                newDiscarded = true;
            }
            p.discarded2UI(newDiscarded, msgRestore.waitDiscardReAction);
        });
    };
}
