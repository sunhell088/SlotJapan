//跑马灯公告
class TopMessageUI extends eui.Component {
    private static SPEED:number = 2;
    //外部可控制跑马灯的Y值（用于防止遮挡）
    public static HEIGHT_OFFSET:number = 0;
    //原始高度
    private originalHeight:number;

    private bg:eui.Rect = new eui.Rect();
    private textLab:egret.TextField;

    private messageList:string[] = [];

    constructor() {
        super();
        this.addChild(this.bg);
        this.textLab = new egret.TextField();
        this.textLab.size = 28;
        this.textLab.fontFamily = "Microsoft YaHei";
        this.textLab.lineSpacing = 8;
        this.textLab.stroke = 2;
        this.addChild(this.textLab);
        this.touchEnabled = this.touchChildren = false;
    }

    public pushMessage(msg:string):void {
        if (!msg || msg.length <= 0) return;
        this.messageList.push(msg);
    }

    public showMessage():void {
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
    }

    private onEnterFrame():void {
        this.y = this.originalHeight + TopMessageUI.HEIGHT_OFFSET;
        this.textLab.x -= TopMessageUI.SPEED;
        if (this.textLab.x + this.textLab.width < 0) {
            this.showMessage();
        }
    }

    //设置背景和屏幕一样宽
    public setRectBGFull():void {
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.x = 0;
        this.y = 0;
        var localPos:egret.Point = this.globalToLocal(0, 102);
        this.x = localPos.x;
        this.y = localPos.y;
        this.originalHeight = this.y;
    }
}