var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//进入游戏的初始化数据
var InitializeGameRequestData = (function () {
    function InitializeGameRequestData(gameID, gameVersion, operatorID, sessionKey, model) {
        this.gameID = gameID;
        this.gameVersion = gameVersion;
        this.operatorID = operatorID;
        this.sessionKey = sessionKey;
        this.model = model;
    }
    return InitializeGameRequestData;
}());
__reflect(InitializeGameRequestData.prototype, "InitializeGameRequestData");
//# sourceMappingURL=InitializeGameRequestData.js.map