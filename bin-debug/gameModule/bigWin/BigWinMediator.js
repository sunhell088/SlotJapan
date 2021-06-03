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
 * bigWin
 */
var BigWinMediator = (function (_super) {
    __extends(BigWinMediator, _super);
    function BigWinMediator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bHasCreateMovie = false;
        return _this;
    }
    BigWinMediator.prototype.initView = function () {
        this.view = new BigWinUI();
    };
    BigWinMediator.prototype.onEnter = function (awardLevel, awardCount) {
        if (!this.bHasCreateMovie) {
            this.bHasCreateMovie = true;
            //bigwin的掉落金币
            GameUtil.coinFactory = new egret.MovieClipDataFactory(RES.getRes("bigwin_dropCoin_mc_json"), RES.getRes("bigwin_dropCoin_tex_png"));
            //bigwin的动画对应的骨骼文件
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("Slots_bigwin_ske_dbbin"));
            //bigwin的动画对应的图集
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("Slots_bigwin_tex_json"), RES.getRes("Slots_bigwin_tex_png"));
        }
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_BIG_WIN, this.view.onEnter, this.view, awardLevel, awardCount);
    };
    BigWinMediator.prototype.onExit = function () {
        this.view.onExit();
    };
    return BigWinMediator;
}(Mediator));
__reflect(BigWinMediator.prototype, "BigWinMediator");
//# sourceMappingURL=BigWinMediator.js.map