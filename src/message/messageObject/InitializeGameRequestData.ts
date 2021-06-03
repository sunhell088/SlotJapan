//进入游戏的初始化数据
class InitializeGameRequestData {
    public constructor(gameID, gameVersion, operatorID, sessionKey, model) {
        this.gameID = gameID;
        this.gameVersion = gameVersion;
        this.operatorID = operatorID;
        this.sessionKey = sessionKey;
        this.model = model;
    }

    private gameID:string;
    private gameVersion:string;
    private operatorID:string;
    private sessionKey:string;
    private model:string;
}