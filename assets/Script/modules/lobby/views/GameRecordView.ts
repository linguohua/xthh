import { DataStore, Dialog, HTTP, LEnv, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto } from "../proto/protoLobby";
import { GameSubRecordView } from "./GameSubRecordView";

/**
 * 战绩界面
 */
export class GameRecordView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private replayRooms: proto.lobby.MsgReplayRoom[] = [];

    private recordList: fgui.GList;

    private lobbyModule: LobbyModuleInterface;

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_game_record/lobby_game_record");

        const view = fgui.UIPackage.createObject("lobby_game_record", "recordView").asCom;
        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();

        this.initView();
    }

    protected onDestroy(): void {
        if (this.lobbyModule !== null) {
            this.lobbyModule.eventTarget.off("onGameRecordShow", this.onGameRecordShow);
        }

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

        this.recordList = this.view.getChild("list").asList;
        this.recordList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderListItem(index, item);
        };

        this.recordList.setVirtual();

        this.loadGameRecord();

        this.lobbyModule = <LobbyModuleInterface>this.getComponent("LobbyModule");
        if (this.lobbyModule !== null) {
            this.lobbyModule.eventTarget.on(`onGameRecordShow`, this.onGameRecordShow, this);
        }
        //this.recordList.numItems = 1;
    }

    private onGameRecordShow(): void {
        if (this.win !== null) {
            this.win.show();
        }
    }

    private renderListItem(index: number, obj: fgui.GObject): void {

        const replayRoom = this.replayRooms[index];

        obj.offClick(this.goSubRecordView, this);
        obj.onClick(this.goSubRecordView, this);
        obj.data = index;

        let text = "未知麻将";
        const roomType = replayRoom.recordRoomType;
        switch (roomType) {
            case 1:
                text = "大丰麻将";
                break;
            case 3:
                text = "东台麻将";
                break;
            case 8:
                text = "关张";
                break;
            case 9:
                text = "7王523";
                break;
            case 11:
                text = "斗地主";
                break;

            default:
        }

        const rountText = `${replayRoom.records.length} 局`;
        const gameName = obj.asCom.getChild("gameName");
        gameName.text = `${text} ${rountText}`;

        const roomNumber = obj.asCom.getChild("roomNumber");
        roomNumber.text = `${replayRoom.roomNumber} ${"号 房间"}`;

        const dateText = obj.asCom.getChild("time");

        const date = new Date(replayRoom.startTime * 1000);
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1} ` : `${date.getMonth() + 1} `;
        const day = date.getDay() < 10 ? `0${date.getDay()} ` : `${date.getDay()} `;
        const hour = date.getHours() < 10 ? `0${date.getHours()} ` : `${date.getHours()} `;
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()} ` : `${date.getMinutes()} `;

        dateText.text = `${date.getFullYear()} /${month}/${day} ${hour}: ${minute} `;

        let nameText;
        let playerScoreText;
        let winnerImg;
        let winnerSore = 0;
        let finalWinnerImg;

        // const ownerUserID = replayRoom.ownerUserID;

        for (let i = 0; i < replayRoom.players.length; i++) {
            const player = replayRoom.players[i];

            nameText = obj.asCom.getChild(`playerName${i + 1}`);

            const nick = player.nick === "" ? player.userID : player.nick;
            nameText.text = `${nick}`;

            playerScoreText = obj.asCom.getChild(`playerScore${i + 1}`);
            if (player.totalScore > 0) {
                playerScoreText.text = `${+player.totalScore}`;
                playerScoreText.asTextField.color = new cc.Color().fromHEX("#D52012");
            } else {
                playerScoreText.text = `${player.totalScore}`;
                playerScoreText.asTextField.color = new cc.Color().fromHEX("#359031");
            }

            winnerImg = obj.asCom.getChild(`winner${i + 1}`);
            winnerImg.visible = false;

            if (player.totalScore >= winnerSore) {
                finalWinnerImg = winnerImg;
                winnerSore = player.totalScore;
            }

            obj.asCom.getChild(`owner${i + 1}`).visible = false;

            if (player.userID === replayRoom.ownerUserID) {
                obj.asCom.getChild(`owner${i + 1}`).visible = true;
            }

        }

        if (finalWinnerImg !== undefined) {
            finalWinnerImg.visible = true;
        }
    }

    private loadGameRecord(): void {
        const tk = DataStore.getString("token", "");
        const loadGameRecordUrl = `${LEnv.rootURL}${LEnv.lrproom}?&rt=1&tk=${tk}`;
        Logger.debug("loadGameRecord loadGameRecordUrl:", loadGameRecordUrl);
        // Dialog.showDialog("正在加载战绩......");

        HTTP.hGet(this.eventTarget, loadGameRecordUrl, (xhr: XMLHttpRequest, err: string) => {

            let errMsg;
            if (err !== null) {
                errMsg = `错误码: ${err} `;
                Dialog.showDialog(errMsg);

            } else {
                errMsg = HTTP.hError(xhr);

                if (errMsg === null) {

                    const data = <Uint8Array>xhr.response;
                    const gameRecords = proto.lobby.MsgAccLoadReplayRoomsReply.decode(data);
                    this.updateList(gameRecords);
                }
            }

        });

    }

    private updateList(recordRsp: proto.lobby.MsgAccLoadReplayRoomsReply): void {

        recordRsp.replayRooms.forEach(element => {

            const record = proto.lobby.MsgReplayRoom.decode(element.replayRoomBytes);
            this.replayRooms.push(record);
        });

        this.recordList.numItems = this.replayRooms === undefined ? 0 : this.replayRooms.length;
    }

    private goSubRecordView(ev: fgui.Event): void {
        const index = <number>ev.initiator.data;
        const subView = this.addComponent(GameSubRecordView);
        const replayRoom = this.replayRooms[index];
        subView.updateData(replayRoom);
        this.win.hide();
    }

}
