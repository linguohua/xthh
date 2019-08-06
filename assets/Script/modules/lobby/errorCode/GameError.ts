import { proto } from "../protoHH/protoHH";
const errCode = proto.casino.eRETURN_TYPE;
/**
 * 大厅错误码
 */
export namespace GameError {

    const errMsg: { [key: number]: string } = {
        [errCode.RETURN_SUCCEEDED]: "成功",
        [errCode.RETURN_FAILED]: "失败",
        [errCode.RETURN_DISABLE]: "服务器即将维护，停止开房！",
        [errCode.RETURN_ONLINE]: "已在线",
        [errCode.RETURN_OFFLINE]: "已离线",
        [errCode.RETURN_WAIT]: "发送太快",
        [errCode.RETURN_UNIMPLEMENTED]: "未实现",
        [errCode.RETURN_EXIST]: "已存在",
        [errCode.RETURN_INTERRUPT]: "中断",
        [errCode.RETURN_BAN]: "禁止登录",
        [errCode.RETURN_USED]: "已使用",
        [errCode.RETURN_GAIN]: "已领取",
        [errCode.RETURN_LEN]: "参数长度错误",
        [errCode.RETURN_INVALID]: "您要进入的房间已经关闭喽!",
        [errCode.RETURN_DATETIME]: "无效时间",
        [errCode.RETURN_PERMISSION]: "权限不足",
        [errCode.RETURN_MAC]: "无效mac地址",
        [errCode.RETURN_TIMEOUT]: "超时",
        [errCode.RETURN_COST]: "花费错误",
        [errCode.RETURN_CHANNEL]: "必须微信登陆才可进入房间!",
        [errCode.RETURN_GUILD]: "必须同工会玩家才可进入房间!",
        [errCode.RETURN_SAME]: "参数相同",

        [errCode.RETURN_NICKNAME_SHORT]: "昵称太短",
        [errCode.RETURN_NICKNAME_LONG]: "昵称太长",
        [errCode.RETURN_NICKNAME_EXIST]: "昵称已存在",
        [errCode.RETURN_NICKNAME_ERROR]: "昵称含有非法文字",

        [errCode.RETURN_MAX_LEVEL]: "等级已满",
        [errCode.RETURN_MAX_PLUS]: "强化已满",

        [errCode.RETURN_NO_PLAYER]: "没有玩家",
        [errCode.RETURN_NO_ITEM]: "没有道具",

        [errCode.RETURN_EXIST_NICKNAME]: " 玩家昵称已存在 ",
        [errCode.RETURN_EXIST_USER]: " 账号已存在     ",

        [errCode.RETURN_NOTENOUGH_VIPLEVEL]: " 玩家VIP等级不足",
        [errCode.RETURN_NOTENOUGH_LEVEL]: " 玩家等级不足   ",
        [errCode.RETURN_NOTENOUGH_GOLD]: " 游戏币不足     ",
        [errCode.RETURN_NOTENOUGH_MONEY]: " 充值币不足     ",
        [errCode.RETURN_NOTENOUGH_CARD]: " 房卡不足       ",
        [errCode.RETURN_NOTENOUGH_RED]: " 红包不足       ",
        [errCode.RETURN_NOTENOUGH_BEAN]: "欢乐豆不足      ",

        [errCode.RETURN_FULL]: "房间人数已满",
        [errCode.RETURN_FULL_GOLD]: " 游戏币已满",
        [errCode.RETURN_FULL_MONEY]: " 充值币已满 ",

        [errCode.RETURN_INVITE_EXIST]: " 已被邀请 ",
        [errCode.RETURN_INVITE_NOTFOUND]: " 邀请没有找到",
        [errCode.RETURN_INVITE_FULL]: " 邀请已满",
        [errCode.RETURN_INVITE_LEVEL]: " 邀请等级超过",
        [errCode.RETURN_INVITE_REQUESTFULL]: " 请求已满",
        [errCode.RETURN_INVITE_VIPLEVEL]: " VIP等级无效，无法使用该功能",

        [errCode.RETURN_RED_DISABLE]: "",
        [errCode.RETURN_RED_MIN]: "",
        [errCode.RETURN_RED_MAX]: "",
        [errCode.RETURN_RED_CASH]: "",
        [errCode.RETURN_RED_NUM]: "",
        [errCode.RETURN_RED_LIMIT]: " 达到今日购买上限",
        [errCode.RETURN_RED_NOTENOUGH]: "",

        [errCode.RETURN_GUILD_MASTER]: " 不是会长无法操作",
        [errCode.RETURN_GUILD_ROOM_DISABLE]: " 当前禁止创建房间",
        [errCode.RETURN_GUILD_ROOM_MAX]: " 当前房间已创建满",
        [errCode.RETURN_GUILD_ROOM_CREATE]: " 公会房间创建失败",
        [errCode.RETURN_GUILD_ROOM_NOTFOUND]: " 公会房间没有找到",
        [errCode.RETURN_GUILD_ROOM_CARD_NOTENOUGH]: "压卡数不足",
        [errCode.RETURN_GUILD_ROOM_CARD_MIN]: " 压卡数低于下限     ",
        [errCode.RETURN_GUILD_ROOM_CARD_MAX]: " 压卡数超过上限 ",
        [errCode.RETURN_GUILD_ROOM_CARD_DAY]: " 超过每日创建上限",

        [errCode.RETURN_GUILD_JOIN_NOTFOUND]: " 公会没有找到",
        [errCode.RETURN_GUILD_JOIN_EXIST]: " 已在公会中",
        [errCode.RETURN_GUILD_JOIN_REQUEST]: " 已向公会发出加入请",
        [errCode.RETURN_GUILD_JOIN_MAX]: " 加入的公会已达上限",
        [errCode.RETURN_GUILD_JOIN_FULL]: " 对方公会成员已满",

        [errCode.RETURN_GUILD_DISABAND_NO_OUTTIME]: "工会解散未超过设置超时时间",

        [errCode.RETURN_GUILD_LOG_TIME]: " 查询日志太快",
        [errCode.RETURN_GUILD_LOG_DISABLE]: " 查询日志禁用",
        [errCode.RETURN_GUILD_LOG_OUT]: " 超出范围",

        [errCode.RETURN_GUILD_RANK_CLOSE]: " 排行榜信息查询关闭",
        [errCode.RETURN_GUILD_REQUEST_TIME]: " 公会数据请求太快",

        [errCode.RETURN_GUILD_NOTICE_UPDATE]: "工会公告已更新",
        [errCode.RETURN_GUILD_NOTICE_PUBLISH_OFTEN]: "工会公告发布太频繁",

        [errCode.RETURN_BIND_EXIST]: " 绑定已存在",
        [errCode.RETURN_BIND_NOTFOUND]: " 邀请码不存在",
        [errCode.RETURN_BIND_CARD_DISABLE]: " 房卡当前禁止兑换",
        [errCode.RETURN_BIND_CARD_NO]: "",
        [errCode.RETURN_BIND_CARD_NUM]: " 房卡兑换次数超过上限",
        [errCode.RETURN_BIND_CARD_MIN]: " 低于房卡兑换最小值",
        [errCode.RETURN_BIND_CARD_MAX]: " 高于房卡兑换最大值",
        [errCode.RETURN_BIND_CARD_LIMIT]: " 房卡兑换总量超过上限",

        [errCode.RETURN_MATCH_DISABLE]: " 比赛已禁用",
        [errCode.RETURN_MATCH_LOG_TIME]: " 查询比赛日志太快",
        [errCode.RETURN_MATCH_FULL]: " 比赛房间已满",
        [errCode.RETURN_MATCH_DAY_MAX]: " 已超过今天参加最大次数",
        [errCode.RETURN_MATCH_CARD_NOTENOUGH]: " 房卡不足",
        [errCode.RETURN_MATCH_CHANNEL]: " 参赛渠道不正确",
        [errCode.RETURN_MATCH_HAS_APPLY]: " 当前玩家已经报名参赛",
        [errCode.RETURN_MATCH_ID_NOT_EXSIT]: " 当前赛场ID不存在",
        [errCode.RETURN_MATCH_IS_START]: " 比赛已开始",
        [errCode.RETURN_MATCH_GIVE_UP]: " 放弃比赛",

        [errCode.RETURN_BIND_PHONE_SUCCESS]: " 绑定手机成功",
        [errCode.RETURN_HAS_BINDED]: " 账号已绑定过手机",
        [errCode.RETURN_CODE_EXPIRE]: " 验证码过期",

        [errCode.RETURN_ENERGY_NOT_ENOUGH]: " 能力值不足",

        [errCode.RETURN_TABLE_WAIT_TIMEOUT]: "桌子匹配超时",

        [errCode.RETURN_DAYLIMIT]: "已超过每日限制",
        [errCode.RETURN_COLDDOWN]: "还在时间内无法抽取",
        [errCode.RETURN_LOCKCARD]: "房卡已锁定",
        [errCode.RETURN_LOCKGOLD]: " 房卡已锁定",
        [errCode.RETURN_REFRESH]: "请刷新当前页面",
        [errCode.RETURN_HELPER_RECEIVE_ALL]: "福利金已领完"
    };

    export const getErrorString = (code: number): string => {
        const errString = errMsg[code];
        if (errString === undefined || errString === "") {
            return `Unknow error code: ${code}`;
        }

        return errString;
    };

}
