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
 * 自动游戏次数页面
 */
var AutoSpinUI = (function (_super) {
    __extends(AutoSpinUI, _super);
    function AutoSpinUI() {
        var _this = _super.call(this) || this;
        _this.skinName = AutoSpinUISkin;
        _this.titleLab.text = Game.getLanguage("Select number of spins");
        _this.countMaxBtn.label = Game.getLanguage("infinite");
        _this.stopHintLab.text = Game.getLanguage("Stop autoplay");
        _this.checkBoxFree.label = Game.getLanguage("Trigger Free Spins or Bonus");
        _this.checkBoxSingle.label = Game.getLanguage("Single win exceeds");
        _this.checkBoxAdd.label = Game.getLanguage("Cash increases by");
        _this.checkBoxDeduct.label = Game.getLanguage("Cash decreases");
        _this.checkBoxFree.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.checkBoxChangeHandler, _this);
        _this.checkBoxSingle.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.checkBoxChangeHandler, _this);
        _this.checkBoxAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.checkBoxChangeHandler, _this);
        _this.checkBoxDeduct.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.checkBoxChangeHandler, _this);
        _this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClose, _this);
        _this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.startSpin, _this);
        _this.inputSingle.prompt = _this.inputAdd.prompt = _this.inputDeduct.prompt = Game.getLanguage("autoSpinInputPrompt");
        _this.inputSingle.inputType = _this.inputAdd.inputType = _this.inputDeduct.inputType = egret.TextFieldInputType.TEL;
        _this.inputSingle.addEventListener(egret.Event.CHANGE, _this.checkInputText, _this);
        _this.inputAdd.addEventListener(egret.Event.CHANGE, _this.checkInputText, _this);
        _this.inputDeduct.addEventListener(egret.Event.CHANGE, _this.checkInputText, _this);
        _this.currencyType1.text = _this.currencyType2.text = _this.currencyType3.text = Game.getLanguage("credits");
        return _this;
    }
    AutoSpinUI.prototype.onEnter = function () {
        ViewManager.instance.addElement(this);
    };
    AutoSpinUI.prototype.onExit = function () {
        ViewManager.instance.removeElement(this);
    };
    AutoSpinUI.prototype.onClose = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.CLOSE_WINDOW(AutoSpinMediator);
    };
    //点击条件复选框
    AutoSpinUI.prototype.checkBoxChangeHandler = function (evt) {
        var checkInput = null;
        if (evt.target == this.checkBoxSingle) {
            checkInput = this.inputSingle;
        }
        else if (evt.target == this.checkBoxAdd) {
            checkInput = this.inputAdd;
        }
        else if (evt.target == this.checkBoxDeduct) {
            checkInput = this.inputDeduct;
        }
        if (checkInput && checkInput.text.length == 0) {
            checkInput.text = 0 + "";
            // evt.target.selected = false;
            // ViewManager.showFlowHint(Game.getLanguage("autoSpinInputPrompt"));
        }
        evt.target["selectBG"].visible = evt.target.selected;
    };
    //input框内容改变
    AutoSpinUI.prototype.checkInputText = function (evt) {
        evt.target.text = +evt.target.text;
        if (+evt.target.text == 0) {
            evt.target.text = "";
        }
        if (evt.target.parent == this.inputSingle) {
            this.checkBoxSingle.selected = (evt.target.text.length != 0);
            this.checkBoxSingle["selectBG"].visible = this.checkBoxSingle.selected;
        }
        else if (evt.target.parent == this.inputAdd) {
            this.checkBoxAdd.selected = (evt.target.text.length != 0);
            this.checkBoxAdd["selectBG"].visible = this.checkBoxAdd.selected;
        }
        else if (evt.target.parent == this.inputDeduct) {
            this.checkBoxDeduct.selected = (evt.target.text.length != 0);
            this.checkBoxDeduct["selectBG"].visible = this.checkBoxDeduct.selected;
        }
    };
    AutoSpinUI.prototype.startSpin = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        Data.globalProxy.autoSpinCount = +this.count20Btn.group.selectedValue;
        Data.globalProxy.bStopAutoByFreeGame = this.checkBoxFree.selected;
        Data.globalProxy.stopAutoBySingleWin = (this.checkBoxSingle.selected && this.inputSingle.text.length > 0) ? +this.inputSingle.text : 0;
        Data.globalProxy.stopAutoByBalanceAdd = (this.checkBoxAdd.selected && this.inputAdd.text.length > 0) ? +this.inputAdd.text : 0;
        Data.globalProxy.stopAutoByBalanceDeduct = (this.checkBoxDeduct.selected && this.inputDeduct.text.length > 0) ? +this.inputDeduct.text : 0;
        Data.globalProxy.startAutoSpinBalance = Data.globalProxy.getBalance();
        ObserverManager.sendNotification(AutoSpinMediator.START_AUTO_SPIN);
        //关闭需要放在 Data.globalProxy.autoSpinCount = +this.count20Btn.group.selectedValue; 后面，否则this.count20Btn.group.selectedValue为空
        ViewManager.instance.CLOSE_WINDOW(AutoSpinMediator);
    };
    return AutoSpinUI;
}(eui.Component));
__reflect(AutoSpinUI.prototype, "AutoSpinUI", ["IGameUI"]);
//# sourceMappingURL=AutoSpinUI.js.map