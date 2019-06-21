import { GResLoader } from "./lcore/LCoreExports";
import { Logger } from "./lcore/Logger";

/**
 * 模块资源加载，主要是记录已经加载的资源，以便退出模块时卸载
 */
export class GResLoaderImpl implements GResLoader {
    public readonly name: string;
    public loadedResSet: { [key: string]: boolean } = {};
    public loadedPackages: { [key: string]: boolean } = {};

    public constructor(name: string) {
        this.name = name;
    }

    public fguiAddPackage(packageName: string): void {
        fgui.UIPackage.addPackage(packageName);

        this.loadedPackages[packageName] = true;
    }

    public loadResDir(dir: string, onCompleted: (error: Error) => void, onProgress?: (progress: number) => void): void {
        cc.loader.loadResDir(
            dir,
            (completedCount, totalCount, _) => {
                Logger.debug(`GResLoader load progress:${completedCount}/${totalCount}`);
                if (onProgress !== null && onProgress !== undefined && totalCount !== 0) {
                    onProgress(completedCount / totalCount);
                }
            },
            (error, _, urls) => {
                Logger.debug(`GResLoader load, error:${error}`);

                urls.forEach((u) => {
                    Logger.debug("GResLoader loaded:", u);
                    this.loadedResSet[u] = true;
                });

                onCompleted(error);
            }
        );
    }

    public loadPrefab(prefabName: string, onCompleted: (error: Error, res: cc.Prefab) => void): void {
        cc.loader.loadRes(prefabName, cc.Prefab, (error, res: cc.Prefab) => {
            if (error !== null) {
                onCompleted(error, null);
            } else {
                this.loadedResSet[prefabName] = true;
                onCompleted(null, res);
            }
        });
    }

    public unload(): void {
        const resKeys = Object.keys(this.loadedResSet);
        cc.loader.release(resKeys);

        const pkgKeys = Object.keys(this.loadedPackages);
        pkgKeys.forEach((key) => {
            fgui.UIPackage.removePackage(key);
        });

        this.loadedPackages = {};
        this.loadedResSet = {};
    }
}
