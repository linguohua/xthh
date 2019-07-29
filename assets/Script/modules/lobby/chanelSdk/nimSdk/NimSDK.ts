import { Logger } from '../../lcore/LCoreExports';
// tslint:disable-next-line:no-require-imports
import NIMWeb = require('./NIMWeb');
// tslint:disable-next-line:no-require-imports
import NIMWeixin = require('./NIMWeixin');
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
    public eventTarge: cc.EventTarget;
    private appKey: string;
    private account: string;
    private token: string;

    private teamID: string;
    // tslint:disable-next-line:no-any
    private nimSDK: any;
    // 用来订阅消息
    public constructor(appKey: string, account: string, token: string) {
        this.appKey = appKey;
        this.account = account;
        this.token = token;

        this.eventTarge = new cc.EventTarget();
    }

    public initNimSDK(): void {
        Logger.debug("initNimSDK");
        if (this.appKey === "" || this.account === "" || this.token === "") {
            Logger.error(`initNimSDK failed, appKey:${this.appKey}, imaccid:${this.account}, token:${this.token};
            }`);

            return;
        }

        const onConnect = () => {
            Logger.debug("NimSDK, onConnect");
            // this.createTeam();
        };

        const onCreateTeam = () => {
            Logger.debug("onCreateTeam");
        };

        const options = {
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
        };

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 微信版本sdk
            this.nimSDK = NIMWeixin.getInstance(options);
        } else {
            // web版本sdk
            this.nimSDK = NIMWeb.getInstance(options);
        }
    }

    public disconnect(): void {
        this.nimSDK.disconnect();
    }

    public createTeam(imaccids: string[]): void {
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
            this.sendTeamMsg("haha");
        };
        Logger.debug("my account:", this.account);

        this.nimSDK.createTeam({
            type: 'normal',
            name: '普通群',
            avatar: 'avatar',
            accounts: imaccids,
            ps: '我建了一个普通群',
            done: createTeamDone
        });

        Logger.debug("this.teamID:", this.teamID);

    }
    // 先测试发文本，然后再测试发语音
    public sendTeamMsg(msgContent: string): void {
        if (this.nimSDK === null || this.nimSDK === undefined) {
            Logger.error("this.nimSDK === null || this.nimSDK === undefined");

            return;
        }

        const sendMsgDone = () => {
            Logger.debug("sendMsgDone");
        };

        const msg = this.nimSDK.sendText({
            scene: 'team',
            to: this.teamID,
            text: msgContent,
            done: sendMsgDone
        });

        Logger.debug("msg:", msg);
    }

    // tslint:disable-next-line:no-reserved-keywords
    public sendTeamAudio(wxFilePath: string): void {
        const sendMsgDone = () => {
            Logger.debug("sendMsgDone");
        };

        this.nimSDK.sendFile({
            scene: 'scene',
            to: this.teamID,
            type: "audio",
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
        this.eventTarge.emit("onNimMsg", msg);
    }

    protected onCreateTeam(team: { team: Team }): void {
        Logger.debug("onCreateTeam:", team);
    }
    protected onTeamMembers(obj: {}): void {
        Logger.debug("onTeamMembers:", obj);
    }
}
