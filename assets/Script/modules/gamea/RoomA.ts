
import { NIMMessage } from "../lobby/chanelSdk/nimSdk/NimSDKExports";
import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { Dialog, Logger, SoundMgr, UserInfo } from "../lobby/lcore/LCoreExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { Share } from "../lobby/shareUtil/ShareExports";
import { LocalStrings } from "../lobby/strings/LocalStringsExports";
import { AlgorithmA } from "./AlgorithmA";
import { GameOverResultViewA } from "./GameOverResultViewA";
import { HandlerActionResultDiscardedA } from "./handlersA/HandlerActionResultDiscardedA";
import { HandlerActionResultDrawA } from "./handlersA/HandlerActionResultDrawA";
import { HandlerActionResultEndCardA } from "./handlersA/HandlerActionResultEndCardA";
import { HandlerActionScoreA } from "./handlersA/HandlerActionScoreA";
import { HandlerMsgActionOPA } from "./handlersA/HandlerMsgActionOPA";
import { HandlerMsgActionOPAckA } from "./handlersA/HandlerMsgActionOPAckA";
import { HandlerMsgDealA } from "./handlersA/HandlerMsgDealA";
import { HandlerMsgSearchAckA } from "./handlersA/HandlerMsgSearchAckA";
import { HandlerMsgTableChatA } from "./handlersA/HandlerMsgTableChatA";
import { HandlerMsgTableDisbandA } from "./handlersA/HandlerMsgTableDisbandA";
import { HandlerMsgTableDisbandAckA } from "./handlersA/HandlerMsgTableDisbandAckA";
import { HandlerMsgTableDisbandReqA } from "./handlersA/HandlerMsgTableDisbandReqA";
import { HandlerMsgTableEntryA } from "./handlersA/HandlerMsgTableEntryA";
import { HandlerMsgTableLeaveA } from "./handlersA/HandlerMsgTableLeaveA";
import { HandlerMsgTableManagedA } from "./handlersA/HandlerMsgTableManagedA";
import { HandlerMsgTablePauseA } from "./handlersA/HandlerMsgTablePauseA";
import { HandlerMsgTableReadyA } from "./handlersA/HandlerMsgTableReadyA";
import { HandlerMsgTableScoreA } from "./handlersA/HandlerMsgTableScoreA";
import { HandlerMsgTableUpdateA } from "./handlersA/HandlerMsgTableUpdateA";
import { HandlerMsgUpdateCoordinateA } from "./handlersA/HandlerMsgUpdateCoordinateA";
import { HandResultViewA } from "./HandResultViewA";
import { PlayerA } from "./PlayerA";
import { PlayerInterfaceA } from "./PlayerInterfaceA";
import { ReplayA } from "./ReplayA";
import { PlayerInfo, RoomInterfaceA, roomStatus, TingPai } from "./RoomInterfaceA";
import { RoomViewA } from "./RoomViewA";

type msgHandler = (msgData: ByteBuffer, room: RoomInterfaceA) => Promise<void>;
/**
 * 定义一个接口 关联Game 到room
 */
const msgCodeEnum = protoHH.casino.eMSG_TYPE;
const msgCodeXTHH = protoHH.casino_gdy.eGDY_MSG_TYPE;
export const msgHandlers: { [key: number]: msgHandler } = {
    [msgCodeEnum.MSG_COORDINATE]: HandlerMsgUpdateCoordinateA.onMsg, //玩家进入
    [msgCodeEnum.MSG_TABLE_ENTRY]: HandlerMsgTableEntryA.onMsg, //玩家进入
    [msgCodeEnum.MSG_TABLE_READY]: HandlerMsgTableReadyA.onMsg, //准备
    [msgCodeEnum.MSG_TABLE_LEAVE]: HandlerMsgTableLeaveA.onMsg, //玩家离开
    [msgCodeEnum.MSG_TABLE_PAUSE]: HandlerMsgTablePauseA.onMsg, //等待玩家操作
    [msgCodeEnum.MSG_TABLE_UPDATE]: HandlerMsgTableUpdateA.onMsg, //桌子更新
    [msgCodeEnum.MSG_TABLE_SCORE]: HandlerMsgTableScoreA.onMsg, //桌子结算
    [msgCodeEnum.MSG_TABLE_MANAGED]: HandlerMsgTableManagedA.onMsg, //桌子进入托管
    [msgCodeEnum.MSG_SEARCH_ACK]: HandlerMsgSearchAckA.onMsg, //桌子进入托管

    [msgCodeEnum.MSG_TABLE_DISBAND_ACK]: HandlerMsgTableDisbandAckA.onMsg, //解散
    [msgCodeEnum.MSG_TABLE_DISBAND_REQ]: HandlerMsgTableDisbandReqA.onMsg, //解散
    [msgCodeEnum.MSG_TABLE_DISBAND]: HandlerMsgTableDisbandA.onMsg, //解散

    [msgCodeEnum.MSG_TABLE_CHAT]: HandlerMsgTableChatA.onMsg, //聊天消息
    //晃晃专用
    [msgCodeXTHH.GDY_MSG_SC_STARTPLAY]: HandlerMsgDealA.onMsg, //发牌
    [msgCodeXTHH.GDY_MSG_SC_OP]: HandlerMsgActionOPA.onMsg, //服务器询问玩家操作
    [msgCodeXTHH.GDY_MSG_SC_OUTCARD_ACK]: HandlerActionResultDiscardedA.onMsg, //出牌服务器回复
    [msgCodeXTHH.GDY_MSG_SC_OP_ACK]: HandlerMsgActionOPAckA.onMsg, //操作服务器回复
    [msgCodeXTHH.GDY_MSG_SC_DRAWCARD]: HandlerActionResultDrawA.onMsg, //抽牌
    [msgCodeXTHH.GDY_MSG_SC_ENDCARD]: HandlerActionResultEndCardA.onMsg, //海底
    [msgCodeXTHH.GDY_MSG_SC_SCORE]: HandlerActionScoreA.onMsg //分数改变
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
export class RoomA {
    public readonly myUser: UserInfo;
    public roomInfo: protoHH.casino.Itable;
    public readonly host: RoomHost;
    public state: number;
    public ownerID: string;
    public handStartted: number = 0;
    public laiziID: number;
    public laigenID: number;
    public isDestroy: boolean = false;
    public bankerChairID: number = -1;
    public markup: number;
    public isContinuousBanker: boolean;
    public roomView: RoomViewA;
    public players: { [key: string]: PlayerA } = {};
    public replay: ReplayA;
    public tilesInWall: number;
    public myPlayer: PlayerA;
    public disbandReq: protoHH.casino.packet_table_disband_req;
    public handNum: number;
    public isDisband: boolean = false;
    public readonly roomType: number;
    public mAlgorithm: AlgorithmA;
    public isMySelfDisCard: boolean = false;
    public lastDisCardTile: number = 0; //最后打出的牌 用于吃碰杠胡
    public isGameOver: boolean = false;
    public readonly audioContext: createInnerAudioContextOpts;

    public isPlayAudio: boolean = false;

    public isJoyRoom: boolean = false;
    public nimMsgs: NIMMessage[] = [];
    private chatMsgs: protoHH.casino.packet_table_chat[] = [];
    private scheduleChatMsg: Function = null;
    public constructor(myUser: UserInfo, roomInfo: protoHH.casino.Itable, host: RoomHost, rePlay?: ReplayA) {
        Logger.debug("myUser ---------------------------------------------", myUser);
        this.myUser = myUser;
        this.host = host;
        this.replay = rePlay;
        this.roomInfo = roomInfo;
        this.mAlgorithm = new AlgorithmA();
        // const roomConfigJSON = <{ [key: string]: boolean | number | string }>JSON.parse(roomInfo.config);
        // Logger.debug("roomConfigJSON ---------------------------------------------", roomConfigJSON);
        this.roomType = roomInfo.room_id;
        this.handNum = roomInfo.round;

    }

    public onDestroy(): void {
        // 消耗实例,只在微信上跑这个实例不为空
        if (this.audioContext !== undefined && this.audioContext !== null) {
            this.audioContext.destroy();
            Logger.debug("destroy audioContext");
        }
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

    public async onNimMsg(msg: NIMMessage): Promise<void> {
        Logger.debug("onNimMsg msg:", msg);
        if (msg.type !== "audio") {
            Logger.debug("onNimMsg msg.type:", msg.type);

            return;
        }

        if (this.myPlayer.tilesHand.length < 1) {
            Logger.debug("this.myPlayer.tilesHand.length < 1");

            return;
        }

        this.nimMsgs.push(msg);
        Logger.debug("this.nimMsgs.length:", this.nimMsgs.length);

        await this.playVoicMsg();
        // const fromWho: string = msg.from;
        // const player = this.getPlayerByImID(fromWho);
        // player.onNimMsg(msg);
    }

    public getPlayerByChairID(chairID: number): PlayerA {
        let player = null;
        const keys = Object.keys(this.players);
        for (const playerid of keys) {
            const p = this.players[playerid];
            if (p.chairID === chairID) {
                player = p;
            }
        }
        // Object.keys(this.players).forEach((key: string) => {
        //     const p = this.players[key];
        //     if (p.chairID === chairID) {
        //         player = p;
        //     }
        // });

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

    public getRoomView(): RoomViewA {
        return this.roomView;
    }
    //把tilesInWall显示到房间的剩余牌数中
    public updateTilesInWallUI(): void {
        this.roomView.tilesInWall.text = `${LocalStrings.findString("leftCard")} :${this.tilesInWall}`;
    }

    // 加载房间的view
    public loadRoomView(view: fgui.GComponent): void {
        const roomView = new RoomViewA(this, view);
        this.roomView = roomView;

        if (this.roomInfo.play_total !== null && !this.isReplayMode()) {
            this.handStartted = this.roomInfo.play_total;
        }
        this.showRoomNumber();
    }

    // 创建玩家对象    // 并绑定playerView
    public createPlayerByInfo(playerInfo: protoHH.casino.Itable_player, chairID: number): void {
        const player = new PlayerA(`${playerInfo.id}`, chairID, this);
        player.updateByPlayerInfo(playerInfo, chairID);

        const pChair = this.getPlayerViewChairIDByChairID(chairID);

        const playerView = this.roomView.getPlayerViewByChairID(pChair);
        player.bindView(playerView);

        this.players[player.userID] = player;

        // this.initCards(playerInfo, player);

    }
    // 创建自身的玩家对象    // 并绑定playerView
    public createMyPlayer(playerInfo: protoHH.casino.Itable_player, chairID: number): void {
        const player = new PlayerA(`${playerInfo.id}`, chairID, this);

        player.updateByPlayerInfo(playerInfo, chairID);

        const playerView = this.roomView.playerViews[1];
        player.bindView(playerView);

        this.players[player.userID] = player;

        this.myPlayer = player;
        // Logger.debug("this.myPlayer:", this.myPlayer);
        // this.initCards(playerInfo, player);
    }

    public onReadyButtonClick(): void {

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
        this.roomView.showOrHideTipsOfMe(false);
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

    //播放音效
    public playSound(effectName: string): void {
        if (effectName === undefined || effectName === null) {
            return;
        }
        const soundName = `gameb/${effectName}`;
        SoundMgr.playEffectAudio(soundName);
    }

    public onExitButtonClicked(): void {
        // this.sendMsg(proto.mahjong.MessageCode.OPPlayerLeaveRoom);
    }

    //处理玩家申请解散请求
    public onDissolveClicked(): void {
        // this.sendMsg(proto.mahjong.MessageCode.OPDisbandRequest);
        const req2 = new protoHH.casino.packet_table_disband_req({ player_id: +this.myUser.userID });
        const buf = protoHH.casino.packet_table_disband_req.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    //更新解散处理界面
    public updateDisbandVoteView(
        disbandReq: protoHH.casino.packet_table_disband_req, disbandAck: protoHH.casino.packet_table_disband_ack): void {
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

    public showDisbandVoteForRecconect(disbandPlayerID: number, disbandTime: Long): void {
        const disbandReq = new protoHH.casino.packet_table_disband_req();
        disbandReq.player_id = disbandPlayerID;
        disbandReq.disband_time = disbandTime;
        this.updateDisbandVoteView(disbandReq, null);
    }

    //发送解散回复给服务器
    public sendDisbandAgree(agree: boolean): void {
        const disbandAck = {
            player_id: +this.myUser.userID,
            disband: agree
        };
        const req2 = new protoHH.casino.packet_table_disband_ack(disbandAck);
        const buf = protoHH.casino.packet_table_disband_ack.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_ACK);
    }

    public getHost(): RoomHost {

        return this.host;
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
    }

    public setDiscardAble(isDiscardAble: boolean): void {
        if (!this.isMySelfDisCard) {
            return;
        }
        this.myPlayer.setDiscardAble(isDiscardAble);
    }

    public loadHandResultView(msgHandOver: protoHH.casino.packet_table_score): void {
        const view = this.host.component.addComponent(HandResultViewA);
        view.showView(this, msgHandOver);
    }

    public loadGameOverResultView(msgGameOver: protoHH.casino.packet_table_score): void {
        this.isGameOver = true;

        const view = this.host.component.addComponent(GameOverResultViewA);
        view.showView(this, msgGameOver);

        this.getRoomHost().eventTarget.emit("disband");
    }

    public hideDiscardedTips(): void {
        Object.keys(this.players).forEach((key: string) => {
            const v = this.players[key];
            v.hideDiscardedTips();
        });
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
    public initReplayCardsOfChairId(roundId: number): void {
        if (this.replay !== undefined) {
            const round = this.replay.msgHandRecord.rounds[roundId];
            if (round !== undefined) {
                Object.keys(this.players).forEach((key: string) => {
                    const cards: number[] = [];
                    const p = this.players[key];
                    const score = round.scores[p.chairID];
                    if (score !== undefined) {
                        for (const c of score.initcards) {
                            cards.push(c);
                        }
                    }
                    p.replayTilesHand = cards;
                });
            }
        }
    }
    public getReplayCardsOfChairId(cId: number): number[] {
        if (this.replay !== undefined) {
            // const round = this.replay.msgHandRecord.rounds[roundId];
            // if (round !== undefined) {
            //     const score = round.scores[cId];
            //     if (score !== undefined) {
            //         return score.initcards;
            //     }
            // }
            return this.getPlayerByChairID(cId).replayTilesHand;
        }

        return [];
    }
    public getBankerChairID(): number {
        return this.bankerChairID;
    }
    //往服务器发送action消息
    public sendActionMsg(msgAction: ByteBuffer, opCode: number): void {
        this.host.sendBinary(msgAction, opCode);
    }
    public quit(): void {
        // this.stopBgSound();
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

    public getPlayerByPlayerID(playerID: number): PlayerInterfaceA {

        return this.players[`${playerID}`];
    }
    public getPlayerByImID(imaccid: string): PlayerA {
        const keys = Object.keys(this.players);
        for (const key of keys) {
            const player = this.players[key];
            if (player.playerInfo.imaccid === imaccid) {
                return player;
            }
        }

        return null;
    }
    public getMyPlayer(): PlayerInterfaceA {
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
    public getPlayers(): { [key: string]: PlayerInterfaceA } {
        return this.players;
    }

    public getNextPlayer(chairID: number): PlayerA {
        let nextChairId = chairID + 1;
        if (nextChairId === this.roomInfo.players.length) {
            nextChairId = 0;
        }

        return this.getPlayerByChairID(nextChairId);
    }
    public getBackPlayer(chairID: number): PlayerA {
        let backChairId = chairID - 1;
        if (backChairId === -1) {
            backChairId = this.roomInfo.players.length - 1;
        }

        return this.getPlayerByChairID(backChairId);
    }

    public setRoundMask(): void {
        this.roomView.setRoundMask();
    }
    public showRoomNumber(): void {
        this.roomView.showRoomNumber();
    }
    public onUpdateStatus(state: number): void {
        this.roomView.onUpdateStatus(state);
    }
    public switchBg(index: number): void {
        //
        this.roomView.switchBg(index);
    }

    public showMsg(chatData: protoHH.casino.packet_table_chat): void {
        this.chatMsgs.push(chatData);

        if (this.scheduleChatMsg !== null) {
            return;
        }

        // const p = <Player>this.getPlayerByPlayerID(chatData.player_id);
        // p.onChatMsg(chatData);
        this.scheduleChatMsg = () => {
            Logger.debug("scheduleChatMsg");
            if (this.chatMsgs.length === 0) {
                this.getRoomHost().component.unschedule(this.scheduleChatMsg);
                this.scheduleChatMsg = null;

                return;
            }

            const msg = this.chatMsgs.shift();
            const p = <PlayerA>this.getPlayerByPlayerID(msg.player_id);
            p.onChatMsg(msg);
        };

        this.scheduleChatMsg();

        this.getRoomHost().component.schedule(this.scheduleChatMsg, 3, cc.macro.REPEAT_FOREVER);
    }

    public onSearchPlayerAck(searchAck: protoHH.casino.packet_search_ack): void {
        const p = <PlayerA>this.getPlayerByPlayerID(searchAck.data.id);
        p.showPlayerInfoView(searchAck);
        // this.players[searchAck.data.id].showPlayerInfoView(searchAck);
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
        if (!this.isReplayMode()) {
            let curid = 0;
            for (let i = 0; i < this.roomInfo.players.length; i++) {
                const p = this.roomInfo.players[i];
                if (this.roomInfo.cur_idx === i) {
                    curid = p.id;
                }
                const player = this.getPlayerByChairID(i);
                this.initCards(p, player);
            }
            this.showCards(curid);
        }
    }

    public updateRoom(table: protoHH.casino.Itable): void {
        // Logger.debug("updateRoom : ", table);

        if (table === undefined || table == null) {
            Logger.error("table == undefined || table == null");

            return;
        }
        this.roomInfo = table;

        // 恢复玩家牌局
        this.resetForNewHand();
        this.cleanUI();

        // 清理所有用户
        Object.keys(this.players).forEach((key: string) => {
            const player = this.players[key];
            player.unbindView();
        });
        this.players = {};

        this.createPlayers();

    }

    /**
     * 断线重连恢复用户的操作
     */
    public async restorePlayerOperation(): Promise<void> {
        Logger.debug("restorePlayerOperation");
        this.onUpdateStatus(roomStatus.onPlay);
        //剩牌
        this.tilesInWall = this.roomInfo.cardcount;
        this.updateTilesInWallUI();
        //显示癞子
        this.laiziID = this.roomInfo.laizi;
        this.laigenID = this.roomInfo.fanpai;

        // 处理刚好在小结算的时候恢复牌局
        if (this.laiziID === 0 && this.laigenID === 0 && this.roomInfo.play_total > 0) {
            const replay = this.roomInfo.replay.rounds[this.roomInfo.play_total - 1];
            this.laiziID = replay.laizi;
            this.laigenID = replay.fanpai;
        }

        this.setRoundMask();
        //设置癞子 赖根
        this.mAlgorithm.setMahjongLaiZi(this.laiziID);
        this.mAlgorithm.setMahjongFan(this.laigenID);
        //设置弃杠弃碰
        let myPlayerInfo: protoHH.casino.Itable_player;
        for (const p of this.roomInfo.players) {
            if (`${p.id}` === `${this.myUser.userID}`) {
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
        //显示庄家
        this.bankerChairID = this.roomInfo.lord_id;
        const player = <PlayerA>this.getPlayerByPlayerID(this.bankerChairID);
        this.roomView.playZhuangAni(player.playerView.head.bankerFlag, 0.6);
        //压入自摸不自摸的标志
        this.myPlayer.cancelZiMo = myPlayerInfo.jialaizi === 1;

        const curPlayerInfo = this.roomInfo.players[this.roomInfo.cur_idx];
        if (this.roomInfo.status === protoHH.casino_gdy.eGDY_STATUS.GDY_STATUS_OUTCARD) {
            const lastTile = curPlayerInfo.curcards[curPlayerInfo.curcards.length - 1];
            if (lastTile !== 0) {
                //有抽牌的话 要把牌墙的牌 加1 因为抽牌handler里面会减一
                this.tilesInWall++;
            }
            this.myPlayer.removeTileFromHand(lastTile);
            const m = new protoHH.casino_gdy.packet_sc_drawcard();
            m.time = this.roomInfo.time;
            m.card = lastTile;
            m.player_id = curPlayerInfo.id;

            const reply = protoHH.casino_gdy.packet_sc_drawcard.encode(m);
            const msg = new protoHH.casino.ProxyMessage();
            msg.Ops = protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_SC_DRAWCARD;
            msg.Data = reply;

            // 构造一个类似的消息，恢复用户的操作
            const handler = msgHandlers[protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_SC_DRAWCARD];
            await handler(reply, this);

        } else if (this.roomInfo.status === protoHH.casino_gdy.eGDY_STATUS.GDY_STATUS_OP) {
            //如果到我操作 要显示操作按钮
            const m = new protoHH.casino_gdy.packet_sc_op();
            m.card = this.roomInfo.outcard;
            m.player_id = this.roomInfo.op_id;
            m.target_id = this.roomInfo.target_id;
            m.time = this.roomInfo.time;
            m.table_id = this.roomInfo.id;

            const reply = protoHH.casino_gdy.packet_sc_op.encode(m);

            const msg = new protoHH.casino.ProxyMessage();
            msg.Ops = protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_SC_OP;
            msg.Data = reply;

            // 构造一个类似的消息，恢复用户的操作
            const handler = msgHandlers[protoHH.casino_gdy.eGDY_MSG_TYPE.GDY_MSG_SC_OP];
            await handler(reply, this);
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
    public setLanOfDiscard(isShow: boolean, tile?: number): void {
        Object.keys(this.players).forEach((key: string) => {
            const p = this.players[key];
            p.playerView.setLanOfDiscard(isShow, tile);
        });
    }
    public showOrHideCancelCom(isShow: boolean, str: string = ""): void {
        this.roomView.showOrHideCancelCom(isShow, str);
    }
    public myMahjong_showTingGroup(tile: number): TingPai[] {
        const tingP: TingPai[] = [];
        //开始听牌检查
        const array = this.myPlayer.getAllVMahjongs_delMahjong(tile);

        const checkMahjongs: number[] = [
            11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 23, 24, 25, 26, 27, 28, 29,
            31, 32, 33, 34, 35, 36, 37, 38, 39];
        this.mAlgorithm.pop_mahjong(checkMahjongs, this.laiziID);
        let total = 0;
        const tingMahjong = [];
        for (const checkMahjong of checkMahjongs) {
            if (tingP.length > 8) {
                return tingP;
            }
            const bHuPai = this.mAlgorithm.canHuPai_WithOther(array, checkMahjong, true);
            if (bHuPai.length > 0) {
                //检查牌剩余数量
                total = this.getMahjongLaveNumber(checkMahjong);
                if (total > 0) {
                    tingMahjong.push(checkMahjong);
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

    public updateReadView(table: protoHH.casino.Itable, players?: protoHH.casino.Itable_player[]): void {
        this.roomView.updateReadyView(table, players);
    }

    public showRoomBtnsAndBgs(): void {
        this.roomView.showBtnsAndBgs();
    }

    public enableVoiceBtn(isShow: boolean): void {
        this.roomView.enableVoiceBtn(isShow);
    }

    public onLeaveClicked(): void {
        Dialog.prompt(LocalStrings.findString("gameIsPlaying"));
    }
    public showGamePauseTips(timeStamp: number): void {
        this.roomView.showGamePauseTips(timeStamp);
    }

    public hideGamePauseTips(): void {
        this.roomView.hideGamePauseTips();
    }

    public onBgClick(): void {
        this.hideTingDataView();
        this.myPlayer.playerView.restoreHandsPositionAndClickCount(-1);
    }

    public showOrHideGpsTag(isShow: boolean): void {
        this.roomView.showOrHideGpsTag(isShow);
    }

    public isStartRecord(): boolean {
        return this.roomView.isStartRecord();
    }

    // 当关闭gps后判断是否与服务器的同步，服务器的数据会同步到客户端
    public isGpsSync(): boolean {
        const myPlayer = <PlayerA>this.getMyPlayer();
        if (myPlayer.coordinate.latitude === null && myPlayer.coordinate.longitude === null) {
            return true;
        }

        return false;
    }

    //重连 初始化 牌组
    private initCards(playerInfo: protoHH.casino.Itable_player, player: PlayerA, isNewDiacard: boolean = false): void {
        //先保存癞子 才能排序
        this.laiziID = this.roomInfo.laizi;
        if (playerInfo.curcards.length > 0) {
            player.addHandTiles(playerInfo.curcards);
            player.sortHands(false);
            // player.hand2UI(false);
        }

        if (playerInfo.outcards.length > 0) {
            player.mPiaoCount = 0;
            player.addDiscardedTiles(playerInfo.outcards);
            // player.discarded2UI(isNewDiacard, false);

            // if (!this.mAlgorithm.getFlagPiao()) {
            for (const outcard of playerInfo.outcards) {
                if (outcard === this.roomInfo.laizi) {
                    this.mAlgorithm.setFlagPiao(true);
                    player.mPiaoCount++;
                }
            }
            // }
        }

        if (playerInfo.groups.length > 0) {
            const melds: { [key: string]: protoHH.casino_gdy.packet_sc_op_ack } = {};
            for (const g of playerInfo.groups) {
                const m = new protoHH.casino_gdy.packet_sc_op_ack();
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
        }
        // player.hand2UI(false);
    }
    private showCards(isNewDiacardId: number): void {
        //删掉出牌列表里面 已经被碰 或者 杠的牌  免得重复
        const keys = Object.keys(this.players);
        for (const key of keys) {
            const player = this.players[key];
            const melds = player.tilesMelds;
            for (const meld of melds) {
                const tId = meld.target_id;
                if (tId !== undefined && tId !== null) {
                    const tP = this.getPlayerByPlayerID(tId);
                    if (tP !== undefined && tP !== null) {
                        tP.removeTileFromDiscard(meld.cards[0]);
                    }
                }
            }
        }
        for (const key of keys) {
            const player = this.players[key];
            player.discarded2UI(`${isNewDiacardId}` === key, false);
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

    private async playVoicMsg(): Promise<void> {
        if (this.nimMsgs.length <= 0) {
            Logger.debug("playVoicMsg failed, this.nimMsgs.length <s 0");

            return;
        }

        // 目前只支持微信播放
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug("playVoicMsg failed, cc.sys.platform !== cc.sys.WECHAT_GAME");

            return;
        }

        await this.playAllAudio();
    }

    private async playAllAudio(): Promise<void> {
        if (this.isPlayAudio) {
            Logger.debug("playAllAudio audio is playing");

            return;
        }

        this.isPlayAudio = true;
        while (this.nimMsgs.length > 0) {
            const msg = this.nimMsgs.shift();
            await this.playAudio(msg);
        }
        this.isPlayAudio = false;
    }

    private async playAudio(msg: NIMMessage): Promise<void> {
        if (msg.file.dur <= 0) {
            Logger.error("playAudio msg.file.dur <= 0");

            return;
        }

        if (msg.from === null || msg.from === "") {
            Logger.error("msg.from === null || msg.from === ");

            return;
        }

        const player = this.getPlayerByImID(msg.from);
        if (player === null) {
            Logger.error("player === null");

            return;
        }

        player.showOrHideVoiceImg(true);

        const audioContext = wx.createInnerAudioContext();
        if (player.isMe()) {
            audioContext.src = msg.file.name;
        } else if (msg.file.ext === "mp3") {
            audioContext.src = msg.file.url;
        } else {
            audioContext.src = msg.file.mp3Url;
        }

        audioContext.onPlay(() => {
            Logger.debug("playAudio, onPlay");
        });

        audioContext.onEnded(() => {
            wx.hideToast();
        });

        audioContext.onError((res) => {
            Logger.error("playAudio error:", res);
            Dialog.prompt(LocalStrings.findString("playerVoiceFailed"));
        });

        audioContext.play();

        await this.coWaitSeconds(Math.ceil(msg.file.dur / 1000));

        player.showOrHideVoiceImg(false);
        audioContext.destroy();
    }

}
