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
	public get time():string{
		if (this._json["time"] == "*") { return ""; }
		return this._json["time"];
	}

	private _dlc;
	public set dlc(value){
		this._dlc = value;
	}
	public get dlc():number{
		return parseFloat(this._json["dlc"]);
	}

	private _shanhuiid;
	public set shanhuiid(value){
		this._shanhuiid = value;
	}
	public get shanhuiid():string{
		if (this._json["shanhuiid"] == "*") { return ""; }
		return this._json["shanhuiid"];
	}

	private _weight;
	public set weight(value){
		this._weight = value;
	}
	public get weight():number{
		return parseFloat(this._json["weight"]);
	}

	private _tiaozhuan;
	public set tiaozhuan(value){
		this._tiaozhuan = value;
	}
	public get tiaozhuan():number{
		return parseFloat(this._json["tiaozhuan"]);
	}

	private _subtitle;
	public set subtitle(value){
		this._subtitle = value;
	}
	public get subtitle():number{
		return parseFloat(this._json["subtitle"]);
	}

	private _payTime;
	public set payTime(value){
		this._payTime = value;
	}
	public get payTime():number{
		return parseFloat(this._json["payTime"]);
	}

	private _haogandu;
	public set haogandu(value){
		this._haogandu = value;
	}
	public get haogandu():string{
		if (this._json["haogandu"] == "*") { return ""; }
		return this._json["haogandu"];
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

}