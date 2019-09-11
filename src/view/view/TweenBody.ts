class TweenBody {
    public pos: egret.Point;//范围0-1
    public anchor: egret.Point;//范围0-1
    public scale: egret.Point;
    public alpha: number = -1;//范围0-1
    public delay: number = -1;// 等待时间：毫秒
    public time: number = 1000;// 动画持续时间：毫秒
    public isNext: boolean = false;

    public setPoint(x: number, y: number):TweenBody{
        this.pos = new egret.Point(0.5, 0.5);
        return this;
    }
    public setAnchor(x: number, y: number):TweenBody{
        this.anchor = new egret.Point(x, y);
        return this;
    }
    public setScale(scalex: number, scaley: number = scalex):TweenBody{
        this.scale = new egret.Point(scalex, scaley);
        return this;
    }
    public setAlpha(alpha: number):TweenBody{
        this.alpha = alpha;
        return this;
    }
    public setDelay(delay: number):TweenBody{
        this.delay = delay;
        return this;
    }
    public setTime(time: number):TweenBody{
        this.time = time;
        return this;
    }
    public setNext(next: boolean):TweenBody{
        this.isNext = next;
        return this;
    }
}