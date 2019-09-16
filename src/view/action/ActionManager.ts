class ActionManager {
    private static instance: ActionManager = null;
    private static actionTypeClassMap: any = {
        [ActionType.CLICK_TIME]: ActionClick,
        [ActionType.CLICK]: ActionClickCount,
        [ActionType.SLIDE]: ActionSlide,
        [ActionType.SLIDE_RECT]: ActionSlideRect,
        [ActionType.SLIDE_TWO]: ActionSlideTwo,
        [ActionType.MUSIC]: ActionMusic,
        [ActionType.SEND_MSG]: ActionMsg,
        [ActionType.FULL_VIEW]: ActionFull,
        [ActionType.HEAD_VIEW]: ActionHuiYi,
        [ActionType.CHECK_DRINK]: ActionCheckDrink,
        [ActionType.SEARCH]: ActionSearch,
    };
    private videoData: VideoData;
    private currModel: Modelwenti;
    private currScene: ActionSceneBase;
    private layer: egret.DisplayObjectContainer;
    private actionList: string[];
    private actionIdx: number;
    private successType: number;// 0-成功，1-失败，2-未选择
    private isAnswer: boolean;

    private constructor() {
    }

    public static getInstance(): ActionManager {
        if (this.instance == null) {
            this.instance = new ActionManager();
        }
        return this.instance;
    }

    public static getActionSceneClassByActionType(actionType: ActionType): any {
        return ActionManager.actionTypeClassMap[actionType];
    }

    public init(videoData: VideoData) {
        this.videoData = videoData;
    }

    public setAction(model: Modelwenti, layer: egret.DisplayObjectContainer) {
        let modelHuDong: Modelhudong = JsonModelManager.instance.getModelhudong()[model.type];
        // if (!modelHuDong)
        // 	return;
        this.isAnswer = false;
        this.currModel = model;
        this.layer = layer;
        this.actionList = modelHuDong ? modelHuDong.pos.split("#") : [];
        // let test = "3,3,3,200_200,500_200";
        // let test = "5,3,3,200_200,300_200,600_200,500_200";
        // let test = "6,12,12,9,1_1,4_1,7_1,10_2,13_2,16_2,19_2,22_1,25_2,28_2";
        // this.actionList = test.split("#");
        this.actionIdx = 0;
        this.successType = 2;
        this.createActionUI();
    }

    public onActionSuccess(idx: number, delTime: number, isSuccess = true) {
        if (idx == this.actionIdx) {
            ++this.actionIdx;
            this.setResult(isSuccess);
            if (this.actionIdx < this.actionList.length) {
                this.clearCurrScene();
                if (delTime > 0) {
                    Tool.callbackTime(this.createActionUI, this, delTime);
                } else {
                    this.createActionUI();
                }
            } else {
                this.onActionFinish();
            }
        }
    }

    public onActionFinish() {

        if (this.successType) {
            this.actionFinish(this.currModel.moren);
        } else
            this.actionFinish(parseInt(this.currModel.ans.split(",")[this.successType]));
    }

    public addEffect(ani: my.Animation) {
        this.videoData.addChild(ani);
    }

    private createActionUI() {
        this.clearCurrScene();
        let str = this.actionList[this.actionIdx];
        if (str && str.concat(",")) {
            let scene: ActionSceneBase;
            let list = str.split(",");
            let type = parseInt(list[0]);
            const actionSceneClass = ActionManager.getActionSceneClassByActionType(type);
            if (actionSceneClass) {
                scene = new actionSceneClass(this.currModel, list, this.actionIdx);
            } else {
                Tool.error("createActionUI - type is error: " + type);
            }
            if (scene) {
                this.videoData.addActionScene(scene);
                this.currScene = scene;
                return;
            }
        }
        Tool.error("createActionUI - error: " + this.actionIdx);
        // this.onActionFail(this.actionIdx);
        this.setResult(false);
        this.onActionFinish();
    }

    private setResult(isSuccess) {
        if (this.successType != 1) {
            this.successType = isSuccess ? 0 : 1;
        }
    }

    private actionFinish(ansId: number) {
        if (!this.isAnswer) {
            this.isAnswer = true;
            if (this.currModel.id == '15') {
                var obj = this;
                Tool.callbackTime(function () {
                    obj.clearCurrScene();
                }, obj, 3000);
                // this.successType=0;
            } else {
                this.clearCurrScene();
            }
            if (this.currModel.id == 19) {
                if (this.successType) {
                    var data = GameCommon.getInstance().getSortLike(0);
                    ansId = data.id + 1;
                    this.successType = 0;
                }
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ONSHOW_VIDEO),
                {answerId: ansId, wentiId: this.currModel.id, click: this.successType == 0});
        }
    }

    private clearCurrScene() {
        if (this.currScene) {
            this.currScene.exit();
            this.currScene = null;
        }
    }
}
