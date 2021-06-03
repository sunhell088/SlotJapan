/**
 * Mediator的加载相关操作类
 **/
class Mediator {
    protected view:IGameUI;

    private enterParameters:any;
    private bResLoadComplete:boolean = false;

    public constructor() {
        ObserverManager.registerObserverFun(this);
    }

    enter(...parameters):void {
        this.enterParameters = parameters;
        //需要判断this.bResLoadComplete ，避免重复 initView
        if (!this.groupName() && !this.bResLoadComplete) {
            this.bResLoadComplete = true;
            this.initView();
            this.onEnter.apply(this, this.enterParameters);
            return;
        }
        if (this.bResLoadComplete) {
            this.onEnter.apply(this, this.enterParameters);
        } else {
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.loadGroup(this.groupName());
            ViewManager.instance.showLoading(0, 100);
        }
    }

    exit():void {
        this.onExit();
    }

    groupName():string {
        return null;
    }

    initView():void {
    }

    onEnter(...parameters):void {
    }

    onExit():void {
    }

    getCommands():string[] {
        return null;
    }

    protected onResourceLoadProgress(event:RES.ResourceEvent):void {
        ViewManager.instance.showLoading(event.itemsLoaded, event.itemsTotal);
    }

    protected onResourceLoadComplete():void {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
        this.bResLoadComplete = true;
        this.initView();
        this.onEnter.apply(this, this.enterParameters);
        ViewManager.instance.hideLoading();
    }
}

