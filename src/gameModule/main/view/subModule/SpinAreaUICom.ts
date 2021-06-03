/**
 * slot的滚动区域
 */
class SpinAreaUICom extends eui.Component {
    public static instance:SpinAreaUICom;
    //转动区域背景
    private spinBGImg:eui.Image;
    //转动区域遮罩
    private spinMask:egret.Rectangle;
    //转动区域容器
    private spinGroup:eui.Group;
    //转动区域每一列显示对象管理器
    private slotColumns:SlotColumnUICom[] = [];
    //粒子围绕框[左上, 右上, 左下, 右下]
    private scatterSpeedParticle:ScatterSpeedParticlePoolObject[] = [];
    //当前闪烁的是第几条线
    private blinkLineIndex:number = 0;
    //每条中奖线的闪烁定时器
    private blinkLineIntervalKey:number = 0;
    //中奖线路图绘制容器
    public prizeLineUICom:PrizeLineUICom;
    //全屏wild动画效果
    private allWildMovie:dragonBones.Movie;
    //全屏wild的遮罩
    private allWildMask:eui.Image;

    public constructor() {
        super();
        SpinAreaUICom.instance = this;
        this.skinName = SpinAreaSkin;
    }

    protected createChildren():void {
        super.createChildren();
        this.spinMask = new egret.Rectangle(this["tempMask"].x, this["tempMask"].y, this["tempMask"].width, this["tempMask"].height);
        this.spinGroup.mask = this.spinMask;
        for (var i = 0; i < CommonConst.SLOT_COLUMN_MAX; i++) {
            var slotColumn = new SlotColumnUICom(this.spinGroup, i);
            this.slotColumns.push(slotColumn);
        }
    }

    public initUI():void {
        this.resetSpinAreaUI();
        this.spinBGImg.source = (Data.globalProxy.getFreespinCount() > 0) ? "mainBGFreeSpin_png" : "mainBG_png";

        //第一次玩这个游戏时，没有记录，为默认图标
        this.spinGroup.removeChildren();
        for (var i = 0; i < this.slotColumns.length; i++) {
            this.slotColumns[i].initSlot(CommonConst.DEFAULTS_SLOTS[i]);
        }
        for (var i = 0; i < this.slotColumns.length; i++) {
            this.slotColumns[i].recoverLastSlot(Data.globalProxy.slotColumnResult[i]);
        }
        CommonUtil.setSlotLayer(this.spinGroup);
    }

    //收到服务器端转动结果，开始停止动画
    public playStopAnimation():void {
        SoundManager.instance.playEffect(SoundType.SPIN);
        for (var i = 0; i < Data.globalProxy.slotColumnResult.length; i++) {
            var slotColumnResult = Data.globalProxy.slotColumnResult[i];
            egret.setTimeout(function (slotColumn, result) {
                slotColumn.stopSpin(result, this);
            }, this, Data.globalProxy.bForceStop ? 0 : SlotRhythmConst.SLOT_COLUMN_STOP_GAP_TIME[i], this.slotColumns[i], slotColumnResult);
        }
    }

    //根据转动类别设置背景
    public setSpinBG(bNormal:boolean):void {
        this.spinBGImg.source = bNormal ? "mainBG_png" : "mainBGFreeSpin_png";
    }

    //播放特殊格子动画（并刷新layer）
    public playSpecialSlotEffect(slotType:SpecialSlotAnimation[]):void {
        CommonUtil.setSlotLayer(this.spinGroup);
        for (var key in this.slotColumns) {
            this.slotColumns[key].columnPlaySpecialSlotEffect(slotType);
        }
    }

    //闪烁中奖区域
    public startPlayWinSlotBlink():void {
        for (var key in this.slotColumns) {
            this.slotColumns[key].playAllWinSlotBlink();
        }
        //延迟一帧执行，因为需要判断滚动slot的位置，有时会有误差
        // egret.callLater(function () {
        //     this.prizeLineUICom.showAwardLine();
        // }, this);
        egret.setTimeout(function () {
            this.prizeLineUICom.showAwardLine();
        }, this, 100);
        //循环闪烁
        this.blinkLineIndex = 0;
        this.blinkLineIntervalKey = egret.setInterval(function () {
            if (this.blinkLineIndex == -1 || Data.globalProxy.bInFreeSpinDisplay || (Data.globalProxy.getAutoState() != AUTO_SPIN_STATE.NON_AUTO)) {
                for (var key in this.slotColumns) {
                    this.slotColumns[key].playAllWinSlotBlink();
                }
                this.prizeLineUICom.showAwardLine();
            } else {
                for (var key in this.slotColumns) {
                    this.slotColumns[key].playLineWinSlotBlink(this.blinkLineIndex);
                }
                this.prizeLineUICom.showAwardLine(this.blinkLineIndex);
            }
            this.blinkLineIndex++;
            if (this.blinkLineIndex >= Data.globalProxy.winLineSlot.length) {
                this.blinkLineIndex = -1;
            }
        }, this, SlotRhythmConst.WIN_LINE_BLINK_INTERVAL);
    }

    //重置所有slot状态
    public resetSpinAreaUI():void {
        this.removeScatterSpeedParticle();
        for (var key in this.slotColumns) {
            this.slotColumns[key].resetSlot();
        }
        this.prizeLineUICom.resetPrizeLineUI();
        egret.clearInterval(this.blinkLineIntervalKey);
    }

    private removeScatterSpeedParticle():void {
        for (var i = 0; i < this.scatterSpeedParticle.length; i++) {
            CommonUtil.surroundParticleEffect(true, false, this.scatterSpeedParticle[i]);
        }
        this.scatterSpeedParticle = [];
    }

    //播放scatter的加速期待粒子转圈特效
    public scatterSpeedParticleEffect(columnIndex:number):void {
        this.removeScatterSpeedParticle();
        if (columnIndex >= 0) {
            var x:number = this.spinGroup.x + CommonConst.SLOT_COLUMN_GAP * columnIndex;
            var y:number = this.spinGroup.y;
            var width:number = CommonConst.SLOT_COLUMN_GAP;
            var height:number = CommonConst.SLOT_ROW_GAP * 3;

            if (this.scatterSpeedParticle.length == 0) {
                for (var i = 0; i < 4; i++) {
                    this.scatterSpeedParticle.push(<ScatterSpeedParticlePoolObject>ObjectPoolManager.getObject(ScatterSpeedParticlePoolObject));
                }
            }
            var startPointArr:any[] = [[x, y], [x + width, y], [x, y + height], [x + width, y + height]];
            var trackArr:any[] = [[{emitterY: y + height}, {emitterX: x + width}, {emitterY: y}, {emitterX: x}]
                , [{emitterY: y + height}, {emitterX: x}, {emitterY: y}, {emitterX: x + width}]
                , [{emitterY: y}, {emitterX: x + width}, {emitterY: y + height}, {emitterX: x}]
                , [{emitterY: y}, {emitterX: x}, {emitterY: y + height}, {emitterX: x + width}]];
            for (var i = 0; i < this.scatterSpeedParticle.length; i++) {
                this.addChildAt(this.scatterSpeedParticle[i], this.getChildIndex(this.spinGroup) + 1);
                CommonUtil.surroundParticleEffect(true, true, this.scatterSpeedParticle[i], startPointArr[i][0], startPointArr[i][1], trackArr[i], 1400);
            }
        }
    }

    //根据图标位置索引找到对应的图标对象
    public getSlotDisplayByIndex(posIndex:number):SlotPoolObject {
        var slotDisplay = null;
        for (var i = 0; i < this.slotColumns.length; i++) {
            slotDisplay = this.slotColumns[i].getSlotDisplay(posIndex);
            if (slotDisplay) break;
        }
        return slotDisplay;
    }

    public startSpin():void {
        SoundManager.instance.playEffect(SoundType.SPIN);
        for (var i = 0; i < this.slotColumns.length; i++) {
            this.slotColumns[i].startSpin();
        }
    }

    //中奖格子闪烁
    public slotWinAnimation():void {
        var betValue:number = Data.globalProxy.getTotalWager();
        var awardLevel:AWARD_LEVEL = CommonUtil.getAwardLevel(betValue, Data.globalProxy.payout);
        if (awardLevel == AWARD_LEVEL.NORMAL) {
            this.startPlayWinSlotBlink();
        }

        PrizeEffectUICom.instance.awardValueExplode(awardLevel);
    }

    //播放中freeSpin的开场动画
    public playHitFreeSpinEffect():void {
        SoundManager.instance.playEffect(SoundType.ALL_SCATTER);
        this.resetSpinAreaUI();
        CommonUtil.setSlotLayer(this.spinGroup);
        SpinAreaUICom.instance.playSpecialSlotEffect([new SpecialSlotAnimation(CommonConst.SLOT_TYPE_SCATTER, "1", 1)]);
        egret.setTimeout(function () {
            SpinAreaUICom.instance.playSpecialSlotEffect([new SpecialSlotAnimation(CommonConst.SLOT_TYPE_SCATTER, "0", 1)]);
            ViewManager.instance.OPEN_WINDOW(FreeGameSelectMediator, true);
        }, this, SlotRhythmConst.FREE_SPIN_SELECT_UI_DELAY);
    }

    //播放全屏wild效果
    public playAllWildEffect():void {
        SoundManager.instance.playEffect(Data.globalProxy.bInFreeSpinDisplay
            ? SoundType.QUEEN_FREE_SPIN : SoundType.QUEEN);
        if(!this.allWildMovie){
            dragonBones.addMovieGroup(RES.getRes("animation_queen_feature_ske_dbmv"), RES.getRes("animation_queen_feature_tex_png"));
            dragonBones.addMovieGroup(RES.getRes("animation_queen_ske_dbmv"), RES.getRes("animation_queen_tex_png"));
            this.allWildMovie = dragonBones.buildMovie(Data.globalProxy.bInFreeSpinDisplay
                ? "animation_queen_feature" : "animation_queen");
            this.allWildMovie.addEventListener(dragonBones.EventObject.COMPLETE, this.onAllWildMovieComplete, this);
            this.addChildAt(this.allWildMovie, this.getChildIndex(this.spinGroup) + 1000);
        }
        this.allWildMovie.mask = this.allWildMask;
        this.allWildMovie.x = this.allWildMask.x + this.allWildMask.width / 2 + (Data.globalProxy.bInFreeSpinDisplay
            ? -2.5 : 12.5);
        this.allWildMovie.y = this.allWildMask.y + this.allWildMask.height / 2 + (Data.globalProxy.bInFreeSpinDisplay
            ? -14.5 : -5.5);
        this.allWildMovie.alpha = 0;
        egret.Tween.get(this.allWildMovie).to({alpha: 1}, 1000).call(function () {
            this.allWildMovie.play("0");
        }, this);
    }

    //全屏wild动画播放完毕后
    private onAllWildMovieComplete():void {
        egret.Tween.get(this.allWildMovie).to({alpha: 0}, 1000)
            .call(function () {
                egret.Tween.removeTweens(this.allWildMovie);
                this.allWildMovie.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAllWildMovieComplete, this);
                this.allWildMovie.stop();
                this.allWildMovie.dispose();
                if (this.allWildMovie.parent) this.allWildMovie.parent.removeChild(this.allWildMovie);
                this.allWildMovie = null;
                dragonBones.removeMovieGroup("animation_queen_feature");
                dragonBones.removeMovieGroup("animation_queen");
                SpinAreaUICom.instance.slotWinAnimation();
            }, this);
    }
}