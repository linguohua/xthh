import { CommonFunction, Dialog, Logger } from "../lobby/lcore/LCoreExports";
import { proto } from "../lobby/protoHH/protoHH";
import { Share } from "../lobby/shareUtil/ShareExports";
import { LocalStrings } from "../lobby/strings/LocalStringsExports";
// import { Player } from "./Player";
import { RoomInterface } from "./RoomInterface";

/**
 * player ui
 */
class ViewGroup {
    public group: fgui.GComponent;
    public imageIcon: fgui.GObject;
    public imageRoom: fgui.GObject;
    public textName: fgui.GObject;
    public textId: fgui.GObject;
    public zhuang: fgui.GObject;
    public textCountT: fgui.GObject;
    public textCountLoseT: fgui.GObject;
    public textPiaoLai: fgui.GObject;
    public textChaoShi: fgui.GObject;
    public textHuPai: fgui.GObject;
    public textZuoZhuang: fgui.GObject;
    public aniPos: fgui.GObject;
    public bigWiner: fgui.GLoader;
}
/**
 * 显示一手牌结束后的得分结果
 */
export class GameOverResultView extends cc.Component {
    private eventTarget: cc.EventTarget;
    private room: RoomInterface;
    private unityViewNode: fgui.GComponent = null;
    private win: fgui.Window;
    private msgGameOver: proto.casino.packet_table_score;
    private textRoomNumber: fgui.GObject;
    private dateText: fgui.GObject;
    private maxScore: number = 0;
    private minScore: number = 0;
    private maxScoreIndexs: ViewGroup[];
    private minScoreIndexs: ViewGroup[];
    private maxChucker: number = 0;
    private maxChuckerIndexs: ViewGroup[];
    private contentGroup: ViewGroup[];
    public showView(room: RoomInterface, msgGameOver: proto.casino.packet_table_score): void {
        this.eventTarget = new cc.EventTarget();
        // -- 提高消息队列的优先级为1
        if (!room.isReplayMode()) {
            room.getRoomHost().blockNormal();
        }
        const loader = room.getRoomHost().loader;
        loader.fguiAddPackage("gameb/dafeng");
        const viewObj = fgui.UIPackage.createObject("dafeng", "game_over").asCom;

        CommonFunction.setViewInCenter(viewObj);

        const mask = viewObj.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.unityViewNode = viewObj;
        const win = new fgui.Window();
        win.contentPane = viewObj;
        this.win = win;

        //初始化View
        this.initAllView();
        this.room = room;
        //结算数据
        this.msgGameOver = msgGameOver;

        const backHallBtn = this.unityViewNode.getChild("backHallBtn");
        backHallBtn.onClick(this.onCloseButtonClick, this);

        const copyRecordBtn = this.unityViewNode.getChild("copyRecordBtn");
        copyRecordBtn.onClick(this.onCopyClick, this);

        const shanreBtn = this.unityViewNode.getChild("shanreBtn");
        shanreBtn.visible = cc.sys.platform === cc.sys.WECHAT_GAME;
        shanreBtn.onClick(this.onShareButtonClick, this);

        if (room.isReplayMode()) {
            backHallBtn.visible = false;
            copyRecordBtn.visible = false;
            shanreBtn.visible = false;
            this.room.getRoomHost().eventTarget.once("closeGameOverResult", this.closeGameOverResultView, this);
        }
        //更新数据
        this.updateAllData();

        this.resetPosition();

        this.win.show();

    }

    //更新房间相关数据
    private updateRoomData(): void {
        //房间信息
        const roomNumber = this.room.roomInfo.tag;

        const roomNumberText = `${LocalStrings.findString("roomNumber")}:${roomNumber} `;
        const baseScoreText = `${LocalStrings.findString("baseScore")}:${this.room.roomInfo.base} `;
        const roundText = `${LocalStrings.findString("total")}:${this.room.roomInfo.round}${LocalStrings.findString("round")}`;
        this.textRoomNumber.text = `${roomNumberText}  ${baseScoreText}  ${roundText}`;

        this.dateText.text = CommonFunction.formatDate(new Date());
    }
    //更新玩家基本信息
    private updatePlayerInfoData(playerScore: proto.casino.Iplayer_score, c: ViewGroup, player?: proto.casino.Itable_player): void {

        let nameStr = "";
        if (player !== undefined && player.channel_nickname !== null && player.channel_nickname !== "") {
            nameStr = player.channel_nickname;
        } else if (playerScore.data.channel_nickname !== undefined &&
            playerScore.data.channel_nickname !== null && playerScore.data.channel_nickname !== "") {
            nameStr = playerScore.data.channel_nickname;
        } else {
            nameStr = playerScore.data.nickname;
        }

        let channelHead = "";
        if (player !== undefined && player.channel_head !== null && player.channel_head !== "") {
            channelHead = player.channel_head;
        } else {
            channelHead = playerScore.data.channel_head;
        }

        c.textName.text = CommonFunction.nameFormatWithCount(nameStr, 6);

        const iconLoader = c.imageIcon.asCom.getChild("n1").asLoader;
        CommonFunction.setHead(iconLoader, channelHead, playerScore.data.avatar, playerScore.data.sex);

        const userID = playerScore.data.id;
        c.textId.text = `ID:${userID}`;
    }
    //更新玩家分数信息
    private updatePlayerScoreData(playerScore: proto.casino.Iplayer_score, c: ViewGroup, p: proto.casino.Itable_player): void {
        const score = playerScore.score_total;
        // const chucker = playerScore.chuckerCounter;
        if (score > this.maxScore) {
            this.maxScoreIndexs = [];
            this.maxScoreIndexs.push(c);
            this.maxScore = score;
        } else if (score === this.maxScore) {
            this.maxScoreIndexs.push(c);
        }

        if (score < this.minScore) {
            this.minScoreIndexs = [];
            this.minScoreIndexs.push(c);
            this.minScore = score;
        } else if (score === this.minScore && score !== 0) {
            this.minScoreIndexs.push(c);
        }

        if (score < this.maxChucker) {
            this.maxChuckerIndexs = [];
            this.maxChuckerIndexs.push(c);
            this.maxChucker = score;
        } else if (score === this.maxChucker) {
            this.maxChuckerIndexs.push(c);
        }

        if (score >= 0) {
            let add = "+";
            if (score === 0) {
                add = "";
            }
            c.textCountT.text = `${add}${score}`;
            c.textCountT.visible = true;
            c.textCountLoseT.visible = false;
        } else {
            c.textCountLoseT.text = score.toString();
            c.textCountLoseT.visible = true;
            c.textCountT.visible = false;
        }
        if (p !== undefined) {
            //胡牌次数
            if (p.hupai_total !== undefined && p.hupai_total !== null) {
                c.textHuPai.text = `${LocalStrings.findString("huPaiTimes")}: ${p.hupai_total}`;
            }
            //坐庄次数
            if (p.lord_total !== undefined && p.lord_total !== null) {
                c.textZuoZhuang.text = `${LocalStrings.findString("zuoZhuangTimes")}: ${p.lord_total}`;
            }
            //飘赖次数
            if (p.laizi_total !== undefined && p.laizi_total !== null) {
                c.textPiaoLai.text = `${LocalStrings.findString("piaoLaiTimes")}: ${p.laizi_total}`;
            }
            //超时次数
            if (p.timeout_total !== undefined && p.timeout_total !== null) {
                c.textChaoShi.text = `${LocalStrings.findString("chaoShiTimes")}: ${p.timeout_total}`;
            }
        }
    }
    //更新显示数据
    private updateAllData(): void {
        //整个房间数据
        this.updateRoomData();
        // const room = this.room;

        //暂时保存上一个大赢家数据
        this.maxScore = 0;
        this.maxScoreIndexs = [];
        //暂时保存上一个最佳炮手数据
        this.maxChucker = 0;
        this.maxChuckerIndexs = [];
        if (this.msgGameOver !== null) {
            const playerStats = this.msgGameOver.scores;
            const players = this.msgGameOver.tdata.players;
            const ps: { [key: number]: proto.casino.Itable_player } = {};
            for (const p of players) {
                ps[p.id] = p;
            }
            // if (playerStats !== undefined) {
            //     playerStats.sort((x: proto.mahjong.IMsgGameOverPlayerStat, y: proto.mahjong.IMsgGameOverPlayerStat) => {
            //         const a = room.getPlayerViewChairIDByChairID(x.chairID);
            //         const b = room.getPlayerViewChairIDByChairID(y.chairID);

            //         return b - a;
            //     });
            // }
            for (let i = 0; i < playerStats.length; i++) {
                const playerStat = playerStats[i];
                if (playerStat !== undefined && playerStat !== null) {
                    const c = this.contentGroup[i];
                    c.group.visible = true;
                    // const player = <Player>this.room.getPlayerByChairID(playerStat.chairID);
                    //玩家基本信息
                    this.updatePlayerInfoData(playerStat, c, this.msgGameOver.tdata.players[i]);
                    //玩家分数信息
                    this.updatePlayerScoreData(playerStat, c, ps[playerStat.data.id]);
                }
            }

            if (this.maxScore > 0 && this.maxScoreIndexs !== undefined) {
                for (const maxScoreIndex of this.maxScoreIndexs) {
                    maxScoreIndex.bigWiner.url = `ui://dafeng/js_jsdyj`;
                    maxScoreIndex.bigWiner.visible = true;
                    // Logger.debug("bigWiner:", maxScoreIndex.bigWiner);
                    // this.setDYJEffect(maxScoreIndex);
                    // TODO: 设置大赢家
                }
            }

            if (this.minScore < 0 && this.minScoreIndexs !== undefined) {
                for (const minScoreIndex of this.minScoreIndexs) {
                    minScoreIndex.bigWiner.url = `ui://dafeng/js_jsdsj`;
                    minScoreIndex.bigWiner.visible = true;
                }
            }
        }
    }
    //初始化界面
    private initAllView(): void {
        //日期时间
        // this.textTime = self.unityViewNode:GetChild("date")
        //房间信息
        this.textRoomNumber = this.unityViewNode.getChild("roomNumber");
        this.dateText = this.unityViewNode.getChild("date");
        //特效位置节点
        const contentGroup: ViewGroup[] = [];
        for (let i = 0; i < 4; i++) {
            const contentGroupData = new ViewGroup();
            const group = this.unityViewNode.getChild(`player${i + 1}`).asCom;
            contentGroupData.group = group;

            contentGroupData.imageIcon = group.getChild("head");
            //房主标志
            contentGroupData.imageRoom = group.getChild("roomOwner");
            contentGroupData.imageRoom.visible = false;
            //大赢家动画位置
            contentGroupData.aniPos = group.getChild("aniPos");
            contentGroupData.aniPos.visible = false;
            // contentGroupData.imageWin.visible = false
            contentGroupData.zhuang = group.getChild("zhuang");
            contentGroupData.zhuang.visible = false;
            //名字
            contentGroupData.textName = group.getChild("name");
            contentGroupData.textId = group.getChild("id");
            //赢牌次数
            contentGroupData.textZuoZhuang = group.getChild("num_zuo_zhuang");
            contentGroupData.textHuPai = group.getChild("num_hu_pai");
            contentGroupData.textPiaoLai = group.getChild("num_piao_lai");
            contentGroupData.textChaoShi = group.getChild("num_chao_shi");

            contentGroupData.bigWiner = group.getChild("resultLoader").asLoader;
            contentGroupData.bigWiner.visible = false; //大输家
            //分数（赢）
            contentGroupData.textCountT = group.getChild("text_win");
            contentGroupData.textCountT.text = "0";
            contentGroupData.textCountT.visible = false;
            //分数（输）
            contentGroupData.textCountLoseT = group.getChild("text_lose");
            contentGroupData.textCountLoseT.text = "0";
            contentGroupData.textCountLoseT.visible = false;
            //总得分
            contentGroup[i] = contentGroupData;

            group.visible = false;
        }
        this.contentGroup = contentGroup;
    }
    //玩家点击返回按钮
    private onCloseButtonClick(): void {
        // -- 降低消息队列的优先级为0
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

    private onShareButtonClick(): void {
        Share.shareScreenshot("");
        // Share.shareGame(this.eventTarget, Share.ShareSrcType.GameShare, Share.ShareMediaType.Image, Share.ShareDestType.Friend);
    }

    private onCopyClick(): void {
        const table = this.msgGameOver.tdata;
        let gameName = "";
        if (table.room_id === 2100 || table.room_id === 2102) {
            gameName = LocalStrings.findString("xthh");
        } else if (table.room_id === 2103) {
            gameName = LocalStrings.findString("srlm");
        } else if (table.room_id === 2112) {
            gameName = LocalStrings.findString("lrlm");
        }

        const roomNumberText = LocalStrings.findString("roomNumber");
        const gameText = LocalStrings.findString("game");
        const roundCountText = LocalStrings.findString("roundCount");
        const baseScoreText = LocalStrings.findString("baseScore");
        const communityText = LocalStrings.findString("community");
        const gameResultText = LocalStrings.findString("gameResult");
        const recordLinkText = LocalStrings.findString("recordLink");

        // tslint:disable-next-line:prefer-template
        let textData = `${roomNumberText}：${table.tag} \n`
            + `${gameText}：${gameName} \n`
            + `${roundCountText}：${table.play_total}  \n`
            + `${baseScoreText}：${table.base} \n`;

        if (table.guild_id !== null) {
            textData = `${textData}${communityText}：${table.guild_id}\n`;
        }

        textData = `${textData}${gameResultText}：\n----------------------- \n`;

        const playrLength = this.msgGameOver.scores.length;
        for (let i = 0; i < playrLength; i++) {
            const score = this.msgGameOver.scores[i];
            let sc = `${score.score_total}`;
            if (score.score_total > 0) {
                sc = `+${score.score_total}`;
            }

            let nameStr = "";
            if (score.data.channel_nickname !== undefined &&
                score.data.channel_nickname !== null && score.data.channel_nickname !== "") {
                nameStr = score.data.channel_nickname;
            } else {
                nameStr = score.data.nickname;
            }

            textData = `${textData}${i + 1}、${nameStr}(${score.data.id}) ${sc} \n`;
        }
        textData = `${textData} ----------------------- \n`;

        if (this.msgGameOver.replay_id !== null) {
            textData = `${textData}${recordLinkText}：\n`;
        }

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.setClipboardData({
                data: textData,
                // tslint:disable-next-line:no-any
                success: (res: {}) => {
                    console.log(res);
                }
            });
        } else {
            Dialog.showDialog(LocalStrings.findString('testInWeChat'));
        }
    }

    private resetPosition(): void {
        if (this.msgGameOver.scores.length !== 2) {
            return;
        }

        const originPositions: cc.Vec2[] = [];
        for (let i = 0; i < 4; i++) {
            originPositions[i] = new cc.Vec2(this.contentGroup[i].group.x, this.contentGroup[i].group.y);
        }

        this.contentGroup[2].group.visible = false;
        this.contentGroup[3].group.visible = false;

        this.contentGroup[0].group.setPosition(originPositions[1].x, originPositions[1].y);
        this.contentGroup[1].group.setPosition(originPositions[2].x, originPositions[2].y);
    }

    private closeGameOverResultView(): void {
        Logger.debug("closeGameOverResultView");

        this.eventTarget.emit("destroy");
        this.destroy();
        this.win.hide();
        this.win.dispose();
    }
}
