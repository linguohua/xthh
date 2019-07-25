import * as nimSdk from './NIM_Web_NIM'
import { Logger } from '../../lcore/LCoreExports';
// import * as FriendCard from './../pages/FriendCard';
/**
 * 网易云信SDK
 */
export class NimSDK {
    private appKey: string;
    private account: string;
    private token: string;

    private nimSDK: any;
    public constructor(appKey: string, account: string, token: string) {
        this.appKey = appKey;
        this.account = account;
        this.token = token;
    }

    public initNimSDK(): void {
        if (this.appKey === "" || this.account === "" || this.token === "") {
            Logger.error("initNimSDK");
            return;
        }

        this.nimSDK = nimSdk.NIM.getInstance({
            appKey: this.appKey,
            account: this.account,
            token: this.token,
            onconnect: this.onConnect,
            onwillreconnect: this.onWillReconnect,
            ondisconnect: this.onDisconnect,
            onerror: this.onError
        });
    }

    private onConnect(): void {
        Logger.debug("onConnect");
    }

    private onWillReconnect(): void {
        Logger.debug("onWillReconnect");
    }

    private onDisconnect(): void {
        Logger.debug("onWillReconnect");
    }

    private onError(): void {

    }

}
