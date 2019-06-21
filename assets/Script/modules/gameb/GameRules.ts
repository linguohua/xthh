
import { Enum, Logger } from "../lobby/lcore/LCoreExports";
import { proto } from "./proto/protoGame";

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
//isContinuousBanker 得分类型
const IS_CONTINUOUS_BANKER: { [key: number]: string } = {
    [Enum.GAME_TYPE.DAFENG]: "连庄x"
};
//fakeWinScore 得分类型
const FAKE_WIN_SCORE: { [key: number]: string } = {
    [Enum.GAME_TYPE.DAFENG]: "包牌",
    [Enum.GAME_TYPE.ZHANJIANG]: "杠分"
};
//fakeList 得分类型
const FAKE_LIST: { [key: number]: string } = {
    [Enum.GAME_TYPE.DAFENG]: "报听"
};
//fakeList 是否显示出来
const FAKE_LIST_BOOLEAN: { [key: number]: boolean } = {
    [Enum.GAME_TYPE.ZHANJIANG]: true
};
//大胡附加得分 trimGreatWinPoints
const TRIM_GREAT_WIN_POINTS: { [key: number]: string } = {
    [Enum.GAME_TYPE.DAFENG]: "辣子数 +"
};
//大胡附加得分 baseWinScore
const BASE_WIN_SCORE: { [key: number]: string } = {
    [Enum.GAME_TYPE.DAFENG]: "基本分"
};

/**
 *  游戏差异类
 */
export namespace GameRules {
    //是否要把FakeList 显示出来 （湛江麻将的马牌就需要显示）
    export const haveFakeListOfTitles = (gameType: number): boolean => {
        const boo = FAKE_LIST_BOOLEAN[gameType];
        if (boo !== undefined) {
            return boo;
        }

        return false;
    };
    //获取fakeList字符串
    export const getFakeListStrs = (gameType: number, playerScores: proto.mahjong.IMsgPlayerScore): string => {
        if (playerScores.fakeList !== undefined && playerScores.fakeList.length > 0) {
            const str = FAKE_LIST[gameType];
            if (str !== undefined) {
                return str;
            }
        }

        return "";
    };
    //获取大胡类型字符串
    export const getGreatWinStrs = (gameType: number, greatWin: proto.mahjong.IMsgPlayerScoreGreatWin): string => {
        if (greatWin === undefined || greatWin === null) {
            return "";
        }
        let textScore = "";
        const gt = greatWin.greatWinType;
        if (gt === undefined || gt === null) {
            return textScore;
        }
        const wType = GAME_GREAT_WIN_TYPE[gameType];
        for (let i = 1; i <= 262144; i *= 2) {
            if ((gt & i) !== 0) {
                const str = wType[i];
                if (str !== undefined) {
                    textScore = `${textScore}${str} `;
                } else {
                    Logger.error("not find wType : ", i);
                }
            }
        }

        return textScore;
    };

    //获取小胡类型字符串
    export const getMiniWinStrs = (gameType: number, miniWin: proto.mahjong.IMsgPlayerScoreMiniWin): string => {
        if (miniWin === undefined || miniWin === null) {
            return "";
        }
        const gt = miniWin.miniWinType;
        if (gt === undefined || gt === null || gt === 0) {
            return "小胡";
        }
        let textScore = "";
        const wType = GAME_MINI_WIN_TYPE[gameType];
        for (let i = 1; i <= 32; i *= 2) {
            if ((gt & i) !== 0) {
                const str = wType[i];
                if (str !== undefined) {
                    textScore = `${textScore}${str} `;
                } else {
                    Logger.error("not find wType : ", i);
                }
            }
        }
        //大丰
        if (miniWin.miniMultiple !== null && miniWin.miniMultiple > 0) {
            textScore = `${textScore}倍数${miniWin.miniMultiple / 10}  `;
        }

        return textScore;
    };

    //获取得分类型String
    export const getScoreStrs = (gameType: number, playerScores: proto.mahjong.IMsgPlayerScore): string => {
        let textScore = "";
        if (playerScores.specialScore !== undefined && playerScores.specialScore > 0) {
            const str = SPECIAL_SCORE[gameType];
            if (str !== undefined) {
                textScore = `${str}${playerScores.specialScore} `;
            }
        }
        if (playerScores.fakeWinScore !== undefined && playerScores.fakeWinScore !== 0) {
            const str = FAKE_WIN_SCORE[gameType];
            if (str !== undefined) {
                textScore = `${textScore}${str}${playerScores.fakeWinScore}  `;
            }
        }
        if (playerScores.isContinuousBanker !== undefined && playerScores.isContinuousBanker) {
            //TODO 这里还需要整理一下
            const str = IS_CONTINUOUS_BANKER[gameType];
            if (str !== undefined) {
                textScore = `${textScore}${str}${playerScores.continuousBankerMultiple / 10}  `;
            }
        }

        return textScore;
    };
    //获取大胡附加得分类型String
    export const getGreatWinScoreStrs = (gameType: number, greatWin: proto.mahjong.IMsgPlayerScoreGreatWin): string => {
        let textScore = "";
        if (greatWin.trimGreatWinPoints !== undefined && greatWin.trimGreatWinPoints > 0) {
            const str = TRIM_GREAT_WIN_POINTS[gameType];
            if (str !== undefined) {
                textScore = `${str}${greatWin.trimGreatWinPoints / 10}  `;
            }
        }
        if (greatWin.baseWinScore !== undefined && greatWin.baseWinScore > 0) {
            const str = BASE_WIN_SCORE[gameType];
            if (str !== undefined) {
                textScore = `${textScore}${str}${greatWin.baseWinScore}  `;
            }
        }

        return textScore;
    };
    //是否有花牌
    export const haveFlower = (gameType: number): boolean => {
        return gameType === Enum.GAME_TYPE.DAFENG;
    };
    //是否有家家庄
    export const haveJiaJiaZhuang = (gameType: number): boolean => {
        return gameType === Enum.GAME_TYPE.DAFENG;
    };
    //是否有风圈
    export const haveRoundMask = (gameType: number): boolean => {
        return gameType === Enum.GAME_TYPE.DAFENG;
    };

    //获取游戏名字
    export const gameName = (gameType: number): string => {
        return Enum.GAME_NAME[gameType];
    };
}
