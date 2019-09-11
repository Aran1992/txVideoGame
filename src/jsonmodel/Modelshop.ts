/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelshop extends ModelJsonBase {

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

    private _banner;

    public get banner(): string {
        if (this._json["banner"] == "*") {
            return "";
        }
        return this._json["banner"];
    }

    public set banner(value) {
        this._banner = value;
    }

    private _banner2;

    public get banner2(): string {
        if (this._json["banner2"] == "*") {
            return "";
        }
        return this._json["banner2"];
    }

    public set banner2(value) {
        this._banner2 = value;
    }

    private _desc;

    public get desc(): string {
        if (this._json["desc"] == "*") {
            return "";
        }
        return this._json["desc"];
    }

    public set desc(value) {
        this._desc = value;
    }

    private _params;

    public get params(): string {
        if (this._json["params"] == "*") {
            return "";
        }
        return this._json["params"];
    }

    public set params(value) {
        this._params = value;
    }

    private _currPrice;

    public get currPrice(): number {
        return parseFloat(this._json["currPrice"]);
    }

    public set currPrice(value) {
        this._currPrice = value;
    }

    private _origPrice;

    public get origPrice(): number {
        return parseFloat(this._json["origPrice"]);
    }

    public set origPrice(value) {
        this._origPrice = value;
    }

    private _currSuipian;

    public get currSuipian(): number {
        return parseFloat(this._json["currSuipian"]);
    }

    public set currSuipian(value) {
        this._currSuipian = value;
    }

    private _origSuipian;

    public get origSuipian(): number {
        return parseFloat(this._json["origSuipian"]);
    }

    public set origSuipian(value) {
        this._origSuipian = value;
    }

    private _show;

    public get show(): number {
        return parseFloat(this._json["show"]);
    }

    public set show(value) {
        this._show = value;
    }

    private _preview;

    public get preview(): string {
        if (this._json["preview"] == "*") {
            return "";
        }
        return this._json["preview"];
    }

    public set preview(value) {
        this._preview = value;
    }

    private _shaixuan_params;

    public get shaixuan_params(): string {
        if (this._json["shaixuan_params"] == "*") {
            return "";
        }
        return this._json["shaixuan_params"];
    }

    public set shaixuan_params(value) {
        this._shaixuan_params = value;
    }

}
