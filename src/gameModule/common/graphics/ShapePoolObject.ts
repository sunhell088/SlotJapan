/**
 * 对象池使用示例
 */
class ShapePoolObject extends egret.Shape implements IPoolObject {
    public constructor() {
        super();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
    }

    public dispose():void {
        egret.Tween.removeTweens(this);
        ObjectPoolManager.backObject(this);
    }

    public get hashc():number {
        return this.hashCode;
    }

    private onRemoved() {
        this.graphics.clear();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.dispose();
    }
}