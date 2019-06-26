import { Logger } from "../../lobby/lcore/LCoreExports";
import { proto } from "../../lobby/protoHH/protoHH";
import { RoomInterface } from "../RoomInterface";
import { Player } from "../Player";

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
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_drawcard.decode(msgData);
        Logger.debug("HandlerActionResultDraw----------------------- ", reply);
        // const tilesFlower = actionResultMsg.newFlowers;
        // const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);
        // const drawTile = actionResultMsg.actionTile;
        // //本次抽牌如果有抽到花牌，则把花牌保存到player的花牌列表
        // //并显示出来
        // if (tilesFlower !== undefined && tilesFlower.length > 0) {
        //     for (const flower of tilesFlower) {
        //         const xf = [];
        //         player.playerView.showFlowerOnHandTail(flower);
        //         await player.playerView.playDrawFlowerAnimation();
        //         player.playerView.hideFlowerOnHandTail();
        //         xf.push(flower);
        //         player.addFlowerTiles(xf);
        //         player.flower2UI();
        //     }
        // }

        // //增加新抽到的牌到手牌列表
        // //显示的时候要摆在新抽牌位置
        // //enumTid_MAX+1是一个特殊标志，表明服务器已经没牌可抽
        // if (drawTile !== (proto.mahjong.TileID.enumTid_MAX + 1)) {
        player.addHandTile(reply.card);
        player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
        player.hand2UI(false);
        // }
        setTitleIsDiscard(player);

        room.setWaitingPlayer(player.chairID, reply.time);
        // room.tilesInWall = actionResultMsg.tilesInWall;
        // room.updateTilesInWallUI();

        // room.hideDiscardedTips();
    };
}
