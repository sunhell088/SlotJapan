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
 * Created by Kurt on 2018/9/13.
 */
var LotusUICom = (function (_super) {
    __extends(LotusUICom, _super);
    function LotusUICom() {
        var _this = _super.call(this) || this;
        _this.skinName = LotusUIComSkin;
        return _this;
    }
    LotusUICom.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.touchChildren = false;
    };
    LotusUICom.prototype.init = function (lotusSO, index) {
        this.bgBtnState = LotusUICom.LOTUS_RANDOM_TYPE[index] + "";
        this.invalidateState();
        this["bgBtn" + this.getCurrentState()].enabled = true;
        this["bgBtn" + this.getCurrentState()].scaleX = CommonUtil.randomInteger(0, 1) == 0 ? 1 : -1;
        this.countLab.visible = lotusSO.opened;
        this.countLab.text = lotusSO.count + "";
        this.countLab.filters = null;
        this.typeImg.visible = lotusSO.opened;
        if (this.typeImg.visible) {
            this.typeImg.source = lotusSO.flipChance ? "flipTimeIcon_png" : "freeSpinCountIcon_png";
        }
    };
    LotusUICom.prototype.open = function (lotusSO, bEnable) {
        this.touchEnabled = false;
        this["bgBtn" + this.getCurrentState()].enabled = bEnable;
        this.countLab.visible = true;
        this.countLab.text = lotusSO.count + "";
        this.countLab.filters = bEnable ? null : [CommonUtil.greyColorFlilter];
        this.typeImg.visible = true;
        this.typeImg.source = lotusSO.flipChance ? "flipTimeIcon_png" : "freeSpinCountIcon_png";
        this.typeImg.filters = bEnable ? null : [CommonUtil.greyColorFlilter];
        //动画
        egret.Tween.removeTweens(this.countLab);
        egret.Tween.removeTweens(this.typeImg);
        this.countLab.scaleX = this.countLab.scaleY = 0;
        egret.Tween.get(this.countLab).to({ scaleX: 1, scaleY: 1 }, 800, bEnable ? egret.Ease.bounceOut : null);
        this.typeImg.scaleX = this.typeImg.scaleY = 0;
        egret.Tween.get(this.typeImg).to({ scaleX: 1, scaleY: 1 }, 800, bEnable ? egret.Ease.bounceOut : null);
    };
    LotusUICom.prototype.isOpened = function () {
        return this.countLab.visible && this.typeImg.visible;
    };
    LotusUICom.prototype.getCurrentState = function () {
        return this.bgBtnState;
    };
    LotusUICom.LOTUS_RANDOM_TYPE = [1, 2, 3, 3, 2, 1, 1, 2, 3, 2, 1, 1];
    return LotusUICom;
}(eui.Component));
__reflect(LotusUICom.prototype, "LotusUICom");
//# sourceMappingURL=LotusUICom.js.map