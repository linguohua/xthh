
import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface } from "../lcore/LCoreExports";
import { LocalStrings } from "../strings/LocalStringsExports";
const { ccclass } = cc._decorator;

/**
 * 用户协议界面
 */
@ccclass
export class AgreementView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;

    private pageIndex: number = 0;

    private readonly pageCount: number = 20;

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

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

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
        this.page.text = `${this.pageIndex + 1}/${this.pageCount}`;

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
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.nextPageBtn.getController("enable").selectedIndex = 1;
            this.lastPageBtn.getController("enable").selectedIndex = this.pageIndex === 0 ? 0 : 1;
            this.contentText.text = "";
            this.contentText.text = LocalStrings.findString(`agreeText${this.pageIndex}`);

            this.page.text = `${this.pageIndex + 1}/${this.pageCount}`;
        } else {
            this.lastPageBtn.getController("enable").selectedIndex = 0;
        }

    }

    private onNextPageBtnClick(): void {
        if (this.pageIndex < this.pageCount - 1) {
            this.pageIndex++;
            this.nextPageBtn.getController("enable").selectedIndex = this.pageIndex === this.pageCount - 1 ? 0 : 1;
            this.lastPageBtn.getController("enable").selectedIndex = 1;
            this.contentText.text = "";
            this.contentText.text = LocalStrings.findString(`agreeText${this.pageIndex}`);

            this.page.text = `${this.pageIndex + 1}/${this.pageCount}`;
        } else {
            this.nextPageBtn.getController("enable").selectedIndex = 0;
        }

    }

}
