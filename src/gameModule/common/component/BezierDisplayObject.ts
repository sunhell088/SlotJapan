/**
 * 贝赛尔曲线对象
 */
class BezierDisplayObject extends eui.Group {
    private startPointX:number = 0;
    private startPointY:number = 0;

    private endPointX:number = 0;
    private endPointY:number = 0;

    private bezierPointX:number = 0;
    private bezierPointY:number = 0;

    public get factor():number {
        return 0;
    }

    public set factor(value:number) {
        this.x = (1 - value) * (1 - value) * this.startPointX + 2 * value * (1 - value) * this.bezierPointX + value * value * this.endPointX;
        this.y = (1 - value) * (1 - value) * this.startPointY + 2 * value * (1 - value) * this.bezierPointY + value * value * this.endPointY;
    }

    public setBezierPoint(startPoint:egret.Point, bezierPoint:egret.Point, endPoint:egret.Point):void {
        this.startPointX = startPoint.x;
        this.startPointY = startPoint.y;
        this.bezierPointX = bezierPoint.x;
        this.bezierPointY = bezierPoint.y;
        this.endPointX = endPoint.x;
        this.endPointY = endPoint.y;
    }
}