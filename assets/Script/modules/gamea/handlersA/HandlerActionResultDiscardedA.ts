import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 响应服务器打牌通知
 */
export namespace HandlerActionResultDiscardedA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino_gdy.packet_sc_outcard_ack.decode(msgData);
        Logger.debug("HandlerMsgActionOutcardAck----------------------- ", reply);
        const player = <PlayerA>room.getPlayerByUserID(`${reply.player_id}`);

        // const targetChairID = actionResultMsg.targetChairID;
        // const player = <Player>room.getPlayerByChairID(targetChairID);
        const discardTileId = reply.card;

        // const me = room.getMyPlayer();
        const isMe = player.isMe();
        const isReplayMode = room.isReplayMode();
        if (!isMe || isReplayMode) {
            player.discardOutTileID(discardTileId);
        }
        if (isMe) {
            player.cancelZiMo = false;
            room.showOrHideCancelCom(false);
            //清理界面
            player.playerView.clearAllowedActionsView(false);
        }
        //清理吃牌界面
        room.cleanUI();
        //加到打出牌列表
        player.addDicardedTile(discardTileId);
        const isPiao = room.mAlgorithm.getMahjongLaiZi() === reply.card;
        player.discarded2UI(true, false, isPiao);

        //有人飘赖子
        if (isPiao) {
            // await player.exposedResultAnimation(1002, true);
            room.mAlgorithm.setFlagPiao(true);
        }
    };
}