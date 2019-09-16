import { CommonFunction, Dialog, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
const { ccclass } = cc._decorator;
import { GameError } from "../../errorCode/ErrorCodeExports";
import { proto } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";

/**
 * SignView
 */
@ccclass
export class SignView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        this.registerHandler();
        loader.fguiAddPackage("lobby/fui_lobby_sign/lobby_sign");
        const view = fgui.UIPackage.createObject("lobby_sign", "signView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initView();
        this.win.show();

        this.sinReq();
    }

    protected onDestroy(): void {
        this.unRegisterHander();
        this.win.hide();
        this.win.dispose();

    }

    private registerHandler(): void {
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ACT_ACK, this.onSignAck, this);
    }
    private unRegisterHander(): void {
        this.lm.msgCenter.removeGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ACT_ACK);
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        for (let i = 0; i < 7; i++) {
            const item = this.view.getChild(`item${i}`).asCom;
            item.getChild("day").text = LocalStrings.findString("signDay", `${i + 1}`);
        }

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onSignAck(msg: proto.casino.ProxyMessage): void {
        const reply = proto.casino.packet_act_ack.decode(msg.Data);
        if (reply.ret !== 0) {
            Logger.error("reply.ret:", reply.ret);
            if (reply.ret === 1) {
                Dialog.prompt(LocalStrings.findString("haveBeenSign"));
            } else {
                Dialog.prompt(GameError.getErrorString(reply.ret));
            }

            return;
        }

        Logger.debug("reply:", reply);
    }

    private sinReq(): void {
        const req = new proto.casino.packet_act_req();
        req.type = proto.casino.eACT.ACT_SIGN;

        const buf = proto.casino.packet_act_req.encode(req);

        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_ACT_REQ);
    }

}
