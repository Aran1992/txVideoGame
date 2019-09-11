class ActionSearch extends ActionSceneBase {
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc: eui.Label;
    private hudong_grp: eui.Group;

    private TanSuo_Pos_Ary: number[][] = [[400, 320], [780, 320], [1110, 350], [580, 550]];
    private ansId: number;
    private Before_ID: number = 57;

    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }

    public exit() {
        this.stopRun();
        this.onExit();
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionSearchSkin;
    }

    protected onInit(): void {
        this.maxTime = this.runTime = this.model.time * 1000;
        this.delTime = this.model.time * 1000;
        this.updateResize();
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.slideDuration = 0;
        this.timeBar1.value = this.maxTime;
        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
        this.ansId = this.model.moren;
        let isselectIdx: number = 0;
        if (this.model.id == 76) {
            isselectIdx = UserInfo.curBokData.answerId[this.Before_ID];
        }
        //初始化探索位置
        for (let i: number = 1; i <= this.TanSuo_Pos_Ary.length; i++) {
            let anim: Animation = new Animation("effect_tansuo", -1);
            anim.width = 130;
            anim.height = 130;
            anim.anchorOffsetX = 65;
            anim.anchorOffsetY = 65;
            anim.touchEnabled = true;
            anim.name = i + '';
            let x: number = this.TanSuo_Pos_Ary[i - 1][0];
            let y: number = this.TanSuo_Pos_Ary[i - 1][1];
            let rate_X: number = x / GameDefine.GAME_VIEW_WIDTH;
            let rate_Y: number = y / GameDefine.GAME_VIEW_HEIGHT;
            anim.x = Math.floor(size.width * rate_X);
            anim.y = Math.floor(size.height * rate_Y);
            this.hudong_grp.addChild(anim);
            anim.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
            if (i == isselectIdx) anim.visible = false;
            else anim.onPlay();
        }
        this.initTimeInfo();
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar1.value = this.runTime;
        this.timeBar2.value = this.runTime;
    }

    protected onBackFail() {
        this.onBackSuccess();
    }

    protected onBackSuccess() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ONSHOW_VIDEO), {
            answerId: this.ansId,
            wentiId: this.model.id,
            click: 1
        });
        this.exit();
    }

    private initTimeInfo() {
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        if (hdCfg && hdCfg.des) {
            this.desc.text = hdCfg.des;
        }
    }

    private onSelect(event: egret.Event): void {
        this.ansId = parseInt(event.currentTarget.name);
        for (let i: number = this.hudong_grp.numChildren; i >= 1; i--) {
            if (this.ansId != i) this.hudong_grp.getChildAt(i - 1).visible = false;
        }
    }

    private onExit() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        for (let i: number = this.hudong_grp.numChildren - 1; i >= 0; i--) {
            let anim: Animation = this.hudong_grp.getChildAt(i) as Animation;
            anim.onDestroy();
            anim = null;
        }
    }

    //The end
}
