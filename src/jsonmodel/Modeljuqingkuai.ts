/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modeljuqingkuai extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _show;
	public set show(value){
		this._show = value;
	}
	public get show():number{
		return parseFloat(this._json["show"]);
	}

	private _scal;
	public set scal(value){
		this._scal = value;
	}
	public get scal():number{
		return parseFloat(this._json["scal"]);
	}

	private _wentiId;
	public set wentiId(value){
		this._wentiId = value;
	}
	public get wentiId():number{
		return parseFloat(this._json["wentiId"]);
	}

	private _videoId;
	public set videoId(value){
		this._videoId = value;
	}
	public get videoId():string{
		if (this._json["videoId"] == "*") { return ""; }
		return this._json["videoId"];
	}

	private _openVideo;
	public set openVideo(value){
		this._openVideo = value;
	}
	public get openVideo():string{
		if (this._json["openVideo"] == "*") { return ""; }
		return this._json["openVideo"];
	}

	private _lastKuai;
	public set lastKuai(value){
		this._lastKuai = value;
	}
	public get lastKuai():string{
		if (this._json["lastKuai"] == "*") { return ""; }
		return this._json["lastKuai"];
	}

	private _BE;
	public set BE(value){
		this._BE = value;
	}
	public get BE():number{
		return parseFloat(this._json["BE"]);
	}

}