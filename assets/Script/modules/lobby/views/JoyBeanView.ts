import { CommonFunction, LobbyModuleInterface } from "../lcore/LCoreExports";
import { Share } from "../shareUtil/ShareExports";
import { ShopView, TabType } from "./ShopView";
import { UserInfoTabType, UserInfoView } from "./UserInfoView";
const { ccclass } = cc._decorator;

/**
 * 欢乐场页面
 */
@ccclass
export class JoyBeanView extends cc.Component {
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
        const view = fgui.UIPackage.createObject("lobby_joy_bean", "joyBeanView").asCom;

        CommonFunction.setViewInCenter(view);

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

        const returnBtn = this.view.getChild("returnBtn");
        returnBtn.onClick(this.onCloseBtnClick, this);

        const shareBtn = this.view.getChild("shareBtn");
        shareBtn.onClick(this.onShareBtnClick, this);

        const settingBtn = this.view.getChild("settingBtn");
        settingBtn.onClick(this.onSettingBtnClick, this);

        const addDou = this.view.getChild("addDouBtn");
        addDou.onClick(this.onAddDouBtnClick, this);

        const addFK = this.view.getChild("addFKBtn");
        addFK.onClick(this.onAddFKBtnClick, this);

        const shopBtn = this.view.getChild("shopBtn");
        shopBtn.onClick(this.onShopBtnClick, this);

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onSettingBtnClick(): void {
        const view = this.addComponent(UserInfoView);
        view.showView(UserInfoTabType.GAME_SETTING);
    }

    private onAddDouBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.Dou);
    }

    private onAddFKBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.FK);
    }

    private onShareBtnClick(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Share.shareScreenshot("");
        }
    }

    private onShopBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.Dou);
    }

}
