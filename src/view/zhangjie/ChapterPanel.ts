// // TypeScript file
// class ChapterPanel extends eui.Component {
//     private mainGroup: eui.Group;
//     private bgBtn: eui.Button;
//     private fileBtn: eui.Button;
//     private fileGroup: eui.Group;
//     private chapterGroup: eui.Group;
//     private buyGroup: eui.Group;
//     private confirmBtn: eui.Button;
//     private cancelBtn: eui.Button;
//     private chapDatas: ChapterItem[];
//     private bgBtn1: eui.Button;
//     private chapFileDatas: ChapterFileItem[];
//     private yindaoGroup: eui.Group;
//     private chaplab: eui.Group;
//     private maxChapterNum:number = 11;
//     constructor() {
//         super();
//         this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
//         this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
//     }
//     //添加到舞台
//     private onAddToStage(): void {
//         this.onSkinName();
//     }
//     protected onRegist(): void {
//         GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
//         GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onRefreshBuy, this);
//         GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, this.onRefreshUpdata, this);
//         for (var i: number = 1; i < this.maxChapterNum; i++) {
//             this['chapterBtn' + i].name = i;
//             this['chapterBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChapterVideo, this);
//         }
//         for (var k: number = 1; k < 7; k++) {
//             this['fileBtn' + k].name = k;
//             this['fileBtn' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReadFile, this);
//         }
//         this.bgBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseFile, this);
//         this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
//         this.fileBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowFile, this);
//         this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFirmBtn, this);
//         this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);

//     }
//     protected onRemove(): void {
//         GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onRefreshBuy, this);
//         // GameDispatcher.getInstance().removeEventListener(GameEvent.GUIDE_COMPLETE,this.onCompleteGuide,this);
//         for (var i: number = 1; i < this.maxChapterNum; i++) {
//             this['chapterBtn' + i].name = i;
//             this['chapterBtn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChapterVideo, this);

//         }
//         for (var k: number = 1; k < 7; k++) {
//             this['fileBtn' + k].name = k;
//             this['fileBtn' + k].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReadFile, this);
//         }
//         GameDispatcher.getInstance().removeEventListener(GameEvent.AUTO_UPDATA, this.onRefreshUpdata, this);
//         this.fileBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowFile, this);
//         this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
//     }
//     private onRefreshUpdata() {
//         if (GameDefine.ISFILE_STATE)
//             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChapterPanel')
//         else {
//             this.onRefreshBuy();
//         }
//     }
//     private onFirmBtn() {
//         // GameCommon.getInstance().addAlert('暂未接通支付接口');
//         ShopManager.getInstance().myShopData[1] = 1;
//         ChengJiuManager.getInstance().onDlcChengJiu(1);
//         this.buyGroup.visible = false;
//         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH))
//     }

//     private onCloseFile() {
//         if (GameDefine.IS_DUDANG) {
//             GameDefine.IS_DUDANG = false;
//             this.onClose();
//             return;
//         }
//         this.chapterGroup.visible = true;
//         this.fileGroup.visible = false;
//     }
//     private onCancel() {
//         this.buyGroup.visible = false;
//     }
//     private onReadFile(event: egret.Event) {
//         var name: number = Number(event.currentTarget.name);
//         if (UserInfo.fileDatas[name]) {

//             GameDefine.ISFILE_STATE = true;
//             GameCommon.getInstance().getBookHistory(name);
//             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), null);
//             this.touchEnabled = false;
//             this.touchChildren = false;
//             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChapterPanel')
//         }
//         else {
//             // if (name > 3 && !ShopManager.getInstance().myShopData[1]) {
//             //     this.buyGroup.visible = true;
//             // }
//             // else {
//             return;
//             // }
//         }
//     }
//     private onShowFile() {
//         // GameCommon.getInstance().addAlert('zanweikaifang');

//         // if(this.fileBtn.label =='读取记忆')
//         // {
//         // this.fileBtn.label = '返回章节';
//         this.fileGroup.visible = true;
//         this.chapterGroup.visible = false;
//         // }
//         // else
//         // {
//         //     this.fileGroup.visible = false;
//         //     this.chapterGroup.visible = true;
//         //     this.fileBtn.label = '读取记忆';
//         // }
//     }
//     private onClose() {
//         if (GameDefine.IS_DUDANG) {
//             GameDefine.IS_DUDANG = false;
//         }
//         GameDefine.ISFILE_STATE = false;
//         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChapterPanel')
//     }
//     private updateResize() {
//         this.width = size.width;
//         this.height = size.height;
//         // this.mainGroup.scaleX = GameDefine.SCALENUMX;
//         // this.mainGroup.scaleY = GameDefine.SCALENUMY;
//     }
//     private onShowChapterVideo(event: egret.Event) {
//         var name: number = Number(event.currentTarget.name);
//         // if (name == 2) {
//         //     GameCommon.getInstance().addAlert('zanweikaifang');
//         //     return;
//         // }
//         // if (!UserInfo.guideDic[8])//
//         // {
//         //     UserInfo.guideDic[8] = 8;
//         //     this.chaplab.visible = false;
//         //     GuideManager.getInstance().curState = false;
//         //     GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE)
//         //     GuideManager.getInstance().onCloseImg();
//         // }
//         GameDefine.IS_SWITCH_VIDEO = true;
//         if(name==1)
//         {
//             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), 'lo');
//         }
//         else
//         {
//             GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), name - 1);
//         }
        
//         // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChapterPanel')
//     }
//     private onLoadComplete(): void {

//         this.touchEnabled = false;
//         this.onInit();
//         this.onRegist();
//         this.chaplab.visible = false;
//         this.updateResize();
//         GameDefine.ISFILE_STATE = false;
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE2)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE3)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE4)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE5)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE6)
//         if (GameDefine.IS_DUDANG) {
//             this.onShowFile();
//         }
//         // if (!UserInfo.guideDic[8])//
//         // {
//         //     this.chaplab.visible = true;
//         //     GuideManager.getInstance().onShowImg(this.yindaoGroup, this.yindaoGroup, 'chapter');
//         // }
//     }
//     //供子类覆盖
//     protected onInit(): void {
//         this.touchEnabled = true;
//         this.touchChildren = true;
//         if (!this.chapDatas) {
//             this.chapDatas = [];
//             for (var i: number = 1; i < this.maxChapterNum; i++) {
//                 this.chapDatas.push(this['chapterBtn' + i]);
//             }
//         }
//         if (!this.chapFileDatas) {
//             this.chapFileDatas = [];
//             for (var k: number = 1; k < 7; k++) {
//                 this.chapFileDatas.push(this['fileBtn' + k]);
//             }
//         }
//         this.onRefresh();
//     }
//     private onRefreshBuy(): void {
//         for (var k: number = 1; k < 7; k++) {
//             this.chapFileDatas[k - 1].data = { tp: 1, index: k };
//         }
//     }
//     private colorMatrix = [
//         0.3, 0.6, 0, 0, 0,
//         0.3, 0.6, 0, 0, 0,
//         0.3, 0.6, 0, 0, 0,
//         0, 0, 0, 1, 0];
//     private flilter = new egret.ColorMatrixFilter(this.colorMatrix);
//     protected onRefresh(): void {

//         for (var i: number = 0; i < this.maxChapterNum-1; i++) {
//             this.chapDatas[i].data = JsonModelManager.instance.getModelchapter()[i];
//         }
//         for (var k: number = 1; k < 7; k++) {
//             this.chapFileDatas[k - 1].data = { tp: 1, index: k };
//         }
//     }
//     protected onSkinName(): void {
//         this.skinName = skins.ChapterSkin;
//     }
// }
// class ChapterItem extends eui.Component {
//     public weijiesuo: eui.Group;
//     private redLine: eui.Label;
//     private cfg: Modelchapter;
//     private chapterId: eui.Label;
//     private desc: eui.Label;
//     private icon: eui.Image;
//     public constructor() {
//         super();
//         this.skinName = skins.ChapterItemSkin;
//         this.touchEnabled = false;
//     }
//     public set data(info) {
//         this.cfg = info;
//         if (this.cfg.id == 0) {
//             this.weijiesuo.visible = false;
//             this.chapterId.text = '0';

//         }
//         else {
//             if (UserInfo.chapterDatas[this.cfg.id - 1] || UserInfo.chapterDatas[this.cfg.id - 1] == 0) {
//                 this.weijiesuo.visible = false;
//             }
//             else {
//                 this.weijiesuo.visible = true;
//             }
//             this.chapterId.text = '0' + this.cfg.id;
//         }

//         if (this.cfg.id > 2) {
//             this.icon.source = 'chapter_' + 2 + '_png'
//         }
//         else {
//             this.icon.source = 'chapter_' + this.cfg.id + '_jpg'
//         }
//         this.desc.text = this.cfg.name;
//     }
//     /**设置是否有折扣**/
//     private onDiscountHandler(saleRate: number): void {

//     }

//     public set shenmmidata(info: shopdate) {

//     }
//     private onTouchBtn2() {

//     }
// }
// class ChapterFileItem extends eui.Component {
//     private chapterName: eui.Label;
//     private cfg: Modelchapter;
//     private chapterId: eui.Label;
//     private fileTime: eui.Label;
//     private icon: eui.Image;
//     private jiesuo: eui.Group;
//     private weijiesuo: eui.Group;
//     private info;
//     public constructor() {
//         super();
//         this.skinName = skins.ChapterFileItemSkin;
//         this.touchEnabled = false;
//     }
//     public set data(info) {
//         this.chapterName.text = GameDefine.FILE_NAMES[info.index];
//         if (!UserInfo.fileDatas[info.index]) {
//             this.jiesuo.visible = true;
//             this.weijiesuo.visible = false;
//             this.fileTime.text = '暂无存档';
//             this.chapterId.text = '';
//         }
//         else {

//             this.fileTime.text = Tool.getCurrDayTime(UserInfo.fileDatas[info.index].timestamp);
//             this.jiesuo.visible = true;
//             this.weijiesuo.visible = false;
//             this.chapterId.text = '存档' + info.index;
//             if (UserInfo.fileDatas[info.index].wentiId[UserInfo.fileDatas[info.index].wentiId.length - 1]) {
//                 var wentiId = UserInfo.fileDatas[info.index].wentiId[UserInfo.fileDatas[info.index].wentiId.length - 1];
//                 this.chapterId.text = '存档' + wentiId + '---' + JSON.stringify(UserInfo.fileDatas[info.index].wentiId);
//                 var curChapterCfg = JsonModelManager.instance.getModelchapter()[wentiModels[wentiId].chapter]
//                 if (curChapterCfg) {
//                     this.chapterId.text = curChapterCfg.name;
//                 }
//             }
//         }
//         // if (info.index > 3 && !ShopManager.getInstance().myShopData[1]) {
//         //     this.jiesuo.visible = false;
//         //     this.weijiesuo.visible = true;
//         // }
//         this.info = info;
//     }
//     /**设置是否有折扣**/
//     private onDiscountHandler(saleRate: number): void {

//     }

//     public set shenmmidata(info: shopdate) {

//     }
//     private onTouchBtn2() {

//     }
// }