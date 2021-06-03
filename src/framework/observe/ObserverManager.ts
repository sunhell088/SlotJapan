/**
 * 模块监听管理，用于游戏模块分离
 **/
class ObserverManager {
    private static observer:Observer = new Observer();
    private static _instance:Game;
    private static _mediators:Object = {};
    private static _commands:Object = {};

    public static sendNotification(command:string, ...arg) {
        ObserverManager.observer.send(command, arg);
    }

    public static registerObserverFun(obj:any) {
        ObserverManager.observer.registerObserverFun(obj);
    }

    //注册Mediator
    public static registerMediator(mediatorClass:any):void {
        var key:string = egret.getQualifiedClassName(mediatorClass);
        if (ObserverManager._mediators.hasOwnProperty(key)) {
            egret.error("registerMediator failed, " + mediatorClass + " is exist");
            return;
        }
        ObserverManager._mediators[key] = new mediatorClass();
    }

    //获取Mediator
    public static getMediator(mediatorClass:any):any {
        var key:string = egret.getQualifiedClassName(mediatorClass);
        if (!ObserverManager._mediators.hasOwnProperty(key)) return null;
        return ObserverManager._mediators[key];
    }

    //注册Command
    public static registerCommand(notificationName:any, commandClass:any):void {
        if (ObserverManager._commands.hasOwnProperty(notificationName)) {
            egret.error("registerCommand failed, " + notificationName + " is exist! commandClass =" + commandClass);
            return;
        }
        ObserverManager._commands[notificationName] = new commandClass();
    }

    //获取Command
    public static getCommand(notificationName:any):any {
        if (!ObserverManager._commands.hasOwnProperty(notificationName)) return null;
        return ObserverManager._commands[notificationName];
    }
}