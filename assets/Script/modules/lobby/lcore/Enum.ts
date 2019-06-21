/**
 * 专门用来放枚举的脚本
 */
export namespace Enum {
    /**
     * 游戏类型
     */
    export enum GAME_TYPE {
        //大丰麻将
        DAFENG = 1,
        //大丰关张
        GUANGZHANG = 8,
        //湛江麻将
        ZHANJIANG = 21
    }

    //游戏名字
    export const GAME_NAME: { [key: number]: string } = {
        [GAME_TYPE.DAFENG]: "大丰麻将",
        [GAME_TYPE.ZHANJIANG]: "湛江麻将",
        [GAME_TYPE.GUANGZHANG]: "大丰关张"
    };

    /**
     * 渠道配置
     */
    export enum CHANNEL_TYPE {
        /**
         * 微信
         */
        WEIXIN = 104,

        /**
         * 头条
         */
        TOUTIAO = 107
    }
}
