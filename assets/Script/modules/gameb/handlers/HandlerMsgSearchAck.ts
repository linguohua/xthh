import { GameError } from "../../lobby/errorCode/ErrorCodeExports";
import { Dialog, Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 解散
 */
export namespace HandlerMsgSearchAck {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const searchAck = proto.casino.packet_search_ack.decode(msgData);
        if (searchAck.ret !== 0) {
            Dialog.showDialog(GameError.getErrorString(searchAck.ret));

            return;
        }

        Logger.debug("HandlerMsgSearchAck----------------------- ", searchAck);
        room.onSearchPlayerAck(searchAck);
    };
}
