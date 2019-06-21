import { CommonFunction, DataStore, LobbyModuleInterface } from "../lcore/LCoreExports";

const { ccclass } = cc._decorator;
/**
 * 用户信息页面
 */
@ccclass
export class UserInfoView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_user_info/lobby_user_info");

        const view = fgui.UIPackage.createObject("lobby_user_info", "userInfoView").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();

        this.initView();
    }

    protected onDestroy(): void {

        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private initView(): void {
        //

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        let item = this.view.getChild("nick");
        let itemName = item.asCom.getChild("item");
        itemName.text = "昵称:";

        let itemText = item.asCom.getChild("text");
        const name = DataStore.getString("nickName");

        if (name === null || name.length < 1) {
            itemText.text = "默认用户名字";
        } else {
            itemText.text = name;
        }

        item = this.view.getChild("id");
        itemName = item.asCom.getChild("item");
        itemName.text = "ID:";

        itemText = item.asCom.getChild("text");
        itemText.text = DataStore.getString("userID");

        const genderCtrl = this.view.getController("gender");
        const gender = DataStore.getString("sex");
        genderCtrl.selectedIndex = +gender;

        const iconLoader = this.view.getChild("loader").asLoader;

        const headImgUrl = DataStore.getString("headImgUrl");
        CommonFunction.setHead(iconLoader, headImgUrl, +gender);

    }

}
