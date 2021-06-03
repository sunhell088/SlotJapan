class GameRequestData {
    public constructor(action:string, initializeGameRequestData:InitializeGameRequestData, playGameRequestData:PlayGameRequestData, platform:string) {
        this.action = action;
        this.initializeGameRequestData = initializeGameRequestData;
        this.playGameRequestData = playGameRequestData;
        this.platform = platform;
    }

    private action:string;
    private initializeGameRequestData:InitializeGameRequestData;
    private playGameRequestData:PlayGameRequestData;
    private platform:string;
}