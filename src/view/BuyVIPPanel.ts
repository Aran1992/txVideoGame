class BuyVIPPanel extends eui.Component {
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete() {
        this.registerEvent();
    }

    private onAddToStage() {
        this.skinName = skins.BuyVIPSkin;
    }

    private registerEvent() {
    }
}

