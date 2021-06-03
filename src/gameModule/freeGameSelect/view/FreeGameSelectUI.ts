/**
 * 免费游戏选择界面
 */
class FreeGameSelectUI extends eui.Component implements IGameUI {
    private static MAX_SECOND:number = 10;
    private static SELECT_COUNT:number = 12;

    private lotusBtns:LotusUICom[] = [];
    private countDownLab:eui.BitmapLabel;
    private selectGroup:eui.Group;

    private countDownSecond:number;
    private countDownGroup:eui.Group;

    private flipTimeLab:eui.BitmapLabel;
    private freeSpinTimeLab:eui.BitmapLabel;

    private flowerLeft:eui.Image;
    private flowerRight:eui.Image;

    //选择的动画
    private selectMovie:dragonBones.Movie;
    //记时器key
    private interKey:number;

    //是否已经点击了但还没有收到后台返回
    public bAlreadyReplyOpenLotus:boolean = false;

    public constructor() {
        super();
        this.skinName = FreeSpinSelectUISkin;
    }

    protected createChildren() {
        super.createChildren();
        for (var i = 0; i < FreeGameSelectUI.SELECT_COUNT; i++) {
            this.lotusBtns.push(this["selectBtn" + i]);
            this.lotusBtns[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
        }
    }

    onEnter():void {
        if(!this.selectMovie){
            dragonBones.addMovieGroup(RES.getRes("freeSpinSelect_ske_dbmv"), RES.getRes("freeSpinSelect_tex_png"));
            this.selectMovie = dragonBones.buildMovie("freeSpinSelect");
            this.addChildAt(this.selectMovie, this.getChildIndex(this.flowerLeft) - 1);
            this.selectMovie.addEventListener(dragonBones.EventObject.COMPLETE, this.onStartFreeSpinMovieComplete, this);
        }
        SoundManager.instance.stopMusic();
        SoundManager.instance.playEffect(SoundType.FREE_SPIN_SHOW_SELECT);
        ViewManager.instance.addElement(this);
        this.selectGroup.visible = false;
        //播放默认背景动画
        this.selectMovie.visible = true;
        this.selectMovie.x = this.selectMovie.parent.width / 2;
        this.selectMovie.y = this.selectMovie.parent.height / 2;
        this.selectMovie.play("0", 1);
        this.flowerLeft.alpha = 0;
        this.flowerRight.alpha = 0;
        egret.Tween.get(this.flowerLeft).to({alpha: 1}, 1000);
        egret.Tween.get(this.flowerRight).to({alpha: 1}, 1000);
        egret.setTimeout(function () {
            egret.Tween.get(this.flowerLeft).to({alpha: 0}, 2000);
            egret.Tween.get(this.flowerRight).to({alpha: 0}, 2000);
        }, this, 4500)
    }

    onExit():void {
        egret.Tween.removeTweens(this.selectMovie);
        this.selectMovie.stop();
        this.selectMovie.dispose();
        if (this.selectMovie.parent) this.selectMovie.parent.removeChild(this.selectMovie);
        this.selectMovie = null;
        dragonBones.removeMovieGroup("freeSpinSelect");
        
        Data.globalProxy.newFreespinStatus = false;
        ViewManager.instance.removeElement(this);
        FreeSpinStartUICom.instance.show();
    }

    private countDown():void {
        this.countDownSecond--;
        if (this.countDownSecond < 0) {
            this.onSelect();
            return;
        }
        this.countDownLab.text = this.countDownSecond + "";
    }

    //选择
    private onSelect(e:any = null):void {
        SoundManager.instance.playEffect(SoundType.START_BUTTON_CLICK);
        if(this.bAlreadyReplyOpenLotus){
            ViewManager.showFlowHint(Game.getLanguage("waitingS2C_openLotus"));
            return;
        }
        var selectObj = e;
        if (e instanceof egret.Event) {
            selectObj = e.target;
        }
        var i = 0;
        for (; i < this.lotusBtns.length; i++) {
            if (selectObj == null) {
                if (!this.lotusBtns[i].isOpened()) {
                    selectObj = this.lotusBtns[i];
                    break;
                }
            } else if (selectObj == this.lotusBtns[i]) {
                break;
            }
        }
        this.bAlreadyReplyOpenLotus = true;
        MessageUtil.C2S_SelectFreeType(i);
        selectObj.touchEnabled = false;
        egret.clearInterval(this.interKey);
    }

    private onStartFreeSpinMovieComplete(event:egret.Event):void {
        SoundManager.instance.playEffect(SoundType.ALL_SCATTER);
        this.selectMovie.visible = false;
        ObserverManager.sendNotification(MainMediator.GAIN_FREE_SPIN);

        this.alpha = 0;
        egret.Tween.get(this).to({alpha: 1}, SlotRhythmConst.FREE_SPIN_SELECT_ALPHA_DURATION);
        this.selectGroup.visible = true;
        this.countDownGroup.visible = true;
        this.countDownSecond = FreeGameSelectUI.MAX_SECOND;
        this.countDown();
        this.interKey = egret.setInterval(this.countDown, this, 1000);

        this.flipTimeLab.text = Data.globalProxy.flipTimes + "";
        this.freeSpinTimeLab.text = Data.globalProxy.getFreespinCount() + "";
        //根据后台数据，设置莲花显示
        for (var i = 0; i < this.lotusBtns.length; i++) {
            //在shader动画播放完前不能点击
            this.lotusBtns[i].touchEnabled = false;
            this.lotusBtns[i].init(Data.globalProxy.flipLotus[i], i);
        }


        ShaderManager.instance.play(this.selectGroup, customFilter3, 20);
        egret.setTimeout(function () {
            ShaderManager.instance.stop(this.selectGroup);
            for (var i = 0; i < this.lotusBtns.length; i++) {
                this.lotusBtns[i].touchEnabled = !this.lotusBtns[i].isOpened();
            }
        }, this, SlotRhythmConst.FREE_SPIN_SELECT_SHADER_DURATION);
    }

    //后台通知选择了莲花
    public openLotus():void {
        this.bAlreadyReplyOpenLotus = false;
        if ("" + Data.globalProxy.flipTimes != this.flipTimeLab.text) {
            CommonUtil.valueFadeTween(this.flipTimeLab);
        }
        this.flipTimeLab.text = Data.globalProxy.flipTimes + "";

        if ("" + Data.globalProxy.getFreespinCount() != this.freeSpinTimeLab.text) {
            CommonUtil.valueFadeTween(this.freeSpinTimeLab);
        }
        this.freeSpinTimeLab.text = Data.globalProxy.getFreespinCount() + "";

        for (var i = 0; i < this.lotusBtns.length; i++) {
            if (this.lotusBtns[i].isOpened()) continue;
            if (Data.globalProxy.flipLotus[i].currentChoose) {
                this.lotusBtns[i].open(Data.globalProxy.flipLotus[i], true);
                break;
            }
        }
        if (Data.globalProxy.flipTimes == 0) {
            for (var i = 0; i < this.lotusBtns.length; i++) {
                this.lotusBtns[i].touchEnabled = false;
            }
            this.countDownGroup.visible = false;
            egret.setTimeout(function () {
                for (var i = 0; i < this.lotusBtns.length; i++) {
                    if (!this.lotusBtns[i].isOpened()) {
                        this.lotusBtns[i].open(Data.globalProxy.flipLotus[i], false);
                    }
                }
                egret.Tween.get(this.selectGroup).wait(3000).to({
                    scaleX: 5,
                    scaleY: 5,
                    alpha: 0
                }, 500).call(function () {
                    this.scaleX = this.scaleY = 1;
                    this.alpha = 1;
                    ViewManager.instance.CLOSE_WINDOW(FreeGameSelectMediator);
                }, this.selectGroup);
            }, this, 2000)
        } else {
            this.interKey = egret.setInterval(this.countDown, this, 1000);
            this.countDownSecond = FreeGameSelectUI.MAX_SECOND;
        }
    }
}