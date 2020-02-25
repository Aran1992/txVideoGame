/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelshop extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _name;
	public set name(value){
		this._name = value;
	}
	public get name():string{
		if (this._json["name"] == "*") { return ""; }
		return this._json["name"];
	}

	private _preview;
	public set preview(value){
		this._preview = value;
	}
	public get preview():string{
		if (this._json["preview"] == "*") { return ""; }
		return this._json["preview"];
	}

	private _params;
	public set params(value){
		this._params = value;
	}
	public get params():string{
		if (this._json["params"] == "*") { return ""; }
		return this._json["params"];
	}

	private _parent;
	public set parent(value){
		this._parent = value;
	}
	public get parent():string{
		if (this._json["parent"] == "*") { return ""; }
		return this._json["parent"];
	}

	private _currPrice;
	public set currPrice(value){
		this._currPrice = value;
	}
	public get currPrice(): number {
		const o = parseFloat(this._json["origPrice"]);
		const c = parseFloat(this._json["currPrice"]);
		if (o > c) {
			if (platform.getServerTime() < new Date(2020, 3, 1).getTime()
				&& platform.getServerTime() >= new Date(2020, 2, 1).getTime()) {
				return c;
			} else {
				return o;
			}
		} else {
			return c;
		}
	}

	private _origPrice;
	public set origPrice(value){
		this._origPrice = value;
	}
	public get origPrice():number{
		return parseFloat(this._json["origPrice"]);
	}

	private _currSuipian;
	public set currSuipian(value){
		this._currSuipian = value;
	}
	public get currSuipian():number{
		return parseFloat(this._json["currSuipian"]);
	}

	private _origSuipian;
	public set origSuipian(value){
		this._origSuipian = value;
	}
	public get origSuipian():number{
		return parseFloat(this._json["origSuipian"]);
	}

	private _show;
	public set show(value){
		this._show = value;
	}
	public get show():number{
		return parseFloat(this._json["show"]);
	}

	private _shaixuan_params;
	public set shaixuan_params(value){
		this._shaixuan_params = value;
	}
	public get shaixuan_params():string{
		if (this._json["shaixuan_params"] == "*") { return ""; }
		return this._json["shaixuan_params"];
	}

	private _desc;
	public set desc(value){
		this._desc = value;
	}
	public get desc():string{
		if (this._json["desc"] == "*") { return ""; }
		return this._json["desc"];
	}

}
