import { GameError } from "../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, Enum, KeyConstants, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";
import { AgreementView } from "./AgreementView";
import { OpenType, PhoneAuthView } from "./PhoneAuthView";

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
    private boyRadioBtn: fgui.GButton;
    private userName: fgui.GObject;
    private modifyBtn: fgui.GButton;
    private saveModifyBtn: fgui.GButton;
    private id: fgui.GObject;
    private beanText: fgui.GObject;
    private fkText: fgui.GObject;
    private hupaiText: fgui.GObject;
    private piaolaiText: fgui.GObject;
    private chaoshiText: fgui.GObject;
    private fangpaoText: fgui.GObject;
    private phone: fgui.GObject;
    private fkRecordTap: fgui.GButton;
    private beanRecordTap: fgui.GButton;
    private userInfo: fgui.GComponent;
    private headList: fgui.GList;
    private headListBg: fgui.GObject;
    private changeIconBtn: fgui.GButton;
    private bindPhoneBtn: fgui.GButton;

    //// 认证信息 //////
    private realName: fgui.GTextInput;
    private idCard: fgui.GTextInput;
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

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_user_info/lobby_user_info");

        const view = fgui.UIPackage.createObject("lobby_user_info", "userInfoView").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initView();

        lm.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_MODIFY_ACK, this.onModifyAck, this);
        lm.eventTarget.on("onBindPhone", this.onBindPhone, this);
    }

    protected onDestroy(): void {
        this.lm.eventTarget.off("onBindPhone");
        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private initView(): void {
        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        this.initUserBaseInfo();

        this.initAuthInfo();

        this.initGameSetting();

    }

    private initGameRecord(): void {
        let hupai: number = 0;
        let piaolai: number = 0;
        let timeout: number = 0;
        let fangchong: number = 0;

        const pdataStr = DataStore.getString(KeyConstants.DATA_GDY, "");
        const playerData = <proto.casino.player_gdy>JSON.parse(pdataStr);

        if (playerData.pailaizi_today !== null) {
            piaolai = playerData.pailaizi_total;
        }

        if (playerData.hupai_total !== null) {
            hupai = playerData.hupai_total;
        }

        if (playerData.timeout_total !== null) {
            timeout = playerData.timeout_total;
        }

        if (playerData.fangchong_total !== null) {
            fangchong = playerData.fangchong_total;
        }

        this.hupaiText.text = `${hupai}`;
        this.piaolaiText.text = `${piaolai}`;
        this.chaoshiText.text = `${timeout}`;
        this.fangpaoText.text = `${fangchong}`;
    }
    private initUserBaseInfo(): void {
        const userInfo = this.view.getChild("baseInfoCom").asCom;
        this.userInfo = userInfo;

        const role = userInfo.getController("role");

        this.headLoader = userInfo.getChild("loader").asLoader;
        this.girlRadioBtn = userInfo.getChild("girlRadioBtn").asButton;
        this.boyRadioBtn = userInfo.getChild("boyRadioBtn").asButton;

        this.modifyBtn = userInfo.getChild("modifyBtn").asButton;
        this.modifyBtn.onClick(this.onModifyBtnClick, this);

        this.saveModifyBtn = userInfo.getChild("saveModifyBtn").asButton;
        this.saveModifyBtn.onClick(this.onSaveModifyBtn, this);

        this.fkRecordTap = userInfo.getChild("fkRecordTap").asButton;
        this.fkRecordTap.onClick(this.onFkRecordTapClick, this);

        this.beanRecordTap = userInfo.getChild("beanRecordTap").asButton;
        this.beanRecordTap.onClick(this.onBeanRecordTapClick, this);

        this.bindPhoneBtn = userInfo.getChild("bindPhoneBtn").asButton;
        this.bindPhoneBtn.onClick(this.onBindPhoneBtnClick, this);

        this.userName = userInfo.getChild("name");
        this.userName.asTextInput.editable = false;
        this.id = userInfo.getChild("id");
        this.beanText = userInfo.getChild("beanText");
        this.fkText = userInfo.getChild("fkText");
        this.phone = userInfo.getChild("phone");
        const phoneText = userInfo.getChild("phoneText");
        phoneText.text = LocalStrings.findString("bindPhone");

        this.phone.visible = true;
        this.changeIconBtn = userInfo.getChild("changeIconBtn").asButton;
        this.changeIconBtn.onClick(this.onChangeIconBtnClick, this);

        this.headList = userInfo.getChild("list").asList;
        this.headList.visible = false;
        this.headList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderHeadListItem(index, item);
        };
        this.headList.on(fgui.Event.CLICK_ITEM, this.onHeadListItemClick, this);

        this.headListBg = userInfo.getChild("listBg");
        this.headListBg.visible = false;

        this.hupaiText = userInfo.getChild("hupaiText");
        this.piaolaiText = userInfo.getChild("piaolaiText");
        this.chaoshiText = userInfo.getChild("chaoshiText");
        this.fangpaoText = userInfo.getChild("fangpaoText");

        this.userName.text = CommonFunction.nameFormatWithCount(DataStore.getString(KeyConstants.NICK_NAME), 6);
        this.beanText.text = DataStore.getString(KeyConstants.BEANS);
        this.fkText.text = DataStore.getString(KeyConstants.CARD);
        this.id.text = DataStore.getString(KeyConstants.PLAYER_ID);
        this.phone.text = DataStore.getString(KeyConstants.PHONE);

        const gender = DataStore.getString(KeyConstants.GENDER, "");
        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");
        const avatarIndex = DataStore.getString(KeyConstants.AVATAR_INDEX, "");

        if (+gender > 0) {
            this.boyRadioBtn.selected = true;
        } else {
            this.girlRadioBtn.selected = true;
        }

        if (avatarURL !== "" || avatarIndex === "" || avatarIndex === "0") {
            CommonFunction.setHead(this.headLoader, avatarURL, +gender);
        } else {
            this.headLoader.url = `ui://lobby_bg_package/grxx_xttx_${avatarIndex}`;
        }

        this.initGameRecord();

        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.VISITOR) {
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
        this.phone.text = DataStore.getString(KeyConstants.PHONE);
    }
    private onModifyAck(msg: proto.casino.ProxyMessage): void {
        const reply = proto.casino.packet_modify_ack.decode(msg.Data);
        if (reply.ret !== 0) {
            Logger.error("reply.ret:", reply.ret);
            Dialog.prompt(GameError.getErrorString(reply.ret));

            return;
        }

        Logger.debug("onModifyAck:", reply);

        DataStore.setItem(KeyConstants.NICK_NAME, reply.nickname);
        DataStore.setItem(KeyConstants.GENDER, reply.sex);

        // 游客使用的头像
        DataStore.setItem(KeyConstants.AVATAR_INDEX, reply.avatar);

        this.lm.eventTarget.emit("onAvatarChange");

        Dialog.prompt(LocalStrings.findString("modifySuccess"));

        // 刷新一遍头像
        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");
        if (avatarURL !== "" || reply.avatar === 0) {
            CommonFunction.setHead(this.headLoader, avatarURL, reply.sex);
        } else {
            this.headLoader.url = `ui://lobby_bg_package/grxx_xttx_${reply.avatar}`;
        }
    }

    private onChangeIconBtnClick(): void {
        Logger.debug("onChangeIconBtnClick");
        if (this.headList.visible) {
            this.headList.visible = false;
            this.headListBg.visible = false;
        } else {
            this.headList.visible = true;
            this.headListBg.visible = true;
        }

        this.headList.numItems = 4;
    }
    private onModifyBtnClick(): void {
        Logger.debug("onModifyBtnClick");
        const controller = this.userInfo.getController("isModify");
        controller.selectedIndex = 1;

        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel === Enum.CHANNEL_TYPE.VISITOR) {
            this.userName.asTextInput.editable = true;
            this.changeIconBtn.visible = true;
        } else {
            this.userName.asTextInput.editable = false;
            this.changeIconBtn.visible = false;
        }

        // Logger.debug("this.changeIconBtn.enabled:", this.changeIconBtn.enabled);

    }

    private onSaveModifyBtn(): void {
        Logger.debug("onSaveModifyBtn");
        const controller = this.userInfo.getController("isModify");
        controller.selectedIndex = 0;

        const playerid = DataStore.getString(KeyConstants.PLAYER_ID);

        const req = new proto.casino.packet_modify_req();
        req.nickname = this.userName.text;
        req.sex = this.boyRadioBtn.selected ? 1 : 0;
        req.player_id = +playerid;

        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel === Enum.CHANNEL_TYPE.VISITOR) {
            let avatarIndex = this.getAvatarIndexFromLoaderUrl(this.headLoader.url);
            // 如果头像与性别不对应，则默认选个头像
            if (req.sex > 0 && avatarIndex < 5) {
                avatarIndex = 8;
            } else if (req.sex < 1 && avatarIndex > 4) {
                avatarIndex = 4;
            }

            req.avatar = avatarIndex;
        }

        Logger.debug("req:", req);
        const buf = proto.casino.packet_modify_req.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MODIFY_REQ);

        this.headList.visible = false;
        this.headListBg.visible = false;
        this.changeIconBtn.visible = false;
        this.userName.asTextInput.editable = false;
    }

    private onFkRecordTapClick(): void {
        Logger.debug("onFkRecordTapClick");
    }

    private onBeanRecordTapClick(): void {
        Logger.debug("onBeanRecordTapClick");
    }

    private onBindPhoneBtnClick(): void {
        Logger.debug("onBindPhoneBtnClick");
        const view = this.addComponent(PhoneAuthView);
        view.show(OpenType.BIND_PHONE);

    }

    private onHeadListItemClick(clickItem: fgui.GObject): void {
        Logger.debug("clickItem index:", this.headList.getChildIndex(clickItem));

        const obj = clickItem.asCom;
        this.headLoader.url = obj.getChild("n69").asLoader.url;
    }

    private getAvatarIndexFromLoaderUrl(url: string): number {
        Logger.debug("getAvatarIndexFromLoaderUrl, url:", url);
        if (url !== "") {
            const indexStr = url.substring(32);
            Logger.debug("getAvatarIndexFromLoaderUrl, indexStr:", indexStr);

            return +indexStr;
        }

        return 0;
    }

    private initAuthInfo(): void {
        const authInfo = this.view.getChild("autoInfoCom").asCom;
        this.realName = authInfo.getChild("n35").asTextInput;
        this.realName.requestFocus();
        this.idCard = authInfo.getChild("n36").asTextInput;
        this.idCard.requestFocus();
        this.agreementViewBtn = authInfo.getChild("agreementViewBtn").asButton;
        this.agreementViewBtn.onClick(this.onAgreementViewBtnClick, this);

        this.authSaveBtn = authInfo.getChild("n20").asButton;
        this.authSaveBtn.onClick(this.onAuthSaveBtnClick, this);

        this.realName.text = DataStore.getString(KeyConstants.REAL_NAME, "");
        this.idCard.text = DataStore.getString(KeyConstants.ID_CARD, "");
        if (this.realName.text !== "" && this.idCard.text !== "") {
            this.authSaveBtn.visible = false;
        } else {
            this.authSaveBtn.visible = true;
            this.realName.editable = true;
            this.idCard.editable = true;
        }

    }

    private onAgreementViewBtnClick(): void {
        Logger.debug("onAgreementViewBtnClick");
        this.addComponent(AgreementView);

    }

    private onAuthSaveBtnClick(): void {
        Logger.debug("onAuthSaveBtnClick");
        if (this.idCard.text.length !== 18) {
            Dialog.prompt("请输入正确的身份证号码");

            return;
        }

        DataStore.setItem(KeyConstants.REAL_NAME, this.realName.text);
        DataStore.setItem(KeyConstants.ID_CARD, this.idCard.text);

        this.authSaveBtn.visible = false;
        this.realName.editable = false;
        this.idCard.editable = false;
    }

    private initGameSetting(): void {
        const gameSetting = this.view.getChild("gameSettingCom").asCom;
        this.musicBtn = gameSetting.getChild("musicBtn").asButton;
        this.effectBtn = gameSetting.getChild("effectBtn").asButton;
        this.clearCacheBtn = gameSetting.getChild("clearCache").asButton;
        this.gpsBtn = gameSetting.getChild("gpsBtn").asButton;
        this.logoutBtn = gameSetting.getChild("exitBtn").asButton;
        this.musicBtn.onClick(this.onMusiceBtnClick, this);
        this.effectBtn.onClick(this.onEffectBtnVolumeClick, this);
        this.clearCacheBtn.onClick(this.onClearCacheBtn, this);
        this.gpsBtn.onClick(this.onGpsBtnClick, this);
        this.logoutBtn.onClick(this.onLogout, this);

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

    private onMusiceBtnClick(): void {
        if (this.musicBtn.selected) {
            cc.audioEngine.setMusicVolume(1);
            DataStore.setItem(KeyConstants.MUSIC_VOLUME, 1);
        } else {
            cc.audioEngine.setMusicVolume(0);
            DataStore.setItem(KeyConstants.MUSIC_VOLUME, 0);
        }
    }

    private onEffectBtnVolumeClick(): void {
        if (this.effectBtn.selected) {
            cc.audioEngine.setEffectsVolume(1);
            DataStore.setItem(KeyConstants.EFFECT_VOLUME, 1);
        } else {
            cc.audioEngine.setEffectsVolume(0);
            DataStore.setItem(KeyConstants.EFFECT_VOLUME, 0);
        }
    }

    private onClearCacheBtn(): void {
        Logger.debug("onClearCacheBtn");
        Dialog.prompt(LocalStrings.findString("noDataClearn"));
    }

    private onGpsBtnClick(): void {
        if (this.gpsBtn.selected) {
            DataStore.setItem(KeyConstants.GPS, 1);
        } else {
            DataStore.setItem(KeyConstants.GPS, 0);
        }
    }

    private onLogout(): void {
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req = new proto.casino.packet_user_logout();
        req.player_id = +playerID;

        const buf = proto.casino.packet_user_logout.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_USER_LOGOUT);
        this.lm.msgCenter.logout();

        this.win.hide();
        this.win.dispose();
        this.destroy();
    }

    private renderHeadListItem(index: number, item: fgui.GObject): void {
        Logger.debug("renderHeadListItem");
        let itemIndex = index + 1;
        if (this.boyRadioBtn.selected) {
            itemIndex = index + 5;
        }
        const obj = item.asCom;
        obj.getChild("n69").asLoader.url = `ui://lobby_bg_package/grxx_xttx_${itemIndex}`;
    }

}
