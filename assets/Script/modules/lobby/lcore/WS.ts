import { Logger } from "./Logger";
import { Message, MessageView, MsgQueue, MsgType } from "./MsgQueue";
import { WebsocketHost, WebsocketWrapper } from "./WebsocketWrapper";

/**
 * ping pong
 */
export interface PingPong {
    // ping 命令字
    pingCmd: number;
    // pong 命令字
    pongCmd: number;
    // 解码函数，返回一个MessageView等价的结构体
    decode: Function;
    // 编码函数，返回一个byte buffer
    encode: Function;
}

/**
 * Websocket 再封装一层，主要是处理ping，pong以及浏览器websocket返回的blob转换为array buffer
 */
export class WS {
    public readonly mq: MsgQueue;
    public readonly ww: WebsocketWrapper;

    public readonly comp: cc.Component;

    private events: Message[] = [];
    private rolling: boolean = false;
    private pp: PingPong;
    private isBlobDataType: boolean;

    public constructor(url: string, mq: MsgQueue, host: WebsocketHost, pp: PingPong) {
        this.mq = mq;
        this.comp = host.comp;
        this.pp = pp;

        this.ww = new WebsocketWrapper(host, url);
        this.ww.onEnd = () => {
            this.events.push(new Message(MsgType.wsClosed));
            this.roll();
        };

        this.ww.onMessage = (ev: MessageEvent) => {
            const blob = <Blob>ev.data;
            this.events.push(new Message(MsgType.wsData, blob));

            this.roll();
        };

        this.ww.onOpen = () => {
            this.events.push(new Message(MsgType.wsOpen));
            this.roll();
        };
    }

    /**
     * 由于需要异步转换为array buffer，因此需要阻塞其他事件，确保有序
     * 例如，收到服务器的最后一个数据包，然后立即收到关闭事件，由于数据包需要异步转换
     * 当转换还未完成时就去处理关闭事件，这是不对的，应该先处理最后一个数据包（例如显示信息框），
     * 然后再处理关闭事件
     */
    private roll(): void {
        if (this.rolling) {
            return;
        }

        if (this.events.length < 1) {
            return;
        }

        const nextRoll = () => {
            this.rolling = false;
            this.roll();
        };

        this.rolling = true;
        const mx = this.events.shift();
        if (mx.mt === MsgType.wsData) {
            const blob = mx.data;

            const fn = (ar: ArrayBuffer) => {
                const gmsg = <MessageView>this.pp.decode(new Uint8Array(ar));
                if (gmsg.Ops === this.pp.pingCmd) {
                    // ping
                    const msgEcho = {
                        Ops: this.pp.pongCmd,
                        Data: gmsg.Data
                    };
                    const bufEcho = (<ByteBuffer>this.pp.encode(msgEcho)).toArrayBuffer();
                    this.ww.onPing(bufEcho);
                } else if (gmsg.Ops === this.pp.pongCmd) {
                    // pong
                    this.ww.onPong(gmsg.Data.toArrayBuffer());
                } else {
                    this.mq.pushWebsocketBinaryEvent(gmsg);
                }
            };

            if (this.isBlobDataType === undefined) {
                if (blob instanceof ArrayBuffer) {
                    this.isBlobDataType = false;
                } else if (blob instanceof Blob) {
                    this.isBlobDataType = true;
                } else {
                    Logger.error("WS unknown received data type:", typeof blob);
                }
            }

            if (this.isBlobDataType) {
                // 由于需要异步转换为array buffer，因此需要阻塞其他事件，确保有序
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    try {
                        const arrayBuffer = <ArrayBuffer>fileReader.result;

                        fn(arrayBuffer);
                    } catch (e) {
                        Logger.error(e);
                    }

                    this.comp.scheduleOnce(nextRoll);
                };

                fileReader.readAsArrayBuffer(<Blob>blob);
            } else {
                try {
                    fn(<ArrayBuffer><any>blob); // tslint:disable-line:no-any
                } catch (e) {
                    Logger.error(e);
                }

                this.comp.scheduleOnce(nextRoll);
            }
        } else {
            this.mq.pushMessage(mx);
            this.comp.scheduleOnce(nextRoll);
        }
    }
}
