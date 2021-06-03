class SlotRhythmConst {
    //转动从开始到准备停止的时间
    public static SPIN_DURATION_TIME:number = 500;
    //选择自动时：转动持续的时间
    public static AUTO_SPIN_DURATION_TIME:number = 200;
    //显示上转动停止，到开始播放奖励的间隔时间
    public static SPIN_STOP_TO_PRIZE:number = 750;
    //滚动的速度(单位：像素/秒 )
    public static SPEED:number = 2000;
    //scatter加速时长
    public static SCATTER_DELAY_TIME:number = 1600;
    //从第一列开始，一次停下来的间隔时间
    public static SLOT_COLUMN_STOP_GAP_TIME:number[] = [0, 200, 300, 350, 375];
    //每列停止回弹的时间（彻底停止）
    public static BOUNCE_TIME:number[] = [400, 500, 600, 700, 800];
    //要中scatter时的加速倍数
    public static SPEED_MULTIPLE:number = 1.35;
    //显示五星连珠动画的持续时间
    public static FIVE_STARS_DURATION:number = 2000;
    //奖励数值动画播放完毕后，延迟多少时间，播放中freeSpin的动画
    public static HIT_FREESPIN_EFFECT_DELAY:number = 1250;
    //freespin最后一次转动，奖励数值动画播放完毕后，延迟多少时间，弹出结算面板
    public static FREESPIN_TOTAL_RESULT_DELAY:number = 2000;

    //freespin结算面板数值从0到目标数值的持续时间
    public static FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION:number[] = [50, 2000];
    //freespin结算面板数值从0到目标数值的持续时间 的 大小数值界限
    public static FREESPIN_TOTAL_RESULT_VALUE_BOUNCE_DURATION_COUNT:number = 50;

    //中奖的每线图标，闪烁的间隔时间
    public static WIN_LINE_BLINK_INTERVAL:number = 2000;
    //在免费游戏中下线再上线时，开始转动的延迟时间（因为免费游戏是自动转动）
    public static LOGIN_FREE_SPIN_START_DELAY:number = 2000;

    //bigwin界面打开后，等待多少时间，开始显示跳动的中奖数字
    public static BIG_WIN_VALUE_BOUNCE_DELAY_OPEN:number = 1000;
    //bigwin中中奖数值从0到目标数值的持续时间
    public static BIG_WIN_VALUE_BOUNCE_DURATION:number[] = [2000, 4000];
    //bigwin中中奖数值从0到目标数值的持续时间 的 大小数值界限
    public static BIG_WIN_VALUE_BOUNCE_DURATION_COUNT:number = 250;
    //bigwin中奖数值跳动完后，等待多少时间，关闭BIGWIN界面
    public static BIG_WIN_CLOSE_DELAY_VALUE_BOUNCE:number = 2000;

    //从打开免费游戏次数选择界面，到波浪效果消失，的持续时间
    public static FREE_SPIN_SELECT_SHADER_DURATION:number = 3000;
    //从打开免费游戏次数选择界面, 渐现持续时间
    public static FREE_SPIN_SELECT_ALPHA_DURATION:number = 2500;
    
    //-------分割线-下面是具体游戏的定义---------------
    //从开始播放 “中freeSpin的动画”，到开始显示选择免费次数界面的间隔时间
    public static FREE_SPIN_SELECT_UI_DELAY:number = 2500;
    //freeSpin中，从中奖slot开始闪烁，到显示倍数的间隔时间
    public static FREE_SPIN_MULTIPLE_DELAY:number = 1500;
    //freeSpin中，从显示倍数开始计时，到播放中奖金额动画的间隔时间
    public static FREE_SPIN_MULTIPLE_DELAY_TO_VALUE:number = 2000;
    //从"选择免费次数界面"关闭，到“开始转动”的间隔时间
    public static FREE_SPIN_SELECT_TO_START_DELAY:number = 800;
}
