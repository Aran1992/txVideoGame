class ActionNewMusic extends ActionSceneBase {
    public scale: number;
    private controlers;
    private touchChecks: boolean[];
    private datas: egret.Rectangle[];
    private currIdx: number;
    private successCount: number;
    private timeAll: number;
    private isFinish: boolean;
    private guideImg: eui.Group;
    private handImg: eui.Image;
    private groupBG: eui.Group;
    private timeImg3: eui.Image;
    private timeImg2: eui.Image;
    private timeImg1: eui.Image;
    private timeImg0: eui.Image;
    private handAni: my.Animation;
    private huxiFactory: egret.MovieClipDataFactory;
    private mcFactory: egret.MovieClipDataFactory;
    private share0: egret.Shape;
    private share1: egret.Shape;
    private share2: egret.Shape;
    private share3: egret.Shape;
    private isRun: boolean;
    private curGroup: eui.Group;
    private isMcResult: boolean;
    private curPerfect: eui.Image;
    private mcResult: egret.MovieClip;
    private runIdx: number = 0;
    private oldIdx: number = 0;
    private mTim: number = 0;
    private chajia: number = 0;
    private curTime: number = 0;
    private moveUp: boolean;
    private start_posY: number;

    public onSuccessItem(idx: number) {
        this.touchChecks[idx] = true;
        if (GuideManager.getInstance().isGuide) {
            GuideManager.getInstance().isGuide = false;
            this.guideImg.visible = false;
            GuideManager.getInstance().curState = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), '');
            // this.handImg.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
            super.startRun();
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionNewMusicSkin;
    }

    protected onInit(): void {
        super.onInit();
        let count = 2;
        this.controlers = [];
        this.scale = 1;
        for (let i = 0; i < 2; ++i) {
            this.controlers[i] = i;
            this['groupClick' + i].name = i + '';
            this['groupClick' + i].touchEnabled = false;
            this['liangdi' + i].visible = false;
            this['groupClick' + i].touchChildren = false;
            this['groupClick' + i].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventMusic, this);
        }


        this.successCount = parseInt(this.paramList[3]);
        this.datas = [];
        this.touchChecks = [];
        for (let i = 4; i < this.paramList.length; ++i) {
            let posStr = this.paramList[i].split("_");
            if (posStr.length > 0) {
                this.datas.push(new egret.Rectangle(parseInt(posStr[0]), parseInt(posStr[1]), parseInt(posStr[2]), 0));
                this.touchChecks.push(false);
            }

        }
        this.start_posY = this.handImg.y;
        this.moveUp = false;
        this.timeAll = 0;
        this.currIdx = 0;
        this.initTimeInfo();
    }

    protected update(dt): void {
        if (this.isVideoRun) {
            super.update(dt);
            this.updateData(dt);
            for (let i = 0; i < this.controlers.length; ++i) {
            }
        }
    }

    // }
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

    private initTimeInfo() {

        for (var i: number = 0; i < 2; i++) {
            this['share' + i] = new egret.Shape();
            // if (i == 0) {
            // 	this.drawArc(this['share' + i], 980, 980, 300);

            // }
            // else {
            this.drawArc(this['share' + i], 0, 1000, 300);
            // }

            this['groupClick' + i].addChild(this['share' + i]);
            this['share' + i].x = 193 / 2;
            this['share' + i].y = 193 / 2;
        }
        this.timeImg0.mask = this.share0;
        this.timeImg1.mask = this.share1;
        // this.timeImg2.mask = this.share2;
        // this.timeImg3.mask = this.share3;
    }

    private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
        var r = wd / 2;
        shape.graphics.clear();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(0, -r);//画线到弧的起始点
        shape.graphics.drawArc(0, 0, r, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
        shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
        shape.graphics.endFill();
    }

    private onEventMusic(event: egret.TouchEvent) {
        this.curGroup = this['groupClick' + event.currentTarget.name];
        this.curPerfect = this['perfect' + event.currentTarget.name];
        if (this.isRun) {
            // GameCommon.getInstance().shock();
            if (this.handAni) {
                this.handAni.parent.removeChild(this.handAni);
                this.handAni.onDestroy();
                this.handAni = null;
            }
            this.curGroup.touchEnabled = false;
            this.curGroup.touchChildren = false;
            this['liangdi' + event.currentTarget.name].visible = false;
            this['share' + event.currentTarget.name].visible = false;
            this.onSuccessItem(this.runIdx);
            this.playMCResult(true);


        }
    }

    private playMCResult(isSuccess: boolean, num = 0) {
        if (!this.isMcResult) {
            this.isMcResult = true;
            if (isSuccess) {
                this.curPerfect.source = 'perfect_png';
                this.curPerfect.alpha = 0;
                var tw = egret.Tween.get(this.curPerfect);
                tw.to({alpha: 1}, 500);
                tw.to({alpha: 0}, 500);
            }
            this.mcResult = this.getMC(isSuccess ? "music_effect" : "miss", this.onMCFinishResult, this);
            SoundManager.getInstance().playSound(isSuccess?"hudong_bingo":"budong_miss")
            if (this.mcResult) {
                this.mcResult.gotoAndPlay(1, 1);
                this.mcResult.visible = true;
                this.mcResult.scaleX = 1;
                this.mcResult.scaleY = 1;
            }
            // if (this.mcHuXi) {
            // 	this.mcHuXi.stop();
            // 	this.mcHuXi.parent.removeChild(this.mcHuXi);
            // 	this.mcHuXi = null;
            // }
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
        this.curGroup.addChild(mc);
        mc.x = 193 / 2;
        mc.y = 193 / 2;
        mc.visible = true;
        return mc;
    }

    private onMCFinishResult() {
        this.mcResult.removeEventListener(egret.Event.COMPLETE, this.onMCFinishResult, this);
        this.mcResult.parent.removeChild(this.mcResult);
        this.mcResult.stop();
        this.mcResult = null;
        // this.curGroup.visible = false;
    }

    // private mcHuXi: egret.MovieClip;
    private setMusic(type: number, idx: number) {
        // if (this.mcHuXi) {
        // 	this.mcHuXi.stop();
        // 	this.mcHuXi.parent.removeChild(this.mcHuXi);
        // 	this.mcHuXi = null;
        // }
        if (this.curGroup) {
            if (this.handAni) {
                this.handAni.parent.removeChild(this.handAni);
                this.handAni.onDestroy();
                this.handAni = null;
            }
            this.curGroup.touchEnabled = false;
            this['liangdi' + this.curGroup.name].visible = false;
            this['share' + this.curGroup.name].visible = false;
            this.curGroup.touchChildren = false;
        }
        this.runIdx = idx;
        this.curGroup = this['groupClick' + type];
        this['liangdi' + type].visible = true;
        this['share' + type].visible = true;
        this.curGroup.touchEnabled = true;
        this.curGroup.touchChildren = true;
        // this.mcHuXi = this.getMC('huxi_effect');
        // this.mcHuXi.scaleX = 1.4;
        // this.mcHuXi.scaleY = 1.4;
        // if (this.mcHuXi) {
        // 	this.mcHuXi.gotoAndPlay(0, -1);
        // 	this.mcHuXi.play();
        // 	this.isMcResult = false;
        // }
        this.isMcResult = false;
        this.isRun = true;
    }
    // private onFrame(): void {
    // 	if (!this.moveUp) {
    // 		this.handImg.y -= 2;
    // 		if (this.handImg.y < this.start_posY) {
    // 			this.moveUp = true;
    // 		}
    // 	} else {
    // 		this.handImg.y += 2;
    // 		let s_ts: string[] = [];
    // 		for (var ky in s_ts) {
    // 			s_ts[ky] = '';
    // 		}
    // 		if (this.handImg.y > this.start_posY + 20) {
    // 			this.moveUp = false;
    // 		}
    // 	}

    private updateData(dt) {
        if (!this.isFinish) {
            this.timeAll += dt / 1000;
            this.curTime += dt;
            if (this.curGroup) {
                if (!this.curGroup.touchEnabled) {
                    this.drawArc(this['share' + this.curGroup.name], 0, 1000, 300);
                } else {
                    // if (this.datas[this.currIdx + 1])
                    if (this.model.id == '6') {
                        this.drawArc(this['share' + this.curGroup.name], this.mTim - this.runTime, 2000, 300);
                    } else {
                        if (this.datas[this.currIdx]) {
                            this.drawArc(this['share' + this.curGroup.name], this.curTime, this.datas[this.currIdx].width, 300);
                        }
                    }
                    // else
                    // this.drawArc(this['share' + this.curGroup.name], this.maxTime - this.runTime, 2000, 193);
                }
                // this.drawArc(this['share'+1], this.maxTime -this.runTime, this.datas[this.currIdx].x*1000, 193);
                // this.drawArc(this['share'+2], this.maxTime -this.runTime, this.datas[this.currIdx].x*1000, 193);
                // this.drawArc(this['share'+3], this.maxTime -this.runTime, this.datas[this.currIdx].x*1000, 193);
            }
            if (!this.datas[this.currIdx])
                return;
            if (this.currIdx < this.datas.length) {
                if (this.timeAll >= this.datas[this.currIdx].x) {
                    this.setMusic(this.datas[this.currIdx].y, this.currIdx);
                    ++this.currIdx;
                    this.curTime = 0;
                    this.mTim = this.runTime;
                    if (GuideManager.getInstance().isGuide && !GuideManager.getInstance().isComPleteMusic) {
                        this.drawArc(this['share' + 0], 980, 980, 300);
                        this.handAni = new my.Animation('effect_zhi', -1);
                        this.handAni.x = this.guideImg.x + 223;// - this.groupClick.width / 2;
                        this.handAni.y = this.guideImg.y - 138;// - this.groupClick.height / 2;
                        this.handAni.scaleY = -1;
                        this.guideImg.parent.addChild(this.handAni);
                        this.handAni.onPlay();

                        // if (this['groupClick0'].alpha >= 1 || this['groupClick1'].alpha >= 1) {
                        GuideManager.getInstance().curState = true;
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'stop');
                        super.stopRun();
                        this.moveUp = false;
                        // this.handImg.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
                        this.guideImg.visible = true;
                        GuideManager.getInstance().isComPleteMusic = true;
                        return;
                        // }
                    }
                }
            } else {
                this['liangdi0'].visible = false;
                this['share0'].visible = false;
                this['liangdi1'].visible = false;
                this['share1'].visible = false;
                this.isFinish = false;
            }
        }
    }
}
