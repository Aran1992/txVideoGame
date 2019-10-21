class ActionSceneBase extends eui.Component {
    protected maxTime: number;
    protected runTime: number;
    protected delTime: number;
    protected isRunTime: boolean;
    protected videoStartTime: number;
    private videoRunTime: number;
    private test: boolean;
    private _result:boolean;

    public constructor(model: Modelwenti, list: string[], idx: number, test: boolean = false) {
        super();
        this._model = model;
        this._paramList = list;
        this._idx = idx;
        this.test = test;
        this._result = false;//是否已经出来结果
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onSkinName, this);
        
        GameDispatcher.getInstance().addEventListener(GameEvent.VIDEO_PLAY_END, this.VIDEO_PLAY_END, this);
    }

    protected _model: Modelwenti;

    public get model(): Modelwenti {
        return this._model;
    }

    protected _paramList: string[];

    public get paramList(): string[] {
        return this._paramList;
    }

    protected _idx: number;

    public get idx(): number {
        return this._idx;
    }

    public set idx(num) {
        this._idx = num;
    }

    public get videoCurrTime() {
        if (this.test) {
            return new Date().getTime();
        } else {
            return VideoManager.getInstance().videoCurrTime() * 1000;
        }
    }

    public get isVideoRun() {
        return this.videoRunTime < this.videoCurrTime - this.videoStartTime;
    }

    public updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    public exit() {
        this.stopRun();
        if (!this.parent) {
            return;
        }
        if (this.model.type == 3) {
            egret.Tween.get(this)
                .to({alpha: 0}, 1000)
                .call(() => this.parent.removeChild(this));
        } else {
            this.parent.removeChild(this);
        }
        
        GameDispatcher.getInstance().removeEventListener(GameEvent.VIDEO_PLAY_END, this.VIDEO_PLAY_END, this);
    }
    private VIDEO_PLAY_END(){
        if (!this._result){
            this.onBackFail();
        }
    }

    protected startRun() {
        egret.Ticker.getInstance().register(this.update, this);
    }

    protected stopRun() {
        egret.Ticker.getInstance().unregister(this.update, this);
    }

    protected onSkinName(): void {
    }

    protected onInit(): void {
    }

    protected update(dt): void {
        if (this.isVideoRun) {
            this.videoRunTime += dt;
            if (this.delTime > 0) {
                this.delTime -= dt;
                if (this.delTime < 0) {
                    this.delTime = 0;
                }
            }
            if (this.runTime > 0) {
                this.runTime -= dt;
                if (this.runTime <= 0) {
                    this.runTime = 0;
                    this.onBackFail();
                }
            }
        }
    }

    protected onBackFail() {
        this.stopRun();
        if (this.model.id == '75') {
            this.idx = 0;
        }
        ActionManager.getInstance().onActionSuccess(this.idx, this.delTime, false);
        SoundManager.getInstance().playSound("hudong_end_fail.mp3");
        this._result= true;
    }

    protected onBackSuccess() {
        ActionManager.getInstance().onActionSuccess(this.idx, this.delTime);
        SoundManager.getInstance().playSound("hudong_end_success.mp3");
        this._result= true;
    }

    private onLoadComplete() {
        this.videoStartTime = this.videoCurrTime;
        this.maxTime = this.runTime = parseFloat(this.paramList[1]) * 1000;
        this.delTime = parseFloat(this.paramList[2]) * 1000;
        this.isRunTime = this.runTime > 0;
        this.onInit();
        this.videoRunTime = 0;
        if (this.isRunTime) {
            this.startRun();
        }
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.updateResize();
    }
}
