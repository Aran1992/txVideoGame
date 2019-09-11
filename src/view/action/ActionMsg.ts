class ActionMsg extends ActionSceneBase {
    private up_Btn: eui.Image;
    private down_Btn: eui.Image;
    private tipsImg: eui.Image;
    private msgLab: eui.Label;
    private groupTouch: eui.Group;
    private msg_input: eui.Image;
    private msg1: eui.Group;
    private mainMsg: eui.Group;
    private msgInput: eui.Group;
    private mainGroup: eui.Group;
    private btnSend: eui.Group;
    private msg_input1: eui.Image;
    // private timeBar: eui.ProgressBar;
    private groupClick1: eui.Group;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;
    public constructor(model: Modelwenti, list: string[], idx: number) {
        super(model, list, idx);
    }
    protected onSkinName(): void {
        this.skinName = skins.ActionMsgSkin;
    }
    private msg: string;
    private timer: egret.Timer;
    private timer1: egret.Timer;
    protected onInit(): void {
        super.onInit();
        this.updateResize();
        let count = 2;
        this.moveUp = false;

        this.msg = "我们的排练厅被Mad-max占了，没有排练厅用了，怎么办啊？";
        this.msgLab.text = '';
        this.btnSend.visible = false;
        // this.up_Btn.visible = false;
        // this.down_Btn.visible = false;
        if (!this.timer1) {
            this.timer1 = new egret.Timer(700)
            this.timer1.addEventListener(egret.TimerEvent.TIMER, this.onShowMsgEffect, this);
            this.timer1.start();
        }
        // this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        // this.mainMsg.
        this.mainMsg.y = 389;
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
        // this.mainMsg.mask = this['mk'];
        this.btnSend.touchEnabled = false;
        this.msgInput.touchEnabled = false;
    }
    protected update(dt): void {
        super.update(dt);
        // this.timeBar.value = this.maxTime - this.runTime;
        this.timeBar2.value = this.runTime;
        this.timeBar1.value = this.runTime;
    }
    private posNum: number[] = [181, 142, 90, 21, -108]
    // private posNum:number[] = [88,87,82,149]
    private curIndex: number = 0;
    private onShowMsgEffect() {
        // this.msg1.visible = true;
        // this.msg1.y = this.height/2-this.msg1.height/2;
        // for(var i:number =5;i>this.curIndex;i--)
        // {
        //     this['msg'+i].y = this.posNum[this.curIndex];
        // }
        this.mainMsg.y = this.posNum[this.curIndex];
        this['msg' + this.curIndex].visible = true;
        if (this.curIndex >= 3) {
            this.timer1.stop();
            this.timer1.removeEventListener(egret.TimerEvent.TIMER, this.onShowMsgEffect, this);
            this.timer1 = null;
            if (!this.timer) {
                this.timer = new egret.Timer(50)
                this.timer.addEventListener(egret.TimerEvent.TIMER, this.onShowLab, this);
                this.timer.start();
            }
            return;
        }
        this.curIndex = this.curIndex + 1;
    }

    private lab: string = '';
    private index: number = 0;
    private onShowLab() {
        if (this.index >= this.msg.length - 1) {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onShowLab, this);

            // this.groupTouch.touchEnabled = true;
            // this.groupTouch.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
            // this.groupTouch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);
            // this.groupTouch.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEventUp, this);
            this.msgInput.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this)
            this.btnSend.visible = true;
            this.msgInput.touchEnabled = true;
            this.btnSend.touchEnabled = true;
            this.btnSend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this)
            // this.up_Btn.visible = true;
            // this.down_Btn.visible = true;
            // this.up_Btn.y = 200;
            // this.down_Btn.y = this.height - 200;
            // this.start_posY = this.up_Btn.y;
            // this.start_posY1 = this.down_Btn.y;

            return;
        }
        this.lab += this.msg[this.index];
        this.index = this.index + 1;
        this.msgLab.text = this.lab;
        this.msg_input.height = this.msgLab.height + 30;
        this.msg_input1.height = this.msg_input.height;
    }
    private posIdx: number = 0;
    private onEventDown(event: egret.TouchEvent) {
        this.posIdx = event.localY;
    }
    private onEventUp(event: egret.TouchEvent) {
        // if (this.posIdx > event.localY) {
        this['msg' + 4].visible = true;
        this.mainMsg.y = this.posNum[5];
        var obj = this;
        this.btnSend.visible = false;
        // Tool.callbackTime(function () {
        //     obj['msg' + 6].visible = true;
        //     obj.mainMsg.y = obj.posNum[6];
        // }, obj, 700);
        this.groupTouch.touchEnabled = false;
        this.msgInput.visible = false;
        this.onBackSuccess();
        // }
        // else if (this.posIdx < event.localY) {
        //     this.groupTouch.touchEnabled = false;
        //     this.onBackFail();
        // }
        this.up_Btn.visible = false;
        this.down_Btn.visible = false;
        this.mainGroup.visible = false;
        this.btnSend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this)
        this.msgInput.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this)
        // this.timeBar.visible = false;
        // this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        // this.groupTouch.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        // this.groupTouch.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);
        // this.groupTouch.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEventUp, this);
    }
    // public updateResize() {
    //     this.width = size.width;
    //     this.height = size.height;
    // }
    private moveUp: boolean;
    // private start_posY: number;
    // private start_posY1: number;
    // private onFrame(): void {
    //     if (!this.moveUp) {
    //         this.up_Btn.y += 2;
    //         this.down_Btn.y -= 2;
    //         if (this.up_Btn.y > this.start_posY + 30) {
    //             this.moveUp = true;
    //         }

    //     } else {
    //         this.up_Btn.y -= 2;
    //         this.down_Btn.y += 2;
    //         if (this.up_Btn.y < this.start_posY) {
    //             this.moveUp = false;
    //         }
    //     }
    // }
}