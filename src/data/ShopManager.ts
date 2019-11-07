
class ShopManager {
    private static instance: ShopManager = null;
    public debugShopInfos;
    private _shopDataDict;
    private _openShoucangIds: number[];
    private _serverItemNums={};

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

    public takeOffAllBookValue(){
        for(let k in this._serverItemNums){
            if (k!='loaded' && this._serverItemNums[k]>0){
                this.takeOffBookValue(GameDefine.BOOKID,k,0,this._serverItemNums[k]);//this._serverItemNums[k]
            }
        }
    }

    public takeOffBookValue(bookId, saleId, currentSlotId, num) {
        let callback = (data)=> {
            if (data.code == 0){
                this._serverItemNums[data.data.value.saleId] = data.data.value.num;
                console.log("使用物品："+data.data.value.saleId+";"+num+" 剩余:"+data.data.value.num);
            }else{
                console.log(data.data.msg+";"+saleId+";"+num);
            }
        };
        platform.takeOffBookValue(GameDefine.BOOKID, saleId, currentSlotId, num,callback);
    }

    /**钻石购买商品**/
    public buyGoods(itemId, num: number = 1,callback:()=>void=null) {
        let shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (!shopdata) return;
        if (egret.Capabilities.os == 'Windows PC') {
            this.addGoods(itemId, num,callback);
        } else {
            let callbackBuyGoods = (data) => {
                let recData = data.data;
                let jsonObject = data.data.value;
                if (data.code == 0) {
                    shopdata = this._shopDataDict[jsonObject.saleId];
                    shopdata.updateShopData(jsonObject);
                    this._serverItemNums[jsonObject.saleId] = jsonObject.num;//更新商品数量
                    //console.log("update item:"+jsonObject.saleId+";"+jsonObject.num);
                    this.addGoods(itemId,0,callback)//需要加0以便能调用到回调函数
                } else {
                    GameCommon.getInstance().addAlert("商品购买失败~errcode:::" + data.code + "~~errmsg:::" + recData.msg);
                }
            };
            if (platform.getPlatform() == "plat_txsp"){
                callbackBuyGoods=(res)=>{
                    if (res.code == 0){
                        this.addGoods(itemId,num,callback)
                    }else{
                        console.log(res.msg);
                    }
                }
            }
            let currentSlotId: number = 0;
            //console.log("buy:"+itemId+";"+num+";slot="+currentSlotId);
            platform.buyGoods(GameDefine.BOOKID, itemId, num, currentSlotId,callbackBuyGoods);
        }
    }

    public buyGoodsSuip(itemId: number, num: number = 1,callback:any=null): void {
        let shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (!shopdata) return;
        if (UserInfo.suipianMoney < shopdata.model.currSuipian) {
            GameCommon.getInstance().onShowResultTips('碎片不足，购买失败！', false);
            return;
        }
        UserInfo.suipianMoney -= shopdata.model.currSuipian;
        this.addGoods(itemId, num,callback);
    }

    /**物品存储**/
    public addGoods(itemId: number, num: number = 1,callback:any=null) {
        let shopdata: ShopInfoData = this._shopDataDict[itemId];
        if (shopdata) {
            shopdata.num += num;
            GameCommon.getInstance().setBookData(FILE_TYPE.GOODS_FILE);
            this.onBuySuccessHandler(shopdata);
            console.log("add item:"+itemId+";"+num+" left:"+ shopdata.num);
        }else{
            console.trace();
        }
        if (callback)
            callback();
    }

    /**获取商品信息列表**/
    public initShopInfos() {
        if (!this._shopDataDict) {
            GameCommon.getInstance().getBookHistory(FILE_TYPE.GOODS_FILE);
            this._shopDataDict = {};
            for (let id in JsonModelManager.instance.getModelshop()) {
                let model: Modelshop = JsonModelManager.instance.getModelshop()[id];
                let valueObj = {saleId: model.id, currPrice: model.currPrice, origPrice: model.origPrice};
                let shopData: ShopInfoData = new ShopInfoData(valueObj);
                this._shopDataDict[shopData.id] = shopData;
            }
        }
        this.loadFromServer()
    }
    //不从服务器上取了。因为TXSP从服务器上也取不到
    public loadFromServer(){
        if(this._serverItemNums["loaded"])
            return;
        let callback = (data)=> {
            if (data.code == 0) {
                let values = data.data.values;//array{currPrice,date,num,origPrice,pay,saleId,saleIntro}
                //console.log(values);
                values.forEach(element => {
                    this._serverItemNums[element.saleId]=element.num;
                });
                this._serverItemNums["loaded"] = true;
                console.log(this._serverItemNums);
                //把本地的值+服务器的值
            } else {
                GameCommon.getInstance().addAlert("获取商品列表失败~errcode:::" + data.code);
            }
        };
        let currentSlotId: number = 0;
        platform.getBookValues(GameDefine.BOOKID, currentSlotId,callback);
    }
    public getServerItemNum(id){
        if (!this._serverItemNums["loaded"]){
            this.loadFromServer()
            return 0;
        }
        return this._serverItemNums[id] || 0;
    }
    public getItemNum(id){        
        let shopdata: ShopInfoData = this._shopDataDict[id] || {num:0};
        return this.getServerItemNum(id)+shopdata.num
    }
    /**获取ID商品信息**/
    public getShopInfoData(id: number):ShopInfoData {
        return this._shopDataDict[id];
    }

    /**获取内购商品的ID**/
    public getShopTP(id: number): number {
        return Math.floor(id / GameDefine.SHOP_GOODS_STARTID);
    }


    /**判断某收藏是否开通**/
    public onCheckShoucangOpen(shoucangID: number): boolean {
        return this._openShoucangIds.indexOf(shoucangID) >= 0;
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
                case SHOP_TYPE.SPECIAL:
                    if(shopdata.id == GameDefine.GUANGLIPINGZHENG){
                        //啥也不干。由调用者传入
                        //GameCommon.getInstance().onShowResultTips('购买成功，激活码可在“心动PASS”-“激活码”处查看');
                    }
                default:
                    GameCommon.getInstance().onShowResultTips('购买成功');
                    break;
            }
        } else if (shopdata.id > GameDefine.SHOP_CHAPTER_STARTID) {//章节
            GameCommon.getInstance().onShowResultTips('购买成功');
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH),shopdata);
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
    public origPrice: number = 0;//	单个物品原价	单位钻石
    public currPrice: number = 0;	//	单个物品现价	单位钻石
    public pay: number = 1;//	单个物品的付费标记位	1付费2折扣4限免8免费16优惠32已购买
    public num: number = 0;//	单个物品的已拥有数量	个
    public date: number = 0;//时间

    public constructor(info?: any) {
        if (info) {
            this.updateShopData(info);
        }
    }

    public updateShopData(info): void {
        this.saleId = info.saleId;
        this.id = parseInt(this.saleId);
        this.currPrice = info.currPrice;
        if (info.pay) this.pay = info.pay;
        if (info.origPrice) this.currPrice = info.origPrice;
        if (info.saleIntro) this.saleIntro = info.saleIntro;
        //if (info.num) this.num = info.num;//数量不更新到本地
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
    SPECIAL = 6,//特殊物品
}