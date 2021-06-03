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
 * 中奖的格子的环绕对象池
 */
var SlotSurroundPoolObject = (function (_super) {
    __extends(SlotSurroundPoolObject, _super);
    function SlotSurroundPoolObject() {
        var _this = _super.call(this) || this;
        _this.movieClipData = GameUtil.slotSurroundFactory.generateMovieClipData("slot_texiao");
        _this.addEventListener(egret.Event.REMOVED, _this.onRemoved, _this);
        return _this;
    }
    SlotSurroundPoolObject.prototype.dispose = function () {
        egret.Tween.removeTweens(this);
        this.stop();
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(SlotSurroundPoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    SlotSurroundPoolObject.prototype.onRemoved = function () {
        this.dispose();
    };
    return SlotSurroundPoolObject;
}(egret.MovieClip));
__reflect(SlotSurroundPoolObject.prototype, "SlotSurroundPoolObject", ["IPoolObject"]);
//# sourceMappingURL=SlotSurroundPoolObject.js.map