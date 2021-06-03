/**
 * 免费游戏结束后弹出的总结算面板
 */
class FreeSpinResultUICom extends eui.Component {
    public static instance:FreeSpinResultUICom;
    //freespin获奖总额结果里次数
    private freeSpinResultCountLab:eui.BitmapLabel;
    //freeSpin中奖总结果面板
    private freeSpinResultGroup:eui.Group;
    //freeSpin中奖总结果面板关闭按钮
    private freeSpinResultCloseBtn:eui.Button;
    //freespin结算面板倒计时
    private freeSpinResultCountDownLab:eui.Label;
    private freeSpinResultCountDownIcon:eui.Label;
    private freeSpinResultInterKey:number;
    private freeSpinResultCountDownSecond:number;
    //freeSpin中奖总金额Label
    private freeSpinResultLab:BounceBitmapLabel;

    public constructor() {
        super();
        FreeSpinResultUICom.instance = this;
        this.skinName = FreeSpinResultSkin;
    }

    protected createChildren():void {
        super.createChildren();
        this.freeSpinResultCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.freeSpinResultUIClose, this);
    }

    private freeSpinResultCountDown():void {
        this.freeSpinResultCountDownSecond--;
        if (this.freeSpinResultCountDownSecond < 0) {
            this.freeSpinResultUIClose();
            return;
        }
        this.freeSpinResultCountDownLab.visible = true;
        this.freeSpinResultCountDownLab.text = this.freeSpinResultCountDownSecond + "";
        this.freeSpinResultCountDownIcon.visible = true;
    }

    //freeSpin结果面板关闭时重置滚动区域
    private freeSpinResultUIClose():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.playMusic(SoundType.BG_MUSIC);
        SoundManager.instance.stopEffect(SoundType.FREE_SPIN_RESULT);
        Data.globalProxy.bInFreeSpinDisplay = false;
        SpinAreaUICom.instance.setSpinBG(true);
        ControlSpinUICom.instance.updateStatusByFreeSpin();
        egret.Tween.get(this).to({scaleX: 5, scaleY: 5, alpha: 0}, 300).call(function () {
            this.visible = false;
            ObserverManager.sendNotification(MainMediator.GAIN_MONEY_COUNT, Data.globalProxy.getFreeSpinTotalPay());
            this.freeSpinResultGroup.visible = false;
            this.freeSpinResultCountDownLab.visible = false;
            this.freeSpinResultCountDownIcon.visible = false;
            egret.clearInterval(this.freeSpinResultInterKey);
            MainUI.instance.nextSpinReady();
        }, this);
    }

    //显示freeSpin总结算面板
    public showTotalResult():void {
        this.visible = true;
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.scaleX = this.scaleY = 0;
        this.alpha = 0;
        egret.Tween.get(this).to({scaleX: 1, scaleY: 1, alpha: 1}, 200);
        
        if (Data.globalProxy.getFreeSpinTotalPay() != 0) {
            SoundManager.instance.playEffect(SoundType.FREE_SPIN_RESULT);
        }
        this.freeSpinResultGroup.visible = true;
        this.freeSpinResultCountLab.text = "" + Data.globalProxy.getFreespinTotalTimes();
        this.freeSpinResultCloseBtn.enabled = false;
        this.freeSpinResultCountDownLab.visible = false;
        this.freeSpinResultCountDownIcon.visible = false;
        this.freeSpinResultLab.tweenNum(0, Data.globalProxy.getFreeSpinTotalPay(),
            Data.globalProxy.getFreeSpinTotalPay() < SlotRhythmConst.FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION_COUNT
                ? SlotRhythmConst.FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION[0] : SlotRhythmConst.FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION[1])
            .wait(1000)
            .call(function () {
                this.freeSpinResultCountDownSecond = 6;
                this.freeSpinResultCountDown();
                this.freeSpinResultInterKey = egret.setInterval(this.freeSpinResultCountDown, this, 1000);
                this.freeSpinResultCloseBtn.enabled = true;
            }, this)
    }
}