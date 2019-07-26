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

interface Team {
    teamId: string;
    // tslint:disable-next-line:no-reserved-keywords
    type: string;
    name: string;
    avatar: string;
    intro: string;
    announcement: string;
    joinMode: string;
    beInviteMode: string;
    inviteMode: string;
    updateTeamMode: string;
    updateCustomMode: string;

    owner: string;
    level: number;

    memberNum: number;

    memberUpdateTime: number;

    createTime: number;

    updateTime: number;

    custom: string;
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
        Logger.debug("initNimSDK");
        if (this.appKey === "" || this.account === "" || this.token === "") {
            Logger.error(`initNimSDK failed, appKey:${this.appKey}, imaccid:${this.account}, token:${this.token};
            }`);

            return;
        }

        // tslint:disable-next-line:no-require-imports
        let nimSdk = require("./NIM_Web_NIM_v6.6.6.js");
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // tslint:disable-next-line:no-require-imports
            nimSdk = require("./NIM_Web_NIM_weixin_v6.6.6");
        }

        const onConnect = () => {
            Logger.debug("NimSDK, onConnect");
            // this.createTeam();
        };

        const onCreateTeam = () => {
            Logger.debug("onCreateTeam");
        };

        Logger.debug("nimSdk:", nimSdk);
        this.nimSDK = nimSdk.getInstance({
            appKey: this.appKey,
            account: this.account,
            token: this.token,
            transports: ['websocket'],
            onconnect: onConnect,
            onwillreconnect: this.onWillReconnect,
            ondisconnect: this.onDisconnect,
            onerror: this.onError,
            onsynccreateteam: onCreateTeam,
            onteammembers: this.onTeamMembers,
            onmsg: this.onMsg
        });
    }

    public disconnect(): void {
        this.nimSDK.disconnect();
    }

    public createTeam(): void {
        if (this.nimSDK === undefined || this.nimSDK === null) {
            Logger.error("createTeam failed, this.nimSDK === undefined || this.nimSDK === null");

            return;
        }

        // tslint:disable-next-line:no-any
        const createTeamDone = (error: any, obj: { team: Team }) => {
            Logger.debug("createTeamDone");
            if (error !== undefined && error !== null) {
                Logger.debug("createTeamDone, error:", error);

                return;
            }

            Logger.debug("createTeamDone:", obj);
            this.teamID = obj.team.teamId;
            this.sendTeamMsg("haha", obj.team.teamId);
        };
        Logger.debug("my account:", this.account);
        // 创建普通群
        // this.teamID = this.nimSDK.createTeam({
        //     type: 'normal',
        //     name: '普通群',
        //     avatar: 'avatar',
        //     accounts: [this.account],
        //     ps: '我建了一个普通群',
        //     done: createTeamDone
        // });

        this.nimSDK.createTeam({
            type: 'normal',
            name: '普通群',
            avatar: 'avatar',
            accounts: ['1'],
            ps: '我建了一个普通群',
            done: createTeamDone
        });

        Logger.debug("this.teamID:", this.teamID);

    }
    // 先测试发文本，然后再测试发语音
    public sendTeamMsg(msgContent: string, to: string): void {
        if (this.nimSDK === null || this.nimSDK === undefined) {
            Logger.error("this.nimSDK === null || this.nimSDK === undefined");

            return;
        }

        if (to === "") {
            Logger.error(`params msgContent:${msgContent}, to:${to}, require to`);

            return;
        }

        const sendMsgDone = () => {
            Logger.debug("sendMsgDone");
        };

        Logger.debug("sending msg to ", to);

        const msg = this.nimSDK.sendText({
            scene: 'team',
            to: to,
            text: msgContent,
            done: sendMsgDone
        });

        Logger.debug("msg:", msg);
    }

    // tslint:disable-next-line:no-reserved-keywords
    public sendFile(scene: string, type: string, to: string, wxFilePath: string): void {
        const sendMsgDone = () => {
            Logger.debug("sendMsgDone");
        };

        this.nimSDK.sendFile({
            scene: 'scene',
            to: to,
            type: type,
            wxFilePath: wxFilePath,

            uploadprogress: (obj: { total: number; loaded: number; percentage: number; percentageText: string }) => {
                Logger.debug(`File size: ${obj.total} bytes`);
                Logger.debug(`upload size: ${obj.loaded} bytes`);
                Logger.debug(`upload percentage: ${obj.percentage}`);
                Logger.debug(`upload percentageText: ${obj.percentageText}`);
            },

            uploaddone: (error: {}, file: {}) => {
                if (error !== null) {
                    Logger.debug("upload failed:", error);
                } else {
                    Logger.debug("upload success:", file);
                }
            },

            beforesend: (msg: { idClient: {} }) => {
                Logger.debug(`sending msg:`, msg.idClient);
            },

            done: sendMsgDone
        });
    }

    protected onConnect(): void {
        Logger.debug("NimSDK onConnect");

        // this.createTeam();
        Logger.debug("this:", this);
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
        Logger.debug("NimSDK.onMsg:", msg);
    }

    protected onCreateTeam(team: { team: Team }): void {
        Logger.debug("onCreateTeam:", team);
        this.sendTeamMsg("this is test msg", this.teamID);
    }
    protected onTeamMembers(obj: {}): void {
        Logger.debug("onTeamMembers:", obj);
    }
}
