/**
 * bigWin
 */
class BigWinMediator extends Mediator {
    private bHasCreateMovie:boolean = false;
    initView() {
        this.view = new BigWinUI();
    }

    onEnter(awardLevel:AWARD_LEVEL, awardCount:number):void {
        if(!this.bHasCreateMovie){
            this.bHasCreateMovie = true;
            //bigwin的掉落金币
            GameUtil.coinFactory = new egret.MovieClipDataFactory(RES.getRes("bigwin_dropCoin_mc_json"), RES.getRes("bigwin_dropCoin_tex_png"));
            //bigwin的动画对应的骨骼文件
            dragonBones.EgretFactory.factory.parseDragonBonesData(RES.getRes("Slots_bigwin_ske_dbbin"));
            //bigwin的动画对应的图集
            dragonBones.EgretFactory.factory.parseTextureAtlasData(RES.getRes("Slots_bigwin_tex_json"), RES.getRes("Slots_bigwin_tex_png"));
        }
        ViewManager.instance.loadModuleGroupRes(SilentLoadResManager.RES_GROUP_BIG_WIN, this.view.onEnter, this.view, awardLevel, awardCount);
    }

    onExit():void {
        this.view.onExit();
    }
}
