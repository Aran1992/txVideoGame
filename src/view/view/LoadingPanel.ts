class LoadingPanel extends eui.Component {
    private grp: eui.Group;
    private share: egret.Shape;
    private mcFactory1: egret.MovieClipDataFactory;
    private img_mc: egret.MovieClip;
    private ldState: boolean = false;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public setText(text: string): void {

    }

    public starLoading() {
        if (!this.ldState) {
            if (!this.mcFactory1) {
                this.mcFactory1 = new egret.MovieClipDataFactory();
                this.mcFactory1.mcDataSet = RES.getRes("loading_json");
                this.mcFactory1.texture = RES.getRes("loading_png");
                this.img_mc = new egret.MovieClip();
                this.img_mc.movieClipData = this.mcFactory1.generateMovieClipData("action");
                this.img_mc.x = size.width / 2;
                this.img_mc.y = size.height / 2;
                this.img_mc.scaleX = 0.5;
                this.img_mc.scaleY = 0.5;
                this.grp.addChild(this.img_mc);
            }
            this.img_mc.visible = true;
            this.img_mc.play(-1);
            this.ldState = true;
        }
    }

    public endLoading() {

        if (this.ldState) {
            if (this.img_mc) {
                this.img_mc.visible = false;
                this.img_mc.stop();
            }

            this.ldState = false;
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.LoadingSkin;
    }

    //供子类覆盖
    protected onInit(): void {
        this.share = new egret.Shape();
        this.updateResize();
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.onInit();
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onAddToStage(event: egret.Event): void {
        this.onSkinName();
    }
}
