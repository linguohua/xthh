import { CommonFunction, DataStore, GameModuleLaunchArgs, LobbyModuleInterface, Logger, NewRoomViewPath } from "../lcore/LCoreExports";
import { proto } from "../proto/protoLobby";
import { proto as protoHH } from "../protoHH/protoHH";

const { ccclass } = cc._decorator;

interface RuleView {
    destroy: Function;
    updatePriceCfg: Function;
    show: Function;
    hide: Function;

    getRules: Function;
}

interface QuicklyCreateViewInterface {
    saveConfig: Function;
}

interface DefaultConfig {
    gameTypeRadioBtnIndex: number;
    anteRadioBtnIndex: number;
    roundRadioBtnIndex: number;
    joinRadioBtnIndex: number;
}

interface MyGame {
    casinoID: number;
    roomID: number;

    name: string;

}

const myGames: MyGame[] = [{casinoID: 16, roomID: 2100, name: "仙桃晃晃"},
{casinoID: 16, roomID: 2103, name: "三人两门"}, {casinoID: 16, roomID: 2102, name: "两人两门"}];

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

    private ruleViews: { [key: string]: RuleView } = {};

    private path: NewRoomViewPath = NewRoomViewPath.Normal;

    private gameTypeRadioBtns: fgui.GButton[] = [];
    private anteRadioBtns: fgui.GButton[] = [];
    private roundRadioBtns: fgui.GButton[] = [];
    private joinRadioBtns: fgui.GButton[] = [];
    private playerRequireRadioBtns: fgui.GButton[] = [];

    private gameConfig: protoHH.casino.game_config;

    private defaultConfig: DefaultConfig;

    public getView(): fgui.GComponent {
        return this.view;
    }

    public showView(path: NewRoomViewPath, club?: proto.club.IMsgClubInfo, quicklyCreateView?: QuicklyCreateViewInterface): void {
        this.path = path;
        // this.club = club;
        // this.quicklyCreateView = quicklyCreateView;
        this.initView();
        this.win.show();
    }

    public updatePrice(price: number): void {
        //
        Logger.debug("updatePrice = ", price);
        const consumeText = this.view.getChild("consumeText");
        consumeText.text = `${price}`;

    }

    protected onLoad(): void {
        // 加载大厅界面
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = lm.loader;
        loader.fguiAddPackage("lobby/fui_create_room/lobby_personal_room");
        const view = fgui.UIPackage.createObject("lobby_personal_room", "personalRoomView").asCom;
        CommonFunction.setViewInCenter(view);

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
            this.defaultConfig = {gameTypeRadioBtnIndex: 0, anteRadioBtnIndex: 0, roundRadioBtnIndex: 0, joinRadioBtnIndex: 0};
        }

        Logger.debug("onLoad defaultConfig:", defaultConfig);
    }

    protected onDestroy(): void {
        Logger.debug("onDestroy");
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
    }

    private initBoxRecord(): void {
        // TODO:
    }

    private initFKRecord(): void {
        // TODO:
    }

    private initGameRecord(): void {
        // TODO:
    }
    private initPersonalRoom(): void {
        const personalRoomView = this.view.getChild("srfCom").asCom;
        const createRoomBtn = personalRoomView.getChild("createRoomBtn").asButton;
        createRoomBtn.onClick(this.onCreateRoomBtnClick, this);

        const accessBtn = personalRoomView.getChild("accessBtn").asButton;
        accessBtn.onClick(this.onEnterBtnClick, this);

        for (let i = 0; i < 3; i++) {
            this.gameTypeRadioBtns[i] = personalRoomView.getChild(`type${i}`).asButton;
            this.gameTypeRadioBtns[i].onClick(this.onGameTypeRadioBtnClick, this);
            this.gameTypeRadioBtns[i].data = i;
            this.gameTypeRadioBtns[i].getChild("text").text = myGames[i].name;

            this.anteRadioBtns[i] = personalRoomView.getChild(`baseScore${i}`).asButton;
            this.anteRadioBtns[i].onClick(this.onAnteRadioBtnClick, this);
            this.anteRadioBtns[i].data = i;

            this.roundRadioBtns[i] = personalRoomView.getChild(`round${i}`).asButton;
            this.roundRadioBtns[i].onClick(this.onRoundRadioBtnClick, this);
            this.roundRadioBtns[i].data = i;

            this.joinRadioBtns[i] = personalRoomView.getChild(`permission${i}`).asButton;
            this.joinRadioBtns[i].data = i;
            this.joinRadioBtns[i].getChild("text").text = joinTypes[i];

            this.playerRequireRadioBtns[i] = personalRoomView.getChild(`playerNumber${i}`).asButton;
            this.playerRequireRadioBtns[i].getChild("text").text = `${playerRequires[i]}`;
        }

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

        this.anteRadioBtns[anteRadioBtnIndex].selected = true;
        this.roundRadioBtns[roundRadioBtnIndex].selected = true;
        this.joinRadioBtns[joinRadioBtnIndex].selected = true;
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

    }

    private onGameTypeRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onGameTypeRadioBtnClick:",  <string>ev.initiator.data);
        const gameTypeRadioBtnSelectIndex = this.getGameTypeRadioBtnSelectIndex();
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
    }

    private onAnteRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onAnteRadioBtnClick:",  <string>ev.initiator.data);
        // TODO: 计算消耗的房卡
    }

    private onRoundRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onRoundRadioBtnClick:",  <string>ev.initiator.data);
        // TODO: 计算消耗的房卡
    }

    private onCreateRoomBtnClick(): void {
        const playerID = DataStore.getString("playerID");
        const myUser = { userID: playerID };

        const gameTypeRadioBtnIndex = this.getGameTypeRadioBtnSelectIndex();
        const anteRadioBtnIndex = this.getAnteRadioBtnSelectIndex();
        const roundRadioBtnIndex = this.getRoundRadioBtnSelectIndex();
        const joinRadioBtnIndex = this.getJoinRadioBtnSelectIndex();

        const myGame = myGames[gameTypeRadioBtnIndex];

        const createRoomParams = {
            casinoID: myGame.casinoID,
            roomID: myGame.roomID,
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
            record: null
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
            joinRadioBtnIndex: this.getJoinRadioBtnSelectIndex()
        };

        const configJson = JSON.stringify(defaultConfig);
        Logger.debug("configJson:", configJson);
        DataStore.setItem("createRoomParams", configJson);
    }

    private onCloseClick(): void {
        this.destroy();
    }

}
