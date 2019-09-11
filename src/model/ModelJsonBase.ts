abstract class ModelJsonBase {
    public sortIdx: number;//排序用
    public currRank: number;//排名用
    protected _json: Object;
    private _attributes: number[];
    private _pid: number;//特殊ID
    private _attrEffect: number[];//属性效果
    private _shuxing: number[]; //添加的属性

    public constructor(json) {
        this._json = json;
    }

    public get id() {
        var _id = this._json["ID"] || this._json["id"] || this._json["Id"];
        return Tool.isNumber(_id) ? parseInt(_id) : _id;
    }

    //The end
}
