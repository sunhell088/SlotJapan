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
 * 通用确认框
 */
var GameAlertUI = (function (_super) {
    __extends(GameAlertUI, _super);
    function GameAlertUI() {
        var _this = _super.call(this) || this;
        _this.affirmHandler = null;
        //缓存的消息
        _this.messages = [];
        _this.skinName = CommonAlertSkin;
        _this.btn_affirm.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onAffirm, _this);
        _this.btn_affirmCountDown.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onAffirm, _this);
        _this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.close, _this);
        return _this;
    }
    GameAlertUI.prototype.alert = function () {
        var parameters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parameters[_i] = arguments[_i];
        }
        SoundManager.instance.playEffect(SoundType.ALERT);
        this.messages.push(arguments);
        if (!this.parent) {
            this.alertMessage.apply(this, this.messages.shift());
        }
    };
    GameAlertUI.prototype.alertMessage = function (text, affirmHandler, thisObject, bShowCancel, bShowAffirm, countDown) {
        if (affirmHandler === void 0) { affirmHandler = null; }
        if (thisObject === void 0) { thisObject = null; }
        if (bShowCancel === void 0) { bShowCancel = false; }
        if (bShowAffirm === void 0) { bShowAffirm = true; }
        if (countDown === void 0) { countDown = -1; }
        var parameters = [];
        for (var _i = 6; _i < arguments.length; _i++) {
            parameters[_i - 6] = arguments[_i];
        }
        ViewManager.instance.addElement(this, ViewDepth.ALERT);
        this.setRectBGFull();
        this.ui_text.textFlow = TextUtil.parse(text);
        this.affirmHandler = affirmHandler;
        this.thisObject = thisObject;
        this.parameters = parameters;
        this.btn_affirm.visible = true;
        if (bShowCancel) {
            this.btn_cancel.visible = true;
            //分散
            this.btn_affirm.x = this.btn_affirm.parent.width / 2 - 30 - this.btn_affirm.width;
            this.btn_cancel.x = this.btn_cancel.parent.width / 2 + 30;
        }
        else {
            this.btn_cancel.visible = false;
            //居中
            this.btn_affirm.x = this.btn_affirm.parent.width / 2 - this.btn_affirm.width / 2;
        }
        this.btn_affirm.visible = bShowAffirm;
        this.ui_text.width = 414;
        this.ui_text.y = 61;
        //设置倒计时
        if (countDown != -1) {
            this.countDownLab.visible = true;
            this.countDownSecond = countDown;
            this.countDown();
            this.interKey = egret.setInterval(this.countDown, this, 1000);
        }
        else {
            this.countDownLab.visible = false;
        }
        this.countDownIcon.visible = this.countDownLab.visible;
        this.btn_affirm.visible = !this.countDownLab.visible;
        this.btn_affirmCountDown.visible = !this.btn_affirm.visible;
        //如果是没有确认按钮，需玩家强制刷新界面的弹出框，则文本位置居中
        var affirmBtn = this.btn_affirm.visible ? this.btn_affirm : this.btn_affirmCountDown;
        if (affirmBtn.visible) {
            //如果文本过高，和确定按钮重叠，那么以确定按钮为最底面
            if (this.ui_text.y + this.ui_text.height >= affirmBtn.y) {
                this.ui_text.y = affirmBtn.y - this.ui_text.height - 10;
                //如果还是过高，则增加宽度
                if (this.ui_text.y <= 0) {
                    this.ui_text.width = this.ui_text.parent.width;
                    this.ui_text.y = affirmBtn.y - this.ui_text.height - 10;
                }
            }
        }
        else {
            this.ui_text.y = this.ui_text.parent.height / 2 - this.ui_text.height / 2;
        }
    };
    GameAlertUI.prototype.close = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.removeElement(this, ViewDepth.ALERT);
        if (this.messages.length > 0) {
            this.alertMessage.apply(this, this.messages.shift());
        }
    };
    GameAlertUI.prototype.onAffirm = function () {
        egret.clearInterval(this.interKey);
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        if (this.affirmHandler != null) {
            var thisObj = this.thisObject || this;
            //这里this.parameters取0是因为经过了2次可变参数传递
            this.affirmHandler.apply(thisObj, this.parameters[0]);
        }
        //close要放在确认回调的后面，因为close里会用新的parameters替换旧的
        this.close();
    };
    //设置背景遮盖全屏
    GameAlertUI.prototype.setRectBGFull = function () {
        if (!this.visible)
            return;
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.x = this.parent.width / 2 - this.width / 2;
        this.y = this.parent.height / 2 - this.height / 2;
    };
    GameAlertUI.prototype.countDown = function () {
        this.countDownSecond--;
        if (this.countDownSecond < 0) {
            this.onAffirm();
            return;
        }
        this.countDownLab.text = this.countDownSecond + "";
    };
    return GameAlertUI;
}(eui.Component));
__reflect(GameAlertUI.prototype, "GameAlertUI");
//# sourceMappingURL=GameAlertUI.js.map