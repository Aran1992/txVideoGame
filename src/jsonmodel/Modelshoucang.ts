/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelshoucang extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _src;
	public set src(value){
		this._src = value;
	}
	public get src():string{
		if (this._json["src"] == "*") { return ""; }
		return this._json["src"];
	}

	private _shengyin;
	public set shengyin(value){
		this._shengyin = value;
	}
	public get shengyin():number{
		return parseFloat(this._json["shengyin"]);
	}

	private _time;
	public set time(value){
		this._time = value;
	}
	public get time():string{
		if (this._json["time"] == "*") { return ""; }
		return this._json["time"];
	}

	private _level;
	public set level(value){
		this._level = value;
	}
	public get level():string{
		if (this._json["level"] == "*") { return ""; }
		return this._json["level"];
	}

	private _mulu2;
	public set mulu2(value){
		this._mulu2 = value;
	}
	public get mulu2():number{
		return parseFloat(this._json["mulu2"]);
	}

	private _name;
	public set name(value){
		this._name = value;
	}
	public get name():string{
		if (this._json["name"] == "*") { return ""; }
		return this._json["name"];
	}

	private _kuozhan;
	public set kuozhan(value){
		this._kuozhan = value;
	}
	public get kuozhan():string{
		if (this._json["kuozhan"] == "*") { return ""; }
		return this._json["kuozhan"];
	}

	private _mulu1;
	public set mulu1(value){
		this._mulu1 = value;
	}
	public get mulu1():number{
		return parseFloat(this._json["mulu1"]);
	}

}