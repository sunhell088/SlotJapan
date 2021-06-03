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
 * 免费游戏选择界面
 */
var FreeGameSelectMediator = (function (_super) {
    __extends(FreeGameSelectMediator, _super);
    function FreeGameSelectMediator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FreeGameSelectMediator.prototype.getCommands = function () {
        return [FreeGameSelectMediator.SELECT_LOTUS];
    };
    FreeGameSelectMediator.prototype.initView = function () {
        this.view = new FreeGameSelectUI();
    };
    FreeGameSelectMediator.prototype.onEnter = function () {
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_FREE_SPIN, this.view.onEnter, this.view);
    };
    FreeGameSelectMediator.prototype.onExit = function () {
        this.view.onExit();
    };
    FreeGameSelectMediator.prototype.openLotus = function () {
        this.view.openLotus();
    };
    //通知选择了莲花
    FreeGameSelectMediator.SELECT_LOTUS = "openLotus";
    return FreeGameSelectMediator;
}(Mediator));
__reflect(FreeGameSelectMediator.prototype, "FreeGameSelectMediator");
//# sourceMappingURL=FreeGameSelectMediator.js.map