/**
 * 神秘格子的动画对象池
 */
class SlotMysteryPoolObject extends egret.DisplayObjectContainer implements IPoolObject {
    private armatureDisplay:dragonBones.EgretArmatureDisplay;

    public constructor() {
        super();
        this.armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("mysteryName");
        this.addChild(this.armatureDisplay);
        this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
    }

    public dispose():void {
        egret.Tween.removeTweens(this);
        this.armatureDisplay.animation.stop();
        ObjectPoolManager.backObject(this);
    }

    public get hashc():number {
        return this.hashCode;
    }

    private onRemoved() {
        this.dispose();
    }

    public getArmatureDisplay():dragonBones.EgretArmatureDisplay {
        return this.armatureDisplay;
    }
}