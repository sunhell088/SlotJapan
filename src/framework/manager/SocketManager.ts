class SocketManager {
    //正在连接
    public static SERVER_CONNECTING:string = 'onServerConnecting';
    //连线成功
    public static SERVER_CONNECT_SUCCESS:string = "onServerConnectSuccess";
    //掉线
    public static SERVER_DISCONNECT:string = 'onServerDisconnect';
    //连线失败
    public static SERVER_CONNECT_FAIL:string = "onServerConnectFail";
    //命令错误
    public static SERVER_ERROR:string = "onServerError";
    //重连成功
    public static SERVER_RECONNECT:string = "onServerReconnect";
    //重连失败
    public static SERVER_RECONNECT_FAILED:string = "onServerReconnectFailed";
    //正在重连
    public static SERVER_RECONNECTING:string = "onServerReconnecting";

    private static _instance:SocketManager;

    private socket:SocketIOClient.Socket;

    public static get instance():SocketManager {
        if (!SocketManager._instance)
            SocketManager._instance = new SocketManager();
        return SocketManager._instance;
    }

    public connect(serverAddress:string):void {
        this.socket = io.connect(serverAddress, {"forceNew": true});
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
    }

    public isConnect():boolean {
        return this.socket.connected;
    }

    //收到服务器端消息，分发给各模块
    private onMessageEvent(data:any) {
        var msgType = data.type;
        var com:ICommand = ObserverManager.getCommand(msgType);
        if (com) {
            com.execute(data);
        }
        else {
            console.error("未注册通讯Type：", msgType);
        }
    }

    //向服务器端发送消息
    public emitMessage(jsonData:any) {
        if (!this.isConnect()) {
            ViewManager.alert("connect is break");
            return;
        }
        this.socket.emit("messageEvent", jsonData);
    }
}