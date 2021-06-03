/**
 * 跳动的美术数字
 */
class BounceBitmapLabel extends eui.BitmapLabel {
    private start:number;
    private end:number;
    //是否已经结束（因为当后面的wait时，value值依然再调用，导致CommonUtil.valueFormatDecimals执行后，被覆盖）
    private bOver:boolean = false;

    //根据start的小数位数来跳动
    private decimalsCount:number;

    public get value():number {
        return 0;
    }

    public set value(value:number) {
        if(this.bOver) return;
        if (value == 1) this.bOver = true;
        value = this.start + (this.end - this.start) * value;
        value = +value.toFixed(this.decimalsCount);
        if ((+this.text) != value) {
            this.text = value + "";
        }
    }

    public tweenNum(start:number, end:number, durationTime:number):egret.Tween {
        this.bOver = false;
        var strArr:string[] = (start + "").split(".");
        this.decimalsCount = strArr.length == 2 ? strArr[1].length : 0;
        this.start = start;
        this.end = end;
        return egret.Tween.get(this).to({value: 1}, durationTime).call(function () {
            //这里主要是考虑，有小数的情况
            this.text = CommonUtil.valueFormatDecimals(this.end, 2) + "";
        }, this);
    }
}