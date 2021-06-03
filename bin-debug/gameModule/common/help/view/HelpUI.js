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
/**
 * 帮助页面
 */
var HelpUI = (function (_super) {
    __extends(HelpUI, _super);
    function HelpUI() {
        var _this = _super.call(this) || this;
        //记录的页
        _this.mPage = 0;
        _this.skinName = HelpUISkin;
        _this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClose, _this);
        _this.leftPage.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onLeftPage, _this);
        _this.rightPage.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onRightPage, _this);
        return _this;
    }
    HelpUI.prototype.onEnter = function () {
        this.mPage = 0;
        ViewManager.instance.addElement(this);
        this.pageChange();
    };
    HelpUI.prototype.onExit = function () {
        ViewManager.instance.removeElement(this);
    };
    HelpUI.prototype.onClose = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.CLOSE_WINDOW(HelpMediator);
    };
    HelpUI.prototype.onLeftPage = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        this.mPage--;
        if (this.mPage < 0)
            this.mPage = 0;
        this.pageChange();
    };
    HelpUI.prototype.onRightPage = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        this.mPage++;
        if (this.mPage > HelpUI.MAX_PAGE)
            this.mPage = HelpUI.MAX_PAGE;
        this.pageChange();
    };
    HelpUI.prototype.pageChange = function () {
        this.invalidateState();
    };
    Object.defineProperty(HelpUI.prototype, "page", {
        set: function (state) {
            this.invalidateState();
        },
        enumerable: true,
        configurable: true
    });
    HelpUI.prototype.getCurrentState = function () {
        return "page" + this.mPage;
    };
    //从0开始，所以实际是需要+1
    HelpUI.MAX_PAGE = 1;
    return HelpUI;
}(eui.Component));
__reflect(HelpUI.prototype, "HelpUI", ["IGameUI"]);
//# sourceMappingURL=HelpUI.js.map