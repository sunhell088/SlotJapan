/**
 * 中奖线路绘制
 */
class PrizeLineUICom extends eui.Group {
    public static instance:PrizeLineUICom;
    //中奖的线
    private lineArr:egret.Shape[] = [];

    public constructor() {
        super();
        PrizeLineUICom.instance = this;
    }

    public showAwardLine(blinkLineIndex:number = -1):void {
        if (!CommonConst.SHOW_LINE) return;
        for (var key in this.lineArr) {
            if (!this.lineArr[key].parent) continue;
            this.lineArr[key].parent.removeChild(this.lineArr[key]);
        }
        this.lineArr = [];
        var winLineAllSlotIndex:{} = Data.globalProxy.winLineAllSlotIndex;
        var winLineSlots:number[];
        var startPoint:egret.Point = new egret.Point();
        var slotDisplay1:SlotPoolObject;
        var slotDisplay2:SlotPoolObject;
        var slotDisplay3:SlotPoolObject;
        var extendFirstPoint:egret.Point = new egret.Point(0, 0);
        var extendLastPoint:egret.Point = new egret.Point(0, 0);
        var x = 0;
        for (var key in winLineAllSlotIndex) {
            //如果不是全部闪烁
            if (blinkLineIndex != -1 && x++ != blinkLineIndex) continue;
            winLineSlots = winLineAllSlotIndex[key];
            if (!winLineSlots || winLineSlots.length == 0) continue;
            slotDisplay1 = SpinAreaUICom.instance.getSlotDisplayByIndex(winLineSlots[0]);
            startPoint.x = 0;
            startPoint.y = 0;

            //头部延长
            slotDisplay2 = SpinAreaUICom.instance.getSlotDisplayByIndex(winLineSlots[1]);
            extendFirstPoint.x = -CommonConst.SLOT_COLUMN_GAP / 2;
            extendFirstPoint.y = 0;
            if (slotDisplay2.y < slotDisplay1.y) {
                extendFirstPoint.y = CommonConst.SLOT_ROW_GAP / 2;
            } else if (slotDisplay2.y > slotDisplay1.y) {
                extendFirstPoint.y = -CommonConst.SLOT_ROW_GAP / 2;
            }
            var moveTo:egret.Point = new egret.Point(startPoint.x + CommonConst.SLOT_COLUMN_GAP / 2,
                startPoint.y + slotDisplay1.y + CommonConst.SLOT_ROW_GAP / 2);
            moveTo.x += extendFirstPoint.x;
            moveTo.y += extendFirstPoint.y;

            //尾部延长
            slotDisplay3 = SpinAreaUICom.instance.getSlotDisplayByIndex(winLineSlots[2]);
            extendLastPoint.x = CommonConst.SLOT_COLUMN_GAP / 2;
            extendLastPoint.y = 0;
            if (slotDisplay3.y < slotDisplay2.y) {
                extendLastPoint.y = -CommonConst.SLOT_ROW_GAP / 2;
            } else if (slotDisplay3.y > slotDisplay2.y) {
                extendLastPoint.y = CommonConst.SLOT_ROW_GAP / 2;
            }

            var lineToArr:egret.Point[] = [];
            for (var i = 1; i < winLineSlots.length; i++) {
                slotDisplay1 = SpinAreaUICom.instance.getSlotDisplayByIndex(winLineSlots[i]);
                //这里必须new 一个，因为push进数组后，就是同一个引用了
                var endPoint:egret.Point = new egret.Point(0, 0);
                endPoint.x = startPoint.x + slotDisplay1.x + CommonConst.SLOT_COLUMN_GAP / 2;
                endPoint.y = startPoint.y + slotDisplay1.y + CommonConst.SLOT_ROW_GAP / 2;
                if (i == winLineSlots.length - 1) {
                    endPoint.x += extendLastPoint.x;
                    endPoint.y += extendLastPoint.y;
                }
                lineToArr.push(endPoint);
            }
            var line:egret.Shape = GraphicsManager.instance.getLineShape(5, GameUtil.winLineColor[key], moveTo, lineToArr);
            this.addChild(line);
            this.lineArr.push(line);
            line.alpha = 0.65;
            egret.Tween.get(line, {loop: true}).to({alpha: 1}, 800).wait(500).to({alpha: 0.65}, 800).wait(500);
        }
    }

    //重置所有状态
    public resetPrizeLineUI():void {
        for (var key in this.lineArr) {
            if (!this.lineArr[key].parent) continue;
            this.lineArr[key].parent.removeChild(this.lineArr[key]);
        }
        this.lineArr = [];
    }
}