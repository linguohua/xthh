import { Logger, MsgQueue, MsgType, WS } from "./lcore/LCoreExports";
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
                Logger.trace(`Wait 3 seconds to retry, connectErrorCount:${this.connectErrorCount}`);

                await this.waitSecond();
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
        this.ws.ww.send(ab);

        // Logger.debug("sendGameMsg, length:", ab.byteLength)
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

        Logger.trace("LMsgCenter connect success");

        // 发送fastLogin结果
        this.doFastLogin();

        await this.pumpMsg();
    }

    private async waitSecond(): Promise<void> {
        return new Promise<void>((resolve, _) => {
            this.component.scheduleOnce(
                () => {
                    resolve();
                },
                3);
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
                Logger.debug("Websocket close, retury connect")
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

        this.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_PING, this.onServerPing, this);

        this.eventTarget.emit("onFastLoginComplete", fastLoginReply);
    }

    private onServerPing(msg: proto.casino.ProxyMessage): void {
        const pingPacket = proto.casino.packet_ping.decode(msg.Data);
        const pongProp = {
            now: pingPacket.now
        };

        const buf = proto.casino.packet_pong.encode(new proto.casino.packet_pong(pongProp));
        this.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_PONG);
    }
}
