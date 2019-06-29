export type EnvType = "develop" | "test" | "prepublish" | "online";
/**
 * Author:  王冬春
 * Version: 1.0
 * Description: 常量声明
 * History: 无
 */
export namespace Constant {
    export const gameVersion: string = "1.0.0.0629"; //服务器版本号
    export const env: EnvType = "test"; //业务环境
    export const debug: boolean = false; //调试开关
}
