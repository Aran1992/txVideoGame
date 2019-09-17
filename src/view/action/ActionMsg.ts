function setLabelTextWithBgAdapt(label: eui.Label, bg: eui.Image, text: string) {
    const originHeight = label.height;
    label.text = text;
    const changeHeight = label.height - originHeight;
    bg.height += changeHeight;
}

class ActionMsg extends ActionSceneBase {
    private static readonly MOVE_DURATION: number = 500;
    private static readonly MSG_INTERVAL: number = 500;
    private static readonly ITEM_INTERVAL: number = 20;
    private static readonly TYPE_INTERVAL: number = 50;
    private static readonly BREATH_DURATION: number = 1500;
    private static readonly BREATH_MIN_ALPHA: number = 0.5;
    private static readonly msgList: string[] = [
        "江雪!ㄒoㄒ",
        "怎么了，薄荷？",
        "你在哪啊？出事了！",
        "我在社联这呢，你快说，怎么了啊？",
        "我们的排练厅被Mad-max的人给占了,没有排练厅用了怎么办啊？",
    ];

    private readonly msgItemGroup: eui.Group;
    private readonly msgItemContainer: eui.Group;
    private readonly inputBg: eui.Image;
    private readonly input: eui.Label;
    private readonly sendButton: eui.Button;
    private sendButtonClickCallback: Function;

    private timeBar1: eui.ProgressBar;
    private timeBar2: eui.ProgressBar;
    private desc1: eui.Label;

    protected onSkinName(): void {
        this.skinName = skins.ActionMsgSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.updateResize();

        this.desc1.text = JsonModelManager.instance.getModelhudong()[this.model.type].des;

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

    private async play() {
        this.sendButton.visible = false;
        this.input.visible = false;
        this.inputBg.visible = false;
        const itemList: ActionMsgItem[] = [];
        for (let i = 0; i < ActionMsg.msgList.length; i++) {
            const msg = ActionMsg.msgList[i];
            if (i === ActionMsg.msgList.length - 1) {
                await this.playInput(msg);
            }
            const isSelf = i % 2 === 0;
            const item = new ActionMsgItem(msg, isSelf);
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
            egret.Tween.get(newItem).to({alpha: 1}, ActionMsg.MOVE_DURATION).wait(ActionMsg.MSG_INTERVAL).call(resolve);
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

    constructor(msg: string, isSelf: boolean) {
        super();
        this.skinName = isSelf ? skins.ActionMsgItemSelfSkin : skins.ActionMsgItemYourSkin;
        setLabelTextWithBgAdapt(this.label, this.bg, msg,);
    }

    public getHeight(): number {
        return this.bg.height;
    }
}
