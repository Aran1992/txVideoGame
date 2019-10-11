class ActionFull extends ActionSceneBase {
    private guide_left: eui.Image;
    private guide_right: eui.Image;
    private timeBar: eui.ProgressBar;
    private moveUp: boolean;
    private start_posX: number;
    private start_posX1: number;

    protected onSkinName(): void {
        this.skinName = skins.ActionFullSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.moveUp = false;
        this.guide_left.y = this.height / 2;
        this.guide_right.y = this.height / 2;
        this.start_posX = this.guide_left.x;
        this.start_posX1 = this.guide_right.x;
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_FULL_END, this.onVideo_Full_End, this);
        const hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        if (hdCfg && hdCfg.des)
            this.timeBar['desc'].text = hdCfg.des;
        this.timeBar.maximum = this.maxTime;
    }

    protected update(dt): void {
        this.timeBar.value = this.maxTime - this.runTime;
    }

    protected onBackFail() {

    }

    private onVideo_Full_End() {
        this.exit();
    }
}
