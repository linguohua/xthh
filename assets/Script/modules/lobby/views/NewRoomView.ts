import { GameError } from "../errorCode/ErrorCodeExports";
import {
    CommonFunction, DataStore,
    Dialog, Enum, GameModuleLaunchArgs, KeyConstants, LobbyModuleInterface, Logger
} from "../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { proto as protoHH } from "../protoHH/protoHH";
import { LocalStrings } from "../strings/LocalStringsExports";
import { BoxRecordView } from "./BoxRecordView";
import { FkRecordView } from "./FkRecordView";
import { GameRecordView } from "./GameRecordView";
import { InputNumberOpenType, InputNumberView } from "./InputNumberView";

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

const myGames: MyGame[] = [
    { casinoID: 2, roomID: 2100, name: LocalStrings.findString("xthh") },
    { casinoID: 16, roomID: 2103, name: LocalStrings.findString("srlm") },
    { casinoID: 16, roomID: 2112, name: LocalStrings.findString("lrlm") }];

// const joinTypes: string[] = ["所有", "微信", "工会"];
const joinTypes: string[] = [LocalStrings.findString("all"), LocalStrings.findString("weChat"), LocalStrings.findString("community")];

const playerRequires: number[] = [2, 3, 4];
/**
 * NewRoomView 创建房间界面
 */
@ccclass
export class NewRoomView extends cc.Component {

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

    private gameRecordView: GameRecordView;
    private fkRecordView: FkRecordView;

    private lm: LobbyModuleInterface;

    public showView(): void {
        this.registerHandler();
        this.initView();
        this.win.show();
    }

    public setViewVisible(visible: boolean): void {
        if (visible) {
            this.win.show();
        } else {
            this.win.hide();
        }

    }

    public onInputRecordIdBtnClick(): void {
        Logger.debug("onInputRecordIdBtnClick");
        const inputNumberView = this.addComponent(InputNumberView);

        const cb = (str: string) => {
            const req2 = new protoHH.casino.packet_replay_req();
            req2.replay_id = +str;
            const buf = protoHH.casino.packet_replay_req.encode(req2);
            const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
            lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_REPLAY_REQ);
        };
        inputNumberView.show(cb, InputNumberOpenType.INPUT_RECORD, 8);

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

        const gameConfigStr = DataStore.getString(KeyConstants.GAME_CONFIG);
        this.gameConfig = <protoHH.casino.game_config>JSON.parse(gameConfigStr);

        const defaultConfig = DataStore.getString(KeyConstants.CREATE_ROOM_PARAMS, "");
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
        boxRecordText.text = LocalStrings.findString("boxRecord");

        const fkRecordBtn = this.view.getChild("fkRecordBtn").asButton;
        fkRecordBtn.onClick(this.onFKRecordBtn, this);

        const fkRecordText = fkRecordBtn.getChild("n2");
        fkRecordText.text = LocalStrings.findString("fkRecord");

        const gameRecordBtn = this.view.getChild("gameRecordBtn").asButton;
        gameRecordBtn.onClick(this.onGameRecordBtn, this);

        const gameRecordText = gameRecordBtn.getChild("n2");
        gameRecordText.text = LocalStrings.findString("gameRecord");

        const personalRoomBtn = this.view.getChild("personalRoomBtn").asButton;
        personalRoomBtn.onClick(this.onPersonalRoomBtn, this);
        personalRoomBtn.selected = true;

        const personalRoomText = personalRoomBtn.getChild("n2");
        personalRoomText.text = LocalStrings.findString("personalRoom");

        this.initTapView();

    }

    private initTapView(): void {
        const gameRecordCom = this.view.getChild("recordCom").asCom;
        const gameRecordView = new GameRecordView();
        this.gameRecordView = gameRecordView;
        gameRecordView.init(gameRecordCom, this.lm, this);

        const fkRecordCom = this.view.getChild("fkRecord").asCom;
        const fkRecordView = new FkRecordView();
        this.fkRecordView = fkRecordView;
        fkRecordView.init(fkRecordCom, this.lm);

        const boxRecordCom = this.view.getChild("boxRecord").asCom;
        const boxRecordView = new BoxRecordView();
        boxRecordView.init(boxRecordCom, this.lm);

        this.initPersonalRoom();
    }

    private registerHandler(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onJoinTableAck, this);
    }
    private initBoxRecord(): void {
        // TODO:
    }

    private initFKRecord(): void {
        this.fkRecordView.onTapBtnClick();
    }

    private initGameRecord(): void {
        this.gameRecordView.onTapBtnClick();
    }

    private initPersonalRoom(): void {
        const personalRoomView = this.view.getChild("srfCom").asCom;

        this.createRoomBtn = personalRoomView.getChild("createRoomBtn").asButton;
        this.createRoomBtn.onClick(this.onCreateRoomBtnClick, this);

        const accessBtn = personalRoomView.getChild("accessBtn").asButton;
        accessBtn.onClick(this.onEnterBtnClick, this);

        const space = personalRoomView.getChild("space");
        space.onClick(this.onSpaceBtnClick, this);

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
            Logger.debug("initPersonalRoom error, no room base found for ", myGame.casinoID);

            return;
        }

        const roundCost = this.getRoundCostByCasinoID(myGame.casinoID);
        if (roundCost == null) {
            Logger.debug("initPersonalRoom error, no roundCost found for ", myGame.casinoID);

            return;
        }

        for (let i = 0; i < 3; i++) {
            this.anteRadioBtns[i].getChild("text").text = `${roomBase.roombases[i]}`;
            this.roundRadioBtns[i].getChild("text").text = `${roundCost.rcosts[i].round}`;
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
        const needCard = roundCost.rcosts[roundRadioBtnIndex].card;
        const myCard = DataStore.getString(KeyConstants.CARD);
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

    private joinRoom(roomNumber: string): void {
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const req = {
            player_id: +playerID,
            table_id: long.ZERO,
            tag: +roomNumber
        };

        const req2 = new protoHH.casino.packet_table_join_req(req);
        const buf = protoHH.casino.packet_table_join_req.encode(req2);

        if (this.lm !== undefined) {
            this.lm.msgCenter.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
            // block也要对应的unBlock
            this.lm.msgCenter.blockNormal();
        }

    }

    private onEnterBtnClick(): void {
        Logger.debug("onEnterBtnClick");

        const inputNumberView = this.addComponent(InputNumberView);

        const cb = (str: string) => {
            this.joinRoom(str);
        };
        inputNumberView.show(cb, InputNumberOpenType.JOIN_ROOM, 6);

    }
    private onSpaceBtnClick(): void {
        //
        Dialog.prompt(LocalStrings.findString("2playerLimitTips"));
    }

    private onGameTypeSelect(index: number): void {
        const myGame = myGames[index];
        // 根据游戏类型，显示底注和局数
        const roomBase = this.getRoomBaseByCasinoID(myGame.casinoID);
        if (roomBase == null) {
            Logger.debug("initPersonalRoom error, no roombase found for ", myGame.casinoID);

            return;
        }

        const roundCost = this.getRoundCostByCasinoID(myGame.casinoID);
        if (roundCost == null) {
            Logger.debug("initPersonalRoom error, no roundCost found for ", myGame.casinoID);

            return;
        }

        for (let i = 0; i < 3; i++) {
            this.anteRadioBtns[i].getChild("text").text = `${roomBase.roombases[i]}`;
            this.roundRadioBtns[i].getChild("text").text = `${roundCost.rcosts[i].round}`;
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

        if (gameTypeRadioBtnSelectIndex === 2) {
            const personalRoomView = this.view.getChild("srfCom").asCom;
            const otherBtn = personalRoomView.getChild("otherBtn").asButton;
            otherBtn.selected = false;
        }

    }

    private onRoundRadioBtnClick(ev: fgui.Event): void {
        const gameTypeRadioBtnSelectIndex = <number>ev.initiator.data;
        const myGame = myGames[gameTypeRadioBtnSelectIndex];

        const roundCost = this.getRoundCostByCasinoID(myGame.casinoID);
        if (roundCost == null) {
            Logger.debug("initPersonalRoom error, no roundCost found for ", myGame.casinoID);

            return;
        }

        const roundRadioBtnIndex = this.getRoundRadioBtnSelectIndex();
        const needCard = roundCost.rcosts[roundRadioBtnIndex].card;
        const myCard = DataStore.getString(KeyConstants.CARD);
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
        const gameTypeRadioBtnIndex = this.getGameTypeRadioBtnSelectIndex();

        if (playerRequireRadioBtnSelectIndex === 0) {
            if (gameTypeRadioBtnIndex === 1) {
                const index: number = 0;
                this.gameTypeRadioBtns[index].selected = true;
                this.onGameTypeSelect(index);
            }

            const personalRoomView = this.view.getChild("srfCom").asCom;
            const otherBtn = personalRoomView.getChild("otherBtn").asButton;
            otherBtn.selected = false;
        }

        if (playerRequireRadioBtnSelectIndex === 1) {
            if (gameTypeRadioBtnIndex !== 1) {
                const index: number = 1;
                this.gameTypeRadioBtns[index].selected = true;
                this.onGameTypeSelect(index);
            }
        }

        if (playerRequireRadioBtnSelectIndex === 2) {
            if (gameTypeRadioBtnIndex !== 0) {
                const index: number = 0;
                this.gameTypeRadioBtns[index].selected = true;
                this.onGameTypeSelect(index);
            }
        }
    }

    private onCreateRoomBtnClick(): void {
        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const myUser = { userID: playerID };

        const gameTypeRadioBtnIndex = this.getGameTypeRadioBtnSelectIndex();
        const anteRadioBtnIndex = this.getAnteRadioBtnSelectIndex();
        const roundRadioBtnIndex = this.getRoundRadioBtnSelectIndex();
        const joinRadioBtnIndex = this.getJoinRadioBtnSelectIndex();
        const playerRequireRadioBtnIndex = this.getPlayerRequireRadioBtnSelectIndex();

        const personalRoomView = this.view.getChild("srfCom").asCom;
        const otherBtn = personalRoomView.getChild("otherBtn").asButton;

        const flag = otherBtn.selected ? 1 : 0;
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
            allowJoin: joinRadioBtnIndex,
            flag: flag
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
        DataStore.setItem(KeyConstants.CREATE_ROOM_PARAMS, configJson);
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private onJoinTableAck(msg: protoHH.casino.ProxyMessage): void {
        const joinRoomAck = protoHH.casino.packet_table_join_ack.decode(msg.Data);
        if (joinRoomAck.ret !== 0) {
            Logger.debug("onJoinTableAck, join room failed:", joinRoomAck.ret);

            const err = GameError.getErrorString(joinRoomAck.ret);
            Dialog.prompt(err);

            this.lm.msgCenter.unblockNormal();

            return;
        }

        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
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
