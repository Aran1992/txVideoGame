class AboutPanel extends eui.Component{
    private idTab1:eui.Button;
    private idTab2:eui.Button;
    private idTab3:eui.Button;
    private idClose:eui.Button;
    private idPage1:eui.Group;
    private idPage2:eui.Group;
    private idPage3:eui.Group;
    private qiuGroup:eui.Group;
    private slideGroup:eui.Group;

    private idScroller:eui.Scroller;
    private idViewPort:eui.Group;
    private idProtcalText:eui.Label

    private _selectIndex:number = 1;
    private _subSelectIndex:number = 1;
    private qiuImgs:eui.Image[];
    private showImgs:eui.Image[];
    private starPos: number = 0;
    private endPos: number = 0;
    private imgIndx: number = 1;
    private imgMaxNumb: number = 4;
    private _playTween: boolean;
    private _imageWidth:number =0;

    
    constructor(){
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        
    }
    protected onSkinName():void{
        this.skinName = skins.AboutSkin;
    }
    
    
    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
    private onLoadComplete(){          
        for (let i=1;i<=3;i++){
            this["idTab"+i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabClick, this);
        }
        
        this.qiuGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventSliderDown, this);
        this.qiuGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventSliderEnd, this);

        this.idClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.updateTab();
        this.updateResize();

        //this.idScroller.viewport = this.idViewPort;
        //this.idViewPort.setContentSize(this.idProtcalText.width,this.idProtcalText.height);
        //this.idViewPort.contentHeight = this.idProtcalText.height;
    }
    private onAddToStage(){
        this.onSkinName();
    }
    private updateTab(){
        for (let i=1;i<=3;i++){
            this["idTab"+i].enable = this._selectIndex != i;
            this["idTab"+i].currentState = this._selectIndex == i && "down" || "up"
    }
        for (let i=1;i<=3;i++){
            this["idPage"+i].visible = this._selectIndex == i;
        }
        if (this._selectIndex == 1){
            this.updateHelpPage()
        }
    }
    private onCloseClick(event:egret.TouchEvent):void{ 
        SoundManager.getInstance().playSound("ope_click.mp3")       
        //this.qiuGroup.removeChildren();
        //this.slideGroup.removeChildren();
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'AboutPanel')
    }
    private onTabClick(event:egret.TouchEvent):void{
        SoundManager.getInstance().playSound("ope_click.mp3")
        this._selectIndex = Number(event.currentTarget.name);
        this.updateTab()
    }
    private updateHelpPage(){        
        this.qiuImgs = [];
        this.showImgs=[];
        this.qiuGroup.removeChildren();
        this.slideGroup.removeChildren();
        this._imageWidth = 1068;

        for (let i=1;i<=this.imgMaxNumb;i++){
            let img:eui.Image = new eui.Image;
            if (i == this.imgIndx)
                img.source = 'cundang_dian1_png'
            else            
                img.source = 'cundang_dian2_png'
            this.qiuGroup.addChild(img);
            this.qiuImgs.push(img);

            let showimg:eui.Image = new eui.Image;
            showimg.source = `guide_${i}_jpg`;
            this.slideGroup.addChild(showimg);
        }
        this.slideGroup.x = -((this.imgIndx-1)*this._imageWidth);
    }
    private onLastImg() {
        if (this.imgIndx - 1 < 1)
            return;
        this.play(false);
    }

    private onNextImg() {
        if (this.imgIndx + 1 > this.imgMaxNumb)
            return;
        this.play(true);
    }
    private onEventSliderDown(event: egret.TouchEvent){        
        this.starPos = event.stageX;
    }
    private onEventSliderEnd(event: egret.TouchEvent){
        if (this.starPos > event.stageX) {
            if (this.starPos - event.stageX > 20) {
                this.onNextImg();
            }
        } else if (this.starPos < event.stageX) {
            if (event.stageX - this.starPos > 20) {
                this.onLastImg();
            }
        }
    }
    private play(bo):void{
        if(this._playTween)
            return;
        this._playTween = true;
        let currIndex:number = this.imgIndx;
        let self = this;
        let tweenEnd = function():void{
            self._playTween = false;
            egret.Tween.removeTweens(self.slideGroup);
        };
        this.imgIndx = bo && (this.imgIndx+1) || (this.imgIndx -1);        
        //console.log(this.imgIndx);
        egret.Tween.get(this.slideGroup)
        .to({x:-((this.imgIndx-1)*this._imageWidth)},150,egret.Ease.sineIn)
        .call(tweenEnd,this);
        this.qiuImgs[currIndex-1].source = 'cundang_dian2_png';
        this.qiuImgs[this.imgIndx-1].source = 'cundang_dian1_png';
    }

}