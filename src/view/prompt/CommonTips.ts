/**
 * 提示信息
 */
class CommonTips extends eui.Component {
    private grp: eui.Group;
    private desc: eui.Label;
    private grp1: eui.Group;
    private desc1: eui.Label;
    private grp2: eui.Group;
    private grp3: eui.Group;
    private desc3: eui.Label;
    private grp4: eui.Group;
    private desc4: eui.BitmapLabel;
    private grp5: eui.Group;
    private desc5: eui.Label;
    private qinmiGroup: eui.Group;
    private buyGrp: eui.Group;
    private buyGroup1: eui.Group;
    private buyGroup2: eui.Group;
    private btnCancel: eui.Button;
    private btnConfirm: eui.Button;
    private btnConfirm1: eui.Button;
    private btnConfirm2: eui.Button;
    private btnCancel1: eui.Button;
    private buyGrp1: eui.Group;
    private buyResult: eui.Group;
    private buyResultLab: eui.Label;
    private buyResultImg: eui.Image;
    private desc6: eui.Label;
    private moneyIcon: eui.Image;
    private btn_qianwang: eui.Button;
    private result_closebtn: eui.Button;
    private logLab: eui.Label;
    private confirmGrp: eui.Group;
    private confirm_desc_lab: eui.Label;
    private confirm_desc2_lab: eui.Label;
    private confirm_btn: eui.Button;
    private cancel_btn: eui.Button;
    //显示蒙板
    private mask_BG: eui.Image;
    private addChengJiuArr = [];
    private isLikeTime: boolean = false;
    private itemTp: number;
    private itemId: number;
    private _showBuyCall;
    private _buyId: number = 0;
    /**二级确认框**/
    private _confirmFunc: Function;
    private mcFactory1: egret.MovieClipDataFactory;
    private img_mc: egret.MovieClip;
    private ldState: boolean = false;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public setText(text: string): void {
        this.addChengJiuArr.push(text);
        var obj = this;
        if (this.isLikeTime == true) {
            Tool.callbackTime(function () {
                if (obj.addChengJiuArr.length == 1) {
                    obj.grp.x = -2000;
                    obj.grp.visible = true;
                    obj.desc.text = '成就: ' + text;
                    obj.grp.alpha = 0.7;
                    var tw = egret.Tween.get(obj.grp);//.wait(0).call(this.onCallBtnState, this);
                    tw.to({x: 43}, 1500);
                    tw.to({alpha: 1}, 2000);
                    tw.to({alpha: 0}, 2000).wait(0).call(obj.onCallBtnState, obj);
                    var tw1 = egret.Tween.get(obj.grp1);//.wait(0).call(this.onCallBtnState, this);
                    tw1.to({y: 257}, 500);
                }
            }, obj, 1000);
        } else {
            if (this.addChengJiuArr.length == 1) {
                obj.grp.x = -2000;
                obj.grp.visible = true;
                obj.desc.text = '成就: ' + text;
                obj.grp.alpha = 0.7;
                var tw = egret.Tween.get(obj.grp);//.wait(0).call(this.onCallBtnState, this);
                tw.to({x: 43}, 1500);
                tw.to({alpha: 1}, 2000);
                tw.to({alpha: 0}, 2000).wait(0).call(obj.onCallBtnState, obj);
            }
        }
        this.isLikeTime = false;
    }

    public setLike(text: string): void {
        this.isLikeTime = true;
        this.grp1.x = -1000;
        // this.desc1.x = -2000;
        this.grp1.alpha = 1;
        this.desc1.text = text;
        this.grp1.y = 148;
        var tw = egret.Tween.get(this.grp1);//.wait(0).call(this.onCallBtnState, this);
        tw.to({x: 43}, 800);
        tw.to({alpha: 0.9}, 2000);
        tw.to({alpha: 0}, 1500);
        var obj = this;
        // var tw1 = egret.Tween.get(this.desc1);//.wait(0).call(this.onCallBtnState, this);
        // tw1.to({ x: 116 }, 1400)
        // .call(function () {
        //     obj.isLikeTime = false
        // }, obj);
    }

    //互动即将到来提示
    public setTipsHuDong() {
        if (!this.ldState) {
            if (!this.mcFactory1) {
                this.mcFactory1 = new egret.MovieClipDataFactory();
                this.mcFactory1.mcDataSet = RES.getRes("loading_json");
                this.mcFactory1.texture = RES.getRes("loading_png");
                this.img_mc = new egret.MovieClip();
                this.img_mc.movieClipData = this.mcFactory1.generateMovieClipData("action");
                this.img_mc.x = 40;
                this.img_mc.y = 27;
                this.img_mc.scaleX = 0.4;
                this.img_mc.scaleY = 0.4;
                this.grp2.addChild(this.img_mc);
            }
            this.img_mc.visible = true;
            this.img_mc.play(-1);
            this.ldState = true;
        }
        this.grp2.x = size.width - 350;
        this.grp2.y = 150;
        this.grp2.visible = true;
    }

    public hideTipsHuDong() {
        this.grp2.visible = false;
    }

    //购买成功提示
    public setTipsLab(str) {
        // this.grp3.x = size.width - 350;
        // this.grp3.y = 50;
        this.desc3.text = str;
        this.grp3.visible = true;
        var obj = this;
        if (str == 'preload失败请重新进入游戏')
            return;
        Tool.callbackTime(function () {
            obj.grp3.visible = false;
        }, obj, 1000);
    }

    //互动操作提示
    public showActionTips(str) {
        this.desc4.text = str;
        this.grp4.visible = true;
    }

    public hideActionTips() {
        this.grp4.visible = false;
    }

    //功能开启提示
    public onShowOpenTips(str) {
        this.grp3.x = size.width - 350;
        this.grp3.y = 50;
        this.desc3.text = str;
        this.grp3.visible = true;
        var obj = this;
        Tool.callbackTime(function () {
            obj.grp3.visible = false;
        }, obj, 1000);
    }

    public onShowQinMiGroup() {
        this.qinmiGroup.visible = true;
        this.onshowMaskBG();
    }

    public onShowBuyTips(id, money, tp) {
        switch (tp) {
            case GOODS_TYPE.DIAMOND:
                this.moneyIcon.source = 'common_zuanshi1_png';
                break;
            case GOODS_TYPE.SUIPIAN:
                this.moneyIcon.source = 'common_yuese_png';
                break;
        }
        this.itemTp = tp;
        this.itemId = id;
        this.desc6.text = money + "";
        this.buyGroup1.visible = true;
        this.buyGrp.visible = true;
        this.onshowMaskBG();
    }

    public onShowBuyHaoGan(id: number = 0, onCallBtnState) {
        if (id > 0) {
            var spCfg: Modelshop = JsonModelManager.instance.getModelshop()[id];
            this.btnConfirm2['money'].text = 10;
        }
        this._buyId = id;
        this._showBuyCall = onCallBtnState;
        this.buyGrp1.visible = true;
        this.onshowMaskBG();
    }

    public onShowResultTips(str: string, isRight: boolean = true, btnlabel?: string, callBack?: Function, ...arys) {
        this.buyResult.visible = true;
        this.buyResultLab.text = str;
        this.buyResultImg.source = isRight ? "common_close2_png" : "common_close3_png";
        this.buyResult.alpha = 0;
        var obj = this;
        var tw = egret.Tween.get(this.buyResult);
        tw.to({alpha: 1}, 1000);
        if (btnlabel) {
            this.result_closebtn.visible = true;
            this.btn_qianwang.visible = true;
            var btnClickFunc = function (): void {
                obj.btn_qianwang.removeEventListener(egret.TouchEvent.TOUCH_TAP, btnClickFunc, this);
                obj.buyResult.visible = false;
                callBack.call(null, arys);
            };
            this.btn_qianwang.label = btnlabel;
            this.btn_qianwang.addEventListener(egret.TouchEvent.TOUCH_TAP, btnClickFunc, this);
            var btnCloseClick = function (): void {
                obj.result_closebtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, btnCloseClick, this);
                obj.buyResult.visible = false;
            };
            this.result_closebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, btnCloseClick, this);
        } else {
            this.result_closebtn.visible = false;
            this.btn_qianwang.visible = false;
            tw.to({alpha: 0.8}, 500);
            tw.to({alpha: 0}, 100).wait(0).call(function () {
                obj.buyResult.visible = false;
            });
        }
    }

    public showConfirmTips(desc: string, callBack: Function, desc2?: string): void {
        this.confirm_desc_lab.text = desc;
        if (desc2) this.confirm_desc2_lab.text = desc2;
        this._confirmFunc = callBack;
        if (!this.confirmGrp.visible) {
            this.confirmGrp.visible = true;
            this.confirm_btn.name = "sure";
            this.cancel_btn.name = "cancel";
            this.confirm_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
            this.cancel_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
        }
        this.onshowMaskBG();
    }

    public showErrorLog(str: string): void {
        this.logLab.text += "\n" + str;
    }

    protected onSkinName(): void {
        this.skinName = skins.CommonTipsSkin;
    }

    //供子类覆盖
    protected onInit(): void {
        this.grp.alpha = 0;
        this.grp1.alpha = 0;
        this.grp2.visible = false;
        this.grp3.visible = false;
        this.grp4.visible = false;
        this.grp5.visible = false;
        this.buyGrp.visible = false;
        this.buyGroup1.visible = false;
        this.buyGroup2.visible = false;
        this.qinmiGroup.visible = false;
        this.buyGrp1.visible = false;
        this.buyResult.visible = false;
        this.confirmGrp.visible = false;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.btnCancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
        this.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnConfirm, this);
        this.btnConfirm1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnConfirm1, this);
        this.btnCancel1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel1, this);
        this.btnConfirm2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnConfirm2, this);
        this.updateResize();
        this.onInit();
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        this.x = (size.width - this.width) / 2;
        this.y = (size.height - this.height) / 2;
    }

    private onshowMaskBG(): void {
        if (!this.mask_BG) {
            this.mask_BG = new eui.Image("zhezhao_png");
        }
        this.mask_BG.width = size.width;
        this.mask_BG.height = size.height;
        // this.x = -parnetGrp.x;
        // this.y = -parnetGrp.y;
        this.addChildAt(this.mask_BG, 0);
    }

    private onhideMaskBG(): void {
        if (this.mask_BG) {
            if (this.mask_BG.parent) this.mask_BG.parent.removeChild(this.mask_BG);
        }
    }

    private onAddToStage(event: egret.Event): void {
        this.onSkinName();
    }

    private onCallBtnState() {
        if (!this.addChengJiuArr || !this.addChengJiuArr.length)
            return;
        this.addChengJiuArr.shift();
        if (this.addChengJiuArr.length > 0) {
            this.grp.x = -2000;
            this.desc.text = '成就: ' + this.addChengJiuArr[0];
            this.grp.alpha = 0.7;
            var tw = egret.Tween.get(this.grp);//.wait(0).call(this.onCallBtnState, this);
            tw.to({x: 43}, 1500);
            tw.to({alpha: 1}, 2000);
            tw.to({alpha: 0}, 2000).wait(0).call(this.onCallBtnState, this);
        }
    }

    private onbtnConfirm() {
        this.buyGrp.visible = false;
        switch (this.itemTp) {
            case GOODS_TYPE.DIAMOND:
                ShopManager.getInstance().buyGoods(this.itemId);
                break;
            case GOODS_TYPE.SUIPIAN:
                ShopManager.getInstance().buyGoodsSuip(this.itemId);
                break;
        }
        this.onhideMaskBG();
    }

    private onbtnConfirm1() {
        this.qinmiGroup.visible = false;
        this.onhideMaskBG();
        VideoManager.getInstance().videoResume();
    }

    private onCancel() {
        this.buyGrp.visible = false;
        this.onhideMaskBG();
    }

    private onbtnConfirm2() {
        this.buyGrp1.visible = false;
        VideoManager.getInstance().videoResume();
        // if (this._showBuyCall) {
        // 	Tool.callback(this._showBuyCall, this._buyId, this._buyId);
        // }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_HAOGAN));

        this.onShowResultTips('解锁成功');
        this.onhideMaskBG();
    }

    private onCancel1() {
        this.buyGrp1.visible = false;
        VideoManager.getInstance().videoResume();
        this.onhideMaskBG();
    }

    private onConfirm(event: egret.TouchEvent): void {
        let name: string = event.currentTarget.name;
        if (name == "sure") {
            if (this._confirmFunc) this._confirmFunc.call(null, null);
        }
        this.confirmGrp.visible = false;
        this.confirm_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
        this.cancel_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
        this.onhideMaskBG();
    }
}
