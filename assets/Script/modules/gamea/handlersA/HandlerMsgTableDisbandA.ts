import { Logger } from "../../lobby/lcore/LCoreExports";
// import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 解散
 */
export namespace HandlerMsgTableDisbandA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        // const reply = proto.casino.packet_table_disban.decode(msgData);
        Logger.debug("HandlerMsgTableDisband----------------------- ", msgData);

        const isShow = room.roomView.showCountDownIfReadViewShow();
        if (isShow) {
            await room.coWaitSeconds(3);
        }

        room.quit();
    };
}
