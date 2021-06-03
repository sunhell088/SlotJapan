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
var HelpMediator = (function (_super) {
    __extends(HelpMediator, _super);
    function HelpMediator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HelpMediator.prototype.initView = function () {
        this.view = new HelpUI();
    };
    HelpMediator.prototype.onEnter = function () {
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_HELP, this.view.onEnter, this.view);
    };
    HelpMediator.prototype.onExit = function () {
        this.view.onExit();
    };
    return HelpMediator;
}(Mediator));
__reflect(HelpMediator.prototype, "HelpMediator");
//# sourceMappingURL=HelpMediator.js.map