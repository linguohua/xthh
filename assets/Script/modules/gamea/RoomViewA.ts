import { Dialog, Logger } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
// import { ChatView } from "../lobby/views/chat/ChatExports";
import { DisBandPlayerInfo, DisbandView } from "../lobby/views/disbandRoom/DisbandViewExports";
import { GpsView } from "../lobby/views/gps/GpsExports";
import { RoomSettingView } from "../lobby/views/roomSetting/RoomSettingViewExports";
import { PlayerA } from "./PlayerA";
import { PlayerViewA } from "./PlayerViewA";
import { ReadyViewA } from "./ReadyViewA";
import { RoomInterfaceA, roomStatus, TingPai } from "./RoomInterfaceA";
import { RoomRuleViewA } from "./RoomRuleViewA";
import { TileImageMounterA } from "./TileImageMounterA";

/**
 * 房间
 */
export class RoomViewA {
    public playerViews: PlayerViewA[];
    public listensObj: fgui.GComponent;
    public meldOpsPanel: fgui.GComponent;
    public donateMoveObj: fgui.GLoader;
    public tilesInWall: fgui.GObject;
    public statusHandlers: Function[];
    public unityViewNode: fgui.GComponent;
    private room: RoomInterfaceA;
    private dbg: fgui.GObject;
    private nameBg: fgui.GObject;
    private anteBg: fgui.GObject;
    private settingBtn: fgui.GObject;
    private gpsBtn: fgui.GObject;
    private recoredBtn: fgui.GObject;
    private chatBtn: fgui.GObject;
    private readyButton: fgui.GButton;
    private inviteButton: fgui.GButton;
    private returnLobbyBtn: fgui.GButton;
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
    private multiOpsObj: fgui.GList;
    private listensDataList: TingPai[];
    private arrowObj: cc.Node;
    private leftTime: number;
    private leftTimerCB: Function;
    private component: cc.Component;
    private zhuangAniNode: fgui.GObject;
    private zhuangPos: cc.Vec2;
    private aniPos: fgui.GObject;
    private cancelCom: fgui.GComponent;
    private cancelComText: fgui.GObject;
    private mike: fgui.GObject;
    // private isRecordOpen: boolean = false;
    private recordManager: getRecorderManagerOpts;
    private piaoAni: fgui.GObject;

    private recordStartPosition: cc.Vec2 = null;
    private recordEndPosition: cc.Vec2 = null;
    private readonly moveDistance: number = 50;

    private lastRecordTime: number = 0;
    private readyView: ReadyViewA;

    public constructor(room: RoomInterfaceA, view: fgui.GComponent) {
        this.room = room;
        this.unityViewNode = view;
        this.component = room.getRoomHost().component;

        const playerViews: PlayerViewA[] = [];
        for (let i = 1; i <= 4; i++) {
            const playerView = new PlayerViewA(view, i, room);
            playerView.hideAll();
            playerViews[i] = playerView;
        }

        this.playerViews = playerViews;

        this.initButton();
        //房间状态事件初始化
        this.initRoomStatus();

        this.initOtherView();

        this.initTingData();
        this.initMeldsPanel();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.initRecordManager();
        }
    }
    /**
     * 操作ui
     */
    public showOrHideReadyButton(isShow: boolean): void {
        this.readyButton.visible = isShow;
        // this.returnLobbyBtn.visible = isShow;
        // if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        //     this.inviteButton.visible = isShow;
        // }
    }

    //响应玩家点击左上角的退出按钮以及后退事件
    public onExitButtonClicked(): void {

        if (this.room !== null && this.room.handStartted > 0) {

            Dialog.prompt("牌局已经开始，请申请解散房间");

            return;
        }

        Dialog.showDialog(`确实要退出房间吗？`, () => {

            this.room.onExitButtonClicked();
            // tslint:disable-next-line:align
        }, () => {
            //
        });

        // if (roomView.room != null && roomView.room.handStartted > 0) {
        //      prompt.showPrompt("牌局已经开始，请申请解散房间");

        //     return;
        // }

        // const room = roomView.room;
        // const msg = "确实要退出房间吗？";
        // dialog: showDialog(
        //     msg,
        //     function () {
        //         room.host: triggerLeaveRoom();
        //     },
        //     function () {
        //         //nothing to do
        //     }
        // )
    }

    public async playPiaoEffect(xy: cc.Vec2): Promise<void> {
        this.piaoAni.node.position = xy;
        await this.room.getRoomHost().animationMgr.coPlay(`lobby/prefabs/huanghuang/Effect_ico_piaolai`, this.piaoAni.node);
    }
    public playZhuangAni(pos: fgui.GObject): void {
        this.zhuangAniNode.node.position = this.zhuangPos;
        this.zhuangAniNode.visible = true;
        // this.zhuangAniNode.setPosition(this.zhuangPos.x, this.zhuangPos.y);
        this.room.getRoomHost().animationMgr.play(`lobby/prefabs/huanghuang/Effect_ico_zhuang01`, this.zhuangAniNode.node);
        // Logger.debug("pos.node.position ", pos.node.position);
        this.zhuangAniNode.node.runAction(cc.moveTo(1, pos.node.position));
    }

    public async playLaiAni(): Promise<void> {
        TileImageMounterA.mountTileImage(this.laiziTile, this.room.laiziID);
        this.laiziTile.getChild("laiziMask").visible = true;
        TileImageMounterA.mountTileImage(this.laigenTile, this.room.laigenID);
        this.laiziTile.node.position = this.laiziTilePos2.node.position;
        this.laigenTile.node.position = this.laigenTilePos2.node.position;
        this.laiziCom.visible = true;

        this.laigenTile.node.runAction(cc.moveTo(0.5, this.laigenTilePos1.node.position));
        await this.room.coWaitSeconds(0.25);
        this.laiziTile.node.runAction(cc.moveTo(0.5, this.laiziTilePos1.node.position));
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
        this.leftTime = time;
        //起定时器
        this.component.schedule(
            this.leftTimerCB,
            1,
            cc.macro.REPEAT_FOREVER,
            1);
    }

    public countDownCallBack(): void {
        this.leftTime -= 1;
        this.countDownText.text = `${this.leftTime}`;
        if (this.leftTime <= 0) {
            this.component.unschedule(this.leftTimerCB);
        }
    }

    public stopDiscardCountdown(): void {
        //清理定时器
        this.component.unschedule(this.leftTimerCB);
        this.countDownText.text = "";
    }

    //设置当前房间所等待的操作玩家
    public setWaitingPlayer(playerView: PlayerViewA, time: number): void {
        if (time > 0) {
            this.startDiscardCountdown(time);
        }
        this.clearWaitingPlayer();
        const viewChairID = playerView.viewChairID;
        this.roundMarks[viewChairID].visible = true;

        // playerView.setHeadEffectBox(true);
    }
    //清除当前房间的等待玩家标志
    public clearWaitingPlayer(): void {
        for (let i = 1; i <= 4; i++) {
            this.roundMarks[i].visible = false;
        }
        for (let i = 1; i <= 4; i++) {
            this.playerViews[i].setHeadEffectBox(false);
        }
    }
    public showRoomNumber(): void {
        // const room = this.room;
        const n = this.room.handNum - this.room.handStartted;
        let num = `还有:${n}局`;
        if (n <= 0) {
            num = "最后一局";
        }
        const s = `     `;
        const base = `底注:${this.room.roomInfo.base}`;
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
        TileImageMounterA.mountTileImage(this.laiziTile, this.room.laiziID);
        this.laiziTile.getChild("laiziMask").visible = true;
        TileImageMounterA.mountTileImage(this.laigenTile, this.room.laigenID);
        // }
    }

    // 根据玩家的chairID获得相应的playerView
    // 注意服务器的chairID是由0开始
    public getPlayerViewByChairID(num: number): PlayerViewA {
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
            const p = <PlayerA>players[k];
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

        const myPlayerInfo = this.room.getMyPlayerInfo();
        const myInfo = new DisBandPlayerInfo(myPlayerInfo.userID, myPlayerInfo.chairID, myPlayerInfo.nick);
        const players = this.room.getPlayers();

        const playersInfo: DisBandPlayerInfo[] = [];
        Object.keys(players).forEach((key: string) => {
            const p = <PlayerA>players[key];
            const playInfo = new DisBandPlayerInfo(p.userID.toString(), p.chairID, p.playerInfo.nick);
            playersInfo.push(playInfo);

        });

        const load = this.room.getRoomHost().getLobbyModuleLoader();

        if (disbandView === undefined || disbandView == null) {
            disbandView = this.component.addComponent(DisbandView);
        }

        disbandView.showDisbandView(this.room, load, myInfo, playersInfo, disbandReq, disbandAck);
    }

    public updateReadyView(table: protoHH.casino.Itable, players?: protoHH.casino.Itable_player[]): void {
        // let readyView = this.component.getComponent(ReadyView);
        // if (readyView === undefined || readyView == null) {
        //     readyView = this.component.addComponent(ReadyView);
        // }

        const view = this.unityViewNode.getChild("readyView").asCom;

        if (this.readyView === undefined || this.readyView === null) {
            this.readyView = new ReadyViewA();
        }

        // const load = this.room.getRoomHost().getLobbyModuleLoader();
        const roomHost = this.room.getRoomHost();
        this.readyView.updateReadyView(roomHost, table, view, players);
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
        this.gpsBtn.visible = true;
        this.settingBtn.visible = true;
        this.recoredBtn.visible = true;
        this.dbg.visible = true;
        this.nameBg.visible = true;
        this.anteBg.visible = true;
    }

    public enableVoiceBtn(isShow: boolean): void {
        if (isShow) {
            this.recoredBtn.enabled = true;
        } else {
            this.recoredBtn.enabled = false;
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

    private onRoomRuleBtnClick(): void {
        let roomRuleView = this.component.getComponent(RoomRuleViewA);

        if (roomRuleView === undefined || roomRuleView == null) {
            roomRuleView = this.component.addComponent(RoomRuleViewA);
        }
        // roomRuleView.updateView(this.room.roomInfo.config);
        // TODO: 显示游戏规则
    }

    private onGPSBtnClick(): void {
        Logger.debug("onGPSBtnClick");

        let gpsView = this.component.getComponent(GpsView);
        if (gpsView === null) {
            gpsView = this.component.addComponent(GpsView);
        }

        const ps = this.room.getPlayers();
        const players: PlayerA[] = [];
        const keys = Object.keys(ps);
        for (const key of keys) {
            players.push(<PlayerA>ps[key]);
        }

        gpsView.updateGpsView(this.room, players);
    }

    private onSettingBtnClick(): void {
        // Logger.debug("onSettingBtnClick---------------");
        const settingView = this.component.addComponent(RoomSettingView);

        const isOwner = this.room.ownerID === this.room.getMyPlayerInfo().userID;

        const settingBtn = this.unityViewNode.getChild("settingBtn");

        const position = fgui.GRoot.inst.node.
            convertToNodeSpaceAR(settingBtn.parent.node.convertToWorldSpaceAR(new cc.Vec2(settingBtn.x, settingBtn.y)));
        // Logger.debug("convertToNodeSpaceAR position = ", position);

        settingView.showView(this.room, this.room.getRoomHost().getLobbyModuleLoader(), isOwner, position);
    }

    /**
     * 聊天按钮点击事件
     */
    private onChatBtnClick(): void {
        Logger.debug("onChatBtnClick");

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

        this.gpsBtn = this.unityViewNode.getChild("gpsBtn");
        this.gpsBtn.onClick(this.onGPSBtnClick, this);
        this.chatBtn.onClick(this.onChatBtnClick, this);

        this.settingBtn = this.unityViewNode.getChild("settingBtn");

        // const newIPhone = DataStore.getString(KeyConstants.ADAPTIVE_PHONE_KEY);

        // if (newIPhone === "1") {
        //     //
        //     //this.settingBtn.setPosition(this.settingBtn.x + CommonFunction.IOS_ADAPTER_WIDTH, this.settingBtn.y);
        // }

        this.settingBtn.onClick(this.onSettingBtnClick, this);

        const infoBtn = this.unityViewNode.getChild("guizeBtn");
        //infoBtn.visible = true;
        infoBtn.onClick(this.onRoomRuleBtnClick, this);

        this.readyButton = this.unityViewNode.getChild("ready").asButton;
        this.readyButton.visible = false;
        this.readyButton.onClick(this.onReadyButtonClick, this);

        this.inviteButton = this.unityViewNode.getChild("invite").asButton;
        this.inviteButton.visible = false;
        this.inviteButton.onClick(this.room.onInviteButtonClick, this.room);

        this.returnLobbyBtn = this.unityViewNode.getChild("return2LobbyBtn").asButton;
        this.returnLobbyBtn.visible = false;
        this.returnLobbyBtn.onClick(this.room.onReturnLobbyBtnClick, this.room);

        // 调整微信版本的按钮位置
        // if (CC_WECHATGAME) {
        //     Logger.debug("init wechat game button position");
        //     settingBtn.setPosition(settingBtn.x, settingBtn.y + 60);
        //     infoBtn.setPosition(infoBtn.x, infoBtn.y + 60);
        // }

    }

    // private onRecordSuccess(tempFilePath: string): void {
    //     Logger.debug("onRecordSuccess, tempFilePath:", tempFilePath);
    // }

    // private startRecord(): void {
    //     if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
    //         return;
    //     }

    //     wx.startRecord({
    //         success: (result: { tempFilePath: string }) => {
    //             this.onRecordSuccess(result.tempFilePath);
    //         }
    //     });

    //     setTimeout(
    //         () => {
    //             this.mike.visible = false;
    //             wx.stopRecord(); // 结束录音
    //         },
    //         10000);
    // }

    private onVoiceBtnPress(event: fgui.Event): void {
        Logger.debug("onVoiceBtnPress");
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Dialog.showDialog("微信上才可以录音");

            return;
        }

        if (Date.now() - this.lastRecordTime < 1000) {
            Dialog.prompt("1秒内不能重复录音");

            return;
        }

        if (this.room.currentPlayMsg !== null) {
            Dialog.prompt("正在播放，不能录音");

            return;
        }

        this.mike.visible = true;
        this.recordStartPosition = event.touch.getLocation();

        // const options = {
        //     duration: 60000,
        //     sampleRate: 44100,
        //     numberOfChannels: 1,
        //     encodeBitRate: 192000,
        //     format: 'aac',
        //     frameSize: 50
        // };

        // Logger.debug("this.recordManager:", this.recordManager);
        this.recordManager.start({});

    }

    private onVoiceBtnUp(event: fgui.Event): void {
        Logger.debug("onVoiceBtnUp");
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug("cc.sys.platform !== cc.sys.WECHAT_GAME");

            return;
        }

        this.mike.visible = false;
        this.recordEndPosition = event.touch.getLocation();
        // Logger.debug(`startPosition:${this.startPosition}, endPosition:${endPosition}`);

        this.recordManager.stop();
    }
    private onReadyButtonClick(): void {
        this.readyButton.visible = false;
        this.room.onReadyButtonClick();
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
    }

    //初始化房间状态事件
    private initRoomStatus(): void {
        // 房间正在等待玩家准备
        const onWait = (): void => {
            this.laiziCom.visible = false;
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
        TileImageMounterA.mountTileImage(t, tingPai.card);
        t.getChild("laiziMask").visible = tingPai.card === this.room.laiziID;
    }

    //面子牌选择面板
    private initMeldsPanel(): void {
        // const meldMap = {}
        this.meldOpsPanel = this.unityViewNode.getChild("meldOpsPanel").asCom;
        this.multiOpsObj = this.meldOpsPanel.getChild("list").asList;
        this.multiOpsObj.itemRenderer = <(index: number, item: fgui.GComponent) => void>this.renderMultiOpsListItem.bind(this);
        this.multiOpsObj.on(fgui.Event.CLICK_ITEM, (onClickItem: fgui.GObject) => { this.onMeldOpsClick(); }, this);
        const cancelBtn = this.meldOpsPanel.getChild("cancelBtn");
        const cancelOnClick = () => {
            this.meldOpsPanel.visible = false;
            this.playerViews[1].showButton();
        };
        cancelBtn.onClick(cancelOnClick, this);
    }

    private renderMultiOpsListItem(): void {
        // const meld = this.multiOpsDataList[index];
        // obj.name = index.toString();
        // let add = 0;
        // let num = 4;
        // if (meld.meldType === mjproto.MeldType.enumMeldTypeSequence) {
        //     //吃的时候exp是3，所以第4个牌可以隐藏起来
        //     obj.getChild("n4").visible = false;
        //     add = 1;
        //     num = 3;
        // }
        // let a = 0;
        // for (let i = 1; i <= num; i++) {
        //     const oCurCard = obj.getChild(`n${i}`).asCom;
        //     TileImageMounter.mountTileImage(oCurCard, meld.tile1 + a);
        //     oCurCard.visible = true;
        //     a += add;
        // }

        // obj.visible = true;
    }

    private onMeldOpsClick(): void {
        // const data = this.multiOpsDataList[+index];
        // const actionMsg = new proto.mahjong.MsgPlayerAction();
        // actionMsg.qaIndex = this.actionMsg.qaIndex;
        // actionMsg.action = this.actionMsg.action;
        // actionMsg.tile = this.actionMsg.tile;
        // actionMsg.meldType = data.meldType;
        // actionMsg.meldTile1 = data.tile1;
        // if (data.meldType === mjproto.MeldType.enumMeldTypeConcealedKong) {
        //     actionMsg.tile = data.tile1;
        //     actionMsg.action = mjproto.ActionType.enumActionType_KONG_Concealed;
        // } else if (data.meldType === mjproto.MeldType.enumMeldTypeTriplet2Kong) {
        //     actionMsg.tile = data.tile1;
        //     actionMsg.action = mjproto.ActionType.enumActionType_KONG_Triplet2;
        // }

        // const actionMsgBuf = proto.mahjong.MsgPlayerAction.encode(actionMsg);
        // // this.room.sendActionMsg(actionMsgBuf);
        // this.playerViews[1].hideOperationButtons();
        // this.meldOpsPanel.visible = false;
    }

    private initRecordManager(): void {
        Logger.debug("initRecordManager");

        const recorderManager = wx.getRecorderManager();
        this.recordManager = recorderManager;

        const onStart = () => {
            Logger.debug("recordManager.onStart");
            // this.mike.visible = true;
        };

        const onPause = () => {
            Logger.debug("recordManager.onPause");
            // this.mike.visible = false;
            this.recordManager.stop();
        };

        const onResume = () => {
            Logger.debug("recordManager.onResume");
        };

        const onInterruptionBegin = () => {
            Logger.debug("recordManager.onInterruptionBegin");
            // this.mike.visible = false;
            this.recordManager.stop();
        };

        const onStop = (res: RecordOnStopRes) => {
            Logger.debug("recordManager.onStop:", res);
            // this.mike.visible = false;
            if (this.recordEndPosition.y - this.recordStartPosition.y > this.moveDistance) {
                Dialog.prompt("取消发送");

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
            Dialog.prompt("录制失败!");
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
