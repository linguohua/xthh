import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器整个牌局结束通知
 */
export namespace HandlerMsgGameOver {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        Logger.debug("HandlerMsgGameOver");
        const msgGameOver = proto.mahjong.MsgGameOver.decode(msgData);

        // 显示游戏最后结果()
        room.loadGameOverResultView(msgGameOver);
    };
}
