/**
 * 提示信息
 */
class PromptInfo extends eui.Component {

    public boo: boolean = true;
    public speed: number = 5;
    private _label: eui.Label;
    // private _isNext: boolean = false;
    private timer: egret.Timer;

    public constructor(type: PROMPT_TYPE) {
        super();
        this._type = type;
        this._label = new eui.Label();
        this.touchEnabled = false;
        this.touchChildren = false;
        // if (!this.timer) {
        // 	this.timer = new egret.Timer(2000, 1);
        // }

        // this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        // this.timer.start();
        // this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private _type: PROMPT_TYPE;

    public get type(): PROMPT_TYPE {
        return this._type;
    }

    // }
    public get height(): number {
        return this._label ? this._label.textHeight + 10 : 30;
    }

    // private setAnim(): void {
    // switch (this._type) {
    // 	case PROMPT_TYPE.ERROR:
    // 		var tw = egret.Tween.get(this);
    // 		tw.to({ y: 400 }, 1200);
    // 		tw.to({ y: 350 }, 500);
    // 		tw.call(this.onRemove, this);
    // 		break;
    // 	case PROMPT_TYPE.FUN:
    // 		var tw = egret.Tween.get(this);
    // 		tw.to({ scaleX: 1.3, scaleY: 1.3 }, 200);
    // 		tw.call(this.onNext, this);
    // 		tw.to({ scaleX: 1, scaleY: 1 }, 200);
    // 		// tw.to({ alpha: 0.2},500);
    // 		tw.call(this.onRemove, this);
    // 		break;
    // 	case PROMPT_TYPE.GAIN:
    // 		var tw = egret.Tween.get(this);
    // 		//tw.to({ scaleX: 1.3,scaleY: 1.3 },200);
    // 		//tw.call(this.onNext,this);
    // 		//tw.to({ scaleX: 1,scaleY: 1 },200);
    // 		tw.to({ y: 400 }, 1000);//,alpha: 0.5
    // 		tw.call(this.onRemove, this);
    // 		break;
    // 	case PROMPT_TYPE.CUSTOM:
    // 		var tw = egret.Tween.get(this);
    // 		tw.to({ scaleX: 1.3, scaleY: 1.3 }, 200);
    // 		tw.call(this.onNext, this);
    // 		tw.to({ scaleX: 1, scaleY: 1 }, 200);
    // 		// tw.to({ alpha: 0.2 }, 500);
    // 		tw.call(this.onRemove, this);
    // 		break;
    // }

    public get proboodate() {
        return this.boo;
    }

    public onRemove(): void {
        this.removeChildren();
        this._label = null;
        if (this.parent)
            this.parent.removeChild(this);
    }

    public setText(text: string): void {
        var bg: eui.Image = new eui.Image();
        bg.source = text + "_png";
        var txtr = RES.getRes(text + "_png");
        if (txtr) {
            bg.anchorOffsetX = txtr.textureWidth / 2;
            bg.anchorOffsetY = txtr.textureHeight / 2;
            bg.width = txtr.textureWidth;
            bg.height = txtr.textureHeight;
        }
        this.addChild(bg);
        this.touchChildren = false;
    }

    public getText(): string {
        return this._label.text;
    }

    // private onNext(): void {
    // 	this._isNext = true;
    // }

    // public isNext(): boolean {
    // 	return this._isNext;
    // }

    public setTextFlow(text: Array<egret.ITextElement>): void {
        this._label.textFlow = text;
    }

    private onAddToStage(event: egret.Event): void {
        this.setStyle();
        // this.setAnim();

        // this._label.fontFamily = "SimHei";
        // this._label.size = 22;
        // this._label.bold = true;
        // // this._label.strokeColor = 0;
        // // this._label.stroke = 2;
        // // this._label.alpha = 1;
        // this._label.anchorOffsetX = this._label.width / 2;
        // this._label.anchorOffsetY = this._label.height / 2;
        // this.addChild(this._label);
    }

    private setStyle(): void {

    }

    private timerComFunc() {
        // this.boo = false;
        // this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
        // this.timer = null;
    }
}
