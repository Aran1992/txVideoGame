/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelshoucang extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _mulu1;

    public get mulu1(): number {
        return parseFloat(this._json["mulu1"]);
    }

    public set mulu1(value) {
        this._mulu1 = value;
    }

    private _mulu2;

    public get mulu2(): number {
        return parseFloat(this._json["mulu2"]);
    }

    public set mulu2(value) {
        this._mulu2 = value;
    }

    private _level;

    public get level(): string {
        if (this._json["level"] == "*") {
            return "";
        }
        return this._json["level"];
    }

    public set level(value) {
        this._level = value;
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

    private _time;

    public get time(): string {
        if (this._json["time"] == "*") {
            return "";
        }
        return this._json["time"];
    }

    public set time(value) {
        this._time = value;
    }

    private _minipic;

    public get minipic(): string {
        if (this._json["minipic"] == "*") {
            return "";
        }
        return this._json["minipic"];
    }

    public set minipic(value) {
        this._minipic = value;
    }

    private _src;

    public get src(): string {
        if (this._json["src"] == "*") {
            return "";
        }
        return this._json["src"];
    }

    public set src(value) {
        this._src = value;
    }

    private _kuozhan;

    public get kuozhan(): string {
        if (this._json["kuozhan"] == "*") {
            return "";
        }
        return this._json["kuozhan"];
    }

    public set kuozhan(value) {
        this._kuozhan = value;
    }

    private _shengyin;

    public get shengyin(): string {
        if (this._json["shengyin"] == "*") {
            return "";
        }
        return this._json["shengyin"];
    }

    public set shengyin(value) {
        this._shengyin = value;
    }

}
