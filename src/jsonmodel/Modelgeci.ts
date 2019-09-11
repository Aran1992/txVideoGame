/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelgeci extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _videoId;
	public set videoId(value){
		this._videoId = value;
	}
	public get videoId():string{
		if (this._json["videoId"] == "*") { return ""; }
		return this._json["videoId"];
	}

	private _start;
	public set start(value){
		this._start = value;
	}
	public get start():number{
		return parseFloat(this._json["start"]);
	}

	private _text;
	public set text(value){
		this._text = value;
	}
	public get text():string{
		if (this._json["text"] == "*") { return ""; }
		return this._json["text"];
	}

}