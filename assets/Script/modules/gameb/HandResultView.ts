import { CommonFunction, DataStore, KeyConstants, Logger } from "../lobby/lcore/LCoreExports";
import { proto } from "../lobby/protoHH/protoHH";
import { Share } from "../lobby/shareUtil/ShareExports";
// import { GameRules } from "./GameRules";
import { Player } from "./Player";
import { TypeOfOP } from "./PlayerInterface";
import { RoomInterface } from "./RoomInterface";
import { RoomRuleView } from "./RoomRuleView";
import { TileImageMounter } from "./TileImageMounter";

const eXTSJ_OP_TYPE = proto.casino_xtsj.eXTSJ_OP_TYPE;

//面子牌组资源 后缀
const MELD_COMPONENT_SUFFIX: { [key: string]: string } = {
    [TypeOfOP.Kong]: "gang1",
    // [mjproto.MeldType.enumMeldTypeExposedKong]: "gang1",
    // [mjproto.MeldType.enumMeldTypeConcealedKong]: "gang2",
    [TypeOfOP.Pong]: "chipeng"
    // [mjproto.MeldType.enumMeldTypeTriplet]: "chipeng"
};

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
    public cards: fgui.GComponent[];
    public melds: fgui.GComponent;
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
    private date: fgui.GObject;
    private countDown: fgui.GObject;
    // private textTime: fgui.GObject;
    // private fakes: fgui.GComponent[];
    private aniPos: fgui.GObject;
    private result: fgui.GLoader;
    private contentGroup: ViewGroup[];

    private countDownTime: number;

    public showView(room: RoomInterface, msgHandOver: proto.casino.packet_table_score): void {
        this.eventTarget = new cc.EventTarget();
        this.room = room;
        // 提高消息队列的优先级为1
        if (!room.isReplayMode()) {
            room.getRoomHost().blockNormal();
        }
        const loader = room.getRoomHost().loader;
        loader.fguiAddPackage("gameb/dafeng");
        const view = fgui.UIPackage.createObject("dafeng", "hand_result").asCom;

        let x = CommonFunction.setBaseViewInCenter(view);

        const newIPhone = DataStore.getString(KeyConstants.ADAPTIVE_PHONE_KEY);
        if (newIPhone === "1") {
            // i phone x 的黑边为 CommonFunction.IOS_ADAPTER_WIDTH
            x = x - CommonFunction.IOS_ADAPTER_WIDTH;
        }
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

        const infoBtn = this.unityViewNode.getChild("guizeBtn");
        infoBtn.onClick(this.onRoomRuleBtnClick, this);
        const shanreBtn = this.unityViewNode.getChild("shanreBtn");
        shanreBtn.visible = cc.sys.platform === cc.sys.WECHAT_GAME;
        shanreBtn.onClick(this.onShareButtonClick, this);

        if (room.isReplayMode()) {
            againBtn.visible = false;
            shanreBtn.visible = false;
        }

        //更新数据
        this.updateAllData();

        this.countDownTime = msgHandOver.time;
        this.unschedule(this.countDownAgian);
        this.schedule(this.countDownAgian, 1, cc.macro.REPEAT_FOREVER);

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
        const lastOneCom = this.lastOne.getChild("laiziCOm").asCom;
        this.lastOne.visible = true;
        TileImageMounter.mountTileImage(lastOneCom, this.msgHandOver.nextcard);

        this.result.visible = true;
        if (this.msgHandOver.win_id === 0) {
            // 慌庄
            this.lastOne.visible = false;
            this.result.url = `ui://dafeng/js_zi_lj`;
        } else if (this.room.isMe(`${this.msgHandOver.win_id}`)) {
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

    //马牌列表显示
    // private updateFakeList(titleList: number[]): void {
    //     if (titleList.length > 0) {
    //         for (let i = 0; i < titleList.length; i++) {
    //             const title = titleList[i];

    //             const oCardObj = this.fakes[i];
    //             TileImageMounter.mountTileImage(oCardObj, title);
    //             oCardObj.visible = true;
    //         }
    //     }
    // }
    //更新玩家基本信息
    private updatePlayerInfoData(player: proto.casino.Iplayer_min, c: ViewGroup): void {
        //名字
        let name = player.nickname;
        const userID = player.id;
        if (name == null || name === "") {
            name = `${userID}`;
        }
        c.textName.text = name;

        if (this.room.isMe(`${player.id}`)) {
            c.nameBg.visible = true;
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
                return y - x;
            });
            if (excludeLast) {
                tilesHand.push(last);
            }
        }
    }
    //更新牌数据
    private updatePlayerTileData(playerScore: proto.casino.Iplayer_score, c: ViewGroup): void {
        Logger.debug("playerScore ----------------------- ： ", playerScore);
        //构造落地牌组
        const player = <Player>this.room.getPlayerByUserID(`${playerScore.data.id}`);
        const meldDatas = player.melds;
        const tilesHand = playerScore.curcards; //玩家手上的牌（暗牌）排好序的
        this.sortHands(tilesHand, false);
        // const lastTile = player.lastTile; //玩家最后一张牌
        //吃碰杠牌
        const rm = "mahjong_mine_meld_";
        for (let i = 1; i <= 4; i++) {
            const mm = c.melds.getChild(`myMeld${i}`);
            if (mm !== undefined && mm !== null) {
                c.melds.removeChild(mm, true);
            }
        }
        //摆放牌
        for (let i = 0; i < meldDatas.length; i++) {
            const meldData = meldDatas[i];
            const mv = c.melds.getChild(`meld${i + 1}`);
            const resName = `${rm}${MELD_COMPONENT_SUFFIX[meldData.op]}`;
            const meldView = fgui.UIPackage.createObject("lobby_mahjong", resName).asCom;
            meldView.setPosition(mv.x, mv.y);
            meldView.name = `myMeld${i}`;
            c.melds.addChild(meldView);
            player.playerView.mountMeldImage(meldView, meldData);
        }
        //手牌
        let n = -1;
        // const last = false;
        // const meldCount = meldDatas.length;
        const tileCountInHand = tilesHand.length;
        // const isHu = (meldCount * 3 + tileCountInHand) > 13;
        for (const oCardObj of c.cards) {
            oCardObj.visible = false;
        }
        for (let i = 0; i < tileCountInHand; i++) {
            const tiles = tilesHand[i];
            //因为玩家有可能有两张一样的牌，所以要加一个变量来判断是否已处理
            // if (lastTile === tiles && !last && isHu) {
            //     last = true;
            //     TileImageMounter.mountTileImage(c.cards[13], tiles);
            //     c.cards[13].visible = true;
            //     c.hu.visible = true;
            // } else {
            n = n + 1;
            const oCardObj = c.cards[n];
            TileImageMounter.mountTileImage(oCardObj, tiles);
            oCardObj.visible = true;
            // }
        }

        if (playerScore.hupai_card > 0) {
            c.hu.visible = true;
        } else if (player.isRichi) {
            c.ting.visible = true;
        }

        if (playerScore.opscores.length > 0) {
            // c.ruleText.text = this.getHupaiType(playerScore);
            this.setOpscore(playerScore, c);
        }

        if (playerScore.data.id === this.room.bankerChairID) {
            c.zhuang.visible = true;
        }
    }

    private setOpscore(playerScore: proto.casino.Iplayer_score, c: ViewGroup): void {
        let opscoreString = "";
        let piaoLaizi = "";
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
            if (opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMO || opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_HEIMOX2
                || opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMO || opscore.type === eXTSJ_OP_TYPE.XTSJ_OP_TYPE_RUANMOX2) {
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
    }
    //更新详细数据
    // private updatePlayerScoreData(player: Player, c: ViewGroup): void {
    //     const hot = proto.mahjong.HandOverType;
    //     const playerScores = player.playerScore; //这是在 handleMsgHandOver里面保存进去的
    //     let textScore = GameRules.getScoreStrs(this.room.roomType, playerScores);

    //     if (playerScores.winType !== hot.enumHandOverType_None && playerScores.winType !== hot.enumHandOverType_Chucker) {
    //         const greatWin = playerScores.greatWin;
    //         if (greatWin !== null) { //&& greatWin.greatWinType !== greatWinType.enumGreatWinType_None) {
    //             //大胡计分
    //             const gs = GameRules.getGreatWinScoreStrs(this.room.roomType, greatWin);
    //             textScore = `${textScore}${gs}`;
    //             const pg = this.processGreatWin(greatWin);
    //             textScore = `${textScore}${pg}  `;
    //         } else {
    //             //既然不是大胡，必然是小胡  小胡计分
    //             const miniWin = playerScores.miniWin;
    //             // let tt = "小胡";
    //             // if (miniWin.miniWinType !== miniWinType.enumMiniWinType_None) {
    //             const tt = this.processMiniWin(miniWin);
    //             // }
    //             textScore = `${textScore}${tt}`;
    //         }
    //         //这里需要作判断，只有roomType为 大丰的时候  才能显示家家庄
    //         if (GameRules.haveJiaJiaZhuang(this.room.roomType) && this.room.markup !== undefined && this.room.markup > 0) {
    //             textScore = `${textScore}家家庄x2  `;
    //         }
    //     }
    //     textScore = `${textScore}${GameRules.getFakeListStrs(this.room.roomType, playerScores)}  `;
    //     c.textPlayerScore.text = textScore;
    // }
    //更新显示数据
    private updateAllData(): void {
        this.updateRoomData();
        // const fakeList: number[] = [];
        for (let i = 0; i < this.msgHandOver.scores.length; i++) {
            const playerScore = this.msgHandOver.scores[i];
            const c = this.contentGroup[i];
            c.group.visible = true;
            //玩家基本信息
            this.updatePlayerInfoData(playerScore.data, c);
            let myScore = 0;
            if (this.msgHandOver.op > 0) {
                myScore = playerScore.score;

                //分数详情
                // this.updatePlayerScoreData(playerScore, c);
                //马牌
                // if (GameRules.haveFakeListOfTitles(this.room.roomType) && playerScores.fakeList !== undefined) {
                //     for (const fake of playerScores.fakeList) {
                //         fakeList.push(fake);
                //     }
                // }
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
    }
    //处理大胡数据
    // private processGreatWin(greatWin: proto.mahjong.IMsgPlayerScoreGreatWin): string {
    //     return GameRules.getGreatWinStrs(this.room.roomType, greatWin);
    // }
    // //处理小胡数据
    // private processMiniWin(miniWin: proto.mahjong.IMsgPlayerScoreMiniWin): string {
    //     return GameRules.getMiniWinStrs(this.room.roomType, miniWin);
    // }

    // private initFakes(view: fgui.GComponent): fgui.GComponent[] {
    //     const fakes: fgui.GComponent[] = [];
    //     const fakeListNode = view.getChild("fakeList").asCom;
    //     for (let i = 0; i < 13; i++) {
    //         const cname = `n${i + 1}`;
    //         const card = fakeListNode.getChild(cname).asCom;
    //         card.visible = false;
    //         fakes[i] = card;
    //     }

    //     return fakes;
    // }
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
            //牌组
            contentGroupData.melds = group.getChild("melds").asCom;
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
    private onRoomRuleBtnClick(): void {
        let roomRuleView = this.getComponent(RoomRuleView);

        if (roomRuleView === undefined || roomRuleView == null) {
            roomRuleView = this.addComponent(RoomRuleView);
        }
        // roomRuleView.updateView(this.room.roomInfo.config);
        // TODO: 显示游戏规则
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
        if (play_total >= round) {
            this.room.loadGameOverResultView(this.msgHandOver);
        } else {
            this.room.resetForNewHand();
            this.room.onReadyButtonClick();
        }
    }

    private countDownAgian(): void {
        this.countDownTime = this.countDownTime - 1;
        if (this.countDownTime <= 0) {
            this.unschedule(this.countDownAgian);

            this.onAgainButtonClick();

            return;
        }

        let btnText = `继续`;
        if (this.msgHandOver.tdata.play_total === this.msgHandOver.tdata.round) {
            btnText = `查看积分`;
        }
        this.countDown.text = `${this.countDownTime} ${btnText}`;
    }
}
