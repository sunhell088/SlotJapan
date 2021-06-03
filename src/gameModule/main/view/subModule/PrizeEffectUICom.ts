/**
 * 奖励效果区
 */
class PrizeEffectUICom extends eui.Component {
    public static instance:PrizeEffectUICom;
    //赢的时候金币爆破奖励数值lab
    private winCoinDropLab:BounceBitmapLabel;
    //中奖时的金币爆破效果
    private winCoinBomb:dragonBones.Movie;
    //五星连珠效果
    private fiveStarsMovie:dragonBones.Movie;

    public constructor() {
        super();
        PrizeEffectUICom.instance = this;
        this.skinName = PrizeEffectSkin;
    }

    protected createChildren():void {
        super.createChildren();
        this.winCoinDropLab.visible = false;

        this.winCoinBomb = dragonBones.buildMovie("armatureName");
        this.winCoinBomb.addEventListener(dragonBones.EventObject.COMPLETE, function () {
            this.visible = false;
            if (this.winCoinBomb.parent) this.winCoinBomb.parent.removeChild(this.winCoinBomb);
        }, this);
        // this.fiveStarsMovie = dragonBones.buildMovie("animation_fiveStars");
        // this.fiveStarsMovie.addEventListener(dragonBones.EventObject.COMPLETE, this.onFiveStarsMovieComplete, this);
    }

    //播放中奖效果
    public playPrizeEffect():void {
        //艺伎回忆录 中奖不需要播放特殊格子动画
        // SpinAreaUICom.instance.playSpecialSlotEffect();
        //检查是否中了五星连珠，并且播放
        if (Data.globalProxy.isFiveStars()) {
            this.visible = true;
            this.addChild(this.fiveStarsMovie);
            this.fiveStarsMovie.alpha = 1;
            this.fiveStarsMovie.play("start");
            this.fiveStarsMovie.x = this.fiveStarsMovie.parent.width / 2;
            this.fiveStarsMovie.y = this.fiveStarsMovie.parent.height / 2 - 40;
            SoundManager.instance.playEffect(SoundType.FIVE_KIND);
        } else {
            SpinAreaUICom.instance.slotWinAnimation();
        }
    }

    //五星连珠动画播放完毕后
    private onFiveStarsMovieComplete():void {
        egret.Tween.get(this.fiveStarsMovie).to({alpha: 0}, 300)
            .call(function () {
                egret.Tween.removeTweens(this.fiveStarsMovie);
                this.fiveStarsMovie.stop();
                if (this.fiveStarsMovie.parent) this.fiveStarsMovie.parent.removeChild(this.fiveStarsMovie);
                SpinAreaUICom.instance.slotWinAnimation();
            }, this);
    }

    //开始播放中奖金额爆炸出来的动画 或者 bigwin动画
    public awardValueExplode(awardLevel:AWARD_LEVEL):void {
        if (awardLevel == AWARD_LEVEL.NORMAL) {
            this.visible = true;
            this.playWinCoinBombEffect("3", Data.globalProxy.payout);
            var startWinLab:number = 0;
            var endWinLab:number = Data.globalProxy.payout;
            if (Data.globalProxy.getFreeSpinTotalPay() != 0) {
                startWinLab = +ControlSpinUICom.instance.winLab.text;
                endWinLab = Data.globalProxy.getFreeSpinTotalPay();
            }
            ControlSpinUICom.instance.selfMoneyIncrease(350);
            ControlSpinUICom.instance.winLabBounce(startWinLab, endWinLab, 350);
        } else {
            ViewManager.instance.OPEN_WINDOW(BigWinMediator, true, awardLevel, Data.globalProxy.payout);
        }
    }

    //中奖时金币爆炸
    private playWinCoinBombEffect(type:string, count:number):void {
        if (type == "") {
            SoundManager.instance.playEffect(SoundType.NORMAL_WIN_AWARD1);
        } else if (type == "2") {
            SoundManager.instance.playEffect(SoundType.NORMAL_WIN_AWARD2);
        } else if (type == "3") {
            SoundManager.instance.playEffect(SoundType.NORMAL_WIN_AWARD3);
        }

        this.addChildAt(this.winCoinBomb, this.getChildIndex(this.winCoinDropLab));
        this.winCoinBomb.play("animation" + type); // 播放动画
        this.winCoinBomb.x = this.winCoinBomb.parent.width / 2;
        this.winCoinBomb.y = this.winCoinBomb.parent.height / 2;

        this.winCoinDropLab.visible = true;
        this.winCoinDropLab.horizontalCenter = 0;
        this.winCoinDropLab.verticalCenter = 0;
        this.winCoinDropLab.text = "+" + CommonUtil.valueFormatDecimals(count, 2);
        this.winCoinDropLab.scaleX = this.winCoinDropLab.scaleY = 10;
        egret.Tween.get(this.winCoinDropLab).to({scaleX: 1, scaleY: 1}, 200, egret.Ease.cubicOut).wait(1000)
            .to({verticalCenter: 238}, 350).call(function () {
            this.winCoinDropLab.visible = false;
            egret.Tween.removeTweens(this.winCoinDropLab);
            MainUI.instance.nextSpinReady();
        }, this);
    }
}