import { GameError } from "../../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, Enum, KeyConstants, LobbyModuleInterface, Logger, SoundMgr, LEnv } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";
import { AgreementView } from "../AgreementView";
import { OpenType, PhoneAuthView } from "../PhoneAuthView";
import { IconListPopupView } from "./IconListPopupView";

const { ccclass } = cc._decorator;

export enum UserInfoTabType {

    BASE_INFO = 0,
    AUTH_INFO = 1,
    GAME_SETTING = 2

}

/**
 * 用户信息页面
 */
@ccclass
export class UserInfoView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;
    private lm: LobbyModuleInterface;
    ////// 用户基本信息 ////////
    private headLoader: fgui.GLoader;
    private girlRadioBtn: fgui.GButton;

    private mountNode: fgui.GObject;

    private boyRadioBtn: fgui.GButton;
    private userName: cc.EditBox;
    private modifyBtn: fgui.GButton;
    private saveModifyBtn: fgui.GButton;
    private id: fgui.GObject;
    private beanText: fgui.GObject;
    private fkText: fgui.GObject;
    private hupaiText: fgui.GObject;
    private piaolaiText: fgui.GObject;
    private fangpaoText: fgui.GObject;
    private leaveGuildText: fgui.GObject;
    private roundText: fgui.GObject;

    private phone: fgui.GObject;
    private userInfo: fgui.GComponent;

    private changeIconBtn: fgui.GButton;
    private bindPhoneBtn: fgui.GButton;
    private nameBg: fgui.GObject;

    //// 认证信息 //////
    private realName: cc.EditBox;
    private idCard: cc.EditBox;
    private agreementViewBtn: fgui.GButton;
    private authSaveBtn: fgui.GButton;

    /// 游戏设置 /////
    private musicBtn: fgui.GButton;
    private effectBtn: fgui.GButton;
    private clearCacheBtn: fgui.GButton;
    private gpsBtn: fgui.GButton;
    private logoutBtn: fgui.GButton;

    public showView(page: UserInfoTabType): void {
        this.win.show();

        const tabCtrl = this.view.getController("tab");
        tabCtrl.selectedIndex = page;
    }

    /**
     * name
     */
    public changeIcon(url: string): void {
        this.headLoader.url = url;
    }

    protected async onLoad(): Promise<void> {

        this.eventTarget = new cc.EventTarget();

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;

        this.registerHandler();

        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_user_info/lobby_user_info");

        const view = fgui.UIPackage.createObject("lobby_user_info", "userInfoView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        await this.initView();
    }

    protected onDestroy(): void {
        this.unregisterHandler();
        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        SoundMgr.buttonTouch();
        this.destroy();
    }

    private onTouchSound(): void {
        SoundMgr.tabSwitch();

    }
    private registerHandler(): void {
        this.lm.eventTarget.on("onBindPhone", this.onBindPhone, this);
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_MODIFY_ACK, this.onModifyAck, this);
    }

    private unregisterHandler(): void {
        this.lm.eventTarget.off("onBindPhone");
        this.lm.msgCenter.removeGameMsgHandler(proto.casino.eMSG_TYPE.MSG_MODIFY_ACK);
    }

    private async initView(): Promise<void> {
        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const baseInfoBtn = this.view.getChild("baseInfoBtn");
        baseInfoBtn.onClick(this.onTouchSound, this);

        const authInfoBtn = this.view.getChild("authInfoBtn");
        authInfoBtn.onClick(this.onTouchSound, this);

        const gameSettingBtn = this.view.getChild("gameSettingBtn");
        gameSettingBtn.onClick(this.onTouchSound, this);

        await this.initUserBaseInfo();

        await this.initAuthInfo();

        this.initGameSetting();

    }

    private initGameRecord(): void {
        const leaveGuild = DataStore.getString(KeyConstants.LEAVE_GUILD, "0");
        const pdataStr = DataStore.getString(KeyConstants.DATA_GDY, "");
        const playerData = <proto.casino.player_gdy>JSON.parse(pdataStr);

        const hupai = playerData.hupai_total === null ? 0 : playerData.hupai_total;
        const piaolai = playerData.pailaizi_total === null ? 0 : playerData.pailaizi_total;
        const fangchong = playerData.fangchong_total === null ? 0 : playerData.fangchong_total;
        const roundTotal = playerData.play_total === null ? 0 : playerData.play_total;

        this.hupaiText.text = `${hupai}`;
        this.piaolaiText.text = `${piaolai}`;
        this.fangpaoText.text = `${fangchong}`;
        this.roundText.text = `${roundTotal}`;
        this.leaveGuildText.text = `${+leaveGuild}`;
    }

    private async loadEditBox(): Promise<cc.Node> {
        const editboxPrefab = await CommonFunction.loadPrefab("editbox");
        const editBoxNode = cc.instantiate(editboxPrefab);
        editBoxNode.setPosition(0, 0);

        return editBoxNode;
    }

    private async loadIdCardEditBox(): Promise<cc.Node> {
        const editboxPrefab = await CommonFunction.loadPrefab("idCardInput");
        const editBoxNode = cc.instantiate(editboxPrefab);
        editBoxNode.setPosition(0, 0);

        return editBoxNode;
    }
    private async initUserBaseInfo(): Promise<void> {
        const userInfo = this.view.getChild("baseInfoCom").asCom;
        this.userInfo = userInfo;

        const role = userInfo.getController("role");
        this.headLoader = userInfo.getChild("loader").asLoader;
        this.girlRadioBtn = userInfo.getChild("girlRadioBtn").asButton;
        this.boyRadioBtn = userInfo.getChild("boyRadioBtn").asButton;

        this.modifyBtn = userInfo.getChild("modifyBtn").asButton;
        this.modifyBtn.onClick(this.onModifyBtnClick, this);
        this.saveModifyBtn = userInfo.getChild("saveModifyBtn").asButton;
        this.saveModifyBtn.onClick(this.onSaveModifyBtnClick, this);

        this.bindPhoneBtn = userInfo.getChild("bindPhoneBtn").asButton;
        this.bindPhoneBtn.onClick(this.onBindPhoneBtnClick, this);

        const boyRadioBtn = userInfo.getChild("boyRadioBtn").asButton;
        const girlRadioBtn = userInfo.getChild("girlRadioBtn").asButton;

        girlRadioBtn.onClick(this.onGirlRadioBtnClick, this);
        boyRadioBtn.onClick(this.onBoyRadioBtnClick, this);

        this.mountNode = userInfo.getChild("mountNode");
        // 由于fgui输入框有问题，挂载一个cocos creator的editBox
        const nameObj = userInfo.getChild("name");
        const editBoxNode = await this.loadEditBox();
        nameObj.node.addChild(editBoxNode);
        this.userName = editBoxNode.getComponent(cc.EditBox);
        this.userName.enabled = false;
        this.userName.background.enabled = false;

        this.nameBg = userInfo.getChild("bg1");
        this.nameBg.visible = false;

        this.id = userInfo.getChild("id");
        this.beanText = userInfo.getChild("beanText");
        this.fkText = userInfo.getChild("fkText");
        this.phone = userInfo.getChild("phone");
        const phoneText = userInfo.getChild("phoneText");
        phoneText.text = LocalStrings.findString("bindPhone");

        if (LEnv.underReview) {
            userInfo.getChild("fkCombine").visible = false;
            this.fkText.visible = false;
        }

        this.phone.visible = true;
        this.changeIconBtn = userInfo.getChild("changeIconBtn").asButton;
        this.changeIconBtn.onClick(this.onChangeIconBtnClick, this);

        this.hupaiText = userInfo.getChild("hupaiText");
        this.piaolaiText = userInfo.getChild("piaolaiText");
        this.fangpaoText = userInfo.getChild("fangpaoText");
        this.leaveGuildText = userInfo.getChild("tuihuiText");
        this.roundText = userInfo.getChild("jushuText");

        this.userName.string = CommonFunction.nameFormatWithCount(DataStore.getString(KeyConstants.NICK_NAME), 6);
        this.beanText.text = DataStore.getString(KeyConstants.BEANS);
        this.fkText.text = DataStore.getString(KeyConstants.CARD);
        this.id.text = DataStore.getString(KeyConstants.PLAYER_ID);
        this.phone.text = DataStore.getString(KeyConstants.PHONE);

        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");
        const avatarIndex = DataStore.getString(KeyConstants.AVATAR_INDEX, "0");
        const gender = DataStore.getString(KeyConstants.GENDER, "");
        if (+ gender > 0) {
            this.girlRadioBtn.selected = true;
        } else {
            this.boyRadioBtn.selected = true;
        }

        CommonFunction.setHead(this.headLoader, avatarURL, +avatarIndex, +gender);
        this.initGameRecord();
        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.VISITOR) {
            // this.userName.enabled = false;
            role.selectedIndex = 1;

            if (channel === Enum.CHANNEL_TYPE.WECHAT) {
                // 微信登录
                this.bindPhoneBtn.visible = true;
                const controller = this.bindPhoneBtn.getController("bind");
                if (this.phone.text !== "") {
                    controller.selectedIndex = 1;
                } else {
                    controller.selectedIndex = 0;
                }
            } else {
                // 手机登录
                this.bindPhoneBtn.visible = false;
            }
        } else {
            role.selectedIndex = 0;
            this.bindPhoneBtn.visible = false;
        }
    }

    private onBindPhone(): void {
        const controller = this.bindPhoneBtn.getController("bind");
        this.phone.text = DataStore.getString(KeyConstants.PHONE);
        if (this.phone.text !== "") {
            controller.selectedIndex = 1;
        } else {
            controller.selectedIndex = 0;
        }
    }

    private onModifyAck(msg: proto.casino.ProxyMessage): void {
        const reply = proto.casino.packet_modify_ack.decode(msg.Data);
        if (reply.ret !== 0) {
            Logger.error("reply.ret:", reply.ret);
            if (reply.ret === 1) {
                Dialog.prompt(LocalStrings.findString("modifySuccess"));
            } else {
                Dialog.prompt(GameError.getErrorString(reply.ret));
            }

            return;
        }

        Logger.debug("onModifyAck:", reply);

        DataStore.setItem(KeyConstants.NICK_NAME, reply.nickname);
        DataStore.setItem(KeyConstants.GENDER, reply.sex);

        // 游客使用的头像
        DataStore.setItem(KeyConstants.AVATAR_INDEX, reply.avatar);

        this.lm.eventTarget.emit("onUserInfoModify");

        Dialog.prompt(LocalStrings.findString("modifySuccess"));

        // 刷新一遍头像
        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");
        CommonFunction.setHead(this.headLoader, avatarURL, reply.avatar, reply.sex);
    }

    private onChangeIconBtnClick(): void {
        SoundMgr.buttonTouch();

        const view = this.addComponent(IconListPopupView);

        const gender = this.girlRadioBtn.selected ? 0 : 1;

        view.show(this.mountNode, gender, this);

    }
    private onModifyBtnClick(): void {
        SoundMgr.buttonTouch();
        Logger.debug("onModifyBtnClick");
        const controller = this.userInfo.getController("isModify");
        controller.selectedIndex = 1;

        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel === Enum.CHANNEL_TYPE.VISITOR) {
            this.userName.enabled = true;
            this.userName.background.enabled = true;
            // this.userName.asTextInput.editable = true;
            this.changeIconBtn.visible = true;
        } else {
            // this.userName.asTextInput.editable = false;
            this.userName.enabled = false;
            this.userName.background.enabled = false;
            this.changeIconBtn.visible = false;
        }
        // Logger.debug("this.changeIconBtn.enabled:", this.changeIconBtn.enabled);

    }

    private onSaveModifyBtnClick(): void {
        SoundMgr.buttonTouch();
        const controller = this.userInfo.getController("isModify");
        controller.selectedIndex = 0;

        const playerId = DataStore.getString(KeyConstants.PLAYER_ID);

        const req = new proto.casino.packet_modify_req();
        req.nickname = req.nickname = CommonFunction.nameFormatWithCount(this.userName.string, 8, "");
        req.sex = this.boyRadioBtn.selected ? 0 : 1;
        req.player_id = +playerId;

        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel === Enum.CHANNEL_TYPE.VISITOR) {
            // 限制8个字符
            req.avatar = this.getAvatarIndexFromLoaderUrl(this.headLoader.url);
        }

        Logger.debug("req:", req);
        const buf = proto.casino.packet_modify_req.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MODIFY_REQ);

        this.changeIconBtn.visible = false;
        // this.userName.asTextInput.editable = false;
        this.userName.enabled = false;
        this.userName.background.enabled = false;
    }

    private onBindPhoneBtnClick(): void {
        SoundMgr.buttonTouch();
        // 已经绑定，无需再绑定
        if (this.bindPhoneBtn.asButton.getController("bind").selectedIndex === 1) {
            return;
        }

        const view = this.addComponent(PhoneAuthView);
        view.show(OpenType.BIND_PHONE);

    }

    private onGirlRadioBtnClick(): void {
        SoundMgr.buttonTouch();
    }

    private onBoyRadioBtnClick(): void {
        SoundMgr.buttonTouch();
    }

    private getAvatarIndexFromLoaderUrl(url: string): number {
        Logger.debug("getAvatarIndexFromLoaderUrl, url:", url);
        if (url !== "") {
            const indexStr = url.substring(32);
            let index = +indexStr;
            if (index > 3) {
                index = index - 4;
            }

            Logger.debug("getAvatarIndexFromLoaderUrl, indexStr:", index);

            return index;
        }

        return 0;
    }

    private async initAuthInfo(): Promise<void> {
        const authInfo = this.view.getChild("autoInfoCom").asCom;

        const realName = authInfo.getChild("n35");
        const editBoxNode = await this.loadIdCardEditBox();
        realName.node.addChild(editBoxNode);
        realName.x = 333;
        this.realName = editBoxNode.getComponent(cc.EditBox);
        this.realName.maxLength = 8;

        const idCard = authInfo.getChild("n36");
        const idCardEditBox = await this.loadIdCardEditBox();
        idCard.node.addChild(idCardEditBox);
        this.idCard = idCardEditBox.getComponent(cc.EditBox);

        this.agreementViewBtn = authInfo.getChild("agreementViewBtn").asButton;
        this.agreementViewBtn.onClick(this.onAgreementViewBtnClick, this);

        this.authSaveBtn = authInfo.getChild("n20").asButton;
        this.authSaveBtn.onClick(this.onAuthSaveBtnClick, this);

        this.realName.string = DataStore.getString(KeyConstants.REAL_NAME, "");
        this.idCard.string = DataStore.getString(KeyConstants.ID_CARD, "");
        if (this.realName.string !== "" && this.idCard.string !== "") {
            this.authSaveBtn.visible = false;
            this.realName.enabled = false;
            this.idCard.enabled = false;
        } else {
            this.authSaveBtn.visible = true;
            this.realName.enabled = true;
            this.idCard.enabled = true;
        }

    }

    private onAgreementViewBtnClick(): void {
        SoundMgr.buttonTouch();
        this.addComponent(AgreementView);

    }

    private onAuthSaveBtnClick(): void {
        SoundMgr.buttonTouch();
        const nameReg = /^[\u4e00-\u9fa5]*$/;
        if (!nameReg.test(this.realName.string)) {
            Dialog.prompt(LocalStrings.findString("pleaseInputRealName"));

            return;
        }

        const idCardReg = /^[a-z0-9]+$/;
        if (this.idCard.string.length > 18 || this.idCard.string.length < 17) {
            Dialog.prompt(LocalStrings.findString("pleaseInputRealIDCard"));

            return;
        }

        if (!idCardReg.test(this.idCard.string)) {
            Dialog.prompt(LocalStrings.findString("pleaseInputRealIDCard"));

            return;
        }

        DataStore.setItem(KeyConstants.REAL_NAME, this.realName.string);
        DataStore.setItem(KeyConstants.ID_CARD, this.idCard.string);

        this.authSaveBtn.visible = false;
        this.realName.enabled = false;
        this.idCard.enabled = false;
    }

    private initGameSetting(): void {
        const gameSetting = this.view.getChild("gameSettingCom").asCom;
        this.musicBtn = gameSetting.getChild("musicBtn").asButton;
        this.effectBtn = gameSetting.getChild("effectBtn").asButton;
        this.clearCacheBtn = gameSetting.getChild("clearCache").asButton;
        this.gpsBtn = gameSetting.getChild("gpsBtn").asButton;
        this.logoutBtn = gameSetting.getChild("exitBtn").asButton;

        this.musicBtn.onClick(this.onMusicBtnClick, this);
        this.effectBtn.onClick(this.onEffectBtnVolumeClick, this);
        this.clearCacheBtn.onClick(this.onClearCacheBtn, this);
        this.gpsBtn.onClick(this.onGpsBtnClick, this);
        this.logoutBtn.onClick(this.onLogout, this);

        const tag = +DataStore.getString(KeyConstants.VOICE_TAG);
        if (tag === 0) {
            this.clearCacheBtn.grayed = true;
        }

        const musicVolume = DataStore.getString(KeyConstants.MUSIC_VOLUME, "0");
        if (+musicVolume > 0) {
            this.musicBtn.selected = true;
        } else {
            this.musicBtn.selected = false;
        }

        const effectVolume = DataStore.getString(KeyConstants.EFFECT_VOLUME, "0");
        if (+effectVolume > 0) {
            this.effectBtn.selected = true;
        } else {
            this.effectBtn.selected = false;
        }

        const gps = DataStore.getString(KeyConstants.GPS, "0");
        if (+gps > 0) {
            this.gpsBtn.selected = true;
        } else {
            this.gpsBtn.selected = false;
        }

        const controller = gameSetting.getController("role");
        const role = DataStore.getString(KeyConstants.CHANNEL);
        if (role === Enum.CHANNEL_TYPE.VISITOR) {
            controller.selectedIndex = 0;
        } else if (role === Enum.CHANNEL_TYPE.WECHAT) {
            controller.selectedIndex = 1;
        } else if (role === Enum.CHANNEL_TYPE.PHONE) {
            controller.selectedIndex = 2;
        } else {
            Logger.error("initGameSetting unknow login type:", role);
        }
    }

    private onMusicBtnClick(): void {
        SoundMgr.buttonTouch();
        if (this.musicBtn.selected) {
            DataStore.setItem(KeyConstants.MUSIC_VOLUME, 1);
            SoundMgr.playMusic();
        } else {
            DataStore.setItem(KeyConstants.MUSIC_VOLUME, 0);
            SoundMgr.stopMusic();
        }
    }

    private onEffectBtnVolumeClick(): void {
        SoundMgr.buttonTouch();
        if (this.effectBtn.selected) {
            SoundMgr.enableEffects();
            DataStore.setItem(KeyConstants.EFFECT_VOLUME, 1);
        } else {
            SoundMgr.disableEffects();
            DataStore.setItem(KeyConstants.EFFECT_VOLUME, 0);
        }
    }

    private onClearCacheBtn(): void {
        SoundMgr.buttonTouch();
        const tag = +DataStore.getString(KeyConstants.VOICE_TAG);

        if (tag === 0) {
            Dialog.prompt(LocalStrings.findString("noDataClear"));
        } else {
            Dialog.prompt(LocalStrings.findString("voiceDataClear"));
            DataStore.setItem(KeyConstants.VOICE_TAG, 0);
            this.clearCacheBtn.grayed = true;
        }

    }

    private onGpsBtnClick(): void {
        SoundMgr.buttonTouch();
        if (this.gpsBtn.selected) {
            DataStore.setItem(KeyConstants.GPS, 1);
        } else {
            DataStore.setItem(KeyConstants.GPS, 0);
        }

        if (this.gpsBtn.selected) {
            if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
                Dialog.prompt(LocalStrings.findString("gpsEffectOnWeChat"));
                this.gpsBtn.selected = false;

                return;
            }

            wx.getSetting({
                success: (res: getSettingRes) => {
                    console.log(res);
                    const authSetting = <{ 'scope.userInfo': boolean; 'scope.userLocation': boolean }>res.authSetting;
                    if (!authSetting['scope.userLocation']) {
                        this.authorizeLocation();
                    } else {
                        DataStore.setItem(KeyConstants.GPS, 1);
                    }
                },

                // tslint:disable-next-line:no-any
                fail: (err: any) => {
                    Logger.error("getSetting error:", err);
                }
            });
        } else {
            DataStore.setItem(KeyConstants.GPS, 0);
        }
    }

    private authorizeLocation(): void {
        Logger.debug("authorizeLocation");
        wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
                // 用户已经同意小程序使用定位功能
                DataStore.setItem(KeyConstants.GPS, 1);
            },

            // tslint:disable-next-line:no-any
            fail: (err: any) => {
                Logger.debug("authorizeLocation fail:", err);
                DataStore.setItem(KeyConstants.GPS, 0);
                this.gpsBtn.selected = false;

                // [右上角]-[关于]-[右上角]-[设置]
                Dialog.showDialog(LocalStrings.findString('openSettingToAuth'));
            }
        });
    }

    private onLogout(): void {
        SoundMgr.buttonTouch();
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req = new proto.casino.packet_user_logout();
        req.player_id = +playerID;

        const buf = proto.casino.packet_user_logout.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_USER_LOGOUT);
        this.lm.msgCenter.logout();

        this.destroy();
    }
}
