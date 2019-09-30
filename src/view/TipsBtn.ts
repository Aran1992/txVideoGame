// TypeScript file
class TipsBtn extends eui.Component {
    public static Is_Guide_Bool: boolean;//是否要显示引导
    private guide_img: eui.Image;
    private addBtn: eui.Button;
    private reduceBtn: eui.Button;
    private play_pauseBtn: eui.Button;
    private showBtns: eui.Group;
    private bottomBtn: eui.Group;
    private bgBtn: eui.Button;
    private desc: eui.Label;
    private cundang1: eui.Button;
    private timeBar2: eui.ProgressBar;
    private timeBar1: eui.ProgressBar;
    private timeBar3: eui.ProgressBar;
    private timeBar4: eui.ProgressBar;
    private controlGroup: eui.Group;
    private fenxiangBtn: eui.Button;
    private qualityBtn: eui.Button;
    private speedBtn: eui.Button;
    private zimu: eui.Label;
    private mengban: eui.Image;
    private pauseGroup: eui.Group;
    private videoD: VideoData;
    private goMain: eui.Button;
    private tiaoBtn: eui.Button;
    private timeGroup: eui.Group;
    private playBtn: eui.Button;

    /** 特殊选项条件 chufa触发选项条件(没有则一定触发) conditions错误的选项字典  errorNum选择数量 **/
    private Option_Condition = {
        "25": {conditions: {"20": 2, "22": 2, "24": 2}, errorNum: 2},
        "48": {conditions: {"40": 2, "46": 5, "47": 2}, errorNum: 3},
        "49": {chufa: {"41": 1, "47": 1}, conditions: {"28": 2, "30": 1, "31": 1, "32": 2}, errorNum: 1}
    };
    /** 好感度解锁选项 option主角顺序对应的选项id  likeNum保留好感度前几个人 **/
    private Option_Like = {
        "34": {option: [4, 1, 2, 3], likeNum: 2},
    };
    /**选项对应的道具**/
    private Option_Goods = {
        "25": [500005, 500006, 0],
        "48": [500011, 0],
        "49": [500012, 500013, 0],
        "34": [500007, 500008, 500009, 500010],
    };
    private spNames: string[] = ['', '1.5X', '1.25X', '1.0X'];
    private pinzhiNames: string[] = ['', '1080P', '720P', '480P'];
    private bmp: egret.Bitmap;
    private pinzhi: number = 1;
    private videoCurrentState: boolean = true;
    private timer: egret.Timer;
    private timerIdx: number = 0;
    private fileState: boolean = false;
    private starPosY: number = 0;
    private starPosX: number = 0;
    private isClick: boolean = true;
    private light: number = 1;
    private touchtime = new Date().getTime();
    private direction: number = 0;
    private isAddFlg: boolean = false;
    private beisuGroup: eui.Group;
    private pinzhiGroup: eui.Group;
    private speedDic: number[] = [0, 1.5, 1.25, 1];
    private sd: egret.Sound;
    private isSelect: boolean = false;
    private _isLock: boolean;
    private wentiId: number = 0;//问题计时
    private imgs: string[] = ['wentiA_png', 'wentiB_png', 'wentiC_png', 'wentiD_png'];
    private tp: number = 0;
    private modelHuDong: Modelhudong;
    private _maxValue = 0;
    private _maxTime = 0;
    private hideTipTimer: number;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public set imStatus(str) {
        if (str == 'pauseImg_png') {
            this.mengban.visible = false;
            this.pauseGroup.visible = false;
            // this.cundangGroup.visible = false;
        }
        this.play_pauseBtn['iconDisplay'].source = str;
    }

    public onCloseMengBan() {
        if (!this.mengban)
            return;
        this.mengban.visible = false;
        this.pauseGroup.visible = false;
        this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
    }

    public onSetCunDangState(bo) {

        this.fileState = bo;
        if (!this.fileState && !this.videoCurrentState) {
            this.timerIdx = 3;
            // this.controlGroup.alpha = 0;
            this.controlGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
            this.videoCurrentState = true;
        }
    }

    public onShowChengJiuComplete() {

    }

    public onShowAddTime() {
        this.timeGroup.visible = true;
        let obj = this;
        Tool.callbackTime(function () {
            obj.timeGroup.visible = false;
        }, obj, 1000);
    }

    public setState(num: number = 1) {
        if (num == 0) {
            this.reduceBtn.visible = true;
            this.addBtn.visible = true;
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.controlGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
        }
        return false;
    }

    public setPauseState() {
        if (this.timer) {
            this.timerIdx = 0;
            this.timer.stop();
            // this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            // this.timer = null;
        }
        this.play_pauseBtn.touchEnabled = true;
        this.controlGroup.visible = true;
        this.mengban.visible = true;
        this.pauseGroup.visible = true;
        this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), false);
    }

    public onUpdateWenTi(id): void {
        let button = this['btn' + id];
        if (!button['lock_grp'].visible) {
            this.onSelectWenTi(id);
        }
    }

    public init(vData: VideoData) {
        this.videoD = vData;
    }

    public onCreateBtn(model: Modelwenti) {
        this.timerIdx = 0;
        this.wentiId = model.id;
        this.hideControl();
        if (model.id == '19') {
            this.desc.text = model.des;
            this.desc.visible = true;
        } else {
            this.desc.visible = false;
        }
        this.tp = model.type;
        this.isSelect = false;
        if (model.type == ActionType.OPTION) {
            this.showBtns.visible = true;
            let awardStrAry: string[] = model.ans.split(",");
            let cfgs = answerModels[this.wentiId];
            let idx: number = 0;
            for (let i: number = 0; i < 5; i++) {
                if (awardStrAry.length > i) {
                    this['btn' + (i + 1)].visible = true;
                    this['btn' + (i + 1)].alpha = 1;
                    this['btn' + (i + 1)].name = awardStrAry[i];
                    this['btn' + (i + 1)].label = cfgs[i].des;
                    this['btn' + (i + 1)]['iconDisplay'].source = 'wentikuang_png';
                    this['btn' + (i + 1)]['labelDisplay'].textColor = '0xffffff';
                    idx = i + 1;
                }
            }
            this.currentState = 'index' + idx;
            /**判断下问题是否带锁**/
            this.onUpdateWentiBtnStatus();

            const tw = egret.Tween.get(this.bottomBtn);
            this.bottomBtn.alpha = 0;
            this.timeBar3.visible = true;
            this.bottomBtn.visible = true;
            this.zimu.bottom = 335;
            tw.to({alpha: 1}, 500);

            this.hideTipTimer = undefined;
        } else {
            this.modelHuDong = JsonModelManager.instance.getModelhudong()[model.type];
            this.showBtns.visible = false;
            this.gotoAction(model);
            // if (this.modelHuDong && this.modelHuDong.des)
            // GameCommon.getInstance().showActionTips(this.modelHuDong.des);
        }
    }

    public hideTips(): void {
        if (this.hideTipTimer) {
            return;
        }
        this._maxValue = 0;
        this._maxTime = 0;
        this.bottomBtn.alpha = 0;
        this.zimu.bottom = 100;
        this.bottomBtn.visible = false;
        if (this.videoD) {
            if (this.videoD.getIsClick(this.videoD) == 3 && this.timerIdx > 0 && this.timerIdx < 4) {
                this.timerIdx = 4;
                this.controlGroup.visible = false;
                if (this.timer) {
                    this.timerIdx = 0;
                    this.timer.stop();
                }
                this.videoCurrentState = true;
            }
        }
    }

    public setTips(tim, bo): void {
        let tw;
        if (this.tp != 0) {
            // if (bo) {
            //     this.onCallBack();
            //     return;
            // }
            // if (!this.modelHuDong || this.modelHuDong.tp != ActionType.SLIDE) {
            return;
            // }
        }
        if (tim > 0 || this._maxTime != 0) {
            if (tim < 0) {
                this._maxTime = 0;
                this._maxValue = 0;
                return;
            }
            if (this._maxValue == 0 && this._maxTime == 0) {
                if (!this.bottomBtn.visible && this.hideTipTimer === undefined) {
                    tw = egret.Tween.get(this.bottomBtn);
                    this.timeBar3.visible = true;
                    this.bottomBtn.alpha = 0;
                    this.bottomBtn.visible = true;
                    this.zimu.bottom = 335;
                    tw.to({alpha: 1}, 500);
                }
                this._maxValue = tim - 1;
                this._maxTime = tim;
                const max = Math.floor(this._maxValue) * 20;
                this.timeBar1.width = size.width / 2;
                this.timeBar2.width = size.width / 2;
                this.timeBar3.maximum = max;
                this.timeBar3.value = max;
                this.timeBar3.mask = this['mk'];
                this.timeBar2.maximum = max;
                this.timeBar1.maximum = max;
                this.timeBar2.value = max;
                this.timeBar1.value = max;
            }
            if (this._maxValue != tim) {
                this.timeBar2.value = tim / this._maxTime * 100;
                this.timeBar1.value = tim / this._maxTime * 100;
                tw = egret.Tween.get(this.timeBar1);
                let tw1 = egret.Tween.get(this.timeBar2);
                if ((tim - 1) <= 0) {

                    tw.to({value: 0}, 1000);
                    tw1.to({value: 0}, 1000);
                } else {
                    tw.to({value: (tim - 1) / this._maxTime * 100}, 900);
                    tw1.to({value: (tim - 1) / this._maxTime * 100}, 900);
                }
                this._maxValue = tim;
            }
        } else {
            this._maxTime = 0;
            this._maxValue = 0;
        }
    }

    public log(str) {
        // if (this.logLab.height > 700) {
        //     this.logLab.text = '';
        // }
        // if (str == '') {
        //     this.logLab.text = '';
        // }
        // this.logLab.text += "\n" + str;
    }

    protected onRegist(): void {
        this.timeGroup.visible = false;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        for (let i = 1; i < 6; i++) {
            this['btn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchVideo, this);
        }
        for (let k = 1; k < 4; k++) {
            this['pinzhi' + k].name = k + '';
            this['sp' + k].name = k + '';
            this['pinzhi' + k].label = this.pinzhiNames[k];
            this['sp' + k].label = this.spNames[k];
            this['pinzhi' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectPinZhi, this);
            this['sp' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSpeed, this);
        }
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
        this.reduceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReduceVideo, this);
        this.play_pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        this.cundang1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCunDang, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.UPDATA_REFRESH, this.onShowLog, this);
        this.goMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMain, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.speedBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.qualityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeQuality, this);
        this.fenxiangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFenXiang, this);
        this.tiaoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTiao, this);
        this.updateResize();
    }

    protected onRemove(): void {
        for (let i = 1; i < 6; i++) {
            this['btn' + i].name = i - 1;
            this['btn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchVideo, this);
        }

        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
        this.reduceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReduceVideo, this);
        this.cundang1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCunDang, this);
        this.speedBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.play_pauseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);

    }

    //供子类覆盖
    protected onInit(): void {
        //    this.bokData = new BookData;
        this.onRefresh();
    }

    protected onRefresh(): void {
        this.timeBar4.maximum = 100;
        this.timeBar4.value = 50;
        // SoundManager.volume = 50;
    }

    protected onSkinName(): void {
        this.skinName = skins.TipsSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onFenXiang() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        // this.bmp = new egret.Bitmap();
        // // let texture:egret.Texture = RES.getRes("run_png");
        // let texture:egret.RenderTexture =Tool.onDrawDisObjToTexture(window['video1'],new egret.Rectangle(0, 0, size.width, size.height));
        // // texture.toDataURL("image/png",  new egret.Rectangle(0, 0, size.width, size.height));
        // // texture.saveToFile("image/png", "a/down.png", new egret.Rectangle(0, 0, size.width, size.height));
        // this.bmp.texture = texture;
        // VideoManager.getInstance().dragImg();
        // this.addChild(this.bmp);
    }

    private onTiao() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.videoD.onTiao();
    }

    private onChangeQuality() {
        if (this.pinzhiGroup.visible) {
            this.pinzhiGroup.visible = false;
            return;
        }
        if (this.pinzhi == 1) {
            this.pinzhi = 2;
            GameDefine.VIDEO_PINZHI = 2;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SWITCH_QUALITY));
        } else {
            this.pinzhi = 1;
            GameDefine.VIDEO_PINZHI = 1;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SWITCH_QUALITY));
        }
        this.timerIdx = 0;
        this.pinzhiGroup.visible = true;
        this.beisuGroup.visible = false;

        // VideoManager.getInstance().onSwitchQuality();
    }

    private onShowMain() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.hideTips();
        this.videoD.onCloseVideo();
        GameCommon.getInstance().hideTipsHuDong();
        this.mengban.visible = false;
        this.pauseGroup.visible = false;
    }

    private onTouchMove(e: egret.TouchEvent) {

    }

    private onEnd() {
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.timerIdx = 0;
        if (!this.isClick) {
            return;
        }
        if (this.videoD.getIsClick(this.videoD) == 3) {
            if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                this.controlGroup.visible = true;
                this.addBtn.touchEnabled = false;
                this.reduceBtn.touchEnabled = false;
                return;
            }
            if (this.timer)
                this.timer.stop();
            this.hideControl();
            return;
        }
        this.reduceBtn.touchEnabled = true;
        if (new Date().getTime() - this.touchtime < 250) {
            this.onPlay_Pause();
        } else {

            if (this.videoD) {
                this.fileState = true;
                this.touchtime = new Date().getTime();
                if (!this.controlGroup.visible) {
                    if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                        this.controlGroup.visible = true;
                        return;
                    }
                    this.timerIdx = 0;
                    this.controlGroup.visible = true;
                    this.onTimer();
                    if (!this.timer) {
                        this.timer = new egret.Timer(1000);
                        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                        this.timer.start();
                    } else {
                        this.timer.start();
                    }
                    // if (!UserInfo.guideDic[1]) {//暂时注释
                    //     this.timer.stop();
                    //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'stop');
                    //     GuideManager.getInstance().onShowImg(this, this.cundang1, 'tip');
                    //     this.bgBtn.touchEnabled = false;
                    //     this.addBtn.touchEnabled = false;
                    //     this.reduceBtn.touchEnabled = false;
                    //     this.play_pauseBtn.touchEnabled = false;
                    //     this.goMain.touchEnabled = false;
                    //     this.qualityBtn.touchEnabled = false;
                    //     this.cundang1.touchEnabled = true;
                    //     this.xuanzecundang.visible = true;
                    // }
                } else {
                    this.addBtn.touchEnabled = true;
                    if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                        return;
                    }
                    if (this.timer) {
                        this.timer.stop();
                        this.hideControl();
                    }
                    this.controlGroup.visible = false;
                    this.zimu.bottom = 100;
                    this.videoCurrentState = true;
                    this.timerIdx = 4;
                    return;
                }
            }
        }
    }

    private hideControl() {
        this.timerIdx = 0;
        this.beisuGroup.visible = false;
        this.pinzhiGroup.visible = false;
        // this.controlGroup.alpha = 0;
        this.controlGroup.visible = false;
        this.zimu.bottom = 100;
    }

    private onHideGuide(e: egret.TouchEvent): void {
        this.guide_img.visible = false;
        this.mengban.visible = false;
        this.setPauseState();
        this.onShowBottomBtn(e);
        this.guide_img.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHideGuide, this);
    }

    private onShowBottomBtn(e: egret.TouchEvent) {
        //SoundManager.getInstance().playSound("ope_click.mp3")
        if (TipsBtn.Is_Guide_Bool) {//新手引导 显示一张按钮指引的图
            this.setPauseState();
            TipsBtn.Is_Guide_Bool = false;
            this.guide_img.visible = true;
            this.mengban.visible = true;
            this.guide_img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHideGuide, this);
            this.controlGroup.visible = false;
            this.pauseGroup.visible = false;
            return;
        }

        if (e) {
            this.starPosY = e.stageY;
            this.starPosX = e.stageX;
        }

        this.direction = 0;
        if (this.starPosX > this.width / 2 - 150) {
            this.direction = 2;
        } else if (this.starPosX < this.width / 2 - 150) {
            this.direction = 1;
        }
        this.isClick = true;
        if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
            this.play_pauseBtn.touchEnabled = true;
        }
        // else {
        // if (!this.videoD.getVideoPause()) {
        //     this.hideControl();
        //     this.isClick = false;
        //     return;
        // }
        // }
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        // let data = RES.getRes('dddd_json');
        // let txtr = RES.getRes('dddd_png');
        // let mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        // let mc1:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData('dddd'));
        // this.addChild(mc1);
        // mc1.gotoAndPlay(0,999999);
    }

    private onCunDang() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameCommon.getInstance().hideTipsHuDong();
        VideoManager.getInstance().videoPause();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'JuQingPanel');
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
        Tool.callbackTime(function () {
            GameDefine.IS_DUDANG = true;
        }, this, 200);
    }

    private onAddVideo() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.timerIdx = 0;
        // if (this.isAddFlg)
        //     return;
        // this.isAddFlg = true;
        let obj = this;
        // Tool.callbackTime(function () {
        //    obj.isAddFlg = false;
        // }, obj, 1000);

        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ADD_VIDEO_SPEED));
    }

    private onReduceVideo() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.timerIdx = 0;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.REDUCE_VIDEO_SPEED));
    }

    private onSetSpeed() {
        this.timerIdx = 0;
        if (this.beisuGroup.visible) {
            this.beisuGroup.visible = false;
            return;
        }

        this.beisuGroup.visible = true;
        this.pinzhiGroup.visible = false;
    }

    private onSelectPinZhi(event: egret.Event) {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.pinzhiGroup.visible = false;
        this.qualityBtn.label = event.target.label;
    }

    private onSelectSpeed(event: egret.Event) {
        SoundManager.getInstance().playSound("ope_click.mp3")
        const id: number = Number(event.target.name);
        this.beisuGroup.visible = false;
        this.speedBtn.label = event.target.label;
        VideoManager.getInstance().setSpeed(this.speedDic[id]);
        GameDefine.CUR_SPEED = this.speedDic[id];
    }

    private onPlay() {
        this.onPlay_Pause();
    }

    private onPlay_Pause() {
        //SoundManager.getInstance().playSound("ope_click.mp3")
        if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), true);
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.mengban.visible = false;
            this.pauseGroup.visible = false;
            this.controlGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
            this.onSetCunDangState(this.fileState);
            return;
        }
        if (!this.videoD.getVideoPause()) {
            // this.log('结尾不允许暂停')
            return;
        }
        this.timerIdx = 0;
        if (this.play_pauseBtn['iconDisplay'].source == 'pauseImg_png') {
            this.controlGroup.visible = true;
            this.mengban.visible = true;
            this.pauseGroup.visible = true;
            this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), false);
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), true);
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.mengban.visible = false;
            this.pauseGroup.visible = false;
        }
        this.onSetCunDangState(this.fileState);
    }

    private onTouchVideo(event: egret.Event) {
        if (this.isSelect) return;
        let button = event.currentTarget;
        let id: number = Number(button.name);
        if (button['lock_grp'].visible) {
            let optGoodsAry: number[] = this.Option_Goods[this.wentiId];
            let goodsid: number = optGoodsAry[id - 1];
            if (goodsid) {
                let goodsInfo: ShopInfoData = ShopManager.getInstance().getShopInfoData(goodsid);
                if (goodsInfo) {
                    SoundManager.getInstance().playSound("ope_ask.mp3")
                    GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onUpdateWentiBtnStatus, this);
                    GameCommon.getInstance().onShowBuyTips(goodsInfo.id, goodsInfo.model.currPrice, GOODS_TYPE.DIAMOND);
                }
            }
        } else {            
            SoundManager.getInstance().playSound("ope_select_tab.mp3")
            this.onSelectWenTi(id);
        }
    }

    private onSelectWenTi(id) {
        this.isSelect = true;
        this.onUpdateLockStatus(false);
        for (let i: number = 1; i < 6; i++) {
            if (i == id) {
                this['btn' + i].alpha = 0.5;
                this['btn' + i]['iconDisplay'].source = 'common_select_png';
                this['btn' + i]['labelDisplay'].textColor = '0x000000';
                egret.Tween.get(this['btn' + i]).to({alpha: 1}, 300);
            } else {
                this['btn' + i].visible = false;
            }
        }
        this.timeBar3.visible = false;
        if (this.wentiId > 0)
            GameDispatcher.getInstance().dispatchEvent(
                new egret.Event(GameEvent.ONSHOW_VIDEO),
                {
                    answerId: id,
                    wentiId: this.wentiId,
                    click: true
                }
            );
        this.hideTipTimer = egret.setTimeout(() => {
            this.hideTipTimer = undefined;
            this.hideTips();
        }, this, 1000);
    }

    private onUpdateLockStatus(isLock): void {
        if (this._isLock != isLock) {
            this._isLock = isLock;
            if (this._isLock) {
                VideoManager.getInstance().videoPause();
            } else {
                VideoManager.getInstance().videoResume();
            }
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.cundang1.icon = 'cundang_png';
        this.onInit();
        this.onRegist();
        this.guide_img.visible = false;
        this.mengban.visible = false;
        this.pauseGroup.visible = false;
        this.sd = new egret.Sound();
        this.sd.load('resource/sound/click_sound.mp3');
    }

    /**判断下问题是否带锁**/
    private onUpdateWentiBtnStatus(): void {
        for (let i: number = 0; i < 5; i++) {
            this['btn' + (i + 1)]['lock_grp'].visible = false;
        }
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onUpdateWentiBtnStatus, this);
        let lockOptIDs: number[] = [];
        let conditionData = this.Option_Condition[this.wentiId];
        if (conditionData) {
            let isChufa: boolean = true;
            if (conditionData.chufa) {
                for (let chufaWentiID in conditionData.chufa) {
                    let chufa_optID: number = conditionData.chufa[chufaWentiID];
                    let select_optID: number = UserInfo.curBokData.answerId[chufaWentiID];
                    if (!select_optID || select_optID != chufa_optID) {
                        isChufa = false;
                        break;
                    }
                }
            }
            if (isChufa) {
                let errorNum: number = 0;
                for (let condWentiID in conditionData.conditions) {
                    let cond_optID: number = conditionData.conditions[condWentiID];
                    let select_optID: number = UserInfo.curBokData.answerId[condWentiID];
                    if (!select_optID || select_optID == cond_optID) {
                        errorNum++;
                    }
                }
                if (errorNum >= conditionData.errorNum) {
                    let optGoodsAry: number[] = this.Option_Goods[this.wentiId];
                    for (let idx: number = 0; idx < optGoodsAry.length; idx++) {
                        let cur_optID: number = idx + 1;
                        let goodsid: number = optGoodsAry[idx];
                        if (goodsid) {
                            let goodsInfo: ShopInfoData = ShopManager.getInstance().getShopInfoData(goodsid);
                            if (goodsInfo && goodsInfo.num == 0 && lockOptIDs.indexOf(cur_optID) == -1) {
                                lockOptIDs.push(cur_optID);
                            }
                        }
                    }
                }
            }
        }
        let likeCondiData = this.Option_Like[this.wentiId];
        if (likeCondiData) {
            let likeShowNum: number = likeCondiData.likeNum;
            let likesAry = GameCommon.getInstance().getSortLikeAry();
            for (let i: number = ROLE_INDEX.SIZE - 1; i >= 0; i--) {
                let likeRData = likesAry[i];
                let like_opt_id: number = likeCondiData.option[likeRData.id];
                if (i < ROLE_INDEX.SIZE - likeShowNum) {
                    let optGoodsAry: number[] = this.Option_Goods[this.wentiId];
                    let goodsid: number = optGoodsAry[like_opt_id - 1];
                    let goodsInfo: ShopInfoData = ShopManager.getInstance().getShopInfoData(goodsid);
                    if (goodsInfo && goodsInfo.num == 0 && lockOptIDs.indexOf(like_opt_id) == -1) {
                        lockOptIDs.push(like_opt_id);
                    }
                }
            }
        }
        if (lockOptIDs.length > 0) {
            this.onUpdateLockStatus(true);
            for (let i: number = 0; i < lockOptIDs.length; i++) {
                let lockOptId: number = lockOptIDs[i];
                this['btn' + lockOptId]['lock_grp'].visible = true;
            }
        }
    }

    private gotoAction(model: Modelwenti) {
        if (!this.modelHuDong)
            return;
        GuideManager.getInstance().isGuide = true;
        if (this.modelHuDong.tp == ActionType.MUSIC) {
            if (this.modelHuDong.id != 3) {
                GuideManager.getInstance().isGuide = false;
            }
        }
        ActionManager.getInstance().setAction(model, this);
    }

    private onTimer() {
        this.timerIdx = this.timerIdx + 1;
        if (this.timerIdx > 3 && this.play_pauseBtn['iconDisplay'].source != 'playImg_png') {
            this.timerIdx = 0;
            this.timer.stop();
            this.hideControl();
            return;
        }
    }
}
