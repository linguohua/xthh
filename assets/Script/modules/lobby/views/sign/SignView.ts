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

        // this.sinReq();
        // this.checkingDayReq();
        this.dataReq();
    }

    protected onDestroy(): void {
        this.unRegisterHander();
        this.win.hide();
        this.win.dispose();

    }

    private registerHandler(): void {
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ACT_ACK, this.onSignAck, this);
        this.lm.msgCenter.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_DATA_ACK, this.onDataAck, this);
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

    private onDataAck(msg: proto.casino.ProxyMessage): void {
        const reply = proto.casino.packet_data_ack.decode(msg.Data);
        for (const ack of reply.acks) {
            if (ack.name === "act_checkin_day") {
                const checkinDay = proto.casino.act_checkin_day_data.decode(ack.data);
                Logger.debug("checkinDay:", checkinDay);
            }
            //             0: Message {name: "chat", crc: 37381744, parse: false, data: h}
            // 1: Message {name: "act", crc: 163179104, parse: false, data: h}
            // 2: Message {name: "act_checkin_day", crc: 6644855, parse: false, data: h}
            // 3: Message {name: "act_checkin_counter", crc: 90718638, parse: false, data: h}
            // 4: Message {name: "act_card_free", crc: 72746089, parse: false, data: h}
            // 5: Message {name: "act_red_rain", crc: 16704371, parse: false, data: h}
            // 6: Message {name: "casino", crc: 54572400, parse: false, data: h}
            // 7: Message {name: "task", crc: 145877712, parse: false, data: h}

            if (ack.name === "act") {
                const act = proto.casino.act_data.decode(ack.data);
                Logger.debug("act:", act);
            }

            if (ack.name === "act_checkin_counter") {
                const checkinCounter = proto.casino.act_checkin_counter_data.decode(ack.data);
                Logger.debug("checkinCounter:", checkinCounter);
            }
        }
        Logger.debug("reply:", reply);
    }

    private sinReq(): void {
        const req = new proto.casino.packet_act_req();
        req.type = proto.casino.eACT.ACT_SIGN;

        const buf = proto.casino.packet_act_req.encode(req);

        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_ACT_REQ);
    }

    private checkingDayReq(): void {
        const req = new proto.casino.packet_act_req();
        req.type = proto.casino.eACT.ACT_CHECKIN_DAY;

        const buf = proto.casino.packet_act_req.encode(req);

        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_ACT_REQ);
    }

    private dataReq(): void {
        const req = new proto.casino.packet_data_req();
        // req.type = proto.casino.eACT.ACT_CHECKIN_DAY;

        const buf = proto.casino.packet_data_req.encode(req);

        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_DATA_REQ);
    }
}
