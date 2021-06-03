var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var NoticeCommand = (function () {
    function NoticeCommand() {
    }
    NoticeCommand.prototype.execute = function (dataObj) {
        var noticeCO = new NoticeSO();
        ObjectUtil.deepCopy(dataObj, noticeCO);
        //登录session错误或者过期
        if (noticeCO.info == "invalid session") {
            ViewManager.alert(Game.getLanguage(noticeCO.info), null, null, false, false);
        }
        else if (noticeCO.info.indexOf("wager error") >= 0) {
            ViewManager.alert(Game.getLanguage("operation_error_invalid_session"), null, null, false, false);
        }
        else if (noticeCO.info == "account login by other") {
            ViewManager.alert(Game.getLanguage(noticeCO.info), null, null, false, false);
        }
        else {
            ViewManager.showFlowHint(Game.getLanguage(noticeCO.info));
        }
    };
    return NoticeCommand;
}());
__reflect(NoticeCommand.prototype, "NoticeCommand", ["ICommand"]);
//# sourceMappingURL=NoticeCommand.js.map