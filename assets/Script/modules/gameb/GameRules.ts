
import { Enum, Logger } from "../lobby/lcore/LCoreExports";
import { proto } from "./proto/protoGame";

export enum RoomId {
    XTHH = 2100, //仙桃晃晃
    SRLM = 2103, //三人两门
    LRLM = 2112 //两人两门
}

// 大丰麻将proto
const miniWinTypeDF = proto.dfmahjong.MiniWinType;
const greatWinTypeDF = proto.dfmahjong.GreatWinType;
// 湛江麻将proto
const greatWinTypeZJ = proto.zjmahjong.GreatWinType;

//大丰小胡
const DF_MINI_WIN_TYPE: { [key: number]: string } = {
    [miniWinTypeDF.enumMiniWinType_Continuous_Banker]: "连庄",
    [miniWinTypeDF.enumMiniWinType_NoFlowers]: "无花10花",
    [miniWinTypeDF.enumMiniWinType_Kong2Discard]: "杠冲",
    [miniWinTypeDF.enumMiniWinType_Kong2SelfDraw]: "杠开",
    [miniWinTypeDF.enumMiniWinType_SecondFrontClear]: "小门清"
};

//湛江大胡
const ZJ_GREAT_WIN_TYPE: { [key: number]: string } = {
    [greatWinTypeZJ.PureSame]: "清一色",
    [greatWinTypeZJ.SevenPair]: "小七对",
    [greatWinTypeZJ.GreatSevenPair]: "大七对",
    [greatWinTypeZJ.Thirteen]: "十三幺",
    [greatWinTypeZJ.RobKong]: "抢杠胡",
    [greatWinTypeZJ.Heaven]: "天胡",
    [greatWinTypeZJ.AfterConcealedKong]: "自杠胡",
    [greatWinTypeZJ.AfterExposedKong]: "放杠胡",
    [greatWinTypeZJ.FinalDraw]: "海底捞",
    [greatWinTypeZJ.PongPong]: "碰碰胡",
    [greatWinTypeZJ.AllWind]: "全风子",
    [greatWinTypeZJ.AfterKong]: "杠爆"
};

//大丰大胡
const DF_GREAT_WIN_TYPE: { [key: number]: string } = {
    [greatWinTypeDF.enumGreatWinType_ChowPongKong]: "独钓",
    [greatWinTypeDF.enumGreatWinType_FinalDraw]: "海底捞月",
    [greatWinTypeDF.enumGreatWinType_PongKong]: "碰碰胡",
    [greatWinTypeDF.enumGreatWinType_PureSame]: "清一色",
    [greatWinTypeDF.enumGreatWinType_MixedSame]: "混一色",
    [greatWinTypeDF.enumGreatWinType_ClearFront]: "大门清",
    [greatWinTypeDF.enumGreatWinType_SevenPair]: "七对",
    [greatWinTypeDF.enumGreatWinType_GreatSevenPair]: "豪华大七对",
    [greatWinTypeDF.enumGreatWinType_Heaven]: "天胡",
    [greatWinTypeDF.enumGreatWinType_AfterConcealedKong]: "暗杠胡",
    [greatWinTypeDF.enumGreatWinType_AfterExposedKong]: "明杠胡",
    [greatWinTypeDF.enumGreatWinType_Richi]: "起手报听胡牌",
    [greatWinTypeDF.enumGreatWinType_PureSameWithFlowerNoMeld]: "清一色",
    [greatWinTypeDF.enumGreatWinType_PureSameWithMeld]: "清一色",
    [greatWinTypeDF.enumGreatWinType_MixSameWithFlowerNoMeld]: "混一色",
    [greatWinTypeDF.enumGreatWinType_MixSameWithMeld]: "混一色",
    [greatWinTypeDF.enumGreatWinType_PongKongWithFlowerNoMeld]: "碰碰胡",
    [greatWinTypeDF.enumGreatWinType_RobKong]: "明杠冲",
    [greatWinTypeDF.enumGreatWinType_OpponentsRichi]: "报听"
};

//游戏小胡类型
const GAME_MINI_WIN_TYPE: { [key: number]: { [key: number]: string } } = {
    [Enum.GAME_TYPE.DAFENG]: DF_MINI_WIN_TYPE
};
//游戏大胡类型
const GAME_GREAT_WIN_TYPE: { [key: number]: { [key: number]: string } } = {
    [Enum.GAME_TYPE.DAFENG]: DF_GREAT_WIN_TYPE,
    [Enum.GAME_TYPE.ZHANJIANG]: ZJ_GREAT_WIN_TYPE
};

//specialScore 得分类型
const SPECIAL_SCORE: { [key: number]: string } = {
    [Enum.GAME_TYPE.DAFENG]: "墩子分+",
    [Enum.GAME_TYPE.ZHANJIANG]: "中马数"
};

/**
 *  游戏差异类
 */
export namespace GameRules {
    //是否有花牌
    export const haveFlower = (gameType: number): boolean => {
        return gameType === Enum.GAME_TYPE.DAFENG;
    };
}
