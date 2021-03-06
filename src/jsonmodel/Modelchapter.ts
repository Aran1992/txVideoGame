/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelchapter extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _wenti;
	public set wenti(value){
		this._wenti = value;
	}
	public get wenti():number{
		return parseFloat(this._json["wenti"]);
	}

	private _videoSrc;
	public set videoSrc(value){
		this._videoSrc = value;
	}
	public get videoSrc():string{
		if (this._json["videoSrc"] == "*") { return ""; }
		return this._json["videoSrc"];
	}

	private _name;
	public set name(value){
		this._name = value;
	}
	public get name():string{
		if (this._json["name"] == "*") { return ""; }
		return this._json["name"];
	}

	private _saleTime;
	public set saleTime(value){
		this._saleTime = value;
	}
	public get saleTime():number{
		return parseFloat(this._json["saleTime"]);
	}

	private _freeTime;
	public set freeTime(value){
		this._freeTime = value;
	}
	public get freeTime():number{
		return parseFloat(this._json["freeTime"]);
	}

	private _next;
	public set next(value){
		this._next = value;
	}
	public get next():number{
		return parseFloat(this._json["next"]);
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