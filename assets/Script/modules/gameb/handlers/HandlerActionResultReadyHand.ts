import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器听牌通知
 */
export namespace HandlerActionResultReadyHand {
    export const onMsg = async (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface): Promise<void> => {
        const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);

        player.isRichi = true;

        //特效播放
        player.readyHandEffect();

        //头像上显示听牌标志
        player.richiIconShow(true);
    };
}
