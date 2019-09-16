class ActionHuiYi extends ActionSceneBase {
    private timeImg: eui.Image;
    private timeImg2: eui.Image;
    private share: egret.Shape;
    // private share1: egret.Shape;
    private mainGroup: eui.Group;
    private handImg1: eui.Image;
    // private timeImg1: eui.Image;
    private lineGroup: eui.Group;
    private _posStr: string[];
    // private timeBar:eui.ProgressBar;
    private groupClick1: eui.Group;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private miaoshu: eui.Label;
    private qinmiGroup: eui.Group;
    private option_roles: number[] = [2, 3, 1, 4];
    private share1: egret.Shape;
    private share2: egret.Shape;
    private share3: egret.Shape;
    private share4: egret.Shape;
    private ansId: number = 0;

    public exit() {
        this.stopRun();
        this.onExit();
    }

    protected onSkinName(): void {
        this.skinName = skins.ActionHuiYiSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();

        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_HAOGAN, this.onCallBack, this);
        this.initTimeInfo();
        for (var i: number = 1; i < 5; i++) {
            this['groupHand' + i].touchEnabled = true;
            this['groupHand' + i].name = i;
            this['groupHand' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventClick, this);
            // this['groupHand' + i].
            this['timeImg' + i].visible = true;
            this['suo' + i].visible = true;
            // Tool.setDisplayGray(this['groupHand' + i],true)
        }
        this.qinmiGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        if (!UserInfo.tipsDick[this.model.id]) {
            UserInfo.tipsDick[this.model.id] = this.model.id;
            // GameCommon.getInstance().onShowQinMiGroup();
            this.qinmiGroup.visible = true;
            VideoManager.getInstance().videoPause();
            GuideManager.getInstance().isGuide = true;
            GuideManager.getInstance().curState = true;
        }
        var data1 = GameCommon.getInstance().getSortLike(0);
        var data2 = GameCommon.getInstance().getSortLike(1);
        var idx1: number = this.option_roles[data1.id];
        var idx2: number = this.option_roles[data2.id];
        this['timeImg' + idx1].visible = false;
        this['suo' + idx1].visible = false;
        this['timeImg' + idx2].visible = false;
        this['suo' + idx2].visible = false;
        // Tool.setDisplayGray(this['groupHand' + data.id],false)
        // Tool.setDisplayGray(this['groupHand' + data1.id],false)
        var cfgs = answerModels[this.model.id];
        if (!cfgs)
            return;
        for (var k in cfgs) {
            this['desc' + cfgs[k].ansid].text = cfgs[k].des;
            this['icon' + cfgs[k].ansid].source = 'huiyi_icon' + cfgs[k].ansid + '_png';
        }
    }

    protected update(dt): void {
        super.update(dt);
        // for (var i: number = 1; i < 5; i++) {
        //     this.drawArc(this['share' + i], this.maxTime - this.runTime, this.maxTime, 500)
        // }
        this.timeBar2.value = this.runTime;
        this.timeBar1.value = this.runTime;
        // this.timeBar.value = this.maxTime - this.runTime;
    }

    protected onBackFail() {
        super.onBackFail();
    }

    protected onBackSuccess() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ONSHOW_VIDEO),
            {answerId: this.ansId, wentiId: this.model.id, click: 1});
        this.exit();
    }

    private onGuideTween() {

    }

    private onClick() {
        if (this.qinmiGroup.visible) {
            this.qinmiGroup.visible = false;
            VideoManager.getInstance().videoResume();
        }

    }

    private onRefreshPos() {
        if (!this._posStr[this.idx])
            return;
        var posStr = this._posStr[this.idx].split("_");
        if (posStr.length > 1) {
            this.lineGroup.x = Math.floor(this.width * (parseInt(posStr[0]) / 100)); //parseInt(posStr[0]));
            this.lineGroup.y = Math.floor(this.height * (parseInt(posStr[1]) / 100)) - 557;
        }
    }

    private initTimeInfo() {
        // for (var i: number = 1; i < 5; i++) {
        //     this['share' + i] = new egret.Shape();
        //     this['share' + i].x = 283 / 2;
        //     this['share' + i].y = 283 / 2;
        //     this.drawArc(this['share' + i], 0, this.maxTime, 500)
        //     this['timeImg' + i].parent.addChild(this['share' + i]);
        //     this['timeImg' + i].mask = this['share' + i];
        // }
        var hdCfg: Modelhudong = JsonModelManager.instance.getModelhudong()[this.model.type];
        // if (hdCfg && hdCfg.des)
        //     this.timeBar['desc'].text = hdCfg.des;
        // this.timeBar.maximum = this.maxTime;

        this.miaoshu.text = hdCfg.des;
        // this.timeBar.slideDuration = 0;
        // this.timeBar.maximum = this.maxTime;
        // this.timeBar.value = 0;//this.maxTime;

        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.slideDuration = 0;
        this.timeBar1.value = this.maxTime;

        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;
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

    private onEventClick(event: egret.Event) {
        if (this.qinmiGroup.visible) {
            this.qinmiGroup.visible = false;
            VideoManager.getInstance().videoResume();
        }
        var name: number = Number(event.currentTarget.name);
        GuideManager.getInstance().isGuide = true;
        GuideManager.getInstance().curState = true;
        this.ansId = name;
        if (this['timeImg' + name].visible) {
            VideoManager.getInstance().videoPause();
            GameCommon.getInstance().onShowBuyHaoGan(name, this.onCallBack);
            return;
        }
        this.ansId = name;
        this.onBackSuccess();
    }

    private onCallBack(data): void {
        this.onBackSuccess();
    }

    private onExit() {
        if (this.parent)
            this.parent.removeChild(this);
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;
    }
}
