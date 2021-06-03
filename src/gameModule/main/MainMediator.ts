/**
 * 游戏主逻辑模块
 */
class MainMediator extends Mediator {
    //通知开始免费游戏
    public static START_FREE_SPIN:string = "onStartFreeSpin";
    //中了Freespin,通知自动游戏模块停止
    public static GAIN_FREE_SPIN:string = "onGainFreeSpin";
    //中了特殊游戏,通知自动游戏模块停止
    public static GAIN_SPECIAL_GAME:string = "onGainSpecialGame";
    //通知其他模块，本轮中了多少钱
    public static GAIN_MONEY_COUNT:string = "onGainMoneyCount";
    //通知其他模块，余额发生改变
    public static BALANCE_CHANGE:string = "onBalanceChange";
    //客户端转动
    public static CLIENT_SHOW_SPIN_RESULT:string = "onS2CSpinResult";
    //收到服务器端数据，并且界面转动结束
    public static SPIN_OVER:string = "onSpinOver";
    //通知主界面的自己玩家金额变化
    public static SELF_MONEY_INCREASE:string = "onSelfMoneyIncrease";
    //通知主界面播放“赢得”标签的金额跳动
    public static WIN_LAB_BOUNCE:string = "onWinLabBounce";
    //奖励数值播放完毕
    public static BIGWIN_AWARD_COUNT_OVER:string = "onBigWinAwardCountOver";

    getCommands():string[] {
        return [SocketManager.SERVER_CONNECT_SUCCESS, MainMediator.START_FREE_SPIN, AutoSpinMediator.START_AUTO_SPIN,
            MainMediator.CLIENT_SHOW_SPIN_RESULT, MainMediator.SPIN_OVER, MainMediator.SELF_MONEY_INCREASE,
            MainMediator.WIN_LAB_BOUNCE, MainMediator.BIGWIN_AWARD_COUNT_OVER];
    }

    initView() {
        //中奖数值的爆炸动画
        dragonBones.addMovieGroup(RES.getRes("win_coin_ske_dbmv"), RES.getRes("win_coin_tex_png"));
        //scatter的动画
        dragonBones.addMovieGroup(RES.getRes("animation_scatter_ske_dbmv"), RES.getRes("animation_scatter_tex_png"));
        this.view = new MainUI();
    }

    onEnter():void {
        if (Data.globalProxy.getFreespinCount() > 0 || Data.globalProxy.newFreespinStatus) {
            ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_FREE_SPIN, this.view.onEnter, this.view);
        }else {
            this.view.onEnter();
        }
    }

    onExit():void {
        this.view.onExit();
    }
    
    private onStartFreeSpin():void {
        (<MainUI>this.view).onStartFreeSpin();
    }

    //客户端执行转动
    private onS2CSpinResult():void {
        (<MainUI>this.view).onS2CSpinResult();
    }

    private onSpinOver():void {
        (<MainUI>this.view).onSpinOver();
    }

    private onSelfMoneyIncrease(durationTime:number):void {
        (<MainUI>this.view).onSelfMoneyIncrease(durationTime);
    }

    private onWinLabBounce(start:number, end:number, duringTime:number):void {
        (<MainUI>this.view).onWinLabBounce(start, end, duringTime);
    }

    private onBigWinAwardCountOver():void {
        (<MainUI>this.view).onBigWinAwardCountOver();
    }

    private onStartAutoSpin():void {
        (<MainUI>this.view).onStartAutoSpin();
    }
}