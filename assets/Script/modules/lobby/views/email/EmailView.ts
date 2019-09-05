import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";

const { ccclass } = cc._decorator;

/**
 * EmailView
 */
@ccclass
export class EmailView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    private noEmailText: fgui.GTextField;

    private fkImg: fgui.GImage;
    private beanImg: fgui.GImage;
    private fkTick: fgui.GImage;
    private beanTick: fgui.GImage;
    private fkCount: fgui.GTextField;
    private beanCount: fgui.GTextField;
    private takeBtn: fgui.GButton;
    private deleteBtn: fgui.GButton;

    private textComponent: fgui.GComponent;
    private emailList: fgui.GList;

    private titleText: fgui.GTextField;

    private playerEmails: proto.casino.Iplayer_mail[];

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
        this.unRegisterHander();
        this.win.hide();
        this.win.dispose();

    }

    private registerHandler(): void {
        //
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_MAIL_ACK, this.onEmailAck, this);
    }
    private unRegisterHander(): void {
        //
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const noEmailText = this.view.getChild("noEmailText").asTextField;
        this.noEmailText = noEmailText;

        const fkImg = this.view.getChild("fkImg").asImage;
        this.fkImg = fkImg;

        const beanImg = this.view.getChild("beanImg").asImage;
        this.beanImg = beanImg;

        const fkTick = this.view.getChild("fkTick").asImage;
        this.fkTick = fkTick;

        const beanTick = this.view.getChild("beanTick").asImage;
        this.beanTick = beanTick;

        const fkCount = this.view.getChild("fkCount").asTextField;
        this.fkCount = fkCount;

        const beanCount = this.view.getChild("beanCount").asTextField;
        this.beanCount = beanCount;

        const takeBtn = this.view.getChild("takeBtn").asButton;
        this.takeBtn = takeBtn;

        const deleteBtn = this.view.getChild("deleteBtn").asButton;
        this.deleteBtn = deleteBtn;

        const textComponent = this.view.getChild("textComponent").asCom;
        this.textComponent = textComponent;

        const emailList = this.view.getChild("emailList").asList;
        this.emailList = emailList;

        this.emailList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderListItem(index, item);
        };
        this.emailList.setVirtual();

        const titleText = this.view.getChild("titleText").asTextField;
        this.titleText = titleText;

        // const emailData = DataStore.getString(KeyConstants.PLAYER_EMAIL);
        // const emails = <proto.casino.player_mail[]>JSON.parse(emailData);

        // Logger.debug("emails = ", emails);
        this.registerHandler();
        this.reloadEmail();

    }

    private onCloseBtnClick(): void {
        this.destroy();
    }

    private reloadEmail(): void {
        //
        const req2 = new proto.casino.packet_mail_req();
        req2.player_id = 0;
        req2.gain = false;
        const buf = proto.casino.packet_mail_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);

    }

    private onEmailAck(msg: proto.casino.ProxyMessage): void {
        //
        const mailData = proto.casino.packet_mail_ack.decode(msg.Data);
        Logger.debug("onEmailAck mailData= ", mailData);

        if (mailData.mail_id.toNumber() === proto.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
            const playerEmails = mailData.mails;

            this.playerEmails = playerEmails;
            this.emailList.numItems = this.playerEmails.length;
            //默认选择第一个
            if (this.playerEmails.length > 0) {
                this.emailList.selectedIndex = 0;
                const obj = this.emailList.getChildAt(0);
                const email = this.playerEmails[0];
                this.selectEmail(email.data, obj);
                this.noEmailText.visible = false;
            } else {
                this.noEmailText.visible = true;
            }
        }

    }

    private showBeanAttachment(): void {
        //
    }
    private showFKAttachment(): void {
        //
    }

    private hideAttachments(): void {
        this.fkCount.text = "";
        this.beanCount.text = "";

        this.fkCount.visible = false;
        this.beanCount.visible = false;

        this.fkImg.visible = false;
        this.beanImg.visible = false;

        this.fkTick.visible = false;
        this.beanTick.visible = false;

        this.takeBtn.visible = false;
        this.deleteBtn.visible = false;
    }

    private renderListItem(index: number, obj: fgui.GObject): void {

        const playerEmail = this.playerEmails[index];

        const email = playerEmail.data;

        const title = obj.asCom.getChild("title");
        title.text = email.title;

        const sender = obj.asCom.getChild("sender");
        sender.text = LocalStrings.findString("sender", email.sender);

        obj.onClick(() => {
            this.selectEmail(email, obj);
            // tslint:disable-next-line:align
        }, this);

    }

    private selectEmail(email: proto.casino.Imail, obj: fgui.GObject): void {
        this.textComponent.text = email.content;
        this.titleText.text = email.title;

        Logger.debug("email params = ", email.param);
        Logger.debug("RETURN_GAIN = ", proto.casino.eRETURN_TYPE.RETURN_GAIN);

        const gains = email.gains;

        for (const gain of gains) {

            // TODO: 现在已过滤红包经验，等资源出了，在放开限制
            if (gain.type !== proto.casino.eTYPE.TYPE_RESOURCE) {
                continue;
            }

            if (gain.id === proto.casino.eRESOURCE.RESOURCE_BEANS) {
                this.beanCount.text = `${gain.param}`;

            }

            if (gain.id === proto.casino.eRESOURCE.RESOURCE_CARD) {

                this.beanCount.text = `${gain.param}`;

            }

        }

        //刷新附件
        // const selectedEmail = email;
        // this.selectedEmail = selectedEmail;

        // const hasAttachmentCtrl = this.view.getController("hasAttachment");
        // if (selectedEmail !== null && selectedEmail.attachments !== null) {
        //     this.updateAttachmentsView();
        //     hasAttachmentCtrl.selectedIndex = 0;
        // } else {
        //     hasAttachmentCtrl.selectedIndex = 1;
        // }

        // if (email.isRead === false) {
        //     this.setRead(email, obj);
        // }
    }

}
