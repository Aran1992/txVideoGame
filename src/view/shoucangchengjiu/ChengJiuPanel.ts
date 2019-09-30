// TypeScript file
class ChengJiuPanel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private goodsLayer: eui.Group;
    private goodsLayer1: eui.Group;
    private goodsLayer2: eui.Group;
    private scroll: eui.Scroller;
    private scroll1: eui.Scroller;
    private scroll2: eui.Scroller;

    private taskGroup: eui.Group;
    private taskGroup1: eui.Group;
    private taskGroup2: eui.Group;

    private tabGroup: eui.Group;
    private tab1Group: eui.Group;
    private dianjicundang: eui.Group;
    private fanhuiLab: eui.Group;
    private wanchengdu: eui.Label;//BitmapLabel
    private suipNum: eui.BitmapLabel;

    private closeGroup2: eui.Group;
    private closeGroup1: eui.Group;
    private bgBtn1: eui.Button;
    private roleName: eui.Label;
    private tabIdx: number = 0;
    private currIdx: number = 1;

    constructor(data) {
        super();

        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.CHENGJIU_REFRESH, this.onRefresh, this);
        for (var i: number = 1; i < 7; i++) {
            this['cjBtn' + i].name = i;
            this['cjBtn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChengJiu, this);
        }
        for (var k: number = 0; k < 2; k++) {
            // this['tabBtn' + k].name = k;
            // this['tabBtn' + k]['icon1'].visible = false;
            // this['tabBtn' + k]['icon2'].visible = false;
            this['tabBtn' + k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeTab, this);
        }
        // this['tabBtn0']['icon1'].visible = true;
        // this['tabBtn0']['icon2'].visible = true;
        this.bgBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideList, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        // this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
    }

    protected onRemove(): void {
        // this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        for (var i: number = 1; i < 7; i++) {
            this['cjBtn' + i].name = i;
            this['cjBtn' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowChengJiu, this);

        }
        for (var k: number = 0; k < 2; k++) {
            // this['tabBtn' + k].name = k;
            this['tabBtn' + k].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeTab, this);
        }
        GameDispatcher.getInstance().removeEventListener(GameEvent.CHENGJIU_REFRESH, this.onRefresh, this);
        this.bgBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHideList, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }

    //供子类覆盖
    protected onInit(): void {
        // this.showGoods(1);
        var item: ChengJiuRoleItem;
        this.taskGroup.visible = false;
        this.taskGroup1.visible = true;
        this.taskGroup2.visible = false;
        for (var j: number = 1; j < 5; j++) {
            item = new ChengJiuRoleItem();
            item.data = j;
            item.name = j + '';
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowRoleItemList, this);
            this.goodsLayer1.addChild(item);
        }
        // return;
    }

    protected onSkinName(): void {
        this.skinName = skins.ChengJiuSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onClose() {
        // if (!UserInfo.guideDic[5])//关闭界面去进行商城引导
        // {
        //     UserInfo.guideDic[5] = 5;
        //     GuideManager.getInstance().onCloseImg();
        // }
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GO_MAINVIEW));
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChengJiuPanel')
    }

    private onRefresh() {
        // if (!UserInfo.guideDic[5])//关闭界面去进行商城引导
        // {
        //     this.dianjicundang.visible = false;
        //     this.fanhuiLab.visible = true;
        //     this.tabGroup.touchChildren = false;
        //     this.tab1Group.touchChildren = false;
        //     this.taskGroup.touchChildren = false;
        //     this.tabGroup.touchEnabled = false;
        //     this['cjBtn1'].touchEnabled = false;
        //     this['cjBtn2'].touchEnabled = false;
        //     this['cjBtn3'].touchEnabled = false;
        //     this.tab1Group.touchEnabled = false;
        //     this.taskGroup.touchEnabled = false;
        //     this.bgBtn.touchEnabled = true;
        //     UserInfo.guideDic[5] = 5;
        //     GuideManager.getInstance().onShowImg(this.mainGroup, this.bgBtn, 'leftClose');
        // }
        this.suipNum.text = UserInfo.suipianMoney + '';
        this.showGoods(this.currIdx);
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
    }

    private onChangeTab(event: egret.Event) {
        // var index: number = Number(event.target.name);
        SoundManager.getInstance().playSound("ope_click.mp3")
        let tabButton: eui.RadioButton = event.currentTarget as eui.RadioButton;
        var index: number = tabButton.value;//Number(event.target.name);

        if (this.tabIdx == index)
            return;
        // this['tabBtn' + this.tabIdx]['icon1'].visible = false;
        // this['tabBtn' + this.tabIdx]['icon2'].visible = false;

        this.tabIdx = index;
        // this['tabBtn' + this.tabIdx]['icon1'].visible = true;
        // this['tabBtn' + this.tabIdx]['icon2'].visible = true;
        // for (var i: number = 0; i < 2; i++) {
        //     if (i == this.tabIdx) {
        //         this['tabBtn' + i].icon = 'cj_biaoqian1_png';
        //     }
        //     else {
        //         this['tabBtn' + i].icon = 'cj_biaoqian2_png';
        //     }
        // }
        if (index == 0) {
            var item: ChengJiuRoleItem;
            this.goodsLayer1.removeChildren();
            this.taskGroup.visible = false;
            this.taskGroup1.visible = true;
            for (var j: number = 1; j < 5; j++) {
                item = new ChengJiuRoleItem();
                item.data = j;
                item.name = j + '';
                item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowRoleItemList, this);
                this.goodsLayer1.addChild(item);
            }
            return;
        } else {
            this.closeGroup1.visible = true;
            this.closeGroup2.visible = false;
            this.taskGroup.visible = true;
            this.taskGroup1.visible = false;
            this.showGoods(this.currIdx);
        }

    }

    private onHideList() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.closeGroup1.visible = true;
        this.closeGroup2.visible = false;
        this.goodsLayer2.removeChildren();
        this.taskGroup2.visible = false;
        this.taskGroup1.visible = true;
    }

    private onShowRoleItemList(event: egret.Event) {
        SoundManager.getInstance().playSound("ope_click.mp3")
        var index: number = Number(event.currentTarget.name);
        this.closeGroup1.visible = false;
        this.closeGroup2.visible = true;
        this.bgBtn1.label = GameDefine.ROLE_NAME[index - 1];
        var cfgs = ChengJiuManager.getInstance().cjAllCfgs;
        var item: ChengJiuItem;
        this.goodsLayer2.removeChildren();
        this.taskGroup1.visible = false;
        this.taskGroup2.visible = true;
        // if (index == 1) {
        //     item = new ChengJiuItem();
        //     item.data = cfgs[17];
        //     this.goodsLayer2.addChild(item);
        // }
        var datas = [];
        for (var k in cfgs) {
            // if (cfgs[k].id != 17) {
            if (cfgs[k].tp2 == index) {
                // item = new ChengJiuItem();
                // item.data = cfgs[k];
                // this.goodsLayer2.addChild(item);
                let idx = this.getSt(cfgs[k]);
                datas.push({cfg: cfgs[k], idx: idx});
            }
            // }
        }
        if (datas.length > 0) {
            this.sortCj(datas);
            for (var i: number = 0; i < datas.length; i++) {
                item = new ChengJiuItem();
                item.data = datas[i].cfg;
                this.goodsLayer2.addChild(item);
            }
        }
    }

    private onShowChengJiu(event: egret.Event) {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        var index: number = Number(event.target.name);
        if (this.currIdx == index)
            return;
        this.showGoods(index);
    }

    private sortCj(data) {
        var obj = this;
        data.sort(function (arg1, arg2) {
            if (arg1.idx == arg2.idx) {
                return arg1.cfg.id - arg2.cfg.id;
            }
            return arg1.idx - arg2.idx;
        });
        return data;
    }

    private getSt(data) {
        if (UserInfo.achievementDics[data.id]) {
            if (UserInfo.achievementDics[data.id].iscomplete == 2) {
                return 3;
            } else if (UserInfo.achievementDics[data.id].iscomplete == 1) {
                return 1;
            } else {
                return 2;
            }
        } else {
            return 2;
        }
    }

    private showGoods(index) {
        this.taskGroup2.visible = false;
        this.taskGroup1.visible = false;
        this['cjBtn' + this.currIdx].icon = '';
        this['cjBtn' + this.currIdx].touchEnabled = true;
        this.currIdx = index;
        this['cjBtn' + index].icon = 'cundang_kuang1_png';
        this['cjBtn' + index].touchEnabled = false;
        var cfgs = ChengJiuManager.getInstance().cjAllCfgs;
        var item: ChengJiuItem;
        this.goodsLayer.removeChildren();
        // if (index == 1) {
        //     item = new ChengJiuItem();
        //     item.data = cfgs[17];
        //     this.goodsLayer.addChild(item);
        // }
        let datas = [];
        for (var k in cfgs) {
            if (index == 1) {
                // if (cfgs[k].id != 17) {
                // if (cfgs[k].tp2 == this.tabIdx || this.tabIdx == 0) {
                // item = new ChengJiuItem();
                // item.data = cfgs[k];
                // this.goodsLayer.addChild(item);
                // }
                // }
                let idx = this.getSt(cfgs[k]);
                datas.push({cfg: cfgs[k], idx: idx});
            } else if (cfgs[k].level == index - 1) {
                // if (cfgs[k].id != 17) {
                // if (cfgs[k].tp2 == this.tabIdx || this.tabIdx == 0) {
                // item = new ChengJiuItem();
                // item.data = cfgs[k];
                // this.goodsLayer.addChild(item);
                let idx = this.getSt(cfgs[k]);
                datas.push({cfg: cfgs[k], idx: idx});
                // }
                // }
            }
        }
        if (datas.length > 0) {
            this.sortCj(datas);
            for (var i: number = 0; i < datas.length; i++) {
                item = new ChengJiuItem();
                item.data = datas[i].cfg;
                this.goodsLayer.addChild(item);
            }
        }
        // this.scroll.viewport.scrollV = 0;
    }

    private onLoadComplete(): void {
        this.suipNum.text = UserInfo.suipianMoney + '';
        this.touchEnabled = false;
        this.onInit();
        this.onRegist();
        this.updateResize();
        this.fanhuiLab.visible = false;
        var num: number = 0;
        for (var k in UserInfo.achievementDics) {
            num = num + 1;
        }
        this.wanchengdu.text = Math.floor(num / ChengJiuManager.getInstance().getMaxChengJiuMax() * 100) + '%';
        // UserInfo.guideDic[5] = 5;
        // if (!UserInfo.guideDic[5])//先检测成就引导是否OK
        // {
        //     this.dianjicundang.visible = true;
        //     this.tabGroup.touchChildren = false;
        //     this.tab1Group.touchChildren = false;
        //     this.tabGroup.touchEnabled = false;
        //     this['cjBtn1'].touchEnabled = false;
        //     this['cjBtn2'].touchEnabled = false;
        //     this['cjBtn3'].touchEnabled = false;
        //     this.tab1Group.touchEnabled = false;
        //     this.bgBtn.touchEnabled = false;
        //     this.taskGroup.touchChildren = true;
        //     GuideManager.getInstance().onShowImg(this.taskGroup, this.taskGroup, 'chengjiu');
        // }
    }
}

class ChengJiuItem extends eui.Component {
    public title: eui.Label;
    public pro: eui.Button;
    private icon: eui.Image;
    private info;
    private desc2: eui.Label;
    private weijiesuo: eui.Group;
    private jiesuo: eui.Group;
    private num: eui.Label;
    private difficulty: eui.Label;

    public constructor() {
        super();
        this.skinName = skins.ChengJiuItemSkin;
        this.touchEnabled = false;
    }

    public set data(info) {
        this.info = info;
        this.title.text = info.titleID;
        if (UserInfo.achievementDics[info.id] && UserInfo.achievementDics[info.id].iscomplete > 0) {
            this.weijiesuo.visible = false;
            this.jiesuo.visible = true;
            if (UserInfo.achievementDics[info.id].iscomplete == 2) {
                this.num.text = '已领取';
            } else {
                this.num.text = '+' + info.jianglisuipian;
            }
        } else {
            this.weijiesuo.visible = true;
            this.jiesuo.visible = false;
        }
        this.difficulty.textColor = GameDefine.CJ_LEVEL_COLOR[info.level];
        this.difficulty.text = GameDefine.CJ_LEVEL_NAME[info.level];
        this.icon.source = 'cj_suoluetu_' + info.id + '_png';
        this.icon.width = 258;
        this.icon.height = 289;
        // if (info.tp2 == '') {
        //     this.icon.source = 'cj_head1_png';
        // }
        this.jiesuo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
    }

    private onGet() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        if (UserInfo.achievementDics[this.info.id].iscomplete == 2) {
            this.onTouchBtn();
            return;
        } else {
            this.num.text = '已领取';
            if (UserInfo.achievementDics[this.info.id].iscomplete == 1) {
                UserInfo.achievementDics[this.info.id].iscomplete = 2;
                GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
                if (this.info.jianglisuipian > 0) {
                    UserInfo.suipianMoney += this.info.jianglisuipian;
                }
                GameCommon.getInstance().onShowResultTips('领取成功');
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CHENGJIU_REFRESH));
            }
        }

    }

    private onTouchBtn() {//更改的地方
        // if (UserInfo.achievementDics[this.info.id]) {
        //     if (UserInfo.achievementDics[this.info.id].iscomplete == 1) {
        //         UserInfo.achievementDics[this.info.id].iscomplete = 2;
        //         GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        //         if (this.info.jianglisuipian > 0) {
        //             UserInfo.suipianMoney += this.info.jianglisuipian;
        //         }
        //         GameCommon.getInstance().showCommomTips('领取成功');
        //     }
        // }
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CHENGJIU_REFRESH));
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW), {
            windowName: 'ChengJiuItemPanel',
            data: this.info
        })
    }
}

class ChengJiuRoleItem extends eui.Component {
    public title: eui.Label;
    private icon: eui.Image;
    private info;
    private desc: eui.Label;
    private weijiesuo: eui.Group;
    private barPro: eui.ProgressBar;

    public constructor() {
        super();
        this.skinName = skins.ChengJiuRoleItemSkin;
        this.touchEnabled = false;
    }

    public set data(info) {
        this.info = info;
        this.icon.source = 'cj_roledi' + info + '_png';
        this.title.text = GameDefine.ROLE_NAME[info - 1];
        this.desc.text = GameDefine.ROLE_OCCUPATION[info - 1];
        var num: number = 0;
        var maxNum: number = 0;
        this.barPro.maximum = 100;
        var cfgs = ChengJiuManager.getInstance().cjAllCfgs;
        var item: ChengJiuItem;
        for (var k in cfgs) {
            if (cfgs[k].tp2 == info) {
                if (UserInfo.achievementDics[k] && UserInfo.achievementDics[k].iscomplete > 0) {
                    num = num + 1;
                }
                maxNum = maxNum + 1;
            }
        }
        if (maxNum == 0) {
            this.barPro['desc'].text = '0%';
            // this.barPro.maximum = maxNum;// Math.floor(num / ChengJiuManager.getInstance().getMaxChengJiuMax() * 100) + '%';
            this.barPro.value = 0;
        } else {
            this.barPro['desc'].text = Math.floor(num / maxNum * 100) + '%';
            // this.barPro.maximum = maxNum;// Math.floor(num / ChengJiuManager.getInstance().getMaxChengJiuMax() * 100) + '%';
            this.barPro.value = Math.floor(num / maxNum * 100);
        }

    }
}

