class ActionSlide extends ActionSceneBase {
    // private imgArrow: eui.Group;
    private groupHand: eui.Group;
    private groupTouch: eui.Group;
    private posList: egret.Point[];
    private mainGroup: eui.Group;
    // private posIdx: number;
    private tipsGroup: eui.Group;
    private dangaoGroup: eui.Group;
    private curGroup: eui.Group;
    // private imgArrow1: eui.Group;
    private curImg: eui.Image;
    // private handImg: eui.Image;
    private touchList: boolean[];
    private isFinish: boolean;
    // private timeBar: eui.ProgressBar;
    // private handImg1: eui.Image;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;

    private starPosX: number = 0;
    private starPosY: number = 0;
    private handMoveDis: number[];
    private handAni: Animation;
    private x_move_ok: boolean = false;
    private y_move_ok: boolean = false;

    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }

    public exit() {
        egret.Tween.removeTweens(this.curGroup);
        super.exit();
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionSlideSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.touchList = [false];
        // this.posIdx = -1;
        this.posList = [];
        this.tipsGroup.visible = false;
        for (let i = 3; i < this.paramList.length; ++i) {
            let posStr = this.paramList[i].split("_");
            this.posList.push(new egret.Point(parseInt(posStr[0]), parseInt(posStr[1])));
        }
        this.initTimeInfo();
        this.groupHand.visible = false;
        this.dangaoGroup.visible = false;
        if (this.model.id == "32" || this.model.id == "73" || this.model.id == "60") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new Animation('effect_shanghuadong', -1);
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [0, -100];
        } else if (this.model.id == "58") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new Animation('effect_motou2', -1);
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [100, 50];
        } else if (this.model.id == "54") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new Animation('effect_kaimen', -1);
            this.handAni.scaleX = -1;
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [100, 0];
        } else if (this.model.id == "45") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new Animation('effect_motou3', -1);
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [50, 0];
        } else {
            this.curGroup = this.groupHand;
            this.groupHand.anchorOffsetX = this.groupHand.width / 2;
            this.groupHand.anchorOffsetY = this.groupHand.height / 2;
            this.handAni = new Animation('effect_kaimen', -1);
            this.handAni.x = 200;
            this.handAni.y = 100;
            this.groupHand.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [-100, 0];
        }
        this.isFinish = false;
        this.curGroup.visible = true;
        this.curGroup.touchEnabled = true;
        let posX: number = this.posList[this.posList.length - 1].x;
        let posY: number = this.posList[this.posList.length - 1].y;
        this.curGroup.x = Math.floor(posX * (size.width / GameDefine.GAME_VIEW_WIDTH));
        this.curGroup.y = Math.floor(posY * (size.height / GameDefine.GAME_VIEW_HEIGHT));
        this.curGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);
    }

    protected update(dt): void {
        super.update(dt);
        if (this.model.type == 4) {
            if (Number(VideoManager.getInstance().videoLastTime().toFixed(2)) < 2.6) {
                GuideManager.getInstance().curState = true;
                this.tipsGroup.visible = true;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'stop');
                super.stopRun();
            }
        }
        this.timeBar2.value = this.runTime;
        this.timeBar1.value = this.runTime;
        // this.timeBar.value = this.runTime//this.maxTime - this.runTime;
        // this.drawArc(this.share, this.maxTime - this.runTime, this.maxTime, 300);
    }

    private onComplete() {
        var obj = this;
        obj.handAni.onStop();
        // obj.handAni.removeEventListener(egret.Event.COMPLETE, this.onMCFinishResult, this);
        // obj.handAni.parent.removeChild(this.handAni);
        // obj.handAni.stop();
        // this.mcResult = null;
        Tool.callbackTime(function () {
            obj.handAni.onPlay();
            console.log('重新播放');
        }, obj, 500);
    }

    // private share: egret.Shape;
    private initTimeInfo() {
        // var img: eui.Image;
        // if (this.model.id == '32') {
        // 	img = this['timeImg'];
        // }
        // else {
        // 	img = this['menTime'];
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

        // this.timeBar.maximum = this.maxTime;
        // this.timeBar.slideDuration = 0;
        // this.timeBar.value = this.maxTime;
        // this.share = new egret.Shape();
        // this.share.x = 133 / 2;
        // this.share.y = 133 / 2;
        // this.drawArc(this.share, this.runTime, this.maxTime, 300);
        // img.parent.addChild(this.share);
        // img.mask = this.share;
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

    private onEventDown(event: egret.TouchEvent) {
        if (!this.isFinish) {
            this.starPosX = event.stageX;
            this.starPosY = event.stageY;
        }
    }

    private onEventMove(event: egret.TouchEvent) {
        if (!this.isFinish) {
            let moveX_gap: number = this.handMoveDis[0];
            let moveY_gap: number = this.handMoveDis[1];

            if (!this.x_move_ok) {
                if (moveX_gap >= 0) {//向下
                    if (event.stageX - this.starPosX >= moveX_gap) {
                        this.x_move_ok = true;
                    }
                } else {//向上
                    if (event.stageX - this.starPosX <= moveX_gap) {
                        this.x_move_ok = true;
                    }
                }
            }
            if (!this.y_move_ok) {
                if (moveY_gap >= 0) {//向下
                    if (event.stageY - this.starPosY >= moveY_gap) {
                        this.y_move_ok = true;
                    }
                } else {
                    if (event.stageY - this.starPosY <= moveY_gap) {
                        this.y_move_ok = true;
                    }
                }
            }

            if (this.x_move_ok && this.y_move_ok) {
                this.touchList[0] = true;
            }
            this.checkResult();
        }
    }

    private checkResult() {
        for (let i = 0; i < 1; ++i) {
            if (!this.touchList[i]) {
                return;
            }
        }
        if (this.handAni) {
            this.handAni.parent.removeChild(this.handAni);
            this.handAni.onDestroy();
            this.handAni = null;
        }
        if (this.tipsGroup.visible) {
            GuideManager.getInstance().isGuide = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'start');
            super.startRun();
        }

        // GameCommon.getInstance().shock();
        this.isFinish = true;
        this.onBackSuccess();
    }
}
