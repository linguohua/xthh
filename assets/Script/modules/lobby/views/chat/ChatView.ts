import { DataStore, Dialog, GResLoader, HTTP, LEnv, LobbyModuleInterface, Logger } from "../../lcore/LCoreExports";
import { proto } from "../../proto/protoLobby";
// tslint:disable-next-line:no-require-imports
import bytebuffer = require("../../protobufjs/bytebuffer");

const phraseMap: { [key: number]: string } = {
    [1]: "不好意思 刚才有点小事情",
    [2]: "冲过围墙就是银行",
    [3]: "大姑爷爷 小姨奶奶 大家好啊",
    [4]: "乖乖 这牌不丑呢",
    [5]: "宽的很尼 过能松额把我吃两口啊",
    [6]: "没得命了 打了错喽",
    [7]: "朋友 你高手啊",
    [8]: "朋友 你个能弄额扫点子啊",
    [9]: "上碰下自摸 一点不瞎掐",
    [10]: "头一坑 就往前冲",
    [11]: "瞎打啊 你把我心都打凉啦",
    [12]: "小时候胖不为胖 长大胖才叫胖呢",
    [13]: "辛辛苦苦几十年 一把回到解放前啊",
    [14]: "早打是个碰 安大是个冲",
    [15]: "做大梦 打什么来什么"
};

/**
 * 聊天信息帮助类
 */
export class ChatData {
    public fromUserID: string;
    public toUserID: string;
    public scope: number;
    public dataType: number;
    public data: ByteBuffer;
    public id: string;
    public msg: string;
    public buildinId: string;
    public constructor(chat: proto.lobby.MsgChat) {
        this.fromUserID = chat.from;
        this.toUserID = chat.to;
        this.id = chat.id;
        this.dataType = chat.dataType;
        this.scope = chat.scope;
        this.data = chat.data;
    }
}

interface MsgContent {
    msg: string;
    url: string;
    nickname: string;
    sex: string;
    index: number;
}
/**
 * 聊天界面
 */
export class ChatView extends cc.Component {
    private view: fgui.GComponent = null;
    private phraseBtn: fgui.GButton;
    private expressionBtn: fgui.GButton;
    private historyBtn: fgui.GButton;
    private phraseList: fgui.GList;
    private expressionList: fgui.GList;
    private historyList: fgui.GList;

    private chatText: fgui.GTextInput;
    private eventTarget: cc.EventTarget;

    private lobbyModule: LobbyModuleInterface;

    private onMessageFunc: Function;

    private userID: string;

    private msgCallBack: Function;
    private msgList: { [key: number]: ChatData };

    public show(loader: GResLoader, msgCallBack: Function): void {
        this.msgCallBack = msgCallBack;
        if (this.view === undefined || this.view === null) {
            loader.fguiAddPackage("lobby/fui_chat/lobby_chat");
            this.view = fgui.UIPackage.createObject("lobby_chat", "chat").asCom;

            this.initView();
            this.testLists();
            this.userID = DataStore.getString("userID", "");

            this.lobbyModule = <LobbyModuleInterface>this.node.getParent().getComponent("LobbyModule");
            if (this.lobbyModule !== null) {
                this.onMessageFunc = this.lobbyModule.eventTarget.on(`${proto.lobby.MessageCode.OPChat}`, this.onMessage, this);
            }
        }
        fgui.GRoot.inst.showPopup(this.view);

        const x = cc.winSize.width / 2 - (cc.winSize.height * 1136 / 640 / 2) + (1136 - 500);
        this.view.setPosition(x, 0);
        // const windowSize = cc.view.getVisibleSize();
        // this.view.setPosition(windowSize.width - 500, 0);
    }

    protected onMessage(data: ByteBuffer): void {
        this.addMsg(data);
    }

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
    }

    protected onDestroy(): void {
        if (this.lobbyModule !== null) {
            this.lobbyModule.eventTarget.off(`${proto.lobby.MessageCode.OPChat}`, this.onMessageFunc);
        }

        this.view.dispose();

    }

    private initView(): void {
        this.phraseBtn = this.view.getChild("phraseBtn").asButton;
        this.expressionBtn = this.view.getChild("expressionBtn").asButton;
        this.historyBtn = this.view.getChild("historyBtn").asButton;
        this.phraseBtn.onClick(this.onPhraseBtnClick, this);
        this.expressionBtn.onClick(this.onExpressionBtnClick, this);
        this.historyBtn.onClick(this.onHistoryBtnClick, this);
        // -- list
        this.phraseList = this.view.getChild("phraseList").asList;
        this.phraseList.on(fgui.Event.CLICK_ITEM, this.onPhraseListItemClick, this);
        // this.phraseList.onClickItem(this.onPhraseListItemClick, this);
        this.phraseList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderPhraseListItem(index, item);
        };

        this.phraseList.setVirtual();

        this.expressionList = this.view.getChild("expressionList").asList;

        this.historyList = this.view.getChild("historyList").asList;
        this.historyList.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderHistoryListItem(index, item);
        };

        this.historyList.itemProvider = (index: number) => {
            return this.getHistoryListItemResource(index);
        };

        this.historyList.setVirtual();

        this.chatText = this.view.getChild("chatText").asTextInput;
        const sendBtn = this.view.getChild("sendBtn");
        sendBtn.onClick(this.onSendBtnClick, this);
    }

    private onPhraseBtnClick(): void {
        this.changeList(0);
        this.phraseBtn.selected = true;
    }

    private onExpressionBtnClick(): void {
        this.changeList(1);
        this.expressionBtn.selected = true;
    }

    private onHistoryBtnClick(): void {
        this.changeList(2);
        this.historyBtn.selected = true;
    }

    private onSendBtnClick(): void {
        this.sendMsg(this.chatText.text, proto.lobby.ChatDataType.Text);
        this.chatText.text = "";
    }

    private onPhraseListItemClick(clickItem: fgui.GObject): void {
        this.changeList(2);
        this.historyBtn.selected = true;

        // const obj = clickItem.asCom;
        // const msg = obj.getChild("n3").text;
        this.sendMsg(clickItem.name, proto.lobby.ChatDataType.Buildin);

    }

    private getHistoryListItemResource(index: number): string {
        const msgChat = this.msgList[index + 1];
        if (msgChat.fromUserID === this.userID) {
            return "ui://lobby_chat/chat_history_me_item";
        } else {
            return "ui://lobby_chat/chat_history_other_item";
        }
    }

    private changeList(myType: number): void {
        this.phraseBtn.selected = false;
        this.expressionBtn.selected = false;
        this.historyBtn.selected = false;

        this.phraseList.visible = false;
        this.expressionList.visible = false;
        this.historyList.visible = false;

        if (myType === 0) {
            this.phraseList.visible = true;
        } else if (myType === 1) {
            this.expressionList.visible = true;
        } else if (myType === 2) {
            this.historyList.visible = true;
        }
    }

    private sendMsg(msg: string, dataType: proto.lobby.ChatDataType): void {
        const tk = DataStore.getString("token", "");
        const nickName = DataStore.getString("nickName", "");
        const url = `${LEnv.rootURL}${LEnv.chat}?tk=${tk}`;
        const data = {
            msg: msg,
            url: "",
            nickname: nickName,
            sex: "",
            index: 0
        };

        const jsonString = JSON.stringify(data);

        // const enc = new TextEncoder();
        // const buf = enc.encode(jsonString);

        const chat = new proto.lobby.MsgChat();
        chat.from = this.userID;
        chat.scope = proto.lobby.ChatScopeType.InRoom;
        chat.dataType = dataType;
        chat.data = bytebuffer.fromUTF8(jsonString);
        // chat.data = <ByteBuffer>buf;

        const body = proto.lobby.MsgChat.encode(chat).toArrayBuffer();

        HTTP.hPost(
            this.eventTarget,
            url,
            (xhr: XMLHttpRequest, err: string) => {
                let errMsg = null;
                if (err !== null) {
                    errMsg = `创建房间错误，错误码:${err}`;
                } else {
                    errMsg = HTTP.hError(xhr);
                    if (errMsg === null) {
                        Logger.debug("send msg ok");
                    }
                }

                if (errMsg !== null) {
                    Logger.debug("NewRoomView.createRoom failed:", errMsg);
                    // 显示错误对话框
                    Dialog.showDialog(errMsg);
                }
            },
            "arraybuffer",
            body);
    }

    private testLists(): void {
        this.updatePhraseList();
        this.updateExpressionList();
        this.updateHistoryList();
    }

    // 更新表情列表
    private updateExpressionList(): void {
        for (let i = 0; i < 16; i++) {
            const obj = fgui.UIPackage.createObject("lobby_chat", "chat_expression_item").asCom;
            this.expressionList.addChild(obj);
        }
    }

    // 更新短语列表
    private updatePhraseList(): void {
        this.phraseList.numItems = Object.keys(phraseMap).length;
    }

    // 更新历史列表
    private updateHistoryList(): void {
        // TODO: 这里需要初始化列表
        this.msgList = {};
    }

    private renderPhraseListItem(index: number, item: fgui.GObject): void {
        const obj = item.asCom;
        const msg = phraseMap[index + 1];
        const t = obj.getChild("n3");
        t.text = msg;
        item.name = (index + 1).toString();
    }

    private renderHistoryListItem(index: number, item: fgui.GObject): void {
        const chatMsg = this.msgList[index + 1];
        // const contentString = chatMsg.data.toUTF8();
        // const msgContent = <MsgContent>JSON.parse(contentString);

        const obj = item.asCom;
        const t = obj.getChild("text");
        t.text = chatMsg.msg;
    }

    private addMsg(msg: ByteBuffer): void {
        const chatMsg = proto.lobby.MsgChat.decode(msg);
        const chatData = new ChatData(chatMsg);

        const contentString = chatMsg.data.toUTF8();
        const msgContent = <MsgContent>JSON.parse(contentString);
        chatData.msg = msgContent.msg;
        if (chatMsg.dataType === proto.lobby.ChatDataType.Buildin) {
            chatData.msg = phraseMap[+msgContent.msg];
            chatData.buildinId = msgContent.msg;
        }

        const length = Object.keys(this.msgList).length + 1;
        this.msgList[length] = chatData;
        this.historyList.numItems = length;
        this.historyList.scrollPane.scrollBottom();

        if (this.msgCallBack !== undefined && this.msgCallBack !== null) {
            this.msgCallBack(chatData);
        }
        // this.roomInterface.showMsg(chatMsg.from);
    }
}
