import { CommonFunction, DataStore, GResLoader, Logger, LobbyModuleInterface } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";
import { RoomHost } from "../../interface/RoomHost";

export interface RoomInterface {
    sendDisbandAgree(agree: boolean): void;
}
/**
 * 包装精简的用户信息，
 */
export class DisBandPlayerInfo {
    public readonly userID: string;
    public readonly chairID: number;

    public readonly nick: string;

    constructor(userID: string, chairID: number, nick: string) {
        this.userID = userID;
        this.chairID = chairID;
        this.nick = nick;
    }

}

/**
 * 解散页面
 */
export class ReadyView extends cc.Component {

    private view: fgui.GComponent;

    private win: fgui.Window;

    // private isForMe: boolean;
    private table: protoHH.casino.Itable;
    private roomNumber: fgui.GObject;

    private headViews: fgui.GComponent[] = [];

    private ruleText: fgui.GTextField;
    private anteText: fgui.GTextField;
    private host: RoomHost;

    private userID: string;

    public showReadyView(roomHost: RoomHost, table: protoHH.casino.Itable, ps?: protoHH.casino.Itable_player[]): void {
        // 注意：table中的playrs不是最新的，新的player通过参数传进来
        // 后面可以分开或者抽取出来
        this.host = roomHost;
        const loader = roomHost.getLobbyModuleLoader();
        this.table = table;
        if (this.view === null || this.view === undefined) {
            loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            const view = fgui.UIPackage.createObject("room_other_view", "ready").asCom;

            CommonFunction.setViewInCenter(view);

            const bg = view.getChild("bg");
            CommonFunction.setBgFullScreenSize(bg);

            roomHost.eventTarget.once("onDeal", this.onDeal, this);

            this.view = view;
            const win = new fgui.Window();
            win.contentPane = view;
            win.modal = true;

            this.win = win;

            this.win.show();

            this.initView();
        }

        let players = ps;
        if (players === null || players === undefined) {
            players = table.players;
        }

        this.updateView(players);

    }

    protected updateView(players: protoHH.casino.Itable_player[]): void {
        Logger.debug("updateView, roomNumber:", this.table.tag);
        this.roomNumber.text = `${this.table.tag}`;
        this.anteText.text = `底注：${this.table.base}       总共：${this.table.round}局`;
        // this.ruleText.text = ``;

        const length = players.length;
        for (let i = 0; i < length; i++) {
            const headView = this.headViews[i];
            headView.visible = true;

            const player = players[i];
            if (player !== null && player.id !== null) {
                const name = headView.getChild("name");
                name.text = player.nickname;
                name.visible = true;
                const loader = headView.getChild("loader").asLoader;
                CommonFunction.setHead(loader, player.channel_head, player.sex);
                // loader.url = player.ur
            } else {
                headView.getChild("name").visible = false;
            }
        }
    }

    protected initView(): void {
        for (let i = 0; i < 4; i++) {
            const head = this.view.getChild(`head${i}`).asCom;
            head.visible = false;
            this.headViews[i] = head;
        }

        this.userID = DataStore.getString("playerID");

        const leaveBtn = this.view.getChild("leaveBtn").asButton;
        leaveBtn.onClick(this.onLeaveRoomBtnClick, this);

        const forOtherBtn = this.view.getChild("forOther").asButton;
        forOtherBtn.onClick(this.onForOtherCreateRoomBtnClick, this);

        const disbandRoomBtn = this.view.getChild("disbandBtn").asButton;
        disbandRoomBtn.onClick(this.onLeaveRoomBtnClick, this);

        const shareBtn = this.view.getChild("shareBtn").asButton;
        shareBtn.onClick(this.onShareBtnClick, this);

        if (this.userID !== `${this.table.master_id}`) {
            leaveBtn.visible = true;
            forOtherBtn.visible = false;
            disbandRoomBtn.visible = false;
        } else {
            leaveBtn.visible = false;
            forOtherBtn.visible = true;
            disbandRoomBtn.visible = true;
        }

        this.roomNumber = shareBtn.getChild("roomNumber");

        this.ruleText = this.view.getChild("rule").asTextField;
        this.anteText = this.view.getChild("dizhu").asTextField;
    }
    // protected updateView(): void {
    //     Logger.debug("updateView, roomNumber:", this.table.tag);
    //     this.roomNumber.text = `${this.table.tag}`;

    //     const length = this.players.length;
    //     for (let i = 0; i < length; i++) {
    //         const headView = this.headViews[i];
    //         headView.visible = true;

    //         const player = this.players[i];
    //         if (player !== null && player.id !== null) {
    //             headView.getChild("name").text = player.nickname;
    //             const loader = headView.getChild("loader").asLoader;
    //             CommonFunction.setHead(loader, player.channel_head, player.sex);
    //             // loader.url = player.ur
    //         }
    //     }
    // }

    protected onDestroy(): void {
        this.view.dispose();
        this.win.hide();
        this.win.dispose();
    }

    private onLeaveRoomBtnClick(): void {
        Logger.debug("onLeaveRoomBtnClick");
        const myUserID = DataStore.getString("playerID");
        const req2 = new protoHH.casino.packet_table_disband_req({ player_id: + myUserID });
        const buf = protoHH.casino.packet_table_disband_req.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    private onForOtherCreateRoomBtnClick(): void {
        Logger.debug("onForOtherCreateRoomBtnClick");
    }

    private onShareBtnClick(): void {
        Logger.debug("onLeaveRoomBtnClick");
    }

    private onDeal(): void {
        this.destroy();
    }
}
