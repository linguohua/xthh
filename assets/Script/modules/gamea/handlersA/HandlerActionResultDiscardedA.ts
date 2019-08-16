import { Dialog, Logger } from "../../lobby/lcore/LCoreExports";
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
            player.mPiaoCount++;
            if (player.mPiaoCount === 3) {
                //第一次提示
                const backPlayer = <PlayerA>room.getBackPlayer(player.chairID);
                if (!room.isReplayMode() && backPlayer.isMe() && room.roomInfo.room_id !== 2102) {
                    Dialog.prompt("下家飘赖达到3次，锁牌生效，您将被限制碰牌、点笑、小朝天操作");
                }
            }

            return;
        }
        if (room.roomInfo.flag === 1 && room.roomInfo.players.length > 2) {
            const myPlayer = <PlayerA>room.getMyPlayer();
            const nextPlayer = <PlayerA>room.getNextPlayer(myPlayer.chairID);
            const isSuoPiao = nextPlayer.mPiaoCount > 2;
            if (isSuoPiao) {
                let str = "";
                if (myPlayer.notPong !== reply.card) {
                    const peng = room.mAlgorithm.canPeng_WithOther(myPlayer.tilesHand, reply.card);
                    if (peng.length > 0) {
                        str = `碰牌`;
                    }
                }
                const isCanGang = room.tilesInWall > room.roomInfo.players.length; //最后几张不可杠 (赖根除外 因为朝天不摸牌)
                if (isCanGang || reply.card === room.laigenID) {
                    const gang = room.mAlgorithm.canGang_WithOther(myPlayer.tilesHand, reply.card);
                    if (gang.length > 0) {
                        if (reply.card === room.laigenID) {
                            str = `${str} 小朝天`;
                        } else {
                            str = `${str} 点笑`;
                        }
                    }
                }
                if (str !== "") {
                    if (room.isReplayMode()) {
                        // const backPlayer = <PlayerA>room.getBackPlayer(player.chairID);
                        Dialog.prompt(`【${nextPlayer.mNick}】飘赖${nextPlayer.mPiaoCount}次，【${myPlayer.mNick}】限制【碰牌/点笑/小朝天】`);
                    } else {
                        Dialog.prompt(`下家飘赖${nextPlayer.mPiaoCount}次，限制【${str}】`);
                    }
                }
            }
        }
    };
}
