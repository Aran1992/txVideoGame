/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelshipin extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _chengjiuId;

    public get chengjiuId(): string {
        if (this._json["chengjiuId"] == "*") {
            return "";
        }
        return this._json["chengjiuId"];
    }

    public set chengjiuId(value) {
        this._chengjiuId = value;
    }

    private _juqing;

    public get juqing(): number {
        return parseFloat(this._json["juqing"]);
    }

    public set juqing(value) {
        this._juqing = value;
    }

    private _vid;

    public get vid(): string {
        if (this._json["vid"] == "*") {
            return "";
        }
        return this._json["vid"];
    }

    public set vid(value) {
        this._vid = value;
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

    private _dlc;

    public get dlc(): number {
        return parseFloat(this._json["dlc"]);
    }

    public set dlc(value) {
        this._dlc = value;
    }

    private _shanhuiid;

    public get shanhuiid(): string {
        if (this._json["shanhuiid"] == "*") {
            return "";
        }
        return this._json["shanhuiid"];
    }

    public set shanhuiid(value) {
        this._shanhuiid = value;
    }

    private _weight;

    public get weight(): number {
        return parseFloat(this._json["weight"]);
    }

    public set weight(value) {
        this._weight = value;
    }

    private _tiaozhuan;

    public get tiaozhuan(): number {
        return parseFloat(this._json["tiaozhuan"]);
    }

    public set tiaozhuan(value) {
        this._tiaozhuan = value;
    }

    private _subtitle;

    public get subtitle(): number {
        return parseFloat(this._json["subtitle"]);
    }

    public set subtitle(value) {
        this._subtitle = value;
    }

    private _payTime;

    public get payTime(): number {
        return parseFloat(this._json["payTime"]);
    }

    public set payTime(value) {
        this._payTime = value;
    }

    private _haogandu;

    public get haogandu(): string {
        if (this._json["haogandu"] == "*") {
            return "";
        }
        return this._json["haogandu"];
    }

    public set haogandu(value) {
        this._haogandu = value;
    }

    private _jtime;

    public get jtime(): string {
        if (this._json["jtime"] == "*") {
            return "";
        }
        return this._json["jtime"];
    }

    public set jtime(value) {
        this._jtime = value;
    }

}
