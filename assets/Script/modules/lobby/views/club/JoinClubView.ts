import { DataStore, Dialog, HTTP, LEnv, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../proto/protoLobby";
import { ClubRequestError } from "./ClubRequestError";

const { ccclass } = cc._decorator;
/**
 * 加入茶馆页面
 */
@ccclass
export class JoinClubView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;
    private clubNumber: string;
    private numbers: fgui.GObject[] = [];
    private hintText: fgui.GObject;

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();

        const view = fgui.UIPackage.createObject("lobby_club", "joinClub").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();

        this.initView();
    }

    protected onDestroy(): void {

        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const resetBtn = this.view.getChild("buttonCS");
        resetBtn.onClick(this.onResetBtnClick, this);

        const backBtn = this.view.getChild("buttonSC");
        backBtn.onClick(this.onBackBtnClick, this);

        for (let i = 0; i < 10; i++) {
            const button = this.view.getChild(`button${i}`);
            button.onClick(() => {
                this.onInputButton(i);
                // tslint:disable-next-line:align
            }, this);

        }

        for (let i = 1; i < 6; i++) {
            const num = this.view.getChild(`number${i}`);
            this.numbers.push(num);

        }

        this.hintText = this.view.getChild("hintText");

    }

    private onResetBtnClick(): void {
        this.numbers.forEach(element => {
            element.text = "";
        });

        this.clubNumber = "";
        this.hintText.visible = true;
    }

    private onBackBtnClick(): void {

        if (this.clubNumber === undefined) {
            return;
        }

        const len = this.clubNumber.length - 1;

        if (len >= 0 && len < 6) {
            this.numbers[len].text = "";
        } else {
            return;
        }

        this.clubNumber = this.clubNumber.substring(0, len);

        if (this.clubNumber === "") {
            this.hintText.visible = true;
        } else {
            this.hintText.visible = false;
        }

    }

    private onInputButton(inputNumber: number): void {

        let numberLength = 0;

        if (this.clubNumber !== undefined) {
            numberLength = this.clubNumber.length;
        }

        if (numberLength < 5) {
            const strIndex = numberLength;
            const num = this.numbers[strIndex];

            if (num !== undefined) {
                num.text = ` ${inputNumber}`;
            } else {
                Logger.error(`"JoinRoomView:onInputButton, index ${strIndex} out of range"`);
            }

            if (this.clubNumber !== undefined) {
                this.clubNumber = `${this.clubNumber}${inputNumber}`;
            } else {
                this.clubNumber = `${inputNumber}`;
            }

            if (this.clubNumber === "") {
                this.hintText.visible = true;
            } else {
                this.hintText.visible = false;
            }

        }

        this.joinRoomCheck(this.clubNumber);
    }

    private joinRoomCheck(clubNumber: string): void {

        if (clubNumber.length === 5) {
            this.requestJoinClub(clubNumber);
        }
    }

    private requestJoinClub(clubNumber: string): void {

        const tk = DataStore.getString("token", "");
        const url = `${LEnv.rootURL}${LEnv.joinClub}?&tk=${tk}&clubNumber=${clubNumber}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {

            const data = <Uint8Array>xhr.response;

            const msgClubReply = proto.club.MsgClubReply.decode(data);

            if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                //  这个接口不会返回 RCOperation
            } else if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCError) {
                const msgCubOperGenericReply = proto.club.MsgCubOperGenericReply.decode(msgClubReply.content);
                if (msgCubOperGenericReply.errorCode === proto.club.ClubOperError.CERR_OK) {
                    Dialog.showDialog("已经发送申请，请等待结果", () => {

                        this.destroy();
                        // tslint:disable-next-line:align
                    }, () => {
                        //
                    });
                } else {
                    ClubRequestError.showErrMsg(msgCubOperGenericReply.errorCode);
                }

            }
        };

        this.clubRequest(url, cb);

    }
    /**
     * 网络请求
     * @param url 链接
     * @param cb 回调
     */
    private clubRequest(url: string, cb: Function): void {
        if (url === null) {
            return null;
        }

        Logger.debug("clubRequest url = ", url);

        HTTP.hGet(this.eventTarget, url, (xhr: XMLHttpRequest, err: string) => {

            cb(xhr, err);
        });
    }

}
