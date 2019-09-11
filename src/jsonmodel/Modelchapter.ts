/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelchapter extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _wenti;

    public get wenti(): number {
        return parseFloat(this._json["wenti"]);
    }

    public set wenti(value) {
        this._wenti = value;
    }

    private _videoSrc;

    public get videoSrc(): string {
        if (this._json["videoSrc"] == "*") {
            return "";
        }
        return this._json["videoSrc"];
    }

    public set videoSrc(value) {
        this._videoSrc = value;
    }

    private _name;

    public get name(): string {
        if (this._json["name"] == "*") {
            return "";
        }
        return this._json["name"];
    }

    public set name(value) {
        this._name = value;
    }

    private _des;

    public get des(): string {
        if (this._json["des"] == "*") {
            return "";
        }
        return this._json["des"];
    }

    public set des(value) {
        this._des = value;
    }

}
