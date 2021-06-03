var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SoundType = (function () {
    function SoundType() {
    }
    //------------背景音乐
    SoundType.BG_MUSIC = "bg_music_mp3";
    SoundType.BG_MUSIC_FREE_SPIN = "freeSpinbgmusic_mp3";
    //------------通用按键音
    SoundType.ALERT = "alert_mp3"; //提示
    SoundType.BUTTON_CLICK = "Button_Click_mp3"; //按钮音效
    SoundType.BETUP_CLICK = "SlotsAudio_BetUp_mp3"; //押分增加
    SoundType.BETDOWN_CLICK = "SlotsAudio_BetDown_mp3"; //押分减少
    SoundType.SPIN = "Spin_mp3"; //转动过程音效
    SoundType.SPIN_INTERRUPT = "Spin_Interrupt_mp3"; //一个一个停下，正常停下的音效
    SoundType.SCATTER_1_APPEAR = "SlotsAudio_scatter1st_mp3"; //出现第一个scatter图标时的音效
    SoundType.SCATTER_2_APPEAR = "SlotsAudio_scatter2nd_mp3"; //出现第二个scatter图标时的音效
    SoundType.SCATTER_ANTICIPATION_END = "SlotsAudio_scatter3rd_mp3"; //第三个scatter出现
    SoundType.SCATTER_ANTICIPATION = "SlotsAudio_Nervous_mp3"; //出现两个scatter后，后面转动出现加速的音效
    SoundType.FIVE_KIND = "SlotsAudio_FiveKind_mp3"; //五星连珠
    SoundType.NORMAL_WIN_AWARD1 = "Win_1_mp3"; //普通中奖音效1
    SoundType.NORMAL_WIN_AWARD2 = "Win_2_mp3"; //普通中奖音效2
    SoundType.NORMAL_WIN_AWARD3 = "Win_3_mp3"; //普通中奖音效3
    SoundType.BIGWIN_AWARD = "SlotsAudio_BigWin_mp3"; //BIGWIN音效
    SoundType.MEGAWIN_AWARD = "SlotsAudio_MegaWin_mp3"; //MEGAWIN音效
    SoundType.WIN_LAB_NUMBER_END = "SlotsAudio_NumberUp_end_mp3"; //bigwin大奖时，奖金数字增加结束音效
    SoundType.WIN_LAB_NUMBER = "Spin_Start_mp3"; //在赢得框跳动数字音效
    SoundType.SLOT_BLINK = "LineWin_mp3"; //获奖图标环绕动画的音效
    //------------巴西狂欢 特有音效
    SoundType.ALL_SCATTER = "allScatter_mp3"; //三个scatter出现时
    SoundType.FREE_SPIN_SHOW_SELECT = "freeSpinShowSelect_mp3"; //播放freeSpin选择界面入场动画
    SoundType.SELECT_FREE_SPIN = "selectFreeSpin_mp3"; //选中freeSpin一个类型时的音效
    SoundType.FREE_SPIN_START = "freeSpinStart_mp3"; //播放freeSpin正式开始转动时音效
    SoundType.FREE_SPIN_RESULT = "freeSpinResult_mp3"; //免费游戏结束时，展示金额音效
    SoundType.WIN_SLOT_HAVE_WILD = "wildSlot_mp3"; //普通模式和freeSpin下一共5类wild鹦鹉的叫声
    SoundType.QUEEN = "SlotsAudio_queen_mp3"; //播放全屏wild音效
    SoundType.QUEEN_FREE_SPIN = "SlotsAudio_queen_freespin_mp3"; //播放freeSpin中全屏wild音效
    SoundType.START_BUTTON_CLICK = "startButtonClick_mp3"; //点击开始的音效
    return SoundType;
}());
__reflect(SoundType.prototype, "SoundType");
//# sourceMappingURL=SoundType.js.map