class SoundTrackBody {
    private item: egret.DisplayObject;
    // private lab: egret.DisplayObject;
    private x: number;
    private y: number;
    private sound: SoundBase;
    private music: string;
    private curPrintVolume: number = 0;

    public constructor(item: egret.DisplayObject, x: number, y: number, music: string) {
        this.item = item;
        // this.lab = lab;
        this.x = x;
        this.y = y;
        this.music = music;
        this.sound = SoundManager.getInstance().playMusic(music, 0);
        this.updateResize();
    }

    public updatePoint(centerX: number, centerY: number) {
        let soundDisV = 1200;
        let dis = Math.floor(Tool.pDisPoint(centerX, 0, this.getPosX(), 0));
        if (dis < soundDisV) {
            this.curPrintVolume = 1 - dis / soundDisV;
            this.sound.setVolume(this.curPrintVolume);
        } else {
            this.sound.setVolume(0);
        }
    }

    public onPauseMusic() {
        this.sound.setVolume(0);
    }

    public onPlayMusic() {
        this.sound.setVolume(this.curPrintVolume);
    }

    // }
    public updateResize() {
        if (this.item) {
            this.item.x = this.x * GameDefine.sceneScaleX;
            this.item.y = this.y * GameDefine.sceneScaleY;
            // this.lab.x = this.x * GameDefine.sceneScaleX+50;
            // this.lab.y = this.y * GameDefine.sceneScaleY+3;
        }
    }

    private getPosX() {
        return this.x * GameDefine.sceneScaleX;
    }

    // public onFinish(){
    // 	SoundManager.getInstance().stopMusicAll();

    private getPosY() {
        return this.y * GameDefine.sceneScaleY;
    }
}
