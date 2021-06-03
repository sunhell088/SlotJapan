/**
 * 帮助页面
 */
class HelpUI extends eui.Component implements IGameUI {
    //从0开始，所以实际是需要+1
    private static MAX_PAGE:number = 1;
    private closeBtn:eui.Button;
    private leftPage:eui.Rect;
    private rightPage:eui.Rect;

    //记录的页
    private mPage:number = 0;

    public constructor() {
        super();
        this.skinName = HelpUISkin;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.leftPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLeftPage, this);
        this.rightPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRightPage, this);
    }

    onEnter():void {
        this.mPage = 0;
        ViewManager.instance.addElement(this);
        this.pageChange();
    }

    onExit():void {
        ViewManager.instance.removeElement(this);
    }

    onClose():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        ViewManager.instance.CLOSE_WINDOW(HelpMediator);
    }

    private onLeftPage():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        this.mPage--;
        if (this.mPage < 0) this.mPage = 0;
        this.pageChange();
    }

    private onRightPage():void {
        SoundManager.instance.playEffect(SoundType.BUTTON_CLICK);
        this.mPage++;
        if (this.mPage > HelpUI.MAX_PAGE) this.mPage = HelpUI.MAX_PAGE;
        this.pageChange();
    }

    private pageChange():void {
        this.invalidateState();
    }

    private set page(state:string) {
        this.invalidateState();
    }

    protected getCurrentState():string {
        return "page" + this.mPage;
    }
}