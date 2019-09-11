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
    constructor(isDie, tiaozhuan) {
        super();
        // this.width = size.width;
        // this.height = size.height;
        this.isdie = isDie;
        this.tiaozhuan = tiaozhuan;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
    }
    private onAddToStage(): void {
        this.skinName = skins.BadEndSkin;
    }
    private onLoadComplete(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.updateResize();
        // this.group.mask = new egret.Rectangle(0, 0, size.width, size.height);
        // this.x = (size.width - this.width) / 2;
        // this.y = (size.height - this.height) / 2;
        // for (let i = 0; i < this.imgList.length; ++i) {
        //     if (!this.imgList[i])
        //         break;
        //     let scale = wind.width / wind.height;

        //     // if(size.width>1920)
        //     // {
        //         // var w = size.width/1600;
        //         var scalX = 0;
        //         if(size.width>1920)
        //         {
        //             scalX = size.width/1920
        //         }
        //         else
        //         {
        //             scalX = 1920/size.width
        //         }
        //         // this.imgList[i].width = 1920*scalX;
        //         // this.imgList[i].height = 1080*scalX;

        //         console.log("宽" + this.imgList[i].width +'----'+this.imgList[i].height);
        //     // }
        //     this.imgList[i].fillMode="clip";
        //     this.imgList[i].x = this.imgList[i].anchorOffsetX = this.width / 2;
        //     this.imgList[i].y = this.imgList[i].anchorOffsetY = this.height / 2;
        // }
        // if (size.fillType!=FILL_TYPE_COVER) {
        // window['mainDiv'].style["object-fit"] = "contain";
        // } 
        // this.isOver = false;
        // this.curImgIdx = 0;

        // this.tweenControler = new TweenContoler(this, this.width, this.height);
        // this.onTweenStart();
        if (this.isdie) {
            this.mainGroup.visible = true;
            this.btnContinueGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEvent, this);
            this.goMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoMain, this);
        }
        else {
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
    private onSetOver() {
        if (!this.isOver) {
            if (GameDefine.ISMAINVIEW == true) {
                this.isOver = true;
                this.parent.removeChild(this);

            }
            else {
                this.onEvent();
            }

        }
    }
    private onGoMain() {
        this.parent.removeChild(this);
        VideoManager.getInstance().videoClose();
    }
    private onEvent() {
        // this.btn.visible = false;
        this.isOver = true;
        this.parent.removeChild(this);
        if (this.isdie) {
            switch (this.tiaozhuan) {
                case TIAOZHUAN_Type.WENTI:
                    // document.createElement('canvas').cl
                    // var canvas = document.getElementById("myCanvas");//canvas画布
                    // canvas['getContext']('2d').drawImage(window['videoDivMin'], 0, 0);//画图
                    // canvas.style.display = '';
                    // VideoManager.getInstance().videoPause();
                    // VideoManager.getInstance().clear();
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_OVER));
                    break;
                case TIAOZHUAN_Type.MAINVIEW:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_WIN));
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
                    break;
                case TIAOZHUAN_Type.CHAPTER:
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_WIN));
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'JuQingPanel');
                    break;
            }
        }
        else {

            var chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
            let videoSrc = '';
            if (chapCfg.videoSrc.indexOf(",") >= 0) {
                let videoIds = chapCfg.videoSrc.split(",");
                videoSrc = videoIds[0];
            }
            else {
                videoSrc = chapCfg.videoSrc;
            }
            VideoManager.getInstance().log('隐藏存档')
            UserInfo.curBokData.wentiId.push(chapCfg.wenti);
            UserInfo.curBokData.videoNames[chapCfg.wenti] = videoSrc;
            UserInfo.curBokData.times[chapCfg.wenti] = 0;
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            // ChengJiuManager.getInstance().onChapterChengJiu(UserInfo.curchapter - 1);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ResultWinPanel');
            // GameCommon.getInstance().setBookData(FILE_TYPE.ANSWER_FILE);
            // GameCommon.getInstance().setBookData(FILE_TYPE.HIDE_FILE);
            // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH), '隐藏存档');
        }


        // 
    }
}
enum TIAOZHUAN_Type {
    WENTI = 1,//跳回视频
    MAINVIEW = 2,//回主界面
    CHAPTER = 3,//跳回章节
    RESULT = 4,//章节结算
}