/**
 * lobby 模块入口
 */
const { ccclass } = cc._decorator;
import { GameModuleA } from "../gamea/GamebExportsA";
import { GameModule } from "../gameb/GamebExports";
import { NimSDK } from "./chanelSdk/nimSdk/NimSDK";
import { GResLoaderImpl } from "./GResLoaderImpl";
import { Dialog } from "./lcore/Dialog";
import { DataStore, KeyConstants } from "./lcore/LCoreExports";
import {
    CreateRoomParams, GameModuleInterface, GameModuleLaunchArgs, JoinRoomParams,
    LobbyModuleInterface, MsgCenter
} from "./lcore/LDataType";
import { Logger } from "./lcore/Logger";
import { proto as protoHH } from "./protoHH/protoHH";
import { LoginView } from "./views/LoginView";

/**
 * hello
 */
@ccclass
export class LobbyModule extends cc.Component implements LobbyModuleInterface {
    public loader: GResLoaderImpl;
    public eventTarget: cc.EventTarget;
    public msgCenter: MsgCenter;
    public nimSDK: NimSDK;
    private gameNode: cc.Node;
    private gameLoader: GResLoaderImpl;
    private view: fgui.GObject;
    private loginView: LoginView;
    private filterProgress: number = 0;

    public cleanupGRoot(): void {
        const children = fgui.GRoot.inst._children;
        const wins: fgui.Window[] = [];
        children.forEach((c) => {
            if (c instanceof fgui.Window) {
                wins.push(c);
            }
        });

        wins.forEach((w) => {
            w.hide();
            w.dispose();
        });

        fgui.GRoot.inst.removeChildren(0, -1, true);
    }

    /**
     *
     * @param isFromPrivateRoom 是否是从私人房返回
     */
    public returnFromGame(isFromJoyRoom: boolean): void {
        this.cleanupGRoot();

        this.gameNode.destroyAllChildren();
        this.gameNode.destroy();

        delete this.gameNode;
        const num = fgui.GRoot.inst.numChildren;
        if (num > 0) {
            throw new Error(`returnFromGame failed, ui count should be 0, now:${num}`);
        }
        fgui.GRoot.inst.addChild(this.view);

        // this.eventTarget.emit(`checkRoomInfo`);
        // 从牌局内返回来，如果战绩页面还存在，则显示出来
        this.eventTarget.emit(`returnFromGame`, isFromJoyRoom);
        this.eventTarget.emit(`onGameSubRecordShow`);
        // this.eventTarget.emit(`onClubViewShow`);
    }

    public requestJoinRoom(table: protoHH.casino.Itable, reconnect: boolean): void {
        Logger.debug("requestJoinRoom");

        const joinRoomParams = {
            table: table,
            reconnect: reconnect
        };

        this.enterGame(joinRoomParams, null);
    }
    public enterGame(joinRoomParams?: JoinRoomParams, creatRoomParams?: CreateRoomParams): void {

        const myUserID = DataStore.getString(KeyConstants.PLAYER_ID, "");
        const myUser = { userID: myUserID };
        const modName = "gameb";

        const params: GameModuleLaunchArgs = {
            jsonString: "",
            userInfo: myUser,
            joinRoomParams: joinRoomParams,
            createRoomParams: creatRoomParams,
            record: null
        };

        this.switchToGame(params, modName);

    }

    public switchToGame(params: GameModuleLaunchArgs, moduleName: string): void {
        // 任何时刻只有一个子游戏
        if (this.gameNode !== undefined) {
            Logger.error("switch to game failed, there is a game running:", this.gameNode.name);

            return;
        }
        // 当存在弹窗时，立刻dispose弹窗
        Dialog.hidePrompt();
        Dialog.showWaiting();

        // 资源加载
        if (this.gameLoader !== undefined && this.gameLoader.name !== moduleName) {
            // 卸载旧的模块
            this.gameLoader.unload();
            delete this.gameLoader;
        }

        if (this.gameLoader === undefined) {
            // 需要新建一个新的资源加载器
            this.gameLoader = new GResLoaderImpl(moduleName);
        }

        params.loader = this.gameLoader;
        params.lm = this;

        // 加载子游戏的所有资源，显示加载进度
        this.gameLoader.loadResDir(
            moduleName,
            (error) => {
                Logger.debug(`gamea load, error:${error}`);

                Dialog.hideWaiting();

                // 隐藏大厅窗口
                this.view = fgui.GRoot.inst.getChildAt(0);
                fgui.GRoot.inst.removeChild(this.view);

                const childrenCount = fgui.GRoot.inst.numChildren;
                if (childrenCount > 0) {
                    Logger.error("switch to game failed, GRoot numChildren not zero:", childrenCount);
                    // 将未销毁的view打印出来
                    for (let i = 0; i < childrenCount; i++) {
                        const view = fgui.GRoot.inst.getChildAt(i);
                        Logger.error(view);
                    }

                    return;
                }

                if (error == null) {
                    switch (moduleName) {
                        case "gameb":
                            // 新建节点，然后挂载游戏组件
                            const gameNode = new cc.Node(moduleName);
                            this.node.addChild(gameNode);
                            this.gameNode = gameNode;
                            if (params.roomId === 2100 || params.roomId === 2102) {
                                const gmc = this.gameNode.addComponent(GameModuleA);
                                const gm = <GameModuleInterface>gmc;
                                // 启动游戏流程
                                gm.launch(params);
                            } else {
                                // 12001 12002 12003 欢乐场
                                Logger.debug("params.roomId : ", params.roomId);
                                const gmc = this.gameNode.addComponent(GameModule);
                                const gm = <GameModuleInterface>gmc;
                                // 启动游戏流程
                                gm.launch(params);
                            }
                            break;
                        default:
                    }
                }
            }
        );
    }

    public setGameMsgHandler(code: number, h: (msg: protoHH.casino.ProxyMessage) => void, target: object): void {
        if (this.msgCenter !== null && this.msgCenter !== undefined) {
            this.msgCenter.setGameMsgHandler(code, h, target);
        } else {
            Logger.error("setGameMsgHandler, this.msgCenter is null");
        }
    }

    public sendGameMsg(buf: ByteBuffer, code: number): void {
        if (this.msgCenter !== null && this.msgCenter !== undefined) {
            this.msgCenter.sendGameMsg(buf, code);
        } else {
            Logger.error("setGameMsgHandler, this.msgCenter is null");
        }
    }

    public isGameModuleExist(): boolean {
        return this.gameNode !== undefined;
    }

    public logout(): void {
        this.msgCenter = null;
        this.loginView = this.addComponent(LoginView);
        this.loginView.setLogout();
    }
    protected start(): void {
        this.loader = new GResLoaderImpl("lobby");
        this.eventTarget = new cc.EventTarget();

        Dialog.initDialogs(this.loader);

        //优先加载login资源，用于显示loading
        this.loader.loadResDir("launch", (error) => {
            Logger.debug(`launch load, error:${error}`);
            if (error == null) {
                this.loginView = this.addComponent(LoginView);
                this.loadLobbyRes();
            }
        });

    }

    // 加载大厅的所有资源，显示加载进度
    private loadLobbyRes(): void {
        this.loader.loadResDir(
            "lobby",
            (error) => {
                Logger.debug(`lobby load, error:${error}`);
                if (error == null) {
                    this.filterProgress = 0;
                    this.onResLoadedCompleted();
                }
            },
            (progress) => {
                if (this.filterProgress > progress) {
                    // 加载大厅资源时，防止进度条往回跑
                    return;
                }
                this.filterProgress = progress;
                this.loginView.updateProgressBar(progress);
            });
    }

    private onResLoadedCompleted(): void {
        // 增加一些房间内用到的大厅package，注意数量不能太多，会影响加载速度
        this.loader.fguiAddPackage("lobby/fui_create_room/lobby_personal_room");

        // 加载共用背景包
        this.loader.fguiAddPackage("lobby/fui_bg/lobby_bg_package");

        this.loginView.updateCompleted();
    }

}
