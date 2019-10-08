import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import {
    CommonFunction, DataStore, Dialog, Enum,
    HTTP, KeyConstants, LEnv, LobbyModuleInterface, Logger, SoundMgr
} from "../lcore/LCoreExports";
import { LMsgCenter } from "../LMsgCenter";
// tslint:disable-next-line:no-require-imports
import { proto as protoHH } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";
import { md5 } from "../utility/md5";
import { LobbyView } from "./LobbyView";
import { OpenType, PhoneAuthView } from "./PhoneAuthView";

const { ccclass } = cc._decorator;
interface ServerCfg {
    host: string;
    port: number;
    id: number;
}

interface LoginData {
    openid: string;
    unionid: string;
    userid: number;
    channel: string;
    ticket: string;
    im_accid: string;
    im_token: string;
    servers: ServerCfg[];
}
interface WxLoginReply {
    ret: number;
    msg: string;
    data: LoginData;
}

interface FastLoginReply {
    ret: number;
    channel: string;
    im_accid: string;
    im_token: string;
    servers: ServerCfg[];
    ticket: string;
    id: number;
    userid: string;
    msg: string;
}

/**
 * LoginView 登录界面
 */
@ccclass
export class LoginView extends cc.Component {
    private viewNode: fgui.GComponent;
    private win: fgui.Window;
    private loginBtn: fgui.GObject;
    private weixinButton: fgui.GObject;
    private phoneLoginBtn: fgui.GObject;
    private progressBar: fgui.GProgressBar;
    private progressText: fgui.GTextField;
    private eventTarget: cc.EventTarget;
    private button: UserInfoButton = null;
    private isLogout: boolean = false;

    public showLoginView(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("launch/fui_login/lobby_login");
        const view = fgui.UIPackage.createObject("lobby_login", "login").asCom;

        const x = CommonFunction.setViewInCenter(view);

        const bg = view.getChild('bg');
        //CommonFunction.setBgFullScreenSize(bg);

        // 兼容底部背景
        const diBg = view.getChild('diBg');
        diBg.width = bg.width;
        diBg.setPosition(-x, diBg.y);

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.viewNode = view;
        this.win = win;

        this.initView();
        this.win.show();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.createWxBtn();
        }
    }

    public updateProgressBar(progress: number): void {
        this.progressBar.value = progress * 100;
        if (this.progressText !== undefined && this.progressText !== null) {

            const text = progress * 100;
            this.progressText.text = `正在加载${text.toFixed(0)}%`;
        }
    }

    public setLogout(): void {
        this.isLogout = true;
    }

    public initView(): void {
        // buttons
        this.weixinButton = this.viewNode.getChild("wechatLoginBtn");
        this.loginBtn = this.viewNode.getChild("visitorLoginBtn");
        this.phoneLoginBtn = this.viewNode.getChild("phoneNumLoginBtn");
        this.progressBar = this.viewNode.getChild("progress").asProgress;
        this.progressText = this.viewNode.getChild("progressText").asTextField;

        const approvalInformationText = this.viewNode.getChild("information");
        approvalInformationText.text = LocalStrings.findString("approvalInformation");

        const version = this.viewNode.getChild("versionLab");
        version.text = LEnv.VER_STR;

        if (this.isLogout) {
            // 刷新界面
            this.updateCompleted();
        } else {
            this.loginBtn.visible = false;
            this.weixinButton.visible = false;
            this.phoneLoginBtn.visible = false;
            this.progressBar.visible = true;
            this.progressBar.value = 0;
        }

        this.loginBtn.onClick(this.onLoginClick, this);
        this.weixinButton.onClick(this.onWeixinBtnClick, this);
        this.phoneLoginBtn.onClick(this.onPhoneLoginBtnClick, this);
    }

    public updateCompleted(): void {
        this.progressBar.visible = false;
        this.progressText.visible = false;
        this.weixinButton.visible = true;
        this.loginBtn.visible = true;
        this.phoneLoginBtn.visible = true;
    }

    public onLoginClick(): void {
        SoundMgr.buttonTouch();
        if (this.button !== null) {
            this.button.hide();
        }
        this.testHTTPLogin();
    }

    public onWeixinBtnClick(): void {
        SoundMgr.buttonTouch();
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug('not wx env');
        }
    }

    public onPhoneLoginBtnClick(): void {
        SoundMgr.buttonTouch();
        Logger.debug("onPhoneLoginBtnClick");
        const view = this.addComponent(PhoneAuthView);
        view.show(OpenType.LOGIN, this);
    }

    public showLobbyView(): void {
        this.destroy();
        this.win.hide();
        this.win.dispose();
        Dialog.hideDialog();

        this.addComponent(LobbyView);
    }

    public requestPhoneLogin(phone: string, code: string, callback: Function): void {
        const url = `${LEnv.rootURL}/t9user/PhoneLogin?app=${LEnv.app}&phone=${phone}&code=${code}`;
        Logger.debug("requireCode:", url);
        HTTP.hGet(
            this.eventTarget,
            url,
            (xhr: XMLHttpRequest) => {
                const err = HTTP.hError(xhr);
                if (err !== null) {
                    Logger.error(err);
                    if (callback !== undefined) {
                        callback(LocalStrings.findString("networkConnectError"));
                    }
                    // Dialog.showDialog(LocalStrings.findString("networkConnectError"));
                } else {
                    const reply = <FastLoginReply>JSON.parse(xhr.responseText);
                    if (reply.ret !== 0) {
                        // Dialog.showDialog(LocalStrings.findString("networkConnectError", `${reply.ret}`));
                        Logger.error("requestPhoneLogin failed:", reply);
                        let errMsg = "";
                        if (reply.ret === 4) {
                            errMsg = LocalStrings.findString("unbindPhone");
                        } else if (reply.ret === 6) {
                            errMsg = LocalStrings.findString("invalidAuthCode");
                        } else {
                            errMsg = `未知错误码:${reply.ret}, 请让程序员补上`;
                        }

                        callback(errMsg);

                        return;
                    }

                    DataStore.setItem(KeyConstants.IM_ACCID, reply.im_accid);
                    DataStore.setItem(KeyConstants.IM_TOKEN, reply.im_token);

                    Logger.debug(reply);
                    this.fastLogin(reply, null).catch((reason) => {
                        Logger.debug(reason);
                    });

                    callback(null);
                }
            },
            "text");
    }

    // 手机号登录输入框会穿透
    public disableAllBtn(): void {
        if (this.button !== null) {
            this.button.hide();
        }
    }

    public enableAllBtn(): void {
        if (this.button !== null) {
            this.button.show();
        }
    }

    protected start(): void {
        this.showLoginView();
    }

    protected onDestroy(): void {
        this.eventTarget.emit("destroy");
    }

    protected onLoad(): void {
        // 构建一个event target用于发出destroy事件
        this.eventTarget = new cc.EventTarget();

        //fgui.UIConfig.buttonSound = "ui://lobby_bg_package/sound_touch";
    }
    protected testHTTPLogin(): void {
        let openudid = DataStore.getString(KeyConstants.OPEN_UD_ID, "");
        if (openudid === "") {
            const now = Date.now();
            const random = Math.random() * 100000;
            openudid = md5(`${now}${random}`);

            Logger.debug("constructFastLoginReq new openudid:", openudid);
        }

        const req = {
            app: LEnv.app,
            channel: "mac",
            openudid: openudid,
            nickname: "abc",
            ticket: 0,
            sign: ""
        };

        req.ticket = Math.ceil(Date.now() / 1000);
        const cat = `xthh${req.openudid}${req.ticket}`;
        req.sign = md5(cat);

        const reqString = JSON.stringify(req);
        //Logger.debug(reqString);

        HTTP.hPost(
            this.eventTarget,
            `${LEnv.rootURL}/t9user/Login`,
            (xhr: XMLHttpRequest) => {
                const err = HTTP.hError(xhr);
                if (err !== null) {
                    Logger.debug(err);
                    Dialog.showDialog(LocalStrings.findString("networkConnectError"));
                } else {
                    const reply = <FastLoginReply>JSON.parse(xhr.responseText);
                    if (reply.ret !== 0) {
                        Logger.debug("login error, ret:", reply.ret);
                        Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                        return;
                    }

                    DataStore.setItem(KeyConstants.IM_ACCID, reply.im_accid);
                    DataStore.setItem(KeyConstants.IM_TOKEN, reply.im_token);
                    DataStore.setItem(KeyConstants.TICKET, reply.ticket);

                    Logger.debug(reply);
                    this.fastLogin(reply, null).catch((reason) => {
                        Logger.debug(reason);
                    });
                }
            },
            "text",
            reqString);
    }

    private constructFastLoginReq(userID: number, openudid: string, channel: string, ticket: string): protoHH.casino.packet_fast_login_req {
        const devInfo = {
            package: "com.zhongyou.hubei.casino.as",
            platform: "",
            language: "",
            version: "",
            build: "",
            idfa: "",
            idfv: "",
            udid: "",
            openudid: openudid,
            mac: "00:00:00:00:00:00",
            device: "iPhone",
            device_version: "",
            system: "iOS",
            system_version: "10.3.3",
            jailbreak: false,
            sim: "",
            phone: "",
            imei: "",
            imsi: "",
            device_token: "",
            ip: ""
        };

        return {
            channel: channel,
            ticket: ticket,
            user_id: userID,
            reconnect: false,
            gdatacrc: 0xFFFFFFFF,
            devinfo: devInfo,
            pdatacrc: 0,
            pay: "",
            request_id: 0
        };
    }

    private constructWxLoginReq(wxLoginReply: WxLoginReply): protoHH.casino.packet_fast_login_req {
        const devInfo = {
            package: "com.zhongyou.hubei.casino.as",
            platform: "",
            language: "",
            version: "",
            build: "",
            idfa: "",
            idfv: "",
            udid: "",
            openudid: "",
            mac: "00:00:00:00:00:00",
            device: "iPhone",
            device_version: "",
            system: "iOS",
            system_version: "10.3.3",
            jailbreak: false,
            sim: "",
            phone: "",
            imei: "",
            imsi: "",
            device_token: "",
            ip: ""
        };

        return {
            channel: wxLoginReply.data.channel,
            ticket: wxLoginReply.data.ticket,
            user_id: wxLoginReply.data.userid,
            reconnect: false,
            gdatacrc: 0xFFFFFFFF,
            devinfo: devInfo,
            pdatacrc: 0,
            pay: "",
            request_id: 0
        };
    }

    private async fastLogin(fastLoginReply: FastLoginReply, wxLoginReply?: WxLoginReply): Promise<void> {
        Logger.debug(fastLoginReply);
        const lmComponent = this.getComponent("LobbyModule");
        const lm = <LobbyModuleInterface>lmComponent;

        if (lm.msgCenter !== undefined && lm.msgCenter !== null) {
            return;
        }

        Dialog.showWaiting();

        let fastLoginReq = null;
        let loginServerCfg: ServerCfg = null;

        if (wxLoginReply !== undefined && wxLoginReply !== null) {
            loginServerCfg = wxLoginReply.data.servers[0];
            fastLoginReq = this.constructWxLoginReq(wxLoginReply);
        } else if (fastLoginReply !== undefined && fastLoginReply !== null) {
            loginServerCfg = fastLoginReply.servers[0];
            fastLoginReq = this.constructFastLoginReq(
                fastLoginReply.id, `${fastLoginReply.userid}`, fastLoginReply.channel, fastLoginReply.ticket);
        }

        // 订阅登录完成的消息, 需要在msgCenter登录完成后分发
        const uriComp = encodeURIComponent(`${loginServerCfg.host}:${loginServerCfg.port}`);
        const url = `${LEnv.lobbyWebsocket}/game/uuid/ws/play?web=1&target=${uriComp}`;
        Logger.debug(url);
        Logger.debug("fastLoginReq:", fastLoginReq);
        // LmsgCenter 绑定到LobbyModule

        const priorityMap: { [key: number]: number } = { [protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK << 8]: 1 };
        const msgCenter = new LMsgCenter(url, <cc.Component>lmComponent, fastLoginReq, priorityMap);
        msgCenter.eventTarget.once("onFastLoginComplete", this.onFastLoginComplete, this);

        lm.msgCenter = msgCenter;

        await msgCenter.start();

        // 退出
        lm.msgCenter = null;
    }

    private onFastLoginComplete(fastLoginAck: protoHH.casino.packet_fast_login_ack): void {
        if (this.button !== null) {
            this.button.destroy();
        }

        Logger.debug("fastLoginReply:", fastLoginAck);
        this.cleanData();
        this.saveFastLoginReply(fastLoginAck);
        this.showLobbyView();
    }

    /**
     * 清除一些登录后失效的数据
     */
    private cleanData(): void {
        DataStore.setItem(KeyConstants.LOTTERY_DRAW_INDEX, 0);
    }

    private saveFastLoginReply(fastLoginAck: protoHH.casino.packet_fast_login_ack): void {
        // 桌子ID
        let tableID: string = `${fastLoginAck.pdata.table_id}`;
        if (tableID === "null" || tableID === "0") {
            tableID = "";
        }

        // 获取房卡资源
        let card: number = 0;
        let beans: number = 0;
        let red: number = 0;
        for (const resource of fastLoginAck.pdata.resources) {
            if (resource.type === protoHH.casino.eRESOURCE.RESOURCE_CARD) {
                card = resource.curr.toNumber();
            }
            if (resource.type === protoHH.casino.eRESOURCE.RESOURCE_BEANS) {
                beans = resource.curr.toNumber();
            }
            if (resource.type === protoHH.casino.eRESOURCE.RESOURCE_RED) {
                red = resource.curr.toNumber();
            }
        }

        let nickName = fastLoginAck.pdata.data.nickname;
        if (fastLoginAck.pdata.channel_nickname !== null && fastLoginAck.pdata.channel_nickname !== "") {
            nickName = fastLoginAck.pdata.channel_nickname;
        }

        let avatarUrl = "";
        if (fastLoginAck.pdata.channel_head !== null) {
            avatarUrl = fastLoginAck.pdata.channel_head;
        }

        const gameConfigStr = JSON.stringify(fastLoginAck.config);
        const payDataStr = JSON.stringify(fastLoginAck.paydata);
        const dataGdy = JSON.stringify(fastLoginAck.pdata.data_gdy);

        const rooms: protoHH.casino.Iroom[] = [];
        //把欢乐场的房间信息提出来
        for (const r of fastLoginAck.rooms) {
            if (r.cost_type === 9) {
                rooms.push(r);
            }
        }

        const etData = JSON.stringify(fastLoginAck.et_data);
        const playerEnergy = JSON.stringify(fastLoginAck.pdata.energy);
        const emailData = JSON.stringify(fastLoginAck.pdata.mails);
        const playerRedData = JSON.stringify(fastLoginAck.pdata.red);
        const redData = JSON.stringify(fastLoginAck.reddata);
        const acts = JSON.stringify(fastLoginAck.pdata.acts);

        DataStore.setItem(KeyConstants.AVATAR_URL, avatarUrl);
        DataStore.setItem(KeyConstants.USER_ID, fastLoginAck.user_id);
        DataStore.setItem(KeyConstants.NICK_NAME, nickName);
        DataStore.setItem(KeyConstants.GENDER, fastLoginAck.pdata.data.sex);
        DataStore.setItem(KeyConstants.PLAYER_ID, fastLoginAck.player_id);
        DataStore.setItem(KeyConstants.PHONE, fastLoginAck.pdata.data.phone);
        DataStore.setItem(KeyConstants.LEAVE_GUILD, fastLoginAck.pdata.leave_guild);
        DataStore.setItem(KeyConstants.TABLE_ID, tableID);
        DataStore.setItem(KeyConstants.CARD, card);
        DataStore.setItem(KeyConstants.BEANS, beans);
        DataStore.setItem(KeyConstants.RED, red);
        DataStore.setItem(KeyConstants.GAME_CONFIG, gameConfigStr);
        DataStore.setItem(KeyConstants.PAY_DATA, payDataStr);
        DataStore.setItem(KeyConstants.DATA_GDY, dataGdy);
        DataStore.setItem(KeyConstants.ROOMS, JSON.stringify(rooms));
        DataStore.setItem(KeyConstants.AVATAR_INDEX, fastLoginAck.pdata.data.avatar);
        DataStore.setItem(KeyConstants.TURN_TABLE, etData);
        DataStore.setItem(KeyConstants.PLAYER_ENERGY, playerEnergy);
        DataStore.setItem(KeyConstants.PLAYER_EMAIL, emailData);
        DataStore.setItem(KeyConstants.PLAYER_ACTS, acts);
        // 红包提现信息
        DataStore.setItem(KeyConstants.PLAYER_RED, playerRedData);
        // 红包数据
        DataStore.setItem(KeyConstants.RED_DATA, redData);
        // 低保（免费领取欢乐豆）数据
        let helperTime = 0;
        if (fastLoginAck.pdata.helper.helper_time !== undefined && fastLoginAck.pdata.helper.helper_time !== null) {
            helperTime = +fastLoginAck.pdata.helper.helper_time * 1000;
        }

        DataStore.setItem(KeyConstants.HELPER_TIME, helperTime);
        DataStore.setItem(KeyConstants.HELPER_SIZE, fastLoginAck.helperdata.helpers.length);
        DataStore.setItem(KeyConstants.HELPER_MIN, fastLoginAck.helperdata.gold_min);
        DataStore.setItem(KeyConstants.HELPER_PARAM, fastLoginAck.pdata.helper.param);

        if (fastLoginAck.channel === "mac") {
            // 游客登录标志
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.VISITOR);
            DataStore.setItem(KeyConstants.OPEN_UD_ID, fastLoginAck.pdata.data.create_openudid);
        } else if (fastLoginAck.channel === "weixin") {
            // 微信登录标志
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.WECHAT);
        } else if (fastLoginAck.channel === "phone") {
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.PHONE);
        } else {
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.UNKNOWN);
        }
    }

    private createWxBtn(): void {

        const btnSize = cc.size(this.weixinButton.node.width, this.weixinButton.node.height);
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.director.getWinSize();
        const scaleX = frameSize.width / winSize.width;
        const scaleY = frameSize.height / winSize.height;
        const width = btnSize.width / winSize.width * frameSize.width;
        const height = btnSize.height / winSize.height * frameSize.height;

        const readLeft = (frameSize.width * 0.5) - (btnSize.width * scaleX * 0.5);
        const readTop = Math.abs(this.weixinButton.node.y) * scaleY;

        this.button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: readLeft,
                top: readTop,
                width: width,
                height: height,
                lineHeight: 0,
                //backgroundColor: '#000000',
                // borderColor: '#ff0000',
                // color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
                //zIndex: -1000
            }
        });

        this.button.onTap(() => {
            if (this.button !== null && this.button !== undefined) {
                this.button.hide();
            }

            const action = cc.scaleTo(0.06, 0.9).easing(cc.easeInOut(0.02));
            const action1 = cc.scaleTo(0.06, 1).easing(cc.easeInOut(0.02));
            const actionEnd = cc.sequence(action, action1);
            this.weixinButton.node.runAction(actionEnd);
            // this.weixinButton.d
            if (Dialog.isShowWaiting()) {
                // 防止连续点击
                return;
            }
            SoundMgr.buttonTouch();
            Dialog.showWaiting();
            WeiXinSDK.login(<Function>this.wxLogin.bind(this));
        });
    }
    private wxLogin(result: boolean): void {
        Dialog.hideWaiting();
        if (!result) {
            Logger.error("wxlogin error");
            this.button.show();
            Dialog.showDialog(LocalStrings.findString("networkConnectError"));

            return;
        } else {
            const wxCodeStr = 'wechatLCode';
            const wxUserInfoStr = 'wxUserInfo';
            const wxCode = <string>WeiXinSDK.getWxDataMap()[wxCodeStr];
            const wxUserData = <getUserInfoRes>WeiXinSDK.getWxDataMap()[wxUserInfoStr];

            const wxLoginUrl = LEnv.cfmt(`${LEnv.rootURL}${LEnv.wxLogin}`, LEnv.app, wxCode);
            Logger.debug('wxloginUrl', wxLoginUrl);

            const requestData = {
                avatar: wxUserData.userInfo.avatarUrl,
                nickname: wxUserData.userInfo.nickName,
                gender: wxUserData.userInfo.gender
            };

            const jsonString = JSON.stringify(requestData);

            Logger.debug("wxLogin, jsonString:", jsonString);

            HTTP.hPost(
                this.eventTarget,
                wxLoginUrl,
                (xhr: XMLHttpRequest, err: string) => {
                    let errMsg = null;
                    if (err !== null) {
                        this.button.show();
                        errMsg = `登录错误:${err}`;
                        Logger.debug(errMsg);
                        Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                        return;
                    }

                    errMsg = HTTP.hError(xhr);
                    if (errMsg !== null) {
                        this.button.show();
                        Logger.debug(errMsg);
                        Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                        return;
                    }

                    Logger.debug("responseText:", xhr.responseText);
                    const reply = <WxLoginReply>JSON.parse(xhr.responseText);
                    if (reply.ret !== 0) {
                        this.button.show();
                        errMsg = reply.msg;
                        Logger.debug(errMsg);
                        Dialog.showDialog(errMsg);

                        return;
                    }

                    DataStore.setItem(KeyConstants.IM_ACCID, reply.data.im_accid);
                    DataStore.setItem(KeyConstants.IM_TOKEN, reply.data.im_token);
                    DataStore.setItem(KeyConstants.TICKET, reply.data.ticket);

                    Logger.debug("reply =", reply);
                    this.fastLogin(null, reply).catch((reason) => {
                        Logger.debug(reason);
                    });

                },
                "text",
                jsonString);
        }
    }
}
