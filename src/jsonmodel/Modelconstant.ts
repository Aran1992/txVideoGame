/**
* LYJ.2017.11.1
* @数据结构文件
* 自动生成请勿修改；
*/
class Modelconstant extends ModelJsonBase {

	public constructor(json) { super(json); }

	private _value;
	public set value(value){
		this._value = value;
	}
	public get value():string{
		if (this._json["value"] == "*") { return ""; }
		return this._json["value"];
	}

}