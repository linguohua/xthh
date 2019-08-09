import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import { CommonFunction, DataStore, Dialog, Enum, HTTP, KeyConstants, LEnv, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { LMsgCenter } from "../LMsgCenter";
// tslint:disable-next-line:no-require-imports
import { proto as protoHH } from "../protoHH/protoHH";
import { md5 } from "../utility/md5";
import { LobbyView } from "./LobbyView";

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

    public showLoginView(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("launch/fui_login/lobby_login");
        const view = fgui.UIPackage.createObject("lobby_login", "login").asCom;

        const x = CommonFunction.setViewInCenter(view);

        const bg = view.getChild('bg');
        CommonFunction.setBgFullScreenSize(bg);

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
        } else {
            Logger.debug('not wx platform');
        }
    }

    public updateProgressBar(progress: number): void {
        this.progressBar.value = progress * 100;
        if (this.progressText !== undefined && this.progressText !== null) {

            const text = progress * 100;
            this.progressText.text = `正在加载${text.toFixed(0)}%`;
        }
    }

    public initView(): void {
        // buttons
        this.weixinButton = this.viewNode.getChild("wechatLoginBtn");
        this.loginBtn = this.viewNode.getChild("visitorLoginBtn");
        this.phoneLoginBtn = this.viewNode.getChild("phoneNumLoginBtn");
        this.progressBar = this.viewNode.getChild("progress").asProgress;
        this.progressText = this.viewNode.getChild("progressText").asTextField;

        const version = this.viewNode.getChild("versionLab");
        version.text = LEnv.VER_STR;

        this.loginBtn.visible = false;
        this.weixinButton.visible = false;
        this.phoneLoginBtn.visible = false;
        this.progressBar.value = 0;

        this.loginBtn.onClick(this.onLoginClick, this);
        this.weixinButton.onClick(this.onWeixinBtnClick, this);

    }

    public updateCompleted(): void {
        this.progressBar.visible = false;
        this.progressText.visible = false;
        this.weixinButton.visible = true;
        this.loginBtn.visible = true;
        this.phoneLoginBtn.visible = true;
    }

    public onLoginClick(): void {
        Logger.debug("onQuicklyBtnClick");
        if (this.button !== null) {
            this.button.hide();
        }
        this.testHTTPLogin();
    }

    public onWeixinBtnClick(): void {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Logger.debug('not wx env');
        }
    }

    public onPhoneLoginBtnClick(): void {
        Logger.debug("onPhoneLoginBtnClick");
    }

    public showLobbyView(): void {
        this.destroy();
        this.win.hide();
        this.win.dispose();
        Dialog.hideDialog();

        this.addComponent(LobbyView);
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
    }
    protected testHTTPLogin(): void {
        let openudid = DataStore.getString("openudid", "");
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
        Logger.debug(reqString);

        HTTP.hPost(
            this.eventTarget,
            `${LEnv.rootURL}/t9user/Login`,
            (xhr: XMLHttpRequest) => {
                const err = HTTP.hError(xhr);
                if (err !== null) {
                    Logger.debug(err);
                    Dialog.showDialog(err);
                } else {
                    const reply = <FastLoginReply>JSON.parse(xhr.responseText);
                    if (reply.ret !== 0) {
                        Dialog.showDialog(`登录错误，错误码:${reply.ret}`);

                        return;
                    }

                    DataStore.setItem("imaccid", reply.im_accid);
                    DataStore.setItem("imtoken", reply.im_token);

                    Logger.debug(reply);
                    this.fastLogin(reply, null).catch((reason) => {
                        Logger.debug(reason);
                    });
                }
            },
            "text",
            reqString);
    }

    private constructFastLoginReq(userID: number, openudid: string): protoHH.casino.packet_fast_login_req {
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
            channel: "mac",
            ticket: "",
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

        if (lm.msgCenter !== undefined) {
            return;
        }

        let fastLoginReq = null;
        let loginServerCfg: ServerCfg = null;

        if (wxLoginReply !== undefined && wxLoginReply !== null) {
            loginServerCfg = wxLoginReply.data.servers[0];
            fastLoginReq = this.constructWxLoginReq(wxLoginReply);
        } else if (fastLoginReply !== undefined && fastLoginReply !== null) {
            loginServerCfg = fastLoginReply.servers[0];
            fastLoginReq = this.constructFastLoginReq(fastLoginReply.id, fastLoginReply.userid);
        }

        // 订阅登录完成的消息, 需要在msgCenter登录完成后分发
        const uriComp = encodeURIComponent(`${loginServerCfg.host}:${loginServerCfg.port}`);
        const url = `${LEnv.lobbyWebsocket}/game/uuid/ws/play?web=1&target=${uriComp}`;
        Logger.debug(url);
        Logger.debug("fastLoginReq:", fastLoginReq);
        // LmsgCenter 绑定到LobbyModule
        const msgCenter = new LMsgCenter(url, <cc.Component>lmComponent, fastLoginReq);
        msgCenter.eventTarget.once("onFastLoginComplete", this.onFastLoginComplete, this);

        lm.msgCenter = msgCenter;

        await msgCenter.start();

        // 退出
        lm.msgCenter = null;
    }

    private onFastLoginComplete(fastLoginAck: protoHH.casino.packet_fast_login_ack): void {
        Logger.debug("fastLoginReply:", fastLoginAck);
        this.saveFastLoginReply(fastLoginAck);
        this.showLobbyView();
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
        for (const resource of fastLoginAck.pdata.resources) {
            if (resource.type === protoHH.casino.eRESOURCE.RESOURCE_CARD) {
                card = resource.curr.toNumber();
            }

            if (resource.type === protoHH.casino.eRESOURCE.RESOURCE_BEANS) {
                beans = resource.curr.toNumber();
            }
        }

        let nickName = fastLoginAck.pdata.data.nickname;
        if (fastLoginAck.pdata.channel_nickname !== null && fastLoginAck.pdata.channel_nickname !== "") {
            nickName = fastLoginAck.pdata.channel_nickname;
        }

        if (fastLoginAck.pdata.channel_head !== null) {
            DataStore.setItem("avatarURL", fastLoginAck.pdata.channel_head);
        }

        const gameConfigStr = JSON.stringify(fastLoginAck.config);
        const payDataStr = JSON.stringify(fastLoginAck.paydata);

        DataStore.setItem("userID", fastLoginAck.user_id);
        DataStore.setItem("nickName", nickName);
        DataStore.setItem("gender", fastLoginAck.pdata.data.sex);
        DataStore.setItem("playerID", fastLoginAck.player_id);
        DataStore.setItem("phone", fastLoginAck.pdata.data.phone);
        DataStore.setItem("openudid", fastLoginAck.pdata.data.create_openudid);
        DataStore.setItem("tableID", tableID);
        DataStore.setItem("card", card);
        DataStore.setItem("beans", beans);
        DataStore.setItem("gameConfig", gameConfigStr);
        DataStore.setItem("payData", payDataStr);

        if (fastLoginAck.channel === "mac") {
            // 游客登录标志
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.VISITOR);
        } else if (fastLoginAck.channel === "weixin") {
            // 微信登录标志
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.WECHAT);
        } else {
            DataStore.setItem(KeyConstants.CHANNEL, Enum.CHANNEL_TYPE.UNKNOWN);
        }

    }

    private createWxBtn(): void {
        const btnSize = cc.size(this.weixinButton.width, this.weixinButton.height);
        const frameSize = cc.view.getFrameSize();
        const winSize = cc.winSize;
        const scaleX = frameSize.width / winSize.width;
        const scaleY = frameSize.height / winSize.height;
        const scale = scaleX < scaleY ? scaleX : scaleY;
        const left = this.weixinButton.x * scale;
        const top = this.weixinButton.y * scale;
        const width = btnSize.width * scale;
        const height = btnSize.height * scale;
        this.button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
                lineHeight: 0,
                // backgroundColor: '#000000',
                // borderColor: '#ff0000',
                // color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });

        this.button.onTap(() => {
            if (this.button !== null && this.button !== undefined) {
                this.button.hide();
            }
            // this.weixinButton.d
            if (Dialog.isShowWaiting()) {
                // 防止连续点击
                return;
            }
            Dialog.showWaiting();
            WeiXinSDK.login(<Function>this.wxLogin.bind(this));
        });
    }
    private wxLogin(result: boolean): void {
        Dialog.hideWaiting();
        if (!result) {
            Logger.error("wxlogin error");
            this.button.show();

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

            HTTP.hPost(
                this.eventTarget,
                wxLoginUrl,
                (xhr: XMLHttpRequest, err: string) => {
                    let errMsg = null;
                    if (err !== null) {
                        this.button.show();
                        errMsg = `登录错误:${err}`;
                        Logger.debug(errMsg);
                        Dialog.showDialog(errMsg);

                        return;
                    }

                    errMsg = HTTP.hError(xhr);
                    if (errMsg !== null) {
                        this.button.show();
                        Logger.debug(errMsg);
                        Dialog.showDialog(errMsg);

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

                    DataStore.setItem("imaccid", reply.data.im_accid);
                    DataStore.setItem("imtoken", reply.data.im_token);

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
