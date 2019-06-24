/**
 * For stupid test
 */

import { GResLoaderImpl } from "./modules/lobby/GResLoaderImpl";
import { Dialog, GameModuleLaunchArgs, GResLoader, HTTP, Logger } from "./modules/lobby/lcore/LCoreExports";
import { LMsgCenter } from "./modules/lobby/LMsgCenter";
import { proto } from "./modules/lobby/protoHH/protoHH";
import { md5 } from "./modules/lobby/utility/md5";

const { ccclass, property } = cc._decorator;

interface ServerCfg {
    host: string;
    port: number;
    id: number;
}

/**
 * Helloworld stupid test
 */
@ccclass
export class Helloworld extends cc.Component {
    public eventTarget: cc.EventTarget;
    public loader: GResLoader;

    private msgCenter: LMsgCenter;
    private myUserID: number;
    private myPlayerID: number;
    private myCards: number[] = [];

    @property(cc.Node)
    private button: cc.Node = null;

    @property(cc.Node)
    private buttonA: cc.Node = null;
    @property(cc.Node)
    private buttonB: cc.Node = null;
    @property(cc.Node)
    private buttonC: cc.Node = null;
    @property(cc.Node)
    private buttonDisabnd: cc.Node = null;

    @property(cc.Node)
    private buttonDiscard: cc.Node = null;

    public returnFromGame(): void {
        // nothing
    }
    public switchToGame(args: GameModuleLaunchArgs, moduleName: string): void {
        //
    }

    public enterGame(roomInfo: object): void {
        //
    }

    public requetJoinRoom(roomNumber: string): void {
        //
    }

    protected start(): void {
        // 设置帧率
        cc.game.setFrameRate(29);
        cc.debug.setDisplayStats(true);
        (<any>cc.debug)._resetDebugSetting(cc.debug.DebugMode.INFO); // tslint:disable-line:no-any no-unsafe-any

        // 初始化fgui
        fgui.addLoadHandler();
        fgui.GRoot.create();

        this.loader = new GResLoaderImpl("lobby");
        this.eventTarget = new cc.EventTarget();

        Dialog.initDialogs(this.loader);

        //优先加载login资源，用于显示loading
        this.loader.loadResDir("lobby", (error) => {
            Logger.debug(`lobby load, error:${error}`);
            // if (error == null) {
            //     this.loadLobbyRes();
            // }
            // init logic
            // this.label.string = this.text;
            this.button.on("click", this.testHTTPLogin, this);
            this.buttonA.on("click", this.testCreateRoom, this);
            this.buttonB.on("click", this.testJoinGame, this);
            this.buttonC.on("click", this.testSendReady, this);

            this.buttonDisabnd.on("click", this.testDisband, this);
            this.buttonDiscard.on("click", this.testDiscard, this);

            this.buttonDiscard.active = false;
        });
    }

    protected onDestroy(): void {
        this.eventTarget.emit("destroy");
    }

    protected testHTTPLogin(): void {
        const req = {
            app: "casino",
            channel: "mac",
            openudid: "f5854e70d954a14fc5fae475121db4bd58af1f51",
            nickname: "abc",
            ticket: 0,
            sign: ""
        };

        req.ticket = Math.ceil(Date.now() / 1000);
        const cat = `xthh${req.openudid}${req.ticket}`;
        req.sign = md5(cat);

        const reqString = JSON.stringify(req);
        console.log(reqString);

        HTTP.hPost(
            this.eventTarget,
            "https://dfh5-develop.qianz.com/t9user/Login",
            (xhr: XMLHttpRequest) => {
                const err = HTTP.hError(xhr);
                if (err !== null) {
                    console.log(err);
                } else {
                    const reply = <{ servers: ServerCfg[]; player_id: number }>JSON.parse(xhr.responseText);
                    console.log(reply);
                    this.testFastLogin(reply.servers[0]).catch((reason) => {
                        console.log(reason);
                    });
                }
            },
            "text",
            reqString);
    }

    private async testFastLogin(serverCfg: ServerCfg): Promise<void> {
        console.log(serverCfg);

        if (this.msgCenter !== undefined) {
            return;
        }

        const uriComp = encodeURIComponent(`${serverCfg.host}:${serverCfg.port}`);
        const url = `wss://dfh5-develop.qianz.com/game/uuid/ws/play?web=1&target=${uriComp}`;
        console.log(url);
        this.msgCenter = new LMsgCenter(url, this);

        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_FAST_LOGIN_ACK, this.onFastLoginACK, this); // 快速登录服务器回复

        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onJoinGameAck, this); // 加入游戏
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK, this.onCreateRoomAck, this); // 创建房间

        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_READY, this.onTableReady, this); // 玩家准备
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_ENTRY, this.onTableEnter, this);  // 玩家进入桌子
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_LEAVE, this.onTableLeave, this);  // 玩家离开桌子
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_PAUSE, this.onTablePause, this);  // 桌子操作暂停（就是等待某人动作啥的）
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_UPDATE, this.onTableUpdate, this);  // 桌子更新
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_SCORE, this.onTableScore, this);  // 桌子结算
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_MANAGED, this.onTableManaged, this); // 桌子进入托管

        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_STARTPLAY, this.onStartPlay, this); // 发牌
        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_DRAWCARD, this.onOnDraw, this); // 抽牌
        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OUTCARD_ACK, this.onOnOutCardwAck, this); // 出牌服务器回复
        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP_ACK, this.onOnOpAck, this); // 玩家操作结果
        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_SCORE, this.onSCScore, this); // 积分状态

        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_DISBAND_ACK, this.onDisbandAck, this); // 积分状态
        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OUTCARD_ACK, this.onOutCardAck, this); // 打牌响应

        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_OP, this.onSCOP, this); // 服务器询问玩家操作

        await this.msgCenter.start();
    }

    private onFastLoginACK(msg: proto.casino.ProxyMessage): void {
        const fastLoginReply = proto.casino.packet_fast_login_ack.decode(msg.Data);
        console.log(fastLoginReply);

        this.myPlayerID = fastLoginReply.player_id;
        this.myUserID = fastLoginReply.user_id;
    }

    private testCreateRoom(): void {
        const req = {
            casino_id: 16,
            room_id: 2103,
            base: 1,
            round: 1,
            join: 0
        };

        const req2 = new proto.casino.packet_table_create_req(req);
        const buf = proto.casino.packet_table_create_req.encode(req2);
        this.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_CREATE_REQ);
    }

    private onCreateRoomAck(msg: proto.casino.ProxyMessage): void {
        console.log("onCreateRoomAck");
        const reply = proto.casino.packet_table_create_ack.decode(msg.Data);
        console.log(reply);
    }

    private testJoinGame(): void {
        // const table_id = Long.fromNumber(1);
        // const req :proto.casino.Ipacket_player_join_req= {
        //     player_id:91058906,
        //     request_id:1,
        // }

        const req2 = new proto.casino.packet_player_join_req({});
        const buf = proto.casino.packet_player_join_req.encode(req2);
        this.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_REQ);
    }

    private onJoinGameAck(msg: proto.casino.ProxyMessage): void {
        console.log("onJoinGameAck");
        const reply = proto.casino.packet_player_join_ack.decode(msg.Data);
        console.log(reply);
    }

    private testSendReady(): void {
        const req2 = new proto.casino.packet_table_ready({ idx: -1 });
        const buf = proto.casino.packet_table_ready.encode(req2);
        this.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_READY);
    }

    private testDisband(): void {
        const req2 = new proto.casino.packet_table_disband_req({ player_id: this.myPlayerID });
        const buf = proto.casino.packet_table_disband_req.encode(req2);
        this.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    private onDisbandAck(msg: proto.casino.ProxyMessage): void {
        console.log("onDisbandAck");
        const reply = proto.casino.packet_table_disband_ack.decode(msg.Data);
        console.log(reply);
    }

    private onTableReady(msg: proto.casino.ProxyMessage): void {
        console.log("onTableReady");
        const reply = proto.casino.packet_table_ready.decode(msg.Data);
        console.log(reply);
    }

    private onTableEnter(msg: proto.casino.ProxyMessage): void {
        console.log("onTableEnter");
        const reply = proto.casino.packet_table_entry.decode(msg.Data);
        console.log(reply);
    }

    private onTableLeave(msg: proto.casino.ProxyMessage): void {
        console.log("onTableLeave");
        const reply = proto.casino.packet_table_leave.decode(msg.Data);
        console.log(reply);
    }

    private onTableUpdate(msg: proto.casino.ProxyMessage): void {
        console.log("onTableUpdate");
        const reply = proto.casino.packet_table_update.decode(msg.Data);
        console.log(reply);
    }

    private onTableScore(msg: proto.casino.ProxyMessage): void {
        console.log("onTableScore");
        const reply = proto.casino.packet_table_score.decode(msg.Data);
        console.log(reply);
    }

    private onTableManaged(msg: proto.casino.ProxyMessage): void {
        console.log("onTableManaged");
        const reply = proto.casino.packet_table_managed.decode(msg.Data);
        console.log(reply);
    }

    private onTablePause(msg: proto.casino.ProxyMessage): void {
        console.log("onTablePause");
        const reply = proto.casino.packet_table_pause.decode(msg.Data);
        console.log(reply);
    }

    private onStartPlay(msg: proto.casino.ProxyMessage): void {
        console.log("onStartPlay");
        const reply = proto.casino_xtsj.packet_sc_start_play.decode(msg.Data);
        console.log(reply);

        // 保存自己的13张牌
        reply.cards.forEach((card) => {
            this.myCards.push(card);
        });
    }

    private onOnDraw(msg: proto.casino.ProxyMessage): void {
        console.log("onOnDraw");
        const reply = proto.casino_xtsj.packet_sc_drawcard.decode(msg.Data);
        console.log(reply);

        // 保存我的抽牌
        if (reply.player_id === this.myPlayerID) {
            this.myCards.push(reply.card);

            this.buttonDiscard.active = true;
        }
    }

    private onOnOutCardwAck(msg: proto.casino.ProxyMessage): void {
        console.log("onOnDrawAck");
        const reply = proto.casino_xtsj.packet_sc_outcard_ack.decode(msg.Data);
        console.log(reply);
    }

    private onOnOpAck(msg: proto.casino.ProxyMessage): void {
        console.log("onOnOpAck");
        const reply = proto.casino_xtsj.packet_sc_op_ack.decode(msg.Data);
        console.log(reply);
    }

    private onSCScore(msg: proto.casino.ProxyMessage): void {
        console.log("onSCScore");
        const reply = proto.casino_xtsj.packet_sc_score.decode(msg.Data);
        console.log(reply);
    }

    private onSCOP(msg: proto.casino.ProxyMessage): void {
        console.log("onSCOP");
        const reply = proto.casino_xtsj.packet_sc_op.decode(msg.Data);
        console.log(reply);
    }

    private testDiscard(): void {
        if (this.myCards.length < 1) {
            return;
        }

        const outCard = this.myCards.shift();

        // packet_cs_outcard_req
        const req2 = new proto.casino_xtsj.packet_cs_outcard_req({ player_id: this.myPlayerID, card: outCard });
        const buf = proto.casino_xtsj.packet_cs_outcard_req.encode(req2);
        this.msgCenter.sendGameMsg(buf, proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_CS_OUTCARD_REQ);

        this.buttonDiscard.active = false;
    }

    private onOutCardAck(msg: proto.casino.ProxyMessage): void {
        console.log("onOutCardAck");
        const reply = proto.casino_xtsj.packet_sc_outcard_ack.decode(msg.Data);
        console.log(reply);
    }
}
