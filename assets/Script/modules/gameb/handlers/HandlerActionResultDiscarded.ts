import { Player } from "../Player";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器打牌通知
 */
export namespace HandlerActionResultDiscarded {
    export const onMsg = async (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface): Promise<void> => {
        const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);
        const discardTileId = actionResultMsg.actionTile;

        const me = room.getMyPlayer();
        const isMe = player.isMe();
        const isReplayMode = room.isReplayMode();
        if (!isMe || isReplayMode) {
            player.discardOutTileID(discardTileId);
        }
        if (isMe && !isReplayMode) {

            return;
        }
        //清理吃牌界面
        room.cleanUI();
        //加到打出牌列表
        player.addDicardedTile(discardTileId);
        player.discarded2UI(true, actionResultMsg.waitDiscardReAction);

        // if (isMe) {

        //     return;
        // }
        //如果打出去的牌是在本人的听牌列表中，要做一个减法
        const readyHandList = me.readyHandList;
        if (readyHandList !== undefined && readyHandList !== null && readyHandList.length > 0) {
            for (let i = 0; i < me.readyHandList.length; i += 2) {
                if (readyHandList[i] === discardTileId) {
                    if (readyHandList[i + 1] > 1) {
                        readyHandList[i + 1] = readyHandList[i + 1] - 1;
                    } else {
                        readyHandList.splice(i, 2);
                        // table.remove(readyHandList, i + 1);
                        // table.remove(readyHandList, i);
                    }
                    me.readyHandList = readyHandList;
                    break;
                }
            }
        }
    };
}
