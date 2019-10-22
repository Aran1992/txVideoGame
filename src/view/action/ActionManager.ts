class ActionManager {
    private static instance: ActionManager = null;
    private actionTypeClassMap: any = {
        [ActionType.CLICK_TIME]: ActionClick,
        [ActionType.CLICK]: ActionClickCount,
        [ActionType.SLIDE]: ActionSlide,
        [ActionType.SLIDE_RECT]: ActionSlideRect,
        [ActionType.SLIDE_TWO]: ActionSlideTwo,
        [ActionType.MUSIC]: ActionMusic,
        [ActionType.SEND_MSG]: ActionMsg,
        [ActionType.FULL_VIEW]: ActionFull,
        [ActionType.LISTEN]: ActionListen,
        [ActionType.HEAD_VIEW]: ActionHuiYi,
        [ActionType.SELECT]: ActionSelect,
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
    private _actionFinished:boolean;

    private constructor() {
    }

    public static getInstance(): ActionManager {
        if (this.instance == null) {
            this.instance = new ActionManager();
            GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_PLAY_END, ActionManager.instance.VIDEO_PLAY_END, ActionManager.instance);
        }        
        return this.instance;
    }
    public VIDEO_PLAY_END(){
        if (!this._actionFinished){
            console.error("action is not finished actionId = "+String(this.actionIdx));
            this.clearCurrScene();
            this.onActionFinish()
        }
    }

    public static getActionSceneClassByActionType(actionType: ActionType): any {
        return ActionManager.instance.actionTypeClassMap[actionType];
    }

    public init(videoData: VideoData) {
        this.videoData = videoData;
    }

    public setAction(model: Modelwenti, layer: egret.DisplayObjectContainer) {
        let modelHuDong: Modelhudong = JsonModelManager.instance.getModelhudong()[model.type];
        this.isAnswer = false;
        this.currModel = model;
        this.layer = layer;
        this.actionList = modelHuDong ? modelHuDong.pos.split("#") : [];
        this.actionIdx = 0;
        this.successType = 2;
        this._actionFinished = false;
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
        this._actionFinished = true
        if (this.successType) {
            this.actionFinish(this.currModel.moren);
        } else {
            this.actionFinish(parseInt(this.currModel.ans.split(",")[this.successType]));
        }
    }

    private createActionUI() {
        if (this._actionFinished)//互动已结束，就不再创建互动界面了
            return;
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
                Tool.callbackTime(() => this.clearCurrScene(), this, 3000);
            } else {
                this.clearCurrScene();
            }
            if (this.currModel.id == 19) {
                if (this.successType) {
                    let data = GameCommon.getInstance().getSortLike(0);
                    ansId = data.id + 1;
                    this.successType = 0;
                }
            }
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.ONSHOW_VIDEO),
                {answerId: ansId, wentiId: this.currModel.id, click: this.successType == 0});
        }else{
            console.log("this.isAnswer is true");
        }
    }

    private clearCurrScene() {
        if (this.currScene) {
            this.currScene.exit();
            this.currScene = null;
        }
    }
}
