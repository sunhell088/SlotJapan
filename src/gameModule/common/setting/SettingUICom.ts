class SettingUICom extends eui.Component {
    private settingBtn:eui.Button;
    private settingGroup:eui.Group;

    private helpBtn:eui.Button;
    private musicBtn:eui.ToggleButton;
    private soundBtn:eui.ToggleButton;
    private reportBtn:eui.Button;

    private bIsShowing:boolean = false;

    constructor() {
        super();
        this.skinName = SettingSkin;
    }

    protected createChildren() {
        super.createChildren();
        this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showList, this);
        this.helpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHelp, this);
        this.musicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeMusicSwitch, this);
        this.soundBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changeSoundSwitch, this);
        this.musicBtn.selected = !SoundManager.instance.getMusicSwitch();
        this.soundBtn.selected = !SoundManager.instance.getEffectSwitch();
        this.reportBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openReport, this);

        this.settingGroup.visible = false;
        this.settingGroup.alpha = 0;
    }

    private showList():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        if (this.bIsShowing) {
            egret.Tween.get(this.settingGroup).to({alpha: 0}, 100).call(function () {
                this.settingGroup.visible = false;
            }, this);
            this.bIsShowing = false;
        } else {
            this.settingGroup.visible = true;
            egret.Tween.get(this.settingGroup).to({alpha: 1}, 100);
            this.bIsShowing = true;

        }
    }

    private openHelp():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.OPEN_WINDOW(HelpMediator, true);
        this.showList();
    }

    private openReport():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        var url = Game.urlData.address + "/Report/gameSetInfo.htm?operatorKey=" + Game.urlData.operatorKey + "&token=" + Game.urlData.sessionKey + "&gameKey=" + Game.urlData.gameId + "&language=" + Game.urlData.language;
        window.open(url);
	this.showList();
    }

    private changeSoundSwitch(e:egret.Event):void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.setEffectSwitch(!(<eui.ToggleButton>e.target).selected);
    }

    private changeMusicSwitch(e:egret.Event):void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        SoundManager.instance.setMusicSwitch(!(<eui.ToggleButton>e.target).selected);
    }
}
