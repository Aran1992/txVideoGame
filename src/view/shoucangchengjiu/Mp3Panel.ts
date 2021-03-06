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
    private banner_img: eui.Image;
    private musicName: eui.Label;
    private desc: eui.Label;
    private musicNum: eui.Label;
    private lastData: Mp3Item;
    private isPlay: boolean = false;
    private playStage: boolean = false;
    private _geci;
    //3拖动的滑动条前进
    private geciIdx: number = 0;
    private tabIdx: number = 0;
    private musicPlayFun: Function;
    private musicPauseFun: Function;
    private musicEndedFun: Function;
    private musicLoadFun: Function;
    private musicErrorFun: Function;
    private dragTimer;


    // private musicDic: string[] = ['如果你也有梦想', '不知道叫什么歌好', '六个字的名字']
    constructor(data) {
        super();
        this.scCfg = data;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
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

    //供子类覆盖
    protected onInit(): void {
        this.goodsLayer.removeChildren();
        // var awardStrAry: string[] = [];
        // var awardStrAry2: string[] = [];
        // if (this.scCfg.src.indexOf(";") >= 0) {
        //     awardStrAry = this.scCfg.src.split(";");
        //     awardStrAry2 = this.scCfg.kuozhan.split(';');
        // } else {
        //     awardStrAry.push(this.scCfg.src);
        //     awardStrAry2.push(this.scCfg.kuozhan);
        // }
        let names = this.scCfg.kuozhan.split(';');
        this.musicNum.text = names.length + '首';
        for (var i: number = 0; i < names.length; i++) {
            var cg: Mp3Item = new Mp3Item();
            cg = new Mp3Item();
            cg.name = i + '';
            cg.data = {data: this.scCfg, src:`resource/assets/shopmusic/${this.scCfg.id}_${i+1}.mp3`, idx: i, name: names[i]};
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
        this.banner_img.source = `${this.scCfg.id}_view_yuan_png`
    }

    protected onSkinName(): void {
        this.skinName = skins.Mp3PanelSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onClose() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_GUIDE_SHOUCANG));
        var mp = window['audioMp3'];
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

    private onSelectMusic(event: egret.Event) {
        var name: number = Number(event.currentTarget.name);
        let st = event.currentTarget.state;
        if (this.lastData) {
            if (this.lastData.name == event.currentTarget.name) {
                if (st == 2) {
                    this.lastData.state = 3;
                    this.onPlay_Pause();
                } else {
                    this.lastData.state = 2;
                    this.onPlay_Pause();
                }
            } else {
                this.lastData.state = 1;
                this.lastData = event.currentTarget;
                GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_MP3), this.lastData.info);
                this.lastData.state = 2;
            }
        } else {
            this.lastData = event.currentTarget;
            this.lastData.state = 2;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAY_MP3), this.lastData.info)
        }
    }

    private onPlay_Pause() {
        if (window['audioMp3'].src && window['audioMp3'].currentTime) {
            if (this.playStage) {
                if (this.isPlay) {
                    window['audioMp3'].pause();
                }
            } else {
                window['audioMp3'].play();
            }
            this.playStage = !this.playStage;

        }
    }

    private onLaseMp3() {

    }

    private onPlayMp3(data) {
        var mp = window['audioMp3'];
        var md = JsonModelManager.instance.getModelgeci()[data.data.name];
        this.musicName.text = data.data.name + '';
        mp.name = data.data.src;
        this.desc.text = data.data.data.name;
        GameCommon.getInstance().showLoading();
        var str: string = '';
        this._geci = [];
        for (var k in md) {
            this._geci.push({name: md[k].start, text: md[k].text + '\n', style: {textColor: 0x545454}});
        }
        this.lyricsLab.textFlow = this._geci;
        this.stopDragMove();
        mp.src = data.data.src;//"resource/sound/" + data.data.src + '.mp3';
        this.geciIdx = 0;
        this.labScroll.viewport.scrollV = 0;
        mp.load();
        mp.play();
    }

    private dragMove() {
        var obj = this;
        var index: number = 0;
        this.dragTimer = setInterval(function () {
            obj.drawArc(obj.share, window['audioMp3'].currentTime, window['audioMp3'].duration, 600);            
            obj.timeImg.mask = obj.share;
            if (obj._geci[obj.geciIdx]) {
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
                }else if (obj._geci[obj.geciIdx].name <= window['audioMp3'].currentTime+1){
                    obj.geciIdx = obj.geciIdx + 1;
                }
            }
            // obj['timeBar4'].value = window['audioMp3'].currentTime / window['audioMp3'].duration * 100;
        }, 500);
    }

    private stopDragMove() {
        if (this.dragTimer){
            clearInterval(this.dragTimer);
            this.dragTimer = null;
        }
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

    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.onInit();
        this.onRegist();
        this.updateResize();
    }

    private onCreateMp3() {
        var mp = window['audioMp3'];
        var obj = this;
        let events=["abort","canplay","canplaythrough","durationchange","emptied","ended","error","loadeddata","loadedmetadata","loadstart","pause","play","playing","progress","ratechange","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting"]
        events.forEach(element => {
            mp.addEventListener(element,()=>{
                console.log("==============mp3"+element);
            })
        });
        mp.addEventListener("error",
            obj.musicErrorFun = function (tim) { 
                GameCommon.getInstance().removeLoading();
                console.log('报错了');
            }, false);
        mp.addEventListener("loadeddata", //歌曲一经完整的加载完毕( 也可以写成上面提到的那些事件类型)
            obj.musicLoadFun = function (tim) {
                GameCommon.getInstance().removeLoading();
                // obj['timeBar4'].maximum = 100;
                window['audioMp3'].play();
            }, false);
        mp.addEventListener("ended", //歌曲播放完成
            obj.musicEndedFun = function (tim) {
                obj.playStage = false;
                obj.isPlay = false;
                obj.lastData.state = 1;
            }, false);
        mp.addEventListener("pause", //歌曲暂停
            obj.musicPauseFun = function (tim) {
                obj.playStage = false;
                obj.isPlay = false;
                obj.stopDragMove();
            }, false);
        mp.addEventListener("play",
            obj.musicPlayFun = function (tim) {
                //GameCommon.getInstance().removeLoading();
                obj.playStage = true;
                obj.isPlay = true;
                obj.dragMove();
            }, false);
    }

    private drawArc(shape: egret.Shape, value: number, max: number, wd: number) {
        var r = 250//wd / 2 - 50;
        shape.graphics.clear();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.moveTo(0, 0);
        shape.graphics.lineTo(0, -r);//画线到弧的起始点
        //shape.graphics.drawArc(0, 0, r, (Math.min(value / max * 360, 360) - 90) * Math.PI / 180, (0 - 90) * Math.PI / 180, false);//从起始点顺时针画弧到终点
        shape.graphics.drawArc(0, 0, r, -(1/2)*Math.PI+2*Math.PI*(value/max), (3/2)*Math.PI, false);//从起始点顺时针画弧到终点
        shape.graphics.lineTo(0, 0);//从终点画线到圆形。到此扇形的封闭区域形成
        shape.graphics.endFill();
    }
}

class Mp3Item extends eui.Component {
    public title: eui.Label;
    public pro: eui.Button;
    public info;
    private icon: eui.Image;
    private playerGroup: eui.Group;
    private num: eui.Label;
    private musicName: eui.Label;
    private _st: number = 1;

    public constructor() {
        super();
        this.skinName = skins.Mp3ItemSkin;
    }

    public set data(info) {
        this.info = info;
        this.musicName.text = (info.idx+1) + '.' + info.name;
        this.playerGroup.visible = false;
    }

    public get state() {
        return this._st;
    }

    public set state(st) {
        this._st = st;
        if (st == 1) {
            this.playerGroup.visible = false;
        } else {
            if (st == 3) {
                this.icon.source = 'playImg_png';
            } else {
                this.icon.source = 'pauseImg_png';
            }
            this.playerGroup.visible = true;
        }
    }

    public getSrc() {
        return this.info.src;
    }
}
