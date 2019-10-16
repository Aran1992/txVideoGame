class LoadingUI extends eui.Component implements RES.PromiseTaskReporter {
    private percent: eui.Label;
    private progress: eui.Image;
    private progressGroup: eui.Group;

    public constructor() {
        super();
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.skinName = skins.LoadingUISkin;
        this.updateResize();
        const top = -180;
        const bottom = -100;
        const upTime = 500;
        const downTime = 500;
        const interval = 250;
        let i = 0;
        for (let i = 1; i <= 4; i++) {
            setTimeout(() => {
                const func = () => {
                    egret.Tween.get(this[`head${i}`])
                        .to({y: top}, upTime, egret.Ease.sineIn)
                        .to({y: bottom}, downTime, egret.Ease.sineOut)
                        .wait(interval * 3)
                        .call(func);
                };
                func();
            }, i * interval);
        }
    }

    public onProgress(current: number, total: number): void {
        let rate = current / total;
        this.percent.text = `${Math.floor(rate * 100)}%`;
        GameCommon.getInstance().triggerEventNotify(GameEvent.GAME_LOADING, '');
        this.progress.width = this.progressGroup.width * rate;
    }

    public updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
}
