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
 * bigWin
 */
var BigWinUI = (function (_super) {
    __extends(BigWinUI, _super);
    function BigWinUI() {
        var _this = _super.call(this) || this;
        _this.skinName = BigWinSkin;
        return _this;
    }
    BigWinUI.prototype.onEnter = function (awardLevel, awardCount) {
        //关闭不需要的其他界面
        ViewManager.instance.CLOSE_WINDOW(HelpMediator);
        this.awardLevel = awardLevel;
        ViewManager.instance.addElement(this);
        if (awardLevel == AWARD_LEVEL.BIG_WIN) {
            SoundManager.instance.playEffect(SoundType.BIGWIN_AWARD);
        }
        else if (awardLevel == AWARD_LEVEL.MEGA_WIN) {
            SoundManager.instance.playEffect(SoundType.MEGAWIN_AWARD);
        }
        this.awardLab.text = "0";
        this.awardLab.visible = false;
        this.awardLabBG.visible = false;
        this.armatureDisplay = dragonBones.EgretFactory.factory.buildArmatureDisplay("Slots_bigwin");
        this.animationGroup.addChildAt(this.armatureDisplay, 0);
        this.armatureDisplay.x = this.animationGroup.width / 2;
        this.armatureDisplay.y = this.animationGroup.height / 2 - 35;
        this.armatureDisplay.addEventListener(egret.Event.COMPLETE, this.onMovieComplete, this);
        this.armatureDisplay.animation.play(awardLevel + "_start", 1);
        this.intervalKey = egret.setInterval(function () {
            this.coinSpray();
        }, this, 10);
        egret.setTimeout(function () {
            this.awardLabBG.visible = true;
            this.awardLab.visible = true;
            var width = ((awardCount + "").length + 1) * 76;
            this.awardLabBG.width = (width > this.awardLabBG.texture.textureWidth) ? width : this.awardLabBG.texture.textureWidth;
            var sprayCoinTime = awardCount > SlotRhythmConst.BIG_WIN_VALUE_BOUNCE_DURATION_COUNT
                ? SlotRhythmConst.BIG_WIN_VALUE_BOUNCE_DURATION[1] : SlotRhythmConst.BIG_WIN_VALUE_BOUNCE_DURATION[0];
            this.awardLab.tweenNum(0, awardCount, sprayCoinTime).call(function () {
                SoundManager.instance.playEffect(SoundType.WIN_LAB_NUMBER_END);
                egret.clearInterval(this.intervalKey);
            }, this)
                .wait(SlotRhythmConst.BIG_WIN_CLOSE_DELAY_VALUE_BOUNCE)
                .call(function () {
                this.armatureDisplay.animation.play(awardLevel + "_end", 1);
            }, this);
            //等钱的数量跳动完时，才在winLab显示这局赢了多少
            var winLabEnd = Data.globalProxy.payout;
            if (Data.globalProxy.getFreeSpinTotalPay() != 0) {
                winLabEnd = Data.globalProxy.getFreeSpinTotalPay();
            }
            ObserverManager.sendNotification(MainMediator.WIN_LAB_BOUNCE, -1, winLabEnd, sprayCoinTime);
            ObserverManager.sendNotification(MainMediator.SELF_MONEY_INCREASE, sprayCoinTime);
        }, this, SlotRhythmConst.BIG_WIN_VALUE_BOUNCE_DELAY_OPEN);
    };
    BigWinUI.prototype.onExit = function () {
        ViewManager.instance.removeElement(this);
        ObserverManager.sendNotification(MainMediator.BIGWIN_AWARD_COUNT_OVER);
        this.armatureDisplay.removeEventListener(egret.Event.COMPLETE, this.onMovieComplete, this);
        this.armatureDisplay.animation.stop();
        this.armatureDisplay.dispose();
        this.armatureDisplay.parent.removeChild(this.armatureDisplay);
        this.armatureDisplay = null;
    };
    BigWinUI.prototype.onMovieComplete = function (e) {
        var clipName = e.target.animation.lastAnimationName;
        if (clipName == this.awardLevel + "_start") {
            this.armatureDisplay.animation.play(this.awardLevel + "_idle", 1);
        }
        else if (clipName == this.awardLevel + "_idle") {
            this.armatureDisplay.animation.play(this.awardLevel + "_idle", 1);
        }
        else if (clipName == (this.awardLevel + "_end")) {
            ViewManager.instance.CLOSE_WINDOW(BigWinMediator);
        }
    };
    //中freeSpin时的掉金币动画
    BigWinUI.prototype.coinSpray = function () {
        var coinObj = ObjectPoolManager.getObject(CoinPoolObject);
        var maxScale = 1.5;
        var minScale = maxScale / 3;
        coinObj.scaleX = coinObj.scaleY = CommonUtil.randomInteger(minScale, maxScale, false);
        var layer = coinObj.scaleX >= maxScale * 0.9 ? (this.getChildIndex(this.animationGroup) + 1) : this.getChildIndex(this.animationGroup);
        this.addChildAt(coinObj, layer);
        coinObj.x = CommonUtil.randomInteger(-100, coinObj.parent.width + 100);
        coinObj.y = CommonUtil.randomInteger(-100, -200);
        coinObj.rotation = CommonUtil.randomInteger(0, 360);
        egret.Tween.get(coinObj).to({ y: coinObj.parent.height + 500 }, 1300 / coinObj.scaleX, egret.Ease.cubicIn).call(function () {
            this.parent.removeChild(this);
        }, coinObj);
        var movie = coinObj.getCoinMC();
        movie.gotoAndPlay(CommonUtil.randomInteger(0, movie.totalFrames), -1);
    };
    return BigWinUI;
}(eui.Component));
__reflect(BigWinUI.prototype, "BigWinUI", ["IGameUI"]);
//# sourceMappingURL=BigWinUI.js.map