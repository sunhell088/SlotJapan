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
 * 抛洒金币动画的贝塞尔曲线对象池
 */
var CoinPoolObject = (function (_super) {
    __extends(CoinPoolObject, _super);
    function CoinPoolObject() {
        var _this = _super.call(this) || this;
        _this.coinMC = new egret.MovieClip(GameUtil.coinFactory.generateMovieClipData("bigwin_dropCoin"));
        _this.addChild(_this.coinMC);
        _this.addEventListener(egret.Event.REMOVED, _this.onRemoved, _this);
        return _this;
    }
    CoinPoolObject.prototype.dispose = function () {
        egret.Tween.removeTweens(this);
        this.coinMC.stop();
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(CoinPoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    CoinPoolObject.prototype.onRemoved = function () {
        this.dispose();
    };
    CoinPoolObject.prototype.getCoinMC = function () {
        return this.coinMC;
    };
    return CoinPoolObject;
}(BezierDisplayObject));
__reflect(CoinPoolObject.prototype, "CoinPoolObject", ["IPoolObject"]);
//# sourceMappingURL=CoinPoolObject.js.map