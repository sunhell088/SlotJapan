//游戏主入口
class Main extends egret.DisplayObjectContainer {
    //版本号（每次发布时修改，防缓存用）
    private defaultResVersion:string;

    public constructor() {
        super();
        this.defaultResVersion = window["default_res"];
        //重写并覆盖引擎提供的RES.getResByUrl方法 防止使用者用异步的方式来加载，却忘记加版本号
        ResUtil.rewriteGetResByUrl();
        //如果在发布环境，那么去掉打印
        if (RELEASE) {
            egret.log = function () {
            };
            console.log = function () {
            };
            window.alert = function (message?:any) {
            };
        }
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        ResUtil.DEFAULT_RES = "resource/";
        //获取平台url参数
        Game.urlData = CommonUtil.getAllParam();
        //TODO 此功能暂时未完全
        // if (Game.urlData && Game.urlData.language && Game.urlData.language != "zh") {
        //     ResUtil.DEFAULT_RES = "resource_" + Game.urlData.language + "/";
        // }
        ResUtil.URL_ROOT_FOLDER = ResUtil.DEFAULT_RES + ResUtil.URL_ROOT_FOLDER;
        RES.loadConfig(ResUtil.DEFAULT_RES + "default.res.json?" + this.defaultResVersion, ResUtil.DEFAULT_RES);

        Game.instance.initGameView(this);
        Game.instance.initGameModule();
    }

    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme(ResUtil.DEFAULT_RES + "default.thm.json?" + this.defaultResVersion, this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    private isThemeLoadEnd:boolean = false;

    /**
     * 主题文件加载完成,开始预加载
     */
    private onThemeLoadComplete():void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }

    private isResourceLoadEnd:boolean = false;

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }

    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            Game.instance.startGame();
        }
    }

    /**
     * 资源组加载出错
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            ViewManager.instance.showLoading(event.itemsLoaded, event.itemsTotal);
        }
    }
}
