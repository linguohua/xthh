import { CommonFunction, DataStore, Dialog, Logger } from "../lobby/lcore/LCoreExports";
import { Share } from "../lobby/shareUtil/ShareExports";

import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";

export interface RoomInterface {
    sendDisbandAgree(agree: boolean): void;
}

const permissionText: { [key: number]: string } = {
    [0]: "所有人",
    [1]: "微信",
    [2]: "工会"
};

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
export class ReadyView {

    private view: fgui.GComponent;

    private leaveBtn: fgui.GButton;
    private forOtherBtn: fgui.GButton;
    private disbandRoomBtn: fgui.GButton;
    private shareBtn: fgui.GButton;

    // private isForMe: boolean;
    private table: protoHH.casino.Itable;

    private headViews: fgui.GComponent[] = [];
    private host: RoomHost;

    private userID: string;

    // private eventTarget: cc.EventTarget;
    private roomNumber: fgui.GObject;
    private permission: fgui.GObject;
    private ruleText: fgui.GObject;
    private anteText: fgui.GObject;
    private tips: fgui.GObject;
    private originPositions: cc.Vec2[] = [];

    public showReadyView(roomHost: RoomHost, view: fgui.GComponent): void {
        this.host = roomHost;

        if (view !== null) {
            this.view = view;
        }

        const bg = view.getChild("bg");
        CommonFunction.setBgFullScreenSize(bg);

        roomHost.eventTarget.once("onDeal", this.onDeal, this);
        roomHost.eventTarget.once("leave", this.onLeave, this);
        this.view.visible = true;

        this.initView();

    }

    public updateReadyView(roomHost: RoomHost, table: protoHH.casino.Itable
        // tslint:disable-next-line:align
        , view: fgui.GComponent, ps?: protoHH.casino.Itable_player[]): void {
        // 注意：table中的playrs不是最新的，新的player通过参数传进来
        // 后面可以分开或者抽取出来
        this.table = table;
        if (this.view === null || this.view === undefined) {
            this.showReadyView(roomHost, view);
        }

        let players = ps;
        if (players === null || players === undefined) {
            players = table.players;
        }

        this.updateView(players);

    }

    protected updateView(players: protoHH.casino.Itable_player[]): void {
        Logger.debug("updateView");
        // this.ruleText.text = ``;

        this.resetHeadPosition();

        if (`${this.userID}` !== `${this.table.master_id}`) {
            this.leaveBtn.visible = true;
            this.forOtherBtn.visible = false;
            this.disbandRoomBtn.visible = false;
        } else {
            this.leaveBtn.visible = false;
            this.forOtherBtn.visible = true;
            this.disbandRoomBtn.visible = true;
        }

        const disbandTime = this.getDisbandTime();
        this.tips.text = `（${disbandTime}）后, 牌友还没到齐，牌局将自动解散，并退还房卡！`;
        this.roomNumber.text = `${this.table.tag}`;
        this.anteText.text = `底注：${this.table.base}       总共：${this.table.round}局`;
        this.ruleText.text = `一赖到底，飘赖子有奖，笑翻倍`;
        this.permission.text = `[${permissionText[this.table.join]}]允许进入`;

        const length = players.length;
        for (let i = 0; i < length; i++) {
            const headView = this.headViews[i];
            headView.visible = true;

            const player = players[i];
            if (player !== null && player.id !== null) {
                const name = headView.getChild("name");
                name.text = player.channel_nickname || player.nickname;
                name.visible = true;
                const loader = headView.getChild("loader").asLoader;
                CommonFunction.setHead(loader, player.channel_head, player.sex);
                loader.visible = true;
                // loader.url = player.ur
            } else {
                headView.getChild("name").visible = false;
                headView.getChild("loader").visible = false;
            }
        }
    }

    protected initView(): void {
        for (let i = 0; i < 4; i++) {
            const head = this.view.getChild(`head${i}`).asCom;
            head.visible = false;
            this.headViews[i] = head;
            this.originPositions[i] = new cc.Vec2(head.x, head.y);

        }

        // this.resetHeadPosition();

        this.userID = DataStore.getString("playerID");

        this.leaveBtn = this.view.getChild("leaveBtn").asButton;
        this.leaveBtn.onClick(this.onLeaveRoomBtnClick, this);

        this.forOtherBtn = this.view.getChild("forOther").asButton;
        this.forOtherBtn.onClick(this.onForOtherCreateRoomBtnClick, this);

        this.disbandRoomBtn = this.view.getChild("disbandBtn").asButton;
        this.disbandRoomBtn.onClick(this.onDisbandBtnClick, this);

        this.shareBtn = this.view.getChild("shareBtn").asButton;
        this.shareBtn.onClick(this.onShareBtnClick, this);
        this.roomNumber = this.shareBtn.getChild("roomNumber");

        this.permission = this.view.getChild("permission");
        this.ruleText = this.view.getChild("rule");
        this.anteText = this.view.getChild("dizhu");
        this.tips = this.view.getChild("tips");

        // 10 分钟后自动解散房间
        //this.scheduleOnce(this.schedule2DisbandRoom, 10 * 60);

        this.host.component.scheduleOnce(this.schedule2DisbandRoom, 10 * 60);

    }

    protected onHide(): void {
        this.view.visible = false;
        this.host.component.unschedule(this.schedule2DisbandRoom);
    }

    private onLeaveRoomBtnClick(): void {
        Logger.debug("onLeaveRoomBtnClick");
        Dialog.showDialog("你确定要离开当前所在的房间吗？", () => {

            this.leaveRoom();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    private onDisbandBtnClick(): void {
        Logger.debug("onDisbandBtnClick");
        Dialog.showDialog("确定要解散当前的牌局吗？", () => {

            this.disbandRoom();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }
    private onForOtherCreateRoomBtnClick(): void {
        Logger.debug("onForOtherCreateRoomBtnClick");
    }

    private onShareBtnClick(): void {
        Logger.debug("onLeaveRoomBtnClick");
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let text = "";
            if (this.table.room_id === 2100 || this.table.room_id === 2102) {
                text = `仙桃晃晃`;
            } else if (this.table.room_id === 2103) {
                text = `三人两门`;
            } else if (this.table.room_id === 2112) {
                text = `两人两门`;
            }

            text = `${text} 局数：${this.table.round}局\n`;
            text = `${text}房间号：${this.table.tag}\n`;
            Share.shareScreenshot(text, `roomNumber=${this.table.tag}`);
        }
    }

    private onDeal(): void {
        this.onHide();
    }

    // 自己退出房间
    private onLeave(): void {
        this.host.quit();
        this.onHide();
    }

    private disbandRoom(): void {
        const myUserID = DataStore.getString("playerID");
        const req2 = new protoHH.casino.packet_table_disband_req({ player_id: + myUserID });
        const buf = protoHH.casino.packet_table_disband_req.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    private leaveRoom(): void {
        const myUserID = DataStore.getString("playerID");

        const req = new protoHH.casino.packet_table_leave();
        req.idx = 1;
        req.player_id = +myUserID;

        const buf = protoHH.casino.packet_table_leave.encode(req);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_LEAVE);
    }

    private resetHeadPosition(): void {
        if (this.table.players.length !== 2) {
            return;
        }

        this.headViews[2].visible = false;
        this.headViews[3].visible = false;

        this.headViews[0].setPosition(this.originPositions[1].x, this.originPositions[1].y);
        this.headViews[1].setPosition(this.originPositions[2].x, this.originPositions[2].y);
    }

    private schedule2DisbandRoom(): void {
        this.disbandRoom();
    }

    private getDisbandTime(): string {
        const nowTime = Math.ceil(Date.now());
        const disbandTime = new Date();
        disbandTime.setTime(nowTime + 10 * 60 * 1000);

        return `${disbandTime.getHours()}: ${disbandTime.getMinutes()} `;
    }

}
