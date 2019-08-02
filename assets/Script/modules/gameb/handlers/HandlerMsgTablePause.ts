import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 等待玩家操作
 */
export namespace HandlerMsgTablePause {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const d = proto.casino.packet_table_pause.decode(msgData);
        Logger.debug("HandlerMsgTablePause----------------------- ", d);

        if (d.quit_time !== undefined && d.quit_time !== null) {
            room.showGamePauseTips(d.quit_time.toNumber());
        } else {
            room.hideGamePauseTips();
        }

    };
}
