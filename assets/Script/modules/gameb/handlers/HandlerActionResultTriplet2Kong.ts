import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器加杠通知
 */
export namespace HandlerActionResultTriplet2Kong {
    export const onMsg = async (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface): Promise<void> => {
        const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);
        const kongTileId = actionResultMsg.actionTile;

        //从手牌移除1张
        player.removeTileFromHand(kongTileId);

        //修改之前的碰牌牌组为加杠
        const meld = player.getMeld(kongTileId, proto.mahjong.MeldType.enumMeldTypeTriplet);
        meld.meldType = proto.mahjong.MeldType.enumMeldTypeTriplet2Kong;

        //播放加杠动画
        await player.triplet2KongResultAnimation();

        //手牌列表更新UI
        player.hand2UI(false);
    };
}
