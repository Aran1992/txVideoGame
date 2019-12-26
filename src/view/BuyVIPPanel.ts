class BuyVIPPanel extends eui.Component {
    private readonly from: string;
    private groupTable = {
        Group1001: () => {
            return platform.getPlatform() === "plat_1001"
                && platform.isCelebrateTime()
                && this.from === undefined;
        },
        Group10010: () => {
            return platform.getPlatform() === "plat_1001"
                && platform.isCelebrateTime()
                && this.from === "task";
        },
        Group10011: () => {
            return platform.getPlatform() === "plat_1001"
                && !platform.isCelebrateTime();
        },
        GroupTXSP0: () => {
            return platform.getPlatform() === "plat_txsp"
                && platform.isCelebrateTime()
                && !plattxsp.isPlatformVip();
        },
        GroupTXSP1: () => {
            return platform.getPlatform() === "plat_txsp"
                && platform.isCelebrateTime()
                && plattxsp.isPlatformVip();
        },
        GroupTXSP2: () => {
            return platform.getPlatform() === "plat_txsp"
                && !platform.isCelebrateTime()
                && plattxsp.isPlatformVip();
        },
        GroupTXSP3: () => {
            return platform.getPlatform() === "plat_txsp"
                && !platform.isCelebrateTime()
                && !plattxsp.isPlatformVip();
        },
    };
    private GroupDetail: eui.Group;
    private curGroup: eui.Group;
    private CloseGroupDetail: eui.Button;

    constructor(from: string) {
        super();
        this.from = from;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete() {
        this.registerEvent();
        for (let key in this.groupTable) {
            if (this.groupTable.hasOwnProperty(key)) {
                if (this.groupTable[key]()) {
                    this[key].visible = true;
                    this.curGroup = this[key];
                    console.log("xxxxxxxxxxxxxx", new Date());
                } else {
                    this[key].visible = false;
                }
            }
        }
        this.updateResize();
    }

    private onAddToStage() {
        this.skinName = skins.BuyVIPSkin;
    }

    private registerEvent() {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.bindMultiple("CloseGroup1001", this.onClickCloseBuyGroup);
        this.bindMultiple("GroupTXSP", this.onClickCloseBuyGroup);
        this.CloseGroupDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCloseGroupDetail, this);
        this.bindMultiple("ButtonDetail", this.onClickButtonDetail);
        this.bindMultiple("Button1001Buy", this.onClickButton1001Buy);
        this.bindMultiple("ButtonTXSPBuyVIP", this.onClickButtonTXSPBuyVIP);
        this.bindMultiple("ButtonTXSPBuyDirect", this.onClickButtonTXSPBuyDirect);
    }

    private onClickCloseBuyGroup() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'BuyVIPPanel');
    }

    private onClickButtonDetail() {
        this.GroupDetail.visible = true;
        this.curGroup.visible = false;
    }

    private onClickCloseGroupDetail() {
        this.GroupDetail.visible = false;
        this.curGroup.visible = true;
    }

    private onClickButton1001Buy() {
    }

    private onClickButtonTXSPBuyVIP() {
    }

    private onClickButtonTXSPBuyDirect() {
    }

    private bindMultiple(name, handler) {
        for (let i = 0; i < 5; i++) {
            const suffix = i === 0 ? "" : i - 1;
            const button = this[name + suffix];
            if (button) {
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, this);
                console.log("addEventListener", name + suffix);
            }
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
}

