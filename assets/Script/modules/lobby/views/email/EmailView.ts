import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../../protobufjs/long");
import { proto } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";
import { RewardView } from "../reward/RewardViewExports";

const { ccclass } = cc._decorator;

const REWARD_IMG: { [key: number]: string } = {
    [proto.casino.eRESOURCE.RESOURCE_BEANS]: "ui://lobby_bg_package/ty_icon_hld",
    [proto.casino.eRESOURCE.RESOURCE_CARD]: "ui://lobby_bg_package/ty_icon_fk",
    [proto.casino.eRESOURCE.RESOURCE_RED]: "ui://lobby_bg_package/ty_hb",
    [proto.casino.eRESOURCE.RESOURCE_GOLD]: "ui://lobby_bg_package/ty_icon_jb"
};

/**
 * EmailView
 */
@ccclass
export class EmailView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    // 没有邮件时的提示
    private noEmailText: fgui.GTextField;

    private takeBtn: fgui.GButton;
    private deleteBtn: fgui.GButton;

    private textComponent: fgui.GComponent;

    // 邮件列表
    private emailList: fgui.GList;
    // 附件列表
    private attachmentsList: fgui.GList;
    // 邮件标题
    private titleText: fgui.GTextField;

    // 所有邮件
    private playerEmails: proto.casino.Iplayer_mail[];

    // 当前选择的邮件
    private selectPlayerEmail: proto.casino.Iplayer_mail;

    // 节点
    private selectEmailNode: fgui.GObject;

    private delEmail: boolean = false;

    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_email/lobby_email");
        const view = fgui.UIPackage.createObject("lobby_email", "emailView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;
        this.initView();
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();
    }

    protected onDestroy(): void {

        // 保存起来，因为邮件不能频繁拉取，如果拉取不到，则用本地的数据
        this.savePlayerEmails2DataStore(this.playerEmails);
        this.checkEmailAllRead();

        this.unRegisterHander();
        this.win.hide();
        this.win.dispose();

    }

    private registerHandler(): void {
        // 网络消息在LobbyView中定义，然后派发到此页面
        this.lm.eventTarget.on("onMailAck", this.onEmailAck, this);
    }
    private unRegisterHander(): void {
        // 取消消息订阅
        this.lm.eventTarget.off("onMailAck");
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const noEmailText = this.view.getChild("noEmailText").asTextField;
        this.noEmailText = noEmailText;

        const takeBtn = this.view.getChild("takeBtn").asButton;
        takeBtn.onClick(this.onTakeBtnClick, this);
        this.takeBtn = takeBtn;

        const deleteBtn = this.view.getChild("deleteBtn").asButton;
        deleteBtn.onClick(this.onDeleteBtnClick, this);
        this.deleteBtn = deleteBtn;

        const textComponent = this.view.getChild("textComponent").asCom;
        this.textComponent = textComponent;

        const emailList = this.view.getChild("emailList").asList;
        this.emailList = emailList;
        this.emailList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderListItem(index, item);
        };
        this.emailList.setVirtual();

        //附件列表
        this.attachmentsList = this.view.getChild("attachmentList").asList;
        this.attachmentsList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderAttachmentListItem(index, item);
        };

        const titleText = this.view.getChild("titleText").asTextField;
        this.titleText = titleText;
        this.registerHandler();
        this.reloadEmail();

    }

    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onDeleteBtnClick(): void {
        const playerEmail = this.selectPlayerEmail;
        const playerId = DataStore.getString(KeyConstants.PLAYER_ID);
        const req2 = new proto.casino.packet_mail_req();
        req2.mail_id = playerEmail.id;
        req2.player_id = +playerId;
        req2.gain = true;
        req2.del = true;
        const buf = proto.casino.packet_mail_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);
        this.delEmail = true;
    }

    private onTakeBtnClick(): void {
        const playerEmail = this.selectPlayerEmail;

        const playerId = DataStore.getString(KeyConstants.PLAYER_ID);
        const req2 = new proto.casino.packet_mail_req();
        req2.mail_id = playerEmail.id;
        req2.player_id = +playerId;
        req2.gain = true;
        const buf = proto.casino.packet_mail_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);
    }

    private reloadEmail(): void {
        const req2 = new proto.casino.packet_mail_req();
        req2.player_id = 0;
        req2.gain = false;
        const buf = proto.casino.packet_mail_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);

    }

    private readEmail(id: long): void {
        const req2 = new proto.casino.packet_mail_req();
        req2.mail_id = id;
        req2.gain = false;
        const buf = proto.casino.packet_mail_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);
    }

    /**
     * 关于邮件的回复，加载，领取，删除,读取
     * @param msg 信息
     */
    private onEmailAck(mailData: proto.casino.packet_mail_ack): void {

        // const mailData = proto.casino.packet_mail_ack.decode(msg.Data);
        Logger.debug("onEmailAck --------------------------", mailData);

        if (mailData.ret === proto.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
            // 拉取邮件列表，id === 0
            if (CommonFunction.toNumber(mailData.mail_id) === 0) {
                const playerEmails = mailData.mails;
                this.savePlayerEmails2DataStore(playerEmails);
                this.refreshEmailList(playerEmails);
            } else {
                //const count = self.m_sDatas;
                // 如果有附件，这判断是删除还是领取
                if (mailData.gain) {

                    if (this.delEmail === true) {
                        this.deleteEmail();
                        this.delEmail = false;
                    } else {
                        const view = this.addComponent(RewardView);
                        view.showView(this.lm, mailData.gains);
                        this.changeReceiveState();
                    }
                } else {
                    // 没附件，直接修改读取时间
                    this.changeReceiveState();
                }
            }

        } else if (mailData.ret === proto.casino.eRETURN_TYPE.RETURN_WAIT) {
            // 频繁拉取回复，从本地拉取
            if (CommonFunction.toNumber(mailData.mail_id) === 0) {

                this.loadPlayerEmailsFromDataStore();
            }
        }
    }

    private loadPlayerEmailsFromDataStore(): void {
        const playerEmailsStr = DataStore.getString(KeyConstants.PLAYER_EMAIL);
        const playerEmails = <proto.casino.Iplayer_mail[]>JSON.parse(playerEmailsStr);

        this.refreshEmailList(playerEmails);
    }

    private savePlayerEmails2DataStore(playerEmails: proto.casino.Iplayer_mail[]): void {
        const emailData = JSON.stringify(playerEmails);
        DataStore.setItem(KeyConstants.PLAYER_EMAIL, emailData);
    }
    private refreshEmailList(playerEmails: proto.casino.Iplayer_mail[]): void {

        playerEmails.sort((a: proto.casino.Iplayer_mail, b: proto.casino.Iplayer_mail) => {

            return CommonFunction.toNumber(a.view_time) - CommonFunction.toNumber(b.view_time);
        });

        this.playerEmails = [];
        for (const email of playerEmails) {
            if (email.data !== null) {
                this.playerEmails.push(email);
            } else {
                Logger.error("filter email ", email);
            }
        }

        for (let i = 0; i < this.playerEmails.length; i++) {
            const element = this.playerEmails[i];
            Logger.debug(`第 ${i} 个 的 创建时间 = ${CommonFunction.toNumber(element.view_time)} `);
        }

        //this.playerEmails = playerEmails;
        this.emailList.numItems = this.playerEmails.length;
        //默认选择第一个
        this.selectFirst();
    }

    /**
     * 选中第一个
     */
    private selectFirst(): void {
        if (this.playerEmails.length > 0) {
            this.emailList.selectedIndex = 0;
            const obj = this.emailList.getChildAt(0);
            const email = this.playerEmails[0];
            this.selectEmail(email, obj, 0);
            this.noEmailText.visible = false;
        } else {
            this.noEmailText.visible = true;
            this.titleText.text = "";
            this.textComponent.getChild("text").text = "";
            this.selectEmailNode = null;
            this.selectPlayerEmail = null;
            this.deleteBtn.visible = false;
            this.takeBtn.visible = false;
            this.attachmentsList.numItems = 0;
        }
    }

    /**
     * 删除邮件
     */
    private deleteEmail(): void {
        const index = this.playerEmails.indexOf(this.selectPlayerEmail);

        this.playerEmails.splice(index, 1);
        this.emailList.numItems = this.playerEmails.length;

        this.emailList.scrollToView(0);
        this.selectFirst();
    }

    /**
     * 修改领取标志和更新列表
     */
    private changeReceiveState(): void {
        const index = this.playerEmails.indexOf(this.selectPlayerEmail);

        this.selectPlayerEmail.view_time = long.fromNumber(this.lm.msgCenter.getServerTime());
        this.playerEmails[index] = this.selectPlayerEmail;
        this.emailList.numItems = this.playerEmails.length;
        this.selectEmail(this.selectPlayerEmail, this.selectEmailNode, index);
    }

    private checkEmailAllRead(): void {

        if (this.playerEmails === undefined || this.playerEmails.length === 0) {
            DataStore.setItem(KeyConstants.UNREAD_EMAIL, 0);
            this.lm.eventTarget.emit("emailAllRead");

            return;
        }

        for (const email of this.playerEmails) {

            const viewTime = CommonFunction.toNumber(email.view_time);
            if (viewTime === 0) {
                return;
            }
        }

        DataStore.setItem(KeyConstants.UNREAD_EMAIL, 0);
        this.lm.eventTarget.emit("emailAllRead");
    }

    /**
     * 选择Email
     * @param playerEmail 选择的邮件
     * @param obj UI节点
     * @param index 列表Index
     */
    private selectEmail(playerEmail: proto.casino.Iplayer_mail, obj: fgui.GObject, index: number): void {

        this.selectPlayerEmail = playerEmail;
        this.selectEmailNode = obj;

        const email = playerEmail.data;
        this.textComponent.getChild("text").text = email.content;
        this.titleText.text = email.title;

        const viewTime = CommonFunction.toNumber(playerEmail.view_time);
        const receive = viewTime > 0;

        this.deleteBtn.visible = receive;
        this.takeBtn.visible = !receive;

        const length = this.selectPlayerEmail.data.gains.length;

        if (length === 0) {
            this.takeBtn.visible = false;
        }

        if (length === 0 && viewTime === 0) {
            this.readEmail(playerEmail.id);
            // obj.asCom.getChild("redPoint").visible = false;
            // this.deleteBtn.visible = true;
        }

        this.updateAttachmentsView();

    }

    private renderListItem(index: number, obj: fgui.GObject): void {

        const playerEmail = this.playerEmails[index];
        const email = playerEmail.data;

        const title = obj.asCom.getChild("title");
        title.text = email.title;

        const redPoint = obj.asCom.getChild("redPoint");

        const viewTime = CommonFunction.toNumber(playerEmail.view_time);

        if (viewTime === 0) {
            redPoint.visible = true;
        } else {
            redPoint.visible = false;
        }

        const sender = obj.asCom.getChild("sender");
        sender.text = LocalStrings.findString("sender", email.sender);

        const receiveCtrl = obj.asCom.getController("receive");

        const receive = viewTime > 0;
        receiveCtrl.selectedIndex = receive ? 0 : 1;

        //空白按钮，为了点击列表，并且保留item被选择的效果
        const btn = obj.asCom.getChild("spaceBtn");
        btn.offClick(undefined, undefined);
        btn.onClick(() => {
            this.selectEmail(playerEmail, obj, index);
            // tslint:disable-next-line:align
        }, this);

    }

    /**
     * 更新附件列表
     */
    private updateAttachmentsView(): void {
        const email = this.selectPlayerEmail.data;
        const gains = email.gains;
        const filterGains: proto.casino.Iobject[] = [];
        for (const gain of gains) {
            // TODO: 现在已过滤经验，等资源出了，在放开限制
            if (gain.type !== proto.casino.eTYPE.TYPE_RESOURCE) {
                continue;
            }

            filterGains.push(gain);

        }

        this.attachmentsList.numItems = filterGains.length;

    }

    /**
     * 刷新附件
     * @param index 第几个
     * @param obj 该UI对象
     */
    private renderAttachmentListItem(index: number, obj: fgui.GObject): void {

        const email = this.selectPlayerEmail.data;
        const gains = email.gains;
        const filterGains: proto.casino.Iobject[] = [];

        const receive = CommonFunction.toNumber(this.selectPlayerEmail.view_time) > 0;

        for (const gain of gains) {
            // TODO: 现在已过滤经验，等资源出了，在放开限制
            if (gain.type !== proto.casino.eTYPE.TYPE_RESOURCE) {
                continue;
            }
            filterGains.push(gain);

        }

        const selectGain = filterGains[index];
        const loader = obj.asCom.getChild("loader").asLoader;
        const count = obj.asCom.getChild("count");
        const tick = obj.asCom.getChild("tick");
        const url = REWARD_IMG[selectGain.id];
        if (url === undefined || url === null || url === "") {
            Logger.error(`renderAttachmentListItem ,unknown resource id ,id =${selectGain.id} index =${index}`);
        }
        loader.url = url;

        let countText = selectGain.param;
        if (selectGain.id === proto.casino.eRESOURCE.RESOURCE_RED) {
            countText = selectGain.param / 100;
        }
        count.text = `${countText}`;

        // 设置领取状态
        loader.grayed = receive;
        count.grayed = receive;
        tick.grayed = receive;
        tick.visible = receive;
    }

}
