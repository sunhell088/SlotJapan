var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SocketManager = (function () {
    function SocketManager() {
    }
    Object.defineProperty(SocketManager, "instance", {
        get: function () {
            if (!SocketManager._instance)
                SocketManager._instance = new SocketManager();
            return SocketManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    SocketManager.prototype.connect = function (serverAddress) {
        this.socket = io.connect(serverAddress, { "forceNew": true });
        this.socket.on('connecting', function () {
            console.log("与服务器正在连接");
            // Game.sendNotification(SocketManager.SERVER_CONNECTING);
        });
        this.socket.on('connect', function () {
            console.log("与服务器连接成功");
            ObserverManager.sendNotification(SocketManager.SERVER_CONNECT_SUCCESS);
        });
        this.socket.on('disconnect', function () {
            console.error("与服务器断开");
            // Game.sendNotification(SocketManager.SERVER_DISCONNECT);
            ViewManager.alert(Game.getLanguage("server_disconnect"));
        });
        this.socket.on('connect_failed', function () {
            console.error("与服务器连接失败");
            // Game.sendNotification(SocketManager.SERVER_CONNECT_FAIL);
            ViewManager.alert(Game.getLanguage("server_connect_fail", serverAddress));
        });
        this.socket.on('error', function () {
            console.error("错误发生，并且无法被其他事件类型所处理");
            // Game.sendNotification(SocketManager.SERVER_ERROR);
            ViewManager.alert(Game.getLanguage("server_connect_fail", serverAddress));
        });
        this.socket.on('reconnect', function () {
            console.log("重新连接到服务器成功");
            // Game.sendNotification(SocketManager.SERVER_RECONNECT);
            ViewManager.alert(Game.getLanguage("server_reconnect"));
        });
        this.socket.on('reconnect_failed', function () {
            console.error("重连失败");
            // Game.sendNotification(SocketManager.SERVER_RECONNECT_FAILED);
        });
        this.socket.on('reconnecting', function () {
            console.error("连接异常，正在自动连接中……");
            // Game.sendNotification(SocketManager.SERVER_RECONNECTING);
            ViewManager.showFlowHint(Game.getLanguage("server_reconnecting"));
        });
        this.socket.on('messageEvent', this.onMessageEvent);
    };
    SocketManager.prototype.isConnect = function () {
        return this.socket.connected;
    };
    //收到服务器端消息，分发给各模块
    SocketManager.prototype.onMessageEvent = function (data) {
        var msgType = data.type;
        var com = ObserverManager.getCommand(msgType);
        if (com) {
            com.execute(data);
        }
        else {
            console.error("未注册通讯Type：", msgType);
        }
    };
    //向服务器端发送消息
    SocketManager.prototype.emitMessage = function (jsonData) {
        if (!this.isConnect()) {
            ViewManager.alert("connect is break");
            return;
        }
        this.socket.emit("messageEvent", jsonData);
    };
    //正在连接
    SocketManager.SERVER_CONNECTING = 'onServerConnecting';
    //连线成功
    SocketManager.SERVER_CONNECT_SUCCESS = "onServerConnectSuccess";
    //掉线
    SocketManager.SERVER_DISCONNECT = 'onServerDisconnect';
    //连线失败
    SocketManager.SERVER_CONNECT_FAIL = "onServerConnectFail";
    //命令错误
    SocketManager.SERVER_ERROR = "onServerError";
    //重连成功
    SocketManager.SERVER_RECONNECT = "onServerReconnect";
    //重连失败
    SocketManager.SERVER_RECONNECT_FAILED = "onServerReconnectFailed";
    //正在重连
    SocketManager.SERVER_RECONNECTING = "onServerReconnecting";
    return SocketManager;
}());
__reflect(SocketManager.prototype, "SocketManager");
//# sourceMappingURL=SocketManager.js.map