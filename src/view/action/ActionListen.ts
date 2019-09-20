class ActionListen extends ActionSceneBase {
    private DRINK_MAX: number = 4;
    private ansId: number;
    private isSelected: boolean;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc: eui.Label;

    public exit() {
        this.stopRun();
        this.onExit();
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionListen;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.slideDuration = 0;
        this.timeBar1.value = this.maxTime;
        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
        this.initTimeInfo();
        this.ansId = this.model.moren;
        for (let i: number = 0; i < this.DRINK_MAX; i++) {
            let checkBtn: eui.RadioButton = (this[`drink${i}_btn`] as eui.RadioButton);
            let rate_X: number = checkBtn.x / GameDefine.GAME_VIEW_WIDTH;
            let rate_y: number = checkBtn.y / GameDefine.GAME_VIEW_HEIGHT;
            checkBtn.x = Math.floor(size.width * rate_X);
            checkBtn.y = Math.floor(size.height * rate_y);
            checkBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectDrink, this);
        }
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_FULL_END, this.exit, this);
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar1.value = this.runTime;
        this.timeBar2.value = this.runTime;
    }

    private initTimeInfo() {
        const hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        if (hdCfg && hdCfg.des) {
            this.desc.text = hdCfg.des;
        }
    }

    private onSelectDrink(event: egret.Event): void {
        if (!this.isSelected) {
            this.isSelected = true;
            const button = (event.currentTarget as eui.RadioButton);
            this.ansId = parseInt(button.value);
            for (let i: number = 0; i < this.DRINK_MAX; i++) {
                (this[`drink${i}_btn`] as eui.RadioButton).touchEnabled = false;
            }
            SoundManager.getInstance().playSound(`music${this.ansId}.mp3`);
            const DURATION = 100;
            button.enabled = true;
            egret.Tween.get(button)
                .to({alpha: 0}, DURATION)
                .to({alpha: 1}, DURATION)
                .call(() => button.enabled = false)
                .wait(10000)
                .call(() => {
                    GameDispatcher.getInstance().dispatchEvent(
                        new egret.Event(GameEvent.VIDEO_FULL_END),
                        (this.ansId + 3).toString()
                    );
                });
        }
    }

    private onExit() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        for (let i: number = 0; i < this.DRINK_MAX; i++) {
            (this[`drink${i}_btn`] as eui.RadioButton).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectDrink, this);
        }
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;
    }
}
