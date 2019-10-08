import { LobbyModuleInterface, Logger, SoundMgr } from "../../lcore/LCoreExports";

const { ccclass } = cc._decorator;

interface UserInfoViewInterface {

    changeIcon: Function;
}

/**
 * IconListPopupView
 */
@ccclass
export class IconListPopupView extends cc.Component {
    private view: fgui.GComponent;

    private headList: fgui.GList;

    private userInfoView: UserInfoViewInterface;
    private gender: number = 0;

    public show(belowBtn: fgui.GObject, gender: number, userInfoView: UserInfoViewInterface): void {
        this.userInfoView = userInfoView;
        this.gender = gender;
        this.initView();

        const win = new fgui.Window();
        win.contentPane = this.view;
        win.modal = true;

        fgui.GRoot.inst.showPopup(win, belowBtn);
        //fgui.GRoot.inst.showPopup(this.view);
    }

    protected onLoad(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_join_room/lobby_join_room");
        const view = fgui.UIPackage.createObject("lobby_user_info", "iconListCom").asCom;
        this.view = view;

    }

    protected onDestroy(): void {
        this.unRegisterHander();
    }

    private registerHandler(): void {
        //
    }
    private unRegisterHander(): void {
        //
    }

    private initView(): void {

        this.headList = this.view.getChild("list").asList;
        this.headList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderHeadListItem(index, item);
        };
        this.headList.node.position = new cc.Vec2(15, -24);
        this.headList.on(fgui.Event.CLICK_ITEM, this.onHeadListItemClick, this);

        this.headList.numItems = 4;
        this.registerHandler();
    }
    private onHeadListItemClick(clickItem: fgui.GObject): void {
        SoundMgr.buttonTouch();
        Logger.debug("clickItem index:", this.headList.getChildIndex(clickItem));

        const obj = clickItem.asCom;
        //this.headLoader.url = obj.getChild("n69").asLoader.url;

        const url = obj.getChild("n69").asLoader.url;
        this.userInfoView.changeIcon(url);
    }

    private renderHeadListItem(index: number, item: fgui.GObject): void {
        let itemIndex = index;
        if (this.gender === 1) {
            itemIndex = index + 4;
        }
        const obj = item.asCom;
        obj.getChild("n69").asLoader.url = `ui://lobby_bg_package/grxx_xttx_${itemIndex}`;

    }

}
