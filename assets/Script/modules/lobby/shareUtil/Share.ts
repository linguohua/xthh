import { WeiXinSDK } from "../chanelSdk/wxSdk/WeiXinSDkExports";
import { DataStore, Dialog, HTTP, LEnv, Logger } from "../lcore/LCoreExports";
import { proto } from "../proto/protoLobby";

/**
 * 分享工具
 */
export namespace Share {

    /**
     * 分享类型
     */
    export enum ShareSrcType {
        GameShare = 1 // 游戏分享
    }

    /**
     * 分享的多媒体资源
     */
    export enum ShareMediaType {
        Image = 1,  // 静态图片
        Video,      // 小视频（暂不支持）
        Gif         // 动图（暂不支持）
    }

    /**
     * 分享目的地
     */
    export enum ShareDestType {
        Moments = 1,    // 朋友圈（暂不支持）
        Friend     // 好友
    }

    // //测试分享接口
    // Share.shareGame(
    //     this.eventTarget,
    //     Share.ShareSrcType.GameShare,
    //     Share.ShareMediaType.Image,
    //     Share.ShareDestType.Friend,
    //     'roomName=dali&roomId=123');

    export const shareGame = (
        target: cc.EventTarget,
        sence: ShareSrcType,
        media: ShareMediaType,
        shareType: ShareDestType,
        customParam?: string) => {

        const token = DataStore.getString("token", '');
        const wxShareInfoURL = `${LEnv.rootURL}${LEnv.wxShareInfo}?tk=${token}&sence=${sence}&mediaType=${media}&shareType=${shareType}`;

        Logger.trace("wxShareInfoURL:", wxShareInfoURL);

        HTTP.hGet(target, wxShareInfoURL, (xhr: XMLHttpRequest, err: string) => {
            let errMsg = null;
            if (err !== null) {
                errMsg = `获得分享信息错误，错误码:${err}`;
            } else {
                errMsg = HTTP.hError(xhr);
                if (errMsg === null) {
                    const data = <Uint8Array>xhr.response;
                    // proto 解码登录结果
                    const wxShareInfoReply = proto.lobby.MsgShareInfo.decode(data);
                    if (wxShareInfoReply.result === 0) {
                        Logger.debug("get wxShareInfo ok");

                        const cb1 = () => {
                            Logger.debug('share success');
                        };

                        const cb2 = () => {
                            Logger.debug('share fail');
                        };
                        WeiXinSDK.shareWeChat(cb1, cb2, wxShareInfoReply.text, wxShareInfoReply.multimedia, customParam);
                    } else {
                        // TODO: show error msg
                        Logger.debug("get wxShareInfo error, errCode:", wxShareInfoReply.result);
                    }
                }
            }

            if (errMsg !== null) {
                Logger.debug("get wxShareInfo failed:", errMsg);
                // 显示错误对话框
                Dialog.showDialog(errMsg, () => {
                    //
                });
            }
        });
    };
}
