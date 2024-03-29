import { Logger } from "../../lobby/lcore/LCoreExports";
// import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 解散
 */
export namespace HandlerMsgTableDisband {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        // const reply = proto.casino.packet_table_disban.decode(msgData);
        Logger.debug("HandlerMsgTableDisband----------------------- ", msgData);

        const isShow = room.roomView.showCountDownIfReadViewShow();
        if (isShow) {
            await room.coWaitSeconds(3);
        }

        room.quit();
    };
}
