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
 * 跳动的美术数字
 */
var BounceBitmapLabel = (function (_super) {
    __extends(BounceBitmapLabel, _super);
    function BounceBitmapLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //是否已经结束（因为当后面的wait时，value值依然再调用，导致CommonUtil.valueFormatDecimals执行后，被覆盖）
        _this.bOver = false;
        return _this;
    }
    Object.defineProperty(BounceBitmapLabel.prototype, "value", {
        get: function () {
            return 0;
        },
        set: function (value) {
            if (this.bOver)
                return;
            if (value == 1)
                this.bOver = true;
            value = this.start + (this.end - this.start) * value;
            value = +value.toFixed(this.decimalsCount);
            if ((+this.text) != value) {
                this.text = value + "";
            }
        },
        enumerable: true,
        configurable: true
    });
    BounceBitmapLabel.prototype.tweenNum = function (start, end, durationTime) {
        this.bOver = false;
        var strArr = (start + "").split(".");
        this.decimalsCount = strArr.length == 2 ? strArr[1].length : 0;
        this.start = start;
        this.end = end;
        return egret.Tween.get(this).to({ value: 1 }, durationTime).call(function () {
            //这里主要是考虑，有小数的情况
            this.text = CommonUtil.valueFormatDecimals(this.end, 2) + "";
        }, this);
    };
    return BounceBitmapLabel;
}(eui.BitmapLabel));
__reflect(BounceBitmapLabel.prototype, "BounceBitmapLabel");
//# sourceMappingURL=BounceBitmapLabel.js.map