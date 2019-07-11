
import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { ChatData } from "../lobby/views/chat/ChatExports";
import { Algorithm } from "./Algorithm";
import { PlayerInterface } from "./PlayerInterface";
import { proto } from "./proto/protoGame";
/**
 * 房间状态
 */
export const room_status = {
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

    public constructor(playerIfo: protoHH.casino.Itable_player, chairID: number) {
        this.gender = playerIfo.sex;
        this.headIconURI = "";
        this.ip = "";
        this.location = "";
        this.dfHands = 0;
        this.diamond = 0;
        this.charm = 0;
        this.avatarID = playerIfo.avatar;
        this.state = playerIfo.status;
        this.userID = playerIfo.id.toString();
        this.chairID = chairID;
        this.nick = playerIfo.nickname;
    }
}

export interface RoomViewInterface {
    stopDiscardCountdown(): void;
    clearWaitingPlayer(): void;
    gameEndAnimation(num: number): Promise<void>;
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
    scoreRecords: proto.mahjong.IMsgRoomHandScoreRecord[];
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
    setBankerFlag(): void;
    updateDisbandVoteView(disbandReq: protoHH.casino.packet_table_disband_req, disbandAck: protoHH.casino.packet_table_disband_ack): void;
    showDonate(msgDonate: proto.mahjong.MsgDonate): void;
    showRoomNumber(): void;
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
    sendDonate(donateId: number, toChairID: number): void;

    onReturnLobbyBtnClick(): void;
    showMsg(chatData: ChatData): void;
    setDiscardAble(isDiscardAble: boolean): void;
    myMahjong_showTingGroup(tile: number): TingPai[];
}
