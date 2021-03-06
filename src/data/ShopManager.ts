class ShopManager {
    private static instance: ShopManager = null;
    public debugShopInfos;
    private _shopDataDict;
    private _openShoucangIds: number[];
    private _serverItemNums = {};
    private _loadingFromServer = null;

    private constructor() {
        this._openShoucangIds = [];
    }

    /**获取商品总列表**/
    public get shopInfoDict() {
        return this._shopDataDict;
    }

    public static getInstance(): ShopManager {
        if (this.instance == null) {
            this.instance = new ShopManager();
        }
        return this.instance;
    }

    public takeOffAllBookValue() {
        for (let k in this._serverItemNums) {
            if (typeof (this._serverItemNums[k]) == "number" && this._serverItemNums[k] > 0) {
                this.takeOffBookValue(GameDefine.BOOKID, k, 0, this._serverItemNums[k]);//this._serverItemNums[k]
            }
        }
    }

    public takeOffBookValue(bookId, saleId, currentSlotId, num) {
        let callback = (data) => {
            if (data.code == 0) {
                saleId = Number(saleId);
                this._serverItemNums[saleId] = this._serverItemNums[saleId] - num;//data.data.value.num;
                console.log("使用物品：" + saleId + ";" + num + " 剩余:" + this._serverItemNums[saleId]);//data.data.value.num);
            } else {
                console.log((data.msg || data.data.msg) + ";" + saleId + ";" + num);
            }
        };
        platform.takeOffBookValue(GameDefine.BOOKID, saleId, currentSlotId, num, callback);
    }

    /**钻石购买商品**/
    public buyGoods(itemId, num: number = 1, callback: () => void = null) {
        if (ShopManager.getInstance().getItemNum(itemId) > 0) {
            GameCommon.getInstance().showCommomTips("你已经拥有该物品");
            return;
        }
        let shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (!shopdata) return;
        if (platform.getPlatform() === "plat_pc") {
            this.addGoods(itemId, num, callback);
        } else {
            let callbackBuyGoods = (data) => {
                if (platform.getPlatform() == "plat_1001") {
                    let recData = data.data;
                    let jsonObject = data.data.value;
                    if (data.code == 0) {
                        shopdata = this._shopDataDict[jsonObject.saleId];
                        shopdata.updateShopData(jsonObject);
                        this._serverItemNums[jsonObject.saleId] = jsonObject.num;//更新商品数量
                        //console.log("update item:"+jsonObject.saleId+";"+jsonObject.num);
                        this.addGoods(itemId, 0, callback)//需要加0以便能调用到回调函数
                    } else {
                        GameCommon.getInstance().addAlert("商品购买失败~errcode:::" + data.code + "~~errmsg:::" + recData.msg);
                    }
                } else if (platform.getPlatform() == "plat_txsp") {
                    if (data.code == 0) {
                        this._serverItemNums[itemId] = (this._serverItemNums[itemId] || 0) + num;//更新商品数量
                        this.addGoods(itemId, 0, callback)//需要加0以便能调用到回调函数
                    } else {
                        GameCommon.getInstance().addAlert("商品购买失败~errcode:::" + data.code + "~~errmsg:::" + data.msg);
                    }
                }
            };

            platform.buyGoods(GameDefine.BOOKID, itemId, num, 0, callbackBuyGoods);

        }
    }

    public buyGoodsSuip(itemId: number, num: number = 1, callback: any = null): void {
        if (ShopManager.getInstance().getItemNum(itemId) > 0) {
            GameCommon.getInstance().showCommomTips("你已经拥有该物品");
            return;
        }
        let shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (!shopdata) return;
        if (UserInfo.suipianMoney < shopdata.model.currSuipian) {
            GameCommon.getInstance().onShowResultTips('碎片不足，购买失败！', false);
            return;
        }
        UserInfo.suipianMoney -= shopdata.model.currSuipian;
        this.addGoods(itemId, num, callback);
    }

    /**物品存储**/
    public addGoods(itemId: number, num: number = 1, callback: any = null, isBuy: boolean = true) {
        let shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (shopdata) {
            shopdata.num += num;
            GameCommon.getInstance().setBookData(FILE_TYPE.GOODS_FILE);
            this.onBuySuccessHandler(shopdata, isBuy);
            console.log("add item:" + itemId + ";" + num + " left:" + shopdata.num);
        } else {
            console.trace();
        }
        if (callback)
            callback();
    }

    /**获取商品信息列表**/
    public initShopInfos(record?: string) {
        if (!this._shopDataDict) {
            GameCommon.getInstance().getBookHistory(FILE_TYPE.GOODS_FILE);
            this._shopDataDict = {};
            for (let id in JsonModelManager.instance.getModelshop()) {
                let model: Modelshop = JsonModelManager.instance.getModelshop()[id];
                let valueObj = new ValueObject(model);
                let shopData: ShopInfoData = new ShopInfoData(valueObj);
                this._shopDataDict[shopData.id] = shopData;
            }
        }
        if (record) {
            //存档中的数量初始化
            let r = JSON.parse(record);
            for (let itemId in r) {
                let shopdata: ShopInfoData = this._shopDataDict[Number(itemId)];
                shopdata.num = Number(r[itemId].num);
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_NEWPOINT));
        }
        this.loadFromServer();
    }

    //不从服务器上取了。因为TXSP从服务器上也取不到
    public loadFromServer() {
        if (this._loadingFromServer)
            return;
        this._loadingFromServer = true;
        //1001需要从服务器上取得物品数量;loaded代表平台数量是否已获取
        if (platform.getPlatform() == "plat_1001" && !this._serverItemNums["loaded"]) {
            let callback = (data) => {
                this._loadingFromServer = false;
                if (data.code == 0) {
                    let values = data.data.values;//array{currPrice,date,num,origPrice,pay,saleId,saleIntro}
                    values.forEach(element => {
                        this._serverItemNums[element.saleId] = element.num;
                    });
                    this._serverItemNums["loaded"] = true;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_NEWPOINT));
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH), {data: {}});
                    console.log(this._serverItemNums);
                    //把本地的值+服务器的值
                } else {
                    this.loadFromServer();
                }
            };
            let currentSlotId: number = 0;
            platform.getBookValues(GameDefine.BOOKID, currentSlotId, callback);
        }
        if (platform.getPlatform() == "plat_txsp" && !this._serverItemNums["loaded"]) {
            let callback = (data) => {
                this._loadingFromServer = false;
                if (data.code == 0) {
                    for (let product_id in data.result.product_count) {
                        let id = Number(product_id);
                        this._serverItemNums[id] = data.result.product_count[id] - data.result.product_consumed_count[id];
                    }
                    this._serverItemNums["loaded"] = true;
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH), {data: {}});
                } else {
                    this.loadFromServer();
                }
            };
            let itemids = [];
            let t = JsonModelManager.instance.getModelshop();
            for (let id in t) {
                itemids.push(id);
            }
            platform.getBookValues(GameDefine.BOOKID, itemids, callback);
        }
    }

    public getServerItemNum(id) {
        // if (platform.getPlatform()=="plat_txsp")
        //     return 0;
        if (!this._serverItemNums["loaded"]) {
            this.loadFromServer();
            return 0;
        }
        if (id == GameDefine.GUANGLIPINGZHENGEX || id == GameDefine.GUANGLIPINGZHENG) {
            return (this._serverItemNums[GameDefine.GUANGLIPINGZHENGEX] || 0) + (this._serverItemNums[GameDefine.GUANGLIPINGZHENG] || 0);
        }
        return this._serverItemNums[id] || 0;
    }

    public getItemNum(id) {
        // 如果已经关闭会员检查 且 查询的是会员数量 那么就返回1
        if (!GameDefine.ENABLE_CHECK_VIP && (id === GameDefine.GUANGLIPINGZHENG || id === GameDefine.GUANGLIPINGZHENGEX)) {
            return 1;
        }
        let shopdata: ShopInfoData = this._shopDataDict[id] || {num: 0};
        return this.getServerItemNum(id) + shopdata.num
    }

    public canBuyItem(id) {
        const parent = JsonModelManager.instance.getModelshop()[id].parent;
        if (parent && parent.split(",").some(pid => this.getItemNum(parseInt(pid)) > 0)) {
            return false;
        }
        return this.getItemNum(id) <= 0;
    }

    /**获取ID商品信息**/
    public getShopInfoData(id: number): ShopInfoData {
        return this._shopDataDict[id];
    }

    /**获取内购商品的ID**/
    public getShopTP(id: number): number {
        return Math.floor(id / GameDefine.SHOP_GOODS_STARTID);
    }

    //传入0；代表主页面；传入1代表次级页面
    public getNewPoint(idx) {
        let subPoints = [0, 0, 0, 0, 0, 0];//子界面上红点
        var cfgs = ChengJiuManager.getInstance().shoucangCfgs;
        for (var k in cfgs) {
            let id = cfgs[k].id;
            // if (UserInfo.lookAchievement[id] == 1 && !ShopManager.getInstance().onCheckShoucangOpen(id)) {
            //     UserInfo.lookAchievement[id] = 0;
            // }
            if (ShopManager.getInstance().onCheckShoucangOpen(id) && UserInfo.lookAchievement[id] != 1) {
                subPoints[cfgs[k].mulu1 - 1] = subPoints[cfgs[k].mulu1 - 1] + 1;//有N条未读
            }
        }
        if (idx == 0) {
            if (subPoints.join("") == "000000")
                return 0;
            else
                return 1;
        }
        return subPoints[idx - 1];
    }

    /**判断某收藏是否开通**/
    public onCheckShoucangOpen(shoucangID: number): boolean {
        let itemId = shoucangID + SHOP_TYPE.IMAGES * 100000;
        if (shoucangID > 6000) {
            itemId = shoucangID + SHOP_TYPE.MUSICS * 100000;
        } else if (shoucangID > 5000) {
            itemId = shoucangID + SHOP_TYPE.VIDEOS * 100000;
        }
        return !ShopManager.getInstance().canBuyItem(itemId);
    }

    public isVIP() {
        return this.getItemNum(GameDefine.GUANGLIPINGZHENG) > 0 || this.getItemNum(GameDefine.GUANGLIPINGZHENGEX) > 0;
    }

    private onBuySuccessHandler(shopdata: ShopInfoData, isBuy: boolean = true): void {
        this.onUpdateMyGoods(shopdata);
        if (shopdata.id > GameDefine.SHOP_GOODS_STARTID) {//内购商品
            let shop_tp: number = this.getShopTP(shopdata.id);
            switch (shop_tp) {
                case SHOP_TYPE.IMAGES:
                case SHOP_TYPE.VIDEOS:
                case SHOP_TYPE.MUSICS:
                    if (isBuy) {
                        let sp = 0;
                        const shops = JsonModelManager.instance.getModelshop();
                        for (const key in shops) {
                            if (shops.hasOwnProperty(key)) {
                                const shop = shops[key];
                                if (shop.parent && shop.parent.split(",").some(pid => pid == shopdata.id)
                                    && this.getItemNum(shop.id) > 0) {
                                    const map = {
                                        ssr: 500,
                                        sr: 200,
                                        r: 100,
                                    };
                                    sp += map[JsonModelManager.instance.getModelshoucang()[shop.params].level];
                                }
                            }
                        }
                        let tip;
                        if (sp) {
                            UserInfo.suipianMoney = UserInfo.suipianMoney + sp;
                            const map = {
                                "103023": 10,
                                "103024": 10,
                                "103025": 10,
                                "103026": 11,
                            };
                            tip = `购买成功\n获得图集*${map[shopdata.id]} 心动碎片*${sp}\n图集可在"已获福利”中查看`;
                        } else {
                            tip = '购买成功\n可以在“已获福利”中查看';
                        }
                        GameCommon.getInstance().onShowResultTips(tip);
                    } else {
                        GameCommon.getInstance().onShowResultTips('获得物品\n可以在“已获福利”中查看');
                    }
                    GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOUCANG_NEWPOINT));
                    break;
                case SHOP_TYPE.SPECIAL:
                    if (shopdata.id == GameDefine.GUANGLIPINGZHENG || shopdata.id == GameDefine.GUANGLIPINGZHENGEX) {
                    }
                default:
                    GameCommon.getInstance().onShowResultTips('购买成功');
                    break;
            }
        } else if (shopdata.id > GameDefine.SHOP_CHAPTER_STARTID) {//章节
            GameCommon.getInstance().onShowResultTips('购买成功');
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH), shopdata);
    }

    /**更新内购商品状态**/
    private onUpdateMyGoods(info: ShopInfoData): void {
        if (!info || info.num == 0) return;
        if (info.id > GameDefine.SHOP_GOODS_STARTID) {//内购商品
            let shop_tp: number = this.getShopTP(info.id);
            switch (shop_tp) {
                case SHOP_TYPE.CHAPTER:
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
                case SHOP_TYPE.SPECIAL:
                    break;
            }
        }
    }

    //The end
}

class ShopInfoData {
    public model: Modelshop;
    public id: number;
    public saleId: string;//商品id
    public saleIntro: string = "";//  物品描述
    public pay: number = 1;//	单个物品的付费标记位	1付费2折扣4限免8免费16优惠32已购买
    public num: number = 0;//	单个物品的已拥有数量	个
    public date: number = 0;//时间
    private info: any;

    public constructor(info?: any) {
        if (info) {
            this.updateShopData(info);
        }
    }

    public get origPrice(): number {
        return this.info.origPrice;
    }

    public get currPrice(): number {
        return this.info.currPrice;
    }

    public updateShopData(info): void {
        this.info = info;
        this.saleId = info.saleId;
        this.id = parseInt(this.saleId);
        if (info.pay) this.pay = info.pay;
        if (info.saleIntro) this.saleIntro = info.saleIntro;
        //if (info.num) this.num = info.num;//数量不更新到本地
        if (info.date) this.date = info.date;
        this.model = JsonModelManager.instance.getModelshop()[this.id];
    }
}

class ValueObject {
    public saleId;
    private model;

    constructor(model) {
        this.model = model;
        this.saleId = model.id;
    }

    public get currPrice() {
        return this.model.currPrice * platform.getPriceRate();
    }

    public get origPrice() {
        return this.model.origPrice * platform.getPriceRate();
    }
}

enum SHOP_TYPE {
    IMAGES = 1,//图集
    VIDEOS = 2,//视频
    MUSICS = 3,//音乐
    CHAPTER = 4,//章节
    DAOJU = 5,//道具
    SPECIAL = 6,//特殊物品
}
