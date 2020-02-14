class BuyVIPPanel extends eui.Component {
    private readonly from: string;
    private groupTable = {
        Group1001: () => {
            return !isTXSP
                && platform.isCelebrateTime()
                && this.from === undefined;
        },
        Group10010: () => {
            return !isTXSP
                && platform.isCelebrateTime()
                && this.from === "task";
        },
        Group10011: () => {
            return !isTXSP
                && !platform.isCelebrateTime();
        },
        GroupTXSP0: () => {
            return isTXSP
                && platform.isCelebrateTime()
                && !platform.isPlatformVip();
        },
        GroupTXSP1: () => {
            return isTXSP
                && platform.isCelebrateTime()
                && platform.isPlatformVip();
        },
        GroupTXSP2: () => {
            return isTXSP
                && !platform.isCelebrateTime()
                && platform.isPlatformVip();
        },
        GroupTXSP3: () => {
            return isTXSP
                && !platform.isCelebrateTime()
                && !platform.isPlatformVip();
        },
    };
    private GroupDetail: eui.Group;
    private curBuyGroup: eui.Group;
    private CloseGroupDetail: eui.Button;

    constructor(from: any) {
        super();
        if (from != 1) {
            this.from = from;
        }
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete() {
        this.registerEvent();
        this.update();
    }

    private onAddToStage() {
        this.skinName = skins.BuyVIPSkin;
    }

    private registerEvent() {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATA_VIP, this.update, this);
        this.bindMultiple("CloseGroup1001", this.onClickCloseBuyGroup);
        this.bindMultiple("CloseGroupTXSP", this.onClickCloseBuyGroup);
        this.CloseGroupDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickCloseGroupDetail, this);
        this.bindMultiple("ButtonDetail", this.onClickButtonDetail);
        this.bindMultiple("Button1001Buy", this.onClickButton1001Buy);
        this.bindMultiple("ButtonTXSPBuyVIP", this.onClickButtonTXSPBuyVIP);
        this.bindMultiple("ButtonTXSPBuyDirect", this.onClickButtonTXSPBuyDirect);
    }

    private onClickCloseBuyGroup() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'BuyVIPPanel');
        if (this.from === "tips") {
            VideoManager.getInstance().videoResume();
        }
    }

    private onClickButtonDetail() {
        this.GroupDetail.visible = true;
        this.curBuyGroup.visible = false;
    }

    private onClickCloseGroupDetail() {
        this.GroupDetail.visible = false;
        this.curBuyGroup.visible = true;
    }

    private onClickButton1001Buy() {
        this.onClickButtonTXSPBuyDirect();
    }

    private onClickButtonTXSPBuyVIP() {
        platform.openWebview({
            url: "https://film.qq.com/h5/upay/?cid=mzc002003phdd29&tab=vip&ht=1&ptag=interaction&back=1&actid=HLW_7094ZHENGJIA",
            landscape: 0, // 是否进入横屏webview，1: 是， 0: 不是。默认: 0
            hidetitlebar: 0, // 是否隐藏webview自带状态栏。1: 是， 0: 不是。 默认: 0
            hidestatusbar: 0, // 是否隐藏操作系统的状态栏（网络/运营商/时间等）1: 是，0: 不是。默认: 0
            needBridgeHelper: 0, // 新开的webview是否需要bridgeHelper(支付页不要用这个参数），默认: 0
            useProxyReport: 1, // 新开的webview是否使用播放器的代理上报，1: 是，0: 不是。默认: 1
            close: 0, // 是否关闭当前webview。1: 关闭, 0: 不关闭。默认：0
            style: 1, // 新开webview的样式: 0: 导航显示更多按钮, 1: 导航不显示更多按钮, 2: 关闭loading（仅android支持）。默认：0
        });
    }

    private onClickButtonTXSPBuyDirect() {
        let callback = () => {
            this.onClickCloseBuyGroup();
            if (platform.getPlatform() == "plat_txsp") {
                GameCommon.getInstance().onShowResultTips('购买成功\n您可以观看所有最新章节');
            } else if (platform.isCelebrateTime())
                GameCommon.getInstance().onShowResultTips('购买成功\n激活码可在“心动PASS”-“限时活动”处查看');
            else
                GameCommon.getInstance().onShowResultTips('购买成功');
        };
        if (platform.getPlatform() == "plat_txsp" || platform.getPlatform() == "plat_pc") {
            let itemID = GameDefine.GUANGLIPINGZHENG;
            if (platform.getPlatform() == "plat_txsp" && !platform.isPlatformVip()) {//在腾讯视频中。不是会员才买另一个原价物品
                itemID = GameDefine.GUANGLIPINGZHENGEX;
            }
            GameCommon.getInstance().onShowBuyTips(itemID, GameCommon.getInstance().getPingzhengPrize(), GOODS_TYPE.DIAMOND, callback);
        } else {
            let itemID = GameDefine.GUANGLIPINGZHENG;
            if (!platform.isCelebrateTime())
                itemID = GameDefine.GUANGLIPINGZHENGEX;
            ShopManager.getInstance().buyGoods(itemID, 1, callback);
        }
    }

    private bindMultiple(name, handler) {
        for (let i = 0; i < 5; i++) {
            const suffix = i === 0 ? "" : i - 1;
            const button = this[name + suffix];
            if (button) {
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, handler, this);
            }
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private update() {
        this.GroupDetail.visible = false;
        for (let key in this.groupTable) {
            if (this.groupTable.hasOwnProperty(key)) {
                if (this.groupTable[key]()) {
                    this[key].visible = true;
                    this.curBuyGroup = this[key];
                } else {
                    this[key].visible = false;
                }
            }
        }
        this.updateResize();
    }
}

