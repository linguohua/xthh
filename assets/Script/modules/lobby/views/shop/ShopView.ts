import { CommonFunction, DataStore, Dialog, Enum, GResLoader, HTTP, KeyConstants, LEnv, Logger, SoundMgr } from "../../lcore/LCoreExports";
import { proto as protoHH } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";

const { ccclass } = cc._decorator;
const beanChannel = "android_h5";
const cardChannel = "weixin";

export enum TabType {

    FK = 0,
    Dou = 1

}
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

        this.eventTarget = new cc.EventTarget();

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

    protected onDestroy(): void {

        this.eventTarget.emit("destroy");
        this.win.hide();
        this.win.dispose();
    }

    private onCloseClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
        this.destroy();
    }

    private onFkBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_move`);
    }
    private onDouBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_move`);

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
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
        // TODO: 检查如何是ios, 则提示暂不支持ios
        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.WECHAT) {
            Dialog.showDialog(LocalStrings.findString("pleaseUseWeChatLogin"));

            return;
        }
        const index = <number>ev.initiator.data;
        const beanPayCfg = this.beanPayCfgs[index];

        Logger.debug("beanPayCfg:", beanPayCfg);
        this.onBuyToWX(beanPayCfg.price, beanPayCfg.id);

    }

    private onCardBuyBtnClick(ev: fgui.Event): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
        // TODO: 检查如何是ios, 则提示暂不支持ios
        const channel = DataStore.getString(KeyConstants.CHANNEL);
        if (channel !== Enum.CHANNEL_TYPE.WECHAT) {
            Dialog.showDialog(LocalStrings.findString("pleaseUseWeChatLogin"));

            return;
        }

        const index = <number>ev.initiator.data;
        const cardPayCfg = this.cardPayCfgs[index];

        Logger.debug("cardPayCfg:", cardPayCfg);

    }
    private onVipBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
        this.showVipView();
    }

    private onVipViewCloseBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
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
    private onBuyToWX(cost: number, payID: number): void {
        console.log(`onBuyToWX, cost:${cost}, payID:${payID}`);

        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            Dialog.showDialog(LocalStrings.findString("pleaseUseWeChatLogin"));

            return;
        }

        let buyQuantity = cost / 0.1;
        let evn = 0;
        if (LEnv.isDebug) {
            evn = 1;
            buyQuantity = 1 / 0.1;
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
                console.log(`onBuyToWX success, cost:${cost}, buyQuantity:${buyQuantity},payID:${payID}`);
                // 请求服务器发货
                this.requestServerShipments(payID);
            },

            fail: async (res: { errMsg: string; errCode: number }) => {
                console.log("onBuyToWX fail", res);
                Dialog.showDialog(res.errMsg);
            }
        };

        Logger.debug("params;", params);
        wx.requestMidasPayment(params);
    }

    private requestServerShipments(payID: number): void {
        const req = {
            channel: "weixin",
            pay_id: payID
        };

        const reqString = JSON.stringify(req);

        const userID = DataStore.getString(KeyConstants.USER_ID, "");
        const ticket = DataStore.getString(KeyConstants.TICKET, "");
        const url = LEnv.cfmt(`${LEnv.rootURL}${LEnv.shipmentsUrl}`, 2, userID, ticket);
        Logger.debug("url:", url);
        Logger.debug("req:", req);
        HTTP.hPost(
            this.eventTarget,
            url,
            (xhr: XMLHttpRequest, err: string) => {
                let errMsg = null;
                if (err !== null) {
                    Logger.debug(err);
                    Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                    return;
                }

                errMsg = HTTP.hError(xhr);
                if (errMsg !== null) {
                    Logger.debug(errMsg);
                    Dialog.showDialog(LocalStrings.findString("networkConnectError"));

                    return;
                }

                Logger.debug("responseText:", xhr.responseText);

            },
            "text",
            reqString);

    }

}
