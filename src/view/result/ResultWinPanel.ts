/**
 *
 * 胜利结算界面
 * @author    lzh
 *
 *
 */
class ResultWinPanel extends eui.Component {
    private btnMain: eui.Button;
    private btnNext: eui.Button;
    private mainGroup: eui.Group;
    private like: eui.Label;
    private titleGroup: eui.Group;
    private chapterName: eui.Label;
    private chapterName1: eui.Label;
    private labState: eui.Label;
    private titleName: eui.Label;
    private winEff: eui.Group;
    private role1: eui.Image;
    private role2: eui.Image;
    private role3: eui.Image;
    private role4: eui.Image;
    private roleIcon: eui.Image;
    private likeName: eui.Label;
    private jixu: eui.Button;
    private goodsLayer: eui.Group;
    private noneCJ: eui.Group;
    //商城类型按钮
    // public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private roleInfoWidth: number = 358;
    private _isEnd: boolean;
    private cur_chapter: number;
    private currIdx: number;
    private curIndex: number = -1;
    private colorMatrix = [
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0, 0, 0, 1, 0];
    private flilter = new egret.ColorMatrixFilter(this.colorMatrix);

    public constructor(isEnd: boolean) {
        super();
        this._isEnd = isEnd;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete(): void {
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
        // this.btnBuy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbuy, this)
        this.btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onContinue, this);
        this.btnMain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowMainView, this);
        this.jixu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onjixu, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        for (var i: number = 1; i < 5; i++) {
            this['roleItem' + i].name = i;
            this['roleItem' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickRoleItem, this);
        }
        this.updateResize();
        this.touchEnabled = true;
        this.touchChildren = true;
        if (!this._isEnd) {
            this.cur_chapter = 0;
            for (let i: number = 0; i < GameDefine.ROLE_JUQING_TREE.length; i++) {
                let ary: number[] = GameDefine.ROLE_JUQING_TREE[i];
                for (let n: number = 0; n < ary.length; n++) {
                    if (ary[n] == UserInfo.curchapter) {
                        this.cur_chapter = n > 0 ? ary[n - 1] : 1;
                        break;
                    }
                }
                if (this.cur_chapter) break;
            }

            this.chapterName.text = JsonModelManager.instance.getModelchapter()[this.cur_chapter].name;
            this.chapterName1.text = JsonModelManager.instance.getModelchapter()[this.cur_chapter].name;
        } else {
            this.cur_chapter = UserInfo.curchapter;
            this.chapterName.text = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter].name;
            this.chapterName1.text = JsonModelManager.instance.getModelchapter()[UserInfo.curchapter].name;
        }

        this.mainGroup.visible = false;
        this.winEff.visible = true;
        this.winEff.alpha = 0;
        this.onShowWinEffect();
        this.labState.text = '一完成章节一';
        this.labState.textColor = 0xCB7ED3;
        //在这里做一下存档
    }

    private onClickRoleItem(event: egret.Event) {
        var name: number = Number(event.currentTarget.name);
        if (this.curIndex != -1) {

            if (this.curIndex == name) {
                if (this['roleItem' + this.curIndex].getState != 0) {
                    this['roleItem' + this.curIndex].state = 0;
                    return;
                }

            }
            this['roleItem' + this.curIndex].state = 0;
        }

        this.curIndex = name;
        this['roleItem' + name].state = 1;
    }

    private onShowWinEffect() {
        var data = GameCommon.getInstance().getSortLike();
        for (var i: number = 1; i < 5; i++) {
            this['roleItem' + i].data = {idx: i - 1, xindong: data.id, chapter: this.cur_chapter}
        }
        var item: ResultChengJiuItem;
        this.goodsLayer.removeChildren();
        var cjNum: number = 0;
        for (var k in ChengJiuManager.getInstance().curChapterChengJiu) {
            var cfg: Modelchengjiu = JsonModelManager.instance.getModelchengjiu()[ChengJiuManager.getInstance().curChapterChengJiu[k]];
            if (cfg) {
                item = new ResultChengJiuItem();
                item.data = {id: ChengJiuManager.getInstance().curChapterChengJiu[k], roleId: cfg.tp2};
                this.goodsLayer.addChild(item);
                cjNum = cjNum + 1;
            }

        }
        if (cjNum == 0) {
            this.noneCJ.visible = true;
        } else {
            this.noneCJ.visible = false;
        }
        var tw = egret.Tween.get(this.winEff);
        tw.to({alpha: 1}, 1000);

    }

    private endWinEffect() {
        this.mainGroup.visible = true;
        this.winEff.visible = false;
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
    }

    private onContinue() {
        // if (UserInfo.curchapter > 3) {
        //     return;
        // }
        // else if (UserInfo.curchapter == 1) {
        //     GameCommon.getInstance().addAlert('功能暂未开放');
        //     return;
        // }
        // if (UserInfo.curchapter == 3) {
        //     if (ShopManager.getInstance().myShopData[1]) {

        //     }
        //     else {
        //         GameCommon.getInstance().addAlert('下一张是付费视频请购买')
        //         return;
        //     }
        // }
        // VideoManager.getInstance().clear();
        // if (VideoManager.getInstance().videoCurrTime < VideoManager.getInstance().getVideoDuration) {
        //     VideoManager.getInstance().videoPause();
        // }
        if (!this._isEnd) {
            GameCommon.getInstance().showLoading();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_CHAPTER_END));
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CONTINUE));
            switch (UserInfo.curchapter) {
                case 10:
                    GameCommon.getInstance().showCommomTips(`由于${GameDefine.ROLE_NAME[ROLE_INDEX.XiaoBai_Han]}的好感度最高，您即将进入${GameDefine.ROLE_NAME[ROLE_INDEX.XiaoBai_Han]}的故事`);
                    break;
                case 20:
                    GameCommon.getInstance().showCommomTips(`由于${GameDefine.ROLE_NAME[ROLE_INDEX.ZiHao_Xia]}的好感度最高，您即将进入${GameDefine.ROLE_NAME[ROLE_INDEX.ZiHao_Xia]}的故事`);
                    break;
                case 30:
                    GameCommon.getInstance().showCommomTips(`由于肖家兄弟的好感度最高，您即将进入肖家兄弟的故事`);
                    break;
            }
        } else {
            this.onShowMainView();
            GameCommon.getInstance().showCommomTips("好感度不足，无法继续进行");
        }

        this.touchEnabled = false;
        this.touchChildren = false;
    }

    private onjixu() {
        ChengJiuManager.getInstance().curChapterChengJiu = {};
        this.mainGroup.visible = true;
        this.mainGroup.alpha = 0;
        this.labState.text = '一获得成就一';
        this.labState.textColor = 0x60C0D1;
        var tw = egret.Tween.get(this.winEff);
        this.winEff.alpha = 1;
        var obj = this;
        tw.to({alpha: 0}, 1000).call(function () {
            obj.winEff.visible = false;
            tw = egret.Tween.get(obj.mainGroup);
            tw.to({alpha: 1}, 1000);
        });
    }

    private onbuy() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), 'ShopPanel')
    }

    private onShowMainView() {
        // if (UserInfo.curchapter > 2) {
        //     UserInfo.curchapter = 2;
        // }
        // VideoManager.getInstance().clear();
        // VideoManager.getInstance().clear();
        if (VideoManager.getInstance().videoCurrTime() < VideoManager.getInstance().getVideoDuration()) {
            VideoManager.getInstance().videoPause();
        }
        ChengJiuManager.getInstance().curChapterChengJiu = {};
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_CHAPTER_END));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_WIN));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ResultWinPanel');
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
    }

    //添加到舞台
    private onAddToStage(): void {
        this.skinName = skins.ResultWinSkin;
    }
}

class ResultWinItem extends eui.Component {
    public xindong: eui.Group;
    private haogan1: eui.Group;
    private redLine: eui.Label;
    private role0: eui.Image;
    private roleDi1: eui.Image;
    private roleName: eui.Image;
    private hide1: eui.Group;
    private desc1: eui.Label;
    private roleType: eui.Label;
    private roleTypeNams: string[] = ['主\n唱', '贝\n斯\n手', '吉\n他\n手', '键\n盘\n手'];
    private handAni: Animation;

    public constructor() {
        super();
        this.skinName = skins.ResultWinItemSkin;
        this.touchEnabled = false;
    }

    private _data;

    public set data(info) {
        this._data = info;
        if (info.idx == info.xindong) {
            this.haogan1.visible = true;
            this.handAni = new Animation('role_xin', -1);
            this.handAni.scaleX = 1;
            this.handAni.scaleY = 1;
            this.handAni.x = this.haogan1.width / 2;// - this.groupClick.width / 2;
            this.handAni.y = this.haogan1.height / 2;
            // - this.groupClick.height / 2;
            this.haogan1.addChild(this.handAni);
            this.handAni.onPlay();
        }
        var des = JsonModelManager.instance.getModelchapter()[info.chapter].des;
        var strs = des.split(';');
        this.desc1.text = strs[info.idx];
        this.roleType.text = this.roleTypeNams[info.idx];

        this.roleName.source = 'result_zi' + (info.idx + 1) + '_png';
        this.roleDi1.source = 'result_role_di' + (info.idx + 1) + '_png';
        this.role0.source = 'resultRoleImg' + info.idx + '_png';
    }

    public get getState(): number {

        return this._state
    }

    private _state: number = 0;
    public set state(st) {
        this._state = st;
        if (st == 1 && this._data.idx == this._data.xindong) {
            this.roleDi1.width = 298;
            var tw = egret.Tween.get(this);
            tw.to({width: 721}, 500);
            var tw1 = egret.Tween.get(this.roleDi1);
            tw1.to({width: 721}, 500);
            var obj = this;
            Tool.callbackTime(function () {
                obj.hide1.visible = true;
                this.roleDi1.source = 'result_role_kuandi' + (this._data.idx + 1) + '_png';
                // obj.hide1.width = 358;
            }, obj, 500);
            var idx: number = 0;
            this['roleCj1Group' + 1].visible = false;
            this['roleCj1Group' + 2].visible = false;
            this['roleCj1Group' + 3].visible = false;
            this.desc1.visible = false;
            for (var k in ChengJiuManager.getInstance().curChapterChengJiu) {
                var cfg: Modelchengjiu = JsonModelManager.instance.getModelchengjiu()[ChengJiuManager.getInstance().curChapterChengJiu[k]];
                if (cfg && (this._data.idx + 1) == cfg.tp2) {
                    this.desc1.visible = true;
                    idx = idx + 1;
                    if (idx > 3)
                        return;
                    this['titleId' + idx].text = cfg.titleID;
                    this['roleCj1Group' + idx].visible = true;
                }

            }

        } else {

            this.hide1.visible = false;
            this.hide1.width = 0;

            if (this.roleDi1.width != 298) {
                var tw = egret.Tween.get(this);
                tw.to({width: 301}, 500);
                var tw1 = egret.Tween.get(this.roleDi1);
                tw1.to({width: 298}, 500);
                var obj = this;
                Tool.callbackTime(function () {
                    obj.roleDi1.source = 'result_role_di' + (obj._data.idx + 1) + '_png';
                }, obj, 500);
            }

        }
    }

    public set shenmmidata(info) {

    }

    /**设置是否有折扣**/
    private onDiscountHandler(saleRate: number): void {

    }

    private onTouchBtn2() {

    }
}

class ResultChengJiuItem extends eui.Component {
    public xindong: eui.Group;
    private haogan1: eui.Group;
    private desc: eui.Label;
    private roleIcon: eui.Image;
    private cjName: eui.Label;
    private title: eui.Label;
    private weijiesuo: eui.Group;
    private jiesuo: eui.Group;
    private icon: eui.Image;
    private nandu: eui.Group;

    public constructor() {
        super();
        this.skinName = skins.ChengJiuItemSkin;
        this.touchEnabled = false;
    }

    private _data;

    public set data(info) {
        this.weijiesuo.visible = false;
        this.jiesuo.visible = false;
        this._data = info;
        this.nandu.visible = false;
        this.title.visible = true;
        var cfg: Modelchengjiu = JsonModelManager.instance.getModelchengjiu()[info.id];
        this.title.text = cfg.titleID;
        // this.cjName.text = cfg.titleID;
        // this.desc.text = cfg.des;
        this.icon.source = 'cj_suoluetu_' + info.id + '_png';
        // if (info.roleId > 2)
        //     return;
        // this.roleIcon.source = 'result_cj_role' + info.roleId + '_png';
    }
}
