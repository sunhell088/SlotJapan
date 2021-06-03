var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * Created by Kurt on 2018/6/1.
 */
var GraphicsManager = (function () {
    function GraphicsManager() {
    }
    Object.defineProperty(GraphicsManager, "instance", {
        get: function () {
            if (!GraphicsManager._instance)
                GraphicsManager._instance = new GraphicsManager();
            return GraphicsManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    GraphicsManager.prototype.getLineShape = function (thickness, color, moveToPos, lineToArr) {
        var shape = ObjectPoolManager.getObject(ShapePoolObject);
        //阴影
        shape.graphics.lineStyle(thickness, 0x000000, 0.5);
        shape.graphics.moveTo(moveToPos.x + 2, moveToPos.y + thickness * 4 / 5);
        for (var key in lineToArr) {
            shape.graphics.lineTo(lineToArr[key].x + 2, lineToArr[key].y + thickness * 4 / 5);
        }
        shape.graphics.lineStyle(thickness, color);
        shape.graphics.moveTo(moveToPos.x, moveToPos.y);
        for (var key in lineToArr) {
            shape.graphics.lineTo(lineToArr[key].x, lineToArr[key].y);
        }
        shape.graphics.endFill();
        return shape;
    };
    return GraphicsManager;
}());
__reflect(GraphicsManager.prototype, "GraphicsManager");
//# sourceMappingURL=GraphicsManager.js.map