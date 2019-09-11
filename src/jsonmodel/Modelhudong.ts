/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelhudong extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _tp;

    public get tp(): number {
        return parseFloat(this._json["tp"]);
    }

    public set tp(value) {
        this._tp = value;
    }

    private _pos;

    public get pos(): string {
        if (this._json["pos"] == "*") {
            return "";
        }
        return this._json["pos"];
    }

    public set pos(value) {
        this._pos = value;
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
