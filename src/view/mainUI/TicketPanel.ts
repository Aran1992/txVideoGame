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
    private idBtnUseCode:eui.Button;
    private idBtnCopyCode:eui.Button;
    private idBtnShareCode:eui.Button;
    private idBtnBuyNow:eui.Button;

    private idEditText:eui.EditableText;
    
    private idGroupDescCommon:eui.Group;//日常观礼描述
    private idGroupDescSpecial:eui.Group;//活动观礼描述

    private idBtnBuyTicketOriPrize:eui.Button;
    private idBtnBuyTicketSpecailPrize:eui.Button;

    private idCode:eui.Label;
    private idNoCode:eui.Label;
    private idShareCode:eui.Label;

    private _selectIndex:number = 1;
    private _openParam:string;

    private bSpecail:boolean = false;
    
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
        this.idBtnBuyTicketSpecailPrize.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyTicketSpecailPrizeClick, this);
        this.idBtnBuyTicketOriPrize.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyTicketOriPrizeClick, this);
        this.idBtnBuyNow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnBuyNowClick, this);
        
        this.idShareTicketClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idShareTicketCloseClick, this); 
        
        this.idBtnUseCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnUseCodeClick, this);
        this.idBtnCopyCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnCopyCodeClick, this);
        this.idBtnShareCode.addEventListener(egret.TouchEvent.TOUCH_TAP, this.idBtnShareCodeClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.BUY_REFRESH, this.onBuy600001Complte, this);
        this.updateTab();
        this.updateResize();

        this.idCode.text = "123456789"
        this.idShareCode.text="456789"
        //从购物车按纽进来
        this.idGroupShareTicket.visible = false;
        this.idGroupBuyTicket.visible = false;
        if (this._openParam == "tipsbtnshopcar" || this._openParam == "confirm")
            this.idGroupBuyTicket.visible = true;

        let today = Tool.formatTimeDay2Num();
        let cfg = JsonModelManager.instance.getModelshop()[GameDefine.GUANGLIPINGZHENG];
        let discountDay = Number(cfg.params);
        this.bSpecail = today <= discountDay;//是否在优惠期间
        this.idGroupDescCommon.visible = !this.bSpecail;
        this.idGroupDescSpecial.visible = this.bSpecail;

        // callbackSendRequest=function(data){
        //     console.log(data);
        // }

        this.idCode.visible = false;
        this.idNoCode.visible = true;
        this.idBtnCopyCode.visible = false;
        this.idBtnShareCode.visible = false;
        var params = {"bookId":GameDefine.BOOKID,"cmd":"getMyCDKey","saleId":GameDefine.GUANGLIPINGZHENG}
        window['sendRequest'](params,(data)=>{
            //有而且第一个可用。
            if (data.code == 0 && data.data.list.length>0 && data.data.list[0].isValid == 1){
                let item = data.data.list[0];
                let cdk = item.CDKey;
                let valid = item.isValid; //1或者0，1 是可用
                this.idCode.text = cdk;
                this.idCode.visible = true;
                this.idNoCode.visible = false;
                this.idShareCode.text=cdk
                this.idBtnCopyCode.visible = true;
                this.idBtnShareCode.visible = true;
            }else{                
                this.idCode.visible = false;
                this.idNoCode.visible = true;
                this.idBtnCopyCode.visible = false;
                this.idBtnShareCode.visible = false;
            }
            //console.log(data)
        });
    }
    private idBtnBuyNowClick(){
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.idGroupBuyTicket.visible=true;
    }
    private onBuy600001Complte(){
        if (this._openParam == "confirm")//从弹窗进来的。购买成功后需要继续播放视频
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CONTINUE));
        this.onCloseClick();
    }
    private idBtnUseCodeClick(){        
        SoundManager.getInstance().playSound("ope_click.mp3")
        let code = this.idEditText.text;
        var params = {"bookId":GameDefine.BOOKID,"cmd":"exchangeCDKey","CDKey":code}    
        window['sendRequest'](params,(data)=>{
            if(data.code == 0){
                GameCommon.getInstance().showCommomTips("激活成功,恭喜您已获得观礼资格！");
                console.log(data);
            }
        })
    }
    private idBtnCopyCodeClick(){
        SoundManager.getInstance().playSound("ope_click.mp3")
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
        
        let render = new egret.RenderTexture();
        render.drawToTexture(this.idGroupShareTicket);//rootLayer是当前显示层的总容器，或者用this.stage
        this.idGroupShareTicket.visible = false
        let base64Str = render.toDataURL("image/png");
        
        platform.shareImage(GameDefine.BOOKID, base64Str);
        //render.saveToFile("image/png", "aa.png");//也可以保存下来

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
        SoundManager.getInstance().playSound("ope_click.mp3") 
        if (this._openParam == "tipsbtnshopcar" || this._openParam == "confirm") {
            this.onCloseClick();
            return;
        }            
        this.idGroupBuyTicket.visible = false;
    }
    private idShareTicketCloseClick(){
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.idGroupShareTicket.visible = false;
    }
    private idBtnBuyTicketOriPrizeClick(event:egret.TouchEvent):void{
        this.idBtnBuyTicketSpecailPrizeClick(event);
    }
    private idBtnBuyTicketSpecailPrizeClick(event:egret.TouchEvent):void{
        SoundManager.getInstance().playSound("ope_click.mp3")
        let item: ShopInfoData = ShopManager.getInstance().getShopInfoData(GameDefine.GUANGLIPINGZHENG);
        if(item.num>0){
            GameCommon.getInstance().showCommomTips("已购买");
            //return;
        }
        ShopManager.getInstance().buyGoods(GameDefine.GUANGLIPINGZHENG);
    }
    private onCloseClick(event:egret.TouchEvent=null):void{ 
        SoundManager.getInstance().playSound("ope_click.mp3")
        GameDispatcher.getInstance().removeEventListener(GameEvent.BUY_REFRESH, this.onBuy600001Complte, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'TicketPanel')
          
        if (this._openParam == "tipsbtnshopcar" || this._openParam == "tipsbtnticket") {            
            VideoManager.getInstance().videoResume();
        }
    }
    private onTabClick(event:egret.TouchEvent):void{
        SoundManager.getInstance().playSound("ope_click.mp3")
        this._selectIndex = Number(event.currentTarget.name);
        this.updateTab()
    }
}