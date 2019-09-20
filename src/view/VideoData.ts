/**
 *
 * @author
 *
 */
class VideoData extends egret.DisplayObjectContainer {
    public tipsPanel: TipsBtn;
    public videoUpDataHandle: Function;
    public videoEndHandle: Function;
    public videoErrorHandle: Function;
    public videoNodeChangeHandle: Function;
    public isLoadSrc = false;
    public videoPauseTime: number = 0;
    public curWentiId: number = 0;
    private actionScene: egret.DisplayObjectContainer;
    /**下一个视频需要好感度才能播放的 否则进BE规则
     *  视频ID对应数组 是每个角色的好感度值
     * **/
    private Video_Like_Condition = {
        "V801": {likes: [2, 1, 3, 1], BEVideo: "V802"},
        "V907": {likes: [5, 1, 6, 2], BEVideo: "V908"},
    };
    /**下一个视频需要选项按照条件判断
     *  options选择的条件  errorNum打到条件的数量  nextVideoId达成的视频
     * **/
    private Video_Opt_Condition = {
        "VH1116": {options: {"54": 2, "55": 2, "56": 2}, errorNum: 2, nextVideoId: "VH1117"},
        "VX1204": {options: {"59": 1, "61": 1, "62": 1, "63": 1}, errorNum: 4, nextVideoId: "VX1205"},
        "VY1204": {options: {"68": 2, "69": 2, "70": 2}, errorNum: 2, nextVideoId: "VY1205"},
        "VW1201": {options: {"71": 2, "72": 2, "73": 2}, errorNum: 2, nextVideoId: "VW1202"},
    };
    private againTime: number = 0;
    private againFlg: boolean = false;
    private touchId: string;
    private fileTimerIdx: number = 0;
    private oldVideoTimer: number = 0;
    private _curSelf;
    private isDie = false;
    private isEndChapter: boolean = false;
    private videoState: string;
    private isHuDong = false;
    private isPlay: boolean = false;
    private touchtime: number = 0;
    private current: boolean = true;
    private isSelectVideo: boolean = false;
    private curAnswerCfg: Modelanswer;
    private curVIdeoIds: string[];
    private curVideoIndex: number = 0;
    private nextWentiId: number = 0;
    private _nextVid: string = '';
    private tiaoState: boolean = false;

    public constructor() {
        super();
        this.init();
        this.createGameScene();
        this.onRegistEvent();
    }

    public get videoIdx(): string {
        return VideoManager.getInstance().getVideoID();
    }

    /**读取当前视频ID**/
    public set videoIdx(videoid: string) {
        VideoManager.getInstance().updateVideoData(videoid);
    }

    private static isVideoTouch(id) {
        return id == 'V4111';
    }

    public onCloseMengBan() {
        this.tipsPanel.onCloseMengBan();
    }

    public onInitVideoData() {
        this.onCreateData();
        this.visible = true;
    }

    public againGame(nextid): void {
        this.tiaoState = false;
        this.onCreateData();
        this.visible = true;
        this.curWentiId = nextid;
        this.nextWentiId = nextid;
        this.curVideoIndex = 1;
        this.againFlg = true;
        GameDefine.IS_READ_PLAY = true;
        VideoManager.getInstance().onAgainGame(this.videoIdx);
    }

    public readFiel() {
        this.curAnswerCfg = null;
        if (!UserInfo.curBokData) {
            return;
        }
        this.tiaoState = false;
        if (GameDefine.IS_DUDANG && GameDefine.CUR_PLAYER_VIDEO == 1) {
            let src = '';
            if (UserInfo.curBokData.wentiId.length > 0) {
                src = UserInfo.curBokData.videoNames[UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1]]
            }
            if (this.videoIdx == src) {
                VideoManager.getInstance().videoResume();
                this.onInitVideoData();
                GameCommon.getInstance().removeLoading();
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                return;
            }
        }
        GameDefine.CUR_PLAYER_VIDEO = 1;
        this.onCreateData();
        GameCommon.getInstance().showLoading();
        this._nextVid = '';
        if (UserInfo.curBokData.wentiId.length > 0 && UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1]) {

            let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
            if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2]) {
                if (wentiModels[wentiId].chapter > wentiModels[UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2]].chapter) {
                    let curChapterCfg = JsonModelManager.instance.getModelchapter()[wentiModels[wentiId].chapter];
                    if (curChapterCfg.videoSrc.indexOf(",") >= 0) {
                        let videoIds = curChapterCfg.videoSrc.split(",");
                        this.videoIdx = videoIds[0];
                        this.curVIdeoIds = videoIds;
                        this.curVideoIndex = 1;
                    } else {
                        this.videoIdx = curChapterCfg.videoSrc;
                    }
                    this.curWentiId = wentiId;
                    this.isSelectVideo = false;
                    if (this.videoIdx == '') {
                        this.videoIdx = UserInfo.curBokData.videoNames[wentiId]
                    }
                    this.againFlg = true;
                    GameDefine.IS_READ_PLAY = true;
                    if (VideoManager.getInstance().getVideoData() && widPlayer) {
                        this.onContinue();
                    } else {
                        VideoManager.getInstance().onPlay(this.videoIdx);
                    }
                    return;
                }
            }
            this.curWentiId = wentiId;
            this.curVIdeoIds = UserInfo.curBokData.videoIds;
            let cfgs = answerModels[wentiId];
            this.curVideoIndex = 0;
            this.videoIdx = UserInfo.curBokData.videoNames[wentiId];
            this.isSelectVideo = false;
            if (UserInfo.curBokData.answerId[wentiId]) {
                this.isSelectVideo = true;
                for (let k in cfgs) {
                    if (cfgs.hasOwnProperty(k)) {
                        if (cfgs[k].ansid == UserInfo.curBokData.answerId[wentiId]) {
                            this.curAnswerCfg = cfgs[k];
                            break;
                        }
                    }
                }
                this.curWentiId = this.curAnswerCfg.nextid;
                this.nextWentiId = this.curAnswerCfg.nextid;
                if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
                    VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
                }
                if (this.curAnswerCfg.videos.indexOf(",") >= 0) {
                    this.curVIdeoIds = this.curAnswerCfg.videos.split(",");
                    this.videoIdx = '';
                    for (let i: number = 0; i < this.curVIdeoIds.length; i++) {
                        if (this.curVIdeoIds[i] == UserInfo.curBokData.videoNames[wentiId]) {
                            if (i < this.curVIdeoIds.length - 1) {
                                this.isSelectVideo = false;
                            }
                            this.curVideoIndex = i + 1;
                            this.videoIdx = UserInfo.curBokData.videoNames[wentiId];
                        }
                    }
                    if (this.videoIdx == '') {
                        this.isSelectVideo = false;
                        this.videoIdx = this.curVIdeoIds[0];
                        this.curVideoIndex = 1;
                    }
                } else {
                    this.isSelectVideo = false;
                    this.curVIdeoIds = [];
                    this.curVIdeoIds.push(this.curAnswerCfg.videos);
                    this.curVideoIndex = 1;
                    this.videoIdx = this.curAnswerCfg.videos;
                }
            } else if (UserInfo.curBokData.answerId[UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2]]) {
                wentiId = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2];
                this.isSelectVideo = true;
                cfgs = answerModels[wentiId];
                for (let k in cfgs) {
                    if (cfgs.hasOwnProperty(k)) {
                        if (cfgs[k].ansid == UserInfo.curBokData.answerId[wentiId]) {
                            this.curAnswerCfg = cfgs[k];
                            break;
                        }
                    }
                }
                this.curWentiId = this.curAnswerCfg.nextid;
                this.nextWentiId = this.curAnswerCfg.nextid;
                if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
                    VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
                }
                if (this.curAnswerCfg.videos.indexOf(",") >= 0) {
                    this.curVIdeoIds = this.curAnswerCfg.videos.split(",");
                    this.videoIdx = '';
                    for (let i: number = 0; i < this.curVIdeoIds.length; i++) {
                        if (this.curVIdeoIds[i] == UserInfo.curBokData.videoNames[wentiId]) {
                            this.curVideoIndex = i + 1;
                            if (i < this.curVIdeoIds.length - 1) {
                                this.isSelectVideo = false;
                            }
                            this.videoIdx = UserInfo.curBokData.videoNames[wentiId];
                        }
                    }
                    if (this.videoIdx == '') {
                        this.isSelectVideo = false;
                        this.videoIdx = this.curVIdeoIds[0];
                        this.curVideoIndex = 1;
                    }
                } else {
                    this.isSelectVideo = false;
                    this.curVIdeoIds = [];
                    this.curVIdeoIds.push(this.curAnswerCfg.videos);
                    this.curVideoIndex = 1;
                    this.videoIdx = this.curAnswerCfg.videos;
                }
            }
            if (this.videoIdx == '') {
                this.videoIdx = UserInfo.curBokData.videoNames[wentiId];
            }
            this.againFlg = true;
            GameDefine.IS_READ_PLAY = true;
            if (VideoManager.getInstance().getVideoData() && widPlayer) {
                let obj = this;
                VideoManager.getInstance().clear();
                Tool.callbackTime(function () {
                    VideoManager.getInstance().onAgainGame(obj.videoIdx);
                }, obj, 1000);

            } else {
                VideoManager.getInstance().onPlay(this.videoIdx);
            }
        } else {

        }
    }

    public addActionScene(ui: egret.DisplayObjectContainer) {
        this.actionScene.addChild(ui);
    }

    public onWaitin() {
    }

    public setVideoTouch(id: string) {
        if (id && id != this.touchId) {
            this.touchId = id;
            if (VideoData.isVideoTouch(id)) {
                ActionManager.getInstance().setAction(wentiModels[this.curWentiId], this.tipsPanel);
                ViewTouch.isTouch = true;
            }
        }
    }

    public log(str) {
        if (this.tipsPanel) {
            this.tipsPanel.log(str);
        }
    }

    public starVideo(wenti) {
        if (!UserInfo.curBokData)
            UserInfo.curBokData = new BookData();
        GameDefine.CUR_PLAYER_VIDEO == 1;
        this.curWentiId = wenti;
        this.nextWentiId = wenti;
        this.onCreateData();
        GameDefine.IS_READ_PLAY = true;
        if (!this.curVIdeoIds) {
            this.curVIdeoIds = [];
        }
        VideoManager.getInstance().onPlay(this.videoIdx);
    }

    public checkVideoTime(videoName) {
        this.videoIdx = videoName;
        GameCommon.getInstance().showLoading();
        videoAdvanceLoad = false;
        videoNextFlg = true;
        videoNextFlg1 = true;
        let tips = this.tipsPanel;
        this.isPlay = false;
        if (!videoModels[this.videoIdx]) return;
        this.isLoadSrc = false;
        this.isHuDong = false;
        if (!ViewTouch.isTouch) {
            this.setVideoTouch(this.videoIdx);
        }
        this.fileTimerIdx = 6500;
        let isShowRes: boolean = false;
        let isShowEnd: boolean = false;
        let isShowHuDong: boolean = false;
        let isShowChengJiu: boolean = false;
        let isResult: boolean = false;
        let isFile: boolean = false;
        if (!this.videoUpDataHandle) {
            this.videoUpDataHandle = new function () {
            };
            widPlayer.on('timeupdate', () => {
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                if (!widPlayer || !videoModels[this.videoIdx] || widPlayer.getDuration() == 0) {
                    return;
                }
                if (this.videoIdx == 'V019' && VideoManager.getInstance().videoCurrTime() >= VideoManager.getInstance().getVideoDuration() - 10 && !isShowChengJiu) {
                    if (videoModels[this.videoIdx].chengjiuId != '') {
                        isShowChengJiu = true;
                        ChengJiuManager.getInstance().onCheckShiPinChengJiu(videoModels[this.videoIdx].chengjiuId);
                    }
                }
                this.isEndChapter = false;
                if (GameDefine.IS_DUDANG) {
                    GameDefine.IS_DUDANG = false;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel')
                }
                if (VideoManager.getInstance().videoCurrTime() > 3 && !isFile) {
                    if (this.curWentiId > 0) {
                        if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1] != this.curWentiId) {
                            UserInfo.curBokData.wentiId.push(this.curWentiId);
                        }
                        if (UserInfo.curBokData.videoNames[this.curWentiId] != this.videoIdx) {
                            UserInfo.curBokData.videoNames[this.curWentiId] = this.videoIdx;
                        }
                        this.log('存一下' + this.curWentiId + '---' + this.videoIdx);
                        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
                        isFile = true;
                    }
                }
                if (this.againTime > 0 && this.againTime > VideoManager.getInstance().videoCurrTime()) {
                    if (this.againTime < VideoManager.getInstance().getVideoDuration()) {
                        widPlayer.seek(this.againTime);
                        this.againTime = 0;
                    }
                }
                if (videoModels[this.videoIdx].jtime) {
                    if (videoModels[this.videoIdx].tiaozhuan != TIAOZHUAN_Type.RESULT) {
                        if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[this.videoIdx].jtime) && !isShowEnd) {
                            this.isSelectVideo = false;
                            this.curVIdeoIds = [];
                            this.curVideoIndex = 0;
                            this.fileTimerIdx = 0;
                            this.tipsPanel.hideTips();
                            let vd = new ViewEnd(true, videoModels[this.videoIdx].tiaozhuan);
                            this.addChild(vd);
                            isShowEnd = true;
                            return;
                        }
                        if (VideoManager.getInstance().videoCurrTime() >= Math.round(VideoManager.getInstance().getVideoDuration()) - 3) {
                            widPlayer.seek(Number(videoModels[this.videoIdx].jtime) + 3);
                        }
                        if (isShowEnd) {
                            return;
                        }
                    } else {
                        if (videoModels[this.videoIdx].tiaozhuan == TIAOZHUAN_Type.RESULT) {
                            if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[this.videoIdx].jtime) && !isShowRes) {
                                this.onShowResult();
                                isShowRes = true;
                                return;
                            }
                            if (!videoNextFlg || isShowRes) {
                                return;
                            }
                        }
                        return;
                    }
                }
                this.setVideoTouch(this.videoIdx);
                if (ViewTouch.isTouch && this.videoIdx == 'V4111') {
                    if (VideoManager.getInstance().videoCurrTime() > VideoManager.getInstance().getVideoDuration() - 10 && !this.isSelectVideo) {
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_FULL_END), wentiModels[this.curWentiId].moren + 3);
                    }
                    return;
                }
                if (this && VideoManager.getInstance().getVideoDuration() > 0) {
                    if (this.curWentiId >= 1) {
                        if (VideoManager.getInstance().videoCurrTime() >= VideoManager.getInstance().getVideoDuration())
                            return;

                        if (videoModels[this.videoIdx] && Number(videoModels[this.videoIdx].time) > 0) {
                            if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[this.videoIdx].time) - 3 && !isShowHuDong) {
                                isShowHuDong = true;
                                GameCommon.getInstance().setTipsHuDong();

                                VideoManager.getInstance().setSpeed(1);
                            }

                            let lastTime: number = Number(wentiModels[this.curWentiId].time) + Number(videoModels[this.videoIdx].time);
                            if (VideoManager.getInstance().videoCurrTime() >= lastTime - 10 && !videoAdvanceLoad) {
                                videoAdvanceLoad = true;
                                VideoManager.getInstance().onLoad(this.curWentiId)
                            }
                            if (lastTime >= VideoManager.getInstance().getVideoDuration()) {
                                lastTime = VideoManager.getInstance().getVideoDuration() - 1;
                            }

                            if (Math.floor(VideoManager.getInstance().videoCurrTime()) >= lastTime - 0.5) {
                                if (videoNextFlg1 && !this.isSelectVideo && wentiModels[this.curWentiId].type == ActionType.OPTION) {
                                    videoNextFlg1 = false;
                                    this.isSelectVideo = true;
                                    this.onLoadNextVideo();
                                    return;
                                } else if (Math.floor(VideoManager.getInstance().videoCurrTime()) >= lastTime) {
                                    tips.hideTips();
                                }
                            }
                            if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[this.videoIdx].time) && VideoManager.getInstance().videoCurrTime() < lastTime) {
                                if (videoNextFlg) {
                                    GameCommon.getInstance().hideTipsHuDong();
                                    tips.onCreateBtn(wentiModels[this.curWentiId]);
                                    this.isHuDong = true;
                                    videoNextFlg = false;
                                }
                                tips.setTips(Math.floor(lastTime) - Math.floor(VideoManager.getInstance().videoCurrTime()), this.isSelectVideo);
                            } else if (VideoManager.getInstance().videoCurrTime() >= lastTime - 1 && videoNextFlg1) {
                                if (this.curAnswerCfg && this.curAnswerCfg.isdie == 1) {
                                    this.isDie = true;
                                    videoNextFlg1 = false;
                                } else {
                                    if (videoNextFlg1 && !this.isSelectVideo && wentiModels[this.curWentiId].type == ActionType.OPTION) {
                                        videoNextFlg1 = false;
                                        this.isSelectVideo = true;
                                        this.onLoadNextVideo();
                                    }
                                }
                            }
                        } else {
                            if (VideoManager.getInstance().videoCurrTime() >= Math.round(VideoManager.getInstance().getVideoDuration()) / 2 - 10 && !this.isSelectVideo) {
                                this.isSelectVideo = true;
                                VideoManager.getInstance().isReadySet = true;
                                let likeConditionData = this.Video_Like_Condition[this.videoIdx];
                                if (likeConditionData) {
                                    let isBeCond: boolean = true;
                                    for (let i: number = 0; i < ROLE_INDEX.SIZE; i++) {
                                        let curRlike_num: number = GameCommon.getInstance().getRoleLikeAll(i);
                                        if (curRlike_num > likeConditionData.likes[i]) {
                                            isBeCond = false;
                                            break;
                                        }
                                    }
                                    if (isBeCond) {
                                        this.curVIdeoIds = [likeConditionData.BEVideo];
                                        this.curVideoIndex = 0;
                                        this.tipsPanel.hideTips();
                                    }
                                }
                                let optConditionData = this.Video_Opt_Condition[this.videoIdx];
                                if (optConditionData) {
                                    let errorNum: number = 0;
                                    for (let condWentiID in optConditionData.options) {
                                        if (optConditionData.options.hasOwnProperty(condWentiID)) {
                                            let cond_optID: number = optConditionData.options[condWentiID];
                                            let select_optID: number = UserInfo.curBokData.answerId[condWentiID];
                                            if (!select_optID || select_optID == cond_optID) {
                                                errorNum++;
                                            }
                                        }
                                    }
                                    if (errorNum >= optConditionData.errorNum) {
                                        this.curVIdeoIds = [optConditionData.nextVideoId];
                                        this.curVideoIndex = 0;
                                    }
                                }
                                if (this.videoIdx == 'VY1206') {
                                    let like_wanxun: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.WanXun_Xiao, 30);
                                    let like_qianye: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.QianYe_Xiao, 30);
                                    if (like_wanxun == like_qianye) {
                                        this.curVIdeoIds = ['VY1207'];
                                        this.curVideoIndex = 0;
                                    }
                                }

                                let nextVideoSrc: string = this.curVIdeoIds[this.curVideoIndex];
                                Tool.callbackTime(function () {
                                    VideoManager.getInstance().onLoadSrc(nextVideoSrc);
                                }, this, 1000);
                                this._nextVid = nextVideoSrc;
                            }
                            tips.hideTips();
                        }
                    } else if (videoModels[this.videoIdx]) {
                        if (videoModels[this.videoIdx].tiaozhuan == TIAOZHUAN_Type.WENTI) {
                            if (videoNextFlg1 && VideoManager.getInstance().videoCurrTime() >= Number(videoModels[this.videoIdx].jtime) - 10) {
                                videoNextFlg1 = false;
                                let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                                VideoManager.getInstance().onLoad(UserInfo.curBokData.videoNames[wentiId]);
                                return;
                            }
                        }
                    }
                }
            })
        }
        if (!this.videoEndHandle) {
            widPlayer.on('statechange', (data) => {
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                this.log(data.old + '-----------' + data.new);
                if (data.new == 'buffering' || data.new == 'seeking') {
                    GameCommon.getInstance().showLoading();
                } else if (data.new == 'end') {
                    this.isEndChapter = true;
                    this.onShowNextVideo();
                } else {
                    GameCommon.getInstance().removeLoading();
                }
                this.videoState = data.new;
            });
            this.videoEndHandle = () => {
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                if (this) {
                    this.onShowNextVideo();
                }
            }
        }
        if (!this.videoErrorHandle) {
            widPlayer.on('error', (error) => {
                if (error.code == 14001) {
                    GameCommon.getInstance().showErrorLog(JSON.stringify(error));
                    GameCommon.getInstance().showCommomTips('preload失败请重新进入游戏');
                    VideoManager.getInstance().clear();
                    this.touchEnabled = false;
                    this.touchChildren = false;

                }
            })
        }

        if (!this.videoNodeChangeHandle) {
            widPlayer.on('videoNodeChange', () => {
                GameCommon.getInstance().removeLoading();
                if (!widPlayer) {
                    this.isPlay = false;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                } else {
                    isShowRes = false;
                    isShowEnd = false;
                    isResult = false;
                    isFile = false;
                    isShowHuDong = false;
                    videoAdvanceLoad = false;
                    videoNextFlg = true;
                    videoNextFlg1 = true;
                    this.isSelectVideo = false;

                    if (this.againFlg) {
                        if (this.againTime > 0) {
                            widPlayer.seek(this.againTime);
                        }
                        this.againFlg = false;
                    } else {
                        if (this.curVIdeoIds && this.curVideoIndex < this.curVIdeoIds.length) {
                            this.videoIdx = this.curVIdeoIds[this.curVideoIndex];
                            this.curVideoIndex = this.curVideoIndex + 1;
                        }
                        if (this._nextVid) {
                            this.videoIdx = this._nextVid;
                        }
                    }
                    this.isPlay = false;
                    this.log('videoNodeChange切换视频');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ResultWinPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                }

            })
        }
        Tool.callbackTime(() => {
            if (!widPlayer) {
                this.log('重新create');
                VideoManager.getInstance().againInit();
            }
        }, this, 5000);
    }

    public onCloseVideo() {
        if (this.curWentiId > 0) {
            this.fileTimerIdx = 0;
            if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1] != this.curWentiId) {
                UserInfo.curBokData.wentiId.push(this.curWentiId);
            }
            if (UserInfo.curBokData.videoNames[this.curWentiId] != this.videoIdx) {
                UserInfo.curBokData.videoNames[this.curWentiId] = this.videoIdx;
            }
            UserInfo.curBokData.times[this.curWentiId] = Math.floor(VideoManager.getInstance().videoCurrTime());
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        } else {
            if (UserInfo.curBokData.wentiId.length > 0) {
                let wId = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                if (UserInfo.curBokData.videoNames[wId] != this.videoIdx) {
                    UserInfo.curBokData.videoNames[wId] = this.videoIdx;
                }
                UserInfo.curBokData.times[wId] = Math.floor(VideoManager.getInstance().videoCurrTime());
                GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            }
        }
        GameCommon.getInstance().removeLoading();
        VideoManager.getInstance().videoPause();
        this.tipsPanel.hideTips();
        this.tipsPanel.visible = false;
        this.visible = false;
        Tool.callbackTime(function () {
            GameDefine.IS_DUDANG = true;
        }, this, 200);
        GameCommon.getInstance().hideTipsHuDong();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));

    }

    public onShowNextVideo() {
        if (this.isPlay) {
            return;
        }
        this.tiaoState = false;
        UserInfo.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.videoDic[this.videoIdx] = this.videoIdx;
        this.isLoadSrc = false;
        if (this.videoIdx != 'V019' && videoModels[this.videoIdx].chengjiuId != '') {
            ChengJiuManager.getInstance().onCheckShiPinChengJiu(videoModels[this.videoIdx].chengjiuId);
        }
        if (videoModels[this.videoIdx].tiaozhuan == TIAOZHUAN_Type.RESULT) {
            this.isPlay = true;
            return;
        }
        if (videoModels[this.videoIdx].shanhuiid != '' || videoModels[this.videoIdx].tiaozhuan != 0) {
            this.curVIdeoIds = [];
            this.curVideoIndex = 0;
            this.fileTimerIdx = 0;
            this.tipsPanel.visible = false;
            let vd = new ViewEnd(true, videoModels[this.videoIdx].tiaozhuan);
            this.addChild(vd);
        } else {
            if (this.curVideoIndex >= this.curVIdeoIds.length || this.curVIdeoIds.length == 0) {
                this.onShowResult();
                return;
            }
            if (this.tipsPanel) {
                this.tipsPanel.hideTips();
            }
            if (this.curVideoIndex >= this.curVIdeoIds.length - 1) {
                this.curWentiId = this.nextWentiId;
            }
        }
    }

    public getVideoPause() {
        let endTim = VideoManager.getInstance().getVideoDuration();
        let curTim = VideoManager.getInstance().videoCurrTime();
        if (endTim > 0 && curTim > 1 && curTim < endTim - 1) {
            let curT = Tool.getCurrTime();
            if (curT > this.videoPauseTime + 1000) {
                this.videoPauseTime = curT;
                return true;
            }
        }
    }

    public setVideos(videos) {
        this.curVideoIndex = 0;
        this.curVIdeoIds = videos;
    }

    public onTiao() {
        let wentiTime: number = 0;
        if (VideoManager.getInstance().videoCurrTime() < 1)
            return;
        if (Number(videoModels[this.videoIdx].time) > 0) {
            wentiTime = Number(videoModels[this.videoIdx].time);
        }
        if (wentiTime > 0) {
            if (!this.isSelectVideo && VideoManager.getInstance().videoCurrTime() < wentiTime - 3 && VideoManager.getInstance().getVideoDuration() > wentiTime - 3 && !this.tiaoState) {
                this.tiaoState = true;
                widPlayer.seek(wentiTime - 2);
            } else if (VideoManager.getInstance().videoCurrTime() + 5 < VideoManager.getInstance().getVideoDuration() && !this.tiaoState) {
                this.tiaoState = true;
                widPlayer.seek(VideoManager.getInstance().getVideoDuration() - 4)
            }
        } else if (VideoManager.getInstance().videoCurrTime() + 5 < VideoManager.getInstance().getVideoDuration() && !this.tiaoState) {
            if (Number(videoModels[this.videoIdx].jtime) > 0 && videoModels[this.videoIdx].tiaozhuan == 4) {
                if (VideoManager.getInstance().videoCurrTime() + 5 < Number(videoModels[this.videoIdx].jtime)) {
                    this.tiaoState = true;
                    widPlayer.seek(Number(videoModels[this.videoIdx].jtime))
                }
            } else {
                this.tiaoState = true;
                widPlayer.seek(VideoManager.getInstance().getVideoDuration() - 4)
            }

        }
    }

    public testHudong(wentId: number): void {
        ActionManager.getInstance().setAction(wentiModels[wentId], this.tipsPanel);
    }

    public getIsClick(vd: VideoData) {
        if (!widPlayer || !videoModels[this.videoIdx]) {
            return 0;
        }
        let tim = Math.floor(VideoManager.getInstance().videoCurrTime());
        let tim1 = Number(videoModels[this.videoIdx].time);
        this.curWentiId;
        let wentiTime = 0;
        if (wentiModels[this.curWentiId]) {
            if (videoModels[this.videoIdx].tiaozhuan > 0) {
                wentiTime = 0;
            } else {
                wentiTime = wentiModels[this.curWentiId].time;
            }
        }
        if (tim1 > 0) {
            if (wentiTime > 0) {
                if (tim >= (tim1 - 1) && tim <= Number(tim1) + wentiTime) {
                    return 3;
                }
            } else {
                if (!vd.isSelectVideo && tim >= (tim1 - 1)) {
                    return 3;
                }
            }

        }
        return 0;
    }

    protected createGameScene(): void {
        VideoManager.getInstance().init(this);
        this.onCreateData();
    }

    private onRegistEvent(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.ONSHOW_VIDEO, this.onRefreshVideo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.REDUCE_VIDEO_SPEED, this.onReduceVideo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.ADD_VIDEO_SPEED, this.onAddVideo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_PAUSE, this.onPlay_Pause, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_OVER, this.onGameOver, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CHENGJIU_COMPLETE, this.onCompleteChengJiu, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GUIDE_STOP_GAME, this.onGuideStopGame, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.IOS_GAME_PLAY, this.onPlayIos, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_FULL_END, this.onVideo_Full_End, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_CHAPTER_END, this.onStopVideo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CONTINUE, this.onContinue, this);

    }

    private onCompleteChengJiu() {
        if (this.tipsPanel) {
            this.tipsPanel.onShowChengJiuComplete();
        }
    }

    private onContinue(): void {
        this.curAnswerCfg = null;
        VideoManager.getInstance().loadSrc = '';
        this.onCreateData();
        this.tiaoState = false;
        GameDefine.IS_READ_PLAY = true;
        let chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        if (!this.isEndChapter) {
            VideoManager.getInstance().onSetSrc1(UserInfo.curBokData.videoNames[chapCfg.wenti]);
        } else {
            this.againFlg = true;
            videoNextFlg1 = true;

            this.curWentiId = chapCfg.wenti;
            this.nextWentiId = chapCfg.wenti;
            this.isSelectVideo = false;
            this._nextVid = '';
            this.videoIdx = UserInfo.curBokData.videoNames[this.curWentiId];
            VideoManager.getInstance().onAgainGame(this.videoIdx);
            return;
        }
        this.againFlg = true;
        videoNextFlg1 = true;

        this.tipsPanel.log('');
        Tool.callbackTime(() => {
            this.curWentiId = chapCfg.wenti;
            this.nextWentiId = chapCfg.wenti;
            this.isSelectVideo = false;
            this._nextVid = '';
            this.videoIdx = UserInfo.curBokData.videoNames[this.curWentiId];
        }, this, 1000);
    }

    private onGameOver(): void {
        this.curAnswerCfg = null;
        this.againFlg = true;
        videoNextFlg1 = true;
        this.tipsPanel.visible = true;
        this.tiaoState = false;
        if (UserInfo.curBokData.wentiId.length > 0 && UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2]) {
            this.onCreateData();
            this.tipsPanel.setState(0);
            let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2];
            let curWentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
            let cfgs = answerModels[wentiId];
            this.curWentiId = curWentiId;
            this.nextWentiId = curWentiId;
            this.curVideoIndex = 0;
            if (UserInfo.curBokData.answerId[wentiId]) {
                for (let k in cfgs) {
                    if (cfgs.hasOwnProperty(k)) {
                        if (cfgs[k].ansid == UserInfo.curBokData.answerId[wentiId]) {
                            this.curAnswerCfg = cfgs[k];
                            break;
                        }
                    }
                }
                if (this.curAnswerCfg.videos.indexOf(",") >= 0) {
                    this.curVIdeoIds = this.curAnswerCfg.videos.split(",");
                    this.curVideoIndex = this.curVIdeoIds.length;
                    this.videoIdx = this.curVIdeoIds[this.curVIdeoIds.length - 1]
                } else {
                    this.videoIdx = this.curAnswerCfg.videos;
                    this.curVideoIndex = 1;
                }
            } else {
                this.videoIdx = UserInfo.curBokData.videoNames[curWentiId]
            }
            this._nextVid = '';
            this.isSelectVideo = false;
            GameDefine.IS_READ_PLAY = true;
            VideoManager.getInstance().onSetSrc1(this.videoIdx);
            this.againTime = Number(videoModels[this.videoIdx].time) - 5;
        }
    }

    private init(): void {

    }

    private onCreateData(): void {
        if (!this.tipsPanel) {
            this.width = size.width;
            this.height = size.height;
            this.tipsPanel = new TipsBtn();
            this.addChild(this.tipsPanel);
            this.tipsPanel.init(this);
            this.actionScene = new egret.DisplayObjectContainer();
            this.addChild(this.actionScene);
            ActionManager.getInstance().init(this);
        }
        this.tipsPanel.visible = true;
        this.touchEnabled = false;
        this.tipsPanel.onCloseMengBan();
        this._curSelf = this;
    }

    private onPlayIos() {
    }

    private onStopVideo() {
    }

    private onShowResult() {
        let isEnd: boolean = false;
        let isFindNext: boolean = false;
        let curWentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
        if (!isFindNext) {
            for (let qid in answerModels) {
                let answCfgs = answerModels[qid];
                let optionID: number = UserInfo.curBokData.answerId[qid];
                if (optionID && answCfgs[optionID - 1]) {
                    let ansCfg: Modelanswer = answCfgs[optionID - 1];
                    if (ansCfg.videos.indexOf(this.videoIdx) != -1 && ansCfg.nextChapterId > 0) {
                        isFindNext = true;
                        curWentiId = ansCfg.qid;
                        isEnd = VideoManager.getInstance().updateGameChapter(ansCfg.nextChapterId);
                        break;
                    }
                }
                if (isFindNext) break;
            }
        }

        if (!isFindNext) {
            let likeData = GameCommon.getInstance().getSortLike();
            let roleIdx: number = likeData.id;
            let juqingAry: number[] = GameDefine.ROLE_JUQING_TREE[roleIdx];
            if (juqingAry[juqingAry.length - 1] == UserInfo.curchapter || UserInfo.curchapter == 0) {
                this.isEndChapter = true;
                GameCommon.getInstance().removeLoading();
                VideoManager.getInstance().videoPause();
                this.tipsPanel.hideTips();
                this.tipsPanel.visible = false;
                this.visible = false;
                Tool.callbackTime(function () {
                    GameDefine.IS_DUDANG = true;
                }, this, 200);
                GameCommon.getInstance().hideTipsHuDong();
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
                return;
            }
        }

        UserInfo.curBokData.videoDic[this.videoIdx] = this.videoIdx;
        UserInfo.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.videoNames[curWentiId] = this.videoIdx;
        this.actionScene.touchEnabled = true;
        this.actionScene.touchChildren = true;

        this.isSelectVideo = false;
        this.curVIdeoIds = [];
        this.curVideoIndex = 0;
        let chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        let videoIds = chapCfg.videoSrc.split(",");
        this.setVideos(videoIds);
        this.curVideoIndex = 1;
        let videoSrc = videoIds[0];
        UserInfo.curBokData.wentiId.push(chapCfg.wenti);
        UserInfo.curBokData.videoDic[videoSrc] = videoSrc;
        UserInfo.curBokData.videoNames[chapCfg.wenti] = videoSrc;
        UserInfo.curBokData.times[chapCfg.wenti] = 0;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        this.fileTimerIdx = 0;
        this.tipsPanel.hideTips();
        this.tipsPanel.visible = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));

        if (UserInfo.curchapter == 1) {
            let shop400001: ShopInfoData = ShopManager.getInstance().getShopInfoData(400001);
            if (shop400001.num == 0) {
                VideoManager.getInstance().clear();
                GameCommon.getInstance().onShowBuyTips(shop400001.id, shop400001.model.currPrice, GOODS_TYPE.DIAMOND);
                ChengJiuManager.getInstance().curChapterChengJiu = {};
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
                let onBuy400001Complte = function (): void {
                    GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, onBuy400001Complte, this);
                    let shop400001: ShopInfoData = ShopManager.getInstance().getShopInfoData(400001);
                    if (shop400001.num > 0) {
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CONTINUE));
                    }
                };
                GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, onBuy400001Complte, this);
                return;
            }
        } else {
        }

        VideoManager.getInstance().onLoad(videoSrc);
        VideoManager.getInstance().loadSrc = videoSrc;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam('ResultWinPanel', isEnd));
    }

    private onLoadNextVideo(id = 0) {
        if (id != 0) {
            this.tipsPanel.onUpdateWenTi(id);
        } else {
            this.tipsPanel.onUpdateWenTi(wentiModels[this.curWentiId].moren);
        }
    }

    private onReduceVideo() {
        if (VideoManager.getInstance().videoCurrTime() < 1) {
            GameCommon.getInstance().showCommomTips('视频初始不可回退');
            return;
        }
        if (VideoManager.getInstance().videoCurrTime() - 12 > 0) {
            VideoManager.getInstance().videoPause();
            widPlayer.seek(VideoManager.getInstance().videoCurrTime() - 10);
            VideoManager.getInstance().videoResume();
            this.tipsPanel.onShowAddTime();
        } else {
            VideoManager.getInstance().videoPause();
            widPlayer.seek(1);
            VideoManager.getInstance().videoResume();
            this.tipsPanel.onShowAddTime();
        }
    }

    private onAddVideo() {
        let lastTime: number = 0;
        let wentiTime: number = 0;
        if (Number(videoModels[this.videoIdx].time > 0)) {
            wentiTime = Number(videoModels[this.videoIdx].time);
            if (wentiModels[this.curWentiId]) {
                lastTime = Number(wentiModels[this.curWentiId].time) + Number(videoModels[this.videoIdx].time)
            }

        }
        if (this.touchtime != VideoManager.getInstance().videoCurrTime()) {
            this.touchtime = VideoManager.getInstance().videoCurrTime()
        } else {
            GameCommon.getInstance().showCommomTips('操作太频繁');
            return;
        }
        if (lastTime > 0) {
            if (this.videoState != 'buffering' && this.videoState != 'end' && this.videoState != 'idle' && this.videoState != 'loadStart') {
                if (VideoManager.getInstance().videoCurrTime() + 12 < wentiTime) {
                    widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);
                    this.tipsPanel.onShowAddTime();
                } else if (videoNextFlg1 && this.isSelectVideo) {
                    if (VideoManager.getInstance().videoCurrTime() + 12 < VideoManager.getInstance().getVideoDuration()) {
                        widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);
                        this.tipsPanel.onShowAddTime();
                    } else {
                        GameCommon.getInstance().showCommomTips('别着急有惊喜')
                    }
                } else {
                    if (this.isSelectVideo) {
                        GameCommon.getInstance().showCommomTips('别着急有惊喜');
                        return;
                    }
                    GameCommon.getInstance().showCommomTips('即将出现互动')
                }
            }
        } else {
            if (VideoManager.getInstance().videoCurrTime() + 12 < VideoManager.getInstance().getVideoDuration()) {
                if (this.videoState != 'buffering' && this.videoState != 'end' && this.videoState != 'idle' && this.videoState != 'loadStart') {
                    widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);
                    this.tipsPanel.onShowAddTime();

                } else {
                    GameCommon.getInstance().showCommomTips('别着急有惊喜')
                }
            } else {
                GameCommon.getInstance().showCommomTips('别着急有惊喜')
            }
        }
    }

    private onPlay_Pause(bo) {
        if (!widPlayer) {
            return;
        }
        if (!bo.data) {
            this.current = false;
            VideoManager.getInstance().videoPause()
        } else {
            this.oldVideoTimer = 0;
            this.current = true;
            VideoManager.getInstance().videoResume()
        }
    }

    private onGuideStopGame(data) {
        if (!widPlayer || !GameDefine.IS_READ_PLAY)
            return;
        if (ViewTouch.isTouch == true || GameDefine.IS_DUDANG) {
            return;
        }
        if (data.data == 'stop') {
            this.current = false;
            VideoManager.getInstance().videoPause();
        } else {
            if (this.tipsPanel) {
                if (!this.tipsPanel.visible)
                    return;
                this.tipsPanel.imStatus = 'pauseImg_png';
            }
            if (GuideManager.getInstance().isGuide && GuideManager.getInstance().curState) {
                return;
            }
            this.current = true;
            this.oldVideoTimer = 0;
            VideoManager.getInstance().videoResume();
        }
    }

    private onRefreshVideo(data) {
        if (this.isSelectVideo && wentiModels[data.data.wentiId].type != ActionType.OPTION)
            return;
        this.tiaoState = false;
        Tool.callbackTime(function () {
            SoundManager.getInstance().stopMusicAll();
        }, this, 500);
        GameCommon.getInstance().hideActionTips();
        let cfgs = answerModels[data.data.wentiId];
        if (!cfgs)
            return;
        this.curVideoIndex = 0;
        for (let k in cfgs) {
            if (cfgs.hasOwnProperty(k)) {
                if (cfgs[k].ansid == data.data.answerId) {
                    this.curAnswerCfg = cfgs[k];
                    break;
                }
            }
        }
        if (wentiModels[data.data.wentiId].type != ActionType.OPTION) {
            GameCommon.getInstance().shock(1, data.data.click);
        } else {
            GameCommon.getInstance().shock();
        }
        VideoManager.getInstance().setSpeed(GameDefine.CUR_SPEED);
        this.fileTimerIdx = 0;
        if (this.curAnswerCfg.videos == '') {
            UserInfo.guideDic[4] = 4;
            this.isSelectVideo = true;
            UserInfo.curBokData.answerId[data.data.wentiId] = data.data.answerId;
            this.nextWentiId = this.curAnswerCfg.nextid;
            if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
                VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
                this.curVIdeoIds = [];
                this.curVideoIndex = 0;
            }
            GameCommon.getInstance().addRoleLike(this.curAnswerCfg.like);
            let obj = this;
            Tool.callbackTime(function () {
                ChengJiuManager.getInstance().onCheckAnswer(data.data.wentiId, data.data.answerId);
            }, obj, 100);

            if (this.videoIdx == 'V019') {
                if (videoModels[this.videoIdx].chengjiuId != '') {
                    ChengJiuManager.getInstance().onCheckShiPinChengJiu(videoModels[this.videoIdx].chengjiuId);
                }
            }

            if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1] != data.data.wentiId) {
                UserInfo.curBokData.wentiId.push(data.data.wentiId);
            }
            if (UserInfo.curBokData.videoNames[data.data.wentiId] != this.videoIdx) {
                UserInfo.curBokData.videoNames[data.data.wentiId] = this.videoIdx;
            }


            return;
        }
        if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1] != data.data.wentiId) {
            UserInfo.curBokData.wentiId.push(data.data.wentiId);
        }
        if (UserInfo.curBokData.videoNames[data.data.wentiId] != this.videoIdx) {
            UserInfo.curBokData.videoNames[data.data.wentiId] = this.videoIdx;
        }
        GameCommon.getInstance().addRoleLike(this.curAnswerCfg.like);
        Tool.callbackTime(function () {
            ChengJiuManager.getInstance().onCheckAnswer(data.data.wentiId, data.data.answerId);
        }, this, 100);
        UserInfo.curBokData.answerId[data.data.wentiId] = data.data.answerId;
        this.nextWentiId = this.curAnswerCfg.nextid;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
            VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
        }
        if (this.curAnswerCfg.videos.indexOf(",") >= 0) {
            this.curVIdeoIds = this.curAnswerCfg.videos.split(",");
        } else if (this.curAnswerCfg.videos.length > 0) {
            this.curVIdeoIds = [];
            this.curVIdeoIds.push(this.curAnswerCfg.videos);
        } else {
            this.curVIdeoIds = [];
        }

        this.isSelectVideo = true;
        if (wentiModels[data.data.wentiId].type != ActionType.OPTION) {
            if (data.data.click) {
                GameCommon.getInstance().addAlert('hudongchenggong');
            } else {
                GameCommon.getInstance().addAlert('hudongshibai');
            }
        }
        if (!this.curVIdeoIds[this.curVideoIndex]) {
            return;
        }
        VideoManager.getInstance().onLoadSrc(this.curVIdeoIds[this.curVideoIndex]);
        this._nextVid = this.curVIdeoIds[this.curVideoIndex];
    }

    private onVideo_Full_End(data) {
        let wentiId = this.curWentiId;
        let morenId = data.data - 3;
        let cfgs = answerModels[this.curWentiId];
        if (!cfgs)
            return;
        this.curVideoIndex = 0;
        for (let k in cfgs) {
            if (cfgs.hasOwnProperty(k)) {
                if (cfgs[k].ansid == morenId) {
                    this.curAnswerCfg = cfgs[k];
                    break;
                }
            }
        }
        GameCommon.getInstance().shock();
        if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1] != wentiId) {
            UserInfo.curBokData.wentiId.push(wentiId);
        }
        if (UserInfo.curBokData.videoNames[wentiId] != this.videoIdx) {
            UserInfo.curBokData.videoNames[wentiId] = this.videoIdx;
        }
        ChengJiuManager.getInstance().onCheckAnswer(wentiId, morenId);
        UserInfo.curBokData.answerId[wentiId] = morenId;
        this.nextWentiId = this.curAnswerCfg.nextid;
        if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
            VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
        }
        this.curVIdeoIds = this.curAnswerCfg.videos.split(",");
        this.isSelectVideo = true;
        if (!this.curVIdeoIds[this.curVideoIndex]) {
            return;
        }
        this.videoIdx = this.curVIdeoIds[this.curVideoIndex];
        this._nextVid = this.curVIdeoIds[this.curVideoIndex];
        this.setVideoTouch(this.videoIdx);
        VideoManager.getInstance().onSetSrc1(this.curVIdeoIds[this.curVideoIndex]);
        widPlayer.seek(VideoManager.getInstance().getVideoDuration() - 1);
    }
}

declare let widPlayer;
declare let videoModels: Modelshipin[];
declare let wentiModels: Modelwenti[];
declare let answerModels: Modelanswer[];
declare let videoNextFlg: boolean;
declare let videoNextFlg1: boolean;
declare let videoAdvanceLoad: boolean;

enum ActionType {
    OPTION = 0,
    CLICK_TIME = 1,
    CLICK = 2,
    SLIDE = 3,
    SLIDE_RECT = 4,
    SLIDE_TWO = 5,
    MUSIC = 6,
    SEND_MSG = 7,
    LISTEN = 8,
    FULL_VIEW = 9,
    HEAD_VIEW = 10,
    CHECK_DRINK = 11,
    SEARCH = 12,
}
