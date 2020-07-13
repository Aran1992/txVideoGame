/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */

declare let plattxsp: Txsp;
declare let platform: Platform;

declare interface Platform {
    getUserInfo(): Promise<any>;//获取主用户数据
    saveBookHistory(bookId, slotId, title, externParam, callback): Promise<any>;//游戏存档
    share(bookId, title, summary, icon, url, array): Promise<any>;//分享
    shareImage(bookId, imageData): Promise<any>;//分享图片
    openButton(tr): Promise<any>;//调取APP钱包界面
    getBookHistoryList(bookId, callback): Promise<any>;//获取指定书籍下的所有存档列表信息
    deleteBookHistory(bookId, slotId, callback): Promise<any>;//删除制定存档
    getBookHistory(bookId, slotId, callback): Promise<any>;//获取制定存档
    getBookLastHistory(bookId, callback): Promise<any>;//读取最近一次阅读进度，继续阅读。 在开始阅读前可通过该接口获得最近一次进度继续阅读。
    getBookValues(bookId, slotId, callback): Promise<any>;//获取管理端配置的可购买的物品信息，包括章节，物品。
    buyGoods(bookId, itemId, num, curSlotId, callback): Promise<any>;

    sendRequest(params, callback): Promise<any>;

    takeOffBookValue(bookId, saleId, currentSlotId, num, callback): Promise<any>;//消耗后台已购买物品（管理配置）
    report(bookId, evt, params, callback): Promise<any>;//统计类接口
    getUserPlatformData(): Promise<any>;//获取用户平台数据
    getBookConsumeData(bookId, callback): Promise<any>;//获取书籍消费数据
    reportBusinessEvent(bookId, evtId, optionId, callback): Promise<any>;//上报事件选项
    getBusinessEventData(bookId, evtId, optionId, callback): Promise<any>;//查询上报的事件选项统计
    triggerEventNotify(evt, str): Promise<any>;//事件通知（web主动通知app）

    isDebug(): boolean;

    getPlatform(): string;

    getBridgeHelper();

    getSaleBeginTime();

    isPlatformVip(): boolean;

    getServerTime();

    updateServerTime();

    isPlatformVip(): boolean;

    close();

    getPriceRate();

    getOffsetTime();

    setTestTime(time);

    isCelebrateTime();

    isFreeTime();

    getFreeTimeStart();

    isCelebrate2Time();

    openWebview(option);
}

const str2time = str => {
    const year = parseInt(str.substr(0, 4));
    const month = parseFloat(str.substr(4, 2)) - 1;
    const day = parseFloat(str.substr(6, 2));
    const hour = parseFloat(str.substr(8, 2));
    const minute = parseFloat(str.substr(10, 2));
    const second = parseFloat(str.substr(12, 2));
    return new Date(year, month, day, hour, minute, second);
};

class DebugPlatform implements Platform {
    private static s_serverTime: number;
    private static s_offsetTime: number = 12 * 60 * 60 * 1000;

    private _testTime: number;

    async getUserInfo() {
        return await new Promise(resolve => window["getUserInfo"](resolve));
    }

    public getPriceRate() {
        if (this.getPlatform() == "plat_txsp") {
            return 0.1;
        } else {
            return 1;
        }
    }

    public async openWebview(option) {
        return await plattxsp.openWebview(option);
    }

    public isPlatformVip() {
        if (this.getPlatform() == "plat_txsp") {
            return plattxsp.isPlatformVip();
        } else
            return false;
    }

    //是否是活动期间；
    public isCelebrateTime() {
        return false;
    }

    public isCelebrate2Time() {
        return false;
    }

    public isFreeTime() {
        return !isTXSP
            && this.getServerTime() >= this.getFreeTimeStart()
            && this.getServerTime() < new Date(2020, 7, 31, 12).getTime();
    }

    public getFreeTimeStart() {
        return new Date(2020, 7, 7, 12).getTime();
    }

    public getOffsetTime() {
        return DebugPlatform.s_offsetTime;
    }

    public setTestTime(time: number) {
        this._testTime = time;
    }

    public getServerTime() {
        if (this._testTime)
            return this._testTime;
        if (DebugPlatform.s_serverTime)
            return DebugPlatform.s_serverTime;
        else
            return new Date().getTime();
    }

    public updateServerTime() {
        const httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        //let url = `https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp`;
        let url = `https://quan.suning.com/getSysTime.do`;
        httpRequest.open('GET', url, true);//第二步：打开连接
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                const json = JSON.parse(httpRequest.responseText);//获取到json字符串，还需解析
                DebugPlatform.s_serverTime = str2time(json.sysTime1).getTime();
            }
        };
    }

    //获得上线时间，其它时间可以此时间上叠加
    public getSaleBeginTime() {
        return 1578412800 * 1000 + DebugPlatform.s_offsetTime; //2020/1/10 12:0:0
    }

    public getPlatform() {
        //this.updateServerTime();
        if (egret.Capabilities.os == 'Windows PC')
            return "plat_pc";
        if (window['StoryPlatform'] || (window["webkit"] && window["webkit"]["messageHandlers"] && window["webkit"]["messageHandlers"]["saveBookHistory"]))
            return "plat_1001";
        else
            return 'plat_txsp';
    }


    public getBridgeHelper() {
        return bridgeHelper;
    }

    async share(bookId, title, summary, icon, url, array) {
        await window["share"](bookId, title, summary, icon, url, array);
    }

    async shareImage(bookId, imageData) {
        if (this.getPlatform() == "plat_txsp") {
            await plattxsp.shareImage(bookId, imageData);
        } else {
            await window["shareImage"](bookId, imageData);
        }
    }

    async openButton(str) {
        await window["openButton"](str);
    }

    //游戏存档
    async saveBookHistory(bookId, slotId, title, externParam, callback) {
        //console.trace("saveBookHistory")
        if (this.getPlatform() == "plat_txsp") {
            await plattxsp.saveBookHistory(bookId, slotId, title, externParam, callback)
        } else {
            await window["saveBookHistory"](bookId, slotId, 0, title, externParam, callback);
        }
    }

    //获取游戏存档列表
    async getBookHistoryList(bookId, callback) {
        await window["getBookHistoryList"](bookId, callback);
    }

    //获取制定存档
    async getBookHistory(bookId, slotId, callback) {
        if (this.getPlatform() == "plat_txsp") {
            await plattxsp.getBookHistory(bookId, slotId, callback);
        } else {
            await window["getBookHistory"](bookId, slotId, callback);
        }
    }

    //删除制定存档
    async deleteBookHistory(bookId, slotId, callback) {
        if (this.getPlatform() == "plat_txsp") {
            await plattxsp.deleteBookHistory(bookId, slotId, callback);
        } else {
            await window["deleteBookHistory"](bookId, slotId, callback);
        }
    }


    //获取最近进度
    async getBookLastHistory(bookId, callback) {
        await window["getBookLastHistory"](bookId, callback);
    }

    //获取商业化数值
    async getBookValues(bookId, slotId, callback) {
        if (this.getPlatform() == "plat_txsp") {
            await plattxsp.getBookValues(bookId, slotId, callback);
        } else {
            await window["getBookValues"](bookId, slotId, callback);
        }
    }

    async buyGoods(bookId, itemId, num, curSlotId, callback) {
        if (this.getPlatform() == "plat_txsp") {
            await plattxsp.buyGoods(bookId, itemId, num, curSlotId, callback);
        } else {
            await window["buyGoods"](bookId, itemId, num, curSlotId, callback);
        }
    }

    async sendRequest(params, callback) {
        if (this.getPlatform() == "plat_txsp" || this.getPlatform() == "plat_pc") {
            await plattxsp.sendRequest(params, callback);
        } else {
            await window["sendRequest"](params, callback);
        }
    }


    async takeOffBookValue(bookId, saleId, currentSlotId, num, callback) {
        // if (this.getPlatform() == "plat_txsp") {
        //     await plattxsp.takeOffBookValue(bookId, saleId, currentSlotId, num, callback);
        // } else {
        //     await window["takeOffBookValue"](bookId, saleId, currentSlotId, num, callback);
        // }
    }

    async report(bookId, evt, params, callback) {
        await window["report"](bookId, evt, params, callback);
    }

    async getUserPlatformData() {
        await window["getUserPlatformData"]();
    }

    async getBookConsumeData(bookId, callback) {
        await window["getBookConsumeData"](bookId, callback);
    }

    async reportBusinessEvent(bookId, evtId, optionId, callback) {
        await window["getBookConsumeData"](bookId, evtId, optionId, callback);
    }

    async getBusinessEventData(bookId, evtId, optionId, callback) {
        await window["getBusinessEventData"](bookId, evtId, optionId, callback);
    }

    async triggerEventNotify(evt, str) {
        await window["triggerEventNotify"](evt, str);
    }

    public isDebug(): boolean {
        return DEBUG;
    }

    public close() {
        if (this.getPlatform() == "plat_txsp") {
            bridgeHelper.close();
        } else if (this.getPlatform() === "plat_1001") {
            window["exit"]();
        }
    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
    platform.updateServerTime();
    setInterval(platform.updateServerTime, 10000);
}

declare interface Window {
    platform: Platform;
    plattxsp: Txsp;
}

const isTXSP = window.platform.getPlatform() === "plat_txsp";
const is1001 = window.platform.getPlatform() === "plat_1001";
