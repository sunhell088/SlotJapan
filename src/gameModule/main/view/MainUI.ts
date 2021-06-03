/**
 * 游戏逻辑模块的UI
 */
class MainUI extends eui.Component implements IGameUI {
    public static instance:MainUI;
    //控制台
    private controlSpinUICom:ControlSpinUICom;
    //转动区
    private spinAreaUICom:SpinAreaUICom;
    //免费游戏结果
    private freeSpinResultUICom:FreeSpinResultUICom;
    //免费游戏次数选择完毕的提示板
    private freeSpinStartUICom:FreeSpinStartUICom;
    //奖励效果区
    private prizeEffectUICom:PrizeEffectUICom;
    //转动停止时执行获取转动结果的延时器
    private getSpinResultTimeKey:number = 0;
    //场景的树叶效果
    private sceneLeafParticle:particle.GravityParticleSystem;

    public constructor() {
        super();
        MainUI.instance = this;
        this.skinName = MainUISkin;
    }

    protected createChildren() {
        super.createChildren();
    }

    public onExit():void {
        ViewManager.instance.removeElement(this);
    }

    public onEnter():void {
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
        } else {
            if (Data.globalProxy.getFreespinCount() > 0) {
                Data.globalProxy.bInFreeSpinDisplay = true;
                SoundManager.instance.playMusic(SoundType.BG_MUSIC_FREE_SPIN);
            } else {
                Data.globalProxy.bInFreeSpinDisplay = false;
                SoundManager.instance.playMusic(SoundType.BG_MUSIC);
            }
            egret.setTimeout(function () {
                this.nextSpinReady();
            }, this, (Data.globalProxy.getFreespinCount() > 0) ? SlotRhythmConst.LOGIN_FREE_SPIN_START_DELAY : 0);
        }
        SilentLoadResManager.instance.startSilentLoad(); //开始静默预加载
        ViewManager.instance.hideLoading();
    }

    //收到自动游戏模块的开始自动转动命令
    public onStartAutoSpin():void {
        this.clientStartSpin();
    }

    //收到服务器端转动结果，开始停止动画
    public onS2CSpinResult():void {
        this.spinAreaUICom.playStopAnimation();
        if (Data.globalProxy.bInFreeSpinDisplay) {
            this.controlSpinUICom.updateFreeSpinCount();
        }
    }

    //“赢得”Lab的值的跳动（如果小于，则从当前值开始）
    public onWinLabBounce(start:number, end:number, duringTime:number):void {
        this.controlSpinUICom.winLabBounce(start, end, duringTime);
    }

    //刷新玩家自己的金额
    public onSelfMoneyIncrease(durationTime:number):void {
        this.controlSpinUICom.selfMoneyIncrease(durationTime);
    }

    //后台通知已经选择好freeSpinType
    public onStartFreeSpin():void {
        Data.globalProxy.bInFreeSpinDisplay = true;
        this.spinAreaUICom.setSpinBG(false);
        this.controlSpinUICom.updateStatusByFreeSpin();
        egret.setTimeout(function () {
            this.nextSpinReady();
        }, this, SlotRhythmConst.FREE_SPIN_SELECT_TO_START_DELAY);
    }

    //转动彻底停止
    public onSpinOver():void {
        SoundManager.instance.stopEffect(SoundType.SPIN);
        //这时设置状态为转动停止缓动中
        var btnState:SPIN_STATE;
        if (Data.globalProxy.bInFreeSpinDisplay) {
            btnState = SPIN_STATE.FREE_SPIN;
        } else {
            btnState = (Data.globalProxy.getAutoState() == AUTO_SPIN_STATE.NON_AUTO) ?
                SPIN_STATE.STOP_ING : SPIN_STATE.AUTO_STOP_ING;
        }
        this.controlSpinUICom.changeSpinBtnState(btnState);

        //如果有中奖执行中奖动画
        if (Data.globalProxy.payout > 0) {
            //检查是否中了全屏wild，并且播放
            if (Data.globalProxy.isAllWild()) {
                this.spinAreaUICom.playAllWildEffect();
            } else {
                this.prizeEffectUICom.playPrizeEffect();
            }
        } else {
            this.nextSpinReady();
        }

    }

    //bigwin的奖励动画播放完毕
    public onBigWinAwardCountOver():void {
        this.spinAreaUICom.startPlayWinSlotBlink();
        egret.setTimeout(MainUI.instance.nextSpinReady, this, 1000);
    }

    //为下一次转动准备
    public nextSpinReady():void {
        //中freeSpin的庆祝动画
        if (Data.globalProxy.newFreespinStatus) {
            egret.setTimeout(function () {
                this.spinAreaUICom.playHitFreeSpinEffect();
            }, this, SlotRhythmConst.HIT_FREESPIN_EFFECT_DELAY);
        }
        //freespin最后一次转完后，弹出结算面板
        else if (Data.globalProxy.getFreespinCount() == 0 && Data.globalProxy.bInFreeSpinDisplay) {
            egret.setTimeout(function () {
                this.freeSpinResultUICom.showTotalResult();
            }, this, SlotRhythmConst.FREESPIN_TOTAL_RESULT_DELAY);
        }
        //普通奖励阶段结算，开始下一轮
        else {
            var wagerState:SPIN_STATE = SPIN_STATE.READY_SPIN;
            if (Data.globalProxy.bInFreeSpinDisplay) {
                wagerState = SPIN_STATE.FREE_SPIN;
            } else if (Data.globalProxy.getAutoState() != AUTO_SPIN_STATE.NON_AUTO) {
                wagerState = SPIN_STATE.AUTO_SPINNING;
            }

            if (Data.globalProxy.getAutoState() != AUTO_SPIN_STATE.NON_AUTO) {
                this.clientStartSpin();
            } else {
                this.controlSpinUICom.changeSpinBtnState(wagerState);
            }
        }
    }

    //前端开始转动
    public clientStartSpin():void {
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
        } else {
            Data.globalProxy.deductFreespinCount();
        }
        this.controlSpinUICom.deductSpinMoney();
        //获得控制台按钮状态
        var btnState:SPIN_STATE
        if (Data.globalProxy.bInFreeSpinDisplay) {
            btnState = SPIN_STATE.FREE_SPIN;
        } else {
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
    }

    //手动提前点停止
    public forceStop():void {
        Data.globalProxy.bForceStop = true;
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        var btnState:SPIN_STATE = (Data.globalProxy.getAutoState() == AUTO_SPIN_STATE.NON_AUTO)
            ? SPIN_STATE.STOP_ING : SPIN_STATE.AUTO_STOP_ING;
        this.controlSpinUICom.changeSpinBtnState(btnState);
        if (this.getSpinResultTimeKey != null) {
            MessageUtil.C2S_GetSpinResult(Data.globalProxy.bInFreeSpinDisplay, Data.globalProxy.getWagerPerLine());
            egret.clearTimeout(this.getSpinResultTimeKey);
        }
    }
}