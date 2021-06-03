var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 游戏主逻辑模块
 */
var MainMediator = (function (_super) {
    __extends(MainMediator, _super);
    function MainMediator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainMediator.prototype.getCommands = function () {
        return [SocketManager.SERVER_CONNECT_SUCCESS, MainMediator.START_FREE_SPIN, AutoSpinMediator.START_AUTO_SPIN,
            MainMediator.CLIENT_SHOW_SPIN_RESULT, MainMediator.SPIN_OVER, MainMediator.SELF_MONEY_INCREASE,
            MainMediator.WIN_LAB_BOUNCE, MainMediator.BIGWIN_AWARD_COUNT_OVER];
    };
    MainMediator.prototype.initView = function () {
        //中奖数值的爆炸动画
        dragonBones.addMovieGroup(RES.getRes("win_coin_ske_dbmv"), RES.getRes("win_coin_tex_png"));
        //scatter的动画
        dragonBones.addMovieGroup(RES.getRes("animation_scatter_ske_dbmv"), RES.getRes("animation_scatter_tex_png"));
        this.view = new MainUI();
    };
    MainMediator.prototype.onEnter = function () {
        if (Data.globalProxy.getFreespinCount() > 0 || Data.globalProxy.newFreespinStatus) {
            ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_FREE_SPIN, this.view.onEnter, this.view);
        }
        else {
            this.view.onEnter();
        }
    };
    MainMediator.prototype.onExit = function () {
        this.view.onExit();
    };
    MainMediator.prototype.onStartFreeSpin = function () {
        this.view.onStartFreeSpin();
    };
    //客户端执行转动
    MainMediator.prototype.onS2CSpinResult = function () {
        this.view.onS2CSpinResult();
    };
    MainMediator.prototype.onSpinOver = function () {
        this.view.onSpinOver();
    };
    MainMediator.prototype.onSelfMoneyIncrease = function (durationTime) {
        this.view.onSelfMoneyIncrease(durationTime);
    };
    MainMediator.prototype.onWinLabBounce = function (start, end, duringTime) {
        this.view.onWinLabBounce(start, end, duringTime);
    };
    MainMediator.prototype.onBigWinAwardCountOver = function () {
        this.view.onBigWinAwardCountOver();
    };
    MainMediator.prototype.onStartAutoSpin = function () {
        this.view.onStartAutoSpin();
    };
    //通知开始免费游戏
    MainMediator.START_FREE_SPIN = "onStartFreeSpin";
    //中了Freespin,通知自动游戏模块停止
    MainMediator.GAIN_FREE_SPIN = "onGainFreeSpin";
    //中了特殊游戏,通知自动游戏模块停止
    MainMediator.GAIN_SPECIAL_GAME = "onGainSpecialGame";
    //通知其他模块，本轮中了多少钱
    MainMediator.GAIN_MONEY_COUNT = "onGainMoneyCount";
    //通知其他模块，余额发生改变
    MainMediator.BALANCE_CHANGE = "onBalanceChange";
    //客户端转动
    MainMediator.CLIENT_SHOW_SPIN_RESULT = "onS2CSpinResult";
    //收到服务器端数据，并且界面转动结束
    MainMediator.SPIN_OVER = "onSpinOver";
    //通知主界面的自己玩家金额变化
    MainMediator.SELF_MONEY_INCREASE = "onSelfMoneyIncrease";
    //通知主界面播放“赢得”标签的金额跳动
    MainMediator.WIN_LAB_BOUNCE = "onWinLabBounce";
    //奖励数值播放完毕
    MainMediator.BIGWIN_AWARD_COUNT_OVER = "onBigWinAwardCountOver";
    return MainMediator;
}(Mediator));
__reflect(MainMediator.prototype, "MainMediator");
//# sourceMappingURL=MainMediator.js.map