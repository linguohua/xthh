
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
        //头像
        if (url !== undefined && url !== null && url !== "" && url.indexOf("http") >= 0) {
            if (url.indexOf(".jpg") < 0 && url.indexOf(".png") < 0) {
                headImage = `${url}??aaa=aa.jpg`;
            }
        }
        node.url = headImage;
    };
}
