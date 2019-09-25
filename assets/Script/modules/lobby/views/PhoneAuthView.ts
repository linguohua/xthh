import { GameError } from "../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, HTTP, KeyConstants, LEnv, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";
import { InputNumberView } from "./InputNumberView";

const { ccclass } = cc._decorator;

export enum OpenType {

    LOGIN = 0,
    BIND_PHONE = 1

}

interface PhoneLoginInterface {
    requestPhoneLogin(phone: string, code: string, callback: Function): void;
    disableAllBtn(): void;
    enableAllBtn(): void;
}

/**
 * 手机验证页面
 */
@ccclass
export class PhoneAuthView extends cc.Component {
    private win: fgui.Window;

    private view: fgui.GComponent;

    private inputPhone: fgui.GObject;

    private inputAuth: fgui.GObject;
    private getAuthBtn: fgui.GButton;
    private confirmBtn: fgui.GButton;
    private countdownText: fgui.GObject;

    private openType: OpenType;

    private eventTarget: cc.EventTarget;
    private lm: LobbyModuleInterface;

    private loginView: PhoneLoginInterface;
    private phone: string;

    public show(openType: OpenType, login?: PhoneLoginInterface): void {
        this.openType = openType;
        this.loginView = login;
        const view = fgui.UIPackage.createObject("lobby_login", "phoneAuthView").asCom;

        CommonFunction.setViewInCenter(view);
        this.view = view;

        this.initView();
        this.showCountDown();
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();
    }

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        if (this.lm.msgCenter !== null && this.lm.msgCenter !== undefined) {
            this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_BIND_PHONE_ACK, this.onBindPhoneAck, this);
        }
    }
    protected onDestroy(): void {
        if (this.openType === OpenType.LOGIN && this.loginView !== undefined) {
            this.loginView.enableAllBtn();
        }

        if (this.lm.msgCenter !== null && this.lm.msgCenter !== undefined) {
            this.lm.msgCenter.removeGameMsgHandler(proto.casino.eMSG_TYPE.MSG_BIND_PHONE_ACK);
        }

        this.unschedule(this.countDownTick);
        this.eventTarget.emit("destroy");

        this.win.hide();
        this.win.dispose();

    }

    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onInputPhoneBtnClick(): void {
        Logger.debug("onInputPhoneBtnClick");
        const inputNumberView = this.addComponent(InputNumberView);

        const cb = (str: string) => {
            this.inputPhone.asButton.getController("phoneLegal").selectedIndex = 1;
            this.inputPhone.asButton.getChild("text").text = str;
            DataStore.setItem(KeyConstants.INPUT_PHONE, str);
            this.showCountDown();
        };
        const titleStr = LocalStrings.findString("inputPhoneText");
        inputNumberView.show(cb, titleStr, 11);
    }

    private onInputAuthBtnClick(): void {
        Logger.debug("onInputAuthBtnClick");
        const inputNumberView = this.addComponent(InputNumberView);

        const cb = (str: string) => {
            this.inputAuth.asButton.getController("codeLegal").selectedIndex = 1;
            this.inputAuth.asButton.getChild("text").text = str;

            this.confirmBtn.getController("enable").selectedIndex = 1;

        };
        const titleStr = LocalStrings.findString("inputAuthText");
        inputNumberView.show(cb, titleStr, 4);
    }

    private onGetAuthBtnClick(): void {
        if (this.getAuthBtn.getController("enable").selectedIndex === 0) {
            return;
        }

        const lastTimeStr = DataStore.getString(KeyConstants.getAuthCodeTime, "0");
        const lastTime = +lastTimeStr;
        if (Math.floor(Date.now() / 1000) - lastTime < 90) {
            Logger.debug("获取验证码操作太频繁，请稍后重试");

            return;
        }

        const phone = this.inputPhone.asButton.getChild("text").text;

        if (phone.length < 11) {
            Dialog.prompt(LocalStrings.findString("invalidPhone"));

            return;
        }

        this.requireCode(phone);
    }

    private onConfirmBtnClick(): void {
        Logger.debug("onConfirmBtnClick");
        if (this.confirmBtn.getController("enable").selectedIndex === 0) {
            return;
        }

        const phone = this.inputPhone.asButton.getChild("text").text;
        const code = this.inputAuth.asButton.getChild("text").text;

        // 正则表达式，判断字符串是否是数字
        const reg = /^\d+$/;

        if (phone.length < 11 || !reg.test(phone)) {
            Dialog.showDialog(LocalStrings.findString("invalidPhone"));

            return;
        }

        if (code.length < 4 || !reg.test(code)) {
            Dialog.showDialog(LocalStrings.findString("invalidCode"));

            return;
        }

        if (this.openType === OpenType.BIND_PHONE) {
            this.requireBindPhone(phone, code);
        } else {
            if (this.loginView !== undefined) {
                const cb = (err: string) => {
                    if (err !== null && err !== "") {
                        Dialog.showDialog(err);
                    } else {
                        this.destroy();
                    }
                };

                this.loginView.requestPhoneLogin(phone, code, cb);
            }
        }
    }

    private onBindPhoneAck(msg: proto.casino.ProxyMessage): void {
        const reply = proto.casino.packet_bind_phone_ack.decode(msg.Data);
        if (reply.ret !== proto.casino.eRETURN_TYPE.RETURN_BIND_PHONE_SUCCESS) {
            if (reply.ret === proto.casino.eRETURN_TYPE.RETURN_CODE_EXPIRE) {
                Dialog.prompt(LocalStrings.findString("errorAuthCode"));
                this.inputAuth.asButton.getChild("text").text = "";
            } else {
                Dialog.prompt(GameError.getErrorString(reply.ret));
            }

            Logger.debug("onBindPhoneAck reply error:", reply);

            return;
        }

        DataStore.setItem(KeyConstants.PHONE, this.phone);

        if (this.lm !== null) {
            this.lm.eventTarget.emit("onBindPhone");
        }

        Dialog.prompt(LocalStrings.findString("bindPhoneSuccess"));

        // 关闭界面
        this.destroy();

    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const inputPhone = this.view.getChild("inputPhone");
        this.inputPhone = inputPhone;
        inputPhone.onClick(this.onInputPhoneBtnClick, this);

        const inputAuth = this.view.getChild("inputAuth");
        this.inputAuth = inputAuth;
        inputAuth.onClick(this.onInputAuthBtnClick, this);

        const getAuthBtn = this.view.getChild("getAuthBtn");
        this.getAuthBtn = getAuthBtn.asButton;
        getAuthBtn.onClick(this.onGetAuthBtnClick, this);
        this.countdownText = this.getAuthBtn.getChild("text");

        const confirmBtn = this.view.getChild("confirmBtn");
        this.confirmBtn = confirmBtn.asButton;
        confirmBtn.onClick(this.onConfirmBtnClick, this);

        const openType = this.view.getController("type");
        openType.selectedIndex = this.openType;

        const confirmBtnController = confirmBtn.asButton.getController("enable");
        if (inputAuth.asButton.getChild("text").text.length === 4) {
            confirmBtnController.selectedIndex = 1;
        } else {
            confirmBtnController.selectedIndex = 0;
        }

        if (this.openType === OpenType.LOGIN && this.loginView !== undefined) {
            this.loginView.disableAllBtn();
        }

        const phone = DataStore.getString(KeyConstants.INPUT_PHONE, "");
        if (phone !== "") {
            this.inputPhone.asButton.getChild("text").text = phone;
            this.inputPhone.asButton.getController("phoneLegal").selectedIndex = 1;
        }

    }

    private requireCode(phone: string): void {
        const app = LEnv.app === "h5casino" ? LEnv.app : "2";
        const url = LEnv.cfmt(LEnv.phoneAuthCode, LEnv.rootURL, app, phone);

        Logger.debug("requireCode:", url);
        HTTP.hGet(
            this.eventTarget,
            url,
            (xhr: XMLHttpRequest, err: string) => {

                let errMsg;
                if (err !== null) {
                    errMsg = `错误码: ${err} `;
                    Logger.debug(errMsg);
                    Dialog.prompt("网络错误，获取验证码失败!");

                    return;

                }

                errMsg = HTTP.hError(xhr);
                if (errMsg === null) {
                    Logger.debug("xhr.responseText:", xhr.responseText);
                    const jsonObj = <{ ret: number; msg: string; data: {} }>JSON.parse(xhr.responseText);
                    if (jsonObj.ret !== 0) {
                        Logger.error("requireCode, error:", jsonObj.ret);
                        Dialog.showDialog(jsonObj.msg);

                        return;
                    }

                    DataStore.setItem(KeyConstants.getAuthCodeTime, Math.floor(Date.now() / 1000));
                    this.showCountDown();
                    // this.inputAuth.asButton.getChild("text").text =

                } else {
                    Dialog.showDialog(errMsg);
                }

            },
            "text");
    }

    private requireBindPhone(phone: string, code: string): void {
        const bingPhoneReq = new proto.casino.packet_bind_phone_req();
        bingPhoneReq.code = code;
        bingPhoneReq.phone = phone;

        this.phone = phone;

        Logger.debug("requireBindPhone:", bingPhoneReq);
        const buf = proto.casino.packet_bind_phone_req.encode(bingPhoneReq);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_BIND_PHONE_REQ);

    }

    private showCountDown(): void {
        const controller = this.getAuthBtn.getController("enable");
        const lastTimeStr = DataStore.getString(KeyConstants.getAuthCodeTime, "0");
        const lastTime = +lastTimeStr;
        if (Math.floor(Date.now() / 1000) - lastTime < 90) {
            // 倒计时90秒
            this.schedule(this.countDownTick, 1, cc.macro.REPEAT_FOREVER);
            controller.selectedIndex = 0;
        } else {
            if (this.inputPhone.asButton.getChild("text").text.length === 11) {
                controller.selectedIndex = 1;
                this.getAuthBtn.enabled = true;
            } else {
                controller.selectedIndex = 0;
                this.getAuthBtn.enabled = false;
            }
            this.countdownText.text = LocalStrings.findString("sendAuthCode");
        }

    }

    private countDownTick(): void {
        const lastTimeStr = DataStore.getString(KeyConstants.getAuthCodeTime, "0");
        const lastTime = +lastTimeStr;
        const diff = Math.floor(Date.now() / 1000) - lastTime;
        if (diff < 90) {
            this.countdownText.text = `${90 - diff} s后可重发`;
        } else {
            this.getAuthBtn.getController("enable").selectedIndex = 1;
            this.countdownText.text = LocalStrings.findString("sendAuthCode");
        }

    }

}
