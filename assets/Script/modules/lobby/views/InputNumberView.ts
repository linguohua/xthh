
import { CommonFunction, LobbyModuleInterface, SoundMgr } from "../lcore/LCoreExports";
const { ccclass } = cc._decorator;

/**
 * 输入数字界面
 */
@ccclass
export class InputNumberView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;

    private numbers: fgui.GTextField;
    private lm: LobbyModuleInterface;

    private okBtn: fgui.GButton;

    private callback: Function;

    private inputLimit: number;

    private titleStr: string;

    private maxLimit: number;

    public show(callback: Function, titleStr: string, inputLimit: number, maxLimit: number = 0): void {
        this.callback = callback;
        this.inputLimit = inputLimit;
        this.maxLimit = maxLimit;
        if (maxLimit === 0) {
            this.maxLimit = inputLimit;
        }
        this.titleStr = titleStr;

        this.initView();
        this.win.show();
    }
    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_join_room/lobby_join_room");
        const view = fgui.UIPackage.createObject("lobby_join_room", "joinRoom").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(): void {

        const hint = this.view.getChild("hintText").asTextField;
        hint.text = this.titleStr;

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const resetBtn = this.view.getChild("buttonCS");
        resetBtn.onClick(this.onResetBtnClick, this);

        const backBtn = this.view.getChild("buttonSC");
        backBtn.onClick(this.onBackBtnClick, this);

        this.okBtn = this.view.getChild("buttonQD").asButton;
        this.okBtn.onClick(this.onOkBtnClick, this);
        this.okBtn.grayed = true;
        this.okBtn._touchDisabled = true;

        for (let i = 0; i < 10; i++) {
            const button = this.view.getChild(`button${i}`);
            button.onClick(() => { this.onInputButton(i); }, this);
        }

        this.numbers = this.view.getChild("number").asTextField;
    }
    private onCloseBtnClick(): void {
        SoundMgr.buttonTouch();
        this.destroy();
    }

    private onResetBtnClick(): void {
        SoundMgr.buttonTouch();
        this.numbers.text = "";
        this.okBtn.grayed = true;
        this.okBtn._touchDisabled = true;
    }

    private onBackBtnClick(): void {
        SoundMgr.buttonTouch();
        let len = this.numbers.text.length;
        if (len !== 0) {
            this.numbers.text = this.numbers.text.substring(0, len - 1);
        }

        len = this.numbers.text.length;
        if (len < this.inputLimit) {
            this.okBtn.grayed = true;
            this.okBtn._touchDisabled = true;
        }
    }

    private onInputButton(input: number): void {
        SoundMgr.buttonTouch();
        const numberLength = this.numbers.text.length;
        if (numberLength < this.maxLimit) {
            this.numbers.text = `${this.numbers.text}${input}`;

        }

        if (this.numbers.text.length >= this.inputLimit) {
            this.okBtn.grayed = false;
            this.okBtn._touchDisabled = false;
        } else {
            this.okBtn.grayed = true;
            this.okBtn._touchDisabled = true;
        }

    }

    private onOkBtnClick(): void {
        SoundMgr.buttonTouch();
        const num = this.numbers.text;
        if (num !== undefined && num !== null && num !== "") {

            this.callback(num);
            this.win.hide();
            this.destroy();
        }
    }

}
