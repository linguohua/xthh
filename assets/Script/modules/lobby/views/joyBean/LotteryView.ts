import { CommonFunction, LobbyModuleInterface } from "../../lcore/LCoreExports";
import { LotteryRuleView } from "./LotteryRuleView";
const { ccclass } = cc._decorator;

/**
 * 抽奖页面
 */
@ccclass
export class LotteryView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    public show(): void {
        this.initView();
        this.win.show();
    }
    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_joy_bean/lobby_joy_bean");
        const view = fgui.UIPackage.createObject("lobby_joy_bean", "lotteryView").asCom;

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

        const ruleBtn = this.view.getChild("ruleBtn");
        ruleBtn.onClick(this.onRuleBtnClick, this);

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onRuleBtnClick(): void {
        this.addComponent(LotteryRuleView);
    }

}
