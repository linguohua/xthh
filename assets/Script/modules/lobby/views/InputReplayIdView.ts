
import { CommonFunction, LobbyModuleInterface } from "../lcore/LCoreExports";
import { proto } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";
const { ccclass } = cc._decorator;

/**
 * 输入战绩ID界面
 */
@ccclass
export class InputReplayIdView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;

    private numbers: fgui.GTextField;
    private lm: LobbyModuleInterface;

    private okBtn: fgui.GButton;

    public show(): void {

        this.initView();
        this.win.show();
    }
    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_join_room/lobby_join_room");
        const view = fgui.UIPackage.createObject("lobby_join_room", "joinRoom").asCom;

        const hint = view.getChild("hintText").asTextField;
        hint.text = LocalStrings.findString("inputRecordId");
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
        this.destroy();
    }

    private onResetBtnClick(): void {
        // Logger.debug("onResetBtnClick");
        this.numbers.text = "";
        this.okBtn.grayed = true;
        this.okBtn._touchDisabled = true;
    }

    private onBackBtnClick(): void {
        // Logger.debug("onBackBtnClick");
        const len = this.numbers.text.length;
        if (len === 1) {
            this.okBtn.grayed = true;
            this.okBtn._touchDisabled = true;
        }
        if (len !== 0) {
            this.numbers.text = this.numbers.text.substring(0, len - 1);
        }
    }

    private onInputButton(input: number): void {
        // Logger.debug(`onInputButton, input:${input}`);
        this.numbers.text = `${this.numbers.text}${input}`;

        this.okBtn.grayed = false;
        this.okBtn._touchDisabled = false;
    }

    private onOkBtnClick(): void {
        const num = this.numbers.text;
        if (num !== undefined && num !== null && num !== "") {
            this.win.hide();
            this.destroy();

            const req2 = new proto.casino.packet_replay_req();
            req2.replay_id = +num;
            const buf = proto.casino.packet_replay_req.encode(req2);
            const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
            lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_REPLAY_REQ);
        } else {
            //提示
            // Dialog.prompt(LocalStrings.findString("inputRecordId"));
        }
    }

}
