/**
 * 全局的持久化数据对象
 */
class GlobalProxy {
    //每一线的位置
    public patternLineIndexConfig:{};
    //每线下注额
    private creditCondition:number[];
    //总的投注的线数（固定的，后台传过来）
    private defaultLineCount:number = 0;
    //最后一次选择的下注额
    private defaultCreditValue:number;
    //玩家帐号
    private accountID:string;
    //玩家积分
    private credit:number;
    //玩家余额
    private balance:number;
    //货币类型字符串
    private currencyType:string;
    //积分和货币的比例
    private currencyRate:number = 1;
    //剩余免费次数
    private freespinCount:number = 0;
    //该次免费游戏目前为止获得了多少奖金
    private freeSpinTotalPay:number = 0;
    //选择freespin时选择的总次数
    private freespinTotalTimes:number = 0;
    //该次免费游戏的倍数
    private freeSpinMultiple:number = 0;
    //Bonus中了多少钱
    public bonusValue:number = 0;
    //------选择freeSpin次数阶段----------------------------------------------------
    public flipTimes:number = 0;   //当前剩余翻牌次数
    public flipLotus:LotusSO[];

    //----------------------游戏结果------------------------------------------------
    //any里面放的是 SlotResultData[]  数组
    public slotColumnResult:any[] = [];
    //中奖的每一线的图标 二维数组
    public winLineSlot:any[] = [];
    //中奖的每一线的对应的线索引
    public winLineAllSlotIndex:{} = {};
    //该轮是否中了免费游戏(或者登陆时处于freeSpin选择状态)
    public newFreespinStatus:boolean = false;
    //该轮转动赢得的数值 或者  本次积福奖的奖金
    public payout:number;
    //是否处于中Bonus状态
    public bBonusStatus:boolean = false;


    //----------------自动游戏相关字段--------------
    //剩余自动次数
    public autoSpinCount:number = 0;
    //是否触发免费游戏停止自动
    public bStopAutoByFreeGame:boolean = false;
    //是否单次赢得超过指定金额就停止自动
    public stopAutoBySingleWin:number = 0;
    //是否余额增加指定金额停止自动
    public stopAutoByBalanceAdd:number = 0;
    //是否余额减少指定金额停止自动
    public stopAutoByBalanceDeduct:number = 0;
    //开始自动时的余额
    public startAutoSpinBalance:number = -1;

    //----------------客户端临时存储数据------------
    private currentWagerIndex:number = 0;
    //这个是判断是否依然在freespin界面（包括freespin次数为0的时候）
    public bInFreeSpinDisplay:boolean = false;
    //是否是强制停止
    public bForceStop:boolean = false;
    //获取转动结果消息，必须和转动配对
    public bClientAlreadySpin:boolean = false;

    private bDebug:boolean = false;
    //初始化房间信息
    public initRoomData(data:any):void {
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
            } else {
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
            if (this.creditCondition[i] == this.defaultCreditValue) break;
        }
        //兼容更新下注档位配置时的问题
        if (i == this.creditCondition.length) {
            //如果处于免费游戏状态  或者  选择免费游戏
            if (this.freespinCount > 0 || this.newFreespinStatus) {
                this.creditCondition.push(this.defaultCreditValue);
                i = this.creditCondition.length - 1;
            } else {
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
    }

    //转动结果
    public spinResultData(data:any):void {
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
                    var patternIndex:string = betInfo["betContent"];
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
    }

    //选择FreeSpinType的服务i返回结果
    public selectFreeSpinIndexData(data:any):void {
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
    }

    //领取bonus的结果
    public updateBonusResult(data:any):void {
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
    }

    //将后台的转动结果转换为前台的每一列的数组
    public transformSymbolListToColumn(symbolList:any[], hittedPos:number[] = null, coverPositions:number[] = null):void {
        var slotResultDataList:any = [];
        for (var key in symbolList) {
            var result:SlotResultData = new SlotResultData();
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
        var rowCount:number = slotResultDataList.length / CommonConst.SLOT_COLUMN_MAX;
        for (var i = 0; i < CommonConst.SLOT_COLUMN_MAX; i++) {
            var columnResult:SlotResultData[] = [];
            for (var m = 0; m < rowCount; m++) {
                columnResult.push(slotResultDataList[i * rowCount + m]);
            }
            this.slotColumnResult.push(columnResult);
        }
    }

    //------------------客户端数据操作---------------------------
    //获得当前每线的下注额的索引，用于按钮置灰
    public getWagerPerLineIndex():number {
        return this.currentWagerIndex;
    }

    public getWagerPerLineMax():number {
        return this.creditCondition.length;
    }

    //获得当前每线的下注额
    public getWagerPerLine():number {
        if (this.currentWagerIndex < 0 || this.currentWagerIndex >= this.creditCondition.length) {
            egret.error("getWagerPerLine error, currentWagerIndex=" + this.currentWagerIndex);
            return -1;
        }
        return this.creditCondition[this.currentWagerIndex];
    }

    public plusWagerIndex(bMax:boolean = false):void {
        if (bMax) {
            this.currentWagerIndex = this.creditCondition.length - 1;
        } else {
            this.currentWagerIndex++;
            if (this.currentWagerIndex >= this.creditCondition.length)
                this.currentWagerIndex = this.creditCondition.length - 1;
        }
    }

    public deductWagerIndex():void {
        this.currentWagerIndex--;
        if (this.currentWagerIndex < 0)
            this.currentWagerIndex = 0;
    }

    public getDefaultLineCount():number {
        return this.defaultLineCount;
    }

    //获得中下注额
    public getTotalWager():number {
        var totalWager = this.getWagerPerLine() * this.defaultLineCount;
        return totalWager;
    }

    public getAccountID():string {
        return this.accountID;
    }

    public getCredit():number {
        return this.credit;
    }

    public getBalance():number {
        return this.balance;
    }

    public getCurrencyType():string {
        return this.currencyType;
    }

    public getCurrencyRate():number {
        return this.currencyRate;
    }

    //判断玩家身上的钱是否足够下注
    public checkBalance():boolean {
        var totalWager = this.getWagerPerLine() * this.defaultLineCount;
        return this.balance >= totalWager;
    }

    //减少玩家身上的余额
    public deductBalance(count:number):void {
        this.balance -= count;
    }

    //减少免费游戏次数
    public deductFreespinCount():void {
        this.freespinCount--;
    }

    public getFreespinCount():number {
        return this.freespinCount;
    }

    public getFreeSpinTotalPay():number {
        return this.freeSpinTotalPay;
    }

    public getFreespinTotalTimes():number {
        return this.freespinTotalTimes;
    }

    //客户端记录的选择的免费游戏类型
    public getFreeSpinSelectType():string {
        return GameUtil.FREESPIN_COUNT_2_TYPE[this.freespinTotalTimes];
    }

    public getFreeSpinMultiple():number {
        return this.freeSpinMultiple;
    }

    //当前转动结果是否有神秘图标
    public haveMystery():boolean {
        for (var key in this.slotColumnResult) {
            for (var nextKey in this.slotColumnResult[key])
                if (this.slotColumnResult[key][nextKey].bMystery) return true;
        }
        return false;
    }

    //当前转动的结果是否第1列和第3列有scatter（用于最后一列加速）
    public hasScatter(columnIndex:number):boolean {
        for (var nextKey in this.slotColumnResult[columnIndex]) {
            if (this.slotColumnResult[columnIndex][nextKey].slotType == CommonConst.SLOT_TYPE_SCATTER) {
                return true;
            }
        }
        return false;
    }

    //是否中了全屏wild
    public isAllWild():boolean {
        for (var key in this.slotColumnResult) {
            for (var key2 in this.slotColumnResult[key]) {
                var slotType = (<SlotResultData>this.slotColumnResult[key][key2]).slotType;
                if (slotType.indexOf(CommonConst.SLOT_TYPE_WILD) < 0){
                    return false;
                }
            }
        }
        return true;
    }

    //是否该轮是五星连珠
    public isFiveStars():boolean {
        return false;
        for (var key in this.winLineAllSlotIndex) {
            var winLineSlot:any[] = this.winLineAllSlotIndex[key];
            if (!winLineSlot || winLineSlot.length == 0) continue;
            var firstSlot = this.getSlotTypeByIndex(winLineSlot[0]);
            var i = 1;
            for (; i < winLineSlot.length; i++) {
                var slotType:string = this.getSlotTypeByIndex(winLineSlot[i]);
                if (slotType == CommonConst.SLOT_TYPE_WILD) continue;
                if (slotType != firstSlot) break;
            }
            if (i == winLineSlot.length) return true;
        }
        return false;
    }

    //根据slot的position获得对应的图标
    public getSlotTypeByIndex(index:number):string {
        var slotType = (this.slotColumnResult[parseInt(index / 3 + "")][index % 3]).slotType;
        return slotType;
    }

    //是否处于自动状态下（自动状态又分为：freeSpin下的自动，和普通模式下的自动）
    public getAutoState():AUTO_SPIN_STATE {
        var state:AUTO_SPIN_STATE = AUTO_SPIN_STATE.NON_AUTO;
        if (Data.globalProxy.bInFreeSpinDisplay) {
            state = AUTO_SPIN_STATE.FREE_SPIN_AUTO;
        } else if (Data.globalProxy.autoSpinCount == -1 || Data.globalProxy.autoSpinCount > 0) {
            state = AUTO_SPIN_STATE.AUTO;
        }
        return state;
    }

    //对后台传过来的莲花数组数据进行转为对象
    private updateLotusSO(data:any[]):void {
        this.flipLotus = [];
        for (var key in data) {
            var lotus:LotusSO = new LotusSO();
            ObjectUtil.deepCopy(data[key], lotus);
            this.flipLotus.push(lotus);
        }
    }
}