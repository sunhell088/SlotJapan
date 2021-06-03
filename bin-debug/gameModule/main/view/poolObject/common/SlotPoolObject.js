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
 * slot的对象池
 */
var SlotPoolObject = (function (_super) {
    __extends(SlotPoolObject, _super);
    function SlotPoolObject() {
        var _this = _super.call(this) || this;
        //背景
        _this.bg = new eui.Image();
        //粒子围绕框[右上, 左下]   
        _this.winSlotParticle = [];
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.dispose, _this);
        _this.addChild(_this.bg);
        return _this;
    }
    SlotPoolObject.prototype.dispose = function () {
        ObjectPoolManager.backObject(this);
    };
    Object.defineProperty(SlotPoolObject.prototype, "hashc", {
        get: function () {
            return this.hashCode;
        },
        enumerable: true,
        configurable: true
    });
    //初始化或者动态变化slot的显示（Display）内容
    SlotPoolObject.prototype.setDisplay = function (columnIndex, bgName, resultData, bDim) {
        if (resultData === void 0) { resultData = null; }
        if (bDim === void 0) { bDim = false; }
        this.columnIndex = columnIndex;
        this.slotBGName = bgName;
        this.bg.visible = true;
        this.resultData = resultData;
        var freeSpinTag = (bgName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0 && Data.globalProxy.bInFreeSpinDisplay) ?
            "_free" : "";
        var columnTag = (bgName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0) ? "_" + columnIndex : "";
        this.bg.source = "slot_" + this.slotBGName + columnTag + freeSpinTag + "_png";
        if (CommonConst.B_SLOT_DIM) {
            if (bDim)
                this.bg.source = "dim_" + this.bg.source;
        }
        //延时一帧才能获得宽高
        egret.callLater(function () {
            this.bg.anchorOffsetX = this.bg.width / 2;
            this.bg.anchorOffsetY = this.bg.height / 2;
            this.bg.x = this.width / 2;
            this.bg.y = this.height / 2;
        }, this);
    };
    //动态获得应该处于的显示层级
    SlotPoolObject.prototype.getLayer = function () {
        //屏幕外的为最低层0
        var layer = 0;
        if (this.resultData) {
            if (this.resultData.slotType == CommonConst.SLOT_TYPE_WILD) {
                layer = SlotPoolObject.WILD_LAYER;
            }
            else if (this.resultData.slotType == CommonConst.SLOT_TYPE_SCATTER) {
                layer = SlotPoolObject.SCATTER_LAYER;
            }
            layer += (SlotPoolObject.DOWN_UP_LAYER + this.y);
            layer += (SlotPoolObject.RIGHT_LEFT_LAYER + this.x);
        }
        return layer;
    };
    //根据位置动态获得所在行数
    SlotPoolObject.prototype.getRowIndex = function () {
        return this.y / CommonConst.SLOT_ROW_GAP;
    };
    //重置slot所以状态（恢复为高亮，不闪烁，移除动画和粒子效果）
    SlotPoolObject.prototype.resetSlot = function () {
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
    };
    //slot开始闪烁一次（放大、缩小再抖动）
    SlotPoolObject.prototype.blink = function (bPlay) {
        if (this.slotBGName.indexOf(CommonConst.SLOT_TYPE_WILD) >= 0)
            return;
        if (bPlay) {
            this.highlight();
            if (CommonConst.WIN_SLOT_SHAKE) {
                CommonUtil.getSlotShakeTween(this.bg);
            }
            if (this.slotEffect) {
                switch (this.resultData.slotType) {
                    case CommonConst.SLOT_TYPE_WILD:
                        this.slotEffect.getArmatureDisplay().play("wild" + Data.globalProxy.getFreeSpinSelectType(), 1);
                        break;
                }
            }
        }
        else {
            this.bg.scaleX = this.bg.scaleY = 1;
            this.bg.rotation = 0;
            egret.Tween.removeTweens(this.bg);
            if (this.slotEffect) {
                egret.Tween.removeTweens(this.slotEffect);
            }
        }
    };
    //slot设置为非高亮状态（暗淡状态）
    SlotPoolObject.prototype.dark = function () {
        if (!CommonConst.NON_WIN_SLOT_DARK)
            return;
        this.bg.filters = [CommonUtil.darkColorFlilter];
        if (this.slotEffect) {
            this.slotEffect.filters = [CommonUtil.darkColorFlilter];
        }
    };
    //slot设置为高亮状态（正常状态）
    SlotPoolObject.prototype.highlight = function () {
        if (!CommonConst.NON_WIN_SLOT_DARK)
            return;
        this.bg.alpha = 1;
        this.bg.filters = null;
        if (this.slotEffect) {
            this.slotEffect.filters = null;
        }
    };
    //特殊格子动画 (如果slotTypes为空，那么表示直接播放)
    SlotPoolObject.prototype.slotPlaySpecialSlotAnimation = function (bPlay, slotTypes, bOnlyWin) {
        if (!this.resultData)
            return;
        if (bOnlyWin && !this.resultData.bWin)
            return;
        if (CommonConst.SPECIAL_SLOT_TYPES.indexOf(this.resultData.slotType) < 0)
            return;
        var specialSlotAnimation;
        if (slotTypes) {
            for (var i = 0; i < slotTypes.length; i++) {
                if (slotTypes[i].slotType == this.resultData.slotType) {
                    specialSlotAnimation = slotTypes[i];
                    break;
                }
            }
            if (!specialSlotAnimation)
                return;
        }
        if (bPlay) {
            if (!this.slotEffect) {
                this.slotEffect = ObjectPoolManager.getObject(SlotEffectPoolObject);
                var effectName = "";
                if (this.resultData.slotType == CommonConst.SLOT_TYPE_WILD) {
                    effectName = "animation_wild";
                }
                else if (this.resultData.slotType == CommonConst.SLOT_TYPE_SCATTER) {
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
                case CommonConst.SLOT_TYPE_WILD:
                    this.slotEffect.getArmatureDisplay().play(specialSlotAnimation.animationType, specialSlotAnimation.animationTime);
                    SoundManager.instance.playEffect(SoundType.WIN_SLOT_HAVE_WILD);
                    break;
                case CommonConst.SLOT_TYPE_SCATTER:
                    this.slotEffect.getArmatureDisplay().play(specialSlotAnimation.animationType, specialSlotAnimation.animationTime);
                    break;
            }
        }
        else {
            if (this.slotEffect) {
                this.slotEffect.getArmatureDisplay().removeEventListener(egret.Event.COMPLETE, this.onSpecialSlotAnimation, this);
                egret.Tween.removeTweens(this.slotEffect);
                this.slotEffect.scaleX = this.slotEffect.scaleY = 1;
                this.slotEffect.rotation = 0;
                this.slotEffect.filters = null;
                this.slotEffect.mask = null;
                if (this.slotEffect.parent)
                    this.slotEffect.parent.removeChild(this.slotEffect);
                this.slotEffect = null;
                this.bg.visible = true;
            }
        }
    };
    //特殊格子动画播放完后的回调函数
    SlotPoolObject.prototype.onSpecialSlotAnimation = function (event) {
        //因为可能用到延时器触发，所以有可能触发时，已经被移除
        if (!this.slotEffect)
            return;
        // if (this.resultData.slotType == CommonConst.SLOT_TYPE_SCATTER) {
        //     if ((<dragonBones.Movie>event.target).clipName == "0") {
        //
        //     }
        // }
    };
    SlotPoolObject.prototype.removeWinSlotSurroundParticle = function () {
        for (var i = 0; i < this.winSlotParticle.length; i++) {
            CommonUtil.surroundParticleEffect(false, false, this.winSlotParticle[i]);
        }
        this.winSlotParticle = [];
    };
    SlotPoolObject.prototype.winSlotSurroundParticle = function () {
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
            egret.Tween.get(this.wildx2Img).to({ scaleX: 2, scaleY: 2 }, 500).to({ scaleX: 1, scaleY: 1 }, 100);
        }
        var x = this.parent.x + this.columnIndex * CommonConst.SLOT_COLUMN_GAP;
        var y = this.parent.y + this.getRowIndex() * CommonConst.SLOT_ROW_GAP;
        var width = CommonConst.SLOT_COLUMN_GAP;
        var height = CommonConst.SLOT_ROW_GAP;
        if (this.winSlotParticle.length == 0) {
            for (var i = 0; i < 2; i++) {
                this.winSlotParticle.push(ObjectPoolManager.getObject(WinSlotParticlePoolObject));
            }
        }
        var startPointArr = [[x + width, y], [x, y + height]];
        var trackArr = [[{ emitterY: y + height }, { emitterX: x }, { emitterY: y }, { emitterX: x + width }],
            [{ emitterY: y }, { emitterX: x + width }, { emitterY: y + height }, { emitterX: x }]];
        for (var i = 0; i < this.winSlotParticle.length; i++) {
            SpinAreaUICom.instance.addChildAt(this.winSlotParticle[i], SpinAreaUICom.instance.getChildIndex(SpinAreaUICom.instance.prizeLineUICom) + 1);
            CommonUtil.surroundParticleEffect(false, true, this.winSlotParticle[i], startPointArr[i][0], startPointArr[i][1], trackArr[i], 650);
        }
    };
    //格子环绕特效
    SlotPoolObject.prototype.surroundParticleEffect = function (bPlay) {
        return;
        if (bPlay) {
            if (!this.surroundEffectMC) {
                this.surroundEffectMC = ObjectPoolManager.getObject(SlotSurroundPoolObject);
                this.addChild(this.surroundEffectMC);
                this.surroundEffectMC.x = this.width / 2;
                this.surroundEffectMC.y = this.height / 2;
                this.surroundEffectMC.addEventListener(egret.Event.COMPLETE, this.onSurroundParticleEffect, this);
            }
            this.surroundEffectMC.gotoAndPlay(0, 1);
            SoundManager.instance.playEffect(SoundType.SLOT_BLINK);
        }
        else {
            if (this.surroundEffectMC) {
                this.surroundEffectMC.removeEventListener(egret.Event.COMPLETE, this.onSurroundParticleEffect, this);
                this.surroundEffectMC.stop();
                this.removeChild(this.surroundEffectMC);
                this.surroundEffectMC = null;
            }
        }
    };
    //格子环绕特效结束后的回调
    SlotPoolObject.prototype.onSurroundParticleEffect = function () {
    };
    //-------分割线----上面为老虎机基础效果，下面为具体游戏特殊效果--------------------------------------------------------------
    //粒子上升特效
    SlotPoolObject.prototype.riseParticleEffect = function (bPlay) {
        if (bPlay) {
            if (!this.riseParticleObj) {
                this.riseParticleObj = ObjectPoolManager.getObject(RiseParticlePoolObject);
                this.addChild(this.riseParticleObj);
                this.riseParticleObj.blendMode = egret.BlendMode.ADD;
                this.riseParticleObj.emitterX = this.width / 2;
                this.riseParticleObj.emitterY = this.height;
            }
            else {
                this.riseParticleObj.stop();
            }
            this.riseParticleObj.start();
        }
        else {
            if (this.riseParticleObj) {
                this.riseParticleObj.stop();
                this.removeChild(this.riseParticleObj);
                this.riseParticleObj = null;
            }
        }
    };
    //神秘格子动画
    SlotPoolObject.prototype.playMysterySlotAnimation = function (bPlay) {
        if (!this.resultData || !this.resultData.bMystery)
            return;
        if (bPlay) {
            if (!this.mysterySlotEffect) {
                this.mysterySlotEffect = ObjectPoolManager.getObject(SlotMysteryPoolObject);
                this.addChild(this.mysterySlotEffect);
                this.mysterySlotEffect.x = this.width / 2;
                this.mysterySlotEffect.y = this.height / 2;
                var effectArmature = this.mysterySlotEffect.getArmatureDisplay();
                effectArmature.addEventListener(egret.Event.COMPLETE, this.onMysterySlotAnimation, this);
            }
            effectArmature.animation.play("mysteryName", 1);
            effectArmature.animation.timeScale = Data.globalProxy.bForceStop ? 2 : 1;
            egret.setTimeout(function () {
                this.mysteryParticleEffect(true);
            }, this, 500);
        }
        else {
            if (this.mysterySlotEffect) {
                this.mysterySlotEffect.getArmatureDisplay().removeEventListener(egret.Event.COMPLETE, this.onMysterySlotAnimation, this);
                egret.Tween.removeTweens(this.mysterySlotEffect);
                this.mysterySlotEffect.scaleX = this.mysterySlotEffect.scaleY = 1;
                this.mysterySlotEffect.rotation = 0;
                this.mysterySlotEffect.filters = null;
                this.mysterySlotEffect.alpha = 1;
                if (this.mysterySlotEffect.parent)
                    this.mysterySlotEffect.parent.removeChild(this.mysterySlotEffect);
                this.mysterySlotEffect = null;
            }
            this.mysteryParticleEffect(false);
        }
    };
    //神秘格子动画结束后的回调
    SlotPoolObject.prototype.onMysterySlotAnimation = function () {
        this.bg.source = "slot_" + this.resultData.slotType + "_png";
        this.bg.alpha = 0;
        egret.Tween.get(this.bg).to({ alpha: 1 }, 400);
        egret.Tween.get(this.mysterySlotEffect).to({ alpha: 0 }, 400);
        egret.setTimeout(function () {
            this.mysteryParticleEffect(false);
        }, this, 500);
    };
    //神秘格子爆炸粒子效果
    SlotPoolObject.prototype.mysteryParticleEffect = function (bPlay) {
        if (bPlay) {
            if (!this.explodeParticleObj) {
                this.explodeParticleObj = ObjectPoolManager.getObject(ExplosionParticlePoolObject);
                this.addChild(this.explodeParticleObj);
                this.explodeParticleObj.blendMode = egret.BlendMode.ADD;
                this.explodeParticleObj.emitterX = this.width / 2;
                this.explodeParticleObj.emitterY = this.height / 2;
            }
            else {
                this.explodeParticleObj.stop();
            }
            this.explodeParticleObj.start();
        }
        else {
            if (this.explodeParticleObj) {
                this.explodeParticleObj.stop();
                egret.Tween.removeTweens(this.explodeParticleObj);
                this.removeChild(this.explodeParticleObj);
                this.explodeParticleObj = null;
            }
        }
    };
    //根据不同的图标类型来设置显示层级（1、通过系数来区分 2、优先从下到上，从右到左）
    SlotPoolObject.SCATTER_LAYER = 20000;
    SlotPoolObject.WILD_LAYER = 10000;
    SlotPoolObject.DOWN_UP_LAYER = 5000;
    SlotPoolObject.RIGHT_LEFT_LAYER = 2000;
    return SlotPoolObject;
}(egret.DisplayObjectContainer));
__reflect(SlotPoolObject.prototype, "SlotPoolObject", ["IPoolObject"]);
//特殊格子动画对应的名字（播放特殊格子动画 优化为  传递播放的子动画名字）
var SpecialSlotAnimation = (function () {
    function SpecialSlotAnimation(slotType, animationType, animationTime) {
        this.slotType = slotType;
        this.animationType = animationType;
        this.animationTime = animationTime;
    }
    return SpecialSlotAnimation;
}());
__reflect(SpecialSlotAnimation.prototype, "SpecialSlotAnimation");
//# sourceMappingURL=SlotPoolObject.js.map