/**
 *
 * @author 
 *
 */
class MusicBody extends SoundBase {
    private state: number;// 0-停止状态，1-播放状态
    private isLoad: boolean;
    public _res:string;
    public constructor(res: string) {
        super(res);
        this._res = res;
        this.isLoad = false;
    }
    public play(volume: number = 0.4, loop: number = -1): void {
        this.volume = volume;
        this.loop = loop;
        this.state = 1;
        if(!this.sound) {
            var instance = this;
            this.sound = new egret.Sound();
            this.sound.addEventListener(egret.Event.COMPLETE,function loadOver(event: egret.Event) {
                instance.isLoad = true;
                instance.start();
            },this);
            this.sound.addEventListener(egret.IOErrorEvent.IO_ERROR,function loadError(event: egret.IOErrorEvent) {
                Tool.error("SoundBody loadError: " + instance.res);
            },this);
            this.sound.load(this.res);
        } else {
            this.start();
        }
    }
    public onLoad(){
        if(!this.sound) {
            var instance = this;
            this.sound = new egret.Sound();
            this.sound.addEventListener(egret.Event.COMPLETE,function loadOver(event: egret.Event) {
                instance.isLoad = true;
            },this);
            this.sound.addEventListener(egret.IOErrorEvent.IO_ERROR,function loadError(event: egret.IOErrorEvent) {
                Tool.error("SoundBody loadError: " + instance.res);
            },this);
            this.sound.load(this.res);
        }
    }
    private start() {
        if(this.state == 1 && this.isLoad) {
            this.soundChannel = this.sound.play(0,this.loop);
            this.soundChannel.volume = this.volume;
        }
    }

    public stop() {
        this.state = 0;
        super.stop();
    }
}
