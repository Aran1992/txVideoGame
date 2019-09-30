// TypeScript file
class ControlTipsPanel extends eui.Component {
    public ren: eui.Image;
    private play_pauseBtn: eui.Button;
    private bgBtn: eui.Button;
    private desc: eui.Label;
    private controlGroup: eui.Group;
    private mainGroup: eui.Group;
    private fenxiangBtn: eui.Button;
    private qualityBtn: eui.Button;
    private speedBtn: eui.Button;
    private timeBar3: eui.ProgressBar;
    private timeBar4: eui.ProgressBar;
    private pinzhiGroup: eui.Group;
    private beisuGroup: eui.Group;
    private videoPro: eui.ProgressBar;
    private videoPro1: eui.ProgressBar;
    private pauseGroup: eui.Group;
    private playBtn: eui.Button;
    private goMain: eui.Button;
    // private img: eui.Image;
    private starPos: number = 0;
    private isBegin: boolean = false;
    private spNames: string[] = ['', '1.5X', '1.25X', '1.0X'];
    private pinzhiNames: string[] = ['', '1080P', '720P', '480P'];
    private pinzhi: number = 1;
    private speedDic: number[] = [0, 1.5, 1.25, 1];
    private videoCurrentState: boolean = true;
    private timer: egret.Timer;
    private timerIdx: number = 0;
    private starPosY: number = 0;
    private starPosX: number = 0;
    private isClick: boolean = true;
    private light: number = 1;
    private touchtime = new Date().getTime();
    private direction: number = 0;
    private isSetDiv: boolean = false;
    private isReady: boolean = false;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public onShowChengJiuComplete() {

    }

    public onShowLog(tim, endTime) {
        // if(UserInfo.achievementDics)
        // this.desc.text= 'star'+tim+'\n'+endTime;
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
        this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), false);
    }

    public init() {

    }

    public onShow(): void {

    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.play_pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.qualityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeQuality, this);
        this.speedBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        this.goMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMain, this);
        for (var k = 1; k < 4; k++) {
            this['pinzhi' + k].name = k + '';
            this['sp' + k].name = k + '';
            this['pinzhi' + k].label = this.pinzhiNames[k];
            this['sp' + k].label = this.spNames[k];
            this['pinzhi' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectPinZhi, this);
            this['sp' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSpeed, this);
        }
        // this.img = this.videoPro['touchBtn'];
        // this.videoPro.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onProBegin, this);
        this.videoPro1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onProBegin, this);
        // this.videoPro['touchBtn'].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onProBegin, this);

        this.updateResize();
    }

    protected onRemove(): void {
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.play_pauseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        this.qualityBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeQuality, this);
        this.speedBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.playBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        this.goMain.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMain, this);
        for (var k = 1; k < 4; k++) {
            this['pinzhi' + k].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectPinZhi, this);
            this['sp' + k].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSpeed, this);
        }
    }

    //供子类覆盖
    protected onInit(): void {
        //    this.bokData = new BookData;
        this.onUpData();
        this.onRefresh();
    }

    protected onRefresh(): void {
        // this.timeBar4.maximum = 100;
        // this.timeBar4.value = 50;
        // SoundManager.volume = 50;
    }

    protected onSkinName(): void {
        this.skinName = skins.ControlTipsSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onProBegin(e: egret.TouchEvent) {
        this.isBegin = true;
        this.starPos = e.stageX;
        if (this.videoPro1) {
            this.videoPro1.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onProMove, this);
            this.videoPro1.addEventListener(egret.TouchEvent.TOUCH_END, this.onProEnd, this);
        }

    }

    private onProMove(e: egret.TouchEvent) {
        // if (this.starPos > e.stageX) {
        // this.img.x = this.img.x - (this.starPos - e.stageX);
        // this.starPos = e.stageX;
        // }
        // else if (this.starPos < e.stageX) {
        //     this.img.x = e.stageX - this.starPos + this.img.x;
        //     this.starPos = e.stageX;
        // }
        // if (this.img.x >= this.videoPro.width) {

        //     this.img.x = this.videoPro.width;
        // }
        // else if (this.img.x <= 0) {
        //     this.img.x = 0;
        // }
        // this.videoPro.value = this.img.x;
    }

    private onProEnd(e: egret.TouchEvent) {
        this.isBegin = false;
        // this.img.x = e.stageX;
        this.videoPro.value = e.stageX / this.videoPro.width * this.videoPro.maximum;
        widPlayer.seek(e.stageX / this.videoPro.width * this.videoPro.maximum);
        this.videoPro.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onProMove, this);
        this.videoPro.removeEventListener(egret.TouchEvent.TOUCH_END, this.onProEnd, this);
    }

    private onSelectPinZhi(event: egret.Event) {
        var id: number = Number(event.target.name);
        this.pinzhiGroup.visible = false;
        this.qualityBtn.label = event.target.label;
    }

    private onSelectSpeed(event: egret.Event) {
        var id: number = Number(event.target.name);
        this.beisuGroup.visible = false;
        this.speedBtn.label = event.target.label;
        widPlayer.setPlaybackRate(this.speedDic[id]);
    }

    private onChangeQuality() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        // if (this.pinzhi == 1) {
        //     this.pinzhi = 2;
        //     GameDefine.VIDEO_PINZHI = 2;
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SWITCH_QUALITY));
        // }
        // else {
        //     this.pinzhi = 1;
        //     GameDefine.VIDEO_PINZHI = 1;
        //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SWITCH_QUALITY));
        // }
        // VideoManager.getInstance().onSwitchQuality();
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
        if (new Date().getTime() - this.touchtime < 250) {
            this.onPlay_Pause();
        } else {

            this.touchtime = new Date().getTime();
            if (!this.controlGroup.visible) {
                this.controlGroup.visible = true;
                if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                    return;
                }
                this.timerIdx = 0;
                this.onTimer();

                if (!this.timer) {
                    this.timer = new egret.Timer(1000);
                    this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                    this.timer.start();
                } else {
                    this.timer.start();
                }
            } else {
                if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                    return;
                }
                if (this.timer) {
                    this.timer.stop();
                    this.hideControl();
                }

                this.controlGroup.visible = false;
                this.videoCurrentState = true;
                this.timerIdx = 4;
                return;
            }


        }
    }

    private hideControl() {
        this.timerIdx = 0;
        // this.controlGroup.alpha = 0;
        this.controlGroup.visible = false;
    }

    private onClose() {
        if (widPlayer)
            widPlayer.clear();
        GameDefine.CUR_PLAYER_VIDEO = 1;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEO3));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ControlTipsPanel')
    }

    private onShowBottomBtn(e: egret.TouchEvent) {
        this.starPosY = e.stageY;
        this.starPosX = e.stageX;
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
        // var data = RES.getRes('dddd_json');
        // var txtr = RES.getRes('dddd_png');
        // var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        // var mc1:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData('dddd'));
        // this.addChild(mc1);
        // mc1.gotoAndPlay(0,999999);
    }

    private onSetSpeed() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.timerIdx = 0;
        if (this.beisuGroup.visible) {
            this.beisuGroup.visible = false;
            return;
        }

        this.beisuGroup.visible = true;
        this.pinzhiGroup.visible = false;
    }

    private onShowMain() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (!widPlayer)
            return;
        widPlayer.clear();
        VideoManager.getInstance().updateVideoData('');
        this.onRemove();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEO3));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ControlTipsPanel')
    }

    private onPlay() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.onPlay_Pause();
    }

    private onPlay_Pause() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (!this.isReady)
            return;
        if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.controlGroup.visible = false;
            this.pauseGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
            if (widPlayer.getPlayTime() >= widPlayer.getDuration()) {
                widPlayer.seek(0);
                var obj = this;

                Tool.callbackTime(function () {
                    widPlayer.resume();
                }, obj, 100);
                return;
            }
            widPlayer.resume();
            return;
        }
        this.timerIdx = 0;
        if (this.play_pauseBtn['iconDisplay'].source == 'pauseImg_png') {
            this.controlGroup.visible = true;
            this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
            this.pauseGroup.visible = true;
            widPlayer.pause();
        } else {
            // if (widPlayer1.getPlayTime() >= widPlayer1.getDuration()) {
            // widPlayer1.seek(1);
            // widPlayer.resume();
            // var obj = this;
            // Tool.callbackTime(function () {
            //     widPlayer.resume();
            // }, obj, 500);
            // return;
            // }
            widPlayer.resume();
            this.pauseGroup.visible = false;
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';

        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.onInit();
        this.onRegist();

    }

    private onUpData() {
        //视频update事件
        if (!widPlayer)
            return;
        this.videoPro.slideDuration = 0;
        var obj = this;
        widPlayer.on('timeupdate', (data) => {
            if (obj.videoPro) {
                if (obj.videoPro.maximum < 5) {
                    obj.videoPro.maximum = widPlayer.getDuration();
                }
                GameCommon.getInstance().removeLoading();
                obj.videoPro.value = widPlayer.getPlayTime();

                // if (!obj.isBegin) {
                //     obj.img.x = widPlayer1.getPlayTime() / widPlayer1.getDuration() * obj.videoPro.width;
                // }
            }

        });
        widPlayer.on('statechange', (data) => {
            this.isReady = true;
            if (data.new == 'end') {
                // widPlayer1.seek(0.5);
                obj.pauseGroup.visible = true;
                obj.controlGroup.visible = true;
                obj.play_pauseBtn['iconDisplay'].source = 'playImg_png';
            }
        })
    }

    private onTimer() {
        if (this.timerIdx > 3 && this.play_pauseBtn['iconDisplay'].source != 'playImg_png') {
            this.timerIdx = 0;
            this.timer.stop();
            this.hideControl();
            return;
        }
    }
}
