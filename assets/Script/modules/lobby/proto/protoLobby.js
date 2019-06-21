exports.proto = require("protobuf").newBuilder({})['import']({
    "package": null,
    "syntax": "proto2",
    "messages": [
        {
            "name": "club",
            "fields": [],
            "syntax": "proto2",
            "messages": [
                {
                    "name": "MsgClubReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "replyCode",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "content",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubDisplayInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "nick",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "gender",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "headIconURL",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "avatarID",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "MsgClubMemberInfo",
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
                            "type": "MsgClubDisplayInfo",
                            "name": "displayInfo",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "online",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "role",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "allowCreateRoom",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgClubBaseInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "clubNumber",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "clubName",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "clubID",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgCubOperGenericReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "errorCode",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "extra",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MsgClubBaseInfo",
                            "name": "baseInfo",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "creatorUserID",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "clubLevel",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "points",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "wanka",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "candy",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "maxMember",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "joinForbit",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "hasUnReadEvents",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "createRoomOptions",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "memberCount",
                            "id": 11
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "managers",
                            "id": 12
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "createTime",
                            "id": 13
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadMyClubsReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubInfo",
                            "name": "clubs",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadUpdateReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubInfo",
                            "name": "clubsUpdated",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "clubIDsRemoved",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadMembersReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubMemberInfo",
                            "name": "members",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgCreateClubReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "MsgClubInfo",
                            "name": "clubInfo",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgClubEvent",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "evtType",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "Id",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "generatedTime",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "to",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "content",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "unread",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "needHandle",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "userID1",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "MsgClubDisplayInfo",
                            "name": "displayInfo1",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "approvalResult",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadEventsReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubEvent",
                            "name": "events",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubRoomInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "roomType",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roomRuleJSON",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "playerNumber",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "roomState",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roomNumber",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roomUUID",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadRoomsReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubRoomInfo",
                            "name": "rooms",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "totalRoomCount",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgClubFundEvent",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "evtType",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "generatedTime",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "userID",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "amount",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "total",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadFundEventsReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubFundEvent",
                            "name": "events",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadReplayRoomsReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "gZipBytes",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubApplyRecord",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "clubID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "clubNumber",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "clubName",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "approvalResult",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "eventID",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "timeStamp",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgClubLoadApplyRecordReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgClubApplyRecord",
                            "name": "records",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgClubNotify",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "notifyType",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "clubID",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bytes",
                            "name": "content",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgClubSetRoomOptions",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "options",
                            "id": 1
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "ClubReplyCode",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "RCNone",
                            "id": 0
                        },
                        {
                            "name": "RCError",
                            "id": 1
                        },
                        {
                            "name": "RCOperation",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ClubRoleType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CRoleTypeNone",
                            "id": 0
                        },
                        {
                            "name": "CRoleTypeMember",
                            "id": 1
                        },
                        {
                            "name": "CRoleTypeCreator",
                            "id": 2
                        },
                        {
                            "name": "CRoleTypeMgr",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ClubOperError",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CERR_OK",
                            "id": 0
                        },
                        {
                            "name": "CERR_Exceed_Max_Club_Count_Limit",
                            "id": 1
                        },
                        {
                            "name": "CERR_No_Valid_Club_Number",
                            "id": 2
                        },
                        {
                            "name": "CERR_Database_IO",
                            "id": 3
                        },
                        {
                            "name": "CERR_Encode_Decode",
                            "id": 4
                        },
                        {
                            "name": "CERR_Invalid_Input_Parameter",
                            "id": 5
                        },
                        {
                            "name": "CERR_Only_Creator_And_Mgr_Can_KickOut",
                            "id": 6
                        },
                        {
                            "name": "CERR_You_Already_In_Club",
                            "id": 7
                        },
                        {
                            "name": "CERR_You_Are_In_Club_Block_List",
                            "id": 8
                        },
                        {
                            "name": "CERR_You_Already_Applicate",
                            "id": 9
                        },
                        {
                            "name": "CERR_Invitee_Already_In_Club",
                            "id": 10
                        },
                        {
                            "name": "CERR_Invitee_Are_In_Club_Block_List",
                            "id": 11
                        },
                        {
                            "name": "CERR_Invitee_Already_Applicate",
                            "id": 12
                        },
                        {
                            "name": "CERR_Club_Not_Exist",
                            "id": 13
                        },
                        {
                            "name": "CERR_Only_Creator_Can_Invite",
                            "id": 14
                        },
                        {
                            "name": "CERR_Only_Creator_And_Mgr_Can_Approve",
                            "id": 15
                        },
                        {
                            "name": "CERR_No_Applicant",
                            "id": 16
                        },
                        {
                            "name": "CERR_Applicant_Already_In_Club",
                            "id": 17
                        },
                        {
                            "name": "CERR_Applicant_In_Club_Block_List",
                            "id": 18
                        },
                        {
                            "name": "CERR_Token_Invalid",
                            "id": 19
                        },
                        {
                            "name": "CERR_Club_Name_Too_Long",
                            "id": 20
                        },
                        {
                            "name": "CERR_Club_Name_Exist",
                            "id": 21
                        },
                        {
                            "name": "CERR_Club_Only_Owner_Can_Disband",
                            "id": 22
                        },
                        {
                            "name": "CERR_Owner_Can_not_quit",
                            "id": 23
                        },
                        {
                            "name": "CERR_User_Not_In_Club",
                            "id": 24
                        },
                        {
                            "name": "CERR_Club_Only_Owner_And_Mgr_Can_Set",
                            "id": 25
                        },
                        {
                            "name": "CERR_Club_Forbit_Join",
                            "id": 26
                        },
                        {
                            "name": "CERR_Input_Text_Too_Long",
                            "id": 27
                        },
                        {
                            "name": "CERR_Club_Has_Room_In_PlayingState",
                            "id": 28
                        },
                        {
                            "name": "CERR_Can_Not_Kick_Out_Creator_Or_Mgr",
                            "id": 29
                        }
                    ]
                },
                {
                    "name": "ClubEventType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CEVT_None",
                            "id": 0
                        },
                        {
                            "name": "CEVT_ClubDisband",
                            "id": 1
                        },
                        {
                            "name": "CEVT_NewApplicant",
                            "id": 2
                        },
                        {
                            "name": "CEVT_Approval",
                            "id": 3
                        },
                        {
                            "name": "CEVT_Deny",
                            "id": 4
                        },
                        {
                            "name": "CEVT_Join",
                            "id": 5
                        },
                        {
                            "name": "CEVT_Quit",
                            "id": 6
                        },
                        {
                            "name": "CEVT_Kickout",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "ClubFundEventType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CFET_None",
                            "id": 0
                        },
                        {
                            "name": "CFET_Add_By_Shop",
                            "id": 1
                        },
                        {
                            "name": "CFET_Award_By_System",
                            "id": 3
                        },
                        {
                            "name": "CFET_Gift_By_System",
                            "id": 4
                        },
                        {
                            "name": "CFET_Reduce_By_Room",
                            "id": 5
                        },
                        {
                            "name": "CFET_Add_By_Room",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "ClubNotifyType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CNotify_None",
                            "id": 0
                        },
                        {
                            "name": "CNotify_Change_Member_Role",
                            "id": 1
                        },
                        {
                            "name": "CNotify_Allow_Member_Create_Room",
                            "id": 2
                        },
                        {
                            "name": "CNotify_New_Member_Apply",
                            "id": 3
                        },
                        {
                            "name": "CNotify_Member_Join_Approval",
                            "id": 4
                        }
                    ]
                }
            ],
            "isNamespace": true
        },
        {
            "name": "lobby",
            "fields": [],
            "syntax": "proto2",
            "messages": [
                {
                    "name": "LobbyMessage",
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
                    "name": "MsgCreateRoomReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "config",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "UserProfile",
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
                            "name": "nickName",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "avatarURL",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "RoomInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "roomID",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "roomNumber",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "gameServerID",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "state",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "config",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "timeStamp",
                            "id": 6
                        },
                        {
                            "rule": "repeated",
                            "type": "UserProfile",
                            "name": "users",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "handStartted",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "uint32",
                            "name": "lastActiveTime",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "propCfg",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "moduleCfg",
                            "id": 11
                        }
                    ]
                },
                {
                    "name": "MsgCreateRoomRsp",
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
                            "type": "RoomInfo",
                            "name": "roomInfo",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "retMsg",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "diamond",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "MsgDeleteRoomReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "result",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgChat",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "scope",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "from",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "to",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "dataType",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "bytes",
                            "name": "data",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "id",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgLoadUnreadChatReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgChat",
                            "name": "msgs",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgSetReadChat",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "ids",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "RoomIDList",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "roomIDs",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgLoadRoomListRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "result",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "RoomInfo",
                            "name": "roomInfos",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "retMsg",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgUpdateUserInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "location",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "RoomCost",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "handNum",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "pay",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgRequestRoomInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "roomNumber",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgRequestRoomInfoRsp",
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
                            "type": "RoomInfo",
                            "name": "roomInfo",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "retMsg",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgUpdateRoomState",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "state",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "roomID",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "UserProfile",
                            "name": "users",
                            "id": 3
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "handStartted",
                            "id": 4
                        },
                        {
                            "rule": "required",
                            "type": "uint32",
                            "name": "lastActiveTime",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgUpdateRoomList",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "RoomInfo",
                            "name": "roomInfos",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgRequestUserScoreInfo",
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
                            "name": "gameID",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgRequestUserScoreInfoRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "maxWinScore",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "customCount",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "maxWinMoney",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "coinCount",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "retMsg",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "MsgLoadUserHeadIconURI",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "string",
                            "name": "userIDs",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgHeadIconInfo",
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
                            "type": "uint32",
                            "name": "gender",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "headIconURI",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgLoadUserHeadIconURIReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "result",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "MsgHeadIconInfo",
                            "name": "headIconInfos",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "retMsg",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgUpdateUserDiamond",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "uint64",
                            "name": "diamond",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MsgAccReplayRoom",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "bytes",
                            "name": "replayRoomBytes",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "recordRoomType",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgAccLoadReplayRoomsReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgAccReplayRoom",
                            "name": "replayRooms",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "totalCursor",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgAccLoadReplayRecord",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "bytes",
                            "name": "replayRecordBytes",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "roomJSONConfig",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "UserInfo",
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
                            "name": "openID",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "nickName",
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
                            "name": "province",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "city",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "country",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "headImgUrl",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "phone",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "diamond",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "MsgWxLogin",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "code",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "encrypteddata",
                            "id": 2
                        },
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "iv",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgLoginReply",
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
                            "name": "token",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "UserInfo",
                            "name": "userInfo",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "RoomInfo",
                            "name": "lastRoomInfo",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "ClientInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "qMod",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "modV",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "csVer",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "lobbyVer",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "operatingSystem",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "operatingSystemFamily",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "deviceUniqueIdentifier",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "deviceName",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "deviceModel",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "network",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "MsgRegisterReply",
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
                            "name": "token",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgQuicklyLoginReply",
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
                            "name": "token",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "account",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "UserInfo",
                            "name": "userInfo",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "RoomInfo",
                            "name": "lastRoomInfo",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "MsgWebsocketConnectReply",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "result",
                            "id": 1
                        }
                    ]
                },
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
                    "name": "MailAttachments",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "required",
                            "type": "int32",
                            "name": "num",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isReceive",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "MsgMail",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "required",
                            "type": "string",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "title",
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
                            "type": "MailAttachments",
                            "name": "attachments",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isRead",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "timeStamp",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "MsgLoadMail",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "MsgMail",
                            "name": "mails",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cursor",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "MsgShareInfo",
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
                            "name": "text",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "multimedia",
                            "id": 3
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "MsgError",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "ErrSuccess",
                            "id": 0
                        },
                        {
                            "name": "ErrDecode",
                            "id": 1
                        },
                        {
                            "name": "ErrEncode",
                            "id": 2
                        },
                        {
                            "name": "ErrRoomExist",
                            "id": 3
                        },
                        {
                            "name": "ErrNoRoomConfig",
                            "id": 4
                        },
                        {
                            "name": "ErrServerIsFull",
                            "id": 5
                        },
                        {
                            "name": "ErrDecodeRoomConfig",
                            "id": 6
                        },
                        {
                            "name": "ErrRoomNotExist",
                            "id": 7
                        },
                        {
                            "name": "ErrDatabase",
                            "id": 8
                        },
                        {
                            "name": "ErrRequestGameServerTimeOut",
                            "id": 9
                        },
                        {
                            "name": "ErrWaitGameServerSN",
                            "id": 10
                        },
                        {
                            "name": "ErrRoomIDIsEmpty",
                            "id": 11
                        },
                        {
                            "name": "ErrNotRoomCreater",
                            "id": 12
                        },
                        {
                            "name": "ErrGameIsPlaying",
                            "id": 13
                        },
                        {
                            "name": "ErrTokenIsEmpty",
                            "id": 14
                        },
                        {
                            "name": "ErrUserIdIsEmpty",
                            "id": 15
                        },
                        {
                            "name": "ErrRoomNumberIsEmpty",
                            "id": 16
                        },
                        {
                            "name": "ErrRoomNumberNotExist",
                            "id": 17
                        },
                        {
                            "name": "ErrGameServerIDNotExist",
                            "id": 18
                        },
                        {
                            "name": "ErrRoomCountIsOutOfLimit",
                            "id": 19
                        },
                        {
                            "name": "ErrRequestInvalidParam",
                            "id": 20
                        },
                        {
                            "name": "ErrTakeoffDiamondFailedNotEnough",
                            "id": 21
                        },
                        {
                            "name": "ErrTakeoffDiamondFailedIO",
                            "id": 22
                        },
                        {
                            "name": "ErrTakeoffDiamondFailedRepeat",
                            "id": 23
                        },
                        {
                            "name": "ErrGameServerUnsupportRoomType",
                            "id": 24
                        },
                        {
                            "name": "ErrGameServerRoomExist",
                            "id": 25
                        },
                        {
                            "name": "ErrGameServerNoRoomConfig",
                            "id": 26
                        },
                        {
                            "name": "ErrGameServerDecodeRoomConfig",
                            "id": 27
                        },
                        {
                            "name": "ErrGameServerRoomNotExist",
                            "id": 28
                        },
                        {
                            "name": "ErrUserInOtherRoom",
                            "id": 29
                        },
                        {
                            "name": "ErrRoomIsFull",
                            "id": 30
                        },
                        {
                            "name": "ErrUserInBlacklist",
                            "id": 31
                        },
                        {
                            "name": "ErrClubIDIsEmtpy",
                            "id": 32
                        },
                        {
                            "name": "ErrRoomPriceCfgNotExist",
                            "id": 33
                        },
                        {
                            "name": "ErrUserCreateRoomLock",
                            "id": 34
                        },
                        {
                            "name": "ErrGenerateRoomNumber",
                            "id": 35
                        },
                        {
                            "name": "ErrIsNeedUpdate",
                            "id": 36
                        },
                        {
                            "name": "ErrOnlyClubCreatorOrManagerAllowCreateRoom",
                            "id": 37
                        },
                        {
                            "name": "ErrOnlyClubCreatorOrManagerAllowDeleteRoom",
                            "id": 38
                        },
                        {
                            "name": "ErrNotClubMember",
                            "id": 39
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
                            "name": "OPConnectReply",
                            "id": 1
                        },
                        {
                            "name": "OPChat",
                            "id": 2
                        },
                        {
                            "name": "OPUpdateDiamond",
                            "id": 3
                        },
                        {
                            "name": "OPMail",
                            "id": 4
                        },
                        {
                            "name": "OPClubNotify",
                            "id": 5
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
                    "name": "RoomType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "DafengMJ",
                            "id": 1
                        },
                        {
                            "name": "GuanDang",
                            "id": 2
                        },
                        {
                            "name": "DongTaiMJ",
                            "id": 3
                        },
                        {
                            "name": "YanChengMJ",
                            "id": 4
                        },
                        {
                            "name": "ShaoGuanMJ",
                            "id": 5
                        },
                        {
                            "name": "NingAnMJ",
                            "id": 6
                        },
                        {
                            "name": "XinJiangGH",
                            "id": 7
                        },
                        {
                            "name": "DafengGZ",
                            "id": 8
                        },
                        {
                            "name": "Dafeng7w523",
                            "id": 9
                        },
                        {
                            "name": "NiuNiu",
                            "id": 10
                        },
                        {
                            "name": "DDZ",
                            "id": 11
                        },
                        {
                            "name": "XueLiuMJ",
                            "id": 12
                        },
                        {
                            "name": "LanZhouMJ",
                            "id": 13
                        },
                        {
                            "name": "LLanZouMJ",
                            "id": 14
                        },
                        {
                            "name": "ZhangYeMJ",
                            "id": 15
                        }
                    ]
                },
                {
                    "name": "OpenRoomType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "CreateAndEnter",
                            "id": 1
                        },
                        {
                            "name": "CreateForOther",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ChatDataType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Text",
                            "id": 0
                        },
                        {
                            "name": "Emoji",
                            "id": 1
                        },
                        {
                            "name": "Voice",
                            "id": 2
                        },
                        {
                            "name": "Buildin",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ChatScopeType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "UniCast",
                            "id": 0
                        },
                        {
                            "name": "InRoom",
                            "id": 1
                        },
                        {
                            "name": "InServer",
                            "id": 2
                        },
                        {
                            "name": "InAllServers",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "LoginState",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Faild",
                            "id": 0
                        },
                        {
                            "name": "Success",
                            "id": 1
                        },
                        {
                            "name": "UserInBlacklist",
                            "id": 2
                        },
                        {
                            "name": "ParseTokenError",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ActivityType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Email",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "LoginError",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "ErrLoginSuccess",
                            "id": 0
                        },
                        {
                            "name": "ErrParamDecode",
                            "id": 1
                        },
                        {
                            "name": "ErrParamInvalidCode",
                            "id": 2
                        },
                        {
                            "name": "ErrParamInvalidEncrypteddata",
                            "id": 3
                        },
                        {
                            "name": "ErrParamInvalidIv",
                            "id": 4
                        },
                        {
                            "name": "ErrWxAuthFailed",
                            "id": 5
                        },
                        {
                            "name": "ErrDecodeUserInfoFailed",
                            "id": 6
                        },
                        {
                            "name": "ErrParamAccountIsEmpty",
                            "id": 7
                        },
                        {
                            "name": "ErrParamPasswordIsEmpty",
                            "id": 8
                        },
                        {
                            "name": "ErrAccountNotExist",
                            "id": 9
                        },
                        {
                            "name": "ErrAccountNotSetPassword",
                            "id": 10
                        },
                        {
                            "name": "ErrPasswordNotMatch",
                            "id": 11
                        }
                    ]
                },
                {
                    "name": "RegisterError",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "ErrRegisterSuccess",
                            "id": 0
                        },
                        {
                            "name": "ErrAccountIsEmpty",
                            "id": 1
                        },
                        {
                            "name": "ErrPasswordIsEmpty",
                            "id": 2
                        },
                        {
                            "name": "ErrAccountExist",
                            "id": 3
                        },
                        {
                            "name": "ErrWriteDatabaseFailed",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "WebsocketConnectError",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "ConnectSuccess",
                            "id": 0
                        },
                        {
                            "name": "ParseTokenFailed",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "MailAttachmentType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Diamond",
                            "id": 1
                        }
                    ]
                }
            ],
            "isNamespace": true
        }
    ],
    "isNamespace": true
}).build();