var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 整个游戏时间的场景显示管理
 */
var ViewManager = (function () {
    function ViewManager() {
        //窗口是否处于激活状态(用于窗口休眠后停止音乐)
        this.isWinActivate = true;
        this._window = [];
        //场景层
        this.sceneLayer = new egret.DisplayObjectContainer();
        //UI层
        this.uiLayer = new eui.UILayer();
        //新手引导层
        this.guideLayer = new egret.DisplayObjectContainer();
        //跑马灯公告层
        this.noticeLayer = new egret.DisplayObjectContainer();
        //弹出提示框层
        this.alertLayer = new egret.DisplayObjectContainer();
        //Loading层
        this.loadingLayer = new LoadingUI;
        //加载模块时的Loading层
        this.moduleLoadingLayer = new ModuleLoadingUI();
        //浮动提示框列表
        this.flowHints = [];
        //弹出确认框
        this.gameAlert = null;
        //跑马灯
        this.topMessageUI = new TopMessageUI();
    }
    Object.defineProperty(ViewManager, "instance", {
        get: function () {
            if (!ViewManager._instance)
                ViewManager._instance = new ViewManager();
            return ViewManager._instance;
        },
        enumerable: true,
        configurable: true
    });
    ViewManager.prototype.init = function (main) {
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
    };
    //浏览器大小和宽高比发生变化时的处理（根据宽高比切换高对齐还是宽对齐）
    ViewManager.prototype.onWindowResize = function () {
        //偏长
        if (egret.MainContext.instance.stage.stageWidth == CommonConst.STAGE_WIDTH && egret.MainContext.instance.stage.stageHeight < CommonConst.STAGE_HEIGHT) {
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        }
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
            var subLayer = this.otherLayerContainer.getChildAt(i);
            if (subLayer == this.loadingLayer) {
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
    };
    ViewManager.prototype.onActivate = function (e) {
        ViewManager.instance.isWinActivate = true;
        SoundManager.instance.playMusic();
    };
    ViewManager.prototype.onDeactivate = function (e) {
        ViewManager.instance.isWinActivate = false;
        SoundManager.instance.stopMusic();
    };
    ViewManager.prototype.OPEN_WINDOW = function (mediatorClass, bRetainFormer) {
        if (bRetainFormer === void 0) { bRetainFormer = false; }
        var parameters = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
        }
        if (!bRetainFormer) {
            this.closeAllWindow();
        }
        var newMediator = ObserverManager.getMediator(mediatorClass);
        if (!newMediator) {
            egret.error(egret.getQualifiedClassName(mediatorClass) + "  has not been registered!");
            return;
        }
        if (this._window.indexOf(newMediator) != -1)
            return;
        this._window.push(newMediator);
        newMediator.enter.apply(newMediator, parameters);
    };
    //关闭UI窗口(mediatorClass默认为空，表示关闭所有窗口)
    ViewManager.prototype.CLOSE_WINDOW = function (mediatorClass) {
        if (mediatorClass === void 0) { mediatorClass = null; }
        //如果制定了关闭的窗口Mediator则只关该指定窗口
        if (mediatorClass) {
            var mediator = ObserverManager.getMediator(mediatorClass);
            var index = this._window.indexOf(mediator);
            if (index == -1) {
                return;
            }
            this._window[index].exit();
            this._window.splice(index, 1);
        }
        else {
            this.closeAllWindow();
        }
    };
    //只用于类似RPG游戏的场景层的切换
    ViewManager.prototype.REPLACE_SCENE = function (newMediatorClass, targetMediatorClass) {
        var newMediator = ObserverManager.getMediator(newMediatorClass);
        if (this._window.indexOf(newMediator) != -1)
            return;
        var targetMediator = ObserverManager.getMediator(targetMediatorClass);
        var targetIndex = this._window.indexOf(targetMediator);
        if (targetIndex == -1)
            return;
        this._window[targetIndex].exit();
        this._window.splice(targetIndex, 1);
        this._window.push(newMediator);
        newMediator.enter();
    };
    ViewManager.prototype.closeAllWindow = function () {
        for (var key in this._window) {
            if (this._window[key]) {
                this._window[key].exit();
            }
        }
        this._window.length = 0;
    };
    //添加到对应的显示layer（bMask表示是否在UI后添加半透明遮挡）
    ViewManager.prototype.addElement = function (child, depth) {
        if (depth === void 0) { depth = ViewDepth.UI; }
        var layer = this.getLayer(depth);
        if (depth == ViewDepth.UI) {
            child.width = egret.MainContext.instance.stage.stageWidth;
            child.height = egret.MainContext.instance.stage.stageHeight;
        }
        layer.addChild(child);
    };
    ViewManager.prototype.removeElement = function (child, depth) {
        if (depth === void 0) { depth = ViewDepth.UI; }
        var layer = this.getLayer(depth);
        if (child && child.parent == layer) {
            layer.removeChild(child);
        }
        else {
            egret.warn("viewManager removeElement is error");
        }
    };
    //根据层索引获得layer
    ViewManager.prototype.getLayer = function (depth) {
        var layer = null;
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
    };
    //显示loading进度
    ViewManager.prototype.showLoading = function (current, total) {
        this.loadingLayer.visible = true;
        this.loadingLayer.setProgress(current, total);
    };
    ViewManager.prototype.hideLoading = function () {
        this.loadingLayer.visible = false;
    };
    //加载其他模块资源
    ViewManager.prototype.loadModuleGroupRes = function (groupName, callback, thisObj) {
        var parameters = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            parameters[_i - 3] = arguments[_i];
        }
        if (RES.isGroupLoaded(groupName)) {
            callback.apply(thisObj, parameters);
        }
        else {
            this.moduleLoadingLayer.loadModuleGroupRes(groupName, callback, thisObj, parameters);
        }
    };
    //浮动提示条
    ViewManager.showFlowHint = function (message) {
        var text = new FlowHintUI();
        ViewManager.instance.addElement(text, ViewDepth.NOTICE);
        text.showText(message, ViewManager._instance.removeFlowHint);
        ViewManager.instance.flowHints.unshift(text);
        var intN = ViewManager.instance.flowHints.length;
        var txt;
        if (intN > 5) {
            txt = ViewManager.instance.flowHints[intN - 1];
            ViewManager._instance.removeFlowHint(txt);
            intN--;
        }
        txt = ViewManager.instance.flowHints[0];
        var intY = txt.y - txt.height / 2;
        for (var i = 1; i < intN; i++) {
            txt = ViewManager.instance.flowHints[i];
            intY -= txt.height / 2;
            egret.Tween.get(txt).to({ y: intY >> 0 }, 100);
            intY -= txt.height / 2;
        }
    };
    ViewManager.prototype.removeFlowHint = function (flowHint) {
        var i = ViewManager.instance.flowHints.indexOf(flowHint);
        if (i != -1) {
            ViewManager.instance.flowHints.splice(i, 1);
            ViewManager.instance.removeElement(flowHint, ViewDepth.NOTICE);
            egret.Tween.removeTweens(flowHint);
        }
    };
    //弹出提示框
    ViewManager.alert = function (text, affirmHandler, thisObject, bShowCancel, bShowAffirm, countDown) {
        if (affirmHandler === void 0) { affirmHandler = null; }
        if (thisObject === void 0) { thisObject = null; }
        if (bShowCancel === void 0) { bShowCancel = false; }
        if (bShowAffirm === void 0) { bShowAffirm = true; }
        if (countDown === void 0) { countDown = -1; }
        var parameters = [];
        for (var _i = 6; _i < arguments.length; _i++) {
            parameters[_i - 6] = arguments[_i];
        }
        if (!ViewManager.instance.gameAlert) {
            ViewManager.instance.gameAlert = new GameAlertUI();
        }
        ViewManager.instance.gameAlert.alert(text, affirmHandler, thisObject, bShowCancel, bShowAffirm, countDown, parameters);
    };
    //跑马灯提示
    ViewManager.showTopMessage = function (msg) {
        if (!msg || msg.length <= 0)
            return;
        ViewManager.instance.topMessageUI.pushMessage(msg);
        //正在显示中则等待上一条显示完后，自动显示该条
        if (ViewManager.instance.topMessageUI.parent)
            return;
        ViewManager.instance.addElement(ViewManager.instance.topMessageUI, ViewDepth.NOTICE);
        ViewManager.instance.topMessageUI.showMessage();
    };
    //指定的Mediator是否已经打开
    ViewManager.prototype.isMediatorExist = function (mediatorClass) {
        var newMediator = ObserverManager.getMediator(mediatorClass);
        if (this._window.indexOf(newMediator) != -1)
            return true;
        return false;
    };
    return ViewManager;
}());
__reflect(ViewManager.prototype, "ViewManager");
//场景的层标识
var ViewDepth;
(function (ViewDepth) {
    ViewDepth[ViewDepth["SCENE"] = 0] = "SCENE";
    ViewDepth[ViewDepth["UI"] = 1] = "UI";
    ViewDepth[ViewDepth["GUIDE"] = 2] = "GUIDE";
    ViewDepth[ViewDepth["ALERT"] = 3] = "ALERT";
    ViewDepth[ViewDepth["NOTICE"] = 4] = "NOTICE";
    ViewDepth[ViewDepth["LOADING"] = 5] = "LOADING";
})(ViewDepth || (ViewDepth = {}));
//# sourceMappingURL=ViewManager.js.map