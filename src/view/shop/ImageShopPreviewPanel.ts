class ImageShopPreviewPanel extends eui.Component {
    public banner_img: eui.Image;
    public pingfen_img: eui.Image;
    public name_lab: eui.Label;
    public count_lab: eui.Label;
    public desc_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;
    public closeBtn: eui.Button;
    private idHasBuyed: eui.Label;
    private countGroup: eui.Group;

    private readonly data: ShopInfoData;
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
        this.banner_img.source = this.shoucangModel.id + "_desc_png";//this.data.model.preview;
        this.name_lab.text = this.data.model.name;
        this.desc_lab.text = this.data.model.desc.split("\\n").join("\n");
        //let srcAry: string[] = this.shoucangModel.src.split(";");
        if (this.shoucangModel.src !== "0") {
            this.countGroup.visible = true;
            this.count_lab.text = Math.min(Number(this.shoucangModel.src), 5) + "P";//srcAry.length + "P";
        } else {
            this.countGroup.visible = false;
        }
        this.pingfen_img.source = `shop_image_${this.shoucangModel.level}_png`;
        if (!ShopManager.getInstance().canBuyItem(this.data.id)) {
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
            this.idHasBuyed.text = "——  已购买该商品，可在已获福利查看完整内容 —— ";
        } else {
            this.idHasBuyed.text = "——  仅支持封面预览，购买后可在已获福利查看完整图集 —— ";
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (this.data.origPrice > this.data.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = this.data.model.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((this.data.currPrice / this.data.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.discount_bar.visible = false;
            }
            this.buy_btn.enabled = true;
            if (this.data.model.currPrice == 0 && this.data.model.currSuipian == 0)
                this.buy_btn.label = "免费购买";
            else
                this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = this.data.model.currPrice.toFixed(2);
        }
    }

    private onRegistEvent(): void {
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
    }

    private onRemoveEvent(): void {
        this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onAddToStage(): void {
        this.skinName = skins.ImageShopPreviewSkin;
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let picPath = this.shoucangModel.id + "_view_l_png";
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, picPath)));

    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.onRemoveEvent();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ImageShopPreviewPanel');
    }
}
