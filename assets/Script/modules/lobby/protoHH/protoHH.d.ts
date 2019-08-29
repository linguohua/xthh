export namespace proto {
	export namespace casino_gdy {
		enum eGDY_STATUS {
			GDY_STATUS_STOP = 0,
			GDY_STATUS_DEAL = 1,
			GDY_STATUS_OUTCARD = 2,
			GDY_STATUS_OP = 3,
			GDY_STATUS_HUPAI = 4,
			GDY_STATUS_ENDCARD = 5,
			GDY_STATUS_SCORE = 10,
		}

		enum eGDY_MSG_TYPE {
			GDY_MSG_SC_STARTPLAY = 2002,
			GDY_MSG_SC_SCORE = 2010,
			GDY_MSG_SC_DRAWCARD = 2100,
			GDY_MSG_SC_ENDCARD = 2105,
			GDY_MSG_CS_OUTCARD_REQ = 2110,
			GDY_MSG_SC_OUTCARD_ACK = 2111,
			GDY_MSG_SC_OP = 2120,
			GDY_MSG_CS_OP_REQ = 2121,
			GDY_MSG_SC_OP_ACK = 2122,
			GDY_MSG_CS_CANCELCARD_REQ = 2131,
			GDY_MSG_SC_RECONNECT = 2200,
		}

		enum eGDY_OP_TYPE {
			GDY_OP_TYPE_DIANXIAO = 1,
			GDY_OP_TYPE_HUITOUXIAO = 2,
			GDY_OP_TYPE_MENGXIAO = 3,
			GDY_OP_TYPE_FANGXIAO = 9,
			GDY_OP_TYPE_PIAOLAIZI = 10,
			GDY_OP_TYPE_ZHUOCHONG = 20,
			GDY_OP_TYPE_QIANGXIAO = 21,
			GDY_OP_TYPE_XIAOHOUCHONG = 22,
			GDY_OP_TYPE_BEIQIANGXIAO = 23,
			GDY_OP_TYPE_FANGCHONG = 30,
			GDY_OP_TYPE_RECHONG = 31,
			GDY_OP_TYPE_HEIMO = 40,
			GDY_OP_TYPE_RUANMO = 41,
			GDY_OP_TYPE_HEIMOX2 = 50,
			GDY_OP_TYPE_RUANMOX2 = 51,
			GDY_OP_TYPE_FANGCHAOTIAN = 100,
			GDY_OP_TYPE_XIAOCHAOTIAN = 101,
			GDY_OP_TYPE_DACHAOTIAN = 102,
		}

		interface Iplayer_dice {
			player_id: number;
			dices?: number[];
		}

		class player_dice implements Iplayer_dice {
			public player_id: number;
			public dices: number[];
			constructor(properties?: casino_gdy.Iplayer_dice);
			public static encode(message: player_dice): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_dice;
		}

		interface Ipacket_sc_start_play {
			time: number;
			player_id?: number;
			fanpai?: number;
			laizi?: number;
			table_id?: Long;
			lord_id: number;
			cards?: number[];
			dices?: casino_gdy.Iplayer_dice[];
		}

		class packet_sc_start_play implements Ipacket_sc_start_play {
			public time: number;
			public player_id: number;
			public fanpai: number;
			public laizi: number;
			public table_id: Long;
			public lord_id: number;
			public cards: number[];
			public dices: casino_gdy.Iplayer_dice[];
			constructor(properties?: casino_gdy.Ipacket_sc_start_play);
			public static encode(message: packet_sc_start_play): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_start_play;
		}

		interface Ipacket_sc_drawcard {
			time: number;
			player_id: number;
			card?: number;
		}

		class packet_sc_drawcard implements Ipacket_sc_drawcard {
			public time: number;
			public player_id: number;
			public card: number;
			constructor(properties?: casino_gdy.Ipacket_sc_drawcard);
			public static encode(message: packet_sc_drawcard): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_drawcard;
		}

		interface Ipacket_sc_endcard {
			time: number;
			player_id: number;
			card?: number;
			table_id?: Long;
			hupai?: boolean;
		}

		class packet_sc_endcard implements Ipacket_sc_endcard {
			public time: number;
			public player_id: number;
			public card: number;
			public table_id: Long;
			public hupai: boolean;
			constructor(properties?: casino_gdy.Ipacket_sc_endcard);
			public static encode(message: packet_sc_endcard): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_endcard;
		}

		interface Iplayer_score {
			player_id: number;
			table_id?: Long;
			score_add?: number;
			score_cur?: number;
			score_total?: number;
		}

		class player_score implements Iplayer_score {
			public player_id: number;
			public table_id: Long;
			public score_add: number;
			public score_cur: number;
			public score_total: number;
			constructor(properties?: casino_gdy.Iplayer_score);
			public static encode(message: player_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_score;
		}

		interface Ipacket_sc_score {
			player_id: number;
			type?: number;
			table_id?: Long;
			scores?: casino_gdy.Iplayer_score[];
		}

		class packet_sc_score implements Ipacket_sc_score {
			public player_id: number;
			public type: number;
			public table_id: Long;
			public scores: casino_gdy.Iplayer_score[];
			constructor(properties?: casino_gdy.Ipacket_sc_score);
			public static encode(message: packet_sc_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_score;
		}

		interface Ipacket_cs_outcard_req {
			player_id?: number;
			card?: number;
		}

		class packet_cs_outcard_req implements Ipacket_cs_outcard_req {
			public player_id: number;
			public card: number;
			constructor(properties?: casino_gdy.Ipacket_cs_outcard_req);
			public static encode(message: packet_cs_outcard_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_cs_outcard_req;
		}

		interface Ipacket_sc_outcard_ack {
			player_id: number;
			card?: number;
			table_id?: Long;
		}

		class packet_sc_outcard_ack implements Ipacket_sc_outcard_ack {
			public player_id: number;
			public card: number;
			public table_id: Long;
			constructor(properties?: casino_gdy.Ipacket_sc_outcard_ack);
			public static encode(message: packet_sc_outcard_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_outcard_ack;
		}

		interface Ipacket_sc_op {
			time: number;
			player_id: number;
			target_id?: number;
			table_id?: Long;
			card?: number;
		}

		class packet_sc_op implements Ipacket_sc_op {
			public time: number;
			public player_id: number;
			public target_id: number;
			public table_id: Long;
			public card: number;
			constructor(properties?: casino_gdy.Ipacket_sc_op);
			public static encode(message: packet_sc_op): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_op;
		}

		interface Ipacket_cs_op_req {
			player_id?: number;
			op?: number;
			card?: number;
			cancel_type?: number;
		}

		class packet_cs_op_req implements Ipacket_cs_op_req {
			public player_id: number;
			public op: number;
			public card: number;
			public cancel_type: number;
			constructor(properties?: casino_gdy.Ipacket_cs_op_req);
			public static encode(message: packet_cs_op_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_cs_op_req;
		}

		interface Ipacket_sc_op_ack {
			player_id: number;
			op?: number;
			type?: number;
			target_id?: number;
			table_id?: Long;
			cancel_type?: number;
			cards?: number[];
		}

		class packet_sc_op_ack implements Ipacket_sc_op_ack {
			public player_id: number;
			public op: number;
			public type: number;
			public target_id: number;
			public table_id: Long;
			public cancel_type: number;
			public cards: number[];
			constructor(properties?: casino_gdy.Ipacket_sc_op_ack);
			public static encode(message: packet_sc_op_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_op_ack;
		}

		interface Ipacket_cs_cancelcard_req {
			card: number;
			player_id?: number;
			type?: number;
		}

		class packet_cs_cancelcard_req implements Ipacket_cs_cancelcard_req {
			public card: number;
			public player_id: number;
			public type: number;
			constructor(properties?: casino_gdy.Ipacket_cs_cancelcard_req);
			public static encode(message: packet_cs_cancelcard_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_cs_cancelcard_req;
		}

		interface Ipacket_sc_reconnect {
			status: number;
			time: number;
			player_id: number;
			target_id?: number;
			card?: number;
			pailaizi?: boolean;
			op?: number;
		}

		class packet_sc_reconnect implements Ipacket_sc_reconnect {
			public status: number;
			public time: number;
			public player_id: number;
			public target_id: number;
			public card: number;
			public pailaizi: boolean;
			public op: number;
			constructor(properties?: casino_gdy.Ipacket_sc_reconnect);
			public static encode(message: packet_sc_reconnect): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_reconnect;
		}

		interface Igdy_gang_score {
			player_id: number;
			score?: number;
		}

		class gdy_gang_score implements Igdy_gang_score {
			public player_id: number;
			public score: number;
			constructor(properties?: casino_gdy.Igdy_gang_score);
			public static encode(message: gdy_gang_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): gdy_gang_score;
		}

		interface Igdy_gang_group {
			scores?: casino_gdy.Igdy_gang_score[];
		}

		class gdy_gang_group implements Igdy_gang_group {
			public scores: casino_gdy.Igdy_gang_score[];
			constructor(properties?: casino_gdy.Igdy_gang_group);
			public static encode(message: gdy_gang_group): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): gdy_gang_group;
		}

		interface Igdy_gang {
			gang_id: number;
			groups?: casino_gdy.Igdy_gang_group[];
		}

		class gdy_gang implements Igdy_gang {
			public gang_id: number;
			public groups: casino_gdy.Igdy_gang_group[];
			constructor(properties?: casino_gdy.Igdy_gang);
			public static encode(message: gdy_gang): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): gdy_gang;
		}

	}
	export namespace casino_xtsj {
		enum eXTSJ_STATUS {
			XTSJ_STATUS_STOP = 0,
			XTSJ_STATUS_DEAL = 1,
			XTSJ_STATUS_OUTCARD = 2,
			XTSJ_STATUS_OP = 3,
			XTSJ_STATUS_HUPAI = 4,
			XTSJ_STATUS_ENDCARD = 5,
			XTSJ_STATUS_SCORE = 10,
		}

		enum eXTSJ_MSG_TYPE {
			XTSJ_MSG_SC_STARTPLAY = 13202,
			XTSJ_MSG_SC_SCORE = 13210,
			XTSJ_MSG_SC_DRAWCARD = 13211,
			XTSJ_MSG_SC_ENDCARD = 13215,
			XTSJ_MSG_CS_OUTCARD_REQ = 13220,
			XTSJ_MSG_SC_OUTCARD_ACK = 13221,
			XTSJ_MSG_SC_OP = 13230,
			XTSJ_MSG_CS_OP_REQ = 13231,
			XTSJ_MSG_SC_OP_ACK = 13232,
			XTSJ_MSG_CS_CANCELCARD_REQ = 13235,
			XTSJ_MSG_SC_RECONNECT = 13250,
		}

		enum eXTSJ_OP_TYPE {
			XTSJ_OP_TYPE_DIANXIAO = 1,
			XTSJ_OP_TYPE_HUITOUXIAO = 2,
			XTSJ_OP_TYPE_MENGXIAO = 3,
			XTSJ_OP_TYPE_FANGXIAO = 9,
			XTSJ_OP_TYPE_PIAOLAIZI = 10,
			XTSJ_OP_TYPE_ZHUOCHONG = 20,
			XTSJ_OP_TYPE_QIANGXIAO = 21,
			XTSJ_OP_TYPE_XIAOHOUCHONG = 22,
			XTSJ_OP_TYPE_BEIQIANGXIAO = 23,
			XTSJ_OP_TYPE_FANGCHONG = 30,
			XTSJ_OP_TYPE_RECHONG = 31,
			XTSJ_OP_TYPE_HEIMO = 40,
			XTSJ_OP_TYPE_RUANMO = 41,
			XTSJ_OP_TYPE_HEIMOX2 = 50,
			XTSJ_OP_TYPE_RUANMOX2 = 51,
			XTSJ_OP_TYPE_FANGCHAOTIAN = 100,
			XTSJ_OP_TYPE_XIAOCHAOTIAN = 101,
			XTSJ_OP_TYPE_DACHAOTIAN = 102,
		}

		interface Iplayer_dice {
			player_id: number;
			dices?: number[];
		}

		class player_dice implements Iplayer_dice {
			public player_id: number;
			public dices: number[];
			constructor(properties?: casino_xtsj.Iplayer_dice);
			public static encode(message: player_dice): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_dice;
		}

		interface Ipacket_sc_start_play {
			time: number;
			player_id?: number;
			fanpai?: number;
			laizi?: number;
			table_id?: Long;
			lord_id: number;
			cards?: number[];
			dices?: casino_xtsj.Iplayer_dice[];
		}

		class packet_sc_start_play implements Ipacket_sc_start_play {
			public time: number;
			public player_id: number;
			public fanpai: number;
			public laizi: number;
			public table_id: Long;
			public lord_id: number;
			public cards: number[];
			public dices: casino_xtsj.Iplayer_dice[];
			constructor(properties?: casino_xtsj.Ipacket_sc_start_play);
			public static encode(message: packet_sc_start_play): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_start_play;
		}

		interface Ipacket_sc_drawcard {
			time: number;
			player_id: number;
			card?: number;
		}

		class packet_sc_drawcard implements Ipacket_sc_drawcard {
			public time: number;
			public player_id: number;
			public card: number;
			constructor(properties?: casino_xtsj.Ipacket_sc_drawcard);
			public static encode(message: packet_sc_drawcard): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_drawcard;
		}

		interface Ipacket_sc_endcard {
			time: number;
			player_id: number;
			card?: number;
			table_id?: Long;
			hupai?: boolean;
		}

		class packet_sc_endcard implements Ipacket_sc_endcard {
			public time: number;
			public player_id: number;
			public card: number;
			public table_id: Long;
			public hupai: boolean;
			constructor(properties?: casino_xtsj.Ipacket_sc_endcard);
			public static encode(message: packet_sc_endcard): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_endcard;
		}

		interface Iplayer_score {
			player_id: number;
			table_id?: Long;
			score_add?: number;
			score_cur?: number;
			score_total?: number;
		}

		class player_score implements Iplayer_score {
			public player_id: number;
			public table_id: Long;
			public score_add: number;
			public score_cur: number;
			public score_total: number;
			constructor(properties?: casino_xtsj.Iplayer_score);
			public static encode(message: player_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_score;
		}

		interface Ipacket_sc_score {
			player_id: number;
			type?: number;
			table_id?: Long;
			scores?: casino_xtsj.Iplayer_score[];
		}

		class packet_sc_score implements Ipacket_sc_score {
			public player_id: number;
			public type: number;
			public table_id: Long;
			public scores: casino_xtsj.Iplayer_score[];
			constructor(properties?: casino_xtsj.Ipacket_sc_score);
			public static encode(message: packet_sc_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_score;
		}

		interface Ipacket_cs_outcard_req {
			player_id?: number;
			card?: number;
		}

		class packet_cs_outcard_req implements Ipacket_cs_outcard_req {
			public player_id: number;
			public card: number;
			constructor(properties?: casino_xtsj.Ipacket_cs_outcard_req);
			public static encode(message: packet_cs_outcard_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_cs_outcard_req;
		}

		interface Ipacket_sc_outcard_ack {
			player_id: number;
			card?: number;
			table_id?: Long;
		}

		class packet_sc_outcard_ack implements Ipacket_sc_outcard_ack {
			public player_id: number;
			public card: number;
			public table_id: Long;
			constructor(properties?: casino_xtsj.Ipacket_sc_outcard_ack);
			public static encode(message: packet_sc_outcard_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_outcard_ack;
		}

		interface Ipacket_sc_op {
			time: number;
			player_id: number;
			target_id?: number;
			table_id?: Long;
			card?: number;
		}

		class packet_sc_op implements Ipacket_sc_op {
			public time: number;
			public player_id: number;
			public target_id: number;
			public table_id: Long;
			public card: number;
			constructor(properties?: casino_xtsj.Ipacket_sc_op);
			public static encode(message: packet_sc_op): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_op;
		}

		interface Ipacket_cs_op_req {
			player_id?: number;
			op?: number;
			card?: number;
			cancel_type?: number;
		}

		class packet_cs_op_req implements Ipacket_cs_op_req {
			public player_id: number;
			public op: number;
			public card: number;
			public cancel_type: number;
			constructor(properties?: casino_xtsj.Ipacket_cs_op_req);
			public static encode(message: packet_cs_op_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_cs_op_req;
		}

		interface Ipacket_sc_op_ack {
			player_id: number;
			op?: number;
			type?: number;
			target_id?: number;
			table_id?: Long;
			cancel_type?: number;
			cards?: number[];
		}

		class packet_sc_op_ack implements Ipacket_sc_op_ack {
			public player_id: number;
			public op: number;
			public type: number;
			public target_id: number;
			public table_id: Long;
			public cancel_type: number;
			public cards: number[];
			constructor(properties?: casino_xtsj.Ipacket_sc_op_ack);
			public static encode(message: packet_sc_op_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_op_ack;
		}

		interface Ipacket_cs_cancelcard_req {
			card: number;
			player_id?: number;
			type?: number;
		}

		class packet_cs_cancelcard_req implements Ipacket_cs_cancelcard_req {
			public card: number;
			public player_id: number;
			public type: number;
			constructor(properties?: casino_xtsj.Ipacket_cs_cancelcard_req);
			public static encode(message: packet_cs_cancelcard_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_cs_cancelcard_req;
		}

		interface Ipacket_sc_reconnect {
			status: number;
			time: number;
			player_id: number;
			target_id?: number;
			card?: number;
			pailaizi?: boolean;
			op?: number;
		}

		class packet_sc_reconnect implements Ipacket_sc_reconnect {
			public status: number;
			public time: number;
			public player_id: number;
			public target_id: number;
			public card: number;
			public pailaizi: boolean;
			public op: number;
			constructor(properties?: casino_xtsj.Ipacket_sc_reconnect);
			public static encode(message: packet_sc_reconnect): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_sc_reconnect;
		}

		interface Ixtsj_gang_score {
			player_id: number;
			score?: number;
		}

		class xtsj_gang_score implements Ixtsj_gang_score {
			public player_id: number;
			public score: number;
			constructor(properties?: casino_xtsj.Ixtsj_gang_score);
			public static encode(message: xtsj_gang_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): xtsj_gang_score;
		}

		interface Ixtsj_gang_group {
			scores?: casino_xtsj.Ixtsj_gang_score[];
		}

		class xtsj_gang_group implements Ixtsj_gang_group {
			public scores: casino_xtsj.Ixtsj_gang_score[];
			constructor(properties?: casino_xtsj.Ixtsj_gang_group);
			public static encode(message: xtsj_gang_group): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): xtsj_gang_group;
		}

		interface Ixtsj_gang {
			gang_id: number;
			groups?: casino_xtsj.Ixtsj_gang_group[];
		}

		class xtsj_gang implements Ixtsj_gang {
			public gang_id: number;
			public groups: casino_xtsj.Ixtsj_gang_group[];
			constructor(properties?: casino_xtsj.Ixtsj_gang);
			public static encode(message: xtsj_gang): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): xtsj_gang;
		}

	}
	export namespace dbextend {
	}
	export namespace casino {
		enum eTYPE {
			TYPE_NONE = 0,
			TYPE_CASH = 1,
			TYPE_USER = 2,
			TYPE_PAY = 3,
			TYPE_RANK = 4,
			TYPE_GUIDE = 5,
			TYPE_COST = 6,
			TYPE_WXHB = 7,
			TYPE_PUBLIC = 8,
			TYPE_CHAT = 9,
			TYPE_RESOURCE = 10,
			TYPE_LOTTERY = 11,
			TYPE_STORE = 15,
			TYPE_MAIL = 29,
			TYPE_EVENT = 35,
			TYPE_ROOM = 40,
			TYPE_TABLE = 50,
			TYPE_TABLE_PLAYER = 51,
			TYPE_GOLD = 90,
			TYPE_MONEY = 91,
			TYPE_PLAYER = 100,
			TYPE_PLAYER_RESOURCE = 101,
			TYPE_PLAYER_TASK = 102,
			TYPE_PLAYER_ACT = 103,
			TYPE_PLAYER_PAY = 104,
			TYPE_PLAYER_FRIEND = 105,
			TYPE_PLAYER_MESSAGE = 106,
			TYPE_PLAYER_MAIL = 107,
			TYPE_PLAYER_RED = 108,
			TYPE_PLAYER_BIND = 109,
			TYPE_PLAYER_MATCH = 110,
			TYPE_PLAYER_LUCKY = 120,
			TYPE_PLAYER_HELPER = 121,
			TYPE_PLAYER_LOTTERY = 122,
			TYPE_PLAYER_ENERGY = 123,
			TYPE_PLAYER_AWARDS = 124,
			TYPE_PLAYER_MJ = 130,
			TYPE_PLAYER_GDY = 150,
			TYPE_PLAYER_TMHH = 151,
			TYPE_PLAYER_QJHH = 152,
			TYPE_PLAYER_TMYH = 155,
			TYPE_PLAYER_HHYX = 156,
			TYPE_PLAYER_HCYX = 158,
			TYPE_PLAYER_SSHH = 159,
			TYPE_PLAYER_MJTL = 160,
			TYPE_PLAYER_TCMJ = 162,
			TYPE_GUILD_PERMIT = 163,
			TYPE_LEVEL_PLAYER = 200,
			TYPE_LEVEL_VIP = 209,
			TYPE_RANK_RICH = 610,
			TYPE_RANK_WIN = 611,
			TYPE_VIP_EXP = 999,
			TYPE_ADMIN = 1000,
		}

		enum eRESOURCE {
			RESOURCE_NONE = 0,
			RESOURCE_GOLD = 1,
			RESOURCE_MONEY = 2,
			RESOURCE_EXP = 3,
			RESOURCE_RETROACTIVE = 5,
			RESOURCE_DEVOTE = 6,
			RESOURCE_RED = 8,
			RESOURCE_BEANS = 9,
			RESOURCE_CARD = 10,
			RESOURCE_RANK_SCORE = 12,
			RESOURCE_TECKET = 13,
		}

		enum eMATCHMODE {
			MATCHMODE_RED = 1,
			MATCHMODE_SCORE = 2,
			MATCHMODE_ENTITY = 3,
		}

		enum eGUILDPERMISSION {
			GUILDPERMISSION_OUTTIME = 1,
		}

		enum eDISBAND {
			DISBAND_NONE = 0,
			DISBAND_YES = 1,
			DISBAND_NO = 2,
		}

		enum eTABLE_OP {
			TABLE_OP_DRAWCARD = -1,
			TABLE_OP_OUTCARD = -2,
			TABLE_OP_END = -3,
			TABLE_OP_BET = -4,
			TABLE_OP_JIALAIZI = -5,
			TABLE_OP_PENG = 1,
			TABLE_OP_GANG = 2,
			TABLE_OP_HU = 3,
			TABLE_OP_ZIMO = 4,
			TABLE_OP_CHAOTIAN = 5,
			TABLE_OP_BUZHUOCHONG = 6,
			TABLE_OP_QIANGXIAO = 7,
			TABLE_OP_CHI = 8,
			TABLE_OP_HUANBAO = 9,
			TABLE_OP_DG = 10,
			TABLE_OP_CAIGANG = 11,
			TABLE_OP_TING = 12,
			TABLE_OP_CANCEL = 13,
			TABLE_OP_ZHAO = 14,
			TABLE_OP_HUA = 15,
			TABLE_OP_JIAN = 16,
		}

		enum eTASK_TYPE {
			TASK_TYPE_NONE = 0,
			TASK_TYPE_CASINO = 1,
			TASK_TYPE_DAILY = 2,
		}

		enum eCONDITION {
			CONDITION_NONE = 0,
			CONDITION_WIN = 1,
			CONDITION_PLAY = 2,
			CONDITION_PRIVATE = 3,
			CONDITION_AUTH = 4,
			CONDITION_PUBLIC = 5,
			CONDITION_ROUND = 7,
			CONDITION_CARD = 8,
			CONDITION_NORMAL = 9,
			CONDITION_SHARE = 10,
			CONDITION_BIND = 100,
		}

		enum eACT {
			ACT_CHECKIN_DAY = 1,
			ACT_CHECKIN_COUNTER = 2,
			ACT_CARD_FREE = 3,
			ACT_RED_RAIN = 4,
			ACT_SIGN = 5,
		}

		enum eEXCHANGE_TYPE {
			EXCHANGE_UNLIMIT = 0,
			EXCHANGE_TODAY = 1,
			EXCHANGE_WEEK = 2,
			EXCHANGE_MONTH = 3,
		}

		enum eGUILD_MEMBER_POWER {
			GUILD_MEMBER_POWER_CARD = 1,
		}

		enum eFRIEND_STATUS {
			FRIEND_STATUS_REQUEST = 0,
			FRIEND_STATUS_SUCCEEDED = 1,
			FRIEND_STATUS_REMOVE = 2,
		}

		enum eMESSAGE_TYPE {
			MESSAGE_TYPE_FRIEND = 1,
			MESSAGE_TYPE_CHAT = 2,
			MESSAGE_TYPE_GIFT_CARD = 10,
		}

		enum ProxyMessageCode {
			OPPing = 100,
			OPPong = 101,
		}

		enum eMSG_TYPE {
			MSG_BULLETIN = 1,
			MSG_PING = 2,
			MSG_PONG = 3,
			MSG_DBUPDATE = 5,
			MSG_COORDINATE = 6,
			MSG_BROADCAST = 7,
			MSG_BROADCAST_SYNC = 8,
			MSG_DATA_REQ = 10,
			MSG_DATA_ACK = 11,
			MSG_USER_LOGIN_REQ = 101,
			MSG_USER_LOGIN_ACK = 102,
			MSG_FAST_LOGIN_REQ = 103,
			MSG_FAST_LOGIN_ACK = 104,
			MSG_USER_REG_REQ = 105,
			MSG_USER_REG_ACK = 106,
			MSG_USER_LOGOUT = 110,
			MSG_STRING_REQ = 115,
			MSG_STRING_ACK = 116,
			MSG_MODIFY_REQ = 117,
			MSG_MODIFY_ACK = 118,
			MSG_HELPER_REQ = 120,
			MSG_HELPER_ACK = 121,
			MSG_HELPER = 125,
			MSG_GUIDE_REQ = 130,
			MSG_GUIDE_ACK = 131,
			MSG_SEARCH_REQ = 135,
			MSG_SEARCH_ACK = 136,
			MSG_EVENT_REQ = 140,
			MSG_EVENT_ACK = 141,
			MSG_PAY_REQ = 145,
			MSG_PAY_ACK = 146,
			MSG_TABLE_JOIN_REQ = 150,
			MSG_TABLE_JOIN_ACK = 151,
			MSG_TABLE_CREATE_REQ = 152,
			MSG_TABLE_CREATE_ACK = 153,
			MSG_TABLE_ENTRY = 154,
			MSG_TABLE_LEAVE = 155,
			MSG_TABLE_READY = 156,
			MSG_TABLE_PAUSE = 157,
			MSG_TABLE_SCORE = 158,
			MSG_TABLE_UPDATE = 159,
			MSG_TABLE_MANAGED = 160,
			MSG_TABLE_TIMEOUT = 161,
			MSG_TABLE_CHAT = 162,
			MSG_TABLE_DISBAND = 165,
			MSG_TABLE_DISBAND_REQ = 166,
			MSG_TABLE_DISBAND_ACK = 167,
			MSG_TABLE_CONTINUE_REQ = 168,
			MSG_TABLE_CONTINUE_ACK = 169,
			MSG_CASINO_JOIN_REQ = 170,
			MSG_CASINO_JOIN_ACK = 171,
			MSG_TABLE_KILL = 178,
			MSG_MAIL_REQ = 180,
			MSG_MAIL_ACK = 181,
			MSG_AWARD_REQ = 190,
			MSG_AWARD_ACK = 191,
			MSG_LOTTERY_REQ = 200,
			MSG_LOTTERY_ACK = 201,
			MSG_LOTTERY_LOG_REQ = 202,
			MSG_LOTTERY_LOG_ACK = 203,
			MSG_LOTTERY = 205,
			MSG_PLAYER_JOIN_REQ = 210,
			MSG_PLAYER_JOIN_ACK = 211,
			MSG_PLAYER_ENTRY = 214,
			MSG_PLAYER_LEAVE = 215,
			MSG_PLAYER_RENAME_REQ = 220,
			MSG_PLAYER_RENAME_ACK = 221,
			MSG_PLAYER_LEVEL_UP = 250,
			MSG_LUCKY_REQ = 260,
			MSG_LUCKY_ACK = 261,
			MSG_LUCKY = 265,
			MSG_TASK_REQ = 270,
			MSG_TASK_ACK = 271,
			MSG_CHAT_REQ = 280,
			MSG_CHAT_ACK = 281,
			MSG_FRIEND_REQ = 290,
			MSG_FRIEND_ACK = 291,
			MSG_ACT_REQ = 300,
			MSG_ACT_ACK = 301,
			MSG_ACT = 305,
			MSG_SHARE_REQ = 310,
			MSG_SHARE_ACK = 311,
			MSG_AUTH_REQ = 320,
			MSG_AUTH_ACK = 321,
			MSG_USE_REQ = 330,
			MSG_USE_ACK = 331,
			MSG_SCORE_REQ = 340,
			MSG_SCORE_ACK = 341,
			MSG_SCORE_TIME_REQ = 342,
			MSG_SCORE_TIME_ACK = 343,
			MSG_CARD_REQ = 350,
			MSG_CARD_ACK = 351,
			MSG_CARD_OP = 355,
			MSG_GIFT_REQ = 360,
			MSG_GIFT_ACK = 361,
			MSG_MATCH_LOG_REQ = 380,
			MSG_MATCH_LOG_ACK = 381,
			MSG_MATCH_UPDATE_REQ = 370,
			MSG_MATCH_UPDATE_ACK = 371,
			MSG_MATCH_APPLY_REQ = 372,
			MSG_MATCH_APPLY_ACK = 373,
			MSG_MATCH_CANCEL_REQ = 374,
			MSG_MATCH_CANCEL_ACK = 375,
			MSG_QUERY_MATCH_INFO_REQ = 376,
			MSG_QUERY_MATCH_INFO_ACK = 378,
			MSG_RESOURCE_COST = 400,
			MSG_RESOURCE_GAIN = 401,
			MSG_GUILD_REQ = 410,
			MSG_GUILD_ACK = 411,
			MSG_GUILD_CLOSE_REQ = 412,
			MSG_GUILD_CLOSE_ACK = 413,
			MSG_GUILD_JOIN_REQ = 414,
			MSG_GUILD_JOIN_ACK = 415,
			MSG_GUILD_REMOVE_REQ = 416,
			MSG_GUILD_REMOVE_ACK = 417,
			MSG_GUILD_QUIT_REQ = 418,
			MSG_GUILD_QUIT_ACK = 419,
			MSG_GUILD_ACCEPT_REQ = 420,
			MSG_GUILD_ACCEPT_ACK = 421,
			MSG_GUILD_FRIEND_REQ = 422,
			MSG_GUILD_FRIEND_ACK = 423,
			MSG_GUILD_KICK_REQ = 425,
			MSG_GUILD_KICK_ACK = 426,
			MSG_GUILD_NAME_REQ = 427,
			MSG_GUILD_NAME_ACK = 428,
			MSG_GUILD_UPDATE = 429,
			MSG_GUILD_POWER_REQ = 430,
			MSG_GUILD_POWER_ACK = 431,
			MSG_GUILD_LOG_REQ = 432,
			MSG_GUILD_LOG_ACK = 433,
			MSG_GUILD_NOTICE_REQ = 434,
			MSG_GUILD_NOTICE_ACK = 435,
			MSG_GUILD_RANK_REQ = 436,
			MSG_GUILD_RANK_ACK = 437,
			MSG_GUILD_ROOM_CREATE_REQ = 450,
			MSG_GUILD_ROOM_CREATE_ACK = 451,
			MSG_GUILD_ROOM_REMOVE_REQ = 452,
			MSG_GUILD_ROOM_REMOVE_ACK = 453,
			MSG_GUILD_ROOM_CARD_REQ = 454,
			MSG_GUILD_ROOM_CARD_ACK = 455,
			MSG_GUILD_ROOM_LOG_REQ = 456,
			MSG_GUILD_ROOM_LOG_ACK = 457,
			MSG_GUILD_ROOM_UPDATE = 460,
			MSG_GUILD_ROOM_CARD = 461,
			MSG_GUILD_TABLE_CREATE = 490,
			MSG_GUILD_TABLE_REMOVE = 491,
			MSG_GUILD_TABLE_UPDATE = 492,
			MSG_GUILD_TABLE_LOG = 495,
			MSG_GUILD_MASTER_CHANGE = 499,
			MSG_BIND_CARD_REQ = 500,
			MSG_BIND_CARD_ACK = 501,
			MSG_BIND_PLAYER_REQ = 510,
			MSG_BIND_PLAYER_ACK = 511,
			MSG_BIND_INFO_REQ = 520,
			MSG_BIND_INFO_ACK = 521,
			MSG_BIND_UPDATE = 549,
			MSG_RANK_REQ = 550,
			MSG_RANK_ACK = 551,
			MSG_REPLAY_REQ = 560,
			MSG_REPLAY_ACK = 561,
			MSG_RED_CASH_REQ = 570,
			MSG_RED_CASH_ACK = 571,
			MSG_RED_STORE_REQ = 580,
			MSG_RED_STORE_ACK = 581,
			MSG_ENERGY_TURNABLE = 590,
			MSG_ET_DRAW_REQ = 591,
			MSG_ET_DRAW_RES = 592,
			MSG_ADD = 600,
			MSG_REMOVE = 601,
			MSG_UPDATE = 602,
			MSG_BIND_PHONE_REQ = 610,
			MSG_BIND_PHONE_ACK = 611,
			MSG_BIND_XIANLIAO_ROBOT_REQ = 620,
			MSG_BIND_XIANLIAO_ROBOT_ACK = 621,
			MSG_CARD_UPDATE = 700,
			MSG_RESOURCE_GIFT_REQ = 900,
			MSG_RESOURCE_GIFT_ACK = 901,
			MSG_SERVER_REQ = 1000,
			MSG_SERVER_ACK = 1001,
		}

		enum eRETURN_TYPE {
			RETURN_SUCCEEDED = 0,
			RETURN_FAILED = 1,
			RETURN_DISABLE = 2,
			RETURN_ONLINE = 3,
			RETURN_OFFLINE = 4,
			RETURN_WAIT = 5,
			RETURN_UNIMPLEMENTED = 6,
			RETURN_EXIST = 7,
			RETURN_INTERRUPT = 10,
			RETURN_BAN = 11,
			RETURN_USED = 12,
			RETURN_GAIN = 13,
			RETURN_LEN = 14,
			RETURN_INVALID = 15,
			RETURN_DATETIME = 16,
			RETURN_PERMISSION = 17,
			RETURN_MAC = 18,
			RETURN_TIMEOUT = 22,
			RETURN_COST = 23,
			RETURN_CHANNEL = 24,
			RETURN_GUILD = 25,
			RETURN_SAME = 26,
			RETURN_NICKNAME_SHORT = 100,
			RETURN_NICKNAME_LONG = 101,
			RETURN_NICKNAME_EXIST = 102,
			RETURN_NICKNAME_ERROR = 103,
			RETURN_MAX_LEVEL = 910,
			RETURN_MAX_PLUS = 911,
			RETURN_NO_PLAYER = 1000,
			RETURN_NO_ITEM = 1001,
			RETURN_EXIST_NICKNAME = 2001,
			RETURN_EXIST_USER = 2002,
			RETURN_NOTENOUGH_VIPLEVEL = 2999,
			RETURN_NOTENOUGH_LEVEL = 3000,
			RETURN_NOTENOUGH_GOLD = 3001,
			RETURN_NOTENOUGH_MONEY = 3002,
			RETURN_NOTENOUGH_CARD = 3003,
			RETURN_NOTENOUGH_RED = 3004,
			RETURN_NOTENOUGH_BEAN = 3005,
			RETURN_FULL = 3100,
			RETURN_FULL_GOLD = 3101,
			RETURN_FULL_MONEY = 3102,
			RETURN_INVITE_EXIST = 3200,
			RETURN_INVITE_NOTFOUND = 3201,
			RETURN_INVITE_FULL = 3202,
			RETURN_INVITE_LEVEL = 3203,
			RETURN_INVITE_REQUESTFULL = 3204,
			RETURN_INVITE_VIPLEVEL = 3205,
			RETURN_RED_DISABLE = 3300,
			RETURN_RED_MIN = 3301,
			RETURN_RED_MAX = 3302,
			RETURN_RED_CASH = 3303,
			RETURN_RED_NUM = 3304,
			RETURN_RED_LIMIT = 3305,
			RETURN_RED_NOTENOUGH = 3310,
			RETURN_GUILD_MASTER = 3400,
			RETURN_GUILD_ROOM_DISABLE = 3410,
			RETURN_GUILD_ROOM_MAX = 3411,
			RETURN_GUILD_ROOM_CREATE = 3412,
			RETURN_GUILD_ROOM_NOTFOUND = 3413,
			RETURN_GUILD_ROOM_CARD_NOTENOUGH = 3420,
			RETURN_GUILD_ROOM_CARD_MIN = 3421,
			RETURN_GUILD_ROOM_CARD_MAX = 3422,
			RETURN_GUILD_ROOM_CARD_DAY = 3423,
			RETURN_GUILD_JOIN_NOTFOUND = 3450,
			RETURN_GUILD_JOIN_EXIST = 3451,
			RETURN_GUILD_JOIN_REQUEST = 3452,
			RETURN_GUILD_JOIN_MAX = 3453,
			RETURN_GUILD_JOIN_FULL = 3454,
			RETURN_GUILD_DISABAND_NO_OUTTIME = 3455,
			RETURN_GUILD_LOG_TIME = 3460,
			RETURN_GUILD_LOG_DISABLE = 3461,
			RETURN_GUILD_LOG_OUT = 3462,
			RETURN_GUILD_RANK_CLOSE = 3464,
			RETURN_GUILD_REQUEST_TIME = 3465,
			RETURN_GUILD_NOTICE_UPDATE = 3466,
			RETURN_GUILD_NOTICE_PUBLISH_OFTEN = 3467,
			RETURN_BIND_EXIST = 3500,
			RETURN_BIND_NOTFOUND = 3501,
			RETURN_BIND_CARD_DISABLE = 3502,
			RETURN_BIND_CARD_NO = 3503,
			RETURN_BIND_CARD_NUM = 3504,
			RETURN_BIND_CARD_MIN = 3505,
			RETURN_BIND_CARD_MAX = 3506,
			RETURN_BIND_CARD_LIMIT = 3507,
			RETURN_MATCH_DISABLE = 3600,
			RETURN_MATCH_LOG_TIME = 3601,
			RETURN_MATCH_FULL = 3602,
			RETURN_MATCH_DAY_MAX = 3603,
			RETURN_MATCH_CARD_NOTENOUGH = 3604,
			RETURN_MATCH_CHANNEL = 3605,
			RETURN_MATCH_HAS_APPLY = 3606,
			RETURN_MATCH_ID_NOT_EXSIT = 3607,
			RETURN_MATCH_IS_START = 3608,
			RETURN_MATCH_GIVE_UP = 3609,
			RETURN_BIND_PHONE_SUCCESS = 3700,
			RETURN_HAS_BINDED = 3701,
			RETURN_CODE_EXPIRE = 3702,
			RETURN_ENERGY_NOT_ENOUGH = 3750,
			RETURN_TABLE_WAIT_TIMEOUT = 3751,
			RETURN_DAYLIMIT = 4000,
			RETURN_COLDDOWN = 4001,
			RETURN_LOCKCARD = 4002,
			RETURN_LOCKGOLD = 4003,
			RETURN_REFRESH = 4004,
			RETURN_HELPER_RECEIVE_ALL = 4005,
		}

		interface Ichat {
			id: number;
			text?: string;
			res?: string;
			casino_id?: number;
		}

		class chat implements Ichat {
			public id: number;
			public text: string;
			public res: string;
			public casino_id: number;
			constructor(properties?: casino.Ichat);
			public static encode(message: chat): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): chat;
		}

		interface Iobject {
			type: number;
			id?: number;
			param?: number;
			min?: number;
			max?: number;
		}

		class object implements Iobject {
			public type: number;
			public id: number;
			public param: number;
			public min: number;
			public max: number;
			constructor(properties?: casino.Iobject);
			public static encode(message: object): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): object;
		}

		interface Iresource {
			id: number;
			name: string;
			quality?: number;
			reward_id?: number;
			daily_limit?: number;
			icon?: string;
			desc?: string;
		}

		class resource implements Iresource {
			public id: number;
			public name: string;
			public quality: number;
			public reward_id: number;
			public daily_limit: number;
			public icon: string;
			public desc: string;
			constructor(properties?: casino.Iresource);
			public static encode(message: resource): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): resource;
		}

		interface Iresource_need {
			id: number;
			count?: number;
		}

		class resource_need implements Iresource_need {
			public id: number;
			public count: number;
			constructor(properties?: casino.Iresource_need);
			public static encode(message: resource_need): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): resource_need;
		}

		interface Ipay_url {
			id: number;
			url: string;
		}

		class pay_url implements Ipay_url {
			public id: number;
			public url: string;
			constructor(properties?: casino.Ipay_url);
			public static encode(message: pay_url): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): pay_url;
		}

		interface Ired_store {
			id: number;
			name?: string;
			type?: number;
			price?: number;
			limit?: number;
			today?: number;
			total?: number;
			gains?: casino.Iobject[];
			info?: string;
			res?: string;
			buy_time?: Long;
		}

		class red_store implements Ired_store {
			public id: number;
			public name: string;
			public type: number;
			public price: number;
			public limit: number;
			public today: number;
			public total: number;
			public gains: casino.Iobject[];
			public info: string;
			public res: string;
			public buy_time: Long;
			constructor(properties?: casino.Ired_store);
			public static encode(message: red_store): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): red_store;
		}

		interface Ired_data {
			stores?: casino.Ired_store[];
			red_min?: number;
			red_max?: number;
			red_cash?: number;
			red_num?: number;
			red_disable?: boolean;
		}

		class red_data implements Ired_data {
			public stores: casino.Ired_store[];
			public red_min: number;
			public red_max: number;
			public red_cash: number;
			public red_num: number;
			public red_disable: boolean;
			constructor(properties?: casino.Ired_data);
			public static encode(message: red_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): red_data;
		}

		interface Ipay {
			id: number;
			name?: string;
			channel?: string;
			currency?: string;
			type?: number;
			vip_exp?: number;
			mail_id?: number;
			param?: number;
			disable?: boolean;
			code_id?: string;
			code_name?: string;
			code_info?: string;
			dicount?: string;
			original_price?: number;
			vip?: number;
			money_base?: number;
			money_first?: number;
			money_gift?: number;
			price?: number;
			price_info?: string;
			point?: number;
			tag?: number;
			limit_count?: number;
			limit_start_time?: Long;
			limit_end_time?: Long;
			func?: string;
			addition?: number;
			next_id?: number;
			flag?: number;
			url_id?: number;
			info?: string;
			res_path?: string;
			channels?: string[];
		}

		class pay implements Ipay {
			public id: number;
			public name: string;
			public channel: string;
			public currency: string;
			public type: number;
			public vip_exp: number;
			public mail_id: number;
			public param: number;
			public disable: boolean;
			public code_id: string;
			public code_name: string;
			public code_info: string;
			public dicount: string;
			public original_price: number;
			public vip: number;
			public money_base: number;
			public money_first: number;
			public money_gift: number;
			public price: number;
			public price_info: string;
			public point: number;
			public tag: number;
			public limit_count: number;
			public limit_start_time: Long;
			public limit_end_time: Long;
			public func: string;
			public addition: number;
			public next_id: number;
			public flag: number;
			public url_id: number;
			public info: string;
			public res_path: string;
			public channels: string[];
			constructor(properties?: casino.Ipay);
			public static encode(message: pay): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): pay;
		}

		interface Ipay_channel {
			tag: string;
			name: string;
			system?: string;
			disable?: boolean;
			res?: string;
		}

		class pay_channel implements Ipay_channel {
			public tag: string;
			public name: string;
			public system: string;
			public disable: boolean;
			public res: string;
			constructor(properties?: casino.Ipay_channel);
			public static encode(message: pay_channel): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): pay_channel;
		}

		interface Ipay_data {
			pays?: casino.Ipay[];
			url?: string;
			channels?: casino.Ipay_channel[];
			urls?: casino.Ipay_url[];
		}

		class pay_data implements Ipay_data {
			public pays: casino.Ipay[];
			public url: string;
			public channels: casino.Ipay_channel[];
			public urls: casino.Ipay_url[];
			constructor(properties?: casino.Ipay_data);
			public static encode(message: pay_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): pay_data;
		}

		interface Iroom {
			id: number;
			name?: string;
			casino_id?: number;
			disable?: boolean;
			cur?: number;
			ply_min?: number;
			ply_max?: number;
			base?: number;
			gold?: Long;
			cost_type?: number;
			cost_param?: number;
			gold_max?: number;
			info?: string;
			server_id?: number;
		}

		class room implements Iroom {
			public id: number;
			public name: string;
			public casino_id: number;
			public disable: boolean;
			public cur: number;
			public ply_min: number;
			public ply_max: number;
			public base: number;
			public gold: Long;
			public cost_type: number;
			public cost_param: number;
			public gold_max: number;
			public info: string;
			public server_id: number;
			constructor(properties?: casino.Iroom);
			public static encode(message: room): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): room;
		}

		interface Iop_score {
			type: number;
			zs?: number;
			count?: number;
			score?: number;
		}

		class op_score implements Iop_score {
			public type: number;
			public zs: number;
			public count: number;
			public score: number;
			constructor(properties?: casino.Iop_score);
			public static encode(message: op_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): op_score;
		}

		interface Icard_group {
			type?: number;
			op?: number;
			target_id?: number;
			card?: number;
			cards?: number[];
		}

		class card_group implements Icard_group {
			public type: number;
			public op: number;
			public target_id: number;
			public card: number;
			public cards: number[];
			constructor(properties?: casino.Icard_group);
			public static encode(message: card_group): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): card_group;
		}

		interface Iplayer_mj {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_mj implements Iplayer_mj {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_mj);
			public static encode(message: player_mj): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_mj;
		}

		interface Iplayer_mjtl {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_mjtl implements Iplayer_mjtl {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_mjtl);
			public static encode(message: player_mjtl): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_mjtl;
		}

		interface Iplayer_sshh {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_sshh implements Iplayer_sshh {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_sshh);
			public static encode(message: player_sshh): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_sshh;
		}

		interface Iplayer_gdy {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_gdy implements Iplayer_gdy {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_gdy);
			public static encode(message: player_gdy): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_gdy;
		}

		interface Iplayer_tmhh {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_tmhh implements Iplayer_tmhh {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_tmhh);
			public static encode(message: player_tmhh): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_tmhh;
		}

		interface Iplayer_tmyh {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_tmyh implements Iplayer_tmyh {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_tmyh);
			public static encode(message: player_tmyh): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_tmyh;
		}

		interface Iplayer_hhyx {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_hhyx implements Iplayer_hhyx {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_hhyx);
			public static encode(message: player_hhyx): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_hhyx;
		}

		interface Iplayer_hcyx {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_hcyx implements Iplayer_hcyx {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_hcyx);
			public static encode(message: player_hcyx): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_hcyx;
		}

		interface Iplayer_qjhh {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_qjhh implements Iplayer_qjhh {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_qjhh);
			public static encode(message: player_qjhh): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_qjhh;
		}

		interface Iplayer_tcmj {
			id?: Long;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			hupai_total?: number;
			hupai_today?: number;
			hupai_time?: Long;
			pailaizi_total?: number;
			pailaizi_today?: number;
			pailaizi_time?: Long;
			fangchong_total?: number;
			fangchong_today?: number;
			fangchong_time?: Long;
			beizan_total?: number;
			beizan_today?: number;
			beizan_time?: Long;
			timeout_total?: number;
			timeout_today?: number;
			timeout_time?: Long;
			quit_total?: number;
			quit_today?: number;
			quit_time?: Long;
		}

		class player_tcmj implements Iplayer_tcmj {
			public id: Long;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public hupai_total: number;
			public hupai_today: number;
			public hupai_time: Long;
			public pailaizi_total: number;
			public pailaizi_today: number;
			public pailaizi_time: Long;
			public fangchong_total: number;
			public fangchong_today: number;
			public fangchong_time: Long;
			public beizan_total: number;
			public beizan_today: number;
			public beizan_time: Long;
			public timeout_total: number;
			public timeout_today: number;
			public timeout_time: Long;
			public quit_total: number;
			public quit_today: number;
			public quit_time: Long;
			constructor(properties?: casino.Iplayer_tcmj);
			public static encode(message: player_tcmj): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_tcmj;
		}

		interface Icoordinate {
			latitude?: casino.Idouble;
			longitude?: casino.Idouble;
			address?: string;
			ip?: string;
			ipaddress?: string;
		}

		class coordinate implements Icoordinate {
			public latitude: casino.Idouble;
			public longitude: casino.Idouble;
			public address: string;
			public ip: string;
			public ipaddress: string;
			constructor(properties?: casino.Icoordinate);
			public static encode(message: coordinate): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): coordinate;
		}

		interface Iting_card {
			outcard: number;
			hucards?: number[];
		}

		class ting_card implements Iting_card {
			public outcard: number;
			public hucards: number[];
			constructor(properties?: casino.Iting_card);
			public static encode(message: ting_card): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): ting_card;
		}

		interface Itable_player {
			id?: number;
			nickname?: string;
			sex?: number;
			bot?: boolean;
			avatar?: number;
			ready?: boolean;
			score?: number;
			time?: number;
			multiple?: number;
			status?: number;
			phone?: string;
			bet?: number;
			gold?: Long;
			managed?: boolean;
			ting?: boolean;
			param?: number;
			ting_type?: number;
			ai?: boolean;
			disband?: number;
			lord_cont?: number;
			lord_total?: number;
			win_total?: number;
			lost_total?: number;
			play_total?: number;
			timeout_total?: number;
			quit_total?: number;
			hupai_total?: number;
			zimo_total?: number;
			laizi_total?: number;
			quit_time?: number;
			match_level?: number;
			entry_time?: Long;
			last_card?: number;
			cancel_zhuochong?: boolean;
			jialaizi?: number;
			opscores?: casino.Iop_score[];
			tingcards?: casino.Iting_card[];
			huacards?: number[];
			drawcards?: number[];
			curcards?: number[];
			selcards?: number[];
			outcards?: number[];
			cancelcards?: number[];
			pengcards?: number[];
			groups?: casino.Icard_group[];
			offline_time?: Long;
			score_total?: number;
			data_mj?: casino.Iplayer_mj;
			data_gdy?: casino.Iplayer_gdy;
			data_tmhh?: casino.Iplayer_tmhh;
			data_qjhh?: casino.Iplayer_qjhh;
			data_hhyx?: casino.Iplayer_hhyx;
			data_hcyx?: casino.Iplayer_hcyx;
			data_sshh?: casino.Iplayer_sshh;
			data_mjtl?: casino.Iplayer_mjtl;
			data_tcmj?: casino.Iplayer_tcmj;
			channel_head?: string;
			channel_nickname?: string;
			channel?: string;
			server_id?: number;
			guild_id?: number;
			im_accid?: string;
			coord?: casino.Icoordinate;
		}

		class table_player implements Itable_player {
			public id: number;
			public nickname: string;
			public sex: number;
			public bot: boolean;
			public avatar: number;
			public ready: boolean;
			public score: number;
			public time: number;
			public multiple: number;
			public status: number;
			public phone: string;
			public bet: number;
			public gold: Long;
			public managed: boolean;
			public ting: boolean;
			public param: number;
			public ting_type: number;
			public ai: boolean;
			public disband: number;
			public lord_cont: number;
			public lord_total: number;
			public win_total: number;
			public lost_total: number;
			public play_total: number;
			public timeout_total: number;
			public quit_total: number;
			public hupai_total: number;
			public zimo_total: number;
			public laizi_total: number;
			public quit_time: number;
			public match_level: number;
			public entry_time: Long;
			public last_card: number;
			public cancel_zhuochong: boolean;
			public jialaizi: number;
			public opscores: casino.Iop_score[];
			public tingcards: casino.Iting_card[];
			public huacards: number[];
			public drawcards: number[];
			public curcards: number[];
			public selcards: number[];
			public outcards: number[];
			public cancelcards: number[];
			public pengcards: number[];
			public groups: casino.Icard_group[];
			public offline_time: Long;
			public score_total: number;
			public data_mj: casino.Iplayer_mj;
			public data_gdy: casino.Iplayer_gdy;
			public data_tmhh: casino.Iplayer_tmhh;
			public data_qjhh: casino.Iplayer_qjhh;
			public data_hhyx: casino.Iplayer_hhyx;
			public data_hcyx: casino.Iplayer_hcyx;
			public data_sshh: casino.Iplayer_sshh;
			public data_mjtl: casino.Iplayer_mjtl;
			public data_tcmj: casino.Iplayer_tcmj;
			public channel_head: string;
			public channel_nickname: string;
			public channel: string;
			public server_id: number;
			public guild_id: number;
			public im_accid: string;
			public coord: casino.Icoordinate;
			constructor(properties?: casino.Itable_player);
			public static encode(message: table_player): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_player;
		}

		interface Itable_param {
			player_id: number;
			param?: number;
			card?: number;
			cards?: number[];
		}

		class table_param implements Itable_param {
			public player_id: number;
			public param: number;
			public card: number;
			public cards: number[];
			constructor(properties?: casino.Itable_param);
			public static encode(message: table_param): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_param;
		}

		interface Itable_op {
			type?: number;
			op?: number;
			status?: number;
			time?: number;
			param?: number;
			card?: number;
			cards?: number[];
			score?: number;
			player_id?: number;
			target_id?: number;
			huacards?: number[];
			replacecards?: number[];
			params?: casino.Itable_param[];
		}

		class table_op implements Itable_op {
			public type: number;
			public op: number;
			public status: number;
			public time: number;
			public param: number;
			public card: number;
			public cards: number[];
			public score: number;
			public player_id: number;
			public target_id: number;
			public huacards: number[];
			public replacecards: number[];
			public params: casino.Itable_param[];
			constructor(properties?: casino.Itable_op);
			public static encode(message: table_op): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_op;
		}

		interface Itable_round_score {
			player_id: number;
			param?: number;
			score?: number;
			score_total?: number;
			score_init?: number;
			groups?: casino.Icard_group[];
			inithuacards?: number[];
			initcards?: number[];
			cards?: number[];
			selcards?: number[];
			curcards?: number[];
			huacards?: number[];
			opscores?: casino.Iop_score[];
			hupai_card?: number;
			last_card?: number;
		}

		class table_round_score implements Itable_round_score {
			public player_id: number;
			public param: number;
			public score: number;
			public score_total: number;
			public score_init: number;
			public groups: casino.Icard_group[];
			public inithuacards: number[];
			public initcards: number[];
			public cards: number[];
			public selcards: number[];
			public curcards: number[];
			public huacards: number[];
			public opscores: casino.Iop_score[];
			public hupai_card: number;
			public last_card: number;
			constructor(properties?: casino.Itable_round_score);
			public static encode(message: table_round_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_round_score;
		}

		interface Itable_round {
			lord_id: number;
			fanpai?: number;
			laizi?: number;
			nextcard?: number;
			ops?: casino.Itable_op[];
			scores?: casino.Itable_round_score[];
			remaincards?: number[];
		}

		class table_round implements Itable_round {
			public lord_id: number;
			public fanpai: number;
			public laizi: number;
			public nextcard: number;
			public ops: casino.Itable_op[];
			public scores: casino.Itable_round_score[];
			public remaincards: number[];
			constructor(properties?: casino.Itable_round);
			public static encode(message: table_round): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_round;
		}

		interface Itable_replay {
			rounds?: casino.Itable_round[];
		}

		class table_replay implements Itable_replay {
			public rounds: casino.Itable_round[];
			constructor(properties?: casino.Itable_replay);
			public static encode(message: table_replay): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_replay;
		}

		interface Itable_outcard {
			player_id: number;
			type?: number;
			param?: number;
			cards?: number[];
		}

		class table_outcard implements Itable_outcard {
			public player_id: number;
			public type: number;
			public param: number;
			public cards: number[];
			constructor(properties?: casino.Itable_outcard);
			public static encode(message: table_outcard): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_outcard;
		}

		interface Itable {
			id?: Long;
			name?: string;
			casino_id?: number;
			room_id?: number;
			mode?: number;
			join?: number;
			pause?: boolean;
			time?: number;
			base?: number;
			bet?: Long;
			status?: number;
			play_total?: number;
			card?: number;
			round?: number;
			master_id?: number;
			lord_id?: number;
			op_id?: number;
			target_id?: number;
			flag?: number;
			cur_idx?: number;
			fanpai?: number;
			outcard?: number;
			laizi?: number;
			cardcount?: number;
			players?: casino.Itable_player[];
			remaincards?: number[];
			outcards?: casino.Itable_outcard[];
			tag?: number;
			create_time?: Long;
			disband_time?: Long;
			quit_time?: Long;
			end_time?: Long;
			start_time?: Long;
			replay?: casino.Itable_replay;
			disband_id?: number;
			disband_type?: number;
			guild_id?: number;
			guild_room_id?: number;
			match_id?: number;
			match_cost_type?: number;
			match_cost_param?: number;
			match_level?: number;
			match_name?: string;
		}

		class table implements Itable {
			public id: Long;
			public name: string;
			public casino_id: number;
			public room_id: number;
			public mode: number;
			public join: number;
			public pause: boolean;
			public time: number;
			public base: number;
			public bet: Long;
			public status: number;
			public play_total: number;
			public card: number;
			public round: number;
			public master_id: number;
			public lord_id: number;
			public op_id: number;
			public target_id: number;
			public flag: number;
			public cur_idx: number;
			public fanpai: number;
			public outcard: number;
			public laizi: number;
			public cardcount: number;
			public players: casino.Itable_player[];
			public remaincards: number[];
			public outcards: casino.Itable_outcard[];
			public tag: number;
			public create_time: Long;
			public disband_time: Long;
			public quit_time: Long;
			public end_time: Long;
			public start_time: Long;
			public replay: casino.Itable_replay;
			public disband_id: number;
			public disband_type: number;
			public guild_id: number;
			public guild_room_id: number;
			public match_id: number;
			public match_cost_type: number;
			public match_cost_param: number;
			public match_level: number;
			public match_name: string;
			constructor(properties?: casino.Itable);
			public static encode(message: table): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table;
		}

		interface Icasino {
			id: number;
			name?: string;
			disable?: boolean;
			ver?: number;
			url?: string;
			server_id?: number;
			info?: string;
		}

		class casino implements Icasino {
			public id: number;
			public name: string;
			public disable: boolean;
			public ver: number;
			public url: string;
			public server_id: number;
			public info: string;
			constructor(properties?: casino.Icasino);
			public static encode(message: casino): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): casino;
		}

		interface Iitem {
			id: number;
			name?: string;
			casino_id?: number;
			disable?: boolean;
			price?: number;
			icon?: string;
		}

		class item implements Iitem {
			public id: number;
			public name: string;
			public casino_id: number;
			public disable: boolean;
			public price: number;
			public icon: string;
			constructor(properties?: casino.Iitem);
			public static encode(message: item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): item;
		}

		interface Itask {
			id: number;
			name: string;
			group?: number;
			type?: number;
			casino_id?: number;
			casinos?: number[];
			timeout?: number;
			prev_id?: number;
			condition_type?: number;
			condition_id?: number;
			condition_param?: number;
			condition_level?: number;
			condition_data?: string;
			awards?: casino.Iobject[];
			res_path?: string;
			icon_path?: string;
			info?: string;
		}

		class task implements Itask {
			public id: number;
			public name: string;
			public group: number;
			public type: number;
			public casino_id: number;
			public casinos: number[];
			public timeout: number;
			public prev_id: number;
			public condition_type: number;
			public condition_id: number;
			public condition_param: number;
			public condition_level: number;
			public condition_data: string;
			public awards: casino.Iobject[];
			public res_path: string;
			public icon_path: string;
			public info: string;
			constructor(properties?: casino.Itask);
			public static encode(message: task): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): task;
		}

		interface Iact {
			id: number;
			name?: string;
			disable?: boolean;
		}

		class act implements Iact {
			public id: number;
			public name: string;
			public disable: boolean;
			constructor(properties?: casino.Iact);
			public static encode(message: act): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): act;
		}

		interface Iact_checkin_day {
			id: number;
			idx?: number;
			param?: number;
			awards?: casino.Iobject[];
			vip_awards?: casino.Iobject[];
		}

		class act_checkin_day implements Iact_checkin_day {
			public id: number;
			public idx: number;
			public param: number;
			public awards: casino.Iobject[];
			public vip_awards: casino.Iobject[];
			constructor(properties?: casino.Iact_checkin_day);
			public static encode(message: act_checkin_day): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): act_checkin_day;
		}

		interface Iact_checkin_counter {
			id: number;
			idx?: number;
			param?: number;
			awards?: casino.Iobject[];
			vip_awards?: casino.Iobject[];
		}

		class act_checkin_counter implements Iact_checkin_counter {
			public id: number;
			public idx: number;
			public param: number;
			public awards: casino.Iobject[];
			public vip_awards: casino.Iobject[];
			constructor(properties?: casino.Iact_checkin_counter);
			public static encode(message: act_checkin_counter): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): act_checkin_counter;
		}

		interface Iact_card_free {
			id: number;
			type?: number;
			disable?: boolean;
			start_date?: Long;
			end_date?: Long;
			start_time?: number;
			end_time?: number;
		}

		class act_card_free implements Iact_card_free {
			public id: number;
			public type: number;
			public disable: boolean;
			public start_date: Long;
			public end_date: Long;
			public start_time: number;
			public end_time: number;
			constructor(properties?: casino.Iact_card_free);
			public static encode(message: act_card_free): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): act_card_free;
		}

		interface Ired_rain {
			rate?: number;
			min?: number;
			max?: number;
		}

		class red_rain implements Ired_rain {
			public rate: number;
			public min: number;
			public max: number;
			constructor(properties?: casino.Ired_rain);
			public static encode(message: red_rain): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): red_rain;
		}

		interface Iact_red_rain {
			id: number;
			disable?: boolean;
			start_date?: Long;
			end_date?: Long;
			start_time?: number;
			end_time?: number;
			amount?: number;
			play_today?: number;
			week_loop?: number[];
			rains?: casino.Ired_rain[];
		}

		class act_red_rain implements Iact_red_rain {
			public id: number;
			public disable: boolean;
			public start_date: Long;
			public end_date: Long;
			public start_time: number;
			public end_time: number;
			public amount: number;
			public play_today: number;
			public week_loop: number[];
			public rains: casino.Ired_rain[];
			constructor(properties?: casino.Iact_red_rain);
			public static encode(message: act_red_rain): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): act_red_rain;
		}

		interface Ibind_data {
			exchange_enable?: boolean;
			devote_enable?: boolean;
			card_start?: number;
			devote_plus?: number;
			init_award_play?: number;
			init_award_point?: number;
			bind_award_point?: number;
			devote_vip_level?: number;
			exchange_type?: number;
			exchange_num?: number;
			exchange_gain?: number;
			exchange_cost?: number;
			exchange_min?: number;
			exchange_max?: number;
			exchange_limit?: number;
		}

		class bind_data implements Ibind_data {
			public exchange_enable: boolean;
			public devote_enable: boolean;
			public card_start: number;
			public devote_plus: number;
			public init_award_play: number;
			public init_award_point: number;
			public bind_award_point: number;
			public devote_vip_level: number;
			public exchange_type: number;
			public exchange_num: number;
			public exchange_gain: number;
			public exchange_cost: number;
			public exchange_min: number;
			public exchange_max: number;
			public exchange_limit: number;
			constructor(properties?: casino.Ibind_data);
			public static encode(message: bind_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): bind_data;
		}

		interface Iguild_data {
			guild_member_max?: number;
			guild_join_max?: number;
			guild_request_max?: number;
			guild_name_max?: number;
			guild_create_card?: number;
			guild_viplevel?: number;
			guild_friend_cost?: number;
			guild_close_cost?: number;
			guild_name_cost?: number;
			guild_table_real?: boolean;
			guild_close_enable?: boolean;
			guild_kick_enable?: boolean;
			guild_quit_enable?: boolean;
			guild_room_enable?: boolean;
			guild_room_log_enable?: boolean;
			guild_name_enable?: boolean;
			guild_friend_enable?: boolean;
			guild_power_enable?: boolean;
			guild_log_enable?: boolean;
			guild_room_max?: number;
			guild_room_card_min?: number;
			guild_room_card_max?: number;
			guild_room_table_min?: number;
			guild_room_table_max?: number;
			guild_room_log_time?: number;
			guild_room_create_day?: number;
			guild_create_table_time?: number;
			guild_request_time?: number;
			guild_log_page?: number;
			guild_log_time?: number;
			guild_log_day?: number;
			guild_room_close?: number;
		}

		class guild_data implements Iguild_data {
			public guild_member_max: number;
			public guild_join_max: number;
			public guild_request_max: number;
			public guild_name_max: number;
			public guild_create_card: number;
			public guild_viplevel: number;
			public guild_friend_cost: number;
			public guild_close_cost: number;
			public guild_name_cost: number;
			public guild_table_real: boolean;
			public guild_close_enable: boolean;
			public guild_kick_enable: boolean;
			public guild_quit_enable: boolean;
			public guild_room_enable: boolean;
			public guild_room_log_enable: boolean;
			public guild_name_enable: boolean;
			public guild_friend_enable: boolean;
			public guild_power_enable: boolean;
			public guild_log_enable: boolean;
			public guild_room_max: number;
			public guild_room_card_min: number;
			public guild_room_card_max: number;
			public guild_room_table_min: number;
			public guild_room_table_max: number;
			public guild_room_log_time: number;
			public guild_room_create_day: number;
			public guild_create_table_time: number;
			public guild_request_time: number;
			public guild_log_page: number;
			public guild_log_time: number;
			public guild_log_day: number;
			public guild_room_close: number;
			constructor(properties?: casino.Iguild_data);
			public static encode(message: guild_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_data;
		}

		interface Iguild_member {
			id?: number;
			nickname?: string;
			sex?: number;
			online?: boolean;
			avatar?: number;
			player_id?: number;
			channel?: string;
			channel_head?: string;
			channel_nickname?: string;
			login_time?: Long;
			join_time?: Long;
			power?: number;
			table_create_total?: number;
			table_create_today?: number;
			table_create_week?: number;
			table_create_month?: number;
			table_create_time?: Long;
			table_play_total?: number;
			table_play_today?: number;
			table_play_week?: number;
			table_play_month?: number;
			table_play_time?: Long;
		}

		class guild_member implements Iguild_member {
			public id: number;
			public nickname: string;
			public sex: number;
			public online: boolean;
			public avatar: number;
			public player_id: number;
			public channel: string;
			public channel_head: string;
			public channel_nickname: string;
			public login_time: Long;
			public join_time: Long;
			public power: number;
			public table_create_total: number;
			public table_create_today: number;
			public table_create_week: number;
			public table_create_month: number;
			public table_create_time: Long;
			public table_play_total: number;
			public table_play_today: number;
			public table_play_week: number;
			public table_play_month: number;
			public table_play_time: Long;
			constructor(properties?: casino.Iguild_member);
			public static encode(message: guild_member): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_member;
		}

		interface Iguild_request {
			id?: number;
			player_id?: number;
			nickname?: string;
			sex?: number;
			online?: boolean;
			avatar?: number;
			channel?: string;
			channel_head?: string;
			channel_nickname?: string;
			leave_guild?: number;
			request_time?: Long;
		}

		class guild_request implements Iguild_request {
			public id: number;
			public player_id: number;
			public nickname: string;
			public sex: number;
			public online: boolean;
			public avatar: number;
			public channel: string;
			public channel_head: string;
			public channel_nickname: string;
			public leave_guild: number;
			public request_time: Long;
			constructor(properties?: casino.Iguild_request);
			public static encode(message: guild_request): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_request;
		}

		interface Iguild_permission_config {
			id?: number;
			disable?: number;
			param?: number;
			desc?: string;
		}

		class guild_permission_config implements Iguild_permission_config {
			public id: number;
			public disable: number;
			public param: number;
			public desc: string;
			constructor(properties?: casino.Iguild_permission_config);
			public static encode(message: guild_permission_config): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_permission_config;
		}

		interface Iguild_room {
			id?: number;
			guild_id?: number;
			casino_id?: number;
			room_id?: number;
			master_id?: number;
			base?: number;
			round?: number;
			flag?: number;
			amount?: number;
			card_curr?: number;
			card_gain?: number;
			card_gain_time?: Long;
			card_cost?: number;
			card_cost_time?: Long;
			create_time?: Long;
		}

		class guild_room implements Iguild_room {
			public id: number;
			public guild_id: number;
			public casino_id: number;
			public room_id: number;
			public master_id: number;
			public base: number;
			public round: number;
			public flag: number;
			public amount: number;
			public card_curr: number;
			public card_gain: number;
			public card_gain_time: Long;
			public card_cost: number;
			public card_cost_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iguild_room);
			public static encode(message: guild_room): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_room;
		}

		interface Iguild_table_player {
			id?: number;
			nickname?: string;
			sex?: number;
			avatar?: number;
			ready?: boolean;
			score?: number;
			channel_head?: string;
			channel_nickname?: string;
			channel?: string;
		}

		class guild_table_player implements Iguild_table_player {
			public id: number;
			public nickname: string;
			public sex: number;
			public avatar: number;
			public ready: boolean;
			public score: number;
			public channel_head: string;
			public channel_nickname: string;
			public channel: string;
			constructor(properties?: casino.Iguild_table_player);
			public static encode(message: guild_table_player): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_table_player;
		}

		interface Iguild_table_log {
			id?: number;
			guild_id?: number;
			guild_room_id?: number;
			casino_id?: number;
			room_id?: number;
			master_id?: number;
			table_id?: Long;
			table_tag?: number;
			replay_id?: number;
			round_max?: number;
			round_cur?: number;
			card?: number;
			base?: number;
			player_max?: number;
			players?: casino.Iguild_table_player[];
			create_time?: Long;
			remove_time?: Long;
		}

		class guild_table_log implements Iguild_table_log {
			public id: number;
			public guild_id: number;
			public guild_room_id: number;
			public casino_id: number;
			public room_id: number;
			public master_id: number;
			public table_id: Long;
			public table_tag: number;
			public replay_id: number;
			public round_max: number;
			public round_cur: number;
			public card: number;
			public base: number;
			public player_max: number;
			public players: casino.Iguild_table_player[];
			public create_time: Long;
			public remove_time: Long;
			constructor(properties?: casino.Iguild_table_log);
			public static encode(message: guild_table_log): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_table_log;
		}

		interface Iguild_table {
			id?: Long;
			casino_id?: number;
			room_id?: number;
			master_id?: number;
			table_id?: Long;
			round?: number;
			base?: number;
			guild_id?: number;
			guild_room_id?: number;
			tag?: number;
			flag?: number;
			players?: casino.Iguild_table_player[];
		}

		class guild_table implements Iguild_table {
			public id: Long;
			public casino_id: number;
			public room_id: number;
			public master_id: number;
			public table_id: Long;
			public round: number;
			public base: number;
			public guild_id: number;
			public guild_room_id: number;
			public tag: number;
			public flag: number;
			public players: casino.Iguild_table_player[];
			constructor(properties?: casino.Iguild_table);
			public static encode(message: guild_table): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild_table;
		}

		interface Iguild {
			id?: number;
			master_id?: number;
			name?: string;
			online?: number;
			room_create_total?: number;
			room_create_today?: number;
			room_create_week?: number;
			room_create_month?: number;
			room_create_time?: Long;
			room_remove_total?: number;
			room_remove_today?: number;
			room_remove_week?: number;
			room_remove_month?: number;
			room_remove_time?: Long;
			room_log_total?: number;
			room_log_today?: number;
			room_log_week?: number;
			room_log_month?: number;
			room_log_time?: Long;
			rank_flag?: boolean;
			members?: casino.Iguild_member[];
			requests?: casino.Iguild_request[];
			rooms?: casino.Iguild_room[];
			tables?: casino.Iguild_table[];
			logs?: casino.Iguild_table_log[];
			create_time?: Long;
		}

		class guild implements Iguild {
			public id: number;
			public master_id: number;
			public name: string;
			public online: number;
			public room_create_total: number;
			public room_create_today: number;
			public room_create_week: number;
			public room_create_month: number;
			public room_create_time: Long;
			public room_remove_total: number;
			public room_remove_today: number;
			public room_remove_week: number;
			public room_remove_month: number;
			public room_remove_time: Long;
			public room_log_total: number;
			public room_log_today: number;
			public room_log_week: number;
			public room_log_month: number;
			public room_log_time: Long;
			public rank_flag: boolean;
			public members: casino.Iguild_member[];
			public requests: casino.Iguild_request[];
			public rooms: casino.Iguild_room[];
			public tables: casino.Iguild_table[];
			public logs: casino.Iguild_table_log[];
			public create_time: Long;
			constructor(properties?: casino.Iguild);
			public static encode(message: guild): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): guild;
		}

		interface Imatch_table_player {
			id?: number;
			nickname?: string;
			sex?: number;
			avatar?: number;
			ready?: boolean;
			score?: number;
			rank?: number;
			level?: number;
			channel_head?: string;
			channel_nickname?: string;
			channel?: string;
			item_id?: number;
		}

		class match_table_player implements Imatch_table_player {
			public id: number;
			public nickname: string;
			public sex: number;
			public avatar: number;
			public ready: boolean;
			public score: number;
			public rank: number;
			public level: number;
			public channel_head: string;
			public channel_nickname: string;
			public channel: string;
			public item_id: number;
			constructor(properties?: casino.Imatch_table_player);
			public static encode(message: match_table_player): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_table_player;
		}

		interface Imatch_table_log {
			id?: number;
			flag?: number;
			match_id?: number;
			casino_id?: number;
			room_id?: number;
			master_id?: number;
			table_id?: Long;
			table_tag?: number;
			replay_id?: number;
			round_max?: number;
			round_cur?: number;
			card?: number;
			level?: number;
			name?: string;
			base?: number;
			player_max?: number;
			players?: casino.Imatch_table_player[];
			create_time?: Long;
			remove_time?: Long;
		}

		class match_table_log implements Imatch_table_log {
			public id: number;
			public flag: number;
			public match_id: number;
			public casino_id: number;
			public room_id: number;
			public master_id: number;
			public table_id: Long;
			public table_tag: number;
			public replay_id: number;
			public round_max: number;
			public round_cur: number;
			public card: number;
			public level: number;
			public name: string;
			public base: number;
			public player_max: number;
			public players: casino.Imatch_table_player[];
			public create_time: Long;
			public remove_time: Long;
			constructor(properties?: casino.Imatch_table_log);
			public static encode(message: match_table_log): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_table_log;
		}

		interface Imatch_status {
			signup?: number;
		}

		class match_status implements Imatch_status {
			public signup: number;
			constructor(properties?: casino.Imatch_status);
			public static encode(message: match_status): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_status;
		}

		interface Imatch_open_time {
			st?: number;
			et?: number;
		}

		class match_open_time implements Imatch_open_time {
			public st: number;
			public et: number;
			constructor(properties?: casino.Imatch_open_time);
			public static encode(message: match_open_time): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_open_time;
		}

		interface Imatch_room {
			id?: number;
			disable?: number;
			name?: string;
			desc?: string;
			res?: string;
			casino_id?: number;
			room_id?: number;
			base?: number;
			round?: number;
			flag?: number;
			level?: number;
			promotion?: number;
			mode?: number;
			cost_type?: number;
			cost_param?: number;
			week_loop?: number[];
			items?: number[];
			integral?: number[];
			award?: number[];
			rank_count?: number;
			same_max?: number;
			day_max?: number;
			task_id?: number;
			start_time?: Long;
			end_time?: Long;
			open_time?: casino.Imatch_open_time[];
			view_time?: Long;
		}

		class match_room implements Imatch_room {
			public id: number;
			public disable: number;
			public name: string;
			public desc: string;
			public res: string;
			public casino_id: number;
			public room_id: number;
			public base: number;
			public round: number;
			public flag: number;
			public level: number;
			public promotion: number;
			public mode: number;
			public cost_type: number;
			public cost_param: number;
			public week_loop: number[];
			public items: number[];
			public integral: number[];
			public award: number[];
			public rank_count: number;
			public same_max: number;
			public day_max: number;
			public task_id: number;
			public start_time: Long;
			public end_time: Long;
			public open_time: casino.Imatch_open_time[];
			public view_time: Long;
			constructor(properties?: casino.Imatch_room);
			public static encode(message: match_room): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_room;
		}

		interface Imatch_item {
			id?: number;
			name?: string;
			type?: number;
			param?: number;
			res?: string;
		}

		class match_item implements Imatch_item {
			public id: number;
			public name: string;
			public type: number;
			public param: number;
			public res: string;
			constructor(properties?: casino.Imatch_item);
			public static encode(message: match_item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_item;
		}

		interface Imatch_data {
			match_enable?: boolean;
			match_log_time?: number;
			match_channel?: string;
			match_share?: number;
			match_bot_time?: number;
			modes?: number[];
			items?: casino.Imatch_item[];
			rooms?: casino.Imatch_room[];
			status?: casino.Imatch_status[];
			ranks?: casino.Irank_score_item[];
		}

		class match_data implements Imatch_data {
			public match_enable: boolean;
			public match_log_time: number;
			public match_channel: string;
			public match_share: number;
			public match_bot_time: number;
			public modes: number[];
			public items: casino.Imatch_item[];
			public rooms: casino.Imatch_room[];
			public status: casino.Imatch_status[];
			public ranks: casino.Irank_score_item[];
			constructor(properties?: casino.Imatch_data);
			public static encode(message: match_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): match_data;
		}

		interface Icard_test {
			tag?: number;
			casino_id?: number;
			room_id?: number;
			round?: number;
			playerlord?: number;
			base?: number;
			amount?: number;
			cards?: number[];
		}

		class card_test implements Icard_test {
			public tag: number;
			public casino_id: number;
			public room_id: number;
			public round: number;
			public playerlord: number;
			public base: number;
			public amount: number;
			public cards: number[];
			constructor(properties?: casino.Icard_test);
			public static encode(message: card_test): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): card_test;
		}

		interface Ibroadcast_config {
			id?: number;
			disable?: boolean;
			content?: string;
			play_duration?: number;
			play_interval?: number;
			start_time?: number;
			end_time?: number;
			create_time?: number;
			update_time?: number;
			weight?: number;
		}

		class broadcast_config implements Ibroadcast_config {
			public id: number;
			public disable: boolean;
			public content: string;
			public play_duration: number;
			public play_interval: number;
			public start_time: number;
			public end_time: number;
			public create_time: number;
			public update_time: number;
			public weight: number;
			constructor(properties?: casino.Ibroadcast_config);
			public static encode(message: broadcast_config): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): broadcast_config;
		}

		interface Ibind_third_robot {
			id?: number;
			guild_id?: number;
			type?: string;
			robot_id?: string;
			open_group_id?: string;
			union_id?: string;
			group_title?: string;
			xl_group_id?: string;
			nonce?: string;
			create_time?: number;
			update_time?: number;
			push?: number;
		}

		class bind_third_robot implements Ibind_third_robot {
			public id: number;
			public guild_id: number;
			public type: string;
			public robot_id: string;
			public open_group_id: string;
			public union_id: string;
			public group_title: string;
			public xl_group_id: string;
			public nonce: string;
			public create_time: number;
			public update_time: number;
			public push: number;
			constructor(properties?: casino.Ibind_third_robot);
			public static encode(message: bind_third_robot): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): bind_third_robot;
		}

		interface Ivip_config {
			id?: number;
			level?: number;
			exp?: number;
			res?: string;
			name?: string;
		}

		class vip_config implements Ivip_config {
			public id: number;
			public level: number;
			public exp: number;
			public res: string;
			public name: string;
			constructor(properties?: casino.Ivip_config);
			public static encode(message: vip_config): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): vip_config;
		}

		interface Ienergy_turnable {
			id?: number;
			disable?: boolean;
			winner_gain?: number;
			loser_gain?: number;
			draw?: number;
			room_id?: number;
			start_time?: Long;
			end_time?: Long;
			name?: string;
			week_loop?: number[];
			item?: casino.Ienergy_turnable_item[];
		}

		class energy_turnable implements Ienergy_turnable {
			public id: number;
			public disable: boolean;
			public winner_gain: number;
			public loser_gain: number;
			public draw: number;
			public room_id: number;
			public start_time: Long;
			public end_time: Long;
			public name: string;
			public week_loop: number[];
			public item: casino.Ienergy_turnable_item[];
			constructor(properties?: casino.Ienergy_turnable);
			public static encode(message: energy_turnable): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): energy_turnable;
		}

		interface Ienergy_turnable_item {
			id?: number;
			et_id?: number;
			disable?: boolean;
			type?: number;
			type_id?: number;
			param?: number;
			rate?: number;
			name?: string;
			res_path?: string;
			desc?: string;
		}

		class energy_turnable_item implements Ienergy_turnable_item {
			public id: number;
			public et_id: number;
			public disable: boolean;
			public type: number;
			public type_id: number;
			public param: number;
			public rate: number;
			public name: string;
			public res_path: string;
			public desc: string;
			constructor(properties?: casino.Ienergy_turnable_item);
			public static encode(message: energy_turnable_item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): energy_turnable_item;
		}

		interface Irank_score_item {
			id?: number;
			disable?: number;
			award_type?: number;
			start_award?: number;
			end_award?: number;
			items?: casino.Irank_award_item[];
		}

		class rank_score_item implements Irank_score_item {
			public id: number;
			public disable: number;
			public award_type: number;
			public start_award: number;
			public end_award: number;
			public items: casino.Irank_award_item[];
			constructor(properties?: casino.Irank_score_item);
			public static encode(message: rank_score_item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): rank_score_item;
		}

		interface Irank_award_item {
			id?: number;
			disable?: number;
			type?: number;
			goods?: string;
			goods_count?: number;
			convert_day?: number;
			goods_res?: string;
			rank_res?: string;
			desc?: string;
		}

		class rank_award_item implements Irank_award_item {
			public id: number;
			public disable: number;
			public type: number;
			public goods: string;
			public goods_count: number;
			public convert_day: number;
			public goods_res: string;
			public rank_res: string;
			public desc: string;
			constructor(properties?: casino.Irank_award_item);
			public static encode(message: rank_award_item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): rank_award_item;
		}

		interface Iplayer_pay {
			id: Long;
			pay_id?: number;
			timeout?: Long;
			tag?: number;
			order_total?: number;
			order_today?: number;
			order_week?: number;
			order_month?: number;
			order_time?: Long;
			pay_total?: number;
			pay_today?: number;
			pay_week?: number;
			pay_month?: number;
			pay_time?: Long;
			cash_total?: number;
			cash_today?: number;
			cash_week?: number;
			cash_month?: number;
			create_time?: Long;
		}

		class player_pay implements Iplayer_pay {
			public id: Long;
			public pay_id: number;
			public timeout: Long;
			public tag: number;
			public order_total: number;
			public order_today: number;
			public order_week: number;
			public order_month: number;
			public order_time: Long;
			public pay_total: number;
			public pay_today: number;
			public pay_week: number;
			public pay_month: number;
			public pay_time: Long;
			public cash_total: number;
			public cash_today: number;
			public cash_week: number;
			public cash_month: number;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_pay);
			public static encode(message: player_pay): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_pay;
		}

		interface Iplayer_min {
			id?: number;
			nickname?: string;
			phone?: string;
			face?: string;
			sex?: number;
			avatar?: number;
			guild_id?: number;
			bot?: boolean;
			online?: boolean;
			table_id?: Long;
			leave_guild?: number;
			login_time?: Long;
			data_mj?: casino.Iplayer_mj;
			data_gdy?: casino.Iplayer_gdy;
			data_tmhh?: casino.Iplayer_tmhh;
			data_qjhh?: casino.Iplayer_qjhh;
			data_tmyh?: casino.Iplayer_tmyh;
			data_hhyx?: casino.Iplayer_hhyx;
			data_hcyx?: casino.Iplayer_hcyx;
			data_sshh?: casino.Iplayer_sshh;
			data_mjtl?: casino.Iplayer_mjtl;
			channel_head?: string;
			channel_nickname?: string;
			channel?: string;
			coord?: casino.Icoordinate;
		}

		class player_min implements Iplayer_min {
			public id: number;
			public nickname: string;
			public phone: string;
			public face: string;
			public sex: number;
			public avatar: number;
			public guild_id: number;
			public bot: boolean;
			public online: boolean;
			public table_id: Long;
			public leave_guild: number;
			public login_time: Long;
			public data_mj: casino.Iplayer_mj;
			public data_gdy: casino.Iplayer_gdy;
			public data_tmhh: casino.Iplayer_tmhh;
			public data_qjhh: casino.Iplayer_qjhh;
			public data_tmyh: casino.Iplayer_tmyh;
			public data_hhyx: casino.Iplayer_hhyx;
			public data_hcyx: casino.Iplayer_hcyx;
			public data_sshh: casino.Iplayer_sshh;
			public data_mjtl: casino.Iplayer_mjtl;
			public channel_head: string;
			public channel_nickname: string;
			public channel: string;
			public coord: casino.Icoordinate;
			constructor(properties?: casino.Iplayer_min);
			public static encode(message: player_min): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_min;
		}

		interface Iplayer_rank {
			id: number;
			nickname?: string;
			rank?: number;
			param?: Long;
			channel_head?: string;
			channel_nickname?: string;
		}

		class player_rank implements Iplayer_rank {
			public id: number;
			public nickname: string;
			public rank: number;
			public param: Long;
			public channel_head: string;
			public channel_nickname: string;
			constructor(properties?: casino.Iplayer_rank);
			public static encode(message: player_rank): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_rank;
		}

		interface Iplayer {
			id: number;
			nickname?: string;
			device_token?: string;
			phone?: string;
			sex?: number;
			invite_code?: string;
			avatar?: number;
			user_id: Long;
			server_id: number;
			level?: number;
			exp?: number;
			vip_level?: number;
			vip_exp?: number;
			vip?: number;
			bot?: boolean;
			quit_total?: number;
			quit_time?: number;
			leave_guild?: number;
			channel?: string;
			total_day?: number;
			cont_day?: number;
			total_time?: number;
			today_time?: number;
			create_time?: Long;
			create_ip?: string;
			create_mac?: string;
			create_idfv?: string;
			create_idfa?: string;
			create_openudid?: string;
			connect_time?: Long;
			connect_ip?: string;
			connect_mac?: string;
			connect_idfv?: string;
			connect_idfa?: string;
			connect_openudid?: string;
			disconnect_time?: Long;
			connect_total?: number;
			connect_today?: number;
			connect_week?: number;
			connect_month?: number;
			ban_time?: Long;
		}

		class player implements Iplayer {
			public id: number;
			public nickname: string;
			public device_token: string;
			public phone: string;
			public sex: number;
			public invite_code: string;
			public avatar: number;
			public user_id: Long;
			public server_id: number;
			public level: number;
			public exp: number;
			public vip_level: number;
			public vip_exp: number;
			public vip: number;
			public bot: boolean;
			public quit_total: number;
			public quit_time: number;
			public leave_guild: number;
			public channel: string;
			public total_day: number;
			public cont_day: number;
			public total_time: number;
			public today_time: number;
			public create_time: Long;
			public create_ip: string;
			public create_mac: string;
			public create_idfv: string;
			public create_idfa: string;
			public create_openudid: string;
			public connect_time: Long;
			public connect_ip: string;
			public connect_mac: string;
			public connect_idfv: string;
			public connect_idfa: string;
			public connect_openudid: string;
			public disconnect_time: Long;
			public connect_total: number;
			public connect_today: number;
			public connect_week: number;
			public connect_month: number;
			public ban_time: Long;
			constructor(properties?: casino.Iplayer);
			public static encode(message: player): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player;
		}

		interface Iplayer_item {
			id: Long;
			item_id: number;
			amount?: number;
			gain_total?: number;
			gain_today?: number;
			gain_time?: Long;
			use_total?: number;
			use_today?: number;
			use_time?: Long;
			buy_total?: number;
			buy_today?: number;
			buy_time?: Long;
		}

		class player_item implements Iplayer_item {
			public id: Long;
			public item_id: number;
			public amount: number;
			public gain_total: number;
			public gain_today: number;
			public gain_time: Long;
			public use_total: number;
			public use_today: number;
			public use_time: Long;
			public buy_total: number;
			public buy_today: number;
			public buy_time: Long;
			constructor(properties?: casino.Iplayer_item);
			public static encode(message: player_item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_item;
		}

		interface Imail {
			id?: number;
			notify?: boolean;
			title?: string;
			sender?: string;
			content?: string;
			param?: number;
			gains?: casino.Iobject[];
			update_time?: Long;
			start_time?: Long;
			end_time?: Long;
		}

		class mail implements Imail {
			public id: number;
			public notify: boolean;
			public title: string;
			public sender: string;
			public content: string;
			public param: number;
			public gains: casino.Iobject[];
			public update_time: Long;
			public start_time: Long;
			public end_time: Long;
			constructor(properties?: casino.Imail);
			public static encode(message: mail): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): mail;
		}

		interface Iplayer_mail {
			id: Long;
			mail_id: number;
			data: casino.Imail;
			params?: string[];
			create_time?: Long;
			view_time?: Long;
			remove_time?: Long;
		}

		class player_mail implements Iplayer_mail {
			public id: Long;
			public mail_id: number;
			public data: casino.Imail;
			public params: string[];
			public create_time: Long;
			public view_time: Long;
			public remove_time: Long;
			constructor(properties?: casino.Iplayer_mail);
			public static encode(message: player_mail): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_mail;
		}

		interface Iplayer_resource {
			id: Long;
			type: number;
			curr?: Long;
			peak?: Long;
			peak_time?: Long;
			gain?: Long;
			gain_time?: Long;
			cost?: Long;
			cost_time?: Long;
			create_time?: Long;
		}

		class player_resource implements Iplayer_resource {
			public id: Long;
			public type: number;
			public curr: Long;
			public peak: Long;
			public peak_time: Long;
			public gain: Long;
			public gain_time: Long;
			public cost: Long;
			public cost_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_resource);
			public static encode(message: player_resource): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_resource;
		}

		interface Iplayer_casino {
			id: Long;
			casino_id?: number;
			play_total?: number;
			play_today?: number;
			play_time?: Long;
			win_total?: number;
			win_today?: number;
			win_gold_total?: Long;
			win_gold_today?: Long;
			win_rank?: number;
			win_time?: Long;
			lost_total?: number;
			lost_today?: number;
			lost_gold_total?: Long;
			lost_gold_today?: Long;
			lost_rank?: number;
			lost_time?: Long;
			draw_total?: number;
			draw_today?: number;
			draw_time?: Long;
			create_time?: Long;
		}

		class player_casino implements Iplayer_casino {
			public id: Long;
			public casino_id: number;
			public play_total: number;
			public play_today: number;
			public play_time: Long;
			public win_total: number;
			public win_today: number;
			public win_gold_total: Long;
			public win_gold_today: Long;
			public win_rank: number;
			public win_time: Long;
			public lost_total: number;
			public lost_today: number;
			public lost_gold_total: Long;
			public lost_gold_today: Long;
			public lost_rank: number;
			public lost_time: Long;
			public draw_total: number;
			public draw_today: number;
			public draw_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_casino);
			public static encode(message: player_casino): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_casino;
		}

		interface Iplayer_friend {
			id: Long;
			friend_id?: number;
			status?: number;
			alias?: string;
			data?: casino.Iplayer_min;
			gift_card?: number;
			create_time?: Long;
		}

		class player_friend implements Iplayer_friend {
			public id: Long;
			public friend_id: number;
			public status: number;
			public alias: string;
			public data: casino.Iplayer_min;
			public gift_card: number;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_friend);
			public static encode(message: player_friend): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_friend;
		}

		interface Iplayer_message {
			id: Long;
			type?: number;
			friend_id?: number;
			nickname?: string;
			param?: number;
			data?: string;
			create_time?: Long;
		}

		class player_message implements Iplayer_message {
			public id: Long;
			public type: number;
			public friend_id: number;
			public nickname: string;
			public param: number;
			public data: string;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_message);
			public static encode(message: player_message): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_message;
		}

		interface Iplayer_task {
			id: Long;
			type?: number;
			group?: number;
			task_id?: number;
			condition_type?: number;
			param?: number;
			total?: number;
			today?: number;
			week?: number;
			month?: number;
			update_time?: Long;
			complete_time?: Long;
		}

		class player_task implements Iplayer_task {
			public id: Long;
			public type: number;
			public group: number;
			public task_id: number;
			public condition_type: number;
			public param: number;
			public total: number;
			public today: number;
			public week: number;
			public month: number;
			public update_time: Long;
			public complete_time: Long;
			constructor(properties?: casino.Iplayer_task);
			public static encode(message: player_task): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_task;
		}

		interface Iplayer_act {
			id: Long;
			type: number;
			act_id?: number;
			param?: number;
			mask?: number;
			total?: number;
			today?: number;
			week?: number;
			month?: number;
			act_time?: Long;
			complete_time?: Long;
			create_time?: Long;
		}

		class player_act implements Iplayer_act {
			public id: Long;
			public type: number;
			public act_id: number;
			public param: number;
			public mask: number;
			public total: number;
			public today: number;
			public week: number;
			public month: number;
			public act_time: Long;
			public complete_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_act);
			public static encode(message: player_act): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_act;
		}

		interface Iplayer_lucky {
			id?: Long;
			total?: number;
			today?: number;
			week?: number;
			month?: number;
			lucky_time?: Long;
			create_time?: Long;
		}

		class player_lucky implements Iplayer_lucky {
			public id: Long;
			public total: number;
			public today: number;
			public week: number;
			public month: number;
			public lucky_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_lucky);
			public static encode(message: player_lucky): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_lucky;
		}

		interface Iplayer_helper {
			id?: Long;
			param?: number;
			total?: number;
			today?: number;
			week?: number;
			month?: number;
			trigger_time?: Long;
			helper_time?: Long;
			create_time?: Long;
		}

		class player_helper implements Iplayer_helper {
			public id: Long;
			public param: number;
			public total: number;
			public today: number;
			public week: number;
			public month: number;
			public trigger_time: Long;
			public helper_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_helper);
			public static encode(message: player_helper): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_helper;
		}

		interface Iplayer_lottery {
			id?: Long;
			group_id?: number;
			total?: number;
			today?: number;
			week?: number;
			month?: number;
			lottery_time?: Long;
			create_time?: Long;
		}

		class player_lottery implements Iplayer_lottery {
			public id: Long;
			public group_id: number;
			public total: number;
			public today: number;
			public week: number;
			public month: number;
			public lottery_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_lottery);
			public static encode(message: player_lottery): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_lottery;
		}

		interface Iplayer_guild {
			id?: Long;
			guild_id?: number;
			join_time?: Long;
		}

		class player_guild implements Iplayer_guild {
			public id: Long;
			public guild_id: number;
			public join_time: Long;
			constructor(properties?: casino.Iplayer_guild);
			public static encode(message: player_guild): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_guild;
		}

		interface Iplayer_red {
			id?: Long;
			cash_total?: number;
			cash_today?: number;
			num_total?: number;
			num_today?: number;
			create_time?: Long;
			cash_time?: Long;
		}

		class player_red implements Iplayer_red {
			public id: Long;
			public cash_total: number;
			public cash_today: number;
			public num_total: number;
			public num_today: number;
			public create_time: Long;
			public cash_time: Long;
			constructor(properties?: casino.Iplayer_red);
			public static encode(message: player_red): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_red;
		}

		interface Iplayer_bind {
			id?: number;
			bind_time?: Long;
			bind_id?: number;
			nickname?: string;
			play_total?: number;
			play_today?: number;
			play_week?: number;
			play_month?: number;
			play_time?: Long;
			devote?: number;
			devote_time?: Long;
			exchange_total?: number;
			exchange_today?: number;
			exchange_week?: number;
			exchange_month?: number;
			card_total?: number;
			card_today?: number;
			card_week?: number;
			card_month?: number;
			exchange_time?: Long;
			create_time?: Long;
		}

		class player_bind implements Iplayer_bind {
			public id: number;
			public bind_time: Long;
			public bind_id: number;
			public nickname: string;
			public play_total: number;
			public play_today: number;
			public play_week: number;
			public play_month: number;
			public play_time: Long;
			public devote: number;
			public devote_time: Long;
			public exchange_total: number;
			public exchange_today: number;
			public exchange_week: number;
			public exchange_month: number;
			public card_total: number;
			public card_today: number;
			public card_week: number;
			public card_month: number;
			public exchange_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_bind);
			public static encode(message: player_bind): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_bind;
		}

		interface Iplayer_match {
			id: Long;
			match_id?: number;
			win?: number;
			lost?: number;
			total?: number;
			today?: number;
			week?: number;
			month?: number;
			match_time?: Long;
			create_time?: Long;
		}

		class player_match implements Iplayer_match {
			public id: Long;
			public match_id: number;
			public win: number;
			public lost: number;
			public total: number;
			public today: number;
			public week: number;
			public month: number;
			public match_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Iplayer_match);
			public static encode(message: player_match): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_match;
		}

		interface Iplayer_match_apply {
			plyer_id?: number;
			match_id?: number;
			match_level?: number;
			apply_time?: number;
		}

		class player_match_apply implements Iplayer_match_apply {
			public plyer_id: number;
			public match_id: number;
			public match_level: number;
			public apply_time: number;
			constructor(properties?: casino.Iplayer_match_apply);
			public static encode(message: player_match_apply): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_match_apply;
		}

		interface Iplayer_energy {
			id?: number;
			player_id?: number;
			curr_energy?: number;
			use_energy?: number;
			gain_energy?: number;
			total?: number;
			day?: number;
			week?: number;
			month?: number;
			create_time?: Long;
			draw_time?: Long;
			energy_time?: Long;
		}

		class player_energy implements Iplayer_energy {
			public id: number;
			public player_id: number;
			public curr_energy: number;
			public use_energy: number;
			public gain_energy: number;
			public total: number;
			public day: number;
			public week: number;
			public month: number;
			public create_time: Long;
			public draw_time: Long;
			public energy_time: Long;
			constructor(properties?: casino.Iplayer_energy);
			public static encode(message: player_energy): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_energy;
		}

		interface Iplayer_data {
			data: casino.Iplayer;
			pays?: casino.Iplayer_pay[];
			resources?: casino.Iplayer_resource[];
			casinos?: casino.Iplayer_casino[];
			tasks?: casino.Iplayer_task[];
			acts?: casino.Iplayer_act[];
			items?: casino.Iplayer_item[];
			friends?: casino.Iplayer_friend[];
			messages?: casino.Iplayer_message[];
			mails?: casino.Iplayer_mail[];
			matchs?: casino.Iplayer_match[];
			lucky?: casino.Iplayer_lucky;
			helper?: casino.Iplayer_helper;
			lottery?: casino.Iplayer_lottery;
			red?: casino.Iplayer_red;
			bind?: casino.Iplayer_bind;
			energy?: casino.Iplayer_energy;
			table_id?: Long;
			room_id?: number;
			match_apply?: casino.Iplayer_match_apply;
			data_mj?: casino.Iplayer_mj;
			data_gdy?: casino.Iplayer_gdy;
			data_tmhh?: casino.Iplayer_tmhh;
			data_qjhh?: casino.Iplayer_qjhh;
			data_tmyh?: casino.Iplayer_tmyh;
			data_hhyx?: casino.Iplayer_hhyx;
			data_hcyx?: casino.Iplayer_hcyx;
			data_sshh?: casino.Iplayer_sshh;
			data_mjtl?: casino.Iplayer_mjtl;
			data_tcmj?: casino.Iplayer_tcmj;
			channel_head?: string;
			channel_nickname?: string;
			guild_id?: number;
			guild_request_id?: number;
			guild_ids?: number[];
			guild_request_ids?: number[];
			leave_guild?: number;
			im_accid?: string;
			coord?: casino.Icoordinate;
		}

		class player_data implements Iplayer_data {
			public data: casino.Iplayer;
			public pays: casino.Iplayer_pay[];
			public resources: casino.Iplayer_resource[];
			public casinos: casino.Iplayer_casino[];
			public tasks: casino.Iplayer_task[];
			public acts: casino.Iplayer_act[];
			public items: casino.Iplayer_item[];
			public friends: casino.Iplayer_friend[];
			public messages: casino.Iplayer_message[];
			public mails: casino.Iplayer_mail[];
			public matchs: casino.Iplayer_match[];
			public lucky: casino.Iplayer_lucky;
			public helper: casino.Iplayer_helper;
			public lottery: casino.Iplayer_lottery;
			public red: casino.Iplayer_red;
			public bind: casino.Iplayer_bind;
			public energy: casino.Iplayer_energy;
			public table_id: Long;
			public room_id: number;
			public match_apply: casino.Iplayer_match_apply;
			public data_mj: casino.Iplayer_mj;
			public data_gdy: casino.Iplayer_gdy;
			public data_tmhh: casino.Iplayer_tmhh;
			public data_qjhh: casino.Iplayer_qjhh;
			public data_tmyh: casino.Iplayer_tmyh;
			public data_hhyx: casino.Iplayer_hhyx;
			public data_hcyx: casino.Iplayer_hcyx;
			public data_sshh: casino.Iplayer_sshh;
			public data_mjtl: casino.Iplayer_mjtl;
			public data_tcmj: casino.Iplayer_tcmj;
			public channel_head: string;
			public channel_nickname: string;
			public guild_id: number;
			public guild_request_id: number;
			public guild_ids: number[];
			public guild_request_ids: number[];
			public leave_guild: number;
			public im_accid: string;
			public coord: casino.Icoordinate;
			constructor(properties?: casino.Iplayer_data);
			public static encode(message: player_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_data;
		}

		interface Ibot {
			id: number;
			nickname?: string;
			level?: number;
			sex?: number;
			gold_curr?: Long;
			gold_min?: Long;
			gold_peak?: Long;
			gold_gain?: Long;
			gold_cost?: Long;
		}

		class bot implements Ibot {
			public id: number;
			public nickname: string;
			public level: number;
			public sex: number;
			public gold_curr: Long;
			public gold_min: Long;
			public gold_peak: Long;
			public gold_gain: Long;
			public gold_cost: Long;
			constructor(properties?: casino.Ibot);
			public static encode(message: bot): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): bot;
		}

		interface Itable_score {
			id: Long;
			create_time?: Long;
		}

		class table_score implements Itable_score {
			public id: Long;
			public create_time: Long;
			constructor(properties?: casino.Itable_score);
			public static encode(message: table_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): table_score;
		}

		interface IProxyMessage {
			Ops: number;
			Data?: ByteBuffer;
		}

		class ProxyMessage implements IProxyMessage {
			public Ops: number;
			public Data: ByteBuffer;
			constructor(properties?: casino.IProxyMessage);
			public static encode(message: ProxyMessage): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): ProxyMessage;
		}

		interface Ipacket_coordinate {
			player_id?: number;
			latitude?: casino.Idouble;
			longitude?: casino.Idouble;
			address?: string;
			ip?: string;
			ipaddress?: string;
		}

		class packet_coordinate implements Ipacket_coordinate {
			public player_id: number;
			public latitude: casino.Idouble;
			public longitude: casino.Idouble;
			public address: string;
			public ip: string;
			public ipaddress: string;
			constructor(properties?: casino.Ipacket_coordinate);
			public static encode(message: packet_coordinate): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_coordinate;
		}

		interface Ipacket_update {
			type: number;
			id: Long;
			merge?: boolean;
			owner_id?: number;
			msg?: number;
			data?: ByteBuffer;
		}

		class packet_update implements Ipacket_update {
			public type: number;
			public id: Long;
			public merge: boolean;
			public owner_id: number;
			public msg: number;
			public data: ByteBuffer;
			constructor(properties?: casino.Ipacket_update);
			public static encode(message: packet_update): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_update;
		}

		interface Ipacket_ping {
			now?: Long;
		}

		class packet_ping implements Ipacket_ping {
			public now: Long;
			constructor(properties?: casino.Ipacket_ping);
			public static encode(message: packet_ping): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_ping;
		}

		interface Ipacket_pong {
			now?: Long;
		}

		class packet_pong implements Ipacket_pong {
			public now: Long;
			constructor(properties?: casino.Ipacket_pong);
			public static encode(message: packet_pong): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_pong;
		}

		interface Idevice_info {
			package?: string;
			platform?: string;
			language?: string;
			version?: string;
			build?: string;
			idfa?: string;
			idfv?: string;
			udid?: string;
			openudid?: string;
			mac?: string;
			device?: string;
			device_version?: string;
			system?: string;
			system_version?: string;
			jailbreak?: boolean;
			phone?: string;
			sim?: string;
			imei?: string;
			imsi?: string;
			device_token?: string;
			ip?: string;
		}

		class device_info implements Idevice_info {
			public package: string;
			public platform: string;
			public language: string;
			public version: string;
			public build: string;
			public idfa: string;
			public idfv: string;
			public udid: string;
			public openudid: string;
			public mac: string;
			public device: string;
			public device_version: string;
			public system: string;
			public system_version: string;
			public jailbreak: boolean;
			public phone: string;
			public sim: string;
			public imei: string;
			public imsi: string;
			public device_token: string;
			public ip: string;
			constructor(properties?: casino.Idevice_info);
			public static encode(message: device_info): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): device_info;
		}

		interface Iround_cost {
			round: number;
			card: number;
		}

		class round_cost implements Iround_cost {
			public round: number;
			public card: number;
			constructor(properties?: casino.Iround_cost);
			public static encode(message: round_cost): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): round_cost;
		}

		interface Igame_round_cost {
			casino_id: number;
			rcosts?: casino.Iround_cost[];
		}

		class game_round_cost implements Igame_round_cost {
			public casino_id: number;
			public rcosts: casino.Iround_cost[];
			constructor(properties?: casino.Igame_round_cost);
			public static encode(message: game_round_cost): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): game_round_cost;
		}

		interface Igame_room_base {
			casino_id: number;
			roombases?: number[];
		}

		class game_room_base implements Igame_room_base {
			public casino_id: number;
			public roombases: number[];
			constructor(properties?: casino.Igame_room_base);
			public static encode(message: game_room_base): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): game_room_base;
		}

		interface Igame_config {
			user_min?: number;
			user_max?: number;
			pass_min?: number;
			pass_max?: number;
			nickname_min?: number;
			nickname_max?: number;
			chat_max?: number;
			viplevel_giftcard?: number;
			table_disband_time?: number;
			guild_viplevel?: number;
			guild_friend_cost?: number;
			guild_close_cost?: number;
			roundcosts?: casino.Igame_round_cost[];
			groombases?: casino.Igame_room_base[];
			gdy_endcard?: number;
			gdy_gangcard?: number;
			disable_event?: boolean;
			lang_gb?: boolean;
		}

		class game_config implements Igame_config {
			public user_min: number;
			public user_max: number;
			public pass_min: number;
			public pass_max: number;
			public nickname_min: number;
			public nickname_max: number;
			public chat_max: number;
			public viplevel_giftcard: number;
			public table_disband_time: number;
			public guild_viplevel: number;
			public guild_friend_cost: number;
			public guild_close_cost: number;
			public roundcosts: casino.Igame_round_cost[];
			public groombases: casino.Igame_room_base[];
			public gdy_endcard: number;
			public gdy_gangcard: number;
			public disable_event: boolean;
			public lang_gb: boolean;
			constructor(properties?: casino.Igame_config);
			public static encode(message: game_config): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): game_config;
		}

		interface Ibulletin {
			id: number;
			info?: string;
			param?: number;
			counter?: number;
			start_time?: Long;
			end_time?: Long;
		}

		class bulletin implements Ibulletin {
			public id: number;
			public info: string;
			public param: number;
			public counter: number;
			public start_time: Long;
			public end_time: Long;
			constructor(properties?: casino.Ibulletin);
			public static encode(message: bulletin): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): bulletin;
		}

		interface Ibulletin_data {
			datas?: casino.Ibulletin[];
		}

		class bulletin_data implements Ibulletin_data {
			public datas: casino.Ibulletin[];
			constructor(properties?: casino.Ibulletin_data);
			public static encode(message: bulletin_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): bulletin_data;
		}

		interface Ilucky {
			id: number;
			name?: string;
			type?: number;
			type_id?: number;
			param?: number;
			rate?: number;
			rank?: number;
			res_path?: string;
			desc?: string;
		}

		class lucky implements Ilucky {
			public id: number;
			public name: string;
			public type: number;
			public type_id: number;
			public param: number;
			public rate: number;
			public rank: number;
			public res_path: string;
			public desc: string;
			constructor(properties?: casino.Ilucky);
			public static encode(message: lucky): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lucky;
		}

		interface Ilucky_log {
			id?: Long;
			player_id?: number;
			nickname?: string;
			lucky_id?: number;
			lucky_name?: string;
			lucky_state?: string;
			send_time?: Long;
			create_time?: Long;
		}

		class lucky_log implements Ilucky_log {
			public id: Long;
			public player_id: number;
			public nickname: string;
			public lucky_id: number;
			public lucky_name: string;
			public lucky_state: string;
			public send_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Ilucky_log);
			public static encode(message: lucky_log): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lucky_log;
		}

		interface Ilucky_data {
			disable?: boolean;
			day?: number;
			share?: number;
			datas?: casino.Ilucky[];
			selflogs?: casino.Ilucky_log[];
			lastlogs?: casino.Ilucky_log[];
		}

		class lucky_data implements Ilucky_data {
			public disable: boolean;
			public day: number;
			public share: number;
			public datas: casino.Ilucky[];
			public selflogs: casino.Ilucky_log[];
			public lastlogs: casino.Ilucky_log[];
			constructor(properties?: casino.Ilucky_data);
			public static encode(message: lucky_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lucky_data;
		}

		interface Ihelper {
			wait?: number;
			gold?: number;
			param?: number;
		}

		class helper implements Ihelper {
			public wait: number;
			public gold: number;
			public param: number;
			constructor(properties?: casino.Ihelper);
			public static encode(message: helper): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): helper;
		}

		interface Ihelper_data {
			gold_min?: number;
			disable?: boolean;
			helpers?: casino.Ihelper[];
		}

		class helper_data implements Ihelper_data {
			public gold_min: number;
			public disable: boolean;
			public helpers: casino.Ihelper[];
			constructor(properties?: casino.Ihelper_data);
			public static encode(message: helper_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): helper_data;
		}

		interface Ilottery_item {
			id?: number;
			name?: string;
			type?: number;
			param?: number;
			res?: string;
		}

		class lottery_item implements Ilottery_item {
			public id: number;
			public name: string;
			public type: number;
			public param: number;
			public res: string;
			constructor(properties?: casino.Ilottery_item);
			public static encode(message: lottery_item): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lottery_item;
		}

		interface Ilottery {
			item_id: number;
			rate?: number;
		}

		class lottery implements Ilottery {
			public item_id: number;
			public rate: number;
			constructor(properties?: casino.Ilottery);
			public static encode(message: lottery): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lottery;
		}

		interface Ilottery_group {
			id: number;
			casinos?: number[];
			lotterys?: casino.Ilottery[];
		}

		class lottery_group implements Ilottery_group {
			public id: number;
			public casinos: number[];
			public lotterys: casino.Ilottery[];
			constructor(properties?: casino.Ilottery_group);
			public static encode(message: lottery_group): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lottery_group;
		}

		interface Ilottery_log {
			id?: Long;
			player_id?: number;
			group_id?: number;
			lottery_id?: number;
			lottery_name?: string;
			lottery_state?: string;
			send_time?: Long;
			create_time?: Long;
		}

		class lottery_log implements Ilottery_log {
			public id: Long;
			public player_id: number;
			public group_id: number;
			public lottery_id: number;
			public lottery_name: string;
			public lottery_state: string;
			public send_time: Long;
			public create_time: Long;
			constructor(properties?: casino.Ilottery_log);
			public static encode(message: lottery_log): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lottery_log;
		}

		interface Ilottery_data {
			items?: casino.Ilottery_item[];
			groups?: casino.Ilottery_group[];
			reds?: casino.Ilottery_group[];
			matchs?: casino.Ilottery_group[];
			selflogs?: casino.Ilottery_log[];
		}

		class lottery_data implements Ilottery_data {
			public items: casino.Ilottery_item[];
			public groups: casino.Ilottery_group[];
			public reds: casino.Ilottery_group[];
			public matchs: casino.Ilottery_group[];
			public selflogs: casino.Ilottery_log[];
			constructor(properties?: casino.Ilottery_data);
			public static encode(message: lottery_data): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): lottery_data;
		}

		interface Ipacket_fast_login_req {
			pay?: string;
			channel: string;
			reconnect?: boolean;
			user_id: number;
			ticket: string;
			devinfo?: casino.Idevice_info;
			gdatacrc?: number;
			pdatacrc?: number;
			request_id?: number;
		}

		class packet_fast_login_req implements Ipacket_fast_login_req {
			public pay: string;
			public channel: string;
			public reconnect: boolean;
			public user_id: number;
			public ticket: string;
			public devinfo: casino.Idevice_info;
			public gdatacrc: number;
			public pdatacrc: number;
			public request_id: number;
			constructor(properties?: casino.Ipacket_fast_login_req);
			public static encode(message: packet_fast_login_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_fast_login_req;
		}

		interface Ipacket_fast_login_ack {
			ret: number;
			channel: string;
			reconnect?: boolean;
			user_id?: number;
			player_id?: number;
			server_id?: number;
			casino_id?: number;
			unionid?: string;
			bind_robot?: boolean;
			gdata?: ByteBuffer;
			config?: casino.Igame_config;
			pdata?: casino.Iplayer_data;
			paydata?: casino.Ipay_data;
			reddata?: casino.Ired_data;
			binddata?: casino.Ibind_data;
			guilddata?: casino.Iguild_data;
			matchdata?: casino.Imatch_data;
			rooms?: casino.Iroom[];
			bulletindata?: casino.Ibulletin_data;
			luckydata?: casino.Ilucky_data;
			helperdata?: casino.Ihelper_data;
			lotterydata?: casino.Ilottery_data;
			vipdata?: casino.Ivip_config[];
			et_data?: casino.Ienergy_turnable[];
			request_id?: number;
		}

		class packet_fast_login_ack implements Ipacket_fast_login_ack {
			public ret: number;
			public channel: string;
			public reconnect: boolean;
			public user_id: number;
			public player_id: number;
			public server_id: number;
			public casino_id: number;
			public unionid: string;
			public bind_robot: boolean;
			public gdata: ByteBuffer;
			public config: casino.Igame_config;
			public pdata: casino.Iplayer_data;
			public paydata: casino.Ipay_data;
			public reddata: casino.Ired_data;
			public binddata: casino.Ibind_data;
			public guilddata: casino.Iguild_data;
			public matchdata: casino.Imatch_data;
			public rooms: casino.Iroom[];
			public bulletindata: casino.Ibulletin_data;
			public luckydata: casino.Ilucky_data;
			public helperdata: casino.Ihelper_data;
			public lotterydata: casino.Ilottery_data;
			public vipdata: casino.Ivip_config[];
			public et_data: casino.Ienergy_turnable[];
			public request_id: number;
			constructor(properties?: casino.Ipacket_fast_login_ack);
			public static encode(message: packet_fast_login_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_fast_login_ack;
		}

		interface Ipacket_table_create_req {
			casino_id: number;
			room_id?: number;
			base?: number;
			devote?: number;
			round?: number;
			join?: number;
			player_id?: number;
			guild_id?: number;
			flag?: number;
		}

		class packet_table_create_req implements Ipacket_table_create_req {
			public casino_id: number;
			public room_id: number;
			public base: number;
			public devote: number;
			public round: number;
			public join: number;
			public player_id: number;
			public guild_id: number;
			public flag: number;
			constructor(properties?: casino.Ipacket_table_create_req);
			public static encode(message: packet_table_create_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_create_req;
		}

		interface Ipacket_table_create_ack {
			ret: number;
			player_id?: number;
			tdata?: casino.Itable;
			guild_id?: number;
		}

		class packet_table_create_ack implements Ipacket_table_create_ack {
			public ret: number;
			public player_id: number;
			public tdata: casino.Itable;
			public guild_id: number;
			constructor(properties?: casino.Ipacket_table_create_ack);
			public static encode(message: packet_table_create_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_create_ack;
		}

		interface Ipacket_table_join_req {
			player_id?: number;
			casino_id?: number;
			room_id?: number;
			table_id?: Long;
			ready?: boolean;
			match_id?: number;
			tag?: number;
			type?: number;
		}

		class packet_table_join_req implements Ipacket_table_join_req {
			public player_id: number;
			public casino_id: number;
			public room_id: number;
			public table_id: Long;
			public ready: boolean;
			public match_id: number;
			public tag: number;
			public type: number;
			constructor(properties?: casino.Ipacket_table_join_req);
			public static encode(message: packet_table_join_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_join_req;
		}

		interface Ipacket_table_join_ack {
			ret: number;
			player_id?: number;
			tdata?: casino.Itable;
			reconnect?: boolean;
		}

		class packet_table_join_ack implements Ipacket_table_join_ack {
			public ret: number;
			public player_id: number;
			public tdata: casino.Itable;
			public reconnect: boolean;
			constructor(properties?: casino.Ipacket_table_join_ack);
			public static encode(message: packet_table_join_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_join_ack;
		}

		interface Ipacket_player_join_req {
			player_id?: number;
			request_id?: number;
		}

		class packet_player_join_req implements Ipacket_player_join_req {
			public player_id: number;
			public request_id: number;
			constructor(properties?: casino.Ipacket_player_join_req);
			public static encode(message: packet_player_join_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_player_join_req;
		}

		interface Ipacket_player_join_ack {
			ret: number;
			now?: Long;
			player_id?: number;
			request_id?: number;
		}

		class packet_player_join_ack implements Ipacket_player_join_ack {
			public ret: number;
			public now: Long;
			public player_id: number;
			public request_id: number;
			constructor(properties?: casino.Ipacket_player_join_ack);
			public static encode(message: packet_player_join_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_player_join_ack;
		}

		interface Ipacket_table_entry {
			idx: number;
			pdata: casino.Itable_player;
			table_id?: Long;
		}

		class packet_table_entry implements Ipacket_table_entry {
			public idx: number;
			public pdata: casino.Itable_player;
			public table_id: Long;
			constructor(properties?: casino.Ipacket_table_entry);
			public static encode(message: packet_table_entry): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_entry;
		}

		interface Ipacket_table_leave {
			idx: number;
			manage?: boolean;
			player_id?: number;
			table_id?: Long;
		}

		class packet_table_leave implements Ipacket_table_leave {
			public idx: number;
			public manage: boolean;
			public player_id: number;
			public table_id: Long;
			constructor(properties?: casino.Ipacket_table_leave);
			public static encode(message: packet_table_leave): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_leave;
		}

		interface Ipacket_table_ready {
			idx: number;
			player_id?: number;
			table_id?: Long;
		}

		class packet_table_ready implements Ipacket_table_ready {
			public idx: number;
			public player_id: number;
			public table_id: Long;
			constructor(properties?: casino.Ipacket_table_ready);
			public static encode(message: packet_table_ready): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_ready;
		}

		interface Ipacket_table_pause {
			player_id: number;
			quit_time?: Long;
			table_id?: Long;
			reason?: number;
		}

		class packet_table_pause implements Ipacket_table_pause {
			public player_id: number;
			public quit_time: Long;
			public table_id: Long;
			public reason: number;
			constructor(properties?: casino.Ipacket_table_pause);
			public static encode(message: packet_table_pause): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_pause;
		}

		interface Ipacket_table_managed {
			idx?: number;
			managed?: boolean;
			player_id?: number;
			table_id?: Long;
			quit_time?: Long;
		}

		class packet_table_managed implements Ipacket_table_managed {
			public idx: number;
			public managed: boolean;
			public player_id: number;
			public table_id: Long;
			public quit_time: Long;
			constructor(properties?: casino.Ipacket_table_managed);
			public static encode(message: packet_table_managed): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_managed;
		}

		interface Ipacket_table_update {
			tdata: casino.Itable;
		}

		class packet_table_update implements Ipacket_table_update {
			public tdata: casino.Itable;
			constructor(properties?: casino.Ipacket_table_update);
			public static encode(message: packet_table_update): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_update;
		}

		interface Iplayer_score {
			data?: casino.Iplayer_min;
			score?: number;
			score_total?: number;
			level?: number;
			money?: number;
			cards?: number[];
			selcards?: number[];
			curcards?: number[];
			huacards?: number[];
			opscores?: casino.Iop_score[];
			hupai_card?: number;
			last_card?: number;
			lost_card?: number;
			quit_total?: number;
			timeout_total?: number;
			lottery_group?: number;
			lottery_item?: number;
		}

		class player_score implements Iplayer_score {
			public data: casino.Iplayer_min;
			public score: number;
			public score_total: number;
			public level: number;
			public money: number;
			public cards: number[];
			public selcards: number[];
			public curcards: number[];
			public huacards: number[];
			public opscores: casino.Iop_score[];
			public hupai_card: number;
			public last_card: number;
			public lost_card: number;
			public quit_total: number;
			public timeout_total: number;
			public lottery_group: number;
			public lottery_item: number;
			constructor(properties?: casino.Iplayer_score);
			public static encode(message: player_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): player_score;
		}

		interface Ipacket_table_score {
			casino_id?: number;
			room_id?: number;
			time?: number;
			win_id?: number;
			cb_id?: number;
			op?: number;
			nextcard?: number;
			scores?: casino.Iplayer_score[];
			start_time?: Long;
			tdata?: casino.Itable;
			replay_id?: number;
			info?: string;
		}

		class packet_table_score implements Ipacket_table_score {
			public casino_id: number;
			public room_id: number;
			public time: number;
			public win_id: number;
			public cb_id: number;
			public op: number;
			public nextcard: number;
			public scores: casino.Iplayer_score[];
			public start_time: Long;
			public tdata: casino.Itable;
			public replay_id: number;
			public info: string;
			constructor(properties?: casino.Ipacket_table_score);
			public static encode(message: packet_table_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_score;
		}

		interface Ipacket_table_disband_req {
			player_id?: number;
			disband_time?: Long;
		}

		class packet_table_disband_req implements Ipacket_table_disband_req {
			public player_id: number;
			public disband_time: Long;
			constructor(properties?: casino.Ipacket_table_disband_req);
			public static encode(message: packet_table_disband_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_disband_req;
		}

		interface Ipacket_table_disband_ack {
			player_id?: number;
			disband?: boolean;
			ret?: number;
			table_id?: Long;
		}

		class packet_table_disband_ack implements Ipacket_table_disband_ack {
			public player_id: number;
			public disband: boolean;
			public ret: number;
			public table_id: Long;
			constructor(properties?: casino.Ipacket_table_disband_ack);
			public static encode(message: packet_table_disband_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_table_disband_ack;
		}

		interface Icasino_score {
			id: Long;
			casino_id: number;
			room_id: number;
			table_id: Long;
			table_tag?: number;
			round?: number;
			score?: number;
			money?: number;
			replay_id?: number;
			create_time?: Long;
		}

		class casino_score implements Icasino_score {
			public id: Long;
			public casino_id: number;
			public room_id: number;
			public table_id: Long;
			public table_tag: number;
			public round: number;
			public score: number;
			public money: number;
			public replay_id: number;
			public create_time: Long;
			constructor(properties?: casino.Icasino_score);
			public static encode(message: casino_score): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): casino_score;
		}

		interface Ipacket_score_ack {
			ret: number;
			casino_id?: number;
			scores?: casino.Icasino_score[];
		}

		class packet_score_ack implements Ipacket_score_ack {
			public ret: number;
			public casino_id: number;
			public scores: casino.Icasino_score[];
			constructor(properties?: casino.Ipacket_score_ack);
			public static encode(message: packet_score_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_score_ack;
		}

		interface Ipacket_score_time_req {
			casino_id?: number;
			day?: number;
		}

		class packet_score_time_req implements Ipacket_score_time_req {
			public casino_id: number;
			public day: number;
			constructor(properties?: casino.Ipacket_score_time_req);
			public static encode(message: packet_score_time_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_score_time_req;
		}

		interface Ipacket_score_time_ack {
			ret: number;
			casino_id?: number;
			scores?: casino.Icasino_score[];
		}

		class packet_score_time_ack implements Ipacket_score_time_ack {
			public ret: number;
			public casino_id: number;
			public scores: casino.Icasino_score[];
			constructor(properties?: casino.Ipacket_score_time_ack);
			public static encode(message: packet_score_time_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_score_time_ack;
		}

		interface Ipacket_replay_req {
			replay_id: number;
		}

		class packet_replay_req implements Ipacket_replay_req {
			public replay_id: number;
			constructor(properties?: casino.Ipacket_replay_req);
			public static encode(message: packet_replay_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_replay_req;
		}

		interface Ipacket_replay_ack {
			ret: number;
			replay_id: number;
			request_id?: number;
			replay?: ByteBuffer;
		}

		class packet_replay_ack implements Ipacket_replay_ack {
			public ret: number;
			public replay_id: number;
			public request_id: number;
			public replay: ByteBuffer;
			constructor(properties?: casino.Ipacket_replay_ack);
			public static encode(message: packet_replay_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_replay_ack;
		}

		interface Ipacket_card_req {
		}

		class packet_card_req implements Ipacket_card_req {
			constructor(properties?: casino.Ipacket_card_req);
			public static encode(message: packet_card_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_card_req;
		}

		interface Icasino_card {
			id: Long;
			reason?: string;
			op_id?: number;
			amount?: number;
			create_time?: Long;
		}

		class casino_card implements Icasino_card {
			public id: Long;
			public reason: string;
			public op_id: number;
			public amount: number;
			public create_time: Long;
			constructor(properties?: casino.Icasino_card);
			public static encode(message: casino_card): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): casino_card;
		}

		interface Ipacket_card_ack {
			ret: number;
			cards?: casino.Icasino_card[];
		}

		class packet_card_ack implements Ipacket_card_ack {
			public ret: number;
			public cards: casino.Icasino_card[];
			constructor(properties?: casino.Ipacket_card_ack);
			public static encode(message: packet_card_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_card_ack;
		}

		interface Ipacket_modify_req {
			player_id?: number;
			nickname?: string;
			phone?: string;
			sex?: number;
			avatar?: number;
		}

		class packet_modify_req implements Ipacket_modify_req {
			public player_id: number;
			public nickname: string;
			public phone: string;
			public sex: number;
			public avatar: number;
			constructor(properties?: casino.Ipacket_modify_req);
			public static encode(message: packet_modify_req): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_modify_req;
		}

		interface Ipacket_modify_ack {
			ret: number;
			player_id?: number;
			nickname?: string;
			phone?: string;
			sex?: number;
			avatar?: number;
		}

		class packet_modify_ack implements Ipacket_modify_ack {
			public ret: number;
			public player_id: number;
			public nickname: string;
			public phone: string;
			public sex: number;
			public avatar: number;
			constructor(properties?: casino.Ipacket_modify_ack);
			public static encode(message: packet_modify_ack): ByteBuffer;
			public static decode(reader: Uint8Array | ByteBuffer): packet_modify_ack;
		}

	}
}
