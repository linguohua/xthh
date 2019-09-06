import { GameError } from "../../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../../protobufjs/long");
import { proto } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";
import { RewardView } from "../reward/RewardViewExports";

const { ccclass } = cc._decorator;

const REWARD_IMG: { [key: number]: string } = {
    [proto.casino.eRESOURCE.RESOURCE_BEANS]: "ui://lobby_bg_package/ty_icon_hld",
    [proto.casino.eRESOURCE.RESOURCE_CARD]: "ui://lobby_bg_package/ty_icon_fk"
};

enum OPERATION {
    NONE = 0,
    TAKE = 1,
    DELETE = 2
}

/**
 * EmailView
 */
@ccclass
export class EmailView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    private noEmailText: fgui.GTextField;

    private takeBtn: fgui.GButton;
    private deleteBtn: fgui.GButton;

    private textComponent: fgui.GComponent;
    private emailList: fgui.GList;
    private attachmentsList: fgui.GList;

    private titleText: fgui.GTextField;

    private playerEmails: proto.casino.Iplayer_mail[];

    private selectPlayerEmail: proto.casino.Iplayer_mail;

    private selectPlayerEmailIndex: number = 0;

    private operation: OPERATION = OPERATION.NONE;

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
        //this.attachmentsList.setVirtual();

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

    private onDeleteBtnClick(): void {
        // this.destroy();
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
        this.operation = OPERATION.DELETE;
    }

    private onTakeBtnClick(): void {
        //this.destroy();
        const playerEmail = this.selectPlayerEmail;

        const playerId = DataStore.getString(KeyConstants.PLAYER_ID);
        const req2 = new proto.casino.packet_mail_req();
        req2.mail_id = playerEmail.id;
        req2.player_id = +playerId;
        req2.gain = true;
        const buf = proto.casino.packet_mail_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_MAIL_REQ);
        this.operation = OPERATION.TAKE;
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

        if (mailData.ret !== proto.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {

            Dialog.prompt(GameError.getErrorString(mailData.ret));

            return;
        }
        const mailId = mailData.mail_id.toNumber();
        if (mailId === proto.casino.eRETURN_TYPE.RETURN_SUCCEEDED) {
            const playerEmails = mailData.mails;

            this.playerEmails = playerEmails;
            this.emailList.numItems = this.playerEmails.length;
            //默认选择第一个
            this.selectFirst();
        } else {
            const gain = mailData.gain;

            if (gain === true) {
                if (this.operation === OPERATION.TAKE) {
                    //
                    const view = this.addComponent(RewardView);
                    view.show(mailData.gains);

                    this.changeReceiveState();

                } else if (this.operation === OPERATION.DELETE) {
                    //
                    this.deleteEmail();
                }
            }

        }

    }

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
            this.deleteBtn.visible = false;
            this.takeBtn.visible = false;
            this.attachmentsList.numItems = 0;
        }
    }

    private deleteEmail(): void {
        this.playerEmails[this.selectPlayerEmailIndex] = this.selectPlayerEmail;
        this.playerEmails.splice(this.selectPlayerEmailIndex, 1);
        this.emailList.numItems = this.playerEmails.length;

        this.selectFirst();
    }

    private changeReceiveState(): void {
        this.selectPlayerEmail.view_time = long.fromNumber(this.lm.msgCenter.getServerTime());
        this.playerEmails[this.selectPlayerEmailIndex] = this.selectPlayerEmail;

        const obj = this.emailList.getChildAt(this.selectPlayerEmailIndex);
        this.selectEmail(this.selectPlayerEmail, obj, this.selectPlayerEmailIndex);
    }

    private renderListItem(index: number, obj: fgui.GObject): void {

        const playerEmail = this.playerEmails[index];

        const email = playerEmail.data;

        const title = obj.asCom.getChild("title");
        title.text = email.title;

        const sender = obj.asCom.getChild("sender");
        sender.text = LocalStrings.findString("sender", email.sender);

        obj.onClick(() => {
            this.selectEmail(playerEmail, obj, index);
            // tslint:disable-next-line:align
        }, this);

    }

    private selectEmail(playerEmail: proto.casino.Iplayer_mail, obj: fgui.GObject, index: number): void {
        this.selectPlayerEmailIndex = index;
        this.selectPlayerEmail = playerEmail;

        const email = playerEmail.data;
        this.textComponent.text = email.content;
        this.titleText.text = email.title;

        const viewTime = playerEmail.view_time;
        const receive = viewTime.toNumber() > 0;

        this.deleteBtn.visible = receive;
        this.takeBtn.visible = !receive;

        this.updateAttachmentsView();

    }

    // 附件个数，现在暂时为1
    private updateAttachmentsView(): void {
        const email = this.selectPlayerEmail.data;
        const gains = email.gains;
        const filterGains: proto.casino.Iobject[] = [];
        for (const gain of gains) {
            // TODO: 现在已过滤红包经验，等资源出了，在放开限制
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

        const receive = this.selectPlayerEmail.view_time.toNumber() > 0;

        for (const gain of gains) {
            // TODO: 现在已过滤红包经验，等资源出了，在放开限制
            if (gain.type !== proto.casino.eTYPE.TYPE_RESOURCE) {
                continue;
            }

            filterGains.push(gain);

        }

        const selectGain = filterGains[index];
        const loader = obj.asCom.getChild("loader").asLoader;
        const count = obj.asCom.getChild("count");
        const tick = obj.asCom.getChild("tick");
        loader.url = REWARD_IMG[selectGain.id];

        count.text = `${selectGain.param}`;

        // 设置是否领取
        loader.grayed = receive;
        count.grayed = receive;
        tick.grayed = receive;
        tick.visible = receive;
    }

}
