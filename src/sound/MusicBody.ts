/**
 *
 * @author
 *
 */
class MusicBody extends SoundBase {
    public _res: string;
    private state: number;// 0-停止状态，1-播放状态
    private isLoad: boolean;
    private endedCallback: Function;

    public constructor(res: string) {
        super(res);
        this._res = res;
        this.isLoad = false;
    }

    public play(volume: number = 0.4, loop: number = -1, callback?: Function): void {
        this.volume = volume;
        this.loop = loop;
        this.state = 1;
        this.endedCallback = callback;
        if (!this.sound) {
            this.createSound(true);
        } else {
            this.start();
        }
    }

    public onLoad() {
        if (!this.sound) {
            this.createSound();
        }
    }

    public stop() {
        this.state = 0;
        super.stop();
    }

    private createSound(isPlay: boolean = false) {
        this.sound = new egret.Sound();
        this.sound.addEventListener(egret.Event.COMPLETE, (event: egret.Event) => {
            this.isLoad = true;
            if (isPlay) {
                this.start();
            }
        }, this);
        this.sound.addEventListener(egret.IOErrorEvent.IO_ERROR, (event: egret.IOErrorEvent) => {
            Tool.error("SoundBody loadError: " + this.res);
        }, this);
        this.sound.addEventListener("ended", () => {
            if (this.endedCallback) {
                this.endedCallback();
            }
        }, this);
        this.sound.load(this.res);
    }

    private start() {
        if (this.state == 1 && this.isLoad) {
            this.soundChannel = this.sound.play(0, this.loop);
            this.soundChannel.volume = this.volume;
        }
    }
}
