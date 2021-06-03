/**
 * 中奖格子的上升特效
 */
class RiseParticlePoolObject extends particle.GravityParticleSystem implements IPoolObject {
    public constructor() {
        super(RES.getRes("zhongjianglizi_png"), RES.getRes("zhongjianglizi_json"));
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