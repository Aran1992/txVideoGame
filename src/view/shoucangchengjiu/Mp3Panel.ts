// TypeScript file
class Mp3Panel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private goodsLayer: eui.Group;
    private scroll: eui.Scroller;
    private labScroll: eui.Scroller;
    private lyricsLab: eui.Label;
    private scCfg: Modelshoucang;
    private timeImg: eui.Image;
    private share: egret.Shape;
    private banner_img:eui.Image;
    private musicName:eui.Label;
    private desc:eui.Label;
    private musicNum:eui.Label;
    // private musicDic: string[] = ['如果你也有梦想', '不知道叫什么歌好', '六个字的名字']
    constructor(data) {
        super();
        this.scCfg = data;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }
    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        // this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextMp3, this);
        // this.reduceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLaseMp3, this);
        // this.play_pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PLAY_MP3, this.onPlayMp3, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        // this.addBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddVideo, this);
    }
    protected onRemove(): void {
        // this.addBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextMp3, this);
        // this.reduceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLaseMp3, this);
        // this.play_pauseBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay_Pause, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.PLAY_MP3, this.onPlayMp3, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }
    private onClose() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_GUIDE_SHOUCANG))
        var mp = window['audioMp3']
        mp.removeEventListener("error", this.musicErrorFun, false);
        mp.removeEventListener("loadeddata", this.musicLoadFun, false);
        mp.removeEventListener("ended", this.musicEndedFun, false);
        mp.removeEventListener("pause", this.musicPauseFun, false);
        mp.removeEventListener("play", this.musicPlayFun, false);
        if (this.isPlay) {
            mp['pause']();
        }
        this.onRemove();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'Mp3Panel')
    }
    private onNextMp3() {

    }
    private lastData: Mp3Item;
    private onSelectMusic(event: egret.Event) {
        var name: number = Number(event.currentTarget.name);
        let st = event.currentTarget.state;
        if (this.lastData) {
            if (this.lastData.name == event.currentTarget.name) {
                if (st == 2) {
                    this.lastData.state = 3;
                    this.onPlay_Pause();
                }
                else {
                    this.lastData.state = 2;
                    this.onPlay_Pause();
                }
            }
            else {
                this.lastData.state = 1;
                this.lastData = event.currentTarget;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_MP3), this.lastData.info)
                this.lastData.state = 2;
            }
        }
        else {
            this.lastData = event.currentTarget;
            this.lastData.state = 2;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_MP3), this.lastData.info)
        }
    }
    private isPlay: boolean = false;
    private playStage: boolean = false;
    private onPlay_Pause() {
        if (window['audioMp3'].src && window['audioMp3'].currentTime) {
            if (this.playStage) {
                if (this.isPlay) {
                    window['audioMp3'].pause();
                }
            }
            else {
                window['audioMp3'].play();
            }
            this.playStage = !this.playStage;

        }
    }
    private onLaseMp3() {

    }
    public playEffect(target: any, options: any) {
        options = options || {};
        if (options.initNum == options.num) return;
        var time = options.time,//总时间--毫秒为单位 
            finalNum = options.num, //要显示的真实数值
            regulator = options.regulator || 100, //调速器，改变regulator的数值可以调节数字改变的速度          
            step = (finalNum - options.initNum) / (time / regulator),/*每30ms增加的数值--*/
            count = options.initNum, //计数器       
            initial = options.initNum;
        var timer = setInterval(() => {
            count = count + step;
            if (count >= finalNum && options.initNum < finalNum) {
                clearInterval(timer);
                count = finalNum;
            }

            if (count <= finalNum && options.initNum > finalNum) {
                clearInterval(timer);
                count = finalNum;
            }
            //t未发生改变的话就直接返回         
            var t = Math.floor(count);
            if (t == initial) return;
            initial = t;
            target.text = initial + "";
        }, 30);
    }
    private _geci;
    private onPlayMp3(data) {
        var mp = window['audioMp3']

        var md = JsonModelManager.instance.getModelgeci()[data.data.src];
        this.musicName.text = data.data.name+'';
        mp.name = data.data.src;
        this.desc.text = data.data.data.kuozhan
        GameCommon.getInstance().showLoading();
        var str: string = '';
        this._geci = [];
        for (var k in md) {
            this._geci.push({ name: md[k].start, text: md[k].text + '\n', style: { textColor: 0x545454 } });
        }
        this.lyricsLab.textFlow = this._geci;
        this.stopDragMove();
        mp.src = "resource/sound/" + data.data.src + '.mp3';
        this.geciIdx = 0;
        this.labScroll.viewport.scrollV = 0;
        mp.load();
        mp.play();
    }
    //3拖动的滑动条前进
    private geciIdx: number = 0;
    private dragMove() {
        var obj = this;
        var index: number = 0;
        setInterval(function () {
            if (obj._geci[obj.geciIdx]) {
                obj.drawArc(obj.share, window['audioMp3'].currentTime, window['audioMp3'].duration, 600);
                if (obj._geci[obj.geciIdx].name >= window['audioMp3'].currentTime && obj._geci[obj.geciIdx].name <= window['audioMp3'].currentTime + 1) {
                    if (obj._geci[obj.geciIdx - 1]) {
                        obj._geci[obj.geciIdx - 1].style.textColor = 0x545454;
                    }
                    if (obj.geciIdx >= 2) {
                        // let num = 0;
                        // num = Math.floor(idx/3);
                        obj.labScroll.viewport.scrollV = obj.geciIdx + 1;
                    }
                    obj._geci[obj.geciIdx].style.textColor = 0XF2658C;
                    obj.lyricsLab.textFlow = obj._geci;
                    obj.geciIdx = obj.geciIdx + 1;
                }
            }
            // obj['timeBar4'].value = window['audioMp3'].currentTime / window['audioMp3'].duration * 100;
        }, 500);
    }
    private stopDragMove() {
        clearInterval(500);
    }
    //播放时间
    private timeChange(time, timePlace) {//默认获取的时间是时间戳改成我们常见的时间格式
        // var timePlace = document.getElementById(timePlace);
        // //分钟
        // var minute = time / 60;
        // var minutes = parseInt(minute);
        // if (minutes < 10) {
        //     minutes = "0" + minutes;
        // }
        // //秒
        // var second = time % 60;
        // seconds = parseInt(second);
        // if (seconds < 10) {
        //     seconds = "0" + seconds;
        // }
        // var allTime = "" + minutes + "" + ":" + "" + seconds + ""
        // timePlace.innerHTML = allTime;
    }
    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
    private tabIdx: number = 0;
    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.onInit();
        this.onRegist();
        this.updateResize();
    }
    //供子类覆盖
    protected onInit(): void {
        this.goodsLayer.removeChildren();
        var awardStrAry: string[] = [];
         var awardStrAry2: string[] = [];
        if (this.scCfg.src.indexOf(",") >= 0) {
            awardStrAry = this.scCfg.src.split(",");
            awardStrAry2 = this.scCfg.kuozhan.split(';');
        }
        else {
            awardStrAry.push(this.scCfg.src);
            awardStrAry2.push(this.scCfg.kuozhan);
        }
        this.musicNum.text= awardStrAry.length+'首';
        for (var i: number = 0; i < awardStrAry.length; i++) {
            var cg: Mp3Item = new Mp3Item();
            cg = new Mp3Item();
            cg.name = i + '';
            cg.data = { data:this.scCfg,src: this.scCfg.src, idx: i + 1, name: awardStrAry2[i] }
            cg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectMusic, this);
            this.goodsLayer.addChild(cg);
        }
        this.share = new egret.Shape();
        this.share.x = 355 / 2;
        this.share.y = 355 / 2;
        this.drawArc(this.share, 0, 400, 600);
        this.timeImg.parent.addChild(this.share);
        this.timeImg.mask = this.share;
        this.onCreateMp3();
        this.banner_img.source = this.scCfg.minipic+'yuan_png';
    }
    private onCreateMp3() {
        var mp = window['audioMp3']
        var obj = this;
        mp.addEventListener("error",
            obj.musicErrorFun = function (tim) { //监听暂停
                console.log('报错了');
            }, false);
        mp.addEventListener("loadeddata", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicLoadFun = function (tim) {
                GameCommon.getInstance().removeLoading();
                // obj['timeBar4'].maximum = 100;
                window['audioMp3'].play();
            }, false);
        mp.addEventListener("ended", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicEndedFun = function (tim) {
                obj.playStage = false;
                obj.isPlay = false;
            }, false);
        mp.addEventListener("pause", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicPauseFun = function (tim) {
                obj.playStage = false;
                obj.isPlay = false;
                obj.stopDragMove();
            }, false);
        mp.addEventListener("play",
            obj.musicPlayFun = function (tim) {
                GameCommon.getInstance().removeLoading();
                obj.playStage = true;
                obj.isPlay = true;
                obj.dragMove();
            }, false);
    }
    private musicPlayFun: Function;
    private musicPauseFun: Function;
    private musicEndedFun: Function;
    private musicLoadFun: Function;
    private musicErrorFun: Function;
    private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
        var r = wd / 2 - 50;
        shape.graphics.clear();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(0, -r);//画线到弧的起始点
        shape.graphics.drawArc(0, 0, r, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
        shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
        shape.graphics.endFill();
    }
    protected onSkinName(): void {
        this.skinName = skins.Mp3PanelSkin;
    }
}
class Mp3Item extends eui.Component {
    public title: eui.Label;
    public pro: eui.Button;
    private icon: eui.Image;
    private playerGroup: eui.Group;
    private num: eui.Label;
    public info;
    private musicName: eui.Label;
    public constructor() {
        super();
        this.skinName = skins.Mp3ItemSkin;
    }
    public set data(info) {
        this.info = info;
        this.musicName.text = info.idx + '.' + info.name;
        this.playerGroup.visible = false;
    }
    private _st: number = 1;
    public get state() {
        return this._st;
    }
    public set state(st) {
        this._st = st;
        if (st == 1) {
            this.playerGroup.visible = false;
        }
        else {
            if (st == 3) {
                this.icon.source = 'playImg_png';
            }
            else {
                this.icon.source = 'pauseImg_png';
            }
            this.playerGroup.visible = true;
        }
    }
    public getSrc() {
        return this.info.src;
    }
}