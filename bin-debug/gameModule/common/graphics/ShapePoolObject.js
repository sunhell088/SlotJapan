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
 * 对象池使用示例
 */
var ShapePoolObject = (function (_super) {
    __extends(ShapePoolObject, _super);
    function ShapePoolObject() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoved, _this);
        return _this;
    }
    ShapePoolObject.prototype.dispose = function () {
        egret.Tween.removeTweens(this);
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(ShapePoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    ShapePoolObject.prototype.onRemoved = function () {
        this.graphics.clear();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.dispose();
    };
    return ShapePoolObject;
}(egret.Shape));
__reflect(ShapePoolObject.prototype, "ShapePoolObject", ["IPoolObject"]);
//# sourceMappingURL=ShapePoolObject.js.map