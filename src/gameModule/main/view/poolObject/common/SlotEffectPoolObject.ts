/**
 * 格子的动画对象池
 */
class SlotEffectPoolObject extends egret.DisplayObjectContainer implements IPoolObject {
    private animationMovie:dragonBones.Movie;

    public constructor() {
        super();
    }
    
    public initDragonBones(name:string) {
        this.animationMovie = dragonBones.buildMovie(name);
        this.addChild(this.animationMovie);
        this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
    }

    public dispose():void {
        egret.Tween.removeTweens(this);
        this.animationMovie.stop();
        this.animationMovie.dispose();
        ObjectPoolManager.backObject(this);

        this.removeEventListener(egret.Event.REMOVED, this.onRemoved, this);
        this.removeChild(this.animationMovie);
        this.animationMovie = null;
    }

    public get hashc():number {
        return this.hashCode;
    }

    private onRemoved() {
        this.dispose();
    }
    
    public getArmatureDisplay():dragonBones.Movie {
        return this.animationMovie;
    }
}