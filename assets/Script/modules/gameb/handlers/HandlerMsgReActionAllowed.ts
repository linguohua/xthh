import { Logger } from "../../lobby/lcore/LCoreExports";
import { Player } from "../Player";
import { ButtonDef } from "../PlayerInterface";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器请求客户端动作
 */
export namespace HandlerMsgReActionAllowed {
    const processMyAllowedActions =
        (msg: proto.mahjong.MsgAllowPlayerReAction, p: Player): void => {
            const actions = msg.allowedActions;
            p.allowedReActionMsg = msg;
            p.allowedActionMsg = null;
            const playerView = p.playerView;
            let needShowOperationButtons = false;
            p.waitSkip = false;
            p.isGuoHuTips = false; // 过胡牌提示只有在胡和过同时存在才是true，任何情况都为false
            const at = proto.mahjong.ActionType;
            const buttonMap: string[] = [];
            if ((actions & at.enumActionType_CHOW) !== 0) {//如果可以吃
                Logger.debug("llwant, can chow");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Chow);
            }
            if ((actions & at.enumActionType_PONG) !== 0) { //如果可以碰
                Logger.debug("llwant, can peng");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Pong);
            }
            if ((actions & at.enumActionType_KONG_Exposed) !== 0) {//如果可以明杠
                Logger.debug("llwant, can concealed kong");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Kong);
            }
            if ((actions & at.enumActionType_WIN_Chuck) !== 0) {//如果可以吃铳胡牌
                Logger.debug("llwant, can win chuck");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Hu);
            }
            if ((actions & at.enumActionType_SKIP) !== 0) {//如果可以过
                Logger.debug("llwant, can skip");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Skip);
            }
            if ((actions & at.enumActionType_WIN_SelfDrawn) !== 0) {// 可胡牌时，需要点击2次过才可过牌。
                if ((actions & at.enumActionType_SKIP) !== 0) {
                    p.isGuoHuTips = true; // 放弃胡牌，点击过时的提示开关
                }
            }
            if (needShowOperationButtons) {
                playerView.showButton(buttonMap);
            }
        };
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const allowedReActionMsg = proto.mahjong.MsgAllowPlayerReAction.decode(msgData);

        const targetChairID = allowedReActionMsg.actionChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);

        if (player.isMe()) {
            Logger.debug("llwant, my allowed action");
            processMyAllowedActions(allowedReActionMsg, player);
        } else {
            //TODO: 如果是别人，则更新它的头像等待圈，以及提醒定时器
            Logger.debug("llwant, opponents allowed action");
        }

        //设置等待箭头
        room.setWaitingPlayer(player.chairID);
    };
}
