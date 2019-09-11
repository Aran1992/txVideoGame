class TweenContoler {
    private viewEnd: ViewEnd;
    private width: number;
    private height: number;
    // public tweens: TweenBody[];
    // public img: eui.Image;
    // public index: number;
    // private param: number;
    public constructor(viewEnd: ViewEnd, width: number, height: number) {
        this.viewEnd = viewEnd;
        this.width = width;
        this.height = height;
    }

    public setTweenInfo(img: eui.Image, tweens: TweenBody[], param: number) {
        let index = 0;
        this.onInit(img, tweens[0]);
        this.onTweenRun(img, tweens, param);

    }

    public onNextPro() {// 播放下一组动画
        this.viewEnd.onTweenNext();
    }

    public onProFinish(param) {// 这一组所有动画结束
        this.viewEnd.onTweenFinish(param);
    }

    private onInit(img: eui.Image, tween: TweenBody) {
        if (tween.pos) {
            img.x = tween.pos.x * this.width;
            img.y = tween.pos.y * this.height;
        }
        if (tween.anchor) {
            img.anchorOffsetX = tween.anchor.x * this.width;
            img.anchorOffsetY = tween.anchor.y * this.height;
        }
        if (tween.scale) {
            img.scaleX = tween.scale.x;
            img.scaleY = tween.scale.y;
        }
        if (tween.alpha >= 0) {
            img.alpha = tween.alpha;
        }
    }

    private onTweenRun(img: eui.Image, tweens: TweenBody[], param: number) {// 开始播放下一个动画
        let tw: egret.Tween = egret.Tween.get(img);
        for (let i = 1; i < tweens.length; ++i) {
            this.tweenRun(tw, tweens[i], param);
        }
        tw.call(this.onProFinish, this, [param]);
    }

    private tweenRun(tw: egret.Tween, tween: TweenBody, param: number) {
        if (tween) {
            if (tween.delay > 0) {
                tw.wait(tween.delay);
            }
            let data = {};
            let isData: boolean = false;
            if (tween.pos) {
                isData = true;
                data["x"] = tween.pos.x * this.width;
                data["y"] = tween.pos.y * this.height;
            }
            if (tween.anchor) {
                isData = true;
                data["anchorOffsetX"] = tween.anchor.x * this.width;
                data["anchorOffsetY"] = tween.anchor.y * this.height;
            }
            if (tween.scale) {
                isData = true;
                data["scaleX"] = tween.scale.x;
                data["scaleY"] = tween.scale.y;
                console.log('scaleX' + tween.scale.x + '--' + tween.scale.y);

            }
            if (tween.alpha >= 0) {
                isData = true;
                data["alpha"] = tween.alpha;
            }
            if (isData) {
                tw.to(data, tween.time);
            }
            if (tween.isNext) {
                tw.call(this.onNextPro, this);
            }
        }
    }
}
