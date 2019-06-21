import { DataStore, HTTP, LEnv, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../proto/protoLobby";
import { ClubRequestError } from "./ClubRequestError";

const { ccclass } = cc._decorator;
/**
 * 申请记录页面
 */
@ccclass
export class ApplyRecordView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private recordList: fgui.GList;

    private records: proto.club.IMsgClubEvent[] = [];

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();

        const view = fgui.UIPackage.createObject("lobby_club", "applyRecord").asCom;
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

        //邮件列表
        this.recordList = this.view.getChild("recordList").asList;
        this.recordList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderPhraseListItem(index, item);
        };
        this.recordList.setVirtual();

        //拉取记录
        this.loadMyRecord();
    }

    private renderPhraseListItem(index: number, obj: fgui.GObject): void {

        const event = this.records[index];

        const time = obj.asCom.getChild("time");
        // const clubName = obj.asCom.getChild("clubName");
        // const id = obj.asCom.getChild("id");
        const result = obj.asCom.getChild("result");

        if (event !== undefined) {

            // const nick = event.displayInfo1.nick === "" ? event.userID1 : event.displayInfo1.nick;
            // clubName.text = `${nick}`;

            const generatedTime = event.generatedTime;
            const date = new Date(generatedTime * 1000);
            const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
            const day = date.getDay() < 10 ? `0${date.getDay()}` : `${date.getDay()}`;
            const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
            const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
            time.text = `${date.getFullYear()}/${month}/${day}   ${hour}:${minute}`;

            let resultText = "";
            let color: cc.Color = new cc.Color().fromHEX("000000");

            switch (event.approvalResult) {
                case 0:
                    resultText = "提交申请";
                    color = new cc.Color().fromHEX("b3522e");
                    break;

                case 1:
                    resultText = "已同意";
                    color = new cc.Color().fromHEX("b3522e");
                    break;

                case 2:
                    resultText = "已拒绝";
                    color = new cc.Color().fromHEX("4b8a0e");
                    break;

                default:

            }

            result.text = resultText;
            result.asTextField.color = color;

        }

    }

    private loadMyRecord(): void {

        const tk = DataStore.getString("token", "");
        const url = `${LEnv.rootURL}${LEnv.loadMyApplyEvent}?&tk=${tk}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {

            const data = <Uint8Array>xhr.response;

            if (data !== null) {
                const msgClubReply = proto.club.MsgClubReply.decode(data);
                if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {

                    const msgClubLoadEventsReply = proto.club.MsgClubLoadEventsReply.decode(msgClubReply.content);
                    if (msgClubLoadEventsReply.events !== null) {
                        this.updateList(msgClubLoadEventsReply.events);
                    }

                } else if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCError) {
                    const msgCubOperGenericReply = proto.club.MsgCubOperGenericReply.decode(msgClubReply.content);
                    ClubRequestError.showErrMsg(msgCubOperGenericReply.errorCode);
                }

            }

        };

        this.clubRequest(url, cb);

    }

    private updateList(records: proto.club.IMsgClubEvent[]): void {
        this.records = records;
        this.recordList.numItems = this.records.length;
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
