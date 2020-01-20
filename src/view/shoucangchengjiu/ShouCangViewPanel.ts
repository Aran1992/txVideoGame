class ShouCangViewPanel extends eui.Component {
    private bgBtn: eui.Button;
    private goodsLayer: eui.Group;
    private noneGroup: eui.Group;
    private scroll: eui.Scroller;
    private itemGroup: eui.Group;
    private centerGroup: eui.Group;
    private goToShopButton: eui.Button;
    // private jinruLab1: eui.Group;
    // private jinruLab2: eui.Group;
    // private jinruLab3: eui.Group;
    private suipNum: eui.BitmapLabel;
    private filter_btn: eui.Button;
    private allCfgs = [
        {id: 1, shaixuan_params: '收藏,图片'},
        {id: 0, shaixuan_params: '收藏,视频'},
    ];
    /**打开筛选**/
    private showFilter: boolean;
    private cur_models;
    private tabIdx: number = 0;
    private currIdx: number = 0;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UNLOCK_SHOUCANG, this.onRefresh, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_VIDEO3, this.onHide, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIDEO3, this.onShowView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GUIDE_COMPLETE, this.onCompleteGuide, this);
        this.filter_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.goToShopButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGoToShopButton, this);
        // this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
    }

    protected onRemove(): void {

        GameDispatcher.getInstance().removeEventListener(GameEvent.UNLOCK_SHOUCANG, this.onRefresh, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.PLAY_VIDEO3, this.onHide, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.CLOSE_VIDEO3, this.onShowView, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GUIDE_COMPLETE, this.onCompleteGuide, this);
        this.filter_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }

    //供子类覆盖
    protected onInit(): void {
        this.showGoods();
    }

    protected onSkinName(): void {
        this.skinName = skins.ShouCangViewSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (!UserInfo.guideDic[7])//关闭引导图片
        {
            GuideManager.getInstance().onCloseImg();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_GUIDE_SHOUCANG), 'video');
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangViewPanel');
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        const layout = this.goodsLayer.layout as eui.TileLayout;
        layout.horizontalGap = Tool.calcGap(size.width - layout.paddingLeft - layout.paddingRight, 318, 10);
    }

    private onShowView(): void {
        this.visible = true;
    }

    private onHide(): void {
        this.visible = false;
    }

    private onCompleteGuide() {

    }

    /**返回数据数组**/
    private getShopDatas() {
        if (this.currIdx == null) return;
        let cur_models = [];
        for (let idx in this.allCfgs) {
            let shopdata = this.allCfgs[idx];
            cur_models.push(shopdata);
        }
        return cur_models;
    }

    private onFilter() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let cur_models = this.getShopDatas();
        if (!cur_models) return;
        this.showFilter = !this.showFilter;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("ShaixuanBar", new ShaixuanDataParam(cur_models, this.filterCallBack, this)));
    }

    private filterCallBack(datas): void {
        this.showFilter = false;
        if (this.currIdx == null) return;
        if (!datas) {
            return;
        }
        this.cur_models = datas;
        this.tabIdx = datas[0].id;
        this.showGoods();
    }

    private onRefresh() {
        this.showGoods();
    }

    private showGoods() {
        this.goodsLayer.removeChildren();
        var cfgs = ChengJiuManager.getInstance().shoucangCfgs;
        //这里需要排序。所以需要把对象转成array再排序
        let keySorted = Object.keys(cfgs).sort((a, b) => {
            let powerA = 0;
            if (Number(a) <= 5000) {
                powerA = 10000 / Number(a);
            }
            let powerB = 0;
            if (Number(b) <= 5000) {
                powerB = 10000 / Number(b);
            }
            return powerA - powerB;
        });
        var curIdx: number = 0;
        let hasItem = false;
        for (var nk in keySorted) {
            let k = keySorted[nk];
            if (ShopManager.getInstance().onCheckShoucangOpen(cfgs[k].id)) {
                if (cfgs[k].mulu1 == GameDefine.CUR_ROLEIDX) {
                    if (cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG || cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_VIDEO) {
                        curIdx = curIdx + 1;
                        var cg: ShouCangViewItem = new ShouCangViewItem();
                        this.goodsLayer.addChild(cg);
                        cg.data = {data: cfgs[k], idx: curIdx};
                        hasItem = true;
                    }
                }
            }
        }
        this.scroll.viewport.scrollV = 0;
        if (hasItem) {
            this.noneGroup.visible = false;
            this.centerGroup.visible = true;
        } else {
            this.noneGroup.visible = true;
            this.centerGroup.visible = false;
        }
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        // this.jinruLab1.visible = false;
        // this.jinruLab2.visible = false;
        this.suipNum.text = UserInfo.suipianMoney + '';
        // this.jinruLab3.visible = false;
        if (!UserInfo.guideDic[7])//关闭引导图片
        {
            this.bgBtn.touchEnabled = false;
            GuideManager.getInstance().onShowImg(this.itemGroup, this.itemGroup, 'tupianItem');
        }
        this.onInit();
        this.onRegist();
        this.updateResize();

        let w = this.centerGroup.width;
        let h = 50;
        let lightMatrix = new egret.Matrix();
        lightMatrix.createGradientBox(w, h, 3.14 * 3 / 2);
        this.bgBtn.label = GameDefine.SHOUCANG_NAME[GameDefine.CUR_ROLEIDX - 1];
    }

    private onClickGoToShopButton() {
        this.onClose();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShopPanel');
    }
}

class ShouCangViewItem extends eui.Component {
    public title: eui.Label;
    public pro: eui.Button;
    private weijiesuo: eui.Group;
    private info;
    private icon: eui.Image;
    private tubiao: eui.Image;
    private pinji: eui.Image;
    private desc: eui.Label;
    private newPoint: eui.Image;

    public constructor() {
        super();
        this.skinName = skins.ShouCangViewItemSkin;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayVideo, this);
    }

    public set data(info) {
        this.info = info.data;
        this.title.text = info.data.name;
        this.newPoint.visible = UserInfo.lookAchievement[this.info.id] != 1;
        if (this.info.mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG) {
            this.currentState = 'img';
            this.tubiao.source = 'sc_tupian_icon_png';
            this.pinji.source = `shop_image_${this.info.level}_png`;
            this.weijiesuo.visible = false;
            this.icon.source = info.data.id + "_view_l_png";
            this.desc.text = GameDefine.ROLE_NAME[this.info.mulu1 - 1] + '的图片';
        } else if (this.info.mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_VIDEO) {
            this.tubiao.source = 'sc_shipin_icon_png';
            this.icon.source = `${info.data.id}_view_l_png`;
            this.pinji.source = '';
            this.desc.text = GameDefine.ROLE_NAME[this.info.mulu1 - 1] + '的视频';
            this.weijiesuo.visible = false;
        }
    }

    private onPlayVideo() {
        if (UserInfo.lookAchievement[this.info.id] != 1) {
            UserInfo.lookAchievement[this.info.id] = 1;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_NEWPOINT));
        }
        this.newPoint.visible = false;
        SoundManager.getInstance().playSound("ope_click.mp3");
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        if (this.info.mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG) {
            if (!UserInfo.guideDic[7])//关闭引导图片
            {
                GuideManager.getInstance().onCloseImg();
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("ShouCangImgPanel", this.info));
        } else {
            if (widPlayer) {
                GameDefine.CUR_PLAYER_VIDEO = 2;
                widPlayer.play(videoModels[this.info.src].vid)
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_VIDEO3));
            GameCommon.getInstance().showLoading();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ControlTipsPanel')
        }
    }
}
