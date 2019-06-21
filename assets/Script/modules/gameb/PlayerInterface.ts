import { proto } from "./proto/protoGame";

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
/**
 * player 接口
 */
export interface PlayerInterface {
    readyHandList: number[];
    waitSkip: boolean;
    tilesHand: number[];
    tilesFlower: number[];
    tilesDiscarded: number[];
    melds: proto.mahjong.IMsgMeldTile[];
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
