/**
 * slot的对象池
 */
class SlotPoolObject extends egret.DisplayObjectContainer implements IPoolObject {
    //根据不同的图标类型来设置显示层级（1、通过系数来区分 2、优先从下到上，从右到左）
    public static SCATTER_LAYER:number = 20000;
    public static WILD_LAYER:number = 10000;
    public static DOWN_UP_LAYER:number = 5000;
    public static RIGHT_LEFT_LAYER:number = 2000;
    //背景
    public bg:eui.Image = new eui.Image();
    //slot特效（如：Wild、Bouns、Scatter、wildx2）
    private slotEffect:SlotEffectPoolObject;
    //slot特效的遮罩（不一定会用）
    private slotEffectMask:egret.Rectangle;
    //粒子围绕框
    private surroundEffectMC:SlotSurroundPoolObject;
    //粒子围绕框[右上, 左下]   
    private winSlotParticle:WinSlotParticlePoolObject[] = [];
    //slot里面具体的数据（如果是非显示中的slot，该值为空）
    public resultData:SlotResultData;
    //当前slot图标对应的图片名字（如："W","A","B","C"....）
    private slotBGName:string;
    //所在列数
    private columnIndex:number;

    //wild X2图标
    public wildx2Img:eui.Image;


    //----------分割线   上面是通用字段，下面是具体游戏的特有字段--------------------    
    //神秘格子
    private mysterySlotEffect:SlotMysteryPoolObject;
    //未知格子变化出来爆炸粒子
    private explodeParticleObj:ExplosionParticlePoolObject;
    //中奖区域图片里的上升粒子效果
    private riseParticleObj:RiseParticlePoolObject;

    public constructor() {
        super();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.dispose, this);
        this.addChild(this.bg);
    }

    public dispose():void {
        ObjectPoolManager.backObject(this);
    }

    public get hashc():number {
        return this.hashCode;
    }

    //初始化或者动态变化slot的显示（Display）内容
    public setDisplay(columnIndex:number, bgName:string, resultData:SlotResultData = null, bDim:boolean = false):void {
        this.columnIndex = columnIndex;
        this.slotBGName = bgName;
        this.bg.visible = true;
        this.resultData = resultData;
        var freeSpinTag:string = (bgName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0 && Data.globalProxy.bInFreeSpinDisplay) ?
            "_free" : "";
        var columnTag:string = (bgName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0) ? "_" + columnIndex : "";
        this.bg.source = "slot_" + this.slotBGName + columnTag + freeSpinTag + "_png";
        if (CommonConst.B_SLOT_DIM) {
            if (bDim) this.bg.source = "dim_" + this.bg.source;
        }
        //延时一帧才能获得宽高
        egret.callLater(function () {
            this.bg.anchorOffsetX = this.bg.width / 2;
            this.bg.anchorOffsetY = this.bg.height / 2;
            this.bg.x = this.width / 2;
            this.bg.y = this.height / 2;
        }, this);
    }

    //动态获得应该处于的显示层级
    public getLayer():number {
        //屏幕外的为最低层0
        var layer:number = 0;
        if (this.resultData) {
            if (this.resultData.slotType == CommonConst.SLOT_TYPE_WILD) {
                layer = SlotPoolObject.WILD_LAYER;
            } else if (this.resultData.slotType == CommonConst.SLOT_TYPE_SCATTER) {
                layer = SlotPoolObject.SCATTER_LAYER;
            }
            layer += (SlotPoolObject.DOWN_UP_LAYER + this.y);
            layer += (SlotPoolObject.RIGHT_LEFT_LAYER + this.x);
        }
        return layer;
    }

    //根据位置动态获得所在行数
    private getRowIndex():number {
        return this.y / CommonConst.SLOT_ROW_GAP;
    }

    //重置slot所以状态（恢复为高亮，不闪烁，移除动画和粒子效果）
    public resetSlot():void {
        this.highlight();
        this.blink(false);
        this.surroundParticleEffect(false);
        this.removeWinSlotSurroundParticle();
        this.slotPlaySpecialSlotAnimation(false, null, false);

        if (this.wildx2Img) {
            egret.Tween.removeTweens(this.wildx2Img);
            this.removeChild(this.wildx2Img);
            this.wildx2Img = null;
        }
    }

    //slot开始闪烁一次（放大、缩小再抖动）
    public blink(bPlay:boolean):void {
        if (this.slotBGName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0) return;
        if (bPlay) {
            this.highlight();
            if (CommonConst.WIN_SLOT_SHAKE) {
                CommonUtil.getSlotShakeTween(this.bg);
            }
            if (this.slotEffect) {
                switch (this.resultData.slotType) {
                    case CommonConst.SLOT_TYPE_WILD :
                        this.slotEffect.getArmatureDisplay().play("wild" + Data.globalProxy.getFreeSpinSelectType(), 1);
                        break;
                }
            }
        } else {
            this.bg.scaleX = this.bg.scaleY = 1;
            this.bg.rotation = 0;
            egret.Tween.removeTweens(this.bg);
            if (this.slotEffect) {
                egret.Tween.removeTweens(this.slotEffect);
            }
        }
    }

    //slot设置为非高亮状态（暗淡状态）
    public dark():void {
        if (!CommonConst.NON_WIN_SLOT_DARK) return;
        this.bg.filters = [CommonUtil.darkColorFlilter];
        if (this.slotEffect) {
            this.slotEffect.filters = [CommonUtil.darkColorFlilter];
        }
    }

    //slot设置为高亮状态（正常状态）
    public highlight():void {
        if (!CommonConst.NON_WIN_SLOT_DARK) return;
        this.bg.alpha = 1;
        this.bg.filters = null;
        if (this.slotEffect) {
            this.slotEffect.filters = null;
        }
    }

    //特殊格子动画 (如果slotTypes为空，那么表示直接播放)
    public slotPlaySpecialSlotAnimation(bPlay:boolean, slotTypes:SpecialSlotAnimation[], bOnlyWin:boolean):void {
        if (!this.resultData) return;
        if (bOnlyWin && !this.resultData.bWin) return;
        if (CommonConst.SPECIAL_SLOT_TYPES.indexOf(this.resultData.slotType) < 0) return;
        var specialSlotAnimation:SpecialSlotAnimation;
        if (slotTypes) {
            for (var i = 0; i < slotTypes.length; i++) {
                if (slotTypes[i].slotType == this.resultData.slotType) {
                    specialSlotAnimation = slotTypes[i];
                    break;
                }
            }
            if (!specialSlotAnimation) return;
        }
        if (bPlay) {
            if (!this.slotEffect) {
                this.slotEffect = <SlotEffectPoolObject>ObjectPoolManager.getObject(SlotEffectPoolObject);
                var effectName:string = "";
                if (this.resultData.slotType == CommonConst.SLOT_TYPE_WILD) {
                    effectName = "animation_wild";
                } else if (this.resultData.slotType == CommonConst.SLOT_TYPE_SCATTER) {
                    effectName = "animation_scatter";
                }
                this.slotEffect.initDragonBones(effectName);
                this.addChild(this.slotEffect);
                this.slotEffect.x = this.width / 2;
                this.slotEffect.y = this.height / 2;
                if (CommonConst.B_SLOT_MASK) {
                    if (!this.slotEffectMask) {
                        this.slotEffectMask = new egret.Rectangle(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
                    }
                    this.slotEffect.mask = this.slotEffectMask;
                }
                this.slotEffect.getArmatureDisplay().addEventListener(egret.Event.COMPLETE, this.onSpecialSlotAnimation, this);
            }
            if (this.slotEffect.getArmatureDisplay().isPlaying) {
                egret.warn("==isPlaying==" + this.columnIndex + ":" + this.getRowIndex());
            }
            this.bg.visible = false;
            switch (this.resultData.slotType) {
                case CommonConst.SLOT_TYPE_WILD :
                    this.slotEffect.getArmatureDisplay().play(specialSlotAnimation.animationType, specialSlotAnimation.animationTime);
                    SoundManager.instance.playEffect(SoundType.WIN_SLOT_HAVE_WILD);
                    break;
                case CommonConst.SLOT_TYPE_SCATTER :
                    this.slotEffect.getArmatureDisplay().play(specialSlotAnimation.animationType, specialSlotAnimation.animationTime);
                    break;
            }
        } else {
            if (this.slotEffect) {
                this.slotEffect.getArmatureDisplay().removeEventListener(egret.Event.COMPLETE, this.onSpecialSlotAnimation, this);
                egret.Tween.removeTweens(this.slotEffect);
                this.slotEffect.scaleX = this.slotEffect.scaleY = 1;
                this.slotEffect.rotation = 0;
                this.slotEffect.filters = null;
                this.slotEffect.mask = null;
                if (this.slotEffect.parent) this.slotEffect.parent.removeChild(this.slotEffect);
                this.slotEffect = null;

                this.bg.visible = true;
            }
        }
    }

    //特殊格子动画播放完后的回调函数
    private onSpecialSlotAnimation(event:egret.Event):void {
        //因为可能用到延时器触发，所以有可能触发时，已经被移除
        if (!this.slotEffect) return;
        // if (this.resultData.slotType == CommonConst.SLOT_TYPE_SCATTER) {
        //     if ((<dragonBones.Movie>event.target).clipName == "0") {
        //
        //     }
        // }
    }

    private removeWinSlotSurroundParticle():void {
        for (var i = 0; i < this.winSlotParticle.length; i++) {
            CommonUtil.surroundParticleEffect(false, false, this.winSlotParticle[i]);
        }
        this.winSlotParticle = [];
    }

    public winSlotSurroundParticle():void {
        //如果是在freeSpin中，则显示X2图标
        if (Data.globalProxy.bInFreeSpinDisplay && this.slotBGName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0
            && !Data.globalProxy.isAllWild()) {
            if (!this.wildx2Img) {
                this.wildx2Img = new eui.Image("wildx2_png");
            }
            egret.callLater(function () {
                this.wildx2Img.anchorOffsetX = this.wildx2Img.width / 2;
                this.wildx2Img.anchorOffsetY = this.wildx2Img.height / 2;
                this.wildx2Img.x = this.width - this.wildx2Img.anchorOffsetX;
                this.wildx2Img.y = this.height - this.wildx2Img.anchorOffsetY;
            }, this);
            this.addChild(this.wildx2Img);
            this.wildx2Img.scaleX = this.wildx2Img.scaleY = 0;
            egret.Tween.get(this.wildx2Img).to({scaleX: 2, scaleY: 2}, 500).to({scaleX: 1, scaleY: 1}, 100);
        }

        var x:number = this.parent.x + this.columnIndex * CommonConst.SLOT_COLUMN_GAP;
        var y:number = this.parent.y + this.getRowIndex() * CommonConst.SLOT_ROW_GAP;
        var width:number = CommonConst.SLOT_COLUMN_GAP;
        var height:number = CommonConst.SLOT_ROW_GAP;

        if (this.winSlotParticle.length == 0) {
            for (var i = 0; i < 2; i++) {
                this.winSlotParticle.push(<WinSlotParticlePoolObject>ObjectPoolManager.getObject(WinSlotParticlePoolObject));
            }
        }
        var startPointArr:any[] = [[x + width, y], [x, y + height]];
        var trackArr:any[] = [[{emitterY: y + height}, {emitterX: x}, {emitterY: y}, {emitterX: x + width}]
            , [{emitterY: y}, {emitterX: x + width}, {emitterY: y + height}, {emitterX: x}]];
        for (var i = 0; i < this.winSlotParticle.length; i++) {
            SpinAreaUICom.instance.addChildAt(this.winSlotParticle[i],
                SpinAreaUICom.instance.getChildIndex(SpinAreaUICom.instance.prizeLineUICom) + 1);
            CommonUtil.surroundParticleEffect(false, true, this.winSlotParticle[i], startPointArr[i][0], startPointArr[i][1], trackArr[i], 650);
        }
    }

    //格子环绕特效
    public surroundParticleEffect(bPlay:boolean):void {
        return;
        if (bPlay) {
            if (!this.surroundEffectMC) {
                this.surroundEffectMC = <SlotSurroundPoolObject>ObjectPoolManager.getObject(SlotSurroundPoolObject);
                this.addChild(this.surroundEffectMC);
                this.surroundEffectMC.x = this.width / 2;
                this.surroundEffectMC.y = this.height / 2;
                this.surroundEffectMC.addEventListener(egret.Event.COMPLETE, this.onSurroundParticleEffect, this);
            }
            this.surroundEffectMC.gotoAndPlay(0, 1);
            SoundManager.instance.playEffect(SoundType.SLOT_BLINK);
        } else {
            if (this.surroundEffectMC) {
                this.surroundEffectMC.removeEventListener(egret.Event.COMPLETE, this.onSurroundParticleEffect, this);
                this.surroundEffectMC.stop();
                this.removeChild(this.surroundEffectMC);
                this.surroundEffectMC = null;
            }
        }
    }

    //格子环绕特效结束后的回调
    public onSurroundParticleEffect():void {
    }

    //-------分割线----上面为老虎机基础效果，下面为具体游戏特殊效果--------------------------------------------------------------
    //粒子上升特效
    private riseParticleEffect(bPlay:boolean):void {
        if (bPlay) {
            if (!this.riseParticleObj) {
                this.riseParticleObj = <RiseParticlePoolObject>ObjectPoolManager.getObject(RiseParticlePoolObject);
                this.addChild(this.riseParticleObj);
                this.riseParticleObj.blendMode = egret.BlendMode.ADD;
                this.riseParticleObj.emitterX = this.width / 2;
                this.riseParticleObj.emitterY = this.height;
            } else {
                this.riseParticleObj.stop();
            }
            this.riseParticleObj.start();
        } else {
            if (this.riseParticleObj) {
                this.riseParticleObj.stop();
                this.removeChild(this.riseParticleObj);
                this.riseParticleObj = null;
            }
        }
    }

    //神秘格子动画
    public playMysterySlotAnimation(bPlay:boolean):void {
        if (!this.resultData || !this.resultData.bMystery) return;
        if (bPlay) {
            if (!this.mysterySlotEffect) {
                this.mysterySlotEffect = <SlotMysteryPoolObject>ObjectPoolManager.getObject(SlotMysteryPoolObject);
                this.addChild(this.mysterySlotEffect);
                this.mysterySlotEffect.x = this.width / 2;
                this.mysterySlotEffect.y = this.height / 2;
                var effectArmature:dragonBones.EgretArmatureDisplay = this.mysterySlotEffect.getArmatureDisplay();
                effectArmature.addEventListener(egret.Event.COMPLETE, this.onMysterySlotAnimation, this);
            }
            effectArmature.animation.play("mysteryName", 1);
            effectArmature.animation.timeScale = Data.globalProxy.bForceStop ? 2 : 1;

            egret.setTimeout(function () {
                this.mysteryParticleEffect(true);
            }, this, 500)
        } else {
            if (this.mysterySlotEffect) {
                this.mysterySlotEffect.getArmatureDisplay().removeEventListener(egret.Event.COMPLETE, this.onMysterySlotAnimation, this);
                egret.Tween.removeTweens(this.mysterySlotEffect);
                this.mysterySlotEffect.scaleX = this.mysterySlotEffect.scaleY = 1;
                this.mysterySlotEffect.rotation = 0;
                this.mysterySlotEffect.filters = null;
                this.mysterySlotEffect.alpha = 1;
                if (this.mysterySlotEffect.parent) this.mysterySlotEffect.parent.removeChild(this.mysterySlotEffect);
                this.mysterySlotEffect = null;
            }
            this.mysteryParticleEffect(false);
        }
    }

    //神秘格子动画结束后的回调
    private onMysterySlotAnimation():void {
        this.bg.source = "slot_" + this.resultData.slotType + "_png";
        this.bg.alpha = 0;
        egret.Tween.get(this.bg).to({alpha: 1}, 400);
        egret.Tween.get(this.mysterySlotEffect).to({alpha: 0}, 400);

        egret.setTimeout(function () {
            this.mysteryParticleEffect(false);
        }, this, 500)
    }

    //神秘格子爆炸粒子效果
    private mysteryParticleEffect(bPlay:boolean):void {
        if (bPlay) {
            if (!this.explodeParticleObj) {
                this.explodeParticleObj = <ExplosionParticlePoolObject>ObjectPoolManager.getObject(ExplosionParticlePoolObject);
                this.addChild(this.explodeParticleObj);
                this.explodeParticleObj.blendMode = egret.BlendMode.ADD;
                this.explodeParticleObj.emitterX = this.width / 2;
                this.explodeParticleObj.emitterY = this.height / 2;
            } else {
                this.explodeParticleObj.stop();
            }
            this.explodeParticleObj.start();
        } else {
            if (this.explodeParticleObj) {
                this.explodeParticleObj.stop();
                egret.Tween.removeTweens(this.explodeParticleObj);
                this.removeChild(this.explodeParticleObj);
                this.explodeParticleObj = null;
            }
        }
    }
}

//特殊格子动画对应的名字（播放特殊格子动画 优化为  传递播放的子动画名字）
class SpecialSlotAnimation {
    constructor(slotType:string, animationType:string, animationTime:number) {
        this.slotType = slotType;
        this.animationType = animationType;
        this.animationTime = animationTime;
    }

    public slotType:string;
    public animationType:string;
    public animationTime:number;
}