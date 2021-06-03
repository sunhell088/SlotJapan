var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 和本游戏相关的静态方法
 */
var GameUtil = (function () {
    function GameUtil() {
    }
    //根据不同的游戏创建随机库
    GameUtil.createSlotRandomList = function (columnIndex) {
        var slotRandomList = [];
        for (var i = 0; i < 20; i++) {
            var slotType = CommonUtil.trans1ToA(CommonUtil.randomInteger(0, CommonConst.SLOT_INDEX.length - 1));
            slotRandomList.push(slotType);
        }
        return slotRandomList;
    };
    //创建后续slot库
    GameUtil.createResidueSlotList = function (startSlotType) {
        if (startSlotType === void 0) { startSlotType = null; }
        var residueSlotList = [];
        if (startSlotType) {
            if (startSlotType == (CommonConst.SLOT_TYPE_WILD + 2)) {
                residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 1);
            }
            else if (startSlotType == (CommonConst.SLOT_TYPE_WILD + 3)) {
                residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 2);
                residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 1);
            }
        }
        var randomData = GameConst.SPIN_RANDOM_SLOTS[CommonUtil.randomInteger(0, GameConst.SPIN_RANDOM_SLOTS.length - 1)];
        //从中间随机一个下标开始
        var randomIndex = CommonUtil.randomInteger(0, randomData.length - 1);
        var slotChar = randomData.charAt(randomIndex);
        //这里这样处理，是规避随机到123的中间，导致不连续的问题
        if (slotChar == "1") {
            randomIndex -= 1;
        }
        else if (slotChar == "2") {
            randomIndex -= 2;
        }
        if (randomIndex < 0) {
            randomIndex = randomData.length - 1;
        }
        for (var i = randomIndex; i >= 0; i--) {
            slotChar = randomData.charAt(i);
            if (slotChar == "1" || slotChar == "2" || slotChar == "3") {
                slotChar = CommonConst.SLOT_TYPE_WILD + slotChar;
            }
            residueSlotList.push(slotChar);
        }
        return residueSlotList;
    };
    //将结果数据加到转动slot库里
    GameUtil.addResultToResidue = function (slotResultData, currentSlotType) {
        var residueSlotList = [];
        //如果当前第一个是wild 2 或 3，那么需要 设置几个假的 在 真正结果前面
        if (currentSlotType == (CommonConst.SLOT_TYPE_WILD + 2)) {
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 2);
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 1);
        }
        else if (currentSlotType == (CommonConst.SLOT_TYPE_WILD + 3)) {
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 3);
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 2);
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 1);
        }
        //如果结果的最后一个是wild 2 或 1，那么需要 设置几个假的 在真正结果的后面
        var lastResult = slotResultData[slotResultData.length - 1].slotType;
        if (lastResult == (CommonConst.SLOT_TYPE_WILD + 2)) {
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 3);
        }
        else if (lastResult == (CommonConst.SLOT_TYPE_WILD + 1)) {
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 3);
            residueSlotList.push(CommonConst.SLOT_TYPE_WILD + 2);
        }
        for (var i = slotResultData.length - 1; i >= 0; i--) {
            residueSlotList.push(slotResultData[i]);
        }
        // var xxoo = "";
        // for(var key in residueSlotList){
        //     xxoo += (residueSlotList[key].slotType?residueSlotList[key].slotType:residueSlotList[key]);
        // }
        // egret.log(currentSlotType);
        // egret.log(xxoo);
        // egret.log(lastResult);
        return residueSlotList;
    };
    //每条线的颜色
    GameUtil.winLineColor = {};
    //需要提前创建对象池的对象
    GameUtil.PRE_OBJECT_POOL = [["9", WinSlotParticlePoolObject], ["5", SlotEffectPoolObject], ["25", SlotPoolObject]];
    //免费游戏所选次数和类型的对应关系
    GameUtil.FREESPIN_COUNT_2_TYPE = { 25: 0, 15: 1, 10: 2, 5: 3, 0: "" };
    return GameUtil;
}());
__reflect(GameUtil.prototype, "GameUtil");
//# sourceMappingURL=GameUtil.js.map