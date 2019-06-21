/**
 * 数据存取
 */
export namespace DataStore {
    interface CCStorage {
        getItem(key: string): string;
        setItem(key: string, value: string | number | object): void;
    }
    export const getString = (key: string, def: string = ""): string => {
        const v = (<CCStorage>cc.sys.localStorage).getItem(key);
        if (v !== undefined && v !== null) {
            return v;
        }

        return def;
    };

    export const setItem = (key: string, item: string | number | object) => {
        (<CCStorage>cc.sys.localStorage).setItem(key, item);
    };

    export const hasKey = (key: string): boolean => {
        const v = (<CCStorage>cc.sys.localStorage).getItem(key);

        return (v !== undefined && v !== null);
    };
}
