var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 观察者
 **/
var Observer = (function () {
    function Observer() {
        //所有被监听的方法
        this._registerObservers = {};
    }
    Observer.prototype.registerObserverFun = function (observer) {
        var medCommands = observer.getCommands();
        if (!medCommands)
            return;
        var observerList;
        for (var i = 0; i < medCommands.length; i++) {
            if (!this._registerObservers.hasOwnProperty(medCommands[i])) {
                this._registerObservers[medCommands[i]] = [];
            }
            observerList = this._registerObservers[medCommands[i]];
            if (observerList.indexOf(observer) == -1) {
                observerList.push(observer);
            }
        }
    };
    Observer.prototype.send = function (command, arg) {
        if (arg === void 0) { arg = null; }
        var observerList = this._registerObservers[command];
        if (observerList == null) {
            egret.error(command + " has not been registered");
            return;
        }
        var fun;
        var oneObserver;
        for (var i = 0; i < observerList.length; i++) {
            oneObserver = observerList[i];
            if (oneObserver == null) {
                console.error(command);
                continue;
            }
            fun = oneObserver[command];
            if (fun == null) {
                console.error("Observer send , function is null!");
            }
            else if (arg == null || arg.length == 0)
                fun.call(oneObserver);
            else
                fun.apply(oneObserver, arg);
        }
    };
    return Observer;
}());
__reflect(Observer.prototype, "Observer");
//# sourceMappingURL=Observer.js.map