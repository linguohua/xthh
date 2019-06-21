import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

const mjproto2 = proto.mahjong.RoomDeleteReason;
const deletedReasons: { [key: number]: string } = {
    [mjproto2.IdleTimeout]: "房间空置时间过长，被解散",
    [mjproto2.DisbandByOwnerFromRMS]: "房间被房主解散",
    [mjproto2.DisbandByApplication]: "房间被申请解散",
    [mjproto2.DisbandBySystem]: "房间被系统解散",
    [mjproto2.DisbandMaxHand]: "房间已达到最大局数，被解散",
    [mjproto2.DisbandInLoseProtected]: "房间已有足够人进园子，牌局被解散"
};

/**
 * 响应服务器删除房间
 */
export namespace HandlerMsgDeleted {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        room.isDestroy = true;

        const msgDelete = proto.mahjong.MsgRoomDelete.decode(msgData);
        let reason = deletedReasons[msgDelete.reason];
        if (reason === undefined) {
            reason = "房间已解散";
        }
        Logger.debug("room deleted reason:", reason);

        room.quit();
    };
}
