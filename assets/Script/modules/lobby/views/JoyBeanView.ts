
import { CommonFunction, DataStore, Dialog, KeyConstants, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { proto } from "../protoHH/protoHH";
import { Share } from "../shareUtil/ShareExports";
import { LocalStrings } from "../strings/LocalStringsExports";
import { LotteryView } from "./lottery/LotteryView";
import { ShopView, TabType } from "./shop/ShopView";
import { UserInfoTabType, UserInfoView } from "./userInfo/UserInfoView";
import { WelfareView } from "./welfare/WelfareViewExports";
const { ccclass } = cc._decorator;

/**
 * 欢乐场页面
 */
@ccclass
export class JoyBeanView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;
    private rooms: proto.casino.Iroom[];
    private beansText: fgui.GObject;

    private fkText: fgui.GObject;

    public show(): void {
        this.initView();
        this.win.show();
    }

    public unregisterCoinChange(): void {
        this.lm.eventTarget.off("onResourceChange", this.onResourceChange, this);

    }
    public registerCoinChange(): void {
        this.lm.eventTarget.on("onResourceChange", this.onResourceChange, this);
        this.onResourceChange();

    }

    protected onLoad(): void {
        this.lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_joy_bean/lobby_joy_bean");
        const view = fgui.UIPackage.createObject("lobby_joy_bean", "joyBeanView").asCom;

        CommonFunction.setViewInCenter(view);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.lm.eventTarget.on("onResourceChange", this.onResourceChange, this);
        const pdataStr = DataStore.getString(KeyConstants.ROOMS, "");
        this.rooms = <proto.casino.Iroom[]>JSON.parse(pdataStr);

        this.win = win;
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(): void {
        const returnBtn = this.view.getChild("returnBtn");
        returnBtn.onClick(this.onCloseBtnClick, this);

        const shareBtn = this.view.getChild("shareBtn");
        shareBtn.onClick(this.onShareBtnClick, this);

        const settingBtn = this.view.getChild("settingBtn");
        settingBtn.onClick(this.onSettingBtnClick, this);

        const addDou = this.view.getChild("addDouBtn");
        addDou.onClick(this.onAddDouBtnClick, this);

        const addFK = this.view.getChild("addFKBtn");
        addFK.onClick(this.onAddFKBtnClick, this);

        const shopBtn = this.view.getChild("shopBtn");
        shopBtn.onClick(this.onShopBtnClick, this);

        const lotteryViewBtn = this.view.getChild("lotteryViewBtn");
        lotteryViewBtn.onClick(this.onLotteryViewBtnClick, this);

        const juniorBtn = this.view.getChild("junior").asCom;
        juniorBtn.onClick(() => { this.onJoinRoomClick(0); }, this); //初级场
        this.setJoyBtnInfo(juniorBtn, this.rooms[0]);

        const middleBtn = this.view.getChild("middle").asCom;
        middleBtn.onClick(() => { this.onJoinRoomClick(1); }, this); //中级场
        this.setJoyBtnInfo(middleBtn, this.rooms[1]);

        const seniorBtn = this.view.getChild("senior").asCom;
        seniorBtn.onClick(() => { this.onJoinRoomClick(2); }, this); //高级场
        this.setJoyBtnInfo(seniorBtn, this.rooms[2]);

        const playQuicklyBtn = this.view.getChild("playQuicklyBtn");
        playQuicklyBtn.onClick(this.onQuicklyClick, this);

        this.beansText = this.view.getChild("douText").asTextField;
        this.fkText = this.view.getChild("fkText").asTextField;

        this.beansText.text = DataStore.getString(KeyConstants.BEANS);
        this.fkText.text = DataStore.getString(KeyConstants.CARD);
    }
    private onCloseBtnClick(): void {
        this.destroy();
    }

    private onSettingBtnClick(): void {
        const view = this.addComponent(UserInfoView);
        view.showView(UserInfoTabType.GAME_SETTING);
    }

    private onAddDouBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(this.lm.loader, TabType.Dou);
    }

    private onAddFKBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(this.lm.loader, TabType.FK);
    }

    private onShareBtnClick(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Share.shareScreenshot("");
        }
    }

    private onShopBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(this.lm.loader, TabType.Dou);
    }

    private onLotteryViewBtnClick(): void {
        const view = this.addComponent(LotteryView);
        view.show(this.lm, this);
    }

    private onQuicklyClick(): void {
        let joyRoom = null;
        const myGold = +DataStore.getString(KeyConstants.BEANS);
        //否则就找可以进的房间
        const pdataStr = DataStore.getString(KeyConstants.ROOMS, "");
        const rooms = <proto.casino.Iroom[]>JSON.parse(pdataStr);
        for (const r of rooms) {
            if (r.gold.low <= myGold) {
                joyRoom = r;
            }
        }
        if (joyRoom !== null) {
            const req = {
                casino_id: joyRoom.casino_id,
                room_id: joyRoom.id,
                table_id: long.fromNumber(0),
                ready: true
            };

            const req2 = new proto.casino.packet_table_join_req(req);
            const buf = proto.casino.packet_table_join_req.encode(req2);

            this.lm.joinRoom(buf);
            this.win.hide();
            this.destroy();
        } else {
            // 提示用户没有豆了
            this.checkBeans(myGold);
        }
    }

    private checkBeans(myGold: number): void {
        const goldmin = +DataStore.getString(KeyConstants.HELPER_MIN);
        if (goldmin > myGold) {
            //低于最小值才可以领取
            const helperCount = this.helperNumber();
            if (helperCount[0] > 0) {
                // 判断有没有可以免费领
                const view = this.addComponent(WelfareView);
                view.showView(this.lm, helperCount[0], helperCount[1]);

                return;
            }
        }
        // 提示用户没有豆了
        const yesCB = () => {
            const view = this.addComponent(ShopView);
            view.showView(this.lm.loader, TabType.Dou);

            // this.onBackButtonClick();
        };
        const noCB = () => {
            // this.onBackButtonClick();
        };
        Dialog.showDialog(LocalStrings.findString("beanIsLess"), yesCB, noCB);
    }
    private onJoinRoomClick(index: number): void {
        const room = this.rooms[index];
        const myGold = +DataStore.getString(KeyConstants.BEANS);
        if (room.gold.low > myGold) {
            this.checkBeans(myGold);

            return;
        }
        // Logger.debug("rooms : ", this.rooms[index]);
        const req = {
            casino_id: room.casino_id,
            room_id: room.id,
            table_id: long.fromNumber(0),
            ready: true
        };

        const req2 = new proto.casino.packet_table_join_req(req);
        const buf = proto.casino.packet_table_join_req.encode(req2);

        if (this.lm !== undefined) {
            this.lm.joinRoom(buf);

            this.win.hide();
            this.destroy();
        } else {
            Logger.error("this.lm == undefined")
        }
    }
    private setJoyBtnInfo(btn: fgui.GComponent, room: proto.casino.Iroom): void {
        btn.getChild("limit").text = room.base.toString(); //底分
        // Logger.debug("room : ------- ", room.gold.low);
        btn.getChild("difen").text = this.getJoyBeansStr(room.gold.low, room.gold_max); //欢乐豆
    }

    private getJoyBeansStr(gold: number, goldMax: number): string {
        let str = "";
        if (gold >= 10000) {
            str = `${gold / 10000}万`;
        } else {
            str = `${gold}`;
        }
        if (goldMax === 0) {
            str = `${str}豆以上`;
        } else {
            if (goldMax >= 10000) {
                str = `${str}-${goldMax / 10000}万豆`;
            } else {
                str = `${str}-${goldMax}豆`;
            }
        }

        return str;
    }

    private helperNumber(): number[] {
        const havaHelperNum = [0, 1]; //领取免费豆次数 是否刷新
        const helperTimeStr = DataStore.getString(KeyConstants.HELPER_TIME, "");
        const helperSizeStr = DataStore.getString(KeyConstants.HELPER_SIZE, "");
        const helperParamStr = DataStore.getString(KeyConstants.HELPER_PARAM, "");
        // Logger.debug(`helperTimeStr : ${helperTimeStr} ; helperSizeStr : ${helperSizeStr} ; helperParamStr : ${helperParamStr}`);
        if (helperSizeStr !== "") {
            const helperSize = +helperSizeStr;
            if (helperSize > 0) {
                if (this.isToday(helperTimeStr)) {
                    //如果领取的时间是今天
                    if (helperParamStr !== "") {
                        havaHelperNum[0] = helperSize - +helperParamStr;
                    } else {
                        havaHelperNum[0] = helperSize;
                    }
                    havaHelperNum[1] = 0;
                } else {
                    havaHelperNum[0] = helperSize;
                    havaHelperNum[1] = 1;
                }
            }
        }
        // Logger.debug("havaHelperNum ： ", havaHelperNum);

        return havaHelperNum;
    }
    private isToday(helperTimeStr: string): boolean {
        if (helperTimeStr === "") {
            return false;
        }
        const time = +helperTimeStr;
        const time0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        const time24 = new Date(new Date().setHours(24, 0, 0, 0)).getTime();
        // Logger.debug(`time : ${time} ; time0 : ${time0} ; time24 : ${time24}`);

        return time0 < time && time < time24;
    }

    private onResourceChange(): void {
        this.beansText.text = DataStore.getString(KeyConstants.BEANS);
        this.fkText.text = DataStore.getString(KeyConstants.CARD);
    }
}
