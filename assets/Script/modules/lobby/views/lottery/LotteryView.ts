import { GameError } from "../../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
import { LotteryRuleView } from "./LotteryRuleView";
const { ccclass } = cc._decorator;

const JUNIOR_ROOM_ID: number = 12001;
const MIDDLE_ROOM_ID: number = 12002;
const SENIOR_ROOM_ID: number = 12003;

const REWARD_IMG: { [key: number]: string } = {
    [proto.casino.eRESOURCE.RESOURCE_RED]: "ui://lobby_lottery/nlzp_icon_hb",
    [proto.casino.eRESOURCE.RESOURCE_BEANS]: "ui://lobby_lottery/nlzp_icon_hld",
    [proto.casino.eRESOURCE.RESOURCE_NONE]: "ui://lobby_lottery/nlzp_icon_hld"
};

/**
 * 抽奖页面
 */
@ccclass
export class LotteryView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    private energyTurnableData: proto.casino.energy_turnable[];

    private drawLotteryBtn: fgui.GButton;
    private revolvePage: fgui.GComponent;
    private powerProgress: fgui.GProgressBar;

    private powerProgressText: fgui.GTextField;
    private tabId: number;

    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_lottery/lobby_lottery");
        const view = fgui.UIPackage.createObject("lobby_lottery", "lotteryView").asCom;

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
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initHandler(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        lm.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ENERGY_TURNABLE, this.entryTurnable, this);
        lm.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ET_DRAW_RES, this.drawResult, this);
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const ruleBtn = this.view.getChild("ruleBtn");
        ruleBtn.onClick(this.onRuleBtnClick, this);

        const juniorBtn = this.view.getChild("juniorBtn");
        juniorBtn.onClick(this.onJuniorBtnClick, this);

        const middleBtn = this.view.getChild("middleBtn");
        middleBtn.onClick(this.onMiddleBtnClick, this);

        const seniorBtn = this.view.getChild("seniorBtn");
        seniorBtn.onClick(this.onSeniorBtnClick, this);

        const drawLotteryBtn = this.view.getChild("drawLotteryBtn").asButton;
        drawLotteryBtn.onClick(this.onDrawLotteryBtnClick, this);
        drawLotteryBtn.getController("enable").selectedIndex = 1;

        this.drawLotteryBtn = drawLotteryBtn;

        const revolvePage = this.view.getChild("revolvePage").asCom;
        this.revolvePage = revolvePage;

        const powerProgress = this.view.getChild("powerProgress").asProgress;
        this.powerProgress = powerProgress;

        const powerProgressText = this.view.getChild("powerProgressText").asTextField;
        this.powerProgressText = powerProgressText;

        const luckyDataStr = DataStore.getString(KeyConstants.TURN_TABLE);

        const energyTurnableData = <proto.casino.energy_turnable[]>JSON.parse(luckyDataStr);
        this.energyTurnableData = energyTurnableData;

        this.refreshTurnTable(JUNIOR_ROOM_ID);
        this.initHandler();

    }

    private refreshTurnTable(tabId: number): void {
        this.tabId = tabId;

        let data: proto.casino.energy_turnable = null;

        for (const element of this.energyTurnableData) {
            if (element.room_id === tabId) {
                data = element;
                break;
            }
        }

        if (data !== null) {
            const energyStr = DataStore.getString(KeyConstants.PLAYER_ENERGY);
            const playerEnergy = <proto.casino.player_energy>JSON.parse(energyStr);
            Logger.debug("data = ", data);
            Logger.debug("playerEnergy = ", playerEnergy);

            for (let i = 0; i < data.item.length && i < 6; i++) {
                const item = data.item[i];
                const node = this.view.getChild(`reward${i}`).asCom;
                let count: string = item.param.toString();
                if (item.type_id === proto.casino.eRESOURCE.RESOURCE_RED) {
                    count = `${item.param / 100}元`;
                }
                node.getChild("count").text = count;
                node.getChild("loader").asLoader.url = REWARD_IMG[item.type_id];
            }

            const energy = playerEnergy.curr_energy ? playerEnergy.curr_energy : 0;
            this.powerProgressText.text = `${energy}/${data.draw}`;

            const progressValue = energy / data.draw * 100;
            this.powerProgress.value = progressValue;
            if (playerEnergy.curr_energy === null || playerEnergy.curr_energy < data.draw) {
                this.drawLotteryBtn.getController("enable").selectedIndex = 0;
            } else {
                this.drawLotteryBtn.getController("enable").selectedIndex = 1;
            }
        }

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onRuleBtnClick(): void {
        this.addComponent(LotteryRuleView);
    }

    private onJuniorBtnClick(): void {
        if (this.tabId === JUNIOR_ROOM_ID) {
            return;
        }
        this.refreshTurnTable(JUNIOR_ROOM_ID);
    }

    private onMiddleBtnClick(): void {
        if (this.tabId === MIDDLE_ROOM_ID) {
            return;
        }
        this.refreshTurnTable(MIDDLE_ROOM_ID);
    }

    private onSeniorBtnClick(): void {
        if (this.tabId === SENIOR_ROOM_ID) {
            return;
        }
        this.refreshTurnTable(SENIOR_ROOM_ID);
    }

    private onDrawLotteryBtnClick(): void {
        //

        if (this.drawLotteryBtn.getController("enable").selectedIndex === 0) {
            Logger.debug("energy not enough----------------------------------------");

            return;
        }

        const req2 = new proto.casino.packet_et_draw_req();
        req2.et_id = this.tabId;
        const buf = proto.casino.packet_et_draw_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_ET_DRAW_REQ);

        // const rewardIndex = 6;
        // const rotate = rewardIndex * -60;
        // const armRotate = -360 * 6 + rotate;
        // const time = (armRotate / -60) * 0.1;
        // Logger.debug("dialShow time = describe", time);

        // //进入选中闪烁阶段
        // this.revolvePage.node.stopAllActions();
        // const action = cc.rotateTo(time, armRotate).easing(cc.easeInOut(3));

        // this.revolvePage.node.runAction(action);

    }

    private entryTurnable(msg: proto.casino.ProxyMessage): void {
        //
        Logger.debug("entryTurnable ", msg);
    }

    private drawResult(msg: proto.casino.ProxyMessage): void {
        //
        const drawAck = proto.casino.packet_et_draw_res.decode(msg.Data);
        Logger.debug("drawAck ", drawAck);
        if (drawAck.ret !== 0) {
            Logger.debug("drawResult, failed:", drawAck.ret);

            const err = GameError.getErrorString(drawAck.ret);
            Dialog.prompt(err);

            return;
        }

    }

}
