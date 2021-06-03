/**
 * 控制台
 */
class ControlSpinUICom extends eui.Component {
    public static instance:ControlSpinUICom;
    //账户余额货币类型
    private balanceTypeLab:eui.Label;
    //账户余额
    private balanceLab:BounceLabel;
    //当前轮次总下注图标
    private totalWagerIcon:eui.Image;
    //当前轮次总下注
    private totalWagerLab:eui.Label;
    //每线下注的金额
    private wagerPerLineLab:eui.Label;
    //满额满注按钮
    private maxWagerBtn:eui.Button;
    //赔付表按钮
    private payTableBtn:eui.Button;
    //自动游戏按钮
    private autoSpinBtn:eui.Button;
    //停止自动游戏按钮
    private stopAutoSpinBtn:eui.Button;
    //减小下注额度按钮
    private wagerDeDuctBtn:eui.Button;
    //增大下注额度按钮
    private wagerPlusBtn:eui.Button;
    //开始转动按钮
    private startSpinBtn:eui.Button;
    //停止转动按钮
    private stopSpinBtn:eui.Button;
    //赢的数值lab
    public winLab:BounceBitmapLabel;
    //自动剩余次数lab
    private autoCountLab:eui.Label;
    //freeSpin下的标题
    private freeSpinIcon:eui.Image;
    //freeSpin下的剩余次数
    private freespinCountLab:eui.BitmapLabel;

    public constructor() {
        super();
        ControlSpinUICom.instance = this;
        this.skinName = ControlSpinSkin;
    }

    protected createChildren():void {
        super.createChildren();
        this.startSpinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStartTouch, this);
        this.autoSpinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAutoBtn, this);
        this.stopAutoSpinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopAutoTouch, this);
        this.wagerDeDuctBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWagerDeDuctBtn, this);
        this.wagerPlusBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWagerPlusBtn, this);
        this.maxWagerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaxWager, this);
        this.stopSpinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopTouch, this);
        this.payTableBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
            ViewManager.instance.OPEN_WINDOW(HelpMediator, true);
        }, this);
    }

    public initUI():void {
        if (Data.globalProxy.getFreespinCount() > 0) {
            Data.globalProxy.bInFreeSpinDisplay = true;
        } else {
            Data.globalProxy.bInFreeSpinDisplay = false;
        }
        this.resetControlUI();
        this.balanceTypeLab.text = Data.globalProxy.getCurrencyType() + ":";
        this.balanceLab.text = Data.globalProxy.getBalance() + "";
        this.updateWagerPerLineLab();
        //是否处于freeGame状态
        this.changeSpinBtnState(Data.globalProxy.getFreespinCount() > 0 ? SPIN_STATE.FREE_SPIN : SPIN_STATE.READY_SPIN);
    }

    public onTouchAutoBtn():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.OPEN_WINDOW(AutoSpinMediator, true);
    }

    public stopAutoTouch():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        this.stopTouch();
        Data.globalProxy.autoSpinCount = 0;
    }

    private onWagerDeDuctBtn():void {
        SoundManager.instance.playEffect(SoundType.BETDOWN_CLICK);
        Data.globalProxy.deductWagerIndex();
        this.updateWagerPerLineLab();
    }

    private onWagerPlusBtn():void {
        SoundManager.instance.playEffect(SoundType.BETUP_CLICK);
        Data.globalProxy.plusWagerIndex();
        this.updateWagerPerLineLab();
    }

    private onMaxWager():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        Data.globalProxy.plusWagerIndex(true);
        this.updateWagerPerLineLab();
        MainUI.instance.clientStartSpin();
    }

    private onStartTouch():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        MainUI.instance.clientStartSpin();
    }

    private stopTouch():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        MainUI.instance.forceStop();
    }


    //根据当前下注额度索引，刷新界面的下注值
    private updateWagerPerLineLab():void {
        this.wagerPerLineLab.text = Data.globalProxy.getWagerPerLine() + "";
        this.totalWagerLab.text = "" + Data.globalProxy.getTotalWager();
        this.wagerDeDuctBtn.enabled = true;
        this.wagerPlusBtn.enabled = true;
        this.maxWagerBtn.enabled = true;
        var wagerIndex:number = Data.globalProxy.getWagerPerLineIndex();
        var wagerIndexMax:number = Data.globalProxy.getWagerPerLineMax();
        if (wagerIndex == 0) {
            this.wagerDeDuctBtn.enabled = false;
        } else if (wagerIndex == (wagerIndexMax - 1)) {
            this.wagerPlusBtn.enabled = false;
            this.maxWagerBtn.enabled = false;
        }
    }

    //根据状态，修改界面各按钮的状态
    public changeSpinBtnState(state:SPIN_STATE):void {
        //“自动”按钮
        this.autoSpinBtn.visible = (state == SPIN_STATE.AUTO_SPINNING || state == SPIN_STATE.AUTO_STOP_ING) ? false : true;
        if (state == SPIN_STATE.SPINNING || state == SPIN_STATE.STOP_ING) {
            this.autoSpinBtn.enabled = false;
        } else {
            this.autoSpinBtn.enabled = this.autoSpinBtn.visible;
        }
        this.autoSpinBtn.filters = this.autoSpinBtn.enabled ? null : [CommonUtil.greyColorFlilter];
        //“停止自动”按钮
        this.stopAutoSpinBtn.visible = !this.autoSpinBtn.visible;
        if (state == SPIN_STATE.AUTO_STOP_ING) {
            this.stopAutoSpinBtn.enabled = false;
        } else {
            this.stopAutoSpinBtn.enabled = this.stopAutoSpinBtn.visible;
        }
        this.stopAutoSpinBtn.filters = this.stopAutoSpinBtn.enabled ? null : [CommonUtil.greyColorFlilter];
        if (this.stopAutoSpinBtn.visible) {
            this.stopAutoSpinBtn["autoCountLab"].text = Data.globalProxy.autoSpinCount == -1 ?
                Game.getLanguage("autoSpinMax") : Data.globalProxy.autoSpinCount + "";
        }
        //“开始”按钮
        this.startSpinBtn.visible = (state == SPIN_STATE.READY_SPIN || state == SPIN_STATE.STOP_ING) ? true : false;
        if (state == SPIN_STATE.STOP_ING) {
            this.startSpinBtn.enabled = false;
        } else {
            this.startSpinBtn.enabled = this.startSpinBtn.visible;
        }
        //“停止”按钮
        this.stopSpinBtn.visible = !this.startSpinBtn.visible;
        if (state == SPIN_STATE.STOP_ING || this.stopAutoSpinBtn.visible || state == SPIN_STATE.AUTO_STOP_ING) {
            this.stopSpinBtn.enabled = false;
        } else {
            this.stopSpinBtn.enabled = this.stopSpinBtn.visible;
        }
        //下注- 下注+  满额下注  这3个按钮
        var wagerIndex:number = Data.globalProxy.getWagerPerLineIndex();
        var wagerIndexMax:number = Data.globalProxy.getWagerPerLineMax();
        if (wagerIndex == 0) {
            this.wagerDeDuctBtn.enabled = false;
        } else if (wagerIndex == (wagerIndexMax - 1)) {
            this.wagerPlusBtn.enabled = false;
            this.maxWagerBtn.enabled = false;
        }
        this.wagerDeDuctBtn.enabled = (state == SPIN_STATE.READY_SPIN) && (wagerIndex != 0);
        this.wagerPlusBtn.enabled = (state == SPIN_STATE.READY_SPIN) && (wagerIndex != (wagerIndexMax - 1));
        this.maxWagerBtn.enabled = (state == SPIN_STATE.READY_SPIN) && (wagerIndex != (wagerIndexMax - 1));

        //如果是在免费游戏中，那么全部禁用
        if (state == SPIN_STATE.FREE_SPIN) {
            //“开始”按钮
            this.startSpinBtn.enabled = false;
            //“停止”按钮
            this.stopSpinBtn.enabled = false;
            //“自动”按钮
            this.autoSpinBtn.enabled = false;
            this.autoSpinBtn.filters = [CommonUtil.greyColorFlilter];
            //“停止自动”按钮
            this.stopAutoSpinBtn.enabled = false;
            this.stopAutoSpinBtn.filters = [CommonUtil.greyColorFlilter];
            //“满额押注”按钮
            this.maxWagerBtn.enabled = false;
            //“下注-”按钮
            this.wagerDeDuctBtn.enabled = false;
            //“下注+”按钮
            this.wagerPlusBtn.enabled = false;
        }
    }

    //向后台发送转动时扣除前台金额
    public deductSpinMoney():void {
        if (Data.globalProxy.bInFreeSpinDisplay) return;
        var deductBalance:number = Data.globalProxy.getTotalWager();
        Data.globalProxy.deductBalance(deductBalance);
        var balance:number = Data.globalProxy.getBalance();
        this.balanceLab.text = CommonUtil.valueFormatDecimals(balance, 2) + "";
    }

    //根据是否是在freeSpin中，显示 总押注 或 免费次数
    public updateStatusByFreeSpin():void {
        var bFreeSpin:boolean = Data.globalProxy.bInFreeSpinDisplay;
        this.totalWagerIcon.visible = !bFreeSpin;
        this.totalWagerLab.visible = !bFreeSpin;

        this.freeSpinIcon.visible = bFreeSpin;
        this.freespinCountLab.visible = bFreeSpin;
        if (bFreeSpin) {
            this.freespinCountLab.text = Data.globalProxy.getFreespinCount() + "";
            this.winLab.text = CommonUtil.valueFormatDecimals(Data.globalProxy.getFreeSpinTotalPay(), 2) + "";
        } else {
            this.winLab.text = 0 + "";
        }
    }

    public updateFreeSpinCount():void {
        this.freespinCountLab.text = Data.globalProxy.getFreespinCount() + "";
        CommonUtil.getSlotShakeTween(this.freespinCountLab);
    }

    //“赢得”Lab的值的跳动（如果小于，则从当前值开始）
    public winLabBounce(start:number, end:number, duringTime:number):egret.Tween {
        if (start < 0) start = +this.winLab.text;
        egret.Tween.get(this.winLab).to({scaleX: 2, scaleY: 2}, 200).wait(100).to({
            scaleX: 1,
            scaleY: 1
        }, 200);
        return this.winLab.tweenNum(start, end, duringTime);
    }

    //刷新玩家自己的金额
    public selfMoneyIncrease(durationTime:number):void {
        var startBalance:number = +this.balanceLab.text;
        var endBalance:number = Data.globalProxy.getBalance();
        if (Math.abs(startBalance - endBalance) > 0) {
            this.balanceLab.tweenNum(startBalance, endBalance, durationTime);
            var intervalKey = egret.setInterval(function () {
                SoundManager.instance.playEffect(SoundType.WIN_LAB_NUMBER);
            }, this, 70);
            egret.setTimeout(function () {
                egret.clearInterval(intervalKey);
            }, this, durationTime);
        }
        ObserverManager.sendNotification(MainMediator.GAIN_MONEY_COUNT, (endBalance - startBalance));
        ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
    }

    //重置相关的状态
    public resetControlUI():void {
        this.updateStatusByFreeSpin();
    }
}