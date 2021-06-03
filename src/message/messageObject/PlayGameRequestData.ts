//开始转动的数据
class PlayGameRequestData {
    private operatorKey:string;
    private gameName:string;
    private gameVersion:string;
    private sessionKey:string;
    private model:string;
    private betList:BetList[];
    private apply:string;

    public constructor(operatorKey:string, gameName:string, gameVersion:string, sessionKey:string, model:string, betList:BetList[], apply:string) {
        this.operatorKey = operatorKey;
        this.gameName = gameName;
        this.gameVersion = gameVersion;
        this.sessionKey = sessionKey;
        this.model = model;
        this.betList = betList;
        this.apply = apply;
    }
}

class BetList {
    private stake:number;
    private betMultiple:number;
    private betContent:string;

    public constructor(stake:number, betMultiple:number, betContent:string) {
        this.stake = stake;
        this.betMultiple = betMultiple;
        this.betContent = betContent;
    }
}