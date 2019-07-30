import { Logger } from '../../lcore/LCoreExports';
// tslint:disable-next-line:no-require-imports
import NIMWeb = require('./NIMWeb');
// tslint:disable-next-line:no-require-imports
import NIMWeixin = require('./NIMWeixin');
/**
 * 网易云信SDK
 */
export interface NIMFile {
    name: string;
    size: number;
    md5: number;
    url: string;
    ext: string;
    dur: number;
}
export interface NIMMessage {
    scene: string;
    // tslint:disable-next-line:no-reserved-keywords
    from: string;
    fromNick: string;
    to: string;
    time: number;
    // tslint:disable-next-line:no-reserved-keywords
    type: number;
    msg: object;
    target: string;

    file: NIMFile;

    // scene: 消息场景
    // from: 消息发送方, 帐号或群id
    // fromNick: 消息发送方的昵称
    // fromClientType: 发送方的设备类型
    // fromDeviceId: 发送端设备id
    // to: 消息接收方, 帐号或群id
    // time: 时间戳
    // type: 消息类型
    // sessionId: 消息所属的会话对象的ID
    // target: 聊天对象, 账号或者群id
    // flow: 消息的流向
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
    public eventTarget: cc.EventTarget;
    private appKey: string;
    private account: string;
    private token: string;

    // tslint:disable-next-line:no-any
    private nimSDK: any;

    // private teams: Team[] = [];

    private myTeam: Team = null;
    // 用来订阅消息
    public constructor(appKey: string, account: string, token: string) {
        this.appKey = appKey;
        this.account = account;
        this.token = token;

        this.eventTarget = new cc.EventTarget();
    }

    public initNimSDK(): void {
        Logger.debug("initNimSDK");
        if (this.appKey === "" || this.account === "" || this.token === "") {
            Logger.error(`initNimSDK failed, appKey:${this.appKey}, imaccid:${this.account}, token:${this.token};
            }`);

            return;
        }

        const onConnect = () => {
            this.onConnect();
        };

        const onWillReconnect = (obj: {}) => {
            this.onWillReconnect(obj);
        };

        const onDisconnect = (res: {}) => {
            this.onDisconnect(res);
        };

        const onError = () => {
            this.onError();
        };

        const onCreateTeam = (team: { team: Team }) => {
            this.onCreateTeam(team);
        };

        const onTeamMembers = (obj: { teamId: string; members: [] }) => {
            this.onTeamMembers(obj);
        };

        const onTeams = (res: Team[]) => {
            this.onTeams(res);
        };

        const onMsg = (msg: NIMMessage) => {
            this.onMsg(msg);
        };

        const options = {
            appKey: this.appKey,
            account: this.account,
            token: this.token,
            transports: ['websocket'],
            onconnect: onConnect,
            onwillreconnect: onWillReconnect,
            ondisconnect: onDisconnect,
            onerror: onError,
            onsynccreateteam: onCreateTeam,
            onteammembers: onTeamMembers,
            onteams: onTeams,
            onmsg: onMsg
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

    public createTeam(imaccids: string[], roomNumber: string): void {
        if (this.nimSDK === undefined || this.nimSDK === null) {
            Logger.error("createTeam failed, this.nimSDK === undefined || this.nimSDK === null");

            return;
        }

        Logger.debug("imaccids:", imaccids);
        Logger.debug("my account:", this.account);

        // tslint:disable-next-line:no-any
        const createTeamDone = (error: any, obj: { team: Team }) => {
            if (error !== undefined && error !== null) {
                Logger.debug("createTeamDone, error:", error);

                return;
            }

            this.myTeam = obj.team;

            Logger.debug("createTeamDone:", obj.team);
        };
        // Logger.debug("my account:", this.account);

        // const accids: string[] = [];
        // 先删除所有群组，再创建群
        this.dismissAllTeam(() => {
            this.nimSDK.createTeam({
                type: 'normal',
                name: roomNumber,
                avatar: 'avatar',
                accounts: ["1"],
                ps: '我建了一个普通群',
                done: createTeamDone
            });
        });

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
            to: this.myTeam.teamId,
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
            to: this.myTeam.teamId,
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

    public addMembers(members: string[]): void {
        if (this.nimSDK === null) {
            Logger.error("this.nimSDK === null");

            return;
        }

        if (this.myTeam === null) {
            Logger.error("this.myTeam === null");

            return;
        }

        const addTeamMembersDone = (err: {}, obj: {}) => {
            if (err !== null) {
                Logger.debug("addTeamMembersDone failed, err:", err);

                return;
            }

            Logger.debug("addTeamMembersDone:", obj);
        };

        this.nimSDK.addTeamMembers({
            teamId: this.myTeam.teamId,
            accounts: members,
            ps: 'hello world',
            custom: '',
            done: addTeamMembersDone
        });
        // this.nimSDK.
    }
    public dismissAllTeam(onDone: Function): void {
        if (this.nimSDK === null) {
            Logger.error("this.nimSDK === null");

            return;
        }

        const dismissTeamDone = (error: {}, obj: {}) => {
            if (error !== null) {
                Logger.debug("dismissTeamDone failed:", error);

                return;
            }

            Logger.debug("dismissTeamDone, team:", obj);
        };

        const onGetTeams = (error: {}, teams: Team[]) => {
            if (error !== null) {
                Logger.debug("dismissAllTeam, get teams failed:", error);
                onDone(error);

                return;
            }

            for (const team of teams) {
                this.nimSDK.dismissTeam({
                    teamId: team.teamId,
                    done: dismissTeamDone
                });
            }

            onDone(null);
        };

        this.nimSDK.getTeams({
            done: onGetTeams
        });
    }

    protected onConnect(): void {
        Logger.debug("NimSDK onConnect");

        // this.createTeam();
        Logger.debug("this:", this);
    }

    protected onWillReconnect(obj: {}): void {
        Logger.debug("NimSDK onWillReconnect", obj);
    }

    protected onDisconnect(res: {}): void {
        Logger.debug("NimSDK onDisconnect:", res);
    }

    protected onError(): void {
        Logger.debug("NimSDK onError");
    }

    protected onTeams(res: Team[]): void {
        Logger.debug("NimSDK onTeams:", res);
        if (res.length > 0) {
            this.myTeam = res[0];
        }
    }

    protected onMsg(msg: NIMMessage): void {
        Logger.debug("NimSDK.onMsg:", msg);
        this.eventTarget.emit("onNimMsg", msg);
    }

    protected onCreateTeam(obj: { team: Team }): void {
        this.myTeam = obj.team;
        Logger.debug("NimSDK onCreateTeam:", obj);
    }
    protected onTeamMembers(obj: { teamId: string; members: [] }): void {
        Logger.debug(`NimSDK onTeamMembers, teamID:${obj.teamId}, members:${obj.members}`);
    }
}
