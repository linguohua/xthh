import { Logger } from "./Logger";

/**
 * 音效管理
 */
export namespace SoundMgr {

    const audioClips: { [key: string]: cc.AudioClip } = {};

    const playCCEffect = (audioClip: cc.AudioClip, loop = false, callBack?: (num: number) => void): void => {
        // setEffectsVolume在微信上有问题，待以后cocos版本更新看下在改
        if (cc.audioEngine.getEffectsVolume() > 0) {
            const num = cc.audioEngine.playEffect(audioClip, loop);
            if (callBack !== undefined) {
                callBack(num);
            }
        }
    };

    const playCCMusic = (audioClip: cc.AudioClip, loop = false, callBack?: (num: number) => void): void => {
        const num = cc.audioEngine.playMusic(audioClip, loop);
        if (callBack !== undefined) {
            callBack(num);
        }
    };

    /**
     * 播放音效判断是否
     * @param path 音频地址
     * @param loop 是否循环播放
     */
    export const playEffectAudio = (path: string, loop = false, callBack?: (num: number) => void): void => {
        const pathName = `sound/${path}`;
        let audioClip = audioClips[pathName];

        if (audioClip !== undefined && audioClip !== null) {
            playCCEffect(audioClip, loop, callBack);
        } else {
            cc.loader.loadRes(`sound/${path}`, cc.AudioClip, null, (err: Error, result: Object) => {
                if (err !== undefined && err !== null) {
                    console.error(`loadRes Audio -------------: ${err}`);

                    return;
                }
                audioClip = <cc.AudioClip>result;
                audioClips[pathName] = audioClip;

                playCCEffect(audioClip, loop, callBack);

            });
        }

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
            playCCMusic(audioClip, loop, callBack);
        } else {
            cc.loader.loadRes(`sound/${path}`, cc.AudioClip, null, (err: Error, result: Object) => {
                if (err !== undefined && err !== null) {
                    console.error(`loadRes Music -------------: ${err}`);

                    return;
                }
                audioClip = <cc.AudioClip>result;
                audioClips[pathName] = audioClip;

                playCCMusic(audioClip, loop, callBack);
            });
        }

    };

    /**
     * 暂停音乐
     */
    export const stopMusic = (): void => {
        Logger.debug("stopMusic--------------- ");
        cc.audioEngine.stopMusic();
    };

    export const isMusicPlaying = (): boolean => {
        return cc.audioEngine.isMusicPlaying();
    };

    /**
     * 恢复音乐
     */
    export const playMusic = (): void => {
        // 如果不是程序主动暂停的音乐，如后台切换到任务菜单，需要先暂停音乐，再恢复，否则有些手机从任务菜单回来，不会播放音乐
        Logger.debug("replayMusic--------------- ");
        playMusicAudio("gameb/music_hall", true);

    };

    /**
     * 禁用声效
     */
    export const disableEffects = (): void => {
        Logger.debug("disableEffects--------------- ");
        cc.audioEngine.setEffectsVolume(0);
        cc.audioEngine.stopAllEffects();

    };

    /**
     * 启用声效
     */
    export const enableEffects = (): void => {
        Logger.debug("enableEffects--------------- ");
        cc.audioEngine.setEffectsVolume(1);
    };

    export const buttonTouch = (): void => {
        playEffectAudio("gameb/sound_touch");
    };

    export const tabSwitch = (): void => {
        playEffectAudio("gameb/sound_move");
    };

    /**
     * 初始化音量
     */
    export const initSound = (musicVolume: number, effectsVolume: number): void => {
        cc.audioEngine.setMusicVolume(1);
        cc.audioEngine.setEffectsVolume(effectsVolume);

        if (musicVolume > 0) {
            playMusic();
        }

        if (effectsVolume > 0) {
            enableEffects();
        } else {
            disableEffects();
        }

    };

}
