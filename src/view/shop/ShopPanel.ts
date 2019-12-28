/**
 *
 * 商店界面
 * @author    lzn
 *
 *
 */
class ShopPanel extends eui.Component {
    private mainGroup: eui.Group;
    private btnClose: eui.Button;
    private filter_btn: eui.Button;
    private spGroup: eui.Group;
    private suipNum: eui.BitmapLabel;
    private zuanshi_curreny_grp: eui.Group;
    private zuanshiNum: eui.BitmapLabel;
    private tabGroup: eui.Group;
    private shopGroup: eui.Group;
    private image_shop_scroll: eui.Scroller;
    private imgs_list: eui.List;
    private video_shop_scroll: eui.Scroller;
    private videos_list: eui.List;
    private musics_shop_scroll: eui.Scroller;
    private musics_list: eui.List;
    private chapter_shop_scroll: eui.Scroller;
    private chapter_list: eui.List;
    private daoju_shop_grp: eui.Group;
    private daoju_shop_scroll: eui.Scroller;
    private daoju_list: eui.List;
    private dianjicundang: eui.Group;
    private cloLab: eui.Group;
    private xinshoubao_btn: eui.RadioButton;
    private xinshoubao_grp: eui.Group;
    private xinshou_discountBar: eui.Component;
    private xinshoubao_buy_btn: eui.Button;
    private xinshoubao_list: eui.Group;

    private currIdx: number;
    private cur_models;

    private readonly TAB_2_SHOPTYPE: number[] = [SHOP_TYPE.IMAGES, SHOP_TYPE.VIDEOS, SHOP_TYPE.MUSICS, SHOP_TYPE.CHAPTER, SHOP_TYPE.DAOJU];
    private readonly TAB_GROUPs: string[] = ["image_shop_grp", "video_shop_grp", "music_shop_grp", "chapter_shop_grp", "daoju_shop_grp"];
    private xinshou_select: boolean;
    /**初始化新手包**/
    private xinshoubaoData: ShopInfoData;
    /**打开筛选**/
    private showFilter: boolean;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete() {
        // UserInfo.guideDic[6] = 6;
        // if (!UserInfo.guideDic[6])//关闭界面去进行商城引导
        // {
        //     this.dianjicundang.visible = true;
        //     this.tabGroup.touchEnabled = false;
        //     this.btnClose.touchEnabled = false;
        //     GuideManager.getInstance().onShowImg(this.shopGroup, this.shopGroup, 'shop');
        // }

        this.onRegistEvent();
        this.updateResize();
        this.updateTabIdx(0);
        this.updateCurrency();
    }

    private onRegistEvent(): void {
        for (var i: number = 0; i < this.tabGroup.numChildren; i++) {
            this['shopBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
        }
        this.xinshoubao_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchXinshoubao, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.xinshoubao_buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyXinshoubao, this);
        this.filter_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);
        this.spGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.spGroupClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onBuyRefresh, this);
    }

    private spGroupClick() {
        GameCommon.getInstance().showCommomTips("心动碎片：可在“福利社”内兑换美图、音乐等奖励");
    }

    private onRemoveEvent(): void {
        for (var i: number = 0; i < this.tabGroup.numChildren; i++) {
            this['shopBtn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
        }
        this.xinshoubao_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchXinshoubao, this);
        this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.filter_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFilter, this);
        this.xinshoubao_buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyXinshoubao, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onBuyRefresh, this);
        this.cur_models = null;
        this.showFilter = null;
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private updateCurrency(): void {
        this.suipNum.text = UserInfo.suipianMoney + '';
    }

    private onTouchXinshoubao(e: egret.Event): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (this.xinshou_select) return;
        this.xinshou_select = true;
        for (var i: number = 0; i < this.tabGroup.numChildren; i++) {
            (this['shopBtn' + i] as eui.RadioButton).selected = false;
        }
        this.shopGroup.removeChildren();
        this.xinshoubao_grp.visible = true;
        this.shopGroup.addChild(this.xinshoubao_grp);
        this.showGoods();
    }

    private onTouchItem(e: egret.Event) {
        SoundManager.getInstance().playSound("ope_click.mp3")
        let tabButton: eui.RadioButton = e.currentTarget as eui.RadioButton;

        this.updateTabIdx(tabButton.value);
    }

    private updateTabIdx(idx: number): void {
        this.xinshou_select = false;
        this.xinshoubao_btn.selected = false;
        if (this.currIdx == idx)
            return;

        this.cur_models = null;
        this.currIdx = idx;
        this.shopGroup.removeChildren();
        let tabGroup: eui.Group = this[this.TAB_GROUPs[this.currIdx]];
        tabGroup.visible = true;
        this.shopGroup.addChild(tabGroup);
        this.showGoods();
        if (this.showFilter) {
            this.onFilter();
        }
    }

    private onBuyRefresh() {
        this.showGoods();
        // if (!UserInfo.guideDic[6])//关闭界面去进行商城引导
        // {
        //     this.cloLab.visible = true;
        //     this.dianjicundang.visible = false;
        //     UserInfo.guideDic[6] = 6;
        //     this.shopGroup.touchEnabled = false;
        //     this.btnClose.touchEnabled = true;
        //     GuideManager.getInstance().onCloseImg();
        //     GuideManager.getInstance().onShowImg(this.mainGroup, this.btnClose, 'leftClose')
        // }
        this.updateCurrency();
    }

    private showGoods() {
        if (this.xinshou_select) {
            this.cur_models = null;
            this.currIdx = null;
            //this.updateXinshoubaoShop();
        } else {
            let shoptpye: SHOP_TYPE = this.TAB_2_SHOPTYPE[this.currIdx];
            switch (shoptpye) {
                case SHOP_TYPE.IMAGES:
                    this.updateImagesShop();
                    break;
                case SHOP_TYPE.VIDEOS:
                    this.updateVideoShop();
                    break;
                case SHOP_TYPE.MUSICS:
                    this.updateMusicShop();
                    break;
                case SHOP_TYPE.CHAPTER:
                    this.updateChapterShop();
                    break;
                case SHOP_TYPE.DAOJU:
                    this.updateDaojuShop();
                    break;
            }
        }
    }

    private updateXinshoubaoShop() {
        if (!this.xinshoubaoData) {
            for (let idx in ShopManager.getInstance().shopInfoDict) {
                let shopdata = ShopManager.getInstance().shopInfoDict[idx];
                if (GameDefine.SHOP_XINSHOU_ID == parseInt(shopdata.id)) {
                    this.xinshoubaoData = shopdata;
                    break;
                }
            }
            if (!this.xinshoubaoData)
                return;
            this.xinshoubao_buy_btn.enabled = true;
            // this.xinshoubao_buy_btn.label = xinshoubaoData.currPrice.toFixed(2);
            if (this.xinshoubaoData.origPrice > this.xinshoubaoData.currPrice) {
                this.xinshou_discountBar.visible = true;
                this.xinshou_discountBar['icon_img'].source = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
                this.xinshou_discountBar['price_lab'].text = this.xinshoubaoData.origPrice.toFixed(2);
                this.xinshou_discountBar['discout_lab'].text = ((this.xinshoubaoData.currPrice / this.xinshoubaoData.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.xinshou_discountBar.visible = false;
            }

            let params: string[] = this.xinshoubaoData.model.params.split(",");
            let banners: string[] = this.xinshoubaoData.model.preview.split(",");
            for (let i: number = 0; i < params.length; i++) {
                let shopid: number = parseInt(params[i]);
                let banner: string = banners[i];
                let shopData = ShopManager.getInstance().getShopInfoData(shopid);
                let xinshoubaoItem: XinshoubaoShopItem = new XinshoubaoShopItem();
                xinshoubaoItem.updateInfo(shopData, banner);
                this.xinshoubao_list.addChild(xinshoubaoItem);
            }
        }

        if (this.xinshoubaoData && this.xinshoubaoData.num > 0) {
            this.xinshoubao_buy_btn.enabled = false;
            this.xinshoubao_buy_btn.label = "已购买";
            this.xinshou_discountBar.visible = false;
        }
    }

    /**更新图集商城**/
    private updateImagesShop(): void {
        if (this.imgs_list.dataProvider) {
            for (let i: number = 0; i < this.imgs_list.numChildren; i++) {
                let item: ImagesShopItem = this.imgs_list.getChildAt(i) as ImagesShopItem;
                item.data = item.data;
            }
        } else {
            if (!this.cur_models) {
                this.cur_models = this.getShopDatas();

                this.image_shop_scroll.horizontalScrollBar.visible = false;
                this.image_shop_scroll.verticalScrollBar.visible = false;
                this.imgs_list.itemRenderer = ImagesShopItem;
                this.imgs_list.itemRendererSkinName = skins.ImagesShopItemSkin;
                this.imgs_list.useVirtualLayout = true;
                this.image_shop_scroll.viewport = this.imgs_list;
            }
            this.imgs_list.dataProvider = new eui.ArrayCollection(this.cur_models);
        }
    }

    private updateVideoShop(): void {
        if (this.videos_list.dataProvider) {
            // this.video_shop_scroll.viewport.scrollV = 0;
            for (let i: number = 0; i < this.videos_list.numChildren; i++) {
                let item: VideosShopItem = this.videos_list.getChildAt(i) as VideosShopItem;
                item.data = item.data;
            }
        } else {
            if (!this.cur_models) {
                this.cur_models = this.getShopDatas();

                this.video_shop_scroll.horizontalScrollBar.visible = false;
                this.video_shop_scroll.verticalScrollBar.visible = false;
                this.videos_list.itemRenderer = VideosShopItem;
                this.videos_list.itemRendererSkinName = skins.VideosShopItemSkin;
                this.videos_list.useVirtualLayout = true;
                this.video_shop_scroll.viewport = this.videos_list;
            }
            this.videos_list.dataProvider = new eui.ArrayCollection(this.cur_models);
        }
    }

    private updateMusicShop(): void {
        if (this.musics_list.dataProvider) {
            // this.musics_shop_scroll.viewport.scrollV = 0;
            for (let i: number = 0; i < this.musics_list.numChildren; i++) {
                let item: MusicsShopItem = this.musics_list.getChildAt(i) as MusicsShopItem;
                item.data = item.data;
            }
        } else {
            if (!this.cur_models) {
                this.cur_models = this.getShopDatas();

                this.musics_shop_scroll.horizontalScrollBar.visible = false;
                this.musics_shop_scroll.verticalScrollBar.visible = false;
                this.musics_list.itemRenderer = MusicsShopItem;
                this.musics_list.itemRendererSkinName = skins.MusicsShopItemSkin;
                this.musics_list.useVirtualLayout = true;
                this.musics_shop_scroll.viewport = this.musics_list;
            }
            this.musics_list.dataProvider = new eui.ArrayCollection(this.cur_models);
        }
    }

    private updateChapterShop(): void {
        if (this.chapter_list.dataProvider) {
            // this.chapter_shop_scroll.viewport.scrollV = 0;
            for (let i: number = 0; i < this.chapter_list.numChildren; i++) {
                let item: ChapterShopItem = this.chapter_list.getChildAt(i) as ChapterShopItem;
                item.data = item.data;
            }
        } else {

            if (!this.cur_models) {
                this.cur_models = this.getShopDatas();
                this.chapter_shop_scroll.horizontalScrollBar.visible = false;
                this.chapter_shop_scroll.verticalScrollBar.visible = false;
                this.chapter_list.itemRenderer = ChapterShopItem;
                this.chapter_list.itemRendererSkinName = skins.ChapterShopItemSkin;
                this.chapter_list.useVirtualLayout = true;
                this.chapter_shop_scroll.viewport = this.chapter_list;
            }
            this.chapter_list.dataProvider = new eui.ArrayCollection(this.cur_models);
        }
    }

    private updateDaojuShop(): void {
        if (this.daoju_list.dataProvider) {
            // this.daoju_shop_scroll.viewport.scrollV = 0;
            for (let i: number = 0; i < this.daoju_list.numChildren; i++) {
                let item: DaojuShopItem = this.daoju_list.getChildAt(i) as DaojuShopItem;
                item.data = item.data;
            }
        } else {
            if (!this.cur_models) {
                this.cur_models = this.getShopDatas();

                this.daoju_shop_scroll.horizontalScrollBar.visible = false;
                this.daoju_shop_scroll.verticalScrollBar.visible = false;
                this.daoju_list.itemRenderer = DaojuShopItem;
                this.daoju_list.itemRendererSkinName = skins.DaojuShopItemSkin;
                this.daoju_list.useVirtualLayout = true;
                this.daoju_shop_scroll.viewport = this.daoju_list;

            }
            this.daoju_list.dataProvider = new eui.ArrayCollection(this.cur_models);
        }
    }

    /**购买新手包**/
    private onBuyXinshoubao(event: egret.Event): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (this.xinshoubaoData) {
            GameCommon.getInstance().onShowBuyTips(this.xinshoubaoData.id, this.xinshoubaoData.model.currSuipian, GOODS_TYPE.SUIPIAN);
        }
    }

    /**返回数据数组**/
    private getShopDatas() {
        let cur_models;
        if (this.currIdx == null) return cur_models;
        cur_models = [];
        let shoptpye: SHOP_TYPE = this.TAB_2_SHOPTYPE[this.currIdx];
        for (let idx in ShopManager.getInstance().shopInfoDict) {
            let shopdata = ShopManager.getInstance().shopInfoDict[idx] as ShopInfoData;
            if (shopdata.model.show == 0) continue;
            let shop_tp: number = ShopManager.getInstance().getShopTP(shopdata.id);
            if (shop_tp == shoptpye) {
                cur_models.push(shopdata);
            }
        }
        cur_models.sort((a, b) => {
            //如果是图片，则使用param逆序排列，其它按ID正序排列
            let powerA = (shoptpye == SHOP_TYPE.IMAGES ? (10000 / Number(a.model.params)) : a.id) + ShopManager.getInstance().getItemNum(a.id) * 1000000;
            let powerB = (shoptpye == SHOP_TYPE.IMAGES ? (10000 / Number(b.model.params)) : b.id) + ShopManager.getInstance().getItemNum(b.id) * 1000000;
            return powerA - powerB;
        })
        return cur_models;
    }

    private onFilter(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        let cur_models = this.getShopDatas();
        if (!cur_models) return;
        this.showFilter = this.showFilter ? false : true;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("ShaixuanBar", new ShaixuanDataParam(cur_models, this.filterCallBack, this)));
    }

    private filterCallBack(datas): void {
        this.showFilter = false;
        if (this.currIdx == null) return;
        if (!datas) {
            return;
        }
        this.cur_models = datas;
        let shoptpye: SHOP_TYPE = this.TAB_2_SHOPTYPE[this.currIdx];
        switch (shoptpye) {
            case SHOP_TYPE.IMAGES:
                this.imgs_list.dataProvider = null;
                break;
            case SHOP_TYPE.VIDEOS:
                this.videos_list.dataProvider = null;
                break;
            case SHOP_TYPE.MUSICS:
                this.musics_list.dataProvider = null;
                break;
            case SHOP_TYPE.CHAPTER:
                this.chapter_list.dataProvider = null;
                break;
            case SHOP_TYPE.DAOJU:
                this.daoju_list.dataProvider = null;
                break;
        }
        this.showGoods();
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.onRemoveEvent();
        // if (!UserInfo.guideDic[7]) {//关闭界面去进行收藏引导
        //     GuideManager.getInstance().onCloseImg();
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
        // }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShopPanel')
    }

    //添加到舞台
    private onAddToStage(): void {
        this.skinName = skins.ShopPanelSkin;
    }
}

/**
 * 图集商城Item
 **/
class ImagesShopItem extends eui.ItemRenderer {
    public banner_img: eui.Image;
    public imgs_num_lab: eui.Label;
    public title_lab: eui.Label;
    public style_name_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;
    private pingfen_img: eui.Image;
    private buyParam: BuyTipsParam;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
    }

    protected dataChanged(): void {
        let shopInfoDt: ShopInfoData = this.data;
        let shoucangID: number = parseInt(shopInfoDt.model.params);
        let shoucangModel: Modelshoucang = JsonModelManager.instance.getModelshoucang()[shoucangID];
        if (!shoucangModel) {
            this.title_lab.text = '商品数据出错\n没有找到对应的收藏数据ID:::' + shoucangID;
            return;
        }
        this.banner_img.source = shoucangModel.id + "_view_png"
        //let srcAry: string[] = shoucangModel.src.split(";");
        this.imgs_num_lab.text = shoucangModel.src + "P";//srcAry.length + "P";
        this.title_lab.text = GameDefine.ROLE_NAME[shoucangModel.mulu1 - 1] + '图集';
        this.style_name_lab.text = shopInfoDt.model.name;
        this.pingfen_img.source = `shop_image_${shoucangModel.level}_png`;

        let num = ShopManager.getInstance().getItemNum(shopInfoDt.id);
        if (num > 0) {//shopInfoDt.num
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (shopInfoDt.origPrice > shopInfoDt.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = shopInfoDt.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((shopInfoDt.currPrice / shopInfoDt.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.discount_bar.visible = false;
            }
            this.buy_btn.enabled = true;
            if (this.data.model.currPrice == 0 && this.data.model.currSuipian == 0)
                this.buy_btn.label = "免费购买";
            else
                this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = shopInfoDt.currPrice.toFixed(2);
        }
    }

    private onLoadComplete(): void {
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.banner_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenPreview, this);
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, String(this.banner_img.source))));
    }

    private onOpenPreview(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam('ImageShopPreviewPanel', this.data));
    }
}

/**
 * 视频商城Item
 **/
class VideosShopItem extends eui.ItemRenderer {
    public banner_img: eui.Image;
    public name_lab: eui.Label;
    public time_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;
    public style_name_lab: eui.Label;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
    }

    protected dataChanged(): void {
        let shopInfoDt: ShopInfoData = this.data;
        let shoucangID: number = parseInt(shopInfoDt.model.params);
        let shoucangModel: Modelshoucang = JsonModelManager.instance.getModelshoucang()[shoucangID];
        if (!shoucangModel) {
            this.name_lab.text = '商品数据出错\n没有找到对应的收藏数据ID:::' + shoucangID;
            return;
        }
        this.banner_img.source = `${shoucangModel.id}_view_png`
        this.name_lab.text = `${GameDefine.ROLE_NAME[shoucangModel.mulu1 - 1]}视频`;
        this.time_lab.text = shoucangModel.time;
        this.style_name_lab.text = shopInfoDt.model.name;
        let num = ShopManager.getInstance().getItemNum(shopInfoDt.id);
        if (num > 0) {
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (shopInfoDt.origPrice > shopInfoDt.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = shopInfoDt.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((shopInfoDt.currPrice / shopInfoDt.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.discount_bar.visible = false;
            }
            this.buy_btn.enabled = true;
            this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = shopInfoDt.currPrice.toFixed(2);
        }
    }

    private onLoadComplete(): void {
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.banner_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, String(this.banner_img.source))));
    }

    private onPlay(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam('VideoShopPreviewPanel', this.data));
    }
}

/**
 * 音乐商城Item
 **/
class MusicsShopItem extends eui.ItemRenderer {
    public banner_img: eui.Image;
    public name_lab: eui.Label;
    public count_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;

    private discountBar_Grp: egret.DisplayObjectContainer;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
    }

    protected dataChanged(): void {
        let shopInfoDt: ShopInfoData = this.data;
        let shoucangID: number = parseInt(shopInfoDt.model.params);
        let shoucangModel: Modelshoucang = JsonModelManager.instance.getModelshoucang()[shoucangID];
        if (!shoucangModel) {
            this.name_lab.text = '商品数据出错\n没有找到对应的收藏数据ID:::' + shoucangID;
            return;
        }

        this.banner_img.source = `${shoucangModel.id}_view_fang_png`;
        //let param: string[] = shopInfoDt.model.preview.split(",");
        let count = shoucangModel.kuozhan.split(";").length;
        this.count_lab.text = count + "首";
        this.name_lab.text = shopInfoDt.model.name;
        let num = ShopManager.getInstance().getItemNum(shopInfoDt.id);
        if (num > 0) {
            if (this.discount_bar.parent) {
                this.discountBar_Grp.removeChild(this.discount_bar);
            }
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (shopInfoDt.origPrice > shopInfoDt.currPrice) {
                if (!this.discount_bar.parent) {
                    this.discountBar_Grp.addChild(this.discount_bar);
                }
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = shopInfoDt.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((shopInfoDt.currPrice / shopInfoDt.origPrice * 10).toFixed(1)) + "折";
            } else {
                if (this.discount_bar.parent) {
                    this.discountBar_Grp.removeChild(this.discount_bar);
                }
            }
            this.buy_btn.enabled = true;
            this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = shopInfoDt.currPrice.toFixed(2);
        }
    }

    private onLoadComplete(): void {
        this.discountBar_Grp = this.discount_bar.parent;
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.banner_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, String(this.banner_img.source))));
    }

    private onPlay(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam('MusicShopPreviewPanel', this.data));
    }
}

/**
 * 章节商城Item
 **/
class ChapterShopItem extends eui.ItemRenderer {
    public banner_img: eui.Image;
    public title_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
    }

    protected dataChanged(): void {
        let shopInfoDt: ShopInfoData = this.data;

        this.banner_img.source = shopInfoDt.model.preview;
        this.title_lab.text = shopInfoDt.model.name;
        let num = ShopManager.getInstance().getItemNum(shopInfoDt.id);
        if (num > 0) {
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (shopInfoDt.origPrice > shopInfoDt.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = shopInfoDt.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((shopInfoDt.currPrice / shopInfoDt.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.discount_bar.visible = false;
            }
            this.buy_btn.enabled = true;
            this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = shopInfoDt.currPrice.toFixed(2);
        }
    }

    private onLoadComplete(): void {
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, String(this.banner_img.source))));
    }
}

/**
 * 道具商城Item
 **/
class DaojuShopItem extends eui.ItemRenderer {
    public banner_img: eui.Image;
    public title_lab: eui.Label;
    public desc_lab: eui.Label;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;

    private discountBar_Grp: egret.DisplayObjectContainer;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
    }

    protected dataChanged(): void {
        let shopInfoDt: ShopInfoData = this.data;

        this.banner_img.source = shopInfoDt.model.preview;
        this.title_lab.text = this.data.name;
        this.desc_lab.text = this.data.desc;
        let num = ShopManager.getInstance().getItemNum(shopInfoDt.id);
        if (num > 0) {
            if (this.discount_bar.parent) {
                this.discountBar_Grp.removeChild(this.discount_bar);
            }
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (shopInfoDt.origPrice > shopInfoDt.currPrice) {
                if (!this.discount_bar.parent) {
                    this.discountBar_Grp.addChild(this.discount_bar);
                }
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = shopInfoDt.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((shopInfoDt.currPrice / shopInfoDt.origPrice * 10).toFixed(1)) + "折";
            } else {
                if (this.discount_bar.parent) {
                    this.discountBar_Grp.removeChild(this.discount_bar);
                }
            }
            this.buy_btn.enabled = true;
            this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = shopInfoDt.currPrice.toFixed(2);
        }
    }

    private onLoadComplete(): void {
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        this.discountBar_Grp = this.discount_bar.parent;
    }

    private onBuy(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, String(this.banner_img.source))));
    }
}

/**
 * 新手包Item
 **/
class XinshoubaoShopItem extends eui.Component {
    public banner_img: eui.Image;
    public type_icon: eui.Image;
    public title_lab: eui.Label;
    public style_name_lab: eui.Label;
    public pingfen_img: eui.Image;

    private isComplete: boolean;
    private _data;
    private _bannerImg;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.XinshoubaoItemSkin;
    }

    public updateInfo(data, bannerImg): void {
        this._data = data;
        this._bannerImg = bannerImg;
        if (!this.isComplete) return;
        this.banner_img.source = this._bannerImg;
        this.style_name_lab.text = data.model.name;
        let tpName: string = "";
        let shop_tp: number = ShopManager.getInstance().getShopTP(data.id);
        let shoucangID: number = parseInt(data.model.params);
        let shoucangModel: Modelshoucang = JsonModelManager.instance.getModelshoucang()[shoucangID];
        if (shoucangModel) {
            let shopicon: string = "";
            switch (shop_tp) {
                case SHOP_TYPE.IMAGES:
                    shopicon = "shop_image_icon_png";
                    tpName = `${GameDefine.ROLE_NAME[shoucangModel.mulu1 - 1]}的图片`;
                    break;
                case SHOP_TYPE.VIDEOS:
                    shopicon = "shop_video_icon_png";
                    tpName = `${GameDefine.ROLE_NAME[shoucangModel.mulu1 - 1]}的视频`;
                    break;
                case SHOP_TYPE.MUSICS:
                    shopicon = "shop_music_icon_png";
                    tpName = "音乐";
                    break;
            }
            this.type_icon.source = shopicon;
            this.pingfen_img.source = `shop_image_${shoucangModel.level}_png`;
        } else {
            this.type_icon.source = "";
            this.title_lab.text = "";
            this.pingfen_img.source = ``;
            switch (shop_tp) {
                case SHOP_TYPE.CHAPTER:
                    tpName = "章节";
                    break;
                case SHOP_TYPE.DAOJU:
                    tpName = "道具";
                    break;
            }
        }
        this.title_lab.text = tpName;
    }

    private onLoadComplete(): void {
        this.isComplete = true;
        if (this._data) {
            this.updateInfo(this._data, this._bannerImg);
        }
    }
}
