/**
 * slot的粒子围绕特效
 */
class WinSlotParticlePoolObject extends particle.GravityParticleSystem implements IPoolObject {
    public constructor() {
        super(RES.getRes("winSlotParticle_png"), RES.getRes("winSlotParticle_json"));
        this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
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