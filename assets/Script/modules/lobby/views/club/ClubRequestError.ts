import { Dialog } from "../../lcore/LCoreExports";
import { proto } from "../../proto/protoLobby";

/**
 * 输出茶馆请求错误
 */

export namespace ClubRequestError {
    export const showErrMsg = (errCode: number): void => {

        const club = proto.club;
        const errMsgMap: { [key: string]: string } = {
            [club.ClubOperError.CERR_OK]: "没有错误",
            [club.ClubOperError.CERR_Exceed_Max_Club_Count_Limit]: "超过最大限制",
            [club.ClubOperError.CERR_No_Valid_Club_Number]: "无法申请到有效的俱乐部编号",
            [club.ClubOperError.CERR_Database_IO]: "编码解码错误",
            [club.ClubOperError.CERR_Encode_Decode]: "无效输入参数",
            [club.ClubOperError.CERR_Invalid_Input_Parameter]: "无效输入参数",

            [club.ClubOperError.CERR_Only_Creator_And_Mgr_Can_KickOut]: "只有创建者才可以踢人",
            [club.ClubOperError.CERR_You_Already_In_Club]: "你已经在此俱乐部",
            [club.ClubOperError.CERR_You_Are_In_Club_Block_List]: "你已经在此俱乐部黑名单，不能申请加入",
            [club.ClubOperError.CERR_You_Already_Applicate]: "你已经申请过，请耐心等候部长批准",
            [club.ClubOperError.CERR_Invitee_Already_In_Club]: "你已经在此俱乐部",

            [club.ClubOperError.CERR_Invitee_Are_In_Club_Block_List]: "你已经在此俱乐部黑名单，不能申请加入",
            [club.ClubOperError.CERR_Invitee_Already_Applicate]: "你已经申请过，请耐心等候部长批准",
            [club.ClubOperError.CERR_Club_Not_Exist]: "俱乐部不存在",
            [club.ClubOperError.CERR_Only_Creator_Can_Invite]: "只有部长可以邀请别人",
            [club.ClubOperError.CERR_Only_Creator_And_Mgr_Can_Approve]: "只有部长可以批准",

            [club.ClubOperError.CERR_No_Applicant]: "没有对应的申请者",
            [club.ClubOperError.CERR_Applicant_Already_In_Club]: "申请者已经是俱乐部成员",
            [club.ClubOperError.CERR_Applicant_In_Club_Block_List]: "申请者在俱乐部的黑名单中",
            [club.ClubOperError.CERR_Token_Invalid]: "token无效",
            [club.ClubOperError.CERR_Club_Name_Too_Long]: "俱乐部名字太长",

            [club.ClubOperError.CERR_Club_Name_Exist]: "同名的俱乐部已经存在",
            [club.ClubOperError.CERR_Club_Only_Owner_Can_Disband]: "只有部长可以解散俱乐部",
            [club.ClubOperError.CERR_Owner_Can_not_quit]: "部长不能退出自己的俱乐部，只能解散",
            [club.ClubOperError.CERR_User_Not_In_Club]: "玩家不在俱乐部中",
            [club.ClubOperError.CERR_Club_Only_Owner_And_Mgr_Can_Set]: "只有部长可以设置俱乐部",

            [club.ClubOperError.CERR_Club_Forbit_Join]: "俱乐部禁止加入",
            [club.ClubOperError.CERR_Input_Text_Too_Long]: "输入文字过长",
            [club.ClubOperError.CERR_Club_Has_Room_In_PlayingState]: "俱乐部还有正在游戏中的房间，不能解散"
        };

        let errMsg = errMsgMap[errCode];
        if (errMsg === undefined) {
            errMsg = `未知错误 ,错误码 = ${errCode}`;
        }

        Dialog.showDialog(errMsg, () => {

            // tslint:disable-next-line:align
        }, () => {
            //
        });

    };
}
