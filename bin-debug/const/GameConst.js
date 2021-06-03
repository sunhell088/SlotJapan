var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameConst = (function () {
    function GameConst() {
    }
    //滚动配置
    GameConst.SPIN_RANDOM_SLOTS = [
        "DAEFDAEACSBFCBEDCDEEACCB123SBDBDBDFAFBAEASDBAA123CCBFSCFBECA",
        "123CBBFEASADFCDDEADBEBDBCADSAFFAEF123DESCBACACBBDCCEBFACEBDA",
        "DEDAEBFDCASDBCEASFADCA123AFDSEACACDCEECABE123SBFDBBDBBABCFCB"
    ];
    return GameConst;
}());
__reflect(GameConst.prototype, "GameConst");
//# sourceMappingURL=GameConst.js.map