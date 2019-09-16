class ActionMsg extends ActionSceneBase {
    private up_Btn: eui.Image;
    private down_Btn: eui.Image;
    private msgLab: eui.Label;
    private groupTouch: eui.Group;
    private msg_input: eui.Image;
    private mainMsg: eui.Group;
    private msgInput: eui.Group;
    private mainGroup: eui.Group;
    private btnSend: eui.Group;
    private msg_input1: eui.Image;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;
    private msg: string;
    private timer: egret.Timer;
    private timer1: egret.Timer;
    private posNum: number[] = [181, 142, 90, 21, -108];
    private curIndex: number = 0;
    private lab: string = '';
    private index: number = 0;
    private moveUp: boolean;

    protected onSkinName(): void {
        this.skinName = skins.ActionMsgSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();
        this.moveUp = false;

        this.msg = "我们的排练厅被Mad-max占了，没有排练厅用了，怎么办啊？";
        this.msgLab.text = '';
        this.btnSend.visible = false;
        if (!this.timer1) {
            this.timer1 = new egret.Timer(700);
            this.timer1.addEventListener(egret.TimerEvent.TIMER, this.onShowMsgEffect, this);
            this.timer1.start();
        }
        this.mainMsg.y = 389;
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        this.desc1.text = hdCfg.des;

        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.slideDuration = 0;
        this.timeBar1.value = this.maxTime;

        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
        this.btnSend.touchEnabled = false;
        this.msgInput.touchEnabled = false;
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar2.value = this.runTime;
        this.timeBar1.value = this.runTime;
    }

    private onShowMsgEffect() {
        this.mainMsg.y = this.posNum[this.curIndex];
        this['msg' + this.curIndex].visible = true;
        if (this.curIndex >= 3) {
            this.timer1.stop();
            this.timer1.removeEventListener(egret.TimerEvent.TIMER, this.onShowMsgEffect, this);
            this.timer1 = null;
            if (!this.timer) {
                this.timer = new egret.Timer(50);
                this.timer.addEventListener(egret.TimerEvent.TIMER, this.onShowLab, this);
                this.timer.start();
            }
            return;
        }
        this.curIndex = this.curIndex + 1;
    }

    private onShowLab() {
        if (this.index >= this.msg.length - 1) {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onShowLab, this);

            this.msgInput.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);
            this.btnSend.visible = true;
            this.msgInput.touchEnabled = true;
            this.btnSend.touchEnabled = true;
            this.btnSend.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);

            return;
        }
        this.lab += this.msg[this.index];
        this.index = this.index + 1;
        this.msgLab.text = this.lab;
        this.msg_input.height = this.msgLab.height + 30;
        this.msg_input1.height = this.msg_input.height;
    }

    private onEventUp() {
        this['msg' + 4].visible = true;
        this.mainMsg.y = this.posNum[5];
        this.btnSend.visible = false;
        this.groupTouch.touchEnabled = false;
        this.msgInput.visible = false;
        this.onBackSuccess();
        this.up_Btn.visible = false;
        this.down_Btn.visible = false;
        this.mainGroup.visible = false;
        this.btnSend.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this);
        this.msgInput.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventUp, this)
    }
}
