/**
 * lobby 配置
 */
export namespace LEnv {
    export const VER_STR: string = "v1.0.0";

    // updateQuery = "/lobby/upgrade/query",
    export const updateQuery: string = "/lobby/uuid/upgradeQuery";
    export const updateDownload = "http://localhost:8080"; // tslint:disable-line:no-http-string
    export const gameWebsocketMonkey = "/game/{0}/ws/monkey";
    export const gameWebsocketPlay = "/game/{0}/ws/play";
    export const rootURL = "https://dfh5-develop.qianz.com"; // tslint:disable-line:no-http-string
    export const gameHost = "wss://dfh5-develop.qianz.com"; // tslint:disable-line:no-http-string
    export const quicklyLogin = "/lobby/uuid/quicklyLogin";
    export const accountLogin = "/lobby/uuid/accountLogin";
    export const wxLogin = "/lobby/uuid/wxLogin";

    export const wxShareInfo = '/lobby/uuid/getShareInfo';
    export const register = "/lobby/uuid/register";
    export const chat = "/lobby/uuid/chat";
    export const lobbyWebsocket = "wss://dfh5-develop.qianz.com/lobby/uuid/ws";

    // -- 创建房间
    export const createRoom = "/lobby/uuid/createRoom";
    export const loadRoomPriceCfgs = "/lobby/uuid/loadPrices";
    export const requestRoomInfo = "/lobby/uuid/requestRoomInfo";
    // --战绩
    export const lrproom = "/lobby/uuid/lrproom";
    export const lrprecord = "/lobby/uuid/lrprecord";
    // -- 邮件
    export const loadMails = "/lobby/uuid/loadMails";
    export const setMailRead = "/lobby/uuid/setMailRead";
    export const deleteMail = "/lobby/uuid/deleteMail";
    export const receiveAttachment = "/lobby/uuid/receiveAttachment";
    // -- 牌友圈
    export const createClub = "/lobby/uuid/createClub";
    export const loadMyClubs = "/lobby/uuid/loadMyClubs";
    export const deleteClub = "/lobby/uuid/disbandClub";
    export const joinClub = "/lobby/uuid/joinClub";
    export const quitClub = "/lobby/uuid/quitClub";
    export const loadClubMembers = "/lobby/uuid/loadClubMembers";
    export const joinApproval = "/lobby/uuid/joinApproval";
    export const loadClubEvents = "/lobby/uuid/loadClubEvents";
    export const loadClubRooms = "/lobby/uuid/loadClubRooms";

    export const loadMyApplyEvent = "/lobby/uuid/loadMyApplyEvent";

    export const renameClub = "/lobby/uuid/renameClub";

    export const kickOut = "/lobby/uuid/kickOut";

    export const changeRole = "/lobby/uuid/changeRole";

    export const loadClubMgrs = "/lobby/uuid/loadClubMgrs";

    export const loadClub = "/lobby/uuid/loadClub";

    export const createClubRoom = "/lobby/uuid/createClubRoom";

    export const deleteClubRoom = "/lobby/uuid/deleteClubRoom";

    export const allowMemberCreateRoom = "/lobby/uuid/allowMemberCreateRoom";

    export const setRoomOptions = "/lobby/uuid/setRoomOptions";

    export const cfmt = (str: string, ...args: any[]): string => { // tslint:disable-line:no-any
        return str.replace(/{(\d+)}/g, (match, n) => {
            return (typeof args[n]) !== "undefined"
                ? args[n]  // tslint:disable-line:no-unsafe-any
                : match
                ;
        });
    };
}
