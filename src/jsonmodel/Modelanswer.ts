/**
 * LYJ.2017.11.1
 * @数据结构文件
 * 自动生成请勿修改；
 */
class Modelanswer extends ModelJsonBase {

    public constructor(json) {
        super(json);
    }

    private _qid;

    public get qid(): number {
        return parseFloat(this._json["qid"]);
    }

    public set qid(value) {
        this._qid = value;
    }

    private _chengjiuId;

    public get chengjiuId(): string {
        if (this._json["chengjiuId"] == "*") {
            return "";
        }
        return this._json["chengjiuId"];
    }

    public set chengjiuId(value) {
        this._chengjiuId = value;
    }

    private _ansid;

    public get ansid(): number {
        return parseFloat(this._json["ansid"]);
    }

    public set ansid(value) {
        this._ansid = value;
    }

    private _des;

    public get des(): string {
        if (this._json["des"] == "*") {
            return "";
        }
        return this._json["des"];
    }

    public set des(value) {
        this._des = value;
    }

    private _like;

    public get like(): string {
        if (this._json["like"] == "*") {
            return "";
        }
        return this._json["like"];
    }

    public set like(value) {
        this._like = value;
    }

    private _videos;

    public get videos(): string {
        if (this._json["videos"] == "*") {
            return "";
        }
        return this._json["videos"];
    }

    public set videos(value) {
        this._videos = value;
    }

    private _nextid;

    public get nextid(): number {
        return parseFloat(this._json["nextid"]);
    }

    public set nextid(value) {
        this._nextid = value;
    }

    private _isdie;

    public get isdie(): number {
        return parseFloat(this._json["isdie"]);
    }

    public set isdie(value) {
        this._isdie = value;
    }

    private _nextChapterId;

    public get nextChapterId(): number {
        return parseFloat(this._json["nextChapterId"]);
    }

    public set nextChapterId(value) {
        this._nextChapterId = value;
    }

    private _shanhuiid;

    public get shanhuiid(): string {
        if (this._json["shanhuiid"] == "*") {
            return "";
        }
        return this._json["shanhuiid"];
    }

    public set shanhuiid(value) {
        this._shanhuiid = value;
    }

}
