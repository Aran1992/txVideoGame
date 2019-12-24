const REWARD_ICON = [
    {type: ["luxury"], icon: "pass_icon_task_0_png"},
    {type: ["suipian"], icon: "pass_icon_task_1_png"},
    {type: ["erfan"], icon: "pass_icon_task_2_png"},
    {type: ["yuepu"], icon: "pass_icon_task_4_png"},
    {type: ["quantao"], icon: "pass_icon_task_7_png"},
    {type: ["yuepu", "erfan"], icon: "pass_icon_task_11_png"},
    {type: ["CD", "yuepu"], icon: "pass_icon_task_12_png"},
    {type: [101003], icon: "pass_icon_task_101003_png"},
    {type: [101004], icon: "pass_icon_task_101004_png"},
    {type: [102001], icon: "pass_icon_task_102001_png"},
    {type: [102017], icon: "pass_icon_task_102017_png"},
    {type: [103001], icon: "pass_icon_task_103001_png"},
    {type: [103007], icon: "pass_icon_task_103007_png"},
    {type: [103008], icon: "pass_icon_task_103008_png"},
    {type: [103009], icon: "pass_icon_task_103009_png"},
];

const REWARD_DSC = {
    luxury: {
        name: "提前看剧特权",
        dsc: "可立即观看所有剧集。",
    },
    suipian: {
        name: "碎片",
        dsc: "一种珍贵的材料，可以在《拳拳四重奏》“商城”内兑换美图、音乐等奖励。",
    },
    quantao: {
        name: "拳套",
        dsc: "特别订制的轻便拳套，在【一零零一】中《拳拳四重奏》专区内使用，可以为心仪的TA增加少量的花语值。",
    },
    erfan: {
        name: "耳机",
        dsc: "集降噪和悦耳于一体的专用耳机，在【一零零一】中《拳拳四重奏》专区内使用，可以为心仪的TA增加花语值。",
    },
    yuepu: {
        name: "乐谱",
        dsc: "写满某个乐队灵感的原创乐谱，在【一零零一】中《拳拳四重奏》专区内使用，可以为心仪的TA增加花语值。",
    },
    CD: {
        name: "原版CD",
        dsc: "乐手们最珍爱的原版CD，在【一零零一】中《拳拳四重奏》专区内使用，可以为心仪的TA增加大量的花语值。",
    },
    101004: {
        name: "少女情怀*林薄荷",
        dsc: "心动PASS限定藏品，永久收藏林薄荷精品剧照卡5张。",
    },
    102001: {
        name: "梦想的模样·林薄荷&夏子豪 SR",
        dsc: "心动PASS限定藏品，永久收藏林薄荷&夏子豪高清精品剧照卡5张。",
    },
    101003: {
        name: "愿星伴你·江雪 ",
        dsc: "心动PASS限定藏品，永久收藏江雪精品剧照卡5张。",
    },
    102017: {
        name: "美梦酩酊·夏子豪",
        dsc: "心动PASS限定藏品，永久收藏夏子豪高清精品剧照卡5张。",
    },
    103008: {
        name: "B面人生·肖千也",
        dsc: "心动PASS限定的心动藏品，《拳拳四重奏》制作组倾情奉上，肖千也的专属纪念照。",
    },
    103009: {
        name: "B面人生·肖万寻",
        dsc: "心动PASS限定的心动藏品，《拳拳四重奏》制作组倾情奉上，肖万寻的专属纪念照。",
    },
    103007: {
        name: "B面人生·韩小白",
        dsc: "心动PASS限定的心动藏品，《拳拳四重奏》制作组倾情奉上，韩小白的专属纪念照。",
    },
    103001: {
        name: "兄弟？兄弟！·肖千也&肖万寻",
        dsc: "心动PASS限定的心动藏品，《拳拳四重奏》制作组倾情奉上，肖千也&肖万寻的专属纪念照。",
    },
};

function getRewardIcon(rewards): string {
    for (let i = 0; i < REWARD_ICON.length; i++) {
        const {type, icon} = REWARD_ICON[i];
        if (rewards[0].type === "goods") {
            if (rewards[0].id == type[0]) {
                return icon;
            }
        } else {
            if (!rewards.some((reward, i) => reward.type !== type[i])) {
                return icon;
            }
        }
    }
    return "pass_icon_task_3_png";
}

let taskItemList = [];
let shareImageInfo = undefined;

class TicketPanel extends eui.Component {
    private idClose: eui.Button;
    private idBuyTicketClose: eui.Button;
    private idShareTicketClose: eui.Button;
    private idGroupBuyTicket: eui.Group;
    private idGroupShareTicket: eui.Group;
    private idBtnUseCode: eui.Button;
    private idBtnCopyCode: eui.Button;
    private idBtnShareCode: eui.Button;
    private idBtnBuyNow: eui.Button;

    private idEditText: eui.EditableText;

    private idGroupDescCommon: eui.Group;//日常观礼描述
    private idGroupDescSpecial: eui.Group;//活动观礼描述
    private idGroupDescSpecialTxsp: eui.Group;//活动观礼描述
    private idGroupDiscount: eui.Group;
    private idGroupDiscountTxsp: eui.Group;

    private idBtnBuyTicketOriPrize: eui.Button;
    private idBtnBuyTicketSpecailPrize: eui.Button;
    private idBtnBuyTicketSpecailPrize_txsp: eui.Button;

    private idCode: eui.Label;
    private idNoCode: eui.Label;
    private idShareCode: eui.Label;
    private idShareText: eui.Label;
    private idHasCodeText: eui.Label;
    private idExpireText: eui.Label;
    private idTicketNum: eui.Label;
    private suipNum: eui.Label;

    private idRectBuy: eui.Rect;

    private taskGroupContainer: eui.Group;
    private bg: eui.Image;

    private _selectIndex: number = 2;
    private readonly _openParam: string;

    private bSpecail: boolean = false;

    constructor(openParam) {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        this._openParam = openParam
    }

    private static getPingzhengPrize() {
        let price = 120;
        if (platform.getPlatform() == "plat_txsp") {
            if (platform.isPlatformVip())//是否腾讯视频vip用户， 1: 是， 0: 否
                price = 120;
            else
                price = 180;
        }
        return price * platform.getPriceRate()
    }

    protected onSkinName(): void {
        this.skinName = skins.TicketSkin;
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
        const rate1 = GameDefine.GAME_VIEW_WIDTH / GameDefine.GAME_VIEW_HEIGHT;
        const rate2 = size.width / size.height;
        let scale;
        if (rate1 < rate2) {
            scale = size.width / GameDefine.GAME_VIEW_WIDTH;
        } else {
            scale = size.height / GameDefine.GAME_VIEW_HEIGHT;
        }
        this.bg.scaleX = scale;
        this.bg.scaleY = scale;
    }

    private onLoadComplete() {
        for (let i = 1; i <= 2; i++) {
            this["idTab" + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabClick, this);
        }

        this.idClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseClick, this);
        this.idBuyTicketClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseBuyTicketClick, this);
        this.idBtnBuyTicketSpecailPrize.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyTicketSpecailPrizeClick, this);
        this.idBtnBuyTicketSpecailPrize_txsp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyTicketSpecailPrizeClick, this);
        this.idBtnBuyTicketOriPrize.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyTicketOriPrizeClick, this);
        this.idBtnBuyNow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyNowClick, this);

        this.idShareTicketClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idShareTicketCloseClick, this);

        this.idBtnUseCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnUseCodeClick, this);
        this.idBtnCopyCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnCopyCodeClick, this);
        this.idBtnShareCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnShareCodeClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onBuy600001Complte, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SUIPIAN_CHANGE, this.onSuipianChange, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATA_VIP, this.onUpdateVip, this);
        this.updateTab();
        this.updateResize();

        this.idCode.text = "123456789";
        this.idShareCode.text = "456789";
        //从购物车按纽进来
        this.idGroupShareTicket.visible = false;

        this.idGroupBuyTicket.visible = this._openParam == "tipsbtnshopcar" || this._openParam == "confirm";

        let today = Tool.formatTimeDay2Num();
        let cfg = JsonModelManager.instance.getModelshop()[GameDefine.GUANGLIPINGZHENG];
        let discountDay = Tool.formatAddDay(Number(cfg.params), platform.getSaleBeginTime());
        this.bSpecail = today <= discountDay;//是否在优惠期间
        this.idGroupDescCommon.visible = !this.bSpecail;
        this.idGroupDescSpecial.visible = this.bSpecail && platform.getPlatform() != "plat_txsp";
        this.idGroupDescSpecialTxsp.visible = this.bSpecail && platform.getPlatform() == "plat_txsp";

        this.idCode.visible = false;
        this.idNoCode.visible = true;
        this.idBtnCopyCode.visible = false;
        this.idBtnShareCode.visible = false;
        let itemNum = ShopManager.getInstance().getItemNum(GameDefine.GUANGLIPINGZHENG);
        this.idTicketNum.text = "";//itemNum;
        this.refreshActiveCode();
        if (itemNum <= 0) {
            this.idGroupBuyTicket.visible = true;
        }
        //如果还没有买过凭据，直接拍脸

        //this.idBtnBuyTicketSpecailPrize.label = String(TicketPanel.getPingzhengPrize());
        this.idBtnBuyTicketSpecailPrize_txsp.label = String(TicketPanel.getPingzhengPrize());
        this.updateBuyBtnState();

        this.idGroupDiscount.visible = !(platform.getPlatform() == "plat_txsp" && platform.isPlatformVip() == false);
        this.idGroupDiscountTxsp.visible = !(platform.getPlatform() == "plat_txsp" && platform.isPlatformVip() == false);
        this.createTasks();
        this.suipNum.text = UserInfo.suipianMoney + "";

        if (platform.getPlatform() != "plat_txsp")
            this.idRectBuy.alpha = 0.9;
    }
    private onUpdateVip(){
        this.idBtnBuyTicketSpecailPrize_txsp.label = String(TicketPanel.getPingzhengPrize());
        this.idGroupDiscount.visible = !(platform.getPlatform() == "plat_txsp" && platform.isPlatformVip() == false);
        this.idGroupDiscountTxsp.visible = !(platform.getPlatform() == "plat_txsp" && platform.isPlatformVip() == false);
    }

    private updateBuyBtnState() {
        let itemNum = ShopManager.getInstance().getItemNum(GameDefine.GUANGLIPINGZHENG);
        this.idBtnBuyNow.label = itemNum > 0 ? "已拥有" : "立即购买";
        this.idBtnBuyNow.visible = itemNum <= 0;
        for (let i = 0; i < 4; i++) {
            this[`x${i}`].visible = itemNum <= 0;
        }
    }

    private refreshActiveCode() {
        const params = {"bookId": GameDefine.BOOKID, "cmd": "getMyCDKey", "saleId": GameDefine.GUANGLIPINGZHENG};
        platform.sendRequest(params, (data) => {
            //有而且第一个可用。isExpire 1过期0未过期;expireTime "过期时间字符串",status:1还没使用，2已使用
            if (data.code == 0 && data.data.list.length > 0) {//&& data.data.list[0].status == 1
                let item = data.data.list[0];
                let cdk = item.CDKey;
                this.idCode.text = cdk;
                this.idCode.visible = true;
                this.idNoCode.visible = false;
                this.idShareCode.text = cdk;
                this.idShareText.text = `1. 该激活码可用于在一零零一激活《拳拳四重奏》心动PASS；
2. 在《拳拳四重奏》剧集内部心动PASS-买一赠一可以激活资格；
3. 在一零零一重激活心动PASS，可享受提前看剧以及心动PASS福利内容;
4. 激活码有效期至${data.data.list[0].expireTime}`;
                this.idBtnCopyCode.visible = true;
                this.idBtnShareCode.visible = true;
                this.idHasCodeText.visible = true;
                if (data.data.list[0].status == 2) {
                    this.idExpireText.text = "已被使用"
                } else if (data.data.list[0].isExpire == 0)
                    this.idExpireText.text = data.data.list[0].expireTime + " 前有效";
                else {
                    this.idExpireText.text = "已过期"
                }
            } else {
                this.idCode.visible = false;
                this.idNoCode.visible = true;
                this.idBtnCopyCode.visible = false;
                this.idBtnShareCode.visible = false;
                this.idHasCodeText.visible = false;
                this.idExpireText.text = ""
            }
            //console.log(data)
        });
    }

    private idBtnBuyNowClick() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.idGroupBuyTicket.visible = true;
    }

    private onBuy600001Complte(shopdata: ShopInfoData) {
        if (shopdata.id == GameDefine.GUANGLIPINGZHENG || shopdata.id == GameDefine.GUANGLIPINGZHENGEX) {
            if (this._openParam == "confirm")//从弹窗进来的。购买成功后需要继续播放视频
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CONTINUE));
            this.onCloseClick();
        }
    }

    private idBtnUseCodeClick() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let vipNum = ShopManager.getInstance().getItemNum(GameDefine.GUANGLIPINGZHENG);
        let isVip = vipNum > 0;
        if (isVip) {
            GameCommon.getInstance().showCommomTips("你已拥有心动PASS，不可以激活。");
            return;
        }
        let code = this.idEditText.text;
        const params = {
            "bookId": GameDefine.BOOKID,
            "cmd": "exchangeCDKey",
            "CDKey": code,
            saleId: GameDefine.GUANGLIPINGZHENG
        };
        platform.sendRequest(params, (data) => {
            if (data.code == 0) {
                ShopManager.getInstance().addGoods(GameDefine.GUANGLIPINGZHENG, 1, () => {
                    GameCommon.getInstance().onShowResultTips("激活心动PASS成功,恭喜您开启所有章节！");
                    this.updateBuyBtnState();
                })
            } else {
                GameCommon.getInstance().showCommomTips(data.data.msg);
            }
        })
    }

    private idBtnCopyCodeClick() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        const input = document.createElement("input");
        input.value = this.idCode.text;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);
        GameCommon.getInstance().showCommomTips("已复制到剪贴板");
    }

    private idBtnShareCodeClick() {
        this.idGroupShareTicket.visible = true;

        let render = new egret.RenderTexture();
        render.drawToTexture(this.idGroupShareTicket);//rootLayer是当前显示层的总容器，或者用this.stage
        this.idGroupShareTicket.visible = false;
        let base64Str = render.toDataURL("image/png");

        shareImageInfo = undefined;
        platform.shareImage(GameDefine.BOOKID, base64Str);
        //render.saveToFile("image/png", "aa.png");//也可以保存下来
    }

    private onAddToStage() {
        this.onSkinName();
    }

    private updateTab() {
        for (let i = 1; i <= 2; i++) {
            (this["idTab" + i] as eui.RadioButton).selected = this._selectIndex == i;
        }
        for (let i = 1; i <= 2; i++) {
            this["idPage" + i].visible = this._selectIndex == i;
        }
    }

    private onCloseBuyTicketClick(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        if (this._openParam == "tipsbtnshopcar" || this._openParam == "confirm" || this._openParam == "tipsbtnticket") {
            this.onCloseClick();
            return;
        }
        this.idGroupBuyTicket.visible = false;
    }

    private idShareTicketCloseClick() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.idGroupShareTicket.visible = false;
    }

    private idBtnBuyTicketOriPrizeClick(): void {
        this.idBtnBuyTicketSpecailPrizeClick();
    }

    private idBtnBuyTicketSpecailPrizeClick(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");

        let item: ShopInfoData = ShopManager.getInstance().getShopInfoData(GameDefine.GUANGLIPINGZHENG);
        if (item.num > 0) {
            GameCommon.getInstance().showCommomTips("你已经拥有心动PASS了");
            return;
        }
        let callback = () => {
            this.onCloseBuyTicketClick();
            this.refreshActiveCode();
            this.updateBuyBtnState();
            if (platform.getPlatform() == "plat_txsp") {
                GameCommon.getInstance().onShowResultTips('购买成功\n您可以观看所有最新章节');
            } else
                if(platform.isCelebrateTime())
                    GameCommon.getInstance().onShowResultTips('购买成功\n激活码可在“心动PASS”-“买一赠一”处查看');
                else
                    GameCommon.getInstance().onShowResultTips('购买成功');
        };
        //引导购买腾讯会员弹窗
        if(platform.getPlatform() == "plat_txsp" && !platform.isPlatformVip()){
            //GameCommon.getInstance().onOpen
            let buyfunc=()=>{
                GameCommon.getInstance().onShowBuyTips(GameDefine.GUANGLIPINGZHENGEX, TicketPanel.getPingzhengPrize(), GOODS_TYPE.DIAMOND, callback);
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SHOW_VIEW_WITH_PARAM), new WindowParam("TxspBuyTipsPanel", buyfunc));
            return
        }

        if (platform.getPlatform() == "plat_txsp" || platform.getPlatform() == "plat_pc") {
            let itemID = GameDefine.GUANGLIPINGZHENG;
            if (platform.getPlatform() == "plat_txsp" && !platform.isPlatformVip()) {//在腾讯视频中。不是会员才买另一个原价物品
                itemID = GameDefine.GUANGLIPINGZHENGEX;
            }
            GameCommon.getInstance().onShowBuyTips(itemID, TicketPanel.getPingzhengPrize(), GOODS_TYPE.DIAMOND, callback);
        } else {
            ShopManager.getInstance().buyGoods(GameDefine.GUANGLIPINGZHENG, 1, callback);
        }
    }

    private onCloseClick(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onBuy600001Complte, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'TicketPanel');
        taskItemList.forEach(item => item.onDestroyed());
        taskItemList = [];

        if (this._openParam == "tipsbtnshopcar" || this._openParam == "tipsbtnticket") {
            VideoManager.getInstance().videoResume();
        }
    }

    private onTabClick(event: egret.TouchEvent): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this._selectIndex = Number(event.currentTarget.name);
        this.updateTab()
    }

    private createTasks() {
        TASK.forEach(chapter => {
            const taskGroup = new TaskGroup(chapter, this);
            taskGroup.width = chapter.common.length * 200 + 6 * (chapter.common.length - 1);
            this.taskGroupContainer.addChild(taskGroup);
        });
    }

    private onSuipianChange() {
        this.suipNum.text = UserInfo.suipianMoney + "";
    }
}

class TaskItem extends eui.Component {
    private allChildren: eui.Group;
    private icon: eui.Image;
    private taskName: eui.Label;
    private receivable: eui.Image;
    private received: eui.Image;
    private uncompleted: eui.Image;
    private locked: eui.Image;
    private readonly task;
    private detailContainer;

    constructor(task, detailContainer) {
        super();
        this.skinName = skins.TaskItemSkin;
        this.detailContainer = detailContainer;
        if (task) {
            this.task = task;
            this.allChildren.visible = true;
            this.taskName.text = task.name;
            this.icon.source = getRewardIcon(task.reward);
            this.icon.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.refreshState();
        } else {
            this.allChildren.visible = false;
        }
        GameDispatcher.getInstance().addEventListener(GameEvent.TASK_STATE_CHANGED, this.onTaskStateChanged, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onBuyRefresh, this);
        taskItemList.push(this);
    }

    public onDestroyed() {
        GameDispatcher.getInstance().removeEventListener(GameEvent.TASK_STATE_CHANGED, this.onTaskStateChanged, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onBuyRefresh, this);
    }

    private onTouchEnd() {
        this.detailContainer.addChild(new TaskDetail(this.task));
    }

    private refreshState() {
        this.receivable.visible = false;
        this.received.visible = false;
        this.uncompleted.visible = false;
        this.locked.visible = false;
        const state = TaskManager.instance.getTaskState(this.task.id);
        switch (state) {
            case TASK_STATES.LOCKED: {
                this.locked.visible = true;
                this.uncompleted.visible = true;
                break;
            }
            case TASK_STATES.UNLOCKED: {
                break;
            }
            case TASK_STATES.UNCOMPLETED: {
                this.uncompleted.visible = true;
                break;
            }
            case TASK_STATES.RECEIVABLE: {
                this.receivable.visible = true;
                break;
            }
            case TASK_STATES.RECEIVED: {
                this.received.visible = true;
                break;
            }
        }
    }

    private onTaskStateChanged(data) {
        if (this.task && data.data === this.task.id) {
            this.refreshState();
        }
    }

    private onBuyRefresh() {
        if (this.task) {
            this.refreshState();
        }
    }
}

class TaskGroup extends eui.Component {
    private common: eui.Group;
    private luxury: eui.Group;
    private chapterName: eui.Label;

    constructor(chapterTasks, detailContainer) {
        super();
        this.skinName = skins.TaskGroupSkin;
        this.chapterName.text = chapterTasks.chapter;
        chapterTasks.common.forEach(task => {
            this.common.addChild(new TaskItem(task, detailContainer));
        });
        chapterTasks.luxury.forEach(task => {
            this.luxury.addChild(new TaskItem(task, detailContainer));
        });
    }
}

class TaskDetail extends eui.Component {
    private icon: eui.Image;
    private taskName: eui.Label;
    private getDsc: eui.Label;
    private rewardCount: eui.Label;
    private rewardDsc: eui.Label;
    private closeBtn: eui.Button;
    private receiveBtn: eui.Button;
    private receivedBtn: eui.Button;
    private readonly task;

    constructor(task) {
        super();
        this.task = task;
        this.skinName = skins.TaskDetailSkin;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCloseBtn, this);
        this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickReceiveBtn, this);
        this.receiveBtn.visible = TaskManager.instance.getTaskState(task.id) === TASK_STATES.RECEIVABLE;
        this.receivedBtn.visible = TaskManager.instance.getTaskState(task.id) === TASK_STATES.RECEIVED;
        this.icon.source = getRewardIcon(task.reward);
        this.taskName.text = `${TaskManager.instance.isLuxuryTask(task.id) ? "豪华任务" : "普通任务"}：${task.name}`;
        this.getDsc.text = `获得条件：${task.dsc}`;
        const rewardNameStr = task.reward.map(reward => {
            if (reward.type === "goods") {
                return `${REWARD_DSC[reward.id].name}`;
            } else {
                return `${REWARD_DSC[reward.type].name}*${reward.num || 1}`;
            }
        }).join(";");
        this.rewardCount.text = `奖励：${rewardNameStr}`;
        const rewardDscStr = task.reward.map(reward => {
            if (reward.type === "goods") {
                return `${REWARD_DSC[reward.id].dsc}`;
            } else {
                return `${REWARD_DSC[reward.type].name}：${REWARD_DSC[reward.type].dsc}`;
            }
        }).join("\n");
        this.rewardDsc.text = `${rewardDscStr}`;
        this.width = size.width;
        this.height = size.height;
    }

    private onClickCloseBtn() {
        this.parent.removeChild(this);
    }

    private onClickReceiveBtn() {
        TaskManager.instance.receiveTaskReward(this.task);
        this.receiveBtn.visible = false;
        this.receivedBtn.visible = true;
    }
}
