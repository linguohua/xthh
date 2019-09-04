import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 解散
 */
export namespace HandlerMsgTableChatA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const chat = proto.casino.packet_table_chat.decode(msgData);
        Logger.debug("HandlerMsgTableChatA----------------------- ", chat);
        room.showMsg(chat);
    };
}
