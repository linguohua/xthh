/**
 * 公共函数类
 */
export namespace CommonFunction {

    /**
     * 设置头像
     */
    export const setHead = (node: fgui.GLoader, url: string, gender: number = 0): void => {
        //"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er5prllVA37yiac4Vv8
        //ZAXwbg0Zicibn6ZjsgJ4ha0hmFBY8MUTRMnRTmSlvzPd8XJZzd0icuyGoiakj4A/132";
        let headImage = `ui://lobby_bg_package/girl_img`;
        if (gender === 1) {
            headImage = `ui://lobby_bg_package/boy_img`;
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

}
