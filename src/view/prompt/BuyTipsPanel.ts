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
        this.icon.source = this.param.banner;
        // let scale = 200/this.icon.width;
        // this.icon.x = 30;
        // this.icon.y =
        this.icon.scaleX = 0.5;//Number(scale.toFixed(2))
        this.icon.scaleY = 0.5;//Number(scale.toFixed(2))
        var spModel: Modelshop = JsonModelManager.instance.getModelshop()[this.param.shopInfo.id];
        this.money1.text = spModel.currSuipian + '';
        this.money2.text = spModel.currPrice + '';
        this._curModel = spModel;
        // GameCommon.getInstance().onShowBuyTips(spModel.id, spModel.pay_tp, spModel.currPrice);
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclose, this);
        this.zuanshiBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onZuanShi, this);
        this.suipBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSuiPian, this);
        this.updateResize();
        this.onInit();
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
        GameCommon.getInstance().onShowBuyTips(this.param.shopInfo.id, this._curModel.currPrice, GOODS_TYPE.DIAMOND);
        // this.moneyIcon.source = 'common_zuanshi1_png';
        this.onclose();
    }

    private onSuiPian() {
        GameCommon.getInstance().onShowBuyTips(this.param.shopInfo.id, this._curModel.currSuipian, GOODS_TYPE.SUIPIAN);
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
        // ShopManager.getInstance().buyGoods(this.info.id);
        this.onclose();
    }

    private onclose() {
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
