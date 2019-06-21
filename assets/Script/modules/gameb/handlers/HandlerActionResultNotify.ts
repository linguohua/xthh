import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";
import { HandlerActionResultChow } from "./HandlerActionResultChow";
import { HandlerActionResultDiscarded } from "./HandlerActionResultDiscarded";
import { HandlerActionResultDraw } from "./HandlerActionResultDraw";
import { HandlerActionResultKongConcealed } from "./HandlerActionResultKongConcealed";
import { HandlerActionResultKongExposed } from "./HandlerActionResultKongExposed";
import { HandlerActionResultPong } from "./HandlerActionResultPong";
import { HandlerActionResultReadyHand } from "./HandlerActionResultReadyHand";
import { HandlerActionResultTriplet2Kong } from "./HandlerActionResultTriplet2Kong";

type ActionHandler = (actionResultMsg: proto.mahjong.MsgActionResultNotify, room: RoomInterface) => Promise<void>;
const actionType = proto.mahjong.ActionType;
const actionHandlers: { [key: number]: ActionHandler } = {
    [actionType.enumActionType_CHOW]: HandlerActionResultChow.onMsg,
    [actionType.enumActionType_DRAW]: HandlerActionResultDraw.onMsg,
    [actionType.enumActionType_KONG_Concealed]: HandlerActionResultKongConcealed.onMsg,
    [actionType.enumActionType_KONG_Exposed]: HandlerActionResultKongExposed.onMsg,
    [actionType.enumActionType_PONG]: HandlerActionResultPong.onMsg,
    [actionType.enumActionType_KONG_Triplet2]: HandlerActionResultTriplet2Kong.onMsg,
    [actionType.enumActionType_DISCARD]: HandlerActionResultDiscarded.onMsg,
    [actionType.enumActionType_FirstReadyHand]: HandlerActionResultReadyHand.onMsg
};

/**
 * 响应服务器动作结果通知
 */
export namespace HandlerActionResultNotify {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const actionResultMsg = proto.mahjong.MsgActionResultNotify.decode(msgData);
        const action = actionResultMsg.action;
        const handler = actionHandlers[action];

        if (handler !== undefined) {
            await handler(actionResultMsg, room);
        } else {
            Logger.debug("HandlerActionResultNotify failed, no action handler for:", action);
        }

        // 起手听牌比较特殊，因为服务器是每收到一个起手听，立即广播给其他人
        // 因此如果本玩家还处于选择起手听状态，那么不应该把操作面板关闭
        // 其他情况，既然本人或者其他用户做出了选择，那么应该确保操作面板是关闭的
        if (action === proto.mahjong.ActionType.enumActionType_FirstReadyHand) {
            // local myPlayer = room.myPlayer
            // myPlayer.playerView:hideOperationButtons()
        }
    };
}
