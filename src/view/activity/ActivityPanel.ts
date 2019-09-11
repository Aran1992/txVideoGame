// TypeScript file
class ActivityPanel extends eui.Component {
    private mainGroup:eui.Group;
    private bgBtn:eui.Group;
    private goodsLayer: eui.Group;
    private scroll: eui.Scroller;
    constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }
    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE,this.updateResize,this);
        for(var k:number = 0;k<4;k++)
        {   
             this['tabBtn'+k].name = k;
             this['tabBtn'+k].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeTab, this);
        }
        
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }
    protected onRemove(): void {
        for(var k:number = 0;k<4;k++)
        {   
             this['tabBtn'+k].name = k;
             this['tabBtn'+k].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeTab, this);
        }
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    }
    private onClose(){
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW),'ActivityPanel')
    }
    private updateResize(){
        this.width = size.width;
        this.height = size.height;
        // this.mainGroup.scaleX = GameDefine.SCALENUMX;
        // this.mainGroup.scaleY = GameDefine.SCALENUMY;
    }
    private tabIdx:number = 0;
    private onChangeTab(event: egret.Event){
        var index: number = Number(event.target.name);
        if (this.tabIdx == index)
			return;
        this.tabIdx = index;
		this.showGoods(this.tabIdx);
    }
     private showGoods(index) {
        this.tabIdx = index;
        for(var i:number = 0;i<4;i++)
        {   
            if(i==this.tabIdx)
            {
                this['tabBtn'+i]['labelDisplay'].textColor="0x384374";
                this['tabBtn'+i].icon = 'cj_biaoqian1_png';
            }
            else
            {
                this['tabBtn'+i]['labelDisplay'].textColor="0xFFFFFF";
                this['tabBtn'+i].icon = '';
            }
        }
    }
    private onLoadComplete(): void {
        this.touchEnabled = false;
        this.onInit();
        this.onRegist();
        this.updateResize();
    }
    //供子类覆盖
    protected onInit(): void {
        for(var i:number = 0;i<4;i++)
        {   
            if(i==this.tabIdx)
            {
                this['tabBtn'+i]['labelDisplay'].textColor="0x384374";
                this['tabBtn'+i].icon = 'cj_biaoqian1_png';
            }
            else
            {
                this['tabBtn'+i]['labelDisplay'].textColor="0xFFFFFF";
                this['tabBtn'+i].icon = '';
            }
        }
        this.showGoods(1);
    }
    protected onSkinName(): void {
        this.skinName = skins.ActivitySkin;
    }
}
