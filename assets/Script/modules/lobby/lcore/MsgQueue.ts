import { Logger } from "./Logger";
import { Deferred } from "./PromiseDeferred";

/**
 * 放于消息队列内的protobuf 消息基本结构约定
 */
export interface MessageView {
    Ops: number;
    Data: ByteBuffer;
}

/**
 * 消息
 */
export class Message {
    public readonly mt: MsgType;
    public readonly data: string | Blob | MessageView;

    public constructor(mt: MsgType, data?: string | Blob | MessageView) {
        this.mt = mt;
        this.data = data;
    }
}

/**
 * 消息类型
 */
export enum MsgType {
    wsOpen = 1, wsClosed = 2, wsError = 3, wsData = 4, quit = 5, replay = 6
}

/**
 * 消息队列
 */
export class MsgQueue {
    private messages: Message[] = [];

    private priority: number = 0;

    private blockedMessages: Message[] = [];

    private waiting: Deferred<Message> = null;

    private readonly priorityMap: { [key: number]: number };

    // 大厅的消息队列
    private isLobby: boolean = false;

    public constructor(priorityMap: { [key: number]: number }, isLobby?: boolean) {
        this.priorityMap = priorityMap;

        if (isLobby !== undefined) {
            this.isLobby = isLobby;
        }
    }

    public async waitMsg(): Promise<Message> {
        if (this.waiting !== null) {
            throw new Error("MsgQueue.waitMsg failed:already wait");
        }

        if (this.messages.length > 0) {
            return this.messages.shift();
        }

        this.waiting = new Deferred<Message>();

        return this.waiting.promise;
    }

    public pushWebsocketBinaryEvent(gmsg: MessageView): void {
        // Logger.debug("pushWebsocketBinaryEvent:", gmsg);
        const msg = new Message(MsgType.wsData, gmsg);
        this.pushMessage(msg);
    }

    public pushQuit(): void {
        const msg = new Message(MsgType.quit);
        this.pushMessage(msg);
    }

    public blockNormal(): void {
        this.priority = 1;
        Logger.debug("MsgQueue.blockNormal");
        if (this.messages.length > 0) {
            Logger.debug("MsgQueue:blockNormal, current msg count:", this.messages.length);
            const unblockedMsgs: Message[] = [];
            this.messages.forEach((msg) => {
                let isBlocked = true;
                if (msg.mt === MsgType.wsData) {
                    const ops = (<MessageView>msg.data).Ops;
                    const p = this.priorityMap[ops];
                    if (p !== undefined && p >= this.priority) {
                        isBlocked = false;
                    }
                } else if (this.isLobby) {
                    isBlocked = false;
                }

                if (isBlocked) {
                    this.blockedMessages.push(msg);
                } else {
                    unblockedMsgs.push(msg);
                }
            });

            this.messages = unblockedMsgs;
            Logger.debug("MsgQueue:blockNormal, after migrate, msg count:", this.messages.length);
        }
    }

    public unblockNormal(): void {
        this.priority = 0;

        if (this.blockedMessages.length > 0) {
            this.blockedMessages.forEach((msg) => {
                this.messages.push(msg);
            });

            this.blockedMessages = [];
            this.wakeupCoroutine();
        }
    }

    public pushMessage(msg: Message): void {
        let isBlocked = false;
        if (this.priority > 0) {
            isBlocked = true;

            if (msg.mt === MsgType.wsData) {
                const ops = (<MessageView>msg.data).Ops;
                const p = this.priorityMap[ops];
                if (p !== undefined && p >= this.priority) {
                    isBlocked = false;
                }
            } else if (this.isLobby) {
                // 大厅的weboskcet close, error 不阻塞
                isBlocked = false;
            }
        }

        if (!isBlocked) {
            this.messages.push(msg);
            this.wakeupCoroutine();
        } else {
            this.blockedMessages.push(msg);
        }
    }

    protected wakeupCoroutine(): void {
        if (this.waiting != null) {
            const promiseDefferred = this.waiting;
            this.waiting = null;

            promiseDefferred.resolve(this.messages.shift());
        }
    }
}
