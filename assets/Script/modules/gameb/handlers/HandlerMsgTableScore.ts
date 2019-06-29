import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";

/**
 * 结算
 */
export namespace HandlerMsgTableScore {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino.packet_table_score.decode(msgData);
        Logger.debug("HandlerMsgTableScore----------------------- ", reply);
        //大结算也是走这里 这时候要判断。。。  解散的时候 会显示大结算界面
        // 不解散的时候 用局数判断显示哪个界面  play_total game_config
        // 显示手牌输赢结果
        room.loadHandResultView(reply);
    };
}
