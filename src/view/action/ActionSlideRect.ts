class ActionSlideRect extends ActionTimerSceneBase {
    private touchDis: number;
    private touchCurr: number;
    private pos: egret.Point;
    private isTouch: boolean;
    private isFinish: boolean;
    private groupHand: eui.Group;
    private tips: eui.Group;
    private handAni: my.Animation;
    private handAni1: my.Animation;
    private end_posx: number = 0;
    private moveUp: boolean;
    private starPos: number = 0;
    private touchGroup: eui.Group;

    protected onSkinName(): void {
        this.skinName = skins.ActionSlideRectSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.touchGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.touchGroup.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);

        this.touchDis = GameDefine.SLIDE_RECT;
        let rectStrs: string[] = this.paramList[3].split("_");

        this.groupHand.anchorOffsetX = this.groupHand.width / 2;
        this.groupHand.anchorOffsetY = this.groupHand.height / 2;
        this.groupHand.x = Math.floor(this.width * (parseInt(rectStrs[0]) / 100));
        this.groupHand.y = Math.floor(this.height * (parseInt(rectStrs[1]) / 100));
        let handX: number = this.groupHand.x;

        this.handAni = new my.Animation('effect_motou', -1);
        this.handAni.scaleX = 1;
        this.handAni.scaleY = 1;
        this.handAni.x = 280; //this.guideImg.x + 296;// - this.groupClick.width / 2;
        this.handAni.y = 100;
        this.tips.addChild(this.handAni);
        this.handAni.onPlay();

        this.tips.anchorOffsetX = this.tips.width / 2;
        this.tips.anchorOffsetY = this.tips.height / 2;
        this.tips.y = this.groupHand.y + 100;
        this.tips.x = this.groupHand.x + 75;
        this.end_posx = handX + parseInt(rectStrs[2]);
        this.moveUp = false;
        this.touchCurr = 0;

        this.isTouch = this.isFinish = false;
        this.pos = new egret.Point();
    }

    private onEventDown(event: egret.TouchEvent) {
        this.starPos = event.stageX;
        if (!this.isFinish) {
            this.pos.setTo(event.localX, event.localY);
            this.isTouch = true;
        }
    }

    private onEventMove(event: egret.TouchEvent) {
        if (this.starPos > event.stageX) {
            this.starPos = event.stageX;
        } else if (this.starPos < event.stageX) {
            this.starPos = event.stageX;
        }

        if (this.isTouch && !this.isFinish) {
            let dis = Math.pow(this.pos.x + event.localX, 0.5);
            this.pos.setTo(event.localX, event.localY);
            this.touchCurr += Math.floor(dis / 4);
            this.checkResult();
        }
    }

    private checkResult() {
        if (this.touchCurr >= this.touchDis) {
            this.touchCurr = this.touchDis;
            this.isTouch = false;
            this.isFinish = true;
            if (this.handAni) {
                this.handAni.parent.removeChild(this.handAni);
                this.handAni.onDestroy();
                this.handAni = null;
            }
            if (this.handAni1) {
                this.handAni1.parent.removeChild(this.handAni1);
                this.handAni1.onDestroy();
                this.handAni1 = null;
            }
            this.onBackSuccess();
        }
    }
}
