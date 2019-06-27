import { Logger } from "../lobby/lcore/LCoreExports";

const indexMap: { [key: number]: string } = {
    [11]: "1", //万子
    [12]: "2",
    [13]: "3",
    [14]: "4",
    [15]: "5",
    [16]: "6",
    [17]: "7",
    [18]: "8",
    [19]: "9",
    [21]: "11", //索子
    [22]: "12",
    [23]: "13",
    [24]: "14",
    [25]: "15",
    [26]: "16",
    [27]: "17",
    [28]: "18",
    [29]: "19",
    [31]: "21", //筒子
    [32]: "22",
    [33]: "23",
    [34]: "24",
    [35]: "25",
    [36]: "26",
    [37]: "27",
    [38]: "28",
    [39]: "29",

    [41]: "31", //东
    [42]: "32", //南
    [43]: "33", //西
    [44]: "34", //北
    [51]: "41", //中
    [52]: "43", //白
    [53]: "42", //发

    [61]: "55", //春
    [62]: "56", //夏
    [63]: "57", //秋
    [64]: "58", //冬
    [65]: "51", //梅
    [66]: "52", //兰
    [67]: "53", //竹
    [68]: "54" //菊
};
/**
 * 牌id 跟 图片名映射
 */
export namespace AgariIndex {
    export const tileId2ArtId = (tileID: number): string => {
        const artId = indexMap[tileID];
        if (artId == null) {
            Logger.debug(`no art id for tile:${tileID}`);
            // throw Error(`no art id for tile:${tileID}`);
        }

        return artId;
    };
}
