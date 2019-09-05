import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";

const { ccclass } = cc._decorator;

/**
 * EmailView
 */
@ccclass
export class EmailView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

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

        const emailData = DataStore.getString(KeyConstants.PLAYER_EMAIL);

        const emails = <proto.casino.player_mail[]>JSON.parse(emailData);

        Logger.debug("emails = ", emails);
        this.registerHandler();

    }

    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onEmailAck(msg: proto.casino.ProxyMessage): void {
        //
    }

}
