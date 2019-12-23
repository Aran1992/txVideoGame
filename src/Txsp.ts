declare const BridgeHelper;
declare var bridgeHelper;
declare var txsp_userinfo;
const txsp_appid = "tivf8061263egmdcyp";
const txsp_debug = true;
const txsp_vip = false;


class Txsp {

    public init() {
        bridgeHelper = new BridgeHelper({
            origin: location.protocol + '//m.v.qq.com',
            appid: txsp_appid,
        });
        if (txsp_debug) {
            bridgeHelper.setBridgeEnableLog(true)
            bridgeHelper.setServerEnv(true);//await
        }
        bridgeHelper.toggleBackButton({hide: 1});
        bridgeHelper.onAppEnterForeground(() => {
            this.queryUserInfo();
        });
        setInterval(() => {
            this.refreshToken();
        }, 36000000);

        GameDispatcher.getInstance().addEventListener(GameEvent.ONSHOW_VIDEO, this.onRefreshVideo, this);
    }

    public async openWebview(option) {
        return await bridgeHelper.openWebview(option);
    }

    public isPlatformVip() {
        if (txsp_debug && txsp_vip)
            return true;
        return txsp_userinfo.base_info.vip == 1
    }

    async saveBookHistory(bookId, slotId, title, externParam, callback) {
        bridgeHelper.accessStore({
            appid: txsp_appid,
            openid: txsp_userinfo.openid,
            access_token: txsp_userinfo.token,
            key: slotId,
            text: externParam,
            op_type: 'update',
        }).then(res => {
            callback({code: res.code, data: {msg: res.msg, slotId: slotId}});
            console.log("save success slotId:" + slotId);
        })
        return;
    }

    //获取制定存档
    async getBookHistory(bookId, slotId, callback) {
        //await this.refreshToken();
        bridgeHelper.accessStore({
            appid: txsp_appid,
            openid: txsp_userinfo.openid,
            access_token: txsp_userinfo.token,
            key: slotId,
            text: '',
            op_type: 'get',
        }).then(res => {
            if (res.code == 0) {
                let date = {code: res.code, data: {content: res.result.text_value, slotId: slotId}};
                callback(date);
                console.log("read success slotId:" + slotId + ";");
            } else {
                console.log("read fail slotId:" + slotId + ";" + res.msg);
            }
        })
    }

    async getBookHistoryList(bookId, callback) {
        for (var key in FILE_TYPE) {
            callback = (data) => {
                GameCommon.getInstance().parseChapter(FILE_TYPE[key], data);
            }
            await this.getBookHistory('', FILE_TYPE[key], callback)
        }
        return;
    }

    async refreshToken() {
        bridgeHelper.refreshToken({
            appid: txsp_appid,  // 应用的appid
            openid: txsp_userinfo.openid, // 应用的openid
        }).then((res) => {
            if (res.code == 0) {
                txsp_userinfo.token = res.result.accesstoken;
            } else {
                console.log("refreshToken failed;" + res.msg);
            }
        });
    }

    async deleteBookHistory(bookId, slotId, callback) {
        await this.saveBookHistory(bookId, slotId, "", "", () => {
        })
        callback();
    }

    //获取商业化数值,把原来的slot参数做其它用途；兼容两个平台
    async getBookValues(bookId, itemids, callback) {
        let res = await bridgeHelper.queryProduct({
            appid: txsp_appid,  // 应用的appid
            openid: txsp_userinfo.openid, // 应用的openid
            access_token: txsp_userinfo.token, // 互动登录态access_token
            product_ids: itemids,
            sandbox: txsp_debug ? 1 : 0,
        })
        callback(res);
        //使用本地数据
    }

    async takeOffBookValue(bookId, saleId, currentSlotId, num, callback) {
        let res = await bridgeHelper.consumeProduct({
            appid: txsp_appid,  // 应用的appid
            openid: txsp_userinfo.openid, // 应用的openid
            access_token: txsp_userinfo.token, // 互动登录态access_token
            product_id: saleId,
            count: num,
            sandbox: txsp_debug ? 1 : 0,
        })
        callback(res);
    }

    async shareImage(bookId, imageData) {
        return await bridgeHelper.shareImage({
            needPreview: true, // 是否需要预览，是: true, 否：false, 默认: false
            imageUrl: '',      // 在线图片url
            localImageUrl: imageData, // 本地图片base64 url
            title: '', // 标题
            subTitle: '', // 副标题
        })
    }

    async sendRequest(params, callback) {
        callback({code: 0, data: {list: [{"isValid": 1, "CDKey": "FFFFFFFF"}]}})
    }

    async buyGoods(bookId, itemId, num, curSlotId, callbackBuyGoods) {
        let shopdata: ShopInfoData = ShopManager.getInstance().shopInfoDict[itemId];
        let leftMoney = -1
        await bridgeHelper.diamondQueryBalance({
            appid: txsp_appid, // 业务id
            openid: txsp_userinfo.openid, // 互动账号openid,
            access_token: txsp_userinfo.token, // 互动登录态access_token
            sandbox: txsp_debug ? 1 : 0,
        }).then((res) => {
            if (res.code == 0) {
                leftMoney = res.result.balance;
            } else {
                console.log(res.msg)
                //if(txsp_debug)
                GameCommon.getInstance().showConfirmTips(`我的余额查询失败，请重新发起购买;${res.msg}`, () => {
                })
            }
        })
        if (leftMoney == -1) {
            //GameCommon.getInstance().showCommomTips("我的余额查询失败,请重新发起购买");
            return;
        }
        //钱够直接买
        let price = shopdata.model.currPrice * platform.getPriceRate();
        if (leftMoney >= price) {//){shopdata.currPrice
            let okFunc = () => {
                bridgeHelper.diamondConsume({//await
                    appid: txsp_appid, // 业务id
                    openid: txsp_userinfo.openid, // 互动账号openid,
                    access_token: txsp_userinfo.token, // 互动登录态access_token
                    product_id: itemId, // 商品id
                    count: num, // 商品数量
                    sandbox: txsp_debug ? 1 : 0,
                }).then((res) => {
                    callbackBuyGoods(res)
                })
            }
            GameCommon.getInstance().showConfirmTips(`你的余额还有${leftMoney}钻
本次购买将花费${price}钻
是否购买?`, okFunc);
        } else {
            //钱不够走充值流程
            // if (txsp_debug)
            //     GameCommon.getInstance().showConfirmTips(`我的余额${leftMoney};本次需要消费${price}`, () => {
            //     })
            await bridgeHelper.openPayPage({
                actid: '', // 钻石actid
                appid: txsp_appid, // 应用的appid
                orderid: '', // 订单id
                needpay: Math.abs(Math.ceil(price - leftMoney)), // 本次购买需要的钻石数目
                close: 1,     //购买成功后是否自动关闭webview 1: 是 0: 不是，默认 0
                ru: '', // 购买成功后跳转的链接，优先级低于close
                title: '拳拳四重奏', // 支付页面标题
                sandbox: txsp_debug ? 1 : 0,
            }).then((res) => {
            })
        }
    }

    async openDebug() {
        bridgeHelper.openWebview("http://debugx5.qq.com/");
    }

    async queryUserInfo() {
        let isVip = this.isPlatformVip();
        let ret = await bridgeHelper.getUserInfo({
            appid: txsp_appid, // 必填 应用的appid
            type: ['qq', 'wx'], //  可选 登录类型，默认： ['wx', 'qq']
        });
        if (ret.code == 0) {
            txsp_userinfo = ret.result;
        }
        //txsp_userinfo.base_info.vip=1;
        let isVipNew = this.isPlatformVip();
        if (isVip != isVipNew) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_VIP));
        }
        return ret;
    }

    async login() {
        //await this.openDebug();
        if (window.platform.getPlatform() != "plat_txsp")
            return;
        //登陆
        while (1) {
            let ret = await bridgeHelper.getUserInfo({
                appid: txsp_appid, // 必填 应用的appid
                type: ['qq', 'wx'], //  可选 登录类型，默认： ['wx', 'qq']
            });
            if (ret.code == 0) {
                txsp_userinfo = ret.result;
                break;
            }
            await bridgeHelper.login();
        }
    }

    private onRefreshVideo(data) {
        const wenti = wentiModels[data.data.wentiId];
        const chapterID = wenti.chapter;
        const branchID = Config.getChapterBranchName(chapterID);
        const args = {
            reportkey: "hdsp_play_detail_page",
            data_type: "button",
            chapter_id: chapterID,
            branch_id: branchID,
            sub_rtype: data.data.click ? "dft" : "no_dft"
        };
        if ([
            ActionType.CLICK_TIME,
            ActionType.CLICK,
            ActionType.SLIDE,
            ActionType.SLIDE_RECT,
            ActionType.SLIDE_TWO,
            ActionType.SEND_MSG,
        ].indexOf(wenti.type) !== -1) {
            args["mod_id"] = "slideandclick";
            args["sub_mod_id"] = data.data.click ? "no_dft" : "dft";
        } else {
            args["mod_id"] = "inter_option";
            args["sub_mod_id"] = data.data.answerId;
            args["third_mod_id"] = Config.getAnswerConfig(data.data.wentiId, data.data.answerId).des;
        }
        console.log("reportAction args", args);
        bridgeHelper.reportAction(args);
    }
}

if (!window.plattxsp) {
    window.plattxsp = new Txsp();
    if (window.platform.getPlatform() == "plat_txsp")
        window.plattxsp.init();
}
