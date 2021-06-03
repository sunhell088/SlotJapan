var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameRequestData = (function () {
    function GameRequestData(action, initializeGameRequestData, playGameRequestData, platform) {
        this.action = action;
        this.initializeGameRequestData = initializeGameRequestData;
        this.playGameRequestData = playGameRequestData;
        this.platform = platform;
    }
    return GameRequestData;
}());
__reflect(GameRequestData.prototype, "GameRequestData");
//# sourceMappingURL=GameRequestData.js.map