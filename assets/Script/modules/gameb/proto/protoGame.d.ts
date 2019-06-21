export namespace proto {
	export namespace dfmahjong {
		enum GreatWinType {
			enumGreatWinType_None = 0,
			enumGreatWinType_ChowPongKong = 1,
			enumGreatWinType_FinalDraw = 2,
			enumGreatWinType_PongKong = 4,
			enumGreatWinType_PureSame = 8,
			enumGreatWinType_MixedSame = 16,
			enumGreatWinType_ClearFront = 32,
			enumGreatWinType_SevenPair = 64,
			enumGreatWinType_GreatSevenPair = 128,
			enumGreatWinType_Heaven = 256,
			enumGreatWinType_AfterConcealedKong = 512,
			enumGreatWinType_AfterExposedKong = 1024,
			enumGreatWinType_Richi = 2048,
			enumGreatWinType_PongKongWithFlowerNoMeld = 4096,
			enumGreatWinType_PureSameWithFlowerNoMeld = 8192,
			enumGreatWinType_MixSameWithFlowerNoMeld = 16384,
			enumGreatWinType_PureSameWithMeld = 32768,
			enumGreatWinType_MixSameWithMeld = 65536,
			enumGreatWinType_RobKong = 131072,
			enumGreatWinType_OpponentsRichi = 262144,
		}

		enum MiniWinType {
			enumMiniWinType_None = 0,
			enumMiniWinType_Continuous_Banker = 1,
			enumMiniWinType_SelfDraw = 2,
			enumMiniWinType_NoFlowers = 4,
			enumMiniWinType_Kong2Discard = 8,
			enumMiniWinType_Kong2SelfDraw = 16,
			enumMiniWinType_SecondFrontClear = 32,
			enumMiniWinType_PongSelfDrawn = 64,
			enumMiniWinType_ChowPongkong = 128,
			enumMiniWinType_Richi = 256,
			enumMiniWinType_SevenPair = 512,
			enumMiniWinType_PureSameWithMeld = 1024,
			enumMiniWinType_MixSameWithMeld = 2048,
		}

	}
	export namespace mahjong {
		enum SRFlags {
			SRNone = 0,
			SRUserReplyOnly = 1,
			SRRichi = 2,
			SRFlyRichi = 4,
		}

		enum RoomState {
			SRoomIdle = 0,
			SRoomWaiting = 1,
			SRoomPlaying = 2,
			SRoomDeleted = 3,
		}

		enum PlayerState {
			PSNone = 0,
			PSReady = 1,
			PSOffline = 2,
			PSPlaying = 3,
		}

		enum DisbandState {
			Waiting = 1,
			Done = 2,
			DoneWithOtherReject = 3,
			DoneWithRoomServerNotResponse = 4,
			DoneWithWaitReplyTimeout = 5,
			ErrorDuplicateAcquire = 6,
			ErrorNeedOwnerWhenGameNotStart = 7,
		}

		enum TipCode {
			TCNone = 0,
			TCWaitOpponentsAction = 1,
			TCDonateFailedNoEnoughDiamond = 2,
		}

		enum RoomDeleteReason {
			IdleTimeout = 1,
			DisbandByOwnerFromRMS = 2,
			DisbandByApplication = 3,
			DisbandBySystem = 4,
			DisbandMaxHand = 5,
			DisbandInLoseProtected = 6,
		}

		enum KickoutResult {
			KickoutResult_Success = 1,
			KickoutResult_FailedGameHasStartted = 2,
			KickoutResult_FailedNeedOwner = 3,
			KickoutResult_FailedPlayerNotExist = 4,
		}

		enum EnterRoomStatus {
			Success = 0,
			RoomNotExist = 1,
			RoomIsFulled = 2,
			RoomPlaying = 3,
			InAnotherRoom = 4,
			MonkeyRoomUserIDNotMatch = 5,
			MonkeyRoomUserLoginSeqNotMatch = 6,
			AppModuleNeedUpgrade = 7,
			InRoomBlackList = 8,
			TakeoffDiamondFailedNotEnough = 9,
			TakeoffDiamondFailedIO = 10,
			ParseTokenError = 11,
			RoomInApplicateDisband = 12,
			NotClubMember = 13,
		}

		enum TileID {
			enumTid_MAN1 = 0,
			enumTid_MAN2 = 1,
			enumTid_MAN3 = 2,
			enumTid_MAN4 = 3,
			enumTid_MAN5 = 4,
			enumTid_MAN6 = 5,
			enumTid_MAN7 = 6,
			enumTid_MAN8 = 7,
			enumTid_MAN9 = 8,
			enumTid_PIN1 = 9,
			enumTid_PIN2 = 10,
			enumTid_PIN3 = 11,
			enumTid_PIN4 = 12,
			enumTid_PIN5 = 13,
			enumTid_PIN6 = 14,
			enumTid_PIN7 = 15,
			enumTid_PIN8 = 16,
			enumTid_PIN9 = 17,
			enumTid_SOU1 = 18,
			enumTid_SOU2 = 19,
			enumTid_SOU3 = 20,
			enumTid_SOU4 = 21,
			enumTid_SOU5 = 22,
			enumTid_SOU6 = 23,
			enumTid_SOU7 = 24,
			enumTid_SOU8 = 25,
			enumTid_SOU9 = 26,
			enumTid_TON = 27,
			enumTid_NAN = 28,
			enumTid_SHA = 29,
			enumTid_PEI = 30,
			enumTid_HAK = 31,
			enumTid_HAT = 32,
			enumTid_CHU = 33,
			enumTid_PLUM = 34,
			enumTid_ORCHID = 35,
			enumTid_BAMBOO = 36,
			enumTid_CHRYSANTHEMUM = 37,
			enumTid_SPRING = 38,
			enumTid_SUMMER = 39,
			enumTid_AUTUMN = 40,
			enumTid_WINTER = 41,
			enumTid_MAX = 42,
		}

		enum MessageCode {
			OPInvalid = 0,
			OPAction = 1,
			OPActionResultNotify = 2,
			OPActionAllowed = 3,
			OPReActionAllowed = 5,
			OPDeal = 6,
			OPHandOver = 7,
			OPRestore = 8,
			OPPlayerLeaveRoom = 9,
			OPPlayerEnterRoom = 10,
			OPDisbandRequest = 11,
			OPDisbandNotify = 12,
			OPDisbandAnswer = 13,
			OPPlayerReady = 14,
			OPRoomDeleted = 15,
			OPRoomUpdate = 16,
			OPRoomShowTips = 17,
			OPGameOver = 18,
			OPKickout = 19,
			OPDonate = 20,
			OPUpdateLocation = 21,
			OP2Lobby = 22,
			OPUpdatePropCfg = 23,
			OPPing = 100,
			OPPong = 101,
		}

		enum MeldType {
			enumMeldTypeSequence = 0,
			enumMeldTypeTriplet = 1,
			enumMeldTypeExposedKong = 2,
			enumMeldTypeTriplet2Kong = 3,
			enumMeldTypeConcealedKong = 4,
			enumMeldTypeSelfMeld = 5,
			enumMeldTypeChuHH = 6,
			enumMeldTypeChuHH1 = 7,
			enumMeldTypeWind = 8,
			enumMeldTypePairKong = 9,
		}

		enum ActionType {
			enumActionType_SKIP = 1,
			enumActionType_DISCARD = 2,
			enumActionType_DRAW = 4,
			enumActionType_CHOW = 8,
			enumActionType_PONG = 16,
			enumActionType_KONG_Exposed = 32,
			enumActionType_KONG_Concealed = 64,
			enumActionType_WIN_Chuck = 128,
			enumActionType_WIN_SelfDrawn = 256,
			enumActionType_KONG_Triplet2 = 512,
			enumActionType_FirstReadyHand = 1024,
			enumActionType_ReadyHand = 2048,
			enumActionType_CustomA = 4096,
			enumActionType_CustomB = 8192,
			enumActionType_CustomC = 16384,
			enumActionType_CustomD = 32768,
		}

		enum HandOverType {
			enumHandOverType_None = 0,
			enumHandOverType_Win_SelfDrawn = 1,
			enumHandOverType_Win_Chuck = 2,
			enumHandOverType_Chucker = 3,
			enumHandOverType_Konger = 4,
			enumHandOverType_Win_RobKong = 5,
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
			constructor(properties?: mahjong.IMsgReplayPlayerInfo);
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
			constructor(properties?: mahjong.IMsgReplayPlayerScoreSummary);
			public static encode(message: MsgReplayPlayerScoreSummary): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayPlayerScoreSummary;
		}

		interface IMsgReplayRecordSummary {
			recordUUID: string;
			playerScores?: mahjong.IMsgReplayPlayerScoreSummary[];
			endTime: number;
			shareAbleID?: string;
			startTime?: number;
		}

		class MsgReplayRecordSummary implements IMsgReplayRecordSummary {
			public recordUUID: string;
			public playerScores: mahjong.IMsgReplayPlayerScoreSummary[];
			public endTime: number;
			public shareAbleID: string;
			public startTime: number;
			constructor(properties?: mahjong.IMsgReplayRecordSummary);
			public static encode(message: MsgReplayRecordSummary): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayRecordSummary;
		}

		interface IMsgReplayRoom {
			recordRoomType: number;
			startTime: number;
			endTime: number;
			roomNumber: string;
			players?: mahjong.IMsgReplayPlayerInfo[];
			records?: mahjong.IMsgReplayRecordSummary[];
			ownerUserID?: string;
		}

		class MsgReplayRoom implements IMsgReplayRoom {
			public recordRoomType: number;
			public startTime: number;
			public endTime: number;
			public roomNumber: string;
			public players: mahjong.IMsgReplayPlayerInfo[];
			public records: mahjong.IMsgReplayRecordSummary[];
			public ownerUserID: string;
			constructor(properties?: mahjong.IMsgReplayRoom);
			public static encode(message: MsgReplayRoom): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReplayRoom;
		}

		interface ISRMsgPlayerInfo {
			userID: string;
			chairID: number;
			nick?: string;
			gender?: number;
			headIconURI?: string;
			avatarID?: number;
		}

		class SRMsgPlayerInfo implements ISRMsgPlayerInfo {
			public userID: string;
			public chairID: number;
			public nick: string;
			public gender: number;
			public headIconURI: string;
			public avatarID: number;
			constructor(properties?: mahjong.ISRMsgPlayerInfo);
			public static encode(message: SRMsgPlayerInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): SRMsgPlayerInfo;
		}

		interface ISRDealDetail {
			chairID: number;
			tilesHand?: number[];
			tilesFlower?: number[];
		}

		class SRDealDetail implements ISRDealDetail {
			public chairID: number;
			public tilesHand: number[];
			public tilesFlower: number[];
			constructor(properties?: mahjong.ISRDealDetail);
			public static encode(message: SRDealDetail): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): SRDealDetail;
		}

		interface ISRAction {
			action: number;
			chairID: number;
			qaIndex: number;
			tiles?: number[];
			flags: number;
			allowActions?: number;
		}

		class SRAction implements ISRAction {
			public action: number;
			public chairID: number;
			public qaIndex: number;
			public tiles: number[];
			public flags: number;
			public allowActions: number;
			constructor(properties?: mahjong.ISRAction);
			public static encode(message: SRAction): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): SRAction;
		}

		interface ISRMsgHandRecorderExtra {
			markup?: number;
			ownerUserID?: string;
		}

		class SRMsgHandRecorderExtra implements ISRMsgHandRecorderExtra {
			public markup: number;
			public ownerUserID: string;
			constructor(properties?: mahjong.ISRMsgHandRecorderExtra);
			public static encode(message: SRMsgHandRecorderExtra): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): SRMsgHandRecorderExtra;
		}

		interface ISRMsgHandRecorder {
			bankerChairID: number;
			windFlowerID: number;
			players?: mahjong.ISRMsgPlayerInfo[];
			isHandOver: boolean;
			deals?: mahjong.ISRDealDetail[];
			actions?: mahjong.ISRAction[];
			handScore?: ByteBuffer;
			roomConfigID?: string;
			startTime?: number;
			endTime?: number;
			handNum?: number;
			isContinuousBanker?: boolean;
			roomNumber?: string;
			roomType?: number;
			extra?: mahjong.ISRMsgHandRecorderExtra;
		}

		class SRMsgHandRecorder implements ISRMsgHandRecorder {
			public bankerChairID: number;
			public windFlowerID: number;
			public players: mahjong.ISRMsgPlayerInfo[];
			public isHandOver: boolean;
			public deals: mahjong.ISRDealDetail[];
			public actions: mahjong.ISRAction[];
			public handScore: ByteBuffer;
			public roomConfigID: string;
			public startTime: number;
			public endTime: number;
			public handNum: number;
			public isContinuousBanker: boolean;
			public roomNumber: string;
			public roomType: number;
			public extra: mahjong.ISRMsgHandRecorderExtra;
			constructor(properties?: mahjong.ISRMsgHandRecorder);
			public static encode(message: SRMsgHandRecorder): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): SRMsgHandRecorder;
		}

		interface IMsgPlayerInfo {
			userID: string;
			chairID: number;
			state: number;
			name?: string;
			nick?: string;
			gender?: number;
			headIconURI?: string;
			ip?: string;
			location?: string;
			dfHands?: number;
			diamond?: number;
			charm?: number;
			avatarID?: number;
			clubIDs?: string[];
			dan?: number;
		}

		class MsgPlayerInfo implements IMsgPlayerInfo {
			public userID: string;
			public chairID: number;
			public state: number;
			public name: string;
			public nick: string;
			public gender: number;
			public headIconURI: string;
			public ip: string;
			public location: string;
			public dfHands: number;
			public diamond: number;
			public charm: number;
			public avatarID: number;
			public clubIDs: string[];
			public dan: number;
			constructor(properties?: mahjong.IMsgPlayerInfo);
			public static encode(message: MsgPlayerInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgPlayerInfo;
		}

		interface IPlayerHandScoreRecord {
			userID: string;
			winType: number;
			score: number;
		}

		class PlayerHandScoreRecord implements IPlayerHandScoreRecord {
			public userID: string;
			public winType: number;
			public score: number;
			constructor(properties?: mahjong.IPlayerHandScoreRecord);
			public static encode(message: PlayerHandScoreRecord): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): PlayerHandScoreRecord;
		}

		interface IMsgRoomHandScoreRecord {
			endType: number;
			handIndex: number;
			playerRecords?: mahjong.IPlayerHandScoreRecord[];
		}

		class MsgRoomHandScoreRecord implements IMsgRoomHandScoreRecord {
			public endType: number;
			public handIndex: number;
			public playerRecords: mahjong.IPlayerHandScoreRecord[];
			constructor(properties?: mahjong.IMsgRoomHandScoreRecord);
			public static encode(message: MsgRoomHandScoreRecord): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRoomHandScoreRecord;
		}

		interface IMsgRoomInfo {
			state: number;
			players?: mahjong.IMsgPlayerInfo[];
			ownerID?: string;
			roomNumber?: string;
			handStartted?: number;
			scoreRecords?: mahjong.IMsgRoomHandScoreRecord[];
			handFinished?: number;
		}

		class MsgRoomInfo implements IMsgRoomInfo {
			public state: number;
			public players: mahjong.IMsgPlayerInfo[];
			public ownerID: string;
			public roomNumber: string;
			public handStartted: number;
			public scoreRecords: mahjong.IMsgRoomHandScoreRecord[];
			public handFinished: number;
			constructor(properties?: mahjong.IMsgRoomInfo);
			public static encode(message: MsgRoomInfo): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRoomInfo;
		}

		interface IRoomScoreRecords {
			scoreRecords?: mahjong.IMsgRoomHandScoreRecord[];
		}

		class RoomScoreRecords implements IRoomScoreRecords {
			public scoreRecords: mahjong.IMsgRoomHandScoreRecord[];
			constructor(properties?: mahjong.IRoomScoreRecords);
			public static encode(message: RoomScoreRecords): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): RoomScoreRecords;
		}

		interface IMsgDisbandAnswer {
			agree: boolean;
		}

		class MsgDisbandAnswer implements IMsgDisbandAnswer {
			public agree: boolean;
			constructor(properties?: mahjong.IMsgDisbandAnswer);
			public static encode(message: MsgDisbandAnswer): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgDisbandAnswer;
		}

		interface IMsgDisbandNotify {
			disbandState: number;
			applicant: number;
			waits?: number[];
			agrees?: number[];
			rejects?: number[];
			countdown?: number;
		}

		class MsgDisbandNotify implements IMsgDisbandNotify {
			public disbandState: number;
			public applicant: number;
			public waits: number[];
			public agrees: number[];
			public rejects: number[];
			public countdown: number;
			constructor(properties?: mahjong.IMsgDisbandNotify);
			public static encode(message: MsgDisbandNotify): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgDisbandNotify;
		}

		interface IMsgGameOverPlayerStat {
			chairID: number;
			score: number;
			winChuckCounter: number;
			winSelfDrawnCounter: number;
			chuckerCounter: number;
			robKongCounter?: number;
			kongerCounter?: number;
		}

		class MsgGameOverPlayerStat implements IMsgGameOverPlayerStat {
			public chairID: number;
			public score: number;
			public winChuckCounter: number;
			public winSelfDrawnCounter: number;
			public chuckerCounter: number;
			public robKongCounter: number;
			public kongerCounter: number;
			constructor(properties?: mahjong.IMsgGameOverPlayerStat);
			public static encode(message: MsgGameOverPlayerStat): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgGameOverPlayerStat;
		}

		interface IMsgGameOver {
			playerStats?: mahjong.IMsgGameOverPlayerStat[];
		}

		class MsgGameOver implements IMsgGameOver {
			public playerStats: mahjong.IMsgGameOverPlayerStat[];
			constructor(properties?: mahjong.IMsgGameOver);
			public static encode(message: MsgGameOver): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgGameOver;
		}

		interface IMsgRoomShowTips {
			tips?: string;
			tipCode: number;
		}

		class MsgRoomShowTips implements IMsgRoomShowTips {
			public tips: string;
			public tipCode: number;
			constructor(properties?: mahjong.IMsgRoomShowTips);
			public static encode(message: MsgRoomShowTips): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRoomShowTips;
		}

		interface IMsgRoomDelete {
			reason: number;
		}

		class MsgRoomDelete implements IMsgRoomDelete {
			public reason: number;
			constructor(properties?: mahjong.IMsgRoomDelete);
			public static encode(message: MsgRoomDelete): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRoomDelete;
		}

		interface IMsgKickout {
			victimUserID: string;
		}

		class MsgKickout implements IMsgKickout {
			public victimUserID: string;
			constructor(properties?: mahjong.IMsgKickout);
			public static encode(message: MsgKickout): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgKickout;
		}

		interface IMsgKickoutResult {
			result: number;
			victimUserID?: string;
			victimNick?: string;
			byWhoNick?: string;
			byWhoUserID?: string;
		}

		class MsgKickoutResult implements IMsgKickoutResult {
			public result: number;
			public victimUserID: string;
			public victimNick: string;
			public byWhoNick: string;
			public byWhoUserID: string;
			constructor(properties?: mahjong.IMsgKickoutResult);
			public static encode(message: MsgKickoutResult): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgKickoutResult;
		}

		interface IMsgEnterRoomResult {
			status: number;
		}

		class MsgEnterRoomResult implements IMsgEnterRoomResult {
			public status: number;
			constructor(properties?: mahjong.IMsgEnterRoomResult);
			public static encode(message: MsgEnterRoomResult): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgEnterRoomResult;
		}

		interface IMsgDonate {
			toChairID: number;
			itemID: number;
			fromChairID?: number;
		}

		class MsgDonate implements IMsgDonate {
			public toChairID: number;
			public itemID: number;
			public fromChairID: number;
			constructor(properties?: mahjong.IMsgDonate);
			public static encode(message: MsgDonate): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgDonate;
		}

		interface IGameMessage {
			Ops: number;
			Data?: ByteBuffer;
		}

		class GameMessage implements IGameMessage {
			public Ops: number;
			public Data: ByteBuffer;
			constructor(properties?: mahjong.IGameMessage);
			public static encode(message: GameMessage): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): GameMessage;
		}

		interface IMsgMeldTile {
			meldType: number;
			tile1: number;
			contributor?: number;
			chowTile?: number;
		}

		class MsgMeldTile implements IMsgMeldTile {
			public meldType: number;
			public tile1: number;
			public contributor: number;
			public chowTile: number;
			constructor(properties?: mahjong.IMsgMeldTile);
			public static encode(message: MsgMeldTile): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgMeldTile;
		}

		interface IMsgPlayerTileList {
			chairID: number;
			tileCountInHand: number;
			tilesHand?: number[];
			tilesFlower?: number[];
			tilesDiscard?: number[];
			melds?: mahjong.IMsgMeldTile[];
		}

		class MsgPlayerTileList implements IMsgPlayerTileList {
			public chairID: number;
			public tileCountInHand: number;
			public tilesHand: number[];
			public tilesFlower: number[];
			public tilesDiscard: number[];
			public melds: mahjong.IMsgMeldTile[];
			constructor(properties?: mahjong.IMsgPlayerTileList);
			public static encode(message: MsgPlayerTileList): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgPlayerTileList;
		}

		interface IMsgDeal {
			bankerChairID: number;
			windFlowerID: number;
			playerTileLists?: mahjong.IMsgPlayerTileList[];
			tilesInWall: number;
			dice1?: number;
			dice2?: number;
			isContinuousBanker?: boolean;
			markup?: number;
		}

		class MsgDeal implements IMsgDeal {
			public bankerChairID: number;
			public windFlowerID: number;
			public playerTileLists: mahjong.IMsgPlayerTileList[];
			public tilesInWall: number;
			public dice1: number;
			public dice2: number;
			public isContinuousBanker: boolean;
			public markup: number;
			constructor(properties?: mahjong.IMsgDeal);
			public static encode(message: MsgDeal): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgDeal;
		}

		interface IMsgReadyHandTips {
			targetTile: number;
			readyHandList?: number[];
		}

		class MsgReadyHandTips implements IMsgReadyHandTips {
			public targetTile: number;
			public readyHandList: number[];
			constructor(properties?: mahjong.IMsgReadyHandTips);
			public static encode(message: MsgReadyHandTips): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgReadyHandTips;
		}

		interface IMsgAllowPlayerAction {
			qaIndex: number;
			actionChairID: number;
			allowedActions: number;
			timeoutInSeconds?: number;
			tipsForAction?: mahjong.IMsgReadyHandTips[];
			meldsForAction?: mahjong.IMsgMeldTile[];
		}

		class MsgAllowPlayerAction implements IMsgAllowPlayerAction {
			public qaIndex: number;
			public actionChairID: number;
			public allowedActions: number;
			public timeoutInSeconds: number;
			public tipsForAction: mahjong.IMsgReadyHandTips[];
			public meldsForAction: mahjong.IMsgMeldTile[];
			constructor(properties?: mahjong.IMsgAllowPlayerAction);
			public static encode(message: MsgAllowPlayerAction): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgAllowPlayerAction;
		}

		interface IMsgAllowPlayerReAction {
			qaIndex: number;
			actionChairID: number;
			allowedActions: number;
			timeoutInSeconds?: number;
			meldsForAction?: mahjong.IMsgMeldTile[];
			victimTileID: number;
			victimChairID: number;
		}

		class MsgAllowPlayerReAction implements IMsgAllowPlayerReAction {
			public qaIndex: number;
			public actionChairID: number;
			public allowedActions: number;
			public timeoutInSeconds: number;
			public meldsForAction: mahjong.IMsgMeldTile[];
			public victimTileID: number;
			public victimChairID: number;
			constructor(properties?: mahjong.IMsgAllowPlayerReAction);
			public static encode(message: MsgAllowPlayerReAction): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgAllowPlayerReAction;
		}

		interface IMsgPlayerAction {
			qaIndex: number;
			action: number;
			flags?: number;
			tile?: number;
			meldType?: number;
			meldTile1?: number;
		}

		class MsgPlayerAction implements IMsgPlayerAction {
			public qaIndex: number;
			public action: number;
			public flags: number;
			public tile: number;
			public meldType: number;
			public meldTile1: number;
			constructor(properties?: mahjong.IMsgPlayerAction);
			public static encode(message: MsgPlayerAction): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgPlayerAction;
		}

		interface IMsgActionResultNotify {
			targetChairID: number;
			action: number;
			actionTile?: number;
			actionMeld?: mahjong.IMsgMeldTile;
			newFlowers?: number[];
			tilesInWall?: number;
			waitDiscardReAction?: boolean;
		}

		class MsgActionResultNotify implements IMsgActionResultNotify {
			public targetChairID: number;
			public action: number;
			public actionTile: number;
			public actionMeld: mahjong.IMsgMeldTile;
			public newFlowers: number[];
			public tilesInWall: number;
			public waitDiscardReAction: boolean;
			constructor(properties?: mahjong.IMsgActionResultNotify);
			public static encode(message: MsgActionResultNotify): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgActionResultNotify;
		}

		interface IMsgRestore {
			msgDeal: mahjong.IMsgDeal;
			readyHandChairs?: number[];
			lastDiscaredChairID?: number;
			isMeNewDraw?: boolean;
			waitDiscardReAction?: boolean;
			flyReadyHandChairs?: number[];
			extra?: ByteBuffer;
		}

		class MsgRestore implements IMsgRestore {
			public msgDeal: mahjong.IMsgDeal;
			public readyHandChairs: number[];
			public lastDiscaredChairID: number;
			public isMeNewDraw: boolean;
			public waitDiscardReAction: boolean;
			public flyReadyHandChairs: number[];
			public extra: ByteBuffer;
			constructor(properties?: mahjong.IMsgRestore);
			public static encode(message: MsgRestore): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgRestore;
		}

		interface IMsgPlayerScoreGreatWin {
			baseWinScore: number;
			greatWinType: number;
			greatWinPoints: number;
			trimGreatWinPoints: number;
			continuousBankerExtra?: number;
		}

		class MsgPlayerScoreGreatWin implements IMsgPlayerScoreGreatWin {
			public baseWinScore: number;
			public greatWinType: number;
			public greatWinPoints: number;
			public trimGreatWinPoints: number;
			public continuousBankerExtra: number;
			constructor(properties?: mahjong.IMsgPlayerScoreGreatWin);
			public static encode(message: MsgPlayerScoreGreatWin): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgPlayerScoreGreatWin;
		}

		interface IMsgPlayerScoreMiniWin {
			miniWinType: number;
			miniWinBasicScore: number;
			miniWinFlowerScore: number;
			miniMultiple: number;
			miniWinTrimScore: number;
			continuousBankerExtra?: number;
		}

		class MsgPlayerScoreMiniWin implements IMsgPlayerScoreMiniWin {
			public miniWinType: number;
			public miniWinBasicScore: number;
			public miniWinFlowerScore: number;
			public miniMultiple: number;
			public miniWinTrimScore: number;
			public continuousBankerExtra: number;
			constructor(properties?: mahjong.IMsgPlayerScoreMiniWin);
			public static encode(message: MsgPlayerScoreMiniWin): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgPlayerScoreMiniWin;
		}

		interface IMsgPlayerScore {
			targetChairID: number;
			winType: number;
			score: number;
			specialScore: number;
			greatWin?: mahjong.IMsgPlayerScoreGreatWin;
			miniWin?: mahjong.IMsgPlayerScoreMiniWin;
			fakeWinScore?: number;
			fakeList?: number[];
			isContinuousBanker?: boolean;
			continuousBankerMultiple?: number;
		}

		class MsgPlayerScore implements IMsgPlayerScore {
			public targetChairID: number;
			public winType: number;
			public score: number;
			public specialScore: number;
			public greatWin: mahjong.IMsgPlayerScoreGreatWin;
			public miniWin: mahjong.IMsgPlayerScoreMiniWin;
			public fakeWinScore: number;
			public fakeList: number[];
			public isContinuousBanker: boolean;
			public continuousBankerMultiple: number;
			constructor(properties?: mahjong.IMsgPlayerScore);
			public static encode(message: MsgPlayerScore): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgPlayerScore;
		}

		interface IMsgHandScore {
			playerScores?: mahjong.IMsgPlayerScore[];
		}

		class MsgHandScore implements IMsgHandScore {
			public playerScores: mahjong.IMsgPlayerScore[];
			constructor(properties?: mahjong.IMsgHandScore);
			public static encode(message: MsgHandScore): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgHandScore;
		}

		interface IMsgHandOver {
			endType: number;
			playerTileLists?: mahjong.IMsgPlayerTileList[];
			scores?: mahjong.IMsgHandScore;
			continueAble?: boolean;
		}

		class MsgHandOver implements IMsgHandOver {
			public endType: number;
			public playerTileLists: mahjong.IMsgPlayerTileList[];
			public scores: mahjong.IMsgHandScore;
			public continueAble: boolean;
			constructor(properties?: mahjong.IMsgHandOver);
			public static encode(message: MsgHandOver): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgHandOver;
		}

		interface IMsgUpdateLocation {
			userID: string;
			location: string;
		}

		class MsgUpdateLocation implements IMsgUpdateLocation {
			public userID: string;
			public location: string;
			constructor(properties?: mahjong.IMsgUpdateLocation);
			public static encode(message: MsgUpdateLocation): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgUpdateLocation;
		}

		interface IMsgUpdatePropCfg {
			propCfg: string;
		}

		class MsgUpdatePropCfg implements IMsgUpdatePropCfg {
			public propCfg: string;
			constructor(properties?: mahjong.IMsgUpdatePropCfg);
			public static encode(message: MsgUpdatePropCfg): ByteBuffer;
			public static decode(reader: Uint8Array|ByteBuffer): MsgUpdatePropCfg;
		}

	}
	export namespace zjmahjong {
		enum GreatWinType {
			None = 0,
			PureSame = 1,
			SevenPair = 2,
			GreatSevenPair = 4,
			Thirteen = 8,
			RobKong = 16,
			Heaven = 32,
			AfterConcealedKong = 64,
			AfterExposedKong = 128,
			FinalDraw = 256,
			PongPong = 512,
			AllWind = 1024,
			AfterKong = 2048,
		}

	}
}
