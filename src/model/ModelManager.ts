/**
 *
 * @author 
 *
 */
class ModelManager {
    public configJson = {};
    public JOSN_GID = {};

    private static instance: ModelManager;
    // public modelMapWave = [];

    public constructor() {
        this.init();
    }

    public static getInstance(): ModelManager {
        if (this.instance == null) {
            this.instance = new ModelManager();
        }
        return this.instance;
    }
    private init(): void {
        /**JSON表中需要二级ID的请在这里填一下**/
        this.JOSN_GID["answer"] = "qid";
        this.JOSN_GID["shop"] = "type1";
        // this.JOSN_GID["chengjiu"] = "tp1";
        this.JOSN_GID["zimu"] = "videoId";
        // this.JOSN_GID["shoucang"] = "mulu1";
        this.JOSN_GID["geci"] = "videoId";
        this.JOSN_GID["juqingkuai"] = "show";
        
    }
    /**----------（旧的 待删除）数据结构----------------**/
    // private _modelXuezhan;
    // public get modelXuezhan(): Object {
    //     if (!this._modelXuezhan) {
    //         this._modelXuezhan = {};
    //         this.initModel(this._modelXuezhan, ModelXuezhan, "xuezhan.xml");
    //     }
    //     return this._modelXuezhan;
    // }
    // private _modelPsychAdvance;
    // public get modelPsychAdvance(): Object {
    //     if (!this._modelPsychAdvance) {
    //         this._modelPsychAdvance = {};
    //         this.initModel(this._modelPsychAdvance, ModelPsychAdvance, "yuanhunLv.xml");
    //     }
    //     return this._modelPsychAdvance;
    // }

    // private _modelChouQian;
    // public get modelChouQian(): Object {
    //     if (!this._modelChouQian) {
    //         this._modelChouQian = {};
    //         this.initModel(this._modelChouQian, ModelChouQian, "chouqian.xml");
    //     }
    //     return this._modelChouQian;
    // }

    // private _modelTansuo;
    // public get modelTansuo(): ModelTansuo[] {
    //     if (!this._modelTansuo) {
    //         this._modelTansuo = [];
    //         this.initModel(this._modelTansuo, ModelTansuo, "tansuo.xml");
    //     }
    //     return this._modelTansuo;
    // }

    // private _modelSevDayLogin;
    // public get modelSevDayLogin(): Object {
    //     if (!this._modelSevDayLogin) {
    //         this._modelSevDayLogin = {};
    //         this.initModel(this._modelSevDayLogin, ModelSevDayLogin, "sign7.xml");
    //     }
    //     return this._modelSevDayLogin;
    // }

    // private _modelSevDayObjective;
    // public get modelSevDayObjective(): Object {
    //     if (!this._modelSevDayObjective) {
    //         this._modelSevDayObjective = {};
    //         this.initModel(this._modelSevDayObjective, ModelSevDayObjective, "activity7.xml");
    //     }
    //     return this._modelSevDayObjective;
    // }

    // private _modelOnlineGift;
    // public get modelOnlineGift(): Object {
    //     if (!this._modelOnlineGift) {
    //         this._modelOnlineGift = {};
    //         this.initModel(this._modelOnlineGift, ModelOnlineGift, "zaixianlibao.xml");
    //     }
    //     return this._modelOnlineGift;
    // }
    // private _modelShentong;//神通表
    // public get modelShentong(): Object {
    //     if (!this._modelShentong) {
    //         this._modelShentong = {};
    //         this.initModel(this._modelShentong, ModelShentong, "shentong.xml");
    //     }
    //     return this._modelShentong;
    // }

    // private _modelShentongLv;//神通等级表
    // public get modelShentongLv(): Object {
    //     if (!this._modelShentongLv) {
    //         this._modelShentongLv = {};
    //         this.initModel(this._modelShentongLv, ModelShentongLv, "shentongLv.xml");
    //     }
    //     return this._modelShentongLv;
    // }

    // private _modelShentongGrade;//神通进阶表
    // public get modelShentongGrade(): Object {
    //     if (!this._modelShentongGrade) {
    //         this._modelShentongGrade = {};
    //         this.initModel(this._modelShentongGrade, ModelShentongGrade, "shentongJieduan.xml");
    //     }
    //     return this._modelShentongGrade;
    // }

    // private _modelWudaoConsume;//悟道消耗表
    // public get modelWudaoConsume(): Object {
    //     if (!this._modelWudaoConsume) {
    //         this._modelWudaoConsume = {};
    //         this.initModel(this._modelWudaoConsume, ModelWudao, "wudao.xml");
    //     }
    //     return this._modelWudaoConsume;
    // }

    // private _modelRebate;
    // public get modelRebate(): Object {
    //     if (!this._modelRebate) {
    //         this._modelRebate = {};
    //         this.initModel(this._modelRebate, ModelRebate, "baibeifanli.xml");
    //     }
    //     return this._modelRebate;
    // }

    // private _modelRebateQianbei;
    // public get modelRebateQianbei(): Object {
    //     if (!this._modelRebateQianbei) {
    //         this._modelRebateQianbei = {};
    //         this.initModel(this._modelRebateQianbei, ModelRebateQianbei, "qianbeifanli.xml");
    //     }
    //     return this._modelRebateQianbei;
    // }

    // private _modelInvest;
    // public get modelInvest(): Object {
    //     if (!this._modelInvest) {
    //         this._modelInvest = {};
    //         this.initModel(this._modelInvest, ModelInvest, "touzijihua.xml");
    //     }
    //     return this._modelInvest;
    // }

    // private _modelTLShop;
    // public get modelTLShop(): Object {
    //     if (!this._modelTLShop) {
    //         this._modelTLShop = {};
    //         this.initModel(this._modelTLShop, ModelTLShop, "xianshishop.xml");
    //     }
    //     return this._modelTLShop;
    // }

    // private _modelTLGift;
    // public get modelTLGift(): Object {
    //     if (!this._modelTLGift) {
    //         this._modelTLGift = {};
    //         this.initModel(this._modelTLGift, ModelTLGift, "xianshiyouli.xml");
    //     }
    //     return this._modelTLGift;
    // }

    // private _modelTurnplate;
    // public get modelTurnplate(): Object {
    //     if (!this._modelTurnplate) {
    //         this._modelTurnplate = {};
    //         this.initModel(this._modelTurnplate, ModelTurnplate, "zhuanpan.xml");
    //     }
    //     return this._modelTurnplate;
    // }

    // private _modelTopRankGift;
    // public get modelTopRankGift(): Object {
    //     if (!this._modelTopRankGift) {
    //         this._modelTopRankGift = {};
    //         this.initModel(this._modelTopRankGift, ModelTopRankGift, "chongbangjiangli.xml");
    //     }
    //     return this._modelTopRankGift;
    // }

    // private _modelUnionTurnplate;
    // public get modelUnionTurnplate(): Object {
    //     if (!this._modelUnionTurnplate) {
    //         this._modelUnionTurnplate = {};
    //         this.initModel(this._modelUnionTurnplate, ModelUnionTurnplate, "guildDial.xml");
    //     }
    //     return this._modelUnionTurnplate;
    // }
    // private _modelThrone;
    // public get modelThrone(): Object {
    //     if (!this._modelThrone) {
    //         this._modelThrone = {};
    //         this.initModel(this.modelThrone, ModelThrone, "wutan.xml");
    //     }
    //     return this._modelThrone;
    // }
    // private _modelVIPTLShop;
    // public get modelVIPTLShop(): Object {
    //     if (!this._modelVIPTLShop) {
    //         this._modelVIPTLShop = {};
    //         this.initModel(this._modelVIPTLShop, ModelVIPTLShop, "vipShopXianShi.xml");
    //     }
    //     return this._modelVIPTLShop;
    // }
    // private _modelVIPTLGift;
    // public get modelVIPTLGift(): Object {
    //     if (!this._modelVIPTLGift) {
    //         this._modelVIPTLGift = {};
    //         this.initModel(this._modelVIPTLGift, ModelVIPTLGift, "vipShopFuLi.xml");
    //     }
    //     return this._modelVIPTLGift;
    // }
    // private _modelCoatard;
    // public get modelCoatard(): Object {
    //     if (!this._modelCoatard) {
    //         this._modelCoatard = {};
    //         this.initModel(this._modelCoatard, ModelCoatar, "xiuzhen.xml");
    //     }
    //     return this._modelCoatard;
    // }
    // private _modelCrashcow;
    // public get modelCrashcow(): Object {
    //     if (!this._modelCrashcow) {
    //         this._modelCrashcow = {};
    //         this.initModel(this._modelCrashcow, ModelCrashcow, "crashcow.xml");
    //     }
    //     return this._modelCrashcow;
    // }
    // private _modelCollectWord;
    // public get modelCollectWord(): Object {
    //     if (!this._modelCollectWord) {
    //         this._modelCollectWord = {};
    //         this.initModel(this._modelCollectWord, ModelCollectWord, "springWordCollection.xml");
    //     }
    //     return this._modelCollectWord;
    // }
    // private _modelTLDogz;
    // public get modelTLDogz(): Object {
    //     if (!this._modelTLDogz) {
    //         this._modelTLDogz = {};
    //         this.initModel(this._modelTLDogz, ModelTLDogz, "xianshizuoji.xml");
    //     }
    //     return this._modelTLDogz;
    // }
    // private _modelSignIn;
    // public get modelSignIn(): Object {
    //     if (!this._modelSignIn) {
    //         this._modelSignIn = {};
    //         this.initModel(this._modelSignIn, ModelSignIn, "signchunjie.xml");
    //     }
    //     return this._modelSignIn;
    // }

    // private _modelSpringTLShop;
    // public get modelSpringTLShop(): Object {
    //     if (!this._modelSpringTLShop) {
    //         this._modelSpringTLShop = {};
    //         this.initModel(this._modelSpringTLShop, ModelSpringTLShop, "chunjiexianshishop.xml");
    //     }
    //     return this._modelSpringTLShop;
    // }
    // private _modelTotalConsume;
    // public get modelTotalConsume(): Object {
    //     if (!this._modelTotalConsume) {
    //         this._modelTotalConsume = {};
    //         this.initModel(this._modelTotalConsume, ModelTotalConsume, "leijixiaofei.xml");
    //     }
    //     return this._modelTotalConsume;
    // }
    // private _modelOneDollar;
    // public get modelOneDollar(): Object {
    //     if (!this._modelOneDollar) {
    //         this._modelOneDollar = {};
    //         this.initModel(this._modelOneDollar, ModelOneDollar, "yiyuanlibao.xml");
    //     }
    //     return this._modelOneDollar;
    // }
    // private _modelLuckTurnplate;
    // public get modelLuckTurnplate(): Object {
    //     if (!this._modelLuckTurnplate) {
    //         this._modelLuckTurnplate = {};
    //         this.initModel(this._modelLuckTurnplate, ModelLuckTurnplate, "touzizhuanpan.xml");
    //     }
    //     return this._modelLuckTurnplate;
    // }
    // private _modelSpatBlood;
    // public get modelSpatBlood(): Object {
    //     if (!this._modelSpatBlood) {
    //         this._modelSpatBlood = {};
    //         this.initModel(this._modelSpatBlood, ModelSpatBlood, "yiyuanqiangou.xml");
    //     }
    //     return this._modelSpatBlood;
    // }
    // private _modelOneRebateST;
    // public get modelOneRebateST(): Object {
    //     if (!this._modelOneRebateST) {
    //         this._modelOneRebateST = {};
    //         this.initModel(this._modelOneRebateST, ModelOneRebateST, "yizheshentong.xml");
    //     }
    //     return this._modelOneRebateST;
    // }
    // private _modelOrangeFeast;
    // public get modelOrangeFeast(): Object {
    //     if (!this._modelOrangeFeast) {
    //         this._modelOrangeFeast = {};
    //         this.initModel(this._modelOrangeFeast, ModelOrangeFeast, "chixugoumai.xml");
    //     }
    //     return this._modelOrangeFeast;
    // }
    // private _modelRebirth;
    // public get modelRebirth(): Object {
    //     if (!this._modelRebirth) {
    //         this._modelRebirth = {};
    //         this.initModel(this._modelRebirth, ModelRebirth, "zhuansheng.xml");
    //     }
    //     return this._modelRebirth;
    // }
    // private _modelMagicUpdate;
    // public get modelMagicUpdate(): Object {
    //     if (!this._modelMagicUpdate) {
    //         this._modelMagicUpdate = {};
    //         this.initModel(this._modelMagicUpdate, ModelMagicUpdate, "fabaoshengji.xml");
    //     }
    //     return this._modelMagicUpdate;
    // }
    // private _modelMagicAdvance;
    // public get modelMagicAdvance(): Object {
    //     if (!this._modelMagicAdvance) {
    //         this._modelMagicAdvance = {};
    //         this.initModel(this._modelMagicAdvance, ModelMagicAdvance, "fabaojinjie.xml");
    //     }
    //     return this._modelMagicAdvance;
    // }
    // private _modelMagicTreasure;
    // public get modelMagicTreasure(): Object {
    //     if (!this._modelMagicTreasure) {
    //         this._modelMagicTreasure = {};
    //         this.initModel(this._modelMagicTreasure, ModelMagicTreasure, "fabaozhuanpan.xml");
    //     }
    //     return this._modelMagicTreasure;
    // }

    // private _modelGuildTask;
    // public get modelGuildTask(): Object {
    //     if (!this._modelGuildTask) {
    //         this._modelGuildTask = {};
    //         this.initModel(this._modelGuildTask, ModelGuildTask, "guildTask.xml");
    //     }
    //     return this._modelGuildTask;
    // }
    // private _modelTreasureRankAward;
    // public get modelTreasureRankAward(): Object {
    //     if (!this._modelTreasureRankAward) {
    //         this._modelTreasureRankAward = {};
    //         this.initModel(this._modelTreasureRankAward, ModelTreasureRankAward, "xunbaobang.xml");
    //     }
    //     return this._modelTreasureRankAward;
    // }
    // private _modelTreasureRankAward2;
    // public get modelTreasureRankAward2(): Object {
    //     if (!this._modelTreasureRankAward2) {
    //         this._modelTreasureRankAward2 = {};
    //         this.initModel(this._modelTreasureRankAward2, ModelTreasureRankAward, "xunbaobang2.xml");
    //     }
    //     return this._modelTreasureRankAward2;
    // }
    // private _modelPayGift;
    // public get modelPayGift(): ModelPayGift[] {
    //     if (!this._modelPayGift) {
    //         this._modelPayGift = [];
    //         this.initModel(this._modelPayGift, ModelPayGift, "leichonghaoli.xml");
    //     }
    //     return this._modelPayGift;
    // }
    // private _modelSevenPay;
    // public get modelSevenPay(): ModelSevenPay[] {
    //     if (!this._modelSevenPay) {
    //         this._modelSevenPay = [];
    //         this.initModel(this._modelSevenPay, ModelSevenPay, "lianxuchongzhi.xml");
    //     }
    //     return this._modelSevenPay;
    // }
    // private _modelFestivalSevenPay;
    // public get modelFestivalSevenPay(): ModelSevenPay[] {
    //     if (!this._modelFestivalSevenPay) {
    //         this._modelFestivalSevenPay = [];
    //         this.initModel(this._modelFestivalSevenPay, ModelSevenPay, "duanwuchongzhi.xml");
    //     }
    //     return this._modelFestivalSevenPay;
    // }
    // private _modelWishingWell;
    // public get modelWishingWell(): Object {
    //     if (!this._modelWishingWell) {
    //         this._modelWishingWell = {};
    //         this.initModel(this._modelWishingWell, ModelWishingWell, "xuyuanchi.xml");
    //     }
    //     return this._modelWishingWell;
    // }
    // private _modelLimitPurchase;
    // public get modelLimitPurchase(): Object {
    //     if (!this._modelLimitPurchase) {
    //         this._modelLimitPurchase = {};
    //         this.initModel(this._modelLimitPurchase, ModelLimtPurchase, "xiangoulibao2.xml");
    //     }
    //     return this._modelLimitPurchase;
    // }
    // private _modelLimitPurchase2;
    // public get modelLimitPurchase2(): Object {
    //     if (!this._modelLimitPurchase2) {
    //         this._modelLimitPurchase2 = {};
    //         this.initModel(this._modelLimitPurchase2, ModelLimtPurchase, "duanwuxiangou.xml");
    //     }
    //     return this._modelLimitPurchase2;
    // }
    // private _modelFestivalWishingwell;
    // public get modelFestivalWishingwell(): Object {
    //     if (!this._modelFestivalWishingwell) {
    //         this._modelFestivalWishingwell = {};
    //         this.initModel(this._modelFestivalWishingwell, ModelFestivalWishingwell, "xuyuanchi2.xml");
    //     }
    //     return this._modelFestivalWishingwell;
    // }
    // private _modelFestivalTurnplate;
    // public get modelFestivalTurnplate(): Object {
    //     if (!this._modelFestivalTurnplate) {
    //         this._modelFestivalTurnplate = {};
    //         this.initModel(this._modelFestivalTurnplate, ModelFestivalWishingwell, "duanwuzhuanpan.xml");
    //     }
    //     return this._modelFestivalTurnplate;
    // }
    // private _modelFestivalLogin;
    // public get modelFestivalLogin(): Object {
    //     if (!this._modelFestivalLogin) {
    //         this._modelFestivalLogin = {};
    //         this.initModel(this._modelFestivalLogin, ModelFestivalLogin, "denglu2.xml");
    //     }
    //     return this._modelFestivalLogin;
    // }
    // private _modelFestivalSevenLogin;
    // public get modelFestivalSevenLogin(): Object {
    //     if (!this._modelFestivalSevenLogin) {
    //         this._modelFestivalSevenLogin = {};
    //         this.initModel(this._modelFestivalSevenLogin, ModelFestivalLogin, "duanwudenglu.xml");
    //     }
    //     return this._modelFestivalSevenLogin;
    // }

    // private _modelFestivalTarget;
    // public get modelFestivalTarget(): Object {
    //     if (!this._modelFestivalTarget) {
    //         this._modelFestivalTarget = {};
    //         this.initModel(this._modelFestivalTarget, ModelFestivalTarget, "dabiaohuodong2.xml");
    //     }
    //     return this._modelFestivalTarget;
    // }
    // private _modelPayTarget;
    // public get modelPayTarget(): Object {
    //     if (!this._modelPayTarget) {
    //         this._modelPayTarget = {};
    //         this.initModel(this._modelPayTarget, ModelFestivalTarget, "dabiaohuodong3.xml");
    //     }
    //     return this._modelPayTarget;
    // }
    // private _ModelPetFetter;
    // public get modelPetFetter(): Object {
    //     if (!this._ModelPetFetter) {
    //         this._ModelPetFetter = {};
    //         this.initModel(this._ModelPetFetter, ModelPetFetter, "chongwujiban.xml");
    //     }
    //     return this._ModelPetFetter;
    // }
    // private _modelPetExchange;
    // public get modelPetExchange(): ModelPetExchange[] {
    //     if (!this._modelPetExchange) {
    //         this._modelPetExchange = [];
    //         this.initModel(this._modelPetExchange, ModelPetExchange, "chongwuhecheng.xml");
    //     }
    //     return this._modelPetExchange;
    // }

    // private _ModelPlayCafe;
    // public get modelPlayCafe(): Object {
    //     if (!this._ModelPlayCafe) {
    //         this._ModelPlayCafe = {};
    //         this.initModel(this._ModelPlayCafe, ModelPlayCafe, "wanbazhuanshu.xml");
    //     }
    //     return this._ModelPlayCafe;
    // }

    // private _modelFudai;
    // public get modelFudai(): ModelFudai {
    //     if (!this._modelFudai) {
    //         this._modelFudai = [];
    //         this.initModel(this._modelFudai, ModelFudai, "fudai.xml");
    //     }
    //     return this._modelFudai[0];
    // }
    private _modelFavorable;
    public onModelReset(type: number = 0): void {
        switch (type) {
            case 0:
                // this._modelFavorable = {};
                // this._modelFestivalWishingwell = {};
                // this.initModel(this._modelFavorable, ModelFavorable, "tehuilibao2.xml");
                // this.initModel(this._modelFestivalWishingwell, ModelFestivalWishingwell, "xuyuanchi2.xml");
                break;
            case 1:
                // this._modelFavorable = {};
                // this.initModel(this._modelFavorable, ModelFavorable, "duanwutehui.xml");
                break;
            case 2:
                // this._modelFestivalTarget = {};
                // this.initModel(this._modelFestivalTarget, ModelFestivalTarget, "dabiaohuodong2.xml");
                break;
            case 3:
                // this._modelFestivalTarget = {};
                // this.initModel(this._modelFestivalTarget, ModelFestivalTarget, "duanwudabiao.xml");
                break;
        }
    }
    public onResetModel(modelName, modelClass, xml): void {
        var _models = this["_" + modelName];
        if (!_models) {
            _models = this[modelName];
        }
        if (_models instanceof Array) {
            _models = [];
        } else if (_models instanceof Object) {
            _models = {};
        }
        // this.initModel(_models, modelClass, xml);
    }

    /**-------数据结构结束-------------**/
    /**
	 * 初始化模型
	 * map：数据保存集合
	 * classz：类名
	 * xml：xml的地址
	 */
    // public initModel(map, classz, xml, isAll = false) {
    //     // var time: number = egret.getTimer();
    //     if (map && classz && xml) {
    //         var res: egret.XML = Tool.readZipToXml(xml);
    //         var mapType = 0;
    //         if (map instanceof Array) {
    //             mapType = 1;
    //         }
    //         for (var i = 0; i < res.children.length; ++i) {
    //             var model = new classz();
    //             model.parseXML(<egret.XML>res.children[i]);
    //             if (isAll) {
    //                 map.push(model);
    //                 map[model.id] = model;
    //             } else {
    //                 switch (mapType) {
    //                     case 0:
    //                         map[model.id] = model;
    //                         break;
    //                     case 1:
    //                         map.push(model);
    //                         break;
    //                 }
    //             }
    //         }
    //     } else {
    //         Tool.throwException();
    //     }
    //     // Tool.log(`解析表：${xml}完毕，耗时：${egret.getTimer() - time}`);
    // }
    /**实时解析类型**/
    public parseXmlToModel(map, classz, xml, isAll = false): void {
        if (map && classz && xml) {
            var res: egret.XML = <egret.XML>RES.getRes(xml);
            var mapType = 0;
            if (map instanceof Array) {
                mapType = 1;
            }
            for (var i = 0; i < res.children.length; ++i) {
                var model = new classz();
                model.parseXML(<egret.XML>res.children[i]);
                if (isAll) {
                    map.push(model);
                    map[model.id] = model;
                } else {
                    switch (mapType) {
                        case 0:
                            map[model.id] = model;
                            break;
                        case 1:
                            map.push(model);
                            break;
                    }
                }
            }
        } else {
            Tool.throwException();
        }
    }
    // /**解析累计充值数据**/
    // public initTotalRecharge(): void {
    //     var res: egret.XML = Tool.readZipToXml("model_zzp", "leijichongzhi.xml");
    //     if (res) {
    //         res = <egret.XML>res.children[0];
    //         for (var i = 0; i < res.children.length; ++i) {
    //             var model = new ModelTotalRecharge();
    //             model.parseXML(<egret.XML>res.children[i]);
    //             this.modelTotalRecharge[model.id] = model;
    //         }
    //     } else {
    //         Tool.throwException();
    //     }
    // }

    //The end
}
// class LoadModelParam {
//     public callFunc;
//     public callObj;
//     public param;
//     public modelClass;

//     public constructor(callFunc, callObj, param, modelClass) {
//         this.callFunc = callFunc;
//         this.callObj = callObj;
//         this.param = param;
//         this.modelClass = modelClass;
//     }
// }