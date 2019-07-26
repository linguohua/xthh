import { Logger } from '../../lcore/LCoreExports';
// import NIM_Web_NIMJs from './NIM_Web_NIM.js';
// import * as FriendCard from './../pages/FriendCard';
/**
 * 网易云信SDK
 */

interface Message {
    scene: string;
    // tslint:disable-next-line:no-reserved-keywords
    type: number;
    msg: object;
}

export class NimSDK {
    private appKey: string;
    private account: string;
    private token: string;

    private teamID: string;
    // tslint:disable-next-line:no-any
    private nimSDK: any;
    public constructor(appKey: string, account: string, token: string) {
        this.appKey = appKey;
        this.account = account;
        this.token = token;
    }

    public initNimSDK(): void {
        if (this.appKey === "" || this.account === "" || this.token === "") {
            Logger.error(`initNimSDK failed, appKey:${this.appKey}, imaccid:${this.account}, token:${this.token};
            }`);

            return;
        }

        // tslint:disable-next-line:no-require-imports
        const nimSdk = require("./NIM_Web_NIM.js");
        Logger.debug("nimSdk:", nimSdk);
        this.nimSDK = nimSdk.getInstance({
            appKey: this.appKey,
            account: this.account,
            token: this.token,
            transports: ['websocket'],
            onconnect: this.onConnect,
            onwillreconnect: this.onWillReconnect,
            ondisconnect: this.onDisconnect,
            onerror: this.onError
        });
    }

    public createTeam(): void {
        if (this.nimSDK === undefined || this.nimSDK === null) {
            Logger.error("createTeam failed, this.nimSDK === undefined || this.nimSDK === null");
        }
    }
    // 先测试发文本，然后再测试发语音
    public sendMsg(msg: string, to: string): void {

    }

    protected onConnect(): void {
        Logger.debug("NimSDK onConnect");
    }

    protected onWillReconnect(): void {
        Logger.debug("NimSDK onWillReconnect");
    }

    protected onDisconnect(): void {
        Logger.debug("NimSDK onWillReconnect");
    }

    protected onError(): void {
        Logger.debug("NimSDK onError");
    }

    protected onMsg(msg: Message): void {
        Logger.debug("msg:", msg);
    }
}
