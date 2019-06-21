import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 发牌处理
 */
export namespace HandlerMsgDeal {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const msgDeal = proto.mahjong.MsgDeal.decode(msgData);
        //清理
        room.resetForNewHand();
        //保存一些房间属性
        room.bankerChairID = msgDeal.bankerChairID;
        //是否连庄
        room.isContinuousBanker = msgDeal.isContinuousBanker;
        room.windFlowerID = msgDeal.windFlowerID;
        room.tilesInWall = msgDeal.tilesInWall;
        room.markup = msgDeal.markup;
        //print("llwant,handlerMsgRestore //////////////-"..tostring(msgDeal.markup))
        room.updateTilesInWallUI();

        const players = room.getPlayers();
        //隐藏复制按钮
        //room.roomView.copyRoomNumber.visible = false
        //对局开始动画
        // room.roomView:gameStartAnimation()
        //TODO: 播放投色子动画
        // room.roomView:touZiStartAnimation(msgDeal.dice1, msgDeal.dice2)
        //TODO:修改家家庄标志
        room.setJiaJiaZhuang();
        //根据风圈修改
        room.setRoundMask();
        //修改庄家标志
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
        }

        //播放发牌动画，并使用coroutine等待动画完成
        // room.roomView:dealAnimation()

        //等待庄家出牌
        // const bankerPlayer = <Player>room.getPlayerInterfaceByChairID(room.bankerChairID);
        room.setWaitingPlayer(room.bankerChairID);

        //自己手牌排一下序
        const mySelf = <Player>room.getMyPlayer();
        mySelf.sortHands(mySelf.chairID === room.bankerChairID);

        //显示各个玩家的手牌（对手只显示暗牌）和花牌

        Object.keys(players).forEach((key: string) => {
            const p = <Player>players[key];
            p.hand2UI(false);
            p.flower2UI();
        });
    };
}
