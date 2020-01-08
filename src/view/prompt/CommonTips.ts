/**
 * 提示信息
 */
class CommonTips extends eui.Component {
    private grp: eui.Group;
    private idLike: eui.Image;
    private idChengjiu: eui.Image;
    private desc: eui.Label;
    private grp1: eui.Group;
    private desc1: eui.Label;
    private grp2: eui.Group;//即将进入互动；
    private grp3: eui.Group;
    private desc3: eui.Label;
    private grp4: eui.Group;
    private desc4: eui.BitmapLabel;
    private grp5: eui.Group;
    private qinmiGroup: eui.Group;
    private buyGrp: eui.Group;
    private buyGroup1: eui.Group;
    private buyGroup2: eui.Group;
    private btnCancel_buy: eui.Button;
    private btnConfirm_buy: eui.Button;
    private btnConfirm_qinmi: eui.Button;
    private btnConfirm_haogan: eui.Button;
    private btnCancel_haogan: eui.Button;
    private buyGrphaogan: eui.Group;
    private buyResult: eui.Group;
    private buyResultLab: eui.Label;
    private buyResultImg: eui.Image;
    private desc6: eui.Label;
    private moneyIcon: eui.Image;
    private moneyIcon1: eui.Image;
    private btn_qianwang: eui.Button;
    private result_closebtn: eui.Button;
    private logLab: eui.Label;
    private confirmGrp: eui.Group;
    private confirm_desc_lab: eui.Label;
    private confirm_desc2_lab: eui.Label;
    private confirm_btn: eui.Button;
    private cancel_btn: eui.Button;
    private centerConfirmBtn: eui.Button;
    private multiBtnGrp: eui.Group;
    private buyGroup3: eui.Group;
    //显示蒙板
    private mask_BG: eui.Image;
    private addChengJiuArr = [];
    private isLikeTime: boolean = false;
    private itemTp: number;
    private itemId: number;
    private _buyhaoganparams = {wentiId: 0, id: 0};
    /**二级确认框**/
    private _confirmFunc: Function;
    private _buyCallBack: Function;
    private mcFactory1: egret.MovieClipDataFactory;
    private img_mc: egret.MovieClip;
    private ldState: boolean = false;
    private roleChapterNoticeGroup: eui.Group;
    private roleChapterNoticeLabel: eui.Label;
    private idBuyItemName: eui.Label;
    private restartGrp: eui.Group;
    private restartConfirmBtn: eui.Button;
    private restartCancelBtn: eui.Button;
    private restartJQBtn: eui.Button;
    private backgroundRect: eui.Rect;

    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    public setText(text: string, bLike: boolean): void {
        this.addChengJiuArr.push({'text': text, 'bLike': bLike});
        if (this.isLikeTime == true) {
        } else {
            if (this.addChengJiuArr.length == 1) {
                this.grp.x = -2000;
                this.grp.visible = true;
                this.desc.text = (bLike ? '' : '成就: ') + text;
                this.idChengjiu.visible = !bLike;
                this.idLike.visible = bLike;
                this.grp.alpha = 0.7;
                let tw = egret.Tween.get(this.grp);//.wait(0).call(this.onCallBtnState, this);
                tw.to({x: 43}, 1500);
                tw.to({alpha: 1}, 2000);
                tw.to({alpha: 0}, 2000).wait(0).call(this.onCallBtnState, this);
            }
        }
        this.isLikeTime = false;
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
        if (str == 'preload失败请重新进入游戏')
            return;
        Tool.callbackTime(() => {
            this.grp3.visible = false;
        }, this, 2000);
    }

    public showRoleChapterNotice() {
        let str: string;
        switch (UserInfo.curchapter) {
            case 10:
                str = `—— 由于${GameDefine.ROLE_NAME[ROLE_INDEX.XiaoBai_Han]}的好感度最高，您即将进入${GameDefine.ROLE_NAME[ROLE_INDEX.XiaoBai_Han]}的故事 ——`;
                break;
            case 20:
                str = `—— 由于${GameDefine.ROLE_NAME[ROLE_INDEX.ZiHao_Xia]}的好感度最高，您即将进入${GameDefine.ROLE_NAME[ROLE_INDEX.ZiHao_Xia]}的故事 ——`;
                break;
            case 30:
                str = `—— 由于肖家兄弟的好感度最高，您即将进入肖家兄弟的故事 ——`;
                break;
        }
        const callback = () => {
            this.roleChapterNoticeGroup.visible = false;
            GameCommon.getInstance().showLoading();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CONTINUE));
        };
        if (str) {
            this.roleChapterNoticeLabel.text = str;
            this.roleChapterNoticeGroup.visible = true;
            egret.Tween.get(this.roleChapterNoticeGroup)
                .wait(3000)
                .call(callback);
        } else {
            callback();
        }
    }

    //互动操作提示
    public showActionTips(str) {
        this.desc4.text = str;
        this.grp4.visible = true;
    }

    public hideActionTips() {
        this.grp4.visible = false;
    }

    public onShowQinMiGroup() {
        this.qinmiGroup.visible = true;
        this.onshowMaskBG();
    }

    public onShowBuyTips(id, money, tp, buycallback) {
        //SoundManager.getInstance().playSound("ope_click.mp3");
        switch (tp) {
            case GOODS_TYPE.DIAMOND:
                if (platform.getPlatform() == "plat_txsp") {
                    this.moneyIcon.source = 'common_zuanshi2_png';
                    this.desc6.textColor = 0xBE34F9;
                    this.btnConfirm_buy["btn_icon"].source = "buy_btn_txsp_png";
                } else {
                    this.moneyIcon.source = 'common_zuanshi1_png';
                    this.desc6.textColor = 0xF2BD09;
                    this.btnConfirm_buy["btn_icon"].source = "buy_btn_zhuang_png";
                }
                break;
            case GOODS_TYPE.SUIPIAN:
                this.moneyIcon.source = 'common_yuese_png';
                break;
        }
        this.itemTp = tp;
        this.itemId = id;
        this._buyCallBack = buycallback;
        this.idBuyItemName.text = "“" + ShopManager.getInstance().getShopInfoData(id).model.name + "”";
        this.desc6.text = money + "";
        this.buyGroup1.visible = true;
        this.buyGrp.visible = true;
        this.onshowMaskBG();
    }

    public onShowBuyHaoGan(wentiId: number = 0, id: number = 0) {
        if (id > 0) {
            let price = ShopManager.getInstance().getShopInfoData(SHOP_TYPE.DAOJU * 100000 + wentiId * 100 + id).model.currPrice * platform.getPriceRate();
            this.btnConfirm_haogan['money'].text = price;//platform.getPriceRate()*price;
        }
        this._buyhaoganparams.wentiId = wentiId;
        this._buyhaoganparams.id = id;
        this.buyGrphaogan.visible = true;
        if (platform.getPlatform() == "plat_txsp") {
            this.moneyIcon1.source = "common_zuanshi2_png";
            this.btnConfirm_haogan["moneyIcon2"].source = "common_zuanshi2_png";
        }
        this.onshowMaskBG();
    }

    public onShowResultTips(str: string, isRight: boolean = true, btnlabel?: string, callBack?: Function, ...arys) {
        this.buyResult.visible = true;
        this.buyResultLab.text = str;
        this.buyResultImg.source = isRight ? "common_close2_png" : "common_close3_png";
        this.buyResult.alpha = 0;
        let tw = egret.Tween.get(this.buyResult);
        tw.to({alpha: 1}, 500);
        if (btnlabel) {
            this.result_closebtn.visible = true;
            this.btn_qianwang.visible = true;
            let btnClickFunc = (): void => {
                SoundManager.getInstance().playSound("ope_click.mp3")
                this.btn_qianwang.removeEventListener(egret.TouchEvent.TOUCH_TAP, btnClickFunc, this);
                this.buyResult.visible = false;
                callBack.call(null, arys);
            };
            this.btn_qianwang.label = btnlabel;
            this.btn_qianwang.addEventListener(egret.TouchEvent.TOUCH_TAP, btnClickFunc, this);
            let btnCloseClick = (): void => {
                SoundManager.getInstance().playSound("ope_click.mp3")
                this.result_closebtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, btnCloseClick, this);
                this.buyResult.visible = false;
            };
            this.result_closebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, btnCloseClick, this);
        } else {
            this.result_closebtn.visible = false;
            this.btn_qianwang.visible = false;
            tw.to({alpha: 1}, 50).wait(2000).to({alpha: 0}, 100).wait(0).call(() => {
                this.buyResult.visible = false;
            });
        }
    }

    public showConfirmTips(desc: string, callBack: Function, desc2?: string, textYes: string = "是", textNo: string = "否"): void {
        this.confirm_desc_lab.text = desc;
        this.confirm_desc2_lab.text = desc2 || "";
        this.multiBtnGrp.visible = true;
        this.centerConfirmBtn.visible = false;
        this._confirmFunc = callBack;
        if (!this.confirmGrp.visible) {
            this.confirmGrp.visible = true;
            this.confirm_btn.name = "sure";
            this.cancel_btn.name = "cancel";
            this.confirm_btn.label = textYes;
            this.cancel_btn.label = textNo;
        }
        this.onshowMaskBG();
    }

    public showStrongTips(desc: string, callBack: Function, textYes: string = "确定") {
        this.confirm_desc_lab.text = desc;
        this.confirm_desc2_lab.text = "";
        this._confirmFunc = callBack;
        this.multiBtnGrp.visible = false;
        this.centerConfirmBtn.visible = true;
        this.confirmGrp.visible = true;
        this.centerConfirmBtn.label = textYes;
        this.backgroundRect.visible = true;
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
        this.buyGrphaogan.visible = false;
        this.buyResult.visible = false;
        this.confirmGrp.visible = false;
        this.logLab.visible = platform.isDebug() || GameDefine.SHOW_LOG;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.btnCancel_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel_buy, this);
        this.btnConfirm_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnConfirm_buy, this);
        this.btnConfirm_qinmi.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnConfirm_qinmi, this);
        this.btnCancel_haogan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnCancel_haogan, this);
        this.btnConfirm_haogan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnConfirm_haogan, this);
        this.restartConfirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartConfirmBtnClick, this);
        this.restartCancelBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartCancelBtnClick, this);
        this.restartJQBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartJQBtnClick, this);
        this.confirm_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
        this.cancel_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirm, this);
        this.centerConfirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.centerConfirmBtnClick, this);
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
        this.addChildAt(this.mask_BG, 0);
    }

    private onhideMaskBG(): void {
        if (this.mask_BG) {
            if (this.mask_BG.parent) this.mask_BG.parent.removeChild(this.mask_BG);
        }
    }

    private onAddToStage(): void {
        this.onSkinName();
    }

    private onCallBtnState() {
        if (!this.addChengJiuArr || !this.addChengJiuArr.length)
            return;
        this.addChengJiuArr.shift();
        if (this.addChengJiuArr.length > 0) {
            this.grp.x = -2000;
            let t = this.addChengJiuArr[0];
            this.desc.text = (t.bLike ? '' : '成就: ') + t.text;
            this.idChengjiu.visible = !t.bLike;
            this.idLike.visible = t.bLike;
            this.grp.alpha = 0.7;
            let tw = egret.Tween.get(this.grp);//.wait(0).call(this.onCallBtnState, this);
            tw.to({x: 43}, 1500);
            tw.to({alpha: 1}, 2000);
            tw.to({alpha: 0}, 2000).wait(0).call(this.onCallBtnState, this);
        }
    }

    private onbtnConfirm_buy() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.buyGrp.visible = false;
        switch (this.itemTp) {
            case GOODS_TYPE.DIAMOND:
                ShopManager.getInstance().buyGoods(this.itemId, 1, () => {
                    if (this._buyCallBack)
                        this._buyCallBack()
                });
                break;
            case GOODS_TYPE.SUIPIAN:
                let shopdata: ShopInfoData = ShopManager.getInstance().getShopInfoData(this.itemId);
                if (shopdata.model.currSuipian == 0) {
                    GameCommon.getInstance().showCommomTips("此商品不能用碎片购买！");
                    return;
                }
                ShopManager.getInstance().buyGoodsSuip(this.itemId, 1, () => {
                    if (this._buyCallBack)
                        this._buyCallBack()
                });
                break;
        }
        this.onhideMaskBG();
    }

    private onCancel_buy() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.buyGrp.visible = false;
        this.onhideMaskBG();
    }


    private onbtnConfirm_qinmi() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.qinmiGroup.visible = false;
        this.onhideMaskBG();
        VideoManager.getInstance().videoResume();
    }

    private onbtnConfirm_haogan() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let itemId = GameCommon.getInstance().getWentiItemId(this._buyhaoganparams.wentiId, this._buyhaoganparams.id);
        ShopManager.getInstance().buyGoods(itemId, 1, () => {
            this.buyGrphaogan.visible = false;
            this.onhideMaskBG();
            VideoManager.getInstance().videoResume();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.BUY_HAOGAN), {
                wenti: this._buyhaoganparams.wentiId,
                answer: this._buyhaoganparams.id
            });
            this.onShowResultTips('解锁成功');
        });
    }

    private onbtnCancel_haogan() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.buyGrphaogan.visible = false;
        VideoManager.getInstance().videoResume();
        this.onhideMaskBG();
    }

    private onConfirm(event: egret.TouchEvent): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let name: string = event.currentTarget.name;
        if (name == "sure") {
            if (this._confirmFunc) this._confirmFunc.call(null, null);
        }
        this.confirmGrp.visible = false;
        this.onhideMaskBG();
    }

    private centerConfirmBtnClick() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (this._confirmFunc) {
            this._confirmFunc();
        }
        this.confirmGrp.visible = false;
        this.backgroundRect.visible = false;
    }

    public showRestartGroup() {
        this.restartGrp.visible = true;
        this.onshowMaskBG();
    }

    private restartConfirmBtnClick() {
        this.restartGrp.visible = false;
        this.onhideMaskBG();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.STARTCHAPTER), {
            cfg: JsonModelManager.instance.getModeljuqingkuai()[1][1],
            idx: FILE_TYPE.AUTO_FILE
        });
    }

    private restartCancelBtnClick() {
        this.restartGrp.visible = false;
        this.onhideMaskBG();
    }

    private restartJQBtnClick() {
        this.restartGrp.visible = false;
        this.onhideMaskBG();
        GameDefine.IS_DUDANG = false;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), "JuQingPanel");
    }

    public toggleLogVisible() {
        this.logLab.visible = !this.logLab.visible;
    }
}
