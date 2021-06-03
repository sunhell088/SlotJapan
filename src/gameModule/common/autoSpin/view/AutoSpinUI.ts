/**
 * 自动游戏次数页面
 */
class AutoSpinUI extends eui.Component implements IGameUI {
    private titleLab:eui.Label;
    private countMaxBtn:eui.RadioButton;
    private stopHintLab:eui.Label;

    private checkBoxFree:eui.CheckBox;
    private checkBoxSingle:eui.CheckBox;
    private checkBoxAdd:eui.CheckBox;
    private checkBoxDeduct:eui.CheckBox;

    private count20Btn:eui.RadioButton;

    private cancelBtn:eui.CheckBox;
    private startBtn:eui.CheckBox;

    private inputSingle:eui.TextInput;
    private inputAdd:eui.TextInput;
    private inputDeduct:eui.TextInput;

    private currencyType1:eui.Label;
    private currencyType2:eui.Label;
    private currencyType3:eui.Label;

    public constructor() {
        super();
        this.skinName = AutoSpinUISkin;
        
        this.titleLab.text = Game.getLanguage("Select number of spins");
        this.countMaxBtn.label = Game.getLanguage("infinite");
        this.stopHintLab.text = Game.getLanguage("Stop autoplay");
        this.checkBoxFree.label = Game.getLanguage("Trigger Free Spins or Bonus");
        this.checkBoxSingle.label = Game.getLanguage("Single win exceeds");
        this.checkBoxAdd.label = Game.getLanguage("Cash increases by");
        this.checkBoxDeduct.label = Game.getLanguage("Cash decreases");


        this.checkBoxFree.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkBoxChangeHandler, this);
        this.checkBoxSingle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkBoxChangeHandler, this);
        this.checkBoxAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkBoxChangeHandler, this);
        this.checkBoxDeduct.addEventListener(egret.TouchEvent.TOUCH_TAP, this.checkBoxChangeHandler, this);

        this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startSpin, this);

        this.inputSingle.prompt = this.inputAdd.prompt = this.inputDeduct.prompt = Game.getLanguage("autoSpinInputPrompt");
        this.inputSingle.inputType = this.inputAdd.inputType = this.inputDeduct.inputType = egret.TextFieldInputType.TEL;

        this.inputSingle.addEventListener(egret.Event.CHANGE, this.checkInputText, this);
        this.inputAdd.addEventListener(egret.Event.CHANGE, this.checkInputText, this);
        this.inputDeduct.addEventListener(egret.Event.CHANGE, this.checkInputText, this);
        this.currencyType1.text = this.currencyType2.text = this.currencyType3.text = Game.getLanguage("credits");
    }

    onEnter():void {
        ViewManager.instance.addElement(this);
    }

    onExit():void {
        ViewManager.instance.removeElement(this);
    }

    onClose():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.CLOSE_WINDOW(AutoSpinMediator);
    }

    //点击条件复选框
    private checkBoxChangeHandler(evt:eui.UIEvent):void {
        var checkInput:eui.TextInput = null;
        if (evt.target == this.checkBoxSingle) {
            checkInput = this.inputSingle;
        } else if (evt.target == this.checkBoxAdd) {
            checkInput = this.inputAdd;
        } else if (evt.target == this.checkBoxDeduct) {
            checkInput = this.inputDeduct;
        }
        if (checkInput && checkInput.text.length == 0) {
            checkInput.text = 0 + "";
            // evt.target.selected = false;
            // ViewManager.showFlowHint(Game.getLanguage("autoSpinInputPrompt"));
        }
        evt.target["selectBG"].visible = evt.target.selected;
    }

    //input框内容改变
    private checkInputText(evt:eui.UIEvent):void {
        evt.target.text = +evt.target.text;
        if (+evt.target.text == 0) {
            evt.target.text = "";
        }
        if (evt.target.parent == this.inputSingle) {
            this.checkBoxSingle.selected = (evt.target.text.length != 0);
            this.checkBoxSingle["selectBG"].visible = this.checkBoxSingle.selected;
        } else if (evt.target.parent == this.inputAdd) {
            this.checkBoxAdd.selected = (evt.target.text.length != 0);
            this.checkBoxAdd["selectBG"].visible = this.checkBoxAdd.selected;
        } else if (evt.target.parent == this.inputDeduct) {
            this.checkBoxDeduct.selected = (evt.target.text.length != 0);
            this.checkBoxDeduct["selectBG"].visible = this.checkBoxDeduct.selected;
        }
    }

    startSpin():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        Data.globalProxy.autoSpinCount = +this.count20Btn.group.selectedValue;
        Data.globalProxy.bStopAutoByFreeGame = this.checkBoxFree.selected;
        Data.globalProxy.stopAutoBySingleWin = (this.checkBoxSingle.selected && this.inputSingle.text.length > 0 ) ? +this.inputSingle.text : 0;
        Data.globalProxy.stopAutoByBalanceAdd = (this.checkBoxAdd.selected && this.inputAdd.text.length > 0 ) ? +this.inputAdd.text : 0;
        Data.globalProxy.stopAutoByBalanceDeduct = (this.checkBoxDeduct.selected && this.inputDeduct.text.length > 0 ) ? +this.inputDeduct.text : 0;
        Data.globalProxy.startAutoSpinBalance = Data.globalProxy.getBalance();

        ObserverManager.sendNotification(AutoSpinMediator.START_AUTO_SPIN);
        //关闭需要放在 Data.globalProxy.autoSpinCount = +this.count20Btn.group.selectedValue; 后面，否则this.count20Btn.group.selectedValue为空
        ViewManager.instance.CLOSE_WINDOW(AutoSpinMediator);
    }
}