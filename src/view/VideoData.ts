const ADShowConfig = [
    {
        id: "ad1",
        videoID: "V510",
        start: 165,
        end: 169,
    },
    {
        id: "ad2",
        videoID: "VX1204",
        start: 29,
        end: 33,
    }
];

let hasPlayedVideo = false;

class VideoData extends egret.DisplayObjectContainer {
    public tipsPanel: TipsBtn;
    public videoUpDataHandle: Function;
    public videoEndHandle: Function;
    public videoErrorHandle: Function;
    public videoNodeChangeHandle: Function;
    public isLoadSrc = false;
    public videoPauseTime: number = 0;
    public isChangingQuality: boolean;
    private actionScene: egret.DisplayObjectContainer;
    private pauseByPauseEvent: boolean = false;
    private Video_Like_Condition = {
        "V801": {
            check: () => !([0, 1, 2, 3].some(roleIndex => GameCommon.getInstance().getRoleLikeAll(roleIndex) >= 7))
                && (GameCommon.getQuestionAnswer(27) !== 5 || GameCommon.getQuestionAnswer(46) !== 5),
            BEVideo: "V802"
        },
        "V907": {
            check: () => !([0, 1, 2, 3].some(roleIndex => GameCommon.getInstance().getRoleLikeAll(roleIndex) > 9))
                && GameCommon.getQuestionAnswer(27) === 5
                && GameCommon.getQuestionAnswer(46) === 5,
            BEVideo: "V908"
        },
    };
    private Video_Opt_Condition = {
        "VH1116": {options: {"54": 1, "55": 1, "56": 1}, nextVideoId: "VH1117"},
        "VY1204": {options: {"68": 1, "69": 1, "70": 1}, nextVideoId: "VY1205"},
        "VW1201": {options: {"71": 1, "72": 1}, nextVideoId: "VW1202"},
        "VH1113": {options: {"57": 2}, nextVideoId: "VH1116,VH1118"},
        "VH1114": {options: {"57": 1, "76": 2}, nextVideoId: "VH1116,VH1118"},
        "VX1110": {options: {"59": 1, "60": 1, "61": 1, "62": 1}, rightNum: 3, nextVideoId: "VX1111"},
    };
    private caidanList = [
        {
            check: () => {
                const list = [[64, 1], [65, 2], [66, 1], [67, 2]];
                let a = 0;
                let b = 0;
                list.forEach(info => {
                    if (UserInfo.curBokData.answerId[info[0]] == info[1]) {
                        a++;
                    } else {
                        b++;
                    }
                });
                return a === b;
            },
            curVidList: ["VW1206", "VY1206"],
            nextVid: "VW1207"
        },
        {
            check: () => GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.ZiHao_Xia) >= 12,
            curVidList: ["VX1204"],
            nextVid: "VX1205"
        },
    ];
    private againTime: number = 0;
    private againFlg: boolean = false;
    private touchId: string;
    private fileTimerIdx: number = 0;
    private oldVideoTimer: number = 0;
    private isDie = false;
    private isEndChapter: boolean = false;
    private videoState: string;
    private isHuDong = false;
    private isPlay: boolean = false;
    private touchtime: number = 0;
    private current: boolean = true;
    private isSelectVideo: boolean = false;
    private curAnswerCfg: Modelanswer;
    private nextWentiId: number = 0;
    private _nextVid: string = '';
    private tiaoState: boolean = false;
    private timeoutCallbackTime: number;
    private timeoutCallback: Function;
    private isShowHuDong: boolean;

    public constructor() {
        super();
        this.createGameScene();
        this.onRegistEvent();
    }

    public get videoIdx(): string {
        return VideoManager.getInstance().getVideoID();
    }

    /**读取当前视频ID**/
    public set videoIdx(id: string) {
        VideoManager.getInstance().updateVideoData(id);
        this.setVideoDict(id);
    }

    private _curWentiId: number = 0;

    private get curWentiId() {
        return this._curWentiId;
    }

    private set curWentiId(n) {
        this._curWentiId = n
    }

    private _curVideoIDs: string[];

    private get curVideoIDs() {
        return this._curVideoIDs;
    }

    private set curVideoIDs(ids) {
        this._curVideoIDs = ids;
    }

    private _curVideoIndex: number = 0;

    private get curVideoIndex() {
        return this._curVideoIndex;
    }

    private set curVideoIndex(index) {
        this._curVideoIndex = index;
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
        console.log("againGame>>>>", this.videoIdx);
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

    public readFile() {
        const file = UserInfo.curBokData;
        this.curAnswerCfg = null;
        if (!file) {
            return;
        }
        console.log("readFile>>>>", this.videoIdx);
        this.tiaoState = false;
        if (GameDefine.IS_DUDANG && GameDefine.CUR_PLAYER_VIDEO == 1) {
            let src = '';
            if (file.wentiId.length > 0) {
                src = file.videoNames[file.wentiId[file.wentiId.length - 1]];
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
        this._nextVid = '';
        if (file.wentiId.length > 0 && file.wentiId[file.wentiId.length - 1]) {
            GameCommon.getInstance().showLoading();
            let wentiId: number = file.wentiId[file.wentiId.length - 1];
            // 如果最后一个问题已经回答了 但是问题对应的视频不存在于答案的视频列表里面 那么就将视频换成答案的视频列表的第一个
            const answerId = file.answerId[wentiId];
            if (answerId) {
                const videos = Config.getAnswerConfig(wentiId, answerId).videos.split(',');
                if (videos.length && videos.indexOf(file.videoNames[wentiId]) === -1) {
                    file.videoNames[wentiId] = videos[0];
                }
            }
            if (file.wentiId[file.wentiId.length - 2]) {
                if (wentiModels[wentiId].chapter > wentiModels[file.wentiId[file.wentiId.length - 2]].chapter) {
                    //当前问题的章节大于前一个问题的章节，即当前的问题已经是跨章节了。
                    let curChapterCfg = JsonModelManager.instance.getModelchapter()[wentiModels[wentiId].chapter];
                    this.curVideoIDs = curChapterCfg.videoSrc.split(",");
                    this.curVideoIndex = 0;
                    this.videoIdx = this.curVideoIDs[this.curVideoIndex];
                    this.curWentiId = wentiId;
                    this.isSelectVideo = false;
                    if (this.videoIdx == '') {
                        this.videoIdx = file.videoNames[wentiId];
                    }
                    this.againFlg = true;
                    GameDefine.IS_READ_PLAY = true;
                    VideoManager.getInstance().onPlay(this.videoIdx);
                    return;
                }
            }
            this.curWentiId = wentiId;
            this.curVideoIDs = [file.curVideoID];
            this.curVideoIndex = 0;
            this.videoIdx = file.videoNames[wentiId];
            let cfgs = answerModels[wentiId];
            this.isSelectVideo = false;
            if (file.answerId[wentiId]) {
                this.isSelectVideo = true;
                for (let k in cfgs) {
                    if (cfgs.hasOwnProperty(k)) {
                        if (cfgs[k].ansid == file.answerId[wentiId]) {
                            this.curAnswerCfg = cfgs[k];
                            break;
                        }
                    }
                }
                if (this.curAnswerCfg.nextid != 0) {
                    this.curWentiId = this.curAnswerCfg.nextid;
                }
                this.nextWentiId = this.curAnswerCfg.nextid;
                if (this.curAnswerCfg.nextid == 0 && this.curAnswerCfg.isdie == 0) {
                    VideoManager.getInstance().updateGameChapter(this.curAnswerCfg.nextChapterId);
                }
                if (this.curAnswerCfg.videos.indexOf(",") >= 0) {
                    this.curVideoIDs = this.curAnswerCfg.videos.split(",");
                    this.videoIdx = '';
                    for (let i: number = 0; i < this.curVideoIDs.length; i++) {
                        if (this.curVideoIDs[i] == file.videoNames[wentiId]) {
                            if (i < this.curVideoIDs.length - 1) {
                                this.isSelectVideo = false;
                            }
                            this.curVideoIndex = i + 1;
                            this.videoIdx = file.videoNames[wentiId];
                        }
                    }
                    if (this.videoIdx == '') {
                        this.isSelectVideo = false;
                        this.curVideoIndex = 0;
                        this.videoIdx = this.curVideoIDs[this.curVideoIndex];
                    }
                } else {
                    this.isSelectVideo = false;
                    this.curVideoIDs = this.curAnswerCfg.videos.split(",");
                    this.curVideoIndex = 0;
                    this.videoIdx = this.curVideoIDs[this.curVideoIndex];
                }
            } else if (file.answerId[file.wentiId[file.wentiId.length - 2]]) {
                wentiId = file.wentiId[file.wentiId.length - 2];
                this.isSelectVideo = true;
                cfgs = answerModels[wentiId];
                for (let k in cfgs) {
                    if (cfgs.hasOwnProperty(k)) {
                        if (cfgs[k].ansid == file.answerId[wentiId]) {
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
                    this.curVideoIDs = this.curAnswerCfg.videos.split(",");
                    this.videoIdx = '';
                    for (let i: number = 0; i < this.curVideoIDs.length; i++) {
                        if (this.curVideoIDs[i] == file.videoNames[wentiId]) {
                            this.curVideoIndex = i + 1;
                            if (i < this.curVideoIDs.length - 1) {
                                this.isSelectVideo = false;
                            }
                            this.videoIdx = file.videoNames[wentiId];
                        }
                    }
                    if (this.videoIdx == '') {
                        this.isSelectVideo = false;
                        this.videoIdx = this.curVideoIDs[0];
                        this.curVideoIndex = 1;
                    }
                } else {
                    this.isSelectVideo = false;
                    this.curVideoIDs = [];
                    this.curVideoIDs.push(this.curAnswerCfg.videos);
                    this.curVideoIndex = 1;
                    this.videoIdx = this.curAnswerCfg.videos;
                }
            }
            if (this.videoIdx == '') {
                this.videoIdx = file.videoNames[wentiId];
            }
            if (file.wentiId[file.wentiId.length - 1] === 6 && file.answerId[6] !== undefined && file.answerId[6] !== '') {
                this.isSelectVideo = false;
                this.curVideoIDs = ['V019'];
                this.curVideoIndex = 0;
                this.videoIdx = 'V019';
                this.curWentiId = 6;
                this.nextWentiId = 6;
            }
            this.againFlg = true;
            GameDefine.IS_READ_PLAY = true;
            if (VideoManager.getInstance().getVideoData() && widPlayer) {
                VideoManager.getInstance().clear();
                VideoManager.getInstance().onAgainGame(this.videoIdx);
            } else {
                VideoManager.getInstance().onPlay(this.videoIdx);
            }
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), {
                cfg: JsonModelManager.instance.getModeljuqingkuai()[1][1],
                idx: FILE_TYPE.AUTO_FILE
            });
        }
    }

    public addActionScene(ui: egret.DisplayObjectContainer) {
        this.actionScene.addChild(ui);
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
        this.againFlg = true;
        this.curWentiId = wenti;
        this.nextWentiId = wenti;
        this.onCreateData();
        GameDefine.IS_READ_PLAY = true;
        if (!this.curVideoIDs) {
            this.curVideoIDs = [];
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
        this.isShowHuDong = false;
        let isShowChengJiu: boolean = false;
        let isResult: boolean = false;
        let isFile: boolean = false;
        if (!this.videoUpDataHandle) {
            this.videoUpDataHandle = new function () {
            };
            widPlayer.on('timeupdate', () => {
                GameCommon.getInstance().removeLoading();
                if (widPlayer.getPlayTime() >= this.timeoutCallbackTime) {
                    this.timeoutCallback();
                    this.timeoutCallback = undefined;
                    this.timeoutCallbackTime = undefined;
                }
                const videoCurTime = VideoManager.getInstance().videoCurrTime();
                ADShowConfig.forEach(config => {
                    this.tipsPanel[config.id].visible = this.videoIdx === config.videoID && videoCurTime > config.start && videoCurTime < config.end;
                });
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                const videoDuration = VideoManager.getInstance().getVideoDuration();
                if (!widPlayer || !videoModels[this.videoIdx] || videoDuration == 0) {
                    return;
                }
                if (this.videoIdx == 'V019' && videoCurTime >= videoDuration - 10 && !isShowChengJiu) {
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
                if (videoCurTime > 3 && !isFile) {
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
                if (this.againTime > 0 && this.againTime > videoCurTime) {
                    if (this.againTime < videoDuration) {
                        widPlayer.seek(this.againTime);
                        this.againTime = 0;
                    }
                }
                if (videoModels[this.videoIdx].jtime) {
                    let jtime = Number(videoModels[this.videoIdx].jtime);
                    if (jtime > videoDuration) {
                        jtime = videoDuration - 5;
                    }
                    if (videoModels[this.videoIdx].tiaozhuan != TIAOZHUAN_Type.RESULT) {
                        if (videoCurTime >= jtime && !isShowEnd) {
                            this.isSelectVideo = false;
                            this.curVideoIDs = [];
                            this.curVideoIndex = 0;
                            this.fileTimerIdx = 0;
                            this.tipsPanel.hideTips();
                            let vd = new ViewEnd(true, videoModels[this.videoIdx].tiaozhuan);
                            this.addChild(vd);
                            isShowEnd = true;
                            return;
                        }
                        if (videoCurTime >= Math.round(videoDuration) - 3) {
                            widPlayer.seek(jtime + 3);
                        }
                        if (isShowEnd) {
                            return;
                        }
                    } else {
                        if (videoModels[this.videoIdx].tiaozhuan == TIAOZHUAN_Type.RESULT) {
                            if (videoCurTime >= jtime && !isShowRes) {
                                isShowRes = true;
                                const list = this.caidanList;
                                for (let i = 0; i < list.length; i++) {
                                    const item = list[i];
                                    if (item.check() && item.curVidList.indexOf(this.videoIdx) !== -1) {
                                        this.curVideoIDs = [item.nextVid];
                                        this.curVideoIndex = 0;
                                        let nextVideoSrc: string = this.curVideoIDs[this.curVideoIndex];
                                        VideoManager.getInstance().isReadySet = true;
                                        VideoManager.getInstance().onLoadSrc(nextVideoSrc);
                                        this._nextVid = nextVideoSrc;
                                        tips.hideTips();
                                        return;
                                    }
                                }
                                this.onShowResult();
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
                    if (videoCurTime > videoDuration - 10 && !this.isSelectVideo) {
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_FULL_END), wentiModels[this.curWentiId].moren + 3);
                    }
                    return;
                }
                if (this && videoDuration > 0) {
                    if (this.curWentiId >= 1) {
                        if (videoCurTime >= videoDuration)
                            return;
                        if (videoModels[this.videoIdx] && Number(videoModels[this.videoIdx].time) > 0) {
                            let wtTime = Number(videoModels[this.videoIdx].time);
                            if (wtTime > videoDuration) {
                                wtTime = videoDuration - 5;
                            }
                            if (videoCurTime >= wtTime - 3 && !this.isShowHuDong) {
                                this.isShowHuDong = true;
                                if (this.curWentiId != 77 && this.curWentiId != 78) {
                                    GameCommon.getInstance().setTipsHuDong();
                                }
                                VideoManager.getInstance().setSpeed(1);
                            }

                            let lastTime: number = Number(wentiModels[this.curWentiId].time) + wtTime;
                            if (!videoAdvanceLoad) {
                                videoAdvanceLoad = true;
                                VideoManager.getInstance().onLoad(this.curWentiId)
                            }
                            if (lastTime >= videoDuration) {
                                lastTime = videoDuration - 1;
                            }

                            if (Math.floor(videoCurTime) >= lastTime - 0.5) {
                                if (videoNextFlg1 && !this.isSelectVideo && wentiModels[this.curWentiId].type == ActionType.OPTION) {
                                    videoNextFlg1 = false;
                                    this.isSelectVideo = true;
                                    this.onLoadNextVideo();
                                    return;
                                } else if (Math.floor(videoCurTime) >= lastTime) {
                                    tips.hideTips();
                                }
                            }
                            if (videoCurTime >= wtTime && videoCurTime < lastTime) {
                                if (videoNextFlg) {
                                    GameCommon.getInstance().hideTipsHuDong();
                                    tips.onCreateBtn(wentiModels[this.curWentiId]);
                                    this.isHuDong = true;
                                    videoNextFlg = false;
                                }
                                tips.setTips(lastTime - videoCurTime);
                            } else if (videoCurTime >= lastTime - 1 && videoNextFlg1) {
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
                            if (videoCurTime >= 0 && !this.isSelectVideo) {
                                this.isSelectVideo = true;
                                VideoManager.getInstance().isReadySet = true;
                                let likeConditionData = this.Video_Like_Condition[this.videoIdx];
                                if (likeConditionData && likeConditionData.check()) {
                                    this.curVideoIDs = [likeConditionData.BEVideo];
                                    this.curVideoIndex = 0;
                                }
                                let optConditionData = this.Video_Opt_Condition[this.videoIdx];
                                if (optConditionData) {
                                    let rightNum: number = 0;
                                    let totalNum: number = 0;
                                    for (let condWentiID in optConditionData.options) {
                                        if (optConditionData.options.hasOwnProperty(condWentiID)) {
                                            totalNum++;
                                            let condOptID: number = optConditionData.options[condWentiID];
                                            let selectOptID: number = UserInfo.curBokData.answerId[condWentiID];
                                            if (selectOptID == condOptID) {
                                                rightNum++;
                                            }
                                        }
                                    }
                                    if (optConditionData.rightNum ?
                                        rightNum < optConditionData.rightNum :
                                        rightNum < totalNum) {
                                        this.curVideoIDs = optConditionData.nextVideoId.split(",");
                                        this.curVideoIndex = 0;
                                    }
                                }
                                let nextVideoSrc: string = this.curVideoIDs[this.curVideoIndex];
                                VideoManager.getInstance().onLoadSrc(nextVideoSrc);
                                this._nextVid = nextVideoSrc;
                            }
                            tips.hideTips();
                        }
                    } else if (videoModels[this.videoIdx]) {
                        if (videoModels[this.videoIdx].tiaozhuan == TIAOZHUAN_Type.WENTI) {
                            if (videoNextFlg1 && videoCurTime >= Number(videoModels[this.videoIdx].jtime) - 10) {
                                videoNextFlg1 = false;
                                let wentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                                VideoManager.getInstance().onLoad(UserInfo.curBokData.videoNames[wentiId]);
                                return;
                            }
                        }
                    }
                }
            });
        }
        if (!this.videoEndHandle) {
            widPlayer.on('statechange', (data) => {
                if (isTXSP && !hasPlayedVideo) {
                    if (data.new === "playing") {
                        hasPlayedVideo = true;
                        bridgeHelper.reportAction({
                            type: 'pageview',
                            pageid: 'hdsp_play',
                        });
                    }
                }
                if (GameDefine.CUR_PLAYER_VIDEO == 2) {
                    return;
                }
                if (data.new === "playing") {
                    const vm = VideoManager.getInstance();
                    if (!vm.dontHideMain) {
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                    }
                    vm.dontHideMain = false;
                    this.isChangingQuality = false;
                    this.tipsPanel.removePauseState();
                }
                if (["playing", "seeked"].indexOf(data.new) !== -1) {
                    GameCommon.getInstance().removeLoading();
                }
                if (this.isChangingQuality && data.new === "pause") {
                    GameCommon.getInstance().showLoading();
                }
                this.log(data.old + '-----------' + data.new);
                if (data.new == 'buffering' || data.new == 'seeking') {
                    GameCommon.getInstance().showLoading();
                } else if (data.new == 'end') {
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_PLAY_END), data);
                    this.isEndChapter = true;
                    this.onShowNextVideo();
                    TaskManager.instance.addDuration(widPlayer.getDuration());
                } else if (data.new == 'playing' && this.tiaoState)//强行修复BUG
                    this.tiaoState = false;
                this.videoState = data.new;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_STATE_CHANGE), data);
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
            widPlayer.on('error', (...args) => {
                errorList.push({type: "video player error", args});
                GameCommon.getInstance().showErrorLog(JSON.stringify(args));
                GameCommon.getInstance().showErrorLog('出现未处理错误，请点击上方复制log按钮，将复制到的log发给开发');
                let str = "网络连接异常，请重新打开《拳拳四重奏》";
                if (platform.isDebug() || GameDefine.SHOW_VIDEO_ERROR_INFO) {
                    str += "\n" + JSON.stringify(args);
                }
                GameCommon.getInstance().showStrongTips(str, () => platform.close());
                VideoManager.getInstance().clear();
                this.touchEnabled = false;
                this.touchChildren = false;
                if (isTXSP) {
                    bridgeHelper.writeLog({
                        appid: txsp_appid,
                        content: `script error: ${JSON.stringify(args)}`
                    });
                }
            });
        }
        if (!this.videoNodeChangeHandle) {
            widPlayer.on('videoNodeChange', () => {
                this.isChangingQuality = false;
                this.timeoutCallback = undefined;
                this.timeoutCallbackTime = undefined;
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
                    this.isShowHuDong = false;
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
                        if (this.curVideoIDs && this.curVideoIndex < this.curVideoIDs.length) {
                            this.videoIdx = this.curVideoIDs[this.curVideoIndex];
                            this.curVideoIndex = this.curVideoIndex + 1;
                        }
                        if (this._nextVid) {
                            this.videoIdx = this._nextVid;
                        }
                    }
                    this.isPlay = false;
                    console.log('videoNodeChange切换视频', this.videoIdx);

                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ResultWinPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'JuQingPanel');
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.HIDE_MAIN_GROUP));
                }
            });
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
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        } else {
            if (UserInfo.curBokData.wentiId.length > 0) {
                let wId = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
                if (UserInfo.curBokData.videoNames[wId] != this.videoIdx) {
                    UserInfo.curBokData.videoNames[wId] = this.videoIdx;
                }
                GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            }
        }
        GameCommon.getInstance().removeLoading();
        VideoManager.getInstance().videoPause();
        if (isTXSP) {
            GameDefine.IS_DUDANG = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
        } else {
            this.tipsPanel.hideTips();
            this.tipsPanel.visible = false;
            this.visible = false;
            GameCommon.getInstance().hideTipsHuDong();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
            Tool.callbackTime(function () {
                GameDefine.IS_DUDANG = true;
            }, this, 200);
        }
    }

    public onShowNextVideo() {
        if (this.isPlay) {
            return;
        }
        console.log("onShowNextVideo>>>>", this.videoIdx);
        this.tiaoState = false;
        UserInfo.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.allVideos[this.videoIdx] = this.videoIdx;
        this.setVideoDict(this.videoIdx);
        this.isLoadSrc = false;
        if (this.videoIdx != 'V019' && videoModels[this.videoIdx].chengjiuId != '' && VideoManager.getInstance().videoCurrTime() >= VideoManager.getInstance().getVideoDuration() - 10) {
            ChengJiuManager.getInstance().onCheckShiPinChengJiu(videoModels[this.videoIdx].chengjiuId);
        }
        if (videoModels[this.videoIdx].tiaozhuan == TIAOZHUAN_Type.RESULT) {
            this.isPlay = true;
            return;
        }
        if (videoModels[this.videoIdx].tiaozhuan != 0) {
            this.curVideoIDs = [];
            this.curVideoIndex = 0;
            this.fileTimerIdx = 0;
            this.tipsPanel.visible = false;
            let vd = new ViewEnd(true, videoModels[this.videoIdx].tiaozhuan);
            this.addChild(vd);
        } else {
            if (this.curVideoIndex >= this.curVideoIDs.length || this.curVideoIDs.length == 0) {
                this.onShowResult();
                return;
            }
            if (this.tipsPanel) {
                this.tipsPanel.hideTips();
            }
            if (this.curVideoIndex >= this.curVideoIDs.length - 1) {
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
        this.curVideoIDs = videos;
    }

    public onTiao() {
        let isChapterLastVideo = this.videoIdx == 'V019' || Number(videoModels[this.videoIdx].jtime) !== 0;
        const curTime = VideoManager.getInstance().videoCurrTime();
        const duration = VideoManager.getInstance().getVideoDuration();
        if (curTime < 1)
            return;
        let wentiTime: number = 0;
        if (Number(videoModels[this.videoIdx].time) > 0) {
            wentiTime = Number(videoModels[this.videoIdx].time);
        }
        if (wentiTime > duration) {
            wentiTime = duration - 5;
        }
        if (wentiTime > 0) {
            //如果有问题：问题时间还差3秒以上并且问题时间离结束<3秒，就跳到问题的前2秒，
            //如果剩余时间大于5秒。跳到倒数5秒
            //如果是最后5秒。出提示
            if (!this.isSelectVideo
                && curTime < wentiTime - 3
                && duration > wentiTime - 3
                && !this.tiaoState) {
                this.tiaoState = true;
                widPlayer.seek(wentiTime - 2);
            } else if (curTime <= wentiTime) {
                GameCommon.getInstance().showCommomTips('即将出现互动');
            } else if (curTime + 5 < duration && !this.tiaoState) {
                this.tiaoState = true;
                widPlayer.seek(duration - 4);
            } else if (curTime + 5 > duration) {
                if (isChapterLastVideo)
                    GameCommon.getInstance().showCommomTips('章节结尾');
                else
                    GameCommon.getInstance().showCommomTips('精彩正加载');
            }
        } else if (curTime + 5 < duration && !this.tiaoState) {
            //没有问题。但离结束还有5秒以上，stime=seektime.表示大跳跳到的时间
            //时间没到stime,就跳到stime,如果已经快到stime，则出提示
            if (Number(videoModels[this.videoIdx].stime) > 0 && videoModels[this.videoIdx].tiaozhuan == 4) {
                if (curTime + 5 < Number(videoModels[this.videoIdx].stime)) {
                    this.tiaoState = true;
                    widPlayer.seek(Number(videoModels[this.videoIdx].stime))
                } else {
                    if (isChapterLastVideo)
                        GameCommon.getInstance().showCommomTips('章节结尾');
                    else
                        GameCommon.getInstance().showCommomTips('精彩正加载');
                }
            } else {
                this.tiaoState = true;
                widPlayer.seek(duration - 4);
            }
        } else if (curTime + 5 > duration && !this.tiaoState) {
            //最后5秒，出提示
            if (isChapterLastVideo)
                GameCommon.getInstance().showCommomTips('章节结尾');
            else
                GameCommon.getInstance().showCommomTips('精彩正加载');
        }
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

    public setVideoTimeout(callback: Function, timeout: number) {
        this.timeoutCallbackTime = widPlayer.getPlayTime() + timeout / 1000;
        this.timeoutCallback = callback;
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
        console.log("onContinue>>>>", this.videoIdx);
        this.tiaoState = false;
        GameDefine.IS_READ_PLAY = true;
        let chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        if (!this.isEndChapter) {
            VideoManager.getInstance().onPlay(UserInfo.curBokData.videoNames[chapCfg.wenti]);
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
        }, this, 100);
    }

    private onGameOver(): void {
        this.curAnswerCfg = null;
        this.againFlg = true;
        videoNextFlg1 = true;
        this.tipsPanel.visible = true;
        console.log("onGameOver>>>>", this.videoIdx);
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
                    this.curVideoIDs = this.curAnswerCfg.videos.split(",");
                    this.curVideoIndex = this.curVideoIDs.length;
                    this.videoIdx = this.curVideoIDs[this.curVideoIDs.length - 1]
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
            VideoManager.getInstance().onPlay(this.videoIdx);
            this.againTime = Number(videoModels[this.videoIdx].time) - 5;
        }
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
    }

    private onPlayIos() {
    }

    private onShowResult() {
        let isEnd: boolean = false;
        let isFindNext: boolean = false;
        let curWentiId: number = UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1];
        for (let qid in answerModels) {
            let answerModel = answerModels[qid];
            let optionID: number = UserInfo.curBokData.answerId[qid];
            if (optionID && answerModel[optionID - 1]) {
                let ansCfg: Modelanswer = answerModel[optionID - 1];
                if (ansCfg.videos.indexOf(this.videoIdx) != -1 && ansCfg.nextChapterId > 0) {
                    isFindNext = true;
                    curWentiId = ansCfg.qid;
                    isEnd = VideoManager.getInstance().updateGameChapter(ansCfg.nextChapterId);
                    break;
                }
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
                if (isTXSP) {
                    GameDefine.IS_DUDANG = false;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
                } else {
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
                }
                return;
            }
        }

        this.setVideoDict(this.videoIdx);
        UserInfo.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.allVideos[this.videoIdx] = this.videoIdx;
        UserInfo.curBokData.videoNames[curWentiId] = this.videoIdx;
        this.actionScene.touchEnabled = true;
        this.actionScene.touchChildren = true;

        this.isSelectVideo = false;
        this.curVideoIDs = [];
        this.curVideoIndex = 0;
        let chapCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        let videoIds = chapCfg.videoSrc.split(",");
        this.setVideos(videoIds);
        this.curVideoIndex = 1;
        let videoSrc = videoIds[0];
        UserInfo.curBokData.wentiId.push(chapCfg.wenti);
        this.setVideoDict(videoSrc);
        UserInfo.curBokData.videoNames[chapCfg.wenti] = videoSrc;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        this.fileTimerIdx = 0;
        this.tipsPanel.hideTips();
        this.tipsPanel.visible = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIDEODATA));

        // if (UserInfo.curchapter == 1) {
        //     if (!GameCommon.getInstance().checkChapterLocked())
        //         return;
        // }

        VideoManager.getInstance().onLoad(videoSrc);
        VideoManager.getInstance().loadSrc = videoSrc;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam('ResultWinPanel', isEnd));
    }

    private onLoadNextVideo(id = 0) {
        if (id != 0) {
            this.tipsPanel.onUpdateWenTi(id);
        } else {
            this.tipsPanel.onUpdateWenTi(GameCommon.getInstance().getDefaultAns(this.curWentiId));
        }
    }

    private onReduceVideo() {
        if (VideoManager.getInstance().videoCurrTime() < 1) {
            GameCommon.getInstance().showCommomTips('已经没法后退啦~');
            return;
        }

        if (this.curWentiId && videoModels[this.videoIdx].time) {
            let curTime = VideoManager.getInstance().videoCurrTime();
            let wentiTime = Number(videoModels[this.videoIdx].time);
            let wentiLastTime: number = wentiTime + Number(wentiModels[this.curWentiId].time);
            if (curTime > wentiTime && curTime - 10 <= wentiLastTime) {
                GameCommon.getInstance().showCommomTips('你已做出选择啦~');
                return;
            }
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
        this.isShowHuDong = false;
        GameCommon.getInstance().hideTipsHuDong();
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
        let isChapterLastVideo = this.videoIdx == 'V019' || Number(videoModels[this.videoIdx].jtime) != 0;
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
                        if (isChapterLastVideo)
                            GameCommon.getInstance().showCommomTips('章节结尾');
                        else
                            GameCommon.getInstance().showCommomTips('精彩正加载')
                    }
                } else {
                    if (this.isSelectVideo) {
                        GameCommon.getInstance().showCommomTips('精彩正加载');
                        return;
                    }
                    GameCommon.getInstance().showCommomTips('即将出现互动');
                }
            }
        } else {
            if (VideoManager.getInstance().videoCurrTime() + 12 < VideoManager.getInstance().getVideoDuration()) {
                if (this.videoState != 'buffering' && this.videoState != 'end' && this.videoState != 'idle' && this.videoState != 'loadStart') {
                    widPlayer.seek(VideoManager.getInstance().videoCurrTime() + 10);
                    this.tipsPanel.onShowAddTime();
                } else {
                    GameCommon.getInstance().showCommomTips('精彩正加载');
                }
            } else {
                if (isChapterLastVideo)
                    GameCommon.getInstance().showCommomTips('章节结尾');
                else
                    GameCommon.getInstance().showCommomTips('精彩正加载');
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
            if (this.videoState === "playing") {
                this.pauseByPauseEvent = true;
                VideoManager.getInstance().videoPause();
            }
        } else {
            if (GuideManager.getInstance().isGuide && GuideManager.getInstance().curState) {
                return;
            }
            this.current = true;
            this.oldVideoTimer = 0;
            // 只有因为pause事件暂停的时候 才会因为resume事件恢复播放
            if (this.pauseByPauseEvent) {
                this.tipsPanel.imStatus = 'pauseImg_png';
                VideoManager.getInstance().videoResume();
                this.tipsPanel.removePauseState();
                this.pauseByPauseEvent = false;
            }
        }
    }

    private onRefreshVideo(data) {
        setTimeout(() => {
            GameCommon.getInstance().showRoleLike();
            TaskManager.instance.checkQuestionTask();
        }, 0);
        console.log("onRefreshVideo>>>>", this.videoIdx);
        if (this.isSelectVideo && wentiModels[data.data.wentiId].type != ActionType.OPTION)
            return;
        this.tiaoState = false;
        setTimeout(() => SoundManager.getInstance().stopMusicAll(), 2000);
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
        if (["V302", "V304A"].indexOf(this.videoIdx) === -1) {
            if (wentiModels[data.data.wentiId].type != ActionType.OPTION) {
                GameCommon.getInstance().shock(1, data.data.click);
            } else {
                GameCommon.getInstance().shock();
            }
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
                this.curVideoIDs = [];
                this.curVideoIndex = 0;
            }
            GameCommon.getInstance().addRoleLike(this.curAnswerCfg.like);
            Tool.callbackTime(() => ChengJiuManager.getInstance().onCheckAnswer(data.data.wentiId, data.data.answerId), this, 100);

            if (this.videoIdx == 'V019') {
                if (videoModels[this.videoIdx].chengjiuId != '' && VideoManager.getInstance().videoCurrTime() >= VideoManager.getInstance().getVideoDuration() - 10) {
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
            this.curVideoIDs = this.curAnswerCfg.videos.split(",");
        } else if (this.curAnswerCfg.videos.length > 0) {
            this.curVideoIDs = [];
            this.curVideoIDs.push(this.curAnswerCfg.videos);
        } else {
            this.curVideoIDs = [];
        }

        this.isSelectVideo = true;
        if (wentiModels[data.data.wentiId].type != ActionType.OPTION) {
            if (data.data.click) {
                GameCommon.getInstance().addAlert('hudongchenggong');
            } else {
                GameCommon.getInstance().addAlert('hudongshibai');
            }
        }
        if (!this.curVideoIDs[this.curVideoIndex]) {
            return;
        }
        VideoManager.getInstance().onLoadSrc(this.curVideoIDs[this.curVideoIndex]);
        this._nextVid = this.curVideoIDs[this.curVideoIndex];
    }

    private onVideo_Full_End(data) {
        setTimeout(() => {
            GameCommon.getInstance().showRoleLike();
            TaskManager.instance.checkQuestionTask();
        }, 0);
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
        GameCommon.getInstance().addRoleLike(this.curAnswerCfg.like);
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
        this.curVideoIDs = this.curAnswerCfg.videos.split(",");
        this.isSelectVideo = true;
        if (!this.curVideoIDs[this.curVideoIndex]) {
            return;
        }
        this.videoIdx = this.curVideoIDs[this.curVideoIndex];
        this._nextVid = this.curVideoIDs[this.curVideoIndex];
        this.setVideoTouch(this.videoIdx);
        VideoManager.getInstance().onPlay(this.curVideoIDs[this.curVideoIndex]);
        widPlayer.seek(VideoManager.getInstance().getVideoDuration() - 1);
    }

    private setVideoDict(vid: string) {
        if (vid === "") {
            return;
        }
        UserInfo.curBokData.videoDic[vid] = vid;
        TaskManager.instance.checkVideoTask();
        const beganCid = Config.getVideoBeganChapter(vid);
        if (beganCid !== undefined) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BEGAN_READING_CHAPTER), beganCid);
        }
        const endedCid = Config.getVideoEndedChapter(vid);
        if (endedCid !== undefined) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ENDED_READING_CHAPTER), endedCid);
        }
        const endingInfo = Config.getVideoAchievedEnding(vid);
        if (endingInfo !== undefined) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ACHIEVED_ENDING), endingInfo);
        }
    }
}

declare let widPlayer;
declare let videoModels;
declare let wentiModels;
declare let answerModels;
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
    SELECT = 11,
    SEARCH = 12,
}
