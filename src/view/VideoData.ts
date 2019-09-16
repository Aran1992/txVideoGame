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
    public videoReadyHandle: Function;
    public videoNodeChangeHandle: Function;
    public isLoadSrc = false;
    public videoPauseTime: number = 0;
    public curWentiId: number = 0;
    private actionScene: egret.DisplayObjectContainer;// 互动UI层
    private videoTouch: ViewTouch;
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
    private daanCfg: Modelanswer;
    private againTime: number = 0;
    private againFlg: boolean = false;
    private curTime: number = 0;
    private touchId: string;
    private isSetDiv: boolean = false;
    private fileTime: egret.Timer;
    private fileTimerIdx: number = 0;
    private models: Modelshipin[];
    private workNum: number = 0;
    private delayTim: number = 0;
    private oldVideoTimer: number = 0;
    private isEnd: boolean = false;
    private textIdx: number = 0;
    private _curSelf;
    private isDie = false;
    private isEndChapter: boolean = false;
    private isError: boolean = false;
    private videoState: string;
    private isHuDong = false;
    private _endHandle;
    private isPlay: boolean = false;
    private _zimuCfgs;
    //快进2秒
    private touchtime: number = 0;
    //暂停播放
    private current: boolean = true;
    private isSelectVideo: boolean = false;
    private curVideoId: number;
    private curAnswerCfg: Modelanswer;
    private curVIdeoIds: string[];
    private curVideoIndex: number = 0;//当前答案中视频播放到了第几个
    private nextWentiId: number = 0;
    // private setVid: string = '';
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

    public onCloseMengBan() {
        this.tipsPanel.onCloseMengBan();
    }

    public onInitVideoData() {
        this.onCreateData();
        this.visible = true;
    }

    public againGame(nextid): void {
        // if (this.tipsPanel)
        //     this.tipsPanel.onInitState();
        this.tiaoState = false;
        this.onCreateData();
        this.visible = true;
        this.curWentiId = nextid;
        this.nextWentiId = nextid;
        this.curVideoIndex = 1;
        this.againFlg = true;
        GameDefine.IS_READ_PLAY = true;
        VideoManager.getInstance().onAgainGame(this.videoIdx);
        // egret.Ticker.getInstance().register(this.onfileTimer, this);
    }

    //读档的话走这里   包括继续游戏  和  读取手动存档1-6
    public readFiel() {
        this.curAnswerCfg = null;
        if (!UserInfo.curBokData) {
            // GameCommon.getInstance().showCommomTips('null')
            return;
        }
        this.tiaoState = false;
        // GameCommon.getInstance().showCommomTips(JSON.stringify(UserInfo.curBokData.wentiId) + '---' + GameDefine.IS_DUDANG)
        if (GameDefine.IS_DUDANG && GameDefine.CUR_PLAYER_VIDEO == 1) {
            var src = '';
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
            // this.tipsPanel.onInitState();

            // this.tipsPanel.setState(0);
            let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
            var isChapter: boolean = false;
            if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2]) {
                // if (wentiModels[wentiId].chapter == 0) {
                //     wentiId = 8;
                //     this.onContinue();
                //     return;
                // }
                if (wentiModels[wentiId].chapter > wentiModels[UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 2]].chapter) {
                    // if (VideoManager.getInstance().getVideoData() && widPlayer) {
                    //     this.onContinue();
                    //     return;
                    // }
                    var curChapterCfg = JsonModelManager.instance.getModelchapter()[wentiModels[wentiId].chapter];
                    if (curChapterCfg.videoSrc.indexOf(",") >= 0) {
                        let videoIds = curChapterCfg.videoSrc.split(",");
                        this.videoIdx = videoIds[0];
                        this.curVIdeoIds = videoIds;
                        this.curVideoIndex = 1;
                    } else {
                        this.videoIdx = curChapterCfg.videoSrc;
                    }
                    isChapter = true;
                    this.curWentiId = wentiId;
                    this.isSelectVideo = false;
                    if (this.videoIdx == '') {
                        this.videoIdx = UserInfo.curBokData.videoNames[wentiId]
                    }
                    this.againFlg = true;
                    GameDefine.IS_READ_PLAY = true;
                    if (VideoManager.getInstance().getVideoData() && widPlayer) {
                        // var obj = this;
                        // Tool.callbackTime(function () {
                        //     VideoManager.getInstance().onAgainGame(videoIdx);
                        //     // VideoManager.getInstance().onPlayVideo(videoIdx);
                        // }, obj, 1000);
                        this.onContinue();
                    } else {
                        VideoManager.getInstance().onPlay(this.videoIdx);
                    }
                    return;
                }
            }
            this.curWentiId = wentiId;
            this.curVIdeoIds = UserInfo.curBokData.videoIds;
            // this.curVideoIndex = UserInfo.curBokData.videoIndex;
            var cfgs = answerModels[wentiId];
            this.curVideoIndex = 0;
            this.videoIdx = UserInfo.curBokData.videoNames[wentiId];
            this.isSelectVideo = false;
            if (UserInfo.curBokData.answerId[wentiId]) {
                this.isSelectVideo = true;
                for (var k in cfgs) {
                    if (cfgs[k].ansid == UserInfo.curBokData.answerId[wentiId]) {
                        this.curAnswerCfg = cfgs[k];
                        break;
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
                    for (var i: number = 0; i < this.curVIdeoIds.length; i++) {
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
                for (var k in cfgs) {
                    if (cfgs[k].ansid == UserInfo.curBokData.answerId[wentiId]) {
                        this.curAnswerCfg = cfgs[k];
                        break;
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
                    for (var i: number = 0; i < this.curVIdeoIds.length; i++) {
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
            // this.againTime = UserInfo.curBokData.times[wentiId];
            this.againFlg = true;
            GameDefine.IS_READ_PLAY = true;
            if (VideoManager.getInstance().getVideoData() && widPlayer) {
                var obj = this;
                VideoManager.getInstance().clear();
                Tool.callbackTime(function () {
                    VideoManager.getInstance().onAgainGame(obj.videoIdx);
                    // VideoManager.getInstance().onPlayVideo(videoIdx);
                }, obj, 1000);

                // VideoManager.getInstance().iosPlay(this.curTime);
            } else {
                VideoManager.getInstance().onPlay(this.videoIdx);
            }
        } else {

        }
    }

    public addActionScene(ui: egret.DisplayObjectContainer) {
        this.actionScene.addChild(ui);
    }
    // private onEndChapter() {
    //     var chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
    //     if (chapCfg.videoSrc.indexOf(",") >= 0) {
    //         let videoIds = chapCfg.videoSrc.split(",");
    //         videoIdx = videoIds[0];
    //         this.curVideoIndex = 1;
    //     }
    //     else {
    //         videoIdx = chapCfg.videoSrc;
    //     }
    //     // this.onShowNextVideo();
    // }

    public onWaitin() {
        // this.tipsPanel.log('当前网速不好')
    }

    public setVideoTouch(id: string) {
        if (id && id != this.touchId) {
            this.touchId = id;
            let div = window["videoDivMin"];
            if (this.isVideoTouch(id)) {
                // video.style["object-fit"] = "none";
                div.style["width"] = GameDefine.VIDEO_FULL_WIDTH + 'px';
                div.style["height"] = size.height + 'px';
                if (!this.videoTouch) {
                    ActionManager.getInstance().setAction(wentiModels[this.curWentiId], this.tipsPanel);
                    this.videoTouch = new ViewTouch(this);
                    this.addChild(this.videoTouch);
                    ViewTouch.isTouch = true;
                }
                this.resetPoint(-GameDefine.VIDEO_FULL_WIDTH / 2 + 500, 0, true);
                this.isSetDiv = false;
            } else if (!this.isSetDiv) {
                this.isSetDiv = true;
                div.style["width"] = wind.width + 'px';
                div.style["height"] = wind.height + 'px';
                // div.style.width = "100%";
                // div.style.height = "100%";
                if (size.fillType == FILL_TYPE_COVER) {
                    div.style["object-fit"] = "cover";
                } else {
                    div.style["object-fit"] = "contain";
                }
                if (this.videoTouch) {
                    this.videoTouch.onExit();
                    this.videoTouch = null;
                    this.resetPoint(0, 0, false);
                    ViewTouch.isTouch = false;
                }
                this.actionScene.touchEnabled = true;
                this.actionScene.touchChildren = true;
                this.tipsPanel.touchEnabled = true;
                this.tipsPanel.touchChildren = true;
            }
        }
    }

    public log(str) {
        if (this.tipsPanel) {
            this.tipsPanel.log(str);
        }
    }

    public onMoveTouch(offx: number, offy: number) {
        let body = window["videoDiv"];
        let leftStr: string = body.style.left;
        let left: number = 0;
        if (leftStr.length > 0) {
            left = parseInt(leftStr.substring(0, leftStr.length - 2));
        }
        let topStr: string = body.style.top;
        let top: number = 0;
        if (topStr.length > 0) {
            top = parseInt(topStr.substring(0, topStr.length - 2));
        }
        // body.style.left = (left + offx) + "px";
        // body.style.top = (top + offy) + "px";
        this.resetPoint(left + offx * GameDefine.sizeScaleX, top + offy * GameDefine.sizeScaleY, true);
    }

    public resetPoint(x: number, y: number, isTouch: boolean) {
        let moveW;
        let moveH;
        if (ViewTouch.isTouch) {
            moveW = GameDefine.VIDEO_FULL_WIDTH - wind.width;
            moveH = GameDefine.VIDEO_FULL_HEIGHT - wind.height;
        } else {
            moveW = GameDefine.VIDEO_WIDTH - wind.width;
            moveH = GameDefine.VIDEO_HEIGHT - wind.height;
        }

        // x = x < -moveW / 2 ? -moveW / 2 : x;
        // x = x > moveW / 2 ? moveW / 2 : x;
        // y = y < -moveH / 2 ? -moveH / 2 : y;
        // y = y > moveH / 2 ? moveH / 2 : y;
        x = x > 0 ? 0 : x;
        x = x < -moveW ? -moveW : x;
        if (isTouch) {
            y = -moveH / 2;
        } else {
            y = y > 0 ? 0 : y;
            y = y < -moveH ? -moveH : y;
        }
        // let body = window[this.curId];
        let body = window["videoDiv"];
        body.style.left = x + "px";
        body.style.top = y + "px";
        if (this.videoTouch) {
            // this.videoTouch.setVideoPoint(x - moveW / 2, y - moveH / 2);
            this.videoTouch.setVideoPoint(x, y);
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
        // if (!this.fileTime) {
        //     this.fileTime = new egret.Timer(1000)
        //     this.fileTime.addEventListener(egret.TimerEvent.TIMER, this.onfileTimer, this);
        //     this.fileTime.start()
        // }
        // egret.Ticker.getInstance().register(this.onfileTimer, this);

    }

    public checkVideoTime(videoName) {
        this.videoIdx = videoName;
        GameCommon.getInstance().showLoading();
        videoAdvanceLoad = false;
        videoNextFlg = true;
        videoNextFlg1 = true;
        var tips = this.tipsPanel;
        this.isPlay = false;
        var curTim = 0;
        if (!videoModels[this.videoIdx]) return;
        this.isLoadSrc = false;
        var zimuCfgs = JsonModelManager.instance.getModelzimu()[this.videoIdx];
        var zimuIdx = 0;
        var curSlef = this._curSelf;
        var cdTime: number = 0;
        this.isHuDong = false;
        if (this.videoTouch) {
            this.videoTouch.onExit();
            this.videoTouch = null;
        }
        if (!ViewTouch.isTouch) {
            curSlef.setVideoTouch(this.videoIdx, window[curSlef.curId]);
        }
        curSlef.fileTimerIdx = 6500;
        var likeTime: number = 0;
        if (videoModels[this.videoIdx].haogandu != '') {
            let likes = videoModels[this.videoIdx].haogandu.split(",");
            likeTime = Number(likes[0]);
        }
        // window.onerror = function (error) {
        //     tips.showTime(error);
        // }
        // window.onerror = function (message, url, line) {
        //     tips.showTime("URL: " + url + "\n" + 'line' + line + '\n' + message)
        // }
        var isShowRes: boolean = false;
        var isShowEnd: boolean = false;
        // var isShowLike: boolean = false;
        var isShowHuDong: boolean = false;
        var isShowChengJiu: boolean = false;
        var isLoadBe: boolean = false;
        var isResult: boolean = false;
        var isFile: boolean = false;
        // if (widPlayer) {
        //         this.log('创建成功');
        // }
        // else
        // {
        //     this.log('创建失败')
        // }
        if (!this.videoUpDataHandle) {
            this.videoUpDataHandle = new function () {
            };
            //视频update事件
            widPlayer.on('timeupdate', (data) => {
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                if (!widPlayer || !videoModels[curSlef.videoIdx] || widPlayer.getDuration() == 0) {
                    return;
                }
                if (curSlef.videoIdx == 'V019' && VideoManager.getInstance().videoCurrTime() >= VideoManager.getInstance().getVideoDuration() - 10 && !isShowChengJiu) {
                    if (videoModels[curSlef.videoIdx].chengjiuId != '') {
                        isShowChengJiu = true;
                        ChengJiuManager.getInstance().onCheckShiPinChengJiu(videoModels[curSlef.videoIdx].chengjiuId);
                    }
                }
                curSlef.isEndChapter = false;
                if (GameDefine.IS_DUDANG) {
                    GameDefine.IS_DUDANG = false;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel')
                }
                if (VideoManager.getInstance().videoCurrTime() > 3 && !isFile) {
                    if (curSlef.curWentiId > 0) {
                        if (UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1] != curSlef.curWentiId) {
                            UserInfo.curBokData.wentiId.push(curSlef.curWentiId);
                        }
                        if (UserInfo.curBokData.videoNames[curSlef.curWentiId] != curSlef.videoIdx) {
                            UserInfo.curBokData.videoNames[curSlef.curWentiId] = curSlef.videoIdx;
                        }
                        curSlef.log('存一下' + curSlef.curWentiId + '---' + curSlef.videoIdx);
                        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
                        isFile = true;
                    }
                }
                if (curSlef.againTime > 0 && curSlef.againTime > VideoManager.getInstance().videoCurrTime()) {
                    if (curSlef.againTime < VideoManager.getInstance().getVideoDuration()) {
                        widPlayer.seek(curSlef.againTime);
                        curSlef.againTime = 0;
                    }
                }
                // tips.showTime(VideoManager.getInstance().videoCurrTime());
                if (videoModels[curSlef.videoIdx].jtime) {
                    if (videoModels[curSlef.videoIdx].tiaozhuan != TIAOZHUAN_Type.RESULT) {
                        if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[curSlef.videoIdx].jtime) && !isShowEnd) {
                            curSlef.isSelectVideo = false;
                            curSlef.curVIdeoIds = [];
                            curSlef.curVideoIndex = 0;
                            curSlef.fileTimerIdx = 0;
                            curSlef.tipsPanel.hideTips();
                            // egret.Ticker.getInstance().unregister(curSlef.onfileTimer, curSlef);
                            let vd = new ViewEnd(true, videoModels[curSlef.videoIdx].tiaozhuan);
                            curSlef.addChild(vd);
                            isShowEnd = true;
                            return;
                        }
                        // else if (!isLoadBe&&videoModels[videoIdx].tiaozhuan == TIAOZHUAN_Type.WENTI) {
                        //     let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                        //     VideoManager.getInstance().onLoad(UserInfo.curBokData.videoNames[wentiId]);
                        //     isLoadBe = true;
                        // }
                        if (VideoManager.getInstance().videoCurrTime() >= Math.round(VideoManager.getInstance().getVideoDuration()) - 3) {
                            widPlayer.seek(Number(videoModels[curSlef.videoIdx].jtime) + 3);
                        }
                        if (isShowEnd) {
                            return;
                        }
                    } else {
                        //     if (!isResult) {
                        //         let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                        //         var chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
                        //         VideoManager.getInstance().onLoad(chapCfg.videoSrc);
                        //         isResult = true;
                        //     }
                        if (videoModels[curSlef.videoIdx].tiaozhuan == TIAOZHUAN_Type.RESULT) {
                            if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[curSlef.videoIdx].jtime) && !isShowRes) {
                                curSlef.onShowResult();
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
                curSlef.setVideoTouch(curSlef.videoIdx);
                if (ViewTouch.isTouch && curSlef.videoIdx == 'V4111') {
                    if (VideoManager.getInstance().videoCurrTime() > VideoManager.getInstance().getVideoDuration() - 10 && !curSlef.isSelectVideo) {
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_FULL_END), wentiModels[curSlef.curWentiId].moren + 3);
                    }
                    if (!ViewTouch.isTouch || curSlef.isSetDiv == true)
                        return;
                    curSlef.actionScene.touchEnabled = false;
                    curSlef.actionScene.touchChildren = false;
                    curSlef.tipsPanel.touchEnabled = false;
                    curSlef.tipsPanel.touchChildren = false;
                    return;
                }
                // if (likeTime > 0 && VideoManager.getInstance().videoCurrTime() >= likeTime && !isShowLike) {
                //     // isShowLike = true;
                //     GameCommon.getInstance().addRoleLike(videoModels[videoIdx].haogandu)
                // }
                if (curSlef && VideoManager.getInstance().getVideoDuration() > 0) {
                    if (curSlef.curWentiId >= 1) {

                        if (VideoManager.getInstance().videoCurrTime() >= VideoManager.getInstance().getVideoDuration())
                            return;

                        if (videoModels[curSlef.videoIdx] && Number(videoModels[curSlef.videoIdx].time) > 0) {
                            if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[curSlef.videoIdx].time) - 3 && !isShowHuDong) {
                                isShowHuDong = true;
                                GameCommon.getInstance().setTipsHuDong();

                                VideoManager.getInstance().setSpeed(1);
                            }

                            var lastTime: number = Number(wentiModels[curSlef.curWentiId].time) + Number(videoModels[curSlef.videoIdx].time);
                            if (VideoManager.getInstance().videoCurrTime() >= lastTime - 10 && !videoAdvanceLoad) {
                                videoAdvanceLoad = true;
                                VideoManager.getInstance().onLoad(curSlef.curWentiId)
                            }
                            if (lastTime >= VideoManager.getInstance().getVideoDuration()) {
                                lastTime = VideoManager.getInstance().getVideoDuration() - 1;
                            }

                            if (Math.floor(VideoManager.getInstance().videoCurrTime()) >= lastTime - 0.5) {
                                // tips.hideTips();
                                var wId = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                                if (videoNextFlg1 && !curSlef.isSelectVideo && wentiModels[curSlef.curWentiId].type == ActionType.OPTION) {
                                    videoNextFlg1 = false;
                                    curSlef.isSelectVideo = true;
                                    curSlef.onLoadNextVideo();
                                    return;
                                } else if (Math.floor(VideoManager.getInstance().videoCurrTime()) >= lastTime) {
                                    tips.hideTips();
                                }
                            }
                            if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[curSlef.videoIdx].time) && VideoManager.getInstance().videoCurrTime() < lastTime) {
                                if (videoNextFlg) {
                                    GameCommon.getInstance().hideTipsHuDong();
                                    tips.onCreateBtn(wentiModels[curSlef.curWentiId]);//出现问题
                                    curSlef.isHuDong = true;
                                    videoNextFlg = false;
                                }
                                tips.setTips(Math.floor(lastTime) - Math.floor(VideoManager.getInstance().videoCurrTime()), curSlef.isSelectVideo);
                            } else if (VideoManager.getInstance().videoCurrTime() >= lastTime - 1 && videoNextFlg1) {
                                if (curSlef.curAnswerCfg && curSlef.curAnswerCfg.isdie == 1) {
                                    curSlef.isDie = true;
                                    videoNextFlg1 = false;
                                } else {
                                    //如果视频结束前两秒还没选择 默认自动选择
                                    if (videoNextFlg1 && !curSlef.isSelectVideo && wentiModels[curSlef.curWentiId].type == ActionType.OPTION) {
                                        videoNextFlg1 = false;
                                        curSlef.isSelectVideo = true;
                                        curSlef.onLoadNextVideo();
                                    }
                                }
                            }
                        } else {
                            //如果是连续播放的视频 在当前视频结束前10秒开始加载下一个视频
                            if (VideoManager.getInstance().videoCurrTime() >= Math.round(VideoManager.getInstance().getVideoDuration()) / 2 - 10 && !curSlef.isSelectVideo) {
                                curSlef.isSelectVideo = true;
                                VideoManager.getInstance().isReadySet = true;
                                let likeConditionData = curSlef.Video_Like_Condition[curSlef.videoIdx];
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
                                        curSlef.curVIdeoIds = [likeConditionData.BEVideo];
                                        curSlef.curVideoIndex = 0;
                                        curSlef.tipsPanel.hideTips();
                                    }
                                }
                                let optConditonData = this.Video_Opt_Condition[curSlef.videoIdx];
                                if (optConditonData) {
                                    let errorNum: number = 0;
                                    for (let condWentiID in optConditonData.options) {
                                        let cond_optID: number = optConditonData.options[condWentiID];
                                        let select_optID: number = UserInfo.curBokData.answerId[condWentiID];
                                        if (!select_optID || select_optID == cond_optID) {
                                            errorNum++;
                                        }
                                    }
                                    if (errorNum >= optConditonData.errorNum) {
                                        curSlef.curVIdeoIds = [optConditonData.nextVideoId];
                                        curSlef.curVideoIndex = 0;
                                    }
                                }
                                if (curSlef.videoIdx == 'VY1206') {//这个视频后续比较特殊 需要算10章前的肖家兄弟的好感度是否相同
                                    let like_wanxun: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.WanXun_Xiao, 30);
                                    let like_qianye: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.QianYe_Xiao, 30);
                                    if (like_wanxun == like_qianye) {
                                        curSlef.curVIdeoIds = ['VY1207'];
                                        curSlef.curVideoIndex = 0;
                                    }
                                }

                                let nextVideoSrc: string = curSlef.curVIdeoIds[curSlef.curVideoIndex];
                                Tool.callbackTime(function () {
                                    VideoManager.getInstance().onLoadSrc(nextVideoSrc);
                                }, curSlef, 1000);
                                curSlef._nextVid = nextVideoSrc;
                            }
                            tips.hideTips();
                        }
                    } else if (videoModels[curSlef.videoIdx]) {
                        if (videoModels[curSlef.videoIdx].tiaozhuan == TIAOZHUAN_Type.WENTI) {
                            if (videoNextFlg1 && VideoManager.getInstance().videoCurrTime() >= Number(videoModels[curSlef.videoIdx].jtime) - 10) {
                                videoNextFlg1 = false;
                                let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                                VideoManager.getInstance().onLoad(UserInfo.curBokData.videoNames[wentiId]);
                                return;
                            }
                        }
                        // else if (videoModels[videoIdx].tiaozhuan == TIAOZHUAN_Type.RESULT) {
                        //     if (VideoManager.getInstance().videoCurrTime() >= Number(videoModels[videoIdx].jtime) && !isShowRes) {
                        //         curSlef.onShowResult();
                        //         isShowRes = true;
                        //         return;
                        //     }
                        //     if (!videoNextFlg || isShowRes) {
                        //         return;
                        //     }
                        // }
                    }
                }
            })
        }
        if (!this.videoEndHandle) {
            widPlayer.on('statechange', (data) => {
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                // widPlayer = window['player'];
                curSlef.log(data.old + '-----------' + data.new);
                // 事件参数｛new: xx, old: xx｝，其中state有：  idle, loadStart, canplay, playing, pause, seeking, seeked, buffering, end
                if (data.new == 'buffering' || data.new == 'seeking') {
                    GameCommon.getInstance().showLoading();
                } else if (data.new == 'end') {
                    curSlef.isEndChapter = true;
                    curSlef.onShowNextVideo();
                } else {
                    GameCommon.getInstance().removeLoading();
                }
                curSlef.videoState = data.new;
            });
            this.videoEndHandle = function () {
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                if (curSlef) {
                    // curSlef.log('代码结束');
                    // window['curSlef.curId'].enbed

                    curSlef.onShowNextVideo();
                }
            }
        }
        if (!this.videoErrorHandle) {
            widPlayer.on('error', (error) => {
                if (error.code == 14001) {
                    // if (tips.visible) {
                    GameCommon.getInstance().showErrorLog(JSON.stringify(error));
                    // if (VideoManager.getInstance().videoCurrTime() - 12 > 0) {
                    //     VideoManager.getInstance().videoPause();
                    //     widPlayer.seek(VideoManager.getInstance().videoCurrTime() - 10);// vd['currentTime']= Math.min(vd['currentTime'] + 10, vd['duration'] - 0.5);
                    //     VideoManager.getInstance().videoResume();
                    // }
                    // VideoManager.getInstance().onLoad(curSlef.curWentiId)
                    // curSlef.log('set失败重新加载' + curSlef.setVid)
                    // VideoManager.getInstance().onLoadSrc(curSlef.setVid)
                    GameCommon.getInstance().showCommomTips('preload失败请重新进入游戏');
                    VideoManager.getInstance().clear();
                    curSlef.touchEnabled = false;
                    curSlef.touchChildren = false;
                    // Tool.callbackTime(function () {
                    //     VideoManager.getInstance().onAgainGame(videoIdx);
                    // }, curSlef, 500);
                    // }
                    // else {
                    //     console.log('shibai');

                    // }
                }
            })
        }

        if (!this.videoNodeChangeHandle) {
            widPlayer.on('videoNodeChange', () => {
                GameCommon.getInstance().removeLoading();
                if (!widPlayer) {
                    widPlayer = widPlayer;
                    var ps = document.getElementsByTagName('video');
                    for (var i: number = 0; i < ps.length; i++) {
                        if (size.fillType == FILL_TYPE_COVER) {
                            ps[i].style["object-fit"] = "cover";
                        } else {
                            ps[i].style["object-fit"] = "contain";
                        }
                    }
                    curSlef.isPlay = false;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                } else {
                    isShowRes = false;
                    isShowEnd = false;
                    isResult = false;
                    isFile = false;
                    // isShowLike = false;
                    isShowHuDong = false;
                    videoAdvanceLoad = false;
                    videoNextFlg = true;
                    videoNextFlg1 = true;
                    curSlef.isSelectVideo = false;

                    if (curSlef.againFlg) {
                        if (curSlef.againTime > 0) {
                            // VideoManager.getInstance().videoPause();
                            widPlayer.seek(curSlef.againTime);
                            // curSlef.againTime = 0;
                        }
                        curSlef.againFlg = false;
                    } else {
                        if (curSlef.curVIdeoIds && curSlef.curVideoIndex < curSlef.curVIdeoIds.length) {
                            curSlef.videoIdx = curSlef.curVIdeoIds[curSlef.curVideoIndex];
                            curSlef.curVideoIndex = curSlef.curVideoIndex + 1;
                        }
                        if (curSlef._nextVid) {
                            curSlef.videoIdx = curSlef._nextVid;
                        }
                    }
                    curSlef.isPlay = false;
                    curSlef.log('videoNodeChange切换视频');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ResultWinPanel');
                    // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChapterPanel')
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                }

            })
        }
        Tool.callbackTime(function () {
            if (!widPlayer) {
                curSlef.log('重新create');
                VideoManager.getInstance().againInit();
            }
        }, this, 5000);

    }

    //返回主界面
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
        // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
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
        // VideoManager.getInstance().clear();

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
            // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
            let vd = new ViewEnd(true, videoModels[this.videoIdx].tiaozhuan);
            this.addChild(vd);
        } else {
            if (this.curVideoIndex >= this.curVIdeoIds.length || this.curVIdeoIds.length == 0) {
                //这里存一下章节信息 更新章节
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

    //检测是否可以呼出回退按钮
    public getReduceState() {
        if (VideoManager.getInstance().videoCurrTime() - 12 <= 0) {
            return false;
        }
        return true;
    }

    public getVideoPause() { //结尾不允许暂停
        var endTim = VideoManager.getInstance().getVideoDuration();
        var curTim = VideoManager.getInstance().videoCurrTime();
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

    public setAnsCfg(cfg, src) {
        this.curVideoIndex = 1;
        if (cfg.nextid == 0 && cfg.isdie == 0) {
            VideoManager.getInstance().updateGameChapter(cfg.nextChapterId);
        }
        if (cfg.videos.indexOf(",") >= 0) {
            this.curVIdeoIds = cfg.videos.split(",");
            for (var i: number = 0; i < this.curVIdeoIds.length; i++) {
                if (this.curVIdeoIds[i] == src) {
                    this.curVideoIndex = i + 1;
                }
            }
        } else if (cfg.videos.length > 0) {
            this.curVIdeoIds = [];
            this.curVIdeoIds.push(cfg.videos);
        } else {
            this.curVIdeoIds = [];
        }
        this.curWentiId = cfg.nextid;
    }

    public onTiao() {
        var wentiTime: number = 0;
        if (VideoManager.getInstance().videoCurrTime() < 1)
            return;
        if (Number(videoModels[this.videoIdx].time) > 0) {
            wentiTime = Number(videoModels[this.videoIdx].time);
        }
        if (wentiTime > 0) {
            if (!this.isSelectVideo && VideoManager.getInstance().videoCurrTime() < wentiTime - 3 && VideoManager.getInstance().getVideoDuration() > wentiTime - 3 && !this.tiaoState) {
                this.tiaoState = true;
                widPlayer.seek(wentiTime - 2);// vd['currentTime']= Math.min(vd['currentTime'] + 10, vd['duration'] - 0.5);
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

    //检测是否在互动中 是否可以呼出快进界面
    public getIsClick(vd: VideoData) { // 1 正常状态 2互动前5秒状态 //0是视频结尾不显示快进  3是互动状态

        if (!widPlayer || !videoModels[this.videoIdx]) {
            return 0;
        }
        let tim = Math.floor(VideoManager.getInstance().videoCurrTime());
        var tim1 = Number(videoModels[this.videoIdx].time);//问题出现时间
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
            // if (vd.isSelectVideo && tim > Number(tim1)) {
            // if (tim < (VideoManager.getInstance().getVideoDuration() - 12)) {
            //     return 1;
            // }
            // else {
            //     return 0;
            // }
            // }
            // else {
            // if (tim > (tim1 - 12) && tim < (tim1 - 1)) {
            //     return 2;
            // }
            // else
            if (wentiTime > 0) {
                if (tim >= (tim1 - 1) && tim <= Number(tim1) + wentiTime) {
                    return 3;
                }
            } else {
                if (!vd.isSelectVideo && tim >= (tim1 - 1)) {
                    return 3;
                }
            }

            // else {
            //     return 1;
            // }
            // }
        }
        return 0;
        // else {
        //     if (tim < (VideoManager.getInstance().getVideoDuration() - 12)) {
        //         return 1;
        //     }
        //     else {
        //         return 0;
        //     }
        // }
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

        // GameDispatcher.getInstance().addEventListener(GameEvent.GAME_GO_MAINVIEW, this.onCloseVideo, this)
        // GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, this.readFiel, this);
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
        var chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        if (!this.isEndChapter) {
            VideoManager.getInstance().onSetSrc1(UserInfo.curBokData.videoNames[chapCfg.wenti]);
        } else {
            this.againFlg = true;
            videoNextFlg1 = true;

            var obj = this;
            // this.tipsPanel.log('');
            this.curWentiId = chapCfg.wenti;
            this.nextWentiId = chapCfg.wenti;
            this.isSelectVideo = false;
            this._nextVid = '';
            this.videoIdx = UserInfo.curBokData.videoNames[this.curWentiId];
            VideoManager.getInstance().onAgainGame(this.videoIdx);
            // egret.Ticker.getInstance().register(this.onfileTimer, this);
            return;
        }
        this.againFlg = true;
        videoNextFlg1 = true;

        var obj = this;
        // VideoManager.getInstance().clear();
        // VideoManager.getInstance().onLoad(videoIdx);
        this.tipsPanel.log('');
        Tool.callbackTime(function () {
            obj.curWentiId = chapCfg.wenti;
            obj.nextWentiId = chapCfg.wenti;
            obj.isSelectVideo = false;
            obj._nextVid = '';
            this.videoIdx = UserInfo.curBokData.videoNames[obj.curWentiId];
            // VideoManager.getInstance().onLoad(videoIdx);
            // VideoManager.getInstance().onAgainGame(videoIdx);
        }, obj, 1000);
        // egret.Ticker.getInstance().register(this.onfileTimer, this);
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
            var cfgs = answerModels[wentiId];
            this.curWentiId = curWentiId;
            this.nextWentiId = curWentiId;
            this.curVideoIndex = 0;
            if (UserInfo.curBokData.answerId[wentiId]) {
                for (var k in cfgs) {
                    if (cfgs[k].ansid == UserInfo.curBokData.answerId[wentiId]) {
                        this.curAnswerCfg = cfgs[k];
                        break;
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
            // widPlayer.setNextVideoNode(videoModels[videoIdx].vid,true);
            // widPlayer.seek(VideoManager.getInstance().getVideoDuration() - 0.5);
            //, { inerrupt: true });
            // VideoManager.getInstance().onLoad(videoIdx)
            VideoManager.getInstance().onSetSrc1(this.videoIdx);
            this.againTime = Number(videoModels[this.videoIdx].time) - 5;
            // if (VideoManager.getInstance().getVideoData()) {
            // }
            // else {
            //     VideoManager.getInstance().init(this);
            // }
        }
    }

    private init(): void {

    }

    private onCreateData(): void {
        if (!this.tipsPanel) {
            // if (!this.fileTime) {
            //     this.fileTime = new egret.Timer(1000)
            //     this.fileTime.addEventListener(egret.TimerEvent.TIMER, this.onfileTimer, this);
            //     this.fileTime.start()
            // }
            this.width = size.width;
            this.height = size.height;
            this.tipsPanel = new TipsBtn();
            this.addChild(this.tipsPanel);
            this.tipsPanel.init(this);
            // if(this.actionScene)
            // {
            this.actionScene = new egret.DisplayObjectContainer();
            this.addChild(this.actionScene);
            ActionManager.getInstance().init(this);
        }
        // else {
        // this.tipsPanel.setState();
        // }
        this.tipsPanel.visible = true;
        this.touchEnabled = false;
        this.tipsPanel.onCloseMengBan();
        this._curSelf = this;
    }

    private isVideoTouch(id) {// TODO 判断是否为全景视频（id为视频表id，写死）
        if (id == 'V4111') {
            return true;
        }
        // return id == "00003A";
        return false;
        // return true;
    }

    private onfileTimer(dt) {//暂时作废
        // VideoManager.getInstance().log("isSwitchVideo: " + VideoManager.getInstance().isSwitchVideo);
        // let video = VideoManager.getInstance().getCurrVideo();
        if (widPlayer) {
            this.fileTimerIdx += dt;
            if (this.isEnd) {

            }
            // this.workNum = this.workNum + 1;
            // if (VideoManager.getInstance().videoCurrTime() > 0) {
            // if (this.oldVideoTimer != VideoManager.getInstance().videoCurrTime()) {
            //     this.delayTim = 0;
            //     this.oldVideoTimer = VideoManager.getInstance().videoCurrTime();
            //     GameCommon.getInstance().removeLoading();
            //     return;
            // }
            // else {
            // if (this.current) {
            //     this.delayTim += dt;
            //     if (this.delayTim > 150) {
            //         if (this.delayTim > 5000 && !this.isSelectVideo) {
            //             video.pauseVideo();
            //             video.playVideo();
            //             this.delayTim = 0;
            //         }
            //         GameCommon.getInstance().showLoading();
            //     }
            // }
            //     }
            // }
            // if(this.delayTim<this.workNum-1)
            // {
            //     if(window[this.curId].currentTime>=this.oldVideoTimer&&window[this.curId].currentTime<this.oldVideoTimer+0.5)
            //     {
            //         GameCommon.getInstance().showLoading();
            //         this.log(window[this.curId].currentTime+'===='+this.oldVideoTimer)
            //     }
            //     else
            //     {
            //         // this.log('clean');
            //        GameCommon.getInstance().removeLoading();
            //     }
            //     this.oldVideoTimer = window[this.curId].currentTime;
            //     this.delayTim = this.workNum;
            // }
        }
    }

    private onPlayIos() {
        // VideoManager.getInstance().log('videoId')
        // if (videoIdx) {
        //     window['video1'].src = LoadManager.getVideoUrl(videoIdx);
        //     window['video2'].src = LoadManager.getVideoUrl(videoIdx);
        //     VideoManager.getInstance().iosPlay();
        // }
    }

    private egretError(error) {
        this.log('123')
    }

    private onStopVideo() {
        // this.actionScene.touchEnabled = true;
        // this.actionScene.touchChildren = true;
        // if (!this.isPlay) {
        //     // VideoManager.getInstance().videoPause();
        //     // this.onEndChapter();
        //     this.isPlay = false;
        // }
    }

    //显示结算界面
    private onShowResult() {
        let isEnd: boolean = false;
        let isFindNext: boolean = false;
        let curWentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];//用最后一个问题有问题，有的剧情块根本没有问题
        // if (UserInfo.curchapter == 0 || curWentiId > 0) {
        //     var answCfgs = answerModels[curWentiId];
        //     for (let ansqid in answCfgs) {
        //         let anscfg: Modelanswer = answCfgs[ansqid];
        //         if (anscfg.nextChapterId > 0) {
        //             isFindNext = true;
        //             isEnd = VideoManager.getInstance().updateGameChapter(anscfg.nextChapterId);
        //             break;
        //         }
        //     }
        // }
        //通過视频来找问题是哪一个
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
            if (juqingAry[juqingAry.length - 1] == UserInfo.curchapter || UserInfo.curchapter == 0) {//代表已经全部结束章节
                this.isEndChapter = true;
                GameCommon.getInstance().removeLoading();
                // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
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
        var chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        let videoSrc = '';
        let videoIds = chapCfg.videoSrc.split(",");
        this.setVideos(videoIds);
        this.curVideoIndex = 1;
        videoSrc = videoIds[0];
        UserInfo.curBokData.wentiId.push(chapCfg.wenti);
        UserInfo.curBokData.videoDic[videoSrc] = videoSrc;
        // UserInfo.allVideos[videoSrc] = videoSrc;
        UserInfo.curBokData.videoNames[chapCfg.wenti] = videoSrc;
        UserInfo.curBokData.times[chapCfg.wenti] = 0;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        // GameCommon.getInstance().setBookData(FILE_TYPE.GUIDE_TP);
        // GameCommon.getInstance().setBookData(FILE_TYPE.HIDE_FILE);
        // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
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
                var onBuy400001Complte = function (): void {
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

    private onLoadNextVideo(id = 0) {//加载下一个视频
        if (id != 0) {
            this.tipsPanel.onUpdateWenTi(id);
        } else {
            this.tipsPanel.onUpdateWenTi(wentiModels[this.curWentiId].moren);
        }
    }

    private onVideoEnd(): void {

    }

    //回退2秒
    private onReduceVideo() {
        if (VideoManager.getInstance().videoCurrTime() < 1) {
            GameCommon.getInstance().showCommomTips('视频初始不可回退');
            return;
        }
        if (VideoManager.getInstance().videoCurrTime() - 12 > 0) {
            VideoManager.getInstance().videoPause();
            widPlayer.seek(VideoManager.getInstance().videoCurrTime() - 10);// vd['currentTime']= Math.min(vd['currentTime'] + 10, vd['duration'] - 0.5);
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
        // if (!videoModels[videoIdx])
        //     return;
        var lastTime: number = 0;
        var wentiTime: number = 0;
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
        // this.log(VideoManager.getInstance().videoCurrTime());
        if (lastTime > 0) {
            if (this.videoState != 'buffering' && this.videoState != 'end' && this.videoState != 'idle' && this.videoState != 'loadStart') {
                if (VideoManager.getInstance().videoCurrTime() + 12 < wentiTime) {
                    // VideoManager.getInstance().videoPause();
                    widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);// vd['currentTime']= Math.min(vd['currentTime'] + 10, vd['duration'] - 0.5);
                    // VideoManager.getInstance().videoResume();
                    this.tipsPanel.onShowAddTime();
                    // if (!videoAdvanceLoad) {
                    //     videoAdvanceLoad = true;
                    // VideoManager.getInstance().onLoad(this.curWentiId)
                    // }
                } else if (videoNextFlg1 && this.isSelectVideo) {
                    if (VideoManager.getInstance().videoCurrTime() + 12 < VideoManager.getInstance().getVideoDuration()) {
                        // VideoManager.getInstance().videoPause();
                        widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);// vd['currentTime']= Math.min(vd['currentTime'] + 10, vd['duration'] - 0.5);
                        // VideoManager.getInstance().videoResume();
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
                    // VideoManager.getInstance().videoPause();
                    widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);// vd['currentTime']= Math.min(vd['currentTime'] + 10, vd['duration'] - 0.5);
                    // VideoManager.getInstance().videoResume();
                    this.tipsPanel.onShowAddTime();
                    // if (!videoAdvanceLoad) {
                    //     videoAdvanceLoad = true;
                    //     VideoManager.getInstance().onLoad(this.curWentiId)
                    // }

                } else {
                    GameCommon.getInstance().showCommomTips('别着急有惊喜')
                }
            } else {
                GameCommon.getInstance().showCommomTips('别着急有惊喜')
            }
        }
        // {
        // }
        //  }
    }

    private onPlay_Pause(bo) {
        let boo = VideoManager.getInstance().getPause();
        if (!widPlayer) {
            return;
        }
        if (!bo.data) {
            // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
            this.current = false;
            VideoManager.getInstance().videoPause()
        } else {
            this.oldVideoTimer = 0;
            this.current = true;
            // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
            // egret.Ticker.getInstance().register(this.onfileTimer, this);
            VideoManager.getInstance().videoResume()
        }
    }

    private onGuideStopGame(data) {
        if (!widPlayer || !GameDefine.IS_READ_PLAY)
            return;
        if (ViewTouch.isTouch == true || GameDefine.IS_DUDANG) {
            return;
        }
        // if (GameDefine.CUR_IS_MAINVIEW) {
        //     return;
        // }
        if (data.data == 'stop') {
            this.current = false;
            // egret.Ticker.getInstance().unregister(this.onfileTimer, this);
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
            // egret.Ticker.getInstance().register(this.onfileTimer, this);
            this.oldVideoTimer = 0;
            VideoManager.getInstance().videoResume();
        }
    }

    private onRefreshVideo(data) {// 选择视频          传过来的是问题id
        if (this.isSelectVideo && wentiModels[data.data.wentiId].type != ActionType.OPTION)
            return;
        this.tiaoState = false;
        var cfgs = answerModels[data.data.wentiId];
        var obj = this;
        Tool.callbackTime(function () {
            SoundManager.getInstance().stopMusicAll();
        }, obj, 500);
        GameCommon.getInstance().hideActionTips();
        if (!cfgs)
            return;
        this.curVideoIndex = 0;
        for (var k in cfgs) {
            if (cfgs[k].ansid == data.data.answerId) {
                this.curAnswerCfg = cfgs[k];
                break;
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
            // let isXuzhang: boolean = false;
            if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
                VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
                this.curVIdeoIds = [];
                this.curVideoIndex = 0;
                // if (UserInfo.curchapter == 1)
                //     isXuzhang = true;
            }
            GameCommon.getInstance().addRoleLike(this.curAnswerCfg.like);
            var obj = this;
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

            // Tool.callbackTime(function () {
            //     if (isXuzhang) {
            //         obj.onShowResult();
            //     }
            // }, obj, 3000);

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
        }, obj, 100);
        // ChengJiuManager.getInstance().onCheckAnswer(data.data.wentiId, data.data.answerId);
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
            //     this.tipsPanel.endMusic();
            return;
        }
        // this.log('this.curVIdeoIds[this.curVideoIndex]' + this.curVIdeoIds[this.curVideoIndex])
        // this.setVid = this.curVIdeoIds[this.curVideoIndex];
        VideoManager.getInstance().onLoadSrc(this.curVIdeoIds[this.curVideoIndex]);
        this._nextVid = this.curVIdeoIds[this.curVideoIndex];
        // this.tipsPanel.endMusic();
    }

    private onVideo_Full_End(data) {
        // ViewTouch.isTouch = false;

        let wentiId = this.curWentiId;
        let morenId = data.data - 3;
        var cfgs = answerModels[this.curWentiId];
        if (!cfgs)
            return;
        this.curVideoIndex = 0;
        for (var k in cfgs) {
            if (cfgs[k].ansid == morenId) {
                this.curAnswerCfg = cfgs[k];
                break;
            }
        }
        GameCommon.getInstance().shock();
        // VideoManager.getInstance().setSpeed(GameDefine.CUR_SPEED);
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
            // this.tipsPanel.endMusic();
            return;
        }
        this.videoIdx = this.curVIdeoIds[this.curVideoIndex];
        this._nextVid = this.curVIdeoIds[this.curVideoIndex];
        this.setVideoTouch(this.videoIdx);
        VideoManager.getInstance().onSetSrc1(this.curVIdeoIds[this.curVideoIndex]);
        widPlayer.seek(VideoManager.getInstance().getVideoDuration() - 1);
    }
}

declare var widPlayer;
declare var videoModels: Modelshipin[];
declare var wentiModels: Modelwenti[];
declare var answerModels: Modelanswer[];
// declare var videoIdx: string;
declare var videoNextFlg: boolean;//出现问题或者互动
declare var videoNextFlg1: boolean;//加载下一个视频
declare var videoAdvanceLoad: boolean;//提前加载可能播放的视频
enum ActionType {
    OPTION = 0,// 按钮选项
    CLICK_TIME = 1,// 点击屏幕(有倒计时)
    CLICK = 2,// 点击屏幕
    SLIDE = 3,// 轨迹滑动
    SLIDE_RECT = 4,// 区域内重复滑动
    SLIDE_TWO = 5,// 双指滑动
    MUSIC = 6,// 音乐游戏
    SEND_MSG = 7,// 发信息
    FULL_VIEW = 8,// 全景
    TAB = 9,
    HEAD_VIEW = 10,//
    CHECK_DRINK = 11,//选酒
    SEARCH = 12,//探查
}
