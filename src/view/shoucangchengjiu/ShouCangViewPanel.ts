// TypeScript file
class ShouCangViewPanel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private goodsLayer: eui.Group;
    private scroll: eui.Scroller;
    private btnNextImg: eui.Button;
    private btnLastImg: eui.Button;
    private btnCloseImgGroup: eui.Button;
    private imgGroup: eui.Group;
    // private shoucangGroup:eui.Group;
    private itemGroup: eui.Group;
    private centerGroup: eui.Group;
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

        if (!UserInfo.guideDic[7])//关闭引导图片
        {
            GuideManager.getInstance().onCloseImg();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_GUIDE_SHOUCANG), 'video')
        }
        // if (widPlayer1)
        //     widPlayer1 = null;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangViewPanel')
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
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
        let cur_models;
        if (this.currIdx == null) return cur_models;
        cur_models = [];
        for (let idx in this.allCfgs) {
            let shopdata = this.allCfgs[idx];
            cur_models.push(shopdata);
        }
        return cur_models;
    }

    private onFilter(): void {
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
        this.tabIdx = datas[0].id;
        this.showGoods();
    }

    private onRefresh() {
        this.goodsLayer.removeChildren();
        var cfgs = ChengJiuManager.getInstance().shoucangCfgs;
        var curIdx: number = 0;
        for (var k in cfgs) {
            if (ShopManager.getInstance().onCheckShoucangOpen(cfgs[k].id)) {
                if (cfgs[k].mulu1 == GameDefine.CUR_ROLEIDX) {
                    if (cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG || cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_VIDEO) {
                        // if (UserInfo.allCollectionDatas[cfgs[k].id]) {
                        curIdx = curIdx + 1;
                        var cg: ShouCangViewItem = new ShouCangViewItem();
                        this.goodsLayer.addChild(cg);
                        cg.data = {data: cfgs[k], idx: curIdx};
                        // }
                    }
                }
            }
        }
        this.scroll.viewport.scrollV = 0;
    }

    private showGoods() {
        this.goodsLayer.removeChildren();
        var cfgs = ChengJiuManager.getInstance().shoucangCfgs;
        var curIdx: number = 0;
        for (var k in cfgs) {
            // if (this.tabIdx > 0) {
            if (ShopManager.getInstance().onCheckShoucangOpen(cfgs[k].id)) {
                if (cfgs[k].mulu1 == GameDefine.CUR_ROLEIDX) {
                    if (cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG || cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_VIDEO) {
                        curIdx = curIdx + 1;
                        var cg: ShouCangViewItem = new ShouCangViewItem();
                        this.goodsLayer.addChild(cg);
                        cg.data = {data: cfgs[k], idx: curIdx};
                    }
                    // if (UserInfo.allCollectionDatas[cfgs[k].id]) {
                    // }
                }
            }

            // }
            // else {
            //     // if (UserInfo.allCollectionDatas[cfgs[k].id]) {
            //     curIdx = curIdx + 1;
            //     var cg: ShouCangViewItem = new ShouCangViewItem();
            //     this.goodsLayer.addChild(cg);
            //     cg.data = { data: cfgs[k], idx: curIdx };
            //     // }

            // }

        }
        this.scroll.viewport.scrollV = 0;
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
        // var player = new window['Txiplayer']({
        //     container: '#videoDivMin',
        //     vid: 'a0031tzescw',
        //     width: "100%",
        //     showUI: false //默认false，控制是否展示默认的播放器UI
        // })
        // player.on('ready', () => {
        //     widPlayer1 = player;
        //     var ps = document.getElementsByTagName('video');
        //     for (var i: number = 0; i < ps.length; i++) {
        //         if (size.fillType == FILL_TYPE_COVER) {
        //             ps[i].style["object-fit"] = "cover";
        //         } else {
        //             ps[i].style["object-fit"] = "contain";
        //         }
        //     }
        // })
        this.onInit();
        this.onRegist();
        this.updateResize();

    }
}

// declare var widPlayer1;

class ShouCangViewItem extends eui.Component {
    public title: eui.Label;
    public pro: eui.Button;
    private weijiesuo: eui.Group;
    // private num: eui.Label;
    private info;
    // private needNum: number;
    // private needId: number;
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
        this.newPoint.visible = true;
        if (UserInfo.lookAchievement[this.info.id]) {
            this.newPoint.visible = false;
        }
        if (this.info.mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG) {
            this.currentState = 'img';
            this.tubiao.source = 'sc_tupian_icon_png';
            this.pinji.source = `shop_image_${this.info.level}_png`;
            // if (UserInfo.allCollectionDatas[this.info.id]) {
            this.weijiesuo.visible = false;
            // this.xiadi.visible = true;
            this.icon.source = info.data.minipic;
            // }
            this.desc.text = GameDefine.ROLE_NAME[this.info.mulu1 - 1] + '的图片'
            // else {
            //     let canshuArr: string[];
            //     canshuArr = this.info.tp.split(",");
            //     // this.num.text = canshuArr[1];
            //     // this.needNum = Number(canshuArr[1]);
            //     // this.needId = Number(canshuArr[0]);
            //     // this.xiadi.visible = false;
            //     this.weijiesuo.visible = true;
            //     this.icon.source = 'sc_img_role1_png';
            // }
        } else if (this.info.mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_VIDEO) {
            this.tubiao.source = 'sc_shipin_icon_png';
            this.icon.source = info.data.minipic;
            this.pinji.source = '';
            this.desc.text = GameDefine.ROLE_NAME[this.info.mulu1 - 1] + '的视频';
            // if (UserInfo.allCollectionDatas[this.info.id]) {
            this.weijiesuo.visible = false;
            // this.xiadi.visible = true;
            // }
            // else {
            //     let canshuArr: string[];
            //     canshuArr = this.info.tp.split(",");
            //     // this.num.text = canshuArr[1];
            //     // this.needNum = Number(canshuArr[1]);
            //     // this.needId = Number(canshuArr[0]);
            //     // this.xiadi.visible = false;
            //     this.weijiesuo.visible = true;
            // }
        }
    }

    private onPlayVideo() {


        // if (!UserInfo.allCollectionDatas[this.info.id]) {
        //     return;
        // var item = ShopManager.getInstance().getItem(this.needId);
        // if (item && item.num > this.needNum) {
        //     item.num = item.num - this.needNum;
        //     ShopManager.getInstance().setItem(item);
        //     GameCommon.getInstance().onunlockshoucang(this.info.id);
        // }
        // else if (this.info.mulu2 == 0) {
        //     var video = window['video3'];
        //     video.src = LoadManager.getVideoUrl(this.info.src);
        //     video.load();
        //     video.play();
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_VIDEO3))
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ControlTipsPanel')
        // }
        // else if (this.info.mulu2 == 1) {
        //     if (!UserInfo.guideDic[7])//关闭引导图片
        //     {
        //         GuideManager.getInstance().onCloseImg();
        //     }
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShouCangImgPanel')
        // }
        // }
        UserInfo.lookAchievement[this.info.id] = this.info.id;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        if (this.info.mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_IMG) {
            if (!UserInfo.guideDic[7])//关闭引导图片
            {
                GuideManager.getInstance().onCloseImg();
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("ShouCangImgPanel", this.info));
            // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShouCangImgPanel')
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
