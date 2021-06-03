/**
 * Created by Kurt on 2018/6/1.
 */
class GraphicsManager {
    private static _instance:GraphicsManager;

    public static get instance():GraphicsManager {
        if (!GraphicsManager._instance)
            GraphicsManager._instance = new GraphicsManager();
        return GraphicsManager._instance;
    }

    public getLineShape(thickness:number, color:number, moveToPos:egret.Point, lineToArr:egret.Point[]):egret.Shape {
        var shape = <ShapePoolObject>ObjectPoolManager.getObject(ShapePoolObject);
        //阴影
        shape.graphics.lineStyle(thickness, 0x000000, 0.5);
        shape.graphics.moveTo(moveToPos.x + 2, moveToPos.y + thickness*4/5);
        for (var key in lineToArr) {
            shape.graphics.lineTo(lineToArr[key].x + 2, lineToArr[key].y + thickness*4/5);
        }
        
        shape.graphics.lineStyle(thickness, color);
        shape.graphics.moveTo(moveToPos.x, moveToPos.y);
        for (var key in lineToArr) {
            shape.graphics.lineTo(lineToArr[key].x, lineToArr[key].y);
        }
        shape.graphics.endFill();
        return shape;
    }

}