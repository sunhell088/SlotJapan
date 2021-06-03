class NoticeCommand implements ICommand {

    execute(dataObj:any):void {
        var noticeCO:NoticeSO = new NoticeSO();
        ObjectUtil.deepCopy(dataObj, noticeCO);

        //登录session错误或者过期
        if (noticeCO.info == "invalid session") {
            ViewManager.alert(Game.getLanguage(noticeCO.info), null, null, false, false);
        } else if (noticeCO.info.indexOf("wager error") >= 0) {
            ViewManager.alert(Game.getLanguage("operation_error_invalid_session"), null, null, false, false);
        } else if (noticeCO.info == "account login by other") {
            ViewManager.alert(Game.getLanguage(noticeCO.info), null, null, false, false);
        }
        else {
            ViewManager.showFlowHint(Game.getLanguage(noticeCO.info));
        }
    }
}
