class SoundBody extends SoundBase {
    public constructor(res: string) {
        super(res);
        this.sound = RES.getRes(res);
    }

    public play(volume: number = 0.4, loop: number = 1): void {
        try {
            // if(!this.soundChannel){
            this.soundChannel = this.sound.play(0, loop);
            // }
            this.setVolume(volume);
            // this.soundChannel.volume = SoundManager.getInstance().volumeSound;
        } catch (e) {
            Tool.error("SoundBody - error: " + this.res);
        }
    }
}
