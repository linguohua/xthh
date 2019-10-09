import { Logger, SoundMgr } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { LocalStrings } from "../lobby/strings/LocalStringsExports";
import { PlayerInfoView } from "../lobby/views/playerInfo/PlayerInfoExports";
import { AgariIndexA } from "./AgariIndexA";
import { TypeOfOP } from "./PlayerInterfaceA";
import { PlayerViewA } from "./PlayerViewA";
import { PlayerInfo, RoomInterfaceA } from "./RoomInterfaceA";
// const playerInfoView = require "lobby/scripts/playerInfo/playerInfoView"
// const soundDef: { [key: number]: string } = {
//     // Chow = "chi",
//     // Ting = "ting",
//     [TypeOfOP.Pong]: "peng",
//     [TypeOfOP.Kong]: "gang",
//     [TypeOfOP.CHAOTIAN]: "hu", //被点炮
//     [TypeOfOP.Hu]: "zimo" //自摸
//     // Common = "effect_common"
// };

const eGDY_OP_TYPE = protoHH.casino_gdy.eGDY_OP_TYPE;

const soundDef: { [key: number]: string } = {
    [1001]: "peng", //碰
    [1002]: "飘赖", //飘赖
    [eGDY_OP_TYPE.GDY_OP_TYPE_DIANXIAO]: "dianxiao",
    [eGDY_OP_TYPE.GDY_OP_TYPE_HUITOUXIAO]: "huitouxiao",
    [eGDY_OP_TYPE.GDY_OP_TYPE_MENGXIAO]: "mengxiao",
    [eGDY_OP_TYPE.GDY_OP_TYPE_FANGXIAO]: "fangxiao",
    [eGDY_OP_TYPE.GDY_OP_TYPE_PIAOLAIZI]: "piaolaizi",
    [eGDY_OP_TYPE.GDY_OP_TYPE_ZHUOCHONG]: "zhuochong",
    [eGDY_OP_TYPE.GDY_OP_TYPE_QIANGXIAO]: "qiangxiao",
    [eGDY_OP_TYPE.GDY_OP_TYPE_XIAOHOUCHONG]: "xiaohouchong",
    [eGDY_OP_TYPE.GDY_OP_TYPE_BEIQIANGXIAO]: "beiqiangxiao",
    [eGDY_OP_TYPE.GDY_OP_TYPE_FANGCHONG]: "fangchong",
    [eGDY_OP_TYPE.GDY_OP_TYPE_RECHONG]: "rechong",
    [eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO]: "heimo",
    [eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO]: "ruanmo",
    [eGDY_OP_TYPE.GDY_OP_TYPE_HEIMOX2]: "heimo",
    [eGDY_OP_TYPE.GDY_OP_TYPE_RUANMOX2]: "ruanmo",
    [eGDY_OP_TYPE.GDY_OP_TYPE_FANGCHAOTIAN]: "fangchaotian",
    [eGDY_OP_TYPE.GDY_OP_TYPE_XIAOCHAOTIAN]: "xiaochaotian",
    [eGDY_OP_TYPE.GDY_OP_TYPE_DACHAOTIAN]: "dachaotian"
};

//特效文件定义
const effectsDef: { [key: number]: string } = {
    [1001]: "Effect_ico_peng", //碰 这个没定义
    [eGDY_OP_TYPE.GDY_OP_TYPE_DIANXIAO]: "Effect_ico_dianxiao", //点笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_MENGXIAO]: "Effect_ico_menxiao", //闷笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_HUITOUXIAO]: "Effect_ico_huitouxiao", //回头笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_XIAOCHAOTIAN]: "Effect_ico_xiaochaotian", //小朝天
    [eGDY_OP_TYPE.GDY_OP_TYPE_DACHAOTIAN]: "Effect_ico_dachaotian", //大朝天
    [eGDY_OP_TYPE.GDY_OP_TYPE_ZHUOCHONG]: "Effect_ico_zhuotong", //捉铳
    [eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO]: "Effect_ico_heimo", //黑摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_HEIMOX2]: "Effect_ico_heimo", //黑摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO]: "Effect_ico_ruanmo", //软摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_RUANMOX2]: "Effect_ico_ruanmo" //软摸
};

/**
 * Player表示一个玩家，只有进入房间才会新建Player
 * 每个Player首先有其对应的牌数据（其中手牌是不公开的），然后是其对应的界面节点
 */
export class PlayerA {
    public readonly userID: string;
    public readonly chairID: number;
    public readonly host: RoomInterfaceA;
    public playerScore: number;
    public lastTile: number;
    public tilesDiscarded: number[];
    public tilesMelds: protoHH.casino_gdy.packet_sc_op_ack[];
    public tilesFlower: number[];
    public tilesHand: number[];
    public replayTilesHand: number[];
    public isRichi: boolean;
    public tileCountInHand: number;
    public playerView: PlayerViewA;
    //设置一个标志，表示已经点击了动作按钮（吃碰杠胡过）
    public waitSkip: boolean;
    public state: number;
    public playerInfo: PlayerInfo;
    public coordinate: protoHH.casino.Icoordinate;
    public waitDiscardReAction: boolean;
    public readyHandList: number[];
    public isGuoHuTips: boolean;
    public notPong: number = 0; //弃碰 只会有一个 不需要列表
    public notKongs: number[] = []; //弃杠 起手有多杠的时候才会用到
    public canKongs: number[] = []; //可杠列表 起手有多杠的时候才会用到
    public cancelZhuochong: boolean = false; //弃捉冲
    public cancelZiMo: boolean = false; //弃自摸
    public isCanPong: boolean = false; //可以碰
    public mBSaveZCHFlag: boolean = false; //可以捉铳
    public totalScores: number = 0;
    public mNick: string = "";
    public mPiaoCount: number = 0;

    // private isPlayingVoice: boolean = false;
    // private flagsTing: boolean;
    public constructor(userID: string, chairID: number, host: RoomInterfaceA) {
        this.userID = userID;
        this.chairID = chairID;
        this.host = host;
        this.resetForNewHand();
    }

    // public isMyUserId(userID: string): boolean {
    //     return this.userID === userID;
    // }
    public resetAllStatus(): void {
        this.canKongs = [];
        this.isCanPong = false;
        this.mBSaveZCHFlag = false;
    }

    public resetForNewHand(): void {
        //玩家打出的牌列表
        this.tilesDiscarded = [];
        //玩家的面子牌组列表
        this.tilesMelds = [];
        //玩家的花牌列表
        this.tilesFlower = [];

        this.notPong = 0;
        this.notKongs = [];
        this.cancelZhuochong = false;
        this.cancelZiMo = false;

        this.mPiaoCount = 0;
        //是否起手听牌
        //TODO. 当玩家起手听牌时，当仅仅可以打牌操作时，自动打牌
        this.isRichi = false;
        this.resetAllStatus();
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
                if (x === this.host.laiziID) {
                    return 1;
                }
                if (y === this.host.laiziID) {
                    return -1;
                }

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

    //从出牌列表中删除一张牌
    public removeTileFromDiscard(tileID: number): boolean {
        if (this.tilesDiscarded != null) {
            for (let i = 0; i < this.tilesDiscarded.length; i++) {
                if (this.tilesDiscarded.hasOwnProperty(i)) {
                    const element = this.tilesDiscarded[i];
                    if (element === tileID) {
                        this.tilesDiscarded.splice(i, 1);

                        return true;
                    }
                }
            }
        }

        return false;
    }
    //从打出的牌列表中移除最后一张
    //@param tileID 最后一张牌的id，用于assert
    public removeLatestDiscarded(tileID: number): void {
        //从队列尾部删除
        if (this.tilesDiscarded.length > 0) {
            const removed = this.tilesDiscarded.pop();
            if (removed !== tileID) {
                this.tilesDiscarded.push(removed);
                Logger.debug("llwant, removed.", removed, ",expected.", tileID);
            }
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
        for (const tileID of tiles) {
            if (this.tilesHand != null) {
                this.tilesHand.push(tileID);
            } else {
                this.tileCountInHand = this.tileCountInHand + 1;
            }
        }
    }

    //增加一个落地面子牌组
    public addMeld(meld: protoHH.casino_gdy.packet_sc_op_ack): void {
        //插入到队列尾部
        if (meld === null) {
            return;
        }
        this.tilesMelds.push(meld);
    }
    public addMeldOfCards(cards: number[]): void {
        //插入到队列尾部
        if (cards === undefined || cards === null || cards.length === 0) {
            return;
        }
        const meldCard = cards[0];
        const opAck = new protoHH.casino_gdy.packet_sc_op_ack();
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
    public addMelds(melds: protoHH.casino_gdy.packet_sc_op_ack[]): void {
        for (const v of melds) {
            this.tilesMelds.push(v);
        }
    }

    //获取一个落地面子牌组
    public getMeld(tileID: number, meldType: number): protoHH.casino_gdy.packet_sc_op_ack {
        for (const v of this.tilesMelds) {
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
    public hand2Exposed(curcards: number[], isHeiMo: boolean): void {
        const playerView = this.playerView;
        playerView.hideHands();

        const newTiles1 = this.host.mAlgorithm.canHuPai_def(curcards, isHeiMo); //排序 胡牌的人
        // Logger.debug("this.tilesHand : ", this.tilesHand);
        const newTiles2: number[] = [];
        for (let i = newTiles1.length - 1; i >= 0; i--) {
            newTiles2.push(newTiles1[i]);
        }
        // newTiles2.push(newTiles1[newTiles1.length - 1]);
        this.tilesHand = newTiles2;
        playerView.hand2Exposed(false, true);
    }

    //把花牌列表显示到界面上
    public flower2UI(): void {
        //先取消所有花牌显示
        this.playerView.hideFlowers();
        this.playerView.showFlowers();
    }

    //把打出的牌列表显示到界面上
    public async discarded2UI(newDiscard: boolean, waitDiscardReAction: boolean, isPiao: boolean = false): Promise<void> {
        await this.playerView.showDiscarded(newDiscard, waitDiscardReAction, isPiao);
    }

    //隐藏打出的牌提示
    public hideDiscardedTips(): void {
        // if (!this.waitDiscardReAction) {
        //     return;
        // }
        // this.waitDiscardReAction = false;
        const discardTips = this.playerView.discardTips;
        discardTips.visible = false;
    }

    //听牌标志
    public richiIconShow(showOrHide: boolean): void {
        this.isRichi = showOrHide;
    }
    //播放动画
    public async exposedResultAnimation(t: number, isWait?: boolean): Promise<void> {
        if (this.isMe()) {
            //隐藏牌组
            // this.playerView.hideHands();
            // this.playerView.showHandsForMe(false);
        }
        // Logger.debug("exposedResultAnimation:", t);
        //播放对应音效
        this.playSound("gameb", `mj_${soundDef[t]}`);
        await this.playerView.playerOperationEffect(effectsDef[t], isWait);
    }

    //播放读牌音效
    public playReadTileSound(tileID: number): void {

        if (tileID === this.host.laiziID) {
            this.playSound("gameb", `mj_piao`);
        } else {
            this.playSound("gameb", `mj_${tileID}`);
        }
    }

    //绑定playerView
    //主要是关联playerView，以及显示playerVIew
    public bindView(playerView: PlayerViewA): void {
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

        Logger.debug("updateByPlayerInfo = playerInfo ", playerInfo);
        this.playerInfo = new PlayerInfo(playerInfo, chairID);
        if (this.playerInfo.scoreTotal !== null) {
            this.totalScores = this.playerInfo.scoreTotal;
        }

        let nick = "";
        if (playerInfo.channel_nickname !== undefined && playerInfo.channel_nickname !== null && playerInfo.channel_nickname !== "") {
            nick = playerInfo.channel_nickname;
        } else {
            nick = playerInfo.nickname;
        }

        if (nick === undefined || nick === "") {
            nick = this.playerInfo.userID;
        }
        //裁剪
        if (nick.length > 8) {
            nick = `${nick.substring(0, 8)}...`;
        }
        this.mNick = nick;
        this.coordinate = playerInfo.coord;
    }
    public piaoScore(num: number): void {
        this.totalScores += num;
        this.playerView.piaoScore(num);
        this.playerView.showScore();
    }
    public discardOutTileID(tileID: number): void {
        //从手牌移除
        this.removeTileFromHand(tileID);

        //排一下序, sortHands会根据tilesHand表格是否为nil，做出排序选择
        this.sortHands(false);

        //更新UI
        this.hand2UI(false);

        //出牌音效
        SoundMgr.playEffectAudio(`gameb/mj_out`);
        //播放读牌音效
        // if dfCompatibleAPI. soundGetToggle("readPaiIsOn") {
        this.playReadTileSound(tileID);
        //}
    }

    //玩家选择了碰牌    //上下文必然是allowedReActionMsg
    public onPongBtnClick(): void {
        const req2 = new protoHH.casino_gdy.packet_cs_op_req({ player_id: +this.userID });
        req2.cancel_type = -1;
        req2.op = TypeOfOP.Pong;
        req2.card = this.host.lastDisCardTile;
        const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
        this.host.lastDisCardTile = 0;
    }

    //玩家选择了杠牌
    //当上下文是allowedActionMsg时，表示加杠或者暗杠
    //当上下文是allowedReActionMsg时，表示明杠
    public onKongBtnClick(): void {
        const req2 = new protoHH.casino_gdy.packet_cs_op_req({ player_id: +this.userID });
        req2.cancel_type = -1;
        req2.op = TypeOfOP.Kong;
        req2.card = this.canKongs[0];
        const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了胡牌
    //当上下文是allowedActionMsg时，表示自摸胡牌
    //当上下文是allowedReActionMsg时，表示吃铳胡牌
    public onWinBtnClick(): void {
        const req2 = new protoHH.casino_gdy.packet_cs_op_req({ player_id: +this.userID });
        Logger.debug(" 胡 ： ", this.host.lastDisCardTile);
        if (this.host.lastDisCardTile !== 0) {
            req2.op = TypeOfOP.Hu;
        } else {
            req2.op = TypeOfOP.ZiMo;
        }
        const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
    }

    //玩家选择了过
    //当上下文是allowedActionMsg时，表示不起手听牌
    //当上下文是allowedReActionMsg时，表示不吃椪杠胡
    public onSkipBtnClick(): void {
        let curCancelType = -1;
        let curCancelCard = 0;
        const req2 = new protoHH.casino_gdy.packet_cs_op_req({ player_id: +this.userID });
        req2.op = TypeOfOP.Guo;
        //假如之前是杠牌并且有杠牌，并且之前也有碰并且也有碰牌
        let str = "";
        const giveUpXiao = LocalStrings.findString("giveUpXiao");
        const giveUpPeng = LocalStrings.findString("giveUpPeng");
        const giveUpZuoChong = LocalStrings.findString("giveUpZuoChong");
        const giveUpZimo = LocalStrings.findString("giveUpZimo");

        if (this.canKongs.length > 0 && this.isCanPong) {
            curCancelType = 2;
            curCancelCard = this.canKongs[0];
            str = `${AgariIndexA.tileId2Str(curCancelCard)} ${giveUpXiao} ${AgariIndexA.tileId2Str(curCancelCard)} ${giveUpPeng}`;
        } else if (this.canKongs.length > 0) {
            curCancelType = 0;
            curCancelCard = this.canKongs[0];
            str = `${AgariIndexA.tileId2Str(curCancelCard)} ${giveUpXiao}`;
        } else if (this.isCanPong) {
            curCancelType = 1;
            curCancelCard = this.host.lastDisCardTile;
            str = `${AgariIndexA.tileId2Str(curCancelCard)} ${giveUpPeng}`;
        }
        Logger.debug("curCancelType ---------------- : ", curCancelType);
        req2.cancel_type = curCancelType;
        req2.card = curCancelCard;
        //假如之前OP是捉铳
        if (this.mBSaveZCHFlag) {
            this.mBSaveZCHFlag = false;
            req2.op = TypeOfOP.BUZHUOCHONG;
            const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
            this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);
            str = `${str} ${giveUpZuoChong}`;
        } else if (this.host.lastDisCardTile !== 0) {
            const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
            this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);
        } else {
            // if (curCancelType !== -1 && curCancelCard !== 0) {
            const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
            this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);
            // }
        }
        if (str === "") {
            str = giveUpZimo;
        }
        this.host.showOrHideCancelCom(true, str);
        // const buf = protoHH.casino_gdy.packet_cs_op_req.encode(req2);
        // this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OP_REQ);

        this.playerView.clearAllowedActionsView(false);
        this.setDiscardAble(this.host.isMySelfDisCard); //轮到我的时候 要设置手牌可点
        //重置手牌位置
        this.playerView.restoreHandsPositionAndClickCount(-1);

        // if (this.isCanPong) {
        //     this.notPong = this.host.lastDisCardTile;
        // }
        // if (this.canKongs.length > 0) {
        //     this.notKongs = this.canKongs;
        // }
    }

    //执行自动打牌操作
    public autoDiscard(): void {
        // if (this.allowedActionMsg != null) {
        //     //自己摸牌的情况下
        //     const actions = this.allowedActionMsg.allowedActions;
        //     //如果可以自摸胡牌
        //     //不再自动胡牌，考虑到如果可以胡，可以过，如果帮助用户选择胡可能不是最优选择
        //     if ((actions & mjproto.ActionType.enumActionType_WIN_SelfDrawn) !== 0) {
        //         //this. onWinBtnClick(this.playerView.winBtn)
        //         //可以胡牌，得返回，让用户自己处理
        //         return;
        //     }
        //     //如果不可以胡牌
        //     const discarAbleTiles = this.allowedActionMsg.tipsForAction;
        //     if (discarAbleTiles.length === 1) {
        //         //当且仅当可出牌数为1的时候，才能执行自动打牌
        //         const discarAbleTile = discarAbleTiles[1];
        //         const tileID = discarAbleTile.targetTile;
        //         this.onPlayerDiscardTile(tileID);
        //         this.playerView.clearAllowedActionsView(false);
        //     }
        // }

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
        // this.discardToDeskOfMe(tileID);
        // this.myDiscardAction(tileID);
        const req2 = new protoHH.casino_gdy.packet_cs_outcard_req({ player_id: +this.userID, card: tileID });
        const buf = protoHH.casino_gdy.packet_cs_outcard_req.encode(req2);
        this.host.sendActionMsg(buf, protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_CS_OUTCARD_REQ);

        return true;
    }

    public setDiscardAble(isDiscardable: boolean): void {
        const playerView = this.playerView;
        const handsClickCtrls = playerView.handsClickCtrls;
        let isTing = false;
        for (let i = 0; i < 14; i++) {
            const handsClickCtrl = handsClickCtrls[i];
            const tileID = handsClickCtrl.tileID;
            if (tileID !== null) {
                handsClickCtrl.isDiscardable = isDiscardable;
                const readyHandList = this.host.myMahjong_showTingGroup(tileID);
                const isT = readyHandList.length > 0;
                handsClickCtrl.t.visible = isT;
                handsClickCtrl.readyHandList = readyHandList;
                if (isT) {
                    isTing = true;
                }
            }
        }
        this.isRichi = isTing;
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
            // this.playerView.checkReadyHandBtn.visible = true;
        } else {
            // this.playerView.checkReadyHandBtn.visible = false;
        }
    }
    public onChatMsg(chatData: protoHH.casino.packet_table_chat): void {
        let chatSound = `chat${chatData.chat_id}_m`;
        if (this.playerInfo.gender > 0) {
            chatSound = `chat${chatData.chat_id}_w`;
        }

        //播放快捷语音效
        SoundMgr.playEffectAudio(`gameb/${chatSound}`, false);
        this.playerView.showChatMsg(chatData);
    }
    public onPlayerInfoClick(): void {
        this.showPlayerInfoView();
    }

    public showPlayerInfoView(searchReq: protoHH.casino.packet_search_ack = null): void {
        const roomHost = this.host.getRoomHost();

        const roomHostComponent = roomHost.component;
        let playerInfoView = roomHostComponent.getComponent(PlayerInfoView);

        playerInfoView = (playerInfoView !== null && playerInfoView !== undefined) ?
            playerInfoView :
            roomHostComponent.addComponent(PlayerInfoView);

        playerInfoView.show(roomHost, this.playerInfo.userID, searchReq);
    }

    /**
     * 新增函数 end
     */
    //搜索指定牌数量在所有手牌中
    public getMahjongCount_withV(mahjong: number): number {
        let num = 0;
        for (const tile of this.tilesHand) {
            if (tile === mahjong) {
                num++;
            }
        }

        return num;
    }
    public getAllVMahjongs_delMahjong(tile: number): number[] {
        const array: number[] = [];
        let bFind = false;
        for (const tileHand of this.tilesHand) {
            if (tileHand !== tile || (tileHand === tile && bFind)) {
                array.push(tileHand);
            } else {
                bFind = true;
            }
        }

        return array;
    }
    //搜索指定牌数量在所有无效牌中
    public getMahjongCount_withI(tile: number): number {
        let count = 0;
        if (tile !== 0) {
            for (const tileDis of this.tilesDiscarded) {
                if (tileDis === tile) {
                    count++;
                }
            }
            for (const meld of this.tilesMelds) {
                if (meld.cards[0] === tile) {
                    count = count + 3;
                    if (meld.op === TypeOfOP.Kong && tile !== this.host.mAlgorithm.getMahjongFan()) {
                        count++; //正常杠是 4张  赖根杠是 3张
                    }
                }
            }
        }

        return count;
    }

    public showOrHideVoiceImg(isShow: boolean): void {
        this.playerView.showOrHideVoiceImg(isShow);
    }

    // private playVoicMsg(): void {
    //     if (this.nimMsgs.length < 0) {
    //         Logger.debug("playVoicMsg failed, this.nimMsgs.length < 0");

    //         return;
    //     }

    //     // 目前只支持微信播放
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         Logger.debug("playVoicMsg failed, cc.sys.platform !== cc.sys.WECHAT_GAME");

    //         return;
    //     }

    //     if (this.audioContext.currentTime != null && this.audioContext.currentTime !== undefined
    //         && this.audioContext.duration !== null && this.audioContext.duration !== undefined
    //         && !this.audioContext.paused && this.audioContext.currentTime < this.audioContext.duration) {
    //         Logger.debug(`playVoicMsg failed, paused:${this.audioContext.pause}
    //          currentTime:${this.audioContext.currentTime} < duration:${this.audioContext.duration}`);

    //         return;
    //     }

    //     // if (this.audioContext.paused) {
    //     //     Logger.debug("playVoicMsg resum audio player");
    //     //     this.audioContext.seek(this.audioContext.currentTime);
    //     //     this.audioContext.autoplay = true;

    //     //     return;
    //     // }

    //     const msg = this.nimMsgs.shift();

    //     Logger.debug("start play audio:", msg.file.name);

    //     this.audioContext.src = msg.file.url;
    //     this.audioContext.autoplay = true;
    //     // this.audioContext.play();
    // }

    // private myMahjong_setIcoTing(tile: number): boolean {
    //     return this.host.mAlgorithm.canTingPai(this.tilesHand, tile);
    // }

    private playSound(directory: string, effectName: string): void {
        if (effectName === undefined || effectName === null) {
            return;
        }
        let soundName = "";
        if (this.playerInfo.gender === 0) {
            // soundName = `${ directory } /boy/${ effectName } `;
            soundName = `${directory}/${effectName}_m`;
        } else {
            soundName = `${directory}/${effectName}_w`;
        }
        SoundMgr.playEffectAudio(soundName);
    }

    // private myDiscardAction(tileID: number): void {
    //     this.discardOutTileID(tileID);
    //     this.playerView.enlargeDiscarded(tileID, true);
    // }
    // private discardToDeskOfMe(discardTileId: number): void {
    //     //自己打出去的牌 先显示到桌面  服务器回复之后 就不再操作桌面了
    //     //清理吃牌界面
    //     this.host.cleanUI();
    //     //加到打出牌列表
    //     this.addDicardedTile(discardTileId);
    //     this.discarded2UI(true, false);
    // }
}
