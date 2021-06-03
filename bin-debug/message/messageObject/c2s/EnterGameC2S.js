var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 启动游戏
 */
var EnterGameC2S = (function () {
    function EnterGameC2S(operator, sessionKey, gameName) {
        this.operator = operator;
        this.sessionKey = sessionKey;
        this.gameName = gameName;
    }
    return EnterGameC2S;
}());
__reflect(EnterGameC2S.prototype, "EnterGameC2S");
//# sourceMappingURL=EnterGameC2S.js.map