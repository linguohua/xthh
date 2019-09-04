import { CommonFunction, GResLoader } from "../../lcore/LCoreExports";

interface PlayerInfo {
    userID: string;
    chairID: number;
    state: number;
    name?: string;
    nick?: string;
    gender?: number;
    headIconURI?: string;
    ip?: string;
    location?: string;
    dfHands?: number;
    diamond?: number;
    charm?: number;
    avatarID?: number;
    clubIDs?: string[];
    dan?: number;
}

/**
 * 玩家信息
 */
export class PlayerInfoView extends cc.Component {
    private view: fgui.GComponent = null;
    private playerInfo: PlayerInfo;

    private win: fgui.Window;

    public show(loader: GResLoader, playerInfo: PlayerInfo): void {

        this.playerInfo = playerInfo;
        loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
        const view = fgui.UIPackage.createObject("room_other_view", "playerInfo").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;
        this.initView(playerInfo);

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(playerInfo: PlayerInfo): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const name = this.view.getChild("name");
        name.text = `昵称：${playerInfo.name}`;

        const id = this.view.getChild("id");
        id.text = `ID：${playerInfo.userID}`;

        const loader = this.view.getChild("loader").asLoader;
        CommonFunction.setHead(loader, playerInfo.headIconURI);

        const douText = this.view.getChild("douText");
        const fkText = this.view.getChild("fkText");

        const count = this.view.getChild("count");

        const addFriendBtn = this.view.getChild("addFriendBtn").asButton;
        const deleteFriendBtn = this.view.getChild("deleteFriendBtn").asButton;

        const genderCtrl = this.view.getController("gender");
        const friendCtrl = this.view.getController("friend");

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

}
