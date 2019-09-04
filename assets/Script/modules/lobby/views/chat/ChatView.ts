import { RoomHost } from "../../interface/LInterfaceExports";
import {
    CommonFunction, DataStore, GResLoader, KeyConstants, Logger
} from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";

const phraseMap: { [key: number]: string } = {
    [1]: "快滴卡，瞎打。",
    [2]: "哎呀，速度滴卡！",
    [3]: "阔睡都打哈来打，能不能快卡啊？",
    [4]: "你歹滴捉虫吧，比生伢都慢些！",
    [5]: "你歹滴磨洋工吧！",
    [6]: "等你项目得，十项九放铳！",
    [7]: "应字莫字，来这牌吧。",
    [8]: "照业哦！",
    [9]: "讨死人闲，厌气死打，打么家来么家。",
    [10]: "冒名堂，抢这来吧。",
    [11]: "完哒、完哒、拐打、拐打、打错哒...",
    [12]: "今日手气不好，换个手摸哈。",
    [13]: "见字胡都冒有转过来，被你成了。",
    [14]: "先打孤，后打模！",
    [15]: "打大不打小！",
    [16]: "打不走留一手！",
    [17]: "人家黄昏家不败，飘哦！",
    [18]: "这牌真是耍净！",
    [19]: "我惹都不惹你，牌都听打哦！",
    [20]: "上碰下自摸哦！",
    [21]: "今日，多输卡我们？",
    [22]: "都赢打，落只有桌子输钱打！",
    [23]: "哎呀，饭都没有七就来打，好积极啊！",
    [24]: "拐子，我来啦，尬事啦？"
};

/**
 * 聊天界面
 */
export class ChatView extends cc.Component {
    private view: fgui.GComponent = null;

    private win: fgui.Window;

    private myID: string;

    private roomHost: RoomHost;
    private tableID: Long;

    public show(loader: GResLoader, roomHost: RoomHost, tableID: Long): void {
        this.roomHost = roomHost;
        this.tableID = tableID;

        loader.fguiAddPackage("lobby/fui_chat/lobby_chat");
        const view = fgui.UIPackage.createObject("lobby_chat", "chatView").asCom;

        CommonFunction.setViewInCenter(view);

        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.myID = DataStore.getString(KeyConstants.PLAYER_ID, "");

        this.view = view;
        this.initView();
        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

        const viewPos = this.view.node.position;
        this.view.node.setPosition(viewPos.x + 500, viewPos.y);
        this.win.show();

        const pos1 = new cc.Vec2(viewPos.x - 50, viewPos.y);
        const action = cc.moveTo(0.1, pos1);
        const action1 = cc.moveTo(0.1, viewPos);

        const actionQueue = cc.sequence(action, action1);
        this.view.node.runAction(actionQueue);

    }

    protected onDestroy(): void {
        this.view.dispose();
        this.win.dispose();

    }

    private initView(): void {

        const mask = this.view.getChild("mask");
        mask.onClick(this.onMaskBtnClick, this);

        const emotion1 = this.view.getChild("wq");
        emotion1.onClick(this.onEmotion1Click, this);
        const emotion2 = this.view.getChild("dy");
        emotion2.onClick(this.onEmotion2Click, this);
        const emotion3 = this.view.getChild("dzh");
        emotion3.onClick(this.onEmotion3Click, this);
        const emotion4 = this.view.getChild("cc");
        emotion4.onClick(this.onEmotion4Click, this);

        const list = this.view.getChild("list").asList;
        list.on(fgui.Event.CLICK_ITEM, this.onListItemClick, this);
        list.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderListItem(index, item);
        };

        list.numItems = Object.keys(phraseMap).length;
    }

    private onMaskBtnClick(): void {

        const viewPos = this.view.node.position;
        const pos1 = new cc.Vec2(viewPos.x - 50, viewPos.y);
        const pos2 = new cc.Vec2(viewPos.x + 500, viewPos.y);

        const action = cc.moveTo(0.1, pos1);
        const action1 = cc.moveTo(0.1, pos2);

        const daleyDispose = cc.callFunc(() => {
            this.destroy();
        });
        const actionQueue = cc.sequence(action, action1, daleyDispose);

        this.view.node.runAction(actionQueue);
    }

    private onEmotion1Click(): void {
        Logger.debug("onEmotion1Click");
    }

    private onEmotion2Click(): void {
        Logger.debug("onEmotion2Click");
    }

    private onEmotion3Click(): void {
        Logger.debug("onEmotion3Click");
    }

    private onEmotion4Click(): void {
        Logger.debug("onEmotion4Click");
    }
    private onListItemClick(clickItem: fgui.GObject): void {
        const obj = clickItem.asCom;
        const msg = obj.getChild("n11").text;
        Logger.debug(`click index: ${clickItem.name}, msg:${msg}`);
        this.sendMsg(msg, 1);
    }

    private renderListItem(index: number, item: fgui.GObject): void {
        const obj = item.asCom;
        const msg = phraseMap[index + 1];
        const t = obj.getChild("n11");
        t.text = msg;
        item.name = (index + 1).toString();
    }

    private sendMsg(text: string, emoIndex: number): void {
        const req = new proto.casino.packet_table_chat();
        req.player_id = +this.myID;
        req.chat_id = emoIndex;
        req.text = text;
        req.table_id = this.tableID;

        const buf = proto.casino.packet_table_chat.encode(req);
        this.roomHost.sendBinary(buf, proto.casino.eMSG_TYPE.MSG_TABLE_CHAT);

    }
}
