class ActionClick extends ActionSceneBase {
    private groupClick: eui.Group;
    private groupBG: eui.Group;
    // private timeLab: eui.Label;
    private timeImg: eui.Image;
    private timeImg2: eui.Image;
    private share: egret.Shape;
    // private share1: egret.Shape;
    private isTimeVisible: boolean;
    private mainGroup: eui.Group;
    private guideImg: eui.Group;
    private handImg: eui.Image;
    private handImg1: eui.Image;
    // private timeImg1: eui.Image;
    private icon: eui.Image;
    private lineGroup: eui.Group;
    private isLoadComplete: boolean = false;
    private tanqinDic: string = '51_71#35_71#40_71#35_71#40_71#51_71#40_71';
    private tanqinNum: number;
    private _posStr: string[];
    private groupClick1: eui.Group;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;
    private heiping: eui.Image;
    private guideGorup: eui.Group;
    private handAni: Animation;
    private soundSrc: string[] = ['G4.mp3', 'D4.mp3', 'E4.mp3', 'D4.mp3', 'E4.mp3', 'G4.mp3', 'E4.mp3'];
    private isComp: boolean = false;

    public constructor(model: Modelwenti, list: string[], idx: number, isTimeVisible: boolean) {
        super(model, list, idx);
        this.isTimeVisible = isTimeVisible;
    }

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
        // this.icon.source = ''
        this.updateResize();
        this.initTimeInfo();
        // this.timeLab.visible = this.isTimeVisible;
        let list = this.paramList;
        // let time = parseFloat(this.paramList[1]);
        let posStr = this.paramList[3].split("_");
        if (this.model.id == '75') {
            this._posStr = this.tanqinDic.split("#");
            posStr = this._posStr[0].split("_");
            this.tanqinNum = this._posStr.length;

        }
        this.groupClick.visible = false;
        this.lineGroup.visible = false;
        if (this.model.id == 75) {//弹钢琴
            if (posStr.length > 1) {
                this.lineGroup.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
                this.lineGroup.y = Math.floor(this.height * (parseInt(posStr[1]) / 100)) - 450;
            }
            this.lineGroup.visible = true;
            this.groupClick.visible = false;
            this.lineGroup.anchorOffsetX = this.lineGroup.width / 2;
            this.lineGroup.touchEnabled = true;
            this.lineGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventClick, this);
            // this.handAni = new Animation('kuosan', -1);
            // this.handAni.scaleX = 1;
            // this.handAni.scaleY = 1;
            // this.handAni.x = this.lineGroup.x - 120; //this.guideImg.x + 296;// - this.groupClick.width / 2;
            // this.handAni.y = this.lineGroup.y + 383; //this.guideImg.y + 198;// - this.groupClick.height / 2;
            this.handAni = new Animation('effect_zhiyin', -1);
            this.handAni.scaleX = 1;
            this.handAni.scaleY = 1;
            this.handAni.x = 86; //this.guideImg.x + 296;// - this.groupClick.width / 2;
            this.handAni.y = 86;
            this.groupClick1.addChild(this.handAni);
            this.handAni.onPlay();

            // this.groupBG.addChild(this.handAni);
            this.handAni.onPlay();
        } else {
            this.groupClick.visible = true;
            if (posStr.length > 1) {
                this.groupClick.anchorOffsetX = this.groupClick.width / 2;
                this.groupClick.anchorOffsetY = this.groupClick.height / 2;
                // if (this.idx == 0) {
                this.groupClick.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
                this.groupClick.y = Math.floor(this.height * (parseInt(posStr[1]) / 100));
                // this.guideImg.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)) - 25
                // this.guideImg.y = Math.floor(this.height * (parseInt(posStr[1]) / 100)) + 120;
                this.handAni = new Animation('effect_zhiyin', -1);
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

        // if (this.model.id == '17') {
        // 	this.icon.source = 'action_font_2_png';
        // }
        // else {
        // 	this.icon.source = 'action_font_0_png';
        // }
        this.isComp = false;
        // this.groupBG.touchEnabled = true;
        // this.groupBG.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOut, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
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
            // if (this.isTimeVisible) {
            // 	// this.timeLab.text = Math.floor(this.runTime / 1000 + 0.9).toString();
            // 	// this.drawArc(this.share1, this.maxTime - this.runTime, this.maxTime, this.timeImg1.width);
            // 	this.drawArc(this.share, this.maxTime - this.runTime, this.maxTime, 300);
            // 	// this.drawArc(this.share, 25, 100);
            // }
            this.timeBar2.value = this.runTime;
            this.timeBar1.value = this.runTime;
        } else if (this.model.id == 75) {
            // if (this.isTimeVisible) {
            // 	this.drawArc(this.share, this.maxTime - this.runTime, this.maxTime, 300);
            // }
            this.timeBar2.value = this.runTime;
            this.timeBar1.value = this.runTime;
            // this.timeBar.value = this.runTime;
        }

    }

    protected onBackFail() {
        this.addEffect("miss");
        // this.icon.source = 'action_miss_png'
        super.onBackFail();
    }

    protected onBackSuccess() {
        // this.icon.source = '';
        this.addEffect("lingxing_effect");
        if (this.model.id == 75) {
            if (this.idx + 1 <= this.tanqinNum) {
                return;
            }
            this.idx = 0;
        }

        super.onBackSuccess();
    }

    private onGuideTween() {

    }

    private onRefreshPos() {
        if (!this._posStr[this.idx])
            return;
        var posStr = this._posStr[this.idx].split("_");
        if (posStr.length > 1) {
            this.lineGroup.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
            this.lineGroup.y = Math.floor(this.height * (parseInt(posStr[1]) / 100)) - 450;
            // this.handAni = new Animation('kuosan', -1);
            // this.handAni.scaleX = 1;
            // this.handAni.scaleY = 1;
            // this.handAni.x = this.lineGroup.x - 122; //this.guideImg.x + 296;// - this.groupClick.width / 2;
            // this.handAni.y = this.lineGroup.y + 385; //this.guideImg.y + 198;// - this.groupClick.height / 2;
            // this.groupBG.addChild(this.handAni);
            // this.handAni.onPlay();
            // if (this.handAni) {
            // 	this.handAni.parent.removeChild(this.handAni);
            // 	this.handAni.onDestroy();
            // 	this.handAni = null;
            // }
            // this.handAni = new Animation('kuosan', -1);
            // this.handAni.scaleX = 1.28;
            // this.handAni.scaleY = 1.28;
            // this.handAni.x = -63; //this.guideImg.x + 296;// - this.groupClick.width / 2;
            // this.handAni.y = -65; //this.guideImg.y + 198;// - this.groupClick.height / 2;
            // this.groupClick1.addChild(this.handAni);
            // this.handAni.onPlay();

        }
    }

    private initTimeInfo() {
        if (this.isTimeVisible) {
            this.share = new egret.Shape();
            // if (this.model.id == 75) {
            // 	this.share.x = 133 / 2;
            // 	this.share.y = 438 + 133 / 2;
            // 	this.drawArc(this.share, 0, this.maxTime, 300);
            // 	this.timeImg2.parent.addChild(this.share);
            // 	this.timeImg2.mask = this.share;
            // }
            // else {
            // 	this.share.x = 175 / 2;
            // 	this.share.y = 175 / 2;
            // 	this.drawArc(this.share, this.runTime, this.maxTime, 300);
            // 	this.timeImg.parent.addChild(this.share);
            // 	this.timeImg.mask = this.share;
            // }
            var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
            this.desc1.text = hdCfg.des;
            // this.timeBar.slideDuration = 0;
            // this.timeBar.maximum = this.maxTime;
            // this.timeBar.value = 0;//this.maxTime;

            this.timeBar1.maximum = this.maxTime;
            this.timeBar1.slideDuration = 0;
            this.timeBar1.value = this.maxTime;

            this.timeBar2.slideDuration = 0;
            this.timeBar2.maximum = this.maxTime;
            this.timeBar2.value = this.maxTime;
            // this.share1 = new egret.Shape();
            // this.share1.x = this.timeImg.x + this.timeImg.width / 2;
            // this.share1.y = this.timeImg.y + this.timeImg.height / 2;
            // this.drawArc(this.share1, this.runTime, this.maxTime, this.timeImg1.width)
            // this.share.alpha = 0.7;
            // this.timeImg1.mask = this.share1;
        } else {
            this.timeImg.visible = false;
            this.timeImg2.visible = false;
            // this.timeImg1.visible = false;
        }
    }

    private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
        var r = wd / 2 - 50;
        shape.graphics.clear();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(0, -r);//画线到弧的起始点
        shape.graphics.drawArc(0, 0, r, (0 - 90) * Math.PI / 180, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
        shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
        shape.graphics.endFill();
    }

    private onEventOut() {
        if (this.isComp)
            return;
        if (this.model.id == 75) {
            return;
        }
        if (this.model.id == 17) {
            this.onBackSuccess();
            return;
        }
        this.onBackFail();
        if (GuideManager.getInstance().isGuide) {
            GuideManager.getInstance().isGuide = false;
            this.guideImg.visible = false;
            GuideManager.getInstance().curState = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), '');
            super.stopRun();
        }
        if (this.handAni) {
            this.handAni.parent.removeChild(this.handAni);
            this.handAni.onDestroy();
            this.handAni = null;
        }
    }

    // private sd: egret.Sound
    private onEventClick() {
        this.isComp = true;
        this.onBackSuccess();

        if (this.model.id == 75) {
            // this.drawArc(this.share, this.maxTime - this.runTime, this.maxTime, 300);
            // this.drawArc(this.share, this.idx, this.tanqinNum, 300);
            // if (this.handAni) {
            // 	this.handAni.parent.removeChild(this.handAni);
            // 	this.handAni.onDestroy();
            // 	this.handAni = null;
            // 	this.timeBar.visible = false;
            // }
            return;
            // this.sd.close();
            // if (this.isLoadComplete) {
            // this.sd.play(0, 1);

            // }
            // this.isLoadComplete = true;
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
        // if (this.model.id == 17) {
        // 	this.onExit();
        // 	return;
        // }
        if (res == 'miss') {
            this.onExit();
            return;
        }
        if (this.model.id == 75) {
            this.groupBG.removeChildren();
            let ani1: Animation = new Animation(res);
            // ani1.setFinishCallBack(this.onExit, this);
            ani1.x = this.lineGroup.x;// - this.groupClick.width / 2;
            ani1.y = this.lineGroup.y + 477;// - this.groupClick.height / 2;
            if (res == 'lingxing_effect') {
                ani1.scaleX = 0.7;
                ani1.scaleY = 0.7;
            }
            // ActionManager.getInstance().addEffect(ani);
            this.groupBG.addChild(ani1);
            var obj = this;
            if (this.model.id == 75) {
                if (this.idx + 1 >= this.tanqinNum) {
                    Tool.callbackTime(function () {
                        obj.onExit();
                    }, this, 200);
                }
            }
            ani1.onPlay();
            SoundManager.getInstance().playSound(this.soundSrc[this.idx]);
            if (this.idx + 1 <= this.tanqinNum) {
                this.idx = this.idx + 1;
                this.onRefreshPos();
            }
            return;
        }
        let ani: Animation = new Animation(res);
        ani.setFinishCallBack(this.onExit, this);
        if (res == 'lingxing_effect') {
            ani.scaleX = 0.8;
            ani.scaleY = 0.8;
        }
        ani.x = this.groupClick.x;// - this.groupClick.width / 2;
        ani.y = this.groupClick.y;// - this.groupClick.height / 2;

        // ActionManager.getInstance().addEffect(ani);
        this.groupBG.addChild(ani);
        ani.onPlay();
    }

    private onExit() {
        if (this.parent)
            this.parent.removeChild(this);
    }
}
