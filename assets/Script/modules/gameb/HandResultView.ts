import { CommonFunction, DataStore, Dialog, KeyConstants, Logger, SoundMgr } from "../lobby/lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../lobby/protobufjs/long");
import { proto } from "../lobby/protoHH/protoHH";
import { LocalStrings } from "../lobby/strings/LocalStringsExports";
import { ShopView, TabType } from "../lobby/views/shop/ShopViewExports";
// import { GameRules } from "./GameRules";
import { Player } from "./Player";
// import { TypeOfOP } from "./PlayerInterface";
import { RoomInterface } from "./RoomInterface";
// import { RoomRuleView } from "./RoomRuleView";
import { TileImageMounter } from "./TileImageMounter";

const eXTSJ_OP_TYPE = proto.casino_xtsj.eXTSJ_OP_TYPE;

//面子牌组资源 后缀
// const MELD_COMPONENT_SUFFIX: { [key: string]: string } = {
//     [TypeOfOP.Kong]: "gang1",
//     // [mjproto.MeldType.enumMeldTypeExposedKong]: "gang1",
//     // [mjproto.MeldType.enumMeldTypeConcealedKong]: "gang2",
//     [TypeOfOP.Pong]: "chipeng"
//     // [mjproto.MeldType.enumMeldTypeTriplet]: "chipeng"
// };
//落地牌组缩放
// const meldsScale: number[][] = [
//     [0.95, 0.95, 0.95, 0.95, 0.95], //没有杠
//     [0.85, 0.9, 0.9, 0.95], //1个杠
//     [0.8, 0.85, 0.9], //2个杠
//     [0.8, 0.85], //3个杠
//     [0.8] //4个杠
// ];
const hupaiType: { [key: number]: string } = {
    [1001]: "碰", //碰 这个没定义
    [1002]: "飘赖", //飘赖
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_DIANXIAO]: "点笑", //点笑
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_MENGXIAO]: "闷笑", //闷笑
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HUITOUXIAO]: "回头笑", //回头笑
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_XIAOCHAOTIAN]: "小朝天", //小朝天
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_DACHAOTIAN]: "大朝天", //大朝天
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_ZHUOCHONG]: "捉铳", //捉铳
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO]: "黑摸", //黑摸
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMOX2]: "黑摸", //黑摸
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO]: "软摸", //软摸
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMOX2]: "软摸", //软摸
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_FANGXIAO]: "放笑", //放笑
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_PIAOLAIZI]: "飘赖子数", //飘赖子
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_QIANGXIAO]: "抢笑", //抢笑
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_XIAOHOUCHONG]: "笑后铳", //笑后铳
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_BEIQIANGXIAO]: "被抢笑", //被抢笑
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_FANGCHONG]: "放铳", //放铳
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RECHONG]: "热铳", //热铳
    [eXTSJ_OP_TYPE.XTSJ_OP_TYPE_FANGCHAOTIAN]: "放朝天" //放朝天
};

/**
 * palyer ui
 */
class ViewGroup {
    public group: fgui.GComponent;
    public imageIcon: fgui.GObject;
    public imageRoom: fgui.GObject;

    public cardsNode: fgui.GComponent;
    public cards: fgui.GComponent[];
    public melds: fgui.GComponent;
    public meldsViewScale: number = 0;
    public textName: fgui.GObject;
    public nameBg: fgui.GObject;
    public textId: fgui.GObject;
    public zhuang: fgui.GObject;
    public lianzhuang: fgui.GObject;
    public textCountT: fgui.GObject;
    public textCountLoseT: fgui.GObject;
    public textPlayerScore: fgui.GObject;
    public hu: fgui.GObject;
    public ting: fgui.GObject;
    public aniPos: fgui.GObject;
    public ruleText: fgui.GObject;
    public laiziCount: fgui.GObject;
    public kuang: fgui.GObject;
    public collapse: fgui.GObject;
}
/**
 * 显示一手牌结束后的得分结果
 */
export class HandResultView extends cc.Component {
    private eventTarget: cc.EventTarget;
    private room: RoomInterface;
    private unityViewNode: fgui.GComponent = null;
    private win: fgui.Window;
    private msgHandOver: proto.casino.packet_table_score;
    // private players: Player[];
    private textRoomNumber: fgui.GObject;
    private laizi: fgui.GComponent;
    private lastOne: fgui.GComponent;
    private dizhu: fgui.GObject;
    private xiaohaoText: fgui.GObject;
    private date: fgui.GObject;
    private countDown: fgui.GObject;
    // private textTime: fgui.GObject;
    // private fakes: fgui.GComponent[];
    private aniPos: fgui.GObject;
    private result: fgui.GLoader;
    private contentGroup: ViewGroup[];
    private winUserID: string = "";
    private stopTime: number;

    public showView(room: RoomInterface, msgHandOver: proto.casino.packet_table_score): void {
        this.eventTarget = new cc.EventTarget();
        this.winUserID = "";
        this.room = room;
        // 提高消息队列的优先级为1
        if (!room.isReplayMode()) {
            room.getRoomHost().blockNormal();
        }
        const loader = room.getRoomHost().loader;
        loader.fguiAddPackage("gameb/dafeng");
        const view = fgui.UIPackage.createObject("dafeng", "hand_result").asCom;

        CommonFunction.setViewInCenter(view);

        const bg = view.getChild('bg');
        CommonFunction.setBgFullScreenSize(bg);

        this.unityViewNode = view;
        const win = new fgui.Window();
        win.contentPane = view;
        this.win = win;
        //初始化View
        this.initAllView();
        //结算数据
        this.msgHandOver = msgHandOver;

        const againBtn = this.unityViewNode.getChild("againBtn").asButton;
        againBtn.onClick(this.onAgainButtonClick, this);
        this.countDown = againBtn.getChild("n1");
        const backBtn = this.unityViewNode.getChild("backBtn").asButton;
        backBtn.onClick(this.onBackButtonClick, this);

        if (room.isReplayMode()) {
            againBtn.visible = false;

            this.room.getRoomHost().eventTarget.once("closeHandResult", this.closeHandResultView, this);
        } else {
            const timeLeft = 3;
            this.stopTime = this.room.getRoomHost().getServerTime() + (msgHandOver.time - timeLeft);
            if (this.room.isJoyRoom) {
                //欢乐场的话 就显示 再来一局
                const btnText = LocalStrings.findString("againResult");
                this.countDown.text = `${btnText}`;

                backBtn.visible = true;
            } else {
                this.countDownAgain();
                this.unschedule(this.countDownAgain);
                this.schedule(this.countDownAgain, 1, cc.macro.REPEAT_FOREVER);
            }
            this.room.getRoomHost().eventTarget.once("disband", this.onDisband, this);
        }

        //更新数据
        this.updateAllData();

        this.win.show();
    }

    //更新房间相关数据
    private updateRoomData(): void {
        // let en: string;
        // if (this.msgHandOver.op > 0) {
        //     // const myPlayer = <Player>this.room.getMyPlayer();
        //     if (this.room.isMe(`${this.msgHandOver.win_id}`)) {
        //         en = "Effect_jiemian_shengli";
        //     } else {
        //         en = "Effect_jiemian_shibai";
        //     }
        // } else {
        //     en = "Effect_jiemian_huanngzhuang";
        // }
        // 显示赖子
        const laiziCom = this.laizi.getChild("laiziCOm").asCom;
        laiziCom.getChild("laiziMask").visible = true;
        TileImageMounter.mountTileImage(laiziCom, this.room.laiziID);

        // 显示最后一张牌
        if (this.msgHandOver.nextcard !== 0) {
            const lastOneCom = this.lastOne.getChild("laiziCOm").asCom;
            TileImageMounter.mountTileImage(lastOneCom, this.msgHandOver.nextcard);
            this.lastOne.visible = true;
        }

        this.result.visible = true;
        if (this.winUserID === "") {
            // 慌庄
            this.lastOne.visible = false;
            this.result.url = `ui://dafeng/js_zi_lj`;
        } else if (this.room.isMe(`${this.winUserID}`)) {
            // 赢了
            this.result.url = `ui://dafeng/js_zi_yl`;
            this.result.visible = false;
            this.room.getRoomHost().animationMgr.play(`lobby/prefabs/huanghuang/Effect_ico_Yingle`, this.aniPos.node);
        } else {
            // 输了
            this.result.url = `ui://dafeng/js_zi_sl`;
        }

        //房间信息
        if (this.room.roomInfo === null) {
            return;
        }

        let roomNumber = this.room.roomInfo.tag;
        if (roomNumber == null) {
            roomNumber = 0;
        }
        this.textRoomNumber.text = `${LocalStrings.findString("roomNumber")}:${roomNumber}`;

        // 显示底注
        this.dizhu.text = `${LocalStrings.findString("baseScore")}：${this.room.roomInfo.base}`;
        const date = new Date();
        this.date.text = CommonFunction.formatDate(date);
        if (this.room.isJoyRoom && this.room.joyRoom !== null) {
            const str = this.room.joyRoom.cost_param.toString();
            this.xiaohaoText.text = LocalStrings.findString("joyXiaoHao", str);
        }
    }

    //更新玩家基本信息
    private updatePlayerInfoData(playerMin: proto.casino.Iplayer_min, c: ViewGroup, player?: proto.casino.Itable_player): void {
        //名字

        let name = "";
        if (player.channel_nickname !== undefined && player.channel_nickname !== null && player.channel_nickname !== "") {
            name = player.channel_nickname;
        } else {
            name = player.nickname;
        }

        const userID = player.id;
        if (name == null || name === "") {
            name = `${userID}`;
        }
        c.textName.text = name;

        if (this.room.isMe(`${player.id}`)) {
            c.nameBg.visible = true;
            c.kuang.visible = true;
        }

    }
    private sortHands(tilesHand: number[], excludeLast: boolean): void {
        if (tilesHand != null) {
            let last: number;
            if (excludeLast) {
                last = tilesHand.pop();
            }
            tilesHand.sort((x: number, y: number) => {
                return x - y;
            });
            if (excludeLast) {
                tilesHand.push(last);
            }
        }
    }

    private getMelds(pId: number, p: Player): proto.casino_xtsj.packet_sc_op_ack[] {
        if (this.room.isReplayMode()) {
            return p.tilesMelds;
        }
        const tilesMelds: proto.casino_xtsj.packet_sc_op_ack[] = [];
        for (const player of this.msgHandOver.tdata.players) {
            if (player.id === pId) {
                const melds: { [key: string]: proto.casino_gdy.packet_sc_op_ack } = {};
                for (const g of player.groups) {
                    const m = new proto.casino_gdy.packet_sc_op_ack();
                    m.cards = g.cards;
                    m.op = g.op;
                    m.target_id = g.target_id;
                    m.type = g.type;
                    melds[g.cards[0].toString()] = m;
                }
                const keys = Object.keys(melds);
                for (const k of keys) {
                    const m = melds[k];
                    tilesMelds.push(m);
                }
            }
        }

        return tilesMelds;
    }
    //更新牌数据
    private updatePlayerTileData(playerScore: proto.casino.Iplayer_score, c: ViewGroup): void {
        // Logger.debug("playerScore ----------------------- ： ", playerScore);
        //构造落地牌组
        const player = <Player>this.room.getPlayerByPlayerID(playerScore.data.id);
        const meldDatas = this.getMelds(playerScore.data.id, player); // player.tilesMelds;
        let tilesHand = playerScore.curcards.concat([]); //玩家手上的牌（暗牌）排好序的
        let isHeiMo = false;
        if (playerScore.opscores.length > 0) {

            isHeiMo = this.setOpscore(playerScore, c);
        }
        if (playerScore.hupai_card > 0) {
            const majong = this.room.mAlgorithm.canHuPai_defEX(tilesHand, isHeiMo);
            if (majong.bHuPai) {
                const hupaiArray = this.room.mAlgorithm.getArray_hupai(majong.sVecHuPai, playerScore.hupai_card);
                // 将胡的牌从数组中去掉
                let isFind = false;
                const tilesLength = hupaiArray.sBarray.length;
                for (let i = 0; i < tilesLength; i++) {
                    if (hupaiArray.sBarray[i] === playerScore.hupai_card) {
                        hupaiArray.sBarray.splice(i, 1);
                        isFind = true;
                        break;
                    }
                }

                tilesHand = hupaiArray.sParray.concat(hupaiArray.sBarray);

                if (isFind) {
                    tilesHand.push(playerScore.hupai_card);
                }

                this.winUserID = player.userID;
            }
        } else {
            this.sortHands(tilesHand, false);
        }

        for (let i = 1; i <= 4; i++) {
            const mm = c.melds.getChild(`n${i}`);
            mm.visible = false;
        }
        meldDatas.sort((x: proto.casino_xtsj.packet_sc_op_ack, y: proto.casino_xtsj.packet_sc_op_ack) => {
            return x.cards[0] - y.cards[0];
        });
        //摆放牌
        for (let i = 0; i < meldDatas.length; i++) {
            const meldData = meldDatas[i];
            const mv = c.melds.getChild(`n${i + 1}`).asCom;
            player.playerView.mountMeldImage(mv, meldData);
            mv.getChild("ts1").visible = false;
            mv.getChild("ts2").visible = false;
            mv.visible = true;
        }
        //手牌
        let n = -1;
        const tileCountInHand = tilesHand.length;
        for (const oCardObj of c.cards) {
            oCardObj.visible = false;
        }
        for (let i = 0; i < tileCountInHand; i++) {
            const tiles = tilesHand[i];
            n = n + 1;
            const oCardObj = c.cards[n];
            // 空格
            if (i === tileCountInHand - 1 && tileCountInHand < 14 && playerScore.hupai_card > 0) {

                oCardObj.setPosition(oCardObj.node.x + 20, oCardObj.node.y);
            }

            if (n > 14 || n < 0) {
                Logger.error(`set hand cards error, n =  ${n},i = ${i}`);
            }
            TileImageMounter.mountTileImage(oCardObj, tiles);
            if (tiles === this.room.laiziID) {
                oCardObj.getChild("laiziMask").visible = true;
            }

            oCardObj.visible = true;

            // }
        }

        this.setHandsAndMeldPosition(c);

        if (playerScore.hupai_card > 0) {
            c.hu.visible = true;
        } else if (this.isTing(playerScore.curcards)) {
            c.ting.visible = true;
        }

        if (playerScore.data.id === this.room.bankerChairID) {
            c.zhuang.visible = true;
        }
    }

    private setHandsAndMeldPosition(c: ViewGroup): void {
        const handsNode = c.cardsNode;
        const meldsNode = c.melds;
        let convertToNodeSpaceARxPos = 0;

        for (let i = 0; i < 4; i++) {
            const element = meldsNode._children[i];

            if (element.visible === true) {
                const position = element.parent.parent.node.
                    convertToNodeSpaceAR(element.parent.node.convertToWorldSpaceAR(new cc.Vec2(element.x, element.y)));
                convertToNodeSpaceARxPos = position.x + element.width;

            }
        }

        if (convertToNodeSpaceARxPos !== 0) {
            handsNode.node.x = convertToNodeSpaceARxPos - 40;
        }

    }

    private setOpscore(playerScore: proto.casino.Iplayer_score, c: ViewGroup): boolean {
        let opscoreString = "";
        let piaoLaizi = "";
        let haveHeiMo = false;
        for (const opscore of playerScore.opscores) {
            if (hupaiType[opscore.type] === undefined) {
                Logger.error("Unknow opscore type:", opscore.type);
                continue;
            }

            if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_PIAOLAIZI) {
                piaoLaizi = `${hupaiType[opscore.type]}:${opscore.count}`;
                continue;
            }

            let hupaiString: string = "";
            if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO || opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMOX2) {
                // 各种摸没有次数
                hupaiString = hupaiType[opscore.type];
                haveHeiMo = true;
            } else if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO || opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMOX2) {
                // 各种摸没有次数
                hupaiString = hupaiType[opscore.type];
            } else {
                hupaiString = opscore.count > 1 ? `${hupaiType[opscore.type]}:${opscore.count}` : `${hupaiType[opscore.type]}`;
            }

            if (opscoreString === "") {
                opscoreString = hupaiString;
            } else {
                opscoreString = `${opscoreString}/${hupaiString}`;
            }
        }

        c.laiziCount.text = piaoLaizi;
        c.ruleText.text = opscoreString;

        return haveHeiMo;
    }

    //更新显示数据
    private updateAllData(): void {
        // const fakeList: number[] = [];
        for (let i = 0; i < this.msgHandOver.scores.length; i++) {
            const playerScore = this.msgHandOver.scores[i];
            const c = this.contentGroup[i];
            c.group.visible = true;
            //玩家基本信息
            const player = this.msgHandOver.tdata.players[i];
            this.updatePlayerInfoData(playerScore.data, c, player);
            let myScore = 0;
            if (this.msgHandOver.op > 0 && playerScore.score !== null) {
                myScore = playerScore.score;
            }

            this.updatePlayerTileData(playerScore, c);
            // Logger.debug("player : ", player);
            //分数
            if (myScore > 0) {
                c.textCountT.text = `+${myScore}`;
                c.textCountT.visible = true;
                c.textCountLoseT.visible = false;
            } else {
                c.textCountLoseT.text = myScore.toString();
                c.textCountLoseT.visible = true;
                c.textCountT.visible = false;
                if (this.room.isJoyRoom) {
                    if (player.gold !== undefined && player.gold !== null && player.gold.low + myScore <= 0) {
                        c.collapse.visible = true;
                    }
                }
            }
            //显示马牌
            // this.updateFakeList(fakeList);
        }

        // 需要计算出来玩家是赢了、输了、流局了再显示
        this.updateRoomData();
    }

    private initHands(view: fgui.GComponent): fgui.GComponent[] {
        const hands: fgui.GComponent[] = [];
        const myHandTilesNode = view.getChild("hands").asCom;
        for (let i = 0; i < 14; i++) {
            const cname = `n${i + 1}`;
            const card = myHandTilesNode.getChild(cname).asCom;
            card.visible = false;
            hands[i] = card;
        }

        return hands;
    }
    private initAllView(): void {
        //日期时间
        // this.textTime = this.unityViewNode.getChild("date");
        //房间信息
        this.textRoomNumber = this.unityViewNode.getChild("roomNumber");
        this.textRoomNumber.visible = false;

        this.dizhu = this.unityViewNode.getChild("dizhuText");
        this.date = this.unityViewNode.getChild("date");
        this.xiaohaoText = this.unityViewNode.getChild("xiaohaoText");
        const diBg1 = this.unityViewNode.getChild("diBg1");
        const diBg2 = this.unityViewNode.getChild("diBg2");
        const diBg3 = this.unityViewNode.getChild("diBg3");
        if (this.room.isJoyRoom) {
            const num = 120;
            this.dizhu.setPosition(this.dizhu.x, this.dizhu.y - num);
            this.date.setPosition(this.date.x, this.date.y - num);
            diBg1.setPosition(diBg1.x, diBg1.y - num);
            diBg2.setPosition(diBg2.x, diBg2.y - num);

            diBg3.visible = true;
            this.xiaohaoText.visible = true;
        }

        this.laizi = this.unityViewNode.getChild("laizi").asCom;
        this.lastOne = this.unityViewNode.getChild("lastOne").asCom;
        //特效位置节点
        this.aniPos = this.unityViewNode.getChild("aniPos");

        this.result = this.unityViewNode.getChild("loader").asLoader;
        // this.fakes = this.initFakes(this.unityViewNode);
        const contentGroup: ViewGroup[] = [];
        for (let i = 0; i < 4; i++) {
            const contentGroupData = new ViewGroup();
            const group = this.unityViewNode.getChild(`player${i + 1}`).asCom;
            contentGroupData.group = group;
            //头像
            contentGroupData.imageIcon = group.getChild("head");
            // contentGroupData.headView = group:SubGet("ImageIcon/Image", "Image")
            //房主标志
            contentGroupData.imageRoom = group.getChild("roomOwner");
            contentGroupData.imageRoom.visible = false;
            //手牌
            contentGroupData.cards = this.initHands(group);

            //手牌节点
            contentGroupData.cardsNode = group.getChild("hands").asCom;
            //牌组
            contentGroupData.melds = group.getChild("melds").asCom;
            contentGroupData.meldsViewScale = contentGroupData.melds.scaleX;
            //名字
            contentGroupData.textName = group.getChild("name");
            contentGroupData.nameBg = group.getChild("n23");

            contentGroupData.textId = group.getChild("id");
            // contentGroupData.textId.visible = false;
            //庄家
            contentGroupData.zhuang = group.getChild("zhuang");
            contentGroupData.zhuang.visible = false;
            contentGroupData.lianzhuang = group.getChild("lianzhuang");
            contentGroupData.lianzhuang.visible = false;
            //分数为正的时候显示
            contentGroupData.textCountT = group.getChild("text_win");
            contentGroupData.textCountT.text = "0";
            contentGroupData.textCountT.visible = false;
            //分数为负的时候显示
            contentGroupData.textCountLoseT = group.getChild("text_lose");
            contentGroupData.textCountLoseT.text = "0";
            contentGroupData.textCountLoseT.visible = false;

            contentGroupData.ruleText = group.getChild("ruleText");

            contentGroupData.ruleText = group.getChild("ruleText");
            contentGroupData.laiziCount = group.getChild("laiziCount");
            //赢标志的位置
            // contentGroupData.winImagePos = group:Find("WinImagePos")
            //剩余牌数
            contentGroupData.textPlayerScore = group.getChild("score");
            //胡
            contentGroupData.hu = group.getChild("hu");
            //听
            contentGroupData.ting = group.getChild("ting");
            //获胜节点位置
            contentGroupData.aniPos = group.getChild("aniPos");
            contentGroupData.kuang = group.getChild("kuang");
            //破产
            contentGroupData.collapse = group.getChild("collapse");
            //保存userID
            // contentGroupData.userID = "";

            //logError("initAllView var : "..var)
            contentGroup[i] = contentGroupData;

            group.visible = false;
        }
        this.contentGroup = contentGroup;
    }

    // private onShareButtonClick(): void {
    //     Share.shareGame(this.eventTarget, Share.ShareSrcType.GameShare, Share.ShareMediaType.Image, Share.ShareDestType.Friend);
    // }

    // 玩家点击“继续”按钮，注意如果牌局结束，此按钮是“大结算”
    private onAgainButtonClick(): void {
        SoundMgr.buttonTouch();

        this.room.getRoomHost().eventTarget.off("disband");
        this.room.getRoomHost().eventTarget.off("closeHandResult");

        // 降低消息队列的优先级为0
        const room = this.room;
        if (!room.isReplayMode()) {
            this.room.getRoomHost().unblockNormal();
        }
        // if (this.ani) {
        //     this.ani.setVisible(false);
        // }
        const play_total = this.msgHandOver.tdata.play_total;
        const round = this.msgHandOver.tdata.round;
        if (!this.room.isJoyRoom) {
            if (play_total >= round && !room.isReplayMode()) {
                this.room.loadGameOverResultView(this.msgHandOver);
            } else {
                this.room.resetForNewHand();
                this.room.onReadyButtonClick();
            }

            this.closeHandResultView();
        } else {
            //欢乐场的话就再进游戏
            let joyRoom = null;
            const myGold = +DataStore.getString(KeyConstants.BEANS); // this.room.getMyPlayer().totalScores;
            // Logger.debug("myGold ---------------- 欢乐豆 : ", myGold);
            if (this.room.joyRoom.gold.low <= myGold) {
                //如果欢乐豆还够的话 继续这种房间
                joyRoom = this.room.joyRoom;
            } else {
                //否则就找可以进的房间
                const pdataStr = DataStore.getString(KeyConstants.ROOMS, "");
                const rooms = <proto.casino.Iroom[]>JSON.parse(pdataStr);
                for (const r of rooms) {
                    if (r.gold.low <= myGold) {
                        joyRoom = r;
                    }
                }
            }
            // joyRoom = null;
            if (joyRoom !== null) {
                const req = {
                    casino_id: joyRoom.casino_id,
                    room_id: joyRoom.id,
                    table_id: long.fromNumber(0),
                    ready: true
                };

                const req2 = new proto.casino.packet_table_join_req(req);
                const buf = proto.casino.packet_table_join_req.encode(req2);
                // 这里不用阻塞消息
                this.room.getRoomHost().sendBinary(buf, proto.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);

                this.closeHandResultView();
            } else {
                const goldmin = +DataStore.getString(KeyConstants.HELPER_MIN);
                if (goldmin > myGold) {
                    //低于最小值才可以领取
                    // 判断有没有可以免费领
                    const helperCount = this.helperNumber();
                    if (helperCount[0] > 0) {
                        //有得领
                        this.room.getRoomHost().showWelfareView(helperCount[0], helperCount[1]);

                        return;
                    }
                }
                // 提示用户没有豆了
                const yesCB = () => {
                    if (cc.sys.os === cc.sys.OS_IOS) {
                        Dialog.prompt(LocalStrings.findString("noSupportForIOS"));

                        return;
                    }

                    const view = this.addComponent(ShopView);
                    view.showView(this.room.getRoomHost().loader, TabType.Dou);

                    // this.onBackButtonClick();
                };
                const noCB = () => {
                    // this.onBackButtonClick();
                };
                Dialog.showDialog(LocalStrings.findString("beanIsLess"), yesCB, noCB);
            }
        }
    }
    private helperNumber(): number[] {
        const havaHelperNum = [0, 1]; //领取免费豆次数
        const helperTimeStr = DataStore.getString(KeyConstants.HELPER_TIME, "");
        const helperSizeStr = DataStore.getString(KeyConstants.HELPER_SIZE, "");
        const helperParamStr = DataStore.getString(KeyConstants.HELPER_PARAM, "");
        Logger.debug(`helperTimeStr : ${helperTimeStr} ; helperSizeStr : ${helperSizeStr} ; helperParamStr : ${helperParamStr}`);
        if (helperSizeStr !== "") {
            const helperSize = +helperSizeStr;
            if (helperSize > 0) {
                if (this.isToday(helperTimeStr)) {
                    //如果领取的时间是今天
                    if (helperParamStr !== "") {
                        havaHelperNum[0] = helperSize - +helperParamStr;
                    } else {
                        havaHelperNum[0] = helperSize;
                    }
                    havaHelperNum[1] = 0;
                } else {
                    havaHelperNum[0] = helperSize;
                    havaHelperNum[1] = 1;
                }
            }
        }
        Logger.debug("havaHelperNum ： ", havaHelperNum);

        return havaHelperNum;
    }
    private isToday(helperTimeStr: string): boolean {
        if (helperTimeStr === "") {
            return false;
        }
        const time = +helperTimeStr;
        const time0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        const time24 = new Date(new Date().setHours(24, 0, 0, 0)).getTime();
        // Logger.debug(`time : ${time} ; time0 : ${time0} ; time24 : ${time24}`);

        return time0 < time && time < time24;
    }
    private onBackButtonClick(): void {
        SoundMgr.buttonTouch();
        if (!this.room.isReplayMode()) {
            this.room.getRoomHost().unblockNormal();
        }
        this.eventTarget.emit("destroy");
        this.unityViewNode = null;
        this.destroy();
        this.win.hide();
        this.win.dispose();

        this.room.quit();
    }
    private countDownAgain(): void {
        const countDownTime = this.stopTime - this.room.getRoomHost().getServerTime();
        if (countDownTime <= 0) {
            this.unschedule(this.countDownAgain);

            this.onAgainButtonClick();

            return;
        }
        if (countDownTime <= 5) {
            //播放警告声音
            SoundMgr.playEffectAudio("gameb/sound_time", false);
        }

        let btnText = LocalStrings.findString("continue");
        if (this.msgHandOver.tdata.play_total === this.msgHandOver.tdata.round) {
            btnText = LocalStrings.findString("checkScore");
        }
        this.countDown.text = `${countDownTime} ${btnText}`;
    }

    private isTing(handTiles: number[]): boolean {
        if (this.room.mAlgorithm.canTingPaiEX(handTiles)) {
            return true;
        }

        return false;
    }

    private closeHandResultView(): void {
        // Logger.debug("closeHandResult");

        this.eventTarget.emit("destroy");
        this.destroy();
        this.win.hide();
        this.win.dispose();
    }

    private async onDisband(): Promise<void> {
        // Logger.debug("HandResultView.onDisband");
        await this.room.coWaitSeconds(2);
        this.onAgainButtonClick();
    }
}
