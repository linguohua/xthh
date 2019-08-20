import { CommonFunction, DataStore, Logger, Message, MsgQueue, MsgType } from "../lobby/lcore/LCoreExports";
import { proto } from "../lobby/protoHH/protoHH";
import { HandlerActionResultDiscardedA } from "./handlersA/HandlerActionResultDiscardedA";
import { HandlerActionResultDrawA } from "./handlersA/HandlerActionResultDrawA";
import { HandlerMsgActionOPAckA } from "./handlersA/HandlerMsgActionOPAckA";
import { HandlerMsgDealA } from "./handlersA/HandlerMsgDealA";
import { HandlerMsgTableScoreA } from "./handlersA/HandlerMsgTableScoreA";
import { PlayerA } from "./PlayerA";
import { TypeOfOP } from "./PlayerInterfaceA";
import { RoomInterfaceA } from "./RoomInterfaceA";

type ActionHandler = (srAction: proto.casino.Itable_op, x?: any) => Promise<void>; // tslint:disable-line:no-any
enum actionType {
    TABLE_OP_FORGET = 110, //弃操作
    TABLE_OP_DRAWCARD = -1,	// 摸牌
    TABLE_OP_OUTCARD = -2,	// 打牌
    TABLE_OP_END = -3,	// 流局
    TABLE_OP_BET = -4,   // 飘
    TABLE_OP_JIALAIZI = -5,  // 架配子
    TABLE_OP_PENG = 1,  	// 碰
    TABLE_OP_GANG = 2,   	// 杠
    TABLE_OP_HU = 3,  	// 胡
    TABLE_OP_ZIMO = 4,  	// 自摸
    TABLE_OP_CHAOTIAN = 5,  	//  朝天
    TABLE_OP_BUZHUOCHONG = 6,  	//  不做冲
    TABLE_OP_QIANGXIAO = 7,  	//  抢笑
    TABLE_OP_CHI = 8,  	//  吃
    DEF_GDY_REPLAY_OP_GANG_M = 1,  	//  明杠
    DEF_GDY_REPLAY_OP_GANG_B = 2,  	//  补杠
    DEF_GDY_REPLAY_OP_GANG_A = 3,  	// 暗杠
    DEF_GDY_REPLAY_OP_PENG = 9,  	//  碰
    DEF_GDY_REPLAY_OP_FORGET_PENG = 111,  	// 弃碰
    DEF_GDY_REPLAY_OP_XIAOCHAOTIAN = 101,  	// 小朝天
    DEF_GDY_REPLAY_OP_DACHAOTIAN = 102,  	//  大朝天
    DEF_GDY_REPLAY_OP_ZHUOCHONG = 20,  	//  捉铳
    DEF_GDY_REPLAY_OP_QIANGXIAO = 21,  	// 抢笑
    DEF_GDY_REPLAY_OP_HEIMO = 40,  	//  黑摸
    DEF_GDY_REPLAY_OP_RUANMO = 41,  	//  软摸
    DEF_GDY_REPLAY_OP_HEIMOX2 = 50,  	//  黑摸
    DEF_GDY_REPLAY_OP_RUANMOX2 = 51   // 软摸
}
const speedArr: number[] = [2, 1, 0.5, 0.25, 0.125];
/**
 * 回播
 */
export class ReplayA {
    public readonly msgHandRecord: proto.casino.Itable_replay;
    private room: RoomInterfaceA;

    private speed: number;
    private speedIndex: number;
    private roundStep: number;
    private round: proto.casino.Itable_round;
    private actionStep: number;
    private modalLayerColor: cc.Color;
    private btnResume: fgui.GObject;
    private btnPause: fgui.GObject;
    private btnFast: fgui.GObject;
    // private btnSlow: fgui.GObject;
    private btnExit: fgui.GObject;
    private btnReset: fgui.GObject;
    private btnSetting: fgui.GObject;
    private textNum: fgui.GObject;
    private btnNext: fgui.GObject;
    private btnBack: fgui.GObject;
    private btnYY: fgui.GButton;
    private btnYX: fgui.GButton;
    private settingView: fgui.GComponent;
    private win: fgui.Window;
    private mq: MsgQueue;
    private timerCb: Function;
    private actionHandlers: { [key: number]: ActionHandler } = {};
    private isPause: boolean = false;
    // private latestDiscardedTile: number;

    public constructor(msgHandRecord: proto.casino.Itable_replay) {

        this.msgHandRecord = msgHandRecord;
    }

    public async gogogo(room: RoomInterfaceA): Promise<void> {
        Logger.debug("gogogogo");
        this.room = room;

        // 挂载action处理handler，复用action result handlers
        this.armActionHandler();
        this.speed = 2; // 0.5; //  默认速度, 每2秒一次
        this.speedIndex = 0;

        const mq = new MsgQueue({});
        this.mq = mq;

        this.roundStep = 0;
        this.actionStep = 0;

        this.startStepTimer();

        // 显示操作面板
        // 去除模式对话框背景色（40%透明），设置为100%透明
        this.modalLayerColor = fgui.GRoot.inst.modalLayer.color;
        const color = new cc.Color(0, 0, 0, 0);
        fgui.GRoot.inst.modalLayer.color = color;

        this.room.getRoomHost().loader.fguiAddPackage("lobby/fui_replay/lobby_replay");
        const view = fgui.UIPackage.createObject("lobby_replay", "operations").asCom;
        CommonFunction.setViewInCenter(view);
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initControlView(view);
        this.setGrayBtn(true);
        this.win.show();

        let loop = true;
        while (loop) {
            const msg = await this.mq.waitMsg();
            if (msg.mt === MsgType.quit) {
                loop = false;
                break;
            }

            if (msg.mt === MsgType.replay) {
                await this.doReplayStep();
            }
        }

        this.win.hide();
        this.win.dispose();
        fgui.GRoot.inst.modalLayer.color = this.modalLayerColor;
    }

    private stopStepTimer(): void {
        // Logger.debug("replayA stop --------------------- timer");
        this.room.getRoomHost().component.unschedule(this.timerCb);
    }
    private startStepTimer(): void {
        // Logger.debug("replayA start --------------------- timer");
        const cb = () => {
            const mt = new Message(MsgType.replay);
            this.mq.pushMessage(mt);
        };

        this.room.getRoomHost().component.schedule(
            cb,
            this.speed,
            cc.macro.REPEAT_FOREVER);

        this.timerCb = cb;
    }

    private initControlView(view: fgui.GComponent): void {
        this.btnResume = view.getChild("resume"); //开始
        this.btnPause = view.getChild("pause"); //暂停
        this.btnFast = view.getChild("fast"); //加速 减速
        this.btnReset = view.getChild("reset"); //重头开始
        this.btnBack = view.getChild("back"); //上一局
        this.btnNext = view.getChild("next"); //下一局

        // this.btnBack.grayed = true;
        // this.btnNext.grayed = true;

        this.textNum = view.getChild("num"); //速度
        this.textNum.text = "x1";
        this.btnSetting = view.getChild("setting");

        this.settingView = view.getChild("settingView").asCom;
        this.btnExit = this.settingView.getChild("btnExit");
        this.btnYY = this.settingView.getChild("btnYY").asButton;
        this.btnYX = this.settingView.getChild("btnYX").asButton;
        this.btnYY.onClick(this.onMusicSoundBtnClick, this);
        this.btnYX.onClick(this.onEffectSoundBtnClick, this);
        const effectsVolume = DataStore.getString("effectsVolume", "0");
        const musicVolume = DataStore.getString("musicVolume", "0");
        if (+effectsVolume > 0) {
            this.btnYX.selected = true;
        } else {
            this.btnYX.selected = false;
        }

        if (+musicVolume > 0) {
            this.btnYY.selected = true;
        } else {
            this.btnYY.selected = false;
        }

        this.btnResume.visible = false;
        this.btnExit.onClick(
            this.onExitClick,
            this);

        this.btnPause.onClick(
            this.onPauseClick,
            this
        );

        this.btnResume.onClick(
            this.onResumeClick,
            this
        );

        this.btnFast.onClick(
            this.onFastClick,
            this
        );

        this.btnSetting.onClick(
            this.onSettingClick,
            this
        );
        this.btnNext.onClick(
            this.onNextClick,
            this
        );
        this.btnBack.onClick(
            this.onBackClick,
            this
        );
        this.btnReset.onClick(
            this.onResetClick,
            this
        );
    }
    // 音效开关
    private onEffectSoundBtnClick(): void {
        if (this.btnYX.selected) {
            cc.audioEngine.setEffectsVolume(1);
            DataStore.setItem("effectsVolume", 1);
        } else {
            cc.audioEngine.setEffectsVolume(0);
            DataStore.setItem("effectsVolume", 0);
        }
    }

    // 音乐开关
    private onMusicSoundBtnClick(): void {
        if (this.btnYY.selected) {
            cc.audioEngine.setMusicVolume(1);
            DataStore.setItem("musicVolume", 1);
        } else {
            cc.audioEngine.setMusicVolume(0);
            DataStore.setItem("musicVolume", 0);
        }
    }
    private onSettingClick(): void {
        this.settingView.visible = !this.settingView.visible;
    }

    private onExitClick(): void {
        if (this.btnExit.grayed) {
            return;
        }
        const msg = new Message(MsgType.quit);
        this.mq.pushMessage(msg);
    }

    private onPauseClick(): void {
        if (this.btnPause.grayed) {
            return;
        }
        this.btnPause.visible = false;
        this.btnResume.visible = true;
        this.isPause = true;
        this.stopStepTimer();
    }
    private onBackClick(): void {
        //上一局
        if (!this.btnBack.grayed && this.roundStep > 0) {
            this.stopStepTimer();
            this.roundStep--;
            this.actionStep = 0;
            this.startStepTimer();
        }
    }
    private onNextClick(): void {
        //下一局
        if (!this.btnNext.grayed && this.roundStep < this.msgHandRecord.rounds.length - 1) {
            this.stopStepTimer();
            this.roundStep++;
            this.actionStep = 0;
            this.startStepTimer();
        }
    }
    private onResetClick(): void {
        if (this.btnReset.grayed) {
            return;
        }
        this.stopStepTimer();
        //重头开始
        this.roundStep = 0;
        this.actionStep = 0;
        this.startStepTimer();
    }
    private onResumeClick(): void {
        if (this.btnResume.grayed) {
            return;
        }
        this.btnPause.visible = true;
        this.btnResume.visible = false;
        this.isPause = false;
        this.startStepTimer();

        const msg = new Message(MsgType.replay);
        this.mq.pushMessage(msg);
    }

    private onFastClick(): void {
        if (this.btnFast.grayed) {
            return;
        }
        if (this.speedIndex > 2) {
            this.speedIndex = 0;
        } else {
            this.speedIndex++;
        }
        this.speed = speedArr[this.speedIndex];
        this.textNum.text = `x${this.speedIndex + 1}`;

        if (!this.isPause) {
            this.stopStepTimer();
            this.startStepTimer();
        }
        // Logger.debug("this.speed ： ", this.speed);
    }

    //用于播放动画的时候 停止跟开启定时器
    private stopTimer(): void {
        this.setGrayBtn(true);
        this.stopStepTimer();
    }
    private startTimer(): void {
        this.startStepTimer();
        this.setGrayBtn(false);
    }
    private armActionHandler(): void {
        const handers: { [key: number]: ActionHandler } = {};

        handers[actionType.TABLE_OP_OUTCARD] = <ActionHandler>this.discardedActionHandler.bind(this);
        handers[actionType.TABLE_OP_DRAWCARD] = <ActionHandler>this.drawActionHandler.bind(this);
        handers[actionType.TABLE_OP_PENG] = <ActionHandler>this.opAckActionHandler.bind(this);
        handers[actionType.TABLE_OP_GANG] = <ActionHandler>this.opAckActionHandler.bind(this);
        handers[actionType.TABLE_OP_CHAOTIAN] = <ActionHandler>this.opAckActionHandler.bind(this);
        handers[actionType.TABLE_OP_FORGET] = <ActionHandler>this.cancelOpAckActionHandler.bind(this);
        handers[actionType.TABLE_OP_HU] = <ActionHandler>this.scoreActionHandler.bind(this);
        handers[actionType.TABLE_OP_ZIMO] = <ActionHandler>this.scoreActionHandler.bind(this);
        handers[actionType.TABLE_OP_QIANGXIAO] = <ActionHandler>this.scoreActionHandler.bind(this);
        handers[actionType.TABLE_OP_END] = <ActionHandler>this.endeActionHandler.bind(this);

        this.actionHandlers = handers;
    }

    private async doReplayStep(): Promise<void> {
        const room = this.room;
        const roundlist = this.msgHandRecord.rounds;
        if (this.roundStep >= roundlist.length) {
            // 已经播放完成了
            this.stopTimer();
            // 结算页面 （总结算界面）
            await this.handOver();
            this.setGrayBtn(false);
            // this.win.bringToFront();
        } else {
            const round = roundlist[this.roundStep];
            if (this.actionStep === 0) {
                this.round = round;
                // 重置房间
                room.resetForNewHand();
                // 发牌
                this.stopTimer(); //先暂停定时器
                room.handStartted = this.roundStep + 1; //局数要从这里保存进去
                await this.deal(round);
                this.startTimer(); //启动定时器
            }
            // 进入op循环
            const action = round.ops[this.actionStep];
            if (action === undefined || action === null) {
                this.roundStep++;
                this.actionStep = 0;
            } else {
                await this.doAction(action);
                this.actionStep++;
            }
        }
    }

    private async doAction(srAction: proto.casino.Itable_op): Promise<void> {
        const h = this.actionHandlers[srAction.op];
        if (h === undefined) {
            Logger.debug("Replay, no action handler:", srAction.op);

            return;
        }
        await h(srAction);
    }

    private setGrayBtn(isGray: boolean): void {
        this.btnResume.grayed = isGray; //开始
        this.btnPause.grayed = isGray; //暂停
        this.btnFast.grayed = isGray; //加速 减速
        this.btnReset.grayed = isGray; //重头开始
        if (!isGray) {
            this.btnBack.grayed = this.roundStep === 0;
            this.btnNext.grayed = this.roundStep >= this.msgHandRecord.rounds.length - 1;
        } else {
            this.btnBack.grayed = true; //上一局
            this.btnNext.grayed = true; //下一局
        }
    }

    private async deal(round: proto.casino.Itable_round): Promise<void> {
        const dealData = new proto.casino_gdy.packet_sc_start_play();
        dealData.laizi = round.laizi;
        dealData.fanpai = round.fanpai;
        dealData.lord_id = round.lord_id;
        dealData.cards = [this.roundStep];
        dealData.time = 0;

        const msgDeal = proto.casino_gdy.packet_sc_start_play.encode(dealData);
        await HandlerMsgDealA.onMsg(msgDeal, this.room);
    }
    private async discardedActionHandler(srAction: proto.casino.Itable_op): Promise<void> {
        // Logger.debug("llwant, dfreplay, discarded");

        const data = new proto.casino_gdy.packet_sc_outcard_ack();
        data.player_id = srAction.player_id;
        data.card = srAction.card;

        const msg = proto.casino_gdy.packet_sc_outcard_ack.encode(data);

        await HandlerActionResultDiscardedA.onMsg(msg, this.room);
    }

    private async drawActionHandler(srAction: proto.casino.Itable_op): Promise<void> {
        // Logger.debug("llwant, dfreplay, draw");
        const data = new proto.casino_gdy.packet_sc_drawcard();
        data.player_id = srAction.player_id;
        data.card = srAction.card;
        data.time = 0;

        const msg = proto.casino_gdy.packet_sc_drawcard.encode(data);

        await HandlerActionResultDrawA.onMsg(msg, this.room);
    }
    private async endeActionHandler(srAction: proto.casino.Itable_op): Promise<void> {
        // Logger.debug("llwant, dfreplay, end : ", srAction);
        this.stopTimer();
        const pCards = srAction.params;

        //播放动画
        const le = this.room.roomInfo.players.length;
        let effectName = "Effect_ico_zuihousizhang";
        if (le === 2) {
            effectName = "Effect_ico_zuihouerzhang";
        } else if (le === 3) {
            effectName = "Effect_ico_zuihousanzhang";
        }
        await this.room.roomView.playAnimation(effectName, true);

        //增加新抽到的牌到手牌列表
        this.room.mAlgorithm.mahjongTotal_lower(le);
        //牌墙
        this.room.tilesInWall = 0; // room.tilesInWall - le;
        this.room.updateTilesInWallUI();

        if (pCards.length > 0) {
            for (const pCard of pCards) {
                const player = <PlayerA>this.room.getPlayerByUserID(`${pCard.player_id}`);
                player.addHandTile(pCard.card);
                player.sortHands(true); // 新抽牌，必然有14张牌，因此最后一张牌不参与排序
                player.hand2UI(false);
            }
        }
        await this.scoreActionHandler();
        // this.startTimer(); //scoreActionHandler 里面会调startTimer
    }

    private async handOver(): Promise<void> {
        const msgGameOver = new proto.casino.packet_table_score();
        msgGameOver.tdata = this.room.roomInfo;
        //构建scores
        const scores: proto.casino.player_score[] = [];
        for (const ps of this.room.roomInfo.players) {
            const score = new proto.casino.player_score();
            const d = new proto.casino.player_min();
            d.id = ps.id;
            d.nickname = ps.nickname;
            score.data = d;

            score.score_total = ps.score_total;
            scores.push(score);
        }
        msgGameOver.scores = scores;

        this.room.loadGameOverResultView(msgGameOver);

        await this.room.coWaitSeconds(2);
        this.room.getRoomHost().eventTarget.emit("closeGameOverResult");
    }
    private async scoreActionHandler(): Promise<void> {
        // Logger.debug("llwant, dfreplay, scoreActionHandler");
        this.stopTimer();
        const data = new proto.casino.packet_table_score();
        //构建scores
        const scores: proto.casino.player_score[] = [];
        for (const rs of this.round.scores) {
            const score = new proto.casino.player_score();
            const d = new proto.casino.player_min();
            d.id = rs.player_id;
            score.data = d;
            score.hupai_card = rs.hupai_card;
            score.opscores = rs.opscores;
            score.score_total = rs.score_total;
            score.curcards = rs.curcards;
            score.score = rs.score;
            score.opscores = rs.opscores;

            scores.push(score);
        }
        data.scores = scores;
        data.tdata = this.room.roomInfo;
        data.time = 0;
        data.nextcard = this.round.nextcard;
        data.op = 1; //先随便写一个 op>0 handresult 里面判断
        const msg = proto.casino.packet_table_score.encode(data);
        await HandlerMsgTableScoreA.onMsg(msg, this.room);

        await this.room.coWaitSeconds(2);
        this.room.getRoomHost().eventTarget.emit("closeHandResult");
        this.startTimer();
    }
    private async opAckActionHandler(srAction: proto.casino.Itable_op): Promise<void> {
        Logger.debug("llwant, dfreplay, opAckActionHandler");
        const data = new proto.casino_gdy.packet_sc_op_ack();
        data.player_id = srAction.player_id;
        data.op = srAction.op;
        data.type = srAction.type;
        data.target_id = srAction.target_id;
        data.cards = srAction.cards;
        const msg = proto.casino_gdy.packet_sc_op_ack.encode(data);
        await HandlerMsgActionOPAckA.onMsg(msg, this.room);
    }
    private async cancelOpAckActionHandler(srAction: proto.casino.Itable_op): Promise<void> {
        const data = new proto.casino_gdy.packet_sc_op_ack();
        Logger.debug("llwant, dfreplay, cancelOpAckActionHandler ： ", data);
        data.player_id = srAction.player_id;
        data.op = TypeOfOP.Guo;
        data.type = srAction.type;
        data.target_id = srAction.target_id;
        data.cards = srAction.cards;
        // const msg = proto.casino_gdy.packet_sc_op_ack.encode(data);
        // await HandlerMsgActionOPAckA.onMsg(msg, this.room);
        //TODO : 显示 弃操作
        let str = this.room.getPlayerByUserID(`${srAction.player_id}`).mNick;
        if (data.type === actionType.TABLE_OP_ZIMO) {
            str = `${str} 弃自摸`;
        } else if (data.type === actionType.TABLE_OP_BUZHUOCHONG) {
            str = `${str} 弃捉铳`;
        } else if (data.type === actionType.DEF_GDY_REPLAY_OP_GANG_M) {
            str = `${str} 弃点笑`;
        } else if (data.type === actionType.DEF_GDY_REPLAY_OP_GANG_B) {
            str = `${str} 弃回头笑`;
        } else if (data.type === actionType.DEF_GDY_REPLAY_OP_GANG_A) {
            str = `${str} 弃闷笑`;
        } else if (data.type === actionType.DEF_GDY_REPLAY_OP_FORGET_PENG) {
            str = `${str} 弃碰`;
        } else if (data.type === actionType.DEF_GDY_REPLAY_OP_XIAOCHAOTIAN) {
            str = `${str} 弃小朝天`;
        } else if (data.type === actionType.DEF_GDY_REPLAY_OP_DACHAOTIAN) {
            str = `${str} 弃大朝天`;
        }
        this.room.showOrHideCancelCom(true, str);
    }
    // private async winChuckActionHandler(srAction: proto.casino.Itable_op): Promise<void> {
    //     Logger.debug("llwant, dfreplay, win chuck ");
    //     const room = this.room;
    //     const player = <Player>room.getPlayerByChairID(srAction.chairID);
    //     player.addHandTile(srAction.tiles[0]);
    // }

    // private async winSelfDrawActionHandler(srAction?: proto.casino.Itable_op): Promise<void> {
    //     Logger.debug("llwant, dfreplay, win self draw ");
    // }
}
