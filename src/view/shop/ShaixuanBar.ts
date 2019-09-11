class ShaixuanBar extends eui.Component {
    public shaixuan_btns_grp: eui.Group;
    public check_has_btn: eui.ToggleSwitch;
    public reset_btn: eui.Button;
    public sure_btn: eui.Button;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private _shaixuanParam: ShaixuanDataParam;
    private _shaixuanTitles;
    private _shaixuanTpDict;
    private _shaixuanItems: eui.Component[];
    private check_datas;

    public constructor(shaixuanParam: ShaixuanDataParam) {
        super();
        this._shaixuanParam = shaixuanParam;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onLoadComplete(): void {
        this.onRegistEvent();
        this.onInitTabbtns();
        this.onShaixuan();
        this.onShowEffect();
    }

    private onShowEffect(): void {
        this.height = size.height;
        this.x = size.width;
        var viewTween: egret.Tween = egret.Tween.get(this);
        viewTween.to({x: size.width - this.width + 2}, 500, egret.Ease.backIn);
        viewTween.call(function (): void {
            viewTween = null;
            egret.Tween.removeTweens(this)
        }, this);
    }

    private onAddToStage(): void {
        this.skinName = skins.ShaixuanBarSkin;
    }

    private onRegistEvent(): void {
        this.reset_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReset, this);
        this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
    }

    private onRemoveEvent(): void {
        this.reset_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReset, this);
        this.sure_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSure, this);
        this.shaixuan_btns_grp.removeChildren();
        this._shaixuanTitles = null;
        this._shaixuanTpDict = null;
        this._shaixuanItems = null;
    }

    private onInitTabbtns(): void {
        this._shaixuanTpDict = {};
        this._shaixuanTitles = {};
        this._shaixuanItems = [];
        /**"type=武器,value=刀#type=武器,value=剑"**/
        for (let idx in this._shaixuanParam.models) {
            let model = this._shaixuanParam.models[idx];
            let shaixuan_param: string = model['shaixuan_params'];
            if (!shaixuan_param) continue;
            let params: string[] = shaixuan_param.split("#");
            for (let i: number = 0; i < params.length; i++) {
                let shaixuanItem: string[] = params[i].split(',');
                let shaixuan_tp: string = shaixuanItem[0];
                let shaixuan_val: string = shaixuanItem[1];
                /**按鈕分類**/
                if (!this._shaixuanTitles[shaixuan_tp]) this._shaixuanTitles[shaixuan_tp] = [];
                let conditions: string[] = this._shaixuanTitles[shaixuan_tp];
                if (conditions.indexOf(shaixuan_val) == -1) {
                    conditions.push(shaixuan_val);
                }
                /**分類内容**/
                let _datas;
                if (!this._shaixuanTpDict[shaixuan_tp]) this._shaixuanTpDict[shaixuan_tp] = [];
                _datas = this._shaixuanTpDict[shaixuan_tp];
                if (_datas.indexOf(model) == -1) {
                    _datas.push(model);
                }
                if (!this._shaixuanTpDict[shaixuan_val]) this._shaixuanTpDict[shaixuan_val] = [];
                _datas = this._shaixuanTpDict[shaixuan_val];
                if (_datas.indexOf(model) == -1) {
                    _datas.push(model);
                }
            }
        }
        let index: number = 0;
        for (let keyName in this._shaixuanTitles) {
            let condition_item: eui.Component = new eui.Component();
            condition_item.skinName = skins.ShaixuanItemSkin;
            this.shaixuan_btns_grp.addChild(condition_item);
            condition_item['title_lab'].text = keyName;
            let condition_ary: string[] = this._shaixuanTitles[keyName];
            if (condition_ary.length <= 1) continue;
            let tabbutton: eui.RadioButton = new eui.RadioButton();
            tabbutton.skinName = skins.Common_TabButtonSkin2;
            tabbutton.label = "全部";
            tabbutton.value = keyName;
            tabbutton.groupName = "tab_grp" + index;
            tabbutton.selected = true;
            tabbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShaixuan, this);
            condition_item['buttons_grp'].addChild(tabbutton);
            for (let i: number = 0; i < condition_ary.length; i++) {
                let cond_name: string = condition_ary[i];
                tabbutton = new eui.RadioButton();
                tabbutton.skinName = skins.Common_TabButtonSkin2;
                tabbutton.label = cond_name;
                tabbutton.value = cond_name;
                tabbutton.groupName = "tab_grp" + index;
                tabbutton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShaixuan, this);
                condition_item['buttons_grp'].addChild(tabbutton);
            }
            this._shaixuanItems.push(condition_item);
            index++;
        }
    }

    private onShaixuan(): void {
        this.check_datas = [];
        let _length: number = 0;
        var curDataAry = [];
        var lastData = [];
        for (let i: number = 0; i < this._shaixuanItems.length; i++) {
            let item: eui.Component = this._shaixuanItems[i];
            let btnsGrp: eui.Group = item['buttons_grp'];
            this.check_datas = curDataAry;
            for (let n: number = 0; n < btnsGrp.numChildren; n++) {
                let tabbtn: eui.RadioButton = btnsGrp.getChildAt(n) as eui.RadioButton;
                if (tabbtn.selected) {
                    let dataAry = this._shaixuanTpDict[tabbtn.value];

                    curDataAry = [];
                    for (let arykey in dataAry) {
                        let data = dataAry[arykey];
                        if (this.check_datas.indexOf(data) == -1) {
                            this.check_datas.push(data);
                            // _length++;
                        }
                        if (this.check_datas.indexOf(data) > -1) {
                            if (lastData.length > 0) {
                                let have: boolean = false;
                                for (var j: number = 0; j < lastData.length; j++) {
                                    for (var h: number = 0; h < this._shaixuanTpDict[lastData[j]].length; h++) {
                                        if (this._shaixuanTpDict[lastData[j]][h] == data) {
                                            have = true;
                                        }
                                    }
                                }
                                if (!have) {
                                    var index = curDataAry.indexOf(data);
                                    if (index > -1) {
                                        curDataAry.splice(index, 1);
                                    }
                                } else {
                                    var index = curDataAry.indexOf(data);
                                    if (index == -1) {
                                        curDataAry.push(data);
                                    }
                                }
                            } else {
                                curDataAry.push(data);
                            }

                        }
                    }
                    lastData.push(tabbtn.value);
                    break;
                }
            }
        }
        this.check_datas = curDataAry;
        _length = curDataAry.length;
        this.sure_btn.label = `确认(${_length})`;
    }

    private onReset(): void {
        for (let i: number = 0; i < this._shaixuanItems.length; i++) {
            let item: eui.Component = this._shaixuanItems[i];
            let btnsGrp: eui.Group = item['buttons_grp'];
            if (btnsGrp.numChildren > 0) {
                let tabbtn: eui.RadioButton = btnsGrp.getChildAt(0) as eui.RadioButton;
                tabbtn.selected = true;
            }
        }
        this.onShaixuan();
    }

    private onSure(): void {
        if (this._shaixuanParam) {
            Tool.callback(this._shaixuanParam.callback, this._shaixuanParam.callObj, this.check_datas);
        }
        this.onClose();
    }

    private onClose() {
        this.onRemoveEvent();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShaixuanBar');
    }

    //The end
}

/* *
 * 筛选参数
 * */
class ShaixuanDataParam {
    public models;
    public callback;
    public callObj;

    public constructor(datas, callback, callObj) {
        this.models = datas;
        this.callback = callback;
        this.callObj = callObj;
    }
}
