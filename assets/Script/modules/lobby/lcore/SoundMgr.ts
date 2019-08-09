import { Logger } from "./Logger";

/**
 * 音效管理
 */
export namespace SoundMgr {
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
            // const num = cc.audioEngine.playEffect(<cc.AudioClip>result, loop);
            // if (callBack !== undefined) {
            //     callBack(num);
            // }
        });
    };

    /**
     * 停止特效 音效
     * @param num 音效id
     */
    export const stopEffect = (num: number): void => {
        cc.audioEngine.stopEffect(num);
    };

    /**
     * 播放背景音乐
     * @param path 音频地址
     * @param loop 是否循环播放
     */
    export const playMusicAudio = (path: string, loop = false, callBack?: (num: number) => void): void => {
        cc.loader.loadRes(`sound/${path}`, cc.AudioClip, null, (err: Error, result: Object) => {
            if (err !== undefined && err !== null) {
                console.error(`loadRes Music -------------: ${err}`);

                return;
            }
            const num = cc.audioEngine.playMusic(<cc.AudioClip>result, loop);
            if (callBack !== undefined) {
                callBack(num);
            }
        });
    };

    /**
     * 停止特效 音效
     * @param num 音效id
     */
    export const stopMusic = (): void => {
        cc.audioEngine.stopMusic();
    };

    /**
     * 暂停音乐
     */
    export const pauseMusic = (): void => {
        cc.audioEngine.pauseMusic();
    };

    /**
     * 恢复音乐
     */
    export const resumeMusic = (): void => {
        cc.audioEngine.resumeMusic();
    };
}
