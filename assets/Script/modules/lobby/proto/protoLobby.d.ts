export namespace proto {
	export namespace club {
		enum ClubReplyCode {
			RCNone = 0,
			RCError = 1,
			RCOperation = 2,
		}

		enum ClubRoleType {
			CRoleTypeNone = 0,
			CRoleTypeMember = 1,
			CRoleTypeCreator = 2,
			CRoleTypeMgr = 3,
		}

		enum ClubOperError {
			CERR_OK = 0,
			CERR_Exceed_Max_Club_Count_Limit = 1,
			CERR_No_Valid_Club_Number = 2,
			CERR_Database_IO = 3,
			CERR_Encode_Decode = 4,
			CERR_Invalid_Input_Parameter = 5,
			CERR_Only_Creator_And_Mgr_Can_KickOut = 6,
			CERR_You_Already_In_Club = 7,
			CERR_You_Are_In_Club_Block_List = 8,
			CERR_You_Already_Applicate = 9,
			CERR_Invitee_Already_In_Club = 10,
			CERR_Invitee_Are_In_Club_Block_List = 11,
			CERR_Invitee_Already_Applicate = 12,
			CERR_Club_Not_Exist = 13,
			CERR_Only_Creator_Can_Invite = 14,
			CERR_Only_Creator_And_Mgr_Can_Approve = 15,
			CERR_No_Applicant = 16,
			CERR_Applicant_Already_In_Club = 17,
			CERR_Applicant_In_Club_Block_List = 18,
			CERR_Token_Invalid = 19,
			CERR_Club_Name_Too_Long = 20,
			CERR_Club_Name_Exist = 21,
			CERR_Club_Only_Owner_Can_Disband = 22,
			CERR_Owner_Can_not_quit = 23,
			CERR_User_Not_In_Club = 24,
			CERR_Club_Only_Owner_And_Mgr_Can_Set = 25,
			CERR_Club_Forbit_Join = 26,
			CERR_Input_Text_Too_Long = 27,
			CERR_Club_Has_Room_In_PlayingState = 28,
			CERR_Can_Not_Kick_Out_Creator_Or_Mgr = 29,
		}

		enum ClubEventType {
			CEVT_None = 0,
			CEVT_ClubDisband = 1,
			CEVT_NewApplicant = 2,
			CEVT_Approval = 3,
			CEVT_Deny = 4,
			CEVT_Join = 5,
			CEVT_Quit = 6,
			CEVT_Kickout = 7,
		}

		enum ClubFundEventType {
			CFET_None = 0,
			CFET_Add_By_Shop = 1,
			CFET_Award_By_System = 3,
			CFET_Gift_By_System = 4,
			CFET_Reduce_By_Room = 5,
			CFET_Add_By_Room = 6,
		}

		enum ClubNotifyType {
			CNotify_None = 0,
			CNotify_Change_Member_Role = 1,
			CNotify_Allow_Member_Create_Room = 2,
			CNotify_New_Member_Apply = 3,
			CNotify_Member_Join_Approval = 4,
		}

		interface IMsgClubReply {
			replyCode: number;
			content?: ByteBuffer;
		}

		class MsgClubReply implements IMsgClubReply {
			public replyCode: number;
			public content: ByteBuffer;
			constructor(properties?: club.IMsgClubReply);
			public static encode(message: MsgClubReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubReply;
		}

		interface IMsgClubDisplayInfo {
			nick: string;
			gender?: number;
			headIconURL?: string;
			avatarID?: number;
		}

		class MsgClubDisplayInfo implements IMsgClubDisplayInfo {
			public nick: string;
			public gender: number;
			public headIconURL: string;
			public avatarID: number;
			constructor(properties?: club.IMsgClubDisplayInfo);
			public static encode(message: MsgClubDisplayInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubDisplayInfo;
		}

		interface IMsgClubMemberInfo {
			userID: string;
			displayInfo?: club.IMsgClubDisplayInfo;
			online?: boolean;
			role?: number;
			allowCreateRoom?: boolean;
		}

		class MsgClubMemberInfo implements IMsgClubMemberInfo {
			public userID: string;
			public displayInfo: club.IMsgClubDisplayInfo;
			public online: boolean;
			public role: number;
			public allowCreateRoom: boolean;
			constructor(properties?: club.IMsgClubMemberInfo);
			public static encode(message: MsgClubMemberInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubMemberInfo;
		}

		interface IMsgClubBaseInfo {
			clubNumber: string;
			clubName?: string;
			clubID?: string;
		}

		class MsgClubBaseInfo implements IMsgClubBaseInfo {
			public clubNumber: string;
			public clubName: string;
			public clubID: string;
			constructor(properties?: club.IMsgClubBaseInfo);
			public static encode(message: MsgClubBaseInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubBaseInfo;
		}

		interface IMsgCubOperGenericReply {
			errorCode: number;
			extra?: string;
		}

		class MsgCubOperGenericReply implements IMsgCubOperGenericReply {
			public errorCode: number;
			public extra: string;
			constructor(properties?: club.IMsgCubOperGenericReply);
			public static encode(message: MsgCubOperGenericReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgCubOperGenericReply;
		}

		interface IMsgClubInfo {
			baseInfo?: club.IMsgClubBaseInfo;
			creatorUserID?: string;
			clubLevel?: number;
			points?: number;
			wanka?: number;
			candy?: number;
			maxMember?: number;
			joinForbit?: boolean;
			hasUnReadEvents?: boolean;
			createRoomOptions?: string;
			memberCount?: number;
			managers?: string[];
			createTime?: number;
		}

		class MsgClubInfo implements IMsgClubInfo {
			public baseInfo: club.IMsgClubBaseInfo;
			public creatorUserID: string;
			public clubLevel: number;
			public points: number;
			public wanka: number;
			public candy: number;
			public maxMember: number;
			public joinForbit: boolean;
			public hasUnReadEvents: boolean;
			public createRoomOptions: string;
			public memberCount: number;
			public managers: string[];
			public createTime: number;
			constructor(properties?: club.IMsgClubInfo);
			public static encode(message: MsgClubInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubInfo;
		}

		interface IMsgClubLoadMyClubsReply {
			clubs?: club.IMsgClubInfo[];
		}

		class MsgClubLoadMyClubsReply implements IMsgClubLoadMyClubsReply {
			public clubs: club.IMsgClubInfo[];
			constructor(properties?: club.IMsgClubLoadMyClubsReply);
			public static encode(message: MsgClubLoadMyClubsReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadMyClubsReply;
		}

		interface IMsgClubLoadUpdateReply {
			clubsUpdated?: club.IMsgClubInfo[];
			clubIDsRemoved?: string[];
		}

		class MsgClubLoadUpdateReply implements IMsgClubLoadUpdateReply {
			public clubsUpdated: club.IMsgClubInfo[];
			public clubIDsRemoved: string[];
			constructor(properties?: club.IMsgClubLoadUpdateReply);
			public static encode(message: MsgClubLoadUpdateReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadUpdateReply;
		}

		interface IMsgClubLoadMembersReply {
			members?: club.IMsgClubMemberInfo[];
			cursor?: number;
		}

		class MsgClubLoadMembersReply implements IMsgClubLoadMembersReply {
			public members: club.IMsgClubMemberInfo[];
			public cursor: number;
			constructor(properties?: club.IMsgClubLoadMembersReply);
			public static encode(message: MsgClubLoadMembersReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadMembersReply;
		}

		interface IMsgCreateClubReply {
			clubInfo?: club.IMsgClubInfo;
		}

		class MsgCreateClubReply implements IMsgCreateClubReply {
			public clubInfo: club.IMsgClubInfo;
			constructor(properties?: club.IMsgCreateClubReply);
			public static encode(message: MsgCreateClubReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgCreateClubReply;
		}

		interface IMsgClubEvent {
			evtType: number;
			Id: number;
			generatedTime: number;
			to?: string;
			content?: ByteBuffer;
			unread?: boolean;
			needHandle?: boolean;
			userID1?: string;
			displayInfo1?: club.IMsgClubDisplayInfo;
			approvalResult?: number;
		}

		class MsgClubEvent implements IMsgClubEvent {
			public evtType: number;
			public Id: number;
			public generatedTime: number;
			public to: string;
			public content: ByteBuffer;
			public unread: boolean;
			public needHandle: boolean;
			public userID1: string;
			public displayInfo1: club.IMsgClubDisplayInfo;
			public approvalResult: number;
			constructor(properties?: club.IMsgClubEvent);
			public static encode(message: MsgClubEvent): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubEvent;
		}

		interface IMsgClubLoadEventsReply {
			events?: club.IMsgClubEvent[];
			cursor?: number;
		}

		class MsgClubLoadEventsReply implements IMsgClubLoadEventsReply {
			public events: club.IMsgClubEvent[];
			public cursor: number;
			constructor(properties?: club.IMsgClubLoadEventsReply);
			public static encode(message: MsgClubLoadEventsReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadEventsReply;
		}

		interface IMsgClubRoomInfo {
			roomType: number;
			roomRuleJSON?: string;
			playerNumber?: number;
			roomState?: number;
			roomNumber?: string;
			roomUUID?: string;
		}

		class MsgClubRoomInfo implements IMsgClubRoomInfo {
			public roomType: number;
			public roomRuleJSON: string;
			public playerNumber: number;
			public roomState: number;
			public roomNumber: string;
			public roomUUID: string;
			constructor(properties?: club.IMsgClubRoomInfo);
			public static encode(message: MsgClubRoomInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubRoomInfo;
		}

		interface IMsgClubLoadRoomsReply {
			rooms?: club.IMsgClubRoomInfo[];
			cursor?: number;
			totalRoomCount?: number;
		}

		class MsgClubLoadRoomsReply implements IMsgClubLoadRoomsReply {
			public rooms: club.IMsgClubRoomInfo[];
			public cursor: number;
			public totalRoomCount: number;
			constructor(properties?: club.IMsgClubLoadRoomsReply);
			public static encode(message: MsgClubLoadRoomsReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadRoomsReply;
		}

		interface IMsgClubFundEvent {
			evtType: number;
			generatedTime: number;
			userID: string;
			amount: number;
			total: number;
		}

		class MsgClubFundEvent implements IMsgClubFundEvent {
			public evtType: number;
			public generatedTime: number;
			public userID: string;
			public amount: number;
			public total: number;
			constructor(properties?: club.IMsgClubFundEvent);
			public static encode(message: MsgClubFundEvent): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubFundEvent;
		}

		interface IMsgClubLoadFundEventsReply {
			events?: club.IMsgClubFundEvent[];
			cursor?: number;
		}

		class MsgClubLoadFundEventsReply implements IMsgClubLoadFundEventsReply {
			public events: club.IMsgClubFundEvent[];
			public cursor: number;
			constructor(properties?: club.IMsgClubLoadFundEventsReply);
			public static encode(message: MsgClubLoadFundEventsReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadFundEventsReply;
		}

		interface IMsgClubLoadReplayRoomsReply {
			gZipBytes?: ByteBuffer;
			cursor?: number;
		}

		class MsgClubLoadReplayRoomsReply implements IMsgClubLoadReplayRoomsReply {
			public gZipBytes: ByteBuffer;
			public cursor: number;
			constructor(properties?: club.IMsgClubLoadReplayRoomsReply);
			public static encode(message: MsgClubLoadReplayRoomsReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadReplayRoomsReply;
		}

		interface IMsgClubApplyRecord {
			clubID: string;
			clubNumber?: string;
			clubName?: string;
			approvalResult?: number;
			eventID?: number;
			timeStamp?: Long;
		}

		class MsgClubApplyRecord implements IMsgClubApplyRecord {
			public clubID: string;
			public clubNumber: string;
			public clubName: string;
			public approvalResult: number;
			public eventID: number;
			public timeStamp: Long;
			constructor(properties?: club.IMsgClubApplyRecord);
			public static encode(message: MsgClubApplyRecord): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubApplyRecord;
		}

		interface IMsgClubLoadApplyRecordReply {
			records?: club.IMsgClubApplyRecord[];
			cursor?: number;
		}

		class MsgClubLoadApplyRecordReply implements IMsgClubLoadApplyRecordReply {
			public records: club.IMsgClubApplyRecord[];
			public cursor: number;
			constructor(properties?: club.IMsgClubLoadApplyRecordReply);
			public static encode(message: MsgClubLoadApplyRecordReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubLoadApplyRecordReply;
		}

		interface IMsgClubNotify {
			notifyType: number;
			clubID?: string;
			content?: ByteBuffer;
		}

		class MsgClubNotify implements IMsgClubNotify {
			public notifyType: number;
			public clubID: string;
			public content: ByteBuffer;
			constructor(properties?: club.IMsgClubNotify);
			public static encode(message: MsgClubNotify): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubNotify;
		}

		interface IMsgClubSetRoomOptions {
			options: string;
		}

		class MsgClubSetRoomOptions implements IMsgClubSetRoomOptions {
			public options: string;
			constructor(properties?: club.IMsgClubSetRoomOptions);
			public static encode(message: MsgClubSetRoomOptions): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgClubSetRoomOptions;
		}

	}
	export namespace lobby {
		enum MsgError {
			ErrSuccess = 0,
			ErrDecode = 1,
			ErrEncode = 2,
			ErrRoomExist = 3,
			ErrNoRoomConfig = 4,
			ErrServerIsFull = 5,
			ErrDecodeRoomConfig = 6,
			ErrRoomNotExist = 7,
			ErrDatabase = 8,
			ErrRequestGameServerTimeOut = 9,
			ErrWaitGameServerSN = 10,
			ErrRoomIDIsEmpty = 11,
			ErrNotRoomCreater = 12,
			ErrGameIsPlaying = 13,
			ErrTokenIsEmpty = 14,
			ErrUserIdIsEmpty = 15,
			ErrRoomNumberIsEmpty = 16,
			ErrRoomNumberNotExist = 17,
			ErrGameServerIDNotExist = 18,
			ErrRoomCountIsOutOfLimit = 19,
			ErrRequestInvalidParam = 20,
			ErrTakeoffDiamondFailedNotEnough = 21,
			ErrTakeoffDiamondFailedIO = 22,
			ErrTakeoffDiamondFailedRepeat = 23,
			ErrGameServerUnsupportRoomType = 24,
			ErrGameServerRoomExist = 25,
			ErrGameServerNoRoomConfig = 26,
			ErrGameServerDecodeRoomConfig = 27,
			ErrGameServerRoomNotExist = 28,
			ErrUserInOtherRoom = 29,
			ErrRoomIsFull = 30,
			ErrUserInBlacklist = 31,
			ErrClubIDIsEmtpy = 32,
			ErrRoomPriceCfgNotExist = 33,
			ErrUserCreateRoomLock = 34,
			ErrGenerateRoomNumber = 35,
			ErrIsNeedUpdate = 36,
			ErrOnlyClubCreatorOrManagerAllowCreateRoom = 37,
			ErrOnlyClubCreatorOrManagerAllowDeleteRoom = 38,
			ErrNotClubMember = 39,
		}

		enum MessageCode {
			OPInvalid = 0,
			OPConnectReply = 1,
			OPChat = 2,
			OPUpdateDiamond = 3,
			OPMail = 4,
			OPClubNotify = 5,
			OPPing = 100,
			OPPong = 101,
		}

		enum RoomType {
			DafengMJ = 1,
			GuanDang = 2,
			DongTaiMJ = 3,
			YanChengMJ = 4,
			ShaoGuanMJ = 5,
			NingAnMJ = 6,
			XinJiangGH = 7,
			DafengGZ = 8,
			Dafeng7w523 = 9,
			NiuNiu = 10,
			DDZ = 11,
			XueLiuMJ = 12,
			LanZhouMJ = 13,
			LLanZouMJ = 14,
			ZhangYeMJ = 15,
		}

		enum OpenRoomType {
			CreateAndEnter = 1,
			CreateForOther = 2,
		}

		enum ChatDataType {
			Text = 0,
			Emoji = 1,
			Voice = 2,
			Buildin = 3,
		}

		enum ChatScopeType {
			UniCast = 0,
			InRoom = 1,
			InServer = 2,
			InAllServers = 3,
		}

		enum LoginState {
			Faild = 0,
			Success = 1,
			UserInBlacklist = 2,
			ParseTokenError = 3,
		}

		enum ActivityType {
			Email = 1,
		}

		enum LoginError {
			ErrLoginSuccess = 0,
			ErrParamDecode = 1,
			ErrParamInvalidCode = 2,
			ErrParamInvalidEncrypteddata = 3,
			ErrParamInvalidIv = 4,
			ErrWxAuthFailed = 5,
			ErrDecodeUserInfoFailed = 6,
			ErrParamAccountIsEmpty = 7,
			ErrParamPasswordIsEmpty = 8,
			ErrAccountNotExist = 9,
			ErrAccountNotSetPassword = 10,
			ErrPasswordNotMatch = 11,
		}

		enum RegisterError {
			ErrRegisterSuccess = 0,
			ErrAccountIsEmpty = 1,
			ErrPasswordIsEmpty = 2,
			ErrAccountExist = 3,
			ErrWriteDatabaseFailed = 4,
		}

		enum WebsocketConnectError {
			ConnectSuccess = 0,
			ParseTokenFailed = 1,
		}

		enum MailAttachmentType {
			Diamond = 1,
		}

		interface ILobbyMessage {
			Ops: number;
			Data?: ByteBuffer;
		}

		class LobbyMessage implements ILobbyMessage {
			public Ops: number;
			public Data: ByteBuffer;
			constructor(properties?: lobby.ILobbyMessage);
			public static encode(message: LobbyMessage): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): LobbyMessage;
		}

		interface IMsgCreateRoomReq {
			config: string;
		}

		class MsgCreateRoomReq implements IMsgCreateRoomReq {
			public config: string;
			constructor(properties?: lobby.IMsgCreateRoomReq);
			public static encode(message: MsgCreateRoomReq): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgCreateRoomReq;
		}

		interface IUserProfile {
			userID: string;
			nickName?: string;
			avatarURL?: string;
		}

		class UserProfile implements IUserProfile {
			public userID: string;
			public nickName: string;
			public avatarURL: string;
			constructor(properties?: lobby.IUserProfile);
			public static encode(message: UserProfile): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): UserProfile;
		}

		interface IRoomInfo {
			roomID: string;
			roomNumber: string;
			gameServerID: string;
			state?: number;
			config?: string;
			timeStamp?: string;
			users?: lobby.IUserProfile[];
			handStartted?: number;
			lastActiveTime?: number;
			propCfg?: string;
			moduleCfg?: string;
		}

		class RoomInfo implements IRoomInfo {
			public roomID: string;
			public roomNumber: string;
			public gameServerID: string;
			public state: number;
			public config: string;
			public timeStamp: string;
			public users: lobby.IUserProfile[];
			public handStartted: number;
			public lastActiveTime: number;
			public propCfg: string;
			public moduleCfg: string;
			constructor(properties?: lobby.IRoomInfo);
			public static encode(message: RoomInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): RoomInfo;
		}

		interface IMsgCreateRoomRsp {
			result: number;
			roomInfo?: lobby.IRoomInfo;
			retMsg?: string;
			diamond?: number;
		}

		class MsgCreateRoomRsp implements IMsgCreateRoomRsp {
			public result: number;
			public roomInfo: lobby.IRoomInfo;
			public retMsg: string;
			public diamond: number;
			constructor(properties?: lobby.IMsgCreateRoomRsp);
			public static encode(message: MsgCreateRoomRsp): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgCreateRoomRsp;
		}

		interface IMsgDeleteRoomReply {
			result: number;
		}

		class MsgDeleteRoomReply implements IMsgDeleteRoomReply {
			public result: number;
			constructor(properties?: lobby.IMsgDeleteRoomReply);
			public static encode(message: MsgDeleteRoomReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgDeleteRoomReply;
		}

		interface IMsgChat {
			scope: number;
			from?: string;
			to?: string;
			dataType: number;
			data: ByteBuffer;
			id?: string;
		}

		class MsgChat implements IMsgChat {
			public scope: number;
			public from: string;
			public to: string;
			public dataType: number;
			public data: ByteBuffer;
			public id: string;
			constructor(properties?: lobby.IMsgChat);
			public static encode(message: MsgChat): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgChat;
		}

		interface IMsgLoadUnreadChatReply {
			msgs?: lobby.IMsgChat[];
			cursor?: number;
		}

		class MsgLoadUnreadChatReply implements IMsgLoadUnreadChatReply {
			public msgs: lobby.IMsgChat[];
			public cursor: number;
			constructor(properties?: lobby.IMsgLoadUnreadChatReply);
			public static encode(message: MsgLoadUnreadChatReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgLoadUnreadChatReply;
		}

		interface IMsgSetReadChat {
			ids?: number[];
		}

		class MsgSetReadChat implements IMsgSetReadChat {
			public ids: number[];
			constructor(properties?: lobby.IMsgSetReadChat);
			public static encode(message: MsgSetReadChat): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgSetReadChat;
		}

		interface IRoomIDList {
			roomIDs?: string[];
		}

		class RoomIDList implements IRoomIDList {
			public roomIDs: string[];
			constructor(properties?: lobby.IRoomIDList);
			public static encode(message: RoomIDList): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): RoomIDList;
		}

		interface IMsgLoadRoomListRsp {
			result: number;
			roomInfos?: lobby.IRoomInfo[];
			retMsg?: string;
		}

		class MsgLoadRoomListRsp implements IMsgLoadRoomListRsp {
			public result: number;
			public roomInfos: lobby.IRoomInfo[];
			public retMsg: string;
			constructor(properties?: lobby.IMsgLoadRoomListRsp);
			public static encode(message: MsgLoadRoomListRsp): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgLoadRoomListRsp;
		}

		interface IMsgUpdateUserInfo {
			location: string;
		}

		class MsgUpdateUserInfo implements IMsgUpdateUserInfo {
			public location: string;
			constructor(properties?: lobby.IMsgUpdateUserInfo);
			public static encode(message: MsgUpdateUserInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgUpdateUserInfo;
		}

		interface IRoomCost {
			handNum: number;
			pay: number;
		}

		class RoomCost implements IRoomCost {
			public handNum: number;
			public pay: number;
			constructor(properties?: lobby.IRoomCost);
			public static encode(message: RoomCost): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): RoomCost;
		}

		interface IMsgRequestRoomInfo {
			roomNumber: string;
		}

		class MsgRequestRoomInfo implements IMsgRequestRoomInfo {
			public roomNumber: string;
			constructor(properties?: lobby.IMsgRequestRoomInfo);
			public static encode(message: MsgRequestRoomInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRequestRoomInfo;
		}

		interface IMsgRequestRoomInfoRsp {
			result: number;
			roomInfo?: lobby.IRoomInfo;
			retMsg?: string;
		}

		class MsgRequestRoomInfoRsp implements IMsgRequestRoomInfoRsp {
			public result: number;
			public roomInfo: lobby.IRoomInfo;
			public retMsg: string;
			constructor(properties?: lobby.IMsgRequestRoomInfoRsp);
			public static encode(message: MsgRequestRoomInfoRsp): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRequestRoomInfoRsp;
		}

		interface IMsgUpdateRoomState {
			state: number;
			roomID: string;
			users?: lobby.IUserProfile[];
			handStartted: number;
			lastActiveTime: number;
		}

		class MsgUpdateRoomState implements IMsgUpdateRoomState {
			public state: number;
			public roomID: string;
			public users: lobby.IUserProfile[];
			public handStartted: number;
			public lastActiveTime: number;
			constructor(properties?: lobby.IMsgUpdateRoomState);
			public static encode(message: MsgUpdateRoomState): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgUpdateRoomState;
		}

		interface IMsgUpdateRoomList {
			roomInfos?: lobby.IRoomInfo[];
		}

		class MsgUpdateRoomList implements IMsgUpdateRoomList {
			public roomInfos: lobby.IRoomInfo[];
			constructor(properties?: lobby.IMsgUpdateRoomList);
			public static encode(message: MsgUpdateRoomList): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgUpdateRoomList;
		}

		interface IMsgRequestUserScoreInfo {
			userID: string;
			gameID?: string;
		}

		class MsgRequestUserScoreInfo implements IMsgRequestUserScoreInfo {
			public userID: string;
			public gameID: string;
			constructor(properties?: lobby.IMsgRequestUserScoreInfo);
			public static encode(message: MsgRequestUserScoreInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRequestUserScoreInfo;
		}

		interface IMsgRequestUserScoreInfoRsp {
			maxWinScore: number;
			customCount: number;
			maxWinMoney?: number;
			coinCount?: number;
			retMsg?: string;
		}

		class MsgRequestUserScoreInfoRsp implements IMsgRequestUserScoreInfoRsp {
			public maxWinScore: number;
			public customCount: number;
			public maxWinMoney: number;
			public coinCount: number;
			public retMsg: string;
			constructor(properties?: lobby.IMsgRequestUserScoreInfoRsp);
			public static encode(message: MsgRequestUserScoreInfoRsp): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRequestUserScoreInfoRsp;
		}

		interface IMsgLoadUserHeadIconURI {
			userIDs?: string[];
		}

		class MsgLoadUserHeadIconURI implements IMsgLoadUserHeadIconURI {
			public userIDs: string[];
			constructor(properties?: lobby.IMsgLoadUserHeadIconURI);
			public static encode(message: MsgLoadUserHeadIconURI): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgLoadUserHeadIconURI;
		}

		interface IMsgHeadIconInfo {
			userID: string;
			gender?: number;
			headIconURI?: string;
		}

		class MsgHeadIconInfo implements IMsgHeadIconInfo {
			public userID: string;
			public gender: number;
			public headIconURI: string;
			constructor(properties?: lobby.IMsgHeadIconInfo);
			public static encode(message: MsgHeadIconInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgHeadIconInfo;
		}

		interface IMsgLoadUserHeadIconURIReply {
			result: number;
			headIconInfos?: lobby.IMsgHeadIconInfo[];
			retMsg?: string;
		}

		class MsgLoadUserHeadIconURIReply implements IMsgLoadUserHeadIconURIReply {
			public result: number;
			public headIconInfos: lobby.IMsgHeadIconInfo[];
			public retMsg: string;
			constructor(properties?: lobby.IMsgLoadUserHeadIconURIReply);
			public static encode(message: MsgLoadUserHeadIconURIReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgLoadUserHeadIconURIReply;
		}

		interface IMsgUpdateUserDiamond {
			diamond: Long;
		}

		class MsgUpdateUserDiamond implements IMsgUpdateUserDiamond {
			public diamond: Long;
			constructor(properties?: lobby.IMsgUpdateUserDiamond);
			public static encode(message: MsgUpdateUserDiamond): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgUpdateUserDiamond;
		}

		interface IMsgAccReplayRoom {
			replayRoomBytes: ByteBuffer;
			recordRoomType: number;
		}

		class MsgAccReplayRoom implements IMsgAccReplayRoom {
			public replayRoomBytes: ByteBuffer;
			public recordRoomType: number;
			constructor(properties?: lobby.IMsgAccReplayRoom);
			public static encode(message: MsgAccReplayRoom): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgAccReplayRoom;
		}

		interface IMsgAccLoadReplayRoomsReply {
			replayRooms?: lobby.IMsgAccReplayRoom[];
			cursor?: number;
			totalCursor?: number;
		}

		class MsgAccLoadReplayRoomsReply implements IMsgAccLoadReplayRoomsReply {
			public replayRooms: lobby.IMsgAccReplayRoom[];
			public cursor: number;
			public totalCursor: number;
			constructor(properties?: lobby.IMsgAccLoadReplayRoomsReply);
			public static encode(message: MsgAccLoadReplayRoomsReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgAccLoadReplayRoomsReply;
		}

		interface IMsgAccLoadReplayRecord {
			replayRecordBytes: ByteBuffer;
			roomJSONConfig: string;
		}

		class MsgAccLoadReplayRecord implements IMsgAccLoadReplayRecord {
			public replayRecordBytes: ByteBuffer;
			public roomJSONConfig: string;
			constructor(properties?: lobby.IMsgAccLoadReplayRecord);
			public static encode(message: MsgAccLoadReplayRecord): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgAccLoadReplayRecord;
		}

		interface IUserInfo {
			userID: string;
			openID?: string;
			nickName?: string;
			gender?: number;
			province?: string;
			city?: string;
			country?: string;
			headImgUrl?: string;
			phone?: string;
			diamond?: Long;
		}

		class UserInfo implements IUserInfo {
			public userID: string;
			public openID: string;
			public nickName: string;
			public gender: number;
			public province: string;
			public city: string;
			public country: string;
			public headImgUrl: string;
			public phone: string;
			public diamond: Long;
			constructor(properties?: lobby.IUserInfo);
			public static encode(message: UserInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): UserInfo;
		}

		interface IMsgWxLogin {
			code: string;
			encrypteddata: string;
			iv: string;
		}

		class MsgWxLogin implements IMsgWxLogin {
			public code: string;
			public encrypteddata: string;
			public iv: string;
			constructor(properties?: lobby.IMsgWxLogin);
			public static encode(message: MsgWxLogin): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgWxLogin;
		}

		interface IMsgLoginReply {
			result: number;
			token?: string;
			userInfo?: lobby.IUserInfo;
			lastRoomInfo?: lobby.IRoomInfo;
		}

		class MsgLoginReply implements IMsgLoginReply {
			public result: number;
			public token: string;
			public userInfo: lobby.IUserInfo;
			public lastRoomInfo: lobby.IRoomInfo;
			constructor(properties?: lobby.IMsgLoginReply);
			public static encode(message: MsgLoginReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgLoginReply;
		}

		interface IClientInfo {
			qMod?: string;
			modV?: string;
			csVer?: string;
			lobbyVer?: string;
			operatingSystem?: string;
			operatingSystemFamily?: string;
			deviceUniqueIdentifier?: string;
			deviceName?: string;
			deviceModel?: string;
			network?: string;
		}

		class ClientInfo implements IClientInfo {
			public qMod: string;
			public modV: string;
			public csVer: string;
			public lobbyVer: string;
			public operatingSystem: string;
			public operatingSystemFamily: string;
			public deviceUniqueIdentifier: string;
			public deviceName: string;
			public deviceModel: string;
			public network: string;
			constructor(properties?: lobby.IClientInfo);
			public static encode(message: ClientInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): ClientInfo;
		}

		interface IMsgRegisterReply {
			result: number;
			token?: string;
		}

		class MsgRegisterReply implements IMsgRegisterReply {
			public result: number;
			public token: string;
			constructor(properties?: lobby.IMsgRegisterReply);
			public static encode(message: MsgRegisterReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRegisterReply;
		}

		interface IMsgQuicklyLoginReply {
			result: number;
			token?: string;
			account?: string;
			userInfo?: lobby.IUserInfo;
			lastRoomInfo?: lobby.IRoomInfo;
		}

		class MsgQuicklyLoginReply implements IMsgQuicklyLoginReply {
			public result: number;
			public token: string;
			public account: string;
			public userInfo: lobby.IUserInfo;
			public lastRoomInfo: lobby.IRoomInfo;
			constructor(properties?: lobby.IMsgQuicklyLoginReply);
			public static encode(message: MsgQuicklyLoginReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgQuicklyLoginReply;
		}

		interface IMsgWebsocketConnectReply {
			result: number;
		}

		class MsgWebsocketConnectReply implements IMsgWebsocketConnectReply {
			public result: number;
			constructor(properties?: lobby.IMsgWebsocketConnectReply);
			public static encode(message: MsgWebsocketConnectReply): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgWebsocketConnectReply;
		}

		interface IMsgReplayPlayerInfo {
			userID: string;
			nick?: string;
			chairID: number;
			totalScore?: number;
			gender?: number;
			headIconURI?: string;
			avatarID?: number;
		}

		class MsgReplayPlayerInfo implements IMsgReplayPlayerInfo {
			public userID: string;
			public nick: string;
			public chairID: number;
			public totalScore: number;
			public gender: number;
			public headIconURI: string;
			public avatarID: number;
			constructor(properties?: lobby.IMsgReplayPlayerInfo);
			public static encode(message: MsgReplayPlayerInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayPlayerInfo;
		}

		interface IMsgReplayPlayerScoreSummary {
			chairID: number;
			score: number;
			winType: number;
		}

		class MsgReplayPlayerScoreSummary implements IMsgReplayPlayerScoreSummary {
			public chairID: number;
			public score: number;
			public winType: number;
			constructor(properties?: lobby.IMsgReplayPlayerScoreSummary);
			public static encode(message: MsgReplayPlayerScoreSummary): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayPlayerScoreSummary;
		}

		interface IMsgReplayRecordSummary {
			recordUUID: string;
			playerScores?: lobby.IMsgReplayPlayerScoreSummary[];
			endTime: number;
			shareAbleID?: string;
			startTime?: number;
		}

		class MsgReplayRecordSummary implements IMsgReplayRecordSummary {
			public recordUUID: string;
			public playerScores: lobby.IMsgReplayPlayerScoreSummary[];
			public endTime: number;
			public shareAbleID: string;
			public startTime: number;
			constructor(properties?: lobby.IMsgReplayRecordSummary);
			public static encode(message: MsgReplayRecordSummary): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayRecordSummary;
		}

		interface IMsgReplayRoom {
			recordRoomType: number;
			startTime: number;
			endTime: number;
			roomNumber: string;
			players?: lobby.IMsgReplayPlayerInfo[];
			records?: lobby.IMsgReplayRecordSummary[];
			ownerUserID?: string;
		}

		class MsgReplayRoom implements IMsgReplayRoom {
			public recordRoomType: number;
			public startTime: number;
			public endTime: number;
			public roomNumber: string;
			public players: lobby.IMsgReplayPlayerInfo[];
			public records: lobby.IMsgReplayRecordSummary[];
			public ownerUserID: string;
			constructor(properties?: lobby.IMsgReplayRoom);
			public static encode(message: MsgReplayRoom): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayRoom;
		}

		interface IMailAttachments {
			type: number;
			num: number;
			isReceive?: boolean;
		}

		class MailAttachments implements IMailAttachments {
			public type: number;
			public num: number;
			public isReceive: boolean;
			constructor(properties?: lobby.IMailAttachments);
			public static encode(message: MailAttachments): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MailAttachments;
		}

		interface IMsgMail {
			id: string;
			title?: string;
			content?: string;
			attachments?: lobby.IMailAttachments;
			isRead?: boolean;
			timeStamp?: Long;
		}

		class MsgMail implements IMsgMail {
			public id: string;
			public title: string;
			public content: string;
			public attachments: lobby.IMailAttachments;
			public isRead: boolean;
			public timeStamp: Long;
			constructor(properties?: lobby.IMsgMail);
			public static encode(message: MsgMail): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgMail;
		}

		interface IMsgLoadMail {
			mails?: lobby.IMsgMail[];
			cursor?: number;
		}

		class MsgLoadMail implements IMsgLoadMail {
			public mails: lobby.IMsgMail[];
			public cursor: number;
			constructor(properties?: lobby.IMsgLoadMail);
			public static encode(message: MsgLoadMail): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgLoadMail;
		}

		interface IMsgShareInfo {
			result: number;
			text?: string;
			multimedia?: string;
		}

		class MsgShareInfo implements IMsgShareInfo {
			public result: number;
			public text: string;
			public multimedia: string;
			constructor(properties?: lobby.IMsgShareInfo);
			public static encode(message: MsgShareInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgShareInfo;
		}

	}
}
