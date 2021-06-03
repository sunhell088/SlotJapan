/**
 * 自动游戏次数系统
 */
class AutoSpinMediator extends Mediator {
    //通知开始自动转动
    public static START_AUTO_SPIN:string = "onStartAutoSpin";

    getCommands():string[] {
        return [MainMediator.GAIN_FREE_SPIN, MainMediator.GAIN_SPECIAL_GAME, MainMediator.GAIN_MONEY_COUNT, MainMediator.BALANCE_CHANGE];
    }

    initView() {
        this.view = new AutoSpinUI();
    }

    onEnter():void {
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_AUTO_SPIN, this.view.onEnter, this.view);
    }

    onExit():void {
        this.view.onExit();
    }

    private onGainFreeSpin():void {
        if (Data.globalProxy.bStopAutoByFreeGame) {
            Data.globalProxy.autoSpinCount = 0;
            // ViewManager.alert(Game.getLanguage("stopAutoByFreeGame"));
        }
    }

    private onGainSpecialGame():void {
        if (Data.globalProxy.bStopAutoByFreeGame) {
            Data.globalProxy.autoSpinCount = 0;
            // ViewManager.alert(Game.getLanguage("stopAutoBySpecialGame"));
        }
    }

    private onGainMoneyCount(gainCount:number):void {
        gainCount = CommonUtil.valueFormatDecimals(gainCount, 2);
        if (Data.globalProxy.stopAutoBySingleWin > 0 && gainCount >= Data.globalProxy.stopAutoBySingleWin) {
            Data.globalProxy.autoSpinCount = 0;
            // egret.setTimeout(function () {
            //     ViewManager.alert(Game.getLanguage("stopAutoBySingleWin", gainCount, Data.globalProxy.stopAutoBySingleWin));
            // }, this, 2000)
        }
    }

    private onBalanceChange(currentBalance:number):void {
        Data.globalProxy.startAutoSpinBalance = CommonUtil.valueFormatDecimals(Data.globalProxy.startAutoSpinBalance, 2);
        currentBalance = CommonUtil.valueFormatDecimals(currentBalance, 2);
        var offset:number = CommonUtil.valueFormatDecimals(currentBalance - Data.globalProxy.startAutoSpinBalance, 2);
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
    }
}
