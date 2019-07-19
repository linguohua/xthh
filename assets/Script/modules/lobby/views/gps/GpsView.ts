import { RoomHost } from "../../interface/LInterfaceExports";
import { CommonFunction, DataStore, Dialog, Logger } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";
import { Share } from "../../shareUtil/ShareExports";

interface RoomInterface {
    getRoomHost(): RoomHost;

    onDissolveClicked(): void;
}

/**
 * 解散页面
 */
export class GpsView extends cc.Component {

    private view: fgui.GComponent;

    private win: fgui.Window;

    private roomHost: RoomHost;

    private room: RoomInterface;

    public updateGpsView(room: RoomInterface): void {
        this.room = room;
        this.roomHost = room.getRoomHost();
        const loader = this.roomHost.getLobbyModuleLoader();
        if (this.view === null || this.view === undefined) {
            loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            const view = fgui.UIPackage.createObject("room_other_view", "gps").asCom;

            CommonFunction.setViewInCenter(view);

            const bg = view.getChild("mask");
            CommonFunction.setBgFullScreenSize(bg);

            this.view = view;
            const win = new fgui.Window();
            win.contentPane = view;
            win.modal = true;

            this.win = win;

            this.win.show();

            this.initView();
        }
    }

    protected onDestroy(): void {
        this.view.dispose();
        this.win.hide();
        this.win.dispose();
    }

    private initView(): void {
        const disbandBtn = this.view.getChild("disbandBtn");
        disbandBtn.onClick(this.onDisbandBtnClick, this);

        const continueBtn = this.view.getChild("continueBtn");
        continueBtn.onClick(this.onContinueBtnClick, this);
    }

    private onDisbandBtnClick(): void {
        const room = this.room;
        Dialog.showDialog("你确定要发起解散当前的牌局吗？", () => {
            room.onDissolveClicked();
            // tslint:disable-next-line:align
        }, () => {
            //
        });

        this.destroy();
    }

    private onContinueBtnClick(): void {
        this.destroy();
    }
}
