
import { GameError } from "../errorCode/ErrorCodeExports";
import { CommonFunction, DataStore, Dialog, GameModuleLaunchArgs, KeyConstants, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { proto } from "../protoHH/protoHH";
import { Share } from "../shareUtil/ShareExports";
import { LotteryView } from "./lottery/LotteryView";
import { ShopView, TabType } from "./ShopView";
import { UserInfoTabType, UserInfoView } from "./UserInfoView";
import { LocalStrings } from "../strings/LocalStringsExports";
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
    public show(): void {
        this.initHandler();
        this.initView();
        this.win.show();
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

        const pdataStr = DataStore.getString(KeyConstants.ROOMS, "");
        this.rooms = <proto.casino.Iroom[]>JSON.parse(pdataStr);

        this.win = win;
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initHandler(): void {
        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");
        this.lm = lm;
        lm.setGameMsgHandler(proto.casino.eMSG_TYPE.MSG_TABLE_JOIN_ACK, this.onJoinTableAck, this);
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
        juniorBtn.onClick(() => { this.onJoinRoomCliclk(0); }, this); //初级场
        this.setJoyBtnInfo(juniorBtn, this.rooms[0]);

        const middleBtn = this.view.getChild("middle").asCom;
        middleBtn.onClick(() => { this.onJoinRoomCliclk(1); }, this); //中级场
        this.setJoyBtnInfo(middleBtn, this.rooms[1]);

        const seniorBtn = this.view.getChild("senior").asCom;
        seniorBtn.onClick(() => { this.onJoinRoomCliclk(2); }, this); //高级场
        this.setJoyBtnInfo(seniorBtn, this.rooms[2]);

        const playQuicklyBtn = this.view.getChild("playQuicklyBtn");
        playQuicklyBtn.onClick(this.onQuicklyClick, this);
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
        view.showView(TabType.Dou);
    }

    private onAddFKBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.FK);
    }

    private onShareBtnClick(): void {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            Share.shareScreenshot("");
        }
    }

    private onShopBtnClick(): void {
        const view = this.addComponent(ShopView);
        view.showView(TabType.Dou);
    }

    private onLotteryViewBtnClick(): void {
        this.addComponent(LotteryView);
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

            this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
        } else {
            // 提示用户没有豆了
            Dialog.prompt(LocalStrings.findString("beanIsLess"));
        }
    }
    private onJoinRoomCliclk(index: number): void {
        Logger.debug("rooms : ", this.rooms[index]);
        const room = this.rooms[index];
        const req = {
            casino_id: room.casino_id,
            room_id: room.id,
            table_id: long.fromNumber(0),
            ready: true
        };

        const req2 = new proto.casino.packet_table_join_req(req);
        const buf = proto.casino.packet_table_join_req.encode(req2);

        if (this.lm !== undefined) {
            this.lm.msgCenter.sendGameMsg(buf, proto.casino.eMSG_TYPE.MSG_TABLE_JOIN_REQ);
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
    private onJoinTableAck(msg: proto.casino.ProxyMessage): void {
        const joinRoomAck = proto.casino.packet_table_join_ack.decode(msg.Data);
        if (joinRoomAck.ret !== 0) {
            Logger.debug("onJoinTableAck, join room failed:", joinRoomAck.ret);

            const err = GameError.getErrorString(joinRoomAck.ret);
            Dialog.prompt(err);

            return;
        }

        const playerID = DataStore.getString(KeyConstants.PLAYER_ID);
        const myUser = { userID: playerID };

        const joinRoomParams = {
            table: joinRoomAck.tdata,
            reconnect: joinRoomAck.reconnect
        };

        const params: GameModuleLaunchArgs = {
            jsonString: "",
            userInfo: myUser,
            joinRoomParams: joinRoomParams,
            createRoomParams: null,
            record: null,
            roomId: joinRoomAck.tdata.room_id
        };

        Logger.debug("GameModuleLaunchArgs:", params);

        const lm = <LobbyModuleInterface>this.getComponent("LobbyModule");

        this.win.hide();
        this.destroy();

        lm.switchToGame(params, "gameb");
    }
}
