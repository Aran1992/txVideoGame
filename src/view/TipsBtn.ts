class TipsBtn extends eui.Component {
    public static Is_Guide_Bool: boolean;//是否要显示引导
    private guide_img: eui.Image;
    private addBtn: eui.Button;
    private reduceBtn: eui.Button;
    private play_pauseBtn: eui.Button;
    private showBtns: eui.Group;
    private bottomBtn: eui.Group;
    private bgBtn: eui.Button;
    private desc: eui.Label;
    private cundang1: eui.Button;
    private timeBar2: eui.ProgressBar;
    private timeBar1: eui.ProgressBar;
    private timeBar3: eui.ProgressBar;
    private timeBar4: eui.ProgressBar;
    private controlGroup: eui.Group;
    private fenxiangBtn: eui.Button;
    private qualityBtn: eui.Button;
    private speedBtn: eui.Button;
    private zimu: eui.Label;
    private mengban: eui.Image;
    private pauseGroup: eui.Group;
    private videoD: VideoData;
    private goMain: eui.Button;
    private tiaoBtn: eui.Button;
    private timeGroup: eui.Group;
    private playBtn: eui.Button;
    private spNames: string[] = ['', '1.5X', '1.25X', '1.0X'];
    private pinzhiNames: string[] = ['', '1080P', '720P', '480P'];
    private pinzhi: number = 1;
    private videoCurrentState: boolean = true;
    private timer: egret.Timer;
    private timerIdx: number = 0;
    private fileState: boolean = false;
    private starPosY: number = 0;
    private starPosX: number = 0;
    private isClick: boolean = true;
    private touchtime = new Date().getTime();
    private direction: number = 0;
    private beisuGroup: eui.Group;
    private pinzhiGroup: eui.Group;
    private speedDic: number[] = [0, 1.5, 1.25, 1];
    private sd: egret.Sound;
    private isSelect: boolean = false;
    private wentiId: number = 0;
    private tp: number = 0;
    private modelHuDong: Modelhudong;
    private hideTipTimer: number;
    private idGuideBuyLock: eui.Group;
    private tipsTotalTime: number;
    private idBtnClock: eui.Button;
    private idBtnShopCar: eui.Button;
    private idBtnTicket: eui.Button;


    /**选项对应的道具**/
    private Option_Goods = {
        "25": [500005, 500006, 0],
        "48": [500011, 0],
        "49": [500012, 500013, 0],
        "34": [500007, 500008, 500009, 500010],
    };

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onUpdateWentiBtnStatus, this);
    }

    public set imStatus(str) {
        if (str == 'pauseImg_png') {
            this.mengban.visible = false;
            this.pauseGroup.visible = false;
        }
        this.play_pauseBtn['iconDisplay'].source = str;
    }

    public onCloseMengBan() {
        if (!this.mengban)
            return;
        this.mengban.visible = false;
        this.pauseGroup.visible = false;
        this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
    }

    public onSetCunDangState(bo) {

        this.fileState = bo;
        if (!this.fileState && !this.videoCurrentState) {
            this.timerIdx = 3;
            this.controlGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
            this.videoCurrentState = true;
        }
    }

    public onShowChengJiuComplete() {

    }

    public onShowAddTime() {
        this.timeGroup.visible = true;
        let obj = this;
        Tool.callbackTime(function () {
            obj.timeGroup.visible = false;
        }, obj, 1000);
    }

    public setState(num: number = 1) {
        if (num == 0) {
            this.reduceBtn.visible = true;
            this.addBtn.visible = true;
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.controlGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
        }
        return false;
    }

    public setPauseState() {
        if (this.timer) {
            this.timerIdx = 0;
            this.timer.stop();
        }
        this.play_pauseBtn.touchEnabled = true;
        this.controlGroup.visible = true;
        this.mengban.visible = true;
        this.pauseGroup.visible = true;
        this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), false);
    }

    public onUpdateWenTi(id): void {
        let button = this['btn' + id];
        if (!button['lock_grp'].visible) {
            this.onSelectWenTi(id);
        }
    }

    public init(vData: VideoData) {
        this.videoD = vData;
    }

    public onCreateBtn(model: Modelwenti) {
        this.timerIdx = 0;
        this.wentiId = model.id;
        this.hideControl();
        if (model.id == '19') {
            this.desc.text = model.des;
            this.desc.visible = true;
        } else {
            this.desc.visible = false;
        }
        this.tp = model.type;
        this.isSelect = false;
        if (model.type == ActionType.OPTION) {
            this.showBtns.visible = true;
            let awardStrAry: string[] = model.ans.split(",");
            let cfgs = answerModels[this.wentiId];
            let idx: number = 0;
            for (let i: number = 0; i < 5; i++) {
                if (awardStrAry.length > i) {
                    this['btn' + (i + 1)].visible = true;
                    this['btn' + (i + 1)].alpha = 1;
                    this['btn' + (i + 1)].name = awardStrAry[i];
                    this['btn' + (i + 1)].label = cfgs[i].des;
                    this['btn' + (i + 1)]['iconDisplay'].source = 'wentikuang_png';
                    this['btn' + (i + 1)]['labelDisplay'].textColor = '0xffffff';
                    idx = i + 1;
                }
            }
            this.currentState = 'index' + idx;
            /**判断下问题是否带锁**/
            this.onUpdateWentiBtnStatus();


            this.zimu.bottom = 335;

            this.bottomBtn.visible = true;
            this.bottomBtn.alpha = 0;
            egret.Tween.get(this.bottomBtn).to({alpha: 1}, 500);

            this.timeBar3.visible = true;
            this.timeBar3.maximum = 100;
            this.timeBar3.value = 100;
            this.timeBar3.mask = this['mk'];

            this.timeBar1.maximum = 100;
            this.timeBar2.maximum = 100;
            this.timeBar1.width = size.width / 2;
            this.timeBar2.width = size.width / 2;

            this.hideTipTimer = undefined;

            this.tipsTotalTime = model.time;

            //新手引导问题
            if (this.wentiId == 5 && !UserInfo.guideJson["buyLock"]) {
                UserInfo.guideJson["buyLock"] = 100;
                VideoManager.getInstance().videoPause();
                this.idGuideBuyLock.visible = true;
                this.idGuideBuyLock.touchEnabled = true;
                this.idGuideBuyLock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGuideBuyLock, this);
                GuideManager.getInstance().isGuide = true;
                GuideManager.getInstance().curState = true;
            }

        } else {
            this.modelHuDong = JsonModelManager.instance.getModelhudong()[model.type];
            this.showBtns.visible = false;
            this.gotoAction(model);
        }
    }

    public hideTips(force?: boolean): void {
        if (this.hideTipTimer && !force) {
            return;
        }
        this.zimu.bottom = 100;
        this.bottomBtn.visible = false;
        if (this.videoD) {
            if (this.videoD.getIsClick(this.videoD) == 3 && this.timerIdx > 0 && this.timerIdx < 4) {
                this.timerIdx = 4;
                this.controlGroup.visible = false;
                if (this.timer) {
                    this.timerIdx = 0;
                    this.timer.stop();
                }
                this.videoCurrentState = true;
            }
        }
    }

    public setTips(remain): void {
        const total = this.tipsTotalTime;
        if (remain < 0) {
            remain = 0;
        }
        if (remain > total) {
            remain = total;
        }
        this.timeBar1.value = this.timeBar2.value = remain / total * 100;
        for (let i = 1; i < 3; i++) {
            const timeBar = this[`timeBar${i}`];
            egret.Tween.removeTweens(timeBar);
            egret.Tween.get(timeBar).to({value: 0}, remain * 1000);
        }
    }

    public log(str) {
        console.log(str);
    }

    protected onRegist(): void {
        this.timeGroup.visible = false;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_HAOGAN, this.onBuySuccessCallback, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_STATE_CHANGE, this.onGameStateChange, this);
        for (let i = 1; i < 6; i++) {
            this['btn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchVideo, this);
        }
        for (let k = 1; k < 4; k++) {
            this['pinzhi' + k].name = k + '';
            this['sp' + k].name = k + '';
            this['pinzhi' + k].label = this.pinzhiNames[k];
            this['sp' + k].label = this.spNames[k];
            this['pinzhi' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectPinZhi, this);
            this['sp' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectSpeed, this);
        }
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
        this.reduceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReduceVideo, this);
        this.play_pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        this.playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        this.cundang1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCunDang, this);
        this.goMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMain, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.speedBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.qualityBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeQuality, this);
        this.fenxiangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFenXiang, this);
        this.tiaoBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTiao, this);
        this.updateResize();
    }

    protected onRemove(): void {
        for (let i = 1; i < 6; i++) {
            this['btn' + i].name = i - 1;
            this['btn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchVideo, this);
        }

        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
        this.reduceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReduceVideo, this);
        this.cundang1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCunDang, this);
        this.speedBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetSpeed, this);
        this.play_pauseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);

    }

    //供子类覆盖
    protected onInit(): void {
        this.onRefresh();
    }

    protected onRefresh(): void {
        this.timeBar4.maximum = 100;
        this.timeBar4.value = 50;
    }

    protected onSkinName(): void {
        this.skinName = skins.TipsSkin;
    }

    private onTouchGuideBuyLock() {
        this.idGuideBuyLock.visible = false;
        GuideManager.getInstance().isGuide = false;
        GuideManager.getInstance().curState = false;

        VideoManager.getInstance().videoResume();
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onFenXiang() {
        this.updateChapterLockInfo()
        //this.videoD.onShowDetail();
    }

    private onTiao() {
        this.videoD.onTiao();
    }

    private onChangeQuality() {
        if (this.pinzhiGroup.visible) {
            this.pinzhiGroup.visible = false;
            return;
        }
        if (this.pinzhi == 1) {
            this.pinzhi = 2;
            GameDefine.VIDEO_PINZHI = 2;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SWITCH_QUALITY));
        } else {
            this.pinzhi = 1;
            GameDefine.VIDEO_PINZHI = 1;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SWITCH_QUALITY));
        }
        this.timerIdx = 0;
        this.pinzhiGroup.visible = true;
        this.beisuGroup.visible = false;
    }

    private onShowMain() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.hideTips();
        this.videoD.onCloseVideo();
        GameCommon.getInstance().hideTipsHuDong();
        this.mengban.visible = false;
        this.pauseGroup.visible = false;
    }

    private onEnd() {
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.timerIdx = 0;
        if (!this.isClick) {
            return;
        }
        if (this.videoD.getIsClick(this.videoD) == 3) {
            if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                this.controlGroup.visible = true;
                this.addBtn.touchEnabled = false;
                this.reduceBtn.touchEnabled = false;
                return;
            }
            if (this.timer)
                this.timer.stop();
            this.hideControl();
            return;
        }
        this.reduceBtn.touchEnabled = true;
        if (new Date().getTime() - this.touchtime < 250) {
            this.onPlay_Pause();
        } else {
            if (this.videoD) {
                this.fileState = true;
                this.touchtime = new Date().getTime();
                if (!this.controlGroup.visible) {
                    if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                        this.controlGroup.visible = true;
                        return;
                    }
                    this.timerIdx = 0;
                    this.controlGroup.visible = true;
                    this.onTimer();
                    if (!this.timer) {
                        this.timer = new egret.Timer(1000);
                        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                        this.timer.start();
                    } else {
                        this.timer.start();
                    }
                } else {
                    this.addBtn.touchEnabled = true;
                    if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
                        return;
                    }
                    if (this.timer) {
                        this.timer.stop();
                        this.hideControl();
                    }
                    this.controlGroup.visible = false;
                    this.zimu.bottom = 100;
                    this.videoCurrentState = true;
                    this.timerIdx = 4;
                    return;
                }
            }
        }
    }

    private hideControl() {
        this.timerIdx = 0;
        this.beisuGroup.visible = false;
        this.pinzhiGroup.visible = false;
        // this.controlGroup.alpha = 0;
        this.controlGroup.visible = false;
        this.zimu.bottom = 100;
    }

    private onHideGuide(e: egret.TouchEvent): void {
        this.guide_img.visible = false;
        this.mengban.visible = false;
        this.setPauseState();
        this.onShowBottomBtn(e);
        this.guide_img.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHideGuide, this);
    }

    private onShowBottomBtn(e: egret.TouchEvent) {
        if (TipsBtn.Is_Guide_Bool) {//新手引导 显示一张按钮指引的图
            this.setPauseState();
            TipsBtn.Is_Guide_Bool = false;
            this.guide_img.visible = true;
            this.mengban.visible = true;
            this.guide_img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHideGuide, this);
            this.controlGroup.visible = false;
            this.pauseGroup.visible = false;
            return;
        }

        if (e) {
            this.starPosY = e.stageY;
            this.starPosX = e.stageX;
        }

        this.direction = 0;
        if (this.starPosX > this.width / 2 - 150) {
            this.direction = 2;
        } else if (this.starPosX < this.width / 2 - 150) {
            this.direction = 1;
        }
        this.isClick = true;
        if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
            this.play_pauseBtn.touchEnabled = true;
        }
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
    }

    private onCunDang() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        GameCommon.getInstance().hideTipsHuDong();
        VideoManager.getInstance().videoPause();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'JuQingPanel');
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
        Tool.callbackTime(function () {
            GameDefine.IS_DUDANG = true;
        }, this, 200);
    }

    private onAddVideo() {
        this.timerIdx = 0;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ADD_VIDEO_SPEED));
    }

    private onReduceVideo() {
        this.timerIdx = 0;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.REDUCE_VIDEO_SPEED));
    }

    private onSetSpeed() {
        this.timerIdx = 0;
        if (this.beisuGroup.visible) {
            this.beisuGroup.visible = false;
            return;
        }

        this.beisuGroup.visible = true;
        this.pinzhiGroup.visible = false;
    }

    private onSelectPinZhi(event: egret.Event) {
        this.pinzhiGroup.visible = false;
        this.qualityBtn.label = event.target.label;
    }

    private onSelectSpeed(event: egret.Event) {
        const id: number = Number(event.target.name);
        this.beisuGroup.visible = false;
        this.speedBtn.label = event.target.label;
        VideoManager.getInstance().setSpeed(this.speedDic[id]);
        GameDefine.CUR_SPEED = this.speedDic[id];
    }

    private onPlay() {
        this.onPlay_Pause();
    }

    private onPlay_Pause() {
        if (this.play_pauseBtn['iconDisplay'].source == 'playImg_png') {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), true);
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.mengban.visible = false;
            this.pauseGroup.visible = false;
            this.controlGroup.visible = false;
            if (this.timer) {
                this.timerIdx = 0;
                this.timer.stop();
            }
            this.onSetCunDangState(this.fileState);
            return;
        }
        if (!this.videoD.getVideoPause()) {
            return;
        }
        this.timerIdx = 0;
        if (this.play_pauseBtn['iconDisplay'].source == 'pauseImg_png') {
            this.controlGroup.visible = true;
            this.mengban.visible = true;
            this.pauseGroup.visible = true;
            this.play_pauseBtn['iconDisplay'].source = 'playImg_png';
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), false);
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_PAUSE), true);
            this.play_pauseBtn['iconDisplay'].source = 'pauseImg_png';
            this.mengban.visible = false;
            this.pauseGroup.visible = false;
        }
        this.onSetCunDangState(this.fileState);
    }

    private onTouchVideo(event: egret.Event) {
        if (this.isSelect) return;
        let button = event.currentTarget;
        let id: number = Number(button.name);
        if (button['lock_grp'].visible) {
            SoundManager.getInstance().playSound("ope_click.mp3");
            VideoManager.getInstance().videoPause();
            PromptPanel.getInstance().onShowBuyHaoGan(this.wentiId, id);
        } else {
            SoundManager.getInstance().playSound("ope_select_tab.mp3");
            this.onSelectWenTi(id);
        }
    }

    private onSelectWenTi(id) {
        this.isSelect = true;
        for (let i: number = 1; i < 6; i++) {
            if (i == id) {
                this['btn' + i].alpha = 0.5;
                this['btn' + i]['iconDisplay'].source = 'common_select_png';
                this['btn' + i]['labelDisplay'].textColor = '0x000000';
                egret.Tween.get(this['btn' + i]).to({alpha: 1}, 300);
            } else {
                this['btn' + i].visible = false;
            }
        }
        this.timeBar3.visible = false;
        if (this.wentiId > 0)
            GameDispatcher.getInstance().dispatchEvent(
                new egret.Event(GameEvent.ONSHOW_VIDEO),
                {
                    answerId: id,
                    wentiId: this.wentiId,
                    click: true
                }
            );
        this.hideTipTimer = egret.setTimeout(() => {
            this.hideTips(true);
        }, this, 1000);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.cundang1.icon = 'cundang_png';
        this.onInit();
        this.onRegist();
        this.guide_img.visible = false;
        this.mengban.visible = false;
        this.pauseGroup.visible = false;
        this.sd = new egret.Sound();
        this.sd.load('resource/sound/click_sound.mp3');
    }

    //获得某个问题解锁需要的物品
    private getWentiItemNum(wentiId, id) {
        let itemId = GameCommon.getInstance().getWentiItemId(wentiId, id);
        return ShopManager.getInstance().getItemNum(itemId);
    }

    /**判断下问题是否带锁**/
    private onUpdateWentiBtnStatus(): void {
        for (let i: number = 1; i <= 5; i++) {
            this[`btn${i}`].lock_grp.visible = false;
        }
        //GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onUpdateWentiBtnStatus, this);
        const func = GameCommon.getInstance().getLockedOptionIDs[this.wentiId];
        if (func) {
            let lockOptIDs: number[] = func() || [];
            if (lockOptIDs.length > 0) {
                lockOptIDs.forEach(id => {
                    let itemNum = this.getWentiItemNum(this.wentiId, id);
                    this[`btn${id}`].lock_grp.visible = itemNum <= 0;
                })
            }
        }
    }

    private gotoAction(model: Modelwenti) {
        if (!this.modelHuDong)
            return;
        GuideManager.getInstance().isGuide = true;
        if (this.modelHuDong.tp == ActionType.MUSIC) {
            if (this.modelHuDong.id != 3) {
                GuideManager.getInstance().isGuide = false;
            }
        }
        ActionManager.getInstance().setAction(model, this);
    }

    private onTimer() {
        this.timerIdx = this.timerIdx + 1;
        if (this.timerIdx > 3 && this.play_pauseBtn['iconDisplay'].source != 'playImg_png') {
            this.timerIdx = 0;
            this.timer.stop();
            this.hideControl();
            return;
        }
    }

    private onBuySuccessCallback() {
        for (let i: number = 1; i <= 5; i++) {
            this[`btn${i}`].lock_grp.visible = false;
        }
    }

    private onGameStateChange(data) {
        if (data.new !== 'playing') {
            for (let i = 1; i < 3; i++) {
                const timeBar = this[`timeBar${i}`];
                egret.Tween.removeTweens(timeBar);
            }
        }
        //这里更新章节解锁信息
        this.updateChapterLockInfo();
    }

    private updateChapterLockInfo() {
        let curChapterId = UserInfo.curchapter;
        const curChapterCfg = JsonModelManager.instance.getModelchapter()[curChapterId];
        let nextChapterId = String(curChapterCfg.next);
        var arr = nextChapterId.split(";");
        let nnextChapterId = Number(arr[0]);
        //是否付费用户，下一章是否已上架
        if (platform.getPlatform() == "plat_txsp") {
            this.idBtnTicket.visible = true;
        } else {
            this.idBtnTicket.visible = false;
        }
        let onSale = GameCommon.getInstance().isChapterOnSale(nnextChapterId);
        let vipNum = ShopManager.getInstance().getItemNum(GameDefine.GUANGLIPINGZHENG);
        let isVip = vipNum > 0;
        //let freeDay = GameCommon.getInstance().getNextChapterFreeDay();
        if (isVip || nnextChapterId == 0 || !onSale) {
            this.idBtnClock.visible = false;
            this.idBtnTicket.visible = false;
        } else {
            this.idBtnClock.visible = true;
        }
        this.idBtnClock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnClockClick, this);
        this.idBtnShopCar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnShopCarClick, this);
        this.idBtnTicket.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnTicketClick, this);


        //VideoManager.getInstance().
    }

    private idBtnClockClick() {
        let freeDay = GameCommon.getInstance().getNextChapterFreeDay();
        if (freeDay > 0)
            GameCommon.getInstance().showCommomTips("下一章" + freeDay + "天后免费");
        else {
            GameCommon.getInstance().showCommomTips("您可以免费阅读下一章");
        }
    }

    private idBtnShopCarClick() {
        VideoManager.getInstance().videoPause();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            windowName: 'TicketPanel',
            data: "tipsbtnshopcar"
        });
    }

    private idBtnTicketClick() {
        VideoManager.getInstance().videoPause();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            windowName: 'TicketPanel',
            data: "tipsbtnticket"
        });
    }
}
