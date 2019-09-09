import { GameError } from "../../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";
import { RewardView } from "../reward/RewardViewExports";

const { ccclass } = cc._decorator;
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
    private refresh: number;
    public showView(lm: LobbyModuleInterface, count: number, refresh: number): void {

        this.eventTarget = new cc.EventTarget();
        lm.loader.fguiAddPackage("lobby/fui_lobby_welfare/lobby_welfare");
        const view = fgui.UIPackage.createObject("lobby_welfare", "welfareView").asCom;
        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;
        this.count = count;
        this.refresh = refresh;
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
        //保存已领次数到本地
        if (ack.ret === 0) {
            const helperSizeStr = DataStore.getString(KeyConstants.HELPER_SIZE, "");
            const helperSize = +helperSizeStr;
            const p = helperSize - this.count + 1; //计算已领次数 +上刚领取的 1次
            DataStore.setItem(KeyConstants.HELPER_PARAM, p);
            //保存最后领取的时间截到本地
            const d = new Date().getTime();
            DataStore.setItem(KeyConstants.HELPER_TIME, d);
            //弹出领取成功界面
            const view = this.addComponent(RewardView);
            view.showView(this.lm, ack.gains);

            this.destroy();
        } else {
            //弹出领取失败界面
            const err = GameError.getErrorString(ack.ret);
            Dialog.prompt(err);
        }
    }
    private onCollectClick(): void {
        //MSG_HELPER_REQconst
        const req2 = new protoHH.casino.packet_helper_req();
        req2.player_id = +DataStore.getString(KeyConstants.PLAYER_ID);
        req2.refresh = this.refresh;
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
