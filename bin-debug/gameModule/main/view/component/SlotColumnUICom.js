var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Kurt on 2017/7/25.
 * slot的纵列
 */
var SlotColumnUICom = (function () {
    function SlotColumnUICom(spinGroup, columnIndex) {
        //后续出现的slot（在没有结果前，是随机，有结果后就是真实结果）
        this.residueSlotList = null;
        //结果slot库
        this.slotResultList = null;
        //是否已经把结果加入转动队列
        this.bResultJoin = false;
        //显示中的slot
        this.slotDisplayList = [];
        //tick的上一帧当前时间戳
        this.timeStamp = 0;
        //当前列的速度
        this.currentSpeed = SlotRhythmConst.SPEED;
        this.spinGroup = spinGroup;
        this.columnIndex = columnIndex;
    }
    //初始化显示中的slot
    SlotColumnUICom.prototype.initSlot = function (slotIconType) {
        //因为要头尾各加一个，所以这里加2
        var slotMax = CommonConst.SLOT_ROW_MAX + 2;
        this.slotDisplayList = [];
        for (var i = 0; i < slotMax; i++) {
            var slotObj = ObjectPoolManager.getObject(SlotPoolObject);
            slotObj.width = CommonConst.SLOT_COLUMN_GAP;
            slotObj.height = CommonConst.SLOT_ROW_GAP;
            slotObj.setDisplay(this.columnIndex, slotIconType);
            this.slotDisplayList.push(slotObj);
        }
        //添加到父显示容器
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            var slot = this.slotDisplayList[i];
            this.spinGroup.addChild(slot);
            slot.x = CommonConst.SLOT_COLUMN_GAP * this.columnIndex;
            slot.y = i * CommonConst.SLOT_ROW_GAP;
        }
        this.resetSlot();
    };
    //恢复指定的结果
    SlotColumnUICom.prototype.recoverLastSlot = function (result) {
        if (result.length == 0)
            return;
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            if (i >= result.length)
                break;
            this.slotDisplayList[i].setDisplay(this.columnIndex, result[i].slotType, result[i]);
        }
        //用于刚进游戏时，如果第一个是wild，那么隐藏的第一列也要做处理
        this.slotResultList = result;
    };
    //开始转动
    SlotColumnUICom.prototype.startSpin = function () {
        this.currentSpeed = SlotRhythmConst.SPEED;
        this.residueSlotList = GameUtil.createResidueSlotList(this.slotResultList[0].slotType);
        this.slotResultList = null;
        this.stopSlot = null;
        this.bResultJoin = false;
        for (var key in this.slotDisplayList) {
            this.slotDisplayList[key].resultData = null;
        }
        //开始转动
        this.timeStamp = egret.getTimer();
        this.spinGroup.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    //停止转动，显示结果
    SlotColumnUICom.prototype.stopSpin = function (resultSlots, spinAreaUI) {
        var bFreeSpin = Data.globalProxy.bInFreeSpinDisplay;
        var delayTime = 0;
        if (this.columnIndex != 0 && this.columnIndex != 1
            && Data.globalProxy.hasScatter(0) && Data.globalProxy.hasScatter(1)
            && !bFreeSpin) {
            delayTime = SlotRhythmConst.SCATTER_DELAY_TIME;
            if (this.columnIndex == 2) {
                SoundManager.instance.playEffect(SoundType.SCATTER_ANTICIPATION);
                this.currentSpeed = SlotRhythmConst.SPEED * SlotRhythmConst.SPEED_MULTIPLE;
                spinAreaUI.scatterSpeedParticleEffect(this.columnIndex);
            }
        }
        egret.setTimeout(function () {
            this.currentSpeed = SlotRhythmConst.SPEED;
            this.slotResultList = resultSlots;
            if (this.columnIndex == CommonConst.SCATTER_INDEXS[CommonConst.SCATTER_INDEXS.length - 1]) {
                spinAreaUI.scatterSpeedParticleEffect(-1);
            }
        }, this, delayTime);
    };
    //推动滚动的计时器
    SlotColumnUICom.prototype.onEnterFrame = function () {
        var nowTime = egret.getTimer();
        var passTime = nowTime - this.timeStamp;
        this.timeStamp = nowTime;
        for (var key in this.slotDisplayList) {
            var slot = this.slotDisplayList[key];
            var distance = Math.round((passTime / 1000) * this.currentSpeed);
            //这句做判断是防止每帧位移的距离过大，产生异常（比如设置的速度过快 和 长时间休眠）
            if (distance > (CommonConst.SLOT_ROW_GAP))
                distance = (CommonConst.SLOT_ROW_GAP);
            slot.y += distance;
            //超出最下方的像素值
            var overValue = slot.y - (CommonConst.SLOT_ROW_GAP) * (CommonConst.SLOT_ROW_MAX + 2 - 1);
            if (overValue > 0) {
                //位移到最上方
                slot.y = -(CommonConst.SLOT_ROW_GAP);
                //再减去偏移量
                slot.y += overValue;
                //初始化创建的随机slot用完后，还没停止的话，继续创建
                if (this.slotResultList) {
                    if (!this.bResultJoin) {
                        var currentSlotType = (this.residueSlotList && this.residueSlotList.length > 0) ? this.residueSlotList[0] : null;
                        this.residueSlotList = GameUtil.addResultToResidue(this.slotResultList, currentSlotType);
                        this.bResultJoin = true;
                    }
                }
                else {
                    if (this.residueSlotList.length <= 0) {
                        this.residueSlotList = GameUtil.createResidueSlotList();
                    }
                }
                //转动持续时间结束后，开始加入真正的结果
                if (this.residueSlotList.length > 0) {
                    var slotData = this.residueSlotList.shift();
                    if (slotData.slotType) {
                        slot.setDisplay(this.columnIndex, slotData.slotType, slotData);
                    }
                    else {
                        slot.setDisplay(this.columnIndex, slotData, null);
                    }
                    if (this.residueSlotList.length == 0) {
                        //最后一个中奖图标产生后，记录下来，用于检查它滚动到位后停止tick
                        if (this.bResultJoin && !this.stopSlot) {
                            this.stopSlot = slot;
                        }
                    }
                }
            }
        }
        //最后一个中间slot滚动到位后，停止转动
        if (this.stopSlot) {
            this.spinGroup.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            var offset = -this.stopSlot.y;
            var alreadySend = false;
            for (var i = 0; i < this.slotDisplayList.length; i++) {
                egret.Tween.get(this.slotDisplayList[i])
                    .to({ y: this.slotDisplayList[i].y + offset }, SlotRhythmConst.BOUNCE_TIME[Data.globalProxy.bForceStop ? 0 : this.columnIndex], egret.Ease.backOut)
                    .call(function () {
                    if (!alreadySend) {
                        alreadySend = true;
                        SoundManager.instance.playEffect(SoundType.SPIN_INTERRUPT);
                        if (this.columnIndex == CommonConst.SLOT_COLUMN_MAX - 1) {
                            egret.setTimeout(function () {
                                ObserverManager.sendNotification(MainMediator.SPIN_OVER);
                            }, this, SlotRhythmConst.SPIN_STOP_TO_PRIZE);
                        }
                    }
                }, this);
            }
            var soundName = null;
            if (Data.globalProxy.hasScatter(this.columnIndex) && !Data.globalProxy.bInFreeSpinDisplay) {
                if (this.columnIndex == 0) {
                    soundName = SoundType.SCATTER_1_APPEAR;
                }
                else if (this.columnIndex == 1) {
                    if (Data.globalProxy.hasScatter(0)) {
                        soundName = SoundType.SCATTER_2_APPEAR;
                    }
                }
                else if (this.columnIndex == 2) {
                    if (Data.globalProxy.hasScatter(0) && Data.globalProxy.hasScatter(1)) {
                        soundName = SoundType.SCATTER_ANTICIPATION_END;
                    }
                }
            }
            if (soundName) {
                SoundManager.instance.playEffect(soundName);
            }
            CommonUtil.setSlotLayer(this.spinGroup);
            // 播放scatter
            this.columnPlaySpecialSlotEffect([new SpecialSlotAnimation(CommonConst.SLOT_TYPE_SCATTER, "0", 1)]);
        }
    };
    //播放格子的动画
    SlotColumnUICom.prototype.columnPlaySpecialSlotEffect = function (slotType) {
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            //排除显示视口外的
            if (!this.slotDisplayList[i].resultData)
                continue;
            this.slotDisplayList[i].slotPlaySpecialSlotAnimation(true, slotType, false);
        }
    };
    //播放所有的中奖图标闪烁
    SlotColumnUICom.prototype.playAllWinSlotBlink = function () {
        var forceTopSlotArr = [];
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            this.slotDisplayList[i].dark();
            if (!this.slotDisplayList[i].resultData)
                continue;
            if (!this.slotDisplayList[i].resultData.bWin)
                continue;
            this.slotDisplayList[i].blink(true);
            forceTopSlotArr.push(this.slotDisplayList[i]);
            this.slotDisplayList[i].surroundParticleEffect(true);
            this.slotDisplayList[i].winSlotSurroundParticle();
        }
        if (forceTopSlotArr.length > 0) {
            CommonUtil.setSlotLayer(this.spinGroup, forceTopSlotArr);
        }
    };
    //播放单独的一条线图标闪烁
    SlotColumnUICom.prototype.playLineWinSlotBlink = function (blinkLineIndex) {
        var forceTopSlotArr = [];
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            if (!this.slotDisplayList[i].resultData)
                continue;
            this.slotDisplayList[i].blink(false);
            this.slotDisplayList[i].surroundParticleEffect(false);
            this.slotDisplayList[i].dark();
            var winLineSlot = Data.globalProxy.winLineSlot[blinkLineIndex];
            for (var key in winLineSlot) {
                if (this.slotDisplayList[i].resultData.posIndex == winLineSlot[key]) {
                    this.slotDisplayList[i].blink(true);
                    this.slotDisplayList[i].surroundParticleEffect(true);
                    forceTopSlotArr.push(this.slotDisplayList[i]);
                }
            }
        }
        if (forceTopSlotArr.length > 0) {
            CommonUtil.setSlotLayer(this.spinGroup, forceTopSlotArr);
        }
    };
    //指定类型格子播放效果
    SlotColumnUICom.prototype.playSpecialSlotBlink = function (slotType, bPlay) {
        var forceTopSlotArr = [];
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            this.slotDisplayList[i].dark();
            if (!this.slotDisplayList[i].resultData)
                continue;
            this.slotDisplayList[i].resetSlot();
            if (this.slotDisplayList[i].resultData.slotType != slotType)
                continue;
            this.slotDisplayList[i].blink(bPlay);
            this.slotDisplayList[i].surroundParticleEffect(bPlay);
            if (bPlay) {
                forceTopSlotArr.push(this.slotDisplayList[i]);
            }
        }
        if (forceTopSlotArr.length > 0) {
            CommonUtil.setSlotLayer(this.spinGroup, forceTopSlotArr);
        }
    };
    //获得指定索引的显示对象
    SlotColumnUICom.prototype.getSlotDisplay = function (posIndex) {
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            if (!this.slotDisplayList[i].resultData)
                continue;
            if (this.slotDisplayList[i].resultData.posIndex == posIndex) {
                return this.slotDisplayList[i];
            }
        }
        return null;
    };
    //恢复slot为正常状态
    SlotColumnUICom.prototype.resetSlot = function () {
        for (var i = 0; i < this.slotDisplayList.length; i++) {
            this.slotDisplayList[i].resetSlot();
        }
    };
    return SlotColumnUICom;
}());
__reflect(SlotColumnUICom.prototype, "SlotColumnUICom");
//# sourceMappingURL=SlotColumnUICom.js.map