import { DataStore, Dialog, KeyConstants, Logger, SoundMgr } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { LocalStrings } from "../lobby/strings/LocalStringsExports";
import { ChatView } from "../lobby/views/chat/ChatExports";
import { DisBandPlayerInfo, DisbandView } from "../lobby/views/disbandRoom/DisbandViewExports";
import { GpsView } from "../lobby/views/gps/GpsExports";
import { RoomSettingView } from "../lobby/views/roomSetting/RoomSettingViewExports";
import { Player } from "./Player";
import { PlayerView } from "./PlayerView";
import { ReadyView } from "./ReadyView";
import { RoomInterface, roomStatus, TingPai } from "./RoomInterface";
// import { RoomRuleView } from "./RoomRuleView";
import { TileImageMounter } from "./TileImageMounter";

/**
 * 房间
 */
export class RoomView {
    public playerViews: PlayerView[];
    public listensObj: fgui.GComponent;

    public donateMoveObj: fgui.GLoader;
    public tilesInWall: fgui.GObject;
    public statusHandlers: Function[];
    public unityViewNode: fgui.GComponent;
    private room: RoomInterface;
    private dbg: fgui.GObject;
    private nameBg: fgui.GObject;
    private anteBg: fgui.GObject;
    private settingBtn: fgui.GObject;
    private gpsBtn: fgui.GButton;
    private gpsUnOpen: fgui.GObject;
    private recoredBtn: fgui.GObject;
    private chatBtn: fgui.GObject;

    private roomInfoText: fgui.GObject;
    private roundMarkView: fgui.GComponent;
    private roundMarks: fgui.GObject[];
    private laiziCom: fgui.GComponent;
    private laiziTile: fgui.GComponent;
    private laigenTile: fgui.GComponent;
    private laiziTilePos1: fgui.GObject;
    private laigenTilePos1: fgui.GObject;
    private laiziTilePos2: fgui.GObject;
    private laigenTilePos2: fgui.GObject;
    private countDownText: fgui.GObject;
    private listensObjList: fgui.GList;
    private listensObjNum: fgui.GObject;
    private listensDataList: TingPai[];
    private arrowObj: cc.Node;
    private leftTime: number;
    private leftTimerCB: Function;
    private component: cc.Component;
    private zhuangAniNode: fgui.GObject;
    private zhuangPos: cc.Vec2;
    private aniPos: fgui.GObject;
    private cancelCom: fgui.GComponent;
    private tipsOfMeCom: fgui.GComponent;
    private cancelComText: fgui.GObject;
    private mike: fgui.GObject;
    // private isRecordOpen: boolean = false;
    private recordManager: getRecorderManagerOpts;
    private piaoAni: fgui.GObject;

    private recordStartPosition: cc.Vec2 = null;
    private recordEndPosition: cc.Vec2 = null;
    private readonly moveDistance: number = 50;

    private lastRecordTime: number = 0;
    private lastVoiceBtnClickTime: number = 0;
    private isRecordStart: boolean = true;
    private readyView: ReadyView;

    private gamePauseTipsCom: fgui.GComponent;

    private gamePauseSchedule: Function;
    private gamePauseTime: number;

    private defaultQuitTime: number = 10 * 60;
    // private soundTimeNum: number = 0;

    public constructor(room: RoomInterface, view: fgui.GComponent) {
        this.room = room;
        this.unityViewNode = view;
        this.component = room.getRoomHost().component;

        const playerViews: PlayerView[] = [];
        for (let i = 1; i <= 4; i++) {
            const playerView = new PlayerView(view, i, room);
            playerView.hideAll();
            playerViews[i] = playerView;
        }

        this.playerViews = playerViews;

        this.initButton();
        //房间状态事件初始化
        this.initRoomStatus();

        this.initOtherView();

        this.initTingData();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.initRecordManager();
        }

        if (this.room.isJoyRoom) {
            //欢乐场显示
            this.settingBtn.visible = true;
            this.nameBg.visible = true;
            this.anteBg.visible = true;
            this.dbg.visible = true;
            this.laiziCom.visible = true;
        }
    }

    //响应玩家点击左上角的退出按钮以及后退事件
    public onExitButtonClicked(): void {

        if (this.room !== null && this.room.handStartted > 0) {

            Dialog.prompt(LocalStrings.findString("applyDisband"));

            return;
        }

        Dialog.showDialog(LocalStrings.findString("confirmQuitRoom"), () => {

            this.room.onExitButtonClicked();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    public async playPiaoEffect(xy: cc.Vec2): Promise<void> {
        this.piaoAni.node.position = xy;
        await this.room.getRoomHost().animationMgr.coPlay(`lobby/prefabs/huanghuang/Effect_ico_piaolai`, this.piaoAni.node);
    }
    public playZhuangAni(pos: fgui.GObject, time: number): void {
        this.zhuangAniNode.node.position = this.zhuangPos;
        this.zhuangAniNode.visible = true;
        // this.zhuangAniNode.setPosition(this.zhuangPos.x, this.zhuangPos.y);
        this.room.getRoomHost().animationMgr.play(`lobby/prefabs/huanghuang/Effect_ico_zhuang01`, this.zhuangAniNode.node);
        // Logger.debug("pos.node.position ", pos.node.position);
        this.zhuangAniNode.node.runAction(cc.moveTo(time, pos.node.position));
    }

    public async playLaiAni(): Promise<void> {
        TileImageMounter.mountTileImage(this.laiziTile, this.room.laiziID);
        this.laiziTile.getChild("laiziMask").visible = true;
        this.laiziTile.visible = true;
        TileImageMounter.mountTileImage(this.laigenTile, this.room.laigenID);
        this.laigenTile.visible = true;
        //设置初始位置
        this.laiziTile.node.position = this.laiziTilePos2.node.position;
        this.laigenTile.node.position = this.laigenTilePos2.node.position;
        this.laiziCom.visible = true;
        //移动
        this.laigenTile.node.runAction(cc.moveTo(0.7, this.laigenTilePos1.node.position));
        await this.room.coWaitSeconds(0.25);
        this.laiziTile.node.runAction(cc.moveTo(0.7, this.laiziTilePos1.node.position));
    }

    // 播放动画
    public async playAnimation(effectName: string, isWait?: boolean): Promise<void> {
        if (effectName === undefined || effectName === null) {
            return;
        }
        if (isWait !== undefined && isWait) {
            await this.room.getRoomHost().animationMgr.coPlay(`lobby/prefabs/huanghuang/${effectName}`, this.aniPos.node);
        } else {
            this.room.getRoomHost().animationMgr.play(`lobby/prefabs/huanghuang/${effectName}`, this.aniPos.node);
        }
    }
    public startDiscardCountdown(time: number): void {
        if (this.leftTimerCB === undefined) {
            this.leftTimerCB = <Function>this.countDownCallBack.bind(this);
        }

        //清理定时器
        this.component.unschedule(this.leftTimerCB);
        // 下发的时间是12秒，就从11到0

        let operationTime = time;
        if (operationTime > 0) {
            operationTime = operationTime - 1;
        }
        this.leftTime = operationTime;
        this.countDownText.text = `${this.leftTime}`;
        //起定时器
        this.component.schedule(
            this.leftTimerCB,
            1,
            cc.macro.REPEAT_FOREVER,
            0);
    }
    public countDownCallBack(): void {
        if (this.leftTime > 0) {
            this.leftTime -= 1;
        }
        this.countDownText.text = `${this.leftTime}`;
        if (this.leftTime <= 0) {
            this.component.unschedule(this.leftTimerCB);
            this.countDownText.text = `${0}`;
            //关闭警告声音
            // SoundMgr.stopEffect(this.soundTimeNum);
            if (this.gamePauseTipsCom.visible === true) {
                // 当已经存在了，就不更新了
                return;
            }
            this.showGamePauseTips(this.room.getRoomHost().getServerTime() + this.defaultQuitTime);
        } else {
            if (this.leftTime <= 5) {
                //播放警告声音
                SoundMgr.playEffectAudio("gameb/sound_time", false);
            }
            this.countDownText.text = `${this.leftTime}`;
        }
    }

    public stopDiscardCountdown(): void {
        //清理定时器
        this.component.unschedule(this.leftTimerCB);
        this.countDownText.text = "";
    }

    //设置当前房间所等待的操作玩家
    public setWaitingPlayer(playerView: PlayerView, time: number): void {
        if (time > 0) {
            this.startDiscardCountdown(time);
        }
        this.clearWaitingPlayer();
        const viewChairID = playerView.viewChairID;
        this.roundMarks[viewChairID].visible = true;
    }
    //清除当前房间的等待玩家标志
    public clearWaitingPlayer(): void {
        for (let i = 1; i <= 4; i++) {
            this.roundMarks[i].visible = false;
        }
    }
    public showRoomNumber(): void {
        // const room = this.room;
        const n = this.room.handNum - this.room.handStartted;
        let num = LocalStrings.findString("leftRound", n.toString());
        if (n <= 0) {
            num = LocalStrings.findString("lastRound");
        }
        if (this.room.isJoyRoom) {
            num = "";
        }
        const s = `     `;
        const base = `${LocalStrings.findString("baseScore")}:${this.room.roomInfo.base}`;
        const str = `${base}${s}${num}${s}`;
        this.roomInfoText.text = str;
    }
    //显示出牌提示箭头
    public setArrowByParent(btn: fgui.GComponent): void {
        if (btn === undefined || btn === null) {
            //隐藏出牌提示箭头
            if (this.arrowObj !== undefined && this.arrowObj !== null) {
                this.arrowObj.active = false;
            }

            return;
        }
        const pos = btn.getChild("pos");
        const op = {
            onCreate: (n: cc.Node) => {
                // n.scale = pos.node.scale;
                // n.active = true;
                this.arrowObj = n;
            }
        };
        this.room.getRoomHost().animationMgr.play(`lobby/prefabs/mahjong/Effect_jiantou`, pos.node, op);
        // this.arrowObj.wrapper.scale = pos.scale;
        // this.arrowObj.visible = true;
    }
    public showTingDataView(list: TingPai[]): void {
        // Logger.debug("显示听 列表 ", list);
        if (list.length <= 0) {
            this.listensObj.visible = false;

            return;
        }
        const len = list.length;
        this.listensDataList = list;
        // let width = 290;
        // let height = 110;
        // if (len <= 2) {
        //     width = 150;
        // } else if (len > 4) {
        //     height = 230;
        // }
        // this.listensObjList.setSize(width, height);
        let nCount = 0;
        for (const d of list) {
            nCount = nCount + d.num;
        }
        this.listensObjNum.text = `${nCount}`;
        this.listensObjList.numItems = len;
        this.listensObj.visible = true;
    }
    public hideTingDataView(): void {
        this.listensObj.visible = false;
    }

    //设置当前房间所使用的风圈
    public setRoundMask(): void {
        // if (GameRules.haveRoundMask(this.room.roomType)) {
        this.laiziCom.visible = true;
        TileImageMounter.mountTileImage(this.laiziTile, this.room.laiziID);
        this.laiziTile.getChild("laiziMask").visible = true;
        this.laiziTile.visible = true;
        TileImageMounter.mountTileImage(this.laigenTile, this.room.laigenID);
        this.laigenTile.visible = true;
        // }
    }

    // 根据玩家的chairID获得相应的playerView
    // 注意服务器的chairID是由0开始
    public getPlayerViewByChairID(num: number): PlayerView {
        // const newM = playerCound[le][myChairId];
        //加1是由于lua table索引从1开始
        //获得chairID相对于本玩家的偏移
        // const c = (newC - newM + 4) % 4;
        // Logger.debug(`创建他人 : c : ${c} , newC : ${newC} , newM : ${newM}`);

        // return playerViews[c + 1];

        return this.playerViews[num];
    }

    //根据房间的状态做一些开关变量切换
    public onUpdateStatus(state: number): void {
        const handler = this.statusHandlers[state];
        if (handler !== null) {
            handler(this);
        }
        const players = this.room.getPlayers();
        const pKey = Object.keys(players);
        for (const k of pKey) {
            const p = <Player>players[k];
            p.playerView.onUpdateStatus[state]();
        }
    }

    public switchBg(index: number): void {
        //
        // const bgController = this.unityViewNode.getController("bgController");
        // bgController.selectedIndex = index;
    }

    public updateDisbandVoteView(
        disbandReq: protoHH.casino.packet_table_disband_req, disbandAck: protoHH.casino.packet_table_disband_ack): void {
        //

        let disbandView = this.component.getComponent(DisbandView);
        if (disbandView === undefined || disbandView == null) {
            if (disbandReq !== null && disbandReq.disband_time.toNumber() === 0) {
                // 断线回来，如果有人拒绝，服务器还是会发送指令下来，但是disband_time为0
                return;
            }

            disbandView = this.component.addComponent(DisbandView);
        }

        const myPlayerInfo = this.room.getMyPlayerInfo();
        const myInfo = new DisBandPlayerInfo(myPlayerInfo.userID, myPlayerInfo.chairID, myPlayerInfo.nick);
        const players = this.room.getPlayers();

        const playersInfo: DisBandPlayerInfo[] = [];
        Object.keys(players).forEach((key: string) => {
            const p = <Player>players[key];
            const playInfo = new DisBandPlayerInfo(p.userID.toString(), p.chairID, p.playerInfo.nick);
            playersInfo.push(playInfo);

        });

        const load = this.room.getRoomHost().getLobbyModuleLoader();

        disbandView.showDisbandView(this.room, load, myInfo, playersInfo, disbandReq, disbandAck);
    }

    public updateReadyView(table: protoHH.casino.Itable, players?: protoHH.casino.Itable_player[]): void {
        // let readyView = this.component.getComponent(ReadyView);
        // if (readyView === undefined || readyView == null) {
        //     readyView = this.component.addComponent(ReadyView);
        // }

        const view = this.unityViewNode.getChild("readyView").asCom;

        if (this.readyView === undefined || this.readyView === null) {
            this.readyView = new ReadyView();
        }

        // const load = this.room.getRoomHost().getLobbyModuleLoader();
        const roomHost = this.room.getRoomHost();
        this.readyView.updateReadyView(roomHost, table, view, players);
    }

    public showCountDownIfReadViewShow(): boolean {
        if (this.readyView !== null && this.readyView !== undefined) {
            return this.readyView.showDisbandCountDown();
        }

        return false;
    }

    public showOrHideReadyView(isShow: boolean): void {
        if (this.readyView !== null && this.readyView !== undefined) {
            this.readyView.showOrHideReadyView(isShow);
        }
    }
    public showOrHideTipsOfMe(isShow: boolean): void {
        this.tipsOfMeCom.visible = isShow;
    }
    public showOrHideCancelCom(isShow: boolean, str: string): void {
        if (isShow) {
            this.cancelComText.text = str;
        }
        this.cancelCom.visible = isShow;
    }

    // 默认隐藏这些按钮，发牌后再显示
    public showBtnsAndBgs(): void {
        this.chatBtn.visible = true;
        this.gpsBtn.visible = !this.room.isJoyRoom; //欢乐场不显示gps
        this.settingBtn.visible = true;
        this.recoredBtn.visible = true;
        this.dbg.visible = true;
        this.nameBg.visible = true;
        this.anteBg.visible = true;

        this.replayHideBtns();
    }

    public enableVoiceBtn(isShow: boolean): void {
        if (isShow) {
            this.recoredBtn.enabled = true;
        } else {
            this.recoredBtn.enabled = false;
        }
    }

    public showGamePauseTips(timeStamp: number): void {

        this.defaultQuitTime = timeStamp - this.room.getRoomHost().getServerTime();

        this.gamePauseTipsCom.visible = true;
        const roomHost = this.room.getRoomHost();
        this.gamePauseCountDownFunc(timeStamp);

        roomHost.component.unschedule(this.gamePauseSchedule);
        this.gamePauseSchedule = () => {
            this.gamePauseCountDownFunc(timeStamp);
        };
        roomHost.component.schedule(this.gamePauseSchedule, 1, cc.macro.REPEAT_FOREVER);
    }

    public hideGamePauseTips(): void {
        const roomHost = this.room.getRoomHost();
        //this.roomView.hideGamePauseTips();
        this.gamePauseTipsCom.visible = false;
        roomHost.component.unschedule(this.gamePauseSchedule);
    }

    public showOrHideGpsTag(isShow: boolean): void {
        this.gpsUnOpen.visible = isShow;
    }

    public showGpsView(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.onGPSBtnClick();
        }
    }

    private gamePauseCountDownFunc(timeStamp: number): void {
        const roomHost = this.room.getRoomHost();
        const serverTime = roomHost.getServerTime();
        this.gamePauseTime = timeStamp - serverTime;
        if (this.gamePauseTime <= 0) {
            roomHost.component.unschedule(this.gamePauseSchedule);
            //this.disbandRoom();
            Logger.debug("gamePauseCountDownFunc----------------------------------- done");

            return;
        }
        const text = this.getCountDownText();
        this.gamePauseTipsCom.getChild("tipsText").text = text;
    }

    private getCountDownText(): string {
        let min = Math.floor(this.gamePauseTime / 60);
        const hour = Math.floor(min / 60);
        min = min % 60;
        const sec = this.gamePauseTime % 60;

        if (min < 1 && min >= 0.5) {
            min = 0;
        }
        const hourText = hour > 9 ? hour.toFixed(0) : `0${hour.toFixed(0)}`;
        const minutesText = min > 9 ? min.toFixed(0) : `0${min.toFixed(0)}`;
        const secondsText = sec > 9 ? sec.toFixed(0) : `0${sec.toFixed(0)}`;
        let text = `${minutesText}:${secondsText}`;
        if (hour > 0) {
            text = `${hourText}:${text}`;
        }

        return LocalStrings.findString("leaveRoomCountDown", text);
    }

    private replayHideBtns(): void {
        if (this.room.isReplayMode()) {
            //回播的时候 隐藏的按钮
            this.chatBtn.visible = false;
            this.gpsBtn.visible = false;
            this.recoredBtn.visible = false;
            this.settingBtn.visible = false;
        }
    }
    //解散房间按钮点击事件
    // private onDissolveClick(): void {
    //     // const msg = "确实要申请解散房间吗？";
    //     // dialog.showDialog(
    //     //     msg,
    //     //     function () {
    //     //         this.room.onDissolveClicked();
    //     //     },
    //     //     function () {
    //     //         //do nothing
    //     //     }
    //     // )
    // }

    private onGPSBtnClick(): void {
        Logger.debug("onGPSBtnClick");

        let gpsView = this.component.getComponent(GpsView);
        if (gpsView === null) {
            gpsView = this.component.addComponent(GpsView);
        }

        const ps = this.room.getPlayers();
        const players: Player[] = [];
        const keys = Object.keys(ps);
        for (const key of keys) {
            players.push(<Player>ps[key]);
        }

        gpsView.updateGpsView(this.room, players);
    }

    private onSettingBtnClick(): void {
        // Logger.debug("onSettingBtnClick---------------");
        const settingView = this.component.addComponent(RoomSettingView);
        const isOwner = this.room.ownerID === this.room.getMyPlayerInfo().userID;
        settingView.showView(this.room, isOwner, this.room.getRoomHost().getLobbyModuleLoader());
    }

    /**
     * 聊天按钮点击事件
     */
    private onChatBtnClick(): void {
        Logger.debug("onChatBtnClick");
        const chatView = this.component.addComponent(ChatView);
        const loader = this.room.getRoomHost().getLobbyModuleLoader();

        const roomHost = this.room.getRoomHost();

        chatView.show(loader, roomHost, this.room.roomInfo.id);
    }
    /**
     * 初始化
     */
    private initButton(): void {
        // const chatBtn = view.getChild("chatBtn")
        // chatBtn.onClick:Set(
        //     function()
        //         chatView.showChatView()
        //     }
        // )

        this.chatBtn = this.unityViewNode.getChild("chatBtn");
        this.recoredBtn = this.unityViewNode.getChild("recorderBtn");
        this.recoredBtn.on(fgui.Event.TOUCH_BEGIN, this.onVoiceBtnPress, this);

        this.recoredBtn.on(fgui.Event.TOUCH_END, this.onVoiceBtnUp, this);

        this.gpsBtn = this.unityViewNode.getChild("gpsBtn").asButton;
        this.gpsBtn.onClick(this.onGPSBtnClick, this);
        this.gpsUnOpen = this.gpsBtn.getChild("n3");
        this.chatBtn.onClick(this.onChatBtnClick, this);

        this.settingBtn = this.unityViewNode.getChild("settingBtn");
        this.settingBtn.onClick(this.onSettingBtnClick, this);

        const voice = DataStore.getString(KeyConstants.VOICE_SWITCH, "0");
        if (+voice > 0) {
            this.enableVoiceBtn(true);
        } else {
            this.enableVoiceBtn(false);
        }

        this.replayHideBtns();
    }

    private onVoiceBtnPress(event: fgui.Event): void {
        Logger.debug("onVoiceBtnPress");
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {

            Dialog.showDialog(LocalStrings.findString("recordInWeChat"));

            return;
        }

        if (Date.now() - this.lastRecordTime < 1000) {
            Dialog.prompt(LocalStrings.findString("frequentlyRecording"));

            return;
        }

        if (this.room.isPlayAudio) {
            Dialog.prompt(LocalStrings.findString("cannotRecordWhenOnPlay"));

            return;
        }

        const lastClickTime = this.lastVoiceBtnClickTime;
        this.lastVoiceBtnClickTime = Date.now();
        if (this.lastVoiceBtnClickTime - lastClickTime < 1500) {
            Logger.debug("can not so quickly click voice button");

            return;
        }

        this.mike.visible = true;
        this.recordStartPosition = event.touch.getLocation();

        SoundMgr.pauseMusic();
        const options = {
            duration: 120 * 1000,
            format: 'mp3'
        };

        this.recordManager.start(options);
        this.isRecordStart = true;

    }

    private onVoiceBtnUp(event: fgui.Event): void {
        Logger.debug("onVoiceBtnUp");
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug("cc.sys.platform !== cc.sys.WECHAT_GAME");

            return;
        }

        if (!this.isRecordStart) {
            Logger.debug("record not start");

            return;
        }

        this.isRecordStart = false;

        // SoundMgr.resumeMusic();
        this.mike.visible = false;
        this.recordEndPosition = event.touch.getLocation();
        // Logger.debug(`startPosition:${this.startPosition}, endPosition:${endPosition}`);

        this.recordManager.stop();
        SoundMgr.resumeMusic();
    }

    private initOtherView(): void {
        // 风圈和当前操作玩家指示箭头roundMarkArrow
        const roundMarks: fgui.GObject[] = [];
        this.roundMarkView = this.unityViewNode.getChild("roundMask").asCom;

        this.piaoAni = this.unityViewNode.getChild("piaoAni");
        for (let i = 1; i <= 4; i++) {
            const roundMark = this.roundMarkView.getChild(`n${i}`);
            roundMarks[i] = roundMark;
        }
        this.roundMarks = roundMarks;

        this.laiziCom = this.unityViewNode.getChild("laiziCom").asCom;
        let laiComPos = this.unityViewNode.getChild("laiComPos1");
        if (this.room.roomInfo.players.length === 3) {
            laiComPos = this.unityViewNode.getChild("laiComPos2");
        }
        this.laiziCom.setPosition(laiComPos.x, laiComPos.y);

        this.laigenTile = this.laiziCom.getChild("laigenCom").asCom;
        this.laiziTile = this.laiziCom.getChild("laiziCOm").asCom;
        this.laigenTile.visible = false;
        this.laiziTile.visible = false;

        this.laiziTilePos1 = this.laiziCom.getChild("laiziPos1");
        this.laigenTilePos1 = this.laiziCom.getChild("laigenPos1");
        if (this.room.roomInfo.players.length === 3) {
            this.laiziTilePos2 = this.laiziCom.getChild("laiziPos3");
            this.laigenTilePos2 = this.laiziCom.getChild("laigenPos3");
        } else {
            this.laiziTilePos2 = this.laiziCom.getChild("laiziPos2");
            this.laigenTilePos2 = this.laiziCom.getChild("laigenPos2");
        }

        this.laiziCom.visible = false;

        //倒计时
        this.countDownText = this.roundMarkView.getChild("num");
        //道具
        this.donateMoveObj = this.unityViewNode.getChild("donate").asLoader;
        //庄家动画挂载节点
        this.zhuangAniNode = this.unityViewNode.getChild("zhuangPos");
        this.zhuangPos = this.zhuangAniNode.node.position;
        //其他动画挂载节点
        this.aniPos = this.unityViewNode.getChild("AniPos");
        //弃碰弃杠 提示
        this.cancelCom = this.unityViewNode.getChild("cancelCom").asCom;
        this.cancelComText = this.cancelCom.getChild("text");
        //到我出牌提示
        this.tipsOfMeCom = this.unityViewNode.getChild("tipsOfMeCom").asCom;
        this.tipsOfMeCom.getChild("tipsText").text = LocalStrings.findString("discardTipsOfMe");

        //为了兼容界面 房间信息 跟 余牌text  放在了 player1里面
        const player1 = this.unityViewNode.getChild(`player1`).asCom;
        // 房间号
        this.roomInfoText = player1.getChild("roomInfo");
        //剩牌
        this.tilesInWall = player1.getChild("tilesInWall");

        this.nameBg = player1.getChild("bg4");
        this.anteBg = player1.getChild("bg5");
        this.dbg = this.unityViewNode.getChild("diBg");

        this.mike = this.unityViewNode.getChild("mike");

        this.gamePauseTipsCom = this.unityViewNode.getChild("tipsCom").asCom;

        //提示消耗多少欢乐豆
        // Logger.debug("this.room.isJoyRoom : ", this.room.isJoyRoom);
        if (this.room.isJoyRoom) {
            // Logger.debug("this.room.joyRoom : ", this.room.joyRoom);
            const str = this.room.joyRoom.cost_param.toString();
            this.unityViewNode.getChild("joyText").text = LocalStrings.findString("joyText", str);
        }
    }

    //初始化房间状态事件
    private initRoomStatus(): void {
        // 房间正在等待玩家准备
        const onWait = (): void => {
            // this.laiziCom.visible = false;
            this.laiziTile.visible = false;
            this.laigenTile.visible = false;

            this.tilesInWall.visible = false;

            this.roundMarkView.visible = false;
            this.stopDiscardCountdown();

            this.cancelCom.visible = false;
            //等待状态重置上手牌遗留
            this.room.resetForNewHand();

            this.zhuangAniNode.visible = false;
        };

        //房间空闲，客户端永远看不到这个状态
        // const onIdle = (): void => {
        //     Logger.debug("房间空闲，客户端永远看不到这个状态");
        // };

        // 游戏开始了
        const onPlay = (): void => {
            // roomView.invitButton.visible = false
            // roomView.returnHallBtn.visible = false
            this.tilesInWall.visible = true;
            this.laiziCom.visible = true;

            this.roundMarkView.visible = true;
            // this.clearWaitingPlayer();
            this.showRoomNumber();
        };

        //房间已经被删除，客户端永远看不到这个状态
        // const onDelete = (): void => {
        //     Logger.debug("房间已经被删除，客户端永远看不到这个状态");
        // };

        const status = [];
        // status[proto.mahjong.RoomState.SRoomIdle] = onIdle;
        status[roomStatus.onWait] = onWait;
        status[roomStatus.onPlay] = onPlay;
        // status[proto.mahjong.RoomState.SRoomDeleted] = onDelete;
        this.statusHandlers = status;
    }

    //初始化显示听牌详情界面
    private initTingData(): void {
        this.listensObj = this.unityViewNode.getChild("listensPanel").asCom;
        this.listensObjList = this.listensObj.getChild("list").asList;
        this.listensObjNum = this.listensObj.getChild("num");
        this.listensObjList.itemRenderer = <(index: number, item: fgui.GComponent) => void>this.renderListensListItem.bind(this);
        this.listensObj.onClick(() => { this.listensObj.visible = false; }, this);
        this.listensObjList.setVirtual();
    }

    private renderListensListItem(index: number, obj: fgui.GComponent): void {
        const tingPai = this.listensDataList[index];
        const t = obj.getChild("n1").asCom;
        const num = obj.getChild("num");
        num.text = `${tingPai.num}`;
        TileImageMounter.mountTileImage(t, tingPai.card);
        t.getChild("laiziMask").visible = tingPai.card === this.room.laiziID;
    }

    private initRecordManager(): void {
        Logger.debug("initRecordManager");

        const recorderManager = wx.getRecorderManager();
        this.recordManager = recorderManager;

        const onStart = () => {
            Logger.debug("recordManager.onStart");
        };

        const onPause = () => {
            Logger.debug("recordManager.onPause");
        };

        const onResume = () => {
            Logger.debug("recordManager.onResume");
        };

        const onInterruptionBegin = () => {
            Logger.debug("recordManager.onInterruptionBegin");
        };

        const onStop = (res: { tempFilePath: string; duration: number; fileSize: number }) => {
            Logger.debug("recordManager.onStop:", res);
            if (this.recordEndPosition.y - this.recordStartPosition.y > this.moveDistance) {
                Dialog.prompt(LocalStrings.findString("cancelSend"));

                return;
            }

            if (res.duration < 1000) {
                Logger.debug("record time small than 1 second");
                Dialog.prompt(LocalStrings.findString("durationTooShort"));

                return;
            }

            this.lastRecordTime = Date.now();
            this.sendVoice(res.tempFilePath);
        };

        const onFrameRecorded = (res: onFrameRecordedRes) => {
            Logger.debug("onFrameRecorded:", res);
        };

        const onError = (res: RecordOnErrorRes) => {
            Logger.debug("onError:", res);
            // this.mike.visible = false;
        };

        recorderManager.onStart(onStart);
        recorderManager.onPause(onPause);
        recorderManager.onResume(onResume);
        recorderManager.onStop(onStop);
        recorderManager.onInterruptionBegin(onInterruptionBegin);
        recorderManager.onFrameRecorded(onFrameRecorded);
        recorderManager.onError(onError);
    }

    private sendVoice(tempFilePath: string): void {
        this.room.getRoomHost().sendVoice(tempFilePath);
    }
}
