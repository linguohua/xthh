import { DFRuleView, ZJMJRuleView } from "../lobby/ruleviews/RuleViewsExports";

/**
 * 房间规则界面
 */
export class RoomRuleView extends cc.Component {
    public readonly forReview: boolean = true;
    public itemsJSON: { [key: string]: boolean | number };

    private view: fgui.GComponent;

    private eventTarget: cc.EventTarget;

    public updateView(roomConfigStr: string): void {
        //
        const roomConfigJSON = <{ [key: string]: boolean | number }>JSON.parse(roomConfigStr);
        //Logger.debug("roomConfigJSON = ", roomConfigJSON);
        this.itemsJSON = roomConfigJSON;

        const roomType = <number>roomConfigJSON[`roomType`];

        let ruleView;

        switch (roomType) {
            case 21:
                ruleView = new ZJMJRuleView();
                break;
            case 1:
                ruleView = new DFRuleView();
                break;

            default:

        }

        ruleView.bindView(this);

        // 加个控件，不能点击
        const spaceView = fgui.UIPackage.createObject("dafeng", "spaceBtn").asCom;
        const mountpoint = this.view.getChild("mount");
        spaceView.setPosition(mountpoint.x, mountpoint.y);
        this.view.addChild(spaceView);

        if (this.view !== null) {
            // this.room = room;
            fgui.GRoot.inst.showPopup(this.view);
            this.view.setPosition(0, 0);
        }

    }

    public updatePrice(price: number): void {
        // don't need to update price
    }

    public getView(): fgui.GComponent {
        return this.view;
    }

    protected onLoad(): void {

        this.eventTarget = new cc.EventTarget();

        const view = fgui.UIPackage.createObject("dafeng", "room_rule_view").asCom;
        this.view = view;

        this.initView();
    }

    protected onDestroy(): void {
        this.eventTarget.emit("destroy");
        this.view.dispose();
    }

    private onCloseClick(): void {
        this.destroy();

    }

    private initView(): void {
        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseClick, this);
        closeBtn.onClick(this.onCloseClick, this);
        const backBtn = this.view.getChild("back");
        if (backBtn !== null) {
            backBtn.onClick(this.onCloseClick, this);
        }
    }

}
