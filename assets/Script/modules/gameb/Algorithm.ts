/* tslint:disable */
// 先把tslint关闭，等待完全修改好之后再打开
/**
 * 客户端用的规则
 */
const DEF_XTSJ_MJ_MAX = 72;          // 牌总数
const DEF_XTSJ_MJ_NUM_MAX = 9;           // 基本牌最大数

// DEF_XTSJ_MJ_WAN        = 1           // 万
const DEF_XTSJ_MJ_TIAO = 2;           // 条
const DEF_XTSJ_MJ_TONG = 3;           // 筒

const DEF_XTSJ_TYPE_TOTAL = 3;           // 牌类型总数

const DEF_XTSJ_MJ_MIN = 2;           // 手上牌剩余最少数量

const DEF_XTSJ_NAIZI_MAX = 4;           // 最大赖子数量
const DEF_XTSJ_NAIZI_ERR = 99;          // 需要赖子数量的错误

const DEF_XTSJ_PENG = 1;
const DEF_XTSJ_GANG = 2;
const DEF_XTSJ_HU = 3;
const DEF_XTSJ_ZIMO = 4;
const DEF_XTSJ_CHAOTIAN = 5;
const DEF_XTSJ_BUZHUOCHONG = 6;           // 不捉铳
const DEF_XTSJ_QIANGXIAO = 7;

export class Algorithm {
    private m_sMahjongs: [] = []; // 麻将牌组(这里只有万、条、筒)
    private m_nForwardIndex: number = 0; // 顺向取牌索引
    private m_nReverseIndex: number = 0; // 逆向取牌索引
    private m_nMahjongLaiZi: number = 0; // 赖子牌
    private m_nMahjongFan: number = 0; // 翻牌(只有三张)
    private m_nMahjongTotal: number = DEF_XTSJ_MJ_MAX; // 自己记录牌总数
    private m_bFlagPiao: boolean = false; // 是否有人飘过赖子

}
