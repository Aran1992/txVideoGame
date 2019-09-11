/**
 *动画对象类
 **/
namespace my {
    export class Animation extends egret.DisplayObjectContainer {
        protected _mcFactory: egret.MovieClipDataFactory;
        protected _movieClip: egret.MovieClip;
        protected _playNum: number = -1;
        protected _autoRemove: boolean;
        protected _actionName: string;
        protected _frame;
        //播放完回调
        protected callback;
        protected callObj;
        protected callparam;

        /**
         * resName 资源名称 （前缀）
         * playNum 播放次数
         * autoRemove 播放完成后是否自动移除
         * frame 帧标签
         ***/
        public constructor(resName: string, playNum: number = 1, autoRemove: boolean = true, frame = null, actionName: string = "action") {
            super();
            this._movieClip = new egret.MovieClip();
            this._mcFactory = new egret.MovieClipDataFactory();
            this._actionName = actionName;
            this._playNum = playNum;
            this._frame = frame == null ? 1 : frame;
            this._autoRemove = autoRemove;

            this.onLoadHandler(resName);
        }

        protected _resName: string;//当前的资源名

        //获取当前的资源名
        public get resName(): string {
            return this._resName;
        }

        public setFinishCallBack(callback, callobj, callparam = null): void {
            if (!callback || !callobj) return;
            this.callback = callback;
            this.callObj = callobj;
            this.callparam = callparam;
            this._movieClip.addEventListener(egret.Event.COMPLETE, this.onFinishCallBack, this);
        }

        public onRemoveCallBack(): void {
            this.callback = null;
            this.callObj = null;
            this.callparam = null;
            if (this._movieClip) {
                this._movieClip.removeEventListener(egret.Event.COMPLETE, this.onFinishCallBack, this);
            }
        }

        //播放动画
        public onPlay(num: number = 1): void {
            if (!this._movieClip || !this._movieClip.parent) {
                return;
            }
            try {
                this._movieClip.gotoAndPlay(num, this._playNum);
            } catch (e) {
                Tool.error("模型动画资源出错 onPlay：res：" + this._resName);
            }
        }

        //暂停
        public onStop(): void {
            if (!this._movieClip || !this._movieClip.parent) {
                return;
            }
            try {
                this._movieClip.gotoAndStop(1);
            } catch (e) {
                Tool.error("模型动画资源出错 onStop：res：" + this._resName);
            }
        }

        //销毁动画
        public onDestroy(): void {
            this._frame = null;
            if (this._mcFactory) {
                this._mcFactory.clearCache();
                this._mcFactory = null;
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
            try {
                if (this._movieClip) {
                    // this._movieClip.removeEventListener(egret.Event.LOOP_COMPLETE, this.onDestroy, this);
                    // this._movieClip.removeEventListener(egret.Event.COMPLETE, this.onDestroy, this);
                    if (this._movieClip.parent) {
                        this._movieClip.parent.removeChild(this._movieClip);
                    }
                    this._movieClip.stop();
                    this._movieClip = null;
                }
            } catch (e) {
                Tool.log("error - sprite movieFinish");
            }
            if (this._mcFactory) {
                this._mcFactory.clearCache();
                this._mcFactory = null;
            }
        }

        protected onLoadHandler(resName: string): void {
            if (!resName) return;
            if (this._resName != resName) {
                this._resName = resName;
                this.removeChildren();
            }
            this.onLoadComplete(resName);
        }

        //加载完成处理
        private onLoadComplete(resName): void {
            if (resName != this._resName || !this._movieClip)
                return;
            var resJson: string = resName + "_json";
            var resPng: string = resName + "_png";
            var _animJson = RES.getRes(resJson);
            var _animTexture: egret.Texture = RES.getRes(resPng);
            if (_animJson && _animTexture) {
                if (this._mcFactory) {
                    this._mcFactory.clearCache();
                }
                this._mcFactory.mcDataSet = _animJson;
                this._mcFactory.texture = _animTexture;
                this._movieClip.movieClipData = this._mcFactory.generateMovieClipData(this._actionName);
                if (!this._movieClip.parent) {
                    this.addChild(this._movieClip);
                }
                if (this._autoRemove) {
                    this._movieClip.addEventListener(egret.Event.COMPLETE, this.onFinishRemove, this);
                }
            } else {
                Tool.error("模型动画资源出错 complete：res：" + this._resName);
            }
        }

        private onFinishRemove() {
            if (--this._playNum <= 0) {
                this._movieClip.removeEventListener(egret.Event.COMPLETE, this.onFinishRemove, this);
                this.onDestroy();
            }
        }

        private onFinishCallBack(): void {
            if (this.callback) {
                Tool.callback(this.callback, this.callObj, this.callparam);
            }
            this.onRemoveCallBack();
        }
    }
}
