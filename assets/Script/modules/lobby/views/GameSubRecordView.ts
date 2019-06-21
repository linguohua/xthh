import { DataStore, Dialog, GameModuleLaunchArgs, HTTP, LEnv, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto } from "../proto/protoLobby";

// interface GameRecordInterface {
//     destoryMySelf: Function;

// }
/**
 * 战绩界面
 */
export class GameSubRecordView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;
    private replayRoom: proto.lobby.MsgReplayRoom;

    private lobbyModule: LobbyModuleInterface;

    private recordList: fgui.GList;

    public updateData(replayRoom: proto.lobby.MsgReplayRoom): void {

        this.replayRoom = replayRoom;
        const replayPlayerInfos = replayRoom.players;

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
        const gameName = this.view.asCom.getChild("gameName");
        gameName.text = `${text} ${rountText}`;

        const roomNumber = this.view.asCom.getChild("roomNumber");
        roomNumber.text = `${replayRoom.roomNumber} ${"号 房间"}`;

        const dateText = this.view.asCom.getChild("time");

        const date = new Date(replayRoom.startTime * 1000);
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1} ` : `${date.getMonth() + 1} `;
        const day = date.getDay() < 10 ? `0${date.getDay()} ` : `${date.getDay()} `;
        const hour = date.getHours() < 10 ? `0${date.getHours()} ` : `${date.getHours()} `;
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()} ` : `${date.getMinutes()} `;

        dateText.text = `${date.getFullYear()} /${month}/${day} ${hour}: ${minute} `;

        let name;
        let label;
        let userID;

        let player: proto.lobby.IMsgReplayPlayerInfo;

        for (let i = 0; i < replayPlayerInfos.length; i++) {

            player = replayPlayerInfos[i];
            name = player.nick;
            userID = player.userID;
            label = this.view.getChild(`playName${i + 1}`);

            const nick = name === "" ? userID : name;
            label.text = `${nick}`;
            this.view.getChild(`owner${i + 1}`).visible = false;
            if (player.userID === replayRoom.ownerUserID) {
                this.view.getChild(`owner${i + 1}`).visible = true;
            }
        }

        this.updateList();

    }

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_game_record/lobby_game_record");

        const view = fgui.UIPackage.createObject("lobby_game_record", "subRecordView").asCom;
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
            this.lobbyModule.eventTarget.off("onGameSubRecordShow", this.onGameSubRecordShow);
        }

        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        if (this.lobbyModule !== null) {
            this.lobbyModule.eventTarget.emit(`onGameRecordShow`);
        }

        this.destroy();
    }

    private initView(): void {
        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const arrow = this.view.getChild("arrow");
        arrow.onClick(this.onCloseClick, this);

        this.recordList = this.view.getChild("list").asList;
        this.recordList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderListItem(index, item);
        };
        this.recordList.setVirtual();

        this.lobbyModule = <LobbyModuleInterface>this.getComponent("LobbyModule");
        if (this.lobbyModule !== null) {
            this.lobbyModule.eventTarget.on(`onGameSubRecordShow`, this.onGameSubRecordShow, this);
        }

    }

    private onGameSubRecordShow(): void {
        if (this.win !== null) {
            this.win.show();
        }
    }

    private renderListItem(index: number, obj: fgui.GObject): void {

        const record = this.replayRoom.records[index];

        const roundText = obj.asCom.getChild("roundText");
        const roundIndex = index + 1;
        const roundIndexStr = roundIndex < 10 ? `0${roundIndex} ` : `${roundIndex} `;

        roundText.text = `${roundIndexStr}`;

        const dateText = obj.asCom.getChild("time");

        const date = new Date(record.startTime * 1000);
        const hour = date.getHours() < 10 ? `0${date.getHours()} ` : `${date.getHours()} `;
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()} ` : `${date.getMinutes()} `;
        const second = date.getSeconds() < 10 ? `0${date.getSeconds()} ` : `${date.getSeconds()} `;
        dateText.text = `${hour}: ${minute}:${second} `;

        let label;

        for (let i = 0; i < record.playerScores.length; i++) {

            label = obj.asCom.getChild(`score${i + 1}`);
            const score = record.playerScores[i].score;
            if (score > 0) {
                label.text = `${+score}`;
                label.asTextField.color = new cc.Color().fromHEX("#D52012");
            } else {
                label.text = `${score}`;
                label.asTextField.color = new cc.Color().fromHEX("#359031");
            }
        }

        const playBtn = obj.asCom.getChild("playBtn");

        playBtn.offClick(this.onPlayBtnClick, this);
        playBtn.onClick(this.onPlayBtnClick, this);
        playBtn.data = record.recordUUID;
    }

    private onPlayBtnClick(ev: fgui.Event): void {
        const recordID = <string>ev.initiator.data;
        this.loadRecord(recordID);
    }

    private enterReplayRoom(record: proto.lobby.MsgAccLoadReplayRecord): void {
        const recordCfg = this.replayRoom;
        let modName;
        if (recordCfg.recordRoomType === 1) {
            //大丰麻将
            modName = "gameb";
        } else if (recordCfg.recordRoomType === 21) {
            //湛江
            modName = "gameb";
        } else if (recordCfg.recordRoomType === 8) {
            modName = "gamea";
        }

        this.win.hide();
        //this.destroy();

        const myUserID = DataStore.getString("userID", "");
        const myUser = { userID: myUserID };

        const params: GameModuleLaunchArgs = {
            jsonString: "replay",
            userInfo: myUser,
            roomInfo: null,
            record: record
        };

        const lobbyModuleInterface = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lobbyModuleInterface.switchToGame(params, modName);

    }

    private loadRecord(recordID: string): void {
        const tk = DataStore.getString("token", "");
        const loadGameRecordUrl = `${LEnv.rootURL}${LEnv.lrprecord}?&rt=1&tk=${tk}&rid=${recordID}`;
        Logger.debug("loadRecord loadGameRecordUrl:", loadGameRecordUrl);
        // Dialog.showDialog("正在加载战绩......");

        HTTP.hGet(this.eventTarget, loadGameRecordUrl, (xhr: XMLHttpRequest, err: string) => {

            let errMsg;
            if (err !== null) {
                errMsg = `错误码:${err}`;
                Dialog.showDialog(errMsg);

            } else {
                errMsg = HTTP.hError(xhr);

                if (errMsg === null) {
                    const data = <Uint8Array>xhr.response;
                    const record = proto.lobby.MsgAccLoadReplayRecord.decode(data);
                    Logger.debug("record:", record);
                    this.enterReplayRoom(record);
                }
            }

        });
    }

    private updateList(): void {
        this.recordList.numItems = this.replayRoom.records === undefined ? 0 : this.replayRoom.records.length;
    }

}
