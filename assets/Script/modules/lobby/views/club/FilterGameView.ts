import { ClubViewInterface, RoomType } from "./ClubModuleInterface";

/**
 * 管理界面
 */
export class FilterGameView extends cc.Component {

    private view: fgui.GComponent = null;

    private clubView: ClubViewInterface;

    public show(clubView: ClubViewInterface, selectRoomType: RoomType): void {
        this.clubView = clubView;

        const settingPopupView = fgui.UIPackage.createObject("lobby_club", "filterPopup").asCom;
        this.view = settingPopupView;

        this.initView(selectRoomType);
        fgui.GRoot.inst.showPopup(this.view);
        this.view.setPosition(199, 266);

    }

    private initView(selectRoomType: RoomType): void {
        const allBtn = this.view.getChild("allBtn").asButton;
        const dfmjBtn = this.view.getChild("dfmj").asButton;
        const zjmjBtn = this.view.getChild("zjmj").asButton;

        switch (selectRoomType) {
            case RoomType.ALL:
                allBtn.selected = true;
                break;
            case RoomType.DFMJ:
                dfmjBtn.selected = true;
                break;
            case RoomType.ZJMJ:
                zjmjBtn.selected = true;
                break;

            default:

        }

        allBtn.on(fgui.Event.TOUCH_END, this.onAllGameBtnClick, this);
        dfmjBtn.on(fgui.Event.TOUCH_END, this.onDFMJBtmClick, this);
        zjmjBtn.on(fgui.Event.TOUCH_END, this.onZJMJBtnClick, this);
    }

    private onAllGameBtnClick(): void {

        this.clubView.selectGame(RoomType.ALL);
    }

    private onDFMJBtmClick(): void {

        this.clubView.selectGame(RoomType.DFMJ);
    }

    private onZJMJBtnClick(): void {

        this.clubView.selectGame(RoomType.ZJMJ);

    }

}
