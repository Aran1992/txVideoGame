class ActionTimerSceneBase extends ActionSceneBase {
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc: eui.Label;

    protected onInit() {
        super.onInit();
        this.initTimeInfo();
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar1.value = this.runTime;
        this.timeBar2.value = this.runTime;
    }

    private initTimeInfo() {
        this.timeBar1.slideDuration = 0;
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.value = this.maxTime;
        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
        this.desc.text = JsonModelManager.instance.getModelhudong()[this.model.type].des;
    }
}
