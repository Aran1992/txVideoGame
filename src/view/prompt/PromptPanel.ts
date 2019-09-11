/**
 * 提示面板
 */
class PromptPanel extends egret.DisplayObjectContainer {
    private static _promptPanel: PromptPanel;
    private cjTips: CommonTips;
    private loadpanel: LoadingPanel;
    private errTipsStrAry: string[] = [];
    private _infoArray1: Array<PromptInfo> = new Array<PromptInfo>();
    private _newestPromp1: PromptInfo = null;
    private _infoArray2: Array<PromptInfo> = new Array<PromptInfo>();
    private _newestPromp2: PromptInfo = null;

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
        this.cjTips.setText(str);
    }

    public addLikeTips(str) {
        this.cjTips.setLike(str);
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

    public onShowBuyHaoGan(id: number = 0, onCallBack) {
        this.cjTips.onShowBuyHaoGan(id, onCallBack);
    }

    public onShowResultTips(str: string, isRight: boolean, btnlabel: string, callBack: Function, ...arys) {
        this.cjTips.onShowResultTips(str, isRight, btnlabel, callBack, arys);
    }

    public showConfirmTips(desc: string, callBack: Function, desc2?: string): void {
        this.cjTips.showConfirmTips(desc, callBack, desc2);
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
        this.loadpanel.starLoading();
    }

    public removeLoading() {
        this.loadpanel.endLoading();
    }

    private onAddToStage(event: egret.Event): void {
        this.cjTips = new CommonTips();
        this.addChild(this.cjTips);
        this.cjTips.touchEnabled = false;
        this.loadpanel = new LoadingPanel();
        this.loadpanel.touchEnabled = false;
        this.addChild(this.loadpanel);
    }
}

enum PROMPT_TYPE {
    ERROR,
    FUN,
    GAIN,
    CUSTOM,
}
