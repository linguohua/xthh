import { GameError } from "../errorCode/ErrorCodeExports";
import { Dialog, LobbyModuleInterface, Logger } from "../lcore/LCoreExports";
import { proto as protoHH } from "../protoHH/protoHH";

const { ccclass } = cc._decorator;
/**
 * 房卡记录界面
 */
@ccclass
export class FkRecordView {
    private view: fgui.GComponent;
    private lm: LobbyModuleInterface;

    private list: fgui.GList;

    private recordMsgs: protoHH.casino.Icasino_card[];
    //private recordMsgs: string[];

    public init(view: fgui.GComponent, lm: LobbyModuleInterface): void {
        this.view = view;
        this.lm = lm;
        this.initView();
        this.registerHandler();
    }

    public onTapBtnClick(): void {
        this.sendCardRecordReq();

    }

    private initView(): void {
        this.list = this.view.getChild("list").asList;

        this.list.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderRecordListItem(index, item);
        };
    }

    private registerHandler(): void {
        this.lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_CARD_ACK, this.onFkRecordLoad, this);
    }

    private sendCardRecordReq(): void {
        Logger.debug("sendCardRecordReq");
        const req = new protoHH.casino.packet_card_req();
        const buf = protoHH.casino.packet_card_req.encode(req);
        this.lm.sendGameMsg(buf, protoHH.casino.eMSG_TYPE.MSG_CARD_REQ);
    }

    private onFkRecordLoad(msg: protoHH.casino.ProxyMessage): void {
        const reply = protoHH.casino.packet_card_ack.decode(msg.Data);
        if (reply.ret !== 0) {
            Dialog.prompt(GameError.getErrorString(reply.ret));

            return;
        }

        Logger.debug("onFkRecordLoad, reply.cards:", reply.cards);
        this.recordMsgs = reply.cards;
        this.list.numItems = this.recordMsgs.length;
    }

    private renderRecordListItem(index: number, item: fgui.GObject): void {
        const msg = this.recordMsgs[index];
        const obj = item.asCom;

        const date = new Date(msg.create_time.toNumber() * 1000);
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
        const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
        const timeText = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${seconds}`;

        obj.getChild("date").text = timeText;
        obj.getChild("reason").text = `${msg.reason}`;
        obj.getChild("count").text = `${msg.amount}`;

    }

}
