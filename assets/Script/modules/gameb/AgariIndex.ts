import { Logger } from "../lobby/lcore/LCoreExports";

const indexMap: string[] = [
    "11", //万子
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21", //条子
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "31", //筒子
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "41", //东
    "42", //南
    "43", //西
    "44", //北

    "51", //中
    "52", //发
    "53", //白

    "61", //春
    "62", //夏
    "63", //秋
    "64", //冬
    "65", //梅
    "66", //兰
    "67", //竹
    "68"  //菊
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
