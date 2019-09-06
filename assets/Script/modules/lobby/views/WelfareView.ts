import { CommonFunction, DataStore, KeyConstants, LobbyModuleInterface, Logger, GResLoader } from "../lcore/LCoreExports";
import { proto as protoHH } from "../protoHH/protoHH";

const { ccclass } = cc._decorator;
const beanChannel = "android_h5";
const cardChannel = "weixin";
/**
 * 领取欢乐豆界面
 */
@ccclass
export class WelfareView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;
    private count: number = 0;
    private lm: LobbyModuleInterface;
    public showView(lm: LobbyModuleInterface, count: number): void {

        this.eventTarget = new cc.EventTarget();
        lm.loader.fguiAddPackage("lobby/fui_lobby_welfare/lobby_welfare");
        const view = fgui.UIPackage.createObject("lobby_welfare", "welfareView").asCom;
        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;
        this.count = count;
        this.lm = lm;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        lm.msgCenter.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_HELPER_ACK, this.onMsg, this); // 创建房间

        this.win = win;
        this.initView();
        this.win.show();
    }

    protected onDestroy(): void {
        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        this.destroy();
    }

    private onMsg(pmsg: protoHH.casino.ProxyMessage): void {
        const ack = protoHH.casino.packet_helper_ack.decode(pmsg.Data);
        Logger.debug("领取欢乐豆返回值: ", ack);

        this.destroy();
    }
    private onCollectClick(): void {
        //MSG_HELPER_REQconst
        const req2 = new protoHH.casino.packet_helper_req();
        // req2.player_id = +DataStore.getString(KeyConstants.PLAYER_ID);
        const buf = protoHH.casino.packet_helper_req.encode(req2);
        this.lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_HELPER_REQ);
    }

    private initView(): void {
        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const collectBtn = this.view.getChild("collectBtn");
        collectBtn.onClick(this.onCollectClick, this);

        this.view.getChild("count").text = `${this.count}`;
    }

}
