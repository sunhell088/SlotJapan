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
 * 中奖格子的上升特效
 */
var RiseParticlePoolObject = (function (_super) {
    __extends(RiseParticlePoolObject, _super);
    function RiseParticlePoolObject() {
        var _this = _super.call(this, RES.getRes("zhongjianglizi_png"), RES.getRes("zhongjianglizi_json")) || this;
        _this.addEventListener(egret.Event.REMOVED, _this.onRemoved, _this);
        return _this;
    }
    RiseParticlePoolObject.prototype.dispose = function () {
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(RiseParticlePoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    RiseParticlePoolObject.prototype.onRemoved = function () {
        this.dispose();
    };
    return RiseParticlePoolObject;
}(particle.GravityParticleSystem));
__reflect(RiseParticlePoolObject.prototype, "RiseParticlePoolObject", ["IPoolObject"]);
//# sourceMappingURL=RiseParticlePoolObject.js.map