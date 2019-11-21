class MusicShopPreviewPanel extends eui.Component {
    public banner_img: eui.Image;
    public timeImg: eui.Image;
    public name_lab: eui.Label;
    public count_lab: eui.Label;
    public desc_lab: eui.Label;
    public scrollBar: eui.Scroller;
    public music_item_grp: eui.Group;
    public discount_bar: eui.Component;
    public buy_btn: eui.Button;
    public closeBtn: eui.Button;
    public state_lab: eui.Label;

    public musicPlayFun: Function;
    public musicPauseFun: Function;
    public musicEndedFun: Function;
    public musicLoadFun: Function;
    public musicErrorFun: Function;

    private probarMask: egret.Shape;
    private lastData: Mp3Item;
    private data: ShopInfoData;
    private shoucangModel: Modelshoucang;
    private isPlay: boolean = false;
    private playStage: boolean = false;

    public constructor(data) {
        super();
        this.data = data;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete(): void {
        this.probarMask = new egret.Shape();
        this.probarMask.x = this.timeImg.width / 2;
        this.probarMask.y = this.timeImg.height / 2;
        this.drawArc(this.probarMask, this.timeImg.width, this.timeImg.width, this.timeImg.height);
        this.timeImg.parent.addChild(this.probarMask);
        this.timeImg.mask = this.probarMask;
        this.updateResize();
        this.onRegistEvent();
        this.onCreateMp3();
        this.onUpdateInfo();
    }

    private onCreateMp3() {
        var mp = window['audioMp3'];
        var obj = this;
        mp.addEventListener("error",
            obj.musicErrorFun = function (tim) { //监听暂停
                console.log('报错了');
            }, false);
        mp.addEventListener("loadeddata", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicLoadFun = function (tim) {
                GameCommon.getInstance().removeLoading();
                // obj['timeBar4'].maximum = 100;
                window['audioMp3'].play();
            }, false);
        mp.addEventListener("ended", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicEndedFun = function (tim) {
                obj.playStage = false;
                obj.isPlay = false;
            }, false);
        mp.addEventListener("pause", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicPauseFun = function (tim) {
                obj.playStage = false;
                obj.isPlay = false;
                obj.stopDragMove();
            }, false);
        mp.addEventListener("play",
            obj.musicPlayFun = function (tim) {
                GameCommon.getInstance().removeLoading();
                obj.playStage = true;
                obj.isPlay = true;
                obj.dragMove();
                // Tool.addTimer(obj.dragMove, obj, 500);
            }, false);
    }

    private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
        var r = wd / 2 - 50;
        shape.graphics.clear();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(0, -r);//画线到弧的起始点
        shape.graphics.drawArc(0, 0, r, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
        shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
        shape.graphics.endFill();
    }

    private onUpdateInfo(): void {
        let shoucangID: number = parseInt(this.data.model.params);
        this.shoucangModel = JsonModelManager.instance.getModelshoucang()[shoucangID];
        //let srcAry: string[] = this.data.model.preview.split(";");
        let musicNameAry: string[] = this.shoucangModel.kuozhan.split(";");
        //this.banner_img.source = `yuan_png`;
        this.banner_img.source = `${this.shoucangModel.id}_view_yuan_png`;
        this.name_lab.text = this.data.model.name;
        this.desc_lab.text = this.data.model.desc;
        //this.count_lab.text = srcAry.length + "首";
        this.count_lab.text = musicNameAry.length + "首";
        
        let num = ShopManager.getInstance().getItemNum(this.data.id);
        if (num > 0) {
            this.state_lab.text = "——  已购买该商品，可在收藏查看完整内容 —— ";
            this.discount_bar.visible = false;
            this.buy_btn.enabled = false;
            this.buy_btn.label = "已购买";
        } else {
            this.state_lab.text = "——  支持每首歌试听15S —— ";
            let currencyIcon: string = GameDefine.Currency_Icon[GOODS_TYPE.DIAMOND];
            if (this.data.origPrice > this.data.currPrice) {
                this.discount_bar.visible = true;
                this.discount_bar['icon_img'].source = currencyIcon;
                this.discount_bar['price_lab'].text = this.data.origPrice.toFixed(2);
                this.discount_bar['discout_lab'].text = ((this.data.currPrice / this.data.origPrice * 10).toFixed(1)) + "折";
            } else {
                this.discount_bar.visible = false;
            }
            this.buy_btn.enabled = true;
            this.buy_btn.label = "购买";
            // this.buy_btn.icon = currencyIcon;
            // this.buy_btn.label = this.data.currPrice.toFixed(2);
        }
        this.music_item_grp.removeChildren();
        for (var i: number = 0; i < musicNameAry.length; i++) {
            let music_name: string = musicNameAry[i];
            //let music_src: string = srcAry[i];
            let item: Mp3Item = new Mp3Item();
            item.name = i + '';
            item.data = {data: this.shoucangModel, idx: i, src:`resource/assets/shopmusic/${this.shoucangModel.id}_${i+1}_try.mp3`, name: music_name};//src: music_src,
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectMusic, this);
            this.music_item_grp.addChild(item);
        }
    }

    private onRegistEvent(): void {
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_MP3, this.onPlayMp3, this);
    }

    private onRemoveEvent(): void {
        this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onUpdateInfo, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.PLAY_MP3, this.onPlayMp3, this);
        for (var i: number = 0; i < this.music_item_grp.numChildren; i++) {
            let item: Mp3Item = this.music_item_grp.getChildAt(0) as Mp3Item;
            item.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectMusic, this);
        }
        this.music_item_grp.removeChildren();
        var mp = window['audioMp3'];
        mp.removeEventListener("error", this.musicErrorFun, false);
        mp.removeEventListener("loadeddata", this.musicLoadFun, false);
        mp.removeEventListener("ended", this.musicEndedFun, false);
        mp.removeEventListener("pause", this.musicPauseFun, false);
        mp.removeEventListener("play", this.musicPlayFun, false);
        if (this.isPlay) {
            mp['pause']();
        }
    }

    private onSelectMusic(event: egret.Event) {
        var name: number = Number(event.currentTarget.name);
        let st = event.currentTarget.state;
        if (this.lastData) {
            if (this.lastData.name == event.currentTarget.name) {
                if (st == 2) {
                    this.lastData.state = 3;
                    this.onPlay_Pause();
                } else {
                    this.lastData.state = 2;
                    this.onPlay_Pause();
                }
            } else {
                this.lastData.state = 1;
                this.lastData = event.currentTarget;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_MP3), this.lastData.getSrc());
                this.lastData.state = 2;
            }
        } else {
            this.lastData = event.currentTarget;
            this.lastData.state = 2;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_MP3), this.lastData.getSrc())
        }
    }

    private onPlay_Pause() {
        if (window['audioMp3'].src && window['audioMp3'].currentTime) {
            if (this.playStage) {
                if (this.isPlay) {
                    window['audioMp3'].pause();
                }
            } else {
                window['audioMp3'].play();
            }
            this.playStage = !this.playStage;
        }
    }

    private onPlayMp3(data) {
        var mp = window['audioMp3'];
        var md = JsonModelManager.instance.getModelgeci()['mp3_music1'];
        mp.name = data.data;
        GameCommon.getInstance().showLoading();
        //mp.src = `resource/sound/${data.data}.mp3`;
        mp.src = data.data;
        mp.load();
        mp.play();
    }

    private dragMove(): void {
        var obj = this;
        var index: number = 0;

        setInterval(function () {
            obj.drawArc(obj.probarMask, window['audioMp3'].currentTime, window['audioMp3'].duration, 600);
            // 	if (obj._geci[obj.geciIdx]) {

            // 		if (obj._geci[obj.geciIdx].name >= window['audioMp3'].currentTime && obj._geci[obj.geciIdx].name <= window['audioMp3'].currentTime + 1) {
            // 			if (obj._geci[obj.geciIdx - 1]) {
            // 				obj._geci[obj.geciIdx - 1].style.textColor = 0x545454;
            // 			}
            // 			if (obj.geciIdx >= 2) {
            // 				// let num = 0;
            // 				// num = Math.floor(idx/3);
            // 				obj.labScroll.viewport.scrollV = obj.geciIdx + 1;
            // 			}
            // 			obj._geci[obj.geciIdx].style.textColor = 0XF2658C;
            // 			obj.lyricsLab.textFlow = obj._geci;
            // 			obj.geciIdx = obj.geciIdx + 1;
            // 		}
            // 	}
            // 	// obj['timeBar4'].value = window['audioMp3'].currentTime / window['audioMp3'].duration * 100;
        }, 500);
        // this.drawArc(this.probarMask, window['audioMp3'].currentTime, window['audioMp3'].duration, 600);
    }

    private stopDragMove(): void {
        clearInterval(500);
        // Tool.removeTimer(this.dragMove, this, 500);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onAddToStage(): void {
        this.skinName = skins.MusicShopPreviewSkin;
    }

    private onBuy(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("BuyTipsPanel", new BuyTipsParam(this.data, "")));
    }

    private onClose() {
        this.onRemoveEvent();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'MusicShopPreviewPanel');
    }
}
