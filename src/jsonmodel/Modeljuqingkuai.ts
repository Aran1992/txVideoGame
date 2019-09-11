/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modeljuqingkuai extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _show;

    public get show(): number {
        return parseFloat(this._json["show"]);
    }

    public set show(value) {
        this._show = value;
    }

    private _scal;

    public get scal(): number {
        return parseFloat(this._json["scal"]);
    }

    public set scal(value) {
        this._scal = value;
    }

    private _wentiId;

    public get wentiId(): number {
        return parseFloat(this._json["wentiId"]);
    }

    public set wentiId(value) {
        this._wentiId = value;
    }

    private _videoId;

    public get videoId(): string {
        if (this._json["videoId"] == "*") {
            return "";
        }
        return this._json["videoId"];
    }

    public set videoId(value) {
        this._videoId = value;
    }

    private _openVideo;

    public get openVideo(): string {
        if (this._json["openVideo"] == "*") {
            return "";
        }
        return this._json["openVideo"];
    }

    public set openVideo(value) {
        this._openVideo = value;
    }

    private _lastKuai;

    public get lastKuai(): string {
        if (this._json["lastKuai"] == "*") {
            return "";
        }
        return this._json["lastKuai"];
    }

    public set lastKuai(value) {
        this._lastKuai = value;
    }

    private _BE;

    public get BE(): number {
        return parseFloat(this._json["BE"]);
    }

    public set BE(value) {
        this._BE = value;
    }

}
