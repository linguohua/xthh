import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器吃牌通知
 */
export namespace HandlerActionResultChow {
    export const onMsg = async (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface): Promise<void> => {
        const actionMeld = actionResultMsg.actionMeld;
        const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);
        const chowTileId = actionResultMsg.actionTile;

        //从手牌移除两张
        for (let i = 0; i <= 2; i++) {
            const tileId = actionMeld.tile1 + i;
            if (tileId !== chowTileId) {
                player.removeTileFromHand(tileId);
            }
        }

        //直接把消息meld保存到玩家的meld列表中
        player.addMeld(actionMeld);

        //如果newFlowers有内容，则需要刷新暗杠列表
        const newFlowers = actionResultMsg.newFlowers;
        if (newFlowers !== undefined && newFlowers.length > 0) {
            player.refreshConcealedMelds(newFlowers);
        }

        //从贡献者（出牌者）的打出牌列表中移除最后一张牌
        const contributorPlayer = <Player>room.getPlayerByChairID(actionMeld.contributor);
        // print("llwant, chowTileID:"..chowTileId.. ",contri:"..actionMeld.contributor)

        //播放吃牌动画
        await player.chowResultAnimation();

        //手牌列表更新UI
        player.hand2UI(true);

        contributorPlayer.removeLatestDiscarded(chowTileId);
        //更新贡献者的打出牌列表到UI
        contributorPlayer.discarded2UI(false, false);

        //隐藏箭头
        room.setArrowByParent(null);
        room.hideDiscardedTips();
    };
}
