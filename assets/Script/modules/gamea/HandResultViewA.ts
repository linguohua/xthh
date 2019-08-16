import { CommonFunction, Logger } from "../lobby/lcore/LCoreExports";
import { proto } from "../lobby/protoHH/protoHH";
import { Share } from "../lobby/shareUtil/ShareExports";
// import { GameRules } from "./GameRules";
import { PlayerA } from "./PlayerA";
// import { TypeOfOP } from "./PlayerInterface";
import { RoomInterfaceA } from "./RoomInterfaceA";
// import { RoomRuleViewA } from "./RoomRuleViewA";
import { TileImageMounterA } from "./TileImageMounterA";

const eGDY_OP_TYPE = proto.casino_gdy.eGDY_OP_TYPE;

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
    [eGDY_OP_TYPE.GDY_OP_TYPE_DIANXIAO]: "点笑", //点笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_MENGXIAO]: "闷笑", //闷笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_HUITOUXIAO]: "回头笑", //回头笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_XIAOCHAOTIAN]: "小朝天", //小朝天
    [eGDY_OP_TYPE.GDY_OP_TYPE_DACHAOTIAN]: "大朝天", //大朝天
    [eGDY_OP_TYPE.GDY_OP_TYPE_ZHUOCHONG]: "捉铳", //捉铳
    [eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO]: "黑摸", //黑摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_HEIMOX2]: "黑摸", //黑摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO]: "软摸", //软摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_RUANMOX2]: "软摸", //软摸
    [eGDY_OP_TYPE.GDY_OP_TYPE_FANGXIAO]: "放笑", //放笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_PIAOLAIZI]: "飘赖子数", //飘赖子
    [eGDY_OP_TYPE.GDY_OP_TYPE_QIANGXIAO]: "抢笑", //抢笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_XIAOHOUCHONG]: "笑后铳", //笑后铳
    [eGDY_OP_TYPE.GDY_OP_TYPE_BEIQIANGXIAO]: "被抢笑", //被抢笑
    [eGDY_OP_TYPE.GDY_OP_TYPE_FANGCHONG]: "放铳", //放铳
    [eGDY_OP_TYPE.GDY_OP_TYPE_RECHONG]: "热铳", //热铳
    [eGDY_OP_TYPE.GDY_OP_TYPE_FANGCHAOTIAN]: "放朝天" //放朝天
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
}
/**
 * 显示一手牌结束后的得分结果
 */
export class HandResultViewA extends cc.Component {
    private eventTarget: cc.EventTarget;
    private room: RoomInterfaceA;
    private unityViewNode: fgui.GComponent = null;
    private win: fgui.Window;
    private msgHandOver: proto.casino.packet_table_score;
    // private players: Player[];
    private textRoomNumber: fgui.GObject;
    private laizi: fgui.GComponent;
    private lastOne: fgui.GComponent;
    private dizhu: fgui.GObject;
    private date: fgui.GObject;
    private countDown: fgui.GObject;
    // private textTime: fgui.GObject;
    // private fakes: fgui.GComponent[];
    private aniPos: fgui.GObject;
    private result: fgui.GLoader;
    private contentGroup: ViewGroup[];
    private stopTime: number;
    private winUserID: string = "";

    public showView(room: RoomInterfaceA, msgHandOver: proto.casino.packet_table_score): void {
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

        // fairy.GRoot.inst:AddChild(viewObj)

        //排序players
        // const players2 = room.getPlayers();
        // const players: Player[] = [];
        // let i = 0;
        // Object.keys(players2).forEach((key: string) => {
        //     const p = players2[key];
        //     players[i] = <Player>p;
        //     i = i + 1;
        // });
        // players.sort((x: Player, y: Player) => {
        //     return y.playerView.viewChairID - x.playerView.viewChairID;
        // });
        // this.players = players;
        let btnText = `继续`;
        if (msgHandOver.tdata.play_total === msgHandOver.tdata.round) {
            btnText = `查看积分`;
        }

        const againBtn = this.unityViewNode.getChild("againBtn").asButton;
        againBtn.onClick(this.onAgainButtonClick, this);
        this.countDown = againBtn.getChild("n1");
        this.countDown.text = `${msgHandOver.time} ${btnText}`;

        // const shanreBtn = this.unityViewNode.getChild("shanreBtn");
        // shanreBtn.visible = cc.sys.platform === cc.sys.WECHAT_GAME;
        // shanreBtn.onClick(this.onShareButtonClick, this);

        if (room.isReplayMode()) {
            againBtn.visible = false;
            //shanreBtn.visible = false;
            this.room.getRoomHost().eventTarget.once("closeHandResult", this.closeHandResultView, this);
        } else {
            const timeLeft = 3;
            this.stopTime = this.room.getRoomHost().getServerTime() + (msgHandOver.time - timeLeft);

            this.countDownAgian();
            this.unschedule(this.countDownAgian);
            this.schedule(this.countDownAgian, 1, cc.macro.REPEAT_FOREVER);
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
        TileImageMounterA.mountTileImage(laiziCom, this.room.laiziID);

        // 显示最后一张牌
        if (this.msgHandOver.nextcard !== 0) {
            const lastOneCom = this.lastOne.getChild("laiziCOm").asCom;
            TileImageMounterA.mountTileImage(lastOneCom, this.msgHandOver.nextcard);
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
        this.textRoomNumber.text = `房号:${roomNumber}`;

        // 显示底注
        this.dizhu.text = `底注：${this.room.roomInfo.base}`;
        const date = new Date();
        this.date.text = CommonFunction.formatDate(date);
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
        // c.textId.text = `ID:${userID}`;
        //房主
        // c.imageRoom.visible = player.isMe();
        //庄家
        // c.zhuang.visible = this.room.bankerChairID === player.chairID;
        //头像
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
    private getMelds(pId: number, p: PlayerA): proto.casino_xtsj.packet_sc_op_ack[] {
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
    // tslint:disable-next-line:max-func-body-length
    private updatePlayerTileData(playerScore: proto.casino.Iplayer_score, c: ViewGroup): void {
        Logger.debug("playerScore ----------------------- ： ", playerScore);
        //构造落地牌组
        const player = <PlayerA>this.room.getPlayerByUserID(`${playerScore.data.id}`);
        const meldDatas = this.getMelds(playerScore.data.id, player); // player.tilesMelds;
        let tilesHand = playerScore.curcards.concat([]); //玩家手上的牌（暗牌）排好序的
        // this.sortHands(tilesHand, false);
        let isHeiMo = false;
        if (playerScore.opscores.length > 0) {
            // c.ruleText.text = this.getHupaiType(playerScore);
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
        // const lastTile = player.lastTile; //玩家最后一张牌
        //吃碰杠牌
        // const rm = "mahjong_mine_meld_";
        for (let i = 1; i <= 4; i++) {
            const mm = c.melds.getChild(`n${i}`);
            mm.visible = false;
            // if (mm !== undefined && mm !== null) {
            //     c.melds.removeChild(mm, true);
            // }
        }
        meldDatas.sort((x: proto.casino_gdy.packet_sc_op_ack, y: proto.casino_gdy.packet_sc_op_ack) => {
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
            if (i === tileCountInHand - 1 && tileCountInHand < 14 && playerScore.hupai_card > 0) {

                oCardObj.setPosition(oCardObj.node.x + 20, oCardObj.node.y);
            }
            if (n > 14 || n < 0) {
                Logger.error(`set hand cards error, n =  ${n},i = ${i}`);
            }

            TileImageMounterA.mountTileImage(oCardObj, tiles);
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

        // if (playerScore.opscores.length > 0) {
        //     // c.ruleText.text = this.getHupaiType(playerScore);
        //     this.setOpscore(playerScore, c);
        // }

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

            if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_PIAOLAIZI) {
                piaoLaizi = `${hupaiType[opscore.type]}:${opscore.count}`;
                continue;
            }

            let hupaiString: string = "";
            if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_HEIMO || opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_HEIMOX2) {
                // 各种摸没有次数
                hupaiString = hupaiType[opscore.type];
                haveHeiMo = true;
            } else if (opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_RUANMO || opscore.type === eGDY_OP_TYPE.GDY_OP_TYPE_RUANMOX2) {
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
            this.updatePlayerInfoData(playerScore.data, c, this.msgHandOver.tdata.players[i]);
            let myScore = 0;
            if (this.msgHandOver.op > 0 && playerScore.score !== null) {
                myScore = playerScore.score;
            }

            this.updatePlayerTileData(playerScore, c);
            //分数
            if (myScore > 0) {
                c.textCountT.text = `+${myScore}`;
                c.textCountT.visible = true;
                c.textCountLoseT.visible = false;
            } else {
                c.textCountLoseT.text = myScore.toString();
                c.textCountLoseT.visible = true;
                c.textCountT.visible = false;
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

            //保存userID
            // contentGroupData.userID = "";

            //logError("initAllView var : "..var)
            contentGroup[i] = contentGroupData;

            group.visible = false;
        }
        this.contentGroup = contentGroup;
    }

    private onShareButtonClick(): void {
        Share.shareGame(this.eventTarget, Share.ShareSrcType.GameShare, Share.ShareMediaType.Image, Share.ShareDestType.Friend);
    }

    // 玩家点击“继续”按钮，注意如果牌局结束，此按钮是“大结算”
    private onAgainButtonClick(): void {
        Logger.debug("onAgainButtonClick");
        // 降低消息队列的优先级为0
        const room = this.room;
        if (!room.isReplayMode()) {
            this.room.getRoomHost().unblockNormal();
        }
        // if (this.ani) {
        //     this.ani.setVisible(false);
        // }
        this.eventTarget.emit("destroy");
        this.destroy();
        this.win.hide();
        this.win.dispose();

        const play_total = this.msgHandOver.tdata.play_total;
        const round = this.msgHandOver.tdata.round;
        // if (this.msgHandOver.continueAble) {
        if (play_total >= round && !room.isReplayMode()) {
            this.room.loadGameOverResultView(this.msgHandOver);
        } else {
            this.room.resetForNewHand();
            this.room.onReadyButtonClick();
        }
    }

    private countDownAgian(): void {
        const countDownTime = this.stopTime - this.room.getRoomHost().getServerTime();
        if (countDownTime <= 0) {
            this.unschedule(this.countDownAgian);

            this.onAgainButtonClick();

            return;
        }

        let btnText = `继续`;
        if (this.msgHandOver.tdata.play_total === this.msgHandOver.tdata.round) {
            btnText = `查看积分`;
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
        Logger.debug("closeHandResult");

        this.eventTarget.emit("destroy");
        this.destroy();
        this.win.hide();
        this.win.dispose();
    }
}
