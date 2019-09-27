import { CommonFunction, LobbyModuleInterface, SoundMgr } from "../../lcore/LCoreExports";
import { proto } from "../../protoHH/protoHH";
import { LocalStrings } from "../../strings/LocalStringsExports";
const { ccclass } = cc._decorator;

/**
 * 抽奖规则页面
 */
@ccclass
export class LotteryRuleView extends cc.Component {
    private view: fgui.GComponent;
    private win: fgui.Window;
    private lm: LobbyModuleInterface;

    public show(lm: LobbyModuleInterface, turnTable: proto.casino.Ienergy_turnable): void {
        this.lm = lm;
        const loader = this.lm.loader;
        loader.fguiAddPackage("lobby/fui_lobby_lottery/lobby_lottery");
        const view = fgui.UIPackage.createObject("lobby_lottery", "lotteryRuleView").asCom;

        CommonFunction.setViewInCenter(view);
        const mask = view.getChild("mask");
        CommonFunction.setBgFullScreenSize(mask);

        this.view = view;

        const win = new fgui.Window();
        win.contentPane = view;
        win.modal = true;

        this.win = win;

        this.initView(turnTable);
        this.win.show();
    }

    protected onLoad(): void {
        //
    }

    protected onDestroy(): void {
        this.win.hide();
        this.win.dispose();

    }

    private initView(turnTable: proto.casino.Ienergy_turnable): void {

        const closeBtn = this.view.getChild("closeBtn");
        closeBtn.onClick(this.onCloseBtnClick, this);

        const text4 = this.view.getChild("text4");
        const text5 = this.view.getChild("text5");
        const text6 = this.view.getChild("text6");

        const winnerGain = turnTable.winner_gain;
        const loserGain = turnTable.loser_gain;
        const draw = turnTable.draw;

        text4.text = LocalStrings.findString("winnerGain", `${winnerGain}`);
        text5.text = LocalStrings.findString("loserGain", `${loserGain}`);
        text6.text = LocalStrings.findString("draw", `${draw}`);

    }
    private onCloseBtnClick(): void {
        SoundMgr.playEffectAudio(`gameb/sound_touch`);
        this.destroy();
    }

}
