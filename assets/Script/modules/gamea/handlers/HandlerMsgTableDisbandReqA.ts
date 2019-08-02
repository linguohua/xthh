import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 解散请求
 */
export namespace HandlerMsgTableDisbandReqA {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const disbandReq = proto.casino.packet_table_disband_req.decode(msgData);
        Logger.debug("HandlerMsgTableDisbandReq----------------------- ", disbandReq);

        //保存到room到，以便重复点击申请解散按钮进而显示
        room.updateDisbandVoteView(disbandReq, null);
    };
}
