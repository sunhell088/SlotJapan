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
 * 选择次数后，弹出的提示UI
 */
var FreeSpinStartUICom = (function (_super) {
    __extends(FreeSpinStartUICom, _super);
    function FreeSpinStartUICom() {
        var _this = _super.call(this) || this;
        FreeSpinStartUICom.instance = _this;
        _this.skinName = FreeSpinStartSkin;
        return _this;
    }
    FreeSpinStartUICom.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.freeSpinStartCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.freeSpinStartUIClose, this);
    };
    FreeSpinStartUICom.prototype.freeSpinStartCountDown = function () {
        this.freeSpinStartCountDownSecond--;
        if (this.freeSpinStartCountDownSecond < 0) {
            this.freeSpinStartUIClose();
            return;
        }
        this.freeSpinStartCountDownLab.visible = true;
        this.freeSpinStartCountDownLab.text = this.freeSpinStartCountDownSecond + "";
        this.freeSpinStartCountDownIcon.visible = true;
    };
    FreeSpinStartUICom.prototype.freeSpinStartUIClose = function () {
        SoundManager.instance.playMusic(SoundType.BG_MUSIC_FREE_SPIN);
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.stopEffect(SoundType.FREE_SPIN_START);
        this.freeSpinStartCountDownLab.visible = false;
        this.freeSpinStartCountDownIcon.visible = false;
        egret.clearInterval(this.freeSpinStartInterKey);
        ObserverManager.sendNotification(MainMediator.START_FREE_SPIN);
        egret.Tween.get(this).to({ scaleX: 5, scaleY: 5, alpha: 0 }, 300).call(function () {
            this.visible = false;
        }, this);
    };
    //显示freeSpin总结算面板
    FreeSpinStartUICom.prototype.show = function () {
        SoundManager.instance.playEffect(SoundType.FREE_SPIN_START);
        this.visible = true;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        this.scaleX = this.scaleY = 0;
        this.alpha = 0;
        egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        this.freeSpinStartCountLab.text = "" + Data.globalProxy.getFreespinTotalTimes();
        this.freeSpinStartCountDownLab.visible = false;
        this.freeSpinStartCountDownIcon.visible = false;
        this.freeSpinStartCountDownSecond = 6;
        this.freeSpinStartCountDown();
        this.freeSpinStartInterKey = egret.setInterval(this.freeSpinStartCountDown, this, 1000);
    };
    return FreeSpinStartUICom;
}(eui.Component));
__reflect(FreeSpinStartUICom.prototype, "FreeSpinStartUICom");
//# sourceMappingURL=FreeSpinStartUICom.js.map