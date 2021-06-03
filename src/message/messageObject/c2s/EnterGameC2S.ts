/**
 * 启动游戏
 */
class EnterGameC2S {
    public constructor(operator:string, sessionKey:string, gameName:string) {
        this.operator = operator;
        this.sessionKey = sessionKey;
        this.gameName = gameName;
    }

    public operator:string;
    public sessionKey:string;
    public gameName:string;
}