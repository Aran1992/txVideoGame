class ResultWinPanel extends eui.Component {
    private winEff: eui.Group;
    private chapterName1: eui.Label;
    private labState: eui.Label;
    private btnMain: eui.Button;
    private btnJuqing: eui.Button;
    private btnNext: eui.Button;
    private btnExit: eui.Button;
    private readonly _isEnd: boolean;
    private curChapter: number;

    public constructor(isEnd: boolean) {
        super();
        this._isEnd = isEnd;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private static onShowMainView() {
        if (VideoManager.getInstance().videoCurrTime() < VideoManager.getInstance().getVideoDuration()) {
            VideoManager.getInstance().videoPause();
        }
        ChengJiuManager.getInstance().curChapterChengJiu = {};
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_WIN));
        if (isTXSP) {
            GameDefine.IS_DUDANG = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ResultWinPanel');
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
        }
    }

    private onAddToStage(): void {
        this.skinName = skins.ResultWinSkin;
    }

    private onLoadComplete(): void {
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
        this.btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onContinue, this);
        this.btnExit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnExitClick, this);
        this.btnMain.addEventListener(egret.TouchEvent.TOUCH_TAP, ResultWinPanel.onShowMainView, this);
        this.btnJuqing.addEventListener(egret.TouchEvent.TOUCH_TAP, ResultWinPanel.onShowMainView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.STARTCHAPTER, this.onStartVideo, this);
        for (let i: number = 1; i < 5; i++) {
            this['roleItem' + i].name = i;
        }
        this.updateResize();
        this.touchEnabled = true;
        this.touchChildren = true;
        if (!this._isEnd) {
            this.curChapter = 0;
            for (let role: number = 0; role < GameDefine.ROLE_JUQING_TREE.length; role++) {
                let roleChapters: number[] = GameDefine.ROLE_JUQING_TREE[role];
                for (let index: number = 0; index < roleChapters.length; index++) {
                    if (roleChapters[index] == UserInfo.curchapter) {
                        this.curChapter = index > 0 ? roleChapters[index - 1] : 0;
                        break;
                    }
                }
                if (this.curChapter) break;
            }
            this.chapterName1.text = JsonModelManager.instance.getModelchapter()[this.curChapter].name;
        } else {
            this.curChapter = UserInfo.curchapter;
            this.chapterName1.text = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter].name;
        }

        this.onShowWinEffect();
        this.labState.text = '一完成章节一';
        this.labState.textColor = 0xCB7ED3;

        if (isTXSP) {
            this.btnMain.visible = false;
            this.btnJuqing.visible = true;
            this.btnExit.visible = true;
        } else {
            this.btnMain.visible = true;
            this.btnJuqing.visible = false;
            this.btnExit.visible = false;
        }
    }

    private onShowWinEffect() {
        let data = GameCommon.getInstance().getSortLike();
        for (let i: number = 1; i < 5; i++) {
            const roleItem = this['roleItem' + i];
            const roleIndex = i - 1;
            if ((UserInfo.curchapter === 1 && roleIndex !== ROLE_INDEX.ZiHao_Xia)
                || (UserInfo.curchapter === 2 && [ROLE_INDEX.XiaoBai_Han, ROLE_INDEX.QianYe_Xiao].indexOf(roleIndex) !== -1)) {
                roleItem.parent.removeChild(roleItem);
            } else {
                roleItem.data = {idx: roleIndex, xindong: data.id, chapter: this.curChapter};
            }
        }
        this.winEff.alpha = 0;
        egret.Tween.get(this.winEff).to({alpha: 1}, 1000);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onStartVideo() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ResultWinPanel');
    }

    private onContinue() {
        if (!GameCommon.getInstance().checkChapterLocked(null,false,true))
            return;
        if (!this._isEnd) {
            PromptPanel.getInstance().showRoleChapterNotice();
        } else {
            ResultWinPanel.onShowMainView();
            GameCommon.getInstance().showCommomTips("好感度不足，无法继续进行");
        }
        this.touchEnabled = false;
        this.touchChildren = false;
    }

    private btnExitClick() {
        platform.close();
    }
}

class ResultWinItem extends eui.Component {
    public xindong: eui.Group;
    private haogan1: eui.Group;
    private role0: eui.Image;
    private roleDi1: eui.Image;
    private roleName: eui.Image;
    private hide1: eui.Group;
    private desc1: eui.Label;
    private roleType: eui.Label;
    private roleTypeNams: string[] = ['主\n唱', '贝\n斯\n手', '吉\n他\n手', '键\n盘\n手'];
    private handAni: my.Animation;

    public constructor() {
        super();
        this.skinName = skins.ResultWinItemSkin;
        this.touchEnabled = false;
    }

    private _data;

    public set data(info) {
        this._data = info;
        if (info.idx == info.xindong) {
            this.haogan1.visible = true;
            this.handAni = new my.Animation('role_xin', -1);
            this.handAni.scaleX = 1;
            this.handAni.scaleY = 1;
            this.handAni.x = this.haogan1.width / 2;// - this.groupClick.width / 2;
            this.handAni.y = this.haogan1.height / 2;
            // - this.groupClick.height / 2;
            this.haogan1.addChild(this.handAni);
            this.handAni.onPlay();
        }
        let des = JsonModelManager.instance.getModelchapter()[info.chapter].des;
        let strs = des.split(';');
        this.desc1.text = strs[info.idx];
        this.roleType.text = this.roleTypeNams[info.idx];

        this.roleName.source = 'result_zi' + (info.idx + 1) + '_png';
        this.roleDi1.source = 'result_role_di' + (info.idx + 1) + '_png';
        this.role0.source = 'resultRoleImg' + info.idx + '_png';
    }

    public get getState(): number {
        return this._state;
    }

    private _state: number = 0;

    public set state(st) {
        this._state = st;
        if (st == 1 && this._data.idx == this._data.xindong) {
            this.roleDi1.width = 298;
            let tw = egret.Tween.get(this);
            tw.to({width: 721}, 500);
            let tw1 = egret.Tween.get(this.roleDi1);
            tw1.to({width: 721}, 500);
            Tool.callbackTime(() => {
                this.hide1.visible = true;
                this.roleDi1.source = 'result_role_kuandi' + (this._data.idx + 1) + '_png';
            }, this, 500);
            let idx: number = 0;
            this['roleCj1Group' + 1].visible = false;
            this['roleCj1Group' + 2].visible = false;
            this['roleCj1Group' + 3].visible = false;
            this.desc1.visible = false;
            for (let k in ChengJiuManager.getInstance().curChapterChengJiu) {
                let cfg: Modelchengjiu = JsonModelManager.instance.getModelchengjiu()[ChengJiuManager.getInstance().curChapterChengJiu[k]];
                if (cfg && (this._data.idx + 1) == cfg.tp2) {
                    this.desc1.visible = true;
                    idx = idx + 1;
                    if (idx > 3)
                        return;
                    this['titleId' + idx].text = cfg.titleID;
                    this['roleCj1Group' + idx].visible = true;
                }
            }
        } else {
            this.hide1.visible = false;
            this.hide1.width = 0;
            if (this.roleDi1.width != 298) {
                let tw = egret.Tween.get(this);
                tw.to({width: 301}, 500);
                let tw1 = egret.Tween.get(this.roleDi1);
                tw1.to({width: 298}, 500);
                Tool.callbackTime(() => {
                    this.roleDi1.source = 'result_role_di' + (this._data.idx + 1) + '_png';
                }, this, 500);
            }
        }
    }
}
