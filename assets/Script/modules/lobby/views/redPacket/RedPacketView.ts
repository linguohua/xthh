import { CommonFunction, LobbyModuleInterface } from "../../lcore/LCoreExports";
const { ccclass } = cc._decorator;

/**
 * RedPacketView
 */
@ccclass
export class RedPacketView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_red_packet/lobby_red_packet");
        const view = fgui.UIPackage.createObject("lobby_red_packet", "redPacketView").asCom;

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
        this.unRegisterHander();
        this.win.hide();
        this.win.dispose();

    }

    private registerHandler(): void {
        //
    }
    private unRegisterHander(): void {
        //
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        this.registerHandler();

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

}
