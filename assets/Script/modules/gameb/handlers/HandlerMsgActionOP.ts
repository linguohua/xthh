import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { ButtonDef } from "../PlayerInterface";
import { RoomInterface } from "../RoomInterface";

// const enum opNumType {
//     Chow = 1,
//     Pong = 2,
//     Kong = 3,
//     Ting = 4,
//     Skip = 5,
//     Hu = 6,
//     Zhua = 7
// }
/**
 * 服务器询问玩家操作
 */
export namespace HandlerMsgActionOP {
    // const haveGangOrPong = (tile: number, player: Player): number => {
    //     //这里还要考虑 癞子等其他情况 先不写
    //     const tilesHand = player.tilesHand;
    //     let num = 0;
    //     for (const t of tilesHand) {
    //         if (t === tile) {
    //             num++;
    //         }
    //     }

    //     return num;
    // };
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_op.decode(msgData);
        Logger.debug("HandlerMsgActionOP----------------------- ", reply);
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);
        if (!player.isMe()) {
            return;
        }
        const buttonMap: string[] = [];
        // const gpNum = haveGangOrPong(reply.card, player);
        // switch (gpNum) {
        //     case opNumType.Pong:
        //         //碰
        //         buttonMap.push(ButtonDef.Pong);
        //         break;
        //     case opNumType.Kong:
        //         //杠
        //         buttonMap.push(ButtonDef.Kong);
        //         break;
        //     default:
        //     //没得操作
        // }
        const hu = player.canHu_WithOther(room.mAlgorithm, reply.card);
        if (hu.length > 0) {
            buttonMap.push(ButtonDef.Hu);
        }
        const gang = player.canGang_WithOther(room.mAlgorithm, reply.card);
        if (gang.length > 0) {
            let curNeedCards = 3;
            if (reply.card === room.mAlgorithm.getMahjongFan()) {
                curNeedCards = curNeedCards - 1;
            }
            if (room.mAlgorithm.mahjongTotal_get() > curNeedCards) {
                buttonMap.push(ButtonDef.Kong);
            }
        }
        const peng = player.canPeng_WithOther(room.mAlgorithm, reply.card);
        if (peng.length > 0) {
            buttonMap.push(ButtonDef.Pong);
        }
        if (buttonMap.length > 0) {
            buttonMap.push(ButtonDef.Skip);
            player.playerView.showButton(buttonMap);
            player.lastOutTile = reply.card;
        }
    };

}
