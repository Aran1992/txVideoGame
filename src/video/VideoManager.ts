class VideoManager {
    private static instance: VideoManager = null;
    public currParam: string;
    public speed: number = 1;
    public isSwitchVideo: boolean = false;
    public videoLoadNode: Function;
    public videoCurrCallBack: Function;
    public videoDurationCallBack: Function;
    public isReadySet: boolean = false;
    private videoData: VideoData;
    private currIdx: number;
    private isPlay: boolean = false;
    private first: boolean = true;
    private _videoID: string;//当前播放的视频ID
    private isPause: boolean = false;
    private _isRead: boolean = false;
    private setVid: string = '';
    private _speed: number = 1;

    private constructor() {
    }

    private _loadSrc: string = '';

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
        if (this.videoData) {
            return true;
        }
        return false;
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
        // if (!this.videoLoadNode) {
        // 	this.videoLoadNode = function (vids) {
        // 		// console.log('123');
        // 		return vids;
        // 	}
        // }
        GameDefine.CUR_PLAYER_VIDEO = 1;
        if (this.first) {
            this.onPlay(src);
        } else {
            widPlayer.play(videoModels[src].vid);
        }

        // this.videoData.checkVideoTime(src);
    }

    public onPlay(param, tim: number = 0) {
        if (this.first) {
            // let di = window['videoDivMin'];
            // di.style.width = videoSize.width + "px";
            // di.style.height = videoSize.height + "px";
            // var video1;

            // var obj = this;
            // window['player'].on('ready', () => {
            // 	// window['player'] = player;
            // 	widPlayer = player;
            // 	var btn: eui.Button = new eui.Button();
            // 	btn.addEventListener(egret.TouchEvent.TOUCH_TAP, obj.onClick, obj);
            // 	btn.dispatchEvent(new egret.Event(egret.TouchEvent.TOUCH_TAP,true,true))
            // 	VideoManager.getInstance().videoData.checkVideoTime(param);
            // })
            // param
            if (widPlayer) {
                widPlayer.play(videoModels[param].vid);
                VideoManager.getInstance().videoData.checkVideoTime(param);
                this.first = false;
            }

            // window['player'].play();
            // Tool.callbackTime(function () {
            // 	widPlayer = window['player'];
            // 	var ps = document.getElementsByTagName('video');
            // 	for (var i: number = 0; i < ps.length; i++) {
            // 		if (size.fillType == FILL_TYPE_COVER) {
            // 			ps[i].style["object-fit"] = "cover";
            // 		} else {
            // 			ps[i].style["object-fit"] = "contain";
            // 		}
            // }
            // }, this, 1000);
            // return;
        } else {
            if (widPlayer) {
                widPlayer.play(videoModels[param].vid);
            }
        }
    }

    public onClick() {
        VideoManager.getInstance().log('click');
        window['player'].play();
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
        if (!this.videoCurrCallBack) {
            this.videoCurrCallBack = function (tim) {
                return tim;
            }
        }
        return widPlayer.getPlayTime();
    }

    public getVideoDuration(): number {
        if (!widPlayer)
            return 0;
        if (!this.videoDurationCallBack) {
            this.videoDurationCallBack = function (tim) {
                return tim;
            }
        }
        // this.videoDurationCallBack
        return widPlayer.getDuration();
    }

    public videoLastTime(): number {
        let num = VideoManager.getInstance().getVideoDuration() - VideoManager.getInstance().videoCurrTime();
        return num;
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

    public getPause(): boolean {
        return this.isPause;
    }

    public onLoad(wentiId) {
        if (!widPlayer)
            return;
        var cfgs = answerModels[wentiId];
        var videoSrcs: string[] = [];
        if (!cfgs) {
            if (!videoModels[wentiId]) {
                return;
            }
            videoSrcs.push(videoModels[wentiId].id)
        } else {
            for (var k in cfgs) {
                if (cfgs[k].videos.indexOf(",") >= 0) {
                    var strs = cfgs[k].videos.split(",");
                    videoSrcs.push(strs[0]);
                } else {
                    if (cfgs[k].videos != '')
                        videoSrcs.push(cfgs[k].videos);
                    else
                        return;
                }
            }
        }
        // VideoManager.getInstance().log('load可能播放的src' + videoSrcs)
        for (var i: number = 0; i < videoSrcs.length; i++) {
            videoSrcs[i] = videoModels[videoSrcs[i]].vid;
        }
        var obj = this;
        this.isReadySet = false;
        widPlayer.preloadVideoNode(videoSrcs).then(() => {
            obj.isReadySet = true;
            // VideoManager.getInstance().log('预加载成功' + videoSrcs)
            if (obj.setVid != '') {
                // VideoManager.getInstance().log('成功回调set_Src' + obj.setVid)
                if (obj._isRead) {
                    widPlayer.setNextVideoNode(obj.setVid, {inerrupt: true});
                } else {
                    widPlayer.setNextVideoNode(obj.setVid);
                }

                obj.setVid = '';
            }
        })
    }

    public onSetSrc1(param) {
        // this._isRead = true;
        // this.setVid = videoModels[param].vid;
        // if (this.isReadySet) {
        if (this.first) {
            this.onPlay(param);
        } else
            widPlayer.setNextVideoNode(videoModels[param].vid, {inerrupt: true});
        // 	return;
        // }
    }

    public onPlayVideo(param, tim: number = 0, isPlay: boolean = false) {
        if (!widPlayer)
            return;
        // this._isRead = isPlay;
        // if (isPlay) {
        // 	if (this.isReadySet) {
        // 		widPlayer.setNextVideoNode(videoModels[param].vid,{ inerrupt: true });
        // 		return;
        // 	}
        // 	this.setVid = videoModels[param].vid;
        // }

        VideoManager.getInstance().log('开始播放' + param);
        widPlayer.play(videoModels[param].vid);
        if (tim > 0) {
            var obj = this;
            Tool.callbackTime(function () {
                if (VideoManager.getInstance().videoCurrTime() < tim) {
                    widPlayer.seek(tim);
                    widPlayer.resume();
                }
            }, obj, 1000);

        }
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

    public getSpeed(): number {
        return this._speed;
    }

    public videoUpDataHandle() {
        if (this.videoData && this.videoData.videoUpDataHandle())
            this.videoData.videoUpDataHandle();
    }

    public videoEndHandle() {
        // VideoManager.getInstance().log('我画')
        if (this.videoData && this.videoData.videoEndHandle)
            this.videoData.videoEndHandle();
    }

    public onwaiting() {
        if (this.videoData && this.videoData.onWaitin) {
            this.videoData.onWaitin();
        }
    }

    //切换视频清晰度
    public onSwitchQuality() {
        if (!widPlayer)
            return;
        widPlayer.setLevel(GameDefine.VIDEO_PINZHI);
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

    public videoStop() {
        if (!widPlayer)
            return;
        widPlayer.stop();
    }

    public videoClose(): void {
        this.videoData.onCloseVideo();
    }

    public textHudong(wentId: number) {
        this.videoData.testHudong(wentId);
    }
}
