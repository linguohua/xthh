import { CommonFunction, DataStore, Dialog, HTTP, LEnv, Logger } from "../../../lcore/LCoreExports";
import { proto } from "../../../proto/protoLobby";
import { LobbyError } from "../../LobbyError";
import { ClubViewInterface } from "../ClubModuleInterface";

const { ccclass } = cc._decorator;

/**
 * 房间管理
 */
@ccclass
export class RoomManageView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private roomInfo: proto.lobby.IRoomInfo;

    private clubView: ClubViewInterface;

    private playerList: fgui.GList;

    private clubId: string;

    public show(clubView: ClubViewInterface, roomInfo: proto.lobby.IRoomInfo, clubId: string): void {
        this.clubView = clubView;
        this.roomInfo = roomInfo;
        this.clubId = clubId;
        this.updatePlayerList();
        this.win.show();
    }

    protected onLoad(): void {
        //
        this.eventTarget = new cc.EventTarget();

        const view = fgui.UIPackage.createObject("lobby_club", "roomManageView").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

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
        //

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const disbandRoomBtn = this.view.getChild("disbandRoomBtn");
        disbandRoomBtn.onClick(this.onDisbandRoomBtnClick, this);

        this.playerList = this.view.getChild("playerList").asList;

        this.playerList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderPlayerListItem(index, item);
        };

        this.playerList.setVirtual();

    }

    private updatePlayerList(): void {
        if (this.roomInfo !== undefined && this.roomInfo !== null && this.roomInfo.users !== null) {
            this.playerList.numItems = this.roomInfo.users.length;
        }
    }

    private renderPlayerListItem(index: number, item: fgui.GObject): void {
        //
        const user = this.roomInfo.users[index];

        const nameText = item.asCom.getChild("name").asTextField;
        const idText = item.asCom.getChild("id").asTextField;
        const scoreText = item.asCom.getChild("score").asTextField;

        nameText.text = user.nickName === "" ? `${user.userID}` : user.nickName;
        idText.text = `ID : ${user.userID}`;
        scoreText.text = `当前分数 : ${-5000}`;

        const loader = item.asCom.getChild("loader").asLoader;
        CommonFunction.setHead(loader, user.avatarURL);
    }

    private onDisbandRoomBtnClick(): void {
        //

        Dialog.showDialog("确定解散房间吗", () => {
            this.disbandRoom();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    private disbandRoom(): void {
        const tk = DataStore.getString("token", "");
        const url = `${LEnv.rootURL}${LEnv.deleteClubRoom}?&tk=${tk}&clubID=${this.clubId}&roomID=${this.roomInfo.roomID}`;

        const cb = (xhr: XMLHttpRequest, err: string) => {
            const data = <Uint8Array>xhr.response;

            if (data !== null) {
                const msgLoadRoomListRsp = proto.lobby.MsgLoadRoomListRsp.decode(data);
                if (msgLoadRoomListRsp.result === proto.lobby.MsgError.ErrSuccess) {

                    this.clubView.loadClubRooms();
                    this.destroy();
                } else {
                    const error = LobbyError.getErrorString(msgLoadRoomListRsp.result);
                    Dialog.showDialog(error, () => {
                        // tslint:disable-next-line:align
                    }, () => {
                        //
                    });
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
