/**
 * 抛洒金币动画的贝塞尔曲线对象池
 */
class CoinPoolObject extends BezierDisplayObject implements IPoolObject {
    private coinMC:egret.MovieClip;

    public constructor() {
        super();
        this.coinMC = new egret.MovieClip(GameUtil.coinFactory.generateMovieClipData("bigwin_dropCoin"));
        this.addChild(this.coinMC);
        this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
    }

    public dispose():void {
        egret.Tween.removeTweens(this);
        this.coinMC.stop();
        ObjectPoolManager.backObject(this);
    }

    public get hashc():number {
        return this.hashCode;
    }

    private onRemoved() {
        this.dispose();
    }

    public getCoinMC():egret.MovieClip {
        return this.coinMC;
    }
}