var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 格子的动画对象池
 */
var SlotEffectPoolObject = (function (_super) {
    __extends(SlotEffectPoolObject, _super);
    function SlotEffectPoolObject() {
        return _super.call(this) || this;
    }
    SlotEffectPoolObject.prototype.initDragonBones = function (name) {
        this.animationMovie = dragonBones.buildMovie(name);
        this.addChild(this.animationMovie);
        this.addEventListener(egret.Event.REMOVED, this.onRemoved, this);
    };
    SlotEffectPoolObject.prototype.dispose = function () {
        egret.Tween.removeTweens(this);
        this.animationMovie.stop();
        this.animationMovie.dispose();
        ObjectPoolManager.backObject(this);
        this.removeEventListener(egret.Event.REMOVED, this.onRemoved, this);
        this.removeChild(this.animationMovie);
        this.animationMovie = null;
    };
    Object.defineProperty(SlotEffectPoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    SlotEffectPoolObject.prototype.onRemoved = function () {
        this.dispose();
    };
    SlotEffectPoolObject.prototype.getArmatureDisplay = function () {
        return this.animationMovie;
    };
    return SlotEffectPoolObject;
}(egret.DisplayObjectContainer));
__reflect(SlotEffectPoolObject.prototype, "SlotEffectPoolObject", ["IPoolObject"]);
//# sourceMappingURL=SlotEffectPoolObject.js.map