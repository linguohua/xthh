import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { RoomInterface } from "../RoomInterface";

/**
 * 服务器询问玩家操作
 */
export namespace HandlerMsgActionOP {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_op.decode(msgData);
        Logger.debug("HandlerMsgActionOP----------------------- ", reply);
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);
        if (!player.isMe()) {

            return;
        }
        player.playerView.skipBtn.grayed = true;
        player.playerView.gangBtn.grayed = true;
        player.playerView.pengBtn.grayed = true;
        player.playerView.huBtn.grayed = true;

        player.resetAllStatus();

        let buttonMap: boolean = false;
        if (!player.cancelZhuochong) {
            const hu = room.mAlgorithm.canHu_WithOther(player.tilesHand, reply.card);
            if (hu.length > 0) {
                buttonMap = true;
                player.m_bSaveZCHFlag = true;
                player.playerView.huBtn.grayed = false;
            }
        }
        Logger.debug(`room.tilesInWall  , ${room.tilesInWall} ; players ：, ${room.roomInfo.players.length}`);
        const isCanGang = room.tilesInWall > room.roomInfo.players.length + 1; //最后几张不可杠
        if (isCanGang) {
            const gang = room.mAlgorithm.canGang_WithOther(player.tilesHand, reply.card);
            if (gang.length > 0) {
                buttonMap = true;
                player.canKongs = gang;
                player.playerView.gangBtn.grayed = false;
            }
        }
        Logger.debug(`reply.card , ${reply.card} ; player.notPong ：, ${player.notPong}`);
        if (player.notPong !== reply.card) {
            const peng = room.mAlgorithm.canPeng_WithOther(player.tilesHand, reply.card);
            if (peng.length > 0) {
                buttonMap = true;
                player.isCanPong = true;
                player.playerView.pengBtn.grayed = false;
            }
        }
        if (buttonMap) {
            room.lastDisCardTile = reply.card;
            player.playerView.skipBtn.grayed = false;
            player.playerView.showButton();
        }
    };

}
