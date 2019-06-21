
import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { Logger, RoomInfo, SoundMgr, UserInfo } from "../lobby/lcore/LCoreExports";
import { Share } from "../lobby/shareUtil/ShareExports";
import { ChatData } from "../lobby/views/chat/ChatExports";
import { GameOverResultView } from "./GameOverResultView";
import { HandlerActionResultNotify } from "./handlers/HandlerActionResultNotify";
import { HandlerMsg2Lobby } from "./handlers/HandlerMsg2Lobby";
import { HandlerMsgActionAllowed } from "./handlers/HandlerMsgActionAllowed";
import { HandlerMsgDeal } from "./handlers/HandlerMsgDeal";
import { HandlerMsgDeleted } from "./handlers/HandlerMsgDeleted";
import { HandlerMsgDisbandNotify } from "./handlers/HandlerMsgDisbandNotify";
import { HandlerMsgDonate } from "./handlers/HandlerMsgDonate";
import { HandlerMsgGameOver } from "./handlers/HandlerMsgGameOver";
import { HandlerMsgHandOver } from "./handlers/HandlerMsgHandOver";
import { HandlerMsgKickout } from "./handlers/HandlerMsgKickout";
import { HandlerMsgReActionAllowed } from "./handlers/HandlerMsgReActionAllowed";
import { HandlerMsgRestore } from "./handlers/HandlerMsgRestore";
import { HandlerMsgRoomUpdate } from "./handlers/HandlerMsgRoomUpdate";
import { HandlerMsgShowTips } from "./handlers/HandlerMsgShowTips";
import { HandlerMsgUpdateLocation } from "./handlers/HandlerMsgUpdateLocation";
import { HandlerMsgUpdatePropCfg } from "./handlers/HandlerMsgUpdatePropCfg";
import { HandResultView } from "./HandResultView";
import { Player } from "./Player";
import { PlayerInterface } from "./PlayerInterface";
import { proto } from "./proto/protoGame";
import { Replay } from "./Replay";
import { PlayerInfo, RoomInterface, TingPai } from "./RoomInterface";
import { RoomView } from "./RoomView";

type msgHandler = (msgData: ByteBuffer, room: RoomInterface) => Promise<void>;
/**
 * 定义一个接口 关联Game 到room
 */
const msgCodeEnum = proto.mahjong.MessageCode;
const msgHandlers: { [key: number]: msgHandler } = {
    [msgCodeEnum.OPActionAllowed]: HandlerMsgActionAllowed.onMsg,
    [msgCodeEnum.OPReActionAllowed]: HandlerMsgReActionAllowed.onMsg,
    [msgCodeEnum.OPActionResultNotify]: HandlerActionResultNotify.onMsg,
    [msgCodeEnum.OPDeal]: HandlerMsgDeal.onMsg,
    [msgCodeEnum.OPHandOver]: HandlerMsgHandOver.onMsg,
    [msgCodeEnum.OPRoomUpdate]: HandlerMsgRoomUpdate.onMsg,
    [msgCodeEnum.OPRestore]: HandlerMsgRestore.onMsg,
    [msgCodeEnum.OPRoomDeleted]: HandlerMsgDeleted.onMsg,
    [msgCodeEnum.OPRoomShowTips]: HandlerMsgShowTips.onMsg,
    [msgCodeEnum.OPGameOver]: HandlerMsgGameOver.onMsg,
    [msgCodeEnum.OPDisbandNotify]: HandlerMsgDisbandNotify.onMsg,
    [msgCodeEnum.OPKickout]: HandlerMsgKickout.onMsg,
    [msgCodeEnum.OPDonate]: HandlerMsgDonate.onMsg,
    [msgCodeEnum.OPUpdateLocation]: HandlerMsgUpdateLocation.onMsg,
    [msgCodeEnum.OP2Lobby]: HandlerMsg2Lobby.onMsg,
    [msgCodeEnum.OPUpdatePropCfg]: HandlerMsgUpdatePropCfg.onMsg
};

/**
 * 房间
 */
export class Room {
    public readonly myUser: UserInfo;
    public readonly roomInfo: RoomInfo;
    public readonly host: RoomHost;
    public scoreRecords: proto.mahjong.IMsgRoomHandScoreRecord[];
    public state: number;
    public ownerID: string;
    public handStartted: number = 0;
    public windFlowerID: number;
    public isDestroy: boolean = false;
    public bankerChairID: number = 0;
    public markup: number;
    public isContinuousBanker: boolean;
    public roomView: RoomView;
    public players: { [key: string]: Player } = {};
    public replay: Replay;
    public tilesInWall: number;
    public myPlayer: Player;
    public msgDisbandNotify: proto.mahjong.MsgDisbandNotify;
    public handNum: number;
    public readonly roomType: number;
    public constructor(myUser: UserInfo, roomInfo: RoomInfo, host: RoomHost, rePlay?: Replay) {
        this.myUser = myUser;
        this.host = host;
        this.replay = rePlay;
        this.roomInfo = roomInfo;

        const roomConfigJSON = <{ [key: string]: boolean | number | string }>JSON.parse(roomInfo.config);
        // Logger.debug("roomConfigJSON ---------------------------------------------", roomConfigJSON);
        this.roomType = <number>roomConfigJSON[`roomType`];
        this.handNum = <number>roomConfigJSON[`handNum`];
    }

    public getRoomHost(): RoomHost {
        return this.host;
    }

    public async dispatchWebsocketMsg(msg: proto.mahjong.GameMessage): Promise<void> {
        Logger.debug("Room.dispatchWebsocketMsg, ops:", msg.Ops);
        const handler = msgHandlers[msg.Ops];
        if (handler !== undefined) {
            await handler(msg.Data, this);
        } else {
            Logger.debug("room has no handler for msg, ops:", msg.Ops);
        }
    }

    public getPlayerByChairID(chairID: number): Player {
        let player = null;
        Object.keys(this.players).forEach((key: string) => {
            const p = this.players[key];
            if (p.chairID === chairID) {
                player = p;
            }
        });

        return player;
    }

    public getPlayerInfoByChairID(chairID: number): PlayerInfo {
        let player = null;
        Object.keys(this.players).forEach((key: string) => {
            const p = this.players[key];
            if (p.chairID === chairID) {
                player = p;
            }
        });

        return player;
    }

    public getRoomView(): RoomView {
        return this.roomView;
    }
    //把tilesInWall显示到房间的剩余牌数中
    public updateTilesInWallUI(): void {
        this.roomView.tilesInWall.text = `剩牌 :${this.tilesInWall}`;
    }

    // 加载房间的view
    public loadRoomView(view: fgui.GComponent): void {
        const roomView = new RoomView(this, view);
        this.roomView = roomView;

        this.playBgSound();
    }

    // 创建玩家对象    // 并绑定playerView
    public createPlayerByInfo(playerInfo: proto.mahjong.IMsgPlayerInfo): void {
        const player = new Player(playerInfo.userID, playerInfo.chairID, this);
        player.updateByPlayerInfo(playerInfo);

        const playerView = this.roomView.getPlayerViewByChairID(playerInfo.chairID, this.myPlayer.chairID);
        player.bindView(playerView);

        this.players[player.userID] = player;
    }

    // 创建自身的玩家对象    // 并绑定playerView
    public createMyPlayer(playerInfo: proto.mahjong.IMsgPlayerInfo): void {
        const player = new Player(playerInfo.userID, playerInfo.chairID, this);

        player.updateByPlayerInfo(playerInfo);

        const playerView = this.roomView.playerViews[1];
        player.bindView(playerView);

        this.players[player.userID] = player;

        this.myPlayer = player;
    }

    public onReadyButtonClick(): void {
        const gm = new proto.mahjong.GameMessage();
        gm.Ops = proto.mahjong.MessageCode.OPPlayerReady;
        const buf = proto.mahjong.GameMessage.encode(gm);
        this.host.sendBinary(buf);
    }

    public onInviteButtonClick(): void {
        Share.shareGame(
            this.host.eventTarget,
            Share.ShareSrcType.GameShare,
            Share.ShareMediaType.Image,
            Share.ShareDestType.Friend,
            `roomNumber=${this.roomInfo.roomNumber}`);
    }
    public onReturnLobbyBtnClick(): void {

        this.sendMsg(proto.mahjong.MessageCode.OP2Lobby);

    }

    // 根据玩家的chairID获得相应的playerViewChairID    // 注意服务器的chairID是由0开始
    public getPlayerViewChairIDByChairID(chairID: number): number {
        const myChairId = this.myPlayer.chairID;
        //获得chairID相对于本玩家的偏移
        const c = (chairID - myChairId + 4) % 4;
        //加1是由于lua table索引从1开始

        return c + 1;
    }
    //从房间的玩家列表中删除一个玩家
    //注意玩家视图的解除绑定需要外部处理
    public removePlayer(userID: string): void {
        delete this.players[userID];

        // Logger.debug("this.players------ : ", this.players);
        // this.players[chairID] = null;
    }

    //往服务器发送消息
    public sendMsg(opCode: number, msg?: ByteBuffer): void {
        const host = this.host;
        if (host == null) {
            return;
        }
        const gm = new proto.mahjong.GameMessage();
        gm.Ops = opCode;

        if (msg != null) {
            gm.Data = msg;
        }
        const buf = proto.mahjong.GameMessage.encode(gm);
        host.sendBinary(buf);
    }

    //重置房间，以便开始新一手游戏
    public resetForNewHand(): void {
        Object.keys(this.players).forEach((key: string) => {
            const v = this.players[key];
            v.resetForNewHand();
        });
        //隐藏箭头
    }

    //背景声音
    public resumeBackMusicVolume(): void {
        //if this:DelayRunCanceled() {
        // if backMusicVolume {
        //     soundMgr:SetBackMusicVolume(backMusicVolume)
        // else
        //     soundMgr:SetBackMusicVolume(soundModule.backMusicVolume)
        // }
        //}
    }

    public onExitButtonClicked(): void {
        this.sendMsg(proto.mahjong.MessageCode.OPPlayerLeaveRoom);
    }

    //处理玩家申请解散请求
    public onDissolveClicked(): void {
        this.sendMsg(proto.mahjong.MessageCode.OPDisbandRequest);
    }

    //更新解散处理界面
    public updateDisbandVoteView(msgDisbandNotify: proto.mahjong.MsgDisbandNotify): void {
        this.msgDisbandNotify = msgDisbandNotify;

        this.roomView.updateDisbandVoteView(msgDisbandNotify);

        // if (this.disbandVoteView) {
        //     this.disbandVoteView: updateView(msgDisbandNotify)
        // } else {
        //     const viewObj = _ENV.thisMod: CreateUIObject("dafeng", "disband_room")
        //     const disbandVoteView = require("scripts/disbandVoteView")
        //     this.disbandVoteView = disbandVoteView.new(this, viewObj)
        //     this.disbandVoteView: updateView(msgDisbandNotify)
        // }
    }

    //发送解散回复给服务器
    public sendDisbandAgree(agree: boolean): void {
        const msgDisbandAnswer = new proto.mahjong.MsgDisbandAnswer();
        msgDisbandAnswer.agree = agree;
        const buf = proto.mahjong.MsgDisbandAnswer.encode(msgDisbandAnswer);
        this.sendMsg(proto.mahjong.MessageCode.OPDisbandAnswer, buf);
    }

    public getRoomConfig(): void {
        // if (this.config != null) {
        //     return this.config
        // }

        // const roomInfo = this.roomInfo
        // if roomInfo != null && roomInfo.config != null && roomInfo.config != "" {
        //     const config = rapidjson.decode(roomInfo.config)
        //     this.config = config
        // }
        // return this.config
    }

    //关闭吃牌，杠牌，听牌详情
    public cleanUI(): void {
        this.roomView.listensObj.visible = false;
        this.roomView.meldOpsPanel.visible = false;
    }

    //设置庄家标志
    public setBankerFlag(): void {
        Object.keys(this.players).forEach((key: string) => {
            const v = this.players[key];
            v.playerView.head.onUpdateBankerFlag(v.chairID === this.bankerChairID, this.isContinuousBanker);
        });
    }

    public loadHandResultView(msgHandOver: proto.mahjong.IMsgHandOver): void {
        const view = this.host.component.addComponent(HandResultView);
        view.showView(this, msgHandOver);
    }

    public loadGameOverResultView(msgGameOver: proto.mahjong.IMsgGameOver): void {
        const view = this.host.component.addComponent(GameOverResultView);
        view.showView(this, msgGameOver);
    }

    public hideDiscardedTips(): void {
        Object.keys(this.players).forEach((key: string) => {
            const v = this.players[key];
            v.hideDiscardedTips();
        });
    }

    public sendDonate(donateId: number, toChairID: number): void {
        // 1：鲜花    2：啤酒    3：鸡蛋    4：拖鞋
        // 8：献吻    7：红酒    6：大便    5：拳头
        const chairID = this.myPlayer.chairID;

        const msgDonate = new proto.mahjong.MsgDonate();
        msgDonate.fromChairID = chairID;
        msgDonate.toChairID = toChairID;
        msgDonate.itemID = donateId;

        const actionMsgBuf = proto.mahjong.MsgDonate.encode(msgDonate);
        this.sendMsg(proto.mahjong.MessageCode.OPDonate, actionMsgBuf);
    }

    // 显示道具动画
    public showDonate(msgDonate: proto.mahjong.MsgDonate): void {
        // Logger.debug("显示道具动画 msgDonate : ", msgDonate);
        if (msgDonate != null) {
            const itemID = msgDonate.itemID;
            const oCurOpObj = this.roomView.donateMoveObj;
            // this.roomView.donateMoveObj.node.clone .cloneNode();
            const fromPlayer = this.getPlayerByChairID(msgDonate.fromChairID);
            const toPlayer = this.getPlayerByChairID(msgDonate.toChairID);
            if (fromPlayer == null || toPlayer == null) {
                Logger.debug("llwant, fromPlayer || toPlayer is null...");

                return;
            }
            const fromPos = fromPlayer.playerView.head.headView.node.position;
            const toPos = toPlayer.playerView.head.headView.node.position;
            let sprite = "";
            let effobjSUB = "";
            let sound = "";
            const handTypeMap = [
                () => {
                    sprite = "dj_meigui";
                    effobjSUB = "Effect_baojv_hua";
                    sound = "daoju_hua";
                },
                () => {
                    sprite = "dj_ganbei";
                    effobjSUB = "Effect_daojv_jiubei";
                    sound = "daoju_pijiu";
                },
                () => {
                    sprite = "dj_jd";
                    effobjSUB = "Effect_daojv_jidan";
                    sound = "daoju_jidan";
                },
                () => {
                    sprite = "dj_tuoxie";
                    effobjSUB = "Effect_daojv_tuoxie";
                    sound = "daoju_tuoxie";
                },
                () => {
                    sprite = "dj_qj";
                    effobjSUB = "Effect_daojv_quanji";
                    sound = "daoju_quanji";
                },
                () => {
                    sprite = "dj_bb";
                    effobjSUB = "Effect_daojv_shiren";
                    sound = "daoju_shiren";
                },
                () => {
                    sprite = "dj_hj";
                    effobjSUB = "Effect_daojv_hongjiu";
                    sound = "daoju_hongjiu";
                },
                () => {
                    sprite = "dj_mmd";
                    effobjSUB = "Effect_daojv_zui";
                    sound = "daoju_zui";
                }
            ];

            const fn = handTypeMap[itemID - 1];
            fn();
            if (sprite == null || effobjSUB == null) {
                Logger.debug("llwant, sprite || effobjSUB is null...");

                return;
            }
            oCurOpObj.node.position = fromPos;
            oCurOpObj.url = `ui://lobby_player_info/${sprite}`;
            oCurOpObj.visible = true;
            //飞动画
            const moveAnimation = cc.moveTo(1, toPos);
            oCurOpObj.node.runAction(moveAnimation);
            const callBack = () => {
                //飞完之后 关闭oCurOpObj
                oCurOpObj.visible = false;
                //播放特效
                toPlayer.playerView.playerDonateEffect(effobjSUB);
                //播放声音
                if (sound !== "") {
                    SoundMgr.playEffectAudio(`daoju/${sound}`);
                }
            };
            this.getRoomHost().component.scheduleOnce(callBack, 1);
        }
    }
    //roomview 接口
    public setArrowByParent(d: fgui.GComponent): void {
        this.roomView.setArrowByParent(d);
    }
    public showOrHideMeldsOpsPanel(chowMelds: proto.mahjong.IMsgMeldTile[], actionMsg: proto.mahjong.MsgPlayerAction): void {
        this.roomView.showOrHideMeldsOpsPanel(chowMelds, actionMsg);
    }
    public isMe(userID: string): boolean {
        return this.myUser.userID === userID;
    }
    public isReplayMode(): boolean {
        return this.replay !== undefined;
    }

    public getBankerChairID(): number {
        return this.bankerChairID;
    }
    //往服务器发送action消息
    public sendActionMsg(msgAction: ByteBuffer): void {
        this.sendMsg(proto.mahjong.MessageCode.OPAction, msgAction);
    }
    public quit(): void {
        this.stopBgSound();
        this.host.quit();
    }
    public hideTingDataView(): void {
        this.roomView.hideTingDataView();
    }
    public showTingDataView(tingP: TingPai[]): void {
        this.roomView.showTingDataView(tingP);
    }
    public isListensObjVisible(): boolean {
        return this.roomView.listensObj.visible;
    }

    public getPlayerByUserID(userID: string): PlayerInterface {

        return this.players[userID];
    }
    public getPlayerByCharID(charID: number): Player {

        return this.players[charID];
    }

    public getMyPlayer(): PlayerInterface {
        return this.myPlayer;
    }

    public getMyPlayerInfo(): PlayerInfo {
        return this.myPlayer.playerInfo;
    }

    //设置当前房间所等待的操作玩家
    public setWaitingPlayer(chairID: number): void {
        const player = this.getPlayerByChairID(chairID);
        this.roomView.setWaitingPlayer(player.playerView);
    }
    public getPlayers(): { [key: string]: PlayerInterface } {
        return this.players;
    }

    public setJiaJiaZhuang(): void {
        this.roomView.setJiaJiaZhuang();
    }
    public setRoundMask(): void {
        this.roomView.setRoundMask();
    }
    public showRoomNumber(): void {
        this.roomView.showRoomNumber();
    }
    public showOrHideReadyButton(isShow: boolean): void {
        this.roomView.showOrHideReadyButton(isShow);
    }
    public onUpdateStatus(state: number): void {
        this.roomView.onUpdateStatus(state);
    }
    public switchBg(index: number): void {
        //
        this.roomView.switchBg(index);
    }
    public showMsg(chatData: ChatData): void {
        this.players[chatData.fromUserID].onChatMsg(chatData);
    }
    /**
     * 挂起若干秒
     * @param seconds 秒数
     */
    public async coWaitSeconds(seconds: number): Promise<void> {
        return new Promise<void>((resovle) => {
            this.host.component.scheduleOnce(
                () => {
                    resovle();
                },
                seconds);
        });
    }

    //播放背景音乐
    private playBgSound(): void {
        SoundMgr.playMusicAudio("gameb/game_matchBg", true);
    }
    private stopBgSound(): void {
        SoundMgr.stopMusic();
    }
}
