import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";

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
    ////// 用户基本信息 ////////
    private headLoader: fgui.GLoader;
    private girlRadioBtn: fgui.GButton;
    private boyRadioBtn: fgui.GButton;
    private userName: fgui.GObject;
    private modifyBtn: fgui.GButton;
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

    //// 认证信息 //////
    private realName: fgui.GObject;
    private idCard: fgui.GObject;
    private viewBtn: fgui.GButton;

    /// 游戏设置 /////
    private musicBtn: fgui.GButton;
    private effectBtn: fgui.GButton;
    private clearCacheBtn: fgui.GButton;
    private gpsBtn: fgui.GButton;

    public showView(page: UserInfoTabType): void {
        this.win.show();

        const tabCtrl = this.view.getController("tab");
        tabCtrl.selectedIndex = page;
    }

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_user_info/lobby_user_info");

        const view = fgui.UIPackage.createObject("lobby_user_info", "userInfoView").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initView();
    }

    protected onDestroy(): void {

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

    private initUserBaseInfo(): void {
        const userInfo = this.view.getChild("baseInfoCom").asCom;
        this.headLoader = userInfo.getChild("loader").asLoader;
        this.girlRadioBtn = userInfo.getChild("girlRadioBtn").asButton;
        this.boyRadioBtn = userInfo.getChild("boyRadioBtn").asButton;
        this.modifyBtn = userInfo.getChild("modifyBtn").asButton;
        this.modifyBtn.onClick(this.onModifyBtnClick, this);

        this.fkRecordTap = userInfo.getChild("fkRecordTap").asButton;
        this.fkRecordTap.onClick(this.onFkRecordTapClick, this);

        this.beanRecordTap = userInfo.getChild("beanRecordTap").asButton;
        this.beanRecordTap.onClick(this.onBeanRecordTapClick, this);

        this.userName = userInfo.getChild("name");
        this.id = userInfo.getChild("id");
        this.beanText = userInfo.getChild("beanText");
        this.fkText = userInfo.getChild("fkText");
        this.phone = userInfo.getChild("phone");

        this.hupaiText = userInfo.getChild("hupaiText");
        this.piaolaiText = userInfo.getChild("piaolaiText");
        this.chaoshiText = userInfo.getChild("chaoshiText");
        this.fangpaoText = userInfo.getChild("fangpaoText");

        this.userName.text = CommonFunction.nameFormatWithCount(DataStore.getString(KeyConstants.NICK_NAME), 6);
        this.beanText.text = DataStore.getString(KeyConstants.BEANS);
        this.fkText.text = DataStore.getString(KeyConstants.CARD);
        this.id.text = DataStore.getString(KeyConstants.PLAYER_ID);

        const gender = DataStore.getString(KeyConstants.GENDER, "");
        const avatarURL = DataStore.getString(KeyConstants.AVATAR_URL, "");

        if (+gender > 0) {
            this.boyRadioBtn.selected = true;
        } else {
            this.girlRadioBtn.selected = true;
        }

        CommonFunction.setHead(this.headLoader, avatarURL, +gender);

        const controller = userInfo.getController("record");
        if (controller.selectedIndex === 0) {
            // 房卡战绩
        } else {
            // 欢乐豆
        }

    }

    private onModifyBtnClick(): void {
        Logger.debug("onModifyBtnClick");
    }

    private onFkRecordTapClick(): void {
        Logger.debug("onFkRecordTapClick");
    }

    private onBeanRecordTapClick(): void {
        Logger.debug("onBeanRecordTapClick");
    }

    private initAuthInfo(): void {
        const authInfo = this.view.getChild("autoInfoCom").asCom;
        this.realName = authInfo.getChild("n35");
        this.idCard = authInfo.getChild("n36");
        this.viewBtn = authInfo.getChild("n27").asButton;
    }

    private initGameSetting(): void {
        const gameSetting = this.view.getChild("gameSettingCom").asCom;
        this.musicBtn = gameSetting.getChild("musicBtn").asButton;
        this.effectBtn = gameSetting.getChild("effectBtn").asButton;
        this.clearCacheBtn = gameSetting.getChild("clearCache").asButton;
        this.gpsBtn = gameSetting.getChild("gpsBtn").asButton;
    }

}
