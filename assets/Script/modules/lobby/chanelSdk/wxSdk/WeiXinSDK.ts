import { Logger } from "../../lcore/LCoreExports";

/**
 * 微信sdk
 */
export namespace WeiXinSDK {

    const mDataMap: { [key: string]: string | object } = {};

    export const login = (cb: Function): void => {
        wx.login({
            success: res => {
                const code = res.code;
                if (code !== '' && code !== null && code !== undefined) {
                    const wxCode: string = 'wechatLCode';
                    mDataMap[wxCode] = res.code;
                    const xxCb: getUserInfoOpts = {
                        withCredentials: true,

                        success: (userRes: getUserInfoRes) => {
                            const wxUserInfoStr: string = 'wxUserInfo';
                            mDataMap[wxUserInfoStr] = userRes;
                            cb(true);
                        },

                        fail: (err: Error) => {
                            Logger.error("wx getUserInfo err:", err);
                            cb(false);
                        }
                    };

                    wx.getUserInfo(xxCb);
                } else {
                    cb(false);
                }
            },
            fail: res => {
                Logger.error("wx login error", res);
                cb(false);
            }
        });
    };

    /**
     * 说明：由于微信分享api的调整，目前没法得到是否真正分享出去了
     * 因此现在所谓的分享成功与否都是根据时间差来判断的
     * 分享回来的时间差大于某个值（目前是2秒）则分享成功，小于某个值则分享失败
     *
     * 记录从微信分享界面回到游戏时间，判断分享是否成功
     */
    const gameReShowCallBack = (successCb: Function, failCb: Function, pullShareTime: number) => {
        Logger.debug('come back from share');
        if (pullShareTime !== 0) {
            const timeDValue = (Date.now() - pullShareTime) / 1000;

            if (timeDValue > 2) {
                if (successCb !== null) {
                    successCb();
                }
            } else {
                if (failCb !== null) {
                    failCb();
                }
            }
        }
    };

    export const getLaunchOption = (): string2stringMap => {
        const launchOption = wx.getLaunchOptionsSync();
        Object.keys(launchOption.query).forEach((value: string) => {
            Logger.debug("launchOption.query", value, launchOption.query[value]);
        });

        return launchOption.query;
    };

    const wxOnShow = (successCb: Function, failCb: Function, pullShareTime: number = 0) => {
        wx.onShow((res: showRes) => {
            gameReShowCallBack(successCb, failCb, pullShareTime);
        });
    };

    export const shareWeChat = (
        successCb: Function = null,
        failCb: Function = null,
        shareTitle: string = null,
        shareMedia: string = null,
        customParam: string): void => {

        Logger.debug('shareInfo', shareTitle, shareMedia);

        if (shareTitle === null || shareMedia == null) {
            if (failCb !== null) {
                failCb();
            }

            return;
        }
        wxOnShow(successCb, failCb, Date.now());

        wx.shareAppMessage({
            title: `${shareTitle}`,
            imageUrl: `${shareMedia}`,
            query: customParam
        });
    };

    export const getWxDataMap = (): { [key: string]: string | object } => {
        return mDataMap;
    };

}
