import { CommonFunction } from "../lobby/lcore/LCoreExports";
import { proto } from "../lobby/protoHH/protoHH";
import { Share } from "../lobby/shareUtil/ShareExports";
import { Player } from "./Player";
import { RoomInterface } from "./RoomInterface";

/**
 * palyer ui
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
    private maxScore: number = 0;
    private maxScoreIndexs: ViewGroup[];
    private maxChucker: number = 0;
    private maxChuckerIndexs: ViewGroup[];
    private contentGroup: ViewGroup[];
    private aniPos: fgui.GObject;

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
        const shanreBtn = this.unityViewNode.getChild("shanreBtn");
        shanreBtn.visible = cc.sys.platform === cc.sys.WECHAT_GAME;
        shanreBtn.onClick(this.onShareButtonClick, this);

        //更新数据
        this.updateAllData();
        this.win.show();
    }

    //更新房间相关数据
    private updateRoomData(): void {
        //牌局结算文字动效
        // const x = this.aniPos.x
        // const y = this.aniPos.y
        // animation.play("animations/Effects_jiemian_paijvzongjiesuan.prefab", this.unityViewNode, x, y, true)
        this.room.getRoomHost().animationMgr.play(`lobby/prefabs/mahjong/Effect_zi_jiesuan`, this.aniPos.node);
        //日期时间
        // const date = os.date("%Y-%m-%d %H:%M:%S")
        // this.textTime.text = date
        //房间信息
        const roomNumber = this.room.roomInfo.tag;
        this.textRoomNumber.text = `房号:${roomNumber}`;
    }
    //更新玩家基本信息
    private updatePlayerInfoData(playerScore: proto.casino.Iplayer_score, c: ViewGroup): void {
        //名字
        let name = playerScore.data.nickname;
        const userID = playerScore.data.id;
        if (name == null || name === "") {
            name = userID.toString();
        }
        c.textName.text = name;
        c.textId.text = `ID:${userID}`;
        //房主
        // c.imageRoom.visible = playerScore.isMe();
        //庄家
        // c.zhuang.visible = this.room.bankerChairID === playerScore;
        //头像
    }
    //设置大赢家标志
    private setDYJEffect(c: ViewGroup): void {
        //大赢家动效
        if (c !== null) {
            this.room.getRoomHost().animationMgr.play(`lobby/prefabs/mahjong/Effect_zi_dayingjia`, c.aniPos.node);
        }
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
                c.textHuPai.text = `胡牌次数: ${p.hupai_total}`;
            }
            //坐庄次数
            if (p.lord_total !== undefined && p.lord_total !== null) {
                c.textZuoZhuang.text = `坐庄次数: ${p.lord_total}`;
            }
            //飘赖次数
            if (p.laizi_total !== undefined && p.laizi_total !== null) {
                c.textPiaoLai.text = `飘赖次数: ${p.laizi_total}`;
            }
            //超时次数
            if (p.timeout_total !== undefined && p.timeout_total !== null) {
                c.textChaoShi.text = `超时次数: ${p.timeout_total}`;
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
                    this.updatePlayerInfoData(playerStat, c);
                    //玩家分数信息
                    this.updatePlayerScoreData(playerStat, c, ps[playerStat.data.id]);
                }
                if (this.maxScore > 0 && this.maxScoreIndexs !== undefined) {
                    for (const maxScoreIndex of this.maxScoreIndexs) {
                        this.setDYJEffect(maxScoreIndex);
                    }
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
        //特效位置节点
        this.aniPos = this.unityViewNode.getChild("aniPos");
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

            group.getChild("resultLoader").visible = false; //大输家
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
        Share.shareGame(this.eventTarget, Share.ShareSrcType.GameShare, Share.ShareMediaType.Image, Share.ShareDestType.Friend);
    }
}
