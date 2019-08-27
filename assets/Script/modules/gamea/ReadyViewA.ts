import { CommonFunction, DataStore, Dialog, KeyConstants, Logger } from "../lobby/lcore/LCoreExports";
import { Share } from "../lobby/shareUtil/ShareExports";

import { RoomHost } from "../lobby/interface/LInterfaceExports";
import { proto as protoHH } from "../lobby/protoHH/protoHH";
import { LocalStrings } from "../lobby/strings/LocalStringsExports";

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
export class ReadyViewA {

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

    private disbandTip: fgui.GObject;
    private disbandCountDown: fgui.GObject;
    private disbandTipText: fgui.GObject;

    private originPositions: cc.Vec2[] = [];

    private countDownTime: number;

    public showReadyView(roomHost: RoomHost, view: fgui.GComponent): void {
        this.host = roomHost;

        if (view !== null) {
            this.view = view;
        }

        const bg = view.getChild("bg");
        CommonFunction.setBgFullScreenSize(bg);

        // roomHost.eventTarget.once("onDeal", this.onDeal, this);
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

    public showOrHideReadyView(isShow: boolean): void {
        if (!isShow) {
            this.onHide();
        } else {
            Logger.error("Unimplement show ready view");
        }
    }

    public showDisbandCountDown(): boolean {
        if (!this.view.visible) {
            return false;
        }

        this.disbandTip.visible = true;
        this.disbandTipText.text = LocalStrings.findString('readyViewDisbandRoomTip');
        this.disbandCountDown.text = '3';

        const countDown = () => {
            const disbandCountDown = +this.disbandCountDown.text;
            this.disbandCountDown.text = `${disbandCountDown - 1}`;
        };

        this.host.component.schedule(countDown, 1, 3);

        return true;
    }

    protected updateView(players: protoHH.casino.Itable_player[]): void {
        Logger.debug("updateView");

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

        const serverTime = this.host.getServerTime();
        this.countDownTime = this.table.quit_time.toNumber() - serverTime;
        const text = this.getCountDownText();

        this.tips.text = text;
        this.roomNumber.text = `${this.table.tag}`;
        const baseScoreText = LocalStrings.findString("baseScore");
        const totalText = LocalStrings.findString("total");
        const roundText = LocalStrings.findString("round");
        const admissionText = LocalStrings.findString("admission");

        this.anteText.text = `${baseScoreText}：${this.table.base}       ${totalText}：${this.table.round} ${roundText}`;
        this.ruleText.text = LocalStrings.findString("plText");
        this.permission.text = `[${permissionText[this.table.join]}]${admissionText}`;

        const length = players.length;
        for (let i = 0; i < length; i++) {
            const headView = this.headViews[i];
            headView.visible = true;

            const player = players[i];
            if (player !== null && player.id !== null) {
                const name = headView.getChild("name");
                let nameStr = "";
                if (player.channel_nickname !== undefined && player.channel_nickname !== null && player.channel_nickname !== "") {
                    nameStr = player.channel_nickname;
                } else {
                    nameStr = player.nickname;
                }

                name.text = CommonFunction.nameFormatWithCount(nameStr, 6);
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

        this.userID = DataStore.getString(KeyConstants.PLAYER_ID);

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

        this.disbandTip = this.view.getChild("disbandCountDown");
        this.disbandCountDown = this.disbandTip.asCom.getChild("countDown");
        this.disbandTipText = this.disbandTip.asCom.getChild("text");

        // 10 分钟后自动解散房间
        //this.scheduleOnce(this.schedule2DisbandRoom, 10 * 60);

        // this.countDownTime = 10 * 60;

        this.host.component.unschedule(this.countDownFunc);
        const func = () => {
            this.countDownFunc();
        };
        this.host.component.schedule(func, 1, cc.macro.REPEAT_FOREVER);

    }

    protected onHide(): void {
        this.view.visible = false;
        this.host.component.unschedule(this.countDownFunc);
    }

    private onLeaveRoomBtnClick(): void {
        Logger.debug("onLeaveRoomBtnClick");

        Dialog.showDialog(LocalStrings.findString('quitRoom'), () => {

            this.leaveRoom();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    private onDisbandBtnClick(): void {
        Logger.debug("onDisbandBtnClick");
        Dialog.showDialog(LocalStrings.findString('disbandRoom'), () => {

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
                text = LocalStrings.findString('xthh');
            } else if (this.table.room_id === 2103) {
                text = LocalStrings.findString('srlm');
            } else if (this.table.room_id === 2112) {
                text = LocalStrings.findString('lrlm');
            }

            const roundCount = LocalStrings.findString('roundCount');
            const round = LocalStrings.findString('round');
            const roomNumber = LocalStrings.findString('roomNumber');

            text = `${text} ${roundCount}：${this.table.round}${round}\n`;
            text = `${text}${roomNumber}${this.table.tag}\n`;
            Share.shareScreenshot(text, `roomNumber=${this.table.tag}`);
        }
    }

    // 自己退出房间
    private onLeave(): void {
        this.host.quit();
        this.onHide();
    }

    private disbandRoom(): void {
        const myUserID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req2 = new protoHH.casino.packet_table_disband_req({ player_id: + myUserID });
        const buf = protoHH.casino.packet_table_disband_req.encode(req2);
        this.host.sendBinary(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_DISBAND_REQ);
    }

    private leaveRoom(): void {
        const myUserID = DataStore.getString(KeyConstants.PLAYER_ID);

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

    private countDownFunc(): void {
        const serverTime = this.host.getServerTime();
        this.countDownTime = this.table.quit_time.toNumber() - serverTime;
        if (this.countDownTime <= 0) {
            this.host.component.unschedule(this.countDownFunc);

            return;
        }

        const text = this.getCountDownText();

        this.tips.text = text;
    }

    private getCountDownText(): string {
        let min = Math.floor(this.countDownTime / 60);
        const hour = Math.floor(min / 60);
        min = min % 60;
        const sec = this.countDownTime % 60;

        if (min < 1 && min >= 0.5) {
            min = 0;
        }
        const hourText = hour > 9 ? hour.toFixed(0) : `0${hour.toFixed(0)}`;
        const minutesText = min > 9 ? min.toFixed(0) : `0${min.toFixed(0)}`;
        const secondsText = sec > 9 ? sec.toFixed(0) : `0${sec.toFixed(0)}`;
        let text = `${minutesText}:${secondsText}`;
        if (hour > 0) {
            text = `${hourText}:${text}`;
        }

        const btnText = `后, 牌友还没到齐，牌局将自动解散，并退还房卡！`;

        return `(${text}) ${btnText}`;
    }

    // private getDisbandTime(): string {
    //     const nowTime = Math.ceil(Date.now());
    //     const disbandTime = new Date();
    //     disbandTime.setTime(nowTime + 10 * 60 * 1000);

    //     return `${disbandTime.getHours()}: ${disbandTime.getMinutes()} `;
    // }

}
