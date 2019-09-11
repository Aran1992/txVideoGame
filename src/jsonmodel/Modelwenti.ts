/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelwenti extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _chapter;

    public get chapter(): number {
        return parseFloat(this._json["chapter"]);
    }

    public set chapter(value) {
        this._chapter = value;
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

    private _ans;

    public get ans(): string {
        if (this._json["ans"] == "*") {
            return "";
        }
        return this._json["ans"];
    }

    public set ans(value) {
        this._ans = value;
    }

    private _moren;

    public get moren(): number {
        return parseFloat(this._json["moren"]);
    }

    public set moren(value) {
        this._moren = value;
    }

    private _time;

    public get time(): number {
        return parseFloat(this._json["time"]);
    }

    public set time(value) {
        this._time = value;
    }

    private _type;

    public get type(): number {
        return parseFloat(this._json["type"]);
    }

    public set type(value) {
        this._type = value;
    }

}
