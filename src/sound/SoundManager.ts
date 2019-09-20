class SoundManager {
    public static musicList: string[] = ["D4.mp3", "G4.mp3", "E4.mp3", 'music1.mp3', 'music2.mp3', 'music3.mp3', 'music4.mp3', 'loseMusic.mp3', 'winMusic.mp3'];
    public static volume: number = 1;
    private static instance = null;
    private soundDataMap;
    private musicDataMap;
    private soundMap;
    private musicMap;

    public constructor() {
        this.soundMap = {};
        this.musicMap = {};
        this.init();
    }

    public static getInstance(): SoundManager {
        if (this.instance == null) {
            this.instance = new SoundManager();
        }
        return this.instance;
    }

    public initMusic(list: string[]) {
        // for(let i = 0; i < list.length; ++i){
        //     this.playMusic(list[i], 0);
        // }
        // this.stopMusicAll();
    }

    public playSound(key: string, callback?: Function): void {
        if (!this.musicMap[key]) {
            if (this.musicDataMap[key]) {
                this.musicMap[key] = new MusicBody(this.musicDataMap[key]);
            } else {
                this.musicMap[key] = new MusicBody("resource/sound/" + key);
            }
            VideoManager.getInstance().log('没有预加载')
        }
        this.musicMap[key].play(1, 1, callback);
    }

    public playMusic(key: string, volume: number = 0.4): MusicBody {
        if (!this.musicMap[key]) {
            this.musicMap[key] = new MusicBody(this.musicDataMap[key]);
        }
        (this.musicMap[key] as MusicBody).play(volume, -1);
        return this.musicMap[key];
    }

    public stopMusicAll() {
        for (let k in this.soundMap) {
            let sound: SoundBase = this.soundMap[k];
            sound.stop();
        }
        for (let ke in this.musicMap) {
            let sound: MusicBody = this.musicMap[ke];
            if (sound._res != 'resource/sound/loseMusic.mp3')
                sound.stop();
        }
        // if(this.currMusic) {
        //     this.currMusic.stop();
        // }

    }

    private init() {
        this.soundDataMap = {};
        this.soundDataMap["xxx"] = "xxx_mp3";// 暂时无音效

        this.musicDataMap = {};
        for (let i = 0; i < SoundManager.musicList.length; ++i) {
            if (!this.musicMap[SoundManager.musicList[i]]) {
                this.musicMap[SoundManager.musicList[i]] = new MusicBody("resource/sound/" + SoundManager.musicList[i]);
                this.musicMap[SoundManager.musicList[i]].onLoad();
                // VideoManager.getInstance().log('loadmusic')
            }
            this.musicDataMap[SoundManager.musicList[i]] = "resource/sound/" + SoundManager.musicList[i];
        }
    }
}
