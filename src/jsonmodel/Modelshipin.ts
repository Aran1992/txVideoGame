/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelshipin extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _chengjiuId;
	public set chengjiuId(value){
		this._chengjiuId = value;
	}
	public get chengjiuId():string{
		if (this._json["chengjiuId"] == "*") { return ""; }
		return this._json["chengjiuId"];
	}

	private _juqing;
	public set juqing(value){
		this._juqing = value;
	}
	public get juqing():number{
		return parseFloat(this._json["juqing"]);
	}

	private _vid;
	public set vid(value){
		this._vid = value;
	}
	public get vid():string{
		if (this._json["vid"] == "*") { return ""; }
		return this._json["vid"];
	}

	private _time;
	public set time(value){
		this._time = value;
	}
	public get time():number{
		return parseFloat(this._json["time"]);
	}

	private _tiaozhuan;
	public set tiaozhuan(value){
		this._tiaozhuan = value;
	}
	public get tiaozhuan():number{
		return parseFloat(this._json["tiaozhuan"]);
	}

	private _jtime;
	public set jtime(value){
		this._jtime = value;
	}
	public get jtime():string{
		if (this._json["jtime"] == "*") { return ""; }
		return this._json["jtime"];
	}

	private _stime;
	public set stime(value){
		this._stime = value;
	}
	public get stime():string{
		if (this._json["stime"] == "*") { return ""; }
		return this._json["stime"];
	}

	private _ending;
	public set ending(value){
		this._ending = value;
	}
	public get ending():string{
		if (this._json["ending"] == "*") { return ""; }
		return this._json["ending"];
	}

	private _be;
	public set be(value){
		this._be = value;
	}
	public get be():number{
		return parseFloat(this._json["be"]);
	}

}