import { Dialog } from "./Dialog";
import { Logger } from "./Logger";

/**
 * 封装HTTP和websocket
 */
export namespace HTTP {
    export interface HTTPRequestOption {
        responseType: XMLHttpRequestResponseType; // "arraybuffer
        body?: string | ArrayBuffer;
        timeout?: number;
        waitWin?: boolean;
    }

    const xhrRequest = (
        destroyListener: cc.EventTarget, method: string, url: string, onFinished: Function, options: HTTPRequestOption) => {
        // 使用XMLHttpRequest
        const xhr = cc.loader.getXMLHttpRequest();
        if (url.indexOf("https") === 0) {
            // 如果是https则使用证书
            xhr.withCredentials = true;
        }

        const cb = () => {
            xhr.abort();
        };

        const onEnd = (error: Error): void => {
            if (options.waitWin) {
                Dialog.hideWaiting();
            }

            destroyListener.off("destroy", cb);
            onFinished(xhr, error);
        };

        // 如果组件已经销毁则终止网络请求
        destroyListener.once("destory", cb);

        xhr.onabort = () => {
            Logger.trace("xhr onabort");
            destroyListener.off("destroy", cb);
            Logger.debug("xhr abort for url:", url);
        };

        xhr.onloadend = () => {
            Logger.trace("xhr onloaded");
            onEnd(null);
        };

        xhr.onerror = () => {
            Logger.trace("xhr onerror");
            onEnd(Error("xhr onerror"));
        };

        xhr.ontimeout = () => {
            Logger.trace("xhr ontimeout");
            onEnd(Error("xhr ontimeout"));
        };

        // 设置服务器响应类型
        let timeout = 5000; // 默认5秒超时
        if (options.timeout !== undefined) {
            timeout = options.timeout;
        }

        xhr.timeout = timeout;
        xhr.responseType = options.responseType;
        xhr.open(method, url, true);
        if (options.body !== null && options.body !== undefined) {
            if (typeof options.body === "string") {
                xhr.setRequestHeader("Content-Type", "application/json");
            } else {
                xhr.setRequestHeader("Content-Type", "application/octet-stream");
            }

            xhr.send(options.body);
        } else {
            xhr.send();
        }

        // 显示等待滚动圈
        if (options.waitWin) {
            Dialog.showWaiting();
        }

        return xhr;
    };

    /**
     * HTTP GET
     * @param destroyListener 订阅组件销毁事件，组件销毁时需要发出"destroy"事件，然后http请求终止
     * @param url URL
     * @param onFinished 请求完成时回调
     * @param responseType 服务器响应内容格式
     */
    export const hGet = (
        destroyListener: cc.EventTarget, url: string, onFinished: Function,
        responseType: XMLHttpRequestResponseType = "arraybuffer") => {

        const options: HTTPRequestOption = { responseType: responseType };
        options.waitWin = true;

        return xhrRequest(destroyListener, "GET", url, onFinished, options);
    };

    /**
     * HTTP POST
     * @param destroyListener 订阅组件销毁事件，组件销毁时需要发出"destroy"事件，然后http请求终止
     * @param url URL
     * @param onFinished 请求完成时回调
     * @param responseType 服务器响应内容格式
     * @param body 发送到服务器的内容
     */
    export const hPost = (
        destroyListener: cc.EventTarget, url: string, onFinished: Function,
        responseType: XMLHttpRequestResponseType = "arraybuffer", body: string | ArrayBuffer) => {

        const options: HTTPRequestOption = { responseType: responseType };
        options.waitWin = true;
        options.body = body;

        return xhrRequest(destroyListener, "POST", url, onFinished, options);
    };

    export const hError = (xhr: XMLHttpRequest): string => {
        if (xhr.status === 200) {
            return null;
        }

        return `HTTP请求失败, status:${xhr.status}`;
    };
}
