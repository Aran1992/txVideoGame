function getJuqingConfig(juqingID) {
    const x = JsonModelManager.instance.getModeljuqingkuai();
    for (let a in x) {
        for (let b in x[a]) {
            if (x[a][b].id == juqingID) {
                return x[a][b];
            }
        }
    }
}

class JuQingPanel extends eui.Component {
    private bgBtn: eui.Button;
    private restartBtn: eui.Button;
    private slideGroup: eui.Group;
    private noneFile: eui.Group;
    private qiuGroup: eui.Group;
    private timerLab: eui.Label;
    private cunchuBtn: eui.Button;
    private guide_grp: eui.Group;
    private idGuideGroup: eui.Group;
    private idGuideImage: eui.Image;
    private cleanLab: eui.Label;
    private btnDisableCheck: eui.Button;
    private btnEnableCheck: eui.Button;
    private _curIdx: number = FILE_TYPE.AUTO_FILE;
    private qiuImgs: eui.Image[];
    private _idx: number = 0;
    private kuaiDatas;
    private starPos: number = 0;
    private imgIndx: number = 1;
    private imgMaxNumb: number = 5;
    private _playTween: boolean;
    private _guideIndex: number = 0;
    private idGainShuipian: eui.Button;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private static onRefreshUpdata() {
        if (GameDefine.ISFILE_STATE) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
        }
    }

    private static onGetSuipian() {
        UserInfo.suipianMoney = UserInfo.suipianMoney + 1000
    }

    private static onCleanCache() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        for (let i: number = 1; i < FILE_TYPE.SIZE; i++) {
            GameCommon.getInstance().deleteBookHistory(i);
        }
        ShopManager.getInstance().takeOffAllBookValue();
        GameCommon.getInstance().addLikeTips("清档成功");
    }

    private static disableCheck() {
        GameDefine.ENABLE_CHECK_VIP = false;
        GameCommon.getInstance().addLikeTips("已经关闭会员检查");
    }

    private static enableCheck() {
        GameDefine.ENABLE_CHECK_VIP = true;
        GameCommon.getInstance().addLikeTips("已经开启会员检查");
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, JuQingPanel.onRefreshUpdata, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.REFRESH_JUQING, this.onRefresh, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.STARTCHAPTER, this.onShowVideo, this);

        this.cunchuBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaveCunChu, this);
        this.slideGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.slideGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.qiuGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.qiuGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRestartBtn, this);
        for (let i: number = 1; i <= GameDefine.MAX_CUNDAGN_NUM; i++) {
            this['fileBtn' + i].name = i;
            this['fileBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChapterVideo, this);
        }
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.cleanLab.addEventListener(egret.TouchEvent.TOUCH_TAP, JuQingPanel.onCleanCache, this);
        this.idGainShuipian.addEventListener(egret.TouchEvent.TOUCH_TAP, JuQingPanel.onGetSuipian, this);
        this.btnDisableCheck.addEventListener(egret.TouchEvent.TOUCH_TAP, JuQingPanel.disableCheck, this);
        this.btnEnableCheck.addEventListener(egret.TouchEvent.TOUCH_TAP, JuQingPanel.enableCheck, this);
    }

    protected onRemove(): void {
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.AUTO_UPDATA, JuQingPanel.onRefreshUpdata, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.REFRESH_JUQING, this.onRefresh, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.STARTCHAPTER, this.onShowVideo, this);

        this.cunchuBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaveCunChu, this);
        this.slideGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.slideGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.qiuGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.qiuGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.restartBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRestartBtn, this);
        for (let i: number = 1; i <= GameDefine.MAX_CUNDAGN_NUM; i++) {
            this['fileBtn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChapterVideo, this);
        }
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }

    protected onSkinName(): void {
        this.skinName = skins.JuQingSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onRefresh() {
        this.onSwitchKuai(this._curIdx);
    }

    private onSaveCunChu() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        GameCommon.getInstance().showConfirmTips("是否存储？", () => {
            GameCommon.getInstance().setBookData(this._curIdx, () => {
                GameCommon.getInstance().showConfirmTips("手动存档失败，请稍后重试", () => {
                });
            });
        }, "注：存储会覆盖原来的存档");
    }

    private onShowVideo() {
        this.touchEnabled = false;
        this.touchChildren = false;
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.onRemove();
        this.qiuGroup.removeChildren();
        this.slideGroup.removeChildren();
        if (GameDefine.IS_DUDANG) {
            GameDefine.IS_DUDANG = false;
            VideoManager.getInstance().videoResume();
        }
        GameDefine.ISFILE_STATE = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onShowChapterVideo(event: egret.Event) {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let name: number = Number(event.currentTarget.name);
        if (this._curIdx == name)
            return;
        this['fileBtn' + this._curIdx].icon = '';
        this['fileBtn' + this._curIdx]['labelDisplay']['textColor'] = '0xa9aaac';
        this['fileBtn' + this._curIdx].touchEnabled = true;
        this['fileBtn' + name].icon = 'cundang_kuang1_png';
        this['fileBtn' + name]['labelDisplay']['textColor'] = '0xffffff';
        this._curIdx = name;
        this.onSwitchKuai(name);
    }

    private onLoadComplete(): void {
        GameDefine.CUR_IS_MAINVIEW = true;
        this.touchEnabled = false;
        this.onRegist();
        this.updateResize();
        GameDefine.ISFILE_STATE = false;
        GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE2);
        GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE3);
        GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE4);
        GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE5);
        GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE6);
        this.onRefresh();
        this.onGuideHandler();

        this.idGuideGroup.visible = false;

        if (!UserInfo.guideJson["juQing"]) {
            UserInfo.guideJson["juQing"] = 100;
            this.idGuideGroup.visible = true;
            this.idGuideGroup.touchEnabled = true;
            this.idGuideGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGuideGroup, this);
            this._guideIndex = 1;
            this.idGuideImage.source = `guide_cundang_${this._guideIndex}_jpg`;
        }

        this.restartBtn.visible = isTXSP;
    }

    private onTouchGuideGroup() {
        this._guideIndex = this._guideIndex + 1;
        //四张后关闭引导
        if (this._guideIndex >= 5) {
            this.idGuideGroup.visible = false;
        } else {
            this.idGuideImage.source = `guide_cundang_${this._guideIndex}_jpg`;
        }
    }

    private onEventDown(event: egret.TouchEvent) {
        this.starPos = event.stageX;
    }

    private onEventEnd(event: egret.TouchEvent) {
        if (this.starPos > event.stageX) {
            if (this.starPos - event.stageX > 20) {
                this.onNextImg();
            }
        } else if (this.starPos < event.stageX) {
            if (event.stageX - this.starPos > 20) {
                this.onLastImg();
            }
        }
    }

    private onLastImg() {
        if (this.imgIndx - 1 < 0)
            return;
        this.play(false);
    }

    private onNextImg() {
        if (this.imgIndx + 1 >= this.imgMaxNumb)
            return;
        this.play(true);
    }

    private play(bo): void {
        if (this._playTween) return;
        this._playTween = true;
        let currIndex: number = this.imgIndx;
        let self = this;
        let tweenEnd = function (): void {
            self._playTween = false;
            egret.Tween.removeTweens(self.slideGroup);
        };
        if (bo) {
            this.imgIndx++;
            egret.Tween.get(this.slideGroup).to({x: -(this.imgIndx * size.width)}, 150, egret.Ease.sineIn).call(tweenEnd, this);
        } else {
            this.imgIndx--;
            egret.Tween.get(this.slideGroup).to({x: -(this.imgIndx * size.width)}, 150, egret.Ease.sineIn).call(tweenEnd, this);
        }

        this.qiuImgs[currIndex].source = 'cundang_dian2_png';
        this.qiuImgs[this.imgIndx].source = 'cundang_dian1_png';
    }

    private onSwitchKuai(tp: number) {
        this['fileBtn' + tp].touchEnabled = false;
        this._idx = 0;
        this.cunchuBtn.visible = tp != 1;
        this.timerLab.text = '';
        this.kuaiDatas = {};
        let juqingKuaiMax: number = 0;
        let fileData = this._curIdx == FILE_TYPE.AUTO_FILE ? UserInfo.curBokData : UserInfo.fileDatas[this._curIdx];
        if (!fileData) {
            fileData = new BookData();
        }
        let likeData = GameCommon.getInstance().getSortLike(0, fileData);
        let roleIdx: number = likeData.id;
        let juqingAry: number[] = GameDefine.ROLE_JUQING_TREE[roleIdx];
        if (this._curIdx != FILE_TYPE.AUTO_FILE) {
            if (UserInfo.fileDatas[this._curIdx]) {
                this.timerLab.text = '最后存储时间' + Tool.getCurrDayTime(UserInfo.fileDatas[this._curIdx].timestamp);
                juqingKuaiMax = GameCommon.getInstance().getCurJuqingID(UserInfo.fileDatas[this._curIdx]);
            }
        } else {
            for (let key in UserInfo.curBokData.allVideos) {
                let videoid: string = UserInfo.curBokData.allVideos[key];
                let spCfg: Modelshipin = JsonModelManager.instance.getModelshipin()[videoid];
                if (!spCfg) {
                    continue;
                }
                if (!juqingKuaiMax
                    || GameCommon.getInstance().checkJuqingKuaiOpen(spCfg.juqing, juqingKuaiMax, fileData)
                    && juqingAry.some(showid => showid === getJuqingConfig(spCfg.juqing).show)) {
                    juqingKuaiMax = spCfg.juqing;
                }
            }
        }

        this.kuaiDatas = {};
        for (let i: number = 0; i < juqingAry.length; i++) {
            let juqing_page: number = juqingAry[i];
            let allCfg = JsonModelManager.instance.getModeljuqingkuai()[juqing_page];
            if (!allCfg) break;
            for (let k in allCfg) {
                if (allCfg.hasOwnProperty(k)) {
                    if (allCfg[k].openVideo) {
                        if (GameCommon.getInstance().checkJuqingKuaiOpen(juqingKuaiMax, allCfg[k].id, fileData)) {
                            if (!this.kuaiDatas[allCfg[k].show]) {
                                this._idx = this._idx + 1;
                                this.kuaiDatas[allCfg[k].show] = allCfg[k];
                            }
                        }
                    } else {
                        if (!this.kuaiDatas[allCfg[k].show]
                            && (juqingKuaiMax >= allCfg[k].id)
                            || (allCfg[k].lastKuai === "" && this._curIdx === FILE_TYPE.AUTO_FILE)) {
                            this._idx = this._idx + 1;
                            this.kuaiDatas[allCfg[k].show] = allCfg[k];
                        }
                    }
                }
            }
        }

        this.imgIndx = 0;
        this.qiuImgs = [];
        this.qiuGroup.removeChildren();
        this.slideGroup.removeChildren();

        let models: Modeljuqingkuai[] = [];
        for (let k in this.kuaiDatas) {
            if (this.kuaiDatas.hasOwnProperty(k)) {
                models.push(this.kuaiDatas[k]);
                let img: eui.Image = new eui.Image;
                img.source = 'cundang_dian2_png';
                this.qiuGroup.addChild(img);
                this.qiuImgs.push(img);
            }
        }
        let item: PlotTreeItem;
        for (let i: number = models.length - 1; i >= 0; i--) {
            let cfg: Modeljuqingkuai = models[i];
            let nextkuaiID = juqingAry[Math.min(juqingAry.indexOf(cfg.show) + 1, juqingAry.length - 1)];
            item = new PlotTreeItem(cfg.show, nextkuaiID, tp);
            item.x = i * size.width + ((size.width - GameDefine.GAME_VIEW_WIDTH) / 2);
            this.slideGroup.addChild(item);
        }

        if (this._curIdx != 1 && models.length < 1) {
            this.noneFile.visible = true;
            this.slideGroup.visible = false;
            return;
        } else {
            this.noneFile.visible = false;
            this.slideGroup.visible = true;
        }

        if (models.length > 0) {
            this.imgIndx = models.length - 1;
        }
        if (this.qiuImgs[this.imgIndx]) {
            this.qiuImgs[this.imgIndx].source = 'cundang_dian1_png';
        }
        this.slideGroup.x = -(this.imgIndx * size.width);

        this.imgMaxNumb = this._idx;

        if (this._curIdx == FILE_TYPE.AUTO_FILE) {
            this.setPage(models);
        }
    }

    private setPage(models) {
        let curJuqingID: number = GameCommon.getInstance().getCurJuqingID(UserInfo.curBokData);
        const jqModels = JsonModelManager.instance.getModeljuqingkuai();
        for (let showid in jqModels) {
            if (jqModels.hasOwnProperty(showid)) {
                let jqmodels = jqModels[showid];
                for (let juqingid in jqmodels) {
                    if (jqmodels.hasOwnProperty(juqingid)) {
                        if (jqmodels[juqingid].id == curJuqingID) {
                            const newIndex = models.findIndex(model => model.show == showid);
                            if (newIndex !== -1) {
                                const currIndex = this.imgIndx;
                                this.imgIndx = newIndex;
                                this.slideGroup.x = -(this.imgIndx * size.width);
                                this.qiuImgs[currIndex].source = 'cundang_dian2_png';
                                this.qiuImgs[this.imgIndx].source = 'cundang_dian1_png';
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    private onGuideHandler(): void {
        this.guide_grp.visible = false;
    }

    private onClickRestartBtn() {
        GameCommon.getInstance().showConfirmTips("重新开始会清空自动存档，是否重新开始？", () => {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), {
                cfg: JsonModelManager.instance.getModeljuqingkuai()[1][1],
                idx: FILE_TYPE.AUTO_FILE
            });
        });
    }
}

/**剧情线树状图组件**/
class PlotTreeItem extends egret.DisplayObjectContainer {
    public index: number;
    public nextIdx: number;
    private readonly models: Modeljuqingkuai[];
    private UIDict;
    private refreshUIAry: string[];
    private handAni: my.Animation;
    private lockLayer: egret.DisplayObjectContainer;
    private readonly NOT_SHOW: number = 0;
    private readonly HAS_LOCK: number = 2;
    private readonly IS_OPEN: number = 1;
    private readonly _curFile: number = 0;
    private statusData = {};

    public constructor(index: number, nextIdx: number, tp) {
        super();
        this.width = GameDefine.GAME_VIEW_WIDTH;
        this.height = GameDefine.GAME_VIEW_HEIGHT;
        this._curFile = tp;
        this.index = index;
        this.nextIdx = nextIdx;
        this.models = JsonModelManager.instance.getModeljuqingkuai()[this.index];
        this.onInitUI();
    }

    public onUpdateStatus(): void {
        if (!this.UIDict || this.refreshUIAry) return;
        let _status: number;
        let index: number = 0;
        for (let id in this.models) {
            let cfg: Modeljuqingkuai = this.models[id];
            _status = this.getOpenStatus(cfg);
            this.statusData[cfg.id] = _status;
            /**根据状态来修改UI样式**/
            let slotImg: eui.Image;
            if (cfg.BE) {
                slotImg = this.UIDict[`BE_plot${cfg.id}`];
                if (!slotImg) slotImg = this.UIDict[`plot${cfg.id}_image`];//图片
            } else {
                slotImg = this.UIDict[`plot${cfg.id}_image`];//图片
            }
            let txtImg: eui.Image = this.UIDict[`plot${cfg.id}_txt`];//文字
            if (!slotImg)
                return;
            switch (_status) {
                case this.NOT_SHOW:
                    slotImg.visible = false;
                    if (txtImg) txtImg.visible = false;
                    break;
                case this.HAS_LOCK:
                    slotImg.visible = true;
                    if (txtImg) txtImg.visible = false;
                    this.addLock(cfg);
                    break;
                case this.IS_OPEN:
                    slotImg.visible = true;
                    if (txtImg) txtImg.visible = true;
                    break;
            }
            /**关系线逻辑处理**/
            let grayLineImg: eui.Image;
            let lightLineImg: eui.Image;
            if (!cfg.lastKuai) {
            } else if (cfg.lastKuai.indexOf(",") == -1 || index == 0) {
                grayLineImg = this.UIDict[`plot${cfg.id}_grayLine`];//暗线
                lightLineImg = this.UIDict[`plot${cfg.id}_lightLine`];//明线
                switch (_status) {
                    case this.NOT_SHOW:
                        if (grayLineImg) grayLineImg.visible = false;
                        if (lightLineImg) lightLineImg.visible = false;
                        break;
                    case this.HAS_LOCK:
                        if (grayLineImg) grayLineImg.visible = true;
                        if (lightLineImg) lightLineImg.visible = false;
                        break;
                    case this.IS_OPEN:
                        if (grayLineImg) grayLineImg.visible = true;
                        if (lightLineImg) lightLineImg.visible = true;
                        break;
                }
            } else {
                let lastkuaiAry: string[] = cfg.lastKuai.split(',');
                for (let i: number = 0; i < lastkuaiAry.length; i++) {
                    let lastKuaiId: string = lastkuaiAry[i];
                    grayLineImg = this.UIDict[`plot${cfg.id}_${lastKuaiId}_grayLine`];//暗线
                    lightLineImg = this.UIDict[`plot${cfg.id}_${lastKuaiId}_lightLine`];//明线
                    // this.statusData = this.statusData[parseInt(lastKuaiId)] ? this.statusData[parseInt(lastKuaiId)] : this.NOT_SHOW;
                    switch (_status) {
                        case this.NOT_SHOW:
                            if (grayLineImg) grayLineImg.visible = false;
                            if (lightLineImg) lightLineImg.visible = false;
                            break;
                        case this.HAS_LOCK:
                            if (grayLineImg) grayLineImg.visible = true;
                            if (lightLineImg) lightLineImg.visible = false;
                            break;
                        case this.IS_OPEN:
                            if (grayLineImg) grayLineImg.visible = true;
                            if (lightLineImg) lightLineImg.visible = true;
                            break;
                    }
                }
            }
            /**当前进行中的剧情用特效标记出来**/
            let curJuqingID: number = GameCommon.getInstance().getCurJuqingID(UserInfo.curBokData);
            if (this._curFile == FILE_TYPE.AUTO_FILE && cfg.id == curJuqingID) {
                if (!this.handAni) {
                    this.handAni = new my.Animation('juqing_kuang', -1);
                    this.addChild(this.handAni);
                    this.handAni.onPlay();
                }
                this.handAni.scaleX = this.handAni.scaleY = cfg.scal;
                if (cfg.BE == 1) {
                    this.handAni.x = slotImg.x + 55;
                    this.handAni.y = slotImg.y - 20;
                } else if (cfg.scal == 0.58) {
                    this.handAni.x = slotImg.x + (121 / 2) - 3;
                    this.handAni.y = slotImg.y - 20;
                } else {
                    this.handAni.x = slotImg.x + (210 / 2);
                    this.handAni.y = slotImg.y - 40;
                }
            }

            index++;
        }
        this.nextkuaiHandler();
    }

    private onInitUI(): void {
        let tree_json = RES.getRes(`plotTree${this.index}_json`);
        if (!tree_json) {
            // Tool.error(`剧情树状：缺少plotTree${this.index}_json文件`);
            return;
        }
        this.lockLayer = new egret.DisplayObjectContainer();
        this.UIDict = {};
        this.refreshUIAry = [];
        let plot_slots = tree_json.armature[0].skin[0].slot;
        plot_slots.forEach(slotObj => {
            let displayName: string = slotObj["name"];
            let transform = slotObj["display"][0]["transform"];
            let slotDisplay: eui.UIComponent;
            if (displayName.indexOf("txt") !== -1) {
                const id = displayName.replace('plot', '').replace('_txt', '');
                const juqing = JsonModelManager.instance.getModeljuqingkuai();
                for (let line in juqing) {
                    if (juqing.hasOwnProperty(line)) {
                        if (juqing[line][id]) {
                            const label: eui.Label = new eui.Label(juqing[line][id].name);
                            if (id === "70") {
                                label.size = 25;
                            }
                            slotDisplay = label;
                            break;
                        }
                    }
                }
                this.addChild(slotDisplay);
            } else {
                let slotImage: eui.Image = new eui.Image();
                if (displayName === "BE_plot56") {
                    slotImage.source = "cundang_betu_jiang_png";
                } else if (displayName.indexOf("BE_") === -1) {
                    slotImage.source = displayName + "_png";
                } else {
                    slotImage.source = "cundang_betu_png";
                }
                slotImage.x = transform.x;
                slotImage.y = transform.y;
                if (displayName.indexOf('plot') != -1 && displayName.indexOf('_image') != -1) {
                    slotImage.name = displayName.replace('plot', '').replace('_image', '');
                    slotImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
                } else if (displayName.indexOf('plot') != -1 && displayName.indexOf('BE_') != -1) {
                    slotImage.name = displayName.replace('plot', '').replace('BE_', '');
                    slotImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
                }
                slotDisplay = slotImage;
            }
            slotDisplay.x = transform.x;
            slotDisplay.y = transform.y;
            if (this.refreshUIAry.indexOf(displayName) == -1) {
                this.refreshUIAry.push(displayName);
            }
            this.UIDict[displayName] = slotDisplay;
            slotDisplay.visible = false;
            this.addChild(slotDisplay);
        });
        this.addEventListener(egret.Event.ENTER_FRAME, this.invalidateSize, this);
    }

    private invalidateSize(): void {
        if (!this.refreshUIAry || this.refreshUIAry.length == 0) {
            this.refreshUIAry = null;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.invalidateSize, this);
            this.onUpdateStatus();
        } else {
            for (let i: number = this.refreshUIAry.length - 1; i >= 0; i--) {
                let displayName: string = this.refreshUIAry[i];
                let slotDisplay: eui.Image = this.UIDict[displayName];
                if (slotDisplay.width != 0 && slotDisplay.height != 0) {
                    // slotDisplay.visible = true;
                    slotDisplay.x = slotDisplay.x - slotDisplay.width / 2;
                    slotDisplay.y = slotDisplay.y - slotDisplay.height / 2;
                    this.refreshUIAry.splice(i, 1);
                }
            }
        }
    }

    /** 处理尾页划线 **/
    private nextkuaiHandler(): void {
        if (this.nextIdx == this.index) return; //最后一页了 不用处理了
        let nextmodel: Modeljuqingkuai;
        const table = JsonModelManager.instance.getModeljuqingkuai()[this.nextIdx];
        for (let id in table) {
            if (table.hasOwnProperty(id)) {
                nextmodel = table[id];
                break;
            }
        }
        if (!nextmodel) return;
        let grayLineImg: eui.Image;
        let lightLineImg: eui.Image;
        let _status: number = this.getOpenStatus(nextmodel);

        if (nextmodel.lastKuai.indexOf(",") == -1) {
            grayLineImg = this.UIDict[`page${this.index}_last_grayLine`];//暗线
            lightLineImg = this.UIDict[`page${this.index}_last_lightLine`];//明线
            if (grayLineImg) grayLineImg.visible = _status != this.NOT_SHOW;
            if (lightLineImg) lightLineImg.visible = _status == this.IS_OPEN;
        } else {
            let lastkuaiAry: string[] = nextmodel.lastKuai.split(',');
            for (let i: number = 0; i < lastkuaiAry.length; i++) {
                let lastKuaiId: number = parseInt(lastkuaiAry[i]);
                grayLineImg = this.UIDict[`page${this.index}_last${lastKuaiId}_grayLine`];//暗线
                lightLineImg = this.UIDict[`page${this.index}_last${lastKuaiId}_lightLine`];//明线
                if (grayLineImg) grayLineImg.visible = _status != this.NOT_SHOW;
                if (lightLineImg) lightLineImg.visible = _status == this.IS_OPEN && this.statusData[lastKuaiId] && this.statusData[lastKuaiId] == this.IS_OPEN;
            }
        }
    }

    private getOpenStatus(juqingCfg: Modeljuqingkuai) {
        // 剧情3被删除掉了 不好改动配置 直接在代码里设置为不可见
        if (juqingCfg.id === 3) {
            return this.NOT_SHOW;
        }
        if (!UserInfo.curBokData) {
            return this.NOT_SHOW;
        }
        let fileData: BookData;
        if (this._curFile == FILE_TYPE.AUTO_FILE) {
            fileData = UserInfo.curBokData;
        } else {
            fileData = UserInfo.fileDatas[this._curFile];
        }
        if (["14", "24", "29", "35", "49"].indexOf(juqingCfg.lastKuai) !== -1 && this.getOpenStatus(getJuqingConfig(juqingCfg.lastKuai)) != this.NOT_SHOW) {
            const groupBlocks = this.getGroupBlocks(juqingCfg);
            if (groupBlocks.length > 1) {
                let qid;
                const x = JsonModelManager.instance.getModelanswer();
                for (const a in x) {
                    for (const b in x[a]) {
                        const answerConfig = x[a][b];
                        if (answerConfig.videos.split(",").indexOf(juqingCfg.videoId) !== -1) {
                            qid = answerConfig.qid;
                        }
                    }
                }
                const aid = fileData.answerId[qid];
                if (aid) {
                    if (groupBlocks.some(config => fileData.videoDic[config.videoId])) {
                        const answerVideos = JsonModelManager.instance.getModelanswer()[qid][aid - 1].videos.split(",");
                        if (answerVideos.indexOf(juqingCfg.videoId) === -1) {
                            return this.HAS_LOCK;
                        } else {
                            return this.IS_OPEN;
                        }
                    } else if (groupBlocks.some(config => fileData.allVideos[config.videoId])) {
                        return this._curFile === FILE_TYPE.AUTO_FILE ? this.HAS_LOCK : this.NOT_SHOW;
                    }
                } else {
                    return this._curFile === FILE_TYPE.AUTO_FILE ? this.HAS_LOCK : this.NOT_SHOW;
                }
            }
        }
        let curJuqingID: number = GameCommon.getInstance().getCurJuqingID(fileData);
        if (GameCommon.getInstance().checkJuqingKuaiOpen(curJuqingID, juqingCfg.id, fileData)) {//比当前剧情低的情况
            if (juqingCfg.id == curJuqingID) return this.IS_OPEN;
            else if (juqingCfg.videoId === "") return this.IS_OPEN;
            else if (fileData.videoDic[juqingCfg.videoId]) return this.IS_OPEN;
            else return this.HAS_LOCK;
        } else {//比当前剧情高的情况   就仅处理自动存档
            if (this._curFile == FILE_TYPE.AUTO_FILE) {
                curJuqingID = 0;
                let models;
                if (juqingCfg.show == this.index) models = this.models;
                else models = JsonModelManager.instance.getModeljuqingkuai()[juqingCfg.show];
                for (let id in models) {
                    if (models.hasOwnProperty(id)) {
                        let model: Modeljuqingkuai = models[id];
                        if (UserInfo.curBokData.allVideos[model.videoId]) {
                            if (curJuqingID == 0 || GameCommon.getInstance().checkJuqingKuaiOpen(model.id, curJuqingID, fileData)) {
                                curJuqingID = model.id;
                            }
                        }
                    }
                }
                if (curJuqingID > 0 && GameCommon.getInstance().checkJuqingKuaiOpen(curJuqingID, juqingCfg.id, fileData)) return this.HAS_LOCK;
            }
        }
        return this.NOT_SHOW;
    }

    private getGroupBlocks(blockConfig: Modeljuqingkuai) {
        const groupBlocks = [];
        const allJQConfig = JsonModelManager.instance.getModeljuqingkuai();
        for (const pageID in allJQConfig) {
            if (allJQConfig.hasOwnProperty(pageID)) {
                const pageConfig = allJQConfig[pageID];
                for (const JQID in pageConfig) {
                    if (pageConfig.hasOwnProperty(JQID)) {
                        const JQConfig = pageConfig[JQID];
                        if (JQConfig.lastKuai === blockConfig.lastKuai) {
                            groupBlocks.push(JQConfig);
                        }
                    }
                }
            }
        }
        return groupBlocks
    };

    private addLock(cfg: Modeljuqingkuai) {
        let heidiImg: eui.Image = new eui.Image();
        heidiImg.source = "cundang_iconhei_png";
        heidiImg.scaleX = heidiImg.scaleY = cfg.scal;

        let lockImg: eui.Image = new eui.Image();
        lockImg.source = "sc_shipin_suo_png";
        lockImg.scaleX = lockImg.scaleY = cfg.scal;
        this.addChild(heidiImg);
        this.addChild(lockImg);
        if (cfg.BE == 1) {
            let juqingImg: eui.Image = this.UIDict[`BE_plot${cfg.id}`];
            if (!juqingImg) {
                juqingImg = this.UIDict[`plot${cfg.id}_image`];
                if (cfg.scal == 0.58) {
                    heidiImg.x = juqingImg.x + 5;
                    heidiImg.y = juqingImg.y + 4;
                    lockImg.x = juqingImg.x + 38;
                    lockImg.y = juqingImg.y + 44;
                } else {
                    heidiImg.x = juqingImg.x + 8;
                    heidiImg.y = juqingImg.y + 8;
                    lockImg.x = juqingImg.x + 60;
                    lockImg.y = juqingImg.y + 70;
                }
            } else {
                heidiImg.source = 'cundang_iconhei1_png';
                lockImg.scaleX = lockImg.scaleY = 0.7;
                heidiImg.x = juqingImg.x + 1;
                heidiImg.y = juqingImg.y + 2;
                lockImg.x = juqingImg.x + 30;
                lockImg.y = juqingImg.y + 28;
            }
        } else {
            let juqingImg: eui.Image = this.UIDict[`plot${cfg.id}_image`];
            if (cfg.scal == 0.58) {
                heidiImg.x = juqingImg.x + 5;
                heidiImg.y = juqingImg.y + 4;
                lockImg.x = juqingImg.x + 38;
                lockImg.y = juqingImg.y + 44;
            } else {
                heidiImg.x = juqingImg.x + 8;
                heidiImg.y = juqingImg.y + 8;
                lockImg.x = juqingImg.x + 60;
                lockImg.y = juqingImg.y + 70;
            }
        }
    }

    private onTouchBtn(event: egret.Event) {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let name: number = Number(event.currentTarget.name);
        let allCfg = JsonModelManager.instance.getModeljuqingkuai()[this.index];
        if (allCfg[name]) {
            if (allCfg[name].openVideo) {
                if (this.getOpenStatus(allCfg[name]) == this.IS_OPEN) {
                    this.showConfirm(allCfg[name]);
                    return;
                }
                GameCommon.getInstance().showCommomTips('暂未开启');
            } else if (allCfg[name].videoId) {
                this.showConfirm(allCfg[name]);
            } else {
                // 没有openVideo也没有video的都是人物故事线剧情块，当作点击下一个块处理就行
                const allCfg = JsonModelManager.instance.getModeljuqingkuai()[this.index];
                const cfg = allCfg[name + 1];
                if (cfg) {
                    this.showConfirm(cfg);
                }
            }
        }
    }

    private showConfirm(cfg) {
        GameCommon.getInstance().showConfirmTips("是否读取？", () => {
            GameCommon.getInstance().showLoading();
            if (this._curFile != FILE_TYPE.AUTO_FILE) {
                UserInfo.curBokData = copyBookData(UserInfo.fileDatas[this._curFile]);
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), {
                cfg: cfg,
                idx: this._curFile
            });
        }, "自动存档将会被覆盖");
    }
}
