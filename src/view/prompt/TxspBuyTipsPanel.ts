/**
 * 提示信息
 */
class TxspBuyTipsPanel extends eui.Component {
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
    private param: Function;
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
        this.skinName = skins.TxspBuyTipsSkin;
    }

    //供子类覆盖
    protected onInit(): void {
        this.icon.scaleX = 0.5;//Number(scale.toFixed(2))
        this.icon.scaleY = 0.5;//Number(scale.toFixed(2))
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
    }

    private onshowMaskBG(): void {
        if (!this.mask_BG) {
            this.mask_BG = new eui.Image("zhezhao_png");
        }
        this.mask_BG.width = size.width;
        this.mask_BG.height = size.height;
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

    //此处引导开通会员
    private async onZuanShi() {        
        let res = await platform.openWebview({
            url:"https://film.qq.com/h5/upay/?cid=mzc002003phdd29&tab=vip&ht=1&ptag=interaction&back=1&actid=HLW_7094ZHENGJIA",
            landscape: 0, // 是否进入横屏webview，1: 是， 0: 不是。默认: 0
            hidetitlebar: 0, // 是否隐藏webview自带状态栏。1: 是， 0: 不是。 默认: 0
            hidestatusbar: 0, // 是否隐藏操作系统的状态栏（网络/运营商/时间等）1: 是，0: 不是。默认: 0
            needBridgeHelper: 0, // 新开的webview是否需要bridgeHelper(支付页不要用这个参数），默认: 0
            useProxyReport: 1, // 新开的webview是否使用播放器的代理上报，1: 是，0: 不是。默认: 1
            close: 0, // 是否关闭当前webview。1: 关闭, 0: 不关闭。默认：0
            style: 1, // 新开webview的样式: 0: 导航显示更多按钮, 1: 导航不显示更多按钮, 2: 关闭loading（仅android支持）。默认：0
        }).then(res=>{
            console.log(res);
            //GameCommon.getInstance().showCommomTips(res.msg);
            this.onclose();
        });
    }

    //这里实际上是使用钻石；懒得改名；
    private onSuiPian() {        
        this.param();
        this.onclose();
    }

    private onAddToStage(event: egret.Event): void {
        this.onSkinName();
        this.onshowMaskBG();
    }

    private onclose() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'TxspBuyTipsPanel');
        this.onhideMaskBG();
    }
}