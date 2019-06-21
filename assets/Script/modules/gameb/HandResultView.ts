import { Share } from "../lobby/shareUtil/ShareExports";
import { GameRules } from "./GameRules";
import { Player } from "./Player";
import { proto } from "./proto/protoGame";
import { RoomInterface } from "./RoomInterface";
import { RoomRuleView } from "./RoomRuleView";
import { TileImageMounter } from "./TileImageMounter";

const mjproto = proto.mahjong;

//面子牌组资源 后缀
const MELD_COMPONENT_SUFFIX: { [key: string]: string } = {
    [mjproto.MeldType.enumMeldTypeTriplet2Kong]: "gang1",
    [mjproto.MeldType.enumMeldTypeExposedKong]: "gang1",
    [mjproto.MeldType.enumMeldTypeConcealedKong]: "gang2",
    [mjproto.MeldType.enumMeldTypeSequence]: "chipeng",
    [mjproto.MeldType.enumMeldTypeTriplet]: "chipeng"
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
    public textId: fgui.GObject;
    public zhuang: fgui.GObject;
    public lianzhuang: fgui.GObject;
    public textCountT: fgui.GObject;
    public textCountLoseT: fgui.GObject;
    public textPlayerScore: fgui.GObject;
    public hu: fgui.GObject;
    public aniPos: fgui.GObject;
}
/**
 * 显示一手牌结束后的得分结果
 */
export class HandResultView extends cc.Component {
    private eventTarget: cc.EventTarget;
    private room: RoomInterface;
    private unityViewNode: fgui.GComponent = null;
    private win: fgui.Window;
    private msgHandOver: proto.mahjong.IMsgHandOver;
    private players: Player[];
    private textRoomNumber: fgui.GObject;
    // private textTime: fgui.GObject;
    private fakes: fgui.GComponent[];
    private aniPos: fgui.GObject;
    private contentGroup: ViewGroup[];

    public showView(room: RoomInterface, msgHandOver: proto.mahjong.IMsgHandOver): void {
        this.eventTarget = new cc.EventTarget();
        this.room = room;
        // 提高消息队列的优先级为1
        if (!room.isReplayMode()) {
            room.getRoomHost().blockNormal();
        }
        const loader = room.getRoomHost().loader;
        loader.fguiAddPackage("gameb/dafeng");
        const viewObj = fgui.UIPackage.createObject("dafeng", "hand_result").asCom;
        this.unityViewNode = viewObj;
        const win = new fgui.Window();
        win.contentPane = viewObj;
        this.win = win;
        //初始化View
        this.initAllView();
        //结算数据
        this.msgHandOver = msgHandOver;

        // fairy.GRoot.inst:AddChild(viewObj)

        //排序players
        const players2 = room.getPlayers();
        const players: Player[] = [];
        let i = 0;
        Object.keys(players2).forEach((key: string) => {
            const p = players2[key];
            players[i] = <Player>p;
            i = i + 1;
        });
        players.sort((x: Player, y: Player) => {
            return y.playerView.viewChairID - x.playerView.viewChairID;
        });
        this.players = players;

        const againBtn = this.unityViewNode.getChild("againBtn");
        againBtn.onClick(this.onAgainButtonClick, this);
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

        this.win.show();
    }

    //更新房间相关数据
    private updateRoomData(): void {
        let en: string;
        if (this.msgHandOver.endType !== proto.mahjong.HandOverType.enumHandOverType_None) {
            const myPlayer = <Player>this.room.getMyPlayer();
            if (myPlayer.playerScore.score > 0) {
                en = "Effect_jiemian_shengli";
            } else {
                en = "Effect_jiemian_shibai";
            }
        } else {
            en = "Effect_jiemian_huangzhuang";
        }
        this.room.getRoomHost().animationMgr.play(`lobby/prefabs/mahjong/${en}`, this.aniPos.node);

        // let date: string;
        // if (this.room.isReplayMode()) {

        // } else {
        //     const startTime = this.room.re.msgHandRecord.endTime;
        //     date = os.date("%Y-%m-%d %H:%M", startTime * 60)
        // }
        // this.textTime.text = date;

        //房间信息
        if (this.room.roomInfo === null) {
            return;
        }

        let roomNumber = this.room.roomInfo.roomNumber;
        if (roomNumber == null) {
            roomNumber = "";
        }
        this.textRoomNumber.text = `房号:${roomNumber}`;
    }
    //马牌列表显示
    private updateFakeList(titleList: number[]): void {
        if (titleList.length > 0) {
            for (let i = 0; i < titleList.length; i++) {
                const title = titleList[i];

                const oCardObj = this.fakes[i];
                TileImageMounter.mountTileImage(oCardObj, title);
                oCardObj.visible = true;
            }
        }
    }
    //更新玩家基本信息
    private updatePlayerInfoData(player: Player, c: ViewGroup): void {
        //名字
        let name = player.playerInfo.nick;
        const userID = player.userID;
        if (name == null || name === "") {
            name = userID;
        }
        c.textName.text = name;
        c.textId.text = `ID:${userID}`;
        //房主
        c.imageRoom.visible = player.isMe();
        //庄家
        c.zhuang.visible = this.room.bankerChairID === player.chairID;
        //头像
    }
    //更新牌数据
    private updatePlayerTileData(player: Player, c: ViewGroup): void {
        const meldDatas = player.melds; //落地牌组
        const tilesHand = player.tilesHand; //玩家手上的牌（暗牌）排好序的
        const lastTile = player.lastTile; //玩家最后一张牌
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
            const resName = `${rm}${MELD_COMPONENT_SUFFIX[meldData.meldType]}`;
            const meldView = fgui.UIPackage.createObject("lobby_mahjong", resName).asCom;
            meldView.setPosition(mv.x, mv.y);
            meldView.name = `myMeld${i}`;
            c.melds.addChild(meldView);
            player.playerView.mountMeldImage(meldView, meldData);
        }
        //手牌
        let n = -1;
        let last = false;
        const meldCount = meldDatas.length;
        const tileCountInHand = tilesHand.length;
        const isHu = (meldCount * 3 + tileCountInHand) > 13;
        for (const oCardObj of c.cards) {
            oCardObj.visible = false;
        }
        for (let i = 0; i < tileCountInHand; i++) {
            const tiles = tilesHand[i];
            //因为玩家有可能有两张一样的牌，所以要加一个变量来判断是否已处理
            if (lastTile === tiles && !last && isHu) {
                last = true;
                TileImageMounter.mountTileImage(c.cards[13], tiles);
                c.cards[13].visible = true;
                c.hu.visible = true;
            } else {
                n = n + 1;
                const oCardObj = c.cards[n];
                TileImageMounter.mountTileImage(oCardObj, tiles);
                oCardObj.visible = true;
            }
        }
    }
    //更新详细数据
    private updatePlayerScoreData(player: Player, c: ViewGroup): void {
        const hot = proto.mahjong.HandOverType;
        const playerScores = player.playerScore; //这是在 handleMsgHandOver里面保存进去的
        let textScore = GameRules.getScoreStrs(this.room.roomType, playerScores);

        if (playerScores.winType !== hot.enumHandOverType_None && playerScores.winType !== hot.enumHandOverType_Chucker) {
            const greatWin = playerScores.greatWin;
            if (greatWin !== null) { //&& greatWin.greatWinType !== greatWinType.enumGreatWinType_None) {
                //大胡计分
                const gs = GameRules.getGreatWinScoreStrs(this.room.roomType, greatWin);
                textScore = `${textScore}${gs}`;
                const pg = this.processGreatWin(greatWin);
                textScore = `${textScore}${pg}  `;
            } else {
                //既然不是大胡，必然是小胡  小胡计分
                const miniWin = playerScores.miniWin;
                // let tt = "小胡";
                // if (miniWin.miniWinType !== miniWinType.enumMiniWinType_None) {
                const tt = this.processMiniWin(miniWin);
                // }
                textScore = `${textScore}${tt}`;
            }
            //这里需要作判断，只有roomType为 大丰的时候  才能显示家家庄
            if (GameRules.haveJiaJiaZhuang(this.room.roomType) && this.room.markup !== undefined && this.room.markup > 0) {
                textScore = `${textScore}家家庄x2  `;
            }
        }
        textScore = `${textScore}${GameRules.getFakeListStrs(this.room.roomType, playerScores)}  `;
        c.textPlayerScore.text = textScore;
    }
    //更新显示数据
    private updateAllData(): void {
        this.updateRoomData();
        const fakeList: number[] = [];
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            const c = this.contentGroup[i];
            c.group.visible = true;
            //玩家基本信息
            this.updatePlayerInfoData(player, c);
            let myScore = 0;
            if (this.msgHandOver.endType !== proto.mahjong.HandOverType.enumHandOverType_None) {
                const playerScores = player.playerScore; //这是在 handleMsgHandOver里面保存进去的
                myScore = playerScores.score;

                //分数详情
                this.updatePlayerScoreData(player, c);
                //马牌
                if (GameRules.haveFakeListOfTitles(this.room.roomType) && playerScores.fakeList !== undefined) {
                    for (const fake of playerScores.fakeList) {
                        fakeList.push(fake);
                    }
                }
            }
            this.updatePlayerTileData(player, c);
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
            this.updateFakeList(fakeList);
        }
    }
    //处理大胡数据
    private processGreatWin(greatWin: proto.mahjong.IMsgPlayerScoreGreatWin): string {
        return GameRules.getGreatWinStrs(this.room.roomType, greatWin);
    }
    //处理小胡数据
    private processMiniWin(miniWin: proto.mahjong.IMsgPlayerScoreMiniWin): string {
        return GameRules.getMiniWinStrs(this.room.roomType, miniWin);
    }

    private initFakes(view: fgui.GComponent): fgui.GComponent[] {
        const fakes: fgui.GComponent[] = [];
        const fakeListNode = view.getChild("fakeList").asCom;
        for (let i = 0; i < 13; i++) {
            const cname = `n${i + 1}`;
            const card = fakeListNode.getChild(cname).asCom;
            card.visible = false;
            fakes[i] = card;
        }

        return fakes;
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
        //特效位置节点
        this.aniPos = this.unityViewNode.getChild("aniPos");
        this.fakes = this.initFakes(this.unityViewNode);
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
            contentGroupData.textId = group.getChild("id");
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
            //赢标志的位置
            // contentGroupData.winImagePos = group:Find("WinImagePos")
            //剩余牌数
            contentGroupData.textPlayerScore = group.getChild("score");
            //胡
            contentGroupData.hu = group.getChild("hu");
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
        roomRuleView.updateView(this.room.roomInfo.config);
    }
    // 玩家点击“继续”按钮，注意如果牌局结束，此按钮是“大结算”
    private onAgainButtonClick(): void {
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
        if (this.msgHandOver.continueAble) {
            this.room.onReadyButtonClick();
        }
    }

}
