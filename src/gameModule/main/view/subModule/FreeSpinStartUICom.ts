/**
 * 选择次数后，弹出的提示UI
 */
class FreeSpinStartUICom extends eui.Component {
    public static instance:FreeSpinStartUICom;
    private freeSpinStartCloseBtn:eui.Button;
    //freeSpin结算面板倒计时
    private freeSpinStartCountDownLab:eui.Label;
    private freeSpinStartCountDownIcon:eui.Label;
    private freeSpinStartInterKey:number;
    private freeSpinStartCountDownSecond:number;
    //freeSpin次数
    private freeSpinStartCountLab:eui.BitmapLabel;

    public constructor() {
        super();
        FreeSpinStartUICom.instance = this;
        this.skinName = FreeSpinStartSkin;
    }

    protected createChildren():void {
        super.createChildren();
        this.freeSpinStartCloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.freeSpinStartUIClose, this);
    }

    private freeSpinStartCountDown():void {
        this.freeSpinStartCountDownSecond--;
        if (this.freeSpinStartCountDownSecond < 0) {
            this.freeSpinStartUIClose();
            return;
        }
        this.freeSpinStartCountDownLab.visible = true;
        this.freeSpinStartCountDownLab.text = this.freeSpinStartCountDownSecond + "";
        this.freeSpinStartCountDownIcon.visible = true;
    }
    
    private freeSpinStartUIClose():void {
        SoundManager.instance.playMusic(SoundType.BG_MUSIC_FREE_SPIN);
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.stopEffect(SoundType.FREE_SPIN_START);
        this.freeSpinStartCountDownLab.visible = false;
        this.freeSpinStartCountDownIcon.visible = false;
        egret.clearInterval(this.freeSpinStartInterKey);
        ObserverManager.sendNotification(MainMediator.START_FREE_SPIN);

        egret.Tween.get(this).to({scaleX: 5, scaleY: 5, alpha: 0}, 300).call(function () {
            this.visible = false;
        }, this);
    }

    //显示freeSpin总结算面板
    public show():void {
        SoundManager.instance.playEffect(SoundType.FREE_SPIN_START);
        this.visible = true;
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.scaleX = this.scaleY = 0;
        this.alpha = 0;
        egret.Tween.get(this).to({scaleX: 1, scaleY: 1, alpha: 1}, 200);

        this.freeSpinStartCountLab.text = "" + Data.globalProxy.getFreespinTotalTimes();
        this.freeSpinStartCountDownLab.visible = false;
        this.freeSpinStartCountDownIcon.visible = false;

        this.freeSpinStartCountDownSecond = 6;
        this.freeSpinStartCountDown();
        this.freeSpinStartInterKey = egret.setInterval(this.freeSpinStartCountDown, this, 1000);
    }
}