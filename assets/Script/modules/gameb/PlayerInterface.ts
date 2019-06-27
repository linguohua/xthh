import { proto } from "../lobby/protoHH/protoHH";

/**
 * 手牌辅助类
 */
export class ClickCtrl {
    public isDiscardable: boolean;
    public tileID: number;
    public h: fgui.GComponent;
    // public clickCount: number;
    public isNormalState: boolean;
    public t: fgui.GObject;
    public isGray: boolean;
    public readyHandList: number[];
}
export enum ButtonDef {
    Chow = "Effect_zi_ts_chi",
    Pong = "Effect_zi_ts_peng",
    Kong = "Effect_zi_ts_gang",
    Ting = "Effect_zi_ts_ting",
    Skip = "Effect_zi_ts_guo",
    Hu = "Effect_zi_ts_hu",
    Zhua = "Effect_zi_ts_zhua"
}
export enum TypeOfOP {
    Chow = 0,
    Pong = 1, //碰
    Kong = 2, //杠
    Hu = 3, //胡
    ZiMo = 4, //自摸
    CHAOTIAN = 5,
    BUZHUOCHONG = 6, //不捉铳
    QIANGXIAO = 7
}
/**
 * player 接口
 */
export interface PlayerInterface {
    readonly chairID: number;
    readyHandList: number[];
    waitSkip: boolean;
    tilesHand: number[];
    tilesFlower: number[];
    tilesDiscarded: number[];
    melds: proto.casino_xtsj.packet_sc_op_ack[];
    isRichi: boolean;
    waitDiscardReAction: boolean;
    onChowBtnClick: Function;
    onKongBtnClick: Function;
    onSkipBtnClick: Function;
    onWinBtnClick: Function;
    onPongBtnClick: Function;
    onReadyHandBtnClick: Function;
    onFinalDrawBtnClick: Function;
    onPlayerInfoClick: Function;
    isMe(): boolean;
    onPlayerDiscardTile(tileID: number): void;

}
