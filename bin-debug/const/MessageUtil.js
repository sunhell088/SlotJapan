var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 和后台通讯相关的静态方法
 */
var MessageUtil = (function () {
    function MessageUtil() {
    }
    //--------------------登录，并获取初始消息--------------------
    MessageUtil.Login = function () {
        var initGameRequest = new InitializeGameRequestData(Game.urlData.gameId, "0.1.1", Game.urlData.operatorKey, Game.urlData.sessionKey, MessageUtil.MODEL);
        var gameData = new GameRequestData("initializeGame", initGameRequest, null, egret.Capabilities.isMobile ? "mobile" : "desktop");
        var requestData = "requestData=" + JSON.stringify(gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onServerConnectSuccess);
    };
    //获取房间数据成功
    MessageUtil.onServerConnectSuccess = function (event) {
        var dataObj = event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        Data.globalProxy.initRoomData(JSON.parse(dataObj));
        //未领取Bonus成功就下线了
        if (Data.globalProxy.bBonusStatus) {
            egret.log("获得Bonus奖");
            MessageUtil.C2S_GetBonus();
        }
        else {
            //打开大厅界面
            ViewManager.instance.OPEN_WINDOW(MainMediator);
        }
    };
    //--------------------获取转动结果--------------------
    MessageUtil.C2S_GetSpinResult = function (bFreespin, wagerPerLine) {
        if (!Data.globalProxy.bClientAlreadySpin) {
            egret.warn("bClientAlreadySpin");
            return;
        }
        Data.globalProxy.bClientAlreadySpin = false;
        var betList = [];
        for (var i = 0; i < Data.globalProxy.getDefaultLineCount(); i++) {
            var bet = {
                "betContent": "pattern" + i,
                "stake": wagerPerLine
            };
            betList.push(bet);
        }
        var gameData = {
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
        var freeGameData = {
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
    };
    //正常的转动结果
    MessageUtil.onGetSpinResult = function (event) {
        var dataObj = event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        if (dataObj.code == 400004) {
            ViewManager.alert(Game.getLanguage("s2c_data_relogin_by_time"));
            return;
        }
        Data.globalProxy.spinResultData(JSON.parse(dataObj));
        //Bonus大奖和普通奖励一起出来
        if (Data.globalProxy.bBonusStatus) {
            MessageUtil.C2S_GetBonus();
        }
        else {
            ObserverManager.sendNotification(MainMediator.CLIENT_SHOW_SPIN_RESULT);
            ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
        }
    };
    //------------------选择免费游戏类型---------------------
    MessageUtil.C2S_SelectFreeType = function (index) {
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
        };
        var requestData = "requestData=" + JSON.stringify(gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onSelectFreeType);
    };
    //选择免费游戏的返回消息
    MessageUtil.onSelectFreeType = function (event) {
        var dataObj = event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        Data.globalProxy.selectFreeSpinIndexData(JSON.parse(dataObj));
        ObserverManager.sendNotification(FreeGameSelectMediator.SELECT_LOTUS);
        ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
    };
    //------------------向服务器端发送领取bonus消息---------------------
    MessageUtil.C2S_GetBonus = function () {
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
        };
        var requestData = "requestData=" + JSON.stringify(gameData);
        var url = Game.urlData.address + MessageUtil.HttpGame_Address;
        WebUtil.httpRequest(url, requestData, MessageUtil.onGetBonus);
    };
    MessageUtil.onGetBonus = function (event) {
        var dataObj = event.currentTarget.response;
        if (!dataObj || dataObj.length == 0) {
            ViewManager.alert(Game.getLanguage("s2c_data_error"));
            return;
        }
        Data.globalProxy.updateBonusResult(JSON.parse(dataObj));
        if (ViewManager.instance.isMediatorExist(MainMediator)) {
            ObserverManager.sendNotification(MainMediator.CLIENT_SHOW_SPIN_RESULT);
            ObserverManager.sendNotification(MainMediator.BALANCE_CHANGE, Data.globalProxy.getBalance());
        }
        else {
            ViewManager.instance.OPEN_WINDOW(MainMediator);
            ViewManager.instance.hideLoading();
        }
    };
    MessageUtil.HttpGame_Address = "/GameLobby/h5handle.game";
    MessageUtil.MODEL = "STATUS_GAME";
    return MessageUtil;
}());
__reflect(MessageUtil.prototype, "MessageUtil");
//# sourceMappingURL=MessageUtil.js.map