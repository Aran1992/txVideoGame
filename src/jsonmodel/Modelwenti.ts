/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelwenti extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _chapter;
	public set chapter(value){
		this._chapter = value;
	}
	public get chapter():number{
		return parseFloat(this._json["chapter"]);
	}

	private _des;
	public set des(value){
		this._des = value;
	}
	public get des():string{
		if (this._json["des"] == "*") { return ""; }
		return this._json["des"];
	}

	private _ans;
	public set ans(value){
		this._ans = value;
	}
	public get ans():string{
		if (this._json["ans"] == "*") { return ""; }
		return this._json["ans"];
	}

	private _moren;
	public set moren(value){
		this._moren = value;
	}
	public get moren():number{
		return parseFloat(this._json["moren"]);
	}

	private _time;
	public set time(value){
		this._time = value;
	}
	public get time():number{
		return parseFloat(this._json["time"]);
	}

	private _type;
	public set type(value){
		this._type = value;
	}
	public get type():number{
		return parseFloat(this._json["type"]);
	}

	private _name;
	public set name(value){
		this._name = value;
	}
	public get name():string{
		if (this._json["name"] == "*") { return ""; }
		return this._json["name"];
	}

}