import { CommonFunction, Logger } from "../lcore/LCoreExports";
import { InputNumberOpenType, InputNumberView } from "./InputNumberView";

const { ccclass } = cc._decorator;

export enum OpenType {

    LOGIN = 0,
    BIND_PHONE = 1

}

/**
 * 手机验证页面
 */
@ccclass
export class PhoneAuthView extends cc.Component {
    private win: fgui.Window;

    private view: fgui.GComponent;

    private inputPhone: fgui.GObject;

    private inputAuth: fgui.GObject;

    private openType: OpenType;

    public show(openType: OpenType): void {
        this.openType = openType;

        const view = fgui.UIPackage.createObject("lobby_login", "phoneAuthView").asCom;

        CommonFunction.setViewInCenter(view);
        this.view = view;

        this.initView();
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();

    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onInputPhoneBtnClick(): void {
        Logger.debug("onInputPhoneBtnClick");
        const inputNumberView = this.addComponent(InputNumberView);

        const cb = (str: string) => {
            this.inputPhone.asButton.getController("phoneLegal").selectedIndex = 1;
            this.inputPhone.asButton.getChild("text").text = str;
        };
        inputNumberView.show(cb, InputNumberOpenType.INPUT_PHONE, 11);
    }

    private onInputAuthBtnClick(): void {
        Logger.debug("onInputAuthBtnClick");
        const inputNumberView = this.addComponent(InputNumberView);

        const cb = (str: string) => {
            this.inputAuth.asButton.getController("codeLegal").selectedIndex = 1;
            this.inputAuth.asButton.getChild("text").text = str;
        };
        inputNumberView.show(cb, InputNumberOpenType.INPUT_AUTH, 4);
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const inputPhone = this.view.getChild("inputPhone");
        this.inputPhone = inputPhone;
        inputPhone.onClick(this.onInputPhoneBtnClick, this);

        const inputAuth = this.view.getChild("inputAuth");
        this.inputAuth = inputAuth;
        inputAuth.onClick(this.onInputAuthBtnClick, this);

        const getAuthBtn = this.view.getChild("getAuthBtn");
        getAuthBtn.onClick(this.onCloseBtnClick, this);

        const confirmBtn = this.view.getChild("confirmBtn");
        confirmBtn.onClick(this.onCloseBtnClick, this);

        const openType = this.view.getController("type");
        openType.selectedIndex = this.openType;

        // this.list = this.view.getChild("list").asList;

        // this.list.itemRenderer = (index: number, item: fgui.GObject) => {
        //     this.renderRecordListItem(index, item);
        // };
    }

}
