/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelhudong extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _tp;
	public set tp(value){
		this._tp = value;
	}
	public get tp():number{
		return parseFloat(this._json["tp"]);
	}

	private _pos;
	public set pos(value){
		this._pos = value;
	}
	public get pos():string{
		if (this._json["pos"] == "*") { return ""; }
		return this._json["pos"];
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