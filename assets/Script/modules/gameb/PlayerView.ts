import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { CommonFunction, Dialog, Logger } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { GameRules } from "./GameRules";
import { ClickCtrl, PlayerInterface, playerStatus, TypeOfOP } from "./PlayerInterface";
import { PlayerInfo, RoomInterface } from "./RoomInterface";
import { TileImageMounter } from "./TileImageMounter";

/**
 * playerview对应玩家的视图，牌桌上有4个playerview
 */
class PosCtrl {
    public x: number;
    public y: number;
    public constructor(x: number, y: number) {
        this.y = y;
        this.x = x;
    }
}

/**
 * 保存头像节点
 */
class Head {
    public headView: fgui.GComponent;
    public headLoader: fgui.GLoader;
    public pos: fgui.GObject;
    public readyIndicator: fgui.GObject;
    public ting: fgui.GObject;
    public roomOwnerFlag: fgui.GObject;
    public bankerFlag: fgui.GObject;
    public nameText: fgui.GObject;
    public hideAll: Function;
}

// //面子牌组资源 前缀
const MELD_COMPONENT_PREFIX: string[] = [
    "mahjong_mine_meld_",
    "mahjong_right_meld_",
    "mahjong_dui_meld_",
    "mahjong_left_meld_"
];

//面子牌组资源 后缀
const MELD_COMPONENT_SUFFIX: { [key: string]: string } = {
    [TypeOfOP.Kong]: "gang1",
    [TypeOfOP.Pong]: "chipeng"
    // [mjproto.MeldType.enumMeldTypeTriplet2Kong]: "gang1",
    // [mjproto.MeldType.enumMeldTypeExposedKong]: "gang1",
    // [mjproto.MeldType.enumMeldTypeConcealedKong]: "gang2",
    // [mjproto.MeldType.enumMeldTypeSequence]: "chipeng",
    // [mjproto.MeldType.enumMeldTypeTriplet]: "chipeng"
};
//落地牌组缩放
const meldsScale: number[][] = [
    [1, 1, 1, 1, 1], //没有杠
    [0.9, 0.95, 0.95, 1], //1个杠
    [0.85, 0.9, 0.95], //2个杠
    [0.85, 0.9], //3个杠
    [0.85] //4个杠
];

/**
 * 玩家
 */
export class PlayerView {
    public handsClickCtrls: ClickCtrl[];
    // public checkReadyHandBtn: fgui.GButton = null;
    public player: PlayerInterface;
    public room: RoomInterface;

    //打出的牌放大显示
    public discardTips: fgui.GComponent;
    public head: Head;
    public viewChairID: number;
    public onUpdateStatus: Function[];
    public skipBtn: fgui.GButton;
    public pengBtn: fgui.GButton;
    public huBtn: fgui.GButton;
    public gangBtn: fgui.GButton;
    public hand2: fgui.GObject;
    private discards: fgui.GComponent[];
    private discardLans: fgui.GObject[][] = [];
    private meldLans: fgui.GObject[][] = [];
    private lights: fgui.GComponent[];
    private hands: fgui.GComponent[];
    private melds: fgui.GComponent[];
    private myMeldNode: fgui.GObject;
    private flowers: fgui.GComponent[];
    private handsOriginPos: PosCtrl[];
    private viewUnityNode: fgui.GComponent;
    private myView: fgui.GComponent;
    private operationPanel: fgui.GComponent;
    private aniPos: fgui.GObject;
    private userInfoPos: fgui.GObject;
    private qipao: fgui.GComponent;
    private qipaoText: fgui.GObject;
    private alreadyShowNonDiscardAbleTips: boolean;
    private discardTipsTile: fgui.GComponent;
    private roomHost: RoomHost;
    private lastClickTime: number;
    private lastClickIndex: number;
    private dragHand: fgui.GComponent; //拖牌时 克隆的牌
    private msgTimerCB: Function;
    private isTwoPlayer: boolean = false;
    private meldsViewScale = 0;
    private piaoScoreWin: fgui.GObject;
    private piaoScoreLose: fgui.GObject;
    private piaoScoreStartPos: cc.Vec2;
    private piaoScoreEndPos: cc.Vec2;
    public constructor(viewUnityNode: fgui.GComponent, viewChairID: number, room: RoomInterface) {
        this.room = room;
        this.viewChairID = viewChairID;
        this.viewUnityNode = viewUnityNode;
        this.roomHost = this.room.getRoomHost();

        this.isTwoPlayer = this.room.roomInfo.players.length === 2;

        //这里需要把player的chairID转换为游戏视图中的chairID，这是因为，无论当前玩家本人
        //的chair ID是多少，他都是居于正中下方，左手是上家，右手是下家，正中上方是对家
        this.myView = viewUnityNode.getChild(`player${viewChairID}`).asCom;
        if (viewChairID === 1) {
            this.operationPanel = viewUnityNode.getChild("operationPanel").asCom;
            this.initOperationButtons();
        }

        //头像相关
        this.initHeadView();
        //其他UI
        this.initOtherView();
        //玩家状态
        this.initPlayerStatus();

        //动画挂载点
        this.aniPos = this.myView.getChild("aniPos");
    }

    public initCardLists(): void {
        //手牌列表
        this.initHands();
        //落地牌
        this.initMelds();
        //出牌列表
        this.initDiscards();
        //花牌列表
        this.initFlowers();
        //明牌列表
        this.initLights();
        //发牌动画的盖牌
        this.hand2 = this.myView.getChild("hand2").asCom;
    }

    //显示操作按钮
    public showButton(): void {
        // if (map !== undefined && map.length > 0) {
        //     this.buttonDataList = map;
        //     this.buttonList.numItems = map.length;
        //     this.buttonList.resizeToFit(map.length);
        // }
        this.operationPanel.visible = true;
    }

    //隐藏所有操作按钮
    public hideOperationButtons(): void {
        //先隐藏掉所有按钮
        // this.showButton([]);
        //隐藏根节点
        this.operationPanel.visible = false;
    }

    //界面操作
    //设置金币数显示（目前是累计分数）
    public setGold(): void {

        // if checkint(gold) < 0 {
        //this.head.goldText1. Show()
        //this.head.goldText. Hide()
        //this.head.goldText1.text = tostring(gold)
        // else
        //this.head.goldText1. Hide()
        //this.head.goldText. Show()
        //this.head.goldText.text = tostring(gold)
        //}
    }
    // tslint:disable-next-line:cyclomatic-complexity
    public setLanOfDiscard(isShow: boolean, tile?: number): void {
        // Logger.debug("setLanOfDiscard ------- tile : ", tile);
        if (this.discardLans !== undefined && this.discardLans !== null) {
            for (const discardLan of this.discardLans) {
                if (discardLan !== undefined && discardLan !== null) {
                    for (const t of discardLan) {
                        t.visible = false;
                    }
                }
            }
            if (isShow && tile !== undefined && tile !== null && tile !== this.room.laiziID) {
                const ts = this.discardLans[tile];
                if (ts !== undefined && ts !== null) {
                    for (const t of ts) {
                        t.visible = true;
                    }
                }
            }
        }
        if (this.meldLans !== undefined && this.meldLans !== null) {
            for (const discardLan of this.meldLans) {
                if (discardLan !== undefined && discardLan !== null) {
                    for (const t of discardLan) {
                        t.visible = false;
                    }
                }
            }
            if (isShow && tile !== undefined && tile !== null && tile !== this.room.laiziID) {
                const ts = this.meldLans[tile];
                if (ts !== undefined && ts !== null) {
                    for (const t of ts) {
                        t.visible = true;
                    }
                }
            }
        }
    }
    public setLanOfHands(isShow: boolean, tile?: number): void {
        const handsClickCtrls = this.handsClickCtrls;
        for (const handsClickCtrl of handsClickCtrls) {
            if (isShow) {
                if (handsClickCtrl.tileID === tile) {
                    handsClickCtrl.h.getChild("lanMask").visible = true;
                }
            } else {
                handsClickCtrl.h.getChild("lanMask").visible = false;
            }
        }
    }

    //设置头像特殊效果是否显示（当前出牌者则显示）
    public setHeadEffectBox(isShow: boolean): void {
        // const x = this.head.pos.x
        // const y = this.head.pos.y
        // const ani = animation.play("animations/Effects_UI_touxiang.prefab", this.head.headView, x, y, true);
        // ani.setVisible(isShow)
        if (isShow) {
            this.roomHost.animationMgr.play(`lobby/prefabs/mahjong/Effect_UI_touxiang`, this.head.pos.node);
        }
        this.head.pos.visible = isShow;
    }

    //从根节点上隐藏所有
    public hideAll(): void {
        this.head.hideAll();
        this.hideHands();
        this.hideFlowers();
        this.hideMelds();
        this.hideLights();
        this.hideDiscarded();
    }

    //新的一手牌开始，做一些清理后再开始
    public resetForNewHand(): void {
        this.hideHands();
        this.hideFlowers();
        this.hideMelds();
        this.hideLights();
        this.clearDiscardable();
        this.hideDiscarded();

        this.head.ting.visible = false;
        this.setHeadEffectBox(false);

        if (this.viewChairID === 1) {
            this.hideOperationButtons();
        }
    }

    //隐藏打出去的牌列表
    public hideDiscarded(): void {
        if (this.discards != null) {
            for (const d of this.discards) {
                d.visible = false;
            }
        }
    }

    //隐藏摊开牌列表
    public hideLights(): void {
        if (this.lights != null) {
            for (const h of this.lights) {
                h.visible = false;
            }
        }
    }

    //隐藏手牌列表
    public hideHands(): void {
        if (this.hands != null) {
            for (const h of this.hands) {
                h.visible = false;
            }
        }
    }

    //隐藏面子牌组
    public hideMelds(): void {
        // const mymeldTilesNode = this.myView.getChild("melds").asCom;
        // for (let i = 0; i < 4; i++) {
        //     const mm = mymeldTilesNode.getChild(`myMeld${i}`);
        //     if (mm != null) {
        //         mymeldTilesNode.removeChild(mm, true);
        //     }
        // }
        if (this.melds != null) {
            for (const meld of this.melds) {
                // meld.getChild("n1").visible = false;
                // meld.getChild("n2").visible = false;
                // meld.getChild("n3").visible = false;
                // meld.getChild("n4").visible = false;
                meld.visible = false;
            }
        }
    }

    //隐藏花牌列表
    public hideFlowers(): void {
        if (!GameRules.haveFlower(this.room.roomType)) {
            return;
        }
        if (this.flowers != null) {
            for (const f of this.flowers) {
                f.visible = false;
            }
        }
    }

    //显示花牌，注意花牌需要是平放的
    public showFlowers(): void {
        if (!GameRules.haveFlower(this.room.roomType)) {
            return;
        }
        const tilesFlower = this.player.tilesFlower;
        const flowers = this.flowers;

        //花牌个数
        const tileCount = tilesFlower.length;
        //花牌挂载点个数
        const dCount = flowers.length;

        //从那张牌开始挂载，由于tileCount可能大于dCount
        //因此，需要选择tilesDiscarded末尾的dCount个牌显示即可
        let begin = tileCount - dCount;
        if (begin < 0) {
            begin = 0;
        }

        //i计数器对应tilesFlower列表
        for (let i = begin; i < tileCount; i++) {
            const d = flowers[i % dCount];
            const tileID = tilesFlower[i];
            TileImageMounter.mountTileImage(d, tileID);
            d.visible = true;
        }
    }
    //显示打出去的牌，明牌显示
    public showDiscarded(newDiscard: boolean, waitDiscardReAction: boolean, isPiao: boolean = false): void {
        //先隐藏所有的打出牌节点
        const discards = this.discards;
        for (const d of discards) {
            d.visible = false;
        }
        this.discardLans = [];
        const tilesDiscard = this.player.tilesDiscarded;
        //已经打出去的牌个数
        const tileCount = tilesDiscard.length;
        //打出牌的挂载点个数
        const dCount = discards.length;
        //从那张牌开始挂载，由于tileCount可能大于dCount
        //因此，需要选择tilesDiscarded末尾的dCount个牌显示即可
        let begin = tileCount - dCount;
        if (begin < 0) {
            begin = 0;
        }

        let lastD;
        let lastT;
        //i计数器对应tilesDiscarded列表
        for (let i = begin; i < tileCount; i++) {
            lastD = discards[i % dCount];
            lastT = tilesDiscard[i];
            TileImageMounter.mountTileImage(lastD, lastT);
            lastD.visible = true;
            lastD.getChild("laiziMask").visible = lastT === this.room.laiziID;
            //打出牌 蓝色遮罩
            const dsLs = this.discardLans[lastT];
            if (dsLs === undefined || dsLs === null) {
                this.discardLans[lastT] = [];
            }
            const lM = lastD.getChild("lanMask");
            lM.visible = false;
            this.discardLans[lastT].push(lM);
        }

        //如果是新打出的牌，给加一个箭头
        if (newDiscard) {
            // const d = discards[tileCount - 1 % dCount];
            this.room.setArrowByParent(lastD);

            //放大打出去的牌
            this.enlargeDiscarded(lastT, waitDiscardReAction);
        }

        if (isPiao) {
            //因为出牌列表节点会缩小 得把飘赖效果放大。。。
            const point = lastD.getChild("piaoPos");
            point.scaleX = 1 / lastD.scaleX;
            point.scaleY = 1 / lastD.scaleY;
            // Logger.debug("point : ", point.scaleX);

            this.playPiaoEffect(point.node);
        }
    }

    //把打出的牌放大显示
    public enlargeDiscarded(discardTileId: number, waitDiscardReAction: boolean): void {
        if (discardTileId === undefined || discardTileId === null || discardTileId <= 0) {
            return;
        }
        const discardTips = this.discardTips;
        const discardTipsTile = this.discardTipsTile;
        TileImageMounter.mountTileImage(discardTipsTile, discardTileId);
        discardTips.visible = true;
        // if (waitDiscardReAction) {
        //     this.player.waitDiscardReAction = true;
        // } else {
        this.roomHost.component.scheduleOnce(
            () => {
                discardTips.visible = false;
            },
            1);
        // }
    }

    //显示对手玩家的手牌，对手玩家的手牌是暗牌显示
    public showHandsForOpponents(tileCountInHand: number): void {
        let t = tileCountInHand;
        const melds = this.player.tilesMelds;

        const meldCount = melds.length;
        if ((meldCount * 3 + t) > 13) {
            this.hands[13].visible = true;
            t = t - 1;
        }

        //melds面子牌组
        this.showMelds();

        for (let i = 0; i < t; i++) {
            this.hands[i].visible = true;
        }
    }
    //显示面子牌组
    public showMelds(): void {
        this.meldLans = [];
        const ms = this.player.tilesMelds;
        const length = ms.length;
        let g = 0;
        let p = 0;
        for (let i = 0; i < length; i++) {
            const mv = this.melds[i];
            //根据面子牌挂载牌的图片
            const meldData = ms[i];
            // Logger.debug("根据面子牌挂载牌的图片 : ", meldData);
            const arr = this.mountMeldImage(mv, meldData);
            if (arr.length === 4) {
                g++;
            } else {
                p++;
            }
            mv.visible = true;
            //落地牌组 蓝色遮罩
            const lastT = meldData.cards[0];
            const dsLs = this.meldLans[lastT];
            if (dsLs === undefined || dsLs === null) {
                this.meldLans[lastT] = [];
            }
            for (const a of arr) {
                const lM = a.getChild("lanMask");
                lM.visible = false;
                this.meldLans[lastT].push(lM);
            }
        }
        const o = meldsScale[g][p];
        const v = (o) * this.meldsViewScale;
        this.myMeldNode.setScale(v, v);
    }
    //显示面子牌组
    public showMeldsOld(): void {
        const ms = this.player.tilesMelds;
        const length = ms.length;
        const rm = MELD_COMPONENT_PREFIX[this.viewChairID - 1];
        //摆放牌
        const mymeldTilesNode = this.myView.getChild("melds").asCom;
        for (let i = 0; i < length; i++) {
            const mv = mymeldTilesNode.getChild(`meld${i + 1}`);
            const mm = mymeldTilesNode.getChild(`myMeld${i}`);
            if (mm != null) {
                mymeldTilesNode.removeChild(mm, true);
            }
            //根据面子牌挂载牌的图片
            const meldData = ms[i];
            // Logger.debug("根据面子牌挂载牌的图片 : ", meldData);
            let meldType = meldData.op;
            if (meldData.cards[0] === this.room.mAlgorithm.getMahjongFan()) {
                //赖根只有三张
                meldType = TypeOfOP.Pong;
            }
            const resName = rm + MELD_COMPONENT_SUFFIX[meldType];
            const meldView = fgui.UIPackage.createObject("lobby_mahjong", resName).asCom;
            meldView.setPosition(mv.x, mv.y);
            meldView.name = `myMeld${i}`;
            mymeldTilesNode.addChild(meldView);
            this.mountMeldImage(meldView, meldData);
        }
    }

    //显示面子牌组，暗杠需要特殊处理，如果是自己的暗杠，
    //则明牌显示前3张，第4张暗牌显示（以便和明杠区分）
    //如果是别人的暗杠，则全部暗牌显示
    public mountMeldImage(meldView: fgui.GComponent, msgMeld: protoHH.casino_xtsj.packet_sc_op_ack): fgui.GComponent[] {

        const pp = this.room.getPlayerByUserID(`${msgMeld.target_id}`);
        let viewChairID = this.viewChairID;
        if (pp !== undefined && pp.chairID !== undefined && pp.chairID !== null) {
            viewChairID = this.room.getPlayerViewChairIDByChairID(pp.chairID);
        }
        const t1 = meldView.getChild("n1").asCom;
        const t2 = meldView.getChild("n2").asCom;
        const t3 = meldView.getChild("n3").asCom;
        const t4 = meldView.getChild("n4").asCom;
        const arr: fgui.GComponent[] = [t1, t2, t3];
        // t1.visible = true;
        // t2.visible = true;
        // t3.visible = true;
        let meldType = msgMeld.op;

        const tile = msgMeld.cards[0];
        TileImageMounter.mountMeldEnableImage(t1, tile, this.viewChairID);
        TileImageMounter.mountMeldEnableImage(t2, tile, this.viewChairID);
        TileImageMounter.mountMeldEnableImage(t3, tile, this.viewChairID);
        TileImageMounter.mountMeldEnableImage(t4, tile, this.viewChairID);

        let width = 0;
        let height = 0;
        if (tile === this.room.mAlgorithm.getMahjongFan()) {
            //赖根只有三张
            meldType = TypeOfOP.Pong;
        }
        const jiantou2 = meldView.getChild("ts2");
        const jiantou1 = meldView.getChild("ts1");
        jiantou2.visible = false;
        jiantou1.visible = false;
        if (meldType === TypeOfOP.Pong) {
            t4.visible = false;
            width = meldView.getChild("size3").width;
            height = meldView.getChild("size3").height;
            this.setMeldTileDirection(jiantou2, viewChairID, 1);
        } else if (meldType === TypeOfOP.Kong) {
            width = meldView.getChild("size4").width;
            height = meldView.getChild("size4").height;
            t4.visible = true;
            this.setMeldTileDirection(jiantou1, viewChairID, 1);
            arr.push(t4);
        }
        // meldView.visible = true;
        meldView.setSize(width, height);

        return arr;
    }

    public hideFlowerOnHandTail(): void {
        this.hands[13].visible = false;
    }

    public showFlowerOnHandTail(flower: number): void {
        this.hands[13].visible = true;
        //const player = this.player
        if (this.viewChairID === 1) {
            TileImageMounter.mountTileImage(this.hands[13], flower);
        }
    }

    public showDeal(): void {
        if (this.player.isMe()) {
            const tileshand = this.player.tilesHand;
            // let j = 0;
            for (let i = 0; i < tileshand.length; i++) {
                const h = this.hands[12 - i];
                const t = tileshand[i];
                TileImageMounter.mountTileImage(h, t);
                h.getChild("laiziMask").visible = t === this.room.laiziID;
                h.getChild("laizi").visible = t === this.room.laiziID;
                h.visible = true;
                // j = j + 1;
            }
        } else {
            for (let i = 0; i < this.player.tileCountInHand; i++) {
                this.hands[12 - i].visible = true;
            }
        }
    }

    //为本人显示手牌，也即是1号playerView(prefab中的1号)//@param wholeMove 是否整体移动
    public showHandsForMe(wholeMove: boolean): void {
        const melds = this.player.tilesMelds;
        const tileshand = this.player.tilesHand;
        const tileCountInHand = tileshand.length;
        const handsClickCtrls = this.handsClickCtrls;
        //删除tileID
        //tileID主要是用于点击手牌时，知道该手牌对应那张牌ID
        for (const handsClickCtrl of handsClickCtrls) {
            handsClickCtrl.tileID = null;
        }

        //恢复所有牌的位置，由于点击手牌时会把手牌向上移动
        this.restoreHandsPositionAndClickCount(-1);

        let begin = 0;
        let endd = tileCountInHand;

        const meldCount = melds.length;
        if ((meldCount * 3 + tileCountInHand) > 13) {
            this.hands[13].visible = true;
            if (wholeMove) {
                TileImageMounter.mountTileImage(this.hands[13], tileshand[0]);
                handsClickCtrls[13].tileID = tileshand[0];
                this.hands[13].getChild("laiziMask").visible = tileshand[0] === this.room.laiziID;
                this.hands[13].getChild("laizi").visible = tileshand[0] === this.room.laiziID;
                begin = 1;
            } else {
                TileImageMounter.mountTileImage(this.hands[13], tileshand[tileCountInHand - 1]);
                handsClickCtrls[13].tileID = tileshand[tileCountInHand - 1];
                this.hands[13].getChild("laiziMask").visible = tileshand[tileCountInHand - 1] === this.room.laiziID;
                this.hands[13].getChild("laizi").visible = tileshand[tileCountInHand - 1] === this.room.laiziID;
                endd = tileCountInHand - 1;
            }
        }

        //melds面子牌组
        this.showMelds();

        let j = 0;
        for (let i = begin; i < endd; i++) {
            const h = this.hands[j];
            const t = tileshand[i];
            TileImageMounter.mountTileImage(h, t);
            h.getChild("laiziMask").visible = t === this.room.laiziID;
            h.getChild("laizi").visible = t === this.room.laiziID;
            h.visible = true;
            handsClickCtrls[j].tileID = t;
            // if (this.player.isRichi) {
            //     //如果是听牌状态下，则不再把牌弄回白色（让手牌一直是灰色的）
            //     //判断 handsClickCtrls[j].isDiscardable 是否为 true, 是的话 则不能 setGray
            //     this.setGray(h);
            //     handsClickCtrls[j].isGray = true;
            // }
            j = j + 1;
        }
    }

    //把手牌摊开，包括对手的暗杠牌，用于一手牌结束时
    public hand2Exposed(wholeMove: boolean): void {
        //不需要手牌显示了，全部摊开
        this.hideLights();

        //先显示所有melds面子牌组
        const melds = this.player.tilesMelds;
        const tileshand = this.player.tilesHand;
        this.showMelds();
        const tileCountInHand = tileshand.length;

        let begin = 0;
        let endd = tileCountInHand;

        const meldCount = melds.length;
        if ((meldCount * 3 + tileCountInHand) > 13) {
            const light = this.lights[13];
            if (wholeMove) {
                TileImageMounter.mountTileImage(light, tileshand[tileCountInHand - 1]);
                light.visible = true;
                endd = tileCountInHand - 1;
            } else {
                TileImageMounter.mountTileImage(light, tileshand[0]);
                light.visible = true;
                begin = 1;
            }
        }

        let j = 0;
        for (let i = begin; i < endd; i++) {
            const light = this.lights[j];
            TileImageMounter.mountTileImage(light, tileshand[i]);
            light.visible = true;
            j = j + 1;
        }
    }

    //清除掉由于服务器发下来allowed actions而导致显示出来的view//例如吃椪杠操作面板等等
    public clearAllowedActionsView(discardAble: boolean): void {
        if (!discardAble) {
            //print("llwant, clear discardable.."..debug.traceback())
            this.clearDiscardable();
            //把听牌标志隐藏
            this.hideTing();
        }
        // if (this.room.isMySelfDisCard) {
        //     this.room.setDiscardAble();
        // }

        this.hideOperationButtons();
        //隐藏听牌详情界面
        this.room.hideTingDataView();
    }
    //处理玩家点击手牌按钮
    public onHandTileBtnClick2(index: number): void {
        // const handsClickCtrls = this.handsClickCtrls;

        // const player = this.player;
        // if (player === null) {
        //     Logger.debug("player === null");

        //     return;
        // }

        // const clickCtrl = handsClickCtrls[index];

        // if (!clickCtrl.isDiscardable) {
        //     //不可以出牌
        //     //"本轮不能出与该牌组合的牌，请选择其他牌"
        //     if (clickCtrl.isGray) {
        //         if (!this.alreadyShowNonDiscardAbleTips) {
        //             // prompt.showPrompt("本轮不能出与该牌组合的牌，请选择其他牌")
        //             this.alreadyShowNonDiscardAbleTips = true;
        //         }
        //     }

        //     return;
        // }

        // if (clickCtrl.readyHandList !== undefined && clickCtrl.readyHandList !== null && clickCtrl.readyHandList.length > 0) {
        //     //如果此牌可以听
        //     const tingP: TingPai[] = [];
        //     for (let i = 0; i < clickCtrl.readyHandList.length; i += 2) {
        //         tingP.push(new TingPai(clickCtrl.readyHandList[i], 1, clickCtrl.readyHandList[i + 1]));
        //     }
        //     this.room.showTingDataView(tingP);
        // } else {
        //     this.room.hideTingDataView();
        // }

        //播放选牌音效
        //dfCompatibleAPI. soundPlay("effect/effect_xuanpai")

        // clickCtrl.clickCount = clickCtrl.clickCount + 1;
        // if (clickCtrl.clickCount === 1) {
        //     this.restoreHandsPositionAndClickCount(index);
        //     this.moveHandUp(index);
        // }

        // if (clickCtrl.clickCount === 2) {
        //     //判断可否出牌
        //     if (player.waitSkip) {
        //         this.restoreHandsPositionAndClickCount(-1);
        //         this.room.hideTingDataView();
        //     } else {
        //         player.onPlayerDiscardTile(clickCtrl.tileID);
        //         this.clearAllowedActionsView(false);
        //     }
        //     //player. onPlayerDiscardTile(clickCtrl.tileID)
        // }
    }

    //还原所有手牌到它初始化时候的位置，并把clickCount重置为0
    public restoreHandsPositionAndClickCount(index: number): void {
        for (let i = 0; i < 14; i++) {
            if (i !== index) {
                const clickCtrl = this.handsClickCtrls[i];
                const originPos = this.handsOriginPos[i];
                const h = clickCtrl.h;
                h.y = originPos.y;
                // clickCtrl.clickCount = 0;
                clickCtrl.isNormalState = true;
            }
        }
    }

    //显示玩家头像
    public showPlayerInfo(playerInfo: PlayerInfo): void {
        this.head.headView.visible = true;
        // this.head.headView.onClick(this.player.onPlayerInfoClick, this.player);

        this.head.nameText.text = this.player.mNick;
        this.head.nameText.visible = true;
        //头像
        CommonFunction.setHead(this.head.headLoader, playerInfo.headIconURI, playerInfo.gender);
    }

    //显示桌主
    public showOwner(): void {
        const player = this.player;
        this.head.roomOwnerFlag.visible = player.isMe();
    }

    //特效播放
    //播放补花效果，并等待结束
    public async playDrawFlowerAnimation(): Promise<void> {
        await this.playerOperationEffect("Effect_zi_buhua");
        await this.room.coWaitSeconds(0.5);
    }

    public async playerOperationEffect(effectName: string, isWait?: boolean): Promise<void> {
        if (effectName === undefined || effectName === null) {
            return;
        }
        if (isWait !== undefined && isWait) {
            await this.roomHost.animationMgr.coPlay(`lobby/prefabs/huanghuang/${effectName}`, this.aniPos.node);
        } else {
            this.roomHost.animationMgr.play(`lobby/prefabs/huanghuang/${effectName}`, this.aniPos.node);
        }
    }

    public async playPiaoEffect(node: cc.Node): Promise<void> {
        await this.roomHost.animationMgr.coPlay(`lobby/prefabs/huanghuang/Effect_ico_piaolai`, node);
    }
    //特效道具播放
    public playerDonateEffect(effectName: string): void {
        this.roomHost.animationMgr.play(`lobby/prefabs/donate/${effectName}`, this.head.headView.node);
    }
    //起手听特效播放
    public playReadyHandEffect(): void {
        //this. playerOperationEffect(dfConfig.EFF_DEFINE.SUB_ZI_TING)
    }

    //设置灰度
    public setGray(obj: fgui.GComponent): void {
        // obj.grayed = true;
    }

    //恢复灰度
    public clearGray(obj: fgui.GComponent): void {
        // obj.grayed = false;
    }

    public getUserInfoPos(): fgui.GObject {
        return this.userInfoPos;
    }

    //显示聊天消息
    public showChatMsg(str: string): void {
        if (str !== undefined && str !== null) {
            if (this.msgTimerCB === undefined) {
                this.msgTimerCB = <Function>this.hideChatMsg.bind(this);
            }
            this.qipaoText.text = str;
            this.qipao.visible = true;
            //定时隐藏
            this.roomHost.component.unschedule(this.msgTimerCB);
            this.roomHost.component.scheduleOnce(this.msgTimerCB, 3);
        }
    }
    public piaoScore(num: number): void {
        if (num !== undefined && num !== 0) {
            //飘字
            if (num > 0) {
                this.piaoScoreWin.node.position = this.piaoScoreStartPos;
                this.piaoScoreWin.text = `+${num}`;
                this.piaoScoreWin.node.runAction(cc.moveTo(1, this.piaoScoreEndPos));
                const callBack = () => {
                    this.piaoScoreWin.text = "";
                };
                this.roomHost.component.scheduleOnce(callBack, 1);
            } else {
                this.piaoScoreLose.node.position = this.piaoScoreStartPos;
                this.piaoScoreLose.text = `${num}`;
                this.piaoScoreLose.node.runAction(cc.moveTo(1, this.piaoScoreEndPos));
                const callBack = () => {
                    this.piaoScoreLose.text = "";
                };
                this.roomHost.component.scheduleOnce(callBack, 1);
            }
        }
    }
    public showScore(): void {
        if (this.viewChairID === 1) {
            this.head.nameText.text = `${this.player.mNick}:${this.player.totalScores}`;
        } else {
            this.head.nameText.text = `${this.player.totalScores}`;
        }
    }
    private hideChatMsg(): void {
        this.qipao.visible = false;
    }

    private initOtherView(): void {
        // this.aniPos = view.getChild("aniPos")
        this.userInfoPos = this.myView.getChild("userInfoPos");

        //打出的牌放大显示
        this.discardTips = this.myView.getChild("discardTip").asCom;
        this.discardTipsTile = this.discardTips.getChild("card").asCom;

        //聊天气泡
        this.qipao = this.myView.getChild("qipao").asCom;
        this.qipaoText = this.qipao.getChild("text");
        //分数飘字
        const scoreCom = this.myView.getChild("scoreCom").asCom;
        scoreCom.visible = true;
        this.piaoScoreWin = scoreCom.getChild("win");
        this.piaoScoreLose = scoreCom.getChild("lose");
        this.piaoScoreStartPos = scoreCom.getChild("startPos").node.position;
        this.piaoScoreEndPos = scoreCom.getChild("endPos").node.position;
    }

    //头像周边内容节点
    private initHeadView(): void {

        const head = new Head();

        head.headView = this.myView.getChild("head").asCom;
        head.headView.visible = false;
        head.pos = head.headView.getChild("pos");
        head.headLoader = head.headView.getChild("n1").asLoader;
        //ready状态指示
        head.readyIndicator = this.myView.getChild("ready");
        head.readyIndicator.visible = false;
        //听牌标志
        head.ting = this.myView.getChild("ting");
        head.ting.visible = false;
        //房间拥有者标志
        head.roomOwnerFlag = this.myView.getChild("owner");
        head.roomOwnerFlag.visible = false;

        //庄家标志
        head.bankerFlag = this.myView.getChild("zhuang");
        head.bankerFlag.visible = false;

        head.nameText = this.myView.getChild("nameText");
        head.nameText.visible = false;

        head.hideAll = (): void => {
            head.headView.visible = false;
            head.readyIndicator.visible = false;
            head.ting.visible = false;
            head.roomOwnerFlag.visible = false;
            head.bankerFlag.visible = false;
            head.nameText.visible = false;
        };

        this.head = head;
    }

    //玩家状态
    private initPlayerStatus(): void {
        //起始
        const onStart = (): void => {
            this.head.readyIndicator.visible = false;
            // if (this.viewChairID === 1) {
            //     this.checkReadyHandBtn.visible = false;
            // }
            this.head.nameText.text = `${this.player.mNick}`;
        };

        //准备
        const onReady = (): void => {
            this.head.readyIndicator.visible = true;
            this.head.headView.grayed = false;
            this.showOwner();
        };

        //离线
        const onLeave = (): void => {
            this.head.readyIndicator.visible = false;
            this.head.headView.grayed = true;
        };

        //正在玩
        const onPlaying = (): void => {
            this.head.readyIndicator.visible = false;
            this.head.headView.grayed = false;

            this.showOwner();
            //开始玩之后 不显示名字 显示分数
            this.showScore();
        };

        const status = [];
        status[playerStatus.onWait] = onStart;
        status[playerStatus.onReady] = onReady;
        status[playerStatus.onOffLine] = onLeave;
        status[playerStatus.onPlay] = onPlaying;
        this.onUpdateStatus = status;
    }

    //设置面子牌的方向
    private setMeldTileDirection(image: fgui.GObject, dir: number, viewChairID: number): void {
        if (dir > 0 && viewChairID > 0) {
            if (image != null) {
                const x = dir - viewChairID;
                if (x === 1 || x === -3) {
                    image.rotation = 90;
                } else if (x === 2 || x === -2) {
                    image.rotation = 0;
                } else if (x === 3 || x === -1) {
                    image.rotation = -90;
                } else {
                    image.rotation = 180;
                }
                image.visible = true;
            }
        }
    }

    //处理玩家点击手牌按钮
    private onHandTileBtnClick(index: number): void {
        const handsClickCtrls = this.handsClickCtrls;
        const clickCtrl = handsClickCtrls[index];
        const player = this.player;
        if (!clickCtrl.isDiscardable) {
            //不可以出牌
            if (clickCtrl.isGray) {
                if (!this.alreadyShowNonDiscardAbleTips) {
                    Dialog.prompt("本轮不能出与该牌组合的牌，请选择其他牌");
                    this.alreadyShowNonDiscardAbleTips = true;
                }
            }

            return;
        }

        const prevClickTime = this.lastClickTime;
        this.lastClickTime = this.roomHost.timeElapsed;

        let isDoubleClick = false;

        if (this.lastClickIndex === index &&
            this.lastClickTime - prevClickTime <= 0.5) {
            // 快速点击同一张牌时认为是双击
            isDoubleClick = true;
        }

        this.lastClickIndex = index;

        if (isDoubleClick) {
            //双击 直接出牌
            //判断可否出牌
            if (player.waitSkip) {
                this.restoreHandsPositionAndClickCount(-1);
                this.room.hideTingDataView();
            } else {
                player.onPlayerDiscardTile(clickCtrl.tileID);
                this.clearAllowedActionsView(false);
            }
            //把桌面上一样的牌 取消标注
            this.room.setLanOfDiscard(false);
        } else {
            const prevState = clickCtrl.isNormalState;
            clickCtrl.isNormalState = !clickCtrl.isNormalState;

            if (prevState) {
                //第一次点击 弹起
                this.restoreHandsPositionAndClickCount(index);
                this.moveHandUp(index);
                if (clickCtrl.readyHandList !== undefined && clickCtrl.readyHandList !== null && clickCtrl.readyHandList.length > 0) {
                    //如果此牌可以听
                    this.room.showTingDataView(clickCtrl.readyHandList);
                } else {
                    if (clickCtrl.t.visible) {
                        this.room.showTingDataView(clickCtrl.readyHandList);
                    } else {
                        this.room.hideTingDataView();
                    }
                }
                //把桌面上一样的牌 标注一下
                this.room.setLanOfDiscard(true, clickCtrl.tileID);
            } else {
                //第二次点击 缩回去
                this.restoreHandPositionAndClickCount(index);
                this.room.hideTingDataView();
                //把桌面上一样的牌 取消标注
                this.room.setLanOfDiscard(false);
            }
        }
    }

    //处理玩家点击左下角的“听”按钮
    // private onCheckReadyHandBtnClick(): void {
    //     const player = this.player;
    //     const readyHandList = player.readyHandList;
    //     if (!this.room.isListensObjVisible() && readyHandList != null && readyHandList.length > 0) {
    //         //const tingData = {}
    //         const tingP: TingPai[] = [];
    //         for (let i = 0; i < readyHandList.length; i += 2) {
    //             tingP.push(new TingPai(readyHandList[i], 1, readyHandList[i + 1]));
    //         }
    //         this.room.showTingDataView(tingP);
    //     } else {
    //         this.room.hideTingDataView();
    //     }
    // }

    //拖动出牌事件
    private onDrag(dragGo: fgui.GObject, index: number): void {
        const startPos = { x: dragGo.x, y: dragGo.y };
        let enable = false;
        let clickCtrl: ClickCtrl = new ClickCtrl();
        dragGo.draggable = true;
        const x1 = dragGo.x - dragGo.width * 0.5;
        const x2 = dragGo.x + dragGo.width * 0.5;
        const y1 = dragGo.y - dragGo.height * 0.5;
        const y2 = dragGo.y + dragGo.height * 0.5;
        const rect = [x1, x2, y1, y2];
        //可否拖动
        const dragable = () => {
            //print("llwant, drag able")
            const player = this.player;
            if (player === null) {
                return false;
            }
            const handsClickCtrls = this.handsClickCtrls;
            clickCtrl = handsClickCtrls[index];

            return clickCtrl.isDiscardable && !player.waitSkip;
        };
        //检测拖动范围时候合法
        const pointIsInRect = (x: number, y: number) => {
            if (x > rect[0] && x < rect[1] && y > rect[2] && y < rect[3]) {
                return true;
            } else {
                return false;
            }
        };
        //附加拖动效果
        const attachEffect = (obj: fgui.GObject) => {
            // this.dragEffect.SetParent(obj);
            // this.dragEffect.localPosition = Vector3(0, 0, 0)
            // this.dragEffect.visible = true
        };
        //去掉拖动效果
        const detachEffect = () => {
            // this.dragEffect.visible = false
        };
        const stratFunction = () => {
            enable = dragable();
            //关闭拖动特效
            detachEffect();
            if (!enable) {
                return;
            }
            this.restoreHandsPositionAndClickCount(index);
            this.dragHand.visible = true;
            TileImageMounter.mountTileImage(this.dragHand, this.handsClickCtrls[index].tileID);
            this.dragHand.getChild("ting").visible = this.handsClickCtrls[index].t.visible;
            attachEffect(dragGo);

            //把桌面上一样的牌 标注
            this.room.setLanOfDiscard(true, this.handsClickCtrls[index].tileID);
        };
        const moveFunction = () => {
            if (!enable) {
                dragGo.x = startPos.x;
                dragGo.y = startPos.y;

                return;
            }
            this.dragHand.setPosition(dragGo.x, dragGo.y);
            //obj.position = pos
        };
        const endFunction = () => {
            if (!enable) {
                return;
            }
            //拖牌结束立即不显示
            dragGo.visible = false;
            this.dragHand.visible = false;
            detachEffect();
            if (pointIsInRect(dragGo.x, dragGo.y)) {
                dragGo.visible = true;
                dragGo.x = startPos.x;
                dragGo.y = startPos.y;
            } else {
                //重置打出的牌位置（TODO：需要测试当网络不好的情况下onPlayerDiscardTile发送数据失败，界面刷新情况）
                dragGo.visible = false;
                dragGo.x = startPos.x;
                dragGo.y = startPos.y;
                //判断可否出牌
                if (!this.player.waitSkip) {
                    this.player.onPlayerDiscardTile(clickCtrl.tileID);
                    this.clearAllowedActionsView(false);
                }
            }
            //把桌面上一样的牌 取消标注
            this.room.setLanOfDiscard(false);
        };
        dragGo.on(fgui.Event.DRAG_START, stratFunction, this);
        dragGo.on(fgui.Event.DRAG_MOVE, moveFunction, this);
        dragGo.on(fgui.Event.DRAG_END, endFunction, this);
    }
    //还原某个手牌到它初始化时候的位置，并把clickCount重置为0
    private restoreHandPositionAndClickCount(i: number): void {
        const clickCtrl = this.handsClickCtrls[i];
        const originPos = this.handsOriginPos[i];
        const h = clickCtrl.h;
        h.y = originPos.y;
        // clickCtrl.clickCount = 0;
        clickCtrl.isNormalState = true;
    }

    //隐藏听牌标志
    private hideTing(): void {
        for (let i = 0; i < 14; i++) {
            const clickCtrl = this.handsClickCtrls[i];
            if (clickCtrl != null && clickCtrl.t != null) {
                clickCtrl.t.visible = false;
            }
        }
    }

    //把手牌往上移动30的单位距离
    private moveHandUp(index: number): void {
        const originPos = this.handsOriginPos[index];
        const h = this.handsClickCtrls[index].h;
        h.y = originPos.y - 30;
    }

    //让所有的手牌都不可以点击
    private clearDiscardable(): void {
        // if (this.player.isRichi) {
        //     //如果是听牌状态下，则不再把牌弄回白色（让手牌一直是灰色的）
        //     return;
        // }
        for (const clickCtrl of this.handsClickCtrls) {
            clickCtrl.isDiscardable = false;
            if (clickCtrl.isGray) {
                clickCtrl.isGray = false;
                this.clearGray(clickCtrl.h);
            }
        }
    }

    //初始化
    //花牌列表
    private initFlowers(): void {
        const flowers: fgui.GComponent[] = [];
        const myFlowerTilesNode = this.myView.getChild("flowers").asCom;
        for (let i = 0; i < 12; i++) {
            const h = myFlowerTilesNode.getChild(`n${i + 1}`).asCom;
            flowers[i] = h;
        }
        this.flowers = flowers;
    }

    //明牌列表
    private initLights(): void {
        const lights: fgui.GComponent[] = [];
        const myLightTilesNode = this.myView.getChild("lights").asCom;
        for (let i = 0; i < 14; i++) {
            const h = myLightTilesNode.getChild(`n${i + 1}`).asCom;
            lights[i] = h;
        }
        this.lights = lights;
    }

    //打出的牌列表
    private initDiscards(): void {
        const discards: fgui.GComponent[] = [];
        let myDicardTilesNode = this.myView.getChild("discards").asCom;
        let disLen = 20;
        if (this.isTwoPlayer) {
            myDicardTilesNode = this.myView.getChild("discards2").asCom;
            disLen = 40;
        }
        myDicardTilesNode.visible = true;
        for (let i = 0; i < disLen; i++) {
            const card = myDicardTilesNode.getChild(`n${i + 1}`).asCom;
            discards[i] = card;
        }
        this.discards = discards;
    }

    private initMelds(): void {
        this.melds = [];
        const meldsView = this.myView.getChild("melds").asCom;
        for (let i = 1; i < 5; i++) {
            const meld = meldsView.getChild(`n${i}`).asCom;
            this.melds.push(meld);
            meld.visible = false;
        }
        this.meldsViewScale = meldsView.scaleX;
        this.myMeldNode = meldsView;
    }
    //手牌列表
    private initHands(): void {
        const hands: fgui.GComponent[] = [];
        const handsOriginPos: PosCtrl[] = [];
        const handsClickCtrls: ClickCtrl[] = [];
        const myHandTilesNode = this.myView.getChild("hands").asCom;
        //const resName = ""
        const isMe = this.viewChairID === 1;
        for (let i = 0; i < 14; i++) {
            const card = myHandTilesNode.getChild(`n${i + 1}`).asCom;

            if (isMe) {
                card.name = i.toString(); //把手牌按钮对应的序号记忆，以便点击时可以识别
            }

            card.visible = false;
            hands[i] = card;

            handsOriginPos[i] = new PosCtrl(card.x, card.y);
            const cc = new ClickCtrl();
            // cc.clickCount = 0;
            cc.isNormalState = true;
            cc.h = card;
            cc.t = card.getChild("ting");
            handsClickCtrls[i] = cc;

            if (isMe) {
                this.dragHand = myHandTilesNode.getChild("dragHand").asCom;
                card.onClick(
                    () => {
                        this.onHandTileBtnClick(i);
                    },
                    this
                );
                this.onDrag(card, i);
            }
        }

        this.hands = hands;
        this.handsOriginPos = handsOriginPos; //记忆原始的手牌位置，以便点击手牌时可以往上弹起以及恢复
        this.handsClickCtrls = handsClickCtrls; // 手牌点击时控制数据结构
    }

    // private onClickBtn(name: string): void {
    //     if (this.btnHanders === undefined) {
    //         this.btnHanders = {};
    //         const btnHanders = this.btnHanders;
    //         btnHanders[ButtonDef.Kong] = () => {
    //             this.player.onKongBtnClick();
    //         };
    //         btnHanders[ButtonDef.Skip] = () => {
    //             this.player.onSkipBtnClick();
    //         };
    //         btnHanders[ButtonDef.Pong] = () => {
    //             this.player.onPongBtnClick();
    //         };
    //         btnHanders[ButtonDef.Ting] = () => {
    //             this.player.onReadyHandBtnClick();
    //         };
    //         btnHanders[ButtonDef.Hu] = () => {
    //             this.player.onWinBtnClick();
    //         };
    //     }

    //     const handler = this.btnHanders[name];
    //     handler();
    // }

    // public itemProviderButtonList(index: number): string {
    //     return this.buttonDataList[index];
    // }
    //操作按钮
    private initOperationButtons(): void {
        this.skipBtn = this.operationPanel.getChild("skipBtn").asButton;
        this.pengBtn = this.operationPanel.getChild("pengBtn").asButton;
        this.huBtn = this.operationPanel.getChild("huBtn").asButton;
        this.gangBtn = this.operationPanel.getChild("gangBtn").asButton;

        this.skipBtn.onClick(() => { this.player.onSkipBtnClick(); }, this);
        this.pengBtn.onClick(() => {
            if (!this.pengBtn.grayed) {
                this.player.onPongBtnClick();
            }
        }, this);
        this.huBtn.onClick(() => {
            if (!this.huBtn.grayed) {
                this.player.onWinBtnClick();
            }
        }, this);
        this.gangBtn.onClick(() => {
            if (!this.gangBtn.grayed) {
                this.player.onKongBtnClick();
            }
        }, this);
        // this.buttonList = this.operationPanel.getChild("buttonList").asList;
        // this.buttonList.itemRenderer = <(index: number, item: fgui.GComponent) => void>this.renderButtonListItem.bind(this);
        // this.buttonList.on(fgui.Event.CLICK_ITEM, (onClickItem: fgui.GObject) => { this.onClickBtn(onClickItem.name); }, this);
        this.hideOperationButtons();

        // //检查听详情 按钮
        // this.checkReadyHandBtn = this.viewUnityNode.getChild("checkReadyHandBtn").asButton;
        // this.checkReadyHandBtn.onClick(this.onCheckReadyHandBtnClick, this);
    }

    // private renderButtonListItem(index: number, obj: fgui.GObject): void {
    //     const name = this.buttonDataList[index];
    //     obj.name = name;
    //     obj.visible = true;

    //     const node = obj.node;
    //     if (node.childrenCount > 0) {
    //         node.children.forEach((c) => {
    //             c.active = false;
    //         });
    //     }

    //     this.roomHost.animationMgr.play(`lobby/prefabs/mahjong/${name}`, node);
    // }
}
