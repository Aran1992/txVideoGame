// // TypeScript file
// class CunDangPanel extends eui.Component {
//     private mainGroup: eui.Group;
//     private bgBtn: eui.Button;
//     private fileBtn: eui.Button;
//     private fileGroup: eui.Group;
//     private chapterGroup: eui.Group;
//     private FirmGroup: eui.Group;
//     private confirmBtn1: eui.Button;
//     private cancelBtn1: eui.Button;
//     private confirmBtn: eui.Button;
//     private buyGroup: eui.Group;
//     private cancelBtn: eui.Button;
//     private bgBtn1: eui.Button;
//     private chapFileDatas: ChapterFileItem[];
//     private jixu:eui.Group;
//     private dianjicundang:eui.Group;
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
//         GameDispatcher.getInstance().addEventListener(GameEvent.AUTO_UPDATA, this.onRefreshUpdata, this);
//         GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onRefreshBuy, this);
//         for (var k: number = 1; k < 7; k++) {
//             this['fileBtn' + k].name = k;
//             this['fileBtn' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReadFile, this);
//         }
//         this.bgBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseFile, this);
//         this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
//         this.fileBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowFile, this);
//         this.confirmBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFirmBtn1, this);
//         this.cancelBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel1, this);
//         this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFirmBtn, this);
//         this.cancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
//     }
//     protected onRemove(): void {
//         GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onRefreshBuy, this);
//         for (var k: number = 1; k < 7; k++) {
//             this['fileBtn' + k].name = k;
//             this['fileBtn' + k].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReadFile, this);
//         }
//          GameDispatcher.getInstance().removeEventListener(GameEvent.AUTO_UPDATA, this.onRefreshUpdata, this);
//         this.fileBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowFile, this);
//         this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
//     }
//     private onFirmBtn() {
//         // GameCommon.getInstance().addAlert('暂未接通支付接口');
//         ShopManager.getInstance().myShopData[1] = 1;
//         ChengJiuManager.getInstance().onDlcChengJiu(1);
//         this.buyGroup.visible = false;
//         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_REFRESH))
//     }
//     private onCancel() {
//         this.buyGroup.visible = false;
//     }
//     private onFirmBtn1() {

//         if (!UserInfo.guideDic[1]) {
//             UserInfo.guideDic[1] = 1;
//             // this.jixu.visible = true;
//             GuideManager.getInstance().onCloseImg();
//             // Tool.callbackTime(function () {
//             //             GameCommon.getInstance().setBookData(FILE_TYPE.GUIDE_TP);
//             //  }, {}, 2000)
//             GuideManager.getInstance().isGuide = false;
//             GuideManager.getInstance().curState = false;
//         }
//         GameCommon.getInstance().setBookData(this.curIndex);
//         this.FirmGroup.visible = true;
//         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'CunDangPanel')
//     }
//     private onCloseFile() {
//         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'CunDangPanel')
//     }
//     private onCancel1() {
//         this.FirmGroup.visible = false;
//     }
//     private curIndex: number = 0;
//     private onReadFile(event: egret.Event) {
//         var name: number = Number(event.currentTarget.name);
//         if (name == 1) {
//             return;
//         }
//         if (!UserInfo.guideDic[1]) {
//             if (name != 2) {
//                 return;
//             }
//             this.dianjicundang.visible = false;
//             GuideManager.getInstance().onCloseImg();
//             GuideManager.getInstance().onShowImg(this, this.confirmBtn1, 'querencundang');
//         }
//         this.FirmGroup.visible = true;
//         this.curIndex = name;

//     }
//     private onShowFile() {
//         this.fileGroup.visible = true;
//         this.chapterGroup.visible = false;
//     }
//     private onClose() {
//         this.jixu.visible = false;
//         GuideManager.getInstance().curState = true;
//         GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'CunDangPanel')
//     }
//     private updateResize() {
//         this.width = size.width;
//         this.height = size.height;
//     }
//     private onRefreshUpdata() {
//             this.onRefreshBuy();
//     }
//     private onLoadComplete(): void {
//         GuideManager.getInstance().curState = false;
//         this.touchEnabled = false;
//         this.onInit();
//         this.onRegist();
//         this.updateResize();
//         GameDefine.ISFILE_STATE = false;
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE2)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE3)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE4)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE5)
//         GameCommon.getInstance().getBookHistory(FILE_TYPE.FILE6)
//         if (!UserInfo.guideDic[1]) {
//             for (var k: number = 1; k < 7; k++) {
//                 this['fileBtn' + k].touchEnabled = false;
//                 this.bgBtn.touchEnabled = false;
//                 this.cancelBtn.touchEnabled = false;
//                 this.cancelBtn1.touchEnabled = false;
//             }
//             this.dianjicundang.visible = true;
//             GuideManager.getInstance().onShowImg(this['guideGroup'], this['guideGroup'], 'cundang');
//         }
//         this['fileBtn' + 2].touchEnabled = true;
//     }
//     //供子类覆盖
//     protected onInit(): void {
//         if (!this.chapFileDatas) {
//             this.chapFileDatas = [];
//             for (var k: number = 1; k < 7; k++) {
//                 this.chapFileDatas.push(this['fileBtn' + k]);
//             }
//         }
//         this.fileGroup.visible = true;
//         this.chapterGroup.visible = false;
//         this.onRefresh();
//     }
//     private onRefreshBuy(): void {
//         for (var k: number = 1; k < 7; k++) {
//             this.chapFileDatas[k - 1].data = { tp: 2, index: k };
//         }
//     }
//     protected onRefresh(): void {
//         for (var k: number = 1; k < 7; k++) {
//             this.chapFileDatas[k - 1].data = { tp: 2, index: k };
//         }
//     }
//     protected onSkinName(): void {
//         this.skinName = skins.ChapterSkin;
//     }
// }
