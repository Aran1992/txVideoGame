class ViewEnd extends eui.Component {
    private group: eui.Group;
    private btnContinueGame: eui.Button;
    private imgList: eui.Image[];
    private tweenControler: TweenContoler;
    private curImgIdx: number;
    private isOver: boolean;
    private mainGroup: eui.Group;
    private tiaozhuan: number;
    private isdie: boolean;
    private goMain: eui.Button;
    private goJuqing: eui.Button;
    private btnExit: eui.Button;

    constructor(isDie, tiaozhuan) {
        super();
        this.isdie = isDie;
        this.tiaozhuan = tiaozhuan;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public onTweenNext() {
        if (this.curImgIdx < this.imgList.length - 1) {
            ++this.curImgIdx;
            this.onTweenStart();
        } else {
            this.onSetOver();
        }
    }

    public onTweenFinish(idx: number) {
        if (idx < this.imgList.length - 1) {
            let img: eui.Image = this.imgList[idx];
            egret.Tween.removeTweens(img);
            this.group.removeChild(img);
        } else {
            this.onSetOver();
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onAddToStage(): void {
        this.skinName = skins.BadEndSkin;
    }

    private onLoadComplete(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.STARTCHAPTER, this.onStartVideo, this);
        this.updateResize();
        if (this.isdie) {
            this.mainGroup.visible = true;
            this.btnContinueGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEvent, this);
            this.goMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoBack, this);
            this.goJuqing.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoBack, this);
            this.btnExit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnExitClick, this);
            if (isTXSP) {
                this.goMain.visible = false;
                this.goJuqing.visible = true;
                this.btnExit.visible = true;
            } else {
                this.goMain.visible = true;
                this.goJuqing.visible = false;
                this.btnExit.visible = false;
            }
        } else {
            this.mainGroup.visible = false;
            this.onEvent();
        }
    }

    private onTweenStart() {
        let tweens: TweenBody[] = TweenManager.tweenList[this.curImgIdx];
        if (!tweens)
            return;
        let img: eui.Image = this.imgList[this.curImgIdx];
        this.group.addChildAt(img, 0);
        this.tweenControler.setTweenInfo(img, tweens, this.curImgIdx);
    }

    private onSetOver() {
        if (!this.isOver) {
            if (GameDefine.ISMAINVIEW == true) {
                this.isOver = true;
                this.parent.removeChild(this);
            } else {
                this.onEvent();
            }
        }
    }

    private onGoBack() {
        VideoManager.getInstance().videoClose();
    }

    private onEvent() {
        this.isOver = true;
        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (this.isdie) {
            switch (this.tiaozhuan) {
                case TIAOZHUAN_Type.WENTI:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_OVER));
                    break;
                case TIAOZHUAN_Type.MAINVIEW:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_WIN));
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
                    break;
                case TIAOZHUAN_Type.CHAPTER:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'JuQingPanel');
                    break;
            }
        } else {
            let chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
            let videoSrc = chapCfg.videoSrc.split(",")[0];
            VideoManager.getInstance().log('隐藏存档');
            UserInfo.curBokData.wentiId.push(chapCfg.wenti);
            UserInfo.curBokData.videoNames[chapCfg.wenti] = videoSrc;
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ResultWinPanel');
        }
    }

    private onStartVideo() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    private btnExitClick() {
        platform.close();
    }
}

enum TIAOZHUAN_Type {
    WENTI = 1,//跳回视频
    MAINVIEW = 2,//回主界面
    CHAPTER = 3,//跳回章节
    RESULT = 4,//章节结算
}
