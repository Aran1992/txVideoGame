class ActionFull extends ActionSceneBase {
    private guide_left: eui.Image;
    private guide_right: eui.Image;
    // private tipsImg:eui.Image;
    private timeBar: eui.ProgressBar;
    private moveUp: boolean;
    private start_posX: number;
    private start_posX1: number;

    // private updateResize() {
    // 	this.width = size.width;
    // 	this.height = size.height;

    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }

    // }
    public onSuccessItem(idx: number) {

    }

    protected onSkinName(): void {
        this.skinName = skins.ActionFullSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        let count = 2;
        this.moveUp = false;
        this.guide_left.y = this.height / 2;
        this.guide_right.y = this.height / 2;
        // this.tipsImg.anchorOffsetX = this.tipsImg.width/2;
        // this.tipsImg.x = this.guide_left.x+((this.guide_right.x-this.guide_left.x)/2);
        this.start_posX = this.guide_left.x;
        this.start_posX1 = this.guide_right.x;
        // this.guide_left.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_FULL_END, this.onVideo_Full_End, this);
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
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
        // this.guide_left.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        this.exit();
    }

    private onFrame(): void {
        if (!this.moveUp) {
            this.guide_left.x -= 2;
            this.guide_right.x += 2;
            if (this.guide_left.x < this.start_posX) {
                this.moveUp = true;
            }

        } else {
            this.guide_left.x += 2;
            this.guide_right.x -= 2;
            if (this.guide_left.x > this.start_posX + 30) {
                this.moveUp = false;
            }
        }
    }
}
