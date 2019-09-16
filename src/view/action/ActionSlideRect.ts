class ActionSlideRect extends ActionSceneBase {
    private groupTouch: eui.Group;
    private rect: egret.Rectangle;
    private touchDis: number;
    private touchCurr: number;
    private pos: egret.Point;
    private isTouch: boolean;
    private isFinish: boolean;
    private posList: egret.Point[];
    private groupHand: eui.Group;
    private red_img: eui.Image;
    private tips: eui.Group;
    // private tuo: eui.Image;
    // private leftImg: eui.Image;
    // private timeImg: eui.Image;
    // private rightImg: eui.Image;
    // private handImg: eui.Image;
    // private timeBar: eui.ProgressBar;
    // private handImg1: eui.Image;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;
    private handAni: my.Animation;
    private handAni1: my.Animation;
    private start_posY: number = 0;
    private start_posX: number = 0;
    private end_posx: number = 0;
    private moveUp: boolean;
    // }
    private starPos: number = 0;

    protected onSkinName(): void {
        this.skinName = skins.ActionSlideRectSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        // this.tuo.touchEnabled = true;
        this.tips.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);
        // this.groupTouch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);
        // this.groupTouch.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEventUp, this);

        // let list = this.paramList;
        this.touchDis = GameDefine.SLIDE_RECT;
        let rectStrs: string[] = this.paramList[3].split("_");


        this.posList = [];
        for (let i = 3; i < this.paramList.length; ++i) {
            let posStr = this.paramList[i].split("_");
            this.posList.push(new egret.Point(parseInt(posStr[0]), parseInt(posStr[1])));
        }
        this.groupHand.anchorOffsetX = this.groupHand.width / 2;
        this.groupHand.anchorOffsetY = this.groupHand.height / 2;
        this.groupHand.x = Math.floor(this.width * (parseInt(rectStrs[0]) / 100));
        this.groupHand.y = Math.floor(this.height * (parseInt(rectStrs[1]) / 100));
        // this.red_img.y = this.groupHand.y+this.groupHand.height / 2;
        let handX: number = this.groupHand.x;
        let handY: number = this.groupHand.y;

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
        // this.xinxin.x = handX + parseInt(rectStrs[2]) + 50;
        // this.xinxin.y = handY - 30;
        this.end_posx = handX + parseInt(rectStrs[2]);
        this.moveUp = false;
        this.touchCurr = 0;

        // this.handAni = new Animation('effect_zouma', -1);
        // this.handAni.x = 80;// - this.groupClick.width / 2;
        // this.handAni.y = 70;// - this.groupClick.height / 2;
        // this.handAni.scaleX = -1;
        // this.tips.addChild(this.handAni);
        // this.handAni.onPlay();

        // this.handAni1 = new Animation('effect_zouma', -1);
        // this.handAni1.x = 360;// - this.groupClick.width / 2;
        // this.handAni1.y = 70;// - this.groupClick.height / 2;
        // this.tips.addChild(this.handAni1);
        // this.handAni1.onPlay();
        // this.rect.right = parseInt(rectStrs[2])*5;
        // this.rect.bottom = parseInt(rectStrs[3])*5;
        // var tw = egret.Tween.get(this.groupHand, { loop: true });
        // for (let i = 0; i < 2; ++i) {
        // tw.to({ x: handX+parseInt(rectStrs[2]), y: handY}, 700);
        // tw.to({ x: handX, y: handY}, 700);
        // tw.to({ x: handX+parseInt(rectStrs[2]), y: handY}, 700);
        // tw.to({ x: handX, y: handY}, 700);
        // tw.to({ x: handX+parseInt(rectStrs[2]), y: handY}, 700);
        // tw.wait(800);
        // }
        // var tw1 = egret.Tween.get(this.handImg1, { loop: true });
        // tw1.to({ x: 88, y: 5, rotation: 0 }, 500);
        // tw1.to({ x: 258, y: -23, rotation: 0 }, 500);
        // tw1.to({ x: 407, y: -6, rotation: 0 }, 500);
        // tw1.to({ x: 538, y: 78, rotation: 0 }, 500);
        // tw1.to({ x: 407, y: -6, rotation: 0 }, 500);
        // tw1.to({ x: 258, y: 15, rotation: 0 }, 500);
        // tw1.to({ x: 88, y: 5, rotation: 0 }, 500);
        // tw1.to({ x: -3, y: 78, rotation: -20 }, 500);
        // tw1.wait(200);

        // var tw = egret.Tween.get(this.handImg, { loop: true });
        // tw.to({ x: 100, y: 43, rotation: -10 }, 500);
        // tw.to({ x: 258, y: 15, rotation: 0 }, 500);
        // tw.to({ x: 419, y: 25, rotation: 15 }, 500);
        // tw.to({ x: 513, y: 109, rotation: 20 }, 500);
        // tw.to({ x: 419, y: 25, rotation: 15 }, 500);
        // tw.to({ x: 258, y: 15, rotation: 0 }, 500);
        // tw.to({ x: 100, y: 43, rotation: -10 }, 500);
        // tw.to({ x: 0, y: 109, rotation: -20 }, 500);
        // tw.wait(200);


        this.initTimeInfo();
        this.isTouch = this.isFinish = false;
        this.pos = new egret.Point();
        // this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
    }

    protected update(dt): void {
        super.update(dt);
        // this.timeBar.value = this.maxTime - this.runTime;
        this.timeBar2.value = this.runTime;
        this.timeBar1.value = this.runTime;
        // if (this.share)
        // this.drawArc(this.share, this.maxTime - this.runTime, this.maxTime, this.timeImg.width * 2);
    }

    // private share: egret.Shape;
    private initTimeInfo() {
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        if (hdCfg && hdCfg.des)
        // this.desc.text = hdCfg.des;//	this.timeBar['desc'].text = hdCfg.des;
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
        // this.share = new egret.Shape();
        // this.share.x = this.timeImg.x + this.timeImg.width / 2;
        // this.share.y = this.timeImg.y + this.timeImg.height / 2;
        // this.drawArc(this.share, this.runTime, this.maxTime, this.timeImg.width * 2);
        // this.timeImg.parent.addChild(this.share);
        // this.timeImg.mask = this.share;
    }

    private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
        var r = wd / 2 - 50;
        shape.graphics.clear();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(0, -r);//画线到弧的起始点
        shape.graphics.drawArc(0, 0, r, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
        shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
        shape.graphics.endFill();
    }

    // private updateResize() {
    // 	this.width = size.width;
    // 	this.height = size.height;
    // 	// this.mainGroup.scaleX = GameDefine.SCALENUMX;
    // 	// this.mainGroup.scaleY = GameDefine.SCALENUMY;

    private onFrame(): void {
        // this.xinxin.y -= 0.8;
        // this.xinxin.alpha -= 0.01;
        // if (this.xinxin.y < this.start_posY - 150) {
        // 	this.xinxin.y = this.start_posY;
        // 	this.xinxin.alpha = 1;
        // }
        if (!this.moveUp) {
            this.groupHand.x += 10;
            if (this.groupHand.x >= this.end_posx) {
                this.moveUp = true;
            }
        } else {
            this.groupHand.x -= 10;
            if (this.groupHand.x <= this.start_posX) {
                this.moveUp = false;
            }
        }
    }

    private onEventDown(event: egret.TouchEvent) {
        this.starPos = event.stageX;
        if (!this.isFinish) {
            // this.rightImg.visible = false;
            // this.leftImg.visible = false;
            // if (this.handAni) {
            // 	this.handAni.parent.removeChild(this.handAni);
            // 	this.handAni.onDestroy();
            // 	this.handAni = null;
            // }
            // if (this.handAni1) {
            // 	this.handAni1.parent.removeChild(this.handAni1);
            // 	this.handAni1.onDestroy();
            // 	this.handAni1 = null;
            // }
            this.pos.setTo(event.localX, event.localY);
            // if(this.rect.containsPoint(this.pos)){
            this.isTouch = true;
            // }
        }
    }

    private onEventMove(event: egret.TouchEvent) {
        if (this.starPos > event.stageX) {
            // this.tuo.x = this.tuo.x - (this.starPos - event.stageX);
            this.starPos = event.stageX;
        } else if (this.starPos < event.stageX) {
            // this.tuo.x = event.stageX - this.starPos + this.tuo.x;
            this.starPos = event.stageX;
        }

        // if (this.tuo.x >= this.tips.width) {

        // 	this.tuo.x = this.tips.width;
        // }
        // else if (this.tuo.x <= 0) {
        // 	this.tuo.x = 0;
        // }
        if (this.isTouch && !this.isFinish) {
            Math.pow(this.pos.x + event.localX, 0.5);
            let dis = Math.pow(this.pos.x + event.localX, 0.5);//Tool.pDisPoint(this.pos.x, this.pos.y, event.localX, event.localY);
            this.pos.setTo(event.localX, event.localY);
            this.touchCurr += Math.floor(dis / 4);
            this.checkResult();
        }
    }

    // private onEventUp(event: egret.TouchEvent){
    // 	if(this.isTouch){

    // 	}
    // }
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
            // GameCommon.getInstance().shock();
            // this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
            this.onBackSuccess();
        }
    }
}
