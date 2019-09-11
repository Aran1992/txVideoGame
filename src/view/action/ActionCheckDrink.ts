class ActionCheckDrink extends ActionSceneBase {
	private DRINK_MAX: number = 5;
	private ansId: number;
	private isSeleted: boolean;
	private timeBar1: eui.ProgressBar;
	private timeBar2: eui.ProgressBar;
	private desc: eui.Label;

	public constructor(model: Modelwenti, list: string[], idx: number) {
		super(model, list, idx);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActionCheckDrink;
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
		this.ansId = this.model.moren;
		for (let i: number = 0; i < this.DRINK_MAX; i++) {
			let checkBtn: eui.RadioButton = (this[`drink${i}_btn`] as eui.RadioButton);
			let rate_X: number = checkBtn.x / GameDefine.GAME_VIEW_WIDTH;
			let rate_y: number = checkBtn.y / GameDefine.GAME_VIEW_HEIGHT;
			checkBtn.x = Math.floor(size.width * rate_X);
			checkBtn.y = Math.floor(size.height * rate_y);
			checkBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectDrink, this);
		}
		this.initTimeInfo();
	}
	private initTimeInfo() {
		var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
		if (hdCfg && hdCfg.des) {
			this.desc.text = hdCfg.des;
		}
	}
	protected update(dt): void {
		super.update(dt);
		this.timeBar1.value = this.runTime;
		this.timeBar2.value = this.runTime;
	}
	private onSelectDrink(event: egret.Event): void {
		if (!this.isSeleted) {
			this.ansId = (event.currentTarget as eui.RadioButton).value;
			this.isSeleted = true;
			for (let i: number = 0; i < this.DRINK_MAX; i++) {
				(this[`drink${i}_btn`] as eui.RadioButton).touchEnabled = false;
			}
		}
	}
	protected onBackFail() {
		this.onBackSuccess();
	}
	protected onBackSuccess() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ONSHOW_VIDEO), { answerId: this.ansId, wentiId: this.model.id, click: 1 });
		this.exit();
	}
	public exit() {
		this.stopRun();
		this.onExit();
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
	//The end
}