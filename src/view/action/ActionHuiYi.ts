class ActionHuiYi extends ActionTimerSceneBase {
    private qinmiGroup: eui.Group;
    private option_roles: number[] = [2, 3, 1, 4];
    private ansId: number = 0;
    private exitTimer: number;
    private defaultAnswerID: number;
    private isSelected: boolean;

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

        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_HAOGAN, this.onBuySuccessCallback, this);
        for (let i: number = 1; i < 5; i++) {
            this['groupHand' + i].touchEnabled = true;
            this['groupHand' + i].name = i;
            this['groupHand' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventClick, this);
            this['timeImg' + i].visible = true;
            this['suo' + i].visible = true;
            this['selected' + i].visible = false;
        }
        this.qinmiGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickQinmiGroup, this);
        if (!UserInfo.tipsDick[this.model.id]) {
            UserInfo.tipsDick[this.model.id] = this.model.id;
            this.qinmiGroup.visible = true;
            VideoManager.getInstance().videoPause();
            GuideManager.getInstance().isGuide = true;
            GuideManager.getInstance().curState = true;
        }
        let data1 = GameCommon.getInstance().getSortLike(0);
        let data2 = GameCommon.getInstance().getSortLike(1);
        let idx1: number = this.option_roles[data1.id];
        this.defaultAnswerID = idx1;
        let idx2: number = this.option_roles[data2.id];
        this['timeImg' + idx1].visible = false;
        this['suo' + idx1].visible = false;
        this['timeImg' + idx2].visible = false;
        this['suo' + idx2].visible = false;
        let cfgs = answerModels[this.model.id];
        if (!cfgs)
            return;
        for (let k in cfgs) {
            if (cfgs.hasOwnProperty(k)) {
                this['desc' + cfgs[k].ansid].text = cfgs[k].des;
                this['icon' + cfgs[k].ansid].source = 'huiyi_icon' + cfgs[k].ansid + '_png';
            }
        }
    }

    protected onBackSuccess() {
        if (this.exitTimer) {
            egret.clearTimeout(this.exitTimer);
        }
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.ONSHOW_VIDEO),
            {answerId: this.ansId, wentiId: this.model.id, click: 1}
        );
        this.exit();
    }

    protected onBackFail() {
        this.ansId = this.defaultAnswerID;
        this.onBackSuccess();
    }

    private onClickQinmiGroup() {
        if (this.qinmiGroup.visible) {
            this.qinmiGroup.visible = false;
            VideoManager.getInstance().videoResume();
        }
    }

    private onEventClick(event: egret.Event) {
        SoundManager.getInstance().playSound('ope_select_head')
        if (this.isSelected) {
            return;
        }
        if (this.qinmiGroup.visible) {
            this.qinmiGroup.visible = false;
            VideoManager.getInstance().videoResume();
        }
        let name: number = Number(event.currentTarget.name);
        GuideManager.getInstance().isGuide = true;
        GuideManager.getInstance().curState = true;
        this.ansId = name;
        if (this['timeImg' + name].visible) {
            VideoManager.getInstance().videoPause();
            PromptPanel.getInstance().onShowBuyHaoGan(name);
        } else {
            this['selected' + name].visible = true;
            this.exitTimer = egret.setTimeout(() => this.onBackSuccess(), this, 1000);
            this.isSelected = true;
        }
    }

    private onBuySuccessCallback() {
        this['timeImg' + this.ansId].visible = false;
        this['suo' + this.ansId].visible = false;
    }

    private onExit() {
        if (this.parent)
            this.parent.removeChild(this);
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;
    }
}
