/**
 * Created by Kurt on 2018/9/13.
 */
class LotusUICom extends eui.Component {
    private static LOTUS_RANDOM_TYPE:number[] = [1, 2, 3, 3, 2, 1, 1, 2, 3, 2, 1, 1];
    private bgBtn:eui.Button;
    public countLab:eui.BitmapLabel
    private typeImg:eui.Image;
    private bgBtnState:string;

    constructor() {
        super();
        this.skinName = LotusUIComSkin;
    }

    protected createChildren() {
        super.createChildren();
        this.touchChildren = false;
    }

    public init(lotusSO:LotusSO, index:number):void {
        this.bgBtnState = LotusUICom.LOTUS_RANDOM_TYPE[index] + "";
        this.invalidateState();
        this["bgBtn" + this.getCurrentState()].enabled = true;
        this["bgBtn" + this.getCurrentState()].scaleX = CommonUtil.randomInteger(0, 1) == 0 ? 1 : -1;
        this.countLab.visible = lotusSO.opened;
        this.countLab.text = lotusSO.count + "";
        this.countLab.filters = null;
        this.typeImg.visible = lotusSO.opened;
        if (this.typeImg.visible) {
            this.typeImg.source = lotusSO.flipChance ? "flipTimeIcon_png" : "freeSpinCountIcon_png";
        }
    }

    public open(lotusSO:LotusSO, bEnable:boolean):void {
        this.touchEnabled = false;
        this["bgBtn" + this.getCurrentState()].enabled = bEnable;
        this.countLab.visible = true;
        this.countLab.text = lotusSO.count + "";
        this.countLab.filters = bEnable ? null : [CommonUtil.greyColorFlilter];
        this.typeImg.visible = true;
        this.typeImg.source = lotusSO.flipChance ? "flipTimeIcon_png" : "freeSpinCountIcon_png";
        this.typeImg.filters = bEnable ? null : [CommonUtil.greyColorFlilter];
        //动画
        egret.Tween.removeTweens(this.countLab);
        egret.Tween.removeTweens(this.typeImg);
        this.countLab.scaleX = this.countLab.scaleY = 0;
        egret.Tween.get(this.countLab).to({scaleX: 1, scaleY: 1}, 800, bEnable ? egret.Ease.bounceOut : null);
        this.typeImg.scaleX = this.typeImg.scaleY = 0;
        egret.Tween.get(this.typeImg).to({scaleX: 1, scaleY: 1}, 800, bEnable ? egret.Ease.bounceOut : null);
    }

    public isOpened():boolean {
        return this.countLab.visible && this.typeImg.visible;
    }

    protected getCurrentState():string {
        return this.bgBtnState;
    }
}