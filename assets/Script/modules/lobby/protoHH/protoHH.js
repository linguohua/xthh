exports.proto = require("protobuf").newBuilder({})['import']({
    "package": null,
    "syntax": "proto2",
    "messages": [
        {
            "name": "casino_gdy",
            "fields": [],
            "syntax": "proto2",
            "options": {
                "optimize_for": "CODE_SIZE"
            },
            "messages": [
                {
                    "name": "player_dice",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "dices",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_sc_start_play",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fanpai",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "laizi",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "lord_id",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "player_dice",
                            "name": "dices",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "packet_sc_drawcard",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_sc_endcard",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "hupai",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "player_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_add",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_cur",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_total",
                            "id": 12
                        }
                    ]
                },
                {
                    "name": "packet_sc_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "player_score",
                            "name": "scores",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_cs_outcard_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_sc_outcard_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "packet_sc_op",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_cs_op_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cancel_type",
                            "id": 7,
                            "options": {
                                "default": -1
                            }
                        }
                    ]
                },
                {
                    "name": "packet_sc_op_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cancel_type",
                            "id": 7,
                            "options": {
                                "default": -1
                            }
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_cs_cancelcard_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "card",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "packet_sc_reconnect",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "status",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "pailaizi",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "op",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "gdy_gang_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "gdy_gang_group",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "gdy_gang_score",
                            "name": "scores",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "gdy_gang",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "gang_id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "gdy_gang_group",
                            "name": "groups",
                            "id": 2
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "eGDY_STATUS",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "GDY_STATUS_STOP",
                            "id": 0
                        },
                        {
                            "name": "GDY_STATUS_DEAL",
                            "id": 1
                        },
                        {
                            "name": "GDY_STATUS_OUTCARD",
                            "id": 2
                        },
                        {
                            "name": "GDY_STATUS_OP",
                            "id": 3
                        },
                        {
                            "name": "GDY_STATUS_HUPAI",
                            "id": 4
                        },
                        {
                            "name": "GDY_STATUS_ENDCARD",
                            "id": 5
                        },
                        {
                            "name": "GDY_STATUS_SCORE",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "eGDY_MSG_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "GDY_MSG_SC_STARTPLAY",
                            "id": 2002
                        },
                        {
                            "name": "GDY_MSG_SC_SCORE",
                            "id": 2010
                        },
                        {
                            "name": "GDY_MSG_SC_DRAWCARD",
                            "id": 2100
                        },
                        {
                            "name": "GDY_MSG_SC_ENDCARD",
                            "id": 2105
                        },
                        {
                            "name": "GDY_MSG_CS_OUTCARD_REQ",
                            "id": 2110
                        },
                        {
                            "name": "GDY_MSG_SC_OUTCARD_ACK",
                            "id": 2111
                        },
                        {
                            "name": "GDY_MSG_SC_OP",
                            "id": 2120
                        },
                        {
                            "name": "GDY_MSG_CS_OP_REQ",
                            "id": 2121
                        },
                        {
                            "name": "GDY_MSG_SC_OP_ACK",
                            "id": 2122
                        },
                        {
                            "name": "GDY_MSG_CS_CANCELCARD_REQ",
                            "id": 2131
                        },
                        {
                            "name": "GDY_MSG_SC_RECONNECT",
                            "id": 2200
                        }
                    ]
                },
                {
                    "name": "eGDY_OP_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "GDY_OP_TYPE_DIANXIAO",
                            "id": 1
                        },
                        {
                            "name": "GDY_OP_TYPE_HUITOUXIAO",
                            "id": 2
                        },
                        {
                            "name": "GDY_OP_TYPE_MENGXIAO",
                            "id": 3
                        },
                        {
                            "name": "GDY_OP_TYPE_FANGXIAO",
                            "id": 9
                        },
                        {
                            "name": "GDY_OP_TYPE_PIAOLAIZI",
                            "id": 10
                        },
                        {
                            "name": "GDY_OP_TYPE_ZHUOCHONG",
                            "id": 20
                        },
                        {
                            "name": "GDY_OP_TYPE_QIANGXIAO",
                            "id": 21
                        },
                        {
                            "name": "GDY_OP_TYPE_XIAOHOUCHONG",
                            "id": 22
                        },
                        {
                            "name": "GDY_OP_TYPE_BEIQIANGXIAO",
                            "id": 23
                        },
                        {
                            "name": "GDY_OP_TYPE_FANGCHONG",
                            "id": 30
                        },
                        {
                            "name": "GDY_OP_TYPE_RECHONG",
                            "id": 31
                        },
                        {
                            "name": "GDY_OP_TYPE_HEIMO",
                            "id": 40
                        },
                        {
                            "name": "GDY_OP_TYPE_RUANMO",
                            "id": 41
                        },
                        {
                            "name": "GDY_OP_TYPE_HEIMOX2",
                            "id": 50
                        },
                        {
                            "name": "GDY_OP_TYPE_RUANMOX2",
                            "id": 51
                        },
                        {
                            "name": "GDY_OP_TYPE_FANGCHAOTIAN",
                            "id": 100
                        },
                        {
                            "name": "GDY_OP_TYPE_XIAOCHAOTIAN",
                            "id": 101
                        },
                        {
                            "name": "GDY_OP_TYPE_DACHAOTIAN",
                            "id": 102
                        }
                    ]
                }
            ],
            "isNamespace": true
        },
        {
            "name": "casino_xtsj",
            "fields": [],
            "syntax": "proto2",
            "options": {
                "optimize_for": "CODE_SIZE"
            },
            "messages": [
                {
                    "name": "player_dice",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "dices",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_sc_start_play",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fanpai",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "laizi",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "lord_id",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "player_dice",
                            "name": "dices",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "packet_sc_drawcard",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_sc_endcard",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "hupai",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "player_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_add",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_cur",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_total",
                            "id": 12
                        }
                    ]
                },
                {
                    "name": "packet_sc_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "player_score",
                            "name": "scores",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_cs_outcard_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_sc_outcard_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "packet_sc_op",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_cs_op_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cancel_type",
                            "id": 7,
                            "options": {
                                "default": -1
                            }
                        }
                    ]
                },
                {
                    "name": "packet_sc_op_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cancel_type",
                            "id": 7,
                            "options": {
                                "default": -1
                            }
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_cs_cancelcard_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "card",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "packet_sc_reconnect",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "status",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "time",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "pailaizi",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "op",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "xtsj_gang_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "xtsj_gang_group",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "xtsj_gang_score",
                            "name": "scores",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "xtsj_gang",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "gang_id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "xtsj_gang_group",
                            "name": "groups",
                            "id": 2
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "eXTSJ_STATUS",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "XTSJ_STATUS_STOP",
                            "id": 0
                        },
                        {
                            "name": "XTSJ_STATUS_DEAL",
                            "id": 1
                        },
                        {
                            "name": "XTSJ_STATUS_OUTCARD",
                            "id": 2
                        },
                        {
                            "name": "XTSJ_STATUS_OP",
                            "id": 3
                        },
                        {
                            "name": "XTSJ_STATUS_HUPAI",
                            "id": 4
                        },
                        {
                            "name": "XTSJ_STATUS_ENDCARD",
                            "id": 5
                        },
                        {
                            "name": "XTSJ_STATUS_SCORE",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "eXTSJ_MSG_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "XTSJ_MSG_SC_STARTPLAY",
                            "id": 13202
                        },
                        {
                            "name": "XTSJ_MSG_SC_SCORE",
                            "id": 13210
                        },
                        {
                            "name": "XTSJ_MSG_SC_DRAWCARD",
                            "id": 13211
                        },
                        {
                            "name": "XTSJ_MSG_SC_ENDCARD",
                            "id": 13215
                        },
                        {
                            "name": "XTSJ_MSG_CS_OUTCARD_REQ",
                            "id": 13220
                        },
                        {
                            "name": "XTSJ_MSG_SC_OUTCARD_ACK",
                            "id": 13221
                        },
                        {
                            "name": "XTSJ_MSG_SC_OP",
                            "id": 13230
                        },
                        {
                            "name": "XTSJ_MSG_CS_OP_REQ",
                            "id": 13231
                        },
                        {
                            "name": "XTSJ_MSG_SC_OP_ACK",
                            "id": 13232
                        },
                        {
                            "name": "XTSJ_MSG_CS_CANCELCARD_REQ",
                            "id": 13235
                        },
                        {
                            "name": "XTSJ_MSG_SC_RECONNECT",
                            "id": 13250
                        }
                    ]
                },
                {
                    "name": "eXTSJ_OP_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "XTSJ_OP_TYPE_DIANXIAO",
                            "id": 1
                        },
                        {
                            "name": "XTSJ_OP_TYPE_HUITOUXIAO",
                            "id": 2
                        },
                        {
                            "name": "XTSJ_OP_TYPE_MENGXIAO",
                            "id": 3
                        },
                        {
                            "name": "XTSJ_OP_TYPE_FANGXIAO",
                            "id": 9
                        },
                        {
                            "name": "XTSJ_OP_TYPE_PIAOLAIZI",
                            "id": 10
                        },
                        {
                            "name": "XTSJ_OP_TYPE_ZHUOCHONG",
                            "id": 20
                        },
                        {
                            "name": "XTSJ_OP_TYPE_QIANGXIAO",
                            "id": 21
                        },
                        {
                            "name": "XTSJ_OP_TYPE_XIAOHOUCHONG",
                            "id": 22
                        },
                        {
                            "name": "XTSJ_OP_TYPE_BEIQIANGXIAO",
                            "id": 23
                        },
                        {
                            "name": "XTSJ_OP_TYPE_FANGCHONG",
                            "id": 30
                        },
                        {
                            "name": "XTSJ_OP_TYPE_RECHONG",
                            "id": 31
                        },
                        {
                            "name": "XTSJ_OP_TYPE_HEIMO",
                            "id": 40
                        },
                        {
                            "name": "XTSJ_OP_TYPE_RUANMO",
                            "id": 41
                        },
                        {
                            "name": "XTSJ_OP_TYPE_HEIMOX2",
                            "id": 50
                        },
                        {
                            "name": "XTSJ_OP_TYPE_RUANMOX2",
                            "id": 51
                        },
                        {
                            "name": "XTSJ_OP_TYPE_FANGCHAOTIAN",
                            "id": 100
                        },
                        {
                            "name": "XTSJ_OP_TYPE_XIAOCHAOTIAN",
                            "id": 101
                        },
                        {
                            "name": "XTSJ_OP_TYPE_DACHAOTIAN",
                            "id": 102
                        }
                    ]
                }
            ],
            "isNamespace": true
        },
        {
            "name": "dbextend",
            "fields": [],
            "syntax": "proto2",
            "isNamespace": true
        },
        {
            "name": "casino",
            "fields": [],
            "syntax": "proto2",
            "options": {
                "optimize_for": "CODE_SIZE"
            },
            "messages": [
                {
                    "name": "chat",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "text",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "object",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "min",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "max",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "resource",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quality",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "reward_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "daily_limit",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "icon",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 60
                        }
                    ]
                },
                {
                    "name": "resource_need",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "count",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "pay_url",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "url",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "red_store",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "price",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "limit",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 52
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "gains",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 101
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "buy_time",
                            "id": 200,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "red_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "red_store",
                            "name": "stores",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "red_min",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "red_max",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "red_cash",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "red_num",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "red_disable",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "pay",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "currency",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "vip_exp",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "mail_id",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "code_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "code_name",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "code_info",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "dicount",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "original_price",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "vip",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "money_base",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "money_first",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "money_gift",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "price",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "price_info",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "point",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "tag",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "limit_count",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "limit_start_time",
                            "id": 52,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "limit_end_time",
                            "id": 53,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "func",
                            "id": 54
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "addition",
                            "id": 55
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "next_id",
                            "id": 56
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 57
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "url_id",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res_path",
                            "id": 100
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "channels",
                            "id": 200
                        }
                    ]
                },
                {
                    "name": "pay_channel",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "tag",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "system",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "pay_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "pay",
                            "name": "pays",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "url",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "pay_channel",
                            "name": "channels",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "pay_url",
                            "name": "urls",
                            "id": 11
                        }
                    ]
                },
                {
                    "name": "room",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cur",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "ply_min",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "ply_max",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "base",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "gold",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cost_type",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cost_param",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gold_max",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "server_id",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "op_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "zs",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "count",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "score",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "card_group",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 8
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "player_mj",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_mjtl",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_sshh",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_gdy",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_tmhh",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_tmyh",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_hhyx",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_hcyx",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_qjhh",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_tcmj",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "hupai_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pailaizi_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pailaizi_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "fangchong_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "fangchong_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_total",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "beizan_today",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "beizan_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_today",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout_time",
                            "id": 69,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_today",
                            "id": 71
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 79,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "coordinate",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "latitude",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "longitude",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "address",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ip",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ipaddress",
                            "id": 21
                        }
                    ]
                },
                {
                    "name": "ting_card",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "outcard",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "hucards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "table_player",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "bot",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "ready",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "time",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "multiple",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "status",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "bet",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "gold",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "managed",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "ting",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "param",
                            "id": 17
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "ting_type",
                            "id": 18
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "ai",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disband",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lord_cont",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lord_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "win_total",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lost_total",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 33
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 34
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 35
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "hupai_total",
                            "id": 36
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "zimo_total",
                            "id": 37
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "laizi_total",
                            "id": 39
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_time",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_level",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "entry_time",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "last_card",
                            "id": 55
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "cancel_zhuochong",
                            "id": 56
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "jialaizi",
                            "id": 57
                        },
                        {
                            "rule": "repeated",
                            "type": "op_score",
                            "name": "opscores",
                            "id": 60
                        },
                        {
                            "rule": "repeated",
                            "type": "ting_card",
                            "name": "tingcards",
                            "id": 70
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "huacards",
                            "id": 98
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "drawcards",
                            "id": 99
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "curcards",
                            "id": 100
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "selcards",
                            "id": 101
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "outcards",
                            "id": 102
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cancelcards",
                            "id": 103
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "pengcards",
                            "id": 104
                        },
                        {
                            "rule": "repeated",
                            "type": "card_group",
                            "name": "groups",
                            "id": 105
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "offline_time",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_total",
                            "id": 300
                        },
                        {
                            "rule": "optional",
                            "type": "player_mj",
                            "name": "data_mj",
                            "id": 350
                        },
                        {
                            "rule": "optional",
                            "type": "player_gdy",
                            "name": "data_gdy",
                            "id": 400
                        },
                        {
                            "rule": "optional",
                            "type": "player_tmhh",
                            "name": "data_tmhh",
                            "id": 401
                        },
                        {
                            "rule": "optional",
                            "type": "player_qjhh",
                            "name": "data_qjhh",
                            "id": 402
                        },
                        {
                            "rule": "optional",
                            "type": "player_hhyx",
                            "name": "data_hhyx",
                            "id": 403
                        },
                        {
                            "rule": "optional",
                            "type": "player_hcyx",
                            "name": "data_hcyx",
                            "id": 404
                        },
                        {
                            "rule": "optional",
                            "type": "player_sshh",
                            "name": "data_sshh",
                            "id": 405
                        },
                        {
                            "rule": "optional",
                            "type": "player_mjtl",
                            "name": "data_mjtl",
                            "id": 406
                        },
                        {
                            "rule": "optional",
                            "type": "player_tcmj",
                            "name": "data_tcmj",
                            "id": 407
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 500
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 501
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 510
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "server_id",
                            "id": 1000
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 1001
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "im_accid",
                            "id": 2000
                        },
                        {
                            "rule": "optional",
                            "type": "coordinate",
                            "name": "coord",
                            "id": 2001
                        }
                    ]
                },
                {
                    "name": "table_param",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "table_op",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "status",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "time",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "card",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 11
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "huacards",
                            "id": 12
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "replacecards",
                            "id": 13
                        },
                        {
                            "rule": "repeated",
                            "type": "table_param",
                            "name": "params",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "table_round_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_total",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_init",
                            "id": 12
                        },
                        {
                            "rule": "repeated",
                            "type": "card_group",
                            "name": "groups",
                            "id": 15
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "inithuacards",
                            "id": 18
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "initcards",
                            "id": 19
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "selcards",
                            "id": 21
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "curcards",
                            "id": 22
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "huacards",
                            "id": 23
                        },
                        {
                            "rule": "repeated",
                            "type": "op_score",
                            "name": "opscores",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "hupai_card",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "last_card",
                            "id": 101
                        }
                    ]
                },
                {
                    "name": "table_round",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "lord_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fanpai",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "laizi",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "nextcard",
                            "id": 9
                        },
                        {
                            "rule": "repeated",
                            "type": "table_op",
                            "name": "ops",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "table_round_score",
                            "name": "scores",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "remaincards",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "table_replay",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "table_round",
                            "name": "rounds",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "table_outcard",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "param",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "table",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "mode",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "join",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "pause",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "time",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "bet",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "status",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "master_id",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lord_id",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "op_id",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "target_id",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cur_idx",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fanpai",
                            "id": 26
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "outcard",
                            "id": 27
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "laizi",
                            "id": 28
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cardcount",
                            "id": 29
                        },
                        {
                            "rule": "repeated",
                            "type": "table_player",
                            "name": "players",
                            "id": 30
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "remaincards",
                            "id": 31
                        },
                        {
                            "rule": "repeated",
                            "type": "table_outcard",
                            "name": "outcards",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "tag",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "disband_time",
                            "id": 201
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 202
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_time",
                            "id": 203
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_time",
                            "id": 204
                        },
                        {
                            "rule": "optional",
                            "type": "table_replay",
                            "name": "replay",
                            "id": 1000
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disband_id",
                            "id": 1001
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disband_type",
                            "id": 1002
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 2000
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_id",
                            "id": 2001
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_id",
                            "id": 3000
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_cost_type",
                            "id": 3001
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_cost_param",
                            "id": 3002
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_level",
                            "id": 3003
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "match_name",
                            "id": 3004
                        }
                    ]
                },
                {
                    "name": "casino",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "ver",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "url",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "server_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "price",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "icon",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "task",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "group",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "casinos",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "prev_id",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "condition_type",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "condition_id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "condition_param",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "condition_level",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "condition_data",
                            "id": 14
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "awards",
                            "id": 101
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res_path",
                            "id": 150
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "icon_path",
                            "id": 160
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 200
                        }
                    ]
                },
                {
                    "name": "act",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "act_checkin_day",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "idx",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "awards",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "vip_awards",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "act_checkin_counter",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "idx",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "awards",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "vip_awards",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "act_card_free",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_date",
                            "id": 10,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_date",
                            "id": 11,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "start_time",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "end_time",
                            "id": 21
                        }
                    ]
                },
                {
                    "name": "red_rain",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rate",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "min",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "max",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "act_red_rain",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_date",
                            "id": 10,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_date",
                            "id": 11,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "start_time",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "end_time",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "amount",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 31
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "week_loop",
                            "id": 32
                        },
                        {
                            "rule": "repeated",
                            "type": "red_rain",
                            "name": "rains",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "bind_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "exchange_enable",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "devote_enable",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_start",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "devote_plus",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "init_award_play",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "init_award_point",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "bind_award_point",
                            "id": 33
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "devote_vip_level",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_type",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_num",
                            "id": 52
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_gain",
                            "id": 53
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_cost",
                            "id": 54
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_min",
                            "id": 55
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_max",
                            "id": 56
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_limit",
                            "id": 57
                        }
                    ]
                },
                {
                    "name": "guild_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_member_max",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_join_max",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_request_max",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_name_max",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_create_card",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_viplevel",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_friend_cost",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_close_cost",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_name_cost",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_table_real",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_close_enable",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_kick_enable",
                            "id": 42
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_quit_enable",
                            "id": 43
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_room_enable",
                            "id": 44
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_room_log_enable",
                            "id": 45
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_name_enable",
                            "id": 46
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_friend_enable",
                            "id": 47
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_power_enable",
                            "id": 48
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "guild_log_enable",
                            "id": 49
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_max",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_card_min",
                            "id": 52
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_card_max",
                            "id": 53
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_table_min",
                            "id": 55
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_table_max",
                            "id": 56
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_log_time",
                            "id": 58
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_create_day",
                            "id": 59
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_create_table_time",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_request_time",
                            "id": 61
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_log_page",
                            "id": 70,
                            "options": {
                                "default": 50
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_log_time",
                            "id": 71,
                            "options": {
                                "default": 1
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_log_day",
                            "id": 72,
                            "options": {
                                "default": 2
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_close",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "guild_member",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "online",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "login_time",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "join_time",
                            "id": 101
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "power",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_create_total",
                            "id": 210
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_create_today",
                            "id": 211
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_create_week",
                            "id": 212
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_create_month",
                            "id": 213
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_create_time",
                            "id": 215,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_play_total",
                            "id": 220
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_play_today",
                            "id": 221
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_play_week",
                            "id": 222
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_play_month",
                            "id": 223
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_play_time",
                            "id": 225,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "guild_request",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "online",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 17
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "leave_guild",
                            "id": 18
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "request_time",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "guild_permission_config",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "guild_room",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "master_id",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "amount",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_curr",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_gain",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "card_gain_time",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_cost",
                            "id": 33
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "card_cost_time",
                            "id": 34,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "guild_table_player",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "ready",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 500
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 501
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 510
                        }
                    ]
                },
                {
                    "name": "guild_table_log",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "master_id",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_tag",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "replay_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round_max",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round_cur",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_max",
                            "id": 26
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_table_player",
                            "name": "players",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "remove_time",
                            "id": 101,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "guild_table",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "master_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_room_id",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "tag",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 11
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_table_player",
                            "name": "players",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "guild",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "master_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "online",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_create_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_create_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_create_week",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_create_month",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "room_create_time",
                            "id": 15,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_remove_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_remove_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_remove_week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_remove_month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "room_remove_time",
                            "id": 25,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_log_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_log_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_log_week",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_log_month",
                            "id": 33
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "room_log_time",
                            "id": 35,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "rank_flag",
                            "id": 40
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_member",
                            "name": "members",
                            "id": 50
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_request",
                            "name": "requests",
                            "id": 51
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_room",
                            "name": "rooms",
                            "id": 52
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_table",
                            "name": "tables",
                            "id": 100
                        },
                        {
                            "rule": "repeated",
                            "type": "guild_table_log",
                            "name": "logs",
                            "id": 101
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 200,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "match_table_player",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "ready",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rank",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "level",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 500
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 501
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 510
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "item_id",
                            "id": 1000
                        }
                    ]
                },
                {
                    "name": "match_table_log",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "master_id",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_tag",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "replay_id",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round_max",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round_cur",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "level",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 24
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_max",
                            "id": 26
                        },
                        {
                            "rule": "repeated",
                            "type": "match_table_player",
                            "name": "players",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "remove_time",
                            "id": 101,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "match_status",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "signup",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "match_open_time",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "st",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "et",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "match_room",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "level",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "promotion",
                            "id": 17
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "mode",
                            "id": 18
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cost_type",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cost_param",
                            "id": 31
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "week_loop",
                            "id": 32
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "items",
                            "id": 40
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "integral",
                            "id": 41
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "award",
                            "id": 46
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rank_count",
                            "id": 47
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "same_max",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "day_max",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "task_id",
                            "id": 52
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_time",
                            "id": 101,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "repeated",
                            "type": "match_open_time",
                            "name": "open_time",
                            "id": 102
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "view_time",
                            "id": 103,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "match_item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "match_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "match_enable",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_log_time",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "match_channel",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_share",
                            "id": 4,
                            "options": {
                                "default": 1
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_bot_time",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "modes",
                            "id": 100
                        },
                        {
                            "rule": "repeated",
                            "type": "match_item",
                            "name": "items",
                            "id": 1000
                        },
                        {
                            "rule": "repeated",
                            "type": "match_room",
                            "name": "rooms",
                            "id": 1001
                        },
                        {
                            "rule": "repeated",
                            "type": "match_status",
                            "name": "status",
                            "id": 1002
                        },
                        {
                            "rule": "repeated",
                            "type": "rank_score_item",
                            "name": "ranks",
                            "id": 1005
                        }
                    ]
                },
                {
                    "name": "card_test",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "tag",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "playerlord",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "base",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "amount",
                            "id": 7
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "broadcast_config",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "content",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_duration",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_interval",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "start_time",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "end_time",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "create_time",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "update_time",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "weight",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "bind_third_robot",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "type",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "robot_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "open_group_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "union_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "group_title",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "xl_group_id",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nonce",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "create_time",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "update_time",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "push",
                            "id": 12
                        }
                    ]
                },
                {
                    "name": "vip_config",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "level",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exp",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "energy_turnable",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "winner_gain",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "loser_gain",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "draw",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_time",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_time",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 9
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "week_loop",
                            "id": 50
                        },
                        {
                            "rule": "repeated",
                            "type": "energy_turnable_item",
                            "name": "item",
                            "id": 80
                        }
                    ]
                },
                {
                    "name": "energy_turnable_item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "et_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rate",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res_path",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "rank_score_item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "award_type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "start_award",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "end_award",
                            "id": 11
                        },
                        {
                            "rule": "repeated",
                            "type": "rank_award_item",
                            "name": "items",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "rank_award_item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "goods",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "goods_count",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "convert_day",
                            "id": 17
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "goods_res",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "rank_res",
                            "id": 25
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "player_pay",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pay_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "timeout",
                            "id": 4,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "tag",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "order_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "order_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "order_week",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "order_month",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "order_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pay_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pay_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pay_week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pay_month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "pay_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "cash_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "cash_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "cash_week",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "cash_month",
                            "id": 33
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_min",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "face",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "bot",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "online",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "leave_guild",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "login_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "player_mj",
                            "name": "data_mj",
                            "id": 150
                        },
                        {
                            "rule": "optional",
                            "type": "player_gdy",
                            "name": "data_gdy",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "player_tmhh",
                            "name": "data_tmhh",
                            "id": 201
                        },
                        {
                            "rule": "optional",
                            "type": "player_qjhh",
                            "name": "data_qjhh",
                            "id": 202
                        },
                        {
                            "rule": "optional",
                            "type": "player_tmyh",
                            "name": "data_tmyh",
                            "id": 205
                        },
                        {
                            "rule": "optional",
                            "type": "player_hhyx",
                            "name": "data_hhyx",
                            "id": 206
                        },
                        {
                            "rule": "optional",
                            "type": "player_hcyx",
                            "name": "data_hcyx",
                            "id": 208
                        },
                        {
                            "rule": "optional",
                            "type": "player_sshh",
                            "name": "data_sshh",
                            "id": 209
                        },
                        {
                            "rule": "optional",
                            "type": "player_mjtl",
                            "name": "data_mjtl",
                            "id": 210
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 500
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 501
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 510
                        },
                        {
                            "rule": "optional",
                            "type": "coordinate",
                            "name": "coord",
                            "id": 2001
                        }
                    ]
                },
                {
                    "name": "player_rank",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rank",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "param",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 500
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 501
                        }
                    ]
                },
                {
                    "name": "player",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "device_token",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "invite_code",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 7
                        },
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "user_id",
                            "id": 8
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "server_id",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "level",
                            "id": 10,
                            "options": {
                                "default": 0
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exp",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "vip_level",
                            "id": 15,
                            "options": {
                                "default": 0
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "vip_exp",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "vip",
                            "id": 17
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "bot",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 35
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_time",
                            "id": 36
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "leave_guild",
                            "id": 37
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total_day",
                            "id": 190
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cont_day",
                            "id": 191
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total_time",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today_time",
                            "id": 201
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 210,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "create_ip",
                            "id": 211
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "create_mac",
                            "id": 212
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "create_idfv",
                            "id": 213
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "create_idfa",
                            "id": 214
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "create_openudid",
                            "id": 215
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "connect_time",
                            "id": 220,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "connect_ip",
                            "id": 221
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "connect_mac",
                            "id": 222
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "connect_idfv",
                            "id": 223
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "connect_idfa",
                            "id": 224
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "connect_openudid",
                            "id": 225
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "disconnect_time",
                            "id": 229,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "connect_total",
                            "id": 230
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "connect_today",
                            "id": 231
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "connect_week",
                            "id": 232
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "connect_month",
                            "id": 233
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "ban_time",
                            "id": 500,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "item_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "amount",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gain_total",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gain_today",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "gain_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "use_total",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "use_today",
                            "id": 42
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "use_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "buy_total",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "buy_today",
                            "id": 52
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "buy_time",
                            "id": 59,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "mail",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "notify",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "title",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "sender",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "content",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 25
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "gains",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "update_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_time",
                            "id": 109,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_time",
                            "id": 110,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_mail",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "mail_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "mail",
                            "name": "data",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "params",
                            "id": 70
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "view_time",
                            "id": 105,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "remove_time",
                            "id": 110,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_resource",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "curr",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "peak",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "peak_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "gain",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "gain_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "cost",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "cost_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_casino",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 19,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "win_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "win_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "win_gold_total",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "win_gold_today",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "win_rank",
                            "id": 28,
                            "options": {
                                "(dbextend.ignore)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "win_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lost_total",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lost_today",
                            "id": 31
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "lost_gold_total",
                            "id": 32
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "lost_gold_today",
                            "id": 33
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lost_rank",
                            "id": 38,
                            "options": {
                                "(dbextend.ignore)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "lost_time",
                            "id": 39,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "draw_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "draw_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "draw_time",
                            "id": 42,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_friend",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "friend_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "status",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "alias",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "player_min",
                            "name": "data",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gift_card",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_message",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "friend_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "data",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_task",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "group",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "task_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "condition_type",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "update_time",
                            "id": 30,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "complete_time",
                            "id": 31,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_act",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "act_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "mask",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "act_time",
                            "id": 30,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "complete_time",
                            "id": 40,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_lucky",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "lucky_time",
                            "id": 50,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_helper",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "trigger_time",
                            "id": 40,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "helper_time",
                            "id": 50,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_lottery",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "group_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "lottery_time",
                            "id": 50,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_guild",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "join_time",
                            "id": 101,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_red",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cash_total",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cash_today",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "num_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "num_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "cash_time",
                            "id": 105,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_bind",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "bind_time",
                            "id": 5,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "bind_id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "play_month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "play_time",
                            "id": 29,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "devote",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "devote_time",
                            "id": 32,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_today",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_week",
                            "id": 42
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "exchange_month",
                            "id": 43
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_total",
                            "id": 45
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_today",
                            "id": 46
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_week",
                            "id": 47
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "card_month",
                            "id": 48
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "exchange_time",
                            "id": 49,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_match",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "win",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lost",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "today",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "match_time",
                            "id": 30,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_match_apply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "plyer_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_level",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "apply_time",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "player_energy",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "curr_energy",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "use_energy",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gain_energy",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "total",
                            "id": 40
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "day",
                            "id": 41
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "week",
                            "id": 42
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "month",
                            "id": 43
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "draw_time",
                            "id": 101,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "energy_time",
                            "id": 102,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "player_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "player",
                            "name": "data",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "player_pay",
                            "name": "pays",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "player_resource",
                            "name": "resources",
                            "id": 101
                        },
                        {
                            "rule": "repeated",
                            "type": "player_casino",
                            "name": "casinos",
                            "id": 102
                        },
                        {
                            "rule": "repeated",
                            "type": "player_task",
                            "name": "tasks",
                            "id": 103
                        },
                        {
                            "rule": "repeated",
                            "type": "player_act",
                            "name": "acts",
                            "id": 105
                        },
                        {
                            "rule": "repeated",
                            "type": "player_item",
                            "name": "items",
                            "id": 110
                        },
                        {
                            "rule": "repeated",
                            "type": "player_friend",
                            "name": "friends",
                            "id": 111
                        },
                        {
                            "rule": "repeated",
                            "type": "player_message",
                            "name": "messages",
                            "id": 112
                        },
                        {
                            "rule": "repeated",
                            "type": "player_mail",
                            "name": "mails",
                            "id": 117
                        },
                        {
                            "rule": "repeated",
                            "type": "player_match",
                            "name": "matchs",
                            "id": 118
                        },
                        {
                            "rule": "optional",
                            "type": "player_lucky",
                            "name": "lucky",
                            "id": 120
                        },
                        {
                            "rule": "optional",
                            "type": "player_helper",
                            "name": "helper",
                            "id": 121
                        },
                        {
                            "rule": "optional",
                            "type": "player_lottery",
                            "name": "lottery",
                            "id": 122
                        },
                        {
                            "rule": "optional",
                            "type": "player_red",
                            "name": "red",
                            "id": 125
                        },
                        {
                            "rule": "optional",
                            "type": "player_bind",
                            "name": "bind",
                            "id": 126
                        },
                        {
                            "rule": "optional",
                            "type": "player_energy",
                            "name": "energy",
                            "id": 127
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 201
                        },
                        {
                            "rule": "optional",
                            "type": "player_match_apply",
                            "name": "match_apply",
                            "id": 202
                        },
                        {
                            "rule": "optional",
                            "type": "player_mj",
                            "name": "data_mj",
                            "id": 250
                        },
                        {
                            "rule": "optional",
                            "type": "player_gdy",
                            "name": "data_gdy",
                            "id": 300
                        },
                        {
                            "rule": "optional",
                            "type": "player_tmhh",
                            "name": "data_tmhh",
                            "id": 301
                        },
                        {
                            "rule": "optional",
                            "type": "player_qjhh",
                            "name": "data_qjhh",
                            "id": 302
                        },
                        {
                            "rule": "optional",
                            "type": "player_tmyh",
                            "name": "data_tmyh",
                            "id": 305
                        },
                        {
                            "rule": "optional",
                            "type": "player_hhyx",
                            "name": "data_hhyx",
                            "id": 306
                        },
                        {
                            "rule": "optional",
                            "type": "player_hcyx",
                            "name": "data_hcyx",
                            "id": 308
                        },
                        {
                            "rule": "optional",
                            "type": "player_sshh",
                            "name": "data_sshh",
                            "id": 309
                        },
                        {
                            "rule": "optional",
                            "type": "player_mjtl",
                            "name": "data_mjtl",
                            "id": 310
                        },
                        {
                            "rule": "optional",
                            "type": "player_tcmj",
                            "name": "data_tcmj",
                            "id": 311
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_head",
                            "id": 500
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "channel_nickname",
                            "id": 501
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 1001
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_request_id",
                            "id": 1002
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "guild_ids",
                            "id": 1011
                        },
                        {
                            "rule": "repeated",
                            "type": "uint32",
                            "name": "guild_request_ids",
                            "id": 1012
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "leave_guild",
                            "id": 1013
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "im_accid",
                            "id": 2000
                        },
                        {
                            "rule": "optional",
                            "type": "coordinate",
                            "name": "coord",
                            "id": 2001
                        }
                    ]
                },
                {
                    "name": "bot",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "level",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "gold_curr",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "gold_min",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "gold_peak",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "gold_gain",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "gold_cost",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "table_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "ProxyMessage",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "Ops",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "Data",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "packet_coordinate",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "latitude",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "double",
                            "name": "longitude",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "address",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ip",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ipaddress",
                            "id": 21
                        }
                    ]
                },
                {
                    "name": "packet_update",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "merge",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "owner_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "msg",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "data",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_ping",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "now",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "packet_pong",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "now",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "device_info",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "package",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "platform",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "language",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "version",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "build",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "idfa",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "idfv",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "udid",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "openudid",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "mac",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "device",
                            "id": 15
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "device_version",
                            "id": 16
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "system",
                            "id": 17
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "system_version",
                            "id": 18
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "jailbreak",
                            "id": 19
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "sim",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "imei",
                            "id": 22
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "imsi",
                            "id": 23
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "device_token",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ip",
                            "id": 40
                        }
                    ]
                },
                {
                    "name": "round_cost",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "round",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "card",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "game_round_cost",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "round_cost",
                            "name": "rcosts",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "game_room_base",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "float",
                            "name": "roombases",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "game_config",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "user_min",
                            "id": 2,
                            "options": {
                                "default": 4
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "user_max",
                            "id": 3,
                            "options": {
                                "default": 64
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pass_min",
                            "id": 4,
                            "options": {
                                "default": 4
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pass_max",
                            "id": 5,
                            "options": {
                                "default": 16
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "nickname_min",
                            "id": 6,
                            "options": {
                                "default": 2
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "nickname_max",
                            "id": 7,
                            "options": {
                                "default": 12
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "chat_max",
                            "id": 8,
                            "options": {
                                "default": 128
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "viplevel_giftcard",
                            "id": 10,
                            "options": {
                                "default": 5
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_disband_time",
                            "id": 11,
                            "options": {
                                "default": 30
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_viplevel",
                            "id": 12,
                            "options": {
                                "default": 5
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_friend_cost",
                            "id": 13,
                            "options": {
                                "default": 5
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_close_cost",
                            "id": 14,
                            "options": {
                                "default": 5
                            }
                        },
                        {
                            "rule": "repeated",
                            "type": "game_round_cost",
                            "name": "roundcosts",
                            "id": 100
                        },
                        {
                            "rule": "repeated",
                            "type": "game_room_base",
                            "name": "groombases",
                            "id": 101
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gdy_endcard",
                            "id": 1000,
                            "options": {
                                "default": 4
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gdy_gangcard",
                            "id": 1001,
                            "options": {
                                "default": 5
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable_event",
                            "id": 10000,
                            "options": {
                                "default": false
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "lang_gb",
                            "id": 10001,
                            "options": {
                                "default": true
                            }
                        }
                    ]
                },
                {
                    "name": "bulletin",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "counter",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "start_time",
                            "id": 10,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "end_time",
                            "id": 11,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "bulletin_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "bulletin",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "lucky",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rate",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rank",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res_path",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "desc",
                            "id": 101
                        }
                    ]
                },
                {
                    "name": "lucky_log",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lucky_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "lucky_name",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "lucky_state",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "send_time",
                            "id": 11,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "lucky_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "day",
                            "id": 2,
                            "options": {
                                "default": 1
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "share",
                            "id": 3,
                            "options": {
                                "default": 1
                            }
                        },
                        {
                            "rule": "repeated",
                            "type": "lucky",
                            "name": "datas",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "lucky_log",
                            "name": "selflogs",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "lucky_log",
                            "name": "lastlogs",
                            "id": 11
                        }
                    ]
                },
                {
                    "name": "helper",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "wait",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gold",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "helper_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gold_min",
                            "id": 1,
                            "options": {
                                "default": 499
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disable",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "helper",
                            "name": "helpers",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "lottery_item",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "res",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "lottery",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "item_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "rate",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "lottery_group",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "casinos",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "type": "lottery",
                            "name": "lotterys",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "lottery_log",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "group_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lottery_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "lottery_name",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "lottery_state",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "send_time",
                            "id": 11,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 100,
                            "options": {
                                "(dbextend.datetime)": true
                            }
                        }
                    ]
                },
                {
                    "name": "lottery_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "lottery_item",
                            "name": "items",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "lottery_group",
                            "name": "groups",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "lottery_group",
                            "name": "reds",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "type": "lottery_group",
                            "name": "matchs",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "lottery_log",
                            "name": "selflogs",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_fast_login_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "pay",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "channel",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "reconnect",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "user_id",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "ticket",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "device_info",
                            "name": "devinfo",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gdatacrc",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "pdatacrc",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "request_id",
                            "id": 200
                        }
                    ]
                },
                {
                    "name": "packet_fast_login_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "channel",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "reconnect",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "user_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "server_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "unionid",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "bind_robot",
                            "id": 11,
                            "options": {
                                "default": false
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "gdata",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "game_config",
                            "name": "config",
                            "id": 21
                        },
                        {
                            "rule": "optional",
                            "type": "player_data",
                            "name": "pdata",
                            "id": 30
                        },
                        {
                            "rule": "optional",
                            "type": "pay_data",
                            "name": "paydata",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "red_data",
                            "name": "reddata",
                            "id": 51
                        },
                        {
                            "rule": "optional",
                            "type": "bind_data",
                            "name": "binddata",
                            "id": 52
                        },
                        {
                            "rule": "optional",
                            "type": "guild_data",
                            "name": "guilddata",
                            "id": 53
                        },
                        {
                            "rule": "optional",
                            "type": "match_data",
                            "name": "matchdata",
                            "id": 54
                        },
                        {
                            "rule": "repeated",
                            "type": "room",
                            "name": "rooms",
                            "id": 60
                        },
                        {
                            "rule": "optional",
                            "type": "bulletin_data",
                            "name": "bulletindata",
                            "id": 110
                        },
                        {
                            "rule": "optional",
                            "type": "lucky_data",
                            "name": "luckydata",
                            "id": 111
                        },
                        {
                            "rule": "optional",
                            "type": "helper_data",
                            "name": "helperdata",
                            "id": 112
                        },
                        {
                            "rule": "optional",
                            "type": "lottery_data",
                            "name": "lotterydata",
                            "id": 113
                        },
                        {
                            "rule": "repeated",
                            "type": "vip_config",
                            "name": "vipdata",
                            "id": 114
                        },
                        {
                            "rule": "repeated",
                            "type": "energy_turnable",
                            "name": "et_data",
                            "id": 115
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "request_id",
                            "id": 200
                        }
                    ]
                },
                {
                    "name": "packet_table_create_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "base",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "devote",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "join",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "flag",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "packet_table_create_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "table",
                            "name": "tdata",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "guild_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "packet_table_join_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "ready",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "match_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "tag",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "type",
                            "id": 11
                        }
                    ]
                },
                {
                    "name": "packet_table_join_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "table",
                            "name": "tdata",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "reconnect",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "packet_player_join_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "request_id",
                            "id": 200
                        }
                    ]
                },
                {
                    "name": "packet_player_join_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "now",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "request_id",
                            "id": 200
                        }
                    ]
                },
                {
                    "name": "packet_table_entry",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "idx",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "table_player",
                            "name": "pdata",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "packet_table_leave",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "idx",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "manage",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "packet_table_ready",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "idx",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "packet_table_pause",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "reason",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_table_managed",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "idx",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "managed",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "quit_time",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_table_update",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "table",
                            "name": "tdata",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "player_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "player_min",
                            "name": "data",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score_total",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "level",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "money",
                            "id": 15
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "cards",
                            "id": 20
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "selcards",
                            "id": 21
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "curcards",
                            "id": 22
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "huacards",
                            "id": 23
                        },
                        {
                            "rule": "repeated",
                            "type": "op_score",
                            "name": "opscores",
                            "id": 50
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "hupai_card",
                            "id": 100
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "last_card",
                            "id": 101
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "lost_card",
                            "id": 102
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "quit_total",
                            "id": 200
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "timeout_total",
                            "id": 201
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lottery_group",
                            "id": 300
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lottery_item",
                            "id": 301
                        }
                    ]
                },
                {
                    "name": "packet_table_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "time",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "win_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "cb_id",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "op",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "nextcard",
                            "id": 9
                        },
                        {
                            "rule": "repeated",
                            "type": "player_score",
                            "name": "scores",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "start_time",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "table",
                            "name": "tdata",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "replay_id",
                            "id": 39
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "info",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "packet_table_disband_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "disband_time",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_table_disband_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "disband",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "ret",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "casino_score",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "room_id",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "table_tag",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "round",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "score",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "money",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "replay_id",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_score_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "casino_score",
                            "name": "scores",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_score_time_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "day",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_score_time_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "casino_id",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "casino_score",
                            "name": "scores",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_replay_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "replay_id",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "packet_replay_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "replay_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "request_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "replay",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_card_req",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "casino_card",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "reason",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "op_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "amount",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "create_time",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_card_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "casino_card",
                            "name": "cards",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_modify_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 21
                        }
                    ]
                },
                {
                    "name": "packet_modify_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "sex",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "avatar",
                            "id": 21
                        }
                    ]
                },
                {
                    "name": "packet_bind_phone_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "code",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "packet_bind_phone_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "auth_time",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_user_logout",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "time",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "packet_et_draw_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "et_id",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "packet_et_draw_res",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "et_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "item_id",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_table_chat",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "chat_id",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "table_id",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "text",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_search_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "packet_search_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "player_min",
                            "name": "data",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "packet_mail_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "mail_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "del",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "gain",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "packet_mail_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "mail_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "gain",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "player_mail",
                            "name": "mails",
                            "id": 10
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "gains",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "packet_friend_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "friend_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "op",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "data",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "face",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "packet_friend_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "friend_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "op",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "data",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickname",
                            "id": 20
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "face",
                            "id": 30
                        }
                    ]
                },
                {
                    "name": "packet_helper_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "refresh",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "packet_helper_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "gains",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "packet_broadcast_config",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "broadcast_config",
                            "name": "broadcast",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "packet_broadcast_sync",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "packet_act_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "type",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "data",
                            "id": 14
                        }
                    ]
                },
                {
                    "name": "packet_act_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "player_id",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "type",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "param",
                            "id": 13
                        },
                        {
                            "rule": "repeated",
                            "type": "object",
                            "name": "awards",
                            "id": 20
                        }
                    ]
                },
                {
                    "name": "packet_red_cash_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "cash",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_red_cash_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "cash",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_red_store_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_red_store_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "ret",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "id",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "red_data",
                            "name": "reddata",
                            "id": 51
                        }
                    ]
                },
                {
                    "name": "data_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "name",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "crc",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "packet_data_req",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "data_req",
                            "name": "reqs",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "data_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "name",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "crc",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "parse",
                            "id": 5,
                            "options": {
                                "default": false
                            }
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "data",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "packet_data_ack",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "data_ack",
                            "name": "acks",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "task_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "task",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "casino_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "casino",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "act_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "act",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "act_checkin_day_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "act_checkin_day",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "act_checkin_counter_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "act_checkin_counter",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "act_card_free_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "act_card_free",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "act_red_rain_data",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "act_red_rain",
                            "name": "datas",
                            "id": 1
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "eTYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "TYPE_NONE",
                            "id": 0
                        },
                        {
                            "name": "TYPE_CASH",
                            "id": 1
                        },
                        {
                            "name": "TYPE_USER",
                            "id": 2
                        },
                        {
                            "name": "TYPE_PAY",
                            "id": 3
                        },
                        {
                            "name": "TYPE_RANK",
                            "id": 4
                        },
                        {
                            "name": "TYPE_GUIDE",
                            "id": 5
                        },
                        {
                            "name": "TYPE_COST",
                            "id": 6
                        },
                        {
                            "name": "TYPE_WXHB",
                            "id": 7
                        },
                        {
                            "name": "TYPE_PUBLIC",
                            "id": 8
                        },
                        {
                            "name": "TYPE_CHAT",
                            "id": 9
                        },
                        {
                            "name": "TYPE_RESOURCE",
                            "id": 10
                        },
                        {
                            "name": "TYPE_LOTTERY",
                            "id": 11
                        },
                        {
                            "name": "TYPE_STORE",
                            "id": 15
                        },
                        {
                            "name": "TYPE_MAIL",
                            "id": 29
                        },
                        {
                            "name": "TYPE_EVENT",
                            "id": 35
                        },
                        {
                            "name": "TYPE_ROOM",
                            "id": 40
                        },
                        {
                            "name": "TYPE_TABLE",
                            "id": 50
                        },
                        {
                            "name": "TYPE_TABLE_PLAYER",
                            "id": 51
                        },
                        {
                            "name": "TYPE_GOLD",
                            "id": 90
                        },
                        {
                            "name": "TYPE_MONEY",
                            "id": 91
                        },
                        {
                            "name": "TYPE_PLAYER",
                            "id": 100
                        },
                        {
                            "name": "TYPE_PLAYER_RESOURCE",
                            "id": 101
                        },
                        {
                            "name": "TYPE_PLAYER_TASK",
                            "id": 102
                        },
                        {
                            "name": "TYPE_PLAYER_ACT",
                            "id": 103
                        },
                        {
                            "name": "TYPE_PLAYER_PAY",
                            "id": 104
                        },
                        {
                            "name": "TYPE_PLAYER_FRIEND",
                            "id": 105
                        },
                        {
                            "name": "TYPE_PLAYER_MESSAGE",
                            "id": 106
                        },
                        {
                            "name": "TYPE_PLAYER_MAIL",
                            "id": 107
                        },
                        {
                            "name": "TYPE_PLAYER_RED",
                            "id": 108
                        },
                        {
                            "name": "TYPE_PLAYER_BIND",
                            "id": 109
                        },
                        {
                            "name": "TYPE_PLAYER_MATCH",
                            "id": 110
                        },
                        {
                            "name": "TYPE_PLAYER_LUCKY",
                            "id": 120
                        },
                        {
                            "name": "TYPE_PLAYER_HELPER",
                            "id": 121
                        },
                        {
                            "name": "TYPE_PLAYER_LOTTERY",
                            "id": 122
                        },
                        {
                            "name": "TYPE_PLAYER_ENERGY",
                            "id": 123
                        },
                        {
                            "name": "TYPE_PLAYER_AWARDS",
                            "id": 124
                        },
                        {
                            "name": "TYPE_PLAYER_MJ",
                            "id": 130
                        },
                        {
                            "name": "TYPE_PLAYER_GDY",
                            "id": 150
                        },
                        {
                            "name": "TYPE_PLAYER_TMHH",
                            "id": 151
                        },
                        {
                            "name": "TYPE_PLAYER_QJHH",
                            "id": 152
                        },
                        {
                            "name": "TYPE_PLAYER_TMYH",
                            "id": 155
                        },
                        {
                            "name": "TYPE_PLAYER_HHYX",
                            "id": 156
                        },
                        {
                            "name": "TYPE_PLAYER_HCYX",
                            "id": 158
                        },
                        {
                            "name": "TYPE_PLAYER_SSHH",
                            "id": 159
                        },
                        {
                            "name": "TYPE_PLAYER_MJTL",
                            "id": 160
                        },
                        {
                            "name": "TYPE_PLAYER_TCMJ",
                            "id": 162
                        },
                        {
                            "name": "TYPE_GUILD_PERMIT",
                            "id": 163
                        },
                        {
                            "name": "TYPE_LEVEL_PLAYER",
                            "id": 200
                        },
                        {
                            "name": "TYPE_LEVEL_VIP",
                            "id": 209
                        },
                        {
                            "name": "TYPE_RANK_RICH",
                            "id": 610
                        },
                        {
                            "name": "TYPE_RANK_WIN",
                            "id": 611
                        },
                        {
                            "name": "TYPE_VIP_EXP",
                            "id": 999
                        },
                        {
                            "name": "TYPE_ADMIN",
                            "id": 1000
                        }
                    ]
                },
                {
                    "name": "eRESOURCE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "RESOURCE_NONE",
                            "id": 0
                        },
                        {
                            "name": "RESOURCE_GOLD",
                            "id": 1
                        },
                        {
                            "name": "RESOURCE_MONEY",
                            "id": 2
                        },
                        {
                            "name": "RESOURCE_EXP",
                            "id": 3
                        },
                        {
                            "name": "RESOURCE_RETROACTIVE",
                            "id": 5
                        },
                        {
                            "name": "RESOURCE_DEVOTE",
                            "id": 6
                        },
                        {
                            "name": "RESOURCE_RED",
                            "id": 8
                        },
                        {
                            "name": "RESOURCE_BEANS",
                            "id": 9
                        },
                        {
                            "name": "RESOURCE_CARD",
                            "id": 10
                        },
                        {
                            "name": "RESOURCE_RANK_SCORE",
                            "id": 12
                        },
                        {
                            "name": "RESOURCE_TECKET",
                            "id": 13
                        }
                    ]
                },
                {
                    "name": "eMATCHMODE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "MATCHMODE_RED",
                            "id": 1
                        },
                        {
                            "name": "MATCHMODE_SCORE",
                            "id": 2
                        },
                        {
                            "name": "MATCHMODE_ENTITY",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "eGUILDPERMISSION",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "GUILDPERMISSION_OUTTIME",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "eDISBAND",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "DISBAND_NONE",
                            "id": 0
                        },
                        {
                            "name": "DISBAND_YES",
                            "id": 1
                        },
                        {
                            "name": "DISBAND_NO",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "eTABLE_OP",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "TABLE_OP_DRAWCARD",
                            "id": -1
                        },
                        {
                            "name": "TABLE_OP_OUTCARD",
                            "id": -2
                        },
                        {
                            "name": "TABLE_OP_END",
                            "id": -3
                        },
                        {
                            "name": "TABLE_OP_BET",
                            "id": -4
                        },
                        {
                            "name": "TABLE_OP_JIALAIZI",
                            "id": -5
                        },
                        {
                            "name": "TABLE_OP_PENG",
                            "id": 1
                        },
                        {
                            "name": "TABLE_OP_GANG",
                            "id": 2
                        },
                        {
                            "name": "TABLE_OP_HU",
                            "id": 3
                        },
                        {
                            "name": "TABLE_OP_ZIMO",
                            "id": 4
                        },
                        {
                            "name": "TABLE_OP_CHAOTIAN",
                            "id": 5
                        },
                        {
                            "name": "TABLE_OP_BUZHUOCHONG",
                            "id": 6
                        },
                        {
                            "name": "TABLE_OP_QIANGXIAO",
                            "id": 7
                        },
                        {
                            "name": "TABLE_OP_CHI",
                            "id": 8
                        },
                        {
                            "name": "TABLE_OP_HUANBAO",
                            "id": 9
                        },
                        {
                            "name": "TABLE_OP_DG",
                            "id": 10
                        },
                        {
                            "name": "TABLE_OP_CAIGANG",
                            "id": 11
                        },
                        {
                            "name": "TABLE_OP_TING",
                            "id": 12
                        },
                        {
                            "name": "TABLE_OP_CANCEL",
                            "id": 13
                        },
                        {
                            "name": "TABLE_OP_ZHAO",
                            "id": 14
                        },
                        {
                            "name": "TABLE_OP_HUA",
                            "id": 15
                        },
                        {
                            "name": "TABLE_OP_JIAN",
                            "id": 16
                        }
                    ]
                },
                {
                    "name": "eTASK_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "TASK_TYPE_NONE",
                            "id": 0
                        },
                        {
                            "name": "TASK_TYPE_CASINO",
                            "id": 1
                        },
                        {
                            "name": "TASK_TYPE_DAILY",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "eCONDITION",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CONDITION_NONE",
                            "id": 0
                        },
                        {
                            "name": "CONDITION_WIN",
                            "id": 1
                        },
                        {
                            "name": "CONDITION_PLAY",
                            "id": 2
                        },
                        {
                            "name": "CONDITION_PRIVATE",
                            "id": 3
                        },
                        {
                            "name": "CONDITION_AUTH",
                            "id": 4
                        },
                        {
                            "name": "CONDITION_PUBLIC",
                            "id": 5
                        },
                        {
                            "name": "CONDITION_ROUND",
                            "id": 7
                        },
                        {
                            "name": "CONDITION_CARD",
                            "id": 8
                        },
                        {
                            "name": "CONDITION_NORMAL",
                            "id": 9
                        },
                        {
                            "name": "CONDITION_SHARE",
                            "id": 10
                        },
                        {
                            "name": "CONDITION_BIND",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "eACT",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "ACT_CHECKIN_DAY",
                            "id": 1
                        },
                        {
                            "name": "ACT_CHECKIN_COUNTER",
                            "id": 2
                        },
                        {
                            "name": "ACT_CARD_FREE",
                            "id": 3
                        },
                        {
                            "name": "ACT_RED_RAIN",
                            "id": 4
                        },
                        {
                            "name": "ACT_SIGN",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "eEXCHANGE_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "EXCHANGE_UNLIMIT",
                            "id": 0
                        },
                        {
                            "name": "EXCHANGE_TODAY",
                            "id": 1
                        },
                        {
                            "name": "EXCHANGE_WEEK",
                            "id": 2
                        },
                        {
                            "name": "EXCHANGE_MONTH",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "eGUILD_MEMBER_POWER",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "GUILD_MEMBER_POWER_CARD",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "eFRIEND_STATUS",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "FRIEND_STATUS_REQUEST",
                            "id": 0
                        },
                        {
                            "name": "FRIEND_STATUS_SUCCEEDED",
                            "id": 1
                        },
                        {
                            "name": "FRIEND_STATUS_REMOVE",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "eMESSAGE_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "MESSAGE_TYPE_FRIEND",
                            "id": 1
                        },
                        {
                            "name": "MESSAGE_TYPE_CHAT",
                            "id": 2
                        },
                        {
                            "name": "MESSAGE_TYPE_GIFT_CARD",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "ProxyMessageCode",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "OPPing",
                            "id": 100
                        },
                        {
                            "name": "OPPong",
                            "id": 101
                        }
                    ]
                },
                {
                    "name": "eMSG_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "MSG_BULLETIN",
                            "id": 1
                        },
                        {
                            "name": "MSG_PING",
                            "id": 2
                        },
                        {
                            "name": "MSG_PONG",
                            "id": 3
                        },
                        {
                            "name": "MSG_DBUPDATE",
                            "id": 5
                        },
                        {
                            "name": "MSG_COORDINATE",
                            "id": 6
                        },
                        {
                            "name": "MSG_BROADCAST",
                            "id": 7
                        },
                        {
                            "name": "MSG_BROADCAST_SYNC",
                            "id": 8
                        },
                        {
                            "name": "MSG_DATA_REQ",
                            "id": 10
                        },
                        {
                            "name": "MSG_DATA_ACK",
                            "id": 11
                        },
                        {
                            "name": "MSG_USER_LOGIN_REQ",
                            "id": 101
                        },
                        {
                            "name": "MSG_USER_LOGIN_ACK",
                            "id": 102
                        },
                        {
                            "name": "MSG_FAST_LOGIN_REQ",
                            "id": 103
                        },
                        {
                            "name": "MSG_FAST_LOGIN_ACK",
                            "id": 104
                        },
                        {
                            "name": "MSG_USER_REG_REQ",
                            "id": 105
                        },
                        {
                            "name": "MSG_USER_REG_ACK",
                            "id": 106
                        },
                        {
                            "name": "MSG_USER_LOGOUT",
                            "id": 110
                        },
                        {
                            "name": "MSG_STRING_REQ",
                            "id": 115
                        },
                        {
                            "name": "MSG_STRING_ACK",
                            "id": 116
                        },
                        {
                            "name": "MSG_MODIFY_REQ",
                            "id": 117
                        },
                        {
                            "name": "MSG_MODIFY_ACK",
                            "id": 118
                        },
                        {
                            "name": "MSG_HELPER_REQ",
                            "id": 120
                        },
                        {
                            "name": "MSG_HELPER_ACK",
                            "id": 121
                        },
                        {
                            "name": "MSG_HELPER",
                            "id": 125
                        },
                        {
                            "name": "MSG_GUIDE_REQ",
                            "id": 130
                        },
                        {
                            "name": "MSG_GUIDE_ACK",
                            "id": 131
                        },
                        {
                            "name": "MSG_SEARCH_REQ",
                            "id": 135
                        },
                        {
                            "name": "MSG_SEARCH_ACK",
                            "id": 136
                        },
                        {
                            "name": "MSG_EVENT_REQ",
                            "id": 140
                        },
                        {
                            "name": "MSG_EVENT_ACK",
                            "id": 141
                        },
                        {
                            "name": "MSG_PAY_REQ",
                            "id": 145
                        },
                        {
                            "name": "MSG_PAY_ACK",
                            "id": 146
                        },
                        {
                            "name": "MSG_TABLE_JOIN_REQ",
                            "id": 150
                        },
                        {
                            "name": "MSG_TABLE_JOIN_ACK",
                            "id": 151
                        },
                        {
                            "name": "MSG_TABLE_CREATE_REQ",
                            "id": 152
                        },
                        {
                            "name": "MSG_TABLE_CREATE_ACK",
                            "id": 153
                        },
                        {
                            "name": "MSG_TABLE_ENTRY",
                            "id": 154
                        },
                        {
                            "name": "MSG_TABLE_LEAVE",
                            "id": 155
                        },
                        {
                            "name": "MSG_TABLE_READY",
                            "id": 156
                        },
                        {
                            "name": "MSG_TABLE_PAUSE",
                            "id": 157
                        },
                        {
                            "name": "MSG_TABLE_SCORE",
                            "id": 158
                        },
                        {
                            "name": "MSG_TABLE_UPDATE",
                            "id": 159
                        },
                        {
                            "name": "MSG_TABLE_MANAGED",
                            "id": 160
                        },
                        {
                            "name": "MSG_TABLE_TIMEOUT",
                            "id": 161
                        },
                        {
                            "name": "MSG_TABLE_CHAT",
                            "id": 162
                        },
                        {
                            "name": "MSG_TABLE_DISBAND",
                            "id": 165
                        },
                        {
                            "name": "MSG_TABLE_DISBAND_REQ",
                            "id": 166
                        },
                        {
                            "name": "MSG_TABLE_DISBAND_ACK",
                            "id": 167
                        },
                        {
                            "name": "MSG_TABLE_CONTINUE_REQ",
                            "id": 168
                        },
                        {
                            "name": "MSG_TABLE_CONTINUE_ACK",
                            "id": 169
                        },
                        {
                            "name": "MSG_CASINO_JOIN_REQ",
                            "id": 170
                        },
                        {
                            "name": "MSG_CASINO_JOIN_ACK",
                            "id": 171
                        },
                        {
                            "name": "MSG_TABLE_KILL",
                            "id": 178
                        },
                        {
                            "name": "MSG_MAIL_REQ",
                            "id": 180
                        },
                        {
                            "name": "MSG_MAIL_ACK",
                            "id": 181
                        },
                        {
                            "name": "MSG_AWARD_REQ",
                            "id": 190
                        },
                        {
                            "name": "MSG_AWARD_ACK",
                            "id": 191
                        },
                        {
                            "name": "MSG_LOTTERY_REQ",
                            "id": 200
                        },
                        {
                            "name": "MSG_LOTTERY_ACK",
                            "id": 201
                        },
                        {
                            "name": "MSG_LOTTERY_LOG_REQ",
                            "id": 202
                        },
                        {
                            "name": "MSG_LOTTERY_LOG_ACK",
                            "id": 203
                        },
                        {
                            "name": "MSG_LOTTERY",
                            "id": 205
                        },
                        {
                            "name": "MSG_PLAYER_JOIN_REQ",
                            "id": 210
                        },
                        {
                            "name": "MSG_PLAYER_JOIN_ACK",
                            "id": 211
                        },
                        {
                            "name": "MSG_PLAYER_ENTRY",
                            "id": 214
                        },
                        {
                            "name": "MSG_PLAYER_LEAVE",
                            "id": 215
                        },
                        {
                            "name": "MSG_PLAYER_RENAME_REQ",
                            "id": 220
                        },
                        {
                            "name": "MSG_PLAYER_RENAME_ACK",
                            "id": 221
                        },
                        {
                            "name": "MSG_PLAYER_LEVEL_UP",
                            "id": 250
                        },
                        {
                            "name": "MSG_LUCKY_REQ",
                            "id": 260
                        },
                        {
                            "name": "MSG_LUCKY_ACK",
                            "id": 261
                        },
                        {
                            "name": "MSG_LUCKY",
                            "id": 265
                        },
                        {
                            "name": "MSG_TASK_REQ",
                            "id": 270
                        },
                        {
                            "name": "MSG_TASK_ACK",
                            "id": 271
                        },
                        {
                            "name": "MSG_CHAT_REQ",
                            "id": 280
                        },
                        {
                            "name": "MSG_CHAT_ACK",
                            "id": 281
                        },
                        {
                            "name": "MSG_FRIEND_REQ",
                            "id": 290
                        },
                        {
                            "name": "MSG_FRIEND_ACK",
                            "id": 291
                        },
                        {
                            "name": "MSG_ACT_REQ",
                            "id": 300
                        },
                        {
                            "name": "MSG_ACT_ACK",
                            "id": 301
                        },
                        {
                            "name": "MSG_ACT",
                            "id": 305
                        },
                        {
                            "name": "MSG_SHARE_REQ",
                            "id": 310
                        },
                        {
                            "name": "MSG_SHARE_ACK",
                            "id": 311
                        },
                        {
                            "name": "MSG_AUTH_REQ",
                            "id": 320
                        },
                        {
                            "name": "MSG_AUTH_ACK",
                            "id": 321
                        },
                        {
                            "name": "MSG_USE_REQ",
                            "id": 330
                        },
                        {
                            "name": "MSG_USE_ACK",
                            "id": 331
                        },
                        {
                            "name": "MSG_SCORE_REQ",
                            "id": 340
                        },
                        {
                            "name": "MSG_SCORE_ACK",
                            "id": 341
                        },
                        {
                            "name": "MSG_SCORE_TIME_REQ",
                            "id": 342
                        },
                        {
                            "name": "MSG_SCORE_TIME_ACK",
                            "id": 343
                        },
                        {
                            "name": "MSG_CARD_REQ",
                            "id": 350
                        },
                        {
                            "name": "MSG_CARD_ACK",
                            "id": 351
                        },
                        {
                            "name": "MSG_CARD_OP",
                            "id": 355
                        },
                        {
                            "name": "MSG_GIFT_REQ",
                            "id": 360
                        },
                        {
                            "name": "MSG_GIFT_ACK",
                            "id": 361
                        },
                        {
                            "name": "MSG_MATCH_LOG_REQ",
                            "id": 380
                        },
                        {
                            "name": "MSG_MATCH_LOG_ACK",
                            "id": 381
                        },
                        {
                            "name": "MSG_MATCH_UPDATE_REQ",
                            "id": 370
                        },
                        {
                            "name": "MSG_MATCH_UPDATE_ACK",
                            "id": 371
                        },
                        {
                            "name": "MSG_MATCH_APPLY_REQ",
                            "id": 372
                        },
                        {
                            "name": "MSG_MATCH_APPLY_ACK",
                            "id": 373
                        },
                        {
                            "name": "MSG_MATCH_CANCEL_REQ",
                            "id": 374
                        },
                        {
                            "name": "MSG_MATCH_CANCEL_ACK",
                            "id": 375
                        },
                        {
                            "name": "MSG_QUERY_MATCH_INFO_REQ",
                            "id": 376
                        },
                        {
                            "name": "MSG_QUERY_MATCH_INFO_ACK",
                            "id": 378
                        },
                        {
                            "name": "MSG_RESOURCE_COST",
                            "id": 400
                        },
                        {
                            "name": "MSG_RESOURCE_GAIN",
                            "id": 401
                        },
                        {
                            "name": "MSG_GUILD_REQ",
                            "id": 410
                        },
                        {
                            "name": "MSG_GUILD_ACK",
                            "id": 411
                        },
                        {
                            "name": "MSG_GUILD_CLOSE_REQ",
                            "id": 412
                        },
                        {
                            "name": "MSG_GUILD_CLOSE_ACK",
                            "id": 413
                        },
                        {
                            "name": "MSG_GUILD_JOIN_REQ",
                            "id": 414
                        },
                        {
                            "name": "MSG_GUILD_JOIN_ACK",
                            "id": 415
                        },
                        {
                            "name": "MSG_GUILD_REMOVE_REQ",
                            "id": 416
                        },
                        {
                            "name": "MSG_GUILD_REMOVE_ACK",
                            "id": 417
                        },
                        {
                            "name": "MSG_GUILD_QUIT_REQ",
                            "id": 418
                        },
                        {
                            "name": "MSG_GUILD_QUIT_ACK",
                            "id": 419
                        },
                        {
                            "name": "MSG_GUILD_ACCEPT_REQ",
                            "id": 420
                        },
                        {
                            "name": "MSG_GUILD_ACCEPT_ACK",
                            "id": 421
                        },
                        {
                            "name": "MSG_GUILD_FRIEND_REQ",
                            "id": 422
                        },
                        {
                            "name": "MSG_GUILD_FRIEND_ACK",
                            "id": 423
                        },
                        {
                            "name": "MSG_GUILD_KICK_REQ",
                            "id": 425
                        },
                        {
                            "name": "MSG_GUILD_KICK_ACK",
                            "id": 426
                        },
                        {
                            "name": "MSG_GUILD_NAME_REQ",
                            "id": 427
                        },
                        {
                            "name": "MSG_GUILD_NAME_ACK",
                            "id": 428
                        },
                        {
                            "name": "MSG_GUILD_UPDATE",
                            "id": 429
                        },
                        {
                            "name": "MSG_GUILD_POWER_REQ",
                            "id": 430
                        },
                        {
                            "name": "MSG_GUILD_POWER_ACK",
                            "id": 431
                        },
                        {
                            "name": "MSG_GUILD_LOG_REQ",
                            "id": 432
                        },
                        {
                            "name": "MSG_GUILD_LOG_ACK",
                            "id": 433
                        },
                        {
                            "name": "MSG_GUILD_NOTICE_REQ",
                            "id": 434
                        },
                        {
                            "name": "MSG_GUILD_NOTICE_ACK",
                            "id": 435
                        },
                        {
                            "name": "MSG_GUILD_RANK_REQ",
                            "id": 436
                        },
                        {
                            "name": "MSG_GUILD_RANK_ACK",
                            "id": 437
                        },
                        {
                            "name": "MSG_GUILD_ROOM_CREATE_REQ",
                            "id": 450
                        },
                        {
                            "name": "MSG_GUILD_ROOM_CREATE_ACK",
                            "id": 451
                        },
                        {
                            "name": "MSG_GUILD_ROOM_REMOVE_REQ",
                            "id": 452
                        },
                        {
                            "name": "MSG_GUILD_ROOM_REMOVE_ACK",
                            "id": 453
                        },
                        {
                            "name": "MSG_GUILD_ROOM_CARD_REQ",
                            "id": 454
                        },
                        {
                            "name": "MSG_GUILD_ROOM_CARD_ACK",
                            "id": 455
                        },
                        {
                            "name": "MSG_GUILD_ROOM_LOG_REQ",
                            "id": 456
                        },
                        {
                            "name": "MSG_GUILD_ROOM_LOG_ACK",
                            "id": 457
                        },
                        {
                            "name": "MSG_GUILD_ROOM_UPDATE",
                            "id": 460
                        },
                        {
                            "name": "MSG_GUILD_ROOM_CARD",
                            "id": 461
                        },
                        {
                            "name": "MSG_GUILD_TABLE_CREATE",
                            "id": 490
                        },
                        {
                            "name": "MSG_GUILD_TABLE_REMOVE",
                            "id": 491
                        },
                        {
                            "name": "MSG_GUILD_TABLE_UPDATE",
                            "id": 492
                        },
                        {
                            "name": "MSG_GUILD_TABLE_LOG",
                            "id": 495
                        },
                        {
                            "name": "MSG_GUILD_MASTER_CHANGE",
                            "id": 499
                        },
                        {
                            "name": "MSG_BIND_CARD_REQ",
                            "id": 500
                        },
                        {
                            "name": "MSG_BIND_CARD_ACK",
                            "id": 501
                        },
                        {
                            "name": "MSG_BIND_PLAYER_REQ",
                            "id": 510
                        },
                        {
                            "name": "MSG_BIND_PLAYER_ACK",
                            "id": 511
                        },
                        {
                            "name": "MSG_BIND_INFO_REQ",
                            "id": 520
                        },
                        {
                            "name": "MSG_BIND_INFO_ACK",
                            "id": 521
                        },
                        {
                            "name": "MSG_BIND_UPDATE",
                            "id": 549
                        },
                        {
                            "name": "MSG_RANK_REQ",
                            "id": 550
                        },
                        {
                            "name": "MSG_RANK_ACK",
                            "id": 551
                        },
                        {
                            "name": "MSG_REPLAY_REQ",
                            "id": 560
                        },
                        {
                            "name": "MSG_REPLAY_ACK",
                            "id": 561
                        },
                        {
                            "name": "MSG_RED_CASH_REQ",
                            "id": 570
                        },
                        {
                            "name": "MSG_RED_CASH_ACK",
                            "id": 571
                        },
                        {
                            "name": "MSG_RED_STORE_REQ",
                            "id": 580
                        },
                        {
                            "name": "MSG_RED_STORE_ACK",
                            "id": 581
                        },
                        {
                            "name": "MSG_ENERGY_TURNABLE",
                            "id": 590
                        },
                        {
                            "name": "MSG_ET_DRAW_REQ",
                            "id": 591
                        },
                        {
                            "name": "MSG_ET_DRAW_RES",
                            "id": 592
                        },
                        {
                            "name": "MSG_ADD",
                            "id": 600
                        },
                        {
                            "name": "MSG_REMOVE",
                            "id": 601
                        },
                        {
                            "name": "MSG_UPDATE",
                            "id": 602
                        },
                        {
                            "name": "MSG_BIND_PHONE_REQ",
                            "id": 610
                        },
                        {
                            "name": "MSG_BIND_PHONE_ACK",
                            "id": 611
                        },
                        {
                            "name": "MSG_BIND_XIANLIAO_ROBOT_REQ",
                            "id": 620
                        },
                        {
                            "name": "MSG_BIND_XIANLIAO_ROBOT_ACK",
                            "id": 621
                        },
                        {
                            "name": "MSG_CARD_UPDATE",
                            "id": 700
                        },
                        {
                            "name": "MSG_RESOURCE_GIFT_REQ",
                            "id": 900
                        },
                        {
                            "name": "MSG_RESOURCE_GIFT_ACK",
                            "id": 901
                        },
                        {
                            "name": "MSG_SERVER_REQ",
                            "id": 1000
                        },
                        {
                            "name": "MSG_SERVER_ACK",
                            "id": 1001
                        }
                    ]
                },
                {
                    "name": "eRETURN_TYPE",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "RETURN_SUCCEEDED",
                            "id": 0
                        },
                        {
                            "name": "RETURN_FAILED",
                            "id": 1
                        },
                        {
                            "name": "RETURN_DISABLE",
                            "id": 2
                        },
                        {
                            "name": "RETURN_ONLINE",
                            "id": 3
                        },
                        {
                            "name": "RETURN_OFFLINE",
                            "id": 4
                        },
                        {
                            "name": "RETURN_WAIT",
                            "id": 5
                        },
                        {
                            "name": "RETURN_UNIMPLEMENTED",
                            "id": 6
                        },
                        {
                            "name": "RETURN_EXIST",
                            "id": 7
                        },
                        {
                            "name": "RETURN_INTERRUPT",
                            "id": 10
                        },
                        {
                            "name": "RETURN_BAN",
                            "id": 11
                        },
                        {
                            "name": "RETURN_USED",
                            "id": 12
                        },
                        {
                            "name": "RETURN_GAIN",
                            "id": 13
                        },
                        {
                            "name": "RETURN_LEN",
                            "id": 14
                        },
                        {
                            "name": "RETURN_INVALID",
                            "id": 15
                        },
                        {
                            "name": "RETURN_DATETIME",
                            "id": 16
                        },
                        {
                            "name": "RETURN_PERMISSION",
                            "id": 17
                        },
                        {
                            "name": "RETURN_MAC",
                            "id": 18
                        },
                        {
                            "name": "RETURN_TIMEOUT",
                            "id": 22
                        },
                        {
                            "name": "RETURN_COST",
                            "id": 23
                        },
                        {
                            "name": "RETURN_CHANNEL",
                            "id": 24
                        },
                        {
                            "name": "RETURN_GUILD",
                            "id": 25
                        },
                        {
                            "name": "RETURN_SAME",
                            "id": 26
                        },
                        {
                            "name": "RETURN_NICKNAME_SHORT",
                            "id": 100
                        },
                        {
                            "name": "RETURN_NICKNAME_LONG",
                            "id": 101
                        },
                        {
                            "name": "RETURN_NICKNAME_EXIST",
                            "id": 102
                        },
                        {
                            "name": "RETURN_NICKNAME_ERROR",
                            "id": 103
                        },
                        {
                            "name": "RETURN_MAX_LEVEL",
                            "id": 910
                        },
                        {
                            "name": "RETURN_MAX_PLUS",
                            "id": 911
                        },
                        {
                            "name": "RETURN_NO_PLAYER",
                            "id": 1000
                        },
                        {
                            "name": "RETURN_NO_ITEM",
                            "id": 1001
                        },
                        {
                            "name": "RETURN_EXIST_NICKNAME",
                            "id": 2001
                        },
                        {
                            "name": "RETURN_EXIST_USER",
                            "id": 2002
                        },
                        {
                            "name": "RETURN_NOTENOUGH_VIPLEVEL",
                            "id": 2999
                        },
                        {
                            "name": "RETURN_NOTENOUGH_LEVEL",
                            "id": 3000
                        },
                        {
                            "name": "RETURN_NOTENOUGH_GOLD",
                            "id": 3001
                        },
                        {
                            "name": "RETURN_NOTENOUGH_MONEY",
                            "id": 3002
                        },
                        {
                            "name": "RETURN_NOTENOUGH_CARD",
                            "id": 3003
                        },
                        {
                            "name": "RETURN_NOTENOUGH_RED",
                            "id": 3004
                        },
                        {
                            "name": "RETURN_NOTENOUGH_BEAN",
                            "id": 3005
                        },
                        {
                            "name": "RETURN_FULL",
                            "id": 3100
                        },
                        {
                            "name": "RETURN_FULL_GOLD",
                            "id": 3101
                        },
                        {
                            "name": "RETURN_FULL_MONEY",
                            "id": 3102
                        },
                        {
                            "name": "RETURN_INVITE_EXIST",
                            "id": 3200
                        },
                        {
                            "name": "RETURN_INVITE_NOTFOUND",
                            "id": 3201
                        },
                        {
                            "name": "RETURN_INVITE_FULL",
                            "id": 3202
                        },
                        {
                            "name": "RETURN_INVITE_LEVEL",
                            "id": 3203
                        },
                        {
                            "name": "RETURN_INVITE_REQUESTFULL",
                            "id": 3204
                        },
                        {
                            "name": "RETURN_INVITE_VIPLEVEL",
                            "id": 3205
                        },
                        {
                            "name": "RETURN_RED_DISABLE",
                            "id": 3300
                        },
                        {
                            "name": "RETURN_RED_MIN",
                            "id": 3301
                        },
                        {
                            "name": "RETURN_RED_MAX",
                            "id": 3302
                        },
                        {
                            "name": "RETURN_RED_CASH",
                            "id": 3303
                        },
                        {
                            "name": "RETURN_RED_NUM",
                            "id": 3304
                        },
                        {
                            "name": "RETURN_RED_LIMIT",
                            "id": 3305
                        },
                        {
                            "name": "RETURN_RED_NOTENOUGH",
                            "id": 3310
                        },
                        {
                            "name": "RETURN_GUILD_MASTER",
                            "id": 3400
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_DISABLE",
                            "id": 3410
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_MAX",
                            "id": 3411
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_CREATE",
                            "id": 3412
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_NOTFOUND",
                            "id": 3413
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_CARD_NOTENOUGH",
                            "id": 3420
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_CARD_MIN",
                            "id": 3421
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_CARD_MAX",
                            "id": 3422
                        },
                        {
                            "name": "RETURN_GUILD_ROOM_CARD_DAY",
                            "id": 3423
                        },
                        {
                            "name": "RETURN_GUILD_JOIN_NOTFOUND",
                            "id": 3450
                        },
                        {
                            "name": "RETURN_GUILD_JOIN_EXIST",
                            "id": 3451
                        },
                        {
                            "name": "RETURN_GUILD_JOIN_REQUEST",
                            "id": 3452
                        },
                        {
                            "name": "RETURN_GUILD_JOIN_MAX",
                            "id": 3453
                        },
                        {
                            "name": "RETURN_GUILD_JOIN_FULL",
                            "id": 3454
                        },
                        {
                            "name": "RETURN_GUILD_DISABAND_NO_OUTTIME",
                            "id": 3455
                        },
                        {
                            "name": "RETURN_GUILD_LOG_TIME",
                            "id": 3460
                        },
                        {
                            "name": "RETURN_GUILD_LOG_DISABLE",
                            "id": 3461
                        },
                        {
                            "name": "RETURN_GUILD_LOG_OUT",
                            "id": 3462
                        },
                        {
                            "name": "RETURN_GUILD_RANK_CLOSE",
                            "id": 3464
                        },
                        {
                            "name": "RETURN_GUILD_REQUEST_TIME",
                            "id": 3465
                        },
                        {
                            "name": "RETURN_GUILD_NOTICE_UPDATE",
                            "id": 3466
                        },
                        {
                            "name": "RETURN_GUILD_NOTICE_PUBLISH_OFTEN",
                            "id": 3467
                        },
                        {
                            "name": "RETURN_BIND_EXIST",
                            "id": 3500
                        },
                        {
                            "name": "RETURN_BIND_NOTFOUND",
                            "id": 3501
                        },
                        {
                            "name": "RETURN_BIND_CARD_DISABLE",
                            "id": 3502
                        },
                        {
                            "name": "RETURN_BIND_CARD_NO",
                            "id": 3503
                        },
                        {
                            "name": "RETURN_BIND_CARD_NUM",
                            "id": 3504
                        },
                        {
                            "name": "RETURN_BIND_CARD_MIN",
                            "id": 3505
                        },
                        {
                            "name": "RETURN_BIND_CARD_MAX",
                            "id": 3506
                        },
                        {
                            "name": "RETURN_BIND_CARD_LIMIT",
                            "id": 3507
                        },
                        {
                            "name": "RETURN_MATCH_DISABLE",
                            "id": 3600
                        },
                        {
                            "name": "RETURN_MATCH_LOG_TIME",
                            "id": 3601
                        },
                        {
                            "name": "RETURN_MATCH_FULL",
                            "id": 3602
                        },
                        {
                            "name": "RETURN_MATCH_DAY_MAX",
                            "id": 3603
                        },
                        {
                            "name": "RETURN_MATCH_CARD_NOTENOUGH",
                            "id": 3604
                        },
                        {
                            "name": "RETURN_MATCH_CHANNEL",
                            "id": 3605
                        },
                        {
                            "name": "RETURN_MATCH_HAS_APPLY",
                            "id": 3606
                        },
                        {
                            "name": "RETURN_MATCH_ID_NOT_EXSIT",
                            "id": 3607
                        },
                        {
                            "name": "RETURN_MATCH_IS_START",
                            "id": 3608
                        },
                        {
                            "name": "RETURN_MATCH_GIVE_UP",
                            "id": 3609
                        },
                        {
                            "name": "RETURN_BIND_PHONE_SUCCESS",
                            "id": 3700
                        },
                        {
                            "name": "RETURN_HAS_BINDED",
                            "id": 3701
                        },
                        {
                            "name": "RETURN_CODE_EXPIRE",
                            "id": 3702
                        },
                        {
                            "name": "RETURN_ENERGY_NOT_ENOUGH",
                            "id": 3750
                        },
                        {
                            "name": "RETURN_TABLE_WAIT_TIMEOUT",
                            "id": 3751
                        },
                        {
                            "name": "RETURN_DAYLIMIT",
                            "id": 4000
                        },
                        {
                            "name": "RETURN_COLDDOWN",
                            "id": 4001
                        },
                        {
                            "name": "RETURN_LOCKCARD",
                            "id": 4002
                        },
                        {
                            "name": "RETURN_LOCKGOLD",
                            "id": 4003
                        },
                        {
                            "name": "RETURN_REFRESH",
                            "id": 4004
                        },
                        {
                            "name": "RETURN_HELPER_RECEIVE_ALL",
                            "id": 4005
                        }
                    ]
                },
                {
                    "name": "eFRIEND_OP",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "FRIEND_OP_ADD",
                            "id": 0
                        },
                        {
                            "name": "FRIEND_OP_REMOVE",
                            "id": 1
                        },
                        {
                            "name": "FRIEND_OP_REQUEST",
                            "id": 2
                        },
                        {
                            "name": "FRIEND_OP_RESPONSE",
                            "id": 3
                        },
                        {
                            "name": "FRIEND_OP_ALIAS",
                            "id": 5
                        },
                        {
                            "name": "FRIEND_OP_CHAT",
                            "id": 6
                        },
                        {
                            "name": "FRIEND_OP_GIFT_CARD",
                            "id": 10
                        }
                    ]
                }
            ],
            "isNamespace": true
        }
    ],
    "isNamespace": true
}).build();