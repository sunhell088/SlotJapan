var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Mediator的加载相关操作类
 **/
var Mediator = (function () {
    function Mediator() {
        this.bResLoadComplete = false;
        ObserverManager.registerObserverFun(this);
    }
    Mediator.prototype.enter = function () {
        var parameters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parameters[_i] = arguments[_i];
        }
        this.enterParameters = parameters;
        //需要判断this.bResLoadComplete ，避免重复 initView
        if (!this.groupName() && !this.bResLoadComplete) {
            this.bResLoadComplete = true;
            this.initView();
            this.onEnter.apply(this, this.enterParameters);
            return;
        }
        if (this.bResLoadComplete) {
            this.onEnter.apply(this, this.enterParameters);
        }
        else {
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.loadGroup(this.groupName());
            ViewManager.instance.showLoading(0, 100);
        }
    };
    Mediator.prototype.exit = function () {
        this.onExit();
    };
    Mediator.prototype.groupName = function () {
        return null;
    };
    Mediator.prototype.initView = function () {
    };
    Mediator.prototype.onEnter = function () {
        var parameters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parameters[_i] = arguments[_i];
        }
    };
    Mediator.prototype.onExit = function () {
    };
    Mediator.prototype.getCommands = function () {
        return null;
    };
    Mediator.prototype.onResourceLoadProgress = function (event) {
        ViewManager.instance.showLoading(event.itemsLoaded, event.itemsTotal);
    };
    Mediator.prototype.onResourceLoadComplete = function () {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
        this.bResLoadComplete = true;
        this.initView();
        this.onEnter.apply(this, this.enterParameters);
        ViewManager.instance.hideLoading();
    };
    return Mediator;
}());
__reflect(Mediator.prototype, "Mediator");
//# sourceMappingURL=Mediator.js.map