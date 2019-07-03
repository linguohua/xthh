
import { LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
const { ccclass } = cc._decorator;

/**
 * 加入房间
 */
@ccclass
export class JoinRoom extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    // private eventTarget: cc.EventTarget;

    private numbers: fgui.GTextField;

    private hintText: fgui.GTextField;

    // private roomNumber: string = "";
    private lm: LobbyModuleInterface;

    private okBtn: fgui.GButton;

    protected onLoad(): void {
        // this.eventTarget = new cc.EventTarget();
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_join_room/lobby_join_room");
        const view = fgui.UIPackage.createObject("lobby_join_room", "joinRoom").asCom;
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
        const clostBtn = this.view.getChild("closeBtn");
        clostBtn.onClick(this.onCloseBtnClick, this);

        const resetBtn = this.view.getChild("buttonCS");
        resetBtn.onClick(this.onResetBtnClick, this);

        const backBtn = this.view.getChild("buttonSC");
        backBtn.onClick(this.onBackBtnClick, this);

        this.okBtn = this.view.getChild("buttonQD").asButton;
        this.okBtn.onClick(this.onOkBtnClick, this);

        for (let i = 0; i < 10; i++) {
            const button = this.view.getChild(`button${i}`);
            button.onClick(() => { this.onInputButton(i); }, this);
        }

        this.numbers = this.view.getChild("number").asTextField;

        this.hintText = this.view.getChild("hintText").asTextField;

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onResetBtnClick(): void {
        Logger.debug("onResetBtnClick");
        this.numbers.text = "";
        // this.roomNumber = "";
        this.hintText.visible = true;
    }

    private onBackBtnClick(): void {
        Logger.debug("onBackBtnClick");
        const len = this.numbers.text.length;
        if (len !== 0) {
            this.numbers.text = this.numbers.text.substring(0, len - 1);
        }

        if (this.numbers.text === "") {
            this.hintText.visible = true;
        } else {
            this.hintText.visible = false;
        }
    }

    private onInputButton(input: number): void {
        Logger.debug(`onInputButton, input:${input}`);
        const numberLength = this.numbers.text.length;
        if (numberLength < 6) {
            this.numbers.text = `${this.numbers.text}${input}`;

            // this.roomNumber = `${this.roomNumber}${input}`;

            if (this.numbers.text === "") {
                this.hintText.visible = true;
            } else {
                this.hintText.visible = false;
            }
        }

        this.joinRoomCheck(this.numbers.text);
    }

    private onOkBtnClick(): void {

    }
    private joinRoomCheck(roomNumber: string): void {
        if (roomNumber.length === 6) {

        }
    }

}
