
import { RoomHost } from "../../interface/LInterfaceExports";
import { CommonFunction, SoundMgr } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";

/**
 * 玩家信息
 */
export class PlayerInfoView extends cc.Component {
    private view: fgui.GComponent = null;
    // private playerInfo: PlayerInfo;

    private win: fgui.Window;

    private playerName: fgui.GObject;
    private id: fgui.GObject;
    private headLoader: fgui.GLoader;
    private leaveGuildCount: fgui.GObject;

    private genderCtrl: fgui.Controller;
    // private douText: fgui.GObject;
    // private fkText: fgui.GObject;

    private playerID: string;
    private roomHost: RoomHost;

    public show(roomHost: RoomHost, playerID: string, searchPlayerAck: protoHH.casino.packet_search_ack): void {
        this.roomHost = roomHost;
        this.playerID = playerID;
        if (this.view === null) {
            roomHost.loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            const view = fgui.UIPackage.createObject("room_other_view", "playerInfo").asCom;

            CommonFunction.setViewInCenter(view);

            const mask = view.getChild("mask");
            CommonFunction.setBgFullScreenSize(mask);

            this.view = view;
            this.initView();
            this.searchReq(+playerID);

            const win = new fgui.Window();
            win.contentPane = view;
            win.modal = true;

            this.win = win;
        }

        if (searchPlayerAck !== null && searchPlayerAck !== undefined) {
            this.updateView(searchPlayerAck);
        }

        this.win.show();
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        this.playerName = this.view.getChild("name");
        this.id = this.view.getChild("id");
        this.headLoader = this.view.getChild("loader").asLoader;
        this.leaveGuildCount = this.view.getChild("count");
        const addFriendBtn = this.view.getChild("addFriendBtn").asButton;
        addFriendBtn.onClick(this.onAddFriendBtnClick, this);

        // const deleteFriendBtn = this.view.getChild("deleteFriendBtn").asButton;

        this.genderCtrl = this.view.getController("gender");
        // const friendCtrl = this.view.getController("friend");

    }

    private updateView(searchPlayerAck: protoHH.casino.packet_search_ack): void {

        //名字
        let name = "";

        const channelNickname = searchPlayerAck.data.channel_nickname;
        if (channelNickname !== undefined && channelNickname !== null && channelNickname !== "") {
            name = channelNickname;
        } else {
            name = searchPlayerAck.data.nickname;
        }

        this.playerName.text = `昵称：${name}`;
        this.id.text = `ID：${searchPlayerAck.data.id} `;

        if (searchPlayerAck.data.sex === 0) {
            this.genderCtrl.selectedIndex = 1;
        } else {
            this.genderCtrl.selectedIndex = 0;
        }

        CommonFunction.setHead(this.headLoader, searchPlayerAck.data.channel_head, searchPlayerAck.data.avatar, searchPlayerAck.data.sex);

        this.leaveGuildCount.text = LocalStrings.findString("leaveGuild", `${searchPlayerAck.data.leave_guild} `);

    }
    private onCloseBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
        this.destroy();
    }

    private onAddFriendBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);

        const req = new protoHH.casino.packet_friend_req();
        req.friend_id = +this.playerID;
        req.op = protoHH.casino.eFRIEND_OP.FRIEND_OP_REQUEST;

        const buf = protoHH.casino.packet_friend_req.encode(req);
        this.roomHost.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_FRIEND_REQ);

        this.destroy();

    }

    private searchReq(playerID: number): void {
        const req = new protoHH.casino.packet_search_req();
        req.player_id = +playerID;

        const buf = protoHH.casino.packet_search_req.encode(req);
        this.roomHost.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_SEARCH_REQ);
    }

}
