import { CommonFunction, LobbyModuleInterface } from "../../lcore/LCoreExports";
const { ccclass } = cc._decorator;

export enum REWARD_TYPE {

    BEAN = "0",

    RED_BAG = "1"
}

/**
 * 奖励
 */
export class Reward {

    public rewardType: REWARD_TYPE;

    public count: number;
}

const rewardConfig: { [key: string]: string } = {
    [REWARD_TYPE.BEAN]: "正在加载中... {0} %",
    [REWARD_TYPE.RED_BAG]: "正在加载中... {0} %",
};

/**
 * 抽奖规则页面
 */
@ccclass
export class RewardView extends cc.Component {
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
        const view = fgui.UIPackage.createObject("lobby_joy_bean", "lotteryRuleView").asCom;

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

        const closeBtn = this.view.getChild("maskBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

}
