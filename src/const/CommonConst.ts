class CommonConst {
    //美术给出的标准分辨率
    public static STAGE_WIDTH = 1136;
    public static STAGE_HEIGHT = 640;
    //和后台通讯的游戏ID
    public static GAME_ID:string = "SlotJapan";
    //是否是转动起来时，是模糊的图片
    public static B_SLOT_DIM:boolean = false;
    //有特效的scatter wild等的动画，是否需要遮罩
    public static B_SLOT_MASK:boolean = false;
    //是否显示线
    public static SHOW_LINE:boolean = true;
    //slot是否需要layer排序
    public static B_SLOT_LAYER:boolean = false;
    //中奖图标是否需要抖动
    public static WIN_SLOT_SHAKE:boolean = false;
    //非中奖图标是否调暗
    public static NON_WIN_SLOT_DARK:boolean = false;

    //scatter会出现的列
    public static SCATTER_INDEXS:number[] = [0, 1, 2];
    //每列slot之间的垂直距离（高）
    public static SLOT_ROW_GAP:number = 152;
    //每列slot之间的水平距离（宽）
    public static SLOT_COLUMN_GAP:number = 246;
    //游戏对应slot的列数（艺伎回忆录就是3列）
    public static SLOT_COLUMN_MAX:number = 3;
    //游戏对应slot的行数（多福多宝就是3 4 5行的情况）
    public static SLOT_ROW_MAX:number = 3;
    //不同类型slot对应的数组下标
    public static SLOT_INDEX:string[] = ["A", "B", "C", "D", "E", "F", "S", "W"];
    //wild对应的标识
    public static SLOT_TYPE_WILD:string = "W";
    //scatter对应的标识
    public static SLOT_TYPE_SCATTER:string = "S";
    //特殊图标
    public static SPECIAL_SLOT_TYPES:string[] = [CommonConst.SLOT_TYPE_SCATTER];
    //第一次玩游戏时默认图标
    public static DEFAULTS_SLOTS:any[] = ["A", "B", "C", "D", "E"];
}

//奖励的档次
enum AWARD_LEVEL{
    NORMAL,
    BIG_WIN,
    MEGA_WIN,
    EPIC_WIN
}

//游戏的当前状态
enum SPIN_STATE{
    //正在 非自动下的等待开始转动中
    READY_SPIN = 0,
    //正在 非自动下的转动中
    SPINNING = 1,
    //正在 非自动下已经通知停止，但还是播放 停止的缓动动画 过程中
    STOP_ING = 2,
    //正在 自动中
    AUTO_SPINNING = 3,
    //正在 免费游戏转动中
    FREE_SPIN = 4,
    //正在 自动下已经通知停止，但还是播放 停止的缓动动画 过程中
    AUTO_STOP_ING = 5
}

//自动游戏的类别
enum AUTO_SPIN_STATE{
    //非自动
    NON_AUTO = 0,
    //正在 自动中
    AUTO = 1,
    //正在 免费游戏转动中
    FREE_SPIN_AUTO = 2
}