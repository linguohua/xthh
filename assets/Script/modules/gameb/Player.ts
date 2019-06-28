import { Logger, SoundMgr } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { ChatData } from "../lobby/views/chat/ChatExports";
import { PlayerInfoView } from "../lobby/views/playerInfo/PlayerInfoExports";
import { AgariIndex } from "./AgariIndex";
import { TypeOfOP } from "./PlayerInterface";
import { PlayerView } from "./PlayerView";
import { proto } from "./proto/protoGame";
import { PlayerInfo, RoomInterface } from "./RoomInterface";
// const playerInfoView = require "lobby/scripts/playerInfo/playerInfoView"
const mjproto = proto.mahjong;
const SoundDef: { [key: number]: string } = {
    // Chow = "chi",
    // Ting = "ting",
    [TypeOfOP.Pong]: "peng",
    [TypeOfOP.Kong]: "gang",
    [TypeOfOP.CHAOTIAN]: "hu", //被点炮
    [TypeOfOP.Hu]: "zimo" //自摸
    // Common = "effect_common"
}

//特效文件定义
const EffectsDef: { [key: number]: string } = {
    [TypeOfOP.Pong]: "Effect_zi_peng",
    [TypeOfOP.Kong]: "Effect_zi_gang",
    [TypeOfOP.CHAOTIAN]: "Effect_zi_dianpao", //被点炮
    [TypeOfOP.Hu]: "Effect_zi_zimo" //自摸
    // Chow = "Effect_zi_chi",
    // Ting = "ting",
    // DrawCard = "Effect_zi_zhua"
}

/**
 * Player表示一个玩家，只有进入房间才会新建Player
 * 每个Player首先有其对应的牌数据（其中手牌是不公开的），然后是其对应的界面节点
 */
export class Player {
    public readonly userID: string;
    public readonly chairID: number;
    public readonly host: RoomInterface;
    public playerScore: number;
    public lastTile: number;
    public tilesDiscarded: number[];
    public melds: protoHH.casino_xtsj.packet_sc_op_ack[];
    public tilesFlower: number[];
    public tilesHand: number[];
    public isRichi: boolean;
    public tileCountInHand: number;
    public totalScores: number;
    public playerView: PlayerView;
    //设置一个标志，表示已经点击了动作按钮（吃碰杠胡过）
    public waitSkip: boolean;

    public state: number;
    public playerInfo: PlayerInfo;
    public waitDiscardReAction: boolean;
    public readyHandList: number[];

    public allowedReActionMsg: proto.mahjong.MsgAllowPlayerReAction;
    public allowedActionMsg: proto.mahjong.MsgAllowPlayerAction;
    public isGuoHuTips: boolean;

    public lastOutTile: number; //别人最后打出的牌(可用来 碰杠胡)
    private flagsTing: boolean;
    public constructor(userID: string, chairID: number, host: RoomInterface) {
        this.userID = userID;
        this.chairID = chairID;
        this.host = host;

        this.resetForNewHand();

    }

    // public isMyUserId(userID: string): boolean {
    //     return this.userID === userID;
    // }

    public resetForNewHand(): void {
        //玩家打出的牌列表
        this.tilesDiscarded = [];
        //玩家的面子牌组列表
        this.melds = [];
        //玩家的花牌列表
        this.tilesFlower = [];

        //是否起手听牌
        //TODO. 当玩家起手听牌时，当仅仅可以打牌操作时，自动打牌
        this.isRichi = false;

        //如果玩家对象是属于当前用户的，而不是对手的
        //则有手牌列表，否则只有一个数字表示对手的手牌张数
        if (this.isMe()) {
            this.tilesHand = [];
            this.tileCountInHand = -1;
        } else {
            this.tileCountInHand = 0;
            this.tilesHand = null;
        }

        //如果视图存在，则重置视图
        if (this.playerView != null) {
            this.playerView.resetForNewHand();
        }
    }

    //player对象是当前用户的，抑或是对手的
    public isMe(): boolean {
        return this.host.isMe(this.userID);
    }

    public addHandTile(tileID: number): void {
        if (this.tilesHand != null) {
            this.tilesHand.push(tileID);
        } else {
            this.tileCountInHand = this.tileCountInHand + 1;
        }
    }

    //根据规则排序手牌
    public sortHands(excludeLast: boolean): void {
        if (this.tilesHand != null) {
            let last: number;
            if (excludeLast) {
                last = this.tilesHand.pop();
            }
            this.tilesHand.sort((x: number, y: number) => {
                return y - x;
            });
            if (excludeLast) {
                this.tilesHand.push(last);
            }
        }
    }

    public addDicardedTile(tileID: number): void {
        this.tilesDiscarded.push(tileID);
    }

    public addDiscardedTiles(tiles: number[]): void {
        for (const t of tiles) {
            this.tilesDiscarded.push(t);
        }
    }

    //从手牌列表中删除一张牌
    //如果是对手player，则仅减少计数，因
    //对手玩家并没有手牌列表
    public removeTileFromHand(tileID: number): void {
        if (this.tilesHand != null) {
            for (let i = 0; i < this.tilesHand.length; i++) {
                if (this.tilesHand.hasOwnProperty(i)) {
                    const element = this.tilesHand[i];
                    if (element === tileID) {
                        this.tilesHand.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            this.tileCountInHand = this.tileCountInHand - 1;
        }
    }

    //从打出的牌列表中移除最后一张
    //@param tileID 最后一张牌的id，用于assert
    public removeLatestDiscarded(tileID: number): void {
        //从队列尾部删除

        const removed = this.tilesDiscarded.pop();
        if (removed !== tileID) {
            Logger.debug("llwant, removed.", removed, ",expected.", tileID);
        }
    }

    //新增花牌
    //@param tiles 新增加的花牌列表
    public addFlowerTiles(tiles: number[]): void {
        for (const tile of tiles) {
            this.tilesFlower.push(tile);
        }
    }
    //增加多个手牌
    public addHandTiles(tiles: number[]): void {
        for (const tile of tiles) {
            this.tilesHand.push(tile);
        }
    }

    //增加一个落地面子牌组
    public addMeld(meld: protoHH.casino_xtsj.packet_sc_op_ack): void {
        //插入到队列尾部
        if (meld === null) {
            return;
        }
        this.melds.push(meld);
    }
    public addMeldOfCards(cards: number[]): void {
        //插入到队列尾部
        if (cards === undefined || cards === null || cards.length === 0) {
            return;
        }
        let meldCard = cards[0];
        let opAck = new protoHH.casino_xtsj.packet_sc_op_ack();
        opAck.cards = [];
        for (const card of cards) {
            if (card === meldCard) {
                opAck.cards.push(meldCard);
            } else {
                if (opAck.cards.length === 3) {
                    opAck.op = TypeOfOP.Pong;
                } else if (opAck.cards.length === 4) {
                    opAck.op = TypeOfOP.Kong;
                }
            }
        }
        // this.melds.push(meld);
    }

    //利用服务器发下来的暗杠牌组的id列表（明牌）
    //更新本地的暗杠牌组列表
    public refreshConcealedMelds(concealedKongIDs: number[]): void {
        // let i = 0;
        // for (const m of this.melds) {
        //     if (m.meldType === mjproto.MeldType.enumMeldTypeConcealedKong) {
        //         m.tile1 = concealedKongIDs[i];
        //         i = i + 1;
        //     }
        // }
    }

    //增加多个落地面子牌组
    public addMelds(melds: protoHH.casino_xtsj.packet_sc_op_ack[]): void {
        for (const v of melds) {
            this.melds.push(v);
        }
    }

    //获取一个落地面子牌组
    public getMeld(tileID: number, meldType: number): protoHH.casino_xtsj.packet_sc_op_ack {
        for (const v of this.melds) {
            if (v.cards[0] === tileID && v.op === meldType) {

                return v;
            }
        }

        return null;
    }

    //把手牌列表显示到界面上
    //对于自己的手牌，需要排序显示，排序仅用于显示
    //排序并不修改手牌列表
    //如果房间当前是回播，则其他的人的牌也明牌显示
    public hand2UI(wholeMove: boolean): void {
        //先取消所有手牌显示
        const playerView = this.playerView;
        playerView.hideHands();
        if (this.isMe()) {
            this.playerView.showHandsForMe(wholeMove);
        } else {
            if (this.host.isReplayMode()) {
                playerView.hand2Exposed(wholeMove);
            } else {
                playerView.showHandsForOpponents(this.tileCountInHand);
            }
        }
    }

    //把牌摊开
    public hand2Exposed(): void {
        const playerView = this.playerView;
        playerView.hideHands();

        playerView.hand2Exposed(false);
    }

    //把花牌列表显示到界面上
    public flower2UI(): void {
        //先取消所有花牌显示
        this.playerView.hideFlowers();
        this.playerView.showFlowers();
    }

    //把打出的牌列表显示到界面上
    public discarded2UI(newDiscard: boolean, waitDiscardReAction: boolean): void {
        this.playerView.showDiscarded(newDiscard, waitDiscardReAction);
    }

    //隐藏打出的牌提示
    public hideDiscardedTips(): void {
        if (!this.waitDiscardReAction) {
            return;
        }
        this.waitDiscardReAction = false;
        const discardTips = this.playerView.discardTips;
        discardTips.visible = false;
    }

    //听牌标志
    public richiIconShow(showOrHide: boolean): void {
        this.isRichi = showOrHide;
        const playerView = this.playerView;
        playerView.head.ting.visible = showOrHide;
    }
    //播放动画
    public async exposedResultAnimation(t: number): Promise<void> {
        if (this.isMe()) {
            //隐藏牌组
            this.playerView.hideHands();
            this.playerView.showHandsForMe(true);
        }

        //播放对应音效
        this.playSound("gameb/operate", SoundDef[t]);
        await this.playerView.playerOperationEffect(EffectsDef[t]);
    }

    //播放读牌音效
    public playReadTileSound(tileID: number): void {
        const index = AgariIndex.tileId2ArtId(tileID);
        const id = +index;
        if (id >= 51 && id <= 58) {
            // this.playSound("gameb/operate", "hua")
        } else {
            let effectName = `tile${id}`;
            if (id === 11) {
                // Math.newrandomseed()
                effectName = `tile${id}_${1}`; //, id, Math.random(1, 2, 3));
            } else if (id === 29) {
                // math.newrandomseed()
                effectName = `tile${id}_${1}`; // id, math.random(1, 2));
            }
            this.playSound("gameb/tile", effectName);
        }
    }

    //绑定playerView
    //主要是关联playerView，以及显示playerVIew
    public bindView(playerView: PlayerView): void {
        this.playerView = playerView;
        playerView.player = this;
        playerView.initCardLists();

        playerView.showPlayerInfo(this.playerInfo);
        playerView.showOwner();
    }

    //解除绑定playerView    //主要是取消关联playerView，以及隐藏playerVIew
    public unbindView(): void {
        const playerView = this.playerView;
        if (playerView != null) {
            playerView.player = null;
            this.playerView = null;
            playerView.hideAll();
        }
    }

    public updateByPlayerInfo(playerInfo: protoHH.casino.Itable_player, chairID: number): void {
        this.state = playerInfo.status;
        this.playerInfo = new PlayerInfo(playerInfo, chairID);
    }

    public discardOutTileID(tileID: number): void {
        //从手牌移除
        this.removeTileFromHand(tileID);

        //排一下序, sortHands会根据tilesHand表格是否为nil，做出排序选择
        this.sortHands(false);

        //更新UI
        this.hand2UI(false);

        //出牌音效
        // dfCompatibleAPI.soundPlay("effect/effect_chupai")
        //播放读牌音效
        // if dfCompatibleAPI. soundGetToggle("readPaiIsOn") {
        this.playReadTileSound(tileID);
        //}
    }

    // public onBankerReadyHandClicked(): boolean {
    //     //检查是否选择了牌打出去
    //     const handsClickCtrls = this.playerView.handsClickCtrls;
    //     for (let i = 1; i < 14; i++) {
    //         const clickCtrl = handsClickCtrls[i];
    //         if (!clickCtrl.isNormalState) {
    //             //检查选择了的牌是否可以听
    //             if (clickCtrl.readyHandList !== undefined && clickCtrl.readyHandList !== null && clickCtrl.readyHandList.length > 0) {
    //                 //如果此牌可以听
    //                 //发送打牌的消息包，把flag设置1，服务器就知道庄家选择了打牌并且听牌
    //                 const actionMsg = new proto.mahjong.MsgPlayerAction();
    //                 actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
    //                 actionMsg.action = mjproto.ActionType.enumActionType_DISCARD;
    //                 actionMsg.tile = clickCtrl.tileID;
    //                 actionMsg.flags = 1;

    //                 //修改：出牌后立即放大打出的牌，一直等待服务器的回复
    //                 this.myDiscardAction(clickCtrl.tileID);

    //                 const tipsForAction = this.allowedActionMsg.tipsForAction;
    //                 for (const t of tipsForAction) {
    //                     if (t.targetTile === clickCtrl.tileID) {
    //                         const readyHandList = t.readyHandList;
    //                         this.updateReadyHandList(readyHandList);
    //                         break;
    //                     }
    //                 }
    //                 this.sendActionMsg(actionMsg);

    //                 return true;
    //             } else {
    //                 //TODA 请选择一张可听的牌
    //                 //logError("请选择一张可听的牌")
    //                 //dfCompatibleAPI. showTip("请选择一张可听的牌")
    //                 return false;
    //             }

    //             // return false
    //         }
    //     }

    //     return false;
    // }

    //玩家选择了起手听牌   （选择“听”按钮// > 隐藏所有动作按钮// > 不可听的牌灰度处理// > 接下来打出的牌就是听牌）
    //上下文必然是allowedActionMsg
    public onReadyHandBtnClick(): void {
        //隐藏所有动作按钮
        this.playerView.hideOperationButtons();

        if (this.host.getBankerChairID() === this.chairID) {
            //庄家起手听
            //不可听的牌灰度处理
            const handsClickCtrls = this.playerView.handsClickCtrls;
            for (let i = 1; i < 14; i++) {
                const handsClickCtrl = handsClickCtrls[i];
                const tileID = handsClickCtrl.tileID;
                if (tileID != null) {
                    handsClickCtrl.isDiscardable = handsClickCtrl.t.visible;
                    if (!handsClickCtrl.t.visible) {
                        handsClickCtrl.isGray = true;
                        this.playerView.setGray(handsClickCtrl.h);
                    }
                }
            }
            //设置一个标志，接下来打牌就看这个标志
            this.flagsTing = true;
            //设置一个标志，表示已经点击了动作按钮（吃碰杠胡过）
            this.waitSkip = false;
        } else {
            //玩家起手听
            const actionMsg = new proto.mahjong.MsgPlayerAction();
            actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
            actionMsg.action = mjproto.ActionType.enumActionType_FirstReadyHand;
            actionMsg.flags = 1; //0表示不起手听牌

            this.sendActionMsg(actionMsg);
        }
    }

    public onFinalDrawBtnClick(): void {
        //const host = this.host
        if (this.allowedActionMsg != null) {
            const actionMsg = new proto.mahjong.MsgPlayerAction();
            actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
            actionMsg.action = mjproto.ActionType.enumActionType_CustomB;
            this.sendActionMsg(actionMsg);
        }

        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了吃牌    //上下文必然是allowedReActionMsg
    public onChowBtnClick(): void {
        //const host = this.host
        if (this.allowedReActionMsg != null) {
            const actionMsg = new proto.mahjong.MsgPlayerAction();
            actionMsg.qaIndex = this.allowedReActionMsg.qaIndex;
            actionMsg.action = mjproto.ActionType.enumActionType_CHOW;

            //必然只有一个可以碰的面子牌组
            //TODO. 吃牌可以有多种吃法
            const ss = this.allowedReActionMsg.meldsForAction;
            const chowMelds = this.selectMeldFromMeldsForAction(ss, mjproto.MeldType.enumMeldTypeSequence);
            //logger.debug("chowMelds . ", chowMelds)
            actionMsg.tile = this.allowedReActionMsg.victimTileID;
            if (chowMelds.length > 1) {
                this.host.showOrHideMeldsOpsPanel(chowMelds, actionMsg);
            } else {
                actionMsg.meldType = chowMelds[0].meldType;
                actionMsg.meldTile1 = chowMelds[0].tile1;
                this.sendActionMsg(actionMsg);
            }
        }
        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了碰牌    //上下文必然是allowedReActionMsg
    public onPongBtnClick(): void {
        // if (this.allowedReActionMsg != null) {
        //     const actionMsg = new proto.mahjong.MsgPlayerAction();
        //     actionMsg.qaIndex = this.allowedReActionMsg.qaIndex;
        //     actionMsg.action = mjproto.ActionType.enumActionType_PONG;

        //     //必然只有一个可以碰的面子牌组
        //     const ss = this.allowedReActionMsg.meldsForAction;
        //     const pongMelds = this.selectMeldFromMeldsForAction(ss, mjproto.MeldType.enumMeldTypeTriplet);
        //     actionMsg.tile = this.allowedReActionMsg.victimTileID;
        //     actionMsg.meldType = pongMelds[0].meldType;
        //     actionMsg.meldTile1 = pongMelds[0].tile1;

        //     this.sendActionMsg(actionMsg);
        // }
        const req2 = new protoHH.casino_xtsj.packet_cs_op_req({ player_id: +this.userID });
        req2.cancel_type = -1;
        req2.op = TypeOfOP.Pong;
        const buf = protoHH.casino_xtsj.packet_cs_op_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了杠牌
    //当上下文是allowedActionMsg时，表示加杠或者暗杠
    //当上下文是allowedReActionMsg时，表示明杠
    public onKongBtnClick(): void {
        //const host = this.host

        // if (this.allowedActionMsg != null) {
        //     const actionMsg = new proto.mahjong.MsgPlayerAction();
        //     //确定是加杠还是暗杠
        //     // if proto.actionsHasAction(this.allowedActionMsg.allowedActions, mjproto.enumActionType_KONG_Concealed) {
        //     //action = mjproto.enumActionType_KONG_Concealed
        //     //}
        //     actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
        //     const ss = this.allowedActionMsg.meldsForAction;
        //     const kConcealed = this.selectMeldFromMeldsForAction(ss, mjproto.MeldType.enumMeldTypeConcealedKong);
        //     const kongTriplet2 = this.selectMeldFromMeldsForAction(ss, mjproto.MeldType.enumMeldTypeTriplet2Kong);
        //     const kongs = [];
        //     let action = mjproto.ActionType.enumActionType_KONG_Triplet2;
        //     if (kConcealed.length > 0) {
        //         action = mjproto.ActionType.enumActionType_KONG_Concealed;
        //         for (const v of kConcealed) {
        //             kongs.push(v);
        //         }
        //     }
        //     if (kongTriplet2.length > 0) {
        //         for (const v of kongTriplet2) {
        //             kongs.push(v);
        //         }
        //     }

        //     if (kongs.length > 1) {
        //         this.host.showOrHideMeldsOpsPanel(kongs, actionMsg);
        //     } else {
        //         actionMsg.action = action;
        //         //无论是加杠，或者暗杠，肯定只有一个面子牌组
        //         actionMsg.tile = kongs[0].tile1;
        //         actionMsg.meldType = kongs[0].meldType;
        //         actionMsg.meldTile1 = kongs[0].tile1;
        //         this.sendActionMsg(actionMsg);
        //     }
        // } else if (this.allowedReActionMsg != null) {
        //     const actionMsg = new proto.mahjong.MsgPlayerAction();
        //     actionMsg.qaIndex = this.allowedReActionMsg.qaIndex;
        //     actionMsg.action = mjproto.ActionType.enumActionType_KONG_Exposed;

        //     //必然只有一个可以明杠的牌组
        //     const ss = this.allowedReActionMsg.meldsForAction;
        //     const kMelds = this.selectMeldFromMeldsForAction(ss, mjproto.MeldType.enumMeldTypeExposedKong);
        //     actionMsg.tile = this.allowedReActionMsg.victimTileID;
        //     actionMsg.meldType = kMelds[0].meldType;
        //     actionMsg.meldTile1 = kMelds[0].tile1;

        //     this.sendActionMsg(actionMsg);
        // }

        const req2 = new protoHH.casino_xtsj.packet_cs_op_req({ player_id: +this.userID });
        req2.cancel_type = -1;
        req2.op = TypeOfOP.Kong;
        const buf = protoHH.casino_xtsj.packet_cs_op_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了胡牌
    //当上下文是allowedActionMsg时，表示自摸胡牌
    //当上下文是allowedReActionMsg时，表示吃铳胡牌
    public onWinBtnClick(): void {
        //const host = this.host

        if (this.allowedActionMsg != null) {
            const actionMsg = new proto.mahjong.MsgPlayerAction();
            actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
            actionMsg.action = mjproto.ActionType.enumActionType_WIN_SelfDrawn;

            this.sendActionMsg(actionMsg);
        } else if (this.allowedReActionMsg != null) {
            const actionMsg = new proto.mahjong.MsgPlayerAction();
            actionMsg.qaIndex = this.allowedReActionMsg.qaIndex;
            actionMsg.action = mjproto.ActionType.enumActionType_WIN_Chuck;
            actionMsg.tile = this.allowedReActionMsg.victimTileID;

            this.sendActionMsg(actionMsg);
        }

        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了过
    //当上下文是allowedActionMsg时，表示不起手听牌
    //当上下文是allowedReActionMsg时，表示不吃椪杠胡
    public onSkipBtnClick(): void {
        // if (this.isGuoHuTips) {
        //     //dfCompatibleAPI. showTip("可胡牌时，需要点击2次过才可过牌。")
        //     this.isGuoHuTips = false;
        // } else {
        //     let discardAble = false;
        //     if (this.allowedActionMsg != null) {
        //         const allowedActions = this.allowedActionMsg.allowedActions;
        //         discardAble = true;
        //         if ((allowedActions & mjproto.ActionType.enumActionType_FirstReadyHand) !== 0) {
        //             if (this.host.getBankerChairID() !== this.chairID) {
        //                 const actionMsg = new proto.mahjong.MsgPlayerAction();
        //                 actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
        //                 //这里action换成enumActionType_FirstReadyHand而不是skip
        //                 actionMsg.action = mjproto.ActionType.enumActionType_FirstReadyHand;
        //                 actionMsg.flags = 0; //0表示不起手听牌

        //                 this.sendActionMsg(actionMsg);
        //                 discardAble = false;
        //             }
        //         } else if ((allowedActions & mjproto.ActionType.enumActionType_SKIP) !== 0) {
        //             if ((allowedActions & mjproto.ActionType.enumActionType_DISCARD) === 0) {
        //                 const actionMsg = new proto.mahjong.MsgPlayerAction();
        //                 actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
        //                 actionMsg.action = mjproto.ActionType.enumActionType_SKIP;

        //                 this.sendActionMsg(actionMsg);

        //                 discardAble = false;
        //             }
        //         }
        //     } else if (this.allowedReActionMsg != null) {
        //         const actionMsg = new proto.mahjong.MsgPlayerAction();
        //         actionMsg.qaIndex = this.allowedReActionMsg.qaIndex;
        //         actionMsg.action = mjproto.ActionType.enumActionType_SKIP;

        //         this.sendActionMsg(actionMsg);
        //     }

        //     this.playerView.clearAllowedActionsView(discardAble);
        //     //重置手牌位置
        //     this.playerView.restoreHandsPositionAndClickCount(-1);
        //     //设置一个标志，表示已经点击了动作按钮（吃碰杠胡过）
        //     this.waitSkip = false;
        const req2 = new protoHH.casino_xtsj.packet_cs_op_req({ player_id: +this.userID });
        req2.cancel_type = -1;
        req2.op = TypeOfOP.Kong;
        const buf = protoHH.casino_xtsj.packet_cs_op_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
        //重置手牌位置
        this.playerView.restoreHandsPositionAndClickCount(-1);

    }

    //执行自动打牌操作
    public autoDiscard(): void {
        if (this.allowedActionMsg != null) {
            //自己摸牌的情况下
            const actions = this.allowedActionMsg.allowedActions;
            //如果可以自摸胡牌
            //不再自动胡牌，考虑到如果可以胡，可以过，如果帮助用户选择胡可能不是最优选择
            if ((actions & mjproto.ActionType.enumActionType_WIN_SelfDrawn) !== 0) {
                //this. onWinBtnClick(this.playerView.winBtn)
                //可以胡牌，得返回，让用户自己处理
                return;
            }
            //如果不可以胡牌
            const discarAbleTiles = this.allowedActionMsg.tipsForAction;
            if (discarAbleTiles.length === 1) {
                //当且仅当可出牌数为1的时候，才能执行自动打牌
                const discarAbleTile = discarAbleTiles[1];
                const tileID = discarAbleTile.targetTile;
                this.onPlayerDiscardTile(tileID);
                this.playerView.clearAllowedActionsView(false);
            }
        }

        // if this.allowedReActionMsg != null {
        //当有可以吃碰杠胡的情况
        //自动打牌只处理可以胡的情况，考虑到如果可以胡，可以过，如果帮助用户选择胡可能不是最优选择
        //const actions = this.allowedReActionMsg.allowedActions
        // if proto.actionsHasAction(actions, mjproto.enumActionType_WIN_Chuck) {
        //this. onWinBtnClick(this.playerView.winBtn)
        //}
        //}
    }

    public onPlayerDiscardTile(tileID: number): boolean {
        //const host = this.host
        // if (this.allowedActionMsg != null) {
        //     this.discardToDeskOfMe(tileID);
        //     const actionMsg = new proto.mahjong.MsgPlayerAction();
        //     actionMsg.qaIndex = this.allowedActionMsg.qaIndex;
        //     actionMsg.action = mjproto.ActionType.enumActionType_DISCARD;
        //     actionMsg.tile = tileID;
        //     if (this.flagsTing) {
        //         actionMsg.flags = 1;
        //         this.flagsTing = false;
        //     }
        //     this.sendActionMsg(actionMsg);
        //     //修改：出牌后立即放大打出的牌，一直等待服务器的回复
        //     this.myDiscardAction(tileID);

        //     const tipsForAction = this.allowedActionMsg.tipsForAction;
        //     for (const t of tipsForAction) {
        //         if (t.targetTile === tileID) {
        //             const readyHandList = t.readyHandList;
        //             this.updateReadyHandList(readyHandList);
        //             break;
        //         }
        //     }
        // }
        this.discardToDeskOfMe(tileID);
        this.myDiscardAction(tileID);
        const req2 = new protoHH.casino_xtsj.packet_cs_outcard_req({ player_id: +this.userID, card: tileID });
        const buf = protoHH.casino_xtsj.packet_cs_outcard_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_CS_OUTCARD_REQ);

        return true;
    }

    /**
     * name
     */
    public getPlayInfo(): PlayerInfo {
        return this.playerInfo;
    }

    public updateReadyHandList(readyHandList: number[]): void {
        this.readyHandList = readyHandList;
        if (this.readyHandList !== undefined && this.readyHandList !== null && this.readyHandList.length > 0) {
            this.playerView.checkReadyHandBtn.visible = true;
        } else {
            this.playerView.checkReadyHandBtn.visible = false;
        }
    }
    public onChatMsg(chatData: ChatData): void {
        if (chatData.buildinId !== undefined && chatData.buildinId !== "") {
            //播放快捷语音效
            this.playSound("commonLanguage", `speak${chatData.buildinId}`);
        }
        this.playerView.showChatMsg(chatData.msg);
    }
    public onPlayerInfoClick(): void {
        // const pos = { x = this.playerView.userInfoPos.x, y = this.playerView.userInfoPos.y }
        // playerInfoView.showUserInfoView(this.playerInfo, pos, this.isMe() == false, this.host)

        const pos = new cc.Vec2(this.playerView.getUserInfoPos().x, this.playerView.getUserInfoPos().y);
        // const pos = new cc.Vec2(0, 0);
        // const playerInfoString = JSON.stringify(this.playerInfo);
        // playerInfoView.showUserInfoView(self.playerInfo, pos, self:isMe() == false)

        const roomHost = this.host.getRoomHost();
        if (roomHost === null) {
            Logger.debug("roomHost === null");
        }

        let playerInfoView = roomHost.component.getComponent(PlayerInfoView);
        if (playerInfoView === null) {
            playerInfoView = roomHost.component.addComponent(PlayerInfoView);
        }

        playerInfoView.showUserInfoView(roomHost.getLobbyModuleLoader(), this.host, this.playerInfo, pos, this.isMe() === false);
    }
    private playSound(directory: string, effectName: string): void {
        if (effectName === undefined || effectName === null) {
            return;
        }
        let soundName = "";
        if (this.playerInfo.gender === 1) {
            soundName = `${directory}/boy/${effectName}`;
        } else {
            soundName = `${directory}/girl/${effectName}`;
        }
        SoundMgr.playEffectAudio(soundName);
    }

    private myDiscardAction(tileID: number): void {
        this.discardOutTileID(tileID);
        this.playerView.enlargeDiscarded(tileID, true);
    }
    private selectMeldFromMeldsForAction(ms: proto.mahjong.IMsgMeldTile[], ty: number): proto.mahjong.IMsgMeldTile[] {
        const r: proto.mahjong.IMsgMeldTile[] = [];
        for (const m of ms) {
            if (m.meldType === ty) {
                r.push(m);
            }
        }

        return r;
    }

    private discardToDeskOfMe(discardTileId: number): void {
        //自己打出去的牌 先显示到桌面  服务器回复之后 就不再操作桌面了
        //清理吃牌界面
        this.host.cleanUI();
        //加到打出牌列表
        this.addDicardedTile(discardTileId);
        this.discarded2UI(true, false);
    }

    private sendActionMsg(actionMsg: proto.mahjong.MsgPlayerAction): void {
        const actionMsgBuf = proto.mahjong.MsgPlayerAction.encode(actionMsg);
        // this.host.sendActionMsg(actionMsgBuf);
    }
}
