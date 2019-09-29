class ActionHuiYi extends ActionTimerSceneBase {
    private qinmiGroup: eui.Group;
    private optionRoles: number[] = [2, 3, 1, 4];
    private answerID: number = 0;
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
            this['timeImg' + i].visible = false;
            this['suo' + i].visible = false;
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
        this.defaultAnswerID = this.optionRoles[data1.id];
        const func = GameCommon.getInstance().getLockedOptionIDs[this.model.id];
        if (func) {
            const lockedIDs = func() || [];
            lockedIDs.forEach(id => {
                this['timeImg' + id].visible = true;
                this['suo' + id].visible = true;
            });
        }
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
            {answerId: this.answerID, wentiId: this.model.id, click: 1}
        );
        this.exit();
    }

    protected onBackFail() {
        this.answerID = this.defaultAnswerID;
        this.onBackSuccess();
    }

    private onClickQinmiGroup() {
        if (this.qinmiGroup.visible) {
            this.qinmiGroup.visible = false;
            VideoManager.getInstance().videoResume();
        }
    }

    private onEventClick(event: egret.Event) {
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
        this.answerID = name;
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
        this['timeImg' + this.answerID].visible = false;
        this['suo' + this.answerID].visible = false;
    }

    private onExit() {
        if (this.parent)
            this.parent.removeChild(this);
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;
    }
}
