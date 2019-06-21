import { DataStore } from "../../lobby/lcore/LCoreExports";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器返回大厅通知
 */
export namespace HandlerMsg2Lobby {
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        // TODO:
        //g_dataModule: SaveDataByKey("RoomInfo", room.roomInfo);

        const roomInfo = room.roomInfo;
        const roomInfoData = {
            roomID: roomInfo.roomID,
            roomNumber: roomInfo.roomNumber,
            config: roomInfo.config,
            gameServerID: roomInfo.gameServerID
        };

        const roomInfoDataStr = JSON.stringify(roomInfoData);

        DataStore.setItem("RoomInfoData", roomInfoDataStr);
        room.quit();
    };
}
