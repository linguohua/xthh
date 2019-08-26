import { LobbyModuleInterface } from "../lcore/LCoreExports";
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

    //private recordMsgs: string[];

    public init(view: fgui.GComponent, lm: LobbyModuleInterface): void {
        this.view = view;
        this.lm = lm;
        this.initView();
        this.initHandler();
    }

    private initView(): void {
        this.list = this.view.getChild("list").asList;

        this.list.itemRenderer = (index: number, item: fgui.GObject) => {
            this.renderRecordListItem(index, item);
        };
    }

    private initHandler(): void {
        this.lm.setGameMsgHandler(protoHH.casino.eMSG_TYPE.MSG_UPDATE, this.onFkRecordLoad, this);
    }

    private onFkRecordLoad(): void {
        //
    }

    private renderRecordListItem(index: number, item: fgui.GObject): void {
        // const msg = this.recordMsgs[index];
        // const obj = item.asCom;

        // const date = new Date(msg.create_time.toNumber() * 1000);
        // const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        // const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        // const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        // const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
        // const timeText = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;

        // obj.getChild("date").text = timeText;
        // obj.getChild("reason").text = `${msg.table_tag}`;
        // obj.getChild("count").text = `${msg.round}`;

    }

}
