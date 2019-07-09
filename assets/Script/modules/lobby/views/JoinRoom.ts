
import { LobbyModuleInterface, Logger, CommonFunction } from "../lcore/LCoreExports";
const { ccclass } = cc._decorator;

interface JoinRoomInterface {
    joinRoom(roomNumber: string): void;
}
/**
 * 加入房间
 */
@ccclass
export class JoinRoom extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;

    private numbers: fgui.GTextField;
    private lm: LobbyModuleInterface;

    private okBtn: fgui.GButton;

    private newRoomView: JoinRoomInterface;

    public show(newRoomView: JoinRoomInterface): void {
        this.newRoomView = newRoomView;

        this.initView();
        this.win.show();
    }
    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_join_room/lobby_join_room");
        const view = fgui.UIPackage.createObject("lobby_join_room", "joinRoom").asCom;
        CommonFunction.setViewInCenter(view);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

        // this.initView();

        // this.win.show();
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(): void {
        const clostBtn = this.view.getChild("closeBtn");
        clostBtn.onClick(this.onCloseBtnClick, this);

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
        this.destroy();
    }

    private onResetBtnClick(): void {
        Logger.debug("onResetBtnClick");
        this.numbers.text = "";

        this.okBtn.grayed = true;
        this.okBtn._touchDisabled = true;
    }

    private onBackBtnClick(): void {
        Logger.debug("onBackBtnClick");
        const len = this.numbers.text.length;
        if (len !== 0) {
            this.numbers.text = this.numbers.text.substring(0, len - 1);
            this.okBtn.grayed = true;
            this.okBtn._touchDisabled = true;
        }
    }

    private onInputButton(input: number): void {
        Logger.debug(`onInputButton, input:${input}`);
        const numberLength = this.numbers.text.length;
        if (numberLength < 6) {
            this.numbers.text = `${this.numbers.text}${input}`;

        }

        if (this.numbers.text.length < 6) {
            this.okBtn.grayed = true;
            this.okBtn._touchDisabled = true;
        } else {
            this.okBtn.grayed = false;
            this.okBtn._touchDisabled = false;
        }
    }

    private onOkBtnClick(): void {
       this.win.hide();
       this.destroy();

       this.newRoomView.joinRoom(this.numbers.text);
    }

}
