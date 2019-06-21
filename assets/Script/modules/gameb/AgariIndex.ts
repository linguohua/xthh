import { Logger } from "../lobby/lcore/LCoreExports";

const indexMap: string[] = [
    "1", //万子
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "21", //筒子
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "11", //索子
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "31", //东
    "32", //南
    "33", //西
    "34", //北
    "43", //白
    "42", //发
    "41", //中
    "51", //梅
    "52", //兰
    "53", //竹
    "54",
    //菊
    "55", //春
    "56", //夏
    "57", //秋
    "58" //冬
];

/**
 * 牌id 跟 图片名映射
 */
export namespace AgariIndex {
    export const tileId2ArtId = (tileID: number): string => {
        const artId = indexMap[tileID];
        if (artId == null) {
            Logger.debug(`no art id for tile:${tileID}`);
            throw Error(`no art id for tile:${tileID}`);
        }

        return artId;
    };
}
