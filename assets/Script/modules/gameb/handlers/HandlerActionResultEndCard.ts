import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器抽牌通知
 */
export namespace HandlerActionResultEndCard {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_endcard.decode(msgData);
        Logger.debug("海底----------------------- ", reply);

        //播放动画
        const le = room.roomInfo.players.length;
        let effectName = "Effect_ico_zuihousizhang";
        if (le === 2) {
            effectName = "Effect_ico_zuihouerzhang";
        } else if (le === 3) {
            effectName = "Effect_ico_zuihousanzhang";
        }
        await room.roomView.playAnimation(effectName, true);
        //增加新抽到的牌到手牌列表
        room.mAlgorithm.mahjongTotal_lower(le);
        //牌墙
        room.tilesInWall = room.tilesInWall - le;
        room.updateTilesInWallUI();
        if (reply.card !== 0) {
            const player = <Player>room.getMyPlayer();
            player.addHandTile(reply.card);
            player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
            player.hand2UI(false);
        }

        //等一会
        await room.coWaitSeconds(2);
    };
}
