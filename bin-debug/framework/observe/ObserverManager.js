var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 模块监听管理，用于游戏模块分离
 **/
var ObserverManager = (function () {
    function ObserverManager() {
    }
    ObserverManager.sendNotification = function (command) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        ObserverManager.observer.send(command, arg);
    };
    ObserverManager.registerObserverFun = function (obj) {
        ObserverManager.observer.registerObserverFun(obj);
    };
    //注册Mediator
    ObserverManager.registerMediator = function (mediatorClass) {
        var key = egret.getQualifiedClassName(mediatorClass);
        if (ObserverManager._mediators.hasOwnProperty(key)) {
            egret.error("registerMediator failed, " + mediatorClass + " is exist");
            return;
        }
        ObserverManager._mediators[key] = new mediatorClass();
    };
    //获取Mediator
    ObserverManager.getMediator = function (mediatorClass) {
        var key = egret.getQualifiedClassName(mediatorClass);
        if (!ObserverManager._mediators.hasOwnProperty(key))
            return null;
        return ObserverManager._mediators[key];
    };
    //注册Command
    ObserverManager.registerCommand = function (notificationName, commandClass) {
        if (ObserverManager._commands.hasOwnProperty(notificationName)) {
            egret.error("registerCommand failed, " + notificationName + " is exist! commandClass =" + commandClass);
            return;
        }
        ObserverManager._commands[notificationName] = new commandClass();
    };
    //获取Command
    ObserverManager.getCommand = function (notificationName) {
        if (!ObserverManager._commands.hasOwnProperty(notificationName))
            return null;
        return ObserverManager._commands[notificationName];
    };
    ObserverManager.observer = new Observer();
    ObserverManager._mediators = {};
    ObserverManager._commands = {};
    return ObserverManager;
}());
__reflect(ObserverManager.prototype, "ObserverManager");
//# sourceMappingURL=ObserverManager.js.map