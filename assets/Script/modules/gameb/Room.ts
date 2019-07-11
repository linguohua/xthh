
import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { Logger, SoundMgr, UserInfo } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { Share } from "../lobby/shareUtil/ShareExports";
import { ChatData } from "../lobby/views/chat/ChatExports";
import { Algorithm } from "./Algorithm";
import { GameOverResultView } from "./GameOverResultView";
import { HandlerActionResultDiscarded } from "./handlers/HandlerActionResultDiscarded";
import { HandlerActionResultDraw } from "./handlers/HandlerActionResultDraw";
import { HandlerActionResultEndCard } from "./handlers/HandlerActionResultEndCard";
import { HandlerMsgActionOP } from "./handlers/HandlerMsgActionOP";
import { HandlerMsgActionOPAck } from "./handlers/HandlerMsgActionOPAck";
// import { HandlerActionResultNotify } from "./handlers/HandlerActionResultNotify";
// import { HandlerMsg2Lobby } from "./handlers/HandlerMsg2Lobby";
// import { HandlerMsgActionAllowed } from "./handlers/HandlerMsgActionAllowed";
import { HandlerMsgDeal } from "./handlers/HandlerMsgDeal";
import { HandlerMsgTableDisband } from "./handlers/HandlerMsgTableDisband";
import { HandlerMsgTableDisbandAck } from "./handlers/HandlerMsgTableDisbandAck";
import { HandlerMsgTableDisbandReq } from "./handlers/HandlerMsgTableDisbandReq";
// import { HandlerMsgDeleted } from "./handlers/HandlerMsgDeleted";
// import { HandlerMsgDisbandNotify } from "./handlers/HandlerMsgDisbandNotify";
// import { HandlerMsgDonate } from "./handlers/HandlerMsgDonate";
// import { HandlerMsgGameOver } from "./handlers/HandlerMsgGameOver";
// import { HandlerMsgHandOver } from "./handlers/HandlerMsgHandOver";
// import { HandlerMsgKickout } from "./handlers/HandlerMsgKickout";
// import { HandlerMsgReActionAllowed } from "./handlers/HandlerMsgReActionAllowed";
// import { HandlerMsgRestore } from "./handlers/HandlerMsgRestore";
// import { HandlerMsgRoomUpdate } from "./handlers/HandlerMsgRoomUpdate";
// import { HandlerMsgShowTips } from "./handlers/HandlerMsgShowTips";
// import { HandlerMsgUpdateLocation } from "./handlers/HandlerMsgUpdateLocation";
// import { HandlerMsgUpdatePropCfg } from "./handlers/HandlerMsgUpdatePropCfg";
import { HandlerMsgTableEntry } from "./handlers/HandlerMsgTableEntry";
import { HandlerMsgTableLeave } from "./handlers/HandlerMsgTableLeave";
import { HandlerMsgTableManaged } from "./handlers/HandlerMsgTableManaged";
import { HandlerMsgTablePause } from "./handlers/HandlerMsgTablePause";
import { HandlerMsgTableReady } from "./handlers/HandlerMsgTableReady";
import { HandlerMsgTableScore } from "./handlers/HandlerMsgTableScore";
import { HandlerMsgTableUpdate } from "./handlers/HandlerMsgTableUpdate";
import { HandResultView } from "./HandResultView";
import { Player } from "./Player";
import { PlayerInterface } from "./PlayerInterface";
import { proto } from "./proto/protoGame";
import { Replay } from "./Replay";
import { PlayerInfo, room_status, RoomInterface, TingPai } from "./RoomInterface";
import { RoomView } from "./RoomView";

type msgHandler = (msgData: ByteBuffer, room: RoomInterface) => Promise<void>;
/**
 * 定义一个接口 关联Game 到room
 */
const msgCodeEnum = protoHH.casino.eMSG_TYPE;
const msgCodeXTHH = protoHH.casino_xtsj.eXTSJ_MSG_TYPE;
export const msgHandlers: { [key: number]: msgHandler } = {
    // [msgCodeEnum.OPActionAllowed]: HandlerMsgActionAllowed.onMsg,
    // [msgCodeEnum.OPReActionAllowed]: HandlerMsgReActionAllowed.onMsg,
    // [msgCodeEnum.OPActionResultNotify]: HandlerActionResultNotify.onMsg,
    // [msgCodeEnum.OPDeal]: HandlerMsgDeal.onMsg,
    // [msgCodeEnum.OPHandOver]: HandlerMsgHandOver.onMsg,
    // [msgCodeEnum.OPRoomUpdate]: HandlerMsgRoomUpdate.onMsg,
    // [msgCodeEnum.OPRestore]: HandlerMsgRestore.onMsg,
    // [msgCodeEnum.OPRoomDeleted]: HandlerMsgDeleted.onMsg,
    // [msgCodeEnum.OPRoomShowTips]: HandlerMsgShowTips.onMsg,
    // [msgCodeEnum.OPGameOver]: HandlerMsgGameOver.onMsg,
    // [msgCodeEnum.OPDisbandNotify]: HandlerMsgDisbandNotify.onMsg,
    // [msgCodeEnum.OPKickout]: HandlerMsgKickout.onMsg,
    // [msgCodeEnum.OPDonate]: HandlerMsgDonate.onMsg,
    // [msgCodeEnum.OPUpdateLocation]: HandlerMsgUpdateLocation.onMsg,
    // [msgCodeEnum.OP2Lobby]: HandlerMsg2Lobby.onMsg,
    // [msgCodeEnum.OPUpdatePropCfg]: HandlerMsgUpdatePropCfg.onMsg
    [msgCodeEnum.MSG_TABLE_ENTRY]: HandlerMsgTableEntry.onMsg, //玩家进入
    [msgCodeEnum.MSG_TABLE_READY]: HandlerMsgTableReady.onMsg, //准备
    [msgCodeEnum.MSG_TABLE_LEAVE]: HandlerMsgTableLeave.onMsg, //玩家离开
    [msgCodeEnum.MSG_TABLE_PAUSE]: HandlerMsgTablePause.onMsg, //等待玩家操作
    [msgCodeEnum.MSG_TABLE_UPDATE]: HandlerMsgTableUpdate.onMsg, //桌子更新
    [msgCodeEnum.MSG_TABLE_SCORE]: HandlerMsgTableScore.onMsg, //桌子结算
    [msgCodeEnum.MSG_TABLE_MANAGED]: HandlerMsgTableManaged.onMsg, //桌子进入托管

    [msgCodeEnum.MSG_TABLE_DISBAND_ACK]: HandlerMsgTableDisbandAck.onMsg, //解散
    [msgCodeEnum.MSG_TABLE_DISBAND_REQ]: HandlerMsgTableDisbandReq.onMsg, //解散
    [msgCodeEnum.MSG_TABLE_DISBAND]: HandlerMsgTableDisband.onMsg, //解散
    //晃晃专用
    [msgCodeXTHH.XTSJ_MSG_SC_STARTPLAY]: HandlerMsgDeal.onMsg, //发牌
    [msgCodeXTHH.XTSJ_MSG_SC_OP]: HandlerMsgActionOP.onMsg, //服务器询问玩家操作
    [msgCodeXTHH.XTSJ_MSG_SC_OUTCARD_ACK]: HandlerActionResultDiscarded.onMsg, //出牌服务器回复
    [msgCodeXTHH.XTSJ_MSG_SC_OP_ACK]: HandlerMsgActionOPAck.onMsg, //操作服务器回复
    [msgCodeXTHH.XTSJ_MSG_SC_DRAWCARD]: HandlerActionResultDraw.onMsg, //抽牌
    [msgCodeXTHH.XTSJ_MSG_SC_ENDCARD]: HandlerActionResultEndCard.onMsg //海底
    // [msgCodeXTHH.XTSJ_MSG_SC_SCORE]: HandlerMsgTableScore.onMsg //结算
};

//转换玩家chairid
const playerCound: number[][] = [
    [0],
    [0],
    [1, 3],
    [1, 2, 4],
    [1, 2, 3, 4]
];
/**
 * 房间
 */
export class Room {
    public readonly myUser: UserInfo;
    public readonly roomInfo: protoHH.casino.Itable;
    public readonly host: RoomHost;
    public scoreRecords: proto.mahjong.IMsgRoomHandScoreRecord[];
    public state: number;
    public ownerID: string;
    public handStartted: number = 0;
    public laiziID: number;
    public laigenID: number;
    public isDestroy: boolean = false;
    public bankerChairID: number = -1;
    public markup: number;
    public isContinuousBanker: boolean;
    public roomView: RoomView;
    public players: { [key: string]: Player } = {};
    public replay: Replay;
    public tilesInWall: number;
    public myPlayer: Player;
    public disbandReq: protoHH.casino.packet_table_disband_req;
    public handNum: number;
    public isDisband: boolean = false;
    public readonly roomType: number;
    public mAlgorithm: Algorithm;
    public isMySelfDisCard: boolean = false;
    public lastDisCardTile: number = 0; //最后打出的牌 用于吃碰杠胡
    public constructor(myUser: UserInfo, roomInfo: protoHH.casino.Itable, host: RoomHost, rePlay?: Replay) {
        Logger.debug("myUser ---------------------------------------------", myUser);
        this.myUser = myUser;
        this.host = host;
        this.replay = rePlay;
        this.roomInfo = roomInfo;
        this.mAlgorithm = new Algorithm();
        // const roomConfigJSON = <{ [key: string]: boolean | number | string }>JSON.parse(roomInfo.config);
        // Logger.debug("roomConfigJSON ---------------------------------------------", roomConfigJSON);
        this.roomType = roomInfo.room_id;
        this.handNum = roomInfo.round;
    }

    public getRoomHost(): RoomHost {
        return this.host;
    }

    public async dispatchWebsocketMsg(msg: protoHH.casino.ProxyMessage): Promise<void> {
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

        if (this.roomInfo.play_total !== null) {
            this.handStartted = this.roomInfo.play_total;
        }
        this.showRoomNumber();
    }

    // 创建玩家对象    // 并绑定playerView
    public createPlayerByInfo(playerInfo: protoHH.casino.Itable_player, chairID: number): void {
        const player = new Player(`${playerInfo.id}`, chairID, this);
        player.updateByPlayerInfo(playerInfo, chairID);

        const pChair = this.getPlayerViewChairIDByChairID(chairID);

        const playerView = this.roomView.getPlayerViewByChairID(pChair);
        player.bindView(playerView);

        this.players[player.userID] = player;

        this.initCards(playerInfo, player);

    }
    // 创建自身的玩家对象    // 并绑定playerView
    public createMyPlayer(playerInfo: protoHH.casino.Itable_player, chairID: number): void {
        const player = new Player(`${playerInfo.id}`, chairID, this);

        player.updateByPlayerInfo(playerInfo, chairID);

        const playerView = this.roomView.playerViews[1];
        player.bindView(playerView);

        this.players[player.userID] = player;

        this.myPlayer = player;

        this.initCards(playerInfo, player);
    }

    public onReadyButtonClick(): void {
        // const gm = new proto.mahjong.GameMessage();
        // gm.Ops = proto.mahjong.MessageCode.OPPlayerReady;
        // const buf = proto.mahjong.GameMessage.encode(gm);
        // this.host.sendBinary(buf);

        const req2 = new protoHH.casino.packet_table_ready({ idx: -1 });
        const buf = protoHH.casino.packet_table_ready.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_READY);
    }

    public onInviteButtonClick(): void {
        Share.shareGame(
            this.host.eventTarget,
            Share.ShareSrcType.GameShare,
            Share.ShareMediaType.Image,
            Share.ShareDestType.Friend,
            `roomNumber=${this.roomInfo.tag}`);
    }
    public onReturnLobbyBtnClick(): void {

        this.sendMsg(proto.mahjong.MessageCode.OP2Lobby);

    }

    // 根据玩家的chairID获得相应的playerViewChairID    // 注意服务器的chairID是由0开始
    public getPlayerViewChairIDByChairID(chairID: number): number {
        const myChairId = this.myPlayer.chairID;

        const le = this.roomInfo.players.length;
        const c = (chairID - myChairId + le) % le;

        return playerCound[le][c];

        //获得chairID相对于本玩家的偏移
        // const c = (chairID - myChairId + 4) % 4;
        //加1是由于lua table索引从1开始
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

        host.sendBinary(msg, opCode);
    }

    //重置房间，以便开始新一手游戏
    public resetForNewHand(): void {
        this.isMySelfDisCard = false;
        this.lastDisCardTile = 0;

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
        // this.sendMsg(proto.mahjong.MessageCode.OPDisbandRequest);
        const req2 = new protoHH.casino.packet_table_disband_req({ player_id: +this.myUser.userID });
        const buf = protoHH.casino.packet_table_disband_req.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    //更新解散处理界面
    public updateDisbandVoteView(disbandReq: protoHH.casino.packet_table_disband_req, disbandAck: protoHH.casino.packet_table_disband_ack): void {
        this.disbandReq = disbandReq;

        this.roomView.updateDisbandVoteView(disbandReq, disbandAck);

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
        const disbandAck = {
            player_id: +this.myUser.userID,
            disband: agree,

        }
        const req2 = new protoHH.casino.packet_table_disband_ack(disbandAck);
        const buf = protoHH.casino.packet_table_disband_ack.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_ACK);
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

    public setDiscardAble(): void {
        if (!this.isMySelfDisCard) {
            return;
        }
        this.myPlayer.setDiscardAble();
    }

    public loadHandResultView(msgHandOver: protoHH.casino.packet_table_score): void {
        const view = this.host.component.addComponent(HandResultView);
        view.showView(this, msgHandOver);
    }

    public loadGameOverResultView(msgGameOver: protoHH.casino.packet_table_score): void {
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
    public isMe(userID: string): boolean {
        // 统一转成字符串，避免有的是number,有的是string
        return `${this.myUser.userID}` === `${userID}`;
    }
    public isReplayMode(): boolean {
        return this.replay !== undefined;
    }

    public getBankerChairID(): number {
        return this.bankerChairID;
    }
    //往服务器发送action消息
    public sendActionMsg(msgAction: ByteBuffer, opCode: number): void {
        this.host.sendBinary(msgAction, opCode);
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
    public setWaitingPlayer(chairID: number, time: number = 15): void {
        const player = this.getPlayerByChairID(chairID);
        this.roomView.setWaitingPlayer(player.playerView, time);
    }
    public getPlayers(): { [key: string]: PlayerInterface } {
        return this.players;
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

    /**
     * 创建玩家
     */
    public createPlayers(): void {
        if (this.roomInfo === undefined || this.roomInfo == null) {
            Logger.error("this.roomInfo == undefined || this.roomInfo == null");

            return;
        }

        // this.createMyPlayer(this.roomInfo.players[0]);
        for (let i = 0; i < this.roomInfo.players.length; i++) {
            const p = this.roomInfo.players[i];
            if (this.isMe(`${p.id}`)) {
                // Logger.debug(`createPlayers, my id:${p.id}, i:${i}`);
                this.createMyPlayer(p, i);
                break;
            }
        }

        for (let i = 0; i < this.roomInfo.players.length; i++) {
            const p = this.roomInfo.players[i];
            if (!this.isMe(`${p.id}`)) {
                if (p !== undefined && p !== null && p.id !== null) {
                    // Logger.debug(`createPlayers, other id:${p.id}, i:${i}`);
                    this.createPlayerByInfo(p, i);
                }
            }
        }
    }

    /**
     * 断线重连恢复用户的操作
     */
    public restrorePlayerOperation(): void {
        this.onUpdateStatus(room_status.onPlay);
        //剩牌
        this.tilesInWall = this.roomInfo.cardcount;
        this.updateTilesInWallUI();
        //显示癞子
        this.laiziID = this.roomInfo.laizi;
        this.laigenID = this.roomInfo.fanpai;
        this.setRoundMask();
        //设置癞子 赖根
        this.mAlgorithm.setMahjongLaiZi(this.roomInfo.laizi);
        this.mAlgorithm.setMahjongFan(this.roomInfo.fanpai);
        //设置弃杠弃碰
        let myPlayerInfo: protoHH.casino.Itable_player;
        for (const p of this.roomInfo.players) {
            if (`${p.id}` === this.myUser.userID) {
                myPlayerInfo = p;
            }
        }
        const pl = myPlayerInfo.pengcards.length;
        if (pl > 0) {
            this.myPlayer.notPong = myPlayerInfo.pengcards[pl - 1];
        }
        const gl = myPlayerInfo.cancelcards.length;
        if (gl > 0) {
            this.myPlayer.notKongs = myPlayerInfo.cancelcards;
        }
        //压入捉铳不铳的标志
        this.myPlayer.cancelZhuochong = myPlayerInfo.cancel_zhuochong;
        this.bankerChairID = this.roomInfo.lord_id;
        //压入自摸不自摸的标志
        this.myPlayer.cancelZiMo = myPlayerInfo.jialaizi === 1;

        // this.setWaitingPlayer(this.roomInfo.cur_idx);
        // this.setDiscardAble(this.roomInfo.cur_idx); // 如果是轮到我出牌 要让牌可以点击
        const curPlayerInfo = this.roomInfo.players[this.roomInfo.cur_idx];
        if (this.roomInfo.status === protoHH.casino_xtsj.eXTSJ_STATUS.XTSJ_STATUS_OUTCARD) {
            const lastTile = curPlayerInfo.curcards[curPlayerInfo.curcards.length - 1];
            this.myPlayer.removeTileFromHand(lastTile);
            const m = new protoHH.casino_xtsj.packet_sc_drawcard();
            m.time = this.roomInfo.time;
            m.card = lastTile;
            m.player_id = curPlayerInfo.id;

            const reply = protoHH.casino_xtsj.packet_sc_drawcard.encode(m);
            const msg = new protoHH.casino.ProxyMessage();
            msg.Ops = protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_DRAWCARD;
            msg.Data = reply;

            // 构造一个类似的消息，恢复用户的操作
            const handler = msgHandlers[protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_DRAWCARD];
            handler(reply, this);

        } else if (this.roomInfo.status === protoHH.casino_xtsj.eXTSJ_STATUS.XTSJ_STATUS_OP) {
            //如果到我操作 要显示操作按钮
            const m = new protoHH.casino_xtsj.packet_sc_op();
            m.card = this.roomInfo.outcard;
            m.player_id = this.roomInfo.op_id;
            m.target_id = this.roomInfo.target_id;
            m.time = this.roomInfo.time;
            m.table_id = this.roomInfo.id;

            const reply = protoHH.casino_xtsj.packet_sc_op.encode(m);

            const msg = new protoHH.casino.ProxyMessage();
            msg.Ops = protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP;
            msg.Data = reply;

            // 构造一个类似的消息，恢复用户的操作
            const handler = msgHandlers[protoHH.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP];
            handler(reply, this);
        }
        // if (this.roomInfo.cur_idx !== 0) {
        //     const player = this.roomInfo.players[this.roomInfo.cur_idx];
        //     if (player !== undefined && player !== null) {
        //         const p = this.getPlayerByUserID(`${player.id}`);
        //         if (p !== undefined) {
        //             this.setWaitingPlayer(p.chairID);
        //         }
        //     }
        // }
    }
    public myMahjong_showTingGroup(tile: number): TingPai[] {
        const tingP: TingPai[] = [];
        //开始听牌检查
        const array = this.myPlayer.getAllVMahjongs_delMahjong(tile);

        const check_mahjong: number[] = [
            21, 22, 23, 24, 25, 26, 27, 28, 29,
            31, 32, 33, 34, 35, 36, 37, 38, 39];
        this.mAlgorithm.pop_mahjong(check_mahjong, this.laiziID);
        let total = 0;
        const ting_mahjong = [];
        for (const checkMahjong of check_mahjong) {
            const bHuPai = this.mAlgorithm.canHuPai_WithOther(array, checkMahjong, true);
            if (bHuPai.length > 0) {
                //检查牌剩余数量
                total = this.getMahjongLaveNumber(checkMahjong);
                if (total > 0) {
                    ting_mahjong.push(checkMahjong);
                    tingP.push(new TingPai(checkMahjong, 1, total));
                }
            }
        }
        //判断是否可以听赖子
        total = this.getMahjongLaveNumber(this.laiziID);
        if (total > 0) {
            array.push(this.laiziID);
            if (this.mAlgorithm.canHuPai(array).length > 0) {
                tingP.push(new TingPai(this.laiziID, 1, total));
            }
            // const s = this.mAlgorithm.getArray_Pai_Lai(array);
            // if (s.sVecLai.length <= 0 && (!this.mAlgorithm.isFind(ting_mahjong, this.laiziID))) {
            //     ting_mahjong.push(this.laiziID);
            //     tingP.push(new TingPai(this.laiziID, 1, total));
            // }
        }

        return tingP;
    }

    //播放背景音乐
    private playBgSound(): void {
        SoundMgr.playMusicAudio("gameb/game_matchBg", true);
    }
    private stopBgSound(): void {
        SoundMgr.stopMusic();
    }
    //重连 初始化 牌组
    private initCards(playerInfo: protoHH.casino.Itable_player, player: Player, isNewDiacard: boolean = false): void {
        if (playerInfo.curcards.length > 0) {
            player.addHandTiles(playerInfo.curcards);
            player.sortHands(false);
            player.hand2UI(false);
        }

        if (playerInfo.outcards.length > 0) {
            player.addDiscardedTiles(playerInfo.outcards);
            player.discarded2UI(isNewDiacard, false);

            if (!this.mAlgorithm.getFlagPiao()) {
                for (const outcard of playerInfo.outcards) {
                    if (outcard === this.roomInfo.laizi) {
                        this.mAlgorithm.setFlagPiao(true);
                    }
                }
            }
        }

        if (playerInfo.groups.length > 0) {
            const melds: { [key: string]: protoHH.casino_xtsj.packet_sc_op_ack } = {};
            for (const g of playerInfo.groups) {
                const m = new protoHH.casino_xtsj.packet_sc_op_ack();
                m.cards = g.cards;
                m.op = g.op;
                m.target_id = g.target_id;
                m.type = g.type;
                melds[g.cards[0].toString()] = m;
            }
            const keys = Object.keys(melds);
            for (const k of keys) {
                const m = melds[k];
                player.addMeld(m);
            }
            player.hand2UI(false);
        }
    }
    private getMahjongLaveNumber(tile: number): number {
        //普通牌最大数量是4张，翻牌最大数量就是3张
        let lave = 4;
        if (tile === this.mAlgorithm.getMahjongFan()) {
            lave = 3;
        }
        //返回搜到的牌数量
        Object.keys(this.players).forEach((key: string) => {
            const p = this.players[key];
            lave = lave - p.getMahjongCount_withI(tile);
        });
        lave = lave - this.myPlayer.getMahjongCount_withV(tile);
        if (lave < 0) {
            lave = 0;
        }

        return lave;
    }
}
