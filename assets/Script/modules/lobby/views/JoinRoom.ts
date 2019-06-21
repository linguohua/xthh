
import { LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
const { ccclass } = cc._decorator;

/**
 * 加入房间
 */
@ccclass
export class JoinRoom extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    // private eventTarget: cc.EventTarget;

    private numbers: fgui.GObject[];

    private hintText: fgui.GTextField;

    private roomNumber: string = "";
    private lm: LobbyModuleInterface;

    protected onLoad(): void {
        // this.eventTarget = new cc.EventTarget();
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_join_room/lobby_join_room");
        const view = fgui.UIPackage.createObject("lobby_join_room", "joinRoom").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

        this.initView();

        this.win.show();
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(): void {
        const clostBtn = this.view.getChild("closeBtn");
        clostBtn.onClick(this.onCloseBtnClick, this);

        const resetBtn = this.view.getChild("buttonCS");
        resetBtn.onClick(this.onResetBtnClick, this);

        const backBtn = this.view.getChild("buttonSC");
        backBtn.onClick(this.onBackBtnClick, this);

        for (let i = 0; i < 10; i++) {
            const button = this.view.getChild(`button${i}`);
            button.onClick(() => { this.onInputButton(i); }, this);
        }

        this.numbers = [];
        for (let i = 0; i < 6; i++) {
            const num = this.view.getChild(`number${i + 1}`);
            this.numbers.push(num);
        }

        this.hintText = this.view.getChild("hintText").asTextField;

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onResetBtnClick(): void {
        Logger.debug("onResetBtnClick");
        for (let i = 0; i < 6; i++) {
            this.numbers[i].text = "";
        }
        this.roomNumber = "";
        this.hintText.visible = true;
    }

    private onBackBtnClick(): void {
        Logger.debug("onBackBtnClick");
        const len = this.roomNumber.length;
        if (len !== 0) {
            this.numbers[len - 1].text = "";
        }

        this.roomNumber = this.roomNumber.substring(0, len - 1);
        if (this.roomNumber === "") {
            this.hintText.visible = true;
        } else {
            this.hintText.visible = false;
        }
    }

    private onInputButton(input: number): void {
        Logger.debug(`onInputButton, input:${input}`);
        const numberLength = this.roomNumber.length;
        if (numberLength < 6) {
            const num = this.numbers[numberLength];
            num.text = `${input}`;

            this.roomNumber = `${this.roomNumber}${input}`;

            if (this.roomNumber === "") {
                this.hintText.visible = true;
            } else {
                this.hintText.visible = false;
            }
        }

        this.joinRoomCheck(this.roomNumber);
    }

    private joinRoomCheck(roomNumber: string): void {
        if (roomNumber.length === 6) {
            this.lm.requetJoinRoom(roomNumber);
            this.win.hide();
            this.win.dispose();
            this.destroy();
        }
    }

    // private requetJoinRoom(roomNumber: string): void {
    //     const tk = DataStore.getString("token", "");
    //     const joinRoomURL = `${LEnv.rootURL}${LEnv.requestRoomInfo}?&tk=${tk}&roomNumber=${roomNumber}`;

    //     Logger.trace("joinRoomURL, joinRoomURL:", joinRoomURL);

    //     HTTP.hGet(this.eventTarget, joinRoomURL, (xhr: XMLHttpRequest, err: string) => {
    //         let errMsg = null;
    //         if (err !== null) {
    //             errMsg = `加入房间错误，错误码:${err}`;
    //         } else {
    //             errMsg = HTTP.hError(xhr);
    //             if (errMsg === null) {
    //                 const data = <Uint8Array>xhr.response;
    //                 // proto 解码登录结果
    //                 const requestRoomInfoRsp = proto.lobby.MsgRequestRoomInfoRsp.decode(data);
    //                 if (requestRoomInfoRsp.result === proto.lobby.MsgError.ErrSuccess) {
    //                     this.enterGame(requestRoomInfoRsp.roomInfo);
    //                 } else {
    //                     const errorString = LobbyError.getErrorString(requestRoomInfoRsp.result);
    //                     Dialog.showDialog(errorString);
    //                 }
    //             }
    //         }

    //         if (errMsg !== null) {
    //             Logger.debug("quickly login failed:", errMsg);
    //             // 显示错误对话框
    //             Dialog.showDialog(errMsg, () => {
    //                 //
    //             });
    //         }
    //     });
    // }

    // private enterGame(roomInfo: proto.lobby.IRoomInfo): void {
    //     this.win.hide();
    //     this.win.dispose();
    //     this.destroy();

    //     const myRoomInfo = {
    //         roomID: roomInfo.roomID,
    //         roomNumber: roomInfo.roomNumber,
    //         config: roomInfo.config,
    //         gameServerID: roomInfo.gameServerID
    //     };
    //     const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
    //     lm.enterGame(myRoomInfo);

    // }

}
