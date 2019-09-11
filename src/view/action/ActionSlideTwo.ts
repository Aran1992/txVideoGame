class ActionSlideTwo extends ActionSceneBase {
    private posList: egret.Point[];
    private touchList: boolean[];
    private isFinish: boolean;

    private leftGroup: eui.Group;
    private rightGroup: eui.Group;
    private desc: eui.Label;
    // private timeBar: eui.ProgressBar;
    private handAni: Animation;
    private handAni1: Animation;
    private hand1MoveDis: number[];
    private hand2MoveDis: number[];
    private starPosX1: number;
    private starPosY1: number;
    private starPosX2: number;
    private starPosY2: number;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private touchLeft_Grp: eui.Group;
    private touchRight_Grp: eui.Group;
    private timeImg1: eui.Image;
    private timeImg2: eui.Image;
    private share1: egret.Shape;
    private share2: egret.Shape;
    private x_move_ok: boolean = false;
    private y_move_ok: boolean = false;
    private x2_move_ok: boolean = false;
    private y2_move_ok: boolean = false;

    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionSlideTwoSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.posList = [];
        this.touchList = [false, false];
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.slideDuration = 0;
        this.timeBar1.value = this.maxTime;
        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;

        switch (this.model.id) {
            case 29://从下往上滑动
                this.handAni = new Animation('effect_shanghuadong', -1);
                this.handAni1 = new Animation('effect_shanghuadong', -1);
                this.handAni.y = -150;
                this.handAni1.y = -150;
                this.handAni1.scaleX = -1;
                this.hand1MoveDis = [0, -50];
                this.hand2MoveDis = [0, -50];
                break;
            case 36://从内往里滑动
            case 39:
            case 56:
                this.handAni = new Animation('effect_shanghuadong', -1);
                this.handAni1 = new Animation('effect_shanghuadong', -1);
                this.handAni.y = 830;
                this.handAni1.y = 830;
                this.handAni1.scaleX = -1;
                this.rightGroup.rotation = 90;
                this.leftGroup.rotation = 270;
                this.hand1MoveDis = [50, 0];
                this.hand2MoveDis = [-50, 0];
                break;
            case 71:
                this.handAni = new Animation('effect_motou2', -1);
                this.handAni.rotation = 270;
                this.handAni1 = new Animation('effect_motou2', -1);
                this.handAni1.rotation = 90;
                // this.handAni1.scaleX = this.handAni1.scaleY =this.handAni.scaleX = this.handAni.scaleY = 0.7;
                this.handAni.x = -920;
                this.handAni1.x = 920;
                this.handAni.y = -100;
                this.handAni1.y = -100;
                this.handAni1.scaleX = -1;
                this.handAni.scaleY = -1;
                this.handAni1.scaleY = -1;
                this.hand1MoveDis = [20, -50];
                this.hand2MoveDis = [-20, -50];
                break;
        }

        this.rightGroup.addChild(this.handAni);
        this.handAni.onPlay();
        this.leftGroup.addChild(this.handAni1);
        this.handAni1.onPlay();

        this.touchLeft_Grp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.touchLeft_Grp.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);
        this.touchLeft_Grp.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.touchRight_Grp.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown1, this);
        this.touchRight_Grp.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove1, this);
        this.touchRight_Grp.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd1, this);

        this.initTimeInfo();
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar1.value = this.runTime;
        this.timeBar2.value = this.runTime;
    }

    private initTimeInfo() {
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        if (hdCfg && hdCfg.des) {
            this.desc.text = hdCfg.des;
        }
    }

    private onEventDown(event: egret.TouchEvent) {
        if (!this.isFinish) {
            if (!egret.NumberUtils.isNumber(this.starPosX1)) this.starPosX1 = event.stageX;
            if (!egret.NumberUtils.isNumber(this.starPosY1)) this.starPosY1 = event.stageY;
        }
    }

    private onEventDown1(event: egret.TouchEvent) {
        if (!this.isFinish) {
            if (!egret.NumberUtils.isNumber(this.starPosX2)) this.starPosX2 = event.stageX;
            if (!egret.NumberUtils.isNumber(this.starPosY2)) this.starPosY2 = event.stageY;
        }
    }

    private onEventMove(event: egret.TouchEvent) {
        if (!this.isFinish) {
            let moveX_gap: number = this.hand1MoveDis[0];
            let moveY_gap: number = this.hand1MoveDis[1];

            if (!this.x_move_ok) {
                if (moveX_gap > 0) {//向下
                    if (event.stageX - this.starPosX1 >= moveX_gap) {
                        this.x_move_ok = true;
                    }
                } else if (moveX_gap < 0) {//向上
                    if (event.stageX - this.starPosX1 <= moveX_gap) {
                        this.x_move_ok = true;
                    }
                } else {
                    this.x_move_ok = true;
                }
            }
            if (!this.y_move_ok) {
                if (moveY_gap > 0) {//向下
                    if (event.stageY - this.starPosY1 >= moveY_gap) {
                        this.y_move_ok = true;
                    }
                } else if (moveY_gap < 0) {
                    if (event.stageY - this.starPosY1 <= moveY_gap) {
                        this.y_move_ok = true;
                    }
                } else {
                    this.y_move_ok = true;
                }
            }

            if (this.x_move_ok && this.y_move_ok) {
                this.touchList[0] = true;
            }
            this.checkResult();
        }
    }

    private onEventMove1(event: egret.TouchEvent) {//从右往左滑
        if (!this.isFinish) {
            let moveX_gap: number = this.hand2MoveDis[0];
            let moveY_gap: number = this.hand2MoveDis[1];

            if (!this.x2_move_ok) {
                if (moveX_gap > 0) {//向下
                    if (event.stageX - this.starPosX2 >= moveX_gap) {
                        this.x2_move_ok = true;
                    }
                } else if (moveX_gap < 0) {//向上
                    if (event.stageX - this.starPosX2 <= moveX_gap) {
                        this.x2_move_ok = true;
                    }
                } else {
                    this.x2_move_ok = true;
                }
            }
            if (!this.y2_move_ok) {
                if (moveY_gap > 0) {//向下
                    if (event.stageY - this.starPosY2 >= moveY_gap) {
                        this.y2_move_ok = true;
                    }
                } else if (moveY_gap < 0) {
                    if (event.stageY - this.starPosY2 <= moveY_gap) {
                        this.y2_move_ok = true;
                    }
                } else {
                    this.y2_move_ok = true;
                }
            }

            if (this.x2_move_ok && this.y2_move_ok) {
                this.touchList[1] = true;
            }
            this.checkResult();
        }
    }

    private onEventEnd(): void {
        this.starPosX1 = null;
        this.starPosY1 = null;
    }

    private onEventEnd1(): void {
        this.starPosX2 = null;
        this.starPosY2 = null;
    }

    private checkResult() {
        for (let i = 0; i < 2; ++i) {
            if (!this.touchList[i]) {
                return;
            }
        }
        if (this.handAni) {
            this.handAni.onDestroy();
            this.handAni = null;
        }
        if (this.handAni1) {
            this.handAni1.onDestroy();
            this.handAni1 = null;
        }
        this.isFinish = true;
        this.onBackSuccess();
    }
}
