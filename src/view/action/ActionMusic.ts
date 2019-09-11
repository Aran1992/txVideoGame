class ActionMusic extends ActionSceneBase {
    public timeBar1: eui.ProgressBar;
    public timeBar2: eui.ProgressBar;
    private controllers: MusicController[];
    private touchChecks: boolean[];
    private datas: egret.Rectangle[];
    private currIdx: number;
    private successCount: number;
    private timeAll: number;
    private isFinish: boolean;
    private guideImg: eui.Group;
    private desc1: eui.Label;
    private heiping: eui.Image;

    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }

    public onSuccessItem(idx: number) {
        this.touchChecks[idx] = true;
        if (GuideManager.getInstance().isGuide) {
            // if (this.handAni) {
            // 	this.handAni.parent.removeChild(this.handAni);
            // 	this.handAni.onDestroy();
            // 	this.handAni = null;
            // }
            GuideManager.getInstance().isGuide = false;
            this.guideImg.visible = false;
            this.heiping.visible = false;
            GuideManager.getInstance().curState = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), '');
            super.startRun();
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionNewMusicSkin;
    }

    // private handAni: Animation;
    protected onInit(): void {
        super.onInit();
        let count = 2;
        this.controllers = [];
        for (let i = 0; i < count; ++i) {
            this.controllers[i] = new MusicController(this, i);
        }

        this.successCount = parseInt(this.paramList[3]);
        this.datas = [];
        this.touchChecks = [];
        for (let i = 4; i < this.paramList.length; ++i) {
            let posStr = this.paramList[i].split("_");
            this.datas.push(new egret.Rectangle(parseInt(posStr[0]), parseInt(posStr[1]), parseInt(posStr[2]), 0));
            this.touchChecks.push(false);
        }
        this.timeAll = 0;
        this.currIdx = 0;
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
        // this.timeBar.maximum = this.maxTime;
    }

    protected update(dt): void {
        if (this.isVideoRun) {
            super.update(dt);
            this.updateData(dt);
            for (let i = 0; i < this.controllers.length; ++i) {
                this['groupClick0'].visible = true;
                this['groupClick1'].visible = true;
                // this.handAni = new Animation('effect_zhi', -1);
                // this.handAni.x = this.guideImg.x + 223;// - this.groupClick.width / 2;
                // this.handAni.y = this.guideImg.y - 138;// - this.groupClick.height / 2;
                // this.handAni.scaleY = -1;
                // this.guideImg.parent.addChild(this.handAni);
                // this.handAni.onPlay();
                if (this.currIdx > 0 && GuideManager.getInstance().isGuide && !GuideManager.getInstance().isComPleteMusic) {
                    this.guideImg.visible = true;
                    this.heiping.visible = true;
                    GuideManager.getInstance().curState = true;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'stop');
                    super.stopRun();
                    GuideManager.getInstance().isComPleteMusic = true;
                } else {
                    this.controllers[i].update(dt);
                }
            }
        }
    }

    protected onBackFail() {
        let count = 0;
        for (let i = 0; i < this.touchChecks.length; ++i) {
            if (this.touchChecks[i]) {
                ++count;
            }
        }
        if (count < this.successCount) {
            super.onBackFail();
        } else {
            super.onBackSuccess();
        }
    }

    private setMusic(type: number, edtime: number, idx: number) {
        this.controllers[type].setRun(idx, edtime);
    }

    private updateData(dt) {
        if (!this.isFinish) {
            this.timeAll += dt / 1000;
            if (this.currIdx < this.datas.length) {
                if (this.timeAll >= this.datas[this.currIdx].x) {
                    this.setMusic(this.datas[this.currIdx].y, this.datas[this.currIdx].width, this.currIdx);
                    ++this.currIdx;
                }
            } else {
                this.isFinish = false;
            }
        }
    }
}

class MusicController {
    public scale: number;
    private actionMusic: ActionMusic;
    private groupClick: eui.Group;
    private isRun: boolean;
    private runIdx: number;
    private mcFactory: egret.MovieClipDataFactory;
    private mcResult: egret.MovieClip;
    private isMcResult: boolean;
    private _index: number;
    private liangdi: eui.Image;
    private tw;
    private share: egret.Shape;
    private handAni: my.Animation;
    private curTime: number = 0;
    private endTime: number = 0;

    public constructor(actionMusic: ActionMusic, idx: number) {
        this.actionMusic = actionMusic;
        this.groupClick = actionMusic["groupClick" + idx];
        this.liangdi = actionMusic["liangdi" + idx];
        // this.groupClick.visible = true;
        this.scale = 1;
        this.isRun = false;
        this._index = idx;
        this.share = new egret.Shape();
        // this.drawArc(this.share, 0, 1000, 300);
        this.groupClick.addChild(this.share);
        this.share.x = 193 / 2;
        this.share.y = 193 / 2;
        this.curTime = 0;
        this.actionMusic["timeImg" + idx].mask = this.share;
        this.isMcResult = false;
        this.groupClick.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventMusic, this);
    }

    public setRun(idx: number, edTime: number) {
        this.mcFactory = null;
        this.runIdx = idx;
        this.scale = 1;
        this.endTime = edTime;
        this.actionMusic.timeBar1.maximum = this.endTime;
        this.actionMusic.timeBar2.maximum = this.endTime;
        this.actionMusic.timeBar1.value = this.endTime;
        this.actionMusic.timeBar2.value = this.endTime;
        this.isMcResult = false;
        this.isRun = true;
        this.share.visible = true;
        this.curTime = 0;
        this.liangdi.visible = true;

        this.handAni = new my.Animation('music_kuosan', -1);
        this.handAni.scaleX = 1;
        this.handAni.scaleY = 1;
        this.handAni.x = 100; //this.guideImg.x + 296;// - this.groupClick.width / 2;
        this.handAni.y = 100; //this.guideImg.y + 198;// - this.groupClick.height / 2;
        this.groupClick.addChild(this.handAni);
        this.handAni.onPlay();
    }

    // private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
    // 	var r = wd / 2;
    // 	shape.graphics.clear();
    // 	shape.graphics.beginFill(0xFFFFFF);
    // 	shape.graphics.moveTo(0, 0);
    // 	shape.graphics.lineTo(0, -r);//画线到弧的起始点
    // 	shape.graphics.drawArc(0, 0, r, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
    // 	shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
    // 	shape.graphics.endFill();

    public update(dt) {
        if (this.isRun) {
            this.curTime += dt;
            if (this.curTime >= this.endTime) {
                this.isRun = false;
                this.playMCResult(false);
                this.closeRun();
            } else {
                // this.drawArc(this.share, this.curTime, this.endTime, 300);
                // this.actionMusic.timeBar.value = this.curTime;
                this.actionMusic.timeBar1.value = this.endTime - this.curTime;
                this.actionMusic.timeBar2.value = this.endTime - this.curTime;
            }
        }
    }

    private initMC() {
        // if(this.mcFactory)
        // return;
        // this.mcFactory = new egret.MovieClipDataFactory();
        // this.mcAlert = this.getMC("tishi");
        // this.mcAlert.gotoAndPlay(1, -1);
        // this.mcAlert.visible = true;
    }

    private getMC(resName: string, listener: Function = null, thisObject: any = null): egret.MovieClip {
        if (!this.mcFactory) {
            this.mcFactory = new egret.MovieClipDataFactory();
        }
        this.mcFactory.clearCache();
        this.mcFactory.mcDataSet = RES.getRes(resName + "_json");
        this.mcFactory.texture = RES.getRes(resName + "_png");
        let mc: egret.MovieClip = new egret.MovieClip();
        mc.movieClipData = this.mcFactory.generateMovieClipData("action");
        if (listener) {
            mc.addEventListener(egret.Event.COMPLETE, listener, thisObject);
        }
        this.groupClick.addChildAt(mc, 1);
        mc.x = 193 / 2;
        mc.y = 193 / 2;
        mc.visible = false;
        return mc;
    }

    private onMCFinishResult() {
        this.mcResult.removeEventListener(egret.Event.COMPLETE, this.onMCFinishResult, this);
        this.mcResult.parent.removeChild(this.mcResult);
        this.mcResult.stop();
        this.mcResult = null;
    }

    private playMCResult(isSuccess: boolean, num = 0) {
        if (!this.isMcResult) {
            this.isMcResult = true;
            // this.drawArc(this.share, 0, 1000, 0);
            // this.actionMusic.timeBar.value = 0;
            this.actionMusic.timeBar1.maximum = this.endTime;
            this.actionMusic.timeBar2.maximum = this.endTime;
            this.actionMusic.timeBar1.value = this.endTime;
            this.actionMusic.timeBar2.value = this.endTime;
            this.mcResult = this.getMC('music_effect', this.onMCFinishResult, this);
            if (this.mcResult) {
                this.mcResult.gotoAndPlay(1, 1);
                this.mcResult.visible = true;
            }
            // let goodAnim: Animation = new Animation("good_panding", 1, true);
            // this.groupClick.parent.addChild(goodAnim);
            // goodAnim.x = this.groupClick.x + 96;
            // goodAnim.y = this.groupClick.y - 50;
        }
    }

    // }
    private onEventMusic(event: egret.TouchEvent) {
        if (this.isRun) {
            // if (GuideManager.getInstance().isGuide) {
            this.actionMusic.onSuccessItem(this.runIdx);
            // }
            this.liangdi.scaleX = this.liangdi.scaleY = 0.9;
            Tool.callbackTime(this.closeRun, this, 100);
            // this.closeRun();
            this.playMCResult(true);
        }
    }

    private closeRun() {
        this.liangdi.scaleX = this.liangdi.scaleY = 1;
        this.liangdi.visible = false;
        // this.drawArc(this.share, 0, 1000, 0);
        if (this.handAni) {
            this.handAni.parent.removeChild(this.handAni);
            this.handAni.onDestroy();
            this.handAni = null;
        }
        // this.actionMusic.timeBar.visible = false;
        this.isRun = false;
    }

}
