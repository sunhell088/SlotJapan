/**
 * 和后台通讯相关的静态方法
 */
class MessageUtil {
    private static HttpGame_Address:string = "/GameLobby/h5handle.game";
    public static MODEL = "STATUS_GAME";
    //--------------------登录，并获取初始消息--------------------
    public static Login():void {
        var initGameRequest = new InitializeGameRequestData(Game.urlData.gameId, "0.1.1", Game.urlData.operatorKey, Game.urlData.sessionKey, MessageUtil.MODEL);
        var gameData = new GameRequestData("initializeGame", initGameRequest, null, egret.Capabilities.isMobile ? "mobile" : "desktop");
        var requestData = "requestData=" + JSON.stringify(gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onServerConnectSuccess);
    }

    //获取房间数据成功
    private static onServerConnectSuccess(event):void {
        var dataObj:any = <egret.HttpRequest>event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        Data.globalProxy.initRoomData(JSON.parse(dataObj));
        //未领取Bonus成功就下线了
        if (Data.globalProxy.bBonusStatus) {
            egret.log("获得Bonus奖");
            MessageUtil.C2S_GetBonus();
        } else {
            //打开大厅界面
            ViewManager.instance.OPEN_WINDOW(MainMediator);
        }
    }


    //--------------------获取转动结果--------------------
    public static C2S_GetSpinResult(bFreespin:boolean, wagerPerLine:number):void {
        if (!Data.globalProxy.bClientAlreadySpin) {
            egret.warn("bClientAlreadySpin");
            return;
        }
        Data.globalProxy.bClientAlreadySpin = false;
        var betList:any[] = [];
        for (var i = 0; i < Data.globalProxy.getDefaultLineCount(); i++) {
            var bet:any = {
                "betContent": "pattern" + i,
                "stake": wagerPerLine
            }
            betList.push(bet);
        }

        var gameData:any = {
            "action": "playGame",
            "initializeGameRequestData": null,
            "playGameRequestData": {
                "operatorKey": Game.urlData.operatorKey,
                "gameName": CommonConst.GAME_ID,
                "gameVersion": "0.1.1",
                "sessionKey": Game.urlData.sessionKey,
                "model": MessageUtil.MODEL,
                "betList": betList,
                "apply": null
            },
            "platform": egret.Capabilities.isMobile ? "mobile" : "desktop"
        };

        var freeGameData:any = {
            "action": "playGame",
            "initializeGameRequestData": null,
            "playGameRequestData": {
                "operatorKey": Game.urlData.operatorKey,
                "gameName": CommonConst.GAME_ID,
                "gameVersion": "0.1.1",
                "sessionKey": Game.urlData.sessionKey,
                "model": MessageUtil.MODEL,
                "apply": "freespin"
            },
            "platform": egret.Capabilities.isMobile ? "mobile" : "desktop"
        };
        var requestData = "requestData=" + JSON.stringify(bFreespin ? freeGameData : gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onGetSpinResult);
    }

    //正常的转动结果
    private static onGetSpinResult(event):void {
        var dataObj:any = <egret.HttpRequest>event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        if(dataObj.code == 400004){
            ViewManager.alert(Game.getLanguage("s2c_data_relogin_by_time"));
            return;
        }
        Data.globalProxy.spinResultData(JSON.parse(dataObj));
        //Bonus大奖和普通奖励一起出来
        if (Data.globalProxy.bBonusStatus) {
            MessageUtil.C2S_GetBonus();
        } else {
            ObserverManager.sendNotification(MainMediator.CLIENT_SHOW_SPIN_RESULT);
            ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
        }
    }

    //------------------选择免费游戏类型---------------------
    public static C2S_SelectFreeType(index:number) {
        var gameData = {
            "action": "playGame",
            "initializeGameRequestData": null,
            "playGameRequestData": {
                "operatorKey": Game.urlData.operatorKey,
                "gameName": CommonConst.GAME_ID,
                "gameVersion": "0.1.1",
                "sessionKey": Game.urlData.sessionKey,
                "model": MessageUtil.MODEL,
                "betList": null,
                "betLists": null,
                "apply": "freespin",
                "choice": index
            },
            "platform": egret.Capabilities.isMobile ? "mobile" : "desktop"
        }
        var requestData = "requestData=" + JSON.stringify(gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onSelectFreeType);
    }

    //选择免费游戏的返回消息
    private static onSelectFreeType(event):void {
        var dataObj:any = <egret.HttpRequest>event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        Data.globalProxy.selectFreeSpinIndexData(JSON.parse(dataObj));
        ObserverManager.sendNotification(FreeGameSelectMediator.SELECT_LOTUS);
        ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
    }

    //------------------向服务器端发送领取bonus消息---------------------
    public static C2S_GetBonus() {
        var gameData = {
            "action": "playGame",
            "initializeGameRequestData": null,
            "playGameRequestData": {
                "operatorKey": Game.urlData.operatorKey,
                "gameName": CommonConst.GAME_ID,
                "gameVersion": "0.1.1",
                "sessionKey": Game.urlData.sessionKey,
                "model": MessageUtil.MODEL,
                "betList": null,
                "betLists": null,
                "apply": "bonus"
            },
            "platform": egret.Capabilities.isMobile ? "mobile" : "desktop"
        }
        var requestData = "requestData=" + JSON.stringify(gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onGetBonus);
    }

    private static onGetBonus(event):void {
        var dataObj:any = <egret.HttpRequest>event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        Data.globalProxy.updateBonusResult(JSON.parse(dataObj));
        if (ViewManager.instance.isMediatorExist(MainMediator)) {
            ObserverManager.sendNotification(MainMediator.CLIENT_SHOW_SPIN_RESULT);
            ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
        } else {
            ViewManager.instance.OPEN_WINDOW(MainMediator);
            ViewManager.instance.hideLoading();
        }
    }
}


