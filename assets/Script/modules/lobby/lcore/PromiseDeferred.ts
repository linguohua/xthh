/**
 * 延时调用resolve或者reject函数
 * @see https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md
 */
export class Deferred<T> {
    public promise: Promise<T>;

    private fate: "resolved" | "unresolved";
    private state: "pending" | "fulfilled" | "rejected";

    private mresolve: Function;
    private mreject: Function;

    constructor() {
        this.state = "pending";
        this.fate = "unresolved";

        // 这里的确有意地延迟调用resolve或者reject
        // tslint:disable-next-line: promise-must-complete
        this.promise = new Promise((resolve: Function, reject: Function): void => {
            this.mresolve = resolve;
            this.mreject = reject;
        });

        this.promise.then(
            () => this.state = "fulfilled",
            () => this.state = "rejected"
        );
    }

    public resolve(value?: T): void {
        if (this.fate === "resolved") {
            throw Error("Deferred cannot be resolved twice");
        }
        this.fate = "resolved";
        this.mresolve(value);
    }

    public reject(reason?: Error): void {
        if (this.fate === "resolved") {
            throw Error("Deferred cannot be resolved twice");
        }
        this.fate = "resolved";
        this.mreject(reason);
    }

    public isResolved(): boolean {
        return this.fate === "resolved";
    }

    public isPending(): boolean {
        return this.state === "pending";
    }

    public isFulfilled(): boolean {
        return this.state === "fulfilled";
    }

    public isRejected(): boolean {
        return this.state === "rejected";
    }
}
