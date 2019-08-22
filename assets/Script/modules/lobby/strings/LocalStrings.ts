/**
 * 本地字符串
 */
export namespace LocalStrings {

    const localStrings: { [key: string]: string } = {
        [`loadProgressText`]: "正在加载中... {0} %",
        [`loginErrCode`]: "登录错误，错误码 : {0}",

        [`all`]: "所有",
        [`weChat`]: "微信",
        [`community`]: "工会",

        [`xthh`]: "仙桃晃晃",
        [`srlm`]: "三人两门",
        [`lrlm`]: "两人两门",

        [`boxRecord`]: "宝箱记录",
        [`fkRecord`]: "房卡记录",
        [`gameRecord`]: "战绩统计",
        [`personalRoom`]: "私人房",
        [`noGameRecordTips`]: "没有您最近的战绩记录",
        [`inputRecordId`]: "请输入回播id",

        [`wrongGameRecordIdTips`]: "未找到该房间数据",
        [`daleyOperationTips`]: "操作频繁，请{0}秒后尝试",
        [`2playerLimitTips`]: "两人玩法不能增加此限制",

        [`advice`]: "抵制不良游戏, 拒绝盗版游戏. 注意自我保护, 谨防受骗上当. 适度游戏益脑, 沉迷游戏伤身. 合理安排时间，享受健康生活.",
        [`approvalInformation`]: "粤网文 [2019] 5856-1386号 [许可证 [粤B2-20190210] 新广初审[2017] 9751号] ISBN 978-7-7979-4213-3 北京科海电子出版社",

        [`playerVoiceFailed`]: "语音播放失败",
        [`applyDisband`]: "牌局已经开始，请申请解散房间",

        [`frequentlyRecording`]: "1秒内不能重复录音",
        [`cancelSend`]: "取消发送",
        [`durationTooShort`]: "录制要大于1秒",

        [`plLimit`]: "下家飘赖达到3次，锁牌生效，您将被限制碰牌、点笑、小朝天操作",
        [`plLimit1`]: "【{0}】飘赖{1}次，【{2}】限制【碰牌/点笑/小朝天】",
        [`plLimit2`]: "下家飘赖{0}次，限制【{1}】",

        [`autoDisband`]: "超时太久，自动解散！",
        [`alreadyCallDisband`]: "已经有人申请了解散房间",
        [`ownerCanDisband`]: "牌局未开始，只有房主可以解散房间",

        [`voiceReconnect`]: "语音网络正在重连！",

        [`getPositionFailed`]: "网络错误，获取用户位置失败!",
        [`getPositionFailedWithCode`]: "获取位置错误，状态码: {0}",
        [`gpsEffectOnWeChat`]: "在微信上打开，gps才生效",
        [`gameIsPlaying`]: "牌局正在进行中...还是打完吧！",

        [`roomHasClose`]: "您要进入的房间已经关闭喽",
        [`testInWeChat`]: "web版没实现，请在微信小游戏上测试",
        [`quitRoom`]: "你确定要离开当前所在的房间吗？",
        [`disbandRoom`]: "确定要解散当前的牌局吗？",
        [`confirmQuitRoom`]: "确实要退出房间吗？",
        [`recordInWeChat`]: "微信上才可以录音",
        [`confirmDisbandRoom`]: "你确定要发起解散当前的牌局吗？",
        [`openSettingToAuth`]: "请前往小程序设置打开定位权限",
        [`disbandTips`]: "是否解散房间？",

        [`roomNumber`]: "房号",
        [`baseScore`]: "底注",
        [`total`]: "总共",
        [`round`]: "局",

        [`huPaiTimes`]: "胡牌次数",
        [`zuoZhuangTimes`]: "坐庄次数",
        [`piaoLaiTimes`]: "飘赖次数",
        [`chaoShiTimes`]: "超时次数",

        [`continue`]: "继续",
        [`checkScore`]: "查看积分",
        [`plText`]: "一赖到底，飘赖子有奖，笑翻倍",
        [`admission`]: "允许进入",

        [`leftCard`]: "剩牌",

        [`leftRound`]: "还有:{0}局",
        [`lastRound`]: "最后一局",

        [`notPosition`]: "未获取位置",
        [`unknownDistance`]: "未知距离",

        [`distanceTooClose`]: "发现距离过近",
        [`km`]: "千米",
        [`m`]: "米",

        [`cannotRecordWhenOnPlay`]: "正在播放，不能录音"

    };

    export const findString = (strTag: string, ...params: string[]): string => {
        const localString = localStrings[strTag];

        if (localString === undefined || localString === "") {
            return `Unknown strTag: ${strTag}`;
        }

        return localString.replace(/{(\d+)}/g, (match: string, num: number) => {

            return params[num] !== undefined ? params[num] : match;
        });
    };

}
