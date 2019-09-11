class ActionClickCount extends ActionSceneBase {
    private times: number;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc: eui.Label;
    private handAni: my.Animation;
    private touch_probar_grp: eui.Group;
    private progress_img: eui.Image;
    private pro_mask: egret.Shape;

    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }

    public exit() {
        super.exit();
        if (this.handAni) {
            this.handAni.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            this.handAni.onDestroy();
            this.handAni = null;
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionClickCountSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.initTimeInfo();
        this.timeBar1.slideDuration = 0;
        this.timeBar2.slideDuration = 0;
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.value = this.maxTime;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
        this.touch_probar_grp.visible = false;
        let effectRes: string;
        switch (this.model.id) {
            case 62:
            case 63:
            case 68:
            case 69:
            case 72:
                effectRes = 'effect_zhiyin';
                break;
            case 61:
                this.touch_probar_grp.visible = true;
                break;
        }
        this.times = parseInt(this.paramList[3]);
        let posStr: string[] = this.paramList[4].split("_");
        let rate_X: number = parseInt(posStr[0]) / GameDefine.GAME_VIEW_WIDTH;
        let rate_Y: number = parseInt(posStr[1]) / GameDefine.GAME_VIEW_HEIGHT;
        if (effectRes) {
            this.handAni = new my.Animation(effectRes, -1);
            this.handAni.x = Math.floor(this.width * rate_X);
            this.handAni.y = Math.floor(this.height * rate_Y);
            this.handAni.touchEnabled = true;
            this.addChild(this.handAni);
            this.handAni.onPlay();
            this.handAni.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        } else if (this.touch_probar_grp.visible) {
            this.touch_probar_grp.x = Math.floor(this.width * rate_X);
            this.touch_probar_grp.y = Math.floor(this.height * rate_Y);
            this.touch_probar_grp.touchEnabled = true;
            this.touch_probar_grp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

            let r: number = this.touch_probar_grp.width / 2;
            this.pro_mask = new egret.Shape();
            this.touch_probar_grp.addChild(this.pro_mask);
            this.progress_img.mask = this.pro_mask;
        }
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar1.value = this.runTime;
        this.timeBar2.value = this.runTime;
    }

    private initTimeInfo() {
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        if (hdCfg && hdCfg.des) {
            this.desc.text = hdCfg.des;
        }
    }

    private onClick(): void {
        this.times = Math.max(0, this.times - 1);
        if (this.times == 0) {
            let posStr: string[] = this.paramList[4].split("_");
            let okAnim: my.Animation = new my.Animation("lingxing_effect");
            okAnim.scaleX = 0.8;
            okAnim.scaleY = 0.8;
            okAnim.x = parseInt(posStr[0]);
            okAnim.y = parseInt(posStr[1]);
            this.addChild(okAnim);
            okAnim.onPlay();

            this.onBackSuccess();
        }
        if (this.pro_mask) {
            let maxNum: number = parseInt(this.paramList[3]);
            let r: number = this.touch_probar_grp.width / 2;
            this.pro_mask.graphics.clear();
            this.pro_mask.graphics.beginFill(0);
            this.pro_mask.graphics.moveTo(r, r);
            this.pro_mask.graphics.lineTo(0, -r);//画线到弧的起始点
            this.pro_mask.graphics.drawArc(r, r, r, (Math.min(this.times / maxNum * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180);
            this.pro_mask.graphics.lineTo(r, r);//从终点画线到圆形。到此扇形的封闭区域形成
            this.pro_mask.graphics.endFill();
        }
    }

    //The end
}
