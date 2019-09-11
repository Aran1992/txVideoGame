class ChengJiuManager {
    private static instance: ChengJiuManager = null;
    private videoData: VideoData;
    public cjAllCfgs;
    public shoucangCfgs;
    public maxChengJiu: number;
    public curChapterChengJiu;
    private constructor() {
        this.cjAllCfgs = JsonModelManager.instance.getModelchengjiu();
        this.curChapterChengJiu = {};

        this.shoucangCfgs = JsonModelManager.instance.getModelshoucang();
    }
    public getMaxChengJiuMax(): number {
        this.maxChengJiu = 0;
        for (var k in this.cjAllCfgs) {
            this.maxChengJiu += 1;
        }
        return this.maxChengJiu;
    }
    public static getInstance(): ChengJiuManager {
        if (this.instance == null) {
            this.instance = new ChengJiuManager();
        }
        return this.instance;
    }
    private onGetAllChengJiu() {

    }
    //多个条件的
    private isPush: boolean = false;
    public parseChengJiu(cjId, wentiId, answerId, mod) {
        let cfgCanshu = mod.canshu;
        this.isPush = false;
        answerId = answerId.toString();
        var cData = UserInfo.achievementDics[cjId];
        let canshu = cData.canshu.toString();
        cData.iscomplete = 0;
        if (cfgCanshu.indexOf(';') >= 0) {
            let canshuArr: string[];
            canshuArr = cfgCanshu.split(";");
            for (var ik: number = 0; ik < canshuArr.length; ik++) {
                if (canshuArr[ik].indexOf(',') >= 0) {
                    var wentiAry: string[];
                    wentiAry = canshuArr[ik].split(",");
                    for (var j1: number = 0; j1 < wentiAry.length; j1++) {
                        if (wentiAry[j1] == answerId) {
                            if (canshu.length < cfgCanshu.length) {
                                if(canshu=='')
                                {
                                canshu = wentiId + ',' + answerId;
                                }
                                else
                                {
                                canshu = canshu + ';' + wentiId + ',' + answerId;
                                }
                                cData.canshu = canshu;
                                this.isPush = true;
                                cData.iscomplete = 0;
                                if (canshu.length >= cfgCanshu.length && cData.iscomplete == 0&&cfgCanshu==canshu) {
                                    cData.iscomplete = 1;
                                    ChengJiuManager.getInstance().curChapterChengJiu[cjId] = cjId;
                                    GameCommon.getInstance().addChengJiuTips(mod.titleID);
                                }
                            }
                            break;
                        }
                    }
                    if (this.isPush) {
                        break;
                    }
                }
            }
        }
        else if (cfgCanshu.indexOf('|') >= 0) {
            let canshuArr: string[];
            canshuArr = cfgCanshu.split("|");
            for (var i: number = 0; i < canshuArr.length; i++) {
                if (canshuArr[i].indexOf(',') >= 0) {
                    var wentiAry: string[];
                    wentiAry = canshuArr[i].split(",");
                    for (var j: number = 0; j < wentiAry.length; j++) {
                        if (wentiAry[j] == answerId) {
                            if (canshu.length < cfgCanshu.length) {
                                canshu = canshu + wentiId + ',' + answerId + '|';
                                cData.canshu = canshu;
                                cData.iscomplete = 1;
                                ChengJiuManager.getInstance().curChapterChengJiu[cjId] = cjId;
                                GameCommon.getInstance().addChengJiuTips(mod.titleID);
                            }
                        }
                    }
                }
            }
        }
        else {
            if (cfgCanshu.indexOf(',') >= 0) {
                var wentiAry: string[];
                wentiAry = cfgCanshu.split(",");

                if (wentiModels[wentiAry[0]]) {
                    for (var j2: number = 0; j2 < wentiAry.length; j2++) {
                        if (wentiAry[j2] == answerId) {
                            if (canshu.length < cfgCanshu.length) {
                                canshu = canshu + ',' + answerId;
                                cData.canshu = canshu;
                                cData.iscomplete = 1;
                                ChengJiuManager.getInstance().curChapterChengJiu[cjId] = cjId;
                            }
                        }
                    }
                } else {
                    this.specialChengJiu(cjId, wentiId, answerId, wentiAry);
                }

            }
        }

        cData.chapterId = UserInfo.curchapter;
        UserInfo.achievementDics[cjId] = cData;
    }
    private specialChengJiu(cjId, wentiId, answerId, cjwenti) {
        let _constantDict = JsonModelManager.instance.getModelconstant();
        let model: Modelconstant = _constantDict[cjwenti[0]];
        let num: number = Number(cjwenti[1]);
        let index: number = 0;
        let ansData: AnswerData = UserInfo.ansWerData;
        if (model.value.indexOf(';') >= 0) {
            let allwentiAry: string[];
            allwentiAry = model.value.split(";");
            for (var j: number = 0; j < allwentiAry.length; j++) {
                let wentiAry = allwentiAry[j].split(',');
                if (ansData.wentiId[wentiAry[0]]) {
                    if (ansData.answerId[wentiAry[0]].indexOf(',') >= 0)//检测存储的问题是不是存了多个答案 从答案中筛选是否符合当前成就问题
                    {
                        let wtAry = ansData.answerId[wentiAry[0]].split(',');
                        for (var i: number = 0; i < wtAry.length; i++) {
                            if (wtAry[i] == answerId) {
                                index = index + 1;
                            }
                        }
                    }
                    else {
                        if (ansData.answerId[wentiAry[0]] == answerId) {
                            index = index + 1;
                        }
                    }
                }
            }

        }
    }
    public onDlcChengJiu(id) {
        var cfgs = ChengJiuManager.getInstance().cjAllCfgs
        for (var k in cfgs) {
            if (cfgs[k].canshu == id && !UserInfo.achievementDics[cId]) {
                var cId = cfgs[k].id;
                var cData1: ChengJiuData = new ChengJiuData();
                cData1.id = cId;
                cData1.canshu = id;
                cData1.iscomplete = 1;
                cData1.chapterId = UserInfo.curchapter;
                UserInfo.achievementDics[cId] = cData1;
                ChengJiuManager.getInstance().curChapterChengJiu[cId] = cId;
                ChengJiuManager.getInstance().curChapterChengJiu[cId] = cId;
                GameCommon.getInstance().addChengJiuTips('chengjiudacheng');
                // GameCommon.getInstance().setBookData(FILE_TYPE.CHENGJIU_FILE);
            }
        }
    }
    /*检测看视频成就逻辑*/
    public onCheckShiPinChengJiu(chengjiuId) {
        var callBackonCheckChengJiuShiPin = function (chengjiuId) {
            var mod: Modelchengjiu = ChengJiuManager.getInstance().cjAllCfgs[chengjiuId];
            if (mod) {
                if (!UserInfo.achievementDics[chengjiuId]) {
                    var cData1: ChengJiuData = new ChengJiuData();
                    cData1.id = chengjiuId;
                    cData1.canshu = mod.canshu;
                    cData1.iscomplete = 0;
                    if (cData1.canshu.length == mod.canshu.length) {
                        GameCommon.getInstance().addChengJiuTips(mod.titleID);
                        ChengJiuManager.getInstance().curChapterChengJiu[chengjiuId] = chengjiuId;
                        cData1.iscomplete = 1;
                        ChengJiuManager.getInstance().curChapterChengJiu[chengjiuId] = chengjiuId;
                    }
                    cData1.chapterId = UserInfo.curchapter;
                    UserInfo.achievementDics[chengjiuId] = cData1;
                    // UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
                    // GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE)
                }

            }
        }
        callBackonCheckChengJiuShiPin(chengjiuId);
    }

    /*检测成就逻辑*/
    public onCheckChengJiu(cjId, wentiId, answerId) {
        cjId = cjId.toString();
        var callBackonCheckChengJiu = function (cjId, wentiId, answerId) {
            var mod: Modelchengjiu = ChengJiuManager.getInstance().cjAllCfgs[cjId];
            if (mod) {
                if (UserInfo.achievementDics[cjId]) {
                    //多个条件的走这里
                    ChengJiuManager.getInstance().parseChengJiu(cjId, wentiId, answerId, mod);
                }
                else {
                    var cData1: ChengJiuData = new ChengJiuData();
                    cData1.id = cjId;
                    cData1.canshu = wentiId + ',' + answerId;
                    cData1.iscomplete = 0;
                    if (cData1.canshu.length >= mod.canshu.length) {
                        GameCommon.getInstance().addChengJiuTips(mod.titleID);
                        cData1.iscomplete = 1;
                        ChengJiuManager.getInstance().curChapterChengJiu[cjId] = cjId;
                    }
                    cData1.chapterId = UserInfo.curchapter;
                    UserInfo.achievementDics[cjId] = cData1;
                }
                // GameCommon.getInstance().setBookData(FILE_TYPE.CHENGJIU_FILE)
                // GameCommon.getInstance().setBookData(FILE_TYPE.COLLECTION_FILE);
            }
        }
        if (cjId.indexOf(',') >= 0) {
            var cjAry: string[];
            cjAry = cjId.split(",");
            for (var i: number = 0; i < cjAry.length; i++) {
                callBackonCheckChengJiu(cjAry[i], wentiId, answerId);
            }
        }
        else {
            callBackonCheckChengJiu(cjId, wentiId, answerId);
        }
    }
    /*检测是不是新选择的问题答案*/
    public onCheckAnswer(wentiId, answerId) {
        if (UserInfo.ansWerData)//先判断有没有存过  
        {
            var ansData: AnswerData = UserInfo.ansWerData;//存过的话
            if (wentiModels[wentiId]) {
                ansData.wentiId[wentiId] = wentiId;
                if (ansData.answerId[wentiId]) {
                    var str1 = ansData.answerId[wentiId].toString();
                    var awardStrAry: string[];
                    if (str1.indexOf(",") >= 0) {
                        awardStrAry = str1.split(",");
                        var idx: number = 0;
                        for (var j: number = 0; j < awardStrAry.length; j++) {
                            if (Number(awardStrAry[j]) == Number(answerId)) {
                                idx = 1;
                            }
                        }
                        if (idx == 0) {
                            ansData.answerId[wentiId] = ansData.answerId[wentiId] + ',' + answerId;
                            UserInfo.ansWerData = ansData;
                            // GameCommon.getInstance().setBookData(FILE_TYPE.ANSWER_FILE);
                            //如果是成就问题  走一下成就存储逻辑// 暂时先主调
                            var cfgs = answerModels[wentiId];
                            for (var k in cfgs) {
                                if (cfgs[k].ansid == answerId) {
                                    if (cfgs[k].chengjiuId) {
                                        this.onCheckChengJiu(cfgs[k].chengjiuId, wentiId, answerId);
                                    }
                                }
                            }
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        if (str1 != answerId) {
                            ansData.answerId[wentiId] = ansData.answerId[wentiId] + ',' + answerId
                            UserInfo.ansWerData = ansData;
                            // GameCommon.getInstance().setBookData(FILE_TYPE.ANSWER_FILE);
                            //如果是成就问题  走一下成就存储逻辑// 暂时先主调
                            var cfgs = answerModels[wentiId];
                            for (var k in cfgs) {
                                if (cfgs[k].ansid == answerId) {
                                    if (cfgs[k].chengjiuId) {
                                        this.onCheckChengJiu(cfgs[k].chengjiuId, wentiId, answerId);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    //没存过这个问题  //检测是否有达成成就  
                    ansData.answerId[wentiId] = answerId;
                    UserInfo.ansWerData= ansData;
                    // GameCommon.getInstance().setBookData(FILE_TYPE.ANSWER_FILE);
                    //如果是成就问题  走一下成就存储逻辑// 暂时先主调
                    var cfgs = answerModels[wentiId];
                    for (var k in cfgs) {
                        if (cfgs[k].ansid == answerId) {
                            if (cfgs[k].chengjiuId) {

                                this.onCheckChengJiu(cfgs[k].chengjiuId, wentiId, answerId);
                            }
                        }
                    }
                }
            }
        }
        else {   //没有存过数据的话走这里
            var ansData: AnswerData = new AnswerData();
            VideoManager.getInstance().log(JSON.stringify(UserInfo.curBokData.wentiId));
            for (var key in UserInfo.curBokData.wentiId) {
                let wentiId = UserInfo.curBokData.wentiId[key];
                if (wentiModels[wentiId]) {
                    ansData.wentiId[wentiId] = wentiId;
                    ansData.answerId[wentiId] = answerId;
                    //如果是成就问题  走一下成就存储逻辑// 暂时先主调
                    var cfgs = answerModels[wentiId];
                    for (var k in cfgs) {
                        if (cfgs[k].ansid == answerId) {
                            if (cfgs[k].chengjiuId) {
                                this.onCheckChengJiu(cfgs[k].chengjiuId, wentiId, answerId);
                            }
                        }
                    }
                }
            }
            UserInfo.ansWerData = ansData;
        }
        // GameCommon.getInstance().setBookData(FILE_TYPE.ANSWER_FILE);
    }
    /*解锁收藏*/
    public onParseShouCang(shouCangId) {
        UserInfo.allCollectionDatas[shouCangId] = shouCangId;
        // GameCommon.getInstance().setBookData(FILE_TYPE.ANSWER_FILE);
    }
}
enum CHENGJIU_TYPE {
    PLOT = 1,//剧情
    DLC = 2,//DLC
    LIKE = 3,//好感度
    END = 4,//结局成就
}