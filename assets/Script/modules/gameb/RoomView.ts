import { Dialog, Logger } from "../lobby/lcore/LCoreExports";
import { ChatView } from "../lobby/views/chat/ChatExports";
import { DisBandPlayerInfo, DisbandView } from "../lobby/views/disbandRoom/DisbandViewExports";
import { RoomSettingView } from "../lobby/views/roomSetting/RoomSettingViewExports";
import { GameRules } from "./GameRules";
import { Player } from "./Player";
import { PlayerView } from "./PlayerView";
import { proto } from "./proto/protoGame";
import { RoomInterface, TingPai } from "./RoomInterface";
import { RoomRuleView } from "./RoomRuleView";
import { TileImageMounter } from "./TileImageMounter";
const mjproto = proto.mahjong;

/**
 * 房间
 */
export class RoomView {
    public playerViews: PlayerView[];
    public listensObj: fgui.GComponent;
    public meldOpsPanel: fgui.GComponent;
    public donateMoveObj: fgui.GLoader;
    public tilesInWall: fgui.GObject;
    public statusHandlers: Function[];

    private room: RoomInterface;
    private unityViewNode: fgui.GComponent;
    private readyButton: fgui.GButton;
    private inviteButton: fgui.GButton;
    private returnLobbyBtn: fgui.GButton;
    private roomInfoText: fgui.GObject;
    private roundMarkView: fgui.GComponent;
    private roundMarks: fgui.GObject[];
    private wind: fgui.GObject;
    private windTile: fgui.GComponent;
    private countDownText: fgui.GObject;
    private listensObjList: fgui.GList;
    private listensObjNum: fgui.GObject;
    private multiOpsObj: fgui.GList;
    private listensDataList: TingPai[];
    private multiOpsDataList: proto.mahjong.IMsgMeldTile[];
    private arrowObj: cc.Node;
    private actionMsg: proto.mahjong.MsgPlayerAction;
    private leftTime: number;
    private leftTimerCB: Function;
    private component: cc.Component;

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
        this.initMeldsPanel();
    }
    /**
     * 操作ui
     */
    public showOrHideReadyButton(isShow: boolean): void {
        this.readyButton.visible = isShow;
        this.returnLobbyBtn.visible = isShow;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.inviteButton.visible = isShow;
        }
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

    // 播放牌局开始动画
    public gameStartAnimation(): void {
        const screenWidth = 1136;
        const screenHeight = 640;
        const x = screenWidth / 2;
        const y = screenHeight / 2;
        Logger.debug("xxxx ", x, y);
        // animation.coplay("animations/Effects_jiemian_duijukaishi.prefab", this.unityViewNode, x, y);
    }

    public startDiscardCountdown(): void {
        if (this.leftTimerCB === undefined) {
            this.leftTimerCB = <Function>this.countDownCallBack.bind(this);
        }

        //清理定时器
        this.component.unschedule(this.leftTimerCB);
        this.leftTime = 1;
        //起定时器
        this.component.schedule(
            this.leftTimerCB,
            1,
            cc.macro.REPEAT_FOREVER,
            1);
    }

    public countDownCallBack(): void {
        this.leftTime += 1;
        this.countDownText.text = `${this.leftTime}`;
        if (this.leftTime >= 999) {
            this.component.unschedule(this.leftTimerCB);
        }
    }

    public stopDiscardCountdown(): void {
        //清理定时器
        this.component.unschedule(this.leftTimerCB);
        this.countDownText.text = "";
    }

    //设置当前房间所等待的操作玩家
    public setWaitingPlayer(playerView: PlayerView): void {
        this.startDiscardCountdown();
        this.clearWaitingPlayer();
        const viewChairID = playerView.viewChairID;
        this.roundMarks[viewChairID].visible = true;

        playerView.setHeadEffectBox(true);
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
        const room = this.room;
        const num = `${this.room.handStartted}/${this.room.handNum}`;
        const s = `     `;
        const str = `${GameRules.gameName(this.room.roomType)}${s}房号:${room.roomInfo.roomNumber}${s}局数:${num}`;
        this.roomInfoText.text = str;

    }
    public showOrHideMeldsOpsPanel(meld: proto.mahjong.IMsgMeldTile[], actionMsg: proto.mahjong.MsgPlayerAction): void {
        this.actionMsg = actionMsg;
        const size = meld.length;
        this.multiOpsDataList = meld;
        this.multiOpsObj.numItems = size;
        this.multiOpsObj.resizeToFit(size);
        this.meldOpsPanel.visible = size > 0;
    }
    //显示出牌提示箭头
    public setArrowByParent(btn: fgui.GComponent): void {
        if (btn === null) {
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
    public setJiaJiaZhuang(): void {
        Logger.debug("家家庄");
    }
    public showTingDataView(list: TingPai[]): void {
        if (list.length <= 0) {
            this.listensObj.visible = false;

            return;
        }
        const len = list.length;
        this.listensDataList = list;
        let width = 290;
        let height = 110;
        if (len <= 2) {
            width = 150;
        } else if (len > 4) {
            height = 230;
        }
        this.listensObjList.setSize(width, height);
        let nCount = 0;
        for (const d of list) {
            nCount = nCount + d.num;
        }
        this.listensObjNum.text = `${nCount}张`;
        this.listensObjList.numItems = len;
        this.listensObj.visible = true;
    }
    public hideTingDataView(): void {
        this.listensObj.visible = false;
    }

    //设置当前房间所使用的风圈
    public setRoundMask(): void {
        if (GameRules.haveRoundMask(this.room.roomType)) {
            this.wind.visible = true;
            this.windTile.visible = true;
            TileImageMounter.mountTileImage(this.windTile, this.room.windFlowerID);
        }
    }

    // 根据玩家的chairID获得相应的playerView
    // 注意服务器的chairID是由0开始
    public getPlayerViewByChairID(chairID: number, myChairId: number): PlayerView {
        const playerViews = this.playerViews;

        //获得chairID相对于本玩家的偏移
        const c = (chairID - myChairId + 4) % 4;
        //加1是由于lua table索引从1开始

        return playerViews[c + 1];
    }

    //根据房间的状态做一些开关变量切换
    public onUpdateStatus(state: number): void {
        const handler = this.statusHandlers[state];
        if (handler !== null) {
            handler(this);
        }
    }

    public switchBg(index: number): void {
        //
        const bgController = this.unityViewNode.getController("bgController");
        bgController.selectedIndex = index;
    }

    public updateDisbandVoteView(msgDisbandNotify: proto.mahjong.MsgDisbandNotify): void {
        //

        let disbandView = this.component.getComponent(DisbandView);

        const myPlayerInfo = this.room.getMyPlayerInfo();
        const myInfo = new DisBandPlayerInfo(myPlayerInfo.userID, myPlayerInfo.chairID, myPlayerInfo.nick);
        const players = this.room.getPlayers();

        const playersInfo: DisBandPlayerInfo[] = [];
        Object.keys(players).forEach((key: string) => {
            const p = <Player>players[key];
            const playInfo = new DisBandPlayerInfo(p.userID, p.chairID, p.playerInfo.nick);
            playersInfo.push(playInfo);

        });

        const load = this.room.getRoomHost().getLobbyModuleLoader();

        if (disbandView === undefined || disbandView == null) {
            disbandView = this.component.addComponent(DisbandView);
        }

        disbandView.saveRoomView(this.room, msgDisbandNotify, load, myInfo, playersInfo);
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
        let roomRuleView = this.component.getComponent(RoomRuleView);

        if (roomRuleView === undefined || roomRuleView == null) {
            roomRuleView = this.component.addComponent(RoomRuleView);
        }
        roomRuleView.updateView(this.room.roomInfo.config);
    }

    private onSettingBtnClick(): void {
        // Logger.debug("onSettingBtnClick---------------");
        const settingView = this.component.addComponent(RoomSettingView);

        const isOwner = this.room.ownerID === this.room.getMyPlayerInfo().userID;
        settingView.showView(this.room, this.room.getRoomHost().getLobbyModuleLoader(), isOwner);
    }

    /**
     * 聊天按钮点击事件
     */
    private onChatBtnClick(): void {
        const load = this.room.getRoomHost().getLobbyModuleLoader();
        if (load === null) {
            Logger.debug("load === null");
        }

        let chatView = this.component.getComponent(ChatView);
        if (chatView === null) {
            chatView = this.component.addComponent(ChatView);
        }

        const callBack: Function = <Function>this.room.showMsg.bind(this.room);
        chatView.show(load, callBack);
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

        const chatBtn = this.unityViewNode.getChild("chatBtn");
        chatBtn.onClick(this.onChatBtnClick, this);

        const settingBtn = this.unityViewNode.getChild("settingBtn");
        settingBtn.onClick(this.onSettingBtnClick, this);

        const infoBtn = this.unityViewNode.getChild("guizeBtn");
        //infoBtn.visible = true;
        infoBtn.onClick(this.onRoomRuleBtnClick, this);

        this.readyButton = this.unityViewNode.getChild("ready").asButton;
        this.readyButton.visible = false;
        this.readyButton.onClick(this.room.onReadyButtonClick, this.room);

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

    private initOtherView(): void {
        // 房间号
        this.roomInfoText = this.unityViewNode.getChild("roomInfo");
        // 风圈和当前操作玩家指示箭头roundMarkArrow
        const roundMarks: fgui.GObject[] = [];
        this.roundMarkView = this.unityViewNode.getChild("roundMask").asCom;
        for (let i = 1; i <= 4; i++) {
            const roundMark = this.roundMarkView.getChild(`n${i}`);
            roundMarks[i] = roundMark;
        }
        this.roundMarks = roundMarks;
        this.wind = this.unityViewNode.getChild("n3");
        this.windTile = this.unityViewNode.getChild("fengquan").asCom;
        this.wind.visible = false;
        this.windTile.visible = false;

        //倒计时
        this.countDownText = this.roundMarkView.getChild("num");
        //道具
        this.donateMoveObj = this.unityViewNode.getChild("donate").asLoader;
        //剩牌
        this.tilesInWall = this.unityViewNode.getChild("tilesInWall");
    }

    //初始化房间状态事件
    private initRoomStatus(): void {
        // 房间正在等待玩家准备
        const onWait = (): void => {
            this.wind.visible = false;
            this.windTile.visible = false;
            this.tilesInWall.visible = false;

            this.roundMarkView.visible = false;
            this.stopDiscardCountdown();
            //等待状态重置上手牌遗留
            this.room.resetForNewHand();
        };

        //房间空闲，客户端永远看不到这个状态
        const onIdle = (): void => {
            Logger.debug("房间空闲，客户端永远看不到这个状态");
        };

        // 游戏开始了
        const onPlay = (): void => {
            // roomView.invitButton.visible = false
            // roomView.returnHallBtn.visible = false
            this.tilesInWall.visible = true;
            this.wind.visible = false; //发牌的时候，或者掉线恢复的时候会设置风圈因此此处不需要visible
            this.windTile.visible = false;

            this.roundMarkView.visible = true;
            // this.clearWaitingPlayer();
            this.showRoomNumber();
        };

        //房间已经被删除，客户端永远看不到这个状态
        const onDelete = (): void => {
            Logger.debug("房间已经被删除，客户端永远看不到这个状态");
        };

        const status = [];
        status[proto.mahjong.RoomState.SRoomIdle] = onIdle;
        status[proto.mahjong.RoomState.SRoomWaiting] = onWait;
        status[proto.mahjong.RoomState.SRoomPlaying] = onPlay;
        status[proto.mahjong.RoomState.SRoomDeleted] = onDelete;
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
        num.text = `${tingPai.num}张`;
        TileImageMounter.mountTileImage(t, tingPai.card);
    }

    //面子牌选择面板
    private initMeldsPanel(): void {
        // const meldMap = {}
        this.meldOpsPanel = this.unityViewNode.getChild("meldOpsPanel").asCom;
        this.multiOpsObj = this.meldOpsPanel.getChild("list").asList;
        this.multiOpsObj.itemRenderer = <(index: number, item: fgui.GComponent) => void>this.renderMultiOpsListItem.bind(this);
        this.multiOpsObj.on(fgui.Event.CLICK_ITEM, (onClickItem: fgui.GObject) => { this.onMeldOpsClick(onClickItem.name); }, this);
        const cancelBtn = this.meldOpsPanel.getChild("cancelBtn");
        const cancelOnClick = () => {
            this.meldOpsPanel.visible = false;
            this.playerViews[1].showButton([]);
        };
        cancelBtn.onClick(cancelOnClick, this);
    }

    private renderMultiOpsListItem(index: number, obj: fgui.GComponent): void {
        const meld = this.multiOpsDataList[index];
        obj.name = index.toString();
        let add = 0;
        let num = 4;
        if (meld.meldType === mjproto.MeldType.enumMeldTypeSequence) {
            //吃的时候exp是3，所以第4个牌可以隐藏起来
            obj.getChild("n4").visible = false;
            add = 1;
            num = 3;
        }
        let a = 0;
        for (let i = 1; i <= num; i++) {
            const oCurCard = obj.getChild(`n${i}`).asCom;
            TileImageMounter.mountTileImage(oCurCard, meld.tile1 + a);
            oCurCard.visible = true;
            a += add;
        }

        obj.visible = true;
    }

    private onMeldOpsClick(index: string): void {
        const data = this.multiOpsDataList[+index];
        const actionMsg = new proto.mahjong.MsgPlayerAction();
        actionMsg.qaIndex = this.actionMsg.qaIndex;
        actionMsg.action = this.actionMsg.action;
        actionMsg.tile = this.actionMsg.tile;
        actionMsg.meldType = data.meldType;
        actionMsg.meldTile1 = data.tile1;
        if (data.meldType === mjproto.MeldType.enumMeldTypeConcealedKong) {
            actionMsg.tile = data.tile1;
            actionMsg.action = mjproto.ActionType.enumActionType_KONG_Concealed;
        } else if (data.meldType === mjproto.MeldType.enumMeldTypeTriplet2Kong) {
            actionMsg.tile = data.tile1;
            actionMsg.action = mjproto.ActionType.enumActionType_KONG_Triplet2;
        }

        const actionMsgBuf = proto.mahjong.MsgPlayerAction.encode(actionMsg);
        this.room.sendActionMsg(actionMsgBuf);
        this.playerViews[1].hideOperationButtons();
        this.meldOpsPanel.visible = false;
    }
}
