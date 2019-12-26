class ImageShopPreviewPanel extends eui.Component {
    public banner_img: eui.Image;
    public pingfen_img: eui.Image;
    public name_lab: eui.Label;
    public count_lab: eui.Label;
    public desc_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;
    public closeBtn: eui.Button;
    private datu: eui.Image;
    private idHasBuyed:eui.Label;

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
        this.banner_img.source = this.shoucangModel.id+"_desc_png";//this.data.model.preview;
        this.name_lab.text = this.data.model.name;
        this.desc_lab.text = this.data.model.desc;
        //let srcAry: string[] = this.shoucangModel.src.split(";");
        this.count_lab.text = Math.min(Number(this.shoucangModel.src),5)+"P";//srcAry.length + "P";
        this.pingfen_img.source = `shop_image_${this.shoucangModel.level}_png`;        
        let num = ShopManager.getInstance().getItemNum(this.data.id);
        if (num > 0) {
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
            this.idHasBuyed.text="——  已购买该商品，可在收藏查看完整内容 —— ";            
            //this.idHasBuyed.visible = true;
        } else {
            //this.idHasBuyed.visible = false;
            this.idHasBuyed.text="——  仅支持封面预览，购买后可在收藏查看完整图集 —— ";    
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (this.data.origPrice > this.data.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = this.data.model.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((this.data.currPrice / this.data.origPrice* 10).toFixed(1)) + "折";
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
        // this.banner_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenDatu, this);
        // this.datu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseDaTu, this);
    }

    private onRemoveEvent(): void {
        this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
        // this.banner_img.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenDatu, this);
        // this.datu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseDaTu, this);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onAddToStage(): void {
        this.skinName = skins.ImageShopPreviewSkin;
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        let picPath = this.shoucangModel.id+"_view_l_png";
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data,picPath )));

    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.onRemoveEvent();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ImageShopPreviewPanel');
    }

    // private onOpenDatu() {
    // 	egret.Tween.removeTweens(this.datu);
    // 	this.datu.source = this.banner_img.source;
    // 	this.datu.width = this.banner_img.width;
    // 	this.datu.height = this.banner_img.height;
    // 	this.datu.scaleX = this.datu.scaleY = 1;
    // 	var scale: number = Math.max(size.width / this.datu.width, size.height / this.datu.height);
    // 	var tw = egret.Tween.get(this.datu);
    // 	tw.to({ scaleX: scale, scaleY: scale }, 200);
    // 	tw.call(function () { egret.Tween.removeTweens(this.datu); tw = null; }, this);
    // }
    // private onCloseDaTu() {
    // 	egret.Tween.removeTweens(this.datu);
    // 	var tw = egret.Tween.get(this.datu);
    // 	tw.to({ width: this.banner_img.width, height: this.banner_img.height }, 200);
    // 	tw.call(function () { this.datu.source = ""; egret.Tween.removeTweens(this.datu); tw = null; }, this);
    // }
}
