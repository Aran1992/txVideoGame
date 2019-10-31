/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */

declare let plattxsp:Txsp;
declare let platform: Platform;
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

    isDebug(): boolean;
    getPlatform():string;

    getBridgeHelper();  
    getSaleBeginTime();
}

class DebugPlatform implements Platform {
    async getUserInfo() {
        await window["getUserInfo"](()=>{});
    }

    //是否是活动期间；
    public isCelebrateTime(){
        return true;
    }
    //获得上线时间，其它时间可以此时间上叠加
    public getSaleBeginTime(){
        return 1572364800;//2019-10-30 00:00:00
    }  
    public getPlatform(){
        if (egret.Capabilities.os == 'Windows PC')
            return "plat_pc";
        if (window['StoryPlatform'] || (window["webkit"] && window["webkit"]["messageHandlers"] && window["webkit"]["messageHandlers"]["saveBookHistory"]))
            return "plat_1001"
        else
            return 'plat_txsp'
    }
    
    public getBridgeHelper(){
        return bridgeHelper;
    }

    async share(bookId, title, summary, icon, url, array) {        
        await window["share"](bookId,title,summary, icon, url, array);
    }

    async shareImage(bookId, imageData) {
        if (this.getPlatform() == "plat_txsp"){
            await plattxsp.shareImage(bookId,imageData);
        }else{
            await window["shareImage"](bookId,imageData);
        }
    }

    async openButton(str) {
        await window["openButton"](str);
    }

    //游戏存档
    async saveBookHistory(bookId, slotId, title, externParam,callback) {
        //console.trace("saveBookHistory")
        if (this.getPlatform() == "plat_txsp"){
            await plattxsp.saveBookHistory(bookId, slotId, title, externParam,callback)
        }else{
            await window["saveBookHistory"](bookId, slotId,0, title, externParam,callback);
        }
    }

    //获取游戏存档列表
    async getBookHistoryList(bookId,callback) {
        await window["getBookHistoryList"](bookId,callback);
    }

    //获取制定存档
    async getBookHistory(bookId, slotId,callback) {
        if (this.getPlatform() == "plat_txsp"){
            await plattxsp.getBookHistory(bookId,slotId,callback);
        }else{
            await window["getBookHistory"](bookId,slotId,callback);
        }
    }

    //删除制定存档
    async deleteBookHistory(bookId, slotId,callback) {
        if (this.getPlatform() == "plat_txsp"){
            await plattxsp.deleteBookHistory(bookId,slotId,callback);
        }else{
            await window["deleteBookHistory"](bookId,slotId,callback);
        }
    }

    //获取最近进度
    async getBookLastHistory(bookId,callback) {
        await window["getBookLastHistory"](bookId,callback);
    }

    //获取商业化数值
    async getBookValues(bookId, slotId,callback) {
        if(this.getPlatform()=="plat_txsp"){
            await plattxsp.getBookValues(bookId,slotId,callback);
        }else{
            await window["getBookValues"](bookId,slotId,callback);
        }
    }

    async buyGoods(bookId, itemId, num, curSlotId,callback) {
        if(this.getPlatform()=="plat_txsp"){
            await plattxsp.buyGoods(bookId,itemId,num,curSlotId,callback);
        }else{
            await window["buyGoods"](bookId,itemId,num,curSlotId,callback);
        }
    }
    async sendRequest(params,callback){
        if(this.getPlatform()=="plat_txsp" || this.getPlatform()=="plat_pc"){
            await plattxsp.sendRequest(params,callback);
        }else{
            await window["sendRequest"](params,callback);
        }
    }

    async takeOffBookValue(bookId, saleId, currentSlotId, num,callback) {
        await window["takeOffBookValue"](bookId,saleId,currentSlotId,num,callback);
    }

    async report(bookId, evt, params,callback) {
        await window["report"](bookId, evt, params,callback);
    }

    async getUserPlatformData() {
        await window["getUserPlatformData"]();
    }

    async getBookConsumeData(bookId,callback) {
        await window["getBookConsumeData"](bookId,callback);
    }

    async reportBusinessEvent(bookId, evtId, optionId,callback) {
        await window["getBookConsumeData"](bookId, evtId, optionId,callback);
    }

    async getBusinessEventData(bookId, evtId, optionId,callback) {
        await window["getBusinessEventData"](bookId, evtId, optionId,callback);
    }

    async triggerEventNotify(evt, str) {
        await window["triggerEventNotify"](evt, str);
    }

    public isDebug(): boolean {
        return true;
    }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}
// declare let appToH5EventType: number;
// declare let appToH5EventData: string;
// declare let nextVideoUrl: string;

declare interface Window {
    platform: Platform;    
    plattxsp: Txsp;    
    // appToH5EventType: number;
    // appToH5EventData: string;
    // nextVideoUrl: string;
}






