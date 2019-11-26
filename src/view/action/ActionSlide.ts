class ActionSlide extends ActionSceneBase {
    private groupHand: eui.Group;
    private posList: egret.Point[];
    private tipsGroup: eui.Group;
    private dangaoGroup: eui.Group;
    private curGroup: eui.Group;
    private touchGroup: eui.Group;
    private touchList: boolean[];
    private isFinish: boolean;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;

    private starPosX: number = 0;
    private starPosY: number = 0;
    private handMoveDis: number[];
    private handAni: my.Animation;
    private x_move_ok: boolean = false;
    private y_move_ok: boolean = false;

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
            this.handAni = new my.Animation('effect_shanghuadong', -1);
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [0, -100];
        } else if (this.model.id == "58") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new my.Animation('effect_motou2', -1);
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [100, 50];
        } else if (this.model.id == "54") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new my.Animation('effect_kaimen', -1);
            this.handAni.scaleX = -1;
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [100, 0];
        } else if (this.model.id == "45") {
            this.curGroup = this.dangaoGroup;
            this.handAni = new my.Animation('effect_motou3', -1);
            this.dangaoGroup.addChild(this.handAni);
            this.handAni.onPlay();
            this.handMoveDis = [100, -100];
        } else {
            this.curGroup = this.groupHand;
            this.groupHand.anchorOffsetX = this.groupHand.width / 2;
            this.groupHand.anchorOffsetY = this.groupHand.height / 2;
            this.handAni = new my.Animation('effect_kaimen', -1);
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
        this.touchGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.touchGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);
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
    }

    private initTimeInfo() {
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        this.desc1.text = hdCfg.des;

        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.slideDuration = 0;
        this.timeBar1.value = this.maxTime;

        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
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

        this.isFinish = true;
        this.onBackSuccess();
    }
}
