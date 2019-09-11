/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelchengjiu extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _tp1;

    public get tp1(): number {
        return parseFloat(this._json["tp1"]);
    }

    public set tp1(value) {
        this._tp1 = value;
    }

    private _tp2;

    public get tp2(): string {
        if (this._json["tp2"] == "*") {
            return "";
        }
        return this._json["tp2"];
    }

    public set tp2(value) {
        this._tp2 = value;
    }

    private _level;

    public get level(): number {
        return parseFloat(this._json["level"]);
    }

    public set level(value) {
        this._level = value;
    }

    private _chengjiuTP;

    public get chengjiuTP(): number {
        return parseFloat(this._json["chengjiuTP"]);
    }

    public set chengjiuTP(value) {
        this._chengjiuTP = value;
    }

    private _titleID;

    public get titleID(): string {
        if (this._json["titleID"] == "*") {
            return "";
        }
        return this._json["titleID"];
    }

    public set titleID(value) {
        this._titleID = value;
    }

    private _jianglisuipian;

    public get jianglisuipian(): number {
        return parseFloat(this._json["jianglisuipian"]);
    }

    public set jianglisuipian(value) {
        this._jianglisuipian = value;
    }

    private _canshu;

    public get canshu(): string {
        if (this._json["canshu"] == "*") {
            return "";
        }
        return this._json["canshu"];
    }

    public set canshu(value) {
        this._canshu = value;
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
