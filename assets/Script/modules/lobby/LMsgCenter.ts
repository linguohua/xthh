import { Dialog, Logger, MsgQueue, MsgType, WS } from "./lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
// import long = require("./protobufjs/long");
import { proto } from "./protoHH/protoHH";

export type GameMsgHandler = (msg: proto.casino.ProxyMessage) => void;
interface GameMsgHandlerHolder {
    target: object;
    handler: GameMsgHandler;
}

/**
 * LMsgCenter 大厅消息中心
 */

export class LMsgCenter {
    public eventTarget: cc.EventTarget;

    private ws: WS;
    private mq: MsgQueue;
    private retry: boolean = false;
    private connectErrorCount: number = 0;

    private url: string;

    private component: cc.Component;

    private fastLoginReq: proto.casino.packet_fast_login_req;

    private gmsgHandlers: { [key: number]: GameMsgHandlerHolder } = {};

    private serverTime: Long;
    private localTimeDiff: number = 0;
    // private lobbyModule: LobbyModuleInterface;

    public constructor(url: string, component: cc.Component, fastLoginReq: proto.casino.packet_fast_login_req) {
        this.url = url;
        this.component = component;
        this.fastLoginReq = fastLoginReq;
        this.eventTarget = new cc.EventTarget();
    }

    public async start(): Promise<void> {
        Logger.debug("LMsgCenter.start");

        let loop = true;
        while (loop) {
            await this.connectServer();

            Logger.debug("MsgCenter, retry:", this.retry);

            this.connectErrorCount++;

            if (this.ws !== null) {
                const ws = this.ws;
                this.ws = null;
                ws.ww.close();
            }

            if (!this.retry) {
                loop = false;
            } else {
                Logger.trace(`Wait ${this.connectErrorCount} seconds to retry`);

                Dialog.showReconnectDialog();
                await this.waitSecond(this.connectErrorCount);
            }
        }
    }

    public destory(): void {
        this.eventTarget.emit("destroy");
    }

    public sendGameMsg(buf: ByteBuffer, code: number): void {
        const pmp = {
            Ops: (code << 8),
            Data: buf
        };

        const pm = new proto.casino.ProxyMessage(pmp);
        const buf2 = proto.casino.ProxyMessage.encode(pm);
        const ab = buf2.toArrayBuffer();

        if (this.ws !== null) {
            this.ws.ww.send(ab);
        } else {
            Logger.error("this.ws === null");
        }
    }

    public setGameMsgHandler(code: number, h: GameMsgHandler, target: object): void {
        let u = this.gmsgHandlers[code];
        if (u === undefined) {
            u = {
                target: target,
                handler: h
            };
        } else {
            u.handler = h;
            u.target = target;
        }

        this.gmsgHandlers[code] = u;
    }

    public removeGameMsgHandler(code: number): void {
        const u = this.gmsgHandlers[code];
        if (u !== undefined) {
            this.gmsgHandlers[code] = undefined;
        }
    }

    public getServerTime(): number {
        return Math.ceil(Date.now() / 1000) - this.localTimeDiff;
    }

    public isWebSocketClose(): boolean {
        return this.ws === null;
    }

    private async connectServer(): Promise<void> {
        const mc = proto.casino.ProxyMessageCode;
        // host 结构
        const host = {
            comp: this.component,
            destroyListener: this.eventTarget,
            startPing: false,
            pingFrequency: 3, // 3秒
            pingPacketProvider: (pingData: ByteBuffer) => {
                const msg = {
                    Ops: mc.OPPing,
                    Data: pingData
                };

                return proto.casino.ProxyMessage.encode(msg).toArrayBuffer();
            }
        };
        // ping pong 结构
        const pp = {
            pingCmd: mc.OPPing,
            pongCmd: mc.OPPong,
            decode: proto.casino.ProxyMessage.decode,
            encode: proto.casino.ProxyMessage.encode
        };

        const priorityMap: { [key: number]: number } = {};
        const mq = new MsgQueue(priorityMap);
        const ws = new WS(this.url, mq, host, pp);
        this.mq = mq;
        this.ws = ws;

        const rt = await this.waitConnect();
        if (rt !== 0) {
            this.retry = true;

            return;
        }

        // 清零记数器
        this.connectErrorCount = 0;
        Logger.trace("LMsgCenter connect success");

        // 发送fastLogin结果
        this.doFastLogin();

        await this.pumpMsg();
    }

    private async waitSecond(seconds: number): Promise<void> {
        return new Promise<void>((resolve, _) => {
            this.component.scheduleOnce(
                () => {
                    resolve();
                },
                seconds);
        });
    }

    private async waitConnect(): Promise<number> {
        const msg = await this.mq.waitMsg();

        Logger.debug("Game.waitConnect, mq.waitMsg return:", msg);

        if (msg.mt === MsgType.wsOpen) {
            return 0;
        }

        return -1;
    }

    private async pumpMsg(): Promise<void> {
        let loop = true;
        while (loop) {
            const mq = this.mq;
            const msg = await mq.waitMsg();
            if (msg.mt === MsgType.quit) {
                break;
            }

            if (msg.mt === MsgType.wsData) {
                this.dispatchWeboscketMessage(<proto.casino.ProxyMessage>msg.data);
            } else if (msg.mt === MsgType.wsClosed || msg.mt === MsgType.wsError) {
                Logger.debug("Websocket close, retury connect");
                this.retry = true;
                loop = false;
            }
        }
    }

    private dispatchWeboscketMessage(msg: proto.casino.ProxyMessage): void {
        const ops = msg.Ops;
        if (ops < 256) {
            Logger.trace("msgCenter.dispatchWeboscketMessage get proxy control msg:", ops);

            return;
        }

        const opsGame = ops >> 8;
        // Logger.trace("msgCenter.dispatchWeboscketMessage Ops:", opsGame);
        const u = this.gmsgHandlers[opsGame];
        if (u === undefined) {
            Logger.trace("msgCenter.dispatchWeboscketMessage unknow gameOps:", opsGame);

            return;
        }

        msg.Ops = opsGame;
        u.handler.call(u.target, msg);
    }

    private doFastLogin(): void {
        if (this.fastLoginReq === undefined) {
            Logger.error("doFastLogin, this.fastLoginReq === undefined");

            return;
        }

        // const req2 = new proto.casino.packet_fast_login_req(req);
        const buf = proto.casino.packet_fast_login_req.encode(this.fastLoginReq);
        this.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_FAST_LOGIN_REQ);

        this.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_FAST_LOGIN_ACK, this.onFastLoginACK, this);
    }
    private onFastLoginACK(msg: proto.casino.ProxyMessage): void {
        const fastLoginReply = proto.casino.packet_fast_login_ack.decode(msg.Data);
        console.log(fastLoginReply);

        this.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PLAYER_JOIN_ACK, this.onJoinGameAck, this);
        this.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PING, this.onServerPing, this);

        this.eventTarget.emit("onFastLoginComplete", fastLoginReply);

        Dialog.hideWaiting();
        Dialog.hideReconnectDialog();
    }

    private onJoinGameAck(msg: proto.casino.ProxyMessage): void {
        const playerJoinAck = proto.casino.packet_player_join_ack.decode(msg.Data);

        this.serverTime = playerJoinAck.now;
        this.localTimeDiff = Math.ceil((Date.now() / 1000)) - this.serverTime.toNumber();

        this.eventTarget.emit("onJoinGameAck", playerJoinAck);
    }

    private onServerPing(msg: proto.casino.ProxyMessage): void {
        // Logger.debug("onServerPing:", Math.ceil(Date.now() / 1000));
        const pingPacket = proto.casino.packet_ping.decode(msg.Data);
        this.serverTime = pingPacket.now;

        this.localTimeDiff = Math.ceil(Date.now() / 1000) - this.serverTime.toNumber();

        const pongProp = {
            now: pingPacket.now
        };

        const buf = proto.casino.packet_pong.encode(new proto.casino.packet_pong(pongProp));
        this.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PONG);
    }

    // private onServerPong(msg: proto.casino.ProxyMessage): void {
    //     Logger.debug("onServerPong");
    //     const pongPacket = proto.casino.packet_pong.decode(msg.Data);

    //     this.serverTime = pongPacket.now;
    //     Logger.debug("this.serverTime:", this.serverTime);

    //     this.localTimeDiff = (Date.now() / 1000) - this.serverTime.toNumber();
    // }

    // private sendPong(): void {
    //     Logger.debug("sendPong:", Date.now());
    //     const nowTime: number = Math.ceil(Date.now() / 1000);
    //     const pongProp = {
    //         now: new long(nowTime)
    //     };

    //     const buf = proto.casino.packet_pong.encode(new proto.casino.packet_pong(pongProp));
    //     this.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PONG);
    // }
}
