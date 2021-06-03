/**
 * 免费游戏选择界面
 */
class FreeGameSelectMediator extends Mediator {
    //通知选择了莲花
    public static SELECT_LOTUS:string = "openLotus";

    getCommands():string[] {
        return [FreeGameSelectMediator.SELECT_LOTUS];
    }
    
    initView() {
        this.view = new FreeGameSelectUI();
    }

    onEnter():void {
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_FREE_SPIN, this.view.onEnter, this.view);
    }

    onExit():void {
        this.view.onExit();
    }


    private openLotus():void {
        (<FreeGameSelectUI>this.view).openLotus();
    }
}
