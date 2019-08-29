import { GameError } from "../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, Enum, KeyConstants, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";

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
    private userName: fgui.GTextInput;
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

    //// 认证信息 //////
    private realName: fgui.GObject;
    private idCard: fgui.GObject;
    private agreementViewBtn: fgui.GButton;

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
        this.userInfo = userInfo;

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

        this.userName = userInfo.getChild("name").asTextInput;
        this.userName.editable = false;
        this.id = userInfo.getChild("id");
        this.beanText = userInfo.getChild("beanText");
        this.fkText = userInfo.getChild("fkText");
        this.phone = userInfo.getChild("phone");
        this.changeIconBtn = userInfo.getChild("changeIconBtn").asButton;
        // this.changeIconBtn.enabled = false;
        this.changeIconBtn.onClick(this.onChangeIconBtnClick, this);

        this.headList = userInfo.getChild("list").asList;
        this.headList.visible = false;
        this.headList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderHeadListItem(index, item);
        };
        this.headList.numItems = 11;

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

    private onModifyAck(msg: proto.casino.ProxyMessage): void {
        const reply = proto.casino.packet_modify_ack.decode(msg.Data);
        if (reply.ret !== 0) {
            Logger.error("reply.ret:", reply.ret);
            Dialog.prompt(GameError.getErrorString(reply.ret));

            return;
        }

        Logger.debug("onModifyAck:", reply);

        DataStore.setItem(KeyConstants.NICK_NAME, reply.nickname);
        DataStore.setItem(KeyConstants.SEX, reply.sex);

        Dialog.prompt(LocalStrings.findString("modifySuccess"));
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
    }
    private onModifyBtnClick(): void {
        Logger.debug("onModifyBtnClick");
        const controller = this.userInfo.getController("isModify");
        controller.selectedIndex = 1;

        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.WECHAT) {
            this.userName.editable = true;
            this.changeIconBtn.visible = true;
        } else {
            this.userName.editable = false;
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

        Logger.debug("req:", req);
        const buf = proto.casino.packet_modify_req.encode(req);
        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MODIFY_REQ);

        this.headList.visible = false;
        this.headListBg.visible = false;
        this.changeIconBtn.visible = false;
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
        // this.agreementViewBtn = authInfo.getChild("n27").asButton;
        // this.agreementViewBtn.onClick(this.onAgreementViewBtnClick, this);

        const saveBtn = authInfo.getChild("n20").asButton;
        saveBtn.onClick(this.onAuthSaveBtnClick, this);
    }

    // private onAgreementViewBtnClick(): void {
    //     Logger.debug("onAgreementViewBtnClick");
    // }

    private onAuthSaveBtnClick(): void {
        Logger.debug("onAuthSaveBtnClick");
    }

    private initGameSetting(): void {
        const gameSetting = this.view.getChild("gameSettingCom").asCom;
        this.musicBtn = gameSetting.getChild("musicBtn").asButton;
        this.effectBtn = gameSetting.getChild("effectBtn").asButton;
        this.clearCacheBtn = gameSetting.getChild("clearCache").asButton;
        this.gpsBtn = gameSetting.getChild("gpsBtn").asButton;
    }

    private renderHeadListItem(index: number, item: fgui.GObject): void {
        Logger.debug("renderHeadListItem");
        const obj = item.asCom;
        obj.getChild("n69").asLoader.url = `ui://lobby_user_info/grxx_xttx_${index}`;
    }

}
