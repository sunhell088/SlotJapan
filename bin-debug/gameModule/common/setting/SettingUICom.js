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
var SettingUICom = (function (_super) {
    __extends(SettingUICom, _super);
    function SettingUICom() {
        var _this = _super.call(this) || this;
        _this.bIsShowing = false;
        _this.skinName = SettingSkin;
        return _this;
    }
    SettingUICom.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showList, this);
        this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHelp, this);
        this.musicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeMusicSwitch, this);
        this.soundBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSoundSwitch, this);
        this.musicBtn.selected = !SoundManager.instance.getMusicSwitch();
        this.soundBtn.selected = !SoundManager.instance.getEffectSwitch();
        this.reportBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openReport, this);
        this.settingGroup.visible = false;
        this.settingGroup.alpha = 0;
    };
    SettingUICom.prototype.showList = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        if (this.bIsShowing) {
            egret.Tween.get(this.settingGroup).to({ alpha: 0 }, 100).call(function () {
                this.settingGroup.visible = false;
            }, this);
            this.bIsShowing = false;
        }
        else {
            this.settingGroup.visible = true;
            egret.Tween.get(this.settingGroup).to({ alpha: 1 }, 100);
            this.bIsShowing = true;
        }
    };
    SettingUICom.prototype.openHelp = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.OPEN_WINDOW(HelpMediator, true);
        this.showList();
    };
    SettingUICom.prototype.openReport = function () {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        var url = Game.urlData.address + "/Report/gameSetInfo.htm?operatorKey=" + Game.urlData.operatorKey + "&token=" + Game.urlData.sessionKey + "&gameKey=" + Game.urlData.gameId + "&language=" + Game.urlData.language;
        window.open(url);
        this.showList();
    };
    SettingUICom.prototype.changeSoundSwitch = function (e) {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.setEffectSwitch(!e.target.selected);
    };
    SettingUICom.prototype.changeMusicSwitch = function (e) {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.setMusicSwitch(!e.target.selected);
    };
    return SettingUICom;
}(eui.Component));
__reflect(SettingUICom.prototype, "SettingUICom");
//# sourceMappingURL=SettingUICom.js.map