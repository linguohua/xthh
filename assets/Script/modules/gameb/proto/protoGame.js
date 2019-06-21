exports.proto = require("protobuf").newBuilder({})['import']({
    "package": null,
    "syntax": "proto2",
    "messages": [
        {
            "name": "dfmahjong",
            "fields": [],
            "syntax": "proto2",
            "enums": [
                {
                    "name": "GreatWinType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "enumGreatWinType_None",
                            "id": 0
                        },
                        {
                            "name": "enumGreatWinType_ChowPongKong",
                            "id": 1
                        },
                        {
                            "name": "enumGreatWinType_FinalDraw",
                            "id": 2
                        },
                        {
                            "name": "enumGreatWinType_PongKong",
                            "id": 4
                        },
                        {
                            "name": "enumGreatWinType_PureSame",
                            "id": 8
                        },
                        {
                            "name": "enumGreatWinType_MixedSame",
                            "id": 16
                        },
                        {
                            "name": "enumGreatWinType_ClearFront",
                            "id": 32
                        },
                        {
                            "name": "enumGreatWinType_SevenPair",
                            "id": 64
                        },
                        {
                            "name": "enumGreatWinType_GreatSevenPair",
                            "id": 128
                        },
                        {
                            "name": "enumGreatWinType_Heaven",
                            "id": 256
                        },
                        {
                            "name": "enumGreatWinType_AfterConcealedKong",
                            "id": 512
                        },
                        {
                            "name": "enumGreatWinType_AfterExposedKong",
                            "id": 1024
                        },
                        {
                            "name": "enumGreatWinType_Richi",
                            "id": 2048
                        },
                        {
                            "name": "enumGreatWinType_PongKongWithFlowerNoMeld",
                            "id": 4096
                        },
                        {
                            "name": "enumGreatWinType_PureSameWithFlowerNoMeld",
                            "id": 8192
                        },
                        {
                            "name": "enumGreatWinType_MixSameWithFlowerNoMeld",
                            "id": 16384
                        },
                        {
                            "name": "enumGreatWinType_PureSameWithMeld",
                            "id": 32768
                        },
                        {
                            "name": "enumGreatWinType_MixSameWithMeld",
                            "id": 65536
                        },
                        {
                            "name": "enumGreatWinType_RobKong",
                            "id": 131072
                        },
                        {
                            "name": "enumGreatWinType_OpponentsRichi",
                            "id": 262144
                        }
                    ]
                },
                {
                    "name": "MiniWinType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "enumMiniWinType_None",
                            "id": 0
                        },
                        {
                            "name": "enumMiniWinType_Continuous_Banker",
                            "id": 1
                        },
                        {
                            "name": "enumMiniWinType_SelfDraw",
                            "id": 2
                        },
                        {
                            "name": "enumMiniWinType_NoFlowers",
                            "id": 4
                        },
                        {
                            "name": "enumMiniWinType_Kong2Discard",
                            "id": 8
                        },
                        {
                            "name": "enumMiniWinType_Kong2SelfDraw",
                            "id": 16
                        },
                        {
                            "name": "enumMiniWinType_SecondFrontClear",
                            "id": 32
                        },
                        {
                            "name": "enumMiniWinType_PongSelfDrawn",
                            "id": 64
                        },
                        {
                            "name": "enumMiniWinType_ChowPongkong",
                            "id": 128
                        },
                        {
                            "name": "enumMiniWinType_Richi",
                            "id": 256
                        },
                        {
                            "name": "enumMiniWinType_SevenPair",
                            "id": 512
                        },
                        {
                            "name": "enumMiniWinType_PureSameWithMeld",
                            "id": 1024
                        },
                        {
                            "name": "enumMiniWinType_MixSameWithMeld",
                            "id": 2048
                        }
                    ]
                }
            ],
            "isNamespace": true
        },
        {
            "name": "mahjong",
            "fields": [],
            "syntax": "proto2",
            "messages": [
                {
                    "name": "MsgReplayPlayerInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "userID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nick",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "totalScore",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gender",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "headIconURI",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "avatarID",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgReplayPlayerScoreSummary",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "score",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "winType",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgReplayRecordSummary",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "recordUUID",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgReplayPlayerScoreSummary",
                            "name": "playerScores",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "endTime",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "shareAbleID",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "startTime",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgReplayRoom",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "recordRoomType",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "startTime",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "endTime",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "roomNumber",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgReplayPlayerInfo",
                            "name": "players",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgReplayRecordSummary",
                            "name": "records",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ownerUserID",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "SRMsgPlayerInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "userID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nick",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gender",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "headIconURI",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "avatarID",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "SRDealDetail",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "tilesHand",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "tilesFlower",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "SRAction",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "action",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "qaIndex",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "tiles",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "flags",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "allowActions",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "SRMsgHandRecorderExtra",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "markup",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ownerUserID",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "SRMsgHandRecorder",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "bankerChairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "windFlowerID",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "SRMsgPlayerInfo",
                            "name": "players",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "bool",
                            "name": "isHandOver",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "SRDealDetail",
                            "name": "deals",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "SRAction",
                            "name": "actions",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "handScore",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roomConfigID",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "startTime",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "endTime",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "handNum",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isContinuousBanker",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roomNumber",
                            "id": 13
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "roomType",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "SRMsgHandRecorderExtra",
                            "name": "extra",
                            "id": 15
                        }
                    ]
                },
                {
                    "name": "MsgPlayerInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "userID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "state",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nick",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gender",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "headIconURI",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ip",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "location",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "dfHands",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "diamond",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "charm",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "avatarID",
                            "id": 13
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "clubIDs",
                            "id": 14
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "dan",
                            "id": 15
                        }
                    ]
                },
                {
                    "name": "PlayerHandScoreRecord",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "userID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "winType",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "score",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgRoomHandScoreRecord",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "endType",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "handIndex",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "PlayerHandScoreRecord",
                            "name": "playerRecords",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgRoomInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "state",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgPlayerInfo",
                            "name": "players",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "ownerID",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roomNumber",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "handStartted",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgRoomHandScoreRecord",
                            "name": "scoreRecords",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "handFinished",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "RoomScoreRecords",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgRoomHandScoreRecord",
                            "name": "scoreRecords",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgDisbandAnswer",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "bool",
                            "name": "agree",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgDisbandNotify",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "disbandState",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "applicant",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "waits",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "agrees",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "rejects",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "countdown",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgGameOverPlayerStat",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "score",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "winChuckCounter",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "winSelfDrawnCounter",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chuckerCounter",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "robKongCounter",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "kongerCounter",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgGameOver",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgGameOverPlayerStat",
                            "name": "playerStats",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgRoomShowTips",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "tips",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "tipCode",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgRoomDelete",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "reason",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgKickout",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "victimUserID",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgKickoutResult",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "result",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "victimUserID",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "victimNick",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "byWhoNick",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "byWhoUserID",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgEnterRoomResult",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "status",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgDonate",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "toChairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "itemID",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fromChairID",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "GameMessage",
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
                    "name": "MsgMeldTile",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "meldType",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "tile1",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "contributor",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "chowTile",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "MsgPlayerTileList",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "chairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "tileCountInHand",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "tilesHand",
                            "id": 3
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "tilesFlower",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "tilesDiscard",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgMeldTile",
                            "name": "melds",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgDeal",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "bankerChairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "windFlowerID",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgPlayerTileList",
                            "name": "playerTileLists",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "tilesInWall",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "dice1",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "dice2",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isContinuousBanker",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "markup",
                            "id": 8
                        }
                    ]
                },
                {
                    "name": "MsgReadyHandTips",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "targetTile",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "readyHandList",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgAllowPlayerAction",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "qaIndex",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "actionChairID",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "allowedActions",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "timeoutInSeconds",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgReadyHandTips",
                            "name": "tipsForAction",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgMeldTile",
                            "name": "meldsForAction",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgAllowPlayerReAction",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "qaIndex",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "actionChairID",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "allowedActions",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "timeoutInSeconds",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgMeldTile",
                            "name": "meldsForAction",
                            "id": 5
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "victimTileID",
                            "id": 6
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "victimChairID",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgPlayerAction",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "qaIndex",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "action",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "flags",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "tile",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "meldType",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "meldTile1",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgActionResultNotify",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "targetChairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "action",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "actionTile",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "MsgMeldTile",
                            "name": "actionMeld",
                            "id": 4
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "newFlowers",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "tilesInWall",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "waitDiscardReAction",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgRestore",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "MsgDeal",
                            "name": "msgDeal",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "readyHandChairs",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "lastDiscaredChairID",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isMeNewDraw",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "waitDiscardReAction",
                            "id": 5
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "flyReadyHandChairs",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "extra",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgPlayerScoreGreatWin",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "baseWinScore",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "greatWinType",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "greatWinPoints",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "trimGreatWinPoints",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "continuousBankerExtra",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgPlayerScoreMiniWin",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "miniWinType",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "miniWinBasicScore",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "miniWinFlowerScore",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "miniMultiple",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "miniWinTrimScore",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "continuousBankerExtra",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgPlayerScore",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "targetChairID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "winType",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "score",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "specialScore",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "MsgPlayerScoreGreatWin",
                            "name": "greatWin",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "MsgPlayerScoreMiniWin",
                            "name": "miniWin",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "fakeWinScore",
                            "id": 7
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "fakeList",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isContinuousBanker",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "continuousBankerMultiple",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "MsgHandScore",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgPlayerScore",
                            "name": "playerScores",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgHandOver",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "endType",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgPlayerTileList",
                            "name": "playerTileLists",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "MsgHandScore",
                            "name": "scores",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "continueAble",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "MsgUpdateLocation",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "userID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "location",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgUpdatePropCfg",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "propCfg",
                            "id": 1
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "SRFlags",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "SRNone",
                            "id": 0
                        },
                        {
                            "name": "SRUserReplyOnly",
                            "id": 1
                        },
                        {
                            "name": "SRRichi",
                            "id": 2
                        },
                        {
                            "name": "SRFlyRichi",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "RoomState",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "SRoomIdle",
                            "id": 0
                        },
                        {
                            "name": "SRoomWaiting",
                            "id": 1
                        },
                        {
                            "name": "SRoomPlaying",
                            "id": 2
                        },
                        {
                            "name": "SRoomDeleted",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "PlayerState",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "PSNone",
                            "id": 0
                        },
                        {
                            "name": "PSReady",
                            "id": 1
                        },
                        {
                            "name": "PSOffline",
                            "id": 2
                        },
                        {
                            "name": "PSPlaying",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "DisbandState",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Waiting",
                            "id": 1
                        },
                        {
                            "name": "Done",
                            "id": 2
                        },
                        {
                            "name": "DoneWithOtherReject",
                            "id": 3
                        },
                        {
                            "name": "DoneWithRoomServerNotResponse",
                            "id": 4
                        },
                        {
                            "name": "DoneWithWaitReplyTimeout",
                            "id": 5
                        },
                        {
                            "name": "ErrorDuplicateAcquire",
                            "id": 6
                        },
                        {
                            "name": "ErrorNeedOwnerWhenGameNotStart",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "TipCode",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "TCNone",
                            "id": 0
                        },
                        {
                            "name": "TCWaitOpponentsAction",
                            "id": 1
                        },
                        {
                            "name": "TCDonateFailedNoEnoughDiamond",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "RoomDeleteReason",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "IdleTimeout",
                            "id": 1
                        },
                        {
                            "name": "DisbandByOwnerFromRMS",
                            "id": 2
                        },
                        {
                            "name": "DisbandByApplication",
                            "id": 3
                        },
                        {
                            "name": "DisbandBySystem",
                            "id": 4
                        },
                        {
                            "name": "DisbandMaxHand",
                            "id": 5
                        },
                        {
                            "name": "DisbandInLoseProtected",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "KickoutResult",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "KickoutResult_Success",
                            "id": 1
                        },
                        {
                            "name": "KickoutResult_FailedGameHasStartted",
                            "id": 2
                        },
                        {
                            "name": "KickoutResult_FailedNeedOwner",
                            "id": 3
                        },
                        {
                            "name": "KickoutResult_FailedPlayerNotExist",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "EnterRoomStatus",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Success",
                            "id": 0
                        },
                        {
                            "name": "RoomNotExist",
                            "id": 1
                        },
                        {
                            "name": "RoomIsFulled",
                            "id": 2
                        },
                        {
                            "name": "RoomPlaying",
                            "id": 3
                        },
                        {
                            "name": "InAnotherRoom",
                            "id": 4
                        },
                        {
                            "name": "MonkeyRoomUserIDNotMatch",
                            "id": 5
                        },
                        {
                            "name": "MonkeyRoomUserLoginSeqNotMatch",
                            "id": 6
                        },
                        {
                            "name": "AppModuleNeedUpgrade",
                            "id": 7
                        },
                        {
                            "name": "InRoomBlackList",
                            "id": 8
                        },
                        {
                            "name": "TakeoffDiamondFailedNotEnough",
                            "id": 9
                        },
                        {
                            "name": "TakeoffDiamondFailedIO",
                            "id": 10
                        },
                        {
                            "name": "ParseTokenError",
                            "id": 11
                        },
                        {
                            "name": "RoomInApplicateDisband",
                            "id": 12
                        },
                        {
                            "name": "NotClubMember",
                            "id": 13
                        }
                    ]
                },
                {
                    "name": "TileID",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "enumTid_MAN1",
                            "id": 0
                        },
                        {
                            "name": "enumTid_MAN2",
                            "id": 1
                        },
                        {
                            "name": "enumTid_MAN3",
                            "id": 2
                        },
                        {
                            "name": "enumTid_MAN4",
                            "id": 3
                        },
                        {
                            "name": "enumTid_MAN5",
                            "id": 4
                        },
                        {
                            "name": "enumTid_MAN6",
                            "id": 5
                        },
                        {
                            "name": "enumTid_MAN7",
                            "id": 6
                        },
                        {
                            "name": "enumTid_MAN8",
                            "id": 7
                        },
                        {
                            "name": "enumTid_MAN9",
                            "id": 8
                        },
                        {
                            "name": "enumTid_PIN1",
                            "id": 9
                        },
                        {
                            "name": "enumTid_PIN2",
                            "id": 10
                        },
                        {
                            "name": "enumTid_PIN3",
                            "id": 11
                        },
                        {
                            "name": "enumTid_PIN4",
                            "id": 12
                        },
                        {
                            "name": "enumTid_PIN5",
                            "id": 13
                        },
                        {
                            "name": "enumTid_PIN6",
                            "id": 14
                        },
                        {
                            "name": "enumTid_PIN7",
                            "id": 15
                        },
                        {
                            "name": "enumTid_PIN8",
                            "id": 16
                        },
                        {
                            "name": "enumTid_PIN9",
                            "id": 17
                        },
                        {
                            "name": "enumTid_SOU1",
                            "id": 18
                        },
                        {
                            "name": "enumTid_SOU2",
                            "id": 19
                        },
                        {
                            "name": "enumTid_SOU3",
                            "id": 20
                        },
                        {
                            "name": "enumTid_SOU4",
                            "id": 21
                        },
                        {
                            "name": "enumTid_SOU5",
                            "id": 22
                        },
                        {
                            "name": "enumTid_SOU6",
                            "id": 23
                        },
                        {
                            "name": "enumTid_SOU7",
                            "id": 24
                        },
                        {
                            "name": "enumTid_SOU8",
                            "id": 25
                        },
                        {
                            "name": "enumTid_SOU9",
                            "id": 26
                        },
                        {
                            "name": "enumTid_TON",
                            "id": 27
                        },
                        {
                            "name": "enumTid_NAN",
                            "id": 28
                        },
                        {
                            "name": "enumTid_SHA",
                            "id": 29
                        },
                        {
                            "name": "enumTid_PEI",
                            "id": 30
                        },
                        {
                            "name": "enumTid_HAK",
                            "id": 31
                        },
                        {
                            "name": "enumTid_HAT",
                            "id": 32
                        },
                        {
                            "name": "enumTid_CHU",
                            "id": 33
                        },
                        {
                            "name": "enumTid_PLUM",
                            "id": 34
                        },
                        {
                            "name": "enumTid_ORCHID",
                            "id": 35
                        },
                        {
                            "name": "enumTid_BAMBOO",
                            "id": 36
                        },
                        {
                            "name": "enumTid_CHRYSANTHEMUM",
                            "id": 37
                        },
                        {
                            "name": "enumTid_SPRING",
                            "id": 38
                        },
                        {
                            "name": "enumTid_SUMMER",
                            "id": 39
                        },
                        {
                            "name": "enumTid_AUTUMN",
                            "id": 40
                        },
                        {
                            "name": "enumTid_WINTER",
                            "id": 41
                        },
                        {
                            "name": "enumTid_MAX",
                            "id": 42
                        }
                    ]
                },
                {
                    "name": "MessageCode",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "OPInvalid",
                            "id": 0
                        },
                        {
                            "name": "OPAction",
                            "id": 1
                        },
                        {
                            "name": "OPActionResultNotify",
                            "id": 2
                        },
                        {
                            "name": "OPActionAllowed",
                            "id": 3
                        },
                        {
                            "name": "OPReActionAllowed",
                            "id": 5
                        },
                        {
                            "name": "OPDeal",
                            "id": 6
                        },
                        {
                            "name": "OPHandOver",
                            "id": 7
                        },
                        {
                            "name": "OPRestore",
                            "id": 8
                        },
                        {
                            "name": "OPPlayerLeaveRoom",
                            "id": 9
                        },
                        {
                            "name": "OPPlayerEnterRoom",
                            "id": 10
                        },
                        {
                            "name": "OPDisbandRequest",
                            "id": 11
                        },
                        {
                            "name": "OPDisbandNotify",
                            "id": 12
                        },
                        {
                            "name": "OPDisbandAnswer",
                            "id": 13
                        },
                        {
                            "name": "OPPlayerReady",
                            "id": 14
                        },
                        {
                            "name": "OPRoomDeleted",
                            "id": 15
                        },
                        {
                            "name": "OPRoomUpdate",
                            "id": 16
                        },
                        {
                            "name": "OPRoomShowTips",
                            "id": 17
                        },
                        {
                            "name": "OPGameOver",
                            "id": 18
                        },
                        {
                            "name": "OPKickout",
                            "id": 19
                        },
                        {
                            "name": "OPDonate",
                            "id": 20
                        },
                        {
                            "name": "OPUpdateLocation",
                            "id": 21
                        },
                        {
                            "name": "OP2Lobby",
                            "id": 22
                        },
                        {
                            "name": "OPUpdatePropCfg",
                            "id": 23
                        },
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
                    "name": "MeldType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "enumMeldTypeSequence",
                            "id": 0
                        },
                        {
                            "name": "enumMeldTypeTriplet",
                            "id": 1
                        },
                        {
                            "name": "enumMeldTypeExposedKong",
                            "id": 2
                        },
                        {
                            "name": "enumMeldTypeTriplet2Kong",
                            "id": 3
                        },
                        {
                            "name": "enumMeldTypeConcealedKong",
                            "id": 4
                        },
                        {
                            "name": "enumMeldTypeSelfMeld",
                            "id": 5
                        },
                        {
                            "name": "enumMeldTypeChuHH",
                            "id": 6
                        },
                        {
                            "name": "enumMeldTypeChuHH1",
                            "id": 7
                        },
                        {
                            "name": "enumMeldTypeWind",
                            "id": 8
                        },
                        {
                            "name": "enumMeldTypePairKong",
                            "id": 9
                        }
                    ]
                },
                {
                    "name": "ActionType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "enumActionType_SKIP",
                            "id": 1
                        },
                        {
                            "name": "enumActionType_DISCARD",
                            "id": 2
                        },
                        {
                            "name": "enumActionType_DRAW",
                            "id": 4
                        },
                        {
                            "name": "enumActionType_CHOW",
                            "id": 8
                        },
                        {
                            "name": "enumActionType_PONG",
                            "id": 16
                        },
                        {
                            "name": "enumActionType_KONG_Exposed",
                            "id": 32
                        },
                        {
                            "name": "enumActionType_KONG_Concealed",
                            "id": 64
                        },
                        {
                            "name": "enumActionType_WIN_Chuck",
                            "id": 128
                        },
                        {
                            "name": "enumActionType_WIN_SelfDrawn",
                            "id": 256
                        },
                        {
                            "name": "enumActionType_KONG_Triplet2",
                            "id": 512
                        },
                        {
                            "name": "enumActionType_FirstReadyHand",
                            "id": 1024
                        },
                        {
                            "name": "enumActionType_ReadyHand",
                            "id": 2048
                        },
                        {
                            "name": "enumActionType_CustomA",
                            "id": 4096
                        },
                        {
                            "name": "enumActionType_CustomB",
                            "id": 8192
                        },
                        {
                            "name": "enumActionType_CustomC",
                            "id": 16384
                        },
                        {
                            "name": "enumActionType_CustomD",
                            "id": 32768
                        }
                    ]
                },
                {
                    "name": "HandOverType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "enumHandOverType_None",
                            "id": 0
                        },
                        {
                            "name": "enumHandOverType_Win_SelfDrawn",
                            "id": 1
                        },
                        {
                            "name": "enumHandOverType_Win_Chuck",
                            "id": 2
                        },
                        {
                            "name": "enumHandOverType_Chucker",
                            "id": 3
                        },
                        {
                            "name": "enumHandOverType_Konger",
                            "id": 4
                        },
                        {
                            "name": "enumHandOverType_Win_RobKong",
                            "id": 5
                        }
                    ]
                }
            ],
            "isNamespace": true
        },
        {
            "name": "zjmahjong",
            "fields": [],
            "syntax": "proto2",
            "enums": [
                {
                    "name": "GreatWinType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "None",
                            "id": 0
                        },
                        {
                            "name": "PureSame",
                            "id": 1
                        },
                        {
                            "name": "SevenPair",
                            "id": 2
                        },
                        {
                            "name": "GreatSevenPair",
                            "id": 4
                        },
                        {
                            "name": "Thirteen",
                            "id": 8
                        },
                        {
                            "name": "RobKong",
                            "id": 16
                        },
                        {
                            "name": "Heaven",
                            "id": 32
                        },
                        {
                            "name": "AfterConcealedKong",
                            "id": 64
                        },
                        {
                            "name": "AfterExposedKong",
                            "id": 128
                        },
                        {
                            "name": "FinalDraw",
                            "id": 256
                        },
                        {
                            "name": "PongPong",
                            "id": 512
                        },
                        {
                            "name": "AllWind",
                            "id": 1024
                        },
                        {
                            "name": "AfterKong",
                            "id": 2048
                        }
                    ]
                }
            ],
            "isNamespace": true
        }
    ],
    "isNamespace": true
}).build();