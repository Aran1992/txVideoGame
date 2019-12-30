class GameWorld extends egret.DisplayObjectContainer {
    public stage: egret.Stage;
    public PupoBar: egret.DisplayObjectContainer;//弹出面板层
    private PupoBar1: egret.DisplayObjectContainer;//弹出面板层
    private readonly panelDict;
    private videoLayer: egret.DisplayObjectContainer;//视频层
    private isAgaig: boolean = false;
    private videoData: VideoData;

    public constructor() {
        super();
        this.panelDict = {};
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.onRegistEvent();
    }

    public readFile() {
        if (!GameDefine.ISFILE_STATE) {
            return;
        }
        if (!UserInfo.curBokData) {
            return;
        }
        if (!this.videoData) {
            this.videoData = new VideoData();
            this.videoLayer.addChild(this.videoData);
            this.touchEnabled = false;
        } else {
            this.videoData.visible = true;
        }
        if (this.isAgaig) {
            this.videoLayer.addChild(this.videoData);
        }
        this.videoData.readFile();
    }

    /**舞台尺寸发生变化**/
    public onResize(): void {
    }

    public createGameScene(chapId: number = 0): void {
        if (!this.videoData) {
            this.videoData = new VideoData();
            this.videoLayer.addChild(this.videoData);
        } else {
            this.videoData.visible = true;
        }
        this.touchEnabled = false;
        this.onButtonClick(chapId);
    }

    private onRegistEvent(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, this.readFile, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SHOW_VIEW, this.onShowView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SHOW_VIEW_WITH_PARAM, this.onShowViewWithParam, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIEW, this.onCloseView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIDEODATA, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_WIN, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.STARTCHAPTER, this.onStartVideo, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_VIDEO3, this.onHidePop, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIDEO3, this.onShowPop, this);
    }

    private onClose(): void {
        if (!this.videoData)
            return;
        this.isAgaig = true;
        // this.videoData = null;
    }

    private onHidePop() {
        this.PupoBar.visible = false;
    }

    private onShowPop() {
        this.PupoBar.visible = true;
    }

    private onCloseView(data): void {
        let windowName = data.data;
        if (this.panelDict[windowName]) {
            if (windowName == 'ControlTipsPanel') {
                this.PupoBar1.removeChild(this.panelDict[windowName]);
                this.panelDict[windowName] = null;
                return;
            }
            this.PupoBar.removeChild(this.panelDict[windowName]);
            this.panelDict[windowName] = null;
            delete this.panelDict[windowName];
        }
        /**移除所有二级界面**/
        for (let key in this.panelDict) {
            let panel = this.panelDict[key];
            if (!panel) {
                delete this.panelDict[key];
                continue;
            }
            if (panel['priority'] && panel['priority'] == PANEL_HIERARCHY_TYPE.II) {
                this.PupoBar.removeChild(panel);
                panel = null;
                delete this.panelDict[key];
            }
        }
    }

    private onShowView(data): void {
        //SoundManager.getInstance().playSound("ope_click.mp3")
        let windowName = data.data;
        if (this.panelDict[windowName]) {
        } else {
            if (data.data.windowName) {
                windowName = data.data.windowName;
                let d;
                if (data.data.data) {
                    // @ts-ignore
                    d = new window[windowName](data.data.data);
                } else {
                    // @ts-ignore
                    d = new window[windowName]();
                }
                this.panelDict[windowName] = d;
                this.PupoBar.addChild(this.panelDict[windowName]);
            } else {
                // @ts-ignore
                this.panelDict[windowName] = new window[windowName](1);
                if (windowName == 'ControlTipsPanel') {
                    this.PupoBar1.addChild(this.panelDict[windowName]);
                } else {
                    this.PupoBar.addChild(this.panelDict[windowName]);
                }
            }
        }
    }

    private onShowViewWithParam(event: egret.Event): void {
        //SoundManager.getInstance().playSound("ope_click.mp3")
        let window_param: WindowParam = event.data as WindowParam;
        let windowName = window_param.windowname;
        if (this.panelDict[windowName]) {
        } else {
            this.panelDict[windowName] = new window[windowName](window_param.data);
            this.PupoBar.addChild(this.panelDict[windowName]);
        }
    }

    private onAddToStage(): void {
        this.onRegist();

        let view = new MainView(this);
        GameCommon.getInstance().report('login', {num: 1});
        this.addChild(view);
        this.videoLayer = new egret.DisplayObjectContainer();
        this.addChild(this.videoLayer);
        this.PupoBar = new egret.DisplayObjectContainer();
        this.addChild(this.PupoBar);
        this.PupoBar1 = new egret.DisplayObjectContainer();
        this.addChild(this.PupoBar1);
        CaptionView.getInstance().touchEnabled = false;
        this.addChild(CaptionView.getInstance());
        this.addChild(PromptPanel.getInstance());
        PromptPanel.getInstance().touchEnabled = false;
        // PromptPanel.getInstance().touchChildren = false;
        if (!this.videoData) {
            this.videoData = new VideoData();
            this.videoLayer.addChild(this.videoData);
            this.videoData.visible = false;
        }
        videoModels = JsonModelManager.instance.getModelshipin();
        wentiModels = JsonModelManager.instance.getModelwenti();
        answerModels = JsonModelManager.instance.getModelanswer();
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH));
    }

    private onButtonClick(chapId: number) {
        const curChapterCfg = JsonModelManager.instance.getModelchapter()[chapId];
        GameCommon.getInstance().onCleanFile(JsonModelManager.instance.getModeljuqingkuai()[1][1]);
        UserInfo.curBokData.curchapter = chapId;
        UserInfo.curchapter = chapId;
        let videoIds = curChapterCfg.videoSrc.split(",");
        VideoManager.getInstance().updateVideoData(videoIds[0]);
        this.videoData.setVideos(videoIds);
        this.videoData.starVideo(curChapterCfg.wenti);
    }

    private onStartVideo(data) {
        if (!data.data)
            return;
        GameDefine.CUR_IS_MAINVIEW = false;
        GameDefine.IS_DUDANG = true;
        if (!this.videoData) {
            this.videoData = new VideoData();
            this.videoLayer.addChild(this.videoData);
        } else {
            this.videoData.visible = true;
        }
        let cfg: Modeljuqingkuai = data.data.cfg;
        VideoManager.getInstance().log(JSON.stringify(UserInfo.curBokData.wentiId));

        let src = cfg.videoId;
        let wentiId = data.data.cfg.wentiId;
        if (VideoManager.getInstance().loadSrc == cfg.videoId && GameDefine.CUR_PLAYER_VIDEO == 1) {
            GameCommon.getInstance().showLoading();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CONTINUE));
            VideoManager.getInstance().loadSrc = '';
            return;
        }
        if (cfg.BE != 1) {
            let videoIds = [];
            let _isfind: boolean;
            for (let chapterId in JsonModelManager.instance.getModelchapter()) {
                let chapterCfg: Modelchapter = JsonModelManager.instance.getModelchapter()[chapterId];
                let _vids: string[] = chapterCfg.videoSrc.split(",");

                for (let i: number = 0; i < _vids.length; i++) {
                    if (_vids[i] == src) {
                        if (!wentiId) {
                            wentiId = chapterCfg.wenti;
                        }
                        _isfind = true;
                    }
                    if (_isfind) {
                        videoIds.push(_vids[i]);
                    }
                }

                if (_isfind) break;
            }
            if (!_isfind) {
                let models = JsonModelManager.instance.getModelanswer();
                for (let ansKey in models) {
                    for (let ansIdx in models[ansKey]) {
                        let anscfg: Modelanswer = models[ansKey][ansIdx];
                        let _vids: string[] = anscfg.videos.split(",");
                        for (let i: number = 0; i < _vids.length; i++) {
                            if (_vids[i] == src) {
                                _isfind = true;
                                if (!wentiId) {
                                    wentiId = anscfg.qid;
                                }
                            }
                            if (_isfind) {
                                videoIds.push(_vids[i]);
                            }
                        }
                        if (_isfind) break;
                    }

                    if (_isfind) break;
                }
            }
            this.videoData.setVideos(videoIds);

            if (data.data.idx == FILE_TYPE.AUTO_FILE) {
            } else {
                let fileData = UserInfo.fileDatas[data.data.idx];
                if (fileData) {
                    UserInfo.curBokData = copyBookData(fileData);
                }
            }
            let wentiCfg: Modelwenti = wentiModels[wentiId];
            VideoManager.getInstance().updateGameChapter(wentiCfg.chapter);
        } else {
            let wentiCfg: Modelwenti = wentiModels[wentiId];
            VideoManager.getInstance().updateGameChapter(wentiCfg.chapter);
            wentiId = 0;
        }

        VideoManager.getInstance().setVideoState();
        GameCommon.getInstance().onCleanFile(data.data.cfg);
        if (VideoManager.getInstance().videoCurrTime() != 0) {
            VideoManager.getInstance().clear();
        }
        VideoManager.getInstance().updateVideoData(src);
        setTimeout(() => {
            if (this.isAgaig) {
                this.isAgaig = false;
                this.videoData.againGame(wentiId);
            } else {
                this.videoData.starVideo(wentiId);
            }
        }, 100);
    }

    /**事件注册**/
    private onRegist(): void {
        window.onerror = (...args) => {
            errorList.push({type: "window unhandled error", args});
            GameCommon.getInstance().showErrorLog(JSON.stringify(args));
            GameCommon.getInstance().showErrorLog('出现未处理错误，请点击上方复制log按钮，将复制到的log发给开发');
        };
        window['onEventNotify'] = function (event, json) {
            console.log(json);
            let data = json;
            switch (event) {
                case WEB_EVENT_NOTIFY.onPause:
                    VideoManager.getInstance().videoPause();
                    break;
                case WEB_EVENT_NOTIFY.onResume:
                    break;
                case WEB_EVENT_NOTIFY.wechat_Share:
                case WEB_EVENT_NOTIFY.qq_Share:
                    if (data.code == 1) {
                        GameCommon.getInstance().showCommomTips('分享成功！');
                        if (shareImageInfo !== undefined) {
                            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHARE_COLLECTION_IMAGE), shareImageInfo);
                        } else {
                            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHARE_ACTIVATION_CODE));
                        }
                    } else {
                        GameCommon.getInstance().showCommomTips('分享失败！errorcode::' + data.code);
                    }
                    break;
            }
            if (shareImageInfo !== undefined) {
                shareImageInfo = undefined;
                GameCommon.getInstance().removeLoading();
            }
        };
    }
}

class WindowParam {
    public windowname: string;
    public data;

    public constructor(windowname: string, data?: any) {
        this.windowname = windowname;
        this.data = data;
    }
}

//层级类型
enum PANEL_HIERARCHY_TYPE {
    I = 0,
    II = 1,
}

//web事件类型
enum WEB_EVENT_NOTIFY {
    onCreate = 1,
    onStart = 2,
    onResume = 3,
    onPause = 4,
    onStop = 5,
    onDestory = 6,
    onSaveFile = 7,
    wechat_Share = 1000,
    qq_Share = 1001,
}
