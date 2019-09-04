import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 解散
 */
export namespace HandlerMsgTableChat {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const chat = proto.casino.packet_table_chat.decode(msgData);
        Logger.debug("HandlerMsgTableChat----------------------- ", chat);
        room.showMsg(chat);
    };
}
