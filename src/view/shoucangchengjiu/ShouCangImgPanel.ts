class ShouCangImgPanel extends eui.Component {
    private bgBtn: eui.Group;
    private imgGroup: eui.Group;
    private btnSetXinDong: eui.Button;
    private playSound: eui.Button;
    private datu: eui.Image;
    private info: Modelshoucang;
    private btnShare: eui.Button;
    private starPos: number = 0;
    private animRecords: SCImageData[];
    private readonly imgMaxNum: number;
    private curImg;
    private imgSound: string[] = [];
    private imgIdx: number = 0;

    constructor(data) {
        super();
        this.info = data;
        this.imgMaxNum = Math.min(Number(this.info.src), 5);
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
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
        for (let i = 0; i < this.imgMaxNum; i++) {
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
        for (let i = 0; i < this.imgMaxNum; i++) {
            this['xindong' + i].visible = false;
        }
        this['xindong' + this.imgIdx].visible = true;
        UserInfo.main_Img = this['img' + this.imgIdx].source;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MAIN_IMG_REFRESH));
        if (UserInfo.curBokData)
            UserInfo.curBokData.main_Img = UserInfo.main_Img;
        GameCommon.getInstance().setBookData(FILE_TYPE.AUTO_FILE);
    }

    private onInitImg() {
        this.animRecords = [];
        for (let i = 0; i < this.imgMaxNum; i++) {
            let img: eui.Group = this[`img${i}Group`] as eui.Group;
            img.name = i + '';
            this.animRecords.push(new SCImageData(img.x, img.y, img.scaleX, img.width, img.height, img.parent.getChildIndex(img)));
        }
        this.imgIdx = 0;
    }

    private onClose() {
        SoundManager.getInstance().playSound("ope_click.mp3");
        this.onRemove();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.CLOSE_VIEW), 'ShouCangImgPanel')
    }

    private onClickImg(event: egret.Event) {
        this.curImg = event.currentTarget;
    }

    private onEventDown(event: egret.TouchEvent) {
        this.starPos = event.stageX;
    }

    private onEventEnd(event: egret.TouchEvent) {
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
        SoundManager.getInstance().stopMusicAll();
        if (this.imgSound[this.imgIdx]) {
            SoundManager.getInstance().playSound(this.imgSound[this.imgIdx], null, true);
        }
    }

    private onNextImg() {
        this.play();
        this.imgIdx++;
        if (this.imgIdx >= this.imgMaxNum) {
            this.imgIdx = 0;
        }
        this.onPlaySound();
    }

    private onLastImg() {
        this.play(true);
        this.imgIdx--;
        if (this.imgIdx < 0) {
            this.imgIdx = this.imgMaxNum - 1;
        }
        this.onPlaySound();
    }

    private play(reverse = false): void {
        for (let i = 0; i < this.imgMaxNum; i++) {
            let imgGroup: eui.Group = this[`img${i}Group`];
            let j = i - this.imgIdx;
            if (j < 0) {
                j = this.imgMaxNum + j;
            }
            if (reverse) {
                j++;
                if (j >= this.imgMaxNum) {
                    j = 0;
                }
            } else {
                j--;
                if (j < 0) {
                    j = this.imgMaxNum - 1;
                }
            }
            imgGroup.name = j + "";
            let info = this.animRecords[imgGroup.name];
            egret.Tween.get(imgGroup)
                .to({
                    x: info.posX,
                    scaleX: info.scale,
                    scaleY: info.scale,
                    y: info.posY,
                    width: info.width,
                    height: info.height
                }, 150, egret.Ease.sineIn);
            imgGroup.parent.setChildIndex(imgGroup, info.childNum);
        }
    }

    private updateResize() {
        this.width = size.width;
        this.height = size.height;
    }

    private getImgArray() {
        let imgs: string[] = [];
        let count = Math.min(this.imgMaxNum, Number(this.info.src));
        for (let i = 1; i <= count; i++) {
            imgs.push(this.info.id + "_" + String(i) + "_jpg");
        }
        return imgs;
    }

    private onLoadComplete(): void {
        this.updateResize();
        this.touchEnabled = false;
        let x = this.width / 2 - this[`img0Group`].width / 2;

        let imgs: string[] = this.getImgArray();
        let miaoshus: string[] = this.info.kuozhan.split(";");
        for (let i = 0; i < 5; i++) {
            this[`img${i}Group`].visible = false;
        }
        for (let j = 0; j < imgs.length; j++) {
            this[`img${j}Group`].visible = true;
            this[`xindong${j}`].visible = false;
            this['img' + j].source = imgs[j];
            this['img' + j].width = 1006;
            this['img' + j].height = 537;
            this[`img${j}Group`].scaleX = 0.9;
            this[`img${j}Group`].scaleY = 0.9;
            switch (j) {
                case 0:
                    this[`img${j}Group`].x = x;
                    this[`img${j}Group`].scaleX = 1;
                    this[`img${j}Group`].scaleY = 1;
                    break;
                case 4:
                    this[`img${j}Group`].x = 0 - (750);
                    break;
                case 3:
                    this[`img${j}Group`].x = 0 - (1062) - 350;
                    break;
                case 1:
                    this[`img${j}Group`].x = x + (1200);
                    break;
                case 2:
                    this[`img${j}Group`].x = x + (1150) + 350;
                    break;
            }
            this['miaoshu' + j].text = miaoshus[j];
            if (!miaoshus[j] || miaoshus[j] == '') {
                this['shengyin' + j].visible = false;
            }
            this['img' + j].touchEnabled = true;
            this['img' + j].name = j + '';
            this['img' + j].addEventListener(egret.TouchEvent.TOUCH_END, this.onClickImg, this);
        }
        let count = Number(this.info.shengyin) || 0;
        for (let i = 1; i <= count; i++) {
            this.imgSound.push("resource/assets/shopimages/" + this.info.id + "/" + this.info.id + "_" + i + ".mp3");
        }
        this.onInit();
        this.imgIdx = 0;
        this.onPlaySound();
        this.onRegist();
        this.updateResize();
        this.datu.visible = false;
    }

    private onShare(): void {
        SoundManager.getInstance().playSound("ope_click.mp3");
        let imgs: string[] = this.getImgArray();
        let image_src: string = imgs[this.imgIdx];
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
