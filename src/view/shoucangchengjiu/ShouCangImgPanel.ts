class ShouCangImgPanel extends eui.Component {
    private mainGroup: eui.Group;
    private bgBtn: eui.Group;
    private imgGroup: eui.Group;
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
    private isOne: boolean = false;
    private animRecords: SCImageData[];
    private readonly imgMaxNumb: number = 5;
    private curImg;
    private imgSound: string[] = [];

    constructor(data) {
        super();
        this.info = data;
        this.imgMaxNumb = Math.min(Number(this.info.src), 5);
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private _imgIndx: number = 0;

    private get imgIndx() {
        return this._imgIndx;
    }

    private set imgIndx(m) {
        this._imgIndx = m;
    }

    protected onRegist(): void {
        GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
        this.btnSetXinDong.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetXinDong, this);
        this.bgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.imgGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.imgGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.datu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseDaTu, this);
        this.playSound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlaySound, this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
    }

    protected onRemove(): void {
        this.bgBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.btnSetXinDong.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSetXinDong, this);
        this.imgGroup.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
        this.imgGroup.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEventEnd, this);
        this.datu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseDaTu, this);
        this.playSound.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlaySound, this);
        this.btnShare.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShare, this);
    }

    protected onInit(): void {
        this.onInitImg();
        for (let i = 0; i < this.imgMaxNumb; i++) {
            this['xindong' + i].visible = UserInfo.main_Img == this['img' + i].source;
        }
    }

    protected onSkinName(): void {
        this.skinName = skins.ShouCangImgSkin;
    }

    private onAddToStage(): void {
        this.onSkinName();
    }

    private onSetXinDong() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        for (let i = 0; i < this.imgMaxNumb; i++) {
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
        let _record: SCImageData;
        let img: eui.Group;
        for (let i = 0; i < this.imgMaxNumb; i++) {
            img = (this[`img${i}Group`] as eui.Group);
            _record = new SCImageData(img.x, img.y, img.scaleX, img.width, img.height, img.parent.getChildIndex(img));
            img.name = i + '';
            this.animRecords.push(_record);
        }
        this.imgIndx = 0;
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.onRemove();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangImgPanel')
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
                let tw = egret.Tween.get(this.datu);
                let scaleX = size.width / GameDefine.GAME_VIEW_WIDTH;
                let scaleY = size.height / GameDefine.GAME_VIEW_HEIGHT;
                let scale = scaleX > scaleY ? scaleX : scaleY;
                tw.to({width: GameDefine.GAME_VIEW_WIDTH * scale, height: GameDefine.GAME_VIEW_HEIGHT * scale}, 100);
                return;
            }

        }
        if (this.starPos > event.stageX) {
            if (this.starPos - event.stageX > 30) {
                this.onNextImg();
            }
        } else if (this.starPos < event.stageX) {
            if (event.stageX - this.starPos > 30) {
                this.onLastImg();

            }
        }
        this.curImg = null;
    }

    private onCloseDaTu() {
        let tw = egret.Tween.get(this.datu);
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
            SoundManager.getInstance().playSound(this.imgSound[idx], null, true);
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
            SoundManager.getInstance().playSound(this.imgSound[idx], null, true);
        }
        this.play();
    }

    private onClickImg(event: egret.Event) {
        this.curImg = event.currentTarget;
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
            }, 150, egret.Ease.sineIn);
            infySlot.parent.setChildIndex(infySlot, recordInfo.childNum);
        }
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

    private getImgArray() {
        let imgs: string[] = [];
        let count = Math.min(this.imgMaxNumb, Number(this.info.src));
        for (let i = 1; i <= count; i++) {
            imgs.push(this.info.id + "_" + String(i) + "_jpg");
        }
        return imgs;
    }

    private onLoadComplete(): void {
        this.updateResize();
        this.touchEnabled = false;
        let num = this.width / 2 - this[`img${0}Group`].width / 2;
        this.isOne = true;

        let imgs: string[] = this.getImgArray();
        let miaoshus: string[];
        miaoshus = this.info.kuozhan.split(";");

        for (let j = 0; j < imgs.length; j++) {
            this[`xindong${j}`].visible = false;
            switch (j) {
                case 0:
                    this[`img${j}Group`].x = num;
                    this[`img${j}Group`].scaleX = 1;
                    this[`img${j}Group`].scaleY = 1;
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
        let sounds: string[] = [];
        let count = Number(this.info.shengyin) || 0;
        for (let i = 1; i <= count; i++) {
            sounds.push("resource/assets/shopimages/" + this.info.id + "/" + this.info.id + "_" + i + ".mp3");
        }

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
            SoundManager.getInstance().playSound(this.imgSound[idx], null, true)
        }
        this.play();
        this.onRegist();
        this.updateResize();
        this.datu.visible = false;
    }

    private onShare(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let imgs: string[] = this.getImgArray();
        let idx = this.imgIndx + 1;
        if (idx == this.imgMaxNumb) {
            idx = 0;
        }
        let image_src: string = imgs[idx];
        if (!image_src) return;
        let texture: egret.Texture = RES.getRes(image_src);
        if (texture) {
            GameCommon.getInstance().showLoading();
            setTimeout(() => {
                shareImageInfo = {name: this.info.name, src: image_src};
                const imageData = texture.toDataURL("image/png");
                platform.shareImage(GameDefine.BOOKID, imageData);
            }, 0);
        }
    }
}
