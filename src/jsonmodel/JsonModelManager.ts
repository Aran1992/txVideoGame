/**
* LYJ.2017.11.1
* @数据结构存储管理类
* 注：自动生成请勿修改；
*     配置ID自动为Key值，否则按照数组索引当Key
*     如果需要二级嵌套结构如二维数组，请策划配置上groupID字段
*/
class JsonModelManager {
	private static _instance: JsonModelManager;

	public constructor() { }

	public static get instance(): JsonModelManager {
		if (this._instance == null) {
			this._instance = new JsonModelManager();
		}
		return this._instance;
	}

	public Length = {};

	private _modelanswerDict;
	public getModelanswer(): any {
		if (!this._modelanswerDict) {
			this._modelanswerDict = {};
			var json = Tool.readZipToJson("answer.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["answer"];
			this.Length["answer"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelanswer = new Modelanswer(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelanswerDict[model[groupID]]) {
                        this._modelanswerDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelanswerDict[model[groupID]][_dictKey] = model;
					this.Length['answer'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelanswerDict[_dictKey] = model;
                    _Idx++;
					this.Length['answer'] = _Idx;
                }
            }
        }
        return this._modelanswerDict;
    }

	private _modelchapterDict;
	public getModelchapter(): any {
		if (!this._modelchapterDict) {
			this._modelchapterDict = {};
			var json = Tool.readZipToJson("chapter.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["chapter"];
			this.Length["chapter"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelchapter = new Modelchapter(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelchapterDict[model[groupID]]) {
                        this._modelchapterDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelchapterDict[model[groupID]][_dictKey] = model;
					this.Length['chapter'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelchapterDict[_dictKey] = model;
                    _Idx++;
					this.Length['chapter'] = _Idx;
                }
            }
        }
        return this._modelchapterDict;
    }

	private _modelchengjiuDict;
	public getModelchengjiu(): any {
		if (!this._modelchengjiuDict) {
			this._modelchengjiuDict = {};
			var json = Tool.readZipToJson("chengjiu.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["chengjiu"];
			this.Length["chengjiu"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelchengjiu = new Modelchengjiu(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelchengjiuDict[model[groupID]]) {
                        this._modelchengjiuDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelchengjiuDict[model[groupID]][_dictKey] = model;
					this.Length['chengjiu'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelchengjiuDict[_dictKey] = model;
                    _Idx++;
					this.Length['chengjiu'] = _Idx;
                }
            }
        }
        return this._modelchengjiuDict;
    }

	private _modelconstantDict;
	public getModelconstant(): any {
		if (!this._modelconstantDict) {
			this._modelconstantDict = {};
			var json = Tool.readZipToJson("constant.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["constant"];
			this.Length["constant"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelconstant = new Modelconstant(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelconstantDict[model[groupID]]) {
                        this._modelconstantDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelconstantDict[model[groupID]][_dictKey] = model;
					this.Length['constant'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelconstantDict[_dictKey] = model;
                    _Idx++;
					this.Length['constant'] = _Idx;
                }
            }
        }
        return this._modelconstantDict;
    }

	private _modelgeciDict;
	public getModelgeci(): any {
		if (!this._modelgeciDict) {
			this._modelgeciDict = {};
			var json = Tool.readZipToJson("geci.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["geci"];
			this.Length["geci"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelgeci = new Modelgeci(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelgeciDict[model[groupID]]) {
                        this._modelgeciDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelgeciDict[model[groupID]][_dictKey] = model;
					this.Length['geci'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelgeciDict[_dictKey] = model;
                    _Idx++;
					this.Length['geci'] = _Idx;
                }
            }
        }
        return this._modelgeciDict;
    }

	private _modelhudongDict;
	public getModelhudong(): any {
		if (!this._modelhudongDict) {
			this._modelhudongDict = {};
			var json = Tool.readZipToJson("hudong.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["hudong"];
			this.Length["hudong"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelhudong = new Modelhudong(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelhudongDict[model[groupID]]) {
                        this._modelhudongDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelhudongDict[model[groupID]][_dictKey] = model;
					this.Length['hudong'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelhudongDict[_dictKey] = model;
                    _Idx++;
					this.Length['hudong'] = _Idx;
                }
            }
        }
        return this._modelhudongDict;
    }

	private _modeljuqingkuaiDict;
	public getModeljuqingkuai(): any {
		if (!this._modeljuqingkuaiDict) {
			this._modeljuqingkuaiDict = {};
			var json = Tool.readZipToJson("juqingkuai.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["juqingkuai"];
			this.Length["juqingkuai"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modeljuqingkuai = new Modeljuqingkuai(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modeljuqingkuaiDict[model[groupID]]) {
                        this._modeljuqingkuaiDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modeljuqingkuaiDict[model[groupID]][_dictKey] = model;
					this.Length['juqingkuai'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modeljuqingkuaiDict[_dictKey] = model;
                    _Idx++;
					this.Length['juqingkuai'] = _Idx;
                }
            }
        }
        return this._modeljuqingkuaiDict;
    }

	private _modelshipinDict;
	public getModelshipin(): any {
		if (!this._modelshipinDict) {
			this._modelshipinDict = {};
			var json = Tool.readZipToJson("shipin.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["shipin"];
			this.Length["shipin"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelshipin = new Modelshipin(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelshipinDict[model[groupID]]) {
                        this._modelshipinDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelshipinDict[model[groupID]][_dictKey] = model;
					this.Length['shipin'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelshipinDict[_dictKey] = model;
                    _Idx++;
					this.Length['shipin'] = _Idx;
                }
            }
        }
        return this._modelshipinDict;
    }

	private _modelshopDict;
	public getModelshop(): any {
		if (!this._modelshopDict) {
			this._modelshopDict = {};
			var json = Tool.readZipToJson("shop.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["shop"];
			this.Length["shop"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelshop = new Modelshop(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelshopDict[model[groupID]]) {
                        this._modelshopDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelshopDict[model[groupID]][_dictKey] = model;
					this.Length['shop'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelshopDict[_dictKey] = model;
                    _Idx++;
					this.Length['shop'] = _Idx;
                }
            }
        }
        return this._modelshopDict;
    }

	private _modelshoucangDict;
	public getModelshoucang(): any {
		if (!this._modelshoucangDict) {
			this._modelshoucangDict = {};
			var json = Tool.readZipToJson("shoucang.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["shoucang"];
			this.Length["shoucang"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelshoucang = new Modelshoucang(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelshoucangDict[model[groupID]]) {
                        this._modelshoucangDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelshoucangDict[model[groupID]][_dictKey] = model;
					this.Length['shoucang'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelshoucangDict[_dictKey] = model;
                    _Idx++;
					this.Length['shoucang'] = _Idx;
                }
            }
        }
        return this._modelshoucangDict;
    }

	private _modelwentiDict;
	public getModelwenti(): any {
		if (!this._modelwentiDict) {
			this._modelwentiDict = {};
			var json = Tool.readZipToJson("wenti.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["wenti"];
			this.Length["wenti"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelwenti = new Modelwenti(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelwentiDict[model[groupID]]) {
                        this._modelwentiDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelwentiDict[model[groupID]][_dictKey] = model;
					this.Length['wenti'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelwentiDict[_dictKey] = model;
                    _Idx++;
					this.Length['wenti'] = _Idx;
                }
            }
        }
        return this._modelwentiDict;
    }

	private _modelyindaoDict;
	public getModelyindao(): any {
		if (!this._modelyindaoDict) {
			this._modelyindaoDict = {};
			var json = Tool.readZipToJson("yindao.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["yindao"];
			this.Length["yindao"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelyindao = new Modelyindao(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelyindaoDict[model[groupID]]) {
                        this._modelyindaoDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelyindaoDict[model[groupID]][_dictKey] = model;
					this.Length['yindao'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelyindaoDict[_dictKey] = model;
                    _Idx++;
					this.Length['yindao'] = _Idx;
                }
            }
        }
        return this._modelyindaoDict;
    }

	private _modelzimuDict;
	public getModelzimu(): any {
		if (!this._modelzimuDict) {
			this._modelzimuDict = {};
			var json = Tool.readZipToJson("zimu.json");
			var groupID:string = ModelManager.getInstance().JOSN_GID["zimu"];
			this.Length["zimu"] = groupID ? {} : 0;
			var _dictKey;
            var _Idx: number = 0;
			for (var key in json) {
                var model: Modelzimu = new Modelzimu(json[key]);
                if (groupID != "ID" && groupID != "Id" && groupID != "id") {
                    _dictKey = model.id;
                } else {
                    _dictKey = null;
                }
                if (groupID && model[groupID] != null) {
                    if (!this._modelzimuDict[model[groupID]]) {
                        this._modelzimuDict[model[groupID]] = {};
						_Idx = 0;
                    }
					_dictKey = _dictKey ? _dictKey : _Idx;
					_Idx++;
                    this._modelzimuDict[model[groupID]][_dictKey] = model;
					this.Length['zimu'][_dictKey] = _Idx;
                } else {
					_dictKey = _dictKey ? _dictKey : _Idx;
                    this._modelzimuDict[_dictKey] = model;
                    _Idx++;
					this.Length['zimu'] = _Idx;
                }
            }
        }
        return this._modelzimuDict;
    }

}