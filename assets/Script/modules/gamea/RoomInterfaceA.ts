
import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { AlgorithmA } from "./AlgorithmA";
import { PlayerInterfaceA } from "./PlayerInterfaceA";
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
    public readonly scoreTotal: number = 0;
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
        if (playerIfo.score_total !== undefined && playerIfo.score_total !== null) {
            this.scoreTotal = playerIfo.score_total;
        }
        this.score = playerIfo.score;
        this.imaccid = playerIfo.im_accid;
    }
}

export interface RoomViewInterface {
    unityViewNode: fgui.GComponent;
    stopDiscardCountdown(): void;
    clearWaitingPlayer(): void;
    playAnimation(effectName: string, isWait?: boolean): Promise<void>;
    playZhuangAni(pos: fgui.GObject, time: number): void;
    playLaiAni(): void;
    playPiaoEffect(pos: cc.Vec2): Promise<void>;

    showOrHideReadyView(isShow: boolean): void;
    showOrHideTipsOfMe(isShow: boolean): void;
    showCountDownIfReadViewShow(): boolean;
    showGpsView(): void;
}

/**
 * room 接口
 */
export interface RoomInterfaceA {
    readonly roomType: number;
    readonly roomInfo: protoHH.casino.Itable;
    readonly roomView: RoomViewInterface;
    readonly handNum: number;
    mAlgorithm: AlgorithmA;
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
    isPlayAudio: boolean;

    isJoyRoom: boolean;
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
    resetForNewHand(): void;
    isListensObjVisible(): boolean;

    getPlayerByChairID(chairID: number): PlayerInterfaceA;
    getPlayerByPlayerID(playerID: number): PlayerInterfaceA;
    hideDiscardedTips(): void;
    cleanUI(): void;
    updateTilesInWallUI(): void;
    setWaitingPlayer(chairID: number, time?: number): void;
    getMyPlayer(): PlayerInterfaceA;
    getPlayers(): { [key: string]: PlayerInterfaceA };
    setRoundMask(): void;
    updateDisbandVoteView(
        disbandReq: protoHH.casino.packet_table_disband_req,
        disbandAck: protoHH.casino.packet_table_disband_ack): void;
    showRoomNumber(): void;
    removePlayer(chairID: string): void;
    playSound(effectName: string): void;
    createMyPlayer(playerInfo: protoHH.casino.Itable_player, chairID: number): void;
    createPlayerByInfo(playerInfo: protoHH.casino.Itable_player, chairID: number): void;

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

    showMsg(chatData: protoHH.casino.packet_table_chat): void;
    setDiscardAble(isDiscardAble: boolean): void;
    myMahjong_showTingGroup(tile: number): TingPai[];
    showOrHideCancelCom(isShow: boolean, str?: string): void;
    updateReadView(table: protoHH.casino.Itable, players?: protoHH.casino.Itable_player[]): void;
    setLanOfDiscard(isShow: boolean, tile?: number): void;
    showRoomBtnsAndBgs(): void;
    enableVoiceBtn(isShow: boolean): void;
    onLeaveClicked(): void;
    getReplayCardsOfChairId(cId: number): number[];
    initReplayCardsOfChairId(roundId: number): void;
    showGamePauseTips(timeStamp: number): void;
    hideGamePauseTips(): void;
    getNextPlayer(chairID: number): PlayerInterfaceA;
    getBackPlayer(chairID: number): PlayerInterfaceA;

    onReadyButtonClick(): void;
    onSearchPlayerAck(searchAck: protoHH.casino.packet_search_ack): void;
}
