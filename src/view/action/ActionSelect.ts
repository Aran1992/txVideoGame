class ActionSelect extends ActionTimerSceneBase {
    private ITEM_COUNT: number = 5;
    private answerID: number;
    private isSelected: boolean;
    private exitTimer: number;

    public exit() {
        this.stopRun();
        this.onExit();
    }

    protected onSkinName(): void {
        if (this.paramList[3] === "0") {
            this.skinName = skins.ActionCheckDrink;
        } else if (this.paramList[3] === "1") {
            this.skinName = skins.ActionSelectWho;
        } else {
            this.skinName = skins.ActionCheckDrink;
        }
    }

    protected onInit(): void {
        super.onInit();
        this.answerID = this.model.moren;
        for (let i: number = 0; i < this.ITEM_COUNT; i++) {
            const button: eui.Component = this[`button${i}`];
            button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickButton, this);
            button["index"] = i;
            this[`selected${i}`].visible = false;
        }
    }

    protected onBackFail() {
        this.onBackSuccess();
    }

    protected onBackSuccess() {
        if (this.exitTimer) {
            egret.clearTimeout(this.exitTimer);
        }
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.ONSHOW_VIDEO),
            {
                answerId: this.answerID,
                wentiId: this.model.id,
                click: 1
            }
        );
        this.exit();
    }

    private onClickButton(event: egret.Event): void {        
        if (this.skinName == skins.ActionSelectWho)
            SoundManager.getInstance().playSound("ope_select_head.mp3")
        else
            SoundManager.getInstance().playSound("ope_select_tab.mp3")
        if (!this.isSelected) {
            this.isSelected = true;
            const button = event.currentTarget;
            const index = button["index"];
            this[`selected${index}`].visible = true;
            this.answerID = index + 1;
            for (let i: number = 0; i < this.ITEM_COUNT; i++) {
                this[`button${i}`].touchEnabled = false;
            }
            this.exitTimer = egret.setTimeout(() => this.onBackSuccess(), this, 1000);
        }
    }

    private onExit() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        for (let i: number = 0; i < this.ITEM_COUNT; i++) {
            this[`button${i}`].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickButton, this);
        }
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;
    }
}
