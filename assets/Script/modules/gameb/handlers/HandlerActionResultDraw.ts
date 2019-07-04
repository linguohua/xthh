import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { Player } from "../Player";
import { ButtonDef } from "../PlayerInterface";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器抽牌通知
 */
export namespace HandlerActionResultDraw {
    const setTitleIsDiscard = (player: Player): void => {
        if (!player.isMe()) {
            return;
        }
        const playerView = player.playerView;
        const handsClickCtrls = playerView.handsClickCtrls;
        for (let i = 0; i < 14; i++) {
            const handsClickCtrl = handsClickCtrls[i];
            const tileID = handsClickCtrl.tileID;
            // const discardAbleTile = discarAbleTilesMap[tileID];
            if (tileID !== null) {
                // if (discardAbleTile !== undefined) {
                handsClickCtrl.isDiscardable = true;
                // let readyHandList = discardAbleTile.readyHandList;
                // if (readyHandList === undefined || readyHandList === null || readyHandList.length === 0) { //加入可听列表，空表示不可听
                //     readyHandList = [];
                // }
                // handsClickCtrl.t.visible = readyHandList.length > 0;
                // handsClickCtrl.readyHandList = readyHandList;
                // } else {
                //     handsClickCtrl.isGray = true;
                //     playerView.setGray(handsClickCtrl.h);
                //     handsClickCtrl.isDiscardable = false;
                // }
            }
        }
    };

    const checkButton = (room: RoomInterface, player: Player, reply: proto.casino_xtsj.packet_sc_drawcard) => {
        const buttonMap: string[] = [];
        const hu = room.mAlgorithm.canHu_WithOther(player.tilesHand, reply.card);
        if (hu.length > 0) {
            buttonMap.push(ButtonDef.Hu);
        }
        const gang = room.mAlgorithm.haveGang_WithMe(player.tilesHand, player.melds, player.notKongs, reply.card);
        if (gang.length > 0) {
            player.canKongs = gang;
            buttonMap.push(ButtonDef.Kong);
        }
        if (buttonMap.length > 0) {
            player.lastDisCardTile = reply.card;
            buttonMap.push(ButtonDef.Skip);
            player.playerView.showButton(buttonMap);
        }
    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_drawcard.decode(msgData);
        Logger.debug("HandlerActionResultDraw----------------------- ", reply);
        // const tilesFlower = actionResultMsg.newFlowers;
        // const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);

        room.setWaitingPlayer(player.chairID, reply.time);
        if (player.isMe()) {
            checkButton(room, player, reply);
        }
        //增加新抽到的牌到手牌列表
        if (reply.card === 0 && player.isMe()) {
            //朝天笑
        } else if (reply.card !== 0) {
            room.mAlgorithm.mahjongTotal_lower();

            player.addHandTile(reply.card);
            player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
            player.hand2UI(false);

            player.notPong = 0; //重置弃碰
        }

        setTitleIsDiscard(player);
        // room.tilesInWall = actionResultMsg.tilesInWall;
        // room.updateTilesInWallUI();

        // room.hideDiscardedTips();
    };
}
