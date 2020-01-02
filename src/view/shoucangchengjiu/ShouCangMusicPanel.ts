// TypeScript file
class ShouCangMusicPanel extends eui.Component {
    private bgBtn: eui.Group;
    private goodsLayer: eui.Group;
    private scroll: eui.Scroller;
    private centerGroup: eui.Group;
    private noneGroup: eui.Group;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);

        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }

    protected onRemove(): void {
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        // GameDispatcher.getInstance().removeEventListener(GameEvent.PLAY_MP3, this.onPlayMp3, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }

    //供子类覆盖
    protected onInit(): void {
        this.showGoods();
    }

    protected onSkinName(): void {
        this.skinName = skins.ShouCangMusicSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onClose() {
        this.onRemove();

        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangMusicPanel')
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private showGoods() {
        this.goodsLayer.removeChildren();
        var cfgs = ChengJiuManager.getInstance().shoucangCfgs;
        let hasItem = false;
        for (var k in cfgs) {
                if (cfgs[k].mulu2 == SHOUCANG_SUB_TYPE.SHOUCANG_MUSIC) {
                    var cg: ShouCangMusicItem = new ShouCangMusicItem();
                    this.goodsLayer.addChild(cg);
                    cg.data = cfgs[k];
                    hasItem = true;
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
        this.onInit();
        this.onRegist();
        this.updateResize();
    }
}

class ShouCangMusicItem extends eui.Component {
    public title: eui.Label;
    // private weijiesuo: eui.Group;
    private num: eui.Label;
    private info;
    private icon: eui.Image;
    private musicNum: eui.Label;
    private musicName: eui.Label;
    private idNewPoint:eui.Image;

    public constructor() {
        super();
        this.skinName = skins.ShouCangMusicItemSkin;
        this.touchEnabled = false;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayVideo, this);
    }

    public set data(info) {
        this.info = info;
        this.idNewPoint.visible = UserInfo.lookAchievement[this.info.id] != 1;
        this.musicName.text = info.name;
        this.icon.source = `${info.id}_view_fang_png`
        let count = info.kuozhan.split(";").length
        this.musicNum.text = count + '首';
        // if (UserInfo.allCollectionDatas[info.id]) {
        //     this.weijiesuo.visible = false;
        // }
        // else {
        //     this.weijiesuo.visible = true;
        // }
    }

    private onPlayVideo() {
        if(UserInfo.lookAchievement[this.info.id]!=1){
            UserInfo.lookAchievement[this.info.id] = 1;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_NEWPOINT));
        }
        this.idNewPoint.visible=false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            windowName: 'Mp3Panel',
            data: this.info
        })
    }
}
