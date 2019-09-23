import { CommonFunction, LobbyModuleInterface, SoundMgr, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
const { ccclass } = cc._decorator;

// const REWARD_IMG: { [key: number]: string } = {
//     [proto.casino.eRESOURCE.RESOURCE_RED]: "ui://lobby_bg_package/cz_icon_hb2",
//     [proto.casino.eRESOURCE.RESOURCE_BEANS]: "ui://lobby_bg_package/cz_icon_hld2",
//     [proto.casino.eRESOURCE.RESOURCE_CARD]: "ui://lobby_bg_package/cz_icon_fk2",
//     [proto.casino.eRESOURCE.RESOURCE_GOLD]: "ui://lobby_bg_package/cz_icon_jb2"
// };

// const REWARD_LOADER_NAME: { [key: number]: string } = {
//     [proto.casino.eRESOURCE.RESOURCE_RED]: "red",
//     [proto.casino.eRESOURCE.RESOURCE_BEANS]: "bean",
//     [proto.casino.eRESOURCE.RESOURCE_CARD]: "card",
//     [proto.casino.eRESOURCE.RESOURCE_GOLD]: "gold"
// };

/**
 * RewardView
 */
@ccclass
export class RewardView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    private selectedGainIndex: number = 0;
    private gains: proto.casino.Iobject[] = [];

    public showView(lm: LobbyModuleInterface, gains: proto.casino.Iobject[]): void {
        // this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_reward/lobby_reward");
        const view = fgui.UIPackage.createObject("lobby_reward", "rewardView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.gains = gains;
        this.initView();
        this.win.show();

        SoundMgr.playEffectAudio(`gameb/sound_l_light`);
    }
    // protected onLoad(): void {
    //     this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
    //     const loader = this.lm.loader;
    //     loader.fguiAddPackage("lobby/fui_lobby_reward/lobby_reward");
    //     const view = fgui.UIPackage.createObject("lobby_reward", "rewardView").asCom;

    //     CommonFunction.setViewInCenter(view);

    //     const mask = view.getChild("mask");
    //     CommonFunction.setBgFullScreenSize(mask);

    //     this.view = view;

    //     const win = new fgui.Window();
    //     win.contentPane = view;
    //     win.modal = true;

    //     this.win = win;
    // }

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

        const mask = this.view.getChild("mask");
        mask.onClick(this.onMaskClick, this);

        this.selectedGainIndex = 0;
        this.refreshReward(this.gains[0]);

        this.registerHandler();

    }

    private refreshReward(gain: proto.casino.Iobject): void {


        const resourceType = this.view.getController("resource");

        let count = gain.param;

        if (gain.id === proto.casino.eRESOURCE.RESOURCE_CARD) {
            resourceType.selectedIndex = 0;
        }

        if (gain.id === proto.casino.eRESOURCE.RESOURCE_BEANS) {
            resourceType.selectedIndex = 1;
        }

        if (gain.id === proto.casino.eRESOURCE.RESOURCE_RED) {
            resourceType.selectedIndex = 2;
            count = count / 100;
        }

        if (gain.id === proto.casino.eRESOURCE.RESOURCE_GOLD) {
            resourceType.selectedIndex = 3;
        }

        // this.view.getChild("loader").asLoader.url = REWARD_IMG[gain.id];
        this.view.getChild("count").text = `${count}`;

    }

    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onMaskClick(): void {

        const len = this.gains.length;

        if (this.selectedGainIndex + 1 < len) {
            this.selectedGainIndex++;
            this.refreshReward(this.gains[this.selectedGainIndex]);
        } else {
            this.onCloseBtnClick();
        }
    }

}
