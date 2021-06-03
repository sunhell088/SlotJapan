/**
 * 对象池使用示例
 */
class PoolObjectExample extends eui.Image implements IPoolObject {
    public constructor() {
        super();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
    }

    public dispose():void {
        ObjectPoolManager.backObject(this);
    }

    public get hashc():number {
        return this.hashCode;
    }

    private onRemoved() {
        this.dispose();
    }
}