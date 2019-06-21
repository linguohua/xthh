import { DataStore } from "../../../lcore/LCoreExports";
import { proto } from "../../../proto/protoLobby";
import { ClubViewInterface } from "../ClubModuleInterface";
import { DisbandClubView } from "./DisbandClubView";
import { ModifyClubName } from "./ModifyClubName";
import { QuitClubView } from "./QuitClubView";

/**
 * 管理界面
 */
export class SettingPopupView extends cc.Component {

    private view: fgui.GComponent = null;

    private clubView: ClubViewInterface;

    private clubInfo: proto.club.IMsgClubInfo;

    // 、private clubInfo: proto.club.IMsgClubInfo;

    public disbandClub(): void {
        this.clubView.disbandClub();
    }

    public modifyClubName(name: string): void {
        this.clubView.modifyClubName(name);
    }

    public quitClub(): void {
        this.clubView.quitClub();
    }

    public showQuicklyCreateView(): void {
        this.clubView.showQuicklyCreateView();
    }

    public show(clubView: ClubViewInterface, clubInfo: proto.club.IMsgClubInfo): void {
        this.clubView = clubView;
        this.clubInfo = clubInfo;
        const settingPopupView = fgui.UIPackage.createObject("lobby_club", "settingPopup").asCom;
        this.view = settingPopupView;

        this.initView();
        fgui.GRoot.inst.showPopup(this.view);
        this.view.setPosition(949, 106);

    }

    private initView(): void {

        const managerCom = this.view.getChild("managerCom").asCom;
        const modifyNameItem = managerCom.getChild("modify").asButton;
        const disbandItem = managerCom.getChild("disband").asButton;
        const quickSettingItem = managerCom.getChild("quickSetting").asButton;
        const quitClub = this.view.getChild("quitClubBtn").asButton;

        modifyNameItem.onClick(this.onModifyClubNameClick, this);
        disbandItem.onClick(this.onDisbandClick, this);
        quickSettingItem.onClick(this.onQuickSettingClick, this);
        quitClub.onClick(this.onQuitClubClick, this);

        const isOwner = this.isOwner();

        const isManagerController = this.view.getController("isManager");

        if (isOwner === false) {
            isManagerController.selectedIndex = 0;
            this.view.setSize(172, 94);
        } else {
            isManagerController.selectedIndex = 1;
        }
    }

    private isOwner(): boolean {
        const userId = DataStore.getString("userID", "");
        const clubOwnerId = this.clubInfo.creatorUserID;

        return userId === clubOwnerId ? true : false;
    }

    private onModifyClubNameClick(): void {

        const view = this.addComponent(ModifyClubName);
        view.bind(this, this.clubInfo.baseInfo.clubName);
    }

    private onDisbandClick(): void {

        const view = this.addComponent(DisbandClubView);
        view.bind(this, this.clubInfo.baseInfo.clubName);
    }

    private onQuickSettingClick(): void {

        this.showQuicklyCreateView();
        fgui.GRoot.inst.hidePopup();
    }

    private onQuitClubClick(): void {

        const view = this.addComponent(QuitClubView);
        view.bind(this, this.clubInfo.baseInfo.clubName);
    }

}
