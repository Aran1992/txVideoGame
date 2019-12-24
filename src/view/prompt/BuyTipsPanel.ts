/**
 * 提示信息
 */
class BuyTipsPanel extends eui.Component {
    private grp: eui.Group;
    private icon: eui.Image;
    private buyGrp: eui.Group;
    private buyGroup1: eui.Group;
    private buyGroup2: eui.Group;
    private btnCancel: eui.Button;
    private btnConfirm: eui.Button;
    private closeBtn: eui.Label;
    private suipBuy: eui.Button;
    private zuanshiBuy: eui.Button;
    private money1: eui.Label;
    private money2: eui.Label;
    private param: BuyTipsParam;
    //显示蒙板
    private mask_BG: eui.Image;
    private _curModel: Modelshop;
    private idBuyItemName:eui.Label;
    private cancelBuy:eui.Button;

    constructor(param) {
        super();
        this.param = param;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public onShowBuyTips() {
        this.buyGroup1.visible = true;
        this.buyGrp.visible = true;
    }

    protected onSkinName(): void {
        this.skinName = skins.BuyTipsSkin;
    }

    //供子类覆盖
    protected onInit(): void {
        //this.icon.source = this.param.banner;
        // let scale = 200/this.icon.width;
        // this.icon.x = 30;
        // this.icon.y =
        this.icon.scaleX = 0.5;//Number(scale.toFixed(2))
        this.icon.scaleY = 0.5;//Number(scale.toFixed(2))
        var spModel: Modelshop = JsonModelManager.instance.getModelshop()[this.param.shopInfo.id];
        this.money1.text = spModel.currSuipian == 0?"不可购买":spModel.currSuipian + '';
        this.money2.text = spModel.currPrice*platform.getPriceRate() + '';
        this.idBuyItemName.text = "“"+spModel.name+"”";
        this._curModel = spModel;
        // GameCommon.getInstance().onShowBuyTips(spModel.id, spModel.pay_tp, spModel.currPrice);
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclose, this);
        this.cancelBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclose, this);
        this.zuanshiBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onZuanShi, this);
        this.suipBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSuiPian, this);
        this.updateResize();
        this.onInit();

        

        if(this.param.shopInfo.model.currSuipian == 0 && this.param.shopInfo.model.currPrice == 0){
                //直接加物品，购买成功 
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'BuyTipsPanel');
                this.onhideMaskBG();
                ShopManager.getInstance().addGoods(this.param.shopInfo.model.id,1);
                return;
                //GameCommon.getInstance().onShowResultTips("购买成功");
        }
        if (this.param.shopInfo.model.currSuipian == 0){
            GameCommon.getInstance().onShowBuyTips(this.param.shopInfo.id, this.param.shopInfo.currPrice*platform.getPriceRate(), GOODS_TYPE.DIAMOND);            
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'BuyTipsPanel');
            this.onhideMaskBG();
        }
    }

    private onshowMaskBG(): void {
        if (!this.mask_BG) {
            this.mask_BG = new eui.Image("zhezhao_png");
        }
        this.mask_BG.width = size.width;
        this.mask_BG.height = size.height;
        // this.x = -parnetGrp.x;
        // this.y = -parnetGrp.y;
        this.addChildAt(this.mask_BG, 0);
    }

    private onhideMaskBG(): void {
        if (this.mask_BG) {
            if (this.mask_BG.parent) this.mask_BG.parent.removeChild(this.mask_BG);
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        this.x = (size.width - this.width) / 2;
        this.y = (size.height - this.height) / 2;
    }

    private onZuanShi() {        
        if (platform.getPlatform() == "plat_txsp" || platform.getPlatform()== "plat_pc")
            GameCommon.getInstance().onShowBuyTips(this.param.shopInfo.id, this._curModel.currPrice*platform.getPriceRate(), GOODS_TYPE.DIAMOND);
        else
            ShopManager.getInstance().buyGoods(this.param.shopInfo.id);
        // this.moneyIcon.source = 'common_zuanshi1_png';
        this.onclose();
    }

    private onSuiPian() {
        let shopdata:ShopInfoData = ShopManager.getInstance().getShopInfoData(this.param.shopInfo.id);
        if (shopdata.model.currSuipian == 0 ){
            GameCommon.getInstance().showCommomTips("此商品不能用碎片购买！")
            return;
        }
        ShopManager.getInstance().buyGoodsSuip(this.param.shopInfo.id);
        //GameCommon.getInstance().onShowBuyTips(this.param.shopInfo.id, this._curModel.currSuipian, GOODS_TYPE.SUIPIAN);
        this.onclose();
        // this.moneyIcon.source = 'common_yuese_png';
    }

    private onAddToStage(event: egret.Event): void {
        this.onSkinName();
        this.onshowMaskBG();
    }

    private onbtnConfirm() {
        this.buyGrp.visible = false;
        ShopManager.getInstance().buyGoods(this.param.shopInfo.id);
        this.onclose();
    }

    private onCancel() {
        this.buyGrp.visible = false;
        this.onclose();
    }

    private onclose() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'BuyTipsPanel');
        this.onhideMaskBG();
    }
}

class BuyTipsParam {
    public shopInfo: ShopInfoData;
    public banner: string;

    public constructor(info: ShopInfoData, banner: string) {
        this.shopInfo = info;
        this.banner = banner;
    }
}
