import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器暗杠通知
 */
export namespace HandlerActionResultKongConcealed {
    export const onMsg = async (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface): Promise<void> => {

        const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);
        const kongTileId = actionResultMsg.actionTile;

        //从手牌移除4张
        for (let i = 1; i <= 4; i++) {
            player.removeTileFromHand(kongTileId);
        }

        //暗杠需要构建一个新的meld
        const newMeld = new proto.mahjong.MsgMeldTile();
        newMeld.meldType = proto.mahjong.MeldType.enumMeldTypeConcealedKong;
        newMeld.tile1 = kongTileId;
        newMeld.contributor = player.chairID;

        player.addMeld(newMeld);

        //播放暗杠动画
        await player.concealedKongResultAnimation();

        //手牌列表更新UI
        player.hand2UI(false);
    };
}
