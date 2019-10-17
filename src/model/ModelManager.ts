/**
 *
 * @author
 *
 */
class ModelManager {
    private static instance: ModelManager;
    public configJson = {};
    public JOSN_GID = {};

    private _modelFavorable;
    

    public constructor() {
        this.init();
    }

    public static getInstance(): ModelManager {
        if (this.instance == null) {
            this.instance = new ModelManager();
        }
        return this.instance;
    }

    public onModelReset(type: number = 0): void {
        switch (type) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
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
