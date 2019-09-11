class ViewTouch extends egret.DisplayObjectContainer {
	public static isTouch: boolean = false;
	private group: eui.Group;
	private view: VideoData;
	private point: egret.Point;
	private groupScreen: eui.Group;
	private soundList: SoundTrackBody[];

	private item: eui.Image;
	public constructor(view) {
		super();
		this.view = view;
		this.point = new egret.Point();
		this.width = 1920;
		this.height = size.height;

		this.group = new eui.Group();
		this.group.width = this.width;
		this.group.height = this.height;
		this.group.touchEnabled = true;
		this.group.touchChildren = false;
		this.group.touchThrough = false;
		this.group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onEventDown, this);
		this.group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onEventMove, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GUIDE_STOP_GAME, this.onStopGame, this);
		this.addChild(this.group);

		this.groupScreen = new eui.Group();
		this.groupScreen.touchEnabled = false;
		this.addChild(this.groupScreen);

		// let item = new eui.Image("action_music_2_png");
		// item.anchorOffsetX = 127 / 2;
		// item.anchorOffsetY = 113 / 2;
		// this.groupScreen.addChild(item);
		// this.item = item;

		this.soundList = [];
		this.initItem();
		GameDispatcher.getInstance().addEventListener(GameEvent.UPDATE_RESIZE, this.updateResize, this);
	}
	public updateResize() {
		if (this.soundList) {
			for (let i = this.soundList.length - 1; i >= 0; --i) {
				this.soundList[i].updateResize();
			}
		}
	}
	private onStopGame(data): void {
		if (data.data == 'stop') {
			if (this.soundList) {
				for (let i = this.soundList.length - 1; i >= 0; --i) {
					this.soundList[i].onPauseMusic();
				}
			}
			// }
		}
		else {
			if (this.soundList) {
				for (let i = this.soundList.length - 1; i >= 0; --i) {
					this.soundList[i].onPlayMusic();
				}
			}
		}
	}
	private initItem() {
		this.setItem(350, wind.height / 2, 4);
		this.setItem(1250, wind.height / 2 + 15, 5);
		this.setItem(2248, wind.height / 2 - 25, 6);
		this.setItem(2832, wind.height / 2 - 50, 7);
		this.updateSound();
		this.updateResize();
	}
	private setItem(x: number, y: number, idx) {
		let item = null;
		let size = 25;
		item = new eui.Image('sc_img_shuxian_png');
		item.anchorOffsetX = item.anchorOffsetY = size / 2;
		// var lab: eui.Label = new eui.Label();
		// lab.size = 35;
		// lab.bold = true;
		// lab.x = x+250;
		// lab.y = y+250;
		// lab.text = answerModels[this.view.curWentiId][idx - 1].des;
		// this.groupScreen.addChild(lab);
		this.groupScreen.addChild(item);
		// item.touchEnabled = false;
		// lab.name = idx + '';
		// lab.addEventListener(egret.TouchEvent.TOUCH_END, this.onSelectVideo, this);
		VideoManager.getInstance().onSwitchVolume(0);
		item.name = idx + '';
		item.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onSelectBegen, this);
		let music = SoundManager.musicList[idx - 1]
		this.soundList.push(new SoundTrackBody(item, x, y, music));
	}
	private onEventDown(e: egret.TouchEvent) {
		this.point.setTo(e.localX, e.localY);
	}
	private onSelectVideo(event: egret.Event) {
		event.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSelectVideo, this);
		event.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onSelectBegen, this);
		var id: number = Number(event.target.name);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.VIDEO_FULL_END), id);
	}
	private onSelectBegen(event: egret.Event) {
		event.currentTarget.addEventListener(egret.TouchEvent.TOUCH_END, this.onSelectVideo, this);

	}
	private onEventMove(e: egret.TouchEvent) {
		this.onMove(e.localX - this.point.x, e.localY - this.point.y);
		this.point.setTo(e.localX, e.localY);
	}
	private onMove(offx: number, offy: number) {
		if (this.view) {
			this.view.onMoveTouch(offx, offy);
		}
	}
	public setVideoPoint(x, y) {
		this.groupScreen.x = x * GameDefine.sceneScaleX;
		// this.groupScreen.y = y * GameDefine.sceneScaleY;
		this.updateSound();
	}
	private updateSound() {
		let centerX = wind.width / 2 * GameDefine.sceneScaleX - this.groupScreen.x;
		let centerY = wind.height / 2 * GameDefine.sceneScaleY - this.groupScreen.y;
		for (let i = 0; i < this.soundList.length; ++i) {
			this.soundList[i].updatePoint(centerX, centerY);
		}
		if (this.item) {
			this.item.x = centerX;
			this.item.y = centerY;
		}
	}
	public onExit() {
		GameDispatcher.getInstance().removeEventListener(GameEvent.GUIDE_STOP_GAME, this.onStopGame, this);
		SoundManager.getInstance().stopMusicAll();
		this.parent.removeChild(this);
	}
}