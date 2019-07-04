import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import { CommonFunction, DataStore, Dialog, HTTP, KeyConstants, LEnv, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { LMsgCenter } from "../LMsgCenter";
import { proto } from "../proto/protoLobby";
// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { proto as protoHH } from "../protoHH/protoHH";
import { md5 } from "../utility/md5";
import { LobbyView } from "./LobbyView";

const { ccclass } = cc._decorator;
interface ServerCfg {
    host: string;
    port: number;
    id: number;
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

        let x = CommonFunction.setBaseViewInCenter(view);

        const newIPhone = DataStore.getString(KeyConstants.ADAPTIVE_PHONE_KEY);
        if (newIPhone === "1") {
            // i phone x 的黑边为 CommonFunction.IOS_ADAPTER_WIDTH
            x = x - CommonFunction.IOS_ADAPTER_WIDTH;
        }
        const bg = view.getChild('bg');
        bg.setPosition(-x, 0);
        CommonFunction.setBgFullScreen(bg);

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
    public saveWxLoginReply(wxLoginReply: proto.lobby.MsgLoginReply): void {

        DataStore.setItem("token", wxLoginReply.token);
        const roomInfo = wxLoginReply.lastRoomInfo;
        DataStore.setItem("RoomInfoData", "");
        if (roomInfo !== undefined && roomInfo !== null) {
            const roomInfoData = {
                roomID: roomInfo.roomID,
                roomNumber: roomInfo.roomNumber,
                config: roomInfo.config,
                gameServerID: roomInfo.gameServerID
            };

            const roomInfoDataStr = JSON.stringify(roomInfoData);
            DataStore.setItem("RoomInfoData", roomInfoDataStr);
        }

        const userInfo = wxLoginReply.userInfo;
        DataStore.setItem("userID", userInfo.userID);
        DataStore.setItem("nickName", userInfo.nickName);
        DataStore.setItem("gender", userInfo.gender);
        DataStore.setItem("province", userInfo.province);
        DataStore.setItem("city", userInfo.city);
        DataStore.setItem("diamond", userInfo.diamond);
        DataStore.setItem("country", userInfo.country);
        DataStore.setItem("headImgUrl", userInfo.headImgUrl);
        DataStore.setItem("phone", userInfo.phone);
    }

    public saveQuicklyLoginReply(quicklyLoginReply: proto.lobby.MsgQuicklyLoginReply): void {
        DataStore.setItem("account", quicklyLoginReply.account);
        DataStore.setItem("token", quicklyLoginReply.token);

        const roomInfo = quicklyLoginReply.lastRoomInfo;
        DataStore.setItem("RoomInfoData", "");
        if (roomInfo !== undefined && roomInfo !== null) {
            const roomInfoData = {
                roomID: roomInfo.roomID,
                roomNumber: roomInfo.roomNumber,
                config: roomInfo.config,
                gameServerID: roomInfo.gameServerID
            };

            const roomInfoDataStr = JSON.stringify(roomInfoData);
            DataStore.setItem("RoomInfoData", roomInfoDataStr);
        }

        const userInfo = quicklyLoginReply.userInfo;
        DataStore.setItem("userID", userInfo.userID);
        DataStore.setItem("nickName", userInfo.nickName);
        DataStore.setItem("gender", userInfo.gender);
        DataStore.setItem("province", userInfo.province);
        DataStore.setItem("city", userInfo.city);
        DataStore.setItem("diamond", userInfo.diamond);
        DataStore.setItem("country", userInfo.country);
        DataStore.setItem("headImgUrl", userInfo.headImgUrl);
        DataStore.setItem("phone", userInfo.phone);
    }

    public showLobbyView(): void {
        this.destroy();
        this.win.hide();
        this.win.dispose();

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
        const req = {
            app: "casino",
            channel: "mac",
            openudid: "00000000-3ff8-9c77-ce04-7c1b00000000",
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
                } else {
                    const reply = <{ servers: ServerCfg[] }>JSON.parse(xhr.responseText);
                    Logger.debug(reply);
                    this.testFastLogin(reply.servers[0]).catch((reason) => {
                        Logger.debug(reason);
                    });
                }
            },
            "text",
            reqString);
    }

    private constructFastLoginReq(): protoHH.casino.packet_fast_login_req {
        let openudid = DataStore.getString("openudid", "");
        if (openudid === "") {
           const now = Date.now();
           const random = Math.random() * 100000;
           openudid =  md5(`${now}${random}`);

           Logger.debug("constructFastLoginReq new openudid:", openudid);
        }

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
                user_id: 1094151,
                reconnect: false,
                gdatacrc: 0xFFFFFFFF,
                devinfo: devInfo,
                pdatacrc: 0,
                pay: "",
                request_id : 0
            };
    }

    private async testFastLogin(serverCfg: ServerCfg): Promise<void> {
        Logger.debug(serverCfg);
        const lmComponent = this.getComponent("LobbyModule");
        const lm = <LobbyModuleInterface>lmComponent;

        if (lm.msgCenter !== undefined) {
            return;
        }

        // 订阅登录完成的消息, 需要在msgCenter登录完成后分发
        const fastLoginReq = this.constructFastLoginReq();
        const uriComp = encodeURIComponent(`${serverCfg.host}:${serverCfg.port}`);
        const url = `${LEnv.lobbyWebsocket}/game/uuid/ws/play?web=1&target=${uriComp}`;
        Logger.debug(url);
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

        const gameConfigStr = JSON.stringify(fastLoginAck.config);

        DataStore.setItem("userID", fastLoginAck.user_id);
        DataStore.setItem("nickName", fastLoginAck.pdata.data.nickname);
        DataStore.setItem("gender", fastLoginAck.pdata.data.sex);
        DataStore.setItem("playerID", fastLoginAck.player_id);
        DataStore.setItem("phone", fastLoginAck.pdata.data.phone);
        DataStore.setItem("openudid", fastLoginAck.pdata.data.create_openudid);
        DataStore.setItem("tableID", tableID);
        DataStore.setItem("card", card);
        DataStore.setItem("beans", beans);
        DataStore.setItem("gameConfig", gameConfigStr);

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

        this.button.onTap((res: getUserInfoRes) => {
            this.button.hide();
            WeiXinSDK.login(<Function>this.wxLogin.bind(this));
        });
    }
    private wxLogin(result: boolean): void {
        if (!result) {
            Logger.error("wxlogin error");
            this.button.show();

            return;
        } else {
            const wxLoginUrl = `${LEnv.rootURL}${LEnv.wxLogin}`;
            Logger.debug('wxloginUrl', wxLoginUrl);

            const wxCodeStr = 'wechatLCode';
            const wxUserInfoStr = 'wxUserInfo';
            const wxCode = <string>WeiXinSDK.getWxDataMap()[wxCodeStr];
            const wxUserData = <getUserInfoRes>WeiXinSDK.getWxDataMap()[wxUserInfoStr];

            const wxLoginReq = new proto.lobby.MsgWxLogin();
            wxLoginReq.code = wxCode;
            wxLoginReq.iv = wxUserData.iv;
            wxLoginReq.encrypteddata = wxUserData.encryptedData;
            const body = proto.lobby.MsgWxLogin.encode(wxLoginReq).toArrayBuffer();

            HTTP.hPost(
                this.eventTarget,
                wxLoginUrl,
                (xhr: XMLHttpRequest, err: string) => {
                    let errMsg = null;
                    if (err !== null) {
                        errMsg = `登录错误，错误码:${err}`;
                    } else {
                        errMsg = HTTP.hError(xhr);
                        if (errMsg === null) {
                            const data = <Uint8Array>xhr.response;
                            // proto 解码登录结果
                            const wxLoginReply = proto.lobby.MsgLoginReply.decode(data);
                            if (wxLoginReply.result === 0) {
                                Logger.debug("wx login ok, switch to lobbyview");
                                this.saveWxLoginReply(wxLoginReply);
                                this.showLobbyView();
                            } else {
                                // TODO: show error msg
                                Logger.debug("wx login error, errCode:", wxLoginReply.result);
                                // this.showLoginErrMsg(wxLoginReply.result);
                            }
                        }
                    }

                    if (errMsg !== null) {
                        Logger.debug("wx login failed:", errMsg);
                        // 显示错误对话框
                        Dialog.showDialog(errMsg, () => {
                            //
                        });
                    }
                },
                "arraybuffer",
                body);
        }
    }
}
