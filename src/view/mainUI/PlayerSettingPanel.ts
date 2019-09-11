class PlayerSettingPanel extends eui.Component {
    private touchBtn: eui.ToggleSwitch;
    private mainGroup: eui.Group;
    private closeBtn: eui.Button;
    private goodsLayer: eui.Group;
    private scroll: eui.Scroller;
    private bgVolume: eui.ProgressBar;
    private huamianPro: eui.ProgressBar;
    private img: eui.Image;
    private curPro: eui.ProgressBar;
    private starPos: number = 0;
    private isUpdate: boolean = false;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onSkinName(): void {
        this.skinName = skins.PlayerSettingSkin;
    }

    protected onInit(): void {
        this.onRefresh();
    }

    protected onRefresh(): void {
    }

    protected onRegist(): void {
        this.updateSound();
    }

    protected onRemove(): void {

    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.touchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowTouch, this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this['mainVolume'].maximum = this['mainVolume'].width;
        this.bgVolume.maximum = this.bgVolume.width;
        this.huamianPro.maximum = this.huamianPro.width;
        this.bgVolume['touchBtn'].name = 'bgVolume';
        this['mainVolume']['touchBtn'].name = 'mainVolume';
        this.huamianPro['touchBtn'].name = 'huamianPro';
        this.bgVolume['touchBtn'].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        this['mainVolume']['touchBtn'].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        this.huamianPro['touchBtn'].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);

        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.onInit();
        this.onRegist();
        this.updateResize();
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
    }

    private onBegin(e: egret.TouchEvent) {
        this.starPos = e.stageX;
        this.img = e.currentTarget;
        this.scroll.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_CANCEL));
        // switch(this.)
        // {

        // }
        this.curPro = this[e.target.name];
        if (this.curPro) {
            this.curPro.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.curPro.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        }

    }

    private onTouchMove(e: egret.TouchEvent) {
        if (this.starPos > e.stageX) {
            this.img.x = this.img.x - (this.starPos - e.stageX);
            this.starPos = e.stageX;
        } else if (this.starPos < e.stageX) {
            this.img.x = e.stageX - this.starPos + this.img.x;
            this.starPos = e.stageX;
        }
        if (this.img.x >= this.curPro.width) {

            this.img.x = this.curPro.width;
        } else if (this.img.x <= 0) {
            this.img.x = 0;
        }
        this.curPro.value = this.img.x;
    }

    private onEnd() {
        this.goodsLayer.touchEnabled = true;
        this.curPro.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.curPro.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onGetBtn(event: TouchEvent): void {

    }

    private onClose() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'PlayerSettingPanel')
    }

    private onShowTouch(): void {
    }

    private updateSound() {

    }

    //The end
}
