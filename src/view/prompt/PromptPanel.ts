class PromptPanel extends egret.DisplayObjectContainer {
    private static _promptPanel: PromptPanel;
    private cjTips: CommonTips;
    private loadPanel: LoadingPanel;
    private errTipsStrAry: string[] = [];

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public static getInstance(): PromptPanel {
        if (!this._promptPanel) {
            this._promptPanel = new PromptPanel();
        }
        return this._promptPanel;
    }

    public addChengJiuTips(str) {
        this.cjTips.setText(str, false);
    }

    public addLikeTips(str) {
        this.cjTips.setText(str, true);
        //this.cjTips.setLike(str);
    }

    public setTipsHuDong() {
        this.cjTips.setTipsHuDong();
    }

    public hideTipsHuDong() {
        this.cjTips.hideTipsHuDong();
    }

    public showCommomTips(str) {
        this.cjTips.setTipsLab(str);
    }

    public showRoleChapterNotice() {
        this.cjTips.showRoleChapterNotice();
    }

    public showActionTips(str) {
        this.cjTips.showActionTips(str);
    }

    public hideActionTips() {
        this.cjTips.hideActionTips();
    }

    public onShowQinMiGroup() {
        this.cjTips.onShowQinMiGroup();
    }

    public onShowBuyTips(id, money, tp) {
        this.cjTips.onShowBuyTips(id, money, tp);
    }

    public onShowBuyHaoGan(id: number = 0) {
        this.cjTips.onShowBuyHaoGan(id);
    }

    public onShowResultTips(str: string, isRight: boolean, btnlabel: string, callBack: Function, ...arys) {
        this.cjTips.onShowResultTips(str, isRight, btnlabel, callBack, arys);
    }

    public showConfirmTips(desc: string, callBack: Function, desc2?: string,textYes:string="是",textNo:string="否"): void {
        this.cjTips.showConfirmTips(desc, callBack, desc2,textYes,textNo);
    }

    public showErrorLog(logstr: string) {
        if (!platform.isDebug) return;
        this.errTipsStrAry.push(logstr);
        if (this.cjTips) {
            while (this.errTipsStrAry.length > 0) {
                this.cjTips.showErrorLog(this.errTipsStrAry.shift());
            }
        }
    }

    public showLoading() {
        this.loadPanel.starLoading();
    }

    public removeLoading() {
        this.loadPanel.endLoading();
    }

    private onAddToStage(event: egret.Event): void {
        this.cjTips = new CommonTips();
        this.addChild(this.cjTips);
        this.cjTips.touchEnabled = false;
        this.loadPanel = new LoadingPanel();
        this.loadPanel.touchEnabled = false;
        this.addChild(this.loadPanel);
    }
}

enum PROMPT_TYPE {
    ERROR,
    FUN,
    GAIN,
    CUSTOM,
}
