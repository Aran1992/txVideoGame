/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    getUserInfo(): Promise<any>;//获取主用户数据
    saveBookHistory(bookId, slotId, title, externParam,callback): Promise<any>;//游戏存档
    share(bookId, title, summary, icon, url, array): Promise<any>;//分享
    shareImage(bookId, imageData): Promise<any>;//分享图片
    openButton(tr): Promise<any>;//调取APP钱包界面
    getBookHistoryList(bookId,callback): Promise<any>;//获取指定书籍下的所有存档列表信息
    deleteBookHistory(bookId, slotId,callback): Promise<any>;//删除制定存档
    getBookHistory(bookId, slotId,callback): Promise<any>;//获取制定存档
    getBookLastHistory(bookId,callback): Promise<any>;//读取最近一次阅读进度，继续阅读。 在开始阅读前可通过该接口获得最近一次进度继续阅读。
    getBookValues(bookId, slotId,callback): Promise<any>;//获取管理端配置的可购买的物品信息，包括章节，物品。
    buyGoods(bookId, itemId, num, curSlotId,callback):Promise<any>;
    sendRequest(params,callback):Promise<any>;

    takeOffBookValue(bookId, saleId, currentSlotId, num,callback): Promise<any>;//消耗后台已购买物品（管理配置）
    report(bookId, evt, params,callback): Promise<any>;//统计类接口
    getUserPlatformData(): Promise<any>;//获取用户平台数据
    getBookConsumeData(bookId,callback): Promise<any>;//获取书籍消费数据
    reportBusinessEvent(bookId, evtId, optionId,callback): Promise<any>;//上报事件选项
    getBusinessEventData(bookId, evtId, optionId,callback): Promise<any>;//查询上报的事件选项统计
    triggerEventNotify(evt, str): Promise<any>;//事件通知（web主动通知app）
    finishPage();

    isDebug(): boolean;
    getPlatform():string;
}

class DebugPlatform implements Platform {
    async getUserInfo() {
        if (window['StoryPlatform']) {
            var data = window['StoryPlatform']['getUserInfo']();
            var info = JSON.parse(data);
            if (info && info.code == 0) {
                info = JSON.parse(info.data);
                UserInfo.sex = info.sex;
                UserInfo.user = info.user;
                UserInfo.id = info.id;
                UserInfo.avatar = info.avatar;
                UserInfo.nickName = info.nickName;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_USER_REFRESH));
            }
        }
    }
    public getPlatform(){
        return "plat_1001"//plat_txsp
    }

    async share(bookId, title, summary, icon, url, array) {        
        await window["share"](bookId,title,summary, icon, url, array);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['share'](bookId, title, summary, icon, window.location.href, array);
        // }
    }

    async shareImage(bookId, imageData) {
        await window["shareImage"](bookId,imageData);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['shareImage'](bookId, imageData);
        // }
    }

    async openButton(str) {
        await window["openButton"](str);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform'].openButton(str, "");
        // }
    }

    //游戏存档
    async saveBookHistory(bookId, slotId, title, externParam,callback) {
        await window["saveBookHistory"](bookId, slotId,0, title, externParam,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['saveBookHistory'](bookId, slotId, 0, title, externParam, 'callbackSaveBookHistory');
        // }
    }

    //获取游戏存档列表
    async getBookHistoryList(bookId,callback) {
        await window["getBookHistoryList"](bookId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getBookHistoryList'](bookId, 'callbackGetBookHistoryList');
        // }
    }

    //获取制定存档
    async getBookHistory(bookId, slotId,callback) {
        callback = callbackGetBookHistory;
        await window["getBookHistory"](bookId,slotId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getBookHistory'](bookId, slotId, 'callbackGetBookHistory');
        // }
    }

    //删除制定存档
    async deleteBookHistory(bookId, slotId,callback) {
        await window["deleteBookHistory"](bookId,slotId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['deleteBookHistory'](bookId, slotId, 'callbackDeleteBookHistory');
        // }
    }

    //获取最近进度
    async getBookLastHistory(bookId,callback) {
        await window["getBookLastHistory"](bookId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getBookLastHistory'](bookId, 'callbackGetBookLastHistory');
        // }

    }

    //获取商业化数值
    async getBookValues(bookId, slotId,callback) {
        await window["getBookValues"](bookId,slotId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getBookValues'](bookId, slotId, "callbackGetBookValues");
        // }
    }

    async buyGoods(bookId, itemId, num, curSlotId,callback) {
        await window["buyGoods"](bookId,itemId,num,curSlotId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['buyGoods'](bookId, itemId, num, curSlotId, 'callbackBuyGoods');
        // }
    }
    async sendRequest(params,callback){
        await window["sendRequest"](params,callback);
        // if(window['StoryPlatform']){
        //     await window['StoryPlatform']['sendRequest'](params,'callbackSendRequest');
        // }
    }

    async takeOffBookValue(bookId, saleId, currentSlotId, num,callback) {
        await window["takeOffBookValue"](bookId,saleId,currentSlotId,num,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['takeOffBookValue'](bookId, saleId, currentSlotId, num, 'callbackTakeOffBookValue');
        // }
    }

    async report(bookId, evt, params,callback) {
        await window["report"](bookId, evt, params,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['report'](bookId, evt, JSON.stringify(params), 'callbackReport');
        // }
    }

    async getUserPlatformData() {
        await window["getUserPlatformData"]();
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getUserPlatformData']('callbackGetUserPlatformData');
        // }
    }

    async getBookConsumeData(bookId,callback) {
        await window["getBookConsumeData"](bookId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getBookConsumeData'](bookId, 'callbackGetBookConsumeData');
        // }
    }

    async reportBusinessEvent(bookId, evtId, optionId,callback) {
        await window["getBookConsumeData"](bookId, evtId, optionId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['reportBusinessEvent'](bookId, evtId, optionId, 'callbackReportBusinessEvent');
        // }
    }

    async getBusinessEventData(bookId, evtId, optionId,callback) {
        await window["getBusinessEventData"](bookId, evtId, optionId,callback);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['getBusinessEventData'](bookId, evtId, optionId, 'callbackGetBusinessEventData');
        // }
    }

    async triggerEventNotify(evt, str) {
        await window["triggerEventNotify"](evt, str);
        // if (window['StoryPlatform']) {
        //     await window['StoryPlatform']['triggerEventNotify'](evt, str);
        // }
    }

    async finishPage() {//退出页面
        if (window['StoryPlatform']) {
            await window['StoryPlatform']['finishPage']();
        }
    }

    public isDebug(): boolean {
        return true;
        // return window['StoryPlatform'] ? false : true;
    }
}

if (!window.platform) {
    window.platform = new DebugPlatform();
}
declare let platform: Platform;
declare let appToH5EventType: number;
declare let appToH5EventData: string;
declare let nextVideoUrl: string;

declare interface Window {
    platform: Platform;
    appToH5EventType: number;
    appToH5EventData: string;
    nextVideoUrl: string;
}






