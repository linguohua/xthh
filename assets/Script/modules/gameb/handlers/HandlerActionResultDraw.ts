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
    const checkGangWithChaoTian = (player: Player, room: RoomInterface): void => {
        const array = room.mAlgorithm.canGangPai_withAll(player.tilesHand, player.melds, player.m_sForgoGang);
        //底牌大于最后牌剩余牌数量才能做杠牌判断
        //朝天 不需要补牌 所以可以少一张牌
        if (array.length > 0) {
            let curNeedCards = 3;
            if (array[0] === room.mAlgorithm.getMahjongFan()) {
                curNeedCards = curNeedCards - 1;
            }
            if (room.mAlgorithm.mahjongTotal_get() > curNeedCards) {
                if (player.isInForgoGang(array[0])) {
                    player.m_bSaveOPGFlag = false;
                    player.m_nSaveOPGMahjong = 0;
                } else {
                    // self:setSameMahjongWithMyMahjongs( array[1])
                    player.m_bSaveOPGFlag = true;
                    player.m_nSaveOPGMahjong = array[1];
                    // player.m_pBut_Type[DEF_XTSJ_BUT_TYPE_GANG]:setGrey( false)
                    // self.m_pBut_Text[DEF_XTSJ_BUT_TYPE_GANG]:setGrey( false)

                    const buttonMap: string[] = [ButtonDef.Pong, ButtonDef.Skip];
                    player.playerView.showButton(buttonMap);
                }
            }
        }
    };
    //回合思考
    const roundMyThink = (player: Player, room: RoomInterface): void => {
        player.m_bCanOutMahjong = true; // 可以选择出牌
        player.m_bSaveZCHFlag = false;
        player.m_bSaveOPGFlag = false;
        player.m_nSaveOPGMahjong = 0;
        player.m_bSaveOPPFlag = false;
        player.m_nSaveOPPMahjong = 0;
        if (!player.canAutoPutCard) {
            return;
        }
        const buttonMap: string[] = [];
        if (room.mAlgorithm.canHuPai(player.tilesHand).length > 0) {
            buttonMap.push(ButtonDef.Hu);
        }
        //底牌大于最后牌剩余牌数量才能做杠牌判断
        const array = room.mAlgorithm.canGangPai_withAll(player.tilesHand, player.melds, player.m_sForgoGang);
        if (array.length > 0) {
            let curNeedCards = 3;
            if (array[0] === room.mAlgorithm.getMahjongFan()) {
                curNeedCards = curNeedCards - 1;
            }
            if (room.mAlgorithm.mahjongTotal_get() > curNeedCards) {
                if (player.isInForgoGang(array[0])) {
                    player.m_bSaveOPGFlag = false;
                    player.m_nSaveOPGMahjong = 0;
                } else {
                    player.m_bSaveOPGFlag = true;
                    player.m_nSaveOPGMahjong = array[1];
                    buttonMap.push(ButtonDef.Kong);
                }
            }
        }
        player.playerView.showButton(buttonMap);
    };
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const reply = proto.casino_xtsj.packet_sc_drawcard.decode(msgData);
        Logger.debug("HandlerActionResultDraw----------------------- ", reply);
        // const tilesFlower = actionResultMsg.newFlowers;
        // const targetChairID = actionResultMsg.targetChairID;
        const player = <Player>room.getPlayerByUserID(`${reply.player_id}`);

        room.m_bOPSelf = false;
        if (player.isMe()) {
            player.setNotCatch(false);
        }
        room.setWaitingPlayer(player.chairID, reply.time);
        player.m_bCanOutMahjong = false;

        //增加新抽到的牌到手牌列表
        if (reply.card === 0 && player.isMe()) {
            //朝天笑
            checkGangWithChaoTian(player, room);
            player.m_bCanOutMahjong = true;
        } else if (reply.card !== 0) {
            room.mAlgorithm.mahjongTotal_lower();

            player.addHandTile(reply.card);
            player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
            player.hand2UI(false);
            if (player.isMe()) {
                player.m_bCanOutMahjong = true;
                if (room.mAlgorithm.mahjongTotal_get() >= 3) {
                    roundMyThink(player, room);
                }
            }
        }

        setTitleIsDiscard(player);
        // room.tilesInWall = actionResultMsg.tilesInWall;
        // room.updateTilesInWallUI();

        // room.hideDiscardedTips();
    };
}
