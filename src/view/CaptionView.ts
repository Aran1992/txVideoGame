/**
 * 提示信息
 */
class CaptionView extends eui.Component {

	private _label: eui.Label;
	// private _isNext: boolean = false;
	private timer: egret.Timer;
	public boo: boolean = true;
	public speed: number = 5;
    private static _captionView: CaptionView;
    public static getInstance(): CaptionView {
		if (!this._captionView) {
			this._captionView = new CaptionView();
		}
		return this._captionView;
	}
	public constructor( ) {
		super();
		this._label = new eui.Label();
		this.touchEnabled = false;
		this.touchChildren = false;
		
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event: egret.Event): void {
		this.setStyle();
        this._label.fontFamily="SimHei";
        this._label.size = 40;
        this._label.textColor = 0xFFFFFF;
        this._label.stroke = 1;
        this._label.strokeColor = 0x382e2e;
		this._label.bold = true;
		this._label.anchorOffsetX = this._label.width / 2;
		this._label.anchorOffsetY = this._label.height / 2;
		this._label.touchEnabled = false;
		this.touchEnabled = false;
        this._label.x = 500;
        this._label.y = 300;
		this.addChild(this._label);
	}

	private setStyle(): void {
		this.touchChildren = false;
	}
	public get height(): number {
		return this._label ? this._label.textHeight + 10 : 30;
	}
	private timerComFunc() {
		this.boo = false;
        this._label.text = '';
		this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
		this.timer = null;
	}

	public get proboodate() {
		return this.boo;
	}
	public onRemove(): void {
		this.removeChildren();
		this._label = null;
		if (this.parent)
			this.parent.removeChild(this);
	}
    public getText(): string {
        return this._label.text;
	}
	public setText(text: string,time): void {
        if(this.timer)
        {
            this._label.text = '';
            this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
		    this.timer = null;
        }
		this._label.text = text;
		this.timer = new egret.Timer(time, 1);
		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
		this.timer.start();
	}
}	