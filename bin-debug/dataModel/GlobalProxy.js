var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 全局的持久化数据对象
 */
var GlobalProxy = (function () {
    function GlobalProxy() {
        //总的投注的线数（固定的，后台传过来）
        this.defaultLineCount = 0;
        //积分和货币的比例
        this.currencyRate = 1;
        //剩余免费次数
        this.freespinCount = 0;
        //该次免费游戏目前为止获得了多少奖金
        this.freeSpinTotalPay = 0;
        //选择freespin时选择的总次数
        this.freespinTotalTimes = 0;
        //该次免费游戏的倍数
        this.freeSpinMultiple = 0;
        //Bonus中了多少钱
        this.bonusValue = 0;
        //------选择freeSpin次数阶段----------------------------------------------------
        this.flipTimes = 0; //当前剩余翻牌次数
        //----------------------游戏结果------------------------------------------------
        //any里面放的是 SlotResultData[]  数组
        this.slotColumnResult = [];
        //中奖的每一线的图标 二维数组
        this.winLineSlot = [];
        //中奖的每一线的对应的线索引
        this.winLineAllSlotIndex = {};
        //该轮是否中了免费游戏(或者登陆时处于freeSpin选择状态)
        this.newFreespinStatus = false;
        //是否处于中Bonus状态
        this.bBonusStatus = false;
        //----------------自动游戏相关字段--------------
        //剩余自动次数
        this.autoSpinCount = 0;
        //是否触发免费游戏停止自动
        this.bStopAutoByFreeGame = false;
        //是否单次赢得超过指定金额就停止自动
        this.stopAutoBySingleWin = 0;
        //是否余额增加指定金额停止自动
        this.stopAutoByBalanceAdd = 0;
        //是否余额减少指定金额停止自动
        this.stopAutoByBalanceDeduct = 0;
        //开始自动时的余额
        this.startAutoSpinBalance = -1;
        //----------------客户端临时存储数据------------
        this.currentWagerIndex = 0;
        //这个是判断是否依然在freespin界面（包括freespin次数为0的时候）
        this.bInFreeSpinDisplay = false;
        //是否是强制停止
        this.bForceStop = false;
        //获取转动结果消息，必须和转动配对
        this.bClientAlreadySpin = false;
        this.bDebug = false;
    }
    //初始化房间信息
    GlobalProxy.prototype.initRoomData = function (data) {
        this.patternLineIndexConfig = data.paytableInitializeData.availableSlotBetContentList;
        this.defaultLineCount = Object.getOwnPropertyNames(this.patternLineIndexConfig).length;
        CommonUtil.initWinLineColor(this.defaultLineCount);
        this.creditCondition = data.paytableInitializeData.creditCondition.split(",");
        for (var key in this.creditCondition) {
            this.creditCondition[key] = +this.creditCondition[key];
        }
        this.defaultCreditValue = data.paytableInitializeData.defaultCreditValue;
        this.accountID = data.playerAccount.accountID;
        this.credit = +data.playerAccount.credit;
        this.balance = +data.playerAccount.balance;
        this.currencyType = data.playerAccount.currency;
        this.currencyRate = +data.playerAccount.rate;
        this.transformSymbolListToColumn(data.symbolList);
        if (data["restoreData"]) {
            this.bBonusStatus = (data["restoreData"]["bonusStatus"] == "WAITINGSTART");
            this.flipTimes = +data["restoreData"]["flipTimes"];
            //当前剩余免费次数
            this.freespinCount = data["restoreData"]["freespinTimes"] ? data["restoreData"]["freespinTimes"] : 0;
            this.newFreespinStatus = (data["restoreData"]["freespinStatus"] == "WAITINGSTART");
            if (this.newFreespinStatus) {
                this.updateLotusSO(data["restoreData"]["lotuses"]);
            }
            else {
                this.bInFreeSpinDisplay = (this.freespinCount > 0);
            }
            //该次免费游戏目前为止获得了多少奖金
            this.freeSpinTotalPay = +data["restoreData"]["freespinTotalPay"];
            if (data["restoreData"]["freespinTotalTimes"]) {
                this.freespinTotalTimes = +data["restoreData"]["freespinTotalTimes"];
            }
            if (data["restoreData"]["betList"] && data["restoreData"]["betList"].length > 0) {
                this.defaultCreditValue = data["restoreData"]["betList"][0].stake;
            }
        }
        //将服务器端的当前投注额，转换为对应的投注额索引
        var i = 0;
        for (; i < this.creditCondition.length; i++) {
            if (this.creditCondition[i] == this.defaultCreditValue)
                break;
        }
        //兼容更新下注档位配置时的问题
        if (i == this.creditCondition.length) {
            //如果处于免费游戏状态  或者  选择免费游戏
            if (this.freespinCount > 0 || this.newFreespinStatus) {
                this.creditCondition.push(this.defaultCreditValue);
                i = this.creditCondition.length - 1;
            }
            else {
                i = 0;
            }
        }
        this.currentWagerIndex = i;
        if (this.bDebug) {
            egret.log("==================登录========================");
            egret.log("==上一次的每线下注==" + this.defaultCreditValue);
            egret.log("==积分==" + this.credit);
            egret.log("==余额==" + this.balance);
            egret.log("==货币倍率==" + this.currencyRate);
            egret.log("====是否中了Bonus====" + this.bBonusStatus);
            egret.log("====是否在选择莲花阶段====" + this.newFreespinStatus);
            egret.log("==可选择莲花的次数==" + this.flipTimes);
            egret.log("==剩余免费次数==" + this.freespinCount);
            egret.log("==当前已经从免费游戏中获得的奖金==" + this.freeSpinTotalPay);
        }
    };
    //转动结果
    GlobalProxy.prototype.spinResultData = function (data) {
        //玩家当前余额（已加上该轮赢的）
        this.balance = +data["playerAccount"]["balance"];
        //玩家当前积分（已加上该轮赢的）
        this.credit = +data["playerAccount"]["credit"];
        //当前剩余免费次数
        this.freespinCount = data.gameResultList[0]['freespinTimes'];
        this.freespinTotalTimes = data.gameResultList[0]['freespinTotalTimes'];
        //该次免费游戏目前为止获得了多少奖金
        this.freeSpinTotalPay = +data.gameResultList[0]['freespinTotalPay'];
        this.freeSpinMultiple = +data.gameResultList[0]['freespinMultiplier'];
        //该轮是否中了免费游戏
        this.newFreespinStatus = (data.gameResultList[0]['freespinStatus'] == "WAITINGSTART");
        if (this.newFreespinStatus) {
            this.updateLotusSO(data.gameResultList[0]["lotuses"]);
        }
        this.bBonusStatus = (data.gameResultList[0]['bonusStatus'] == "WAITINGSTART");
        this.flipTimes = +(data.gameResultList[0]['flipTimes']);
        //该轮赢得的数量
        this.payout = 0;
        //中奖涉及了哪几个区域（用于前端闪烁）
        this.winLineSlot = [];
        this.winLineAllSlotIndex = {};
        var hittedPos = [];
        for (var key in data["betList"]) {
            var betInfo = data["betList"][key];
            if (betInfo["pay"]) {
                this.payout += (+betInfo["pay"]);
                this.payout = CommonUtil.valueFormatDecimals(this.payout, 2);
            }
            if (betInfo["winContent"]) {
                if (betInfo["winContent"]["winPattern"]) {
                    this.winLineSlot.push(betInfo["winContent"]["winPattern"]);
                    var patternIndex = betInfo["betContent"];
                    this.winLineAllSlotIndex[patternIndex] = this.patternLineIndexConfig[patternIndex];
                }
                for (var kkk in betInfo["winContent"]["winPattern"]) {
                    hittedPos.push(betInfo["winContent"]["winPattern"][kkk]);
                }
            }
        }
        this.transformSymbolListToColumn(data["slotGameResult"]["symbolList"], hittedPos, data["gameResultList"][0]["coverPositions"]);
        if (this.bDebug) {
            egret.log("==================转动========================");
            egret.log("====积分====" + this.credit);
            egret.log("====余额====" + this.balance);
            egret.log("====是否中了Bonus====" + this.bBonusStatus);
            egret.log("====是否在选择莲花阶段====" + this.newFreespinStatus);
            egret.log("====可选择莲花的次数====" + this.flipTimes);
            egret.log("====剩余免费次数====" + this.freespinCount);
            egret.log("====当前已经从免费游戏中获得的奖金====" + this.freeSpinTotalPay);
            egret.log("==本次是否中了freespin==" + this.newFreespinStatus);
            egret.log("==本次获奖的金额==" + this.payout);
        }
    };
    //选择FreeSpinType的服务i返回结果
    GlobalProxy.prototype.selectFreeSpinIndexData = function (data) {
        //当前剩余免费次数
        this.freespinCount = data.gameResultList[0]['freespinTimes'];
        this.freespinTotalTimes = data.gameResultList[0]['freespinTotalTimes'];
        this.flipTimes = data.gameResultList[0]['flipTimes'];
        this.updateLotusSO(data.gameResultList[0]['lotuses']);
        if (this.bDebug) {
            egret.log("==================选择FreeSpin========================");
            egret.log("==当前免费次数==" + this.freespinCount);
            egret.log("====当前可选择次数====" + this.flipTimes);
        }
    };
    //领取bonus的结果
    GlobalProxy.prototype.updateBonusResult = function (data) {
        if (this.bDebug) {
            egret.log("==================领取bonus========================");
            egret.log("==中Bonus前的 payout==" + this.payout);
        }
        this.bBonusStatus = false;
        this.bonusValue = +data["betList"][0].pay;
        this.balance = +data["playerAccount"]["balance"];
        //这里是把中奖数值加到 之前转动的结果
        this.payout += this.bonusValue;
        this.payout = CommonUtil.valueFormatDecimals(this.payout, 2);
        if (this.bInFreeSpinDisplay) {
            this.freeSpinTotalPay += this.bonusValue;
        }
        if (this.bDebug) {
            egret.log("==Bonus奖金数量==" + this.bonusValue);
            egret.log("==当前余额==" + this.balance);
        }
    };
    //将后台的转动结果转换为前台的每一列的数组
    GlobalProxy.prototype.transformSymbolListToColumn = function (symbolList, hittedPos, coverPositions) {
        if (hittedPos === void 0) { hittedPos = null; }
        if (coverPositions === void 0) { coverPositions = null; }
        var slotResultDataList = [];
        for (var key in symbolList) {
            var result = new SlotResultData();
            result.posIndex = symbolList[key]["position"];
            result.slotType = symbolList[key]["name"];
            result.bWin = false;
            result.bMystery = false;
            slotResultDataList[result.posIndex] = result;
        }
        if (hittedPos) {
            for (var key in hittedPos) {
                slotResultDataList[hittedPos[key]].bWin = true;
            }
        }
        this.slotColumnResult = [];
        var rowCount = slotResultDataList.length / CommonConst.SLOT_COLUMN_MAX;
        for (var i = 0; i < CommonConst.SLOT_COLUMN_MAX; i++) {
            var columnResult = [];
            for (var m = 0; m < rowCount; m++) {
                columnResult.push(slotResultDataList[i * rowCount + m]);
            }
            this.slotColumnResult.push(columnResult);
        }
    };
    //------------------客户端数据操作---------------------------
    //获得当前每线的下注额的索引，用于按钮置灰
    GlobalProxy.prototype.getWagerPerLineIndex = function () {
        return this.currentWagerIndex;
    };
    GlobalProxy.prototype.getWagerPerLineMax = function () {
        return this.creditCondition.length;
    };
    //获得当前每线的下注额
    GlobalProxy.prototype.getWagerPerLine = function () {
        if (this.currentWagerIndex < 0 || this.currentWagerIndex >= this.creditCondition.length) {
            egret.error("getWagerPerLine error, currentWagerIndex=" + this.currentWagerIndex);
            return -1;
        }
        return this.creditCondition[this.currentWagerIndex];
    };
    GlobalProxy.prototype.plusWagerIndex = function (bMax) {
        if (bMax === void 0) { bMax = false; }
        if (bMax) {
            this.currentWagerIndex = this.creditCondition.length - 1;
        }
        else {
            this.currentWagerIndex++;
            if (this.currentWagerIndex >= this.creditCondition.length)
                this.currentWagerIndex = this.creditCondition.length - 1;
        }
    };
    GlobalProxy.prototype.deductWagerIndex = function () {
        this.currentWagerIndex--;
        if (this.currentWagerIndex < 0)
            this.currentWagerIndex = 0;
    };
    GlobalProxy.prototype.getDefaultLineCount = function () {
        return this.defaultLineCount;
    };
    //获得中下注额
    GlobalProxy.prototype.getTotalWager = function () {
        var totalWager = this.getWagerPerLine() * this.defaultLineCount;
        return totalWager;
    };
    GlobalProxy.prototype.getAccountID = function () {
        return this.accountID;
    };
    GlobalProxy.prototype.getCredit = function () {
        return this.credit;
    };
    GlobalProxy.prototype.getBalance = function () {
        return this.balance;
    };
    GlobalProxy.prototype.getCurrencyType = function () {
        return this.currencyType;
    };
    GlobalProxy.prototype.getCurrencyRate = function () {
        return this.currencyRate;
    };
    //判断玩家身上的钱是否足够下注
    GlobalProxy.prototype.checkBalance = function () {
        var totalWager = this.getWagerPerLine() * this.defaultLineCount;
        return this.balance >= totalWager;
    };
    //减少玩家身上的余额
    GlobalProxy.prototype.deductBalance = function (count) {
        this.balance -= count;
    };
    //减少免费游戏次数
    GlobalProxy.prototype.deductFreespinCount = function () {
        this.freespinCount--;
    };
    GlobalProxy.prototype.getFreespinCount = function () {
        return this.freespinCount;
    };
    GlobalProxy.prototype.getFreeSpinTotalPay = function () {
        return this.freeSpinTotalPay;
    };
    GlobalProxy.prototype.getFreespinTotalTimes = function () {
        return this.freespinTotalTimes;
    };
    //客户端记录的选择的免费游戏类型
    GlobalProxy.prototype.getFreeSpinSelectType = function () {
        return GameUtil.FREESPIN_COUNT_2_TYPE[this.freespinTotalTimes];
    };
    GlobalProxy.prototype.getFreeSpinMultiple = function () {
        return this.freeSpinMultiple;
    };
    //当前转动结果是否有神秘图标
    GlobalProxy.prototype.haveMystery = function () {
        for (var key in this.slotColumnResult) {
            for (var nextKey in this.slotColumnResult[key])
                if (this.slotColumnResult[key][nextKey].bMystery)
                    return true;
        }
        return false;
    };
    //当前转动的结果是否第1列和第3列有scatter（用于最后一列加速）
    GlobalProxy.prototype.hasScatter = function (columnIndex) {
        for (var nextKey in this.slotColumnResult[columnIndex]) {
            if (this.slotColumnResult[columnIndex][nextKey].slotType == CommonConst.SLOT_TYPE_SCATTER) {
                return true;
            }
        }
        return false;
    };
    //是否中了全屏wild
    GlobalProxy.prototype.isAllWild = function () {
        for (var key in this.slotColumnResult) {
            for (var key2 in this.slotColumnResult[key]) {
                var slotType = this.slotColumnResult[key][key2].slotType;
                if (slotType.indexOf(CommonConst.SLOT_TYPE_WILD) < 0) {
                    return false;
                }
            }
        }
        return true;
    };
    //是否该轮是五星连珠
    GlobalProxy.prototype.isFiveStars = function () {
        return false;
        for (var key in this.winLineAllSlotIndex) {
            var winLineSlot = this.winLineAllSlotIndex[key];
            if (!winLineSlot || winLineSlot.length == 0)
                continue;
            var firstSlot = this.getSlotTypeByIndex(winLineSlot[0]);
            var i = 1;
            for (; i < winLineSlot.length; i++) {
                var slotType = this.getSlotTypeByIndex(winLineSlot[i]);
                if (slotType == CommonConst.SLOT_TYPE_WILD)
                    continue;
                if (slotType != firstSlot)
                    break;
            }
            if (i == winLineSlot.length)
                return true;
        }
        return false;
    };
    //根据slot的position获得对应的图标
    GlobalProxy.prototype.getSlotTypeByIndex = function (index) {
        var slotType = (this.slotColumnResult[parseInt(index / 3 + "")][index % 3]).slotType;
        return slotType;
    };
    //是否处于自动状态下（自动状态又分为：freeSpin下的自动，和普通模式下的自动）
    GlobalProxy.prototype.getAutoState = function () {
        var state = AUTO_SPIN_STATE.NON_AUTO;
        if (Data.globalProxy.bInFreeSpinDisplay) {
            state = AUTO_SPIN_STATE.FREE_SPIN_AUTO;
        }
        else if (Data.globalProxy.autoSpinCount == -1 || Data.globalProxy.autoSpinCount > 0) {
            state = AUTO_SPIN_STATE.AUTO;
        }
        return state;
    };
    //对后台传过来的莲花数组数据进行转为对象
    GlobalProxy.prototype.updateLotusSO = function (data) {
        this.flipLotus = [];
        for (var key in data) {
            var lotus = new LotusSO();
            ObjectUtil.deepCopy(data[key], lotus);
            this.flipLotus.push(lotus);
        }
    };
    return GlobalProxy;
}());
__reflect(GlobalProxy.prototype, "GlobalProxy");
//# sourceMappingURL=GlobalProxy.js.map