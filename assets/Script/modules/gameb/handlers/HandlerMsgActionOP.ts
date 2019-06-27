import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { ButtonDef } from "../PlayerInterface";
import { RoomInterface } from "../RoomInterface";

/**
 * 服务器询问玩家操作
 */
export namespace HandlerMsgActionOP {

    const haveGangOrPong = (tile: number, player: Player): number => {
        //这里还要考虑 癞子等其他情况 先不写
        const tilesHand = player.tilesHand;
        let num = 0;
        for (const t of tilesHand) {
            if (t === tile) {
                num++;
            }
        }

        return num;
    };
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_op.decode(msgData);
        Logger.debug("HandlerMsgActionOP----------------------- ", reply);
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);
        if (!player.isMe()) {
            return;
        }
        const gpNum = haveGangOrPong(reply.card, player);
        const buttonMap: string[] = [];
        switch (gpNum) {
            case 2:
                //碰
                buttonMap.push(ButtonDef.Pong);
                break;
            case 3:
                //杠
                buttonMap.push(ButtonDef.Kong);
                break;
            default:
            //没得操作
        }
        if (buttonMap.length > 0) {
            buttonMap.push(ButtonDef.Skip);
            player.playerView.showButton(buttonMap);
            player.lastOutTile = reply.card;
        }
    };

}
