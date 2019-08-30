
import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface } from "../lcore/LCoreExports";
import { LocalStrings } from "../strings/LocalStringsExports";
const { ccclass } = cc._decorator;

/**
 * 输入数字界面
 */
@ccclass
export class AgreementView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;

    private pageIndex: number = 0;

    private contentText: fgui.GTextField;

    private page: fgui.GTextField;

    private lastPageBtn: fgui.GButton;

    private nextPageBtn: fgui.GButton;

    protected onLoad(): void {

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_user_info/lobby_user_info");
        const view = fgui.UIPackage.createObject("lobby_user_info", "agreementView").asCom;

        CommonFunction.setViewInCenter(view);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

        this.initView();
        this.win.show();
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(): void {
        const agreeCtrl = this.view.getController("agree");
        const agree = DataStore.getString(KeyConstants.AGREEMENT);
        if (agree !== KeyConstants.RESULT_YES) {

            agreeCtrl.selectedIndex = 0;
        } else {
            agreeCtrl.selectedIndex = 1;
        }

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const agreeBtn = this.view.getChild("agreeBtn");
        agreeBtn.onClick(this.onAgreeBtnClick, this);

        const textCom = this.view.getChild("text").asCom;
        this.contentText = textCom.getChild("text").asTextField;

        this.contentText.text = LocalStrings.findString("agreeText0");

        this.page = this.view.getChild("page").asTextField;
        this.page.text = `${this.pageIndex + 1}/16`;

        const lastPageBtn = this.view.getChild("lastPageBtn").asButton;
        this.lastPageBtn = lastPageBtn;
        lastPageBtn.onClick(this.onLastPageBtnClick, this);
        lastPageBtn.getController("enable").selectedIndex = 0;

        const nextPageBtn = this.view.getChild("nextPageBtn").asButton;
        this.nextPageBtn = nextPageBtn;
        nextPageBtn.onClick(this.onNextPageBtnClick, this);
        nextPageBtn.getController("enable").selectedIndex = 1;

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onAgreeBtnClick(): void {
        DataStore.setItem(KeyConstants.AGREEMENT, KeyConstants.RESULT_YES);
        this.destroy();
    }

    private onLastPageBtnClick(): void {
        //
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.nextPageBtn.getController("enable").selectedIndex = 1;
            this.lastPageBtn.getController("enable").selectedIndex = this.pageIndex === 0 ? 0 : 1;
            this.contentText.text = "";
            this.contentText.text = LocalStrings.findString(`agreeText${this.pageIndex}`);

            this.page.text = `${this.pageIndex + 1}/16`;
        } else {
            this.lastPageBtn.getController("enable").selectedIndex = 0;
        }

    }

    private onNextPageBtnClick(): void {
        //

        if (this.pageIndex < 15) {
            this.pageIndex++;
            this.nextPageBtn.getController("enable").selectedIndex = this.pageIndex === 15 ? 0 : 1;
            this.lastPageBtn.getController("enable").selectedIndex = 1;
            this.contentText.text = "";
            this.contentText.text = LocalStrings.findString(`agreeText${this.pageIndex}`);

            this.page.text = `${this.pageIndex + 1}/16`;
        } else {
            this.nextPageBtn.getController("enable").selectedIndex = 0;
        }

    }

}
