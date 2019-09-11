class ShopManager {
    private static instance: ShopManager = null;
    private _shopDataDict;
    private _openShoucangIds: number[];
    private _openChapterIds: number[];
    public debugShopInfos;

    private constructor() {
        this._openShoucangIds = [];
        this._openChapterIds = [];
    }

    public static getInstance(): ShopManager {
        if (this.instance == null) {
            this.instance = new ShopManager();
        }
        return this.instance;
    }
    public takeOffBookValue(bookId, saleId, currentSlotId, num) {
        callbackTakeOffBookValue = function (data) {
            // var array = JSON.parse(data);
            // for(var k in array)
            // {
            //     var  d = array[k];
            //     this.items[array[k].saleId] = d;
            // }
        }
        platform.takeOffBookValue(GameDefine.BOOKID, saleId, currentSlotId, num);
    }
    /**钻石购买商品**/
    public buyGoods(itemId, num: number = 1) {
        var shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (!shopdata) return;
        if (!0) {//platform.isDebug
            this.addGoods(itemId, num);
            this.onBuySuccessHandler(shopdata);
        } else {
            var self = this;
            callbackBuyGoods = function (data) {
                let recData = JSON.parse(data.data);
                let shopinfo = JSON.parse(recData.value);
                if (data.code == 0) {
                    shopdata = self._shopDataDict[recData.saleId];
                    if (shopdata) {
                        shopdata.onupdate(shopinfo);
                        this.onBuySuccessHandler(shopdata);
                    }
                } else {
                    GameCommon.getInstance().addAlert("商品购买失败~errcode:::" + data.code + "~~errmsg:::" + recData.msg);
                }
            }
            var currentSlotId: number = 0;
            platform.buyGoods(GameDefine.BOOKID, itemId, num, currentSlotId);
        }
    }
    public buyGoodsSuip(itemId: number, num: number = 1): void {
        var shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (!shopdata) return;
        if (UserInfo.suipianMoney < shopdata.model.currSuipian) {
            GameCommon.getInstance().onShowResultTips('碎片不足，购买失败！', false);
            return;
        }
        UserInfo.suipianMoney -= shopdata.model.currSuipian;
        this.addGoods(itemId, num);
        this.onBuySuccessHandler(shopdata);
    }
    private onBuySuccessHandler(shopdata: ShopInfoData): void {
        this.onUpdateMyGoods(shopdata);
        if (shopdata.id > GameDefine.SHOP_GOODS_STARTID) {//内购商品
            let shop_tp: number = this.getShopTP(shopdata.id);
            switch (shop_tp) {
                case SHOP_TYPE.IMAGES:
                case SHOP_TYPE.VIDEOS:
                case SHOP_TYPE.MUSICS:
                    let shoucangID: number = parseInt(shopdata.model.params);
                    GameCommon.getInstance().onShowResultTips('购买成功', true, "立刻查看", function (): void {
                        let scCfg: Modelshoucang = JsonModelManager.instance.getModelshoucang()[shoucangID];
                        GameDefine.CUR_ROLEIDX = scCfg.mulu1;
                        if (scCfg.mulu1 == 5) {
                            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShouCangMusicPanel')
                        } else {
                            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShouCangViewPanel')
                        }
                    });
                    break;
                default:
                    GameCommon.getInstance().onShowResultTips('购买成功');
                    break;
            }
        } else if (shopdata.id > GameDefine.SHOP_CHAPTER_STARTID) {//章节
            GameCommon.getInstance().onShowResultTips('购买成功');
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH));
    }
    /**物品存储**/
    public addGoods(itemId: number, num: number = 1) {
        var shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (shopdata) {
            shopdata.num += num;
            GameCommon.getInstance().setBookData(FILE_TYPE.GOODS_FILE);
        }
    }
    /**获取商品信息列表**/
    public getShopInfos() {
        // if (!this._shopDataDict) {
        if (!0) {//测试版数据platform.isDebug
            if (!this._shopDataDict) {
                platform.getBookHistory(GameDefine.BOOKID, FILE_TYPE.GOODS_FILE);
                let values = [];
                for (let id in JsonModelManager.instance.getModelshop()) {
                    let model: Modelshop = JsonModelManager.instance.getModelshop()[id];
                    let valueObj = { saleId: model.id, currPrice: model.currPrice, origPrice: model.origPrice };
                    values.push(valueObj);
                }
                this.onInitShopInfos(values);
            } else if (this.debugShopInfos) {
                for (let id in this.debugShopInfos) {
                    let valueObj = this.debugShopInfos[id];
                    let shopData: ShopInfoData = this._shopDataDict[id];
                    if (shopData) {
                        shopData.num = valueObj.num;
                        this.onUpdateMyGoods(shopData);
                    }
                }
            }
        } else {//正式版本数据
            var self = this;
            var callbackGetBookValues = function (data) {
                if (data.code == 0) {
                    let values = JSON.parse(data.data).value;
                    this.onInitShopInfos(values);
                } else {
                    GameCommon.getInstance().addAlert("获取商品列表失败~errcode:::" + data.code);
                }
            }
            var currentSlotId: number = 0;
            platform.getBookValues(GameDefine.BOOKID, currentSlotId, callbackGetBookValues);
        }
        // }
    }
    /**初始化商城数据**/
    private onInitShopInfos(values): void {
        this._shopDataDict = {};
        for (let idx in values) {
            let info = values[idx];
            if (info.saleId < GameDefine.SHOP_GOODS_STARTID) continue;
            // if (info.currPrice == 0) continue;
            let shopData: ShopInfoData = new ShopInfoData(info);
            if (shopData.model) this._shopDataDict[shopData.id] = shopData;
            else egret.log("策划表SHOP没有ID：：" + shopData.saleId);

            this.onUpdateMyGoods(shopData);
        }
    }
    /**获取商品总列表**/
    public get shopInfoDict() {
        return this._shopDataDict;
    }
    /**获取ID商品信息**/
    public getShopInfoData(id: number) {
        return this._shopDataDict[id];
    }
    /**获取内购商品的ID**/
    public getShopTP(id: number): number {
        return Math.floor(id / GameDefine.SHOP_GOODS_STARTID);
    }
    /**更新内购商品状态**/
    private onUpdateMyGoods(info: ShopInfoData): void {
        if (!info || info.num == 0) return;
        if (info.id > GameDefine.SHOP_GOODS_STARTID) {//内购商品
            let shop_tp: number = this.getShopTP(info.id);
            switch (shop_tp) {
                case SHOP_TYPE.CHAPTER:
                    let chapterParms: string[] = info.model.params.split('#');
                    for (let i: number = 0; i < chapterParms.length; i++) {
                        let chapterID: number = parseInt(chapterParms[i]);
                        if (this._openChapterIds.indexOf(chapterID) == -1) {
                            this._openChapterIds.push(chapterID);
                        }
                    }
                    break;
                case SHOP_TYPE.IMAGES:
                case SHOP_TYPE.VIDEOS:
                case SHOP_TYPE.MUSICS:
                    let shoucangID: number = parseInt(info.model.params);
                    if (this._openShoucangIds.indexOf(shoucangID) == -1) {
                        this._openShoucangIds.push(shoucangID);
                    }
                    break;
                case SHOP_TYPE.DAOJU:
                    break;
                case SHOP_TYPE.XINSHOUBAO:
                    let goodsIDAry: string[] = info.model.params.split(",");
                    for (let i: number = 0; i < goodsIDAry.length; i++) {
                        let goodsid: number = parseInt(goodsIDAry[i]);
                        let shopData: ShopInfoData = this.getShopInfoData(goodsid);
                        this.addGoods(goodsid);
                        this.onUpdateMyGoods(shopData);
                    }
                    break;
            }
        } else if (info.id > GameDefine.SHOP_CHAPTER_STARTID) {//章节
            if (info.num > 0 || info.currPrice == 0) {
                let chapterID: number = parseInt(info.model.params);
                if (this._openChapterIds.indexOf(chapterID) == -1) {
                    this._openChapterIds.push(chapterID);
                }
            }
        }
    }
    /**判断某章节是否开通**/
    public onCheckChapterOpen(chapterID: number): boolean {
        return this._openChapterIds.indexOf(chapterID) >= 0;
    }
    /**判断某收藏是否开通**/
    public onCheckShoucangOpen(shoucangID: number): boolean {
        return this._openShoucangIds.indexOf(shoucangID) >= 0;
    }
    //The end
}
class ShopInfoData {
    public model: Modelshop;
    public id: number;
    public saleId: string;//商品id
    public saleIntro: string = "";//  物品描述
    public origPrice: number = 0;//	单个物品原价	单位钻石
    public currPrice: number = 0;	//	单个物品现价	单位钻石
    public pay: number = 1;//	单个物品的付费标记位	1付费2折扣4限免8免费16优惠32已购买
    public num: number = 0;//	单个物品的已拥有数量	个
    public date: number = 0;//时间

    public constructor(info?: any) {
        if (info) {
            this.onupdate(info);
        }
    }
    public onupdate(info): void {
        this.saleId = info.saleId;
        this.id = parseInt(this.saleId);
        this.currPrice = info.currPrice;
        if (info.pay) this.pay = info.pay;
        if (info.origPrice) this.currPrice = info.origPrice;
        if (info.saleIntro) this.saleIntro = info.saleIntro;
        if (info.num) this.num = info.num;
        if (info.date) this.date = info.date;
        this.model = JsonModelManager.instance.getModelshop()[this.id];
    }
}
enum SHOP_TYPE {
    IMAGES = 1,//图集
    VIDEOS = 2,//视频
    MUSICS = 3,//音乐
    CHAPTER = 4,//章节
    DAOJU = 5,//道具
    XINSHOUBAO = 99,//新手包
}
declare var callbackBuyGoods;
declare var callbackTakeOffBookValue;