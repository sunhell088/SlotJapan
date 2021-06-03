/**
 * 神秘格子的爆炸特效
 */
class ExplosionParticlePoolObject extends particle.GravityParticleSystem implements IPoolObject {
    public constructor() {
        super(RES.getRes("baozhalizi_png"), RES.getRes("baozhalizi_json"));
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