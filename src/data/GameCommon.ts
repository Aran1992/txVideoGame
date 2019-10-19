class GameCommon {
    private static instance: GameCommon = null;
    public getLockedOptionIDs = {
        5: () => {
            if (GameCommon.getRoleLike(2) === 1) {
                return [];
            } else {
                const q1a = GameCommon.getQuestionAnswer(1);
                const q3a = GameCommon.getQuestionAnswer(3);
                if (q1a === 1 && q3a === 1) {
                    return [];
                } else if (q1a === 1 || q3a === 1) {
                    return [2];
                } else if (q1a !== 1 && q3a !== 1) {
                    return [1, 2];
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
            }
        },
        19: () => {
            const list = [];
            if (GameCommon.getRoleLike(2) < 3) {
                list.push(1);
            }
            if (GameCommon.getRoleLike(0) < 2) {
                list.push(2);
            }
            if (GameCommon.getRoleLike(3) < 2) {
                list.push(4);
            }
            if (GameCommon.getRoleLike(1) < 1) {
                list.push(3);
            }
            return list;
        },
        25: () => {
            if (GameCommon.getQuestionAnswer(22) !== 1
                && GameCommon.getQuestionAnswer(24) === 2) {
                return [1, 2];
            }
        },
        34: () => {
            const list = [1, 2, 3, 4];
            if (GameCommon.getRoleLike(2) >= 2) {
                list.splice(list.indexOf(2), 1);
            }
            if (GameCommon.getRoleLike(0) >= 5) {
                list.splice(list.indexOf(4), 1);
            }
            if (GameCommon.getRoleLike(3) >= 6) {
                list.splice(list.indexOf(3), 1);
            }
            if (GameCommon.getRoleLike(1) >= 6) {
                list.splice(list.indexOf(1), 1);
            }
            if (list.length === 4) {
                list.splice(list.indexOf(3), 1);
            }
            return list;
        },
    };
    private readonly sd: egret.Sound;

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

    private static isChapterInRoleJuqingTree(chapter: number, curChapter: number): boolean {
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

    public async getUserInfo() {
        await platform.getUserInfo();
    }

    //存档成功返回
    public parseFile(tp) {
        // if(tp)
        // return;//暂时注释掉
        switch (tp) {
            case FILE_TYPE.AUTO_FILE: //自动存档 和手动存档
                UserInfo.fileDatas[tp] = UserInfo.curBokData;
                break;
            case FILE_TYPE.FILE2:
            case FILE_TYPE.FILE3:
            case FILE_TYPE.FILE4:
            case FILE_TYPE.FILE5:
            case FILE_TYPE.FILE6:
                UserInfo.fileDatas[tp] = UserInfo.curBokData;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.REFRESH_JUQING));
                break;
        }
    }

    /*数据存档*/
    public async setBookData(tp) { //存储数据文档
        // if(tp)
        // return;//暂时注释掉
        // GameCommon.getInstance().showCommomTips('存储'+tp)
        // console.log('存储' + tp);
        callbackSaveBookHistory = function (data) {
            // VideoManager.getInstance().log(JSON.stringify(data));
            if (data.code != 0) {
                // GameCommon.getInstance().addLikeTips(JSON.stringify(data));
                // if (data.data && data.data.slotId != 1) {
                // Tool.callbackTime(function () {
                //     GameCommon.getInstance().setBookData(data.data.slotId);
                // }, {}, 3000);
                // }
                // GameCommon.getInstance().showErrorLog(`存档${data.data.slotId}存储失败！错误id==` + data.code);
                return;
            } else {
                // GameCommon.getInstance().showErrorLog(`存档${data.data.slotId}存储成功！`);
            }
            // GameCommon.getInstance().addLikeTips('村上了'+UserInfo.curBokData.main_Img)
            GameCommon.getInstance().parseFile(data.data.slotId);
        };
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
                UserInfo.curBokData.suipianMoney = UserInfo.suipianMoney;
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
                str = JSON.stringify(UserInfo.curBokData);
                // VideoManager.getInstance().log('村上了');
                if (egret.Capabilities.os == 'Windows PC') {
                    egret.localStorage.setItem(tp.toString(), str);
                    UserInfo.fileDatas[tp] = UserInfo.curBokData;
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
            case FILE_TYPE.HIDE_FILE:
                // str = JSON.stringify(UserInfo.chapterDatas)
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
                break;
        }
        let curChapterCfg = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter];
        let cundangTitle: string = '存档';
        if (curChapterCfg) {
            cundangTitle = curChapterCfg.name;
        }
        await platform.saveBookHistory(GameDefine.BOOKID, tp, cundangTitle, str);
    }

    /*所有数据存档*/
    public async getBookHistoryList() {//获取所有数据列表
        callbackGetBookHistoryList = function (data) {
            let documentList = [];
            let slots = data.data.slots;

            // GameCommon.getInstance().getBookHistory(FILE_TYPE.HIDE_FILE);
            if (slots && slots.length > 0) {
                documentList = slots;
                let str: string = slots.length + 'bibibi';
                str += '\n';//+// JSON.stringify(slots)
                for (let i = 0, n = documentList.length; i < n; ++i) {
                    let item = documentList[i];
                    if (item && item.slotId) {
                        str += '\n' + JSON.stringify(item);
                        GameCommon.getInstance().parseChapter(item.slotId, item);
                    }
                }
                // for (let i:number=0;i<slots.lenth;i++) {
                //     if(slots[i]&&slots[i].content)
                //     {
                //         str +='\n'+JSON.stringify(item);
                //         // GameCommon.getInstance().parseChapter(slots[i].slotId, slots[i].content);
                //     }
                // }
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH), str);
                // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH));
            }
        };
        platform.getBookHistoryList(GameDefine.BOOKID);
    }

    public deleteBookHistory(tp) {
        callbackdeleteBookHistory = function (data) {
            // alert('清档成功')
            GameCommon.getInstance().showCommomTips('清档' + JSON.stringify(data));
        };
        egret.localStorage.clear();
        platform.deleteBookHistory(GameDefine.BOOKID, tp);
        // LocalStorageManager.getInstance().deleteBookHistory(tp);
    }

    public async getBookHistory(tp) { //获取指定存档
        // if(tp)
        // return;//暂时注掉
        if (egret.Capabilities.os == 'Windows PC') {
            let info = JSON.parse(egret.localStorage.getItem(tp.toString()));
            if (!info)
                return;
            if (tp == 1) {
                UserInfo.curBokData = info;
                if (UserInfo.curBokData.allCollectionDatas) {
                    UserInfo.allCollectionDatas = UserInfo.curBokData.allCollectionDatas;
                }
                if (UserInfo.curBokData.achievementDics) {
                    UserInfo.achievementDics = UserInfo.curBokData.achievementDics;
                }
                if (UserInfo.curBokData.ansWerData) {
                    UserInfo.ansWerData = UserInfo.curBokData.ansWerData;
                }
                if (UserInfo.curBokData.suipianMoney) {
                    UserInfo.suipianMoney = UserInfo.curBokData.suipianMoney;
                }
                if (UserInfo.curBokData.guideDic) {
                    UserInfo.guideDic = UserInfo.curBokData.guideDic;
                }
                if (UserInfo.curBokData.guideJson) {
                    UserInfo.guideJson = UserInfo.curBokData.guideJson;
                }
                // if (UserInfo.curBokData.chapterDatas) {
                //     UserInfo.chapterDatas = UserInfo.curBokData.chapterDatas;
                // }
                if (UserInfo.curBokData.curchapter) {
                    UserInfo.curchapter = UserInfo.curBokData.curchapter;
                }
                if (UserInfo.curBokData.main_Img) {
                    UserInfo.main_Img = UserInfo.curBokData.main_Img;
                }
                if (UserInfo.curBokData.shopDic) {
                    UserInfo.shopDic = UserInfo.curBokData.shopDic;
                }
                if (UserInfo.curBokData.allVideos) {
                    UserInfo.allVideos = UserInfo.curBokData.allVideos;
                }
                if (UserInfo.curBokData.tipsDick) {
                    UserInfo.tipsDick = UserInfo.curBokData.tipsDick;
                }
            } else {
                let bookData: BookData = info;
                UserInfo.fileDatas[tp] = bookData;
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), tp);
            return;
        }
        // UserInfo.curBokData = info;
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), tp);
        callbackGetBookHistory = function (data) {
            if (data.code != 0) {
                // GameCommon.getInstance().showCommomTips(JSON.stringify(data))
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.INIT_DESC), JSON.stringify(data));
            }
            // GameCommon.getInstance().addLikeTips(JSON.stringify(data));
            // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.INIT_DESC), JSON.stringify(data));
            switch (data.data.slotId) {
                //自动存档和手动存档
                case FILE_TYPE.AUTO_FILE:
                    UserInfo.curBokData = JSON.parse(data.data.content);
                    if (UserInfo.curBokData.allCollectionDatas) {
                        UserInfo.allCollectionDatas = UserInfo.curBokData.allCollectionDatas;
                    }
                    if (UserInfo.curBokData.achievementDics) {
                        UserInfo.achievementDics = UserInfo.curBokData.achievementDics;
                    }
                    if (UserInfo.curBokData.ansWerData) {
                        UserInfo.ansWerData = UserInfo.curBokData.ansWerData;
                    }
                    if (UserInfo.curBokData.suipianMoney) {
                        UserInfo.suipianMoney = UserInfo.curBokData.suipianMoney;
                    }
                    if (UserInfo.curBokData.guideDic) {
                        UserInfo.guideDic = UserInfo.curBokData.guideDic;
                    }
                    // if (UserInfo.curBokData.chapterDatas) {
                    //     UserInfo.chapterDatas = UserInfo.curBokData.chapterDatas;
                    // }
                    if (UserInfo.curBokData.curchapter) {
                        UserInfo.curchapter = UserInfo.curBokData.curchapter;
                    }
                    if (UserInfo.curBokData.main_Img) {
                        UserInfo.main_Img = UserInfo.curBokData.main_Img;
                    }
                    if (UserInfo.curBokData.shopDic) {
                        UserInfo.shopDic = UserInfo.curBokData.shopDic;
                    }
                    if (UserInfo.curBokData.allVideos) {
                        UserInfo.allVideos = UserInfo.curBokData.allVideos;
                    }
                    if (UserInfo.curBokData.tipsDick) {
                        UserInfo.tipsDick = UserInfo.curBokData.tipsDick;
                    }


                    // GameCommon.getInstance().addLikeTips('img'+UserInfo.main_Img);
                    // GameCommon.getInstance().addLikeTips('UserInfo.curBokData.main_Img'+JSON.stringify(UserInfo.curBokData.main_Img))
                    UserInfo.fileDatas[data.data.slotId] = UserInfo.curBokData;
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
                        if (UserInfo.allCollectionDatas) {
                            UserInfo.curBokData.allCollectionDatas = UserInfo.allCollectionDatas;
                        }
                        if (UserInfo.achievementDics) {
                            UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
                        }
                        if (UserInfo.ansWerData) {
                            UserInfo.curBokData.ansWerData = UserInfo.ansWerData;
                        }
                        if (UserInfo.suipianMoney) {
                            UserInfo.curBokData.suipianMoney = UserInfo.suipianMoney;
                        }
                        if (UserInfo.guideDic) {
                            UserInfo.curBokData.guideDic = UserInfo.guideDic;
                        }
                        // if (UserInfo.chapterDatas) {
                        //     UserInfo.curBokData.chapterDatas = UserInfo.chapterDatas;
                        // }
                        if (UserInfo.curchapter) {
                            UserInfo.curBokData.curchapter = UserInfo.curchapter;
                        }
                        if (UserInfo.main_Img) {
                            UserInfo.curBokData.main_Img = UserInfo.main_Img;
                        }
                        if (UserInfo.shopDic) {
                            UserInfo.curBokData.shopDic = UserInfo.shopDic;
                        }
                        if (UserInfo.allVideos) {
                            UserInfo.curBokData.allVideos = UserInfo.allVideos;
                        }
                        if (UserInfo.tipsDick) {
                            UserInfo.curBokData.tipsDick = UserInfo.tipsDick;
                        }


                    }
                    let bookData: BookData = JSON.parse(data.data.content);
                    UserInfo.fileDatas[data.data.slotId] = bookData;
                    // UserInfo.fileDatas[data.data.slotId].timestamp = UserInfo.curBokData.timestamp;
                    // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), tp);
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), data.data.slotId);
                    break;
                //成就存档
                case FILE_TYPE.CHENGJIU_FILE:
                    UserInfo.achievementDics = JSON.parse(data.data.content);
                    break;
                //收藏存档
                case FILE_TYPE.COLLECTION_FILE:
                    UserInfo.allCollectionDatas = JSON.parse(data.data.content);
                    break;
                case FILE_TYPE.HIDE_FILE:
                    // UserInfo.chapterDatas = JSON.parse(data.data.content);
                    break;
                //引导存档
                case FILE_TYPE.GUIDE_TP:
                    // UserInfo.guideDic = JSON.parse(data.data.content);
                    // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH), JSON.stringify(UserInfo.guideDic));
                    break;
                case FILE_TYPE.GOODS_FILE:
                    // GameCommon.getInstance().addChengJiuTips(JSON.stringify(data.data.content));
                    ShopManager.getInstance().debugShopInfos = JSON.parse(data.data.content);
                    ShopManager.getInstance().getShopInfos();
                    break;
            }

        };
        platform.getBookHistory(GameDefine.BOOKID, tp);
    }

    public addRoleLike(index) {
        let awardStrAry: string[];
        if (index.indexOf(",") >= 0) {
            awardStrAry = index.split(",");
        }
        if (!awardStrAry || !awardStrAry.length)
            return;
        let delTim = 0;

        for(let i=0;i<=3;i++){
            let tipStr = ": 亲密度增加"
            let sound = "likeadd.mp3"
            let like = Number(awardStrAry[i])
            if (like<0){
                tipStr = ": 亲密度减少"
                sound = "likesub.mp3"
            }
            if(like != 0){
                Tool.callbackTime(function () {
                    GameCommon.getInstance().addLikeTips(GameDefine.ROLE_NAME[i] + tipStr)
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

    public getRoleLikeAll(index): number {
        let likeData = UserInfo.curBokData.answerId;
        let likeNum = 0;
        for (let wentiID in likeData) {
            if (likeData.hasOwnProperty(wentiID)) {
                const wentiModel: Modelwenti = JsonModelManager.instance.getModelwenti()[wentiID];
                if (GameCommon.isChapterInRoleJuqingTree(wentiModel.chapter, UserInfo.curchapter)) {
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
        }
        return likeNum;
    }

    public getSortLike(idx: number = 0) {
        let items = [];
        for (let i: number = 0; i < ROLE_INDEX.SIZE; i++) {
            items.push({
                id: i,
                num: this.getRoleLikeAll(i),
            });
        }
        items.sort((arg1, arg2) => {
            if (arg2.num > arg1.num) {
                return 1;
            } else if (arg2.num < arg1.num) {
                return -1;
            } else {
                return arg1.id - arg2.id;
            }
        });
        return items[idx];
    }

    public getSortLikeAry() {
        let items = [];
        for (let i: number = 0; i < ROLE_INDEX.SIZE; i++) {
            let data = {num: 0, id: i};
            data.num = this.getRoleLikeAll(i);
            items.push(data);
        }
        items.sort(function (arg1, arg2) {
            if (arg2.num > arg1.num) {
                return 1;
            } else if (arg2.num < arg1.num) {
                return -1;
            } else {
                return arg1.id - arg2.id;
            }
        });
        return items;
    }

    public parseChapter(tp, data) {
        let str = data;
        let awardStrAry: string[];
        switch (tp) {
            case FILE_TYPE.ANSWER_FILE:  //问题存档
                // UserInfo.allWenTiAnswer = JSON.parse(data);
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
            case FILE_TYPE.HIDE_FILE:  //隐藏存档 = 章节存档
                // UserInfo.chapterDatas = JSON.parse(data);
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
    public checkJuqingKuaiOpen(kuaiID1: number, kuaiID2: number): boolean {
        return true;
    }

    public addAlert(text: string): void {
        // PromptPanel.getInstance().addPromptError(text);
    }

    public addChengJiuTips(text: string): void {
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

    public onShowBuyTips(id, money, tp) {
        PromptPanel.getInstance().onShowBuyTips(id, money, tp);
    }

    public onShowResultTips(str: string, isRight: boolean = true, btnlabel?: string, callBack?: Function, ...arys) {
    PromptPanel.getInstance().onShowResultTips(str, isRight, btnlabel, callBack, arys);
    }

    public showConfirmTips(desc: string, callBack: Function, desc2?: string): void {
        PromptPanel.getInstance().showConfirmTips(desc, callBack, desc2);
    }

    public showErrorLog(logstr: string): void {
        PromptPanel.getInstance().showErrorLog(logstr);
    }

    public shock(tp: number = 0, iswin: boolean = false) {
        // this.sd.play(0, 1);

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

    public showLoading(): void {
        PromptPanel.getInstance().showLoading();
    }

    //用户钻石余额区间，假设用户钻石数为n，共分为五个区间：n=0、0<n<=50、

    public removeLoading(): void {
        PromptPanel.getInstance().removeLoading();
    }

    //回调函数返回的数据中code（0表示成功处理；非0表示没有成功处理），data（具体的业务数据，具体见案例）

    public async report(evt, params) {
        callbackReport = function (data) {
            if (data.code == 0) {
                GameCommon.getInstance().showCommomTips(JSON.stringify(data));
            } else {
                GameCommon.getInstance().showCommomTips(JSON.stringify(data));
            }
        };
        await platform.report(GameDefine.BOOKID, evt, params)
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
        await platform.getBookConsumeData(GameDefine.BOOKID)
    }

    async reportBusinessEvent(bookId, evtId, optionId) {
        callbackReportBusinessEvent = function (data) {
            //回调函数返回的数据中code（0表示成功处理；非0表示没有成功处理）
            console.log('213');
        };
        await platform.reportBusinessEvent(GameDefine.BOOKID, evtId, optionId)
    }

    async getBusinessEventData(bookId, evtId, optionId) {
        callbackGetBusinessEventData = function (data) {
            //多条查询统计结果
            GameCommon.getInstance().showCommomTips('获取上报' + JSON.stringify(data))
        };
        await platform.getBusinessEventData(GameDefine.BOOKID, evtId, optionId)
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

    public onCleanFile(data) {
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
                UserInfo.curBokData.wentiId[i];
                UserInfo.curBokData.videoNames[id] = cfg1.videoId;
                UserInfo.curBokData.times[id] = 1;
                UserInfo.curBokData.answerId[id] = '';
            }
            if (isClean) {
                UserInfo.curBokData.videoNames[id] = '';
                UserInfo.curBokData.times[id] = 0;
                UserInfo.curBokData.answerId[id] = '';
                UserInfo.curBokData.wentiId.splice(i, 1);
                i = i - 1;
            }
        }
        for (let k in UserInfo.curBokData.videoDic) {
            let videoCfg: Modelshipin = JsonModelManager.instance.getModelshipin()[UserInfo.curBokData.videoDic[k]];
            if (videoCfg) {
                if (videoCfg.juqing >= cfg.id) {
                    UserInfo.curBokData.videoDic[k] = null;
                }
            }
        }
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
    }

    private static getRoleLike(roleIndex) {
        return GameCommon.getInstance().getRoleLikeAll(roleIndex);
    }

    public static getQuestionAnswer(qid) {
        return parseInt(UserInfo.curBokData.answerId[qid]);
    }
}

declare let callbackdeleteBookHistory;
declare let callbackGetBookHistory;
declare let callbackGetBookLastHistory;
declare let callbackGetBookHistoryList;
declare let callbackSaveBookHistory;
declare let callbackReport;
declare let callbackGetUserPlatformData;
declare let callbackGetBookConsumeData;
declare let callbackReportBusinessEvent;
declare let callbackGetBusinessEventData;//查询上报事件


declare let callbackGetBookValues;
