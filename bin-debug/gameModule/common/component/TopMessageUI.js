var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//跑马灯公告
var TopMessageUI = (function (_super) {
    __extends(TopMessageUI, _super);
    function TopMessageUI() {
        var _this = _super.call(this) || this;
        _this.bg = new eui.Rect();
        _this.messageList = [];
        _this.addChild(_this.bg);
        _this.textLab = new egret.TextField();
        _this.textLab.size = 28;
        _this.textLab.fontFamily = "Microsoft YaHei";
        _this.textLab.lineSpacing = 8;
        _this.textLab.stroke = 2;
        _this.addChild(_this.textLab);
        _this.touchEnabled = _this.touchChildren = false;
        return _this;
    }
    TopMessageUI.prototype.pushMessage = function (msg) {
        if (!msg || msg.length <= 0)
            return;
        this.messageList.push(msg);
    };
    TopMessageUI.prototype.showMessage = function () {
        if (this.messageList.length == 0) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.parent.removeChild(this);
            return;
        }
        if (!this.hasEventListener(egret.Event.ENTER_FRAME)) {
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        }
        this.setRectBGFull();
        this.bg.width = egret.MainContext.instance.stage.stageWidth;
        this.bg.height = 26;
        this.bg.alpha = 0.45;
        this.textLab.textFlow = TextUtil.parse(this.messageList.shift());
        this.textLab.x = this.bg.width;
        this.textLab.y = (this.bg.height - this.textLab.height) / 2;
    };
    TopMessageUI.prototype.onEnterFrame = function () {
        this.y = this.originalHeight + TopMessageUI.HEIGHT_OFFSET;
        this.textLab.x -= TopMessageUI.SPEED;
        if (this.textLab.x + this.textLab.width < 0) {
            this.showMessage();
        }
    };
    //设置背景和屏幕一样宽
    TopMessageUI.prototype.setRectBGFull = function () {
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.x = 0;
        this.y = 0;
        var localPos = this.globalToLocal(0, 102);
        this.x = localPos.x;
        this.y = localPos.y;
        this.originalHeight = this.y;
    };
    TopMessageUI.SPEED = 2;
    //外部可控制跑马灯的Y值（用于防止遮挡）
    TopMessageUI.HEIGHT_OFFSET = 0;
    return TopMessageUI;
}(eui.Component));
__reflect(TopMessageUI.prototype, "TopMessageUI");
//# sourceMappingURL=TopMessageUI.js.map