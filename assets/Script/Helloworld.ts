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

    @property(cc.Node)
    private button: cc.Node = null;

    @property(cc.Node)
    private buttonA: cc.Node = null;
    @property(cc.Node)
    private buttonB: cc.Node = null;
    @property(cc.Node)
    private buttonC: cc.Node = null;

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
            "http://localhost:3001/t9user/Login",
            (xhr: XMLHttpRequest) => {
                const err = HTTP.hError(xhr);
                if (err !== null) {
                    console.log(err);
                } else {
                    const reply = <{servers: ServerCfg[]}>JSON.parse(xhr.responseText);
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
        const url = `ws://localhost:3001/game/uuid/ws/play?web=1&target=${uriComp}`;
        console.log(url);
        this.msgCenter = new LMsgCenter(url, this, this);

        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_CREATE_ACK, this.onCreateRoomAck, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onJoinGameAck, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_READY, this.onTableReady, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_ENTRY, this.onTableEnter, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_LEAVE, this.onTableLeave, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_PAUSE, this.onTablePause, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_UPDATE, this.onTableUpdate, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_SCORE, this.onTableScore, this);
        this.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_MANAGED, this.onTableManaged, this);
        this.msgCenter.setGameMsgHandler(proto.casino_xtsj.eXTSJ_MSG_TYPE.XTSJ_MSG_SC_STARTPLAY, this.onStartPlay, this); // 发牌

        await this.msgCenter.start();
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

    private onCreateRoomAck(msg: ByteBuffer): void {
        console.log("onCreateRoomAck");
        const reply = proto.casino.packet_table_create_ack.decode(msg);
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

    private onJoinGameAck(msg: ByteBuffer): void {
        console.log("onJoinGameAck");
        const reply = proto.casino.packet_player_join_ack.decode(msg);
        console.log(reply);
    }

    private testSendReady(): void {
        const req2 = new proto.casino.packet_table_ready({ idx: -1 });
        const buf = proto.casino.packet_table_ready.encode(req2);
        this.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_READY);
    }

    private onTableReady(msg: ByteBuffer): void {
        console.log("onTableReady");
        const reply = proto.casino.packet_table_ready.decode(msg);
        console.log(reply);
    }

    private onTableEnter(msg: ByteBuffer): void {
        console.log("onTableEnter");
        const reply = proto.casino.packet_table_entry.decode(msg);
        console.log(reply);
    }

    private onTableLeave(msg: ByteBuffer): void {
        console.log("onTableLeave");
        const reply = proto.casino.packet_table_leave.decode(msg);
        console.log(reply);
    }

    private onTableUpdate(msg: ByteBuffer): void {
        console.log("onTableUpdate");
        const reply = proto.casino.packet_table_update.decode(msg);
        console.log(reply);
    }

    private onTableScore(msg: ByteBuffer): void {
        console.log("onTableScore");
        const reply = proto.casino.packet_table_score.decode(msg);
        console.log(reply);
    }

    private onTableManaged(msg: ByteBuffer): void {
        console.log("onTableManaged");
        const reply = proto.casino.packet_table_managed.decode(msg);
        console.log(reply);
    }

    private onTablePause(msg: ByteBuffer): void {
        console.log("onTablePause");
        const reply = proto.casino.packet_table_pause.decode(msg);
        console.log(reply);
    }

    private onStartPlay(msg: ByteBuffer): void {
        console.log("onStartPlay");
        const reply = proto.casino_xtsj.packet_sc_start_play.decode(msg);
        console.log(reply);
    }
}
