
import { NIMMessage } from "../lobby/chanelSdk/nimSdk/NimSDKExports";
import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { ChatData } from "../lobby/views/chat/ChatExports";
import { Algorithm } from "./Algorithm";
import { PlayerInterface } from "./PlayerInterface";
/**
 * 房间状态
 */
export const roomStatus = {
    onPlay: 1,
    onWait: 2
};

/**
 * 听牌详情类
 */
export class TingPai {
    public card: number;
    public fan: number;
    public num: number;
    public constructor(card: number, fan: number, num: number) {
        this.card = card;
        this.fan = fan;
        this.num = num;
    }
}
/**
 * 玩家信息类
 */
export class PlayerInfo {
    public readonly gender: number;
    public readonly headIconURI: string;
    public readonly ip: string;
    public readonly location: string;
    public readonly dfHands: number;
    public readonly diamond: number;
    public readonly charm: number;
    public readonly avatarID: number;
    public readonly state: number;
    public readonly userID: string;
    public readonly nick: string;
    public readonly chairID: number;
    public readonly scoreTotal: number;
    public readonly score: number;
    public readonly imaccid: string;

    public constructor(playerIfo: protoHH.casino.Itable_player, chairID: number) {
        this.gender = playerIfo.sex;
        this.headIconURI = playerIfo.channel_head;
        this.ip = "";
        this.location = "";
        this.dfHands = 0;
        this.diamond = 0;
        this.charm = 0;
        this.avatarID = playerIfo.avatar;
        this.state = playerIfo.status;
        this.userID = playerIfo.id.toString();
        this.chairID = chairID;

        if (playerIfo.channel_nickname !== undefined && playerIfo.channel_nickname !== null && playerIfo.channel_nickname !== "") {
            this.nick = playerIfo.channel_nickname;
        } else {
            this.nick = playerIfo.nickname;
        }
        this.scoreTotal = playerIfo.score_total;
        this.score = playerIfo.score;
        this.imaccid = playerIfo.im_accid;
    }
}

export interface RoomViewInterface {
    unityViewNode: fgui.GComponent;
    stopDiscardCountdown(): void;
    clearWaitingPlayer(): void;
    playAnimation(effectName: string, isWait?: boolean): Promise<void>;
    playZhuangAni(pos: fgui.GObject): void;
    playLaiAni(): void;
    playPiaoEffect(pos: cc.Vec2): Promise<void>;
}

/**
 * room 接口
 */
export interface RoomInterface {
    readonly roomType: number;
    readonly roomInfo: protoHH.casino.Itable;
    readonly roomView: RoomViewInterface;
    readonly handNum: number;
    mAlgorithm: Algorithm;
    isDisband: boolean;
    state: number;
    ownerID: string;
    handStartted: number;
    markup: number;
    bankerChairID: number;
    isContinuousBanker: boolean;
    tilesInWall: number;
    laiziID: number;
    laigenID: number;
    isDestroy: boolean;
    isMySelfDisCard: boolean;
    quit: Function;
    lastDisCardTile: number;
    currentPlayMsg: NIMMessage;
    // 获取RoomHost
    getRoomHost(): RoomHost;
    isMe(userID: string): boolean;
    isReplayMode(): boolean;
    sendActionMsg(msgAction: ByteBuffer, opCode: number): void;
    getBankerChairID(): number;
    setArrowByParent(d: fgui.GComponent): void;
    getPlayerViewChairIDByChairID(chairID: number): number;

    showTingDataView(tingP: TingPai[]): void;
    hideTingDataView(): void;
    onReadyButtonClick(): void;
    onInviteButtonClick(): void;
    resetForNewHand(): void;
    isListensObjVisible(): boolean;

    getPlayerByChairID(chairID: number): PlayerInterface;
    getPlayerByUserID(userID: string): PlayerInterface;
    hideDiscardedTips(): void;
    cleanUI(): void;
    updateTilesInWallUI(): void;
    setWaitingPlayer(chairID: number, time?: number): void;
    getMyPlayer(): PlayerInterface;
    getPlayers(): { [key: string]: PlayerInterface };
    setRoundMask(): void;
    updateDisbandVoteView(
        disbandReq: protoHH.casino.packet_table_disband_req,
        disbandAck: protoHH.casino.packet_table_disband_ack): void; showRoomNumber(): void;
    removePlayer(chairID: string): void;
    createMyPlayer(playerInfo: protoHH.casino.Itable_player, chairID: number): void;
    createPlayerByInfo(playerInfo: protoHH.casino.Itable_player, chairID: number): void;
    showOrHideReadyButton(isShow: boolean): void;
    onUpdateStatus(state: number): void;

    loadHandResultView(msgHandOver: protoHH.casino.packet_table_score): void;
    loadGameOverResultView(msgGameOver: protoHH.casino.packet_table_score): void;

    switchBg(index: number): void;

    onDissolveClicked(): void;

    onExitButtonClicked(): void;

    coWaitSeconds(seconds: number): Promise<void>;

    sendDisbandAgree(agree: boolean): void;

    getPlayerInfoByChairID(chairID: number): PlayerInfo;

    getMyPlayerInfo(): PlayerInfo;

    onReturnLobbyBtnClick(): void;
    showMsg(chatData: ChatData): void;
    setDiscardAble(isDiscardAble: boolean): void;
    myMahjong_showTingGroup(tile: number): TingPai[];
    showOrHideCancelCom(isShow: boolean, str?: string): void;
    updateReadView(table: protoHH.casino.Itable, players?: protoHH.casino.Itable_player[]): void;
    setLanOfDiscard(isShow: boolean, tile?: number): void;
    showRoomBtnsAndBgs(): void;
    enableVoiceBtn(isShow: boolean): void;
    getReplayCardsOfChairId(roundId: number, cId: number): number[];

    showGamePauseTips(timeStamp: number): void;
    hideGamePauseTips(): void;
    getNextPlayer(chairID: number): PlayerInterface;
    getBackPlayer(chairID: number): PlayerInterface;
}
