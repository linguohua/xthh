import { GameError } from "../../lobby/errorCode/ErrorCodeExports";
import { Dialog, Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 解散
 */
export namespace HandlerMsgSearchAckA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const searchAck = proto.casino.packet_search_ack.decode(msgData);
        if (searchAck.ret !== 0) {
            Dialog.showDialog(GameError.getErrorString(searchAck.ret));

            return;
        }

        Logger.debug("HandlerMsgSearchAckA----------------------- ", searchAck);
        room.onSearchPlayerAck(searchAck);
    };
}
