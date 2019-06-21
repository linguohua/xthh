import { DataStore, Logger } from "../lcore/LCoreExports";

// import { proto } from "../proto/protoLobby";

const { ccclass } = cc._decorator;

interface NewRoomViewInterface {

    updatePrice: Function;
    forReview?: boolean;
    itemsJSON?: { [key: string]: boolean | number };

    getView(): fgui.GComponent;
}

/**
 * LoginView 登录界面
 */
@ccclass
export class RunFastRuleView {
    private view: fgui.GComponent;
    private newRoomView: NewRoomViewInterface;

    private toggleRoundCounts: fgui.GButton[] = [];

    private togglePays: fgui.GButton[] = [];

    private recordKey: string = "GZRule";

    private priceCfg: object = null;

    private readonly rules: { [key: string]: string | number | boolean } = {
        ["roomType"]: 8,
        ["playerNumAcquired"]: 3,
        ["payNum"]: 4,
        ["payType"]: 0,
        ["handNum"]: 4,
        ["modName"]: "gamea"
    };

    public show(): void {
        this.view.visible = true;
    }

    public hide(): void {
        this.view.visible = false;
    }

    public destroy(): void {
        if (!this.newRoomView.forReview) {
            this.saveRule();
        }
    }

    public updatePriceCfg(priceCfgs: { [key: string]: object }): void {
        if (priceCfgs !== null) {
            const roomType = this.rules[`roomType`];
            this.priceCfg = priceCfgs[`${roomType}`];
            Logger.debug(`dfmj RuleVIew.updateComsumer roomType:${roomType}, priceCfg:${JSON.stringify(this.priceCfg)}`);
        }

        this.updateComsumer();
    }

    public updateComsumer(): void {
        const configTable = this.getConfigTable();

        const payIndex = this.getToggleIndex(this.togglePays);
        const payType = configTable[`payType`][payIndex];

        const roundIndex = this.getToggleIndex(this.toggleRoundCounts);
        const handNum = configTable[`handNum`][roundIndex];

        const cost = this.getCost(payType, 3, handNum);

        this.newRoomView.updatePrice(cost);
    }
    public bindView(newRoomView: NewRoomViewInterface): void {
        this.newRoomView = newRoomView;

        const view = fgui.UIPackage.createObject("lobby_create_room", "gzRoom").asCom;
        this.view = view;
        const roomview = newRoomView.getView();
        const mountpoint = roomview.getChild("mount");
        view.setPosition(mountpoint.x, mountpoint.y);
        roomview.addChild(view);

        this.initAllView();

        if (this.newRoomView.forReview) {
            this.initItems(this.newRoomView.itemsJSON);
        } else {
            if (DataStore.hasKey(this.recordKey)) {
                const jsonStr = DataStore.getString(this.recordKey, "");
                Logger.debug("jsnoStr:", jsonStr);
                if (jsonStr !== "") {
                    try {
                        const config = <{ [key: string]: boolean | number }>JSON.parse(jsonStr);
                        this.initItems(config);
                    } catch (e) {
                        Logger.error("parse config error:", e);
                        // 如果解析不了，则清理数据
                        DataStore.setItem(this.recordKey, "");
                    }
                }
            }
        }
    }

    public getRules(): string {
        const configTable = this.getConfigTable();
        const rules = this.rules;

        const roundIndex = this.getToggleIndex(this.toggleRoundCounts);
        rules[`handNum`] = configTable[`handNum`][roundIndex];

        const payIndex = this.getToggleIndex(this.togglePays);
        rules[`payType`] = configTable[`payType`][payIndex];

        return JSON.stringify(rules);
    }

    private setToggleIndex(toggles: fgui.GButton[], values: { [key: number]: number }, value: number): void {
        Object.keys(values).forEach((k) => {
            const v = values[Number(k)];
            if (v === value) {
                toggles[Number(k)].selected = true;
            }
        });
    }

    private initItems(config: { [key: string]: boolean | number }): void {
        try {
            const configTable = this.getConfigTable();

            this.setToggleIndex(this.toggleRoundCounts, configTable[`handNum`], <number>config[`handNum`]);
            this.setToggleIndex(this.togglePays, configTable[`payType`], <number>config[`payType`]);
        } catch (e) {
            Logger.error(e);
        }
    }

    private initAllView(): void {
        // const consume = this.view.getChild("consumeCom").asCom;
        // this.consumeText = consume.getChild("consumeText");

        // 局数
        const toggleRoundCount0 = this.view.getChild("round4Button").asButton;
        toggleRoundCount0.getChild("title").text = "4局";
        toggleRoundCount0.onClick(this.updateComsumer, this);
        this.toggleRoundCounts.push(toggleRoundCount0);

        const toggleRoundCount1 = this.view.getChild("round8Button").asButton;
        toggleRoundCount1.getChild("title").text = "8局";
        toggleRoundCount1.onClick(this.updateComsumer, this);
        this.toggleRoundCounts.push(toggleRoundCount1);

        const toggleRoundCount2 = this.view.getChild("round16Button").asButton;
        toggleRoundCount2.getChild("title").text = "16局";
        toggleRoundCount2.onClick(this.updateComsumer, this);
        this.toggleRoundCounts.push(toggleRoundCount2);

        // 支付
        const togglePay0 = this.view.getChild("ownerPayButton").asButton;
        togglePay0.getChild("title").text = "房主支付";
        togglePay0.onClick(this.updateComsumer, this);
        this.togglePays.push(togglePay0);

        const togglePay1 = this.view.getChild("aapPayButton").asButton;
        togglePay1.getChild("title").text = "AA支付";
        togglePay1.onClick(this.updateComsumer, this);
        this.togglePays.push(togglePay1);

        if (DataStore.hasKey(this.recordKey)) {
            const jsonStr = DataStore.getString(this.recordKey);
            Logger.debug("jsnoStr:", jsonStr);
        }

    }

    private getConfigTable(): { [key: string]: { [key: number]: number } } {
        return {
            ["playerNumAcquired"]: {
                [0]: 2,
                [1]: 3,
                [2]: 4
            },
            ["payNum"]: {
                [0]: 24,
                [1]: 36,
                [2]: 66
            },
            ["payType"]: {
                [0]: 0,
                [1]: 1
            },
            ["handNum"]: {
                [0]: 4,
                [1]: 8,
                [2]: 16
            }
        };
    }

    private getCost(payType: number, playerNum: number, handNum: number): number {
        // Logger.debug("payType:"..payType..", playerNum:"..playerNum..", handNum"..handNum)
        let key = `ownerPay:${playerNum}:${handNum}`;
        if (payType === 1) {
            key = `aaPay:${playerNum}:${handNum}`;
        }

        if (this.priceCfg === undefined) {
            Logger.debug("this.priceCfg === undefine");

            return 0;
        }

        Logger.debug(`key: ${key}`);

        const priceCfg = <{ [key: string]: object }>this.priceCfg;
        const activityPriceCfg = <{ [key: string]: object }>priceCfg.activityPriceCfg;
        if (activityPriceCfg !== null) {
            const discountCfg = <{ [key: string]: number }>activityPriceCfg.discountCfg;

            return discountCfg[key];
        }

        const originalPriceCfg = <{ [key: string]: number }>priceCfg.originalPriceCfg;
        if (originalPriceCfg !== null) {
            return originalPriceCfg[key];
        }

        return 0;
    }

    private getToggleIndex(toggles: fgui.GButton[]): number {
        const len = toggles.length;
        for (let i = 0; i < len; i++) {
            const toggle = toggles[i];
            if (toggle.selected) {
                return i;
            }
        }

        return 0;
    }

    private saveRule(): void {
        Logger.debug("guanzhang RuleVIew.saveRule()");

        const jsonString = this.getRules();
        DataStore.setItem(this.recordKey, jsonString);
    }

}
