const playerCallList = [];
const errorList = [];

const infoDiv = document.createElement("div");
document.body.appendChild(infoDiv);
infoDiv.outerHTML = `<div style="position: absolute; top: 0; left: 50%; z-index: 99999">
<button onclick="copyLog();">复制LOG</button>
</div>`;

function copyLog() {
    const str = JSON.stringify({
        errorList,
        playerCallList,
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

class MainView extends eui.Component {
    private gameWorld: GameWorld;
    private labname: eui.Label;
    private sex: eui.Label;
    private user: eui.Label;
    private mainGroup: eui.Group;
    private btnclean: eui.Button;
    private btnSetting: eui.Button;
    private btnZhangjie: eui.Button;
    private btnShouCang: eui.Button;
    private btnChengjiu: eui.Button;
    private btnHuodong: eui.Button;
    private btnShangCheng: eui.Button;
    private btnContinueGame: eui.Button;
    private btnDisableCheck: eui.Button;
    private btnEnableCheck: eui.Button;
    private myTitle: eui.Button;
    private chapterName: eui.Label;
    private cleanLab: eui.Label;
    private desc: eui.Label;
    private wallet: eui.Label;
    private closeWeb: eui.Label;
    private icon: eui.Image;
    private bg: eui.Image;
    private bg_grp: eui.Group;
    private rightGruop: eui.Group;
    private rightDownGroup: eui.Group;
    private zjLab: eui.Group;
    private scLab: eui.Group;
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

    private static disableCheck() {
        GameDefine.ENABLE_CHECK_CHAPTER_LOCK = false;
    }

    private static enableCheck() {
        GameDefine.ENABLE_CHECK_CHAPTER_LOCK = true;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.skinName = skins.GameMainSkin;
    }

    private onLoadComplete(): void {
        widPlayer = null;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATA_REFRESH, this.onGetDataRefresh, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.STARTCHAPTER, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_WIN, this.onGameWin, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_GO_MAINVIEW, this.onShowMian, this);
        //GameDispatcher.getInstance().addEventListener(GameEvent.GAME_USER_REFRESH, this.onRefreshUser, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, this.onRefreshUpdata, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_VIDEO3, this.onClose, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CLOSE_VIDEO3, this.onShowView, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.MAIN_IMG_REFRESH, this.onRefreshImg, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.HIDE_MAIN_GROUP, this.onHideMainGroup, this);
        this.updateResize();
        this.btnContinueGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnContinue, this);
        this.play_Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventPlay, this);
        this.btnDuQu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDuDang, this);
        this.btnChengjiu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChengJiu, this);
        this.btnShouCang.addEventListener(egret.TouchEvent.TOUCH_TAP, MainView.onShowShowCang, this);
        this.xindong.addEventListener(egret.TouchEvent.TOUCH_TAP, MainView.onShowShowCang, this);
        this.btnHuodong.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowActivity, this);
        this.cleanLab.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCleanCache, this);
        this.wallet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowWallet, this);
        this.btnXinkaishi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onXinkaishi, this);
        //
        this.closeWeb.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseWebView, this);
        this.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowbtnSetting, this);
        this.btnShangCheng.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowShop, this);
        this.btnDisableCheck.addEventListener(egret.TouchEvent.TOUCH_TAP, MainView.disableCheck, this);
        this.btnEnableCheck.addEventListener(egret.TouchEvent.TOUCH_TAP, MainView.enableCheck, this);
        // GameCommon.getInstance().getWenTi();
        // this.onGetDataRefresh();
        // LocalStorageManager.getInstance().onInit();
        ShopManager.getInstance().initShopInfos();
        GameCommon.getInstance().getBookHistory(FILE_TYPE.GOODS_FILE);
        GameCommon.getInstance().getUserInfo();
        let cpCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        this.chapterName.text = cpCfg.name;
        VideoManager.getInstance().updateVideoData("");
        this.play_Btn.visible = true;
        this.play_zi.visible = true;
        this.mainGroup.visible = false;
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
            this.onRefreshUpdata({data: 1});
        }
        let player = new window["Txiplayer"]({
            container: "#videoDivMin",
            width: "100%",
        });
        playerCallList.push({
            key: "constructor",
            args: [{
                container: "#videoDivMin",
                width: "100%",
            }],
            time: new Date().getTime()
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
                    playerCallList.push({
                        key,
                        args,
                        time: new Date().getTime()
                    });
                } else {
                    if (logArgsMethodList.indexOf(key) !== -1) {
                        console.trace(`widPlayer.${key} args`, ...args);
                        playerCallList.push({
                            key,
                            args,
                            time: new Date().getTime()
                        });
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

    // private loadpanel:LoadingPanel;
    private onRefreshImg() {
        if (UserInfo.main_Img && UserInfo.main_Img.length) {
            this.bg.source = UserInfo.main_Img;
            let scaleX = size.width / 1600;
            let scaleY = size.height / 900;
            let scale = scaleX > scaleY ? scaleX : scaleY;
            this.bg.scaleX = scale;
            this.bg.scaleY = scale;
        } else {
            this.bg.source = "main_bj1_jpg";
        }
        // this.desc.text = "UserInfo.main_Img" + UserInfo.main_Img;
        if (UserInfo.curBokData) {
            this.desc.text += UserInfo.curBokData.main_Img + "---" + UserInfo.main_Img;
            UserInfo.curBokData.main_Img = UserInfo.main_Img;
        }
    }

    //序章小三角
    private onGetDataRefresh(data) {
        // if(data||data==0)
        // {
        //     // VideoManager.getInstance().log("我日"+UserInfo.curBokData.wentiId.length+"~~~"+UserInfo.curBokData.wentiId[UserInfo.curBokData.wentiId.length - 1]);
        //     if(data.data=="cuowu")
        //     {
        if (!UserInfo.curchapter) {
            this.gameWorld.createGameScene();
            SoundManager.getInstance().initMusic(SoundManager.musicList);
            this.mainGroup.visible = false;
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        // this.x = (size.width - this.width) / 2;
        // this.y = (size.height - this.height) / 2;
        this.bg_grp.scaleX = Math.max(GameDefine.SCALENUMX, GameDefine.SCALENUMY);
        this.bg_grp.scaleY = Math.max(GameDefine.SCALENUMX, GameDefine.SCALENUMY);
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
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
        this.checkGuide8();
        if (GameDefine.IS_DUDANG) {
            this.curDuDang = true;
        }
        GameDefine.IS_DUDANG = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
    }

    private onShowWallet() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.checkGuide8();
        GameCommon.getInstance().openButton("story://wallet");
    }

    private onCloseWebView() {
        this.checkGuide8();
        GameCommon.getInstance().onCloseWebView();
    }

    private onCleanCache() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        for (var i: number = 1; i < FILE_TYPE.SIZE; i++) {
            GameCommon.getInstance().deleteBookHistory(i);
        }
        ShopManager.getInstance().takeOffAllBookValue();
        GameCommon.getInstance().addLikeTips("清档成功");
        this.checkGuide8();
    }

    private onShowActivity() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.checkGuide8();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "ActivityPanel");
    }

    private onShowChengJiu() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        // GameCommon.getInstance().addAlert("zanweikaifang");
        this.cjLab.visible = false;
        this.checkGuide8();
        //GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "ChengJiuPanel");
        //GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "TicketPanel");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            windowName: "TicketPanel",
            data: "mainview"
        });

    }

    private onXinkaishi(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (DEBUG) {
            if (typeof GameDefine.START_CHAPTER === "number") {
                this.gameWorld.createGameScene(GameDefine.START_CHAPTER);
                return;
            }
        }
        this.gameWorld.createGameScene();
    }

    private onShowShop() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.checkGuide8();
        // GameCommon.getInstance().addAlert("zanweikaifang");
        this.shopLab.visible = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "ShopPanel");
    }

    private onShowbtnSetting() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.checkGuide8();
        // GameCommon.getInstance().addAlert("zanweikaifang");
        //GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "PlayerSettingPanel");
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "AboutPanel");
    }

    private onShowMian() {
        GameDefine.CUR_IS_MAINVIEW = true;
        this.mainGroup.visible = true;
        this.btnChengjiu.touchEnabled = true;
        this.btnShouCang.touchEnabled = true;
        this.btnSetting.touchEnabled = true;
        // this.desc.text = JSON.stringify(UserInfo.guideDic);
        // if (!UserInfo.guideDic[5])//先检测成就引导是否OK
        // {
        //     this.cjLab.visible = true;
        //     this.rightGruop.touchEnabled = false;
        //     this.rightDownGroup.touchEnabled = false;
        //     this.btnZhangjie.touchEnabled = false;
        //     this.btnShangCheng.touchEnabled = false;
        //     this.btnShouCang.touchEnabled = false;
        //     this.btnSetting.touchEnabled = false;
        //     this.play_Btn.touchEnabled = false;
        //     GuideManager.getInstance().onShowImg(this["leftBtnGroup"], this.btnChengjiu, "chengjiuBtn");
        // }
        // else if (!UserInfo.guideDic[6])//检测商城消费
        // {
        //     this.play_Btn.touchEnabled = false;
        //     this.shopLab.visible = true;
        //     this.rightGruop.touchEnabled = false;
        //     this.rightDownGroup.touchEnabled = false;
        //     this.btnZhangjie.touchEnabled = false;
        //     this.btnChengjiu.touchEnabled = false;
        //     this.btnShouCang.touchEnabled = false;
        //     this.btnSetting.touchEnabled = false;
        //     this.btnShangCheng.touchEnabled = true;
        //     GuideManager.getInstance().onShowImg(this["leftBtnGroup"], this.btnShangCheng, "shangchengBtn");
        // }
        // else if (!UserInfo.guideDic[7]) {
        //     this.rightGruop.touchEnabled = false;
        //     this.rightDownGroup.touchEnabled = false;
        //     this.btnZhangjie.touchEnabled = false;
        //     this.btnChengjiu.touchEnabled = false;
        //     this.btnShouCang.touchEnabled = true;
        //     this.btnSetting.touchEnabled = false;
        //     this.btnShangCheng.touchEnabled = false;
        //     this.play_Btn.touchEnabled = false;
        //     this.scLab.visible = true;
        //     GuideManager.getInstance().onShowImg(this["leftBtnGroup"], this.btnShouCang, "shoucangBtn");
        // } else if (!UserInfo.guideDic[8]) {
        //     this.zjLab.visible = true;
        //     this.rightGruop.touchEnabled = true;
        //     this.rightDownGroup.touchEnabled = true;
        //     this.btnZhangjie.touchEnabled = true;
        //     this.btnChengjiu.touchEnabled = true;
        //     this.btnShouCang.touchEnabled = true;
        //     this.btnSetting.touchEnabled = true;
        //     this.btnShangCheng.touchEnabled = true;
        //     this.play_Btn.touchEnabled = true;
        //     // GuideManager.getInstance().onShowImg(this["leftBtnGroup"], this.btnZhangjie, "zhangjieBtn");
        // }
        // else {
        //     this.rightGruop.touchEnabled = true;
        //     this.rightDownGroup.touchEnabled = true;
        //     this.btnZhangjie.touchEnabled = true;
        //     this.btnChengjiu.touchEnabled = true;
        //     this.btnShouCang.touchEnabled = true;
        //     this.btnSetting.touchEnabled = true;
        //     this.btnShangCheng.touchEnabled = true;
        //     this.play_Btn.touchEnabled = true;
        // }
    }

    private onGameWin() {
        GameCommon.getInstance().getBookHistoryList();
        this.mainGroup.visible = true;
        let cpCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        this.chapterName.text = cpCfg.name;
    }

    private onEventPlay() {
        //SoundManager.getInstance().playSound("ope_click.mp3")
        this.play_Btn.visible = false;
        this.play_zi.visible = false;

        if (!UserInfo.curBokData) {
            UserInfo.allVideos = {};
            UserInfo.ansWerData = new AnswerData;
            UserInfo.curBokData = new BookData();
            GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
            this.onGetDataRefresh(null);
        } else {
            if (this.curDuDang) {
                this.curDuDang = false;
                GameDefine.IS_DUDANG = true;
            }
            this.gameWorld.createGameScene();
        }

        this.checkGuide8();
    }

    private onBtnContinue() {
        //let videoIdx = VideoManager.getInstance().getVideoID()
        // if(!videoIdx){
        //     GameCommon.getInstance().showCommomTips("当前有错误（BUG）,请从存档中进入")
        //     console.error("存档错误")
        //     return;
        // }
        //SoundManager.getInstance().playSound("ope_click.mp3")
        if (!GameCommon.getInstance().checkChapterLocked())
            return;
        if (this.curDuDang) {
            this.curDuDang = false;
            GameDefine.IS_DUDANG = true;
        }
        GameDefine.ISFILE_STATE = true;
        // GameDefine.IS_SWITCH_VIDEO = true;
        // GameCommon.getInstance().getBookHistory(FILE_TYPE.AUTO_FILE);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA));
        // this.mainGroup.visible = false;
        this.checkGuide8();
    }

    private checkGuide8() {
        // if(UserInfo.guideDic[7]&&!UserInfo.guideDic[8])
        // {
        //     UserInfo.guideDic[8] = 8;
        //     this.zjLab.visible = false;
        //     GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        // }
    }

    private onRefreshUpdata(data) {
        if (data.data != 1) {
            return;
        }
        if (GameDefine.IS_SWITCH_VIDEO) {
            return;
        }
        this.onRefreshImg();
        this.mainGroup.visible = false;
        if (!GameDefine.ISFILE_STATE) {
            if (UserInfo.achievementDics[17]) {
                this.mainGroup.visible = true;
                this.play_Btn.visible = false;
                this.play_zi.visible = false;
                // VideoManager.getInstance().log("17"+"已完成");
                this.onShowMian();
            } else {
                TipsBtn.Is_Guide_Bool = true;
                this.mainGroup.visible = false;
                this.play_Btn.visible = true;
                this.play_zi.visible = true;
            }
            return;
        }
        // window["video1"].style.display = "block";
        // window["video2"].style.display = "block";
        // window["video3"].style.display = "block";
        GameDefine.ISFILE_STATE = false;
    }

    private onClose() {
        this.mainGroup.visible = false;
    }

    private onHideMainGroup() {
        this.mainGroup.visible = false;
    }

    private onShowView() {
        this.mainGroup.visible = true;
    }
}

function main(json) {
    json.forEach(json => {
        ["common", "luxury"].forEach(type => {
            json[type].forEach(json => {
                if (json && typeof json.check === "string" && json.check.indexOf("累计在线观看时长超过") !== -1) {
                    json.check = {
                        type: "duration",
                        num: parseInt(json.check.replace("累计在线观看时长超过", "").replace("min", ""))
                    };
                }
            });
        });
    });
    return JSON.stringify(json);
}

main([
    {
        "chapter": "序章",
        "common": [
            {
                "name": "拳击女皇",
                "dsc": "完成第一次互动",
                "check": {
                    "type": "question",
                    "qid": 1
                },
                "reward": {
                    "type": "suipian",
                    "num": 100
                }
            },
            {
                "name": "初动心弦",
                "dsc": "完成序章全部互动",
                "check": {
                    "type": "question",
                    "cid": 0
                },
                "reward": {
                    "type": "suipian",
                    "num": 100
                }
            },
            {
                "name": "开始四重奏",
                "dsc": "完成序章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 0
                },
                "reward": {
                    "type": "suipian",
                    "num": 200
                }
            }
        ],
        "luxury": [
            null,
            {
                "name": "-",
                "dsc": "一错再错",
                "check": {
                    "type": "question",
                    "qid": 5,
                    "aid": 3
                },
                "reward": {
                    "type": "suipian",
                    "num": 300
                }
            },
            {
                "name": "开始四重奏",
                "dsc": "完成序章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 0
                },
                "reward": {
                    "type": "quantao"
                }
            }
        ]
    },
    {
        "chapter": "第一章",
        "common": [
            {
                "name": "和弦初起",
                "dsc": "第一次与夏子豪达成好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "9": 1,
                        "10": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 200
                }
            },
            {
                "name": "追剧新人",
                "dsc": "累计在线观看时长超过25min",
                "check": "累计在线观看时长超过25min",
                "reward": {
                    "type": "suipian",
                    "num": 200
                }
            },
            {
                "name": "完成第一章",
                "dsc": "完成第一章剧情",
                "check": "完成第一章剧情",
                "reward": "拳套*1"
            }
        ],
        "luxury": [
            {
                "name": "合奏前音",
                "dsc": "第一次与肖万寻达成好感度满分",
                "check": "Q1-4选择用钢琴，Q1-5成功，Q1-6帮他",
                "reward": {
                    "type": "suipian",
                    "num": 300
                }
            },
            {
                "name": "追剧新人",
                "dsc": "累计在线观看时长超过25min",
                "check": "累计在线观看时长超过25min",
                "reward": "拳套*1"
            },
            {
                "name": "完成第一章",
                "dsc": "完成第一章剧情",
                "check": "完成第一章剧情",
                "reward": "拳套*1"
            }
        ]
    },
    {
        "chapter": "第二章、第三章",
        "common": [
            {
                "name": "中招？！",
                "dsc": "第二章达成死亡结局",
                "check": "达成BE3",
                "reward": {
                    "type": "suipian",
                    "num": 200
                }
            },
            null,
            {
                "name": "追剧老手",
                "dsc": "累计在线观看时长超过35min",
                "check": "累计在线观看时长超过35min",
                "reward": {
                    "type": "suipian",
                    "num": 300
                }
            },
            {
                "name": "完成二三章",
                "dsc": "完成第二、三章剧情",
                "check": "完成第二、三章剧情",
                "reward": "拳套*1"
            }
        ],
        "luxury": [
            {
                "name": "低音浅拨",
                "dsc": "第一次与肖千也达成好感度满分",
                "check": "Q2-4进去帮忙，Q2-5互动成功",
                "reward": {
                    "type": "suipian",
                    "num": 300
                }
            },
            {
                "name": "初啼之声",
                "dsc": "第一次与韩小白达成好感度满分",
                "check": "Q2-1选择B替他出头、Q2-2选A上台演出",
                "reward": {
                    "type": "suipian",
                    "num": 300
                }
            },
            {
                "name": "追剧老手",
                "dsc": "累计在线观看时长超过35min",
                "check": "累计在线观看时长超过35min",
                "reward": "拳套*2"
            },
            {
                "name": "完成二三章",
                "dsc": "完成第二、三章剧情",
                "check": "完成第二、三章剧情",
                "reward": "少女情怀·林薄荷"
            }
        ]
    },
    {
        "chapter": "第四章、第五章",
        "common": [
            {
                "name": "乐动心弦",
                "dsc": "成功完成所有音乐游戏",
                "check": "所有音乐游戏成功",
                "reward": {
                    "type": "suipian",
                    "num": 300
                }
            },
            {
                "name": "完成四五章",
                "dsc": "完成第四章、第五章剧情",
                "check": "完成第四章、第五章剧情",
                "reward": "拳套*2"
            }
        ],
        "luxury": [
            {
                "name": "加油你最棒",
                "dsc": "为乐队成长做出三次正确选择",
                "check": "Q2-6选B说的有道理，Q3-1选A去演出，Q4-2选A劝架",
                "reward": {
                    "type": "suipian",
                    "num": 500
                }
            },
            {
                "name": "完成四五章",
                "dsc": "完成第四章、第五章剧情",
                "check": "完成第四章、第五章剧情",
                "reward": "拳套*3"
            }
        ]
    },
    {
        "chapter": "第六章",
        "common": [
            {
                "name": "和弦对拍",
                "dsc": "成功触发与夏子豪的关键事件",
                "check": "Q6-2进入夏子豪",
                "reward": {
                    "type": "suipian",
                    "num": 500
                }
            },
            {
                "name": "升温：夏子豪",
                "dsc": "达成两次与夏子豪独处好感度满分",
                "check": "Q5-1选B夏子豪、Q5-3-B选B不放水、Q6-2选B夏子豪、Q6-4-B成功",
                "reward": {
                    "type": "suipian",
                    "num": 500
                }
            },
            null,
            null,
            null,
            null,
            {
                "name": "完成第六章",
                "dsc": "完成第六章剧情",
                "check": "完成第六章剧情",
                "reward": "拳套*3"
            }
        ],
        "luxury": [
            {
                "name": "轻甜蜜意",
                "dsc": "成功触发与韩小白的关键事件",
                "check": "Q6-2进入韩小白",
                "reward": {
                    "type": "suipian",
                    "num": 800
                }
            },
            {
                "name": "合音合律",
                "dsc": "成功触发与肖万寻的关键事件",
                "check": "Q6-2进入肖万寻",
                "reward": {
                    "type": "suipian",
                    "num": 800
                }
            },
            {
                "name": "起弦转合",
                "dsc": "成功触发与肖千也的关键事件",
                "check": "Q6-2进入肖千也",
                "reward": {
                    "type": "suipian",
                    "num": 800
                }
            },
            {
                "name": "升温：肖万寻",
                "dsc": "达成两次与肖万寻独处好感度满分",
                "check": "Q5-1选C肖万寻、Q5-2-C选B进、Q6-1选B不回应、Q6-2选C找肖万寻",
                "reward": "耳返*1"
            },
            {
                "name": "升温：韩小白",
                "dsc": "达成两次与韩小白独处好感度满分",
                "check": "Q5-1选D韩小白、Q5-3-D成功、Q6-2选D韩小白、Q6-3-D选A找到了、Q6-4-D成功",
                "reward": "耳返*1"
            },
            {
                "name": "升温：肖千也",
                "dsc": "达成两次与肖千也独处好感度满分",
                "check": "Q5-1选A肖千也、Q5-2-A选A坐、Q5-3-A成功、Q6-1选A回应、Q6-2选A找肖千也、Q6-3-A选A找到肖千也",
                "reward": "耳返*1"
            },
            {
                "name": "完成第六章",
                "dsc": "完成第六章剧情",
                "check": "完成第六章剧情",
                "reward": "梦想的模样·林薄荷&夏子豪 SR"
            }
        ]
    },
    {
        "chapter": "第七章、第八章",
        "common": [
            {
                "name": "平行不相交",
                "dsc": "达成默认结局",
                "check": "Q7-1选B，Q7-6选 E、Q7-7选 B",
                "reward": {
                    "type": "suipian",
                    "num": 800
                }
            },
            {
                "name": "阳光的味道",
                "dsc": "达成五次与夏子豪的关键剧情",
                "check": "Q2-7选A，Q4-4选D区域，Q5-1选B，Q6-2选择B夏子豪，Q8-2选夏子豪",
                "reward": {
                    "type": "suipian",
                    "num": 800
                }
            },
            {
                "name": "响起四重奏！",
                "dsc": "成功带领乐队完成三次舞台演出",
                "check": "Q0-5选择B上就上、Q3-1选择演A出",
                "reward": {
                    "type": "suipian",
                    "num": 500
                }
            },
            null,
            {
                "name": "完成七八章",
                "dsc": "完成第七、八章剧情",
                "check": "完成第七、八章剧情",
                "reward": "耳返*1"
            }
        ],
        "luxury": [
            {
                "name": "大橘已定",
                "dsc": "完成所有与江雪的关键剧情",
                "check": "Q5-1选择E江雪，Q7-6选择E白俄罗斯人",
                "reward": {
                    "type": "suipian",
                    "num": 800
                }
            },
            {
                "name": "皮革的味道",
                "dsc": "达成五次与肖千也的关键剧情",
                "check": "Q2-7选C，Q4-4选A区域，Q5-1选A，Q6-2选择A肖千也，Q8-2选肖千也",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                }
            },
            {
                "name": "冷风的味道",
                "dsc": "达成五次与肖万寻的关键剧情",
                "check": "Q2-7选D，Q4-4选B区域，Q5-1选C，Q6-2选择C肖万寻，Q8-2选肖万寻",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                }
            },
            {
                "name": "甜甜的味道",
                "dsc": "达成五次与韩小白的关键剧情",
                "check": "Q2-7选B，Q4-4选C区域Q5-1选D，Q6-2选择D韩小白，Q8-2选韩小白",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                }
            },
            {
                "name": "完成七八章",
                "dsc": "完成第七、八章剧情",
                "check": "完成第七、八章剧情",
                "reward": "耳返*3"
            }
        ]
    },
    {
        "chapter": "第九章",
        "common": [
            {
                "name": "专属骑士",
                "dsc": "夏子豪全部好感度达成",
                "check": "夏子豪全部好感度达成",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                }
            },
            {
                "name": "梦想照进现实",
                "dsc": "为乐队成长做出全部正确选择",
                "check": "Q0-5选有什么不敢，Q1-1选接，Q2-6选他们说的有道理，Q3-1选去，Q7-2选好言相劝，Q7-7选择进去，Q7-8选择不问，Q9-3选择准备好了",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                }
            },
            null,
            null,
            {
                "name": "追剧达人",
                "dsc": "累计在线观看时长超过60min",
                "check": "累计在线观看时长超过60min",
                "reward": "耳返*2"
            },
            {
                "name": "完成第九章",
                "dsc": "完成第九章剧情",
                "check": "完成第九章剧情",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                }
            }
        ],
        "luxury": [
            {
                "name": "专属王子",
                "dsc": "肖万寻全部好感度达成",
                "check": "肖万寻全部好感度达成",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                }
            },
            {
                "name": "专属游侠",
                "dsc": "肖千也全部好感度达成",
                "check": "肖千也全部好感度达成",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                }
            },
            {
                "name": "专属忍者",
                "dsc": "韩小白全部好感度达成",
                "check": "韩小白全部好感度达成",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                }
            },
            {
                "name": "隐藏的祝福",
                "dsc": "成功触发江雪结局",
                "check": "达成江雪 GOOD END",
                "reward": "愿星伴你·江雪 "
            },
            {
                "name": "追剧达人",
                "dsc": "累计在线观看时长超过60min",
                "check": "累计在线观看时长超过60min",
                "reward": "耳返*3"
            },
            {
                "name": "完成第九章",
                "dsc": "完成第九章剧情",
                "check": "完成第九章剧情",
                "reward": {
                    "type": "suipian",
                    "num": 5000
                }
            }
        ]
    },
    {
        "chapter": "第十、十一章",
        "common": [
            {
                "name": "夏子豪",
                "dsc": "进入夏子豪结局",
                "check": "第十章判定进入夏子豪",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                }
            },
            null,
            {
                "name": "结局？",
                "dsc": "完成第十、十一章剧情",
                "check": "完成第十、十一章剧情",
                "reward": "耳返*2"
            }
        ],
        "luxury": [
            {
                "name": "肖家兄弟",
                "dsc": "进入肖家兄弟",
                "check": "第十章判定进入肖家兄弟",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                }
            },
            {
                "name": "韩小白",
                "dsc": "进入韩小白结局",
                "check": "第十章判定进入夏子豪",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                }
            },
            {
                "name": "结局？",
                "dsc": "完成第十、十一章剧情",
                "check": "完成第十、十一章剧情",
                "reward": "乐谱*1\n耳返*1"
            }
        ]
    },
    {
        "chapter": "第十二章",
        "common": [
            {
                "name": "竹马青梅",
                "dsc": "达成夏子豪 TRUE END",
                "check": "达成夏子豪 TRUE END",
                "reward": "美梦酩酊·夏子豪"
            },
            {
                "name": "心动碎片",
                "dsc": "成功触发夏子豪彩蛋剧情",
                "check": "触发夏子豪彩蛋",
                "reward": "耳返*2"
            },
            {
                "name": "梦想终点",
                "dsc": "达成全部默认结局",
                "check": "续命选项全达成",
                "reward": {
                    "type": "suipian",
                    "num": 5000
                }
            },
            null,
            null,
            {
                "name": "大结局",
                "dsc": "完成第十二章剧情",
                "check": "完成第十二章剧情",
                "reward": "乐谱*1"
            }
        ],
        "luxury": [
            {
                "name": "贝斯的弦",
                "dsc": "达成肖千也 TRUE END",
                "check": "达成肖千也 TRUE END",
                "reward": "B面人生·肖千也"
            },
            {
                "name": "琴键与誓言",
                "dsc": "达成肖万寻 TRUE END",
                "check": "达成肖万寻 TRUE END",
                "reward": "B面人生·肖万寻"
            },
            {
                "name": "小手拉大手",
                "dsc": "达成韩小白 TRUE END",
                "check": "达成韩小白 TRUE END",
                "reward": "B面人生·韩小白"
            },
            {
                "name": "黑箱效应",
                "dsc": "成功触发韩小白彩蛋剧情",
                "check": "触发韩小白彩蛋",
                "reward": "乐谱*1"
            },
            {
                "name": "好兄弟？！",
                "dsc": "成功触发肖家兄弟彩蛋剧情",
                "check": "触发肖家兄弟彩蛋",
                "reward": "兄弟？兄弟！·肖千也&肖万寻"
            },
            {
                "name": "大结局",
                "dsc": "完成第十二章剧情",
                "check": "完成第十二章剧情",
                "reward": "原版CD*1\n乐谱*1"
            }
        ]
    }
]);