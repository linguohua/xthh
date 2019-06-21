import { DataStore, Dialog, HTTP, LEnv, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../proto/protoLobby";
import { ClubViewInterface } from "./ClubModuleInterface";
import { ClubRequestError } from "./ClubRequestError";

const { ccclass } = cc._decorator;

/**
 * 创建茶馆页面
 */
@ccclass
export class CreateClubView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private clubView: ClubViewInterface;

    public bind(clubView: ClubViewInterface): void {
        this.clubView = clubView;
    }

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();
        const view = fgui.UIPackage.createObject("lobby_club", "createClubView").asCom;
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

        const confirmBtn = this.view.getChild("confirmBtn");
        const needDiamond = this.view.getChild("needDiamond");

        confirmBtn.onClick(() => {
            this.onConfirmBtnClick();
            // tslint:disable-next-line:align
        }, this);

        needDiamond.text = "9999";
    }

    private onConfirmBtnClick(): void {
        const inputField = this.view.getChild("inputField");
        const clubName = inputField.text;

        const errMsg = this.checkLegal(clubName);

        if (errMsg !== undefined) {
            Dialog.showDialog(errMsg, () => {
                //
            });

            return;
        }
        this.createClub(clubName);
    }

    private checkLegal(name: string): string {

        let msg: string;

        if (name === null) {
            msg = "输出名称为空";
        } else if (name.length < 3 || name.length > 7) {
            msg = `群名不合法，长于3个文字，并且小于七个文字,当前长度为${name.length}`;
        }

        return msg;
    }

    private createClub(clubName: string): void {
        const tk = DataStore.getString("token", "");
        const url = `${LEnv.rootURL}${LEnv.createClub}?&tk=${tk}&&clname=${clubName}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {

            const data = <Uint8Array>xhr.response;

            const msgClubReply = proto.club.MsgClubReply.decode(data);

            let clubRsp: proto.club.MsgCreateClubReply;

            if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                clubRsp = proto.club.MsgCreateClubReply.decode(msgClubReply.content);
                this.updateViewClubList(clubRsp.clubInfo);
            } else if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCError) {
                const msgCubOperGenericReply = proto.club.MsgCubOperGenericReply.decode(msgClubReply.content);
                ClubRequestError.showErrMsg(msgCubOperGenericReply.errorCode);
            }

        };

        this.clubRequest(url, cb);

    }

    private updateViewClubList(clubInfo: proto.club.IMsgClubInfo): void {

        this.clubView.addClub(clubInfo);
        this.destroy();
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
