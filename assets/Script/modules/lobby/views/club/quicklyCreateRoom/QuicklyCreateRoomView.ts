import { DataStore, HTTP, LEnv, Logger, NewRoomViewPath } from "../../../lcore/LCoreExports";
import { proto } from "../../../proto/protoLobby";
import { NewRoomView } from "../../NewRoomView";

const { ccclass } = cc._decorator;

/**
 * 一键组局
 */
@ccclass
export class QuicklyCreateRoomView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private clubInfo: proto.club.IMsgClubInfo;

    public show(clubInfo: proto.club.IMsgClubInfo): void {
        this.clubInfo = clubInfo;
        this.initView();
        this.win.show();
    }

    public saveConfig(ruleJson: string): void {
        //
        Logger.debug("saveConfig ruleJson = ", ruleJson);
        this.setConfig(ruleJson);
    }

    protected onLoad(): void {
        //
        this.eventTarget = new cc.EventTarget();

        const view = fgui.UIPackage.createObject("lobby_club", "quicklyCreateRoom").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
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
        //

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const editBtn = this.view.getChild("editBtn");
        editBtn.onClick(this.onEditBtnClick, this);

        this.updateView();

    }

    private onEditBtnClick(): void {
        const newRoomView = this.addComponent(NewRoomView);
        newRoomView.showView(NewRoomViewPath.Form_Club_Setting, this.clubInfo, this);

    }

    private setConfig(ruleJson: string): void {
        const tk = DataStore.getString("token", "");
        const url = `${LEnv.rootURL}${LEnv.setRoomOptions}?&tk=${tk}&clubID=${this.clubInfo.baseInfo.clubID}&options=${ruleJson}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {

            const data = <Uint8Array>xhr.response;
            let clubRsp: proto.club.MsgClubInfo = null;
            if (data !== null) {
                const msgClubReply = proto.club.MsgClubReply.decode(data);
                if (msgClubReply.replyCode === proto.club.ClubReplyCode.RCOperation) {
                    clubRsp = proto.club.MsgClubInfo.decode(msgClubReply.content);

                    this.clubInfo.createRoomOptions = clubRsp.createRoomOptions;
                    this.updateView();
                }
            }
        };

        this.clubRequest(url, cb);
    }

    private getRoomConfig(): string {
        let cfg = ``;

        try {
            const config = <{ [key: string]: boolean | number }>JSON.parse(this.clubInfo.createRoomOptions);

            const roomType = <number>config[`roomType`];
            const name = ` 游戏  :  ${this.getGameName(roomType)}\r\n`;
            cfg = cfg + name;

            const playerNumAcquired: number = <number>config[`playerNumAcquired`];
            const playerCount = ` 人数  :  ${playerNumAcquired}人\r\n`;
            cfg = cfg + playerCount;

        } catch (e) {
            Logger.error(e);
        }

        return cfg;
    }

    private getGameName(roomType: number): string {
        let name = ``;
        switch (roomType) {
            case 1:
                name = "大丰麻将";
                break;
            case 3:
                name = "东台麻将";
                break;
            case 8:
                name = "关张";
                break;
            case 9:
                name = "7王523";
                break;
            case 11:
                name = "斗地主";
                break;

            case 21:
                name = "湛江麻将";
                break;

            default:
        }

        return name;
    }

    private updateView(): void {
        const controller = this.view.getController("hasConfig");
        if (this.clubInfo.createRoomOptions === null || this.clubInfo.createRoomOptions === "") {
            controller.selectedIndex = 1;
        } else {
            controller.selectedIndex = 0;
        }

        const cfgStr = this.getRoomConfig();
        const gameConfigText = this.view.getChild("text3");

        gameConfigText.text = cfgStr;

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
