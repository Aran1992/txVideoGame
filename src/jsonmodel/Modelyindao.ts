/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelyindao extends ModelJsonBase {

    public constructor(json) {
        super(json);
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

    private _tp;

    public get tp(): number {
        return parseFloat(this._json["tp"]);
    }

    public set tp(value) {
        this._tp = value;
    }

}
