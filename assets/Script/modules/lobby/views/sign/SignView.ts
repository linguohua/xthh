import { CommonFunction, DataStore, Dialog, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
const { ccclass } = cc._decorator;
import { GameError } from "../../errorCode/ErrorCodeExports";
// tslint:disable-next-line:no-require-imports
import long = require("../../protobufjs/long");
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
    private playerAct: proto.casino.player_act;

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

        this.showTip();
        // this.sinReq();
        // this.checkingDayReq();
        // this.dataReq();
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

        const checkinDayData = this.getCheckinDayData();

        const act = this.getSignAct();
        this.playerAct = act;
        Logger.debug("act:", act);
        let isOldUser: boolean = false;
        if (act !== null && act.total > 7) {
            isOldUser = true;
        }

        let param: number = 0;
        if (act.param !== null) {
            param = act.param;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayInSeconds = Date.parse(today.toString());

        for (let i = 0; i < 7; i++) {
            const item = this.view.getChild(`item${i}`).asCom;
            item.getChild("day").text = LocalStrings.findString("signDay", `${i + 1}`);

            let award = checkinDayData.datas[i].vip_awards[0];
            if (isOldUser) {
                award = checkinDayData.datas[i].awards[0];
            }

            const loader = item.getChild("loader").asLoader;

            let text = "";
            if (award.type === 9) {
                // 房卡
                text = `房卡*${award.param}`;
                loader.url = `ui://lobby_sign/cz_icon_fk1`;
            } else if (award.type === 10) {
                // 欢乐豆
                text = `欢乐豆*${award.param}`;
                loader.url = `ui://lobby_sign/cz_icon_hld1`;
            }

            item.getChild("count").text = text;
            const light = item.getChild("light");
            const mask = item.getChild("sjgnMask");

            if (param > i) {
                mask.visible = true;
                light.visible = false;
            } else {
                mask.visible = false;

                if (param === i && (act.act_time === null || act.act_time.low < Math.floor(todayInSeconds / 1000))) {
                    light.visible = true;
                } else {
                    light.visible = false;
                }
            }

            const onItemClick = () => {
                this.onItemClick(i);
            };
            item.onClick(onItemClick, this);

        }
    }

    private setTodaySign(): void {
        const act = this.playerAct;

        let param: number = 0;
        if (act.param !== null) {
            param = act.param;
        }

        const item = this.view.getChild(`item${param}`).asCom;
        item.getChild("sjgnMask").visible = true;
        item.getChild("light").visible = false;

        if (act.param !== null) {
            act.param = act.param + 1;
        } else {
            act.param = 1;
        }

        if (act.today !== null) {
            act.today = act.today + 1;
        } else {
            act.today = 1;
        }

        if (act.total !== null) {
            act.total = act.total + 1;
        } else {
            act.total = 1;
        }

        if (act.week !== null) {
            act.week = act.week + 1;
        } else {
            act.week = 1;
        }

        if (act.month !== null) {
            act.month = act.month + 1;
        } else {
            act.month = 1;
        }

        act.act_time = new long(this.lm.msgCenter.getServerTime());

        this.updateSignAct(act);
    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onItemClick(i: number): void {
        // const i = <number>ev.initiator.data;
        Logger.debug("onItemClick:", i);
        const act = this.playerAct;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayInSeconds = Date.parse(today.toString());
        if (act.act_time !== null && act.act_time.low >= Math.floor(todayInSeconds / 1000)) {
            return;
        }

        let param: number = 0;
        if (act.param !== null) {
            param = act.param;
        }

        if (param === i) {
            this.sinReq();
        }
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

        this.setTodaySign();

        Dialog.prompt("签到成功");
        Logger.debug("reply:", reply);
    }

    private sinReq(): void {
        const req = new proto.casino.packet_act_req();
        req.type = proto.casino.eACT.ACT_SIGN;

        const buf = proto.casino.packet_act_req.encode(req);

        this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_ACT_REQ);
    }

    private getSignAct(): proto.casino.player_act {
        const actStr = DataStore.getString(KeyConstants.PLAYER_ACTS);
        const acts = <proto.casino.player_act[]>JSON.parse(actStr);

        for (const act of acts) {
            if (act.type === proto.casino.eACT.ACT_SIGN) {
                return act;
            }
        }

        return null;
    }

    private updateSignAct(signAct: proto.casino.player_act): void {
        const actStr = DataStore.getString(KeyConstants.PLAYER_ACTS);
        const acts = <proto.casino.player_act[]>JSON.parse(actStr);

        const length = acts.length;
        for (let i = 0; i < length; i++) {
            if (acts[i].type === proto.casino.eACT.ACT_SIGN) {
                acts[i] = signAct;
                break;
            }
        }

        const jsonString = JSON.stringify(acts);
        DataStore.setItem(KeyConstants.PLAYER_ACTS, jsonString);
    }

    private getCheckinDayData(): proto.casino.act_checkin_day_data {
        const jsonString = DataStore.getString(KeyConstants.ACT_CHECK_IN_DAY);

        return <proto.casino.act_checkin_day_data>JSON.parse(jsonString);
    }

    private showTip(): void {
        const act = this.playerAct;
        if (act.total === 0) {
            return;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayInSeconds = Date.parse(today.toString());
        if (act.act_time.low >= Math.floor(todayInSeconds / 1000)) {
            Dialog.prompt(LocalStrings.findString("haveBeenSign"));
        } else {
            Logger.debug(`act_time:${act.act_time.low}, today:${Math.floor(todayInSeconds / 1000)}`);
        }
    }
}
