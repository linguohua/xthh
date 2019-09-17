import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { CommonFunction, SoundMgr } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { PHRASE_MAP } from "../lobby/views/chat/ChatExports";
import { ClickCtrl, PlayerInterfaceA, playerStatus, TypeOfOP } from "./PlayerInterfaceA";
import { PlayerInfo, RoomInterfaceA } from "./RoomInterfaceA";
import { TileImageMounterA } from "./TileImageMounterA";

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
};

const handsPos: number[][] = [
    [0, -180, -1, -50, 0, -1, -80, -50, 10, -130, -100, -20, 20, -120, -80, -20, 20], //1号2万玩家 x
    [0, 30, -1, 50, 20, -1, 30, 10, -10, 30, 10, -10, -35, 10, -10, -30, -55], //2号玩家 y
    [0, 100, -1, 20, 0, -1, 50, 20, -20, 70, 40, 10, -30, 70, 30, 0, -40],  //3号2万玩家 x
    [0, -40, -1, -40, -30, -1, -40, -20, 0, -40, -20, 0, 20, -20, 0, 20, 40] //4号玩家 y
];
const lightsScale: number[][] = [
    //[0]初始化Scale [1]胡牌摊牌时Scale
    [1, 0.8], //1号玩家
    [1, 0.9], //2号玩家
    [1, 0.88],  //3号玩家
    [1, 0.91] //4号玩家
];
const lightsPos: number[][] = [
    //[0]初始化位置 [1]胡牌摊牌时位置
    [471, 484], //1号玩家 y
    [955, 962], //2号玩家 x
    [0, 12],  //3号玩家 y
    [0, 8] //4号玩家 x
];
//胡牌摊牌的时候用的
const lightsPos1: number[][] = [
    //[0]初始化位置 [1]当4个碰牌组的时候
    [0, -30, -1, -20, 40, -1, -23, 38, 100, -25, 35, 95, 155, 32, 90, 152, 213], //1号玩家 x
    [0, 75, -1, 68, 44, -1, 70, 47, 23, 73, 51, 29, 5, 53, 31, 9, -14], //2号玩家 y
    [80, 147, -1, 116, 81, -1, 126, 90, 56, 136, 100, 65, 30, 110, 75, 40, 6],  //3号玩家 x
    [0, -30, -1, -24, -2, -1, -26, -4, 19, -28, -5, 18, 40, -7, 17, 39, 62] //4号玩家 y
];
//回播时用的
const lightsPos2: number[][] = [
    //[0]初始化位置 [1]当4个碰牌组的时候
    [0, -30, -1, -20, 40, -1, -23, 38, 100, -25, 35, 95, 155, 32, 90, 152, 213], //1号玩家 x （目前没用到）
    [0, 35, -1, 28, 4, -1, 30, 17, -17, 33, 11, -11, -35, 13, -9, -11, -54], //2号玩家 y
    [0, 100, -1, 20, -10, -1, 50, 15, -20, 75, 40, 5, -25, 70, 35, 0, -35],  //3号玩家 x
    [0, -40, -1, -34, -12, -11, -36, -14, 9, -38, -15, 8, 30, -17, 7, 29, 52] //4号玩家 y
];
/**
 * 玩家
 */
export class PlayerViewA {
    public handsClickCtrls: ClickCtrl[];
    // public checkReadyHandBtn: fgui.GButton = null;
    public player: PlayerInterfaceA;
    public room: RoomInterfaceA;

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
    private myHandTilesNode: fgui.GComponent;
    private myLightilesNode: fgui.GComponent;
    private melds: fgui.GComponent[];
    private flowers: fgui.GComponent[];
    private handsOriginPos: PosCtrl[];

    private myView: fgui.GComponent;
    private operationPanel: fgui.GComponent;
    private aniPos: fgui.GObject;
    private userInfoPos: fgui.GObject;

    private qipaoText: fgui.GObject;
    private qipaoEmotion: fgui.GLoader;
    private qipao: fgui.GObject;
    private discardTipsTile: fgui.GComponent;
    private roomHost: RoomHost;
    private lastClickTime: number;
    private lastClickIndex: number;
    private dragHand: fgui.GComponent; //拖牌时 克隆的牌
    private msgTimerCB: Function;
    private isTwoPlayer: boolean = false;
    private piaoScoreWin: fgui.GObject;
    private piaoScoreLose: fgui.GObject;
    private piaoScoreStartPos: cc.Vec2;
    private piaoScoreEndPos: cc.Vec2;
    private voice: fgui.GObject;
    private huoArray: fgui.GObject[];
    public constructor(viewUnityNode: fgui.GComponent, viewChairID: number, room: RoomInterfaceA) {
        this.room = room;
        this.viewChairID = viewChairID;
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
        this.initOtherView(viewUnityNode);
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
        // this.initFlowers();
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

                h.getChild("huo").visible = false;
            }
            if (this.viewChairID === 1 || this.viewChairID === 3) {
                this.myLightilesNode.x = lightsPos2[this.viewChairID - 1][0];
                this.myLightilesNode.y = lightsPos[this.viewChairID - 1][0];
            } else {
                this.myLightilesNode.y = lightsPos2[this.viewChairID - 1][0];
                this.myLightilesNode.x = lightsPos[this.viewChairID - 1][0];
            }
            const s = lightsScale[this.viewChairID - 1][0];
            this.myLightilesNode.setScale(s, s);
        }
    }

    //隐藏手牌列表
    public hideHands(): void {
        if (this.hands != null) {
            for (const h of this.hands) {
                h.visible = false;
            }

            if (this.viewChairID === 1 || this.viewChairID === 3) {
                //改变x值
                this.myHandTilesNode.x = handsPos[this.viewChairID - 1][0];
            } else {
                //改变y值
                this.myHandTilesNode.y = handsPos[this.viewChairID - 1][0];
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
                for (let i = 1; i < 5; i++) {
                    meld.getChild(`n${i}`).asCom.getChild("huo").visible = false;
                }
            }
        }
    }

    //隐藏花牌列表
    public hideFlowers(): void {
        if (this.flowers != null) {
            for (const f of this.flowers) {
                f.visible = false;
            }
        }
    }

    //显示花牌，注意花牌需要是平放的
    public showFlowers(): void {
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
            TileImageMounterA.mountTileImage(d, tileID);
            d.visible = true;
        }
    }
    //显示打出去的牌，明牌显示
    public async showDiscarded(newDiscard: boolean, waitDiscardReAction: boolean, isPiao: boolean = false): Promise<void> {
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
            TileImageMounterA.mountTileImage(lastD, lastT);
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
            const xy = lastD.node.position;
            xy.x += 20;
            xy.y += 15;
            await this.room.roomView.playPiaoEffect(xy);
        }
    }

    //把打出的牌放大显示
    public enlargeDiscarded(discardTileId: number, waitDiscardReAction: boolean): void {
        if (discardTileId === undefined || discardTileId === null || discardTileId <= 0) {
            return;
        }
        const discardTips = this.discardTips;
        const discardTipsTile = this.discardTipsTile;
        TileImageMounterA.mountTileImage(discardTipsTile, discardTileId);
        discardTips.visible = true;
        // if (waitDiscardReAction) {
        //     this.player.waitDiscardReAction = true;
        // } else {
        this.roomHost.component.scheduleOnce(
            () => {
                discardTips.visible = false;
            },
            0.5);
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
        const num = this.showMelds();

        for (let i = 0; i < t; i++) {
            this.hands[i].visible = true;
        }

        //重新设置 手牌位置
        let pos = handsPos[this.viewChairID - 1][num];
        if (num === 12 && melds.length === 4) {
            pos = handsPos[this.viewChairID - 1][1]; //特殊位置
        }
        if (this.viewChairID === 1 || this.viewChairID === 3) {
            //改变x值
            this.myHandTilesNode.x = pos;
        } else {
            //改变y值
            this.myHandTilesNode.y = pos;
        }
    }
    //显示面子牌组
    public showMelds(isHu: boolean = false): number {
        this.meldLans = [];
        const ms = this.player.tilesMelds;
        const length = ms.length;
        // let g = 0;
        // let p = 0;
        let num = 0;
        for (let i = 0; i < length; i++) {
            const mv = this.melds[i];
            //根据面子牌挂载牌的图片
            const meldData = ms[i];
            // Logger.debug("根据面子牌挂载牌的图片 : ", meldData);
            const arr = this.mountMeldImage(mv, meldData, isHu);
            // if (arr.length === 4) {
            //     g++;
            // } else {
            //     p++;
            // }
            num += arr.length;
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

        return num;
        // const o = meldsScale[g][p];
        // const v = (o) * this.meldsViewScale;
        // this.myMeldNode.setScale(v, v);
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
    public mountMeldImage(
        meldView: fgui.GComponent, msgMeld: protoHH.casino_gdy.packet_sc_op_ack, isHu: boolean = false): fgui.GComponent[] {

        const pp = this.room.getPlayerByPlayerID(msgMeld.target_id);
        let viewChairID = this.viewChairID;
        if (pp !== undefined && pp.chairID !== undefined && pp.chairID !== null) {
            viewChairID = this.room.getPlayerViewChairIDByChairID(pp.chairID);
        }
        const t1 = meldView.getChild("n1").asCom;
        const t2 = meldView.getChild("n2").asCom;
        const t3 = meldView.getChild("n3").asCom;
        const t4 = meldView.getChild("n4").asCom;
        let arr: fgui.GComponent[] = [t1, t2, t3];
        // t1.visible = true;
        // t2.visible = true;
        // t3.visible = true;
        let meldType = msgMeld.op;

        const tile = msgMeld.cards[0];
        TileImageMounterA.mountMeldEnableImage(t1, tile, this.viewChairID);
        TileImageMounterA.mountMeldEnableImage(t2, tile, this.viewChairID);
        TileImageMounterA.mountMeldEnableImage(t3, tile, this.viewChairID);
        TileImageMounterA.mountMeldEnableImage(t4, tile, this.viewChairID);

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
        // Logger.debug("isHu ------------- ", isHu);
        if (isHu) {
            if (this.viewChairID === 2 || this.viewChairID === 3) {
                //要反一下
                const a2: fgui.GComponent[] = [];
                for (let i = arr.length - 1; i >= 0; i--) {
                    a2.push(arr[i]);
                }
                arr = a2;
            }
            for (const a of arr) {
                const huo = a.getChild("huo");
                huo.visible = true;
                this.huoArray.push(huo);
                // const meldView = fgui.UIPackage.createObject("lobby_mahjong", resName).asCom;
                // meldView.setPosition(mv.x, mv.y);
                // meldView.name = `myMeld${i}`;
                // mymeldTilesNode.addChild(meldView);
            }
        }

        return arr;
    }

    public hideFlowerOnHandTail(): void {
        this.hands[13].visible = false;
    }

    public showFlowerOnHandTail(flower: number): void {
        this.hands[13].visible = true;
        //const player = this.player
        if (this.viewChairID === 1) {
            TileImageMounterA.mountTileImage(this.hands[13], flower);
        }
    }

    public showDeal(): void {
        SoundMgr.playEffectAudio(`gameb/mj_mo`);
        if (this.player.isMe()) {
            const tileshand = this.player.tilesHand;
            for (let i = 0; i < tileshand.length; i++) {
                const h = this.hands[12 - i];
                const t = tileshand[i];
                TileImageMounterA.mountTileImage(h, t);
                h.getChild("laiziMask").visible = t === this.room.laiziID;
                h.getChild("laizi").visible = t === this.room.laiziID;
                h.visible = true;
            }
        } else {
            if (this.room.isReplayMode()) {
                const tileshand = this.player.tilesHand;
                for (let i = 0; i < tileshand.length; i++) {
                    const h = this.lights[12 - i];
                    const t = tileshand[i];
                    TileImageMounterA.mountTileImage(h, t);
                    h.getChild("laiziMask").visible = t === this.room.laiziID;
                    // h.getChild("laizi").visible = t === this.room.laiziID;
                    h.visible = true;
                }
            } else {
                for (let i = 0; i < this.player.tileCountInHand; i++) {
                    this.hands[12 - i].visible = true;
                }
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
                TileImageMounterA.mountTileImage(this.hands[13], tileshand[0]);
                handsClickCtrls[13].tileID = tileshand[0];
                this.hands[13].getChild("laiziMask").visible = tileshand[0] === this.room.laiziID;
                this.hands[13].getChild("laizi").visible = tileshand[0] === this.room.laiziID;
                begin = 1;
            } else {
                TileImageMounterA.mountTileImage(this.hands[13], tileshand[tileCountInHand - 1]);
                handsClickCtrls[13].tileID = tileshand[tileCountInHand - 1];
                this.hands[13].getChild("laiziMask").visible = tileshand[tileCountInHand - 1] === this.room.laiziID;
                this.hands[13].getChild("laizi").visible = tileshand[tileCountInHand - 1] === this.room.laiziID;
                endd = tileCountInHand - 1;
            }
        }

        //melds面子牌组
        const num = this.showMelds();

        let j = 0;
        for (let i = begin; i < endd; i++) {
            const h = this.hands[j];
            const t = tileshand[i];
            TileImageMounterA.mountTileImage(h, t);
            h.getChild("laiziMask").visible = t === this.room.laiziID;
            h.getChild("laizi").visible = t === this.room.laiziID;
            h.visible = true;
            handsClickCtrls[j].tileID = t;
            j = j + 1;
        }

        //重新设置 手牌位置
        let pos = handsPos[this.viewChairID - 1][num];
        if (num === 12 && melds.length === 4) {
            pos = handsPos[this.viewChairID - 1][1]; //特殊位置
        }
        if (this.viewChairID === 1 || this.viewChairID === 3) {
            //改变x值
            this.myHandTilesNode.x = pos;
        } else {
            //改变y值
            this.myHandTilesNode.y = pos;
        }
    }

    //把手牌摊开，包括对手的暗杠牌，用于一手牌结束时
    public hand2Exposed(wholeMove: boolean, isHu: boolean = false): void {
        if (isHu) {
            this.huoArray = [];
        }
        //不需要手牌显示了，全部摊开
        this.hideLights();

        //先显示所有melds面子牌组
        const melds = this.player.tilesMelds;
        const tileshand = this.player.tilesHand;
        const num = this.showMelds(isHu);
        const tileCountInHand = tileshand.length;

        let begin = 0;
        let endd = tileCountInHand;

        const meldCount = melds.length;
        let light13;
        if ((meldCount * 3 + tileCountInHand) > 13) {
            light13 = this.lights[13];
            if (wholeMove) {
                TileImageMounterA.mountTileImage(light13, tileshand[tileCountInHand - 1]);
                light13.visible = true;
                light13.getChild("laiziMask").visible = tileshand[tileCountInHand - 1] === this.room.laiziID;
                endd = tileCountInHand - 1;
            } else {
                TileImageMounterA.mountTileImage(light13, tileshand[0]);
                light13.visible = true;
                light13.getChild("laiziMask").visible = tileshand[0] === this.room.laiziID;
                begin = 1;
            }
        }
        const huoArrayTem: fgui.GObject[] = [];
        let j = 0;
        for (let i = begin; i < endd; i++) {
            const light = this.lights[j];
            TileImageMounterA.mountTileImage(light, tileshand[i]);
            light.visible = true;
            light.getChild("laiziMask").visible = tileshand[i] === this.room.laiziID;
            if (isHu) {
                const huo = light.getChild("huo");
                huo.visible = true;
                huoArrayTem.push(huo);
            }
            j = j + 1;
        }
        if (huoArrayTem.length > 0) {
            //反序
            for (let i = huoArrayTem.length - 1; i >= 0; i--) {
                this.huoArray.push(huoArrayTem[i]);
            }
        }
        if (light13 !== undefined && light13 !== null && isHu) {
            const huo = light13.getChild("huo");
            huo.visible = true;
            this.huoArray.push(huo);
        }

        //重新设置 手牌位置
        let arr = lightsPos2[this.viewChairID - 1];
        if (isHu) {
            arr = lightsPos1[this.viewChairID - 1];
            const s = lightsScale[this.viewChairID - 1][1];
            this.myLightilesNode.setScale(s, s);
            if (this.viewChairID === 1 || this.viewChairID === 3) {
                //改变x值
                this.myLightilesNode.y = lightsPos[this.viewChairID - 1][1];
            } else {
                //改变y值
                this.myLightilesNode.x = lightsPos[this.viewChairID - 1][1];
            }
        }
        let pos = arr[num];
        if (num === 12 && melds.length === 4) {
            pos = arr[1]; //特殊位置
        }
        if (this.viewChairID === 1 || this.viewChairID === 3) {
            //改变x值
            this.myLightilesNode.x = pos;
        } else {
            //改变y值
            this.myLightilesNode.y = pos;
        }
    }

    public async hideHuoArray(): Promise<void> {
        if (this.huoArray.length > 0) {
            for (const huo of this.huoArray) {
                huo.visible = false;
                await this.room.coWaitSeconds(0.01);
            }
        }

        this.huoArray = [];
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
        this.head.headView.onClick(this.player.onPlayerInfoClick, this.player);

        this.head.nameText.text = CommonFunction.nameFormatWithCount(this.player.mNick, 6);
        this.head.nameText.visible = true;
        //头像
        CommonFunction.setHead(this.head.headLoader, playerInfo.headIconURI, playerInfo.gender);
    }

    //显示桌主
    public showOwner(): void {
        //
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

    //特效道具播放
    public playerDonateEffect(effectName: string): void {
        this.roomHost.animationMgr.play(`lobby/prefabs/donate/${effectName}`, this.head.headView.node);
    }
    //起手听特效播放
    public playReadyHandEffect(): void {
        //this. playerOperationEffect(dfConfig.EFF_DEFINE.SUB_ZI_TING)
    }

    public getUserInfoPos(): fgui.GObject {
        return this.userInfoPos;
    }

    //显示聊天消息
    public showChatMsg(chatData: protoHH.casino.packet_table_chat): void {
        if (chatData !== undefined && chatData !== null) {
            if (this.msgTimerCB === undefined) {
                this.msgTimerCB = <Function>this.hideChatMsg.bind(this);
            }

            let emotionIndex = 3;
            if (chatData.chat_id < 7) {
                emotionIndex = 4;
            } else if (chatData.chat_id < 14) {
                emotionIndex = 1;
            } else if (chatData.chat_id < 21) {
                emotionIndex = 2;
            }

            this.qipaoText.text = PHRASE_MAP[chatData.chat_id];
            this.qipaoEmotion.url = `ui://lobby_bg_package/zm_lt_bq${emotionIndex}`;
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
            this.head.nameText.text = `${CommonFunction.nameFormatWithCount(this.player.mNick, 6)}:${this.player.totalScores}`;
        } else {
            this.head.nameText.text = `${this.player.totalScores}`;
        }
    }

    // 显示获隐藏语音气泡
    public showOrHideVoiceImg(isShow: boolean): void {
        this.voice.visible = isShow;
    }
    private hideChatMsg(): void {
        //
        this.qipao.visible = false;
    }

    private initOtherView(viewUnityNode: fgui.GComponent): void {
        // this.aniPos = view.getChild("aniPos")
        this.userInfoPos = this.myView.getChild("userInfoPos");
        //打出的牌放大显示
        this.discardTips = this.myView.getChild("discardTip").asCom;
        this.discardTipsTile = this.discardTips.getChild("card").asCom;

        // 语音气泡
        this.voice = this.myView.getChild("voice");
        //分数飘字
        const scoreCom = this.myView.getChild("scoreCom").asCom;
        scoreCom.visible = true;
        this.piaoScoreWin = scoreCom.getChild("win");
        this.piaoScoreLose = scoreCom.getChild("lose");
        this.piaoScoreStartPos = scoreCom.getChild("startPos").node.position;
        this.piaoScoreEndPos = scoreCom.getChild("endPos").node.position;
        this.qipao = viewUnityNode.getChild("playerChatMsgCom").asCom.getChild(`player${this.viewChairID}ChatMsgCom`);
        this.qipaoText = this.qipao.asCom.getChild("text");
        this.qipaoEmotion = this.qipao.asCom.getChild("biaoqing").asLoader;

    }

    //头像周边内容节点
    private initHeadView(): void {

        const head = new Head();

        head.headView = this.myView.getChild("head").asCom;
        head.headView.visible = false;
        head.pos = head.headView.getChild("pos");
        head.headLoader = head.headView.getChild("n1").asLoader;

        //庄家标志
        head.bankerFlag = this.myView.getChild("zhuang");
        head.bankerFlag.visible = false;

        head.nameText = this.myView.getChild("nameText");
        head.nameText.visible = false;

        head.hideAll = (): void => {
            head.headView.visible = false;
            head.bankerFlag.visible = false;
            head.nameText.visible = false;
        };

        this.head = head;
    }

    //玩家状态
    private initPlayerStatus(): void {
        //起始
        const onStart = (): void => {

            this.head.nameText.text = CommonFunction.nameFormatWithCount(this.player.mNick, 6);
        };

        //准备
        const onReady = (): void => {
            this.head.headView.grayed = false;
            this.showOwner();
        };

        //离线
        const onLeave = (): void => {
            // this.head.headView.grayed = true;
        };

        //正在玩
        const onPlaying = (): void => {
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
        const prevClickTime = this.lastClickTime;
        this.lastClickTime = this.roomHost.timeElapsed;

        let isDoubleClick = false;

        if (this.lastClickIndex === index &&
            this.lastClickTime - prevClickTime <= 0.5) {
            // 快速点击同一张牌时认为是双击
            isDoubleClick = true;
        }

        this.lastClickIndex = index;
        SoundMgr.playEffectAudio(`gameb/mj_mo`);

        if (isDoubleClick) {
            //双击 直接出牌
            //判断可否出牌
            if (player.waitSkip || !clickCtrl.isDiscardable) {
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

            // return !player.waitSkip;
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
            SoundMgr.playEffectAudio(`gameb/mj_mo`);
            this.restoreHandsPositionAndClickCount(index);
            this.dragHand.visible = true;
            TileImageMounterA.mountTileImage(this.dragHand, this.handsClickCtrls[index].tileID);
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
        for (const clickCtrl of this.handsClickCtrls) {
            clickCtrl.isDiscardable = false;
        }
    }

    //明牌列表
    private initLights(): void {
        const lights: fgui.GComponent[] = [];
        this.myLightilesNode = this.myView.getChild("lights").asCom;
        for (let i = 0; i < 14; i++) {
            const h = this.myLightilesNode.getChild(`n${i + 1}`).asCom;
            const huoPos = h.getChild("huo").asCom;
            this.roomHost.animationMgr.play(`lobby/prefabs/huanghuang/Effect_ico_majiang`, huoPos.getChild("n0").node);
            huoPos.visible = false;
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
            for (let j = 1; j < 5; j++) {
                const tile = meld.getChild(`n${j}`).asCom;
                const huoPos = tile.getChild("huo").asCom;
                this.roomHost.animationMgr.play(`lobby/prefabs/huanghuang/Effect_ico_majiang`, huoPos.getChild("n0").node);
                huoPos.visible = false;
            }
        }
    }
    //手牌列表
    private initHands(): void {
        const hands: fgui.GComponent[] = [];
        const handsOriginPos: PosCtrl[] = [];
        const handsClickCtrls: ClickCtrl[] = [];
        this.myHandTilesNode = this.myView.getChild("hands").asCom;
        //const resName = ""
        const isMe = this.viewChairID === 1;
        for (let i = 0; i < 14; i++) {
            const card = this.myHandTilesNode.getChild(`n${i + 1}`).asCom;

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
                this.dragHand = this.myHandTilesNode.getChild("dragHand").asCom;
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

    //操作按钮
    private initOperationButtons(): void {
        this.skipBtn = this.operationPanel.getChild("skipBtn").asButton;
        this.pengBtn = this.operationPanel.getChild("pengBtn").asButton;
        this.huBtn = this.operationPanel.getChild("huBtn").asButton;
        this.gangBtn = this.operationPanel.getChild("gangBtn").asButton;

        this.skipBtn.onClick(() => { this.player.onSkipBtnClick(); }, this);
        this.pengBtn.onClick(
            () => {
                if (!this.pengBtn.grayed) {
                    this.player.onPongBtnClick();
                }
            },
            this);
        this.huBtn.onClick(
            () => {
                if (!this.huBtn.grayed) {
                    this.player.onWinBtnClick();
                }
            },
            this);
        this.gangBtn.onClick(
            () => {
                if (!this.gangBtn.grayed) {
                    this.player.onKongBtnClick();
                }
            },
            this);

        this.hideOperationButtons();

    }
}
