class ActionClick extends ActionSceneBase {
    private groupClick: eui.Group;
    private groupBG: eui.Group;
    private timeImg: eui.Image;
    private timeImg2: eui.Image;
    private share: egret.Shape;
    private isTimeVisible: boolean = true;
    private guideImg: eui.Group;
    private lineGroup: eui.Group;
    private tanqinDic: string = '51_71#35_71#40_71#35_71#40_71#51_71#40_71';
    private tanqinNum: number;
    private _posStr: string[];
    private groupClick1: eui.Group;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;
    private heiping: eui.Image;
    private guideGorup: eui.Group;
    private handAni: my.Animation;
    private soundSrc: string[] = ['G4.mp3', 'D4.mp3', 'E4.mp3', 'D4.mp3', 'E4.mp3', 'G4.mp3', 'E4.mp3'];
    private isComp: boolean = false;

    public exit() {
        this.groupClick.visible = false;
        this.heiping.visible = false;
        this.stopRun();
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionClickSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.initTimeInfo();
        let posStr = this.paramList[3].split("_");
        if (this.model.id === 75) {
            this._posStr = this.tanqinDic.split("#");
            posStr = this._posStr[0].split("_");
            this.tanqinNum = this._posStr.length;
        }
        this.groupClick.visible = false;
        this.lineGroup.visible = false;
        if (this.model.id === 75) {//弹钢琴
            if (posStr.length > 1) {
                this.lineGroup.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
                this.lineGroup.y = Math.floor(this.height * (parseInt(posStr[1]) / 100)) - 450;
            }
            this.lineGroup.visible = true;
            this.groupClick.visible = false;
            this.lineGroup.anchorOffsetX = this.lineGroup.width / 2;
            this.lineGroup.touchEnabled = true;
            this.lineGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventClick, this);
            this.handAni = new my.Animation('effect_zhiyin', -1);
            this.handAni.scaleX = 1;
            this.handAni.scaleY = 1;
            this.handAni.x = 86; //this.guideImg.x + 296;// - this.groupClick.width / 2;
            this.handAni.y = 86;
            this.groupClick1.addChild(this.handAni);
            this.handAni.onPlay();
        } else {
            this.groupClick.visible = true;
            if (posStr.length > 1) {
                this.groupClick.anchorOffsetX = this.groupClick.width / 2;
                this.groupClick.anchorOffsetY = this.groupClick.height / 2;
                this.groupClick.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
                this.groupClick.y = Math.floor(this.height * (parseInt(posStr[1]) / 100));
                this.handAni = new my.Animation('effect_zhiyin', -1);
                this.handAni.scaleX = 1;
                this.handAni.scaleY = 1;
                this.handAni.x = 86; //this.guideImg.x + 296;// - this.groupClick.width / 2;
                this.handAni.y = 86; //this.guideImg.y + 198;// - this.groupClick.height / 2;
                this.groupClick.addChild(this.handAni);
                this.handAni.onPlay();
                this.guideGorup.x = this.groupClick.x + 50;
                this.guideGorup.y = this.groupClick.y;
            }
            this.groupClick.touchEnabled = true;
            this.groupClick.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventClick, this);
        }
        this.isComp = false;
    }

    protected update(dt): void {
        super.update(dt);
        if (this.model.id == 1 || this.model.id == 17) {
            if (GuideManager.getInstance().isGuide && this.model.id == 1) {
                this.guideImg.visible = true;
                this.heiping.visible = true;
                GuideManager.getInstance().curState = true;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'stop');
                super.stopRun();
            }
            this.timeBar2.value = this.runTime;
            this.timeBar1.value = this.runTime;
        } else if (this.model.id === 75) {
            this.timeBar2.value = this.runTime;
            this.timeBar1.value = this.runTime;
        }
    }

    protected onBackFail() {
        this.addEffect("miss");
        // this.icon.source = 'action_miss_png'
        super.onBackFail();
    }

    protected onBackSuccess() {
        this.addEffect("lingxing_effect");
        if (this.model.id === 75) {
            if (this.idx + 1 <= this.tanqinNum) {
                return;
            }
            this.idx = 0;
        }
        super.onBackSuccess();
    }

    private onRefreshPos() {
        if (!this._posStr[this.idx])
            return;
        let posStr = this._posStr[this.idx].split("_");
        if (posStr.length > 1) {
            this.lineGroup.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
            this.lineGroup.y = Math.floor(this.height * (parseInt(posStr[1]) / 100)) - 450;
        }
    }

    private initTimeInfo() {
        if (this.isTimeVisible) {
            this.share = new egret.Shape();
            let hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
            this.desc1.text = hdCfg.des;
            this.timeBar1.maximum = this.maxTime;
            this.timeBar1.slideDuration = 0;
            this.timeBar1.value = this.maxTime;
            this.timeBar2.slideDuration = 0;
            this.timeBar2.maximum = this.maxTime;
            this.timeBar2.value = this.maxTime;
        } else {
            this.timeImg.visible = false;
            this.timeImg2.visible = false;
        }
    }

    private onEventClick() {
        this.isComp = true;
        this.onBackSuccess();

        if (this.model.id === 75) {
            return;
        }
        if (this.handAni) {
            this.handAni.parent.removeChild(this.handAni);
            this.handAni.onDestroy();
            this.handAni = null;
        }
        if (GuideManager.getInstance().isGuide) {
            GuideManager.getInstance().isGuide = false;
            this.guideImg.visible = false;
            GuideManager.getInstance().curState = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), '');
            super.stopRun();
        }
    }

    private addEffect(res) {
        if (res == 'miss') {
            this.onExit();
            return;
        }
        if (this.model.id === 75) {
            this.groupBG.removeChildren();
            let ani1: my.Animation = new my.Animation(res);
            ani1.x = this.lineGroup.x;// - this.groupClick.width / 2;
            ani1.y = this.lineGroup.y + 477;// - this.groupClick.height / 2;
            if (res == 'lingxing_effect') {
                ani1.scaleX = 0.7;
                ani1.scaleY = 0.7;
            }
            this.groupBG.addChild(ani1);
            if (this.idx + 1 >= this.tanqinNum) {
                Tool.callbackTime(() => this.onExit(), this, 200);
            }
            ani1.onPlay();
            SoundManager.getInstance().playSound(this.soundSrc[this.idx]);
            if (this.idx + 1 <= this.tanqinNum) {
                this.idx = this.idx + 1;
                this.onRefreshPos();
            }
            return;
        }
        let ani: my.Animation = new my.Animation(res);
        ani.setFinishCallBack(this.onExit, this);
        if (res == 'lingxing_effect') {
            ani.scaleX = 0.8;
            ani.scaleY = 0.8;
        }
        ani.x = this.groupClick.x;// - this.groupClick.width / 2;
        ani.y = this.groupClick.y;// - this.groupClick.height / 2;

        this.groupBG.addChild(ani);
        ani.onPlay();
    }

    private onExit() {
        if (this.parent)
            this.parent.removeChild(this);
    }
}
