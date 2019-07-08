import { proto } from "../lobby/protoHH/protoHH";
import { Logger } from "../lobby/lcore/Logger";

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
const DEF_WITH_CARDS: number[] = [];

export class Algorithm {
    private m_sMahjongs: number[] = []; // 麻将牌组(这里只有万、条、筒)
    private m_nForwardIndex: number = 0; // 顺向取牌索引
    private m_nReverseIndex: number = 0; // 逆向取牌索引
    private m_nMahjongLaiZi: number = 0; // 赖子牌
    private m_nMahjongFan: number = 0; // 翻牌(只有三张)
    private m_nMahjongTotal: number = DEF_XTSJ_MJ_MAX; // 自己记录牌总数
    private m_bFlagPiao: boolean = false; // 是否有人飘过赖子

    public constructor() {
        this.init();
    }

    //初始化
    private init(): void {
        //牌数值定义
        let index = 0
        this.m_sMahjongs = [];
        for (let i = 0; i < DEF_XTSJ_MJ_NUM_MAX; i++) {
            for (let j = 0; j < 4; j++) {
                this.m_sMahjongs[index] = DEF_XTSJ_MJ_TONG * 10 + i;
                this.m_sMahjongs[index + 1] = DEF_XTSJ_MJ_TIAO * 10 + i;
                //this.m_sMahjongs[index + 2] = DEF_XTSJ_MJ_WAN * 10 + i
                index = index + 3;
            }
        }
    }
    //释放
    private release(): void {
    }
    //随机赖子牌
    public randomLaiZi(): void {
        const random_num = Math.floor(Math.random() * DEF_XTSJ_MJ_MAX - 1);
        // 先随机翻牌
        const fan = this.m_sMahjongs[random_num];
        this.setMahjongFan(fan);
        // 赖子是翻牌的下一张，但是翻牌如果是9那么赖子就是1
        let laizi = fan + 1;
        if (laizi % 10 === 0) {
            laizi = laizi - 10 + 1;
        }
        this.setMahjongLaiZi(laizi);
        // 从牌库中删除一张翻牌
        const count = (this.m_sMahjongs).length - 1;
        const frist = this.m_sMahjongs[0];
        this.m_sMahjongs[0] = fan;
        for (let i = 1; i < count; i++) {
            if (this.m_sMahjongs[i] === fan) {
                this.m_sMahjongs[i] = frist;
                this.m_nForwardIndex = this.m_nForwardIndex + 1;
                break;
            }
        }
    }

    //随机排序
    public randomSort(): void {
        this.m_nForwardIndex = 0;
        this.m_nReverseIndex = DEF_XTSJ_MJ_MAX - 1;
        // 判断是否用配置牌
        let bWithCards = false;
        if (DEF_WITH_CARDS.length > 0) {
            bWithCards = true;
        }
        let index = 0;
        let random_num = 0;
        for (let i = 0; i < DEF_XTSJ_MJ_MAX; i++) {
            //假如不适用配置牌那么随机调换牌顺序
            if (bWithCards) {
                this.m_sMahjongs[i] = DEF_WITH_CARDS[i + 1];
            } else {
                index = this.m_sMahjongs[i];
                random_num = Math.floor(Math.random() * DEF_XTSJ_MJ_MAX - 1);
                this.m_sMahjongs[i] = this.m_sMahjongs[random_num];
                this.m_sMahjongs[random_num] = index;
            }
        }
        this.randomLaiZi();
        this.setFlagPiao(false);
    }

    //随机打乱牌组顺序
    public randomMahjongs(mahjongs: number[]): void {
        let mahjong = 0;
        const size = mahjongs.length;
        let random_idx = 0;

        for (let i = 0; i < size; i++) {
            mahjong = mahjongs[i];
            random_idx = Math.floor(Math.random() * size);
            mahjongs[i] = mahjongs[random_idx];
            mahjongs[random_idx] = mahjong;
        }
    }

    //设置/获取赖子牌
    public setMahjongLaiZi(laizi: number): void {
        this.m_nMahjongLaiZi = laizi;
    }
    public getMahjongLaiZi(): number {
        return this.m_nMahjongLaiZi;
    }

    //设置赖根
    public setMahjongFan(fan: number): void {
        this.m_nMahjongFan = fan;
    }
    public getMahjongFan(): number {
        return this.m_nMahjongFan;
    }
    //TODO 不知道干嘛 先写上
    public setFlagPiao(piao: boolean): void {
        this.m_bFlagPiao = piao;
    }
    public getFlagPiao(): boolean {
        return this.m_bFlagPiao;
    }
    /**
     * 获取牌根据索引
     * @param forward  是否顺序(否就是逆向获取)
     * 返回: 0失败（没有牌)
     */
    public getMahjong(forward: boolean = true): number {
        let index = 0;
        if (forward) {
            if (this.m_nForwardIndex > this.m_nReverseIndex) {
                return 0;
            }
            index = this.m_nForwardIndex;
            this.m_nForwardIndex = this.m_nForwardIndex + 1;
            return this.m_sMahjongs[index];
        } else {
            if (this.m_nReverseIndex < this.m_nForwardIndex) {
                return 0;
            }
            index = this.m_nReverseIndex;
            this.m_nReverseIndex = this.m_nReverseIndex - 1;
            return this.m_sMahjongs[index];
        }
    }
    //获取麻将剩余总数
    public getMahjongSize(): number {
        let size = this.m_nReverseIndex - this.m_nForwardIndex + 1;
        if (size < 0) {
            return 0;
        }
        return size;
    }
    /**
     * 获取麻将牌面数值
     * @param mahjong 卡牌原始数值
     * 返回: 类型(参考第26～28行定义), 数值(1~9)
     */
    public getMahjongNumber(mahjong: number): number {
        return Math.floor(mahjong * 0.1), mahjong % 10;
    }

    //设置／获取／减少当前麻将牌总数
    public mahjongTotal_set(total: number = DEF_XTSJ_MJ_MAX): void {
        this.m_nMahjongTotal = total;
    }
    public mahjongTotal_get(): number {
        return this.m_nMahjongTotal;
    }
    public mahjongTotal_lower(num: number = 1): number {
        this.m_nMahjongTotal = this.m_nMahjongTotal - num;
        if (this.m_nMahjongTotal < 0) {
            this.m_nMahjongTotal = 0;
        }

        return this.m_nMahjongTotal;
    }

    //从小到大卡牌排序
    public mahjong_xtsj_comps_stb(a: Mahjong, b: Mahjong): number {
        return a.mahjong - b.mahjong;
    }
    //从大到小卡牌排序
    public mahjong_xtsj_comps_bts(a: Mahjong, b: Mahjong): number {
        return -(a.mahjong - b.mahjong);
    }
    //从小到大数值排序
    public mahjong_sort_stb(a: number, b: number): number {
        return a - b;
    }
    //从大到小数值排序
    public mahjong_sort_bts(a: number, b: number): number {
        return b - a;
    }

    //麻将组由小到大排列
    public defMahjongSort_stb(mahjongs: number[]): void {
        mahjongs.sort(this.mahjong_sort_stb);
    }
    //麻将组由大到小排列
    public defMahjongSort_bts(mahjongs: number[]): void {
        mahjongs.sort(this.mahjong_sort_bts);
    }

    //牌排列从小到大
    public mahjongSort_stb(mahjongs: Mahjong[]): void {
        mahjongs.sort(this.mahjong_xtsj_comps_stb);
    }

    //牌排列从大到小
    public mahjongSort_bts(mahjongs: Mahjong[]): void {
        mahjongs.sort(this.mahjong_xtsj_comps_bts);
    }

    /**
     * 拆分普通牌和赖子牌
     * @param mahjongs 需要拆分的牌组( mahjong, index)
     * 返回: 普通牌组，赖子牌组
     */
    public getArray_Pai_Lai(mahjongs: number[]): ArrayClass_a {
        const array = new ArrayClass_a();
        array.sVecPai = [];
        array.sVecLai = [];

        const size = mahjongs.length;
        if (size == 0) {
            return array;
        }

        const laizi = this.getMahjongLaiZi()

        for (let i = 0; i < size; i++) {
            if (mahjongs[i] !== laizi) {
                array.sVecPai.push(mahjongs[i]);
            } else {
                array.sVecLai.push(laizi);
            }
        }
        return array;
    }

    //TODO 这个后面要修改  不知道类型 无法还原
    public getArray_Pai_Lai_ex(mahjongs: Mahjong[]): ArrayClass_a {
        const array = new ArrayClass_a();
        array.sVecPai = [];
        array.sVecLai = [];

        const size = mahjongs.length;
        if (size == 0) {
            return array;
        }

        const laizi = this.getMahjongLaiZi()

        for (let i = 0; i < size; i++) {
            if (mahjongs[i].mahjong !== laizi) {
                array.sVecPai.push(mahjongs[i].mahjong);
            } else {
                array.sVecLai.push(laizi);
            }
        }
        return array;
    }
    public push_mahjong(array: number[], value: number): boolean {
        if (array !== undefined && value !== undefined) {
            array.push(value);
            return true;
        }
        return false;
    }
    //TODO 这个后面要修改  不知道类型 无法还原
    public getArrayDef_Pai_Lai(mahjongs: Mahjong[]): ArrayClass_a {
        const array = new ArrayClass_a();
        array.sVecPai = [];
        array.sVecLai = [];

        const size = mahjongs.length;
        if (size == 0) {
            return array;
        }

        const laizi = this.getMahjongLaiZi()

        for (let i = 0; i < size; i++) {
            if (mahjongs[i].mahjong !== laizi) {
                array.sVecPai.push(mahjongs[i].mahjong);
            } else {
                array.sVecLai.push(laizi);
            }
        }
        return array;
    }
    /**
     *  压入数组到数组最后
     * @param sArray 最后返回的数组
     * @param sVector 用于挑选的数组
     * @param nBegin 开始位置
     * @param nEnd 结束位置
     */
    public push_back(sArray: number[], sVector: number[], nBegin: number, nEnd: number): void {
        if (sVector.length < nEnd) {
            return;
        }
        for (let i = nBegin - 1; i < nEnd; i++) {
            sArray.push(sVector[i]);
        }
    }
    /**
     * 删除数组从数组最后开始
     * @param sArray 最后返回的数组
     * @param count 删除数量
     */
    public pop_back(sArray: number[], count: number): void {
        const size = sArray.length;
        if (size === 0 || count > size) {
            return;
        }
        sArray.splice(size - count, count);
    }
    /**
     * 删除数组从数组中找
     * @param sArray 最后返回的数组
     * @param sVector 用于删除的数组
     */
    public pop_array(sArray: number[], sVector: number[]): void {
        let size = sArray.length;
        const count = sVector.length;
        if (size === 0 || count === 0) {
            return;
        }
        for (let i = 0; i < count; i++) {
            size = sArray.length;
            for (let j = 0; j < size; j++) {
                if (sArray[j] === sVector[i]) {
                    sArray.splice(j, 1);
                }
            }
        }
    }
    public pop_mahjong(sArray: number[], mahjong: number): void {
        let size = sArray.length;
        if (size === 0) {
            return;
        }
        for (let i = 0; i < size; i++) {
            if (sArray[i] === mahjong) {
                sArray.splice(i, 1);
                return;
            }
        }
    }
    public pop_allMahjong(sArray: number[], mahjongs: number[]): void {
        const size = mahjongs.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < sArray.length; j++) {
                if (sArray[j] === mahjongs[i]) {
                    sArray.splice(j, 1);
                }
            }
        }
    }

    // 参数: sArray胡牌组, mahjong最后胡的牌
    // 返回: sParray前半组, sBArray后半组
    public getArray_hupai(sArray: number[], mahjong: number): ArrayClass_b {
        const size = sArray.length;
        const array = new ArrayClass_b();
        array.sParray = [];
        array.sBarray = [];

        let find_idx = 0;
        for (let i = 0; i < size; i++) {
            if (sArray[i] === mahjong) {
                find_idx = i;
                break;
            }
        }
        if (find_idx !== 0) {
            const mod = find_idx % 3
            let b_idx = 0;
            let e_idx = 0;
            if (mod == 0) {
                b_idx = find_idx - 2;
                e_idx = find_idx;
            } else if (mod == 1) {
                b_idx = find_idx;
                e_idx = find_idx + 2;
            } else {
                b_idx = find_idx - 1;
                e_idx = find_idx + 1;
            }
            if (e_idx > size) {
                e_idx = size;
            }
            for (let i = 0; i < size; i++) {
                if (i >= b_idx && i <= e_idx) {
                    array.sBarray.push(sArray[i]);
                } else {
                    array.sParray.push(sArray[i]);
                }
            }
        } else {
            this.push_back(array.sParray, sArray, 1, sArray.length)
        }

        return array;
    }
    //搜索指定对象是否存在
    public isFind(sArray: number[], mahjong: number): boolean {
        for (const s of sArray) {
            if (s === mahjong) {
                return true;
            }
        }
        return false;
    }

    // 检查胡牌（递归处理)
    // 参数: 检查的普通牌组,检查的赖子组,是否有将牌,以配成的扑牌组,以配成的将牌组
    public checkHuPai(
        sVecPai: number[], sVecLai: number[], bJiang: boolean, sVecSavePai: number[], sVecSaveJiang: number[]): boolean {
        if (sVecPai.length === 0 && sVecLai.length === 0) {
            return true;
        } else {
            //将牌没有的情况下先找将牌
            if (!bJiang && sVecPai.length >= 2 && sVecPai[0] === sVecPai[1]) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];

                this.push_back(vecDelePai, sVecPai, 1, 2);
                this.push_back(vecNextPai, sVecPai, 3, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 1, sVecLai.length);

                this.push_back(sVecSaveJiang, vecDelePai, 1, vecDelePai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, true, sVecSavePai, sVecSaveJiang)) {
                    return true;
                }
                this.pop_back(sVecSaveJiang, vecDelePai.length);
            }
            //三张牌组成刻子
            if (sVecPai.length >= 3 && sVecPai[0] === sVecPai[1] && sVecPai[0] === sVecPai[2]) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDelePai, sVecPai, 1, 3);
                this.push_back(vecNextPai, sVecPai, 4, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 1, sVecLai.length);

                this.push_back(sVecSavePai, vecDelePai, 1, vecDelePai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, bJiang, sVecSavePai, sVecSaveJiang)) {
                    return true;
                }
                this.pop_back(sVecSavePai, vecDelePai.length);
            }
            //三张组组成顺子
            if (sVecPai.length >= 3 && this.isFind(sVecPai, sVecPai[0] + 1) && this.isFind(sVecPai, sVecPai[0] + 2)) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];

                vecDelePai[0] = sVecPai[0];
                vecDelePai[1] = sVecPai[0] + 1;
                vecDelePai[2] = sVecPai[0] + 2;

                this.push_back(vecNextPai, sVecPai, 1, sVecPai.length);
                this.pop_array(vecNextPai, vecDelePai);
                this.push_back(vecNextLai, sVecLai, 1, sVecLai.length);

                this.push_back(sVecSavePai, vecDelePai, 1, vecDelePai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, bJiang, sVecSavePai, sVecSaveJiang)) {
                    return true;
                }
                this.pop_back(sVecSavePai, vecDelePai.length);
            }
            /*以上是没有赖子的胡牌算法*/

            // 一张牌和一个赖子组成将牌
            if (!bJiang && sVecPai.length >= 1 && sVecLai.length >= 1) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDelePai, sVecPai, 1, 1);
                this.push_back(vecDeleLai, sVecLai, 1, 1);

                this.push_back(vecNextPai, sVecPai, 2, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 2, sVecLai.length);

                this.push_back(sVecSaveJiang, vecDelePai, 1, vecDelePai.length);
                this.push_back(sVecSaveJiang, vecDeleLai, 1, vecDeleLai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, true, sVecSavePai, sVecSaveJiang)) {
                    return true;
                }
                this.pop_back(sVecSaveJiang, vecDelePai.length);
                this.pop_back(sVecSaveJiang, vecDeleLai.length);
            }
            //两张牌和一个赖子组成刻子
            if (sVecPai.length >= 2 && sVecLai.length >= 1 && sVecPai[0] === sVecPai[1]) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDelePai, sVecPai, 1, 2);
                this.push_back(vecDeleLai, sVecLai, 1, 1);

                this.push_back(vecNextPai, sVecPai, 3, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 2, sVecLai.length);

                this.push_back(sVecSavePai, vecDelePai, 1, vecDelePai.length);
                this.push_back(sVecSavePai, vecDeleLai, 1, vecDeleLai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, bJiang, sVecSavePai, sVecSaveJiang)) {

                    return true;
                }
                this.pop_back(sVecSavePai, vecDelePai.length);
                this.pop_back(sVecSavePai, vecDeleLai.length);
            }
            // 两张牌和一个赖子组成顺子
            if (sVecPai.length >= 2 && sVecLai.length >= 1 &&
                (((sVecPai[0] % 10 < 9) && this.isFind(sVecPai, sVecPai[0] + 1)) ||
                    ((sVecPai[0] % 10 < 8) && this.isFind(sVecPai, sVecPai[0] + 2)))) {

                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDelePai, sVecPai, 1, 1);
                this.push_back(vecDeleLai, sVecLai, 1, 1);
                this.push_back(sVecSavePai, vecDelePai, 1, vecDelePai.length);
                if (this.isFind(sVecPai, sVecPai[0] + 1)) {
                    vecDelePai[vecDelePai.length] = sVecPai[0] + 1;
                    if (sVecPai[0] % 10 == 8) {
                        sVecSavePai[sVecSavePai.length] = vecDeleLai[0];
                        sVecSavePai[sVecSavePai.length + 1] = sVecPai[0];
                        sVecSavePai[sVecSavePai.length + 1] = sVecPai[0] + 1;
                    } else {
                        sVecSavePai[sVecSavePai.length] = sVecPai[0] + 1;
                        sVecSavePai[sVecSavePai.length + 1] = vecDeleLai[0];
                    }
                } else if (this.isFind(sVecPai, sVecPai[0] + 2)) {
                    vecDelePai[vecDelePai.length] = sVecPai[0] + 2;
                    sVecSavePai[sVecSavePai.length] = vecDeleLai[0];
                    sVecSavePai[sVecSavePai.length + 1] = sVecPai[0] + 2;
                }

                this.push_back(vecNextPai, sVecPai, 1, sVecPai.length);
                this.pop_array(vecNextPai, vecDelePai);
                this.push_back(vecNextLai, sVecLai, 2, sVecLai.length);

                if (this.checkHuPai(vecNextPai, vecNextLai, bJiang, sVecSavePai, sVecSaveJiang)) {
                    return true;
                }
                this.pop_back(sVecSavePai, vecDelePai.length);
                this.pop_back(sVecSavePai, vecDeleLai.length);
            }
            //一张牌和两个赖子组成的牌
            if (sVecPai.length >= 1 && sVecLai.length >= 2) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDelePai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDelePai, sVecPai, 1, 1);
                this.push_back(vecDeleLai, sVecLai, 1, 2);

                this.push_back(vecNextPai, sVecPai, 2, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 3, sVecLai.length);

                this.push_back(sVecSavePai, vecDelePai, 1, vecDelePai.length);
                this.push_back(sVecSavePai, vecDeleLai, 1, vecDeleLai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, bJiang, sVecSavePai, sVecSaveJiang)) {

                    return true;
                }
                this.pop_back(sVecSavePai, vecDelePai.length);
                this.pop_back(sVecSavePai, vecDeleLai.length);
            }
            //三张赖子组成的牌
            if (sVecLai.length >= 3) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDeleLai, sVecLai, 1, 3);

                this.push_back(vecNextPai, sVecPai, 1, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 4, sVecLai.length);

                this.push_back(sVecSavePai, vecDeleLai, 1, vecDeleLai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, bJiang, sVecSavePai, sVecSaveJiang)) {

                    return true
                }
                this.pop_back(sVecSavePai, vecDeleLai.length);
            }
            //两张赖子组成将牌
            if (!bJiang && sVecLai.length >= 2) {
                const vecNextPai: number[] = [];
                const vecNextLai: number[] = [];
                const vecDeleLai: number[] = [];

                this.push_back(vecDeleLai, sVecLai, 1, 2);

                this.push_back(vecNextPai, sVecPai, 1, sVecPai.length);
                this.push_back(vecNextLai, sVecLai, 3, sVecLai.length);

                this.push_back(sVecSaveJiang, vecDeleLai, 1, vecDeleLai.length);
                if (this.checkHuPai(vecNextPai, vecNextLai, true, sVecSavePai, sVecSaveJiang)) {

                    return true;
                }
                this.pop_back(sVecSaveJiang, vecDeleLai.length);
            }

            return false;
        }
    }
    //判断是否胡牌 参数: 用于检查的有效并且排序（从小到大）过的牌组(牌结构(mahjong,index))
    public canHuPai(v_mahjongs: number[], card: number): number[] {
        const sVecHuPai: number[] = [];
        const array = this.getArray_Pai_Lai(v_mahjongs);
        // if (card !== this.getMahjongLaiZi()) {
        //     array.sVecPai.push(card);
        //     this.defMahjongSort_stb(array.sVecPai);
        // } else {
        //     array.sVecLai.push(card);
        // }
        // if (array.sVecLai.length > 1) {
        //     return sVecHuPai;
        // }

        const sVecJiang: number[] = [];
        const bHuPai = this.checkHuPai(array.sVecPai, array.sVecLai, false, sVecHuPai, sVecJiang);
        if (bHuPai) {
            this.push_back(sVecHuPai, sVecJiang, 1, 2);
        } else {
            return [];
        }

        return sVecHuPai;
    }
    //判断是否胡牌 参数: 用于检查的有效并且排序（从小到大）过的牌组(mahjong))
    public canHuPai_def(mahjongs: Mahjong[]): ArrayClass_c {
        const sVecHuPai: number[] = [];
        const array = this.getArrayDef_Pai_Lai(mahjongs);
        const a = new ArrayClass_c();
        a.bHuPai = false;
        a.sVecHuPai = sVecHuPai;
        if (array.sVecLai.length > 1) {
            return a;
        }

        const sVecJiang: number[] = [];
        const bHuPai = this.checkHuPai(array.sVecPai, array.sVecLai, false, sVecHuPai, sVecJiang);
        if (bHuPai) {
            this.push_back(sVecHuPai, sVecJiang, 1, 2);
        }
        a.bHuPai = bHuPai;
        a.sVecHuPai = sVecHuPai;

        return a;
    }

    // 会去除杠的牌,判断能否胡牌
    public canHuPai_defEX_old(mahjongs: Mahjong[]): ArrayClass_c {
        const sVecHuPai: number[] = [];
        const a = this.getArrayDef_Pai_Lai(mahjongs);
        const c = new ArrayClass_c();
        c.bHuPai = false;
        c.sVecHuPai = sVecHuPai;
        if (a.sVecLai.length > 1) {
            return c;
        }

        const d = this.canGangPai_withAllEX(a.sVecPai);
        if (d.gang) {
            if (d.array.length >= 4) {        // add
                this.pop_back(d.array, 1);            // add
                this.pop_array(a.sVecPai, d.array);
            } else {                                   // add
                d.gang = false                        // add
            }                                     // add
        }

        const sVecJiang: number[] = [];
        const bHuPai = this.checkHuPai(a.sVecPai, a.sVecLai, false, sVecHuPai, sVecJiang);
        if (bHuPai) {
            if (d.gang) {
                this.push_back(sVecHuPai, d.array, 1, d.array.length);
            }
            this.push_back(sVecHuPai, sVecJiang, 1, 2);
        }
        c.bHuPai = bHuPai;
        c.sVecHuPai = sVecHuPai;

        return c;
    }

    //会去除杠的牌,判断能否胡牌(递归方式)
    public canHuPai_defEX(mahjongs: Mahjong[]): ArrayClass_c {
        const sVecHuPaisss: number[] = [];
        const a = this.getArrayDef_Pai_Lai(mahjongs);
        const c = new ArrayClass_c();
        c.bHuPai = false;
        c.sVecHuPai = sVecHuPaisss;
        if (a.sVecLai.length > 1) {
            return c;
        }
        let bHuPai = false;
        const sVecJiangsss: number[] = [];
        const d: ArrayClass_d = this.canGangPai_withAllEX(a.sVecPai);
        if (d.gang) {
            const gang_pai = [];
            for (let i = 0; i < 3; i++) {
                gang_pai[i] = d.array[1];
            }
            // 先去除杠牌中的三张作为分开使用
            let temp_pai: number[] = [];
            this.push_back(temp_pai, a.sVecPai, 1, a.sVecPai.length);
            this.pop_array(temp_pai, gang_pai)

            let temp_lai: number[] = [];
            this.push_back(temp_lai, a.sVecLai, 1, a.sVecLai.length);

            bHuPai = this.checkHuPai(temp_pai, temp_lai, false, sVecHuPaisss, sVecJiangsss);
            if (bHuPai) {
                const hu_pai: number[] = [];
                this.push_back(hu_pai, gang_pai, 1, gang_pai.length);
                this.push_back(hu_pai, sVecHuPaisss, 1, sVecHuPaisss.length);
                this.push_back(hu_pai, sVecJiangsss, 1, 2)

                c.bHuPai = true;
                c.sVecHuPai = hu_pai;
                return c;
            }

            // 去除杠牌中的两张牌作为分开使用
            this.pop_back(gang_pai, 1)
            temp_pai = [];
            this.push_back(temp_pai, a.sVecPai, 1, a.sVecPai.length);
            this.pop_array(temp_pai, gang_pai);

            temp_lai = [];
            this.push_back(temp_lai, a.sVecLai, 1, a.sVecLai.length);
            let sVecHuPai: number[] = [];
            const sVecJiang: number[] = [];

            bHuPai = this.checkHuPai(temp_pai, temp_lai, false, sVecHuPai, sVecJiang)
            if (bHuPai) {
                const hu_pai: number[] = [];
                this.push_back(hu_pai, gang_pai, 1, gang_pai.length);
                this.push_back(hu_pai, sVecHuPai, 1, sVecHuPai.length);
                this.push_back(hu_pai, sVecJiang, 1, 2)
                c.sVecHuPai = hu_pai;
                c.bHuPai = true;
                return c;
            }

            // 没有胡牌
            sVecHuPai = [];
            c.sVecHuPai = sVecHuPai;
            c.bHuPai = false;
            return c;
        } else {

            bHuPai = this.checkHuPai(a.sVecPai, a.sVecLai, false, sVecHuPaisss, sVecJiangsss)
            if (bHuPai) {
                this.push_back(sVecHuPaisss, sVecJiangsss, 1, 2)
            }
        }
        c.sVecHuPai = sVecHuPaisss;
        c.bHuPai = bHuPai;
        return c;
    }

    // 判断是否胡牌根据自己的有效牌组＋别人打的一张牌
    // 参数: 有效牌组列表(牌结构(mahjong,index)), 别人打的牌, 是否可以用赖子(自己有赖子不能捉炮)
    public canHuPai_WithOther(v_mahjongs: number[], mahjong: number, use_laizi: boolean = false): number[] {
        const sVecHuPai: number[] = [];
        const a = this.getArray_Pai_Lai(v_mahjongs);
        if (a.sVecLai.length > 0) {
            return sVecHuPai;
        }
        a.sVecPai.push(mahjong);
        this.defMahjongSort_stb(a.sVecPai);

        // if (a.sVecLai.length > 0 && !use_laizi) { // 有赖子就不能捉炮
        //     return sVecHuPai;
        // }

        const sVecJiang: number[] = [];
        const bHuPai = this.checkHuPai(a.sVecPai, a.sVecLai, false, sVecHuPai, sVecJiang);
        if (bHuPai) {
            this.push_back(sVecHuPai, sVecJiang, 1, 2);
        } else {
            return [];
        }

        return sVecHuPai;
    }

    //检测牌组＋别人打出的牌所构成的胡是否有效(递归)
    //别人放胡，要判断我的胡牌里面的各种组合是否只是有别人的牌，而没赖子
    // 参数: 胡牌组，别人打出的牌
    public checkHuPai_WithPai(sVecPai: number[], mahjong: number): boolean {
        if (sVecPai.length === 0) {
            return true;
        } else {
            if (sVecPai.length >= 3) {
                const vecDelePai: number[] = [];
                this.push_back(vecDelePai, sVecPai, 1, 3);

                const vecNextPai: number[] = [];
                this.push_back(vecNextPai, sVecPai, 4, sVecPai.length);

                let bFindLai = false;
                let bFindMahjong = false;
                for (let i = 0; i < 3; i++) {
                    if (vecDelePai[i] === this.getMahjongLaiZi()) {
                        bFindLai = true;
                    } else if (vecDelePai[i] === mahjong) {
                        bFindMahjong = true;
                    }
                }
                // 假如找到别人的牌，并且没有找到赖子那么胡牌有效
                if (bFindMahjong && !bFindLai) {
                    return true;
                }
                return this.checkHuPai_WithPai(vecNextPai, mahjong);
            }
            if (sVecPai.length === 2) {
                let bFindLai = false;
                let bFindMahjong = false;
                for (let i = 0; i < 2; i++) {
                    if (sVecPai[i] === this.getMahjongLaiZi()) {
                        bFindLai = true;
                    } else if (sVecPai[i] == mahjong) {
                        bFindMahjong = true;
                    }
                }

                // 假如找到别人的牌，并且没有找到赖子那么胡牌有效
                if (bFindMahjong && !bFindLai) {
                    return true;
                }
            }

            return false;
        }
    }

    //检测牌组＋别人打出的牌所构成的胡是否有效
    // 参数: 胡牌组, 别人打出的牌
    public checkHuPai_WithOther(sVecPai: number[], mahjong: number) {
        return this.checkHuPai_WithPai(sVecPai, mahjong)
    }
    //判断是否听牌
    // 参数: 有效牌列表(牌结构(mahjong,index))
    public canTingPai(v_mahjongs: number[], mahjong: number): boolean {
        //分开牌组与赖子后默认添加一张赖子来判断是否胡牌
        const a = this.getArray_Pai_Lai(v_mahjongs);
        a.sVecLai.push(this.getMahjongLaiZi());

        if (mahjong === this.getMahjongLaiZi()) {
            this.pop_mahjong(a.sVecLai, mahjong);
        }
        if (a.sVecLai.length > 2) {
            return false;
        }
        const size = a.sVecPai.length;
        let bTing = false;
        const sVecPaiNext: number[] = [];
        const sVecSavePai: number[] = [];
        const sVecSaveJiang: number[] = [];

        this.push_back(sVecPaiNext, a.sVecPai, 1, a.sVecPai.length);
        if (mahjong !== this.getMahjongLaiZi()) {
            this.pop_mahjong(sVecPaiNext, mahjong);
        }
        if (this.checkHuPai(sVecPaiNext, a.sVecLai, false, sVecSavePai, sVecSaveJiang)) {
            bTing = true;
        }
        //看看可不可以少一个赖子
        if (mahjong !== this.getMahjongLaiZi()) {
            this.push_back(sVecPaiNext, a.sVecPai, 1, a.sVecPai.length);
            // table.remove(sVecLai, TABLE_SIZE(sVecLai)); TODO
            a.sVecLai = [];
            if (this.checkHuPai(sVecPaiNext, a.sVecLai, false, sVecSavePai, sVecSaveJiang)) {
                bTing = true;
            }
        }

        return bTing
    }

    // 参数: 有效牌列表数字
    //去除杠的牌，判断能否听牌
    public canTingPaiEX(mahjongs: Mahjong[]): boolean {

        const a = this.getArray_Pai_Lai_ex(mahjongs);
        let sVecPai = a.sVecPai;
        let sVecLai = a.sVecLai;
        sVecLai.push(this.getMahjongLaiZi());
        if (sVecLai.length > 2) {
            return false;
        }

        const size = sVecPai.length;

        let bTing = false;
        const sVecPaiNext: number[] = [];
        const sVecSavePai: number[] = [];
        const sVecSaveJiang: number[] = [];

        this.push_back(sVecPaiNext, sVecPai, 1, sVecPai.length);
        const d: ArrayClass_d = this.canGangPai_withAllEX(sVecPaiNext);
        if (d.gang) {
            this.pop_array(sVecPaiNext, d.array);
        }

        if (this.checkHuPai(sVecPaiNext, sVecLai, false, sVecSavePai, sVecSaveJiang)) {
            bTing = true
        }
        return bTing
    }
    //判断是否杠牌(遍历所有牌)
    // 参数: 有效牌组, 摊开的牌组 (牌结构(mahjong,index)), 以前放弃杠的牌
    public canGangPai_withAll(v_mahjongs: number[], s_mahjongs: proto.casino_xtsj.packet_sc_op_ack[], f_mahjongs: number[]): number[] {
        let v_size = v_mahjongs.length;
        let s_size = 0;
        const v_array = [];
        for (let i = 0; i < v_size; i++) {
            v_array[i] = v_mahjongs[i];
        }

        const s_array: number[] = [];
        if (s_mahjongs !== undefined && s_mahjongs.length > 0) {
            s_size = s_mahjongs.length;
            for (let i = 0; i < s_size; i++) {
                s_array[i] = s_mahjongs[i].cards[0];
            }
        }

        if (f_mahjongs !== undefined && f_mahjongs.length > 0) {
            this.pop_allMahjong(v_array, f_mahjongs);
            v_size = v_array.length;
        }
        const array = [];
        let index = 1;
        let gang_size = 4;
        for (let i = 0; i < v_size; i++) {
            const mahjong = v_array[i];
            if (mahjong !== this.getMahjongLaiZi()) {
                if (mahjong === this.getMahjongFan()) { // 翻牌3张杠,其他4张杠
                    gang_size = 3
                } else {
                    gang_size = 4
                }

                index = 1
                array[index] = mahjong
                for (let j = i + 1; j < v_size; j++) {
                    if (v_array[j] === mahjong) {
                        array[index] = mahjong
                        index = index + 1
                        if (index >= gang_size) {
                            // dd.gang = true;
                            // dd.array = array;
                            return array;
                        }
                        else {
                            break
                        }
                    }

                    for (let j = 0; j < s_size; j++) {
                        if (s_array[j] === mahjong) {
                            index = index + 1
                            if (index >= gang_size) {
                                // dd.gang = true;
                                // dd.array = array;
                                return array;
                            }
                        }
                    }
                }
            }
            // dd.gang = false;
            // dd.array = array;
            return [];
        }
    }
    public canGangPai_withAllEX(mahjongs: number[]): ArrayClass_d {
        const dd = new ArrayClass_d();
        const size = mahjongs.length;
        const array = [];
        let index = 1;
        let gang_size = 4;
        for (let i = 0; i < size; i++) {
            const mahjong = mahjongs[i];
            if (mahjong !== this.getMahjongLaiZi()) {
                if (mahjong === this.getMahjongFan()) {
                    gang_size = 3
                } else {
                    gang_size = 4
                }

                index = 1
                array[index] = mahjong
                for (let j = i + 1; j < size; j++) {
                    if (mahjongs[j] == mahjong) {
                        array[index] = mahjong
                        index = index + 1
                        if (index >= gang_size) {
                            dd.gang = true;
                            dd.array = array;
                            return dd;
                        }
                    } else {
                        break
                    }
                }
            }
        }
        dd.gang = false;
        dd.array = array;
        return dd;
    }

    //参数：手牌或者摊派数组
    public getValueFromArr(cards: Mahjong[]): number[] {
        const arr: number[] = [];
        if (cards !== undefined && cards.length > 0) {
            for (const v of cards) {
                arr.push(v.mahjong);
            }

        }
        return arr;
    }

    //根据他人的牌判断能否胡牌
    public canHu_WithOther(tilesHand: number[], mahjong: number): number[] {
        if (tilesHand === undefined || tilesHand === null || tilesHand.length === 0) {
            return [];
        }
        //判断是否胡牌, 假如有人飘过赖子那么一定不能胡别人的牌, 并且放弃过捉铳
        if (this.getFlagPiao()) {
            return [];
        }
        const v = this.canHuPai_WithOther(tilesHand, mahjong, true);
        if (v.length > 0) {
            if (this.checkHuPai_WithOther(v, mahjong)) {
                return v;
            }
        }


        return [];
    }
    public haveGang_WithMe(tilesHand: number[], melds: proto.casino_xtsj.packet_sc_op_ack[], notKongs: number[], mahjong: number): number[] {
        const array: { [key: number]: number } = {};
        const canKongs: number[] = [];
        for (const tile of tilesHand) {
            const a = array[tile];
            if (a === undefined || a === 0) {
                array[tile] = 1;
            } else {
                array[tile] = a + 1;
            }
        }
        // Logger.debug("array ------------------- ", array);
        const arrayKeys = Object.keys(array);
        //判断能否杠
        for (const akey of arrayKeys) {
            if (akey !== undefined) {
                const tile = +akey;
                if (tile !== 0 && tile !== this.getMahjongLaiZi()) {
                    let can = true;
                    for (const notKong of notKongs) {
                        if (notKong === tile) {
                            can = false;
                            break;
                        }
                    }
                    if (can) {
                        let num = array[tile];
                        // if (mahjong !== undefined && mahjong === tile) {
                        //     num++;
                        // }
                        if (tile === this.getMahjongFan()) {
                            if (num === 3) {
                                canKongs.push(tile);
                            }
                        } else {
                            if (num === 4) {
                                canKongs.push(tile);
                            }
                        }
                    }
                }
            }
        }
        for (const meld of melds) {
            if (meld.cards[0] === mahjong) {
                //补杠
                canKongs.push(mahjong);
            }
        }

        return canKongs;
    }
    //判断能否杠牌
    public canGang_WithOther(tilesHand: number[], mahjong: number): number[] {
        if (mahjong === this.getMahjongLaiZi()) {
            return [];
        }
        const array: number[] = [];
        //遍历有效牌准备检索是否构成杠和碰
        for (const tile of tilesHand) {
            if (tile === mahjong) {
                array.push(tile);
            }
        }
        if (this.getMahjongFan() === mahjong) {
            if (array.length > 1) {
                //翻牌三张就可以杠
                return array;
            }
        }
        if (array.length === 3) {
            return array;
        }

        return [];
    }
    //根据他人的牌判断能否碰牌
    public canPeng_WithOther(tilesHand: number[], mahjong: number): number[] {
        if (mahjong === this.getMahjongLaiZi() || mahjong === this.getMahjongFan()) {
            return [];
        }
        const array: number[] = [];
        for (const tile of tilesHand) {
            if (tile === mahjong) {
                array.push(tile);
                if (array.length > 1) {

                    return array;
                }
            }
        }

        return [];
    }
}
/**
 * 自己补充的东西
 */
interface Mahjong {
    mahjong: number;
}
class ArrayClass_a {
    sVecPai: number[];
    sVecLai: number[];
}
class ArrayClass_b {
    sParray: number[];
    sBarray: number[];
}
class ArrayClass_c {
    sVecHuPai: number[];
    bHuPai: boolean;
}
class ArrayClass_d {
    array: number[];
    gang: boolean;
}