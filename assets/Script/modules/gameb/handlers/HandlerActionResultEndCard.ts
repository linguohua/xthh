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

        //增加新抽到的牌到手牌列表
        room.mAlgorithm.mahjongTotal_lower(room.roomInfo.players.length);
        if (reply.card !== 0) {
            const player = <Player>room.getMyPlayer();
            player.addHandTile(reply.card);
            player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
            player.hand2UI(false);
        }
    };
}
