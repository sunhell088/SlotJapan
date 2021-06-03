class HelpMediator extends Mediator {

    initView() {
        this.view = new HelpUI();
    }

    onEnter():void {
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_HELP, this.view.onEnter, this.view);
    }

    onExit():void {
        this.view.onExit();
    }
}
