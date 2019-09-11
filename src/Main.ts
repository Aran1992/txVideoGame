var size = {width: 0, height: 0, fillType: 0};
var wind = {width: 0, height: 0};
var videoSize = {width: 0, height: 0};
var FILL_TYPE_COVER = 0;// 覆盖
var FILL_TYPE_FILL_H = 1;// 横向填充
var FILL_TYPE_FILL_V = 2;// 纵向填充
class Main extends eui.UILayer {
    private textfield: egret.TextField;

    protected createChildren(): void {
        super.createChildren();
        this.stage.scaleMode = egret.StageScaleMode.FIXED_NARROW;
        this.stage.maxTouches = 100;//最大触摸点
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        });

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'stop');
        };

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GUIDE_STOP_GAME), 'start');
        };

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        // 定义屏幕宽高
        this.resize();
        this.stage.addEventListener(egret.Event.RESIZE, this.resize, this);

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        Tool.getResAsync('config_bin', this.onLoadCompleteConfig, this);
        if (egret.Capabilities.os.indexOf("android") > -1 || egret.Capabilities.os.indexOf("Android") > -1) {

        } else {
            this.stage.orientation = egret.OrientationMode.LANDSCAPE;
        }


    }

    private resize() {
        // 定义屏幕宽高
        size.width = Math.max(this.stage.stageWidth, this.stage.stageHeight);
        size.height = Math.min(this.stage.stageWidth, this.stage.stageHeight);
        GameDefine.SCALENUMX = size.width / 1600;
        GameDefine.SCALENUMY = size.height / 900;
        GameDefine.SCALENUM = GameDefine.SCALENUMX / GameDefine.SCALENUMY;
        wind.width = Math.max(window.innerWidth, window.innerHeight);
        wind.height = Math.min(window.innerWidth, window.innerHeight);
        videoSize.width = window.innerWidth;
        videoSize.height = window.innerHeight;
        this.initRotation();
        let scale = wind.width / wind.height;
        if (scale < (GameDefine.VIDEO_WIDTH - GameDefine.EDGE_BEYOND_H * 2) / GameDefine.VIDEO_HEIGHT) {
            size.fillType = FILL_TYPE_FILL_H;
        } else if (scale > GameDefine.VIDEO_WIDTH / (GameDefine.VIDEO_HEIGHT - GameDefine.EDGE_BEYOND_V * 2)) {
            size.fillType = FILL_TYPE_FILL_V;
        } else {
            size.fillType = FILL_TYPE_COVER;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATE_RESIZE));
    }

    private initRotation() {
        let div = window["videoDivMin"];
        let value = 0;
        let tx = 0;
        let ty = 0;
        let transformStr = "";
        if (videoSize.width < videoSize.height) {
            let cha = (videoSize.height - videoSize.width) / 2;
            videoSize.width = wind.width;
            videoSize.height = wind.height;
            value = 90;
            tx = -cha;
            ty = cha;
        }
        div.style["transform"] = 'translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotate3d(0, 0, 1, ' + value + 'deg) scale3d(1, 1, 1)';
        div.style["-webkit-transform"] = 'translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotate3d(0, 0, 1, ' + value + 'deg) scale3d(1, 1, 1)';
        div.style.width = videoSize.width + "px";
        div.style.height = videoSize.height + "px";
        // div.style.zoom = 1;
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        // const userInfo = await storyPlatform.getUserInfo();
        // console.log(userInfo);
    }

    private async loadResource() {
        try {
            // GameCommon.getInstance().getBookHistoryList();
            GameCommon.getInstance().getBookHistory(FILE_TYPE.AUTO_FILE);
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            loadingView.x = size.width / 2 - 240;
            loadingView.y = size.height / 2;
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        } catch (e) {
            console.error(e);
        }
        // window['onEventNotify'] = function(1,1){

        // }

    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }

    //游戏数据下载完成
    private onLoadCompleteConfig(): void {
        window['jsonfileCount'] = 0;
        let _jsZip = new JSZip();
        try {
            GameDispatcher.getInstance().addEventListener(GameEvent.GAME_JSON_PARSE_OK, this.onParseJsonComplete, this);
            _jsZip['loadAsync'](RES.getRes("config_bin"), {checkCRC32: true}).then(function (jszip: JSZip) {
                for (let filename in jszip['files']) {
                    window['jsonfileCount']++;
                }
                for (let filename in jszip['files']) {
                    jszip['files'][filename].async("string").then(function (jsonFile) {
                        ModelManager.getInstance().configJson[filename] = JSON.parse(jsonFile);
                        window['jsonfileCount']--;
                        if (window['jsonfileCount'] == 0) {
                            GameDispatcher.getInstance().dispatchEventWith(GameEvent.GAME_JSON_PARSE_OK);
                        }
                    });
                }
            }, this);
        } catch (e) {
            alert("zip read fail!!!!! ");
        }
        _jsZip = null;
        RES.destroyRes('config_bin');
    }

    //解析数据完成
    private onParseJsonComplete(): void {
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_JSON_PARSE_OK, this.onParseJsonComplete, this);
        this.touchEnabled = false;
        var gameWo: GameWorld = new GameWorld();
        this.addChild(gameWo);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

declare function showVideo(id, src);

declare function videoSourceChoose(src);

declare function share_game()
