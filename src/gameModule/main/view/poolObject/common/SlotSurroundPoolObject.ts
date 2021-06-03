/**
 * 中奖的格子的环绕对象池
 */
class SlotSurroundPoolObject extends egret.MovieClip implements IPoolObject {

    public constructor() {
        super();
        this.movieClipData = GameUtil.slotSurroundFactory.generateMovieClipData("slot_texiao");
        this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
    }

    public dispose():void {
        egret.Tween.removeTweens(this);
        this.stop();
        ObjectPoolManager.backObject(this);
    }

    public get hashc():number {
        return this.hashCode;
    }

    private onRemoved() {
        this.dispose();
    }
}