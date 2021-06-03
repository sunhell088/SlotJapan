var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CommonConst = (function () {
    function CommonConst() {
    }
    //美术给出的标准分辨率
    CommonConst.STAGE_WIDTH = 1136;
    CommonConst.STAGE_HEIGHT = 640;
    //和后台通讯的游戏ID
    CommonConst.GAME_ID = "SlotJapan";
    //是否是转动起来时，是模糊的图片
    CommonConst.B_SLOT_DIM = false;
    //有特效的scatter wild等的动画，是否需要遮罩
    CommonConst.B_SLOT_MASK = false;
    //是否显示线
    CommonConst.SHOW_LINE = true;
    //slot是否需要layer排序
    CommonConst.B_SLOT_LAYER = false;
    //中奖图标是否需要抖动
    CommonConst.WIN_SLOT_SHAKE = false;
    //非中奖图标是否调暗
    CommonConst.NON_WIN_SLOT_DARK = false;
    //scatter会出现的列
    CommonConst.SCATTER_INDEXS = [0, 1, 2];
    //每列slot之间的垂直距离（高）
    CommonConst.SLOT_ROW_GAP = 152;
    //每列slot之间的水平距离（宽）
    CommonConst.SLOT_COLUMN_GAP = 246;
    //游戏对应slot的列数（艺伎回忆录就是3列）
    CommonConst.SLOT_COLUMN_MAX = 3;
    //游戏对应slot的行数（多福多宝就是3 4 5行的情况）
    CommonConst.SLOT_ROW_MAX = 3;
    //不同类型slot对应的数组下标
    CommonConst.SLOT_INDEX = ["A", "B", "C", "D", "E", "F", "S", "W"];
    //wild对应的标识
    CommonConst.SLOT_TYPE_WILD = "W";
    //scatter对应的标识
    CommonConst.SLOT_TYPE_SCATTER = "S";
    //特殊图标
    CommonConst.SPECIAL_SLOT_TYPES = [CommonConst.SLOT_TYPE_SCATTER];
    //第一次玩游戏时默认图标
    CommonConst.DEFAULTS_SLOTS = ["A", "B", "C", "D", "E"];
    return CommonConst;
}());
__reflect(CommonConst.prototype, "CommonConst");
//奖励的档次
var AWARD_LEVEL;
(function (AWARD_LEVEL) {
    AWARD_LEVEL[AWARD_LEVEL["NORMAL"] = 0] = "NORMAL";
    AWARD_LEVEL[AWARD_LEVEL["BIG_WIN"] = 1] = "BIG_WIN";
    AWARD_LEVEL[AWARD_LEVEL["MEGA_WIN"] = 2] = "MEGA_WIN";
    AWARD_LEVEL[AWARD_LEVEL["EPIC_WIN"] = 3] = "EPIC_WIN";
})(AWARD_LEVEL || (AWARD_LEVEL = {}));
//游戏的当前状态
var SPIN_STATE;
(function (SPIN_STATE) {
    //正在 非自动下的等待开始转动中
    SPIN_STATE[SPIN_STATE["READY_SPIN"] = 0] = "READY_SPIN";
    //正在 非自动下的转动中
    SPIN_STATE[SPIN_STATE["SPINNING"] = 1] = "SPINNING";
    //正在 非自动下已经通知停止，但还是播放 停止的缓动动画 过程中
    SPIN_STATE[SPIN_STATE["STOP_ING"] = 2] = "STOP_ING";
    //正在 自动中
    SPIN_STATE[SPIN_STATE["AUTO_SPINNING"] = 3] = "AUTO_SPINNING";
    //正在 免费游戏转动中
    SPIN_STATE[SPIN_STATE["FREE_SPIN"] = 4] = "FREE_SPIN";
    //正在 自动下已经通知停止，但还是播放 停止的缓动动画 过程中
    SPIN_STATE[SPIN_STATE["AUTO_STOP_ING"] = 5] = "AUTO_STOP_ING";
})(SPIN_STATE || (SPIN_STATE = {}));
//自动游戏的类别
var AUTO_SPIN_STATE;
(function (AUTO_SPIN_STATE) {
    //非自动
    AUTO_SPIN_STATE[AUTO_SPIN_STATE["NON_AUTO"] = 0] = "NON_AUTO";
    //正在 自动中
    AUTO_SPIN_STATE[AUTO_SPIN_STATE["AUTO"] = 1] = "AUTO";
    //正在 免费游戏转动中
    AUTO_SPIN_STATE[AUTO_SPIN_STATE["FREE_SPIN_AUTO"] = 2] = "FREE_SPIN_AUTO";
})(AUTO_SPIN_STATE || (AUTO_SPIN_STATE = {}));
//# sourceMappingURL=CommonConst.js.map