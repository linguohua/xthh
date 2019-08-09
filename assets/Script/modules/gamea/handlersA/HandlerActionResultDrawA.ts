import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { PlayerA } from "../PlayerA";
import { RoomInterfaceA } from "../RoomInterfaceA";

/**
 * 响应服务器抽牌通知
 */
export namespace HandlerActionResultDrawA {
    // const setTitleIsDiscard = (player: Player): void => {
    //     if (!player.isMe()) {
    //         return;
    //     }
    //     const playerView = player.playerView;
    //     const handsClickCtrls = playerView.handsClickCtrls;
    //     for (let i = 0; i < 14; i++) {
    //         const handsClickCtrl = handsClickCtrls[i];
    //         const tileID = handsClickCtrl.tileID;
    //         // const discardAbleTile = discarAbleTilesMap[tileID];
    //         if (tileID !== null) {
    //             // if (discardAbleTile !== undefined) {
    //             handsClickCtrl.isDiscardable = true;
    //             // let readyHandList = discardAbleTile.readyHandList;
    //             // if (readyHandList === undefined || readyHandList === null || readyHandList.length === 0) { //加入可听列表，空表示不可听
    //             //     readyHandList = [];
    //             // }
    //             // handsClickCtrl.t.visible = readyHandList.length > 0;
    //             // handsClickCtrl.readyHandList = readyHandList;
    //             // } else {
    //             //     handsClickCtrl.isGray = true;
    //             //     playerView.setGray(handsClickCtrl.h);
    //             //     handsClickCtrl.isDiscardable = false;
    //             // }
    //         }
    //     }
    // };

    const checkButton = (room: RoomInterfaceA, player: PlayerA, reply: proto.casino_gdy.packet_sc_drawcard): boolean => {
        player.resetAllStatus();
        player.playerView.skipBtn.grayed = true;
        player.playerView.gangBtn.grayed = true;
        player.playerView.pengBtn.grayed = true;
        player.playerView.huBtn.grayed = true;

        let buttonMap: boolean = false;
        if (reply.card !== 0 && player.cancelZiMo === false) {
            const hu = room.mAlgorithm.canHuPai(player.tilesHand);
            if (hu.length > 0) {
                buttonMap = true;
                player.playerView.huBtn.grayed = false;
            }
        }
        const isCanGang = room.tilesInWall > room.roomInfo.players.length; //最后几张不可杠
        if (isCanGang || reply.card === room.laigenID) {
            const gang = room.mAlgorithm.haveGang_WithMe(player.tilesHand, player.tilesMelds, player.notKongs, reply.card);
            if (gang.length > 0) {
                buttonMap = true;
                player.canKongs = gang;
                player.playerView.gangBtn.grayed = false;
            }
        }
        if (buttonMap) {
            // player.lastDisCardTile = reply.card;
            player.playerView.skipBtn.grayed = false;
            player.playerView.showButton();

            return true;
        }

        return false;
    };

    export const onMsg = async (msgData: ByteBuffer, room: RoomInterfaceA): Promise<void> => {
        const reply = proto.casino_gdy.packet_sc_drawcard.decode(msgData);
        Logger.debug("HandlerActionResultDraw----------------------- ", reply);
        // const tilesFlower = actionResultMsg.newFlowers;
        // const targetChairID = actionResultMsg.targetChairID;
        const player = <PlayerA>room.getPlayerByUserID(`${reply.player_id}`);

        room.setWaitingPlayer(player.chairID, reply.time);

        //增加新抽到的牌到手牌列表
        if (reply.card === 0 && player.isMe()) {
            //朝天笑 碰完之后也会到这来
        } else if (reply.card !== 0) {
            room.mAlgorithm.mahjongTotal_lower();

            player.addHandTile(reply.card);
            player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
            player.hand2UI(false);

            player.notPong = 0; //重置弃碰
            //牌墙更新
            room.tilesInWall--;
            room.updateTilesInWallUI();
        }
        room.lastDisCardTile = 0;
        if (player.isMe()) {
            room.isMySelfDisCard = true;
            player.cancelZhuochong = false;
            if (!room.isReplayMode()) {
                room.setDiscardAble(!checkButton(room, player, reply));
            }
        } else {
            room.isMySelfDisCard = false;
        }
        // room.updateTilesInWallUI();

        // room.hideDiscardedTips();
    };
}
