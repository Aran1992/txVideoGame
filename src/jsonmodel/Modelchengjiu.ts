/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelchengjiu extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _tp1;
	public set tp1(value){
		this._tp1 = value;
	}
	public get tp1():number{
		return parseFloat(this._json["tp1"]);
	}

	private _tp2;
	public set tp2(value){
		this._tp2 = value;
	}
	public get tp2():string{
		if (this._json["tp2"] == "*") { return ""; }
		return this._json["tp2"];
	}

	private _level;
	public set level(value){
		this._level = value;
	}
	public get level():number{
		return parseFloat(this._json["level"]);
	}

	private _chengjiuTP;
	public set chengjiuTP(value){
		this._chengjiuTP = value;
	}
	public get chengjiuTP():number{
		return parseFloat(this._json["chengjiuTP"]);
	}

	private _titleID;
	public set titleID(value){
		this._titleID = value;
	}
	public get titleID():string{
		if (this._json["titleID"] == "*") { return ""; }
		return this._json["titleID"];
	}

	private _jianglisuipian;
	public set jianglisuipian(value){
		this._jianglisuipian = value;
	}
	public get jianglisuipian():number{
		return parseFloat(this._json["jianglisuipian"]);
	}

	private _canshu;
	public set canshu(value){
		this._canshu = value;
	}
	public get canshu():string{
		if (this._json["canshu"] == "*") { return ""; }
		return this._json["canshu"];
	}

	private _des;
	public set des(value){
		this._des = value;
	}
	public get des():string{
		if (this._json["des"] == "*") { return ""; }
		return this._json["des"];
	}

}