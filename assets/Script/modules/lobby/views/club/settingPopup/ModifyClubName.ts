import { Dialog } from "../../../lcore/LCoreExports";
import { ClubViewInterface } from "../ClubModuleInterface";

/**
 * 修改群名
 */
export class ModifyClubName extends cc.Component {

    private view: fgui.GComponent = null;

    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private settingPopupView: ClubViewInterface;

    private clubName: string;

    public bind(settingPopupView: ClubViewInterface, clubName: string): void {
        this.clubName = clubName;
        this.settingPopupView = settingPopupView;
    }

    public show(): void {

        // const modifyClubNameCom = fgui.UIPackage.createObject("lobby_club", "modifyClubNameCom").asCom;
        // this.view = modifyClubNameCom;

        // this.initView();
        // fgui.GRoot.inst.showPopup(this.view);
        // this.view.setPosition(949, 106);

    }
    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
        const view = fgui.UIPackage.createObject("lobby_club", "modifyClubNameCom").asCom;
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

        const needDiamondText = this.view.getChild("needDiamondText").asTextField;

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const confirmBtn = this.view.getChild("confirmBtn").asButton;
        confirmBtn.onClick(this.onConfirmBtnClick, this);
        needDiamondText.text = `修改需要花费 <font color="#527983"> ${300} </font> (钻石)`;
    }

    private onConfirmBtnClick(): void {

        const inputField = this.view.getChild("inputField");
        const clubName = inputField.text;

        const errMsg = this.checkLegal(clubName);

        if (errMsg !== undefined) {
            Dialog.showDialog(errMsg, () => {
                //
            });

            return;
        }
        this.settingPopupView.modifyClubName(clubName);
        this.destroy();
    }

    private checkLegal(name: string): string {

        let msg: string;

        if (name === null) {
            msg = "输出名称为空";
        } else if (name.length < 3 || name.length > 7) {
            msg = `群名不合法，长于3个文字，并且小于七个文字,当前长度为${name.length}`;
        } else if (name === this.clubName) {
            msg = `新群名不得与旧群名相同`;
        }

        return msg;
    }
}
