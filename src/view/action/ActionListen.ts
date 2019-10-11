class ActionListen extends ActionTimerSceneBase {
    private ITEM_COUNT: number = 4;
    private ansId: number;
    private selected: boolean;
    private timer: number;

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
        this.ansId = this.model.moren + 3;
        for (let i: number = 0; i < this.ITEM_COUNT; i++) {
            this[`listen${i}`].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickListen, this);
            this[`listen${i}`].visible = true;
            this[`listen${i}`].value = i;
            this[`enter${i}`].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickEnter, this);
            this[`enter${i}`].visible = false;
            this[`enter${i}`].value = i;
        }
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_FULL_END, this.exit, this);
    }

    private onClickListen(event: egret.Event): void {
        if (this.selected) {
            return;
        }
        const listenBtn = event.currentTarget;
        this.selected = true;
        const name = `music${listenBtn.value + 1}.mp3`;
        SoundManager.getInstance().playSound(name);
        this.timer = egret.setTimeout(() => {
            const DURATION = 200;
            egret.Tween.get(listenBtn)
                .to({alpha: 0}, DURATION)
                .call(() => {
                    listenBtn.visible = false;
                    const enterBtn = this[`enter${listenBtn.value}`];
                    enterBtn.visible = true;
                    enterBtn.alpha = 0;
                    egret.Tween.get(enterBtn)
                        .to({alpha: 1}, DURATION)
                        .call(() => this.selected = false);
                });
        }, this, SoundManager.getInstance().getMusicLength(name));
    }

    private onClickEnter(event: egret.Event) {
        if (this.selected) {
            return;
        }
        const DURATION = 1000;
        const enterBtn = event.currentTarget;
        this.ansId = enterBtn.value + 4;
        this.selected = true;
        egret.Tween.get(enterBtn)
            .to({alpha: 0}, DURATION)
            .call(() => {
                GameDispatcher.getInstance().dispatchEvent(
                    new egret.Event(GameEvent.VIDEO_FULL_END),
                    this.ansId.toString()
                );
            });
    }

    private onExit() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        egret.clearTimeout(this.timer);
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;
    }
}
