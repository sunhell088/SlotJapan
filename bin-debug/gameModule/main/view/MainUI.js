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
 * 游戏逻辑模块的UI
 */
var MainUI = (function (_super) {
    __extends(MainUI, _super);
    function MainUI() {
        var _this = _super.call(this) || this;
        //转动停止时执行获取转动结果的延时器
        _this.getSpinResultTimeKey = 0;
        MainUI.instance = _this;
        _this.skinName = MainUISkin;
        return _this;
    }
    MainUI.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    MainUI.prototype.onExit = function () {
        ViewManager.instance.removeElement(this);
    };
    MainUI.prototype.onEnter = function () {
        ViewManager.instance.addElement(this);
        this.controlSpinUICom.initUI();
        this.spinAreaUICom.initUI();
        this.freeSpinResultUICom.visible = false;
        this.freeSpinStartUICom.visible = false;
        this.prizeEffectUICom.visible = false;
        this.sceneLeafParticle = new particle.GravityParticleSystem(RES.getRes("sceneLeaf_png"), RES.getRes("sceneLeaf_json"));
        this.addChild(this.sceneLeafParticle);
        this.sceneLeafParticle.start();
        if (Data.globalProxy.newFreespinStatus) {
            ViewManager.instance.OPEN_WINDOW(FreeGameSelectMediator, true);
        }
        else {
            if (Data.globalProxy.getFreespinCount() > 0) {
                Data.globalProxy.bInFreeSpinDisplay = true;
                SoundManager.instance.playMusic(SoundType.BG_MUSIC_FREE_SPIN);
            }
            else {
                Data.globalProxy.bInFreeSpinDisplay = false;
                SoundManager.instance.playMusic(SoundType.BG_MUSIC);
            }
            egret.setTimeout(function () {
                this.nextSpinReady();
            }, this, (Data.globalProxy.getFreespinCount() > 0) ? SlotRhythmConst.LOGIN_FREE_SPIN_START_DELAY : 0);
        }
        SilentLoadResManager.instance.startSilentLoad(); //开始静默预加载
        ViewManager.instance.hideLoading();
    };
    //收到自动游戏模块的开始自动转动命令
    MainUI.prototype.onStartAutoSpin = function () {
        this.clientStartSpin();
    };
    //收到服务器端转动结果，开始停止动画
    MainUI.prototype.onS2CSpinResult = function () {
        this.spinAreaUICom.playStopAnimation();
        if (Data.globalProxy.bInFreeSpinDisplay) {
            this.controlSpinUICom.updateFreeSpinCount();
        }
    };
    //“赢得”Lab的值的跳动（如果小于，则从当前值开始）
    MainUI.prototype.onWinLabBounce = function (start, end, duringTime) {
        this.controlSpinUICom.winLabBounce(start, end, duringTime);
    };
    //刷新玩家自己的金额
    MainUI.prototype.onSelfMoneyIncrease = function (durationTime) {
        this.controlSpinUICom.selfMoneyIncrease(durationTime);
    };
    //后台通知已经选择好freeSpinType
    MainUI.prototype.onStartFreeSpin = function () {
        Data.globalProxy.bInFreeSpinDisplay = true;
        this.spinAreaUICom.setSpinBG(false);
        this.controlSpinUICom.updateStatusByFreeSpin();
        egret.setTimeout(function () {
            this.nextSpinReady();
        }, this, SlotRhythmConst.FREE_SPIN_SELECT_TO_START_DELAY);
    };
    //转动彻底停止
    MainUI.prototype.onSpinOver = function () {
        SoundManager.instance.stopEffect(SoundType.SPIN);
        //这时设置状态为转动停止缓动中
        var btnState;
        if (Data.globalProxy.bInFreeSpinDisplay) {
            btnState = SPIN_STATE.FREE_SPIN;
        }
        else {
            btnState = (Data.globalProxy.getAutoState() == AUTO_SPIN_STATE.NON_AUTO) ?
                SPIN_STATE.STOP_ING : SPIN_STATE.AUTO_STOP_ING;
        }
        this.controlSpinUICom.changeSpinBtnState(btnState);
        //如果有中奖执行中奖动画
        if (Data.globalProxy.payout > 0) {
            //检查是否中了全屏wild，并且播放
            if (Data.globalProxy.isAllWild()) {
                this.spinAreaUICom.playAllWildEffect();
            }
            else {
                this.prizeEffectUICom.playPrizeEffect();
            }
        }
        else {
            this.nextSpinReady();
        }
    };
    //bigwin的奖励动画播放完毕
    MainUI.prototype.onBigWinAwardCountOver = function () {
        this.spinAreaUICom.startPlayWinSlotBlink();
        egret.setTimeout(MainUI.instance.nextSpinReady, this, 1000);
    };
    //为下一次转动准备
    MainUI.prototype.nextSpinReady = function () {
        //中freeSpin的庆祝动画
        if (Data.globalProxy.newFreespinStatus) {
            egret.setTimeout(function () {
                this.spinAreaUICom.playHitFreeSpinEffect();
            }, this, SlotRhythmConst.HIT_FREESPIN_EFFECT_DELAY);
        }
        else if (Data.globalProxy.getFreespinCount() == 0 && Data.globalProxy.bInFreeSpinDisplay) {
            egret.setTimeout(function () {
                this.freeSpinResultUICom.showTotalResult();
            }, this, SlotRhythmConst.FREESPIN_TOTAL_RESULT_DELAY);
        }
        else {
            var wagerState = SPIN_STATE.READY_SPIN;
            if (Data.globalProxy.bInFreeSpinDisplay) {
                wagerState = SPIN_STATE.FREE_SPIN;
            }
            else if (Data.globalProxy.getAutoState() != AUTO_SPIN_STATE.NON_AUTO) {
                wagerState = SPIN_STATE.AUTO_SPINNING;
            }
            if (Data.globalProxy.getAutoState() != AUTO_SPIN_STATE.NON_AUTO) {
                this.clientStartSpin();
            }
            else {
                this.controlSpinUICom.changeSpinBtnState(wagerState);
            }
        }
    };
    //前端开始转动
    MainUI.prototype.clientStartSpin = function () {
        Data.globalProxy.bForceStop = false;
        this.spinAreaUICom.resetSpinAreaUI();
        this.controlSpinUICom.resetControlUI();
        //非freespin状态下，需判断余额 和 扣自动次数
        if (!Data.globalProxy.bInFreeSpinDisplay) {
            if (!Data.globalProxy.checkBalance()) {
                ViewManager.alert(Game.getLanguage("moneyNotEnough"));
                this.controlSpinUICom.changeSpinBtnState(SPIN_STATE.READY_SPIN);
                return;
            }
            if (Data.globalProxy.autoSpinCount > 0) {
                Data.globalProxy.autoSpinCount--;
            }
        }
        else {
            Data.globalProxy.deductFreespinCount();
        }
        this.controlSpinUICom.deductSpinMoney();
        //获得控制台按钮状态
        var btnState;
        if (Data.globalProxy.bInFreeSpinDisplay) {
            btnState = SPIN_STATE.FREE_SPIN;
        }
        else {
            btnState = (Data.globalProxy.getAutoState() == AUTO_SPIN_STATE.NON_AUTO) ? SPIN_STATE.SPINNING : SPIN_STATE.AUTO_SPINNING;
        }
        this.controlSpinUICom.changeSpinBtnState(btnState);
        //自动和普通转动持续时间不一样
        var spinDurationTime = (Data.globalProxy.getAutoState() != AUTO_SPIN_STATE.NON_AUTO)
            ? SlotRhythmConst.AUTO_SPIN_DURATION_TIME : SlotRhythmConst.SPIN_DURATION_TIME;
        this.getSpinResultTimeKey = egret.setTimeout(function () {
            //时间到了向后台发送获取结果后，避免多次发送
            this.getSpinResultTimeKey = null;
            MessageUtil.C2S_GetSpinResult(Data.globalProxy.bInFreeSpinDisplay, Data.globalProxy.getWagerPerLine());
        }, this, spinDurationTime);
        Data.globalProxy.bClientAlreadySpin = true;
        this.spinAreaUICom.startSpin();
    };
    //手动提前点停止
    MainUI.prototype.forceStop = function () {
        Data.globalProxy.bForceStop = true;
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        var btnState = (Data.globalProxy.getAutoState() == AUTO_SPIN_STATE.NON_AUTO)
            ? SPIN_STATE.STOP_ING : SPIN_STATE.AUTO_STOP_ING;
        this.controlSpinUICom.changeSpinBtnState(btnState);
        if (this.getSpinResultTimeKey != null) {
            MessageUtil.C2S_GetSpinResult(Data.globalProxy.bInFreeSpinDisplay, Data.globalProxy.getWagerPerLine());
            egret.clearTimeout(this.getSpinResultTimeKey);
        }
    };
    return MainUI;
}(eui.Component));
__reflect(MainUI.prototype, "MainUI", ["IGameUI"]);
//# sourceMappingURL=MainUI.js.map