callbackDeleteBookHistory = data => {
    GameCommon.getInstance().showCommomTips('清档' + JSON.stringify(data));
};
const saveValues = [
    "lookAchievement",
    "curVideoID",
    "allCollectionDatas",
    "achievementDics",
    "ansWerData",
    "guideDic",
    "guideJson",
    "curchapter",
    "main_Img",
    "shopDic",
    "allVideos",
    "tipsDick"
];

class GameCommon {
    private static instance: GameCommon = null;
    private static SAVE_TIME_INTERVAL: number = 10000;
    public getLockedOptionIDs = {
        5: () => {
            if (GameCommon.getRoleLike(2) === 1) {
                return [];
            } else {
                const q1a = GameCommon.getQuestionAnswer(1);
                const q3a = GameCommon.getQuestionAnswer(3);
                if (q1a === 1 && q3a === 1) {
                    return [];
                } else if (q1a !== 1 && q3a !== 1) {
                    return [1, 2];
                } else {
                    return [2];
                }
            }
        },
        18: () => {
            if (
                GameCommon.getRoleLike(2) < 3
                && GameCommon.getRoleLike(0) < 2
                && GameCommon.getRoleLike(3) < 2
                && GameCommon.getRoleLike(1) < 1
            ) {
                return [2];
            } else {
                return [];
            }
        },
        19: () => {
            const list = [];
            if (GameCommon.getRoleLike(ROLE_INDEX.ZiHao_Xia) < 3) {
                list.push(1);
            }
            if (GameCommon.getRoleLike(ROLE_INDEX.XiaoBai_Han) < 2) {
                list.push(2);
            }
            if (GameCommon.getRoleLike(ROLE_INDEX.QianYe_Xiao) < 1) {
                list.push(3);
            }
            if (GameCommon.getRoleLike(ROLE_INDEX.WanXun_Xiao) < 2) {
                list.push(4);
            }
            return list;
        },
        25: () => {
            if (GameCommon.getQuestionAnswer(22) !== 1
                && GameCommon.getQuestionAnswer(24) === 2) {
                return [1, 2];
            } else {
                return [];
            }
        },
        34: () => {
            let list = [];
            if (GameCommon.getRoleLike(ROLE_INDEX.QianYe_Xiao) < 6) {
                list.push(1);
            }
            if (GameCommon.getRoleLike(ROLE_INDEX.ZiHao_Xia) < 6) {
                list.push(2);
            }
            if (GameCommon.getRoleLike(ROLE_INDEX.WanXun_Xiao) < 6) {
                list.push(3);
            }
            if (GameCommon.getRoleLike(ROLE_INDEX.XiaoBai_Han) < 5) {
                list.push(4);
            }
            if (list.length === 4) {
                list = [1, 2, 4];
            }
            return list;
        },
    };
    private readonly sd: egret.Sound;
    private retrySaveTimerTable = {};

    private constructor() {
        if (!this.sd) {
            this.sd = new egret.Sound();
            this.sd.load('resource/sound/click_sound.mp3');
        }
    }

    public static getInstance(): GameCommon {
        if (this.instance == null) {
            this.instance = new GameCommon();
        }
        return this.instance;
    }

    public static getQuestionAnswer(qid) {
        return parseInt(UserInfo.curBokData.answerId[qid]);
    }

    private static isChapterInRoleJuqingTree(chapter: number, curChapter: number): boolean {
        if (chapter === 0) {
            return true;
        } else {
            for (let role = 0; role < GameDefine.ROLE_JUQING_TREE.length; role++) {
                const roleTree = GameDefine.ROLE_JUQING_TREE[role];
                const curIndex = roleTree.indexOf(curChapter);
                if (curIndex !== -1) {
                    const index = roleTree.indexOf(chapter);
                    return index !== -1 && index <= curIndex;
                }
            }
            return false;
        }
    }

    private static getRoleLike(roleIndex) {
        return GameCommon.getInstance().getRoleLikeAll(roleIndex);
    }

    public async getUserInfo() {
        return await platform.getUserInfo();
    }

    //存档成功返回
    public parseFile(tp) {
        // if(tp)
        // return;//暂时注释掉
        switch (tp) {
            case FILE_TYPE.AUTO_FILE: //自动存档 和手动存档
                UserInfo.fileDatas[tp] = copyBookData(UserInfo.curBokData);
                break;
            case FILE_TYPE.FILE2:
            case FILE_TYPE.FILE3:
            case FILE_TYPE.FILE4:
            case FILE_TYPE.FILE5:
            case FILE_TYPE.FILE6:
                UserInfo.fileDatas[tp] = copyBookData(UserInfo.curBokData);
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.REFRESH_JUQING));
                break;
        }
    }

    public async setBookData(tp: FILE_TYPE, failedCallback?: Function) {
        let str = '';
        if (!UserInfo.curBokData) {
            UserInfo.curBokData = new BookData();
        }
        UserInfo.curBokData.timestamp = new Date().getTime();
        // UserInfo.curBokData.title = '存档';
        switch (tp) {
            //自动存档和手动存档
            case FILE_TYPE.AUTO_FILE:
            case FILE_TYPE.FILE2:
            case FILE_TYPE.FILE3:
            case FILE_TYPE.FILE4:
            case FILE_TYPE.FILE5:
            case FILE_TYPE.FILE6:
                UserInfo.curBokData.ansWerData = UserInfo.ansWerData;
                UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
                UserInfo.curBokData.allCollectionDatas = UserInfo.allCollectionDatas;
                UserInfo.curBokData.guideDic = UserInfo.guideDic;
                UserInfo.curBokData.guideJson = UserInfo.guideJson;
                // UserInfo.curBokData.chapterDatas = UserInfo.chapterDatas;
                UserInfo.curBokData.curchapter = UserInfo.curchapter;
                UserInfo.curBokData.main_Img = UserInfo.main_Img;
                UserInfo.curBokData.shopDic = UserInfo.shopDic;
                UserInfo.curBokData.allVideos = UserInfo.allVideos;
                UserInfo.curBokData.tipsDick = UserInfo.tipsDick;
                UserInfo.curBokData.lookAchievement = UserInfo.lookAchievement;
                str = JSON.stringify(UserInfo.curBokData);
                // VideoManager.getInstance().log('村上了');
                if (egret.Capabilities.os == 'Windows PC') {
                    egret.localStorage.setItem(tp.toString(), str);
                    UserInfo.fileDatas[tp] = copyBookData(UserInfo.curBokData);
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.REFRESH_JUQING));
                }
                break;
            //选过的所有问题答案存档
            case FILE_TYPE.ANSWER_FILE:
                UserInfo.curBokData.ansWerData = UserInfo.ansWerData;
                str = JSON.stringify(UserInfo.ansWerData);
                // egret.localStorage.setItem(tp.toString(), str);
                break;
            //成就存档
            case FILE_TYPE.CHENGJIU_FILE:
                UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
                str = JSON.stringify(UserInfo.achievementDics);
                break;
            //收藏存档
            case FILE_TYPE.COLLECTION_FILE:
                UserInfo.curBokData.allCollectionDatas = UserInfo.allCollectionDatas;
                str = JSON.stringify(UserInfo.allCollectionDatas);
                break;
            case FILE_TYPE.GUIDE_TP:
                str = JSON.stringify(UserInfo.guideDic);
                UserInfo.curBokData.guideDic = UserInfo.guideDic;
                break;
            case FILE_TYPE.GOODS_FILE:
                let shopInfoDict = {};
                for (let id in ShopManager.getInstance().shopInfoDict) {
                    let shopinfo: ShopInfoData = ShopManager.getInstance().shopInfoDict[id];
                    shopInfoDict[shopinfo.id] = {num: shopinfo.num};
                }
                // GameCommon.getInstance().addChengJiuTips(JSON.stringify(shopInfoDict))
                str = JSON.stringify(shopInfoDict);
                if (egret.Capabilities.os == 'Windows PC') {
                    egret.localStorage.setItem(tp.toString(), str);
                }
                break;
            case FILE_TYPE.TASK: {
                str = JSON.stringify(TaskManager.instance.getTaskStates());
                if (egret.Capabilities.os == 'Windows PC') {
                    egret.localStorage.setItem(tp.toString(), str);
                }
                break;
            }
        }
        let curChapterCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        let cundangTitle: string = '存档';
        if (curChapterCfg) {
            cundangTitle = curChapterCfg.name;
        }
        console.log("save book history", tp, str);
        platform.saveBookHistory(GameDefine.BOOKID, tp, cundangTitle, str, data => {
            console.log("save book history result", tp, data);
            if (data.code !== 0) {
                if (failedCallback) {
                    failedCallback();
                } else {
                    if (this.retrySaveTimerTable[tp]) {
                        return;
                    }
                    this.retrySaveTimerTable[tp] = setTimeout(() => {
                        this.retrySaveTimerTable[tp] = undefined;
                        this.setBookData(tp);
                    }, GameCommon.SAVE_TIME_INTERVAL);
                }
            } else {
                GameCommon.getInstance().parseFile(data.data.slotId);
            }
        });
    }

    /*所有数据存档*/
    public async getBookHistoryList() {//获取所有数据列表
        callbackGetBookHistoryList = function (data) {
            let documentList = [];
            let slots = data.data.slots;

            if (slots && slots.length > 0) {
                documentList = slots;
                for (let i = 0, n = documentList.length; i < n; ++i) {
                    let item = documentList[i];
                    if (item && item.slotId) {
                        GameCommon.getInstance().parseChapter(item.slotId, item);
                    }
                }
            }
        };
        platform.getBookHistoryList(GameDefine.BOOKID, callbackGetBookHistoryList);
    }

    public deleteBookHistory(tp) {
        egret.localStorage.clear();
        platform.deleteBookHistory(GameDefine.BOOKID, tp, callbackDeleteBookHistory);
        // LocalStorageManager.getInstance().deleteBookHistory(tp);
    }

    public async getBookHistory(tp) { //获取指定存档
        if (egret.Capabilities.os == 'Windows PC') {
            let info = JSON.parse(egret.localStorage.getItem(tp.toString()));
            if (!info)
                return;
            if (tp === FILE_TYPE.TASK) {
                TaskManager.instance.init(info);
            } else if (tp == FILE_TYPE.AUTO_FILE) {
                UserInfo.curBokData = info;
                saveValues.forEach(element => {
                    if (info[element]) {
                        UserInfo[element] = info[element];
                    }
                });
            } else {
                UserInfo.fileDatas[tp] = info;
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), tp);
            return;
        }
        // UserInfo.curBokData = info;
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), tp);
        let callbackGetBookHistory = (data) => {
            if (data.code != 0) {
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.INIT_DESC), JSON.stringify(data));
                console.log("read book failed:" + tp);
                return;
            }
            if (data.data.content == "") {
                return;
            }
            console.log("read book success:" + tp);
            switch (data.data.slotId) {
                //自动存档和手动存档
                case FILE_TYPE.AUTO_FILE:
                    UserInfo.curBokData = JSON.parse(data.data.content);
                    saveValues.forEach(element => {
                        if (UserInfo.curBokData[element]) {
                            UserInfo[element] = UserInfo.curBokData[element];
                        }
                    });
                    //UserInfo.fileDatas[data.data.slotId] = UserInfo.curBokData;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), data.data.slotId);
                    break;
                case FILE_TYPE.FILE2:
                case FILE_TYPE.FILE3:
                case FILE_TYPE.FILE4:
                case FILE_TYPE.FILE5:
                case FILE_TYPE.FILE6:
                    if (!data.data.content) {
                        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), data.data.slotId);
                        return;
                    }
                    if (GameDefine.ISFILE_STATE) {
                        UserInfo.curBokData = JSON.parse(data.data.content);
                        saveValues.forEach(element => {
                            if (UserInfo.curBokData[element]) {
                                UserInfo[element] = UserInfo.curBokData[element];
                            }
                        });
                    }
                    let bookData: BookData = JSON.parse(data.data.content);
                    UserInfo.fileDatas[data.data.slotId] = bookData;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), data.data.slotId);
                    break;
                case FILE_TYPE.CHENGJIU_FILE:
                    UserInfo.achievementDics = JSON.parse(data.data.content);
                    break;
                case FILE_TYPE.COLLECTION_FILE:
                    UserInfo.allCollectionDatas = JSON.parse(data.data.content);
                    break;
                case FILE_TYPE.GUIDE_TP:
                    // UserInfo.guideDic = JSON.parse(data.data.content);
                    // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH), JSON.stringify(UserInfo.guideDic));
                    break;
                case FILE_TYPE.GOODS_FILE:
                    // GameCommon.getInstance().addChengJiuTips(JSON.stringify(data.data.content));
                    //ShopManager.getInstance().debugShopInfos = JSON.parse(data.data.content);
                    ShopManager.getInstance().initShopInfos(data.data.content);
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_NEWPOINT));
                    break;
                case FILE_TYPE.TASK: {
                    TaskManager.instance.init(JSON.parse(data.data.content));
                    break;
                }
            }

        };
        platform.getBookHistory(GameDefine.BOOKID, tp, callbackGetBookHistory);
    }

    public addRoleLike(index) {
        let awardStrAry: string[];
        if (index.indexOf(",") >= 0) {
            awardStrAry = index.split(",");
        }
        if (!awardStrAry || !awardStrAry.length)
            return;
        let delTim = 0;

        for (let i = 0; i <= 3; i++) {
            let tipStr = ": 亲密度增加";
            let sound = "likeadd.mp3";
            let like = Number(awardStrAry[i]);
            if (like < 0) {
                tipStr = ": 亲密度减少";
                sound = "likesub.mp3";
            }
            if (like != 0) {
                Tool.callbackTime(function () {
                    GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[i] + tipStr);
                    SoundManager.getInstance().playSound(sound);
                }, {}, delTim);
                delTim = delTim + 3000;
            }
        }
        /*if (Number(awardStrAry[0]) > 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[0] + ': 亲密度增加')
            }, {}, delTim);
            delTim = delTim + 3000;
        } else if (Number(awardStrAry[0]) < 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[0] + ': 亲密度降低')
            }, {}, delTim);
            delTim = delTim + 3000;
        }

        if (Number(awardStrAry[1]) > 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[1] + ': 亲密度增加')
            }, {}, delTim);
            delTim = delTim + 3000;
        } else if (Number(awardStrAry[1]) < 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[1] + ': 亲密度降低')
            }, {}, delTim);
            delTim = delTim + 3000;
        }

        if (Number(awardStrAry[2]) > 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[2] + ': 亲密度增加')
            }, {}, delTim);
            delTim = delTim + 3000;
        } else if (Number(awardStrAry[2]) < 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[2] + ': 亲密度降低')
            }, {}, delTim);
            delTim = delTim + 3000;
        }

        if (Number(awardStrAry[3]) > 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[3] + ': 亲密度增加')
            }, {}, delTim);
            delTim = delTim + 3000;
        } else if (Number(awardStrAry[3]) < 0) {
            Tool.callbackTime(function () {
                GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[3] + ': 亲密度降低')
            }, {}, delTim);
            delTim = delTim + 3000;
        }*/
    }

    public getCurRoleLike(index, str): number {
        return Number(str.split(",")[index]) || 0;
    }

    public getRoleLikeAll(index: number, bookData?: BookData): number {
        bookData = bookData || UserInfo.curBokData;
        let likeData = bookData.answerId;
        let likeNum = 0;
        for (let wentiID in likeData) {
            if (likeData.hasOwnProperty(wentiID)) {
                let wentiAnswerModels = JsonModelManager.instance.getModelanswer()[wentiID];
                if (wentiAnswerModels) {
                    let answerList: string[] = likeData[wentiID].toString().split(",");
                    for (let i: number = 0; i < answerList.length; i++) {
                        let answerID: number = Number(answerList[i]) - 1;
                        let ansCfg: Modelanswer = wentiAnswerModels[answerID];
                        if (ansCfg) {
                            likeNum = likeNum + this.getCurRoleLike(index, ansCfg.like);
                        }
                    }
                }
            }
        }
        return likeNum;
    }

    public getSortLike(idx: number = 0, bookData?: BookData) {
        let items = this.getSortLikeAry(bookData);
        return items[idx];
    }

    public getSortLikeAry(bookData?: BookData) {
        // 当好感度相同时 按照这个顺序 越前面越大
        const list = [ROLE_INDEX.ZiHao_Xia, ROLE_INDEX.XiaoBai_Han, ROLE_INDEX.WanXun_Xiao, ROLE_INDEX.QianYe_Xiao];
        let items = [];
        for (let i: number = 0; i < ROLE_INDEX.SIZE; i++) {
            let data = {num: 0, id: i};
            data.num = this.getRoleLikeAll(i, bookData);
            items.push(data);
        }
        items.sort(function (arg1, arg2) {
            if (arg2.num > arg1.num) {
                return 1;
            } else if (arg2.num < arg1.num) {
                return -1;
            } else {
                return list.indexOf(arg1.id) - list.indexOf(arg2.id);
            }
        });
        return items;
    }

    public parseChapter(tp, data) {
        switch (tp) {
            case FILE_TYPE.ANSWER_FILE:  //问题存档
                break;
            case FILE_TYPE.AUTO_FILE: //自动存档 和手动存档
            case FILE_TYPE.FILE2:
            case FILE_TYPE.FILE3:
            case FILE_TYPE.FILE4:
            case FILE_TYPE.FILE5:
            case FILE_TYPE.FILE6:
                if (!UserInfo.fileDatas[tp]) {
                    UserInfo.fileDatas[tp] = new BookData();
                }
                UserInfo.fileDatas[tp].timestamp = data.timestamp;
                UserInfo.fileDatas[tp].title = data.title;
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH), UserInfo.fileDatas[tp]);
                break;
            case FILE_TYPE.CHENGJIU_FILE:  //成就存档
                // UserInfo.achievementDics = JSON.parse(data);
                break;
            case FILE_TYPE.COLLECTION_FILE: //收藏存档
                // UserInfo.allCollectionDatas = JSON.parse(data);
                break;
        }
        //
    }

    /** 获取某个存档当前剧情ID
     * 通过每个存档位上最后的一个问题的ID
     * 问题记录的视频ID 对应的剧情ID
     * 如果多个分支同时指向一个视频 需要判断选项的视频的其他视频对应的剧情ID
     *  **/
    public getCurJuqingID(flieData): number {
        if (!flieData) return GameDefine.START_JUQING_KUAI;
        let shipinCfg: Modelshipin;
        let videoID: string;
        if (flieData.curVideoID) {
            if (flieData.curVideoID === "VW1207") {
                if (GameCommon.getInstance().getSortLike(0, flieData).id === ROLE_INDEX.WanXun_Xiao) {
                    return 86;
                } else {
                    return 78;
                }
            } else if (flieData.curVideoID === "VX1205") {
                return 71;
            }
            videoID = flieData.curVideoID;
            shipinCfg = JsonModelManager.instance.getModelshipin()[videoID];
            if (shipinCfg) {
                for (let showid in JsonModelManager.instance.getModeljuqingkuai()) {
                    let jqmodels = JsonModelManager.instance.getModeljuqingkuai()[showid];
                    for (let juqingid in jqmodels) {
                        if (jqmodels[juqingid].videoId == videoID) return jqmodels[juqingid].id;
                    }
                }
            }
        }

        let _length: number = flieData.wentiId ? flieData.wentiId.length : 0;
        while (_length > 0) {
            _length--;
            let wentiID: number = flieData.wentiId[_length];
            videoID = flieData.videoNames[wentiID];
            if (!videoID) continue;
            shipinCfg = JsonModelManager.instance.getModelshipin()[videoID];
            if (shipinCfg) {
                if (shipinCfg.juqing == 0) {
                    let awswerId: number = flieData.ansWerData.answerId[wentiID];
                    let awswerCfgs = JsonModelManager.instance.getModelanswer()[wentiID];
                    for (let id in awswerCfgs) {
                        let awscfg: Modelanswer = awswerCfgs[id];
                        if (awscfg.ansid == awswerId) {
                            let awsvideoAry: string[] = awscfg.videos.split(',');
                            for (let j: number = 0; j < awsvideoAry.length; j++) {
                                let awsvideo_cfg: Modelshipin = JsonModelManager.instance.getModelshipin()[awsvideoAry[j]];
                                if (awsvideo_cfg && awsvideo_cfg.juqing != 0) return awsvideo_cfg.juqing;
                            }
                            break;
                        }
                    }
                } else {
                    return shipinCfg.juqing;
                }
            }
        }
        return GameDefine.START_JUQING_KUAI;
    }

    /** 判断剧情块是否开启
     * 返回结果为 参数1 是否比 参数2大
     * 注释： 大这个概念 初步的数据设计是 剧情块ID大的  剧情一定靠后
     * 接手项目后  为防止出现插入的情况  特意写了这么一个可修改的接口
     * By 修改  如果传入的剧情块 不在当前章节列表（章节列表与角色好感度有关） 则直接返回Flase
     * **/
    public checkJuqingKuaiOpen(kuaiID1: number, kuaiID2: number, bookData?: BookData): boolean {
        let compare: boolean = kuaiID1 >= kuaiID2;

        if (compare) {
            switch (kuaiID2) {
                case 75:
                    let qianxunlike75: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.QianYe_Xiao, bookData);
                    let wanxunlike75: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.WanXun_Xiao, bookData);
                    if (qianxunlike75 < wanxunlike75) {
                        compare = false;
                    }
                    break;
                case 82:
                    let qianxunlike82: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.QianYe_Xiao, bookData);
                    let wanxunlike82: number = GameCommon.getInstance().getRoleLikeAll(ROLE_INDEX.WanXun_Xiao, bookData);
                    if (qianxunlike82 >= wanxunlike82) {
                        compare = false;
                    }
                    break;
            }
        }

        return compare;
    }

    public addAlert(text: string): void {
        // PromptPanel.getInstance().addPromptError(text);
    }

    public addChengJiuTips(text: string): void {
        if (isTXSP) {
            return;
        }
        PromptPanel.getInstance().addChengJiuTips(text);
    }

    public addLikeTips(text: string): void {
        PromptPanel.getInstance().addLikeTips(text);
    }

    public setTipsHuDong(): void {
        PromptPanel.getInstance().setTipsHuDong();
    }

    public hideTipsHuDong(): void {
        PromptPanel.getInstance().hideTipsHuDong();
    }

    public showCommomTips(str): void {
        PromptPanel.getInstance().showCommomTips(str);
    }

    public hideActionTips() {
        PromptPanel.getInstance().hideActionTips();
    }

    public onShowBuyTips(id, money, tp, buycallback?: any) {
        PromptPanel.getInstance().onShowBuyTips(id, money, tp, buycallback);
    }

    public onShowResultTips(str: string, isRight: boolean = true, btnlabel?: string, callBack?: Function, ...arys) {
        PromptPanel.getInstance().onShowResultTips(str, isRight, btnlabel, callBack, arys);
    }

    public showConfirmTips(desc: string, callBack: Function, desc2?: string, textYes: string = "是", textNo: string = "否"): void {
        PromptPanel.getInstance().showConfirmTips(desc, callBack, desc2, textYes, textNo);
    }

    public showStrongTips(desc: string, callBack: Function, textYes: string = "确定") {
        PromptPanel.getInstance().showStrongTips(desc, callBack, textYes);
    }

    public showErrorLog(logstr: string): void {
        PromptPanel.getInstance().showErrorLog(logstr);
    }

    //用户钻石余额区间，假设用户钻石数为n，共分为五个区间：n=0、0<n<=50、

    public shock(tp: number = 0, iswin: boolean = false) {
        if (tp == 1) {
            if (iswin) {
                if (Tool.isAndroid()) {
                    navigator.vibrate([500, 300]);
                }
                SoundManager.getInstance().playSound('winMusic.mp3');
            } else {
                SoundManager.getInstance().playSound('loseMusic.mp3');
            }
        } else {
            if (Tool.isAndroid()) {
                navigator.vibrate([500, 300]);
            }
            this.sd.play(0, 1);
        }
        // PromptPanel.getInstance().hideActionTips();
    }

    //回调函数返回的数据中code（0表示成功处理；非0表示没有成功处理），data（具体的业务数据，具体见案例）

    public showLoading(): void {
        PromptPanel.getInstance().showLoading();
    }

    public removeLoading(): void {
        PromptPanel.getInstance().removeLoading();
    }

    public async report(evt, params) {
        callbackReport = function (data) {
            if (data.code != 0) {
                errorList.push({type: "platform.report error", data});
                GameCommon.getInstance().showErrorLog(JSON.stringify(data));
                GameCommon.getInstance().showErrorLog('出现未处理错误，请点击上方复制log按钮，将复制到的log发给开发');
            }
        };
        await platform.report(GameDefine.BOOKID, evt, params, callbackReport)
    }

    //50<n<=200、200<n<=500、500以上。这里返回对应的区间号，0(n=0),1(0<n<=50),2(...),3,4
    public async getUserPlatformData() {
        callbackGetUserPlatformData = function (data) {

        };
        await platform.getUserPlatformData()
    }

    /*totalAmount	int	消费总额	消费总额
    totalTimes	int	消费次数	消费次数
    lastConsumeTime	int	上次消费时间	上次消费时间
    lastConsumeValue	int	上次消费额度	上次消费额度*/
    public async getBookConsumeData() {
        callbackGetBookConsumeData = function (data) {
        };
        await platform.getBookConsumeData(GameDefine.BOOKID, callbackGetBookConsumeData)
    }

    async reportBusinessEvent(bookId, evtId, optionId) {
        callbackReportBusinessEvent = function (data) {
            //回调函数返回的数据中code（0表示成功处理；非0表示没有成功处理）
            console.log('213');
        };
        await platform.reportBusinessEvent(GameDefine.BOOKID, evtId, optionId, callbackReportBusinessEvent)
    }

    async getBusinessEventData(bookId, evtId, optionId) {
        callbackGetBusinessEventData = function (data) {
            //多条查询统计结果
            GameCommon.getInstance().showCommomTips('获取上报' + JSON.stringify(data))
        };
        await platform.getBusinessEventData(GameDefine.BOOKID, evtId, optionId, callbackGetBusinessEventData)
    }

    async triggerEventNotify(evtId, str) {
        await platform.triggerEventNotify(evtId, str)
    }

    async openButton(str) {
        await platform.openButton(str)
    }

    async onCloseWebView() {
        if (window['StoryPlatform']) {
            await window['StoryPlatform']['exit']();
        }
    }

    public onCleanFile(data: Modeljuqingkuai) {
        let cfg: Modeljuqingkuai = data;
        let cfg1: Modeljuqingkuai;
        if (cfg.BE == 1) {
            cfg1 = JsonModelManager.instance.getModeljuqingkuai()[cfg.show][cfg.id - 1];
        }
        let curWenId = cfg.wentiId;
        let isClean = false;
        for (let i: number = 0; i < UserInfo.curBokData.wentiId.length; i++) {
            let id = UserInfo.curBokData.wentiId[i];
            if (UserInfo.curBokData.wentiId[i] == curWenId) {
                isClean = true;
            }
            if (cfg1 && cfg1.wentiId == id) {
                UserInfo.curBokData.videoNames[id] = cfg1.videoId;
                UserInfo.curBokData.answerId[id] = '';
            }
            if (isClean) {
                UserInfo.curBokData.videoNames[id] = '';
                UserInfo.curBokData.answerId[id] = '';
                UserInfo.curBokData.wentiId.splice(i, 1);
                i = i - 1;
            }
        }
        for (let k in UserInfo.curBokData.videoDic) {
            let videoCfg: Modelshipin = JsonModelManager.instance.getModelshipin()[UserInfo.curBokData.videoDic[k]];
            if (videoCfg) {
                if (videoCfg.juqing > cfg.id) {
                    UserInfo.curBokData.videoDic[k] = null;
                }
            }
        }
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
    }

    public getChapterIdByVideoName(videoName) {
        //先在chapter中找，找到videoSrc中包含videoName的
        let chapters = JsonModelManager.instance.getModelchapter();
        for (let k in chapters) {
            let videos = chapters[k].videoSrc.split(",")
            for (let video of videos) {
                if (video == videoName) {
                    return chapters[k].id;
                }
            }
        }
        let tqid = -1;
        let func = (videoName) => {
            let answers = JsonModelManager.instance.getModelanswer();
            for (let k in answers) {
                let find = false;
                let answer = answers[k];
                for (let y in answer) {
                    let ans = answer[y]
                    let videos = ans.videos.split(",")
                    for (let video of videos) {
                        if (video == videoName) {
                            return Number(k)
                        }
                    }
                }
            }
        };
        tqid = func(videoName);
        let wentis = JsonModelManager.instance.getModelwenti();
        if (wentis[tqid])
            return wentis[tqid].chapter;
        return null;
    }

    public isChapterOnSale(chapterId) {
        return true;
        // const chapterCfg = JsonModelManager.instance.getModelchapter()[chapterId];
        // let saleTime = Tool.formatAddDay(chapterCfg.saleTime, platform.getSaleBeginTime());
        // let curDay = Tool.formatTimeDay2Num();
        // return curDay >= saleTime;
    }

    //还差多少毫秒免费
    public getLeftChapterFreeMS(chapterId) {
        const chapterCfg = JsonModelManager.instance.getModelchapter()[chapterId];
        let freems = platform.getSaleBeginTime() + chapterCfg.freeTime * 86400 * 1000;
        return freems - platform.getServerTime()
    }

    public getWentiItemId(wentiId, id) {
        return 500000 + wentiId * 100 + id;
    }

    public getNextChapterId(curChapterId) {
        const curChapterCfg = JsonModelManager.instance.getModelchapter()[curChapterId];
        let nextChapterId = String(curChapterCfg.next);
        const arr = nextChapterId.split(";");
        return Number(arr[0]);
    }

    public getPlayingChapterId() {
        let videoName = VideoManager.getInstance().getVideoID();
        let curChapterId = this.getChapterIdByVideoName(videoName);
        if (!curChapterId)
            curChapterId = UserInfo.curchapter;
        return curChapterId;
    }

    public getNextChapterFreeMs() {
        let curChapterId = this.getPlayingChapterId();
        let nextChapterId = this.getNextChapterId(curChapterId);
        let freeMs = this.getLeftChapterFreeMS(nextChapterId);
        return freeMs;
    }

    //确定章节是否已开启
    public checkChapterLocked(chapterId = null, isDudang = false, isWin = false) {
        if (!GameDefine.ENABLE_CHECK_VIP) {
            return true;
        }
        let nextChapterId = UserInfo.curchapter;
        if (chapterId !== null)
            nextChapterId = chapterId;
        if (nextChapterId == 0)
            return true;
        let onSale = this.isChapterOnSale(nextChapterId);
        let isVip = ShopManager.getInstance().isVIP();
        if (!onSale) {
            GameCommon.getInstance().showCommomTips("后续章节尚未更新，敬请期待。");
            GameDefine.IS_DUDANG = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
            return false;
        }
        let freeMs = this.getLeftChapterFreeMS(nextChapterId);
        //提前半天开放，10号凌晨就可以看了
        if (platform.getServerTime() < platform.getSaleBeginTime() - platform.getOffsetTime()) {
            GameCommon.getInstance().showCommomTips("敬请期待");
            GameDefine.IS_DUDANG = false;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
            return false;
        }
        if (!isVip && (freeMs > 0 || !platform.isCelebrateTime())) {
            //获得当前章节完成时间，计算是出下个章节是否可以阅读。
            //每个章节完成时，需要永久记录每个章节的首次完成时间
            ChengJiuManager.getInstance().curChapterChengJiu = {};
            // const callback = function () {
            //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            //         windowName: 'TicketPanel',
            //         data: "confirm"
            //     });
            // };
            // if (platform.getPlatform() == "plat_txsp") {
            //     GameCommon.getInstance().showConfirmTips("您已体验完试看内容，购买“心动PASS”立即解锁全部剧集", callback, "活动期间，非心动PASS用户可通过等待免费解锁，详情请参见活动资讯", "购买心动PASS", "取消");// "等待" + freeDay + "天"
            // } else {
            //     GameCommon.getInstance().showConfirmTips("您已体验完试看内容，购买“心动PASS”立即解锁全部剧集，附赠价值88元粉丝特典", callback, "活动期间，非心动PASS用户可通过等待免费解锁，详情请参见活动资讯", "购买心动PASS", "取消");// "等待" + freeDay + "天"
            // }
            if (!isWin) {
                if (isTXSP) {
                    GameDefine.IS_DUDANG = isDudang;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
                } else {
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
                }
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "BuyVIPPanel");
            return false;
        }
        return true;
    }

    public showRoleLike() {
        const info = this.getSortLikeAry().map(data => `${GameDefine.ROLE_NAME[data.id]}:${data.num}`).join(",");
        this.showErrorLog(info);
    }

    public getDefaultAns(wtID: number) {
        const getLockIDListFunc = GameCommon.getInstance().getLockedOptionIDs[wtID];
        const lockIDList = getLockIDListFunc ? getLockIDListFunc() : [];

        const wtModel = wentiModels[wtID];
        let defaultID = wtModel.moren;
        if (lockIDList.indexOf(wtModel.moren) !== -1) {
            defaultID = wtModel.ans.split(",").map(s => parseInt(s)).find(i => lockIDList.indexOf(i) === -1);
        }
        return defaultID;
    }

    public getChapterIndex(n) {
        let chapterIndex = 0;
        for (let i = 0; i < GameDefine.ROLE_JUQING_TREE.length; i++) {
            const role = GameDefine.ROLE_JUQING_TREE[i];
            for (let j = 0; j < role.length; j++) {
                if (role[j] === n) {
                    chapterIndex = j + 1;
                    break;
                }
            }
        }
        return chapterIndex;
    }

    public getPingzhengPrize() {
        let price;
        if (platform.getPlatform() == "plat_txsp") {
            price = platform.isPlatformVip() ? 120 : 180;
        } else {
            price = platform.isCelebrateTime() ? 120 : 180;
        }
        return price * platform.getPriceRate();
    }

    public isCompleteGame(): boolean {
        if (!UserInfo.curBokData) {
            return false;
        }
        const videoIDs = UserInfo.curBokData.videoDic;
        for (const vid in videoIDs) {
            if (videoIDs.hasOwnProperty(vid)) {
                const videoConfig = videoModels[videoIDs[vid]];
                if (videoConfig) {
                    if (videoConfig.ending.length && !videoConfig.be) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

declare let callbackDeleteBookHistory;
declare let callbackGetBookLastHistory;
declare let callbackGetBookHistoryList;
declare let callbackReport;
declare let callbackGetUserPlatformData;
declare let callbackGetBookConsumeData;
declare let callbackReportBusinessEvent;
declare let callbackGetBusinessEventData;//查询上报事件

