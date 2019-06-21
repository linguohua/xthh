/**
 * stupid
 */
const { ccclass } = cc._decorator;

import { LobbyModule } from "./modules/lobby/LobbyModule";

/**
 * hello
 */
@ccclass
export class Boot extends cc.Component {

    protected start(): void {
        // 设置帧率
        cc.game.setFrameRate(29);
        cc.debug.setDisplayStats(true);
        (<any>cc.debug)._resetDebugSetting(cc.debug.DebugMode.INFO); // tslint:disable-line:no-any no-unsafe-any

        // 初始化fgui
        fgui.addLoadHandler();
        fgui.GRoot.create();

        // 加载lobby main
        this.addComponent(LobbyModule);
    }
}
