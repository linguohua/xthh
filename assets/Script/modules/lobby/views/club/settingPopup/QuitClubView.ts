import { ClubViewInterface } from "../ClubModuleInterface";

/**
 * 退出该群
 */
export class QuitClubView extends cc.Component {

    private view: fgui.GComponent = null;

    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private settingPopupView: ClubViewInterface;

    public bind(settingPopupView: ClubViewInterface, clubName: string): void {
        this.settingPopupView = settingPopupView;

        const confirmText = this.view.getChild("confirmText").asRichTextField;
        confirmText.text = `确定要退出<font color="#96693a"> ${clubName} </font>吗?`;
    }

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();
        const view = fgui.UIPackage.createObject("lobby_club", "quitClubCom").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();

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

        const confirmBtn = this.view.getChild("confirmBtn").asButton;
        confirmBtn.onClick(this.onConfirmBtnClick, this);

    }

    private onConfirmBtnClick(): void {

        this.settingPopupView.quitClub();
        this.destroy();
    }
}
