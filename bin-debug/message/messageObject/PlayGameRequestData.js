var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//开始转动的数据
var PlayGameRequestData = (function () {
    function PlayGameRequestData(operatorKey, gameName, gameVersion, sessionKey, model, betList, apply) {
        this.operatorKey = operatorKey;
        this.gameName = gameName;
        this.gameVersion = gameVersion;
        this.sessionKey = sessionKey;
        this.model = model;
        this.betList = betList;
        this.apply = apply;
    }
    return PlayGameRequestData;
}());
__reflect(PlayGameRequestData.prototype, "PlayGameRequestData");
var BetList = (function () {
    function BetList(stake, betMultiple, betContent) {
        this.stake = stake;
        this.betMultiple = betMultiple;
        this.betContent = betContent;
    }
    return BetList;
}());
__reflect(BetList.prototype, "BetList");
//# sourceMappingURL=PlayGameRequestData.js.map