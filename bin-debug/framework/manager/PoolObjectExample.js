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
var PoolObjectExample = (function (_super) {
    __extends(PoolObjectExample, _super);
    function PoolObjectExample() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoved, _this);
        return _this;
    }
    PoolObjectExample.prototype.dispose = function () {
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(PoolObjectExample.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    PoolObjectExample.prototype.onRemoved = function () {
        this.dispose();
    };
    return PoolObjectExample;
}(eui.Image));
__reflect(PoolObjectExample.prototype, "PoolObjectExample", ["IPoolObject"]);
//# sourceMappingURL=PoolObjectExample.js.map