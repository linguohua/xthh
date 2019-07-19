import { DataStore, Dialog, GResLoader, Logger } from "../../lcore/LCoreExports";

export interface RoomInterface {
    switchBg(agree: number): void;
    onDissolveClicked(): void;

    onExitButtonClicked(): void;

    enableVoiceBtn(isShow: boolean): void;
}
/**
 * 设置界面
 */
export class RoomSettingView extends cc.Component {

    private view: fgui.GComponent;
    private eventTarget: cc.EventTarget;
    private room: RoomInterface;

    private musicBtn: fgui.GButton;
    private effectSoundBtn: fgui.GButton;
    private gpsBtn: fgui.GButton;
    private voiceBtn: fgui.GButton;
    // private musicSlider: fgui.GSlider;
    // private soundSlider: fgui.GSlider;

    public showView(room: RoomInterface, loader: GResLoader, isOwner: boolean, position: cc.Vec2): void {
        this.room = room;
        if (this.view === undefined || this.view === null) {
            // this.room = room;
            loader.fguiAddPackage("lobby/fui_room_other_view/room_other_view");
            this.view = fgui.UIPackage.createObject("room_other_view", "setting").asCom;
            this.initView(isOwner);
        }
        fgui.GRoot.inst.showPopup(this.view);

        this.view.setPosition(position.x, position.y - this.view.height);

    }

    protected onLoad(): void {
        this.eventTarget = new cc.EventTarget();
    }

    protected onDestroy(): void {
        //this.saveData();
        this.eventTarget.emit("destroy");
        this.view.dispose();
    }

    private initView(isOwner: boolean): void {

        // const bg = this.view.getChild("bg");
        // bg.onClick(this.onCloseClick, this);

        const btnExit = this.view.getChild("btnExit");
        btnExit.onClick(this.onLeaveRoomClick, this);

        const disbandBtn = this.view.getChild("btnDisband");
        disbandBtn.onClick(this.onDisbandBtnClick, this);

        this.gpsBtn = this.view.getChild("btnGPS").asButton;
        this.gpsBtn.onClick(this.onGpsBtnClick, this);

        this.voiceBtn = this.view.getChild("btnVoice").asButton;
        this.voiceBtn.onClick(this.onVoiceBtnClick, this);

        this.effectSoundBtn = this.view.getChild("btnYX").asButton;
        this.effectSoundBtn.onClick(this.onEffectSoundBtnClick, this);

        this.musicBtn = this.view.getChild("btnYY").asButton;
        this.musicBtn.onClick(this.onMusicSoundBtnClick, this);
        // this.musicBtnText = musicBtn.getChild("text");

        const gps = DataStore.getString("effectsVolume", "0");
        const voice = DataStore.getString("effectsVolume", "0");
        const effectsVolume = DataStore.getString("effectsVolume", "0");
        const musicVolume = DataStore.getString("musicVolume", "0");
        if (+gps > 0) {
            this.gpsBtn.selected = true;
        } else {
            this.gpsBtn.selected = false;
        }

        if (+voice > 0) {
            this.voiceBtn.selected = true;
        } else {
            this.voiceBtn.selected = false;
        }

        if (+effectsVolume > 0) {
            this.effectSoundBtn.selected = true;
        } else {
            this.effectSoundBtn.selected = false;
        }

        if (+musicVolume > 0) {
            this.musicBtn.selected = true;
        } else {
            this.musicBtn.selected = false;
        }
    }
    // private saveData(): void {
    //     DataStore.setItem("soundVolume", this.soundSlider.value.toString());
    //     DataStore.setItem("musicVolume", this.musicSlider.value.toString());
    // }
    // private onMusicSliderChanged(slider: fgui.GSlider): void {
    //     // Logger.debug("onMusicSliderChanged slider = ", slider.value
    //     cc.audioEngine.setMusicVolume(slider.value / 100);
    // }

    // private onSoundSliderChanged(slider: fgui.GSlider): void {
    //     // Logger.debug("onSoundSliderChanged slider = ", slider.value);
    //     cc.audioEngine.setEffectsVolume(slider.value / 100);
    // }

    private onGpsBtnClick(): void {
        if (this.gpsBtn.selected) {
            // TODO: 关闭GPS
        } else {
            // TODO: 打开GPS
        }
    }

    private onVoiceBtnClick(): void {
        this.room.enableVoiceBtn(this.voiceBtn.selected);
    }

    // 音效开关
    private onEffectSoundBtnClick(): void {
        const effectVolume = cc.audioEngine.getEffectsVolume();
        Logger.debug("onEffectSoundBtnClick,effectVolume:", effectVolume);
        if (this.effectSoundBtn.selected) {
            cc.audioEngine.setEffectsVolume(1);
            DataStore.setItem("effectsVolume", 1);
        } else {
            cc.audioEngine.setEffectsVolume(0);
            DataStore.setItem("effectsVolume", 0);
        }
    }

    // 音乐开关
    private onMusicSoundBtnClick(): void {
        const musicVolume = cc.audioEngine.getMusicVolume();
        Logger.debug("onMusicSoundBtnClick,musicVolume:", musicVolume);
        if (this.musicBtn.selected) {
            cc.audioEngine.setMusicVolume(1);
            DataStore.setItem("musicVolume", 1);
        } else {
            cc.audioEngine.setMusicVolume(0);
            DataStore.setItem("musicVolume", 0);
        }
    }

    private onLeaveRoomClick(): void {
        Logger.debug("onLeaveRoomClick");
        Dialog.prompt("牌局正在进行中...还是打完吧！");
    }

    private onDisbandBtnClick(): void {
        //
        Dialog.showDialog("是否解散房间？", () => {

            this.sendDisbandMsg();
            // tslint:disable-next-line:align
        }, () => {
            //
        });
    }

    private sendDisbandMsg(): void {
        //
        this.room.onDissolveClicked();
    }

}
