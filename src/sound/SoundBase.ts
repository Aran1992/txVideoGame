/**
 *
 * @author
 *
 */
class SoundBase {
    public sound: egret.Sound;
    public soundChannel: egret.SoundChannel = null;
    public res: string;
    public volume: number;
    public loop: number;
    private isPlay: boolean;

    public constructor(res: string) {
        this.res = res;
    }

    public play(volume: number = 0.4, loop: number): void {

    }

    public stop() {
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
    }

    public setVolume(volume: number) {
        this.volume = volume;
        if (this.soundChannel) {
            this.soundChannel.volume = volume;
        }
    }

    public getVolume() {
        return this.volume;
    }
}
