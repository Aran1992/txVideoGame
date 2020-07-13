class FreeNoticePanel extends eui.Component {
    private readonly from: string;
    private bg: eui.Image;

    constructor(from: any) {
        super();
        if (from != 1) {
            this.from = from;
        }
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete() {
        this.registerEvent();
        this.updateResize();
    }

    private onAddToStage() {
        this.skinName = skins.FreeTimeNoticeSkin;
    }

    private registerEvent() {
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBg, this);
    }

    private onClickBg() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'FreeNoticePanel');
        if (this.from === "tips") {
            VideoManager.getInstance().videoResume();
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
}

