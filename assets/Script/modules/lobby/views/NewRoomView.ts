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

const gameNames: string[] = ["仙桃晃晃", "三人两门", "两人两门"];

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

    private eventTarget: cc.EventTarget;

    private ruleViews: { [key: string]: RuleView } = {};

    private path: NewRoomViewPath = NewRoomViewPath.Normal;

    private gameTypeRadioBtns: fgui.GButton[] = [];
    private anteRadioBtns: fgui.GButton[] = [];
    private roundRadioBtns: fgui.GButton[] = [];
    private joinRadioBtns: fgui.GButton[] = [];
    private playerRequireRadioBtns: fgui.GButton[] = [];

    // private quicklyCreateView: QuicklyCreateViewInterface;

    // private boxRecordBtn: fgui.GButton;
    // private fkRecordBtn: fgui.GButton;
    // private gameRecordBtn: fgui.GButton;
    // private personalRoomBtn: fgui.GButton;

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
        this.eventTarget = new cc.EventTarget();
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
    }

    protected onDestroy(): void {
        Object.keys(this.ruleViews).forEach((k) => {
            const rv = this.ruleViews[k];
            rv.destroy();
        });

        this.eventTarget.emit("destroy");
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
        for (let i = 0; i < 3; i++) {
            this.gameTypeRadioBtns[i] = personalRoomView.getChild(`type${i}`).asButton;
            this.gameTypeRadioBtns[i].onClick(this.onGameTypeRadioBtnClick, this);
            this.gameTypeRadioBtns[i].data = i;
            this.gameTypeRadioBtns[i].getChild("text").text = gameNames[i];

            this.anteRadioBtns[i] = personalRoomView.getChild(`baseScore${i}`).asButton;
            this.anteRadioBtns[i].onClick(this.onAnteRadioBtnClick, this);
            this.anteRadioBtns[i].data = i;

            this.roundRadioBtns[i] = personalRoomView.getChild(`round${i}`).asButton;
            this.roundRadioBtns[i].onClick(this.onRoundRadioBtnClick, this);
            this.roundRadioBtns[i].data = i;

            this.joinRadioBtns[i] = personalRoomView.getChild(`permission${i}`).asButton;
            this.joinRadioBtns[i].onClick(this.onJoinRadioBtnClick, this);
            this.joinRadioBtns[i].data = i;
            this.joinRadioBtns[i].getChild("text").text = joinTypes[i];

            this.playerRequireRadioBtns[i] = personalRoomView.getChild(`playerNumber${i}`).asButton;
            this.playerRequireRadioBtns[i].getChild("text").text = `${playerRequires[i]}`;
        }

        // const gameConfigString = DataStore.getString("gameConfig");
        // const gameConfig = <protoHH.casino.game_config>JSON.parse(gameConfigString);

        const createRoomBtn = personalRoomView.getChild("createRoomBtn").asButton;
        createRoomBtn.onClick(this.onCreateRoomBtnClick, this);

        const accessBtn = personalRoomView.getChild("accessBtn").asButton;
        accessBtn.onClick(this.onEnterBtnClick, this);
        // const gameType = personalRoomView.getChild()
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
    }

    private onAnteRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onAnteRadioBtnClick:",  <string>ev.initiator.data);
    }

    private onRoundRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onRoundRadioBtnClick:",  <string>ev.initiator.data);
    }

    private onJoinRadioBtnClick(ev: fgui.Event): void {
        Logger.debug("onJoinRadioBtnClick:",  <string>ev.initiator.data);
    }

    // private onListItemClicked(item: fgui.GObject, evt: fgui.Event): void {
    //     const name = item.packageItem.name;
    //     this.selectItem(name);
    // }

    // private onSaveConfigBtnClick(): void {
    //     //
    //     const list = this.view.getChild("gamelist").asList;
    //     const index = list.selectedIndex;
    //     const item = list.getChildAt(index);
    //     const name = item.packageItem.name;
    //     const ruleView = this.ruleViews[name];
    //     if (ruleView !== undefined) {
    //         const rules: string = <string>ruleView.getRules();
    //         this.goSave(rules);
    //     }
    // }

    private onCreateRoomBtnClick(): void {
        const playerID = DataStore.getString("playerID");
        const myUser = { userID: playerID };

        const createRoomParams = {
            casinoID: 16,
            roomID: 2103,
            base: 1,
            round: 2,
            allowJoin: 0
        };

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

    // private goSave(ruleJson: string): void {
    //     //
    //     this.quicklyCreateView.saveConfig(ruleJson);
    //     this.destroy();
    // }

    // private selectItem(name: string): void {
    //     let ruleView = this.ruleViews[name];
    //     Object.keys(this.ruleViews).forEach((k) => {
    //         const rv = this.ruleViews[k];
    //         rv.hide();
    //     });

    //     if (this.path === NewRoomViewPath.Form_Club_Setting) {
    //         this.forReview = true;

    //         if (this.club.createRoomOptions !== null) {
    //             const roomConfigJSON = <{ [key: string]: boolean | number }>JSON.parse(this.club.createRoomOptions);
    //             this.itemsJSON = roomConfigJSON;
    //         }

    //     }

    //     if (ruleView === undefined) {
    //         switch (name) {
    //             case "btnZJMJ":
    //                 const rv1 = new ZJMJRuleView();
    //                 rv1.bindView(this);
    //                 ruleView = rv1;
    //                 break;
    //             case "btnDFMJ":
    //                 const rv2 = new DFRuleView();
    //                 rv2.bindView(this);
    //                 ruleView = rv2;
    //                 break;
    //             case "btnGZ":
    //                 const rv3 = new RunFastRuleView();
    //                 rv3.bindView(this);
    //                 ruleView = rv3;
    //                 break;
    //             case "btnDDZ":
    //                 break;
    //             default:
    //         }

    //         if (ruleView === undefined) {
    //             return;
    //         }

    //         this.ruleViews[name] = ruleView;
    //         if (this.priceCfgs !== undefined) {
    //             ruleView.updatePriceCfg(this.priceCfgs);
    //         }
    //     }

    //     ruleView.show();
    // }

    private onCloseClick(): void {
        this.destroy();
    }

    // private enterGame(roomInfo: proto.lobby.IRoomInfo): void {

    //     this.win.hide();
    //     this.destroy();
    //     const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
    //     // lm.enterGame(roomInfo);

    // }

    // private reEnterGame(roomInfo: proto.lobby.IRoomInfo): void {
    //     this.enterGame(roomInfo);
    // }

    // private loadRoomPrice(): void {
    //     const tk = DataStore.getString("token", "");
    //     const loadRoomPriceCfgsURL = `${LEnv.rootURL}${LEnv.loadRoomPriceCfgs}?&tk=${tk}`;
    //     HTTP.hGet(
    //         this.eventTarget,
    //         loadRoomPriceCfgsURL,
    //         (xhr: XMLHttpRequest, err: string) => {
    //             let errMsg = null;
    //             if (err !== null) {
    //                 errMsg = `拉取价格配置错误，错误码:${err}`;
    //             } else {
    //                 errMsg = HTTP.hError(xhr);
    //                 if (errMsg === null) {
    //                     const dataString = <string>String.fromCharCode.apply(null, new Uint8Array(<ArrayBuffer>xhr.response));
    //                     const priceCfgs = <{ [key: string]: object }>JSON.parse(dataString);
    //                     this.priceCfgs = priceCfgs;

    //                     Object.keys(this.ruleViews).forEach((k) => {
    //                         const rv = this.ruleViews[k];
    //                         rv.updatePriceCfg(priceCfgs);
    //                     });
    //                 }
    //             }

    //             if (errMsg !== null) {
    //                 Logger.debug("NewRoomView.createRoom failed:", errMsg);
    //                 // 显示错误对话框
    //                 Dialog.showDialog(errMsg, () => {
    //                     //
    //                 });
    //             }
    //         });
    // }
}
