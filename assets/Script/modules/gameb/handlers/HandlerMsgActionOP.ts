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
            room.m_bOPSelf = false;

            return;
        }
        room.m_bOPSelf = true;
        const buttonMap: string[] = [];
        room.m_bSaveZCHFlag = false;
        room.m_bSaveOPGFlag = false;
        room.m_nSaveOPGMahjong = 0;
        room.m_bSaveOPPFlag = false;
        room.m_nSaveOPPMahjong = 0;
        const hu = player.canHu_WithOther(room.mAlgorithm, reply.card);
        if (hu.length > 0) {
            room.m_bSaveZCHFlag = true;
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
                room.m_bSaveOPGFlag = true;
                room.m_nSaveOPGMahjong = gang[0];
            }
        }
        const peng = player.canPeng_WithOther(room.mAlgorithm, reply.card);
        if (peng.length > 0) {
            buttonMap.push(ButtonDef.Pong);
            room.m_bSaveOPPFlag = true;
            room.m_nSaveOPPMahjong = gang[0];
        }
        if (buttonMap.length > 0) {
            buttonMap.push(ButtonDef.Skip);
            player.playerView.showButton(buttonMap);
            room.m_nLastOutMahjong = reply.card;
        }
    };

}
