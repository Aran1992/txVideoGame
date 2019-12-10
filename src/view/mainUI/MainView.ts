const errorList = [];

if (platform.isDebug()) {
    const infoDiv = document.createElement("div");
    document.body.appendChild(infoDiv);
    infoDiv.outerHTML = `<div style="position: absolute; top: 0; left: 50%; z-index: 99999">
<button onclick="copyLog();">复制LOG</button>
</div>`;
}

function copyLog() {
    const str = JSON.stringify({
        errorList,
        curBookData: UserInfo.curBokData
    });
    const input = document.createElement("input");
    input.value = str;
    document.body.appendChild(input);
    input.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    input.className = "input";
    input.style.display = "none";
    GameCommon.getInstance().showCommomTips("复制成功，可以直接粘贴到聊天栏发送给开发人员");
}

function createFile(role) {
    const answerId = {};
    const wentiId = [];
    const videoDic = {};
    const videoNames = {};
    const chapterDatas = [];
    let curVideoID = "";
    let tree = [0].concat(GameDefine.ROLE_JUQING_TREE[role]);
    tree.forEach(chapter => {
        chapterDatas.push(chapter);
        const chapterConfig = JsonModelManager.instance.getModelchapter()[chapter];
        let wentiID = chapterConfig.wenti;
        chapterConfig.videoSrc.split(",").forEach((vid, i, list) => {
            videoDic[vid] = vid;
            curVideoID = vid;
            if (list.length - 1 === i) {
                videoNames[wentiID] = vid;
            }
        });
        do {
            const answersConfig = JsonModelManager.instance.getModelanswer()[wentiID];
            let maxLike = -1;
            let selectedAnswerIdx = "";
            for (let answerIdx in answersConfig) {
                const answerConfig = answersConfig[answerIdx];
                const like = answerConfig.like.split(",")[role];
                if (like > maxLike) {
                    maxLike = like;
                    selectedAnswerIdx = answerIdx;
                    answerId[wentiID] = answerConfig.ansid;
                    answerConfig.videos.split(",").forEach((vid, i, list) => {
                        videoDic[vid] = vid;
                        curVideoID = vid;
                        if (list.length - 1 === i) {
                            videoNames[answersConfig[selectedAnswerIdx].nextid] = vid;
                        }
                    });
                }
            }
            wentiId.push(wentiID);
            wentiID = answersConfig[selectedAnswerIdx].nextid;
        } while (wentiID);
    });
    const curchapter = chapterDatas[chapterDatas.length - 1];
    return {
        answerId,
        wentiId,
        videoDic,
        videoNames,
        chapterDatas,
        curchapter,
        curVideoID
    };
}

class MainView extends eui.Component {
    private gameWorld: GameWorld;
    private mainGroup: eui.Group;
    private btnSetting: eui.Button;
    private btnShouCang: eui.Button;
    private btnChengjiu: eui.Button;
    private btnShangCheng: eui.Button;
    private btnContinueGame: eui.Button;
    private desc: eui.Label;
    private bg: eui.Image;
    private bg_grp: eui.Group;
    private shopLab: eui.Group;
    private cjLab: eui.Group;
    private play_Btn: eui.Button;
    private play_zi: eui.Button;
    private btnDuQu: eui.Button;
    private xindong: eui.Button;
    private btnXinkaishi: eui.Button;
    private curDuDang: boolean = false;

    constructor(gameWorld: GameWorld) {
        super();
        this.gameWorld = gameWorld;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private static onShowShowCang() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "ShouCangListPanel");
    }

    //添加到舞台
    private onAddToStage(): void {
        this.skinName = skins.GameMainSkin;
    }

    private onLoadComplete(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATA_REFRESH, this.onGetDataRefresh, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.STARTCHAPTER, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_WIN, this.onGameWin, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_GO_MAINVIEW, this.onShowMain, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, this.onRefreshUpdate, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_VIDEO3, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIDEO3, this.onShowView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MAIN_IMG_REFRESH, this.onRefreshImg, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.HIDE_MAIN_GROUP, this.onHideMainGroup, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SHOUCANG_NEWPOINT, this.updateNewPoint, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.TASK_STATE_CHANGED, this.updateTicketButtonPoint, this);
        this.updateResize();
        this.btnContinueGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnContinue, this);
        this.play_Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventPlay, this);
        this.btnDuQu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDuDang, this);
        this.btnChengjiu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChengJiu, this);
        this.btnShouCang.addEventListener(egret.TouchEvent.TOUCH_TAP, MainView.onShowShowCang, this);
        this.xindong.addEventListener(egret.TouchEvent.TOUCH_TAP, MainView.onShowShowCang, this);
        this.btnXinkaishi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onXinkaishi, this);
        //
        this.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowbtnSetting, this);
        this.btnShangCheng.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowShop, this);
        // GameCommon.getInstance().getWenTi();
        // this.onGetDataRefresh();
        // LocalStorageManager.getInstance().onInit();
        ShopManager.getInstance().initShopInfos();
        GameCommon.getInstance().getBookHistory(FILE_TYPE.GOODS_FILE);
        GameCommon.getInstance().getUserInfo().then(data => {
            UserInfo.id = data.id;
            UserInfo.user = data.user;
            console.log("UserInfo.id", UserInfo.id);
            console.log("UserInfo.user", UserInfo.user);
        });
        VideoManager.getInstance().updateVideoData("");
        this.play_Btn.visible = true;
        this.play_zi.visible = true;
        this.setMainGroupVisible(false);
        UserInfo.guideDic[0] = 0;
        UserInfo.guideDic[1] = 1;
        UserInfo.guideDic[2] = 2;
        UserInfo.guideDic[3] = 3;
        UserInfo.guideDic[4] = 4;
        UserInfo.guideDic[5] = 5;
        UserInfo.guideDic[6] = 6;
        UserInfo.guideDic[7] = 7;
        UserInfo.guideDic[8] = 8;
        SoundManager.getInstance().initMusic([]);
        if (!UserInfo.curBokData) {
            GameCommon.getInstance().getBookHistory(FILE_TYPE.AUTO_FILE);
        } else if (UserInfo.guideDic[4] || UserInfo.guideDic[8] || UserInfo.achievementDics[17]) {
            GameDefine.ISFILE_STATE = false;
            this.onRefreshUpdate({data: 1});
        }
        this.updateNewPoint();
        this.updateTicketButtonPoint();
        this.logHelper();
        TipsBtn.Is_Guide_Bool = UserInfo.guideJson["player"] === undefined;
    }

    private updateNewPoint() {
        this.btnShouCang["idNewPoint"].x = this.btnShouCang["idTitle"].x + this.btnShouCang["idTitle"].width;
        this.btnShouCang["idNewPoint"].visible = ShopManager.getInstance().getNewPoint(0) > 0;
    }

    private updateTicketButtonPoint() {
        this.btnChengjiu["idNewPoint1"].x = this.btnChengjiu["idTitle1"].x + this.btnChengjiu["idTitle1"].width;
        this.btnChengjiu["idNewPoint1"].visible = TaskManager.instance.hasReceivableReward();
    }

    private onRefreshImg() {
        if (UserInfo.main_Img && UserInfo.main_Img.length) {
            this.bg.source = UserInfo.main_Img;
        } else {
            this.bg.source = "main_bj1_jpg";
        }
        const rate1 = GameDefine.GAME_VIEW_WIDTH / GameDefine.GAME_VIEW_HEIGHT;
        const rate2 = size.width / size.height;
        let scale;
        if (rate1 > rate2) {
            scale = size.width / GameDefine.GAME_VIEW_WIDTH;
        } else {
            scale = size.height / GameDefine.GAME_VIEW_HEIGHT;
        }
        this.bg.scaleX = scale;
        this.bg.scaleY = scale;
        if (UserInfo.curBokData) {
            this.desc.text += UserInfo.curBokData.main_Img + "---" + UserInfo.main_Img;
            UserInfo.curBokData.main_Img = UserInfo.main_Img;
        }
    }

    //序章小三角
    private onGetDataRefresh() {
        if (!UserInfo.curchapter) {
            this.gameWorld.createGameScene();
            SoundManager.getInstance().initMusic(SoundManager.musicList);
            this.setMainGroupVisible(false);
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        this.bg_grp.scaleX = Math.max(GameDefine.SCALENUMX, GameDefine.SCALENUMY);
        this.bg_grp.scaleY = Math.max(GameDefine.SCALENUMX, GameDefine.SCALENUMY);
    }

    private onDuDang() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (DEBUG) {
            if (typeof GameDefine.TEST_ACTION_SCENE_WENTI_ID === "number") {
                const actionIndex = 0;
                const wentiModel = JsonModelManager.instance.getModelwenti()[GameDefine.TEST_ACTION_SCENE_WENTI_ID.toString()];
                const hudongModel = JsonModelManager.instance.getModelhudong()[wentiModel.type];
                const paramList = hudongModel.pos.split(",");
                const actionSceneClass = ActionManager.getActionSceneClassByActionType(parseInt(hudongModel.tp));
                const actionScene = new actionSceneClass(wentiModel, paramList, actionIndex, true);
                this.addChild(actionScene);
                return;
            }
        }
        if (GameDefine.IS_DUDANG) {
            this.curDuDang = true;
        }
        GameDefine.IS_DUDANG = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
    }

    private onShowChengJiu() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        // GameCommon.getInstance().addAlert("zanweikaifang");
        this.cjLab.visible = false;
        //GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "ChengJiuPanel");
        //GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "TicketPanel");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            windowName: "TicketPanel",
            data: "mainview"
        });

    }

    private onXinkaishi(): void {
        // const bookData: BookData = <BookData>createFile(ROLE_INDEX.ZiHao_Xia);
        // UserInfo.curBokData = bookData;
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (DEBUG) {
            if (typeof GameDefine.START_CHAPTER === "number") {
                this.gameWorld.createGameScene(GameDefine.START_CHAPTER);
                return;
            }
        }
        GameCommon.getInstance().showConfirmTips("重新开始会清空自动存档，是否重新开始？", () => {
            this.gameWorld.createGameScene();
        });
    }

    private onShowShop() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        // GameCommon.getInstance().addAlert("zanweikaifang");
        this.shopLab.visible = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "ShopPanel");
    }

    private onShowbtnSetting() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        // GameCommon.getInstance().addAlert("zanweikaifang");
        //GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "PlayerSettingPanel");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "AboutPanel");
    }

    private onShowMain() {
        GameDefine.CUR_IS_MAINVIEW = true;
        this.setMainGroupVisible(true);
        this.btnChengjiu.touchEnabled = true;
        this.btnShouCang.touchEnabled = true;
        this.btnSetting.touchEnabled = true;
    }

    private onGameWin() {
        GameCommon.getInstance().getBookHistoryList();
        this.setMainGroupVisible(true);
    }

    // 腾讯视频版本不希望显示主界面
    private setMainGroupVisible(visible: boolean) {
        if (isTXSP) {
            this.mainGroup.visible = false;
        } else {
            this.mainGroup.visible = visible;
        }
    }

    private onEventPlay() {
        if (!UserInfo.curBokData) {
            UserInfo.allVideos = {};
            UserInfo.ansWerData = new AnswerData;
            UserInfo.curBokData = new BookData();
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            this.onGetDataRefresh();
        } else {
            if (isTXSP) {
                if (UserInfo.curchapter === 0) {
                    this.gameWorld.createGameScene();
                } else {
                    // 如果没有成功继续 那么就不隐藏按钮
                    if (!this.onBtnContinue()) {
                        return;
                    }
                }
            } else {
                if (this.curDuDang) {
                    this.curDuDang = false;
                    GameDefine.IS_DUDANG = true;
                }
                this.gameWorld.createGameScene();
            }
        }
        this.play_Btn.visible = false;
        this.play_zi.visible = false;
    }

    private onBtnContinue(): boolean {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (!GameCommon.getInstance().checkChapterLocked())
            return false;
        if (this.curDuDang) {
            this.curDuDang = false;
            GameDefine.IS_DUDANG = true;
        }
        GameDefine.ISFILE_STATE = true;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA));
        return true;
    }

    private onRefreshUpdate(data) {
        if (data.data != 1) {
            return;
        }
        if (GameDefine.IS_SWITCH_VIDEO) {
            return;
        }
        this.onRefreshImg();
        this.setMainGroupVisible(false);
        if (!GameDefine.ISFILE_STATE) {
            if (UserInfo.achievementDics[17] && !isTXSP) {
                this.setMainGroupVisible(true);
                this.play_Btn.visible = false;
                this.play_zi.visible = false;
                this.onShowMain();
            } else {
                this.setMainGroupVisible(false);
                this.play_Btn.visible = true;
                this.play_zi.visible = true;
            }
            return;
        }
        GameDefine.ISFILE_STATE = false;
    }

    private onClose() {
        this.setMainGroupVisible(false);
    }

    private onHideMainGroup() {
        this.play_Btn.visible = false;
        this.play_zi.visible = false;
        this.setMainGroupVisible(false);
    }

    private onShowView() {
        this.setMainGroupVisible(true);
    }

    private logHelper() {
        let player = new window["Txiplayer"]({
            container: "#videoDivMin",
            width: "100%",
            enableUI: true,
        });
        const methodList = [
            "play",
            "clear",
            "pause",
            "resume",
            "seek",
            "setNextVideoNode",
            "preloadVideoNode",
            "getDuration",
            "getPlayTime",
            "setPlaybackRate",
            "on",
            "showLevelPanel",
            "hideLevelPanel",
        ];
        const logArgsMethodList = [
            "play",
            "clear",
            "pause",
            "resume",
            "seek",
            "setNextVideoNode",
            "preloadVideoNode",
            "setPlaybackRate",
            "on",
            "showLevelPanel",
            "hideLevelPanel",
        ];
        const logResultMethodList = [];
        widPlayer = {};
        methodList.forEach(key => {
            widPlayer[key] = (...args) => {
                if (key === "on") {
                    const [event, handler] = args;
                    player[key].bind(player)(event, (...args) => {
                        console.log("video player event", event, ...args);
                        handler(...args);
                    });
                } else {
                    if (logArgsMethodList.indexOf(key) !== -1) {
                        console.trace(`widPlayer.${key} args`, ...args);
                    }
                    const result = player[key].bind(player)(...args);
                    if (logResultMethodList.indexOf(key) !== -1) {
                        console.trace(`widPlayer.${key} result`, result);
                    }
                    return result;
                }
            };
        });
        let ps = document.getElementsByTagName("video");
        for (let i: number = 0; i < ps.length; i++) {
            if (size.fillType == FILL_TYPE_COVER) {
                ps[i].style["object-fit"] = "cover";
            } else {
                ps[i].style["object-fit"] = "contain";
            }
        }
    }
}
