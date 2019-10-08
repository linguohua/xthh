import { CommonFunction } from "./CommonFunction";
import { GResLoader } from "./LDataType";
import { Logger } from "./Logger";
import { SoundMgr } from "./SoundMgr";

/**
 * 一些通用的对话框
 */
export class Dialog {
    public static inst: Dialog;

    public loader: GResLoader;

    public dlgView: fgui.GComponent;
    public dlgWin: fgui.Window;

    public reConnectDlgView: fgui.GComponent;

    public reConnectDlgWin: fgui.Window;

    public waitWin: fgui.Window;

    public progressBarWin: fgui.Window;
    public progressBarView: fgui.GComponent;

    public packageLoaded: boolean = false;

    public prompts: fgui.GComponent[] = [];

    private constructor(loader: GResLoader) {
        this.loader = loader;
    }

    public static initDialogs(loader: GResLoader): void {
        if (this.inst !== undefined) {
            throw Error("dialogs has been initialized");
        }

        this.inst = new Dialog(loader);
    }

    public static prompt = (msg: string): void => {
        SoundMgr.playEffectAudio(`gameb/sound_error`);
        if (!Dialog.inst.packageLoaded) {
            Dialog.inst.loader.fguiAddPackage("lobby/fui_dialog/lobby_dialog");
            Dialog.inst.packageLoaded = true;
        }

        const p = fgui.UIPackage.createObject("lobby_dialog", "prompt").asCom;

        //CommonFunction.setViewInCenter(p);
        const label = p.getChild("text");
        label.text = msg;
        p.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        const trans = p.getTransition("t1");
        trans.play(() => {
            p.dispose();
            const index = Dialog.inst.prompts.indexOf(p);
            Dialog.inst.prompts.splice(index, 1);
        });

        Dialog.inst.prompts.push(p);
        fgui.GRoot.inst.addChild(p);
    }

    public static hidePrompt = (): void => {
        if (Dialog.inst.prompts.length > 0) {
            for (const p of Dialog.inst.prompts) {
                p.dispose();
            }
        }
    }

    public static showDialog = (msg: string, yesCb: Function = null, noCB: Function = null, close: boolean = false): void => {
        if (Dialog.inst.dlgView === undefined || Dialog.inst.dlgView.node === null) {
            Logger.debug("showDialog view is null, create new");
            if (!Dialog.inst.packageLoaded) {
                Dialog.inst.loader.fguiAddPackage("lobby/fui_dialog/lobby_dialog");
                Dialog.inst.packageLoaded = true;
            }

            const view = fgui.UIPackage.createObject("lobby_dialog", "dialog").asCom;
            CommonFunction.setViewInCenter(view);

            const mask = view.getChild("mask");
            CommonFunction.setBgFullScreenSize(mask);

            const win = new fgui.Window();
            win.modal = true;
            win.contentPane = view;
            Dialog.inst.dlgView = view;
            Dialog.inst.dlgWin = win;
        }

        const label = Dialog.inst.dlgView.getChild("text");
        label.text = msg;

        const yesBtn = Dialog.inst.dlgView.getChild("ok_btn");
        yesBtn.offClick(undefined, undefined);

        const closeBtn = Dialog.inst.dlgView.getChild("closeBtn");
        closeBtn.offClick(undefined, undefined);
        if (close) {
            closeBtn.visible = true;
            closeBtn.onClick(
                () => {
                    SoundMgr.buttonTouch();
                    Dialog.inst.dlgWin.hide();
                },
                undefined);
        } else {
            closeBtn.visible = false;
        }

        let yesCb2 = yesCb;
        if (yesCb === null && noCB === null) {
            yesCb2 = () => {
                //
            };
        }

        if (yesCb2 !== null) {
            Logger.debug("showDialog, callBackOK valid");
            yesBtn.visible = true;
            yesBtn.x = 423;
            yesBtn.onClick(
                () => {
                    SoundMgr.buttonTouch();
                    Dialog.inst.dlgWin.hide();
                    yesCb2();
                },
                undefined);
        } else {
            yesBtn.visible = false;
        }

        const noBtn = Dialog.inst.dlgView.getChild("cancel_btn");
        noBtn.offClick(undefined, undefined);

        if (noCB !== null) {
            Logger.debug("showDialog, callBackOK valid");
            noBtn.visible = true;
            noBtn.onClick(
                () => {
                    SoundMgr.buttonTouch();
                    Dialog.inst.dlgWin.hide();
                    noCB();
                },
                undefined);
        } else {
            noBtn.visible = false;
            yesBtn.x = 568;
        }

        Dialog.inst.dlgWin.show();
    }

    public static hideDialog(): void {
        if (Dialog.inst.dlgView === undefined) {
            return;
        }

        Dialog.inst.dlgWin.hide();
    }

    public static async coShowDialog(msg: string, yes?: boolean, no?: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let myYesCB;
            let myNoCB;

            if (yes) {
                myYesCB = () => {
                    //
                    resolve(true);
                };
            }

            if (no) {
                myNoCB = () => {
                    //
                    resolve(false);
                };
            }

            Dialog.showDialog(msg, myYesCB, myNoCB);
        });
    }

    public static isShowWaiting(): boolean {

        if (Dialog.inst.waitWin === undefined) {
            return false;
        }

        return Dialog.inst.waitWin.isShowing;
    }

    public static showWaiting(): void {
        if (Dialog.inst.waitWin === undefined) {
            Dialog.inst.loader.fguiAddPackage("lobby/fui_lobby_progress_bar/lobby_progress_bar");

            const view = fgui.UIPackage.createObject("lobby_progress_bar", "rolling").asCom;
            const win = new fgui.Window();
            win.modal = true;
            win.contentPane = view;

            win.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            Dialog.inst.waitWin = win;
        }

        Dialog.inst.waitWin.show();
    }

    public static hideWaiting(): void {
        if (Dialog.inst.waitWin !== undefined) {
            Dialog.inst.waitWin.hide();
        }
    }

    public static showProgress(): void {
        if (Dialog.inst.progressBarWin === undefined) {
            Dialog.inst.loader.fguiAddPackage("lobby/fui_lobby_progress_bar/lobby_progress_bar");

            const view = fgui.UIPackage.createObject("lobby_progress_bar", "progressBar").asCom;
            CommonFunction.setViewInCenter(view);
            const win = new fgui.Window();
            win.modal = true;
            win.contentPane = view;

            // win.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

            Dialog.inst.progressBarWin = win;
            Dialog.inst.progressBarView = view;

            const progressBar = Dialog.inst.progressBarView.getChild("n0").asProgress;
            progressBar.value = 0;
        }
        Dialog.inst.progressBarWin.show();
    }

    public static updateProgress(progress: number): void {
        if (Dialog.inst.progressBarWin !== undefined) {
            const progressBar = Dialog.inst.progressBarView.getChild("n0").asProgress;
            progressBar.value = progress * 100;
        }
    }

    public static hideProgress(): void {
        if (Dialog.inst.progressBarWin !== undefined) {
            Dialog.inst.progressBarWin.hide();
        }
    }

    public static showReconnectDialog(): void {
        if (Dialog.inst.reConnectDlgView === undefined || Dialog.inst.reConnectDlgView.node === null) {
            Logger.debug("showDialog view is null, create new");
            if (!Dialog.inst.packageLoaded) {
                Dialog.inst.loader.fguiAddPackage("lobby/fui_dialog/lobby_dialog");
                Dialog.inst.packageLoaded = true;
            }

            const view = fgui.UIPackage.createObject("lobby_dialog", "reconnectDialog").asCom;
            CommonFunction.setViewInCenter(view);

            const mask = view.getChild("mask");
            CommonFunction.setBgFullScreenSize(mask);

            const win = new fgui.Window();
            win.modal = true;
            win.contentPane = view;
            Dialog.inst.reConnectDlgView = view;
            Dialog.inst.reConnectDlgWin = win;
        }

        const btnCtrl = Dialog.inst.reConnectDlgView.getController("retry");
        btnCtrl.selectedIndex = 0;

        Dialog.inst.reConnectDlgWin.show();

    }

    public static hideReconnectDialog(): void {
        if (Dialog.inst.reConnectDlgWin === undefined) {
            return;
        }

        Dialog.inst.reConnectDlgWin.hide();
    }
}
