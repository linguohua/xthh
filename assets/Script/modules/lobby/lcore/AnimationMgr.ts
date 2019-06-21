import { GResLoader } from "./LDataType";
import { Logger } from "./Logger";

type AnimationPlayFinished = (error: Error) => void;
type AnimationCreated = (n: cc.Node) => void;

export interface AnimationPlayOptions {
    onFinished?: AnimationPlayFinished;
    onCreate?: AnimationCreated;
}

interface AnimationHolder {
    node?: cc.Node;
    prefab?: cc.Prefab;
    prefabName?: string;
}

/**
 * 简单的动画管理，主要是cache
 */
export class AnimationMgr {
    public readonly loader: GResLoader;

    public readonly map: { [key: string]: AnimationHolder } = {};

    public constructor(loader: GResLoader) {
        this.loader = loader;
    }

    public async coPlay(prefabName: string, mountNode: cc.Node, options?: AnimationPlayOptions): Promise<void> {
        Logger.debug("Animation.coPlay prefabName:", prefabName);

        return new Promise<void>((resolve, reject) => {
            const cb = (error: Error): void => {
                if (error !== null) {
                    Logger.debug("Animation.coPlay error:", error);
                }

                Logger.debug("Animation.coPlay completed, prefabName:", prefabName);
                resolve();
            };

            let op = options;
            if (op === undefined || op === null) {
                op = {};
            }
            op.onFinished = cb;

            this.play(prefabName, mountNode, op);
        });
    }

    public play(prefabName: string, mountNode: cc.Node, options?: AnimationPlayOptions): void {
        const hasCallback = options !== undefined &&
            options.onFinished !== undefined && options.onFinished !== null;

        const hasCreateNotify = options !== undefined &&
            options.onCreate !== undefined && options.onCreate !== null;

        const cb = (error: Error) => {
            if (hasCallback) {
                options.onFinished(error);
            }
        };

        this.getAnimationHolder(prefabName, (error, holder) => {
            if (error !== null) {
                Logger.debug("AnimationMgr.play failed:", error);
                cb(error);
            } else {
                // play animation
                const n = holder.node;
                const animation = n.getComponent(cc.Animation);
                if (animation === null) {
                    cb(new Error(`${prefabName} has no animation component`));

                    return;
                }

                n.removeFromParent();
                mountNode.addChild(n);
                mountNode.active = true;
                n.active = true;

                if (hasCreateNotify) {
                    options.onCreate(n);
                }

                animation.off(cc.Animation.EventType.FINISHED);
                animation.stop();
                animation.play();

                if (hasCallback) {
                    animation.on(cc.Animation.EventType.FINISHED, () => {
                        Logger.debug("AnimationMgr.play FINISHED:", prefabName);
                        cb(null);
                    });
                }
            }
        });
    }

    public getAnimationHolder(prefabName: string, onCompleted: (error: Error, holder: AnimationHolder) => void): void {
        const holder = this.map[prefabName];
        if (holder !== undefined && holder.node.isValid) {
            onCompleted(null, holder);
        } else {
            this.loader.loadPrefab(prefabName, (error, res) => {
                if (error !== null) {
                    onCompleted(error, null);
                } else {
                    const holderNew: AnimationHolder = {};
                    holderNew.node = cc.instantiate(res);
                    holderNew.prefab = res;
                    holderNew.prefabName = prefabName;

                    this.map[prefabName] = holderNew;
                    onCompleted(null, holderNew);
                }
            });
        }
    }
}
