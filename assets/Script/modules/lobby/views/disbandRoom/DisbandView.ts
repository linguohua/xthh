import { RoomHost } from "../../interface/LInterfaceExports";
import { CommonFunction, DataStore, GResLoader, Logger } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";

export interface RoomInterface {
    getRoomHost(): RoomHost;
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
export class DisbandView extends cc.Component {

    private view: fgui.GComponent;

    private win: fgui.Window;

    private playersInfo: DisBandPlayerInfo[];

    private myInfo: DisBandPlayerInfo;

    private room: RoomInterface;

    // private myCountDown: fgui.GObject;
    private myCountDownTxt: fgui.GTextField;

    private isDisbandDone: boolean;

    // private isForMe: boolean;

    private leftTime: number;
    private refuseBtn: fgui.GButton;

    private agreeBtn: fgui.GButton;

    private disbandReq: protoHH.casino.packet_table_disband_req;
    private disbandAck: protoHH.casino.packet_table_disband_ack;

    private playerList: fgui.GComponent[];

    private countDownSchedule: Function;

    private startDisbandTime: number = 0;

    public showDisbandView(room: RoomInterface, loader: GResLoader
        // tslint:disable-next-line:align
        , myInfo: DisBandPlayerInfo, playersInfo: DisBandPlayerInfo[],
        // tslint:disable-next-line:align
        disbandReq: protoHH.casino.packet_table_disband_req, disbandAck: protoHH.casino.packet_table_disband_ack): void {
        this.myInfo = myInfo;
        this.room = room;
        this.playersInfo = playersInfo;
        if (disbandReq !== null) {
            this.startDisbandTime = disbandReq.disband_time.toNumber();
        }
        this.disbandReq = disbandReq;
        this.disbandAck = disbandAck;

        if (this.view === null || this.view === undefined) {
            loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            const view = fgui.UIPackage.createObject("room_other_view", "disband_room").asCom;

            CommonFunction.setViewInCenter(view);

            const mask = view.getChild("mask");
            CommonFunction.setBgFullScreenSize(mask);

            this.room.getRoomHost().eventTarget.once("disband", this.onDisband, this);
            this.view = view;
            const win = new fgui.Window();
            win.contentPane = view;
            win.modal = true;

            this.win = win;

            this.win.show();

            this.initView();
        }

        this.updateView();

    }

    public updateView(): void {
        // const disbandReq = this.disbandReq;
        //
        Logger.debug("disbandReq = ", this.disbandReq);
        Logger.debug("disbandAck = ", this.disbandAck);

        //先更新所有文字信息，例如谁同意，谁拒绝之类
        this.updateTexts(this.disbandReq, this.disbandAck);

        if ((this.disbandReq !== null && `${this.disbandReq.player_id}` === this.myInfo.userID) ||
            (this.disbandAck !== null && `${this.disbandAck.player_id}` === this.myInfo.userID)) {
            this.agreeBtn.visible = false;
            this.refuseBtn.visible = false;
        }

        // 如果有人拒绝了，则关闭解散框
        if (this.disbandAck !== null && !this.disbandAck.disband) {
            this.unschedule(this.countDownSchedule);

            this.destroy();

            return;
        }

        if (this.disbandReq !== null && this.disbandReq.disband_time.toNumber() === 0) {
            this.unschedule(this.countDownSchedule);
            this.destroy();

            return;
        }
    }

    protected onDestroy(): void {
        this.room.getRoomHost().eventTarget.off("disband");

        this.view.dispose();
        this.win.hide();
        this.win.dispose();
    }

    private countDownFunc(): void {
        const serverTime = this.room.getRoomHost().getServerTime();

        const gameConfigStr = DataStore.getString("gameConfig");
        const gameConfig = <protoHH.casino.game_config>JSON.parse(gameConfigStr);
        const disbandTime = gameConfig.table_disband_time;
        this.leftTime = this.startDisbandTime + disbandTime - serverTime;

        Logger.debug("DisbandView.countDownFunc this.leftTime  = ", this.leftTime);
        if (this.leftTime < 0) {
            this.unschedule(this.countDownSchedule);

            return;
        }

        this.myCountDownTxt.text = this.leftTime.toString();
    }

    private onRefuseBtnClicked(): void {
        this.showButtons(false);
        this.room.sendDisbandAgree(false);
    }

    private onAgreeBtnClicked(): void {

        if (this.isDisbandDone === true) {
            this.destroy();
        } else {
            Logger.debug(" you choose to agree disband");
            this.showButtons(false);
            this.room.sendDisbandAgree(true);

        }
    }
    private showButtons(show: boolean): void {
        this.refuseBtn.visible = show;
        this.agreeBtn.visible = show;
    }

    private initView(): void {
        // this.myCountDown = this.view.getChild("n9");
        this.myCountDownTxt = this.view.getChild("time").asTextField;
        this.refuseBtn = this.view.getChild("unagreeBtn").asButton;
        this.agreeBtn = this.view.getChild("agreeBtn").asButton;

        this.refuseBtn.onClick(this.onRefuseBtnClicked, this);
        this.agreeBtn.onClick(this.onAgreeBtnClicked, this);

        this.playerList = [];
        //先全部隐藏
        for (let i = 1; i < 5; i++) {
            const view = this.view.getChild(`player${i}`).asCom;
            this.playerList.push(view);
            const agreeImg = view.getChild(`agree`);
            const refuseImg = view.getChild(`unagree`);
            const waitImg = view.getChild(`wait`);
            view.visible = false;
            agreeImg.visible = false;
            refuseImg.visible = false;
            waitImg.visible = true;

        }
    }

    private updateTexts(disbandReq: protoHH.casino.packet_table_disband_req, disbandAck: protoHH.casino.packet_table_disband_ack): void {
        if (disbandReq !== null) {
            const nick = this.getPlayerNickByID(`${disbandReq.player_id}`);
            const nameText = this.view.getChild("name");
            nameText.text = CommonFunction.nameFormatWithCount(nick, 6);

            //const gameConfigStr = DataStore.getString("gameConfig");
            //const gameConfig = <protoHH.casino.game_config>JSON.parse(gameConfigStr);
            //const disbandTime = gameConfig.table_disband_time;

            // TODO: 暂时写死，这里需要用同步服务器时间
            //this.leftTime = disbandTime;
            // const nowTime = Date.now() / 1000;

            // this.leftTime = disbandTime - (nowTime - disbandReq.disband_time.toNumber())
            this.countDownFunc();
            this.countDownSchedule = () => {
                this.countDownFunc();
            };

            this.schedule(this.countDownSchedule, 1, cc.macro.REPEAT_FOREVER);
        }

        for (let i = 0; i < this.playersInfo.length; i++) {
            const playerInfo = this.playersInfo[i];
            const view = this.playerList[i];
            const name = view.getChild("name").asTextField;
            if (playerInfo.nick !== "") {
                name.text = playerInfo.nick;
            } else {
                name.text = playerInfo.userID;
            }

            if (disbandReq !== null && playerInfo.userID === `${disbandReq.player_id}`) {
                view.getChild("wait").visible = false;
                view.getChild("agree").visible = true;
            }

            if (disbandAck !== null && playerInfo.userID === `${disbandAck.player_id}`) {
                view.getChild("wait").visible = false;
                if (disbandAck.disband) {
                    view.getChild("agree").visible = true;
                } else {
                    view.getChild("unagree").visible = true;
                }
            }

            view.visible = true;
        }

    }

    private getPlayerNickByID(playerID: string): string {
        const playerInfo = this.getPlayerByID(playerID);
        let nick = playerInfo.nick;

        if (nick === undefined || nick === undefined || nick === "") {
            nick = playerInfo.userID;
        }

        return nick;
    }

    private getPlayerByID(playerID: string): DisBandPlayerInfo {
        //

        let playerInfo = null;

        for (const p of this.playersInfo) {
            if (p.userID === playerID) {
                playerInfo = p;
            }
        }

        return playerInfo;

    }

    private onDisband(): void {
        this.unschedule(this.countDownSchedule);
        this.destroy();
    }

}
