//莲花数据
class LotusSO {
    //是否是翻牌机会（false则代表为次数）
    public flipChance:boolean;
    //翻牌机会的次数，或者免费游戏的次数
    public count:number;
    //是否已经打开过
    public opened:boolean;
    //是否是当前选择
    public currentChoose:boolean;
}