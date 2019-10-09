// tslint:disable-next-line:no-require-imports
import long = require("../protobufjs/long");
import { LocalStrings } from "../strings/LocalStringsExports";
import { DataStore, Dialog, HTTP, KeyConstants, LEnv, Logger } from "./LCoreExports";

/**
 * 公共函数类
 */
export namespace CommonFunction {

    /**
     * 设置头像, gender 0为男，1为女，对应南京原来的app
     */
    export const setHead = (node: fgui.GLoader, url: string, avatar: number = 0, gender: number = 0): void => {
        //"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er5prllVA37yiac4Vv8
        //ZAXwbg0Zicibn6ZjsgJ4ha0hmFBY8MUTRMnRTmSlvzPd8XJZzd0icuyGoiakj4A/132";
        let headImage = `ui://lobby_bg_package/grxx_xttx_${avatar + 4}`;
        if (gender === 1) {
            headImage = `ui://lobby_bg_package/grxx_xttx_${avatar}`;
        }
        //-
        if (url !== undefined && url !== null && url !== "" && url.indexOf("http") >= 0) {
            if (url.indexOf(".jpg") < 0 && url.indexOf(".png") < 0) {
                headImage = `${url}??aaa=aa.jpg`;
            }
        }
        node.url = headImage;
    };

    /**
     * 将设计尺寸的View,居中显示,并返回 X 值
     * @param view view
     */
    export const setViewInCenter = (view: fgui.GObject): number => {
        //

        let x = cc.winSize.width / 2 - (cc.winSize.height * 1136 / 640 / 2);
        let y = view.y;

        if (cc.winSize.width < 1136) {
            const scale = cc.winSize.width / 1136;

            view.scaleX = scale;
            view.scaleY = scale;
            x = 0;
            y = (640 - (view.height * scale)) / 2;
        }

        view.setPosition(x, y);

        return x;

    };

    export const nameFormatWithCount = (str: string, count: number, tag: string = "..."): string => {
        if (str === undefined || str === null) {
            return "";
        }
        if (str.length > count) {

            return `${str.substring(0, count)}${tag}`;
        }

        return str;
    };

    /**
     * 根据大小 拉长高宽
     * @param node 节点
     */
    const setBgFullScreen = (node: fgui.GObject): void => {

        // 1. 先找到 SHOW_ALL 模式适配之后，本节点的实际宽高以及初始缩放值
        const srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / node.width,
            cc.view.getCanvasSize().height / node.height
        );
        const realWidth = node.width * srcScaleForShowAll;
        const realHeight = node.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做节点宽高重置
        node.width = node.width *
            (cc.view.getCanvasSize().width / realWidth);
        node.height = node.height *
            (cc.view.getCanvasSize().height / realHeight);

    };

    export const formatDate = (date: Date): string => {
        const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;

        return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
    };

    /**
     * 设置背景大小
     * @param view 背景 节点
     */
    export const setBgFullScreenSize = (view: fgui.GObject): void => {

        if (cc.winSize.width < 1136) {
            view.setPosition(0, view.y);

            return;
        }

        const x = cc.winSize.width / 2 - (cc.winSize.height * 1136 / 640 / 2);
        view.setPosition(-x, 0);
        setBgFullScreen(view);

    };

    export const toNumber = (longValue: long): number => {
        //从 data storage  里取出来的long类型， 无法toNumber(),先new 个 long 对象，再toNumber();
        const cashTime = new long(longValue.low, longValue.high, longValue.unsigned);

        return cashTime.toNumber();
    };

    /**
     * 从resources/prefabs/目录下加载一个prefab
     * @param prefabName prefab名字
     */
    export const loadPrefab = async (prefabName: string): Promise<cc.Prefab> => {
        const prefabUrl = `prefabs/${prefabName}`;

        return new Promise<cc.Prefab>((resolve) => {
            cc.loader.loadRes(prefabUrl, cc.Prefab, (error: Error, resource: cc.Prefab): void => {
                if (error !== null) {
                    console.error("loadPrefab fail:", error.message);
                    resolve(null);
                } else {
                    resolve(resource);
                }
            });
        });
    };

    export const requestServerShipments = (payID: number, orderID: string, eventTarget: cc.EventTarget): void => {
        const req = {
            channel: "weixin",
            pay_id: payID
        };

        const reqString = JSON.stringify(req);

        const userID = DataStore.getString(KeyConstants.USER_ID, "");
        const ticket = DataStore.getString(KeyConstants.TICKET, "");
        const url = LEnv.cfmt(`${LEnv.rootURL}${LEnv.shipmentsUrl}`, 2, userID, ticket);
        Logger.debug("url:", url);
        Logger.debug("req:", req);
        HTTP.hPost(
            eventTarget,
            url,
            async (xhr: XMLHttpRequest, err: string) => {
                let errMsg = null;
                if (err !== null) {
                    Logger.debug(err);
                    const okCallback = () => {
                        requestServerShipments(payID, orderID, eventTarget);
                    };

                    Dialog.showDialog(LocalStrings.findString("networkConnectError"), okCallback);

                    return;
                }

                errMsg = HTTP.hError(xhr);
                if (errMsg !== null) {
                    Logger.debug(errMsg);

                    const okCallback = () => {
                        requestServerShipments(payID, orderID, eventTarget);
                    };
                    Dialog.showDialog(LocalStrings.findString("networkConnectError"), okCallback);

                    return;
                }

                removeOrder(orderID);
                Logger.debug("responseText:", xhr.responseText);
                const result = <{ ret: number; msg: string; data: {} }>JSON.parse(xhr.responseText);
                if (result.ret !== 0) {
                    Logger.error(`requestServerShipments failed, code:${result.ret}, msg:${result.msg}`);
                    Dialog.showDialog(`发货失败:${result.msg}`);
                } else {
                    Dialog.showDialog("支付成功");
                }
            },
            "text",
            reqString);

    };

    export const saveOrder = (orderID: string, payID: number): void => {
        const orderIDStrings = DataStore.getString(KeyConstants.ORDERS);
        const orderMap = <{ [key: string]: number }>JSON.parse(orderIDStrings);
        const keys = Object.keys(orderMap);
        for (const key of keys) {
            if (key === orderID) {
                Logger.debug("saveOrderID failed, order id have been exist");

                return;
            }
        }

        orderMap[orderID] = payID;

        DataStore.setItem(KeyConstants.ORDERS, JSON.stringify(orderMap));

    };

    export const removeOrder = (orderID: string): void => {
        const orderIDStrings = DataStore.getString(KeyConstants.ORDERS);
        const orderMap = <{ [key: string]: number }>JSON.parse(orderIDStrings);

        delete orderMap[orderID];
        DataStore.setItem(KeyConstants.ORDERS, JSON.stringify(orderMap));
    };

}
