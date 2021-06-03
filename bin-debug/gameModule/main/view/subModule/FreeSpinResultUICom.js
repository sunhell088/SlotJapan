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
 * 免费游戏结束后弹出的总结算面板
 */
var FreeSpinResultUICom = (function (_super) {
    __extends(FreeSpinResultUICom, _super);
    function FreeSpinResultUICom() {
        var _this = _super.call(this) || this;
        FreeSpinResultUICom.instance = _this;
        _this.skinName = FreeSpinResultSkin;
        return _this;
    }
    FreeSpinResultUICom.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.freeSpinResultCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.freeSpinResultUIClose, this);
    };
    FreeSpinResultUICom.prototype.freeSpinResultCountDown = function () {
        this.freeSpinResultCountDownSecond--;
        if (this.freeSpinResultCountDownSecond < 0) {
            this.freeSpinResultUIClose();
            return;
        }
        this.freeSpinResultCountDownLab.visible = true;
        this.freeSpinResultCountDownLab.text = this.freeSpinResultCountDownSecond + "";
        this.freeSpinResultCountDownIcon.visible = true;
    };
    //freeSpin结果面板关闭时重置滚动区域
    FreeSpinResultUICom.prototype.freeSpinResultUIClose = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.playMusic(SoundType.BG_MUSIC);
        SoundManager.instance.stopEffect(SoundType.FREE_SPIN_RESULT);
        Data.globalProxy.bInFreeSpinDisplay = false;
        SpinAreaUICom.instance.setSpinBG(true);
        ControlSpinUICom.instance.updateStatusByFreeSpin();
        egret.Tween.get(this).to({ scaleX: 5, scaleY: 5, alpha: 0 }, 300).call(function () {
            this.visible = false;
            ObserverManager.sendNotification(MainMediator.GAIN_MONEY_COUNT, Data.globalProxy.getFreeSpinTotalPay());
            this.freeSpinResultGroup.visible = false;
            this.freeSpinResultCountDownLab.visible = false;
            this.freeSpinResultCountDownIcon.visible = false;
            egret.clearInterval(this.freeSpinResultInterKey);
            MainUI.instance.nextSpinReady();
        }, this);
    };
    //显示freeSpin总结算面板
    FreeSpinResultUICom.prototype.showTotalResult = function () {
        this.visible = true;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        this.scaleX = this.scaleY = 0;
        this.alpha = 0;
        egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        if (Data.globalProxy.getFreeSpinTotalPay() != 0) {
            SoundManager.instance.playEffect(SoundType.FREE_SPIN_RESULT);
        }
        this.freeSpinResultGroup.visible = true;
        this.freeSpinResultCountLab.text = "" + Data.globalProxy.getFreespinTotalTimes();
        this.freeSpinResultCloseBtn.enabled = false;
        this.freeSpinResultCountDownLab.visible = false;
        this.freeSpinResultCountDownIcon.visible = false;
        this.freeSpinResultLab.tweenNum(0, Data.globalProxy.getFreeSpinTotalPay(), Data.globalProxy.getFreeSpinTotalPay() < SlotRhythmConst.FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION_COUNT
            ? SlotRhythmConst.FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION[0] : SlotRhythmConst.FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION[1])
            .wait(1000)
            .call(function () {
            this.freeSpinResultCountDownSecond = 6;
            this.freeSpinResultCountDown();
            this.freeSpinResultInterKey = egret.setInterval(this.freeSpinResultCountDown, this, 1000);
            this.freeSpinResultCloseBtn.enabled = true;
        }, this);
    };
    return FreeSpinResultUICom;
}(eui.Component));
__reflect(FreeSpinResultUICom.prototype, "FreeSpinResultUICom");
//# sourceMappingURL=FreeSpinResultUICom.js.map