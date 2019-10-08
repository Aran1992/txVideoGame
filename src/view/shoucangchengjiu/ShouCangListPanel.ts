// TypeScript file
class ShouCangListPanel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private shouCangList: eui.Group;
    private scroll: eui.Scroller;
    private onReturnBtn: eui.Button;
    private shoucangScrol: eui.Scroller;
    private shouCangDatas: ShouCangListItem[];
    private shoucangGroup: eui.Group;
    private jinruLab: eui.Group;
    private fanhuiLab: eui.Group;
    private musicLab: eui.Group;
    private currIdx: number = 1;
    private subIdx: number = 1;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        for (var i: number = 1; i < 7; i++) {
            this['scBtn' + i].name = i;
            // this['scBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowSC, this);
        }
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_VIDEO3, this.onHide, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_GUIDE_SHOUCANG, this.onCloseShouCang, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIDEO3, this.onShowView, this)
    }

    protected onRemove(): void {
        for (var i: number = 1; i < 7; i++) {
            this['scBtn' + i].name = i;
            // this['scBtn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowSC, this);
        }
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);

        GameDispatcher.getInstance().removeEventListener(GameEvent.PLAY_VIDEO3, this.onHide, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.CLOSE_GUIDE_SHOUCANG, this.onCloseShouCang, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.CLOSE_VIDEO3, this.onShowView, this)
    }

    //供子类覆盖
    protected onInit(): void {
        if (!this.shouCangDatas) {
            this.shouCangDatas = [];
            for (var i: number = 1; i < 7; i++) {
                this.shouCangDatas.push(this['scBtn' + i]);
                this.shouCangDatas[i - 1].data = i;
            }
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.ShouCangListSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onCloseShouCang(data) {
        if (!UserInfo.guideDic[7] && data.data == 'video')//关闭界面去进行商城引导
        {
            this.jinruLab.visible = false;
            this.musicLab.visible = true;
            this.shoucangScrol.viewport.scrollH = 300;
            GuideManager.getInstance().onShowImg(this.shoucangGroup, this.shoucangGroup, 'musicShow');
        } else if (!UserInfo.guideDic[7]) {
            this.musicLab.visible = false;
            this.jinruLab.visible = false;
            this.fanhuiLab.visible = true;
            this.shoucangGroup.touchEnabled = false;
            this.shoucangGroup.touchChildren = false;
            GuideManager.getInstance().onShowImg(this.mainGroup, this.bgBtn, 'leftClose');
        }
    }

    private onHide() {
        this.visible = false;
    }

    private onShowView() {
        this.visible = true;
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (!UserInfo.guideDic[7])//关闭界面去进行商城引导
        {
            UserInfo.guideDic[7] = 7;
            // GameCommon.getInstance().setBookData(FILE_TYPE.GUIDE_TP)
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            GuideManager.getInstance().onCloseImg();

        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangListPanel')
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
    }

    private onShowSC(event: egret.Event) {
        var index: number = Number(event.target.name);
        if (this.currIdx == index)
            return;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.onInit();
        this.onRegist();
        this.updateResize();
        this.musicLab.visible = false;
        this.jinruLab.visible = false;
        this.fanhuiLab.visible = false;
        UserInfo.guideDic[7] = 7;
        if (!UserInfo.guideDic[7])//关闭界面去进行商城引导
        {
            this.jinruLab.visible = true;
            GuideManager.getInstance().onShowImg(this.shoucangGroup, this.shoucangGroup, 'shoucang');
        }

    }
}

class ShouCangListItem extends eui.Component {
    public id: eui.Label;
    public img: eui.Image;
    public seeBtn: eui.Button;
    private info;
    private icon: eui.Image;
    private roleTp: eui.Label;
    private roleName: eui.Label;
    private music: eui.Group;

    public constructor() {
        super();
        this.skinName = skins.ShouCangItemSkin;
        this.touchEnabled = false;
    }

    public set data(info) {
        // this.img.source = '';
        // if(info>=6)
        // {
        //     this.icon.source = 'shoucang_head'+5+'_png';
        // }
        // else
        // {
        // }


        // if(info>4)
        // this.icon.source = 'sc_list_role' + 1 + '_png';
        // else
        this.icon.source = 'sc_list_role' + info + '_png';
        this.roleTp.text = GameDefine.ROLE_OCCUPATION[info - 1];
        this.roleName.text = GameDefine.SHOUCANG_NAME[info - 1];
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlayVideo, this);
        this.info = info;
        this.music.visible = false;
        if (info == 5) {
            this.music.visible = true;
            this.roleTp.text = '';
        }
    }

    private onTouchImg() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_IMG_TOUCH))
    }

    private onPlayVideo() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (!UserInfo.guideDic[7])//关闭界面去进行商城引导
        {
            if (this.info != 3 && this.info != 5)
                return;
            GuideManager.getInstance().onCloseImg();
        }
        if (this.info == 5) {
            GameDefine.CUR_ROLEIDX = this.info;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShouCangMusicPanel')
        } else {
            GameDefine.CUR_ROLEIDX = this.info;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShouCangViewPanel')
        }
    }
}

class SCImageData {
    public posX: number;//X位置
    public posY: number;//Y位置
    public scale: number;//缩放
    public width: number;
    public height: number;
    public childNum: number;//层级
    public constructor(x: number, y: number, scale: number, width: number, height: number, childNum: number = -1) {
        this.posX = x;
        this.posY = y;
        this.scale = scale;
        this.childNum = childNum;
        this.width = width;
        this.height = height
    }
}
