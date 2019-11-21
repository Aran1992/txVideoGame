function setLabelTextWithBgAdapt(label: eui.Label, bg: eui.Image, text: string) {
    const originHeight = label.height;
    label.text = text;
    const changeHeight = label.height - originHeight;
    bg.height += changeHeight;
}

class ActionMsg extends ActionSceneBase {
    private static readonly MOVE_DURATION: number = 500;
    private static readonly ITEM_INTERVAL: number = 30;
    private static readonly TYPE_INTERVAL: number = 50;
    private static readonly BREATH_DURATION: number = 1500;
    private static readonly BREATH_MIN_ALPHA: number = 0.5;
    private msgList: string[] = [];

    private readonly msgItemGroup: eui.Group;
    private readonly msgItemContainer: eui.Group;
    private readonly inputBg: eui.Image;
    private readonly input: eui.Label;
    private readonly sendButton: eui.Button;
    private sendButtonClickCallback: Function;
    private needClickSend: boolean;
    private msgInterval: number;

    private timeBar: eui.Group;
    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;

    protected onSkinName(): void {
        this.skinName = skins.ActionMsgSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();

        this.needClickSend = this.paramList[3] === "1";
        this.msgInterval = parseInt(this.paramList[4]);
        this.msgList = this.paramList[5].split("|");

        this.desc1.text = JsonModelManager.instance.getModelhudong()[this.model.type].des;

        this.timeBar.visible = this.needClickSend;

        this.timeBar1.slideDuration = 0;
        this.timeBar1.maximum = this.maxTime;
        this.timeBar1.value = this.maxTime;

        this.timeBar2.slideDuration = 0;
        this.timeBar2.maximum = this.maxTime;
        this.timeBar2.value = this.maxTime;

        this.msgItemContainer.mask = new eui.Rect(this.msgItemContainer.width, this.msgItemContainer.height);
        this.sendButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickSendButton, this);

        this.play().catch(e => console.log(e));
    }

    protected update(dt): void {
        super.update(dt);
        this.timeBar2.value = this.runTime;
        this.timeBar1.value = this.runTime;
    }

    protected onBackFail() {
        if (this.needClickSend) {
            super.onBackFail();
        } else {
            this.onBackSuccess();
        }
    }

    protected onBackSuccess() {
        ActionManager.getInstance().onActionSuccess(this.idx, this.delTime);
    }

    private async play() {
        this.sendButton.visible = false;
        this.input.visible = false;
        this.inputBg.visible = false;
        const itemList: ActionMsgItem[] = [];
        for (let i = 0; i < this.msgList.length; i++) {
            const [roleAndWaitTime, msg] = this.msgList[i].split(":");
            const [role, waitTime] = roleAndWaitTime.split("=").map(s => s && parseInt(s));
            const isSelf = role === GameDefine.SELF_ROLE_HEAD_INDEX;
            if (i === this.msgList.length - 1 && isSelf && this.needClickSend) {
                await this.playInput(msg);
            }
            if (waitTime) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            const item = new ActionMsgItem(msg, isSelf, role);
            itemList.push(item);
            this.msgItemGroup.addChild(item);
            await this.playShow(itemList);
        }
        this.onBackSuccess();
    }

    private async playShow(itemList: ActionMsgItem[]) {
        return new Promise(resolve => {
            const newItem = itemList[itemList.length - 1];
            const newItemHeight = newItem.getHeight();
            newItem.alpha = 0;
            egret.Tween.get(newItem).to({alpha: 1}, ActionMsg.MOVE_DURATION).wait(this.msgInterval).call(resolve);
            itemList.forEach(item => {
                egret.Tween.get(item).to({y: item.y - newItemHeight - ActionMsg.ITEM_INTERVAL}, ActionMsg.MOVE_DURATION);
            });
        });
    }

    private async playInput(msg) {
        return new Promise((resolve => {
            let length = 0;
            this.sendButton.visible = true;
            this.sendButton.enabled = false;
            this.input.visible = true;
            this.inputBg.visible = true;
            setLabelTextWithBgAdapt(this.input, this.inputBg, " ");
            const intervalTimer = setInterval(() => {
                length++;
                if (length > msg.length) {
                    this.sendButton.enabled = true;
                    const func = () => {
                        egret.Tween.get(this.sendButton)
                            .to({alpha: ActionMsg.BREATH_MIN_ALPHA}, ActionMsg.BREATH_DURATION, egret.Ease.sineInOut)
                            .to({alpha: 1}, ActionMsg.BREATH_DURATION, egret.Ease.sineInOut)
                            .call(func);
                    };
                    func();
                    clearInterval(intervalTimer);
                    const remainTime = parseInt(this.paramList[1]) * 1000 - (this.videoCurrTime - this.videoStartTime);
                    const timeoutTimer = setTimeout(() => this.sendButtonClickCallback(), remainTime);
                    this.sendButtonClickCallback = () => {
                        this.sendButton.visible = false;
                        this.input.visible = false;
                        this.inputBg.visible = false;
                        clearTimeout(timeoutTimer);
                        resolve();
                    };
                } else {
                    setLabelTextWithBgAdapt(this.input, this.inputBg, msg.substr(0, length));
                }
            }, ActionMsg.TYPE_INTERVAL);
        }));
    }

    private onClickSendButton() {
        this.sendButtonClickCallback();
    }
}

class ActionMsgItem extends eui.Component {
    private readonly label: eui.Label;
    private readonly bg: eui.Image;
    private readonly head: eui.Image;

    constructor(msg: string, isSelf: boolean, role: number) {
        super();
        this.skinName = isSelf ? skins.ActionMsgItemSelfSkin : skins.ActionMsgItemYourSkin;
        this.head.source = GameDefine.ROLE_HEAD[role];
        setLabelTextWithBgAdapt(this.label, this.bg, msg,);
    }

    public getHeight(): number {
        return this.bg.height;
    }
}
