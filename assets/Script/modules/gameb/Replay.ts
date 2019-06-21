import { Dialog, Logger, Message, MsgQueue, MsgType } from "../lobby/lcore/LCoreExports";
import { HandlerActionResultChow } from "./handlers/HandlerActionResultChow";
import { HandlerActionResultDiscarded } from "./handlers/HandlerActionResultDiscarded";
import { HandlerActionResultDraw } from "./handlers/HandlerActionResultDraw";
import { HandlerActionResultKongConcealed } from "./handlers/HandlerActionResultKongConcealed";
import { HandlerActionResultKongExposed } from "./handlers/HandlerActionResultKongExposed";
import { HandlerActionResultPong } from "./handlers/HandlerActionResultPong";
import { HandlerActionResultReadyHand } from "./handlers/HandlerActionResultReadyHand";
import { HandlerActionResultTriplet2Kong } from "./handlers/HandlerActionResultTriplet2Kong";
import { HandlerMsgHandOver } from "./handlers/HandlerMsgHandOver";
import { Player } from "./Player";
// import { HandlerMsgHandOver } from "./handlers/HandlerMsgHandOver";
import { proto } from "./proto/protoGame";
import { RoomInterface } from "./RoomInterface";

type ActionHandler = (srAction: proto.mahjong.ISRAction, x?: any) => Promise<void>; // tslint:disable-line:no-any

/**
 * 回播
 */
export class Replay {
    public readonly msgHandRecord: proto.mahjong.SRMsgHandRecorder;
    private room: RoomInterface;

    private speed: number;
    private actionStep: number;
    private modalLayerColor: cc.Color;
    private btnResume: fgui.GObject;
    private btnPause: fgui.GObject;
    private btnFast: fgui.GObject;
    private btnSlow: fgui.GObject;
    private btnBack: fgui.GObject;
    private win: fgui.Window;
    private mq: MsgQueue;
    private timerCb: Function;
    private actionHandlers: { [key: number]: ActionHandler } = {};
    // private latestDiscardedTile: number;
    private latestDiscardedPlayer: Player;

    public constructor(msgHandRecord: proto.mahjong.SRMsgHandRecorder) {

        this.msgHandRecord = msgHandRecord;
    }

    public async gogogo(room: RoomInterface): Promise<void> {
        Logger.debug("gogogogo");
        this.room = room;
        const players = this.msgHandRecord.players;
        players.forEach((p) => {
            //先创建自己
            if (p.userID === this.room.getRoomHost().user.userID) {
                room.createMyPlayer(this.clonePlayer(p));
            }
        });
        players.forEach((p) => {
            //再创建其他人
            if (p.userID !== this.room.getRoomHost().user.userID) {
                room.createPlayerByInfo(this.clonePlayer(p));
            }
        });

        // 挂载action处理handler，复用action result handlers
        this.armActionHandler();
        this.speed = 0.5; //  默认速度, 每2秒一次

        const mq = new MsgQueue({});
        this.mq = mq;

        this.actionStep = -1;

        this.startStepTimer();

        // 显示操作面板
        // 去除模式对话框背景色（40%透明），设置为100%透明
        this.modalLayerColor = fgui.GRoot.inst.modalLayer.color;
        const color = new cc.Color(0, 0, 0, 0);
        fgui.GRoot.inst.modalLayer.color = color;

        this.room.getRoomHost().loader.fguiAddPackage("lobby/fui_replay/lobby_replay");
        const view = fgui.UIPackage.createObject("lobby_replay", "operations").asCom;
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initControlView(view);
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

    private clonePlayer(p: proto.mahjong.ISRMsgPlayerInfo): proto.mahjong.IMsgPlayerInfo {
        return {
            state: 0,
            userID: p.userID,
            chairID: p.chairID,
            nick: p.nick,
            gender: p.gender,
            headIconURI: p.headIconURI,
            avatarID: p.avatarID
        };
    }

    private startStepTimer(): void {
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
        this.btnResume = view.getChild("resume");
        this.btnPause = view.getChild("pause");
        this.btnFast = view.getChild("fast");
        this.btnSlow = view.getChild("slow");
        this.btnBack = view.getChild("back");

        this.btnResume.visible = false;
        this.btnBack.onClick(
            this.onBackClick,
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

        this.btnSlow.onClick(
            this.onSlowClick,
            this
        );
    }

    private onBackClick(): void {
        const msg = new Message(MsgType.quit);
        this.mq.pushMessage(msg);
    }

    private onPauseClick(): void {
        this.btnPause.visible = false;
        this.btnResume.visible = true;
        this.room.getRoomHost().component.unschedule(this.timerCb);
    }

    private onResumeClick(): void {
        this.btnPause.visible = true;
        this.btnResume.visible = false;
        this.startStepTimer();

        const msg = new Message(MsgType.replay);
        this.mq.pushMessage(msg);
    }

    private onFastClick(): void {
        if (this.speed < 0.2) {
            Logger.debug("fastest speed already");
            Dialog.prompt("已经是最快速度");

            return;
        }

        this.room.getRoomHost().component.unschedule(this.timerCb);
        this.speed = this.speed / 2;
        this.startStepTimer();
    }

    private onSlowClick(): void {
        if (this.speed > 3) {
            Logger.debug("slowest speed already");
            Dialog.prompt("已经是最慢速度");

            return;
        }

        this.room.getRoomHost().component.unschedule(this.timerCb);
        this.speed = this.speed * 2;
        this.startStepTimer();
    }

    private armActionHandler(): void {
        const handers: { [key: number]: ActionHandler } = {};
        const actionType = proto.mahjong.ActionType;

        handers[actionType.enumActionType_FirstReadyHand] = <ActionHandler>this.firstReadyHandActionHandler.bind(this);
        handers[actionType.enumActionType_DISCARD] = <ActionHandler>this.discardedActionHandler.bind(this);
        handers[actionType.enumActionType_DRAW] = <ActionHandler>this.drawActionHandler.bind(this);
        handers[actionType.enumActionType_CHOW] = <ActionHandler>this.chowActionHandler.bind(this);
        handers[actionType.enumActionType_PONG] = <ActionHandler>this.pongActionHandler.bind(this);
        handers[actionType.enumActionType_KONG_Exposed] = <ActionHandler>this.kongExposedActionHandler.bind(this);
        handers[actionType.enumActionType_KONG_Concealed] = <ActionHandler>this.kongConcealedActionHandler.bind(this);
        handers[actionType.enumActionType_KONG_Triplet2] = <ActionHandler>this.triplet2KongActionHandler.bind(this);
        handers[actionType.enumActionType_WIN_Chuck] = <ActionHandler>this.winChuckActionHandler.bind(this);
        handers[actionType.enumActionType_WIN_SelfDrawn] = <ActionHandler>this.winSelfDrawActionHandler.bind(this);
        this.actionHandlers = handers;
    }

    private async doReplayStep(): Promise<void> {
        const room = this.room;
        if (this.actionStep === -1) {
            Logger.debug("Replay:doReplayStep, deal");
            // 重置房间
            room.resetForNewHand();
            // 发牌
            this.deal();
        } else {
            const actionlist = this.msgHandRecord.actions;
            if (this.actionStep >= actionlist.length) {
                // 已经播放完成了
                this.room.getRoomHost().component.unschedule(this.timerCb);

                // 结算页面
                await this.handOver();
                this.win.bringToFront();
            } else {
                const a = actionlist[this.actionStep];
                if ((a.flags & proto.mahjong.SRFlags.SRUserReplyOnly) === 0) {
                    await this.doAction(a, actionlist);
                }
            }
        }

        this.actionStep = this.actionStep + 1;
    }

    private async doAction(srAction: proto.mahjong.ISRAction, actionlist: proto.mahjong.ISRAction[]): Promise<void> {
        const room = this.room;
        const i = this.actionStep;
        const player = <Player>room.getPlayerByChairID(srAction.chairID);
        room.setWaitingPlayer(player.chairID);

        const h = this.actionHandlers[srAction.action];
        if (h === undefined) {
            Logger.debug("Replay, no action handler:", srAction.action);

            return;
        }

        if (srAction.action === proto.mahjong.ActionType.enumActionType_DISCARD) {
            const waitDiscardReAction = i < actionlist.length;
            await h(srAction, waitDiscardReAction);
        } else {
            await h(srAction);
        }
    }

    private deal(): void {
        const room = this.room;
        // 房间状态改为playing
        room.state = proto.mahjong.RoomState.SRoomPlaying;
        room.onUpdateStatus(room.state);

        const deals = this.msgHandRecord.deals;
        // 保存一些房间属性
        room.bankerChairID = this.msgHandRecord.bankerChairID;
        // 是否连庄
        room.isContinuousBanker = this.msgHandRecord.isContinuousBanker;
        room.windFlowerID = this.msgHandRecord.windFlowerID;

        // 所有玩家状态改为playing
        const players = room.getPlayers();
        Object.keys(players).forEach((key) => {
            const p = <Player>players[key];
            p.state = proto.mahjong.PlayerState.PSPlaying;
            const onUpdate = p.playerView.onUpdateStatus[p.state];
            onUpdate(room.state);
        });

        // 根据风圈修改
        room.setRoundMask();
        // 修改庄家标志
        room.setBankerFlag();

        let drawCount = 0;
        // 保存每一个玩家的牌列表
        deals.forEach((v) => {
            const chairID = v.chairID;
            const player = <Player>room.getPlayerByChairID(chairID);
            drawCount = drawCount + v.tilesHand.length;
            player.tilesHand = [];
            // 填充手牌列表，所有人的手牌列表
            player.addHandTiles(v.tilesHand);
            // 填充花牌列表
            player.addFlowerTiles(v.tilesFlower);
        });

        // 显示各个玩家的手牌（对手只显示暗牌）和花牌
        Object.keys(players).forEach((key) => {
            const p = <Player>players[key];
            p.sortHands(false);
            p.hand2UI(false);
            p.flower2UI();
        });

        room.tilesInWall = 144 - drawCount;
        room.updateTilesInWallUI();
        // 播放发牌动画，并使用coroutine等待动画完成
        //room.roomView.dealAnimation(mySelf, player1, player2);

        // 等待庄家出牌
        const bankerPlayer = <Player>room.getPlayerByChairID(room.bankerChairID);
        room.setWaitingPlayer(bankerPlayer.chairID);
    }

    private async handOver(): Promise<void> {
        // const room = <Room>this.host.room;
        const handScoreBytes = this.msgHandRecord.handScore;
        const msgHandOver: { continueAble?: boolean; endType?: number; scores?: proto.mahjong.MsgHandScore } = {};
        msgHandOver.continueAble = false;

        if (handScoreBytes === null || handScoreBytes === undefined) {
            msgHandOver.endType = proto.mahjong.HandOverType.enumHandOverType_None;
        } else {
            const handScore = proto.mahjong.MsgHandScore.decode(handScoreBytes);
            let endType;
            handScore.playerScores.forEach((s) => {
                if (s.winType !== proto.mahjong.HandOverType.enumHandOverType_None
                    && s.winType !== proto.mahjong.HandOverType.enumHandOverType_Chucker) {
                    endType = s.winType;
                }
            });

            msgHandOver.endType = endType;
            msgHandOver.scores = handScore;
        }

        // const players = this.room.getPlayers();
        // Object.keys(players).forEach((key: string) => {
        //     const p = <Player>players[key];
        //     const len = p.tilesHand.length;
        //     p.lastTile = p.tilesHand[len - 1]; // 保存最后一张牌，可能是胡牌。。。用于最后结算显示

        // });

        await HandlerMsgHandOver.onHandOver(<proto.mahjong.IMsgHandOver>msgHandOver, this.room);
    }

    private async firstReadyHandActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, firstReadyHand");

        const actionResultMsg = { targetChairID: srAction.chairID };
        await HandlerActionResultReadyHand.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);
    }

    private async discardedActionHandler(srAction: proto.mahjong.ISRAction, waitDiscardReAction: boolean): Promise<void> {
        Logger.debug("llwant, dfreplay, discarded");
        const tiles = srAction.tiles;
        // const discardTileId = tiles[0];
        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionTile: tiles[0],
            waitDiscardReAction: waitDiscardReAction
        };

        await HandlerActionResultDiscarded.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);

        const room = this.room;
        this.latestDiscardedPlayer = <Player>room.getPlayerByChairID(srAction.chairID);
        // this.latestDiscardedTile = discardTileId;

        if ((srAction.flags & proto.mahjong.SRFlags.SRRichi) !== 0) {
            await this.firstReadyHandActionHandler(srAction);
        }
    }

    private async drawActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, draw");
        const tiles = srAction.tiles;
        const tilesFlower: number[] = [];
        const len = tiles.length;
        if (len > 1) {
            for (let i = 0; i < len - 1; i++) {
                tilesFlower.push(tiles[i]);
            }
        }

        const drawTile = tiles[len - 1];
        let drawCnt = len;
        if (drawTile === proto.mahjong.TileID.enumTid_MAX + 1) {
            drawCnt = drawCnt - 1;
        }

        const room = this.room;
        const tilesInWall = room.tilesInWall - drawCnt;

        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionTile: drawTile,
            newFlowers: tilesFlower,
            tilesInWall: tilesInWall
        };

        const player = <Player>room.getPlayerByChairID(srAction.chairID);
        room.setWaitingPlayer(player.chairID);

        await HandlerActionResultDraw.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, room);
    }

    private async chowActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, chow");

        const tiles = srAction.tiles;
        const actionMeld = {
            tile1: tiles[0],
            chowTile: tiles[1],
            meldType: proto.mahjong.MeldType.enumMeldTypeSequence,
            contributor: this.latestDiscardedPlayer.chairID
        };

        const chowTileId = tiles[1];
        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionMeld: actionMeld,
            actionTile: chowTileId
        };

        await HandlerActionResultChow.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);
    }

    private async pongActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, pong");

        const tiles = srAction.tiles;
        const actionMeld = {
            tile1: tiles[0],
            meldType: proto.mahjong.MeldType.enumMeldTypeTriplet,
            contributor: this.latestDiscardedPlayer.chairID
        };

        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionMeld: actionMeld
        };

        await HandlerActionResultPong.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);
    }

    private async kongExposedActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, kong-exposed");
        const tiles = srAction.tiles;
        const actionMeld = {
            tile1: tiles[0],
            meldType: proto.mahjong.MeldType.enumMeldTypeExposedKong,
            contributor: this.latestDiscardedPlayer.chairID
        };

        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionMeld: actionMeld
        };

        await HandlerActionResultKongExposed.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);
    }

    private async kongConcealedActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, kong-concealed");
        const tiles = srAction.tiles;
        const kongTileId = tiles[0];

        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionTile: kongTileId
        };

        await HandlerActionResultKongConcealed.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);
    }

    private async triplet2KongActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, triplet2kong");
        const tiles = srAction.tiles;
        const kongTileId = tiles[0];

        const actionResultMsg = {
            targetChairID: srAction.chairID,
            actionTile: kongTileId
        };

        await HandlerActionResultTriplet2Kong.onMsg(<proto.mahjong.MsgActionResultNotify>actionResultMsg, this.room);
    }

    private async winChuckActionHandler(srAction: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, win chuck ");
        const room = this.room;
        const player = <Player>room.getPlayerByChairID(srAction.chairID);
        player.addHandTile(srAction.tiles[0]);
    }

    private async winSelfDrawActionHandler(srAction?: proto.mahjong.ISRAction): Promise<void> {
        Logger.debug("llwant, dfreplay, win self draw ");
    }
}
