import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应donate通知
 */
export namespace HandlerMsgDonate {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const msgDonate = proto.mahjong.MsgDonate.decode(msgData);
        room.showDonate(msgDonate);
    };
}
