class TicketPanel extends eui.Component{
    private idTab1:eui.Button;
    private idTab2:eui.Button;
    private idTab3:eui.Button;
    private idClose:eui.Button;
    private idPage1:eui.Group;
    private idPage2:eui.Group;
    private idPage3:eui.Group;
    private idBuyTicketClose:eui.Button;
    private idShareTicketClose:eui.Button;
    private idGroupBuyTicket:eui.Group;
    private idGroupShareTicket:eui.Group;
    private idBtnBuyTicket:eui.Button;//购买
    private idBtnUseCode:eui.Button;
    private idBtnCopyCode:eui.Button;
    private idBtnShareCode:eui.Button;
    
    private idGroupDescCommon:eui.Group;//日常观礼描述
    private idGroupDescSpecial:eui.Group;//活动观礼描述

    private idCode:eui.Label;
    private idShareCode:eui.Label;

    private _selectIndex:number = 1;
    private _openParam:string;
    
    constructor(openParam){
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        this._openParam = openParam
        
    }
    protected onSkinName():void{
        this.skinName = skins.TicketSkin;
    }   
    
    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
    private onLoadComplete(){          
        for (let i=1;i<=3;i++){
            this["idTab"+i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTabClick, this);
        }
        
        this.idClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseClick, this);
        this.idBuyTicketClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseBuyTicketClick, this);
        this.idBtnBuyTicket.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnBuyTicketClick, this);
        
        this.idShareTicketClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idShareTicketCloseClick, this); 
        
        this.idBtnUseCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnUseCodeClick, this);
        this.idBtnCopyCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnCopyCodeClick, this);
        this.idBtnShareCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnShareCodeClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.updateTab();
        this.updateResize();

        this.idCode.text = "123456789"
        this.idShareCode.text="456789"   
        //从购物车按纽进来
        if (this._openParam == "tipsbtnshopcar")
            this.idGroupBuyTicket.visible = true;
    }
    private idBtnUseCodeClick(){

    }
    private idBtnCopyCodeClick(){
        var input = document.createElement("input");
        input.value =this.idCode.text;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length),
        document.execCommand('Copy');
        document.body.removeChild(input);
        GameCommon.getInstance().showCommomTips("已复制到剪贴板");
    }
    private idBtnShareCodeClick(){
        this.idGroupShareTicket.visible = true;
    }
    private onAddToStage(){
        this.onSkinName();
    }
    private updateTab(){
        for (let i=1;i<=3;i++){
            (this["idTab"+i] as eui.RadioButton).selected = this._selectIndex == i;
        }
        for (let i=1;i<=3;i++){
            this["idPage"+i].visible = this._selectIndex == i;
        }
    }
    private onCloseBuyTicketClick(event:egret.TouchEvent):void{        
        if (this._openParam == "tipsbtnshopcar") {
            this.onCloseClick();
            return;
        }            
        this.idGroupBuyTicket.visible = false;
    }
    private idShareTicketCloseClick(){
        this.idGroupShareTicket.visible = false;
    }
    private onBtnBuyTicketClick(event:egret.TouchEvent):void{
        console.log("buy");
    }
    private onCloseClick(event:egret.TouchEvent=null):void{ 
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'TicketPanel')
    }
    private onTabClick(event:egret.TouchEvent):void{
        SoundManager.getInstance().playSound("ope_click.mp3")
        this._selectIndex = Number(event.currentTarget.name);
        this.updateTab()
        if (this._selectIndex==2)
            this.idGroupBuyTicket.visible=true;
    }

}