import { GameError } from "../../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, KeyConstants, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
import { LotteryRewardView } from "./LotteryRewardView";
import { LotteryRuleView } from "./LotteryRuleView";
const { ccclass } = cc._decorator;

const JUNIOR_ROOM_ID: number = 12001;
const MIDDLE_ROOM_ID: number = 12002;
const SENIOR_ROOM_ID: number = 12003;

const REWARD_IMG: { [key: number]: string } = {
    [proto.casino.eRESOURCE.RESOURCE_RED]: "ui://lobby_bg_package/ty_hb",
    [proto.casino.eRESOURCE.RESOURCE_BEANS]: "ui://lobby_bg_package/ty_hld",
    [proto.casino.eRESOURCE.RESOURCE_NONE]: "ui://lobby_bg_package/ty_hld"
};

export interface JoyBeanViewInterface {
    unregisterCoinChange: Function;
    registerCoinChange: Function;
}

/**
 * 抽奖页面
 */
@ccclass
export class LotteryView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    private joyBeanView: JoyBeanViewInterface;

    private energyTurnableData: proto.casino.Ienergy_turnable[];

    private currTurnableData: proto.casino.Ienergy_turnable;

    private drawLotteryBtn: fgui.GButton;
    private revolvePage: fgui.GComponent;
    private powerProgress: fgui.GProgressBar;

    private powerProgressText: fgui.GTextField;
    private tabId: number;

    private itemBindDatas: { [key: number]: number } = {};

    private drawingBlock: fgui.GComponent;

    public show(lm: LobbyModuleInterface, joyBeanView: JoyBeanViewInterface): void {
        this.lm = lm;
        this.joyBeanView = joyBeanView;
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_lottery/lobby_lottery");
        const view = fgui.UIPackage.createObject("lobby_lottery", "lotteryView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        const drawingBlock = view.getChild("drawingBlockBtn").asCom;
        CommonFunction.setBgFullScreenSize(drawingBlock);

        this.view = view;
        this.initView();
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.win.show();
    }

    protected onLoad(): void {
        //  this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
    }

    protected onDestroy(): void {
        this.unRegisterHander();
        this.win.hide();
        this.win.dispose();
    }

    private unRegisterHander(): void {

        this.lm.eventTarget.off(KeyConstants.PLAYER_ENERGY, this.refreshPowerProgress, this);
    }
    private registerHandler(): void {
        // const this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        // this.lm = lm;
        this.lm.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ET_DRAW_RES, this.drawResult, this);
        this.lm.eventTarget.on(KeyConstants.PLAYER_ENERGY, this.refreshPowerProgress, this);
        this.lm.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_ENERGY_TURNABLE, this.onEnergyTurnableUpdate, this);
    }

    private initView(): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const ruleBtn = this.view.getChild("ruleBtn");
        ruleBtn.onClick(this.onRuleBtnClick, this);

        const juniorBtn = this.view.getChild("juniorBtn").asButton;
        juniorBtn.onClick(this.onJuniorBtnClick, this);

        const middleBtn = this.view.getChild("middleBtn").asButton;
        middleBtn.onClick(this.onMiddleBtnClick, this);

        const seniorBtn = this.view.getChild("seniorBtn").asButton;
        seniorBtn.onClick(this.onSeniorBtnClick, this);

        const drawingBlockBtn = this.view.getChild("drawingBlockBtn").asCom;
        this.drawingBlock = drawingBlockBtn;

        const drawLotteryBtn = this.view.getChild("drawLotteryBtn").asButton;
        drawLotteryBtn.onClick(this.onDrawLotteryBtnClick, this);
        drawLotteryBtn.getController("enable").selectedIndex = 1;

        this.drawLotteryBtn = drawLotteryBtn;

        const revolvePage = this.view.getChild("revolvePage").asCom;
        this.revolvePage = revolvePage;

        const lastDrawIndex = +DataStore.getString(KeyConstants.LOTTERY_DRAW_INDEX);

        const rotate = this.getRotate(lastDrawIndex);
        this.revolvePage.rotation = rotate;

        const powerProgress = this.view.getChild("powerProgress").asProgress;
        this.powerProgress = powerProgress;

        const powerProgressText = this.view.getChild("powerProgressText").asTextField;
        this.powerProgressText = powerProgressText;

        const luckyDataStr = DataStore.getString(KeyConstants.TURN_TABLE);

        const energyTurnableData = <proto.casino.energy_turnable[]>JSON.parse(luckyDataStr);
        this.energyTurnableData = energyTurnableData;

        const energyStr = DataStore.getString(KeyConstants.PLAYER_ENERGY);
        const playerEnergy = <proto.casino.player_energy>JSON.parse(energyStr);

        const currEnergy = playerEnergy.curr_energy;

        let selectedTap;

        if (currEnergy < 10000) {
            selectedTap = JUNIOR_ROOM_ID;
            juniorBtn.selected = true;
        } else if (currEnergy >= 10000 && currEnergy < 20000) {
            selectedTap = MIDDLE_ROOM_ID;
            middleBtn.selected = true;
        } else if (currEnergy >= 20000) {
            seniorBtn.selected = true;
            selectedTap = SENIOR_ROOM_ID;
        }

        this.refreshTurnTable(selectedTap);
        this.registerHandler();

    }

    private getRotate(index: number): number {
        const rotate = index * -60;

        return -360 * 6 + rotate;

    }

    private refreshPowerProgress(energy: number): void {

        const energyNum = energy === null ? 0 : energy;
        const data = this.currTurnableData;
        this.powerProgressText.text = `${energyNum}/${data.draw}`;

        const progressValue = energy / data.draw * 100;
        this.powerProgress.value = progressValue;
        if (energy === null || energy < data.draw) {
            this.drawLotteryBtn.getController("enable").selectedIndex = 0;
        } else {
            this.drawLotteryBtn.getController("enable").selectedIndex = 1;
        }

    }

    private refreshTurnTable(tabId: number): void {
        this.tabId = tabId;

        for (const element of this.energyTurnableData) {
            if (element.room_id === tabId) {
                this.currTurnableData = element;

                break;
            }
        }

        this.itemBindDatas = {};

        const data = this.currTurnableData;

        if (this.currTurnableData !== null) {
            const energyStr = DataStore.getString(KeyConstants.PLAYER_ENERGY);
            const playerEnergy = <proto.casino.player_energy>JSON.parse(energyStr);
            // Logger.debug("data= ", data);
            // Logger.debug("playerEnergy = ", playerEnergy);

            for (let i = 0; i < data.item.length && i < 6; i++) {
                const item = data.item[i];
                const node = this.view.getChild(`reward${i}`).asCom;
                let count: string = item.param.toString();
                if (item.type_id === proto.casino.eRESOURCE.RESOURCE_RED) {
                    count = `${item.param / 100}元`;
                }
                node.getChild("count").text = count;
                node.getChild("loader").asLoader.url = REWARD_IMG[item.type_id];

                this.itemBindDatas[item.id] = i;
            }

            this.refreshPowerProgress(playerEnergy.curr_energy);
        }

    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onRuleBtnClick(): void {
        const view = this.addComponent(LotteryRuleView);
        view.show(this.lm, this.currTurnableData);
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

    private showDrawingBlock(): void {
        this.joyBeanView.unregisterCoinChange();
        this.drawingBlock.visible = true;
    }

    private hideDrawingBlock(): void {
        this.joyBeanView.registerCoinChange();
        this.drawingBlock.visible = false;
    }

    private onDrawLotteryBtnClick(): void {
        if (this.drawLotteryBtn.getController("enable").selectedIndex === 0) {
            Logger.debug("energy not enough or on drawing ----------------------------------------");

            return;
        }

        this.showDrawingBlock();

        const data = this.currTurnableData;
        const turnableId = data.id;

        const req2 = new proto.casino.packet_et_draw_req();
        req2.et_id = turnableId;
        const buf = proto.casino.packet_et_draw_req.encode(req2);
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        lm.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_ET_DRAW_REQ);

    }

    private showDrawResult(drawItem: proto.casino.Ienergy_turnable_item): void {

        Dialog.hideWaiting();
        const rewardIndex = this.itemBindDatas[drawItem.id];
        Logger.debug("drawItem = ", drawItem);

        const armRotate = this.getRotate(rewardIndex);
        const time = (armRotate / -60) * 0.1;

        //  记录下抽中的Index
        DataStore.setItem(KeyConstants.LOTTERY_DRAW_INDEX, rewardIndex);

        //进入选中闪烁阶段
        this.revolvePage.node.stopAllActions();
        const action = cc.rotateTo(time, armRotate).easing(cc.easeInOut(3));

        const showResultAction = cc.callFunc(() => {
            const view = this.addComponent(LotteryRewardView);
            view.show(this.lm, drawItem);
            this.hideDrawingBlock();
        });

        const finalAction = cc.sequence(action, showResultAction);
        this.revolvePage.node.runAction(finalAction);
    }

    private onEnergyTurnableUpdate(msg: proto.casino.ProxyMessage): void {
        Logger.debug("onEnergyUpdate");
        const energyTurnable = proto.casino.packet_energy_turnable.decode(msg.Data);
        Logger.debug("onEnergyUpdate energyTurnable = ", energyTurnable);

        this.energyTurnableData = energyTurnable.et;
        const etData = JSON.stringify(energyTurnable.et);
        DataStore.setItem(KeyConstants.TURN_TABLE, etData);
        this.refreshTurnTable(this.tabId);

    }

    private drawResult(msg: proto.casino.ProxyMessage): void {
        const drawAck = proto.casino.packet_et_draw_res.decode(msg.Data);
        Logger.debug("drawResult drawAck ", drawAck);
        if (drawAck.ret !== 0) {
            Logger.debug("drawResult, failed:", drawAck.ret);

            const err = GameError.getErrorString(drawAck.ret);
            Dialog.prompt(err);
            this.hideDrawingBlock();

            return;
        }

        const data = this.currTurnableData;
        let drawItem: proto.casino.Ienergy_turnable_item = null;
        for (const item of data.item) {
            if (item.id === drawAck.item_id && item.et_id === drawAck.et_id) {
                drawItem = item;
            }
        }

        if (drawItem !== null) {
            this.showDrawResult(drawItem);
        } else {
            Logger.debug("drawItem is null, this.currTurnableData = ", this.currTurnableData);
            this.hideDrawingBlock();
        }

    }

}
