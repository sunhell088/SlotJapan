/**
 * 整个游戏时间的场景显示管理
 */
class ViewManager {
    private static _instance:ViewManager;
    //窗口是否处于激活状态(用于窗口休眠后停止音乐)
    public isWinActivate:boolean = true;
    private _window:Mediator[] = [];

    //所有显示层的容器（用于居中） （就是Main.ts）
    private otherLayerContainer:egret.DisplayObjectContainer;
    //场景层
    private sceneLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    //UI层
    private uiLayer:eui.UILayer = new eui.UILayer();
    //新手引导层
    private guideLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    //跑马灯公告层
    private noticeLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    //弹出提示框层
    private alertLayer:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    //Loading层
    private loadingLayer:LoadingUI = new LoadingUI;
    //加载模块时的Loading层
    private moduleLoadingLayer:ModuleLoadingUI = new ModuleLoadingUI();
    //浮动提示框列表
    private flowHints:Array<FlowHintUI> = [];
    //弹出确认框
    private gameAlert:GameAlertUI = null;
    //跑马灯
    private topMessageUI:TopMessageUI = new TopMessageUI();

    public static get instance():ViewManager {
        if (!ViewManager._instance)
            ViewManager._instance = new ViewManager();
        return ViewManager._instance;
    }

    init(main:egret.DisplayObjectContainer) {
        main.stage.setContentSize(CommonConst.STAGE_WIDTH, CommonConst.STAGE_HEIGHT);
        this.sceneLayer.width = CommonConst.STAGE_WIDTH;
        this.sceneLayer.height = CommonConst.STAGE_HEIGHT;
        main.parent.addChildAt(this.sceneLayer, 0);
        this.sceneLayer.name = "sceneLayer";
        main.parent.addChildAt(this.uiLayer, 1);
        this.uiLayer.name = "uiLayer";

        this.otherLayerContainer = main;
        this.otherLayerContainer.name = "otherLayer";

        this.guideLayer.width = CommonConst.STAGE_WIDTH;
        this.guideLayer.height = CommonConst.STAGE_HEIGHT;
        this.otherLayerContainer.addChild(this.guideLayer);
        this.guideLayer.name = "guideLayer";

        this.noticeLayer.width = CommonConst.STAGE_WIDTH;
        this.noticeLayer.height = CommonConst.STAGE_HEIGHT;
        this.otherLayerContainer.addChild(this.noticeLayer);
        this.noticeLayer.name = "noticeLayer";

        this.moduleLoadingLayer.width = CommonConst.STAGE_WIDTH;
        this.moduleLoadingLayer.height = CommonConst.STAGE_HEIGHT;
        this.otherLayerContainer.addChild(this.moduleLoadingLayer);
        this.moduleLoadingLayer.name = "moduleLoadingLayer";
        this.moduleLoadingLayer.visible = false;
        this.loadingLayer.width = CommonConst.STAGE_WIDTH;
        this.loadingLayer.height = CommonConst.STAGE_HEIGHT;
        this.otherLayerContainer.addChild(this.loadingLayer);
        this.loadingLayer.name = "loadingLayer";

        this.alertLayer.width = CommonConst.STAGE_WIDTH;
        this.alertLayer.height = CommonConst.STAGE_HEIGHT;
        this.otherLayerContainer.addChild(this.alertLayer);
        this.alertLayer.name = "alertLayer";

        this.onWindowResize();
        egret.MainContext.instance.stage.addEventListener(egret.StageOrientationEvent.ORIENTATION_CHANGE, this.onWindowResize, this);
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onWindowResize, this);
        //监听浏览器焦点切换事件(用于失焦后停止声音)
        egret.MainContext.instance.stage.addEventListener(egret.Event.ACTIVATE, this.onActivate, this);
        egret.MainContext.instance.stage.addEventListener(egret.Event.DEACTIVATE, this.onDeactivate, this);
        //在webgl下关闭自动脏矩形
        if (egret.Capabilities.renderMode == "webgl") {
            egret.MainContext.instance.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
        }
    }

    //浏览器大小和宽高比发生变化时的处理（根据宽高比切换高对齐还是宽对齐）
    private onWindowResize():void {
        //偏长
        if (egret.MainContext.instance.stage.stageWidth == CommonConst.STAGE_WIDTH && egret.MainContext.instance.stage.stageHeight < CommonConst.STAGE_HEIGHT) {
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        }
        //偏方
        else if (egret.MainContext.instance.stage.stageWidth < CommonConst.STAGE_WIDTH && egret.MainContext.instance.stage.stageHeight == CommonConst.STAGE_HEIGHT) {
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        }
        //uiLayer里的子节点分辨率自适应
        for (var i = 0; i < this.uiLayer.numChildren; i++) {
            var ui = this.uiLayer.getChildAt(i);
            ui.width = egret.MainContext.instance.stage.stageWidth;
            ui.height = egret.MainContext.instance.stage.stageHeight;
        }
        //其他layer画面居中
        this.sceneLayer.x = egret.MainContext.instance.stage.stageWidth / 2 - CommonConst.STAGE_WIDTH / 2;
        this.sceneLayer.y = egret.MainContext.instance.stage.stageHeight / 2 - CommonConst.STAGE_HEIGHT / 2;
        this.otherLayerContainer.x = egret.MainContext.instance.stage.stageWidth / 2 - CommonConst.STAGE_WIDTH / 2;
        this.otherLayerContainer.y = egret.MainContext.instance.stage.stageHeight / 2 - CommonConst.STAGE_HEIGHT / 2;
        for (var i = 0; i < this.sceneLayer.numChildren; i++) {
            var ui = this.sceneLayer.getChildAt(i);
            ui.width = egret.MainContext.instance.stage.stageWidth;
            ui.height = egret.MainContext.instance.stage.stageHeight;
            ui.x = ui.parent.width / 2 - ui.width / 2;
            ui.y = ui.parent.height / 2 - ui.height / 2;
        }
        for (var i = 0; i < this.otherLayerContainer.numChildren; i++) {
            var subLayer:egret.DisplayObjectContainer = <egret.DisplayObjectContainer>this.otherLayerContainer.getChildAt(i);
            if (subLayer == this.loadingLayer){
                continue;
            }
            for (var k = 0; k < subLayer.numChildren; k++) {
                var ui = subLayer.getChildAt(k);
                ui.width = egret.MainContext.instance.stage.stageWidth;
                ui.height = egret.MainContext.instance.stage.stageHeight;
                ui.x = ui.parent.width / 2 - ui.width / 2;
                ui.y = ui.parent.height / 2 - ui.height / 2;
            }
        }
    }

    private onActivate(e:egret.Event):void {
        ViewManager.instance.isWinActivate = true;
        SoundManager.instance.playMusic();
    }

    private onDeactivate(e:egret.Event):void {
        ViewManager.instance.isWinActivate = false;
        SoundManager.instance.stopMusic();
    }

    public OPEN_WINDOW(mediatorClass:any, bRetainFormer:boolean = false, ...parameters):void {
        if (!bRetainFormer) {
            this.closeAllWindow();
        }
        var newMediator:Mediator = ObserverManager.getMediator(mediatorClass);
        if (!newMediator) {
            egret.error(egret.getQualifiedClassName(mediatorClass) + "  has not been registered!");
            return;
        }
        if (this._window.indexOf(newMediator) != -1) return;
        this._window.push(newMediator);
        newMediator.enter.apply(newMediator, parameters);
    }

    //关闭UI窗口(mediatorClass默认为空，表示关闭所有窗口)
    public CLOSE_WINDOW(mediatorClass:any = null):void {
        //如果制定了关闭的窗口Mediator则只关该指定窗口
        if (mediatorClass) {
            var mediator = ObserverManager.getMediator(mediatorClass);
            var index = this._window.indexOf(mediator);
            if (index == -1) {
                return;
            }
            this._window[index].exit();
            this._window.splice(index, 1);
        } else {
            this.closeAllWindow();
        }
    }

    //只用于类似RPG游戏的场景层的切换
    public REPLACE_SCENE(newMediatorClass:any, targetMediatorClass:any):void {
        var newMediator:Mediator = ObserverManager.getMediator(newMediatorClass);
        if (this._window.indexOf(newMediator) != -1) return;

        var targetMediator = ObserverManager.getMediator(targetMediatorClass);
        var targetIndex = this._window.indexOf(targetMediator);
        if (targetIndex == -1) return;
        this._window[targetIndex].exit();
        this._window.splice(targetIndex, 1);

        this._window.push(newMediator);
        newMediator.enter();
    }

    private closeAllWindow():void {
        for (var key in this._window) {
            if (this._window[key]) {
                this._window[key].exit();
            }
        }
        this._window.length = 0;
    }

    //添加到对应的显示layer（bMask表示是否在UI后添加半透明遮挡）
    public addElement(child:egret.DisplayObject, depth:number = ViewDepth.UI):void {
        var layer:egret.DisplayObjectContainer = this.getLayer(depth);
        if (depth == ViewDepth.UI) {
            child.width = egret.MainContext.instance.stage.stageWidth;
            child.height = egret.MainContext.instance.stage.stageHeight;
        }
        layer.addChild(child);
    }

    public removeElement(child:egret.DisplayObject, depth:number = ViewDepth.UI):void {
        var layer:egret.DisplayObjectContainer = this.getLayer(depth);
        if (child && child.parent == layer) {
            layer.removeChild(child);
        } else {
            egret.warn("viewManager removeElement is error");
        }
    }

    //根据层索引获得layer
    private getLayer(depth:ViewDepth) {
        var layer:egret.DisplayObjectContainer = null;
        switch (depth) {
            case ViewDepth.SCENE:
                layer = this.sceneLayer;
                break;
            case ViewDepth.UI:
                layer = this.uiLayer;
                break;
            case ViewDepth.GUIDE:
                layer = this.guideLayer;
                break;
            case ViewDepth.ALERT:
                layer = this.alertLayer;
                break;
            case ViewDepth.NOTICE:
                layer = this.noticeLayer;
                break;
            case ViewDepth.LOADING:
                layer = this.loadingLayer;
                break;
        }
        return layer;
    }

    //显示loading进度
    public showLoading(current:number, total:number) {
        this.loadingLayer.visible = true;
        this.loadingLayer.setProgress(current, total);
    }

    public hideLoading() {
        this.loadingLayer.visible = false;
    }

    //加载其他模块资源
    public loadModuleGroupRes(groupName:string, callback:Function, thisObj, ...parameters) {
        if (RES.isGroupLoaded(groupName)) {
            callback.apply(thisObj, parameters);
        } else {
            this.moduleLoadingLayer.loadModuleGroupRes(groupName, callback, thisObj, parameters);
        }
    }
    //浮动提示条
    public static showFlowHint(message:string) {
        var text:FlowHintUI = new FlowHintUI();
        ViewManager.instance.addElement(text, ViewDepth.NOTICE);
        text.showText(message, ViewManager._instance.removeFlowHint);
        ViewManager.instance.flowHints.unshift(text);

        var intN:number = ViewManager.instance.flowHints.length;
        var txt:FlowHintUI;
        if (intN > 5) {
            txt = ViewManager.instance.flowHints[intN - 1];
            ViewManager._instance.removeFlowHint(txt);
            intN--;
        }
        txt = ViewManager.instance.flowHints[0];
        var intY:number = txt.y - txt.height / 2;
        for (var i:number = 1; i < intN; i++) {
            txt = ViewManager.instance.flowHints[i];
            intY -= txt.height / 2;
            egret.Tween.get(txt).to({y: intY >> 0}, 100);
            intY -= txt.height / 2;
        }
    }

    private removeFlowHint(flowHint:FlowHintUI):void {
        var i:number = ViewManager.instance.flowHints.indexOf(flowHint);
        if (i != -1) {
            ViewManager.instance.flowHints.splice(i, 1);
            ViewManager.instance.removeElement(flowHint, ViewDepth.NOTICE);
            egret.Tween.removeTweens(flowHint);
        }
    }

    //弹出提示框
    public static alert(text:string,
                        affirmHandler:Function = null,
                        thisObject:any = null, bShowCancel = false, bShowAffirm = true, countDown:number = -1, ...parameters) {
        if (!ViewManager.instance.gameAlert) {
            ViewManager.instance.gameAlert = new GameAlertUI();
        }
        ViewManager.instance.gameAlert.alert(text, affirmHandler, thisObject, bShowCancel, bShowAffirm, countDown, parameters);
    }

    //跑马灯提示
    public static showTopMessage(msg:string):void {
        if (!msg || msg.length <= 0) return;
        ViewManager.instance.topMessageUI.pushMessage(msg);
        //正在显示中则等待上一条显示完后，自动显示该条
        if (ViewManager.instance.topMessageUI.parent) return;
        ViewManager.instance.addElement(ViewManager.instance.topMessageUI, ViewDepth.NOTICE);
        ViewManager.instance.topMessageUI.showMessage();
    }

    //指定的Mediator是否已经打开
    public isMediatorExist(mediatorClass:any):boolean {
        var newMediator:Mediator = ObserverManager.getMediator(mediatorClass);
        if (this._window.indexOf(newMediator) != -1) return true;
        return false;
    }
}
//场景的层标识
enum ViewDepth{
    SCENE,
    UI,
    GUIDE,
    ALERT,
    NOTICE,
    LOADING
}