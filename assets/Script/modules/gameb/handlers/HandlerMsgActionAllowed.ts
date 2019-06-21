import { Logger } from "../../lobby/lcore/LCoreExports";
import { Player } from "../Player";
import { ButtonDef } from "../PlayerInterface";
import { proto } from "../proto/protoGame";
import { RoomInterface } from "../RoomInterface";

/**
 * 响应服务器请求客户端动作
 */
export namespace HandlerMsgActionAllowed {
    export const showButton = (needShowOperationButtons: boolean, p: Player, buttonMap: string[]): void => {
        if (needShowOperationButtons) {
            p.waitSkip = true; //这个标志用来判断可否出牌，当点击了动作按钮之后flagsAction会设置为true，这时候才可以出牌
            p.playerView.showButton(buttonMap);
        }
    };

    const processMyAllowedActions =
        (msg: proto.mahjong.MsgAllowPlayerAction, p: Player): void => {
            const actions = msg.allowedActions;
            p.allowedActionMsg = msg;
            p.allowedReActionMsg = null;
            p.updateReadyHandList(null);
            const playerView = p.playerView;
            let needShowOperationButtons = false;
            p.waitSkip = false;
            p.isGuoHuTips = false; // 过胡牌提示只有在胡和过同时存在才是true，任何情况都为false
            const at = proto.mahjong.ActionType;
            const buttonMap: string[] = [];
            if ((actions & at.enumActionType_CustomB) !== 0) {//如果可以抓牌
                Logger.debug("llwant, can zhua");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Zhua);
                p.waitSkip = true;
            }
            if ((actions & at.enumActionType_FirstReadyHand) !== 0) { //如果可以起手听牌
                Logger.debug("llwant, can ready hand");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Ting);
                p.waitSkip = true; //这个标志用来判断可否出牌，当点击了动作按钮之后flagsAction会设置为true，这时候才可以出牌
            }
            if ((actions & at.enumActionType_SKIP) !== 0) {//如果可以过
                Logger.debug("llwant, can skip");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Skip);
            }
            if ((actions & at.enumActionType_KONG_Concealed) !== 0) {//如果可以暗杠
                Logger.debug("llwant, can concealed kong");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Kong);
            }
            if ((actions & at.enumActionType_KONG_Triplet2) !== 0) {//如果可以加杠
                Logger.debug("llwant, can triplet2 kong");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Kong);
            }
            if ((actions & at.enumActionType_WIN_SelfDrawn) !== 0) { //如果可以自摸胡牌
                Logger.debug("llwant, can win self drawn");
                needShowOperationButtons = true;
                buttonMap.push(ButtonDef.Hu);
            }
            if ((actions & at.enumActionType_WIN_SelfDrawn) !== 0) {// 可胡牌时，需要点击2次过才可过牌。
                if ((actions & at.enumActionType_SKIP) !== 0) {
                    p.isGuoHuTips = true; // 放弃胡牌，点击过时的提示开关
                }
            }
            //出牌
            if ((actions & at.enumActionType_DISCARD) !== 0) {//TODO: 设置打出后有牌可听的牌一个“听”标志 设置那些不能打的牌，一个黄色遮罩
                const discarAbleTilesMap = [];
                const discarAbleTiles = msg.tipsForAction;
                for (const discardAbleTile of discarAbleTiles) {
                    discarAbleTilesMap[discardAbleTile.targetTile] = discardAbleTile;
                }
                const handsClickCtrls = playerView.handsClickCtrls;
                if (p.isRichi) {
                    for (let i = 0; i < 14; i++) {
                        const handsClickCtrl = handsClickCtrls[i];
                        handsClickCtrl.isDiscardable = false;
                        handsClickCtrl.isGray = true;
                        playerView.setGray(handsClickCtrl.h);
                    }
                    const handsClickCtrl14 = handsClickCtrls[13];
                    handsClickCtrl14.isDiscardable = true;
                    if (discarAbleTiles[1].readyHandList.length < 1) {
                        handsClickCtrl14.t.visible = false;
                    } else {
                        handsClickCtrl14.t.visible = true;
                    }
                } else {//检查所有可以打出的牌，并设置其点击控制isDiscardable为true，以便玩家可以点击
                    for (let i = 0; i < 14; i++) {
                        const handsClickCtrl = handsClickCtrls[i];
                        const tileID = handsClickCtrl.tileID;
                        const discardAbleTile = discarAbleTilesMap[tileID];
                        if (tileID !== null) {
                            if (discardAbleTile !== undefined) {
                                handsClickCtrl.isDiscardable = true;
                                let readyHandList = discardAbleTile.readyHandList;
                                if (readyHandList === undefined || readyHandList === null || readyHandList.length === 0) { //加入可听列表，空表示不可听
                                    readyHandList = [];
                                }
                                handsClickCtrl.t.visible = readyHandList.length > 0;
                                handsClickCtrl.readyHandList = readyHandList;
                            } else {
                                handsClickCtrl.isGray = true;
                                playerView.setGray(handsClickCtrl.h);
                                handsClickCtrl.isDiscardable = false;
                            }
                        }
                    }
                }
            }
            showButton(needShowOperationButtons, p, buttonMap);
        };
    export const onMsg = async (msgData: ByteBuffer, room: RoomInterface): Promise<void> => {
        const allowedActionMsg = proto.mahjong.MsgAllowPlayerAction.decode(msgData);
        // allowedActionMsg:ParseFromString(msg)

        const targetChairID = allowedActionMsg.actionChairID;
        const player = <Player>room.getPlayerByChairID(targetChairID);

        if (player.isMe()) {
            Logger.debug("llwant, my allowed action");
            processMyAllowedActions(allowedActionMsg, player);
        } else {
            //TODO: 如果是别人，则更新它的头像等待圈，以及提醒定时器
            Logger.debug("llwant, opponents allowed action");
        }

        //设置等待箭头
        room.setWaitingPlayer(player.chairID);

        if (player.isRichi && player.isMe()) {
            //听牌状态下，直接出牌，不等待
            player.autoDiscard();
        }
    };
}
