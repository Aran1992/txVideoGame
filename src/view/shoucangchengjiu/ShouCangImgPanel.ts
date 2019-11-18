// TypeScript file
class ShouCangImgPanel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private btnNextImg: eui.Button;
    private btnLastImg: eui.Button;
    private imgGroup: eui.Group;
    private img0Group: eui.Group;
    private yindaoGroup: eui.Group;
    private left_jiantou: eui.Image;
    private right_jiantou: eui.Image;
    private yindaoGroup1: eui.Group;
    private btnSetXinDong: eui.Button;
    private playSound: eui.Button;
    private datu: eui.Image;
    private info: Modelshoucang;
    private btnShare: eui.Button;
    private moveUp: boolean;
    private start_posX: number;
    private starPos: number = 0;
    private endPos: number = 0;
    private isOne: boolean = false;
    private animRecords: SCImageData[];
    private _imgIndx: number = 0;
    private imgMaxNumb: number = 5;
    private curImg;
    private imgSound: string[] = [];
    private imgInfoJson:JSON;

    private get imgIndx(){
        return this._imgIndx;
    }
    private set imgIndx(m){
        this._imgIndx =m;
    }

    constructor(data) {
        super();
        this.info = data;
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        // this.btnNextImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextImg, this);
        // this.btnLastImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLastImg, this);
        this.btnSetXinDong.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetXinDong, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.imgGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.imgGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.datu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseDaTu, this);
        this.playSound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlaySound, this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
    }

    protected onRemove(): void {
        // this.btnNextImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextImg, this);
        // this.btnLastImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onLastImg, this);
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnSetXinDong.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetXinDong, this);
        this.imgGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.imgGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.datu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseDaTu, this);
        this.playSound.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlaySound, this);
        this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
    }

    //供子类覆盖
    protected onInit(): void {
        this.onInitImg();
        for (var i = 0; i < this.imgMaxNumb; i++) {
            this['xindong' + i].visible = false;
            if (UserInfo.main_Img == this['img' + i].source) {
                this['xindong' + i].visible = true;
            }
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.ShouCangImgSkin;
    }

    //添加到舞台
    private onAddToStage(): void {
        this.onSkinName();
    }

    private onSetXinDong() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        for (var i = 0; i < this.imgMaxNumb; i++) {
            this['xindong' + i].visible = false;
        }
        let idx = this.imgIndx + 1;
        if (idx > 4) {
            idx = 0;
        }
        this['xindong' + idx].visible = true;
        UserInfo.main_Img = this['img' + idx].source;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAIN_IMG_REFRESH));
        if (UserInfo.curBokData)
            UserInfo.curBokData.main_Img = UserInfo.main_Img;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
    }

    private onFrame() {
        if (!this.moveUp) {
            this.right_jiantou.x += 2;
            this.left_jiantou.x -= 2;
            if (this.left_jiantou.x < this.start_posX) {
                this.moveUp = true;
            }
        } else {
            this.right_jiantou.x -= 2;
            this.left_jiantou.x += 2;
            if (this.left_jiantou.x > this.start_posX + 20) {
                this.moveUp = false;
            }
        }
    }

    private onInitImg() {
        this.animRecords = [];
        var _record: SCImageData;
        var img: eui.Group;
        for (var i = 0; i < this.imgMaxNumb; i++) {
            img = (this[`img${i}Group`] as eui.Group);
            _record = new SCImageData(img.x, img.y, img.scaleX, img.width, img.height, img.parent.getChildIndex(img));
            img.name = i + '';
            this.animRecords.push(_record);
        }
        this.imgIndx = 0;
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3")
        this.onRemove();
        // if (!UserInfo.guideDic[7])//关闭引导图片
        // {
        //     GuideManager.getInstance().onCloseImg();
        // }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangImgPanel')
    }

    private onNextMp3() {

    }

    private onEventDown(event: egret.TouchEvent) {
        this.starPos = event.stageX;
    }

    private onEventEnd(event: egret.TouchEvent) {
        if (this.yindaoGroup.visible) {
            this.imgGroup.touchEnabled = false;
            this.imgGroup.touchChildren = false;
            this.yindaoGroup.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
            this.yindaoGroup.visible = false;
            this.yindaoGroup1.visible = true;
            GuideManager.getInstance().onShowImg(this.mainGroup, this.bgBtn, 'leftClose');
            return;
        }
        if (this.starPos == event.stageX && this.curImg) {
            this.datu.source = this.curImg.source;
            if (this.curImg.width != size.width) {
                this.datu.visible = true;
                var tw = egret.Tween.get(this.datu);
                let scaleX = size.width / GameDefine.GAME_VIEW_WIDTH;
                let scaleY = size.height / GameDefine.GAME_VIEW_HEIGHT;
                let scale = scaleX > scaleY ? scaleX : scaleY;
                tw.to({width: GameDefine.GAME_VIEW_WIDTH * scale, height: GameDefine.GAME_VIEW_HEIGHT * scale}, 100);
                return;
            }

        }
        if (this.starPos > event.stageX) {
            if (this.starPos - event.stageX > 30) {
                // if (this.isOne) {
                //     this.imgIndx = 2;
                //     // this.onLastImg();
                //     this.isOne = false;
                // }
                this.onNextImg();
            }
        } else if (this.starPos < event.stageX) {
            if (event.stageX - this.starPos > 30) {
                //  if (this.isOne) {
                //     this.imgIndx = 2;
                //     this.isOne = false;
                // }
                this.onLastImg();

            }
        }
        this.curImg = null;
    }

    private onCloseDaTu() {
        var tw = egret.Tween.get(this.datu);
        tw.to({width: 1006, height: 537}, 100);
        tw.to({visible: false}, 10);
        this.curImg = null;
    }

    private onPlaySound() {
        let idx = this.imgIndx;
        SoundManager.getInstance().stopMusicAll();
        if (idx + 1 >= this.imgMaxNumb)
            idx = 0;
        else
            idx = idx + 1;
        if (this.imgSound[idx]) {
            SoundManager.getInstance().playSound(this.imgSound[idx],null,true);// + '.mp3');
        }
    }

    private onNextImg() {
        if (this.imgIndx + 1 >= this.imgMaxNumb)
            this.imgIndx = 0;
        else
            this.imgIndx = this.imgIndx + 1;
        let idx = this.imgIndx;
        SoundManager.getInstance().stopMusicAll();
        if (idx + 1 >= this.imgMaxNumb)
            idx = 0;
        else
            idx = idx + 1;
        if (this.imgSound[idx]) {
            SoundManager.getInstance().playSound(this.imgSound[idx],null,true);// + '.mp3');
        }
        this.play();
    }

    private onClickImg(event: egret.Event) {
        this.curImg = event.currentTarget;
    }

    private onTouchQuXiao(event: egret.Event) {
        for (var i = 0; i < this.imgMaxNumb; i++) {
            this['xindong' + i].visible = false;
        }
        this['xindong' + this.imgIndx].visible = true;
        UserInfo.main_Img = this['img' + (this.imgIndx - 1)].source;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAIN_IMG_REFRESH));
        if (UserInfo.curBokData)
            UserInfo.curBokData.main_Img = UserInfo.main_Img;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
        // UserInfo.main_Img = id;
        // if (!UserInfo.guideDic[7])//关闭引导图片
        // {
        //     this.imgIndx = 0;


        //     this['quxiaoImg0'].touchEnabled = false;
        //     this['quxiaoImg1'].touchEnabled = false;
        //     this['quxiaoImg2'].touchEnabled = false;
        //     this.bgBtn.touchEnabled = true;
        //     GuideManager.getInstance().onCloseImg();
        //     this.left_jiantou.x = 490;
        //     this.start_posX = 470;
        //     this.right_jiantou.x = this.width - 490;
        //     this.shezhilab.visible = false;
        //     this.yindaoGroup.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
        //     this.yindaoGroup.visible = true;
        // }

    }

    private onCloseImgGroup(): void {
        this.imgGroup.visible = false;
    }

    private onShowImgGroup(): void {
        this.imgGroup.visible = true;
    }

    private play(): void {
        let currIndex: number = this.imgIndx;
        let offset: number = 1;
        let recordInfo: SCImageData;
        let param = this.imgMaxNumb + currIndex;
        let infySlot: eui.Group;
        for (let j = currIndex; j < param; j++) {
            infySlot = (this[`img${j >= this.imgMaxNumb ? j - this.imgMaxNumb : j}Group`] as eui.Group);
            infySlot.name = (j - currIndex - offset >= 0 ? j - currIndex - offset : this.imgMaxNumb - offset - (j - currIndex)) + '';
            recordInfo = this.animRecords[Number(infySlot.name)];
            egret.Tween.get(infySlot).to({}, 100).to({
                x: recordInfo.posX,
                scaleX: recordInfo.scale,
                scaleY: recordInfo.scale,
                y: recordInfo.posY,
                width: recordInfo.width,
                height: recordInfo.height
            }, 150, egret.Ease.sineIn);//.call(this.playDone, this);
            infySlot.parent.setChildIndex(infySlot, recordInfo.childNum);
            // this[`xindong${j >= this.imgMaxNumb ? j - this.imgMaxNumb : j}`].visible = false;
        }
        // this['xindong' + (param-currIndex-1)].visible = true;
    }

    private onLastImg() {
        if (this.imgIndx - 1 < 0)
            this.imgIndx = 4;
        else
            this.imgIndx = this.imgIndx - 1;
        this.play();
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }
    private getImgArray(){
        var imgs: string[]=[];
        let count = Math.min(this.imgMaxNumb,Number(this.info.src));
        for (let i=1;i<=count;i++){
            imgs.push(this.info.id+"_"+String(i)+"_jpg");
        }
        return imgs;
        // if (this.info.src.indexOf(";") >= 0) {
        //     imgs = this.info.src.split(";");
        //     for(let i=1;i<=imgs.length;i++){
        //         imgs[i-1]=this.info.id+"_"+String(i)+"_jpg";
        //     }
        // }
    }
    private onLoadComplete(): void {
        this.updateResize();
        this.touchEnabled = false;
        var num = this.width / 2 - this[`img${0}Group`].width / 2;
        var num1 = this[`img${0}Group`].width;
        this.isOne = true;
        // UserInfo.guideDic[7] = 7;

        var imgs: string[]=this.getImgArray();
        // if (this.info.src.indexOf(";") >= 0) {
        //     imgs = this.info.src.split(";");
        //     for(let i=1;i<=imgs.length;i++){
        //         imgs[i-1]=this.info.id+"_"+String(i)+"_jpg";
        //     }
        // }
        var miaoshus: string[];
        //if (this.info.kuozhan.indexOf(";") >= 0) {
            miaoshus = this.info.kuozhan.split(";");
        //}

        for (let j = 0; j < imgs.length; j++) {
            this[`xindong${j}`].visible = false;
            switch (j) {
                case 0:
                    this[`img${j}Group`].x = num;
                    this[`img${j}Group`].scaleX = 1;
                    this[`img${j}Group`].scaleY = 1;
                    // this[`xindong${j}`].visible = true;
                    break;
                case 4:
                    this[`img${j}Group`].scaleX = 0.9;
                    this[`img${j}Group`].scaleY = 0.9;
                    this[`img${j}Group`].x = 0 - (750);
                    break;
                case 3:
                    this[`img${j}Group`].scaleX = 0.9;
                    this[`img${j}Group`].scaleY = 0.9;
                    this[`img${j}Group`].x = 0 - (1062) - 350;
                    break;
                case 1:
                    this[`img${j}Group`].scaleX = 0.9;
                    this[`img${j}Group`].scaleY = 0.9;
                    this[`img${j}Group`].x = num + (1200);
                    break;
                case 2:
                    this[`img${j}Group`].scaleX = 0.9;
                    this[`img${j}Group`].scaleY = 0.9;
                    this[`img${j}Group`].x = num + (1150) + 350;
                    break;
            }
            this['miaoshu' + j].text = miaoshus[j];
            if (!miaoshus[j] || miaoshus[j] == '') {
                this['shengyin' + j].visible = false;
            }
            this['img' + j].source = imgs[j];
            this['img' + j].touchEnabled = true;
            this['img' + j].name = j + '';
            this['img' + j].addEventListener(egret.TouchEvent.TOUCH_END, this.onClickImg, this);
            this['img' + j].width = 1006;
            this['img' + j].height = 537;
        }
        var sounds: string[]=[];
        let count = Number(this.info.shengyin) || 0;
        for (let i=1;i<=count;i++){
            sounds.push("resource/assets/shopimages/"+this.info.id+"/"+this.info.id+"_"+i+".mp3");
            //sounds[i-1]=
        }
        // if (this.info.shengyin.indexOf(";") >= 0) {
        //     sounds = this.info.shengyin.split(";");
        //     for(let i=1;i<=sounds.length;i++){
        //         //this.info.id+"_"+String(i)+"_mp3";
        //         //sounds[i-1]=this.info.id+"_"+String(i)+".mp3";
        //     }
        // }

        this.imgSound = sounds;
        this.yindaoGroup.visible = false;
        this.onInit();
        this.imgIndx = 4;
        let idx = this.imgIndx;
        SoundManager.getInstance().stopMusicAll();
        if (idx + 1 >= this.imgMaxNumb)
            idx = 0;
        else
            idx = idx + 1;
        if (this.imgSound[idx]) {
            SoundManager.getInstance().playSound(this.imgSound[idx],null,true)// + '.mp3');
        }
        this.play();
        this.onRegist();
        this.updateResize();
        this.datu.visible = false;
        // if (!UserInfo.guideDic[7])//关闭引导图片
        // {
        //     this.shezhilab.visible = true;
        //     this.bgBtn.touchEnabled = false;
        //     this.imgIndx = 4;
        //     GuideManager.getInstance().onShowImg(this.img0Group, this.img0Group, 'xindong');
        // }
    }

    private onShare(): void {
        SoundManager.getInstance().playSound("ope_click.mp3")
        var imgs: string[]=this.getImgArray();
        let idx = this.imgIndx+1
        if(idx == this.imgMaxNumb){
            idx = 0;
        }
        let image_src: string = imgs[idx];
        if (!image_src) return;
        let texture: egret.Texture = RES.getRes(image_src);
        if (texture) {
            platform.shareImage(GameDefine.BOOKID, texture.toDataURL("image/png"));
        }
    }
}
