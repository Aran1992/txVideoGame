class BActionArrow extends eui.Component {
    private imgFont: eui.Image;
    private imgArrow: eui.Image;
    private pos1: egret.Point;
    private pos2: egret.Point;
    private fontRes: string;
    private disY: number;

    public constructor(pos1: egret.Point, pos2: egret.Point, fontRes: string = null, disY: number = -50) {
        super();
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.fontRes = fontRes;
        this.disY = disY;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onSkinName, this);
    }

    private onSkinName(): void {
        this.skinName = skins.BActionArrowSkin;
    }

    private onLoadComplete() {
        this.width = Tool.pDisPoint(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
        // this.imgArrow.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        // this.imgArrow.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);
        // this.imgArrow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);
        // this.imgArrow.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEventUp, this);
        this.height = 34;
        this.anchorOffsetX = 0;
        this.anchorOffsetY = this.height;
        this.x = this.pos1.x;
        this.y = this.pos1.y + this.disY;
        this.rotation = 180 - Tool.angleTo360(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
        // if(this.fontRes){
        // 	this.imgFont.source = this.fontRes;
        // 	this.imgFont.visible = true;
        // } else {
        // 	this.imgFont.visible = false;
        // }
    }

    private onEventDown(event: egret.TouchEvent) {
        // if (Tool.pDisPoint(this.posList[0].x, this.posList[0].y, event.localX, event.localY) < GameDefine.SLIDE_RADIUS) {
        // 	this.posIdx = 0;
        // }
    }

    private onEventMove(event: egret.TouchEvent) {
        this.imgArrow.x = event.localX;
        this.imgArrow.y = event.localY;
    }

    private onEventUp(event: egret.TouchEvent) {
        if (this.imgArrow) {

        }
    }
}
