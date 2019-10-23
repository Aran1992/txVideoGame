class GuideManager {
    private static instance: GuideManager = null;
    private videoData: VideoData;
    private currModel: Modelwenti;
    private layer: egret.DisplayObjectContainer;
    private isAnswer: boolean;
    private _musicGuide: boolean = false;
    private curSprite;
    private moveUp: boolean;
    private start_posY: number;

    private constructor() {
    }

    private _isGuide: boolean = true;

    public get isGuide() {
        return this._isGuide;
    }

    public set isGuide(boolean) {
        this._isGuide = boolean;
    }

    public get isCompleteMusic() {
        return this._musicGuide;
    }

    public set isCompleteMusic(bo) {
        this._musicGuide = bo;
    }

    private _curState: boolean = false;

    public get curState() {
        return this._curState;
    }

    public set curState(boolean) {
        this._curState = boolean;
    }

    public static getInstance(): GuideManager {
        if (this.instance == null) {
            this.instance = new GuideManager();
        }
        return this.instance;
    }

    public onShowImg(obj, obj1, from) {
        this.onCloseImg();
        var img: eui.Image = new eui.Image('action_weith_png');
        img.scaleX = 0.8;
        img.scaleY = 0.8;
        GuideManager.getInstance().isGuide = true;
        GuideManager.getInstance().curState = true;
        img.rotation = 90;
        obj.addChild(img);
        this.curSprite = img;
        switch (from) {
            case 'tip':
                var pot = obj1.localToGlobal(obj1.parent.x, obj1.y);
                img.x = size.width / 2 + 40;
                img.y = pot.y - obj1.y - 380;
                break;
            case 'querencundang':
                var pot = obj1.localToGlobal(obj1.x, obj1.y);//
                img.x = obj.width / 2 + 200;
                img.y = pot.y - obj1.y - 375;
                break;
            case 'cundang':
                img.x = 645;//
                img.y = -275;
                break;
            case 'chengjiuBtn':
                img.x = 100 + 65;//
                img.y = 275 - 295;
                break;
            case 'chengjiutab':
                img.x = 900 + 50;//
                img.y = -180 - 265;
                break;
            case 'chengjiu':
                img.x = 955 + 50;//
                img.y = -50 - 265;
                break;
            case 'zhangjieBtn':
                img.x = 100 + 65;
                img.y = 155 - 295;
                break;
            case 'shangchengBtn':
                img.x = 100 + 65;
                img.y = 355 - 275;
                break;
            case 'shop':
                img.x = 485 + 45;
                img.y = 150 - 275;
                break;
            case 'shoucangBtn':
                img.x = 100 + 65;
                img.y = 440 - 255;
                break;
            case 'shoucang':
                img.x = 825 + 45;
                img.y = 420 - 295;
                break;
            case 'shoucangshipin':
                img.x = 1190 + 45;
                img.y = -90 - 295;
                break;
            case 'tupianItem':
                img.x = 145 + 45;
                img.y = 30 - 295;
                break;
            case 'xindong':
                img.x = 1010;
                img.y = 605 - 295;
                break;

            case 'musicShow':
                img.x = 1195 + 40;
                img.y = 420 - 295;
                break;
            case 'chapter':
                img.x = 250 + 65;
                img.y = 150 - 295;
                break;
            case 'leftClose':
                img.x = 140;
                img.y = size.height - 470;
                break;
            case 'rightClose':
                img.x = size.width - 222 - 50 + 65; //obj1.preferredHeight;
                img.y = size.height - 63 - 150 - 295;
                break;
        }
        img.touchEnabled = false;
        this.start_posY = img.y;
        this.curSprite.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
    }

    public onCloseImg() {
        if (!this.curSprite)
            return;
        this.curSprite.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        this.curSprite.parent.removeChild(this.curSprite);
        this.curSprite = null;
    }

    private onFrame() {
        if (!this.curSprite) {
            return;
        }
        if (!this.moveUp) {
            this.curSprite.y -= 2;
            if (this.curSprite.y < this.start_posY) {
                this.moveUp = true;
            }
        } else {
            this.curSprite.y += 2;
            let s_ts: string[] = [];
            for (var ky in s_ts) {
                s_ts[ky] = '';
            }
            if (this.curSprite.y > this.start_posY + 20) {
                this.moveUp = false;
            }
        }
    }

}
