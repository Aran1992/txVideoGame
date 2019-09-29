class ActionMusic extends ActionSceneBase {
    public timeBar1: eui.ProgressBar;
    public timeBar2: eui.ProgressBar;
    private controllers: MusicController[];
    private touchChecks: boolean[];
    private clickList: { groupIndex: number, startTime: number, duration: number }[];
    private clickIndex: number;
    private timeAll: number;
    private totalCount: number;
    private isFinish: boolean;
    private guideImg: eui.Group;
    private desc1: eui.Label;
    private heiping: eui.Image;
    private hand: eui.Image;

    public onSuccessItem(idx: number) {
        this.touchChecks[idx] = true;
        if (GuideManager.getInstance().isGuide) {
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

    protected onInit(): void {
        super.onInit();
        let count = 2;
        this.controllers = [];
        for (let i = 0; i < count; ++i) {
            this.controllers[i] = new MusicController(this, i);
        }

        this.totalCount = this.paramList.length - 3;
        this.clickList = [];
        this.touchChecks = [];
        for (let i = 3; i < this.paramList.length; ++i) {
            let params = this.paramList[i].split("_").map(i => parseInt(i));
            this.clickList.push({startTime: params[0], groupIndex: params[1], duration: params[2],});
            this.touchChecks.push(false);
        }
        this.timeAll = 0;
        this.clickIndex = 0;
        this.desc1.text = JsonModelManager.instance.getModelhudong()[this.model.type].des;

        this.timeBar1.slideDuration = 0;
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.value = this.maxTime;

        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;

        const f = () => {
            egret.Tween.get(this.hand)
                .to({y: this.hand.y + 50}, 500, egret.Ease.sineIn)
                .to({y: this.hand.y}, 500, egret.Ease.sineInOut)
                .call(f);
        };
        f();
    }

    protected update(dt): void {
        if (this.isVideoRun) {
            super.update(dt);
            this.updateData(dt);
            for (let i = 0; i < this.controllers.length; ++i) {
                this['groupClick0'].visible = true;
                this['groupClick1'].visible = true;
                if (this.clickIndex > 0 && GuideManager.getInstance().isGuide && !GuideManager.getInstance().isComPleteMusic) {
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
        let count = this.touchChecks.filter(check => check).length;
        let answerID = 0;
        if (count === 0) {
            answerID = 3
        } else if (count === this.totalCount) {
            answerID = 1;
        } else {
            answerID = 2;
        }
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.ONSHOW_VIDEO),
            {
                answerId: answerID,
                wentiId: this.model.id,
                click: 1
            }
        );
        this.exit();
    }

    private setMusic(groupIndex: number, duration: number, clickIndex: number) {
        this.controllers[groupIndex].setRun(clickIndex, duration);
    }

    private updateData(dt) {
        if (!this.isFinish) {
            this.timeAll += dt / 1000;
            if (this.clickIndex < this.clickList.length) {
                const click = this.clickList[this.clickIndex];
                if (this.timeAll >= click.startTime) {
                    this.setMusic(click.groupIndex, click.duration, this.clickIndex);
                    ++this.clickIndex;
                }
            } else {
                this.isFinish = false;
            }
        }
    }
}

class MusicController {
    private actionMusic: ActionMusic;
    private groupClick: eui.Group;
    private light: eui.Image;
    private dark: eui.Image;
    private readonly good: eui.Image;
    private readonly miss: eui.Image;
    private mcFactory: egret.MovieClipDataFactory;
    private mcResult: egret.MovieClip;
    private isActive: boolean = false;
    private runIdx: number;
    private isMcResult: boolean = false;
    private index: number;
    private curTime: number = 0;
    private duration: number = 0;
    private readonly lightStartY: number;
    private readonly resultImageStartY: number;

    public constructor(actionMusic: ActionMusic, idx: number) {
        this.actionMusic = actionMusic;
        this.groupClick = actionMusic["groupClick" + idx];
        this.light = actionMusic["light" + idx];
        this.dark = actionMusic["dark" + idx];
        this.good = actionMusic["good" + idx];
        this.miss = actionMusic["miss" + idx];
        this.light.visible = false;
        this.dark.visible = true;
        this.good.alpha = 0;
        this.miss.alpha = 0;
        this.lightStartY = this.light.y;
        this.resultImageStartY = this.good.y;
        this.index = idx;
        this.groupClick.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventMusic, this);
    }

    public setRun(idx: number, duration: number) {
        this.runIdx = idx;
        this.isActive = true;
        this.isMcResult = false;
        this.mcFactory = null;
        this.duration = duration;
        this.actionMusic.timeBar1.maximum = this.actionMusic.timeBar2.maximum = this.duration;
        this.actionMusic.timeBar1.value = this.actionMusic.timeBar2.value = this.duration;
        this.curTime = 0;
        this.dark.visible = false;
        this.light.visible = true;
        this.light.y = this.lightStartY;
    }

    public update(dt) {
        if (this.isActive) {
            this.curTime += dt;
            if (this.curTime >= this.duration) {
                this.isActive = false;
                this.playMCResult();
                this.playPopupAni(this.miss);
            } else {
                this.actionMusic.timeBar1.value = this.actionMusic.timeBar2.value = this.duration - this.curTime;
            }
        }
    }

    private onEventMusic() {
        if (this.isActive) {
            this.isActive = false;
            this.playMCResult();
            egret.Tween.get(this.light)
                .to({y: this.lightStartY + 20}, 100, egret.Ease.sineInOut)
                .to({y: this.lightStartY}, 50, egret.Ease.quartOut)
                .call(() => {
                    this.light.visible = false;
                    this.dark.visible = true;
                });
            this.playPopupAni(this.good);
            this.actionMusic.onSuccessItem(this.runIdx);
        }
    }

    private playMCResult() {
        if (!this.isMcResult) {
            this.isMcResult = true;
            this.actionMusic.timeBar1.maximum
                = this.actionMusic.timeBar2.maximum
                = this.actionMusic.timeBar1.value
                = this.actionMusic.timeBar2.value
                = this.duration;
            this.mcResult = this.getMC('music_effect', this.onMCFinishResult, this);
            if (this.mcResult) {
                this.mcResult.gotoAndPlay(1, 1);
                this.mcResult.visible = true;
            }
        }
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

    private playPopupAni(image) {
        image.y = this.resultImageStartY + 20;
        image.alpha = 0;
        egret.Tween.removeTweens(image);
        egret.Tween.get(image)
            .to({alpha: 1, y: this.resultImageStartY}, 100)
            .wait(500)
            .to({alpha: 0, y: this.resultImageStartY - 40}, 100);
    }
}
