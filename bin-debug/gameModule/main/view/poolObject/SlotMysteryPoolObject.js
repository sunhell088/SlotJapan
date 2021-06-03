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
 * 神秘格子的动画对象池
 */
var SlotMysteryPoolObject = (function (_super) {
    __extends(SlotMysteryPoolObject, _super);
    function SlotMysteryPoolObject() {
        var _this = _super.call(this) || this;
        _this.armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("mysteryName");
        _this.addChild(_this.armatureDisplay);
        _this.addEventListener(egret.Event.REMOVED, _this.onRemoved, _this);
        return _this;
    }
    SlotMysteryPoolObject.prototype.dispose = function () {
        egret.Tween.removeTweens(this);
        this.armatureDisplay.animation.stop();
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(SlotMysteryPoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    SlotMysteryPoolObject.prototype.onRemoved = function () {
        this.dispose();
    };
    SlotMysteryPoolObject.prototype.getArmatureDisplay = function () {
        return this.armatureDisplay;
    };
    return SlotMysteryPoolObject;
}(egret.DisplayObjectContainer));
__reflect(SlotMysteryPoolObject.prototype, "SlotMysteryPoolObject", ["IPoolObject"]);
//# sourceMappingURL=SlotMysteryPoolObject.js.map