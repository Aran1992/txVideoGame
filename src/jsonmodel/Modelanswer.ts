/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelanswer extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _qid;
	public set qid(value){
		this._qid = value;
	}
	public get qid():number{
		return parseFloat(this._json["qid"]);
	}

	private _chengjiuId;
	public set chengjiuId(value){
		this._chengjiuId = value;
	}
	public get chengjiuId():string{
		if (this._json["chengjiuId"] == "*") { return ""; }
		return this._json["chengjiuId"];
	}

	private _ansid;
	public set ansid(value){
		this._ansid = value;
	}
	public get ansid():number{
		return parseFloat(this._json["ansid"]);
	}

	private _des;
	public set des(value){
		this._des = value;
	}
	public get des():string{
		if (this._json["des"] == "*") { return ""; }
		return this._json["des"];
	}

	private _like;
	public set like(value){
		this._like = value;
	}
	public get like():string{
		if (this._json["like"] == "*") { return ""; }
		return this._json["like"];
	}

	private _videos;
	public set videos(value){
		this._videos = value;
	}
	public get videos():string{
		if (this._json["videos"] == "*") { return ""; }
		return this._json["videos"];
	}

	private _nextid;
	public set nextid(value){
		this._nextid = value;
	}
	public get nextid():number{
		return parseFloat(this._json["nextid"]);
	}

	private _isdie;
	public set isdie(value){
		this._isdie = value;
	}
	public get isdie():number{
		return parseFloat(this._json["isdie"]);
	}

	private _nextChapterId;
	public set nextChapterId(value){
		this._nextChapterId = value;
	}
	public get nextChapterId():number{
		return parseFloat(this._json["nextChapterId"]);
	}

	private _shanhuiid;
	public set shanhuiid(value){
		this._shanhuiid = value;
	}
	public get shanhuiid():string{
		if (this._json["shanhuiid"] == "*") { return ""; }
		return this._json["shanhuiid"];
	}

}