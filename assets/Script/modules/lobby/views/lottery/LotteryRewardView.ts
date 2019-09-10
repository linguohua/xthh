import { CommonFunction, LobbyModuleInterface } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
const { ccclass } = cc._decorator;

const REWARD_IMG: { [key: number]: string } = {
    [proto.casino.eRESOURCE.RESOURCE_RED]: "ui://lobby_lottery/nlzp_icon_hb2",
    [proto.casino.eRESOURCE.RESOURCE_BEANS]: "ui://lobby_lottery/cz_icon_hld2",
    [proto.casino.eRESOURCE.RESOURCE_NONE]: "ui://lobby_lottery/cz_icon_hld2"
};

/**
 * 抽奖规则页面
 */
@ccclass
export class LotteryRewardView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    public show(lm: LobbyModuleInterface, drawItem: proto.casino.Ienergy_turnable_item): void {
        this.lm = lm;
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_lottery/lobby_lottery");
        const view = fgui.UIPackage.createObject("lobby_lottery", "rewardView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initView(drawItem);
        this.win.show();
    }
    protected onLoad(): void {
        //this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(drawItem: proto.casino.Ienergy_turnable_item): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        this.view.getChild("loader").asLoader.url = REWARD_IMG[drawItem.type_id];

        let count: string = drawItem.param.toString();
        let describe: string = drawItem.name.toString();

        if (drawItem.type_id === proto.casino.eRESOURCE.RESOURCE_RED) {
            count = `${drawItem.param / 100}`;
            describe = `元微信${describe}`;
        }
        this.view.getChild("count").text = count;
        this.view.getChild("describe").text = describe;

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

}
