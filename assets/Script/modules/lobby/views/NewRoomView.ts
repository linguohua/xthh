import { GameError } from "../errorCode/ErrorCodeExports";
import {
    CommonFunction, DataStore,
    Dialog, Enum, GameModuleLaunchArgs, KeyConstants, LobbyModuleInterface, Logger, Record
} from "../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { proto as protoHH } from "../protoHH/protoHH";
import { JoinRoom } from "./JoinRoom";

const { ccclass } = cc._decorator;

interface DefaultConfig {
    gameTypeRadioBtnIndex: number;
    anteRadioBtnIndex: number;
    roundRadioBtnIndex: number;
    joinRadioBtnIndex: number;
    playerRequireRadioBtnIndex: number;
}

interface MyGame {
    casinoID: number;
    roomID: number;

    name: string;

}

// const gameModule: { [key: number]: string } = {
//     [2100]: "gamea", //仙桃晃晃
//     [2103]: "gameb", //三人两门
//     [2112]: "gameb" //两人两门
// };

const myGames: MyGame[] = [{ casinoID: 2, roomID: 2100, name: "仙桃晃晃" },
{ casinoID: 16, roomID: 2103, name: "三人两门" }, { casinoID: 16, roomID: 2112, name: "两人两门" }];

// const gameNames: string[] = ["仙桃晃晃", "三人两门", "两人两门"];

const joinTypes: string[] = ["所有", "微信", "工会"];

const playerRequires: number[] = [2, 3, 4];
/**
 * NewRoomView 创建房间界面
 */
@ccclass
export class NewRoomView extends cc.Component {

    public forReview: boolean = false;
    public itemsJSON: { [key: string]: boolean | number } = {};

    private view: fgui.GComponent;
    private win: fgui.Window;

    private gameTypeRadioBtns: fgui.GButton[] = [];
    private anteRadioBtns: fgui.GButton[] = [];
    private roundRadioBtns: fgui.GButton[] = [];
    private joinRadioBtns: fgui.GButton[] = [];
    private playerRequireRadioBtns: fgui.GButton[] = [];

    private gameConfig: protoHH.casino.game_config;

    private defaultConfig: DefaultConfig;

    private fkText: fgui.GTextField;
    private noEnoughFkText: fgui.GTextField;
    private createRoomBtn: fgui.GButton;
    private recordList: fgui.GList;
    private recordMsgs: protoHH.casino.Icasino_score[];
    private lm: LobbyModuleInterface;
    public getView(): fgui.GComponent {
        return this.view;
    }

    public showView(): void {
        // this.club = club;
        // this.quicklyCreateView = quicklyCreateView;
        this.initHandler();
        this.initView();
        this.win.show();
    }

    public joinRoom(roomNumber: string): void {
        // const playerID = DataStore.getString("playerID");
        // const myUser = { userID: playerID };

        // const joinRoomParams = {
        //     roomNumber: roomNumber
        // };

        // Logger.debug("joinRoomParams:", joinRoomParams);

        // const params: GameModuleLaunchArgs = {
        //     jsonString: "",
        //     userInfo: myUser,
        //     joinRoomParams: joinRoomParams,
        //     createRoomParams: null,
        //     record: null
        // };

        // const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");

        // this.win.hide();
        // this.destroy();

        // lm.switchToGame(params, "gameb");s

        const playerID = DataStore.getString("playerID");
        const req = {
            player_id: +playerID,
            table_id: long.ZERO,
            tag: +roomNumber
        };

        const req2 = new protoHH.casino.packet_table_join_req(req);
        const buf = protoHH.casino.packet_table_join_req.encode(req2);

        if (this.lm !== undefined) {
            this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
        }
        // this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);

    }

    protected onLoad(): void {
        // 加载大厅界面
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_create_room/lobby_personal_room");
        const view = fgui.UIPackage.createObject("lobby_personal_room", "personalRoomView").asCom;
        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

        const gameConfigStr = DataStore.getString("gameConfig");
        this.gameConfig = <protoHH.casino.game_config>JSON.parse(gameConfigStr);

        const defaultConfig = DataStore.getString("createRoomParams", "");
        if (defaultConfig !== "") {
            this.defaultConfig = <DefaultConfig>JSON.parse(defaultConfig);
        } else {
            this.defaultConfig = {
                gameTypeRadioBtnIndex: 0, anteRadioBtnIndex: 0, roundRadioBtnIndex: 0,
                joinRadioBtnIndex: 0, playerRequireRadioBtnIndex: 0
            };
        }
    }

    protected onDestroy(): void {
        this.saveConfig();
        this.win.hide();
        this.win.dispose();
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const boxRecordBtn = this.view.getChild("boxRecordBtn").asButton;
        boxRecordBtn.onClick(this.onBoxRecordBtnClick, this);

        const boxRecordText = boxRecordBtn.getChild("n2");
        boxRecordText.text = "宝箱记录";

        const fkRecordBtn = this.view.getChild("fkRecordBtn").asButton;
        fkRecordBtn.onClick(this.onFKRecordBtn, this);

        const fkRecordText = fkRecordBtn.getChild("n2");
        fkRecordText.text = "房卡记录";

        const gameRecordBtn = this.view.getChild("gameRecordBtn").asButton;
        gameRecordBtn.onClick(this.onGameRecordBtn, this);

        const gameRecordText = gameRecordBtn.getChild("n2");
        gameRecordText.text = "战绩统计";

        const personalRoomBtn = this.view.getChild("personalRoomBtn").asButton;
        personalRoomBtn.onClick(this.onPersonalRoomBtn, this);
        personalRoomBtn.selected = true;

        const personalRoomTextx = personalRoomBtn.getChild("n2");
        personalRoomTextx.text = "私人房";

        this.initPersonalRoom();
        //战绩界面
        const recordCom = this.view.getChild("recordCom").asCom;
        this.recordList = recordCom.getChild("list").asList;
        this.recordList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderRecordListItem(index, item);
        };

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
            const btn = recordCom.getChild(`btn${i}`).asButton;
            if (i === 0) {
                btn.selected = true;
            }
            btn.getChild("n1").text = timeText;
            btn.getChild("n2").text = timeText;
            btn.onClick(() => { this.onScoreTimeBtnClick(i); }, this);
        }
    }

    private initHandler(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_SCORE_ACK, this.onGameRecord, this);
        lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_REPLAY_ACK, this.onReplayAck, this);
        lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onJoinTableAck, this);
    }
    private initBoxRecord(): void {
        // TODO:
    }

    private initFKRecord(): void {
        // TODO:
    }

    private onScoreTimeBtnClick(day: number): void {
        const req2 = new protoHH.casino.packet_score_time_req();
        req2.casino_id = 0; //固定
        req2.day = day; // 0~6 0当天 1昨天 2前天
        const buf = protoHH.casino.packet_score_time_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_SCORE_TIME_REQ);
    }

    private initGameRecord(): void {
        // TODO:
        this.onScoreTimeBtnClick(0);
    }
    private onGameRecord(msg: protoHH.casino.ProxyMessage): void {
        const reply = protoHH.casino.packet_score_time_ack.decode(msg.Data);
        // Logger.debug("战绩--------------------reply: ", reply);
        this.recordMsgs = [];
        if (reply.scores !== undefined && reply.scores !== null && reply.scores.length > 0) {
            for (const score of reply.scores) {
                // const length = Object.keys(this.recordMsgs).length + 1;
                // this.recordMsgs[length] = score;
                this.recordMsgs.push(score);
            }
        }
        this.recordList.numItems = this.recordMsgs.length;
    }

    private onReplayAck(msg: protoHH.casino.ProxyMessage): void {
        const playerID = DataStore.getString("playerID");
        const myUser = { userID: playerID };

        const reply = protoHH.casino.packet_replay_ack.decode(msg.Data);
        const record = new Record();
        record.replayRecordBytes = reply.replay;
        const params: GameModuleLaunchArgs = {
            jsonString: "replay",
            userInfo: myUser,
            joinRoomParams: null,
            createRoomParams: null,
            record: record
        };

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");

        this.win.hide();
        this.destroy();

        lm.switchToGame(params, "gameb");
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
        obj.getChild("name").text = `仙桃晃晃`;
        obj.getChild("id").text = `${msg.id}`;
        obj.getChild("btn").asButton.onClick(() => { this.onReplayBtnClick(msg.replay_id); }, this);
    }
    private onReplayBtnClick(rId: number): void {
        const req2 = new protoHH.casino.packet_replay_req();
        req2.replay_id = rId;
        const buf = protoHH.casino.packet_replay_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_REPLAY_REQ);
    }

    private initPersonalRoom(): void {
        const personalRoomView = this.view.getChild("srfCom").asCom;

        this.createRoomBtn = personalRoomView.getChild("createRoomBtn").asButton;
        this.createRoomBtn.onClick(this.onCreateRoomBtnClick, this);

        const accessBtn = personalRoomView.getChild("accessBtn").asButton;
        accessBtn.onClick(this.onEnterBtnClick, this);

        for (let i = 0; i < 3; i++) {
            this.gameTypeRadioBtns[i] = personalRoomView.getChild(`type${i}`).asButton;
            this.gameTypeRadioBtns[i].onClick(this.onGameTypeRadioBtnClick, this);
            this.gameTypeRadioBtns[i].data = i;
            this.gameTypeRadioBtns[i].getChild("text").text = myGames[i].name;

            this.anteRadioBtns[i] = personalRoomView.getChild(`baseScore${i}`).asButton;
            this.anteRadioBtns[i].data = i;

            this.roundRadioBtns[i] = personalRoomView.getChild(`round${i}`).asButton;
            this.roundRadioBtns[i].onClick(this.onRoundRadioBtnClick, this);
            this.roundRadioBtns[i].data = i;

            this.joinRadioBtns[i] = personalRoomView.getChild(`permission${i}`).asButton;
            this.joinRadioBtns[i].data = i;
            this.joinRadioBtns[i].getChild("text").text = joinTypes[i];

            this.playerRequireRadioBtns[i] = personalRoomView.getChild(`playerNumber${i}`).asButton;
            this.playerRequireRadioBtns[i].onClick(this.onPlayerRequireBtnClick, this);
            this.playerRequireRadioBtns[i].data = i;

            this.playerRequireRadioBtns[i].getChild("text").text = `${playerRequires[i]}`;
        }

        this.checkChannel();

        const gameTypeRadioBtnSelectIndex = this.defaultConfig.gameTypeRadioBtnIndex;
        this.gameTypeRadioBtns[gameTypeRadioBtnSelectIndex].selected = true;

        const myGame = myGames[gameTypeRadioBtnSelectIndex];
        // 根据游戏类型，显示底注和局数
        const roomBase = this.getRoomBaseByCasinoID(myGame.casinoID);
        if (roomBase == null) {
            Logger.debug("initPersonalRoom error, no roombase found for ", myGame.casinoID);

            return;
        }

        const roundcost = this.getRoundCostByCasinoID(myGame.casinoID);
        if (roundcost == null) {
            Logger.debug("initPersonalRoom error, no roundCost found for ", myGame.casinoID);

            return;
        }

        for (let i = 0; i < 3; i++) {
            this.anteRadioBtns[i].getChild("text").text = `${roomBase.roombases[i]}`;
            this.roundRadioBtns[i].getChild("text").text = `${roundcost.rcosts[i].round}`;
        }

        const anteRadioBtnIndex = this.defaultConfig.anteRadioBtnIndex;
        const roundRadioBtnIndex = this.defaultConfig.roundRadioBtnIndex;
        const joinRadioBtnIndex = this.defaultConfig.joinRadioBtnIndex;
        const playerRequireRadioBtnIndex = this.defaultConfig.playerRequireRadioBtnIndex;

        this.anteRadioBtns[anteRadioBtnIndex].selected = true;
        this.roundRadioBtns[roundRadioBtnIndex].selected = true;
        this.joinRadioBtns[joinRadioBtnIndex].selected = true;
        this.playerRequireRadioBtns[playerRequireRadioBtnIndex].selected = true;

        // 注意：这里特殊处理仙桃晃晃, 仙桃晃晃可以是2人、4人
        // if (myGame.casinoID === 2) {
        //     if (playerRequireRadioBtnIndex === 0 || playerRequireRadioBtnIndex === 2) {
        //         this.playerRequireRadioBtns[playerRequireRadioBtnIndex].selected = true;
        //     } else {
        //         this.playerRequireRadioBtns[1].selected = true;
        //     }
        // }

        // 计算房卡消耗
        const needCard = roundcost.rcosts[roundRadioBtnIndex].card;
        const myCard = DataStore.getString("card");
        const myCardInt: number = parseInt(myCard, 10);

        this.fkText = personalRoomView.getChild("fkText").asTextField;
        this.fkText.text = `${needCard}/${myCard}`;

        this.noEnoughFkText = personalRoomView.getChild("noEnoughFk").asTextField;
        if (myCardInt >= needCard) {
            this.noEnoughFkText.visible = false;
            this.createRoomBtn.grayed = false;
            this.createRoomBtn._touchDisabled = false;
        } else {
            this.noEnoughFkText.visible = true;
            this.createRoomBtn.grayed = true;
            this.createRoomBtn._touchDisabled = true;
        }
    }

    private checkChannel(): void {
        const channel = DataStore.getString(KeyConstants.CHANNEL);

        if (channel !== Enum.CHANNEL_TYPE.WECHAT) {
            this.joinRadioBtns[1].grayed = true;
            this.joinRadioBtns[1]._touchDisabled = true;
        }
    }

    private getRoomBaseByCasinoID(casinoID: number): protoHH.casino.Igame_room_base {
        for (const roomBase of this.gameConfig.groombases) {
            if (roomBase.casino_id === casinoID) {
                return roomBase;
            }
        }

        return null;
    }

    private getRoundCostByCasinoID(casinoID: number): protoHH.casino.Igame_round_cost {
        for (const roundCost of this.gameConfig.roundcosts) {
            if (roundCost.casino_id === casinoID) {
                return roundCost;
            }
        }

        return null;
    }

    private getGameTypeRadioBtnSelectIndex(): number {
        for (let i = 0; i < 3; i++) {
            if (this.gameTypeRadioBtns[i].selected) {
                return i;
            }
        }

        return 0;
    }

    private getAnteRadioBtnSelectIndex(): number {
        for (let i = 0; i < 3; i++) {
            if (this.anteRadioBtns[i].selected) {
                return i;
            }
        }

        return 0;
    }

    private getRoundRadioBtnSelectIndex(): number {
        for (let i = 0; i < 3; i++) {
            if (this.roundRadioBtns[i].selected) {
                return i;
            }
        }

        return 0;
    }

    private getJoinRadioBtnSelectIndex(): number {
        for (let i = 0; i < 3; i++) {
            if (this.joinRadioBtns[i].selected) {
                return i;
            }
        }

        return 0;
    }

    private getPlayerRequireRadioBtnSelectIndex(): number {
        for (let i = 0; i < 3; i++) {
            if (this.playerRequireRadioBtns[i].selected) {
                return i;
            }
        }

        return 0;
    }

    private onBoxRecordBtnClick(): void {
        this.initBoxRecord();
    }

    private onFKRecordBtn(): void {
        this.initFKRecord();
    }
    private onGameRecordBtn(): void {
        this.initGameRecord();
    }

    private onPersonalRoomBtn(): void {
        this.initPersonalRoom();
    }

    private onEnterBtnClick(): void {
        Logger.debug("onEnterBtnClick");

        const joiRoomView = this.addComponent(JoinRoom);
        joiRoomView.show(this);

    }

    private onGameTypeSelect(index: number): void {
        const myGame = myGames[index];
        // 根据游戏类型，显示底注和局数
        const roomBase = this.getRoomBaseByCasinoID(myGame.casinoID);
        if (roomBase == null) {
            Logger.debug("initPersonalRoom error, no roombase found for ", myGame.casinoID);

            return;
        }

        const roundcost = this.getRoundCostByCasinoID(myGame.casinoID);
        if (roundcost == null) {
            Logger.debug("initPersonalRoom error, no roundCost found for ", myGame.casinoID);

            return;
        }

        for (let i = 0; i < 3; i++) {
            this.anteRadioBtns[i].getChild("text").text = `${roomBase.roombases[i]}`;
            this.roundRadioBtns[i].getChild("text").text = `${roundcost.rcosts[i].round}`;
        }

        // 注意：这里特殊处理仙桃晃晃, 仙桃晃晃可以是2人、4人
        if (myGame.roomID === 2100) {
            if (this.getPlayerRequireRadioBtnSelectIndex() === 1) {
                this.playerRequireRadioBtns[2].selected = true;
            }

            Logger.debug("myGame.roomID === 2100, this.getPlayerRequireRadioBtnSelectIndex():", this.getPlayerRequireRadioBtnSelectIndex());
        }

        // 三人两门是3人
        if (myGame.roomID === 2103) {
            this.playerRequireRadioBtns[1].selected = true;
        }

        // 两人两门是2人
        if (myGame.roomID === 2112) {
            this.playerRequireRadioBtns[0].selected = true;
        }

        Logger.debug("myGame.roomID:", myGame.roomID);
    }

    private onGameTypeRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onGameTypeRadioBtnClick:", <string>ev.initiator.data);
        const gameTypeRadioBtnSelectIndex = <number>ev.initiator.data;
        this.onGameTypeSelect(gameTypeRadioBtnSelectIndex);

    }

    private onRoundRadioBtnClick(ev: fgui.Event): void {
        const gameTypeRadioBtnSelectIndex = <number>ev.initiator.data;
        const myGame = myGames[gameTypeRadioBtnSelectIndex];

        const roundcost = this.getRoundCostByCasinoID(myGame.casinoID);
        if (roundcost == null) {
            Logger.debug("initPersonalRoom error, no roundCost found for ", myGame.casinoID);

            return;
        }

        const roundRadioBtnIndex = this.getRoundRadioBtnSelectIndex();
        const needCard = roundcost.rcosts[roundRadioBtnIndex].card;
        const myCard = DataStore.getString("card");
        const myCardInt: number = parseInt(myCard, 10);

        this.fkText.text = `${needCard}/${myCard}`;

        if (myCardInt >= needCard) {
            this.noEnoughFkText.visible = false;
            this.createRoomBtn.grayed = false;
            this.createRoomBtn._touchDisabled = false;
        } else {
            this.noEnoughFkText.visible = true;
            this.createRoomBtn.grayed = true;
            this.createRoomBtn._touchDisabled = true;
        }
    }

    private onPlayerRequireBtnClick(ev: fgui.Event): void {
        const playerRequireRadioBtnSelectIndex = <number>ev.initiator.data;
        const gameTypeRadiBtnIndex = this.getGameTypeRadioBtnSelectIndex();
        if (playerRequireRadioBtnSelectIndex === 0) {
            if (gameTypeRadiBtnIndex === 1) {
                const index: number = 0;
                this.gameTypeRadioBtns[index].selected = true;
                this.onGameTypeSelect(index);
            }
        }

        if (playerRequireRadioBtnSelectIndex === 1) {
            if (gameTypeRadiBtnIndex !== 1) {
                const index: number = 1;
                this.gameTypeRadioBtns[index].selected = true;
                this.onGameTypeSelect(index);
            }
        }

        if (playerRequireRadioBtnSelectIndex === 2) {
            if (gameTypeRadiBtnIndex !== 0) {
                const index: number = 0;
                this.gameTypeRadioBtns[index].selected = true;
                this.onGameTypeSelect(index);
            }
        }
    }

    private onCreateRoomBtnClick(): void {
        const playerID = DataStore.getString("playerID");
        const myUser = { userID: playerID };

        const gameTypeRadioBtnIndex = this.getGameTypeRadioBtnSelectIndex();
        const anteRadioBtnIndex = this.getAnteRadioBtnSelectIndex();
        const roundRadioBtnIndex = this.getRoundRadioBtnSelectIndex();
        const joinRadioBtnIndex = this.getJoinRadioBtnSelectIndex();
        const playerRequireRadioBtnIndex = this.getPlayerRequireRadioBtnSelectIndex();
        const myGame = myGames[gameTypeRadioBtnIndex];

        let roomID = myGame.roomID;
        if (gameTypeRadioBtnIndex === 0 && playerRequireRadioBtnIndex === 0) {
            roomID = 2102;
        }

        const createRoomParams = {
            casinoID: myGame.casinoID,
            roomID: roomID,
            base: anteRadioBtnIndex,
            round: roundRadioBtnIndex,
            allowJoin: joinRadioBtnIndex
        };

        Logger.debug("createRoomParams:", createRoomParams);

        const params: GameModuleLaunchArgs = {
            jsonString: "",
            userInfo: myUser,
            joinRoomParams: null,
            createRoomParams: createRoomParams,
            record: null,
            roomId: roomID
        };

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");

        this.win.hide();
        this.destroy();

        lm.switchToGame(params, "gameb");
    }

    private saveConfig(): void {
        const defaultConfig = {
            gameTypeRadioBtnIndex: this.getGameTypeRadioBtnSelectIndex(),
            anteRadioBtnIndex: this.getAnteRadioBtnSelectIndex(),
            roundRadioBtnIndex: this.getRoundRadioBtnSelectIndex(),
            joinRadioBtnIndex: this.getJoinRadioBtnSelectIndex(),
            playerRequireRadioBtnIndex: this.getPlayerRequireRadioBtnSelectIndex()
        };

        const configJson = JSON.stringify(defaultConfig);
        Logger.debug("configJson:", configJson);
        DataStore.setItem("createRoomParams", configJson);
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private onJoinTableAck(msg: protoHH.casino.ProxyMessage): void {
        const joinRoomAck = protoHH.casino.packet_table_join_ack.decode(msg.Data);
        if (joinRoomAck.ret !== 0) {
            Logger.debug("onJoinTableAck, join room faile:", joinRoomAck.ret);

            const err = GameError.getErrorString(joinRoomAck.ret);
            Dialog.prompt(err);

            return;
        }

        const playerID = DataStore.getString("playerID");
        const myUser = { userID: playerID };

        const joinRoomParams = {
            table: joinRoomAck.tdata,
            reconnect: joinRoomAck.reconnect
        };

        const params: GameModuleLaunchArgs = {
            jsonString: "",
            userInfo: myUser,
            joinRoomParams: joinRoomParams,
            createRoomParams: null,
            record: null,
            roomId: joinRoomAck.tdata.room_id
        };

        Logger.debug("GameModuleLaunchArgs:", params);

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");

        this.win.hide();
        this.destroy();

        lm.switchToGame(params, "gameb");
    }

}
