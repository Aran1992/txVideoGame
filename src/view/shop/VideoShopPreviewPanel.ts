class VideoShopPreviewPanel extends eui.Component {
    public banner_img: eui.Image;
    public playBtn: eui.Group;
    public name_lab: eui.Label;
    public time_lab: eui.Label;
    public desc_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;
    public closeBtn: eui.Button;

    private data: ShopInfoData;
    private shoucangModel: Modelshoucang;

    public constructor(data) {
        super();
        this.data = data;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete(): void {
        this.updateResize();
        this.onRegistEvent();
        this.onUpdateInfo();
    }

    private onUpdateInfo(): void {
        let shoucangID: number = parseInt(this.data.model.params);
        this.shoucangModel = JsonModelManager.instance.getModelshoucang()[shoucangID];

        this.banner_img.source = `${this.shoucangModel.id}_desc_png`//this.data.model.preview.split(";")[0];
        this.name_lab.text = this.data.model.name;
        this.desc_lab.text = this.data.model.desc;
        this.time_lab.text = this.shoucangModel.time;
        let num = ShopManager.getInstance().getItemNum(this.data.id);
        if (num > 0) {
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (this.data.origPrice > this.data.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = this.data.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((this.data.currPrice / this.data.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.discount_bar.visible = false;
            }
            this.buy_btn.enabled = true;
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = this.data.currPrice.toFixed(2);
        }
    }

    private onRegistEvent(): void {
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
    }

    private onRemoveEvent(): void {
        this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.playBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onAddToStage(): void {
        this.skinName = skins.VideoShopPreviewSkin;
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, "")));
    }

    private onPlay(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDefine.CUR_PLAYER_VIDEO = 2;
        if (widPlayer) {
            let videoSrc: string = this.data.model.preview;
            widPlayer.play(videoModels[videoSrc].vid);
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_VIDEO3));
        GameCommon.getInstance().showLoading();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ControlTipsPanel');
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.onRemoveEvent();
        // if(widPlayer1)
        // widPlayer1 = null;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'VideoShopPreviewPanel');
    }
}
