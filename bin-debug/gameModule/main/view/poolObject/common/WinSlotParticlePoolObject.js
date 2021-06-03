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
 * slot的粒子围绕特效
 */
var WinSlotParticlePoolObject = (function (_super) {
    __extends(WinSlotParticlePoolObject, _super);
    function WinSlotParticlePoolObject() {
        var _this = _super.call(this, RES.getRes("winSlotParticle_png"), RES.getRes("winSlotParticle_json")) || this;
        _this.addEventListener(egret.Event.REMOVED, _this.onRemoved, _this);
        return _this;
    }
    WinSlotParticlePoolObject.prototype.dispose = function () {
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(WinSlotParticlePoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    WinSlotParticlePoolObject.prototype.onRemoved = function () {
        this.dispose();
    };
    return WinSlotParticlePoolObject;
}(particle.GravityParticleSystem));
__reflect(WinSlotParticlePoolObject.prototype, "WinSlotParticlePoolObject", ["IPoolObject"]);
//# sourceMappingURL=WinSlotParticlePoolObject.js.map