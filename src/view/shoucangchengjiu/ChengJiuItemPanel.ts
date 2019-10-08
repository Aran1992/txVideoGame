// TypeScript file
class ChengJiuItemPanel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private dianjicundang: eui.Group;
    private fanhuiLab: eui.Group;
    private wanchengdu: eui.BitmapLabel;
    private suipNum: eui.BitmapLabel;
    private btnGet: eui.Button;
    private _info: Modelchengjiu;
    private cjName: eui.Label;
    private desc1: eui.Label;
    private desc2: eui.Label;
    private desc3: eui.Label;
    private icon: eui.Image;
    private difficulty: eui.Label;
    private yilingqu: eui.Label;

    constructor(data) {
        super();
        this._info = data;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.btnGet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }

    protected onRemove(): void {
        // this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onShowBottomBtn, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnGet.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGet, this);
    }

    //供子类覆盖
    protected onInit(): void {
        this.cjName.text = this._info.titleID;
        this.desc3.text = '成就奖励：      ' + 'X' + this._info.jianglisuipian;
        this.difficulty.text = '获得难度: ' + GameDefine.CJ_LEVEL_NAME[this._info.level];
        // this._info
        if (UserInfo.achievementDics[this._info.id] && UserInfo.achievementDics[this._info.id].iscomplete > 0) {
            if (UserInfo.achievementDics[this._info.id].iscomplete == 2) {
                this.yilingqu.text = '已获得碎片' + 'X' + this._info.jianglisuipian;
                this.btnGet.label = '已领取';
                this.btnGet.enabled = false;
                Tool.setDisplayGray(this.btnGet, true);
            } else {
                Tool.setDisplayGray(this.btnGet, false);
                this.yilingqu.text = '';
                this.btnGet.label = '领取碎片';
            }
        } else {
            Tool.setDisplayGray(this.btnGet, true);
            this.yilingqu.text = '';
            this.btnGet.label = '领取';
        }

    }

    protected onSkinName(): void {
        this.skinName = skins.ChengJiuItemInfoSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onClose() {        
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.onRemove();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ChengJiuItemPanel')
    }

    private onGet() {        
        if (UserInfo.achievementDics[this._info.id]) {
            if (UserInfo.achievementDics[this._info.id].iscomplete == 1) {
                UserInfo.achievementDics[this._info.id].iscomplete = 2;
                GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
                if (this._info.jianglisuipian > 0) {
                    UserInfo.suipianMoney += this._info.jianglisuipian;
                }
                GameCommon.getInstance().onShowResultTips('领取成功');                
                SoundManager.getInstance().playSound("ope_gain.mp3")
                if (UserInfo.achievementDics[this._info.id] && UserInfo.achievementDics[this._info.id].iscomplete == 2) {
                    this.yilingqu.text = '已获得碎片' + 'X' + this._info.jianglisuipian;
                    Tool.setDisplayGray(this.btnGet, true);
                    this.btnGet.label = '已领取';
                } else {
                    Tool.setDisplayGray(this.btnGet, false);
                    this.yilingqu.text = '';
                }
            }
        } else {
            GameCommon.getInstance().onShowResultTips('未达成条件', false);            
            SoundManager.getInstance().playSound("ope_fail.mp3")
            return;
        }
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CHENGJIU_REFRESH));
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private onLoadComplete(): void {
        this.touchEnabled = false;

        // this.icon.source = 'cj_head' + this._info.tp2 + '_png';
        // if (this._info.tp2 == '') {
        //     this.icon.source = 'cj_head1_png';
        // }
        this.desc1.text = '获得条件: ' + this._info.des;
        this.icon.source = 'cj_suoluetu_' + this._info.id + '_png';
        this.onInit();
        this.onRegist();
        this.updateResize();

    }
}
