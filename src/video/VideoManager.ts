class VideoManager {
    private static instance: VideoManager = null;
    public speed: number = 1;
    public isReadySet: boolean = false;
    private videoData: VideoData;
    private currIdx: number;
    private first: boolean = true;
    private isPause: boolean = false;
    private _isRead: boolean = false;
    private setVid: string = '';
    private _videoID: string;//当前播放的视频ID

    private _loadSrc: string = '';

    public dontHideMain: boolean = false;

    public get loadSrc(): string {
        return this._loadSrc;
    }

    public set loadSrc(str) {
        this._loadSrc = str;
    }

    public static getInstance(): VideoManager {
        if (this.instance == null) {
            this.instance = new VideoManager();
        }
        return this.instance;
    }

    public init(videoData: VideoData) {
        this.currIdx = -1;
        this.videoData = videoData;
    }

    public getVideoData() {
        return !!this.videoData;
    }

    /**存储当前正在播放的视频**/
    public updateVideoData(videoid: string): void {
        if (!videoid) return;
        if (!JsonModelManager.instance.getModelshipin()[videoid]) return;
        this._videoID = videoid;
        if (this._videoID && UserInfo.curBokData.curVideoID != this._videoID) {
            UserInfo.curBokData.curVideoID = this._videoID;
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        }
    }

    public getVideoID(): string {
        return this._videoID;
    }

    /**存储章节
     * 返回BOOL 章节是否已经结束
     * **/
    public updateGameChapter(chapterID: number): boolean {
        let isComplete: boolean = true;
        let chapterCfg: Modelchapter = JsonModelManager.instance.getModelchapter()[chapterID];
        if (!chapterCfg) return isComplete;
        switch (chapterID) {
            case 0:
                isComplete = true;
                UserInfo.curchapter = chapterID;
                break;
            case 10:
                const likeDataList = GameCommon.getInstance().getSortLikeAry();
                const map = {
                    [ROLE_INDEX.XiaoBai_Han]: 10,
                    [ROLE_INDEX.ZiHao_Xia]: 20,
                    [ROLE_INDEX.QianYe_Xiao]: 30,
                    [ROLE_INDEX.WanXun_Xiao]: 30,
                };
                UserInfo.curchapter = map[likeDataList[0].id];
                isComplete = false;
                break;
            case 30:
                let qianye_like: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.QianYe_Xiao);
                let wanxun_like: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.WanXun_Xiao);
                if (qianye_like >= wanxun_like) {
                    UserInfo.curchapter = 31;
                } else {
                    UserInfo.curchapter = 41;
                }
                isComplete = false;
                break;
            default:
                isComplete = false;
                UserInfo.curchapter = chapterID;
                break;
        }
        if (!isComplete) {
            UserInfo.curBokData.chapterDatas[UserInfo.curchapter - 1] = UserInfo.curchapter - 1;
            UserInfo.curBokData.chapterDatas[UserInfo.curchapter] = UserInfo.curchapter;
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        }
        return isComplete;
    }

    public onAgainGame(src) {
        GameDefine.CUR_PLAYER_VIDEO = 1;
        if (this.first) {
            this.onPlay(src);
        } else {
            this.play(videoModels[src].vid);
        }
    }

    public onPlay(param) {
        if (this.first) {
            if (widPlayer) {
                this.play(videoModels[param].vid);
                VideoManager.getInstance().videoData.checkVideoTime(param);
                this.first = false;
            }
        } else {
            if (widPlayer) {
                this.play(videoModels[param].vid);
            }
        }
    }

    public againInit() {
        // window['player'] = new window['Txiplayer']({
        // 	container: '#videoDivMin',
        // 	width: "100%",
        // 	// height: "100%",
        // 	showUI: false //默认false，控制是否展示默认的播放器UI
        // })
        // window['player'].play(videoModels[videoIdx].vid);
    }

    public videoCurrTime(): number {
        if (!widPlayer)
            return 0;
        return widPlayer.getPlayTime();
    }

    public getVideoDuration(): number {
        if (!widPlayer)
            return 0;
        // this.videoDurationCallBack
        return widPlayer.getDuration();
    }

    public videoLastTime(): number {
        return VideoManager.getInstance().getVideoDuration() - VideoManager.getInstance().videoCurrTime();
    }

    public videoPause() {
        if (!widPlayer)
            return;
        // VideoManager.getInstance().log('暂停')
        // if (!this.isPause) {
        widPlayer.pause();
        this.isPause = true;
        // }


    }

    public videoResume() {
        if (!widPlayer)
            return;
        // VideoManager.getInstance().log('play')
        // if (this.isPause) {
        widPlayer.resume();
        this.videoData.onCloseMengBan();
        this.isPause = false;
        // }

    }

    public setVideoState() {
        if (!widPlayer)
            return;
        this.isPause = false;
    }

    public onLoad(wentiId) {
        if (!widPlayer)
            return;
        const cfgs = answerModels[wentiId];
        let videoSrcs: string[] = [];
        if (!cfgs) {
            if (!videoModels[wentiId]) {
                return;
            }
            videoSrcs.push(videoModels[wentiId].id)
        } else {
            for (const k in cfgs) {
                if (cfgs.hasOwnProperty(k)) {
                    if (cfgs[k].videos.indexOf(",") >= 0) {
                        videoSrcs = videoSrcs.concat(cfgs[k].videos.split(",")[0]);
                    } else {
                        if (cfgs[k].videos != '')
                            videoSrcs.push(cfgs[k].videos);
                        else
                            return;
                    }
                }
            }
        }
        for (let i: number = 0; i < videoSrcs.length; i++) {
            videoSrcs[i] = videoModels[videoSrcs[i]].vid;
        }
        this.isReadySet = false;
        widPlayer.preloadVideoNode(videoSrcs).then(() => {
            this.isReadySet = true;
            // VideoManager.getInstance().log('预加载成功' + videoSrcs)
            if (this.setVid != '') {
                // VideoManager.getInstance().log('成功回调set_Src' + obj.setVid)
                if (this._isRead) {
                    widPlayer.setNextVideoNode(this.setVid, {inerrupt: true});
                } else {
                    widPlayer.setNextVideoNode(this.setVid);
                }
                this.setVid = '';
            }
        })
    }

    public onLoadSrc(src) {
        if (!widPlayer)
            return;
        if (!src) {
            return;
        }
        if (this.isReadySet) {
            this.setVid = '';
            widPlayer.setNextVideoNode(videoModels[src].vid);
        } else {
            VideoManager.getInstance().log('预加载没成功等待自动加载' + videoModels[src].vid);
            this.setVid = videoModels[src].vid;
        }
    }

    public log(str) {
        if (this.videoData)
            this.videoData.log(str);
    }

    public setSpeed(speed) {
        if (!widPlayer)
            return;

        widPlayer.setPlaybackRate(speed);
    }

    //切换视频音量
    public onSwitchVolume(volume) {
        if (!widPlayer)
            return;
        // widPlayer.setVolume(volume);
        GameDefine.VIDEO_VOLUME = volume;
    }

    //清空
    public clear() {
        if (!widPlayer)
            return;
        widPlayer.clear();
        // widPlayer.stop();
    }

    public videoClose(): void {
        this.videoData.onCloseVideo();
    }

    private play(vid) {
        widPlayer.play(vid);
        setTimeout(() => GameCommon.getInstance().showRoleLike(), 0);
    }
}
