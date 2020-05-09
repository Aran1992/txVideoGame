class ControlTipsPanel extends eui.Component {
    private play_pauseBtn: eui.Button;
    private bgBtn: eui.Button;
    private controlGroup: eui.Group;
    private qualityBtn: eui.Button;
    private speedBtn: eui.Button;
    private pinzhiGroup: eui.Group;
    private beisuGroup: eui.Group;
    private videoPro: eui.ProgressBar;
    private videoPro1: eui.ProgressBar;
    private pauseGroup: eui.Group;
    private playBtn: eui.Button;
    private goMain: eui.Button;
    private starPos: number = 0;
    private isBegin: boolean = false;
    private spNames: string[] = ['', '1.5X', '1.25X', '1.0X'];
    private pinzhiNames: string[] = ['270P', '480P', '720P', '1080P'];
    private pinzhiDatas: string[] = ['sd', 'hd', 'shd', undefined];
    private speedDic: number[] = [0, 1.5, 1.25, 1];
    private videoCurrentState: boolean = true;
    private timer: egret.Timer;
    private timerIdx: number = 0;
    private starPosY: number = 0;
    private starPosX: number = 0;
    private isClick: boolean = true;
    private touchtime = new Date().getTime();
    private direction: number = 0;
    private isReady: boolean = false;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public init() {

    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.play_pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.qualityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeQuality, this);
        this.speedBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        this.goMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMain, this);
        for (let k = 1; k < 4; k++) {
            this['sp' + k].name = k + '';
            this['sp' + k].label = this.spNames[k];
            this['sp' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSpeed, this);
        }
        for (let k = 0; k < this.pinzhiNames.length; k++) {
            this['pinzhi' + k].name = this.pinzhiDatas[k];
            this['pinzhi' + k].label = this.pinzhiNames[k];
            this['pinzhi' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectPinZhi, this);
        }
        if (!isTXSP) {
            const button = this[`pinzhi${this.pinzhiNames.length - 1}`];
            button.parent.removeChild(this[`pinzhi${this.pinzhiNames.length - 1}`]);
        }
        this.videoPro1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onProBegin, this);
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

    private onProMove() {
    }

    private onProEnd(e: egret.TouchEvent) {
        this.isBegin = false;
        this.videoPro.value = e.stageX / this.videoPro.width * this.videoPro.maximum;
        widPlayer.seek(e.stageX / this.videoPro.width * this.videoPro.maximum);
        this.videoPro.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onProMove, this);
        this.videoPro.removeEventListener(egret.TouchEvent.TOUCH_END, this.onProEnd, this);
    }

    private onSelectPinZhi(event: egret.Event) {
        this.pinzhiGroup.visible = false;
        try {
            let htmlButton: any = undefined;
            const childNodes = document
                .getElementsByClassName("mod_overlay setlevel")[0]
                .getElementsByClassName("select_list")[0]
                .childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                const child = childNodes[i] as HTMLElement;
                const name = child.getAttribute("data-defn");
                if (this.pinzhiDatas.indexOf(name) === -1 && event.target.name === undefined) {
                    htmlButton = child;
                    break;
                }
                if (name === event.target.name) {
                    htmlButton = child;
                    break;
                }
            }
            if (htmlButton) {
                htmlButton.click();
                this.qualityBtn.label = event.target.label;
            }
        } catch (e) {
        }
    }

    private onSelectSpeed(event: egret.Event) {
        var id: number = Number(event.target.name);
        this.beisuGroup.visible = false;
        this.speedBtn.label = event.target.label;
        widPlayer.setPlaybackRate(this.speedDic[id]);
    }

    private onChangeQuality() {
        if (this.pinzhiGroup.visible) {
            this.pinzhiGroup.visible = false;
            return;
        }
        this.timerIdx = 0;
        this.pinzhiGroup.visible = true;
        this.beisuGroup.visible = false;
    }

    private onTouchMove() {
    }

    private onEnd() {
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.timerIdx = 0;
        if (!this.isClick) {
            return;
        }
        if (new Date().getTime() - this.touchtime < 250) {
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
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
    }

    private onSetSpeed() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.timerIdx = 0;
        if (this.beisuGroup.visible) {
            this.beisuGroup.visible = false;
            return;
        }

        this.beisuGroup.visible = true;
        this.pinzhiGroup.visible = false;
    }

    private onShowMain() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (!widPlayer)
            return;
        widPlayer.clear();
        VideoManager.getInstance().updateVideoData('');
        this.onRemove();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEO3));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ControlTipsPanel')
    }

    private onPlay() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.onPlay_Pause();
    }

    private onPlay_Pause() {
        SoundManager.getInstance().playSound("ope_click.mp3");
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
            if (widPlayer.getPlayTime() >= widPlayer.getDuration() - 1) {
                // widPlayer.seek(0);
                let vid = widPlayer.getVid();
                widPlayer.clear();
                widPlayer.play(vid);//widPlayer.getVid()
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
        widPlayer.on('timeupdate', () => {
            if (this.videoPro) {
                //if (this.videoPro.maximum < 5) {//不知道用来干嘛
                this.videoPro.maximum = widPlayer.getDuration();
                //}
                GameCommon.getInstance().removeLoading();
                this.videoPro.value = widPlayer.getPlayTime();
            }

        });
        widPlayer.on('statechange', (data) => {
            this.isReady = true;
            if (data.new == 'end') {
                this.pauseGroup.visible = true;
                this.controlGroup.visible = true;
                this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
                //widPlayer.originPlayer.playList.playtime = widPlayer.getDuration();//会被改回去，没用
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
