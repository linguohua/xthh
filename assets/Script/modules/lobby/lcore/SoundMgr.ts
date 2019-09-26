import { Logger } from "./Logger";

/**
 * 音效管理
 */
export namespace SoundMgr {

    const audioClips: { [key: string]: cc.AudioClip } = {};
    /**
     * 播放音效判断是否
     * @param path 音频地址
     * @param loop 是否循环播放
     */
    export const playEffectAudio = (path: string, loop = false, callBack?: (num: number) => void): void => {
        cc.loader.loadRes(`sound/${path}`, cc.AudioClip, null, (err: Error, result: Object) => {
            if (err !== undefined && err !== null) {
                console.error(`loadRes Audio -------------: ${err}`);

                return;
            }
            // setEffectsVolume在微信上有问题，待以后cocos版本更新看下在改
            if (cc.audioEngine.getEffectsVolume() > 0) {

                const num = cc.audioEngine.playEffect(<cc.AudioClip>result, loop);
                if (callBack !== undefined) {
                    callBack(num);
                }
            }

        });
    };

    /**
     * 播放背景音乐
     * @param path 音频地址
     * @param loop 是否循环播放
     */
    export const playMusicAudio = (path: string, loop = false, callBack?: (num: number) => void): void => {
        const pathName = `sound/${path}`;
        let audioClip = audioClips[pathName];

        if (audioClip !== undefined && audioClip !== null) {
            const num = cc.audioEngine.playMusic(audioClip, loop);
            if (callBack !== undefined) {
                callBack(num);
            }
        } else {
            cc.loader.loadRes(`sound/${path}`, cc.AudioClip, null, (err: Error, result: Object) => {
                if (err !== undefined && err !== null) {
                    console.error(`loadRes Music -------------: ${err}`);

                    return;
                }
                audioClip = <cc.AudioClip>result;
                audioClips[pathName] = audioClip;

                const num = cc.audioEngine.playMusic(audioClip, loop);
                if (callBack !== undefined) {
                    callBack(num);
                }
            });
        }

    };

    /**
     * 暂停音乐
     */
    export const stopMusic = (): void => {
        Logger.debug("stopMusic--------------- ");
        cc.audioEngine.stopMusic();
        cc.audioEngine.setMusicVolume(0);

    };

    /**
     * 恢复音乐
     */
    export const replayMusic = (): void => {
        // 如果不是程序主动暂停的音乐，如后台切换到任务菜单，需要先暂停音乐，再恢复，否则有些手机从任务菜单回来，不会播放音乐
        Logger.debug("replayMusic--------------- ");
        cc.audioEngine.setMusicVolume(1);
        playMusicAudio("gameb/music_hall", true);

    };

    /**
     * 禁用声效
     */
    export const disableEffects = (): void => {
        Logger.debug("disableEffects--------------- ");
        fgui.GRoot.inst.volumeScale = 0;
        cc.audioEngine.setEffectsVolume(0);
        cc.audioEngine.stopAllEffects();
    };

    /**
     * 启用声效
     */
    export const enableEffects = (): void => {
        Logger.debug("enableEffects--------------- ");
        fgui.GRoot.inst.volumeScale = 1;
        cc.audioEngine.setEffectsVolume(1);
    };

    /**
     * 暂停音频
     */
    export const pauseMusic = (): void => {
        //cc.audioEngine.setMusicVolume(0);
        Logger.debug("pauseMusic--------------- ");
        cc.audioEngine.pauseMusic();
    };

    /**
     * 恢复音频
     */
    export const resumeMusic = (): void => {
        // cc.audioEngine.setMusicVolume(1);
        Logger.debug("resumeMusic--------------- ");
        cc.audioEngine.resumeMusic();
    };

    /**
     * 初始化音量
     */
    export const initSound = (musicVolume: number, effectsVolume: number): void => {

        cc.audioEngine.setMusicVolume(musicVolume);
        cc.audioEngine.setEffectsVolume(effectsVolume);
        playMusicAudio("gameb/music_hall", true);

    };
}
