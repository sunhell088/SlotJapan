/**
 * slot的粒子围绕特效
 */
class ScatterSpeedParticlePoolObject extends particle.GravityParticleSystem implements IPoolObject {
    public constructor() {
        super(RES.getRes("scatterSpeedParticle_png"), RES.getRes("scatterSpeedParticle_json"));
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