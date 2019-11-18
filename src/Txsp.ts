declare const BridgeHelper;
declare var bridgeHelper;
declare var txsp_userinfo;
const txsp_appid = "tivf8061263egmdcyp";
const txsp_debug = true;


class Txsp {
    public init(){
        if (txsp_debug){
            bridgeHelper = new BridgeHelper({
                origin: location.protocol + '//m.v.qq.com',
                appid: txsp_appid,
            });

            bridgeHelper.setBridgeEnableLog(true) 
        }
    }
    public isPlatformVip(){
        return txsp_userinfo.base_info.vip == 1
    }
    async saveBookHistory(bookId, slotId, title, externParam,callback){
            bridgeHelper.accessStore({
                appid:txsp_appid,
                openid:txsp_userinfo.openid,
                access_token:txsp_userinfo.token,
                key:slotId,
                text:externParam,
                op_type:'update',
            }).then(res=>{
                callback({code:res.code,data:{msg:res.msg,slotId:slotId}});
                console.log("save success slotId:"+slotId);
            })
        return;
    }
    //获取制定存档
    async getBookHistory(bookId, slotId,callback) {   
        //await this.refreshToken();     
        bridgeHelper.accessStore({
            appid:txsp_appid,
            openid:txsp_userinfo.openid,
            access_token:txsp_userinfo.token,
            key:slotId,
            text:'',
            op_type:'get',
        }).then(res=>{
            if (res.code == 0){
                let date={code:res.code,data:{content:res.result.text_value,slotId:slotId}};
                callback(date);
                console.log("read success slotId:"+slotId+";");
            }else{
                console.log("read fail slotId:"+slotId+";"+res.msg);
            }
        })
    }
    async getBookHistoryList(bookId,callback) {
        for(var key in FILE_TYPE){
            callback=(data)=>{
                GameCommon.getInstance().parseChapter(FILE_TYPE[key], data);
            }
            await this.getBookHistory('',FILE_TYPE[key],callback)
        }
        return;
    }
    async refreshToken(){
        bridgeHelper.refreshToken({
            appid: txsp_appid,  // 应用的appid
            openid: txsp_userinfo.openid, // 应用的openid
            }).then((res) => {
                if (res.code == 0){
                    txsp_userinfo.token = res.result.accesstoken;
                }else{
                    console.log("refreshToken failed;"+res.msg);
                }
            });
    }

    async deleteBookHistory(bookId,slotId,callback){
        await this.saveBookHistory(bookId, slotId, "", "",()=>{})
        callback();
    }
    //获取商业化数值
    async getBookValues(bookId, slotId,callback) {

        //使用本地数据
    }
    async shareImage(bookId,imageData){
        bridgeHelper.shareImage({
            needPreview: true, // 是否需要预览，是: true, 否：false, 默认: false
            imageUrl: '',      // 在线图片url
            localImageUrl: imageData, // 本地图片base64 url
            title: '', // 标题
            subTitle: '', // 副标题
            }).then((res) => {
                console.log(res)
                // {code: 0, msg: 'ok'}
            })
    }
    async sendRequest(params,callback){
        callback({code:0,data:{list:[{"isValid":1,"CDKey":"FFFFFFFF"}]}})
    }
    async buyGoods(bookId, itemId, num, curSlotId,callbackBuyGoods) {     
        let shopdata: ShopInfoData = ShopManager.getInstance().shopInfoDict[itemId];          
        let leftMoney = -1
        await bridgeHelper.diamondQueryBalance({
            appid: txsp_appid, // 业务id
            openid: txsp_userinfo.openid, // 互动账号openid,
            access_token: txsp_userinfo.token, // 互动登录态access_token
            }).then((res) => {
                if(res.code == 0){
                    leftMoney = res.result.balance;
                }else{
                    console.log(res.msg)
                    if(txsp_debug)
                        GameCommon.getInstance().showConfirmTips(`我的余额查询失败;${res.msg}`,()=>{})
                }
            })
        if (leftMoney==-1){
            GameCommon.getInstance().showCommomTips("我的余额查询失败");
            return;
        }
        //钱够直接买
        let price = shopdata.currPrice*platform.getPriceRate();
        if (leftMoney>=price){//){shopdata.currPrice
            let okFunc=()=>{
                            if(txsp_debug)
                                bridgeHelper.setServerEnv(true)//await 
                            bridgeHelper.diamondConsume({//await 
                                appid: txsp_appid, // 业务id
                                openid: txsp_userinfo.openid, // 互动账号openid,
                                access_token: txsp_userinfo.token, // 互动登录态access_token
                                product_id: itemId, // 商品id
                                count: num, // 商品数量
                                }).then((res) => {
                                    callbackBuyGoods(res)
                                })
                            }
            GameCommon.getInstance().showConfirmTips(`你的余额还有${leftMoney}钻
本次购买将花费${price}钻
是否购买?`,okFunc);
        }else{
            //钱不够走充值流程
            if(txsp_debug)
                GameCommon.getInstance().showConfirmTips(`我的余额${leftMoney};本次需要消费${price}`,()=>{})
            await bridgeHelper.openPayPage({
                actid: '', // 钻石actid
                appid: txsp_appid, // 应用的appid
                orderid: '', // 订单id
                needpay: Math.abs(Math.ceil(price-leftMoney)), // 本次购买需要的钻石数目
                close: 1,     //购买成功后是否自动关闭webview 1: 是 0: 不是，默认 0
                ru: '', // 购买成功后跳转的链接，优先级低于close
                title: '拳拳四重奏', // 支付页面标题
                sandbox:1,//txsp_debug?1:0,
                }).then((res) => {
                })
        }
    }
    async openDebug(){
        bridgeHelper.openWebview("http://debugx5.qq.com/");
    }
    async login(){
        //await this.openDebug();
        if (window.platform.getPlatform() != "plat_txsp")
           return;
        //登陆
        while(1){
            let ret = await bridgeHelper.getUserInfo({
                appid: txsp_appid, // 必填 应用的appid
                type: ['qq', 'wx'], //  可选 登录类型，默认： ['wx', 'qq']
            });
            if (ret.code == 0){
                txsp_userinfo = ret.result;
                break;
            }
            await bridgeHelper.login();
        }
    }
}

if (!window.plattxsp){
    window.plattxsp = new Txsp();
    if(window.platform.getPlatform()=="plat_txsp")
        window.plattxsp.init();
}
