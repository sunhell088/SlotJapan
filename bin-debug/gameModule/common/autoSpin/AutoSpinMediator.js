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
 * 自动游戏次数系统
 */
var AutoSpinMediator = (function (_super) {
    __extends(AutoSpinMediator, _super);
    function AutoSpinMediator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoSpinMediator.prototype.getCommands = function () {
        return [MainMediator.GAIN_FREE_SPIN, MainMediator.GAIN_SPECIAL_GAME, MainMediator.GAIN_MONEY_COUNT, MainMediator.BALANCE_CHANGE];
    };
    AutoSpinMediator.prototype.initView = function () {
        this.view = new AutoSpinUI();
    };
    AutoSpinMediator.prototype.onEnter = function () {
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_AUTO_SPIN, this.view.onEnter, this.view);
    };
    AutoSpinMediator.prototype.onExit = function () {
        this.view.onExit();
    };
    AutoSpinMediator.prototype.onGainFreeSpin = function () {
        if (Data.globalProxy.bStopAutoByFreeGame) {
            Data.globalProxy.autoSpinCount = 0;
            // ViewManager.alert(Game.getLanguage("stopAutoByFreeGame"));
        }
    };
    AutoSpinMediator.prototype.onGainSpecialGame = function () {
        if (Data.globalProxy.bStopAutoByFreeGame) {
            Data.globalProxy.autoSpinCount = 0;
            // ViewManager.alert(Game.getLanguage("stopAutoBySpecialGame"));
        }
    };
    AutoSpinMediator.prototype.onGainMoneyCount = function (gainCount) {
        gainCount = CommonUtil.valueFormatDecimals(gainCount, 2);
        if (Data.globalProxy.stopAutoBySingleWin > 0 && gainCount >= Data.globalProxy.stopAutoBySingleWin) {
            Data.globalProxy.autoSpinCount = 0;
            // egret.setTimeout(function () {
            //     ViewManager.alert(Game.getLanguage("stopAutoBySingleWin", gainCount, Data.globalProxy.stopAutoBySingleWin));
            // }, this, 2000)
        }
    };
    AutoSpinMediator.prototype.onBalanceChange = function (currentBalance) {
        Data.globalProxy.startAutoSpinBalance = CommonUtil.valueFormatDecimals(Data.globalProxy.startAutoSpinBalance, 2);
        currentBalance = CommonUtil.valueFormatDecimals(currentBalance, 2);
        var offset = CommonUtil.valueFormatDecimals(currentBalance - Data.globalProxy.startAutoSpinBalance, 2);
        if (Data.globalProxy.stopAutoByBalanceAdd > 0) {
            if (Data.globalProxy.autoSpinCount != 0 && offset > 0 && offset >= Data.globalProxy.stopAutoByBalanceAdd) {
                Data.globalProxy.autoSpinCount = 0;
                // egret.setTimeout(function () {
                //     ViewManager.alert(Game.getLanguage("stopAutoByBalanceAdd", Data.globalProxy.startAutoSpinBalance, currentBalance, Data.globalProxy.stopAutoByBalanceAdd));
                // }, this, 2000)
            }
        }
        if (Data.globalProxy.stopAutoByBalanceDeduct > 0) {
            if (Data.globalProxy.autoSpinCount != 0 && offset < 0 && (-offset) >= Data.globalProxy.stopAutoByBalanceDeduct) {
                Data.globalProxy.autoSpinCount = 0;
                // egret.setTimeout(function () {
                //     ViewManager.alert(Game.getLanguage("stopAutoByBalanceDeduct", Data.globalProxy.startAutoSpinBalance, currentBalance, Data.globalProxy.stopAutoByBalanceDeduct));
                // }, this, 2000)
            }
        }
    };
    //通知开始自动转动
    AutoSpinMediator.START_AUTO_SPIN = "onStartAutoSpin";
    return AutoSpinMediator;
}(Mediator));
__reflect(AutoSpinMediator.prototype, "AutoSpinMediator");
//# sourceMappingURL=AutoSpinMediator.js.map