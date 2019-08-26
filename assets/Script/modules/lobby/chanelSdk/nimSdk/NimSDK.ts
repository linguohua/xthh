import { DataStore, Dialog, KeyConstants, Logger } from '../../lcore/LCoreExports';
// tslint:disable-next-line:no-require-imports
import NIMWeb = require('./NIMWeb');
// tslint:disable-next-line:no-require-imports
import NIMWeixin = require('./NIMWeixin');

const connectionError = "Error_Connection_Socket_State_not_Match";
/**
 * 网易云信SDK
 */
export interface NIMFile {
    name: string;
    size: number;
    md5: number;
    url: string;
    mp3Url: string;
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
    type: string;
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

interface MyNimSDK {
    disconnect: Function;
    createTeam: Function;
    sendText: Function;
    getTeams: Function;
    sendFile: Function;
    addTeamMembers: Function;
    dismissTeam: Function;
    connect: Function;
}
/**
 * NimSDK
 */
export class NimSDK {
    public eventTarget: cc.EventTarget;
    private appKey: string;
    private account: string;
    private token: string;

    // tslint:disable-next-line:no-any
    private nimSDK: MyNimSDK;

    // private teams: Team[] = [];

    private myTeam: Team = null;

    private component: cc.Component;
    // 用来订阅消息
    public constructor(appKey: string, account: string, token: string, component: cc.Component) {
        this.appKey = appKey;
        this.account = account;
        this.token = token;
        this.component = component;
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

        const onDisconnect = (res: { callFunc: Function | string }) => {
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

        const onSyncDone = (res: {}) => {
            this.onSyncDone(res);
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
            onsyncdone: onSyncDone,
            reconnectionAttempts: 0,
            // debug: true,
            onmsg: onMsg
        };

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 微信版本sdk
            this.nimSDK = <MyNimSDK>NIMWeixin.getInstance(options);
        } else {
            // web版本sdk
            this.nimSDK = <MyNimSDK>NIMWeb.getInstance(options);
        }
    }

    public disconnect(): void {
        this.nimSDK.disconnect({
            done: async (res: {}): Promise<void> => {
                Logger.debug("disconnect done:", res);
                await this.tryReconnect();
                // await this.waitSecond(2);
                // this.nimSDK.connect();
            }
        });
    }

    /**
     *  创建群组用来发送牌局内的消息
     * @param imaccids 群用户ID
     * @param roomNumber 房间号
     */
    public createTeam(imaccids: string[], roomNumber: string, callback?: Function): void {
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

            if (callback !== undefined) {
                callback();
            }
            Logger.debug("createTeamDone:", obj.team);
        };
        // Logger.debug("my account:", this.account);

        // const accids: string[] = [];

        const options = {
            type: 'normal',
            name: roomNumber,
            avatar: 'avatar',
            accounts: imaccids,
            ps: '我建了一个普通群',
            done: createTeamDone
        };

        this.nimSDK.createTeam(options);
        // 先删除所有群组，再创建群
        // this.dismissAllTeam(() => {
        //     Logger.debug("options:", options);
        //     this.nimSDK.createTeam(options);
        // });

    }
    // 先测试发文本，然后再测试发语音
    public sendTeamMsg(msgContent: string): void {
        if (this.nimSDK === null || this.nimSDK === undefined) {
            Logger.error("this.nimSDK === null || this.nimSDK === undefined");

            return;
        }

        const sendMsg = (content: string) => {
            const sendMsgDone = (error: { code: string }, message: NIMMessage) => {
                if (error !== null && error.code === connectionError) {
                    this.disconnect();
                    Logger.debug("sendMsgDone error:", error);

                    return;
                }

                Logger.debug("sendMsgDone:", message);
            };

            const msg = this.nimSDK.sendText({
                scene: 'team',
                to: this.myTeam.teamId,
                text: content,
                done: sendMsgDone
            });

            Logger.debug("msg:", msg);
        };

        if (this.myTeam === null || this.myTeam === undefined) {
            this.createTeam(['1'], "123", () => {
                sendMsg(msgContent);
            });
        } else {
            sendMsg(msgContent);
        }

    }

    // Logger.debug("msg:", msg);
    // }

    // tslint:disable-next-line:no-reserved-keywords
    public sendTeamAudio(wxFilePath: string): void {
        if (this.myTeam === null || this.myTeam === undefined) {
            const onGetTeams = (error: { code: string }, teams: Team[]) => {
                if (error !== null && error.code === connectionError) {
                    Logger.debug("sendTeamAudio failed, get teams error:", error);
                    this.disconnect();

                    Dialog.prompt("语音网络正在重连");

                    return;
                }

                if (teams.length === 0) {
                    Logger.debug("sendTeamAudio failed, teams.length === 0");

                    return;
                }

                const imaccid = DataStore.getString(KeyConstants.IM_ACCID, "");
                // 寻找第一个群来发送消息
                for (const team of teams) {
                    if (team.owner === imaccid) {
                        this.myTeam = team;
                        this.sendFile(wxFilePath);

                        break;
                    }
                }
            };

            this.nimSDK.getTeams({
                done: onGetTeams
            });
        } else {
            this.sendFile(wxFilePath);
        }

    }

    public sendFile(wxFilePath: string): void {
        if (this.myTeam === null || this.myTeam === undefined) {
            Logger.debug("this.myTeam === null || this.myTeam === undefined");

            return;
        }

        const sendMsgDone = (error: { code: string }, message: NIMMessage) => {
            if (error !== null && error.code === connectionError) {
                this.disconnect();
                Dialog.prompt("语音网络断开，正在重连");
                Logger.debug("send msg error:", error);
            } else {
                this.onMsg(message);
            }
        };

        this.nimSDK.sendFile({
            scene: 'team',
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

        const imaccid = DataStore.getString(KeyConstants.IM_ACCID, "");

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
                // 只能解散自己创建的房间，别人的解散不了
                if (team.owner !== imaccid) {
                    continue;
                }

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

    protected onDisconnect(res: { callFunc: Function | string }): void {
        Logger.debug("NimSDK onDisconnect:", res);
        if (res.callFunc === null) {
            this.disconnect();
        } else {
            Logger.debug("res.callFunc:", res.callFunc);
        }
    }

    protected onError(): void {
        Logger.debug("NimSDK onError");
    }

    protected onTeams(res: Team[]): void {
        Logger.debug("NimSDK onTeams:", res);
        const myImaccid = DataStore.getString(KeyConstants.IM_ACCID);
        for (const team of res) {
            if (team.owner === myImaccid) {
                this.myTeam = team;
                Logger.debug("sync team ok, teamid:", this.myTeam.teamId);
                break;
            }
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

    protected onSyncDone(res: {}): void {
        Logger.debug("onSyncDone:", res);
    }

    protected async waitSecond(seconds: number): Promise<void> {
        return new Promise<void>((resolve, _) => {
            this.component.scheduleOnce(
                () => {
                    resolve();
                },
                seconds);
        });
    }

    protected async tryReconnect(): Promise<void> {
        Logger.debug("NIMSDK wait 2 second to connet");
        await this.waitSecond(2);
        Logger.debug("NIMSDK excute connect");
        this.nimSDK.connect();
    }
}
