import { DataStore, Dialog, GameModuleLaunchArgs, KeyConstants, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto as protoHH } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";

const { ccclass } = cc._decorator;

interface NewRoomViewInterface {
    setViewVisible: Function;
    onInputRecordIdBtnClick: Function;
}

/**
 * 房卡记录界面
 */
@ccclass
export class GameRecordView {
    private view: fgui.GComponent;
    private lm: LobbyModuleInterface;

    private newRoomView: NewRoomViewInterface;

    private recordList: fgui.GList;

    private readonly replayTable: { [key: string]: protoHH.casino.table } = {};
    private recordMsgs: protoHH.casino.Icasino_score[];

    public init(view: fgui.GComponent, lm: LobbyModuleInterface, newRoomView: NewRoomViewInterface): void {
        this.view = view;
        this.lm = lm;
        this.newRoomView = newRoomView;
        this.initView();
        this.registerHandler();
    }

    public onTapBtnClick(): void {
        const selectedIndex = this.view.getController("tag").selectedIndex;

        const btnIndex = 6 - selectedIndex;
        this.onScoreTimeBtnClick(btnIndex);

    }

    private initView(): void {

        const recordBtn = this.view.getChild("recordBtn").asButton;

        recordBtn.onClick(this.onInputRecordIdBtnClick, this);

        this.recordList = this.view.getChild("list").asList;

        this.recordList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderRecordListItem(index, item);
        };
        this.recordList.setVirtual();

        //n天前的日期
        for (let i = 0; i < 7; i++) {
            const curDate = new Date();
            const n = curDate.setDate(curDate.getDate() - i);
            const date = new Date(n);
            const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
            const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
            // const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
            // const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
            const timeText = `${month}/${day}`;
            const btn = this.view.getChild(`btn${i}`).asButton;
            if (i === 0) {
                btn.selected = true;
            }
            btn.getChild("n1").text = timeText;
            btn.getChild("n2").text = timeText;
            btn.onClick(() => { this.onScoreTimeBtnClick(i); }, this);
        }
    }

    private onInputRecordIdBtnClick(): void {
        this.newRoomView.onInputRecordIdBtnClick();
    }

    private onScoreTimeBtnClick(day: number): void {
        const req2 = new protoHH.casino.packet_score_time_req();
        req2.casino_id = 0; //固定
        req2.day = day; // 0~6 0当天 1昨天 2前天
        const buf = protoHH.casino.packet_score_time_req.encode(req2);
        this.lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_SCORE_TIME_REQ);
    }

    private registerHandler(): void {
        this.lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_SCORE_ACK, this.onGameRecord, this);
        this.lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_REPLAY_ACK, this.onReplayAck, this);
    }

    private onGameRecord(msg: protoHH.casino.ProxyMessage): void {
        const reply = protoHH.casino.packet_score_time_ack.decode(msg.Data);
        this.recordMsgs = [];
        if (reply.scores !== undefined && reply.scores !== null && reply.scores.length > 0) {
            for (const score of reply.scores) {
                // const length = Object.keys(this.recordMsgs).length + 1;
                // this.recordMsgs[length] = score;
                this.recordMsgs.push(score);
            }
        }
        if (this.recordMsgs.length === 0) {
            Dialog.prompt(LocalStrings.findString('noGameRecordTips'));
        }
        this.recordList.numItems = this.recordMsgs.length;
    }

    private onReplayAck(msg: protoHH.casino.ProxyMessage): void {

        const reply = protoHH.casino.packet_replay_ack.decode(msg.Data);

        Logger.debug("packet_replay_ack  reply = ", reply);

        if (reply.ret !== 0) {

            switch (reply.ret) {
                case 1:
                    Dialog.prompt(LocalStrings.findString('wrongGameRecordIdTips'));
                    break;
                case 22:
                    Dialog.prompt(LocalStrings.findString('daleyOperationTips', reply.replay_id.toString()));
                    break;

                default:
            }

            return;
        }

        const table = protoHH.casino.table.decode(reply.replay);

        const replayId = reply.replay_id;
        const replayInMap = this.replayTable[replayId];
        if (replayInMap === undefined || replayInMap === null || replayId > 10000) {
            this.replayTable[replayId] = table;
        }

        this.showReplay(table);
    }

    private showReplay(table: protoHH.casino.table): void {

        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const myUser = { userID: playerID };

        if (table !== undefined && table !== null) {
            const params: GameModuleLaunchArgs = {
                jsonString: "replay",
                userInfo: myUser,
                joinRoomParams: undefined,
                createRoomParams: undefined,
                record: table,
                roomId: table.room_id
            };

            this.lm.eventTarget.on(`onGameSubRecordShow`, this.onGameReturn, this);

            this.newRoomView.setViewVisible(false);

            this.lm.switchToGame(params, "gameb");
        } else {
            Logger.debug("reply.replay === null");
        }
    }

    private onGameReturn(): void {
        this.newRoomView.setViewVisible(true);
    }

    private renderRecordListItem(index: number, item: fgui.GObject): void {
        const msg = this.recordMsgs[index];
        const obj = item.asCom;

        const date = new Date(msg.create_time.toNumber() * 1000);
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
        const timeText = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;

        obj.getChild("time").text = timeText;
        obj.getChild("room").text = `${msg.table_tag}`;
        obj.getChild("num").text = `${msg.round}`;
        obj.getChild("score").text = `${msg.score}`;
        obj.getChild("name").text = LocalStrings.findString("xthh");
        obj.getChild("id").text = `${msg.replay_id}`;
        obj.getChild("btn").asButton
            .offClick(undefined, undefined);

        obj.getChild("btn").asButton
            .onClick(() => { this.onReplayBtnClick(msg.replay_id); }, this);
    }

    private onReplayBtnClick(rId: number): void {

        const table = this.replayTable[rId];

        if (table === undefined || table === null) {
            const req2 = new protoHH.casino.packet_replay_req();
            req2.replay_id = rId;
            const buf = protoHH.casino.packet_replay_req.encode(req2);
            this.lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_REPLAY_REQ);
        } else {
            this.showReplay(table);
        }
    }

}
