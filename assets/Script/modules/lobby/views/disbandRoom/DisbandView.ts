import { proto } from "../../../gameb/proto/protoGame";
import { Dialog, GResLoader, Logger } from "../../lcore/LCoreExports";

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
export class DisbandView extends cc.Component {

    private view: fgui.GComponent;

    private win: fgui.Window;

    private playersInfo: DisBandPlayerInfo[];

    private myInfo: DisBandPlayerInfo;

    private room: RoomInterface;

    private myCountDown: fgui.GObject;
    private myCountDownTxt: fgui.GObject;

    private isDisbandDone: boolean;

    private isForMe: boolean;

    private leftTime: number;
    private refuseBtn: fgui.GButton;

    private agreeBtn: fgui.GButton;

    private msgDisbandNotify: proto.mahjong.MsgDisbandNotify;

    public saveRoomView(room: RoomInterface, msgDisbandNotify: proto.mahjong.MsgDisbandNotify, loader: GResLoader
        // tslint:disable-next-line:align
        , myInfo: DisBandPlayerInfo, playersInfo: DisBandPlayerInfo[]): void {
        this.myInfo = myInfo;
        this.room = room;
        this.playersInfo = playersInfo;
        this.msgDisbandNotify = msgDisbandNotify;

        if (this.view === null || this.view === undefined) {
            loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            const view = fgui.UIPackage.createObject("room_other_view", "disband_room").asCom;
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
        const msgDisbandNotify = this.msgDisbandNotify;
        //
        Logger.debug("msgDisbandNotify = ", msgDisbandNotify);

        //先更新所有文字信息，例如谁同意，谁拒绝之类
        this.updateTexts(msgDisbandNotify);

        // 更新按钮
        const disbandStateEnum = proto.mahjong.DisbandState;
        const isReject = msgDisbandNotify.disbandState === disbandStateEnum.DoneWithOtherReject;
        const isTimeout = msgDisbandNotify.disbandState === disbandStateEnum.DoneWithWaitReplyTimeout;
        const isNotResponse = msgDisbandNotify.disbandState === disbandStateEnum.DoneWithRoomServerNotResponse;

        const isDone = msgDisbandNotify.disbandState === disbandStateEnum.Done;
        const isWaiting = msgDisbandNotify.disbandState === disbandStateEnum.Waiting;

        if (isReject || isTimeout || isNotResponse) {

            this.myCountDown.visible = false;
            this.agreeBtn.visible = true;
            this.refuseBtn.visible = false;

            this.isDisbandDone = true;

            this.onAgreeBtnClicked();
        } else if (isDone === true) {
            this.isDisbandDone = true;
            this.onAgreeBtnClicked();
        } else if (isWaiting === true) {
            // 如果等待列表中有自己，则显示选择按钮，以便玩家做出选择
            if (msgDisbandNotify.countdown !== undefined) {

                this.unschedule(this.disbandCountDown);
                this.leftTime = msgDisbandNotify.countdown; //倒计时时间，秒为单位
                let found = false;
                const me = this.myInfo;

                msgDisbandNotify.waits.forEach(chairID => {
                    if (chairID === me.chairID) {
                        found = true;
                    }
                });

                if (found === false) {
                    if (msgDisbandNotify.waits.length > 0) {

                        this.myCountDownTxt.text = `${this.leftTime}`;
                        if (this.leftTime <= 0) {
                            this.unschedule(this.disbandCountDown);
                        }

                        Logger.debug("disabnd countdown for others");
                        this.myCountDown.visible = true;
                        //为他人倒计时
                        this.isForMe = false;
                        this.schedule(this.disbandCountDown, 1, cc.macro.REPEAT_FOREVER);
                    }

                    this.showButtons(false);
                } else {
                    Logger.debug("disabnd countdown for me");
                    this.myCountDown.visible = true;
                    this.showButtons(true);

                    //为自己倒计时
                    this.isForMe = true;
                    this.schedule(this.disbandCountDown, 1, cc.macro.REPEAT_FOREVER);
                }

            }
        }

    }

    protected onDestroy(): void {
        this.view.dispose();
        this.win.hide();
        this.win.dispose();
    }

    private disbandCountDown(): void {

        this.leftTime = this.leftTime - 1;
        this.myCountDownTxt.text = `${this.leftTime}`;

        if (this.leftTime <= 0) {
            this.unschedule(this.disbandCountDown);
            if (this.isForMe !== undefined && this.isForMe === true) {
                this.onAgreeBtnClicked();
            }
        }
    }

    private onRefuseBtnClicked(): void {
        this.showButtons(false);
        this.room.sendDisbandAgree(false);

        this.unschedule(this.disbandCountDown);
    }

    private onAgreeBtnClicked(): void {
        this.unschedule(this.disbandCountDown);

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
        this.myCountDown = this.view.getChild("n9");
        this.myCountDownTxt = this.view.getChild("time");
        this.refuseBtn = this.view.getChild("unagreeBtn").asButton;
        this.agreeBtn = this.view.getChild("agreeBtn").asButton;

        this.refuseBtn.onClick(this.onRefuseBtnClicked, this);
        this.agreeBtn.onClick(this.onAgreeBtnClicked, this);
    }

    private updateTexts(msgDisbandNotify: proto.mahjong.MsgDisbandNotify): void {
        let nick = this.getPlayerNick(msgDisbandNotify.applicant);
        const nameText = this.view.getChild("name");
        nameText.text = nick;

        const playerList: fgui.GComponent[] = [];

        //先全部隐藏
        for (let i = 1; i < 5; i++) {
            const view = this.view.getChild(`player${i}`).asCom;
            playerList.push(view);
            const agreeImg = view.getChild(`agree`);
            const refuseImg = view.getChild(`unagree`);
            const waitImg = view.getChild(`wait`);
            view.visible = false;
            agreeImg.visible = false;
            refuseImg.visible = false;
            waitImg.visible = false;

        }

        // 显示谁解散房间
        if (this.getPlayerByChairID(msgDisbandNotify.applicant) !== undefined
            && this.getPlayerByChairID(msgDisbandNotify.applicant) !== null) {

            const view = playerList[msgDisbandNotify.applicant];
            nick = this.getPlayerNick(msgDisbandNotify.applicant);
            view.getChild(`name`).text = `玩家(${nick})`;
            view.getChild(`agree`).visible = true;
            view.visible = true;

        }
        //等待中的玩家列表
        if (msgDisbandNotify.waits !== undefined && msgDisbandNotify.waits !== null) {

            Logger.debug("llwant, msgDisbandNotify.waits length:", msgDisbandNotify.waits.length);

            msgDisbandNotify.waits.forEach(chairID => {
                if (this.getPlayerByChairID(chairID) !== undefined) {
                    Logger.debug("llwant, msgDisbandNotify.waits chairID:", chairID);
                    const view = playerList[chairID];
                    nick = this.getPlayerNick(chairID);
                    view.getChild(`name`).text = `玩家(${nick})`;
                    view.getChild(`wait`).visible = true;
                    view.visible = true;
                }
            });

        }

        //同意的玩家列表
        if (msgDisbandNotify.agrees !== undefined && msgDisbandNotify.agrees !== null) {

            Logger.debug("llwant, msgDisbandNotify.agrees length:", msgDisbandNotify.agrees.length);

            msgDisbandNotify.agrees.forEach(chairID => {
                if (this.getPlayerByChairID(chairID) !== undefined) {
                    Logger.debug("llwant, msgDisbandNotify.agrees chairID:", chairID);
                    const view = playerList[chairID];
                    nick = this.getPlayerNick(chairID);
                    view.getChild(`name`).text = `玩家(${nick})`;
                    view.getChild(`agree`).visible = true;
                    view.visible = true;
                }
            });

        }

        //拒绝的玩家列表
        if (msgDisbandNotify.rejects !== undefined && msgDisbandNotify.rejects !== null) {

            let isShowTip = true;

            Logger.debug("llwant, msgDisbandNotify.rejects length:", msgDisbandNotify.rejects.length);

            msgDisbandNotify.rejects.forEach(chairID => {
                if (this.getPlayerByChairID(chairID) !== undefined) {
                    Logger.debug("llwant, msgDisbandNotify.rejects chairID:", chairID);
                    const view = playerList[chairID];
                    nick = this.getPlayerNick(chairID);
                    view.getChild(`name`).text = `玩家(${nick})`;
                    view.getChild(`unagree`).visible = true;
                    view.visible = true;

                    if (isShowTip === true) {
                        const str = `玩家 ${nick} 不同意解散，解散不成功!`;
                        this.showDialog(str);
                        isShowTip = false;

                    }

                }
            });

        }

    }

    private showDialog(str: string): void {
        Dialog.showDialog(str, () => {

            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    private getPlayerNick(chairID: number): string {
        const playerInfo = this.getPlayerByChairID(chairID);
        let nick = playerInfo.nick;

        if (nick === undefined || nick === undefined || nick === "") {
            nick = playerInfo.userID;
        }

        return nick;
    }

    private getPlayerByChairID(chairID: number): DisBandPlayerInfo {
        //

        let playerInfo = null;

        for (const p of this.playersInfo) {
            if (p.chairID === chairID) {
                playerInfo = p;
            }
        }

        return playerInfo;

    }

}
