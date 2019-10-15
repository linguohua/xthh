import { CommonFunction, DataStore, Dialog, GResLoader, HTTP, KeyConstants, LEnv, Logger, SoundMgr, Enum } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";

const { ccclass } = cc._decorator;
const beanChannel = "android_h5";
const cardChannel = "android_h5";

export enum TabType {

    FK = 0,
    Dou = 1

}

const payError: { [key: number]: string } = {
    [-1]: "系统失败",
    [-2]: "支付取消",
    [-15001]: "虚拟支付接口错误码，缺少参数",
    [-15002]: "虚拟支付接口错误码，参数不合法",
    [-15003]: "订单重复",
    [-15004]: "虚拟支付接口错误码，后台错误",
    [-15005]: "虚拟支付接口错误码，appId权限被封禁",
    [-15006]: "虚拟支付接口错误码，货币类型不支持",
    [-15007]: "订单已支付",
    [1]: "用户取消支付",
    [2]: "重复支付",
    [3]: "虚拟支付接口错误码，Android独有错误：用户使用GooglePlay支付，而手机未安装GooglePlay",
    [4]: "虚拟支付接口错误码，用户操作系统支付状态异常",
    [5]: "虚拟支付接口错误码，操作系统错误",
    [6]: "虚拟支付接口错误码，其他错误",
    [7]: "请重新购买",
    [1000]: "参数错误",
    [1003]: "米大师Portal错误",
    [-9999]: "请求网络超时，支付失败！"
};
/**
 * 用户信息页面
 */
@ccclass
export class ShopView extends cc.Component {

    private view: fgui.GComponent;
    private win: fgui.Window;
    private eventTarget: cc.EventTarget;

    private vipView: fgui.GComponent;

    private beanItemList: fgui.GList;

    private beanPayCfgs: protoHH.casino.Ipay[];
    private cardItemList: fgui.GList;

    private cardPayCfgs: protoHH.casino.Ipay[];

    public showView(loader: GResLoader, page: TabType): void {
        loader.fguiAddPackage("lobby/fui_lobby_shop/lobby_shop");
        const view = fgui.UIPackage.createObject("lobby_shop", "shopView").asCom;
        CommonFunction.setViewInCenter(view);

        let mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        const vipView = fgui.UIPackage.createObject("lobby_shop", "vipView").asCom;
        CommonFunction.setViewInCenter(vipView);

        mask = vipView.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;
        this.vipView = vipView;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;
        this.initView();
        this.win.show();
        const tabCtrl = this.view.getController("tab");
        tabCtrl.selectedIndex = page;
    }

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
    }

    protected onDestroy(): void {
        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        SoundMgr.buttonTouch();
        this.destroy();
    }

    private onFkBtnClick(): void {
        SoundMgr.tabSwitch();
    }
    private onDouBtnClick(): void {
        SoundMgr.tabSwitch();

    }

    private initView(): void {
        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);

        const fkBtn = this.view.getChild("fkBtn").asButton;
        fkBtn.onClick(this.onFkBtnClick, this);

        const douBtn = this.view.getChild("douBtn").asButton;
        douBtn.onClick(this.onDouBtnClick, this);

        this.initShopCardView();
        this.initShopBeansView();
        this.initVipView();
    }

    private initShopCardView(): void {
        this.cardPayCfgs = this.getPayCfgs(cardChannel, protoHH.casino.eRESOURCE.RESOURCE_CARD);

        const cardView = this.view.getChild("fkCom").asCom;
        const vipBtn = cardView.getChild("vipBtn");
        vipBtn.onClick(this.onVipBtnClick, this);

        vipBtn.visible = false;

        this.cardItemList = cardView.getChild("list").asList;
        this.cardItemList.on(fgui.Event.CLICK_ITEM, this.onCardItemClick, this);
        this.cardItemList.setVirtual();
        this.cardItemList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderCardItemList(index, item);
        };

        this.cardItemList.numItems = this.cardPayCfgs.length;
    }

    private initShopBeansView(): void {
        this.beanPayCfgs = this.getPayCfgs(beanChannel, protoHH.casino.eRESOURCE.RESOURCE_BEANS);

        const beansView = this.view.getChild("douCom").asCom;
        const vipBtn = beansView.getChild("vipBtn");
        vipBtn.onClick(this.onVipBtnClick, this);

        vipBtn.visible = false;

        this.beanItemList = beansView.getChild("list").asList;
        this.beanItemList.on(fgui.Event.CLICK_ITEM, this.onBeanItemClick, this);
        this.beanItemList.setVirtual();
        this.beanItemList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderItemList(index, item);
        };

        this.beanItemList.numItems = this.beanPayCfgs.length;
    }

    private initVipView(): void {
        const vipViewCloseBtn = this.vipView.getChild("closeBtn");
        vipViewCloseBtn.onClick(this.onVipViewCloseBtnClick, this);

    }

    private showVipView(): void {
        this.win.contentPane = this.vipView;
        this.win.show();
    }

    private renderCardItemList(index: number, item: fgui.GObject): void {
        const cardPayCfg = this.cardPayCfgs[index];
        const itemCom = item.asCom;
        const nameText = itemCom.getChild("countText").asTextField;
        nameText.text = cardPayCfg.name;

        const giveMoreText = itemCom.getChild("giveMore").asTextField;
        giveMoreText.visible = false;

        const loader = itemCom.getChild("loader").asLoader;
        loader.url = `ui://lobby_shop/cz_icon_fk${index + 1}`;

        const buyBtn = itemCom.getChild("buyBtn").asButton;
        buyBtn.getChild("n1").text = cardPayCfg.price_info;
        buyBtn.onClick(this.onCardBuyBtnClick, this);
        buyBtn.data = index;
    }

    private renderItemList(index: number, item: fgui.GObject): void {
        const beanPayCfg = this.beanPayCfgs[index];
        const itemCom = item.asCom;
        const nameText = itemCom.getChild("countText").asTextField;
        nameText.text = beanPayCfg.name;

        const giveMoreText = itemCom.getChild("giveMore").asTextField;
        giveMoreText.visible = false;

        const loader = itemCom.getChild("loader").asLoader;
        loader.url = `ui://lobby_shop/cz_icon_hld${index + 1}`;

        const buyBtn = itemCom.getChild("buyBtn").asButton;
        buyBtn.getChild("n1").text = beanPayCfg.price_info;
        buyBtn.onClick(this.onBeanBuyBtnClick, this);
        buyBtn.data = index;
    }

    private onBeanItemClick(clickItem: fgui.GObject): void {
        // TODO:
    }

    private onCardItemClick(clickItem: fgui.GObject): void {
        // TODO:
    }

    private onBeanBuyBtnClick(ev: fgui.Event): void {
        SoundMgr.buttonTouch();
        // TODO: 检查如何是ios, 则提示暂不支持ios
        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.WECHAT) {
            Dialog.showDialog(LocalStrings.findString("pleaseUseWeChatLogin"));

            return;
        }
        const index = <number>ev.initiator.data;
        const beanPayCfg = this.beanPayCfgs[index];

        Logger.debug("beanPayCfg:", beanPayCfg);
        // this.onBuyToWX(beanPayCfg.price, beanPayCfg.id);
        const okCallback = () => {
            this.requestPay(beanPayCfg, this.eventTarget, true);
        };

        const noCallBack = () => {
            Logger.debug("user cancel buy");
        };

        Dialog.showDialog("确定要购买吗？", okCallback, noCallBack);

    }

    private onCardBuyBtnClick(ev: fgui.Event): void {
        SoundMgr.buttonTouch();
        // TODO: 检查如何是ios, 则提示暂不支持ios
        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.WECHAT) {
            Dialog.showDialog(LocalStrings.findString("pleaseUseWeChatLogin"));

            return;
        }

        const index = <number>ev.initiator.data;
        const cardPayCfg = this.cardPayCfgs[index];

        Logger.debug("onCardBuyBtnClick:", cardPayCfg);

        const okCallback = () => {
            this.requestPay(cardPayCfg, this.eventTarget, true);
        };

        const noCallBack = () => {
            Logger.debug("user cancel buy");
        };

        Dialog.showDialog("确定要购买吗？", okCallback, noCallBack);
        // Logger.debug("cardPayCfg:", cardPayCfg);
        // this.onBuyToWX(cardPayCfg.price, cardPayCfg.id);

    }
    private onVipBtnClick(): void {
        SoundMgr.buttonTouch();
        this.showVipView();
    }

    private onVipViewCloseBtnClick(): void {
        SoundMgr.buttonTouch();
        this.win.hide();
        this.win.contentPane = this.view;
        this.win.show();
    }

    private getPayCfgs(payChannel: string, payType: number): protoHH.casino.Ipay[] {
        const payCfgs: protoHH.casino.Ipay[] = [];

        const payDataStr = DataStore.getString(KeyConstants.PAY_DATA);
        const payData = <protoHH.casino.pay_data>JSON.parse(payDataStr);
        for (const pay of payData.pays) {
            if (pay.type === payType && pay.channel === payChannel) {
                payCfgs.push(pay);
            }
        }

        return payCfgs;
    }

    /**
     * 米大师支付
     * @param bufQuantity 支付金额
     */
    private onBuyToWX(payCfg: protoHH.casino.Ipay, isSandBox: boolean): void {
        console.log(`onBuyToWX, cost:${payCfg.price}, payID:${payCfg.id}, isSandBox:${isSandBox}`);

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Dialog.showDialog(LocalStrings.findString("pleaseUseWeChatLogin"));

            return;
        }

        const buyQuantity = payCfg.price / 0.1;
        let evn = 0;
        if (isSandBox) {
            evn = 1;
        }

        const params = {
            mode: "game",
            env: evn,
            currencyType: "CNY",
            offerId: LEnv.offerID,
            platform: "android",
            buyQuantity: buyQuantity,
            zoneId: "1",
            success: async () => {
                console.log(`onBuyToWX success, cost:${payCfg.price}, buyQuantity:${buyQuantity},payID:${payCfg.id}`);
                // 保存订单
                // const now = Date.now();
                // const random = Math.random() * 100000;
                // const orderID = md5(`${now}${random}`);
                // CommonFunction.saveOrder(orderID, payID);
                // 请求服务器发货
                // CommonFunction.requestServerShipments(payID, orderID, this.eventTarget);
                // Dialog.prompt("支付成功");
                this.requestPay(payCfg, this.eventTarget, false);
            },

            fail: async (res: { errMsg: string; errCode: number }) => {
                console.log("onBuyToWX fail", res);
                if (res.errCode !== undefined) {
                    Dialog.showDialog(payError[res.errCode]);
                } else {
                    Dialog.showDialog(LocalStrings.findString("payFialed"));
                }
            }
        };

        Logger.debug("params;", params);
        wx.requestMidasPayment(params);
    }

    private requestPay(payCfg: protoHH.casino.Ipay, eventTarget: cc.EventTarget, isContinue: boolean): void {
        const req = {
            channel: "weixin",
            pay_id: payCfg.id
        };

        const reqString = JSON.stringify(req);

        const userID = DataStore.getString(KeyConstants.USER_ID, "");
        // const ticket = DataStore.getString(KeyConstants.TICKET, "");
        // const userID = encodeURIComponent(DataStore.getString(KeyConstants.USER_ID, ""));
        const ticket = encodeURIComponent(DataStore.getString(KeyConstants.TICKET, ""));
        const url = LEnv.cfmt(`${LEnv.rootURL}${LEnv.payUrl}?ticket=${ticket}`, 2, userID);
        Logger.debug("url:", url);
        Logger.debug("req:", req);
        HTTP.hPost(
            eventTarget,
            url,
            async (xhr: XMLHttpRequest, err: string) => {
                let errMsg = null;
                if (err !== null) {
                    Logger.debug(err);
                    // const okCallback = () => {
                    //     requestServerShipments(payID, orderID, eventTarget);
                    // };

                    Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                    return;
                }

                errMsg = HTTP.hError(xhr);
                if (errMsg !== null) {
                    Logger.debug(errMsg);

                    // const okCallback = () => {
                    //     requestServerShipments(payID, orderID, eventTarget);
                    // };
                    Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                    return;
                }

                // removeOrder(orderID);
                Logger.debug("responseText:", xhr.responseText);
                const result = <{ ret: number; msg: string; data: { sandbox: boolean } }>JSON.parse(xhr.responseText);
                if (result.ret !== 0) {
                    Logger.error(`requestServerShipments failed, code:${result.ret}, msg:${result.msg}, data:${result.data.sandbox}`);
                    // -22 是余额不足
                    if (result.ret === -22 && isContinue) {
                        this.onBuyToWX(payCfg, result.data.sandbox);
                    } else {
                        Dialog.showDialog(`发货失败:${result.msg}`);
                    }
                } else {
                    // Dialog.showDialog("支付成功");
                    Dialog.showDialog(`购买成功`);
                }
            },
            "text",
            reqString);

    }
}
