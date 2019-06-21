/**
 * 日志打印，主要是增加一层过滤开关
 */
enum LogLevel {
    TRACE,
    DEBUG,
    WARN,
    ERROR,
    FATAL,
    ALL
}

/**
 * 日志记录
 */
export namespace Logger {
    export let level: LogLevel = LogLevel.ALL;

    export const setFilterLevel = (filterLevel: LogLevel): void => {
        level = filterLevel;
    };

    export const trace = (msg: any, ...args: any[]): void => { // tslint:disable-line:no-any
        if (level >= LogLevel.TRACE) {
            cc.log(msg, ...args);
        }
    };

    export const debug = (msg: any, ...args: any[]): void => { // tslint:disable-line:no-any
        if (level >= LogLevel.DEBUG) {
            cc.log(msg, ...args);
        }
    };

    export const warn = (msg: any, ...args: any[]): void => { // tslint:disable-line:no-any
        if (level >= LogLevel.WARN) {
            cc.warn(msg, ...args);
        }
    };

    export const error = (msg: any, ...args: any[]): void => { // tslint:disable-line:no-any
        if (level >= LogLevel.ERROR) {
            cc.error(msg, ...args);
        }
    };

    export const fatal = (msg: any, ...args: any[]): void => { // tslint:disable-line:no-any
        if (level >= LogLevel.FATAL) {
            cc.error(msg, ...args);
        }
    };
}
