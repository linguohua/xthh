import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器抽牌通知
 */
export namespace HandlerActionResultDraw {
    export const onMsg = async (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface): Promise<void> => {
        //
        const tilesFlower = actionResultMsg.newFlowers;
        const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);
        const drawTile = actionResultMsg.actionTile;
        //本次抽牌如果有抽到花牌，则把花牌保存到player的花牌列表
        //并显示出来
        if (tilesFlower !== undefined && tilesFlower.length > 0) {
            for (const flower of tilesFlower) {
                const xf = [];
                player.playerView.showFlowerOnHandTail(flower);
                await player.playerView.playDrawFlowerAnimation();
                player.playerView.hideFlowerOnHandTail();
                xf.push(flower);
                player.addFlowerTiles(xf);
                player.flower2UI();
            }
        }

        //增加新抽到的牌到手牌列表
        //显示的时候要摆在新抽牌位置
        //enumTid_MAX+1是一个特殊标志，表明服务器已经没牌可抽
        if (drawTile !== (proto.mahjong.TileID.enumTid_MAX + 1)) {
            player.addHandTile(drawTile);
            player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
            player.hand2UI(false);
        }

        room.tilesInWall = actionResultMsg.tilesInWall;
        room.updateTilesInWallUI();

        room.hideDiscardedTips();
    };
}
