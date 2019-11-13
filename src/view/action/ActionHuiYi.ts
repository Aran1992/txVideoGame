class ActionHuiYi extends ActionTimerSceneBase {
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
        let data1 = GameCommon.getInstance().getSortLike(0);
        this.defaultAnswerID = this.optionRoles[data1.id];
        const func = GameCommon.getInstance().getLockedOptionIDs[this.model.id];
        if (func) {
            const lockedIDs = func() || [];
            lockedIDs.forEach(id => {
                let itemNum = this.getWentiItemNum(this.model.id, id);
                this['timeImg' + id].visible = itemNum > 0;
                this['suo' + id].visible = itemNum > 0;
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

    private getWentiItemNum(wentiId, id) {
        let itemId = GameCommon.getInstance().getWentiItemId(wentiId, id);
        return ShopManager.getInstance().getItemNum(itemId);
    }

    private onEventClick(event: egret.Event) {
        SoundManager.getInstance().playSound('ope_select_head.mp3');
        if (this.isSelected) {
            return;
        }
        let name: number = Number(event.currentTarget.name);
        GuideManager.getInstance().isGuide = true;
        GuideManager.getInstance().curState = true;
        this.answerID = name;
        if (this['timeImg' + name].visible) {
            VideoManager.getInstance().videoPause();
            PromptPanel.getInstance().onShowBuyHaoGan(this.model.id, name);
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
