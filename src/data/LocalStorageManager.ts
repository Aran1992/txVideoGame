// class LocalStorageManager {
// 	private static instance: LocalStorageManager = null;

// 	private _timestamp: number = 0;
// 	private _storageData;

// 	public constructor() {
// 	}
// 	// public static getInstance(): LocalStorageManager {
// 	// 	if (this.instance == null) {
// 	// 		this.instance = new LocalStorageManager();
// 	// 	}
// 	// 	return this.instance;
// 	// }
// 	/**初始化**/
// 	private _init: boolean;
// 	public onInit(): void {
// 		if (this._init) return;
// 		var self = this;

// 		var initFileData = function (): void {
// 			if (!self._storageData) {
// 				self._storageData = self.localStorageItem;
// 				if (self._storageData) {
// 					self._storageData = JSON.parse(self._storageData);
// 				}
// 				if (!self._storageData) {
// 					self._storageData = {};
// 					for (let i: number = FILE_TYPE.AUTO_FILE; i < FILE_TYPE.SIZE; i++) {
// 						self.saveFile(i);
// 					}
// 				}
// 			}
// 		}
// 		/**读档回调**/
// 		if (!platform.isDebug) {

// 			callbackGetBookHistory = function (data) {
// 				switch (data.data.slotId) {
// 					case GameDefine.DATAFILE_SLOT:
// 						if (data.data.content) {
// 							if (!self.localStorageTimeStamp) {
// 								self._storageData = JSON.parse(data.data.content);
// 							} else {
// 								let cundang = JSON.parse(data.data.content);
// 								let cundang_timeStamp: number = parseInt(cundang[FILE_TYPE.TIMESTAMP]);
// 								if (cundang_timeStamp >= self.localStorageTimeStamp) {
// 									self._storageData = JSON.parse(data.data.content);
// 								}
// 							}
// 						}
// 						break;
// 				}

// 				initFileData();
// 			}

// 			platform.getBookHistory(GameDefine.BOOKID, GameDefine.DATAFILE_SLOT);
// 		} else {
// 			initFileData();
// 		}
// 		/**存档回调**/
// 		callbackSaveBookHistory = function (data) {
// 			self._timestamp = data.data.timestamp;
// 			if (data.code == 0) {
// 				UserInfo.timestamp = data.data.timestamp;
// 				self.onUpdateFile(FILE_TYPE.TIMESTAMP);
// 				self.clearLocalStorage();
// 				return;
// 			} else {
// 				self.addLocalStorage();
// 			}
// 		}
// 		/**计时器启动**/
// 		Tool.addTimer(this.saveFileTimer, this, 3000);
// 	}
// 	/**获取存档KEY**/
// 	private get localStorageItem(): string {
// 		return egret.localStorage.getItem(`qqszc_${UserInfo.id}_storage`);
// 	}
// 	/**获取本地缓存的时间戳**/
// 	private get localStorageTimeStamp(): number {
// 		let timestamp = egret.localStorage.getItem(`qqszc_${UserInfo.id}_tiemstamp`);
// 		return timestamp ? parseInt(timestamp) : null;
// 	}
// 	/**进行一次本地的存储**/
// 	private addLocalStorage(): void {
// 		egret.localStorage.setItem(`qqszc_${UserInfo.id}_storage`, JSON.stringify(this._storageData));
// 		egret.localStorage.setItem(`qqszc_${UserInfo.id}_tiemstamp`, this._timestamp.toString());
// 	}
// 	/**清空本地缓存**/
// 	private clearLocalStorage(): void {
// 		egret.localStorage.removeItem(`qqszc_${UserInfo.id}_storage`);
// 		egret.localStorage.removeItem(`qqszc_${UserInfo.id}_tiemstamp`);
// 	}
// 	/**平台存档
// 	 * 用计时器进行存档   3秒一存
// 	 * 存不上就放到本地缓存  下次上线发现本地有缓存且时间戳大于上次存的内容 就用本地缓存
// 	 * **/
// 	private saveFileTimer(): void {
// 		if (platform.isDebug) {
// 		} else {
// 			platform.saveBookHistory(GameDefine.BOOKID, GameDefine.DATAFILE_SLOT, "拳拳数据存档", JSON.stringify(this._storageData));
// 		}
// 	}
// 	/**存档
// 	 * 1.从渠道获取初始化的数据
// 	 * 2.数据以JSON串的形式记在内存
// 	 * 3.存储失败就计入缓存
// 	 * 4.每隔3秒去渠道进行存储
// 	 * 5.上线如果发现如果本地的缓存有且时间戳大于渠道的存储时间戳 则以本地缓存覆盖存档以免丢失
// 	 * **/
// 	private _saveFileTps: number[] = [];
// 	public saveFile(fileTp: FILE_TYPE): void {
// 		if (this._saveFileTps.indexOf(fileTp) == -1) this._saveFileTps.push(fileTp);
// 		if (!this._storageData) {
// 			return;
// 		}
// 		while (this._saveFileTps.length > 0) {
// 			this.onUpdateFile(this._saveFileTps.shift());
// 		}
// 	}
// 	private onUpdateFile(fileTp: FILE_TYPE): void {
// 		var str = '';
// 		if (!UserInfo.curBokData) {
// 			UserInfo.curBokData = new BookData();
// 		}
// 		switch (fileTp) {
// 			//自动存档和手动存档
// 			case FILE_TYPE.AUTO_FILE:
// 			case FILE_TYPE.FILE2:
// 			case FILE_TYPE.FILE3:
// 			case FILE_TYPE.FILE4:
// 			case FILE_TYPE.FILE5:
// 			case FILE_TYPE.FILE6:
// 				UserInfo.curBokData.suipianMoney = UserInfo.suipianMoney;
// 				UserInfo.curBokData.ansWerData = UserInfo.ansWerData;
// 				UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
// 				UserInfo.curBokData.allCollectionDatas = UserInfo.allCollectionDatas;
// 				UserInfo.curBokData.guideDic = UserInfo.guideDic;
// 				UserInfo.curBokData.curchapter = UserInfo.curchapter;
// 				UserInfo.curBokData.main_Img = UserInfo.main_Img;
// 				UserInfo.curBokData.shopDic = UserInfo.shopDic;
// 				UserInfo.curBokData.allVideos = UserInfo.allVideos;
// 				UserInfo.curBokData.tipsDick = UserInfo.tipsDick;
// 				str = JSON.stringify(UserInfo.curBokData);
// 				break;
// 			//选过的所有问题答案存档
// 			case FILE_TYPE.ANSWER_FILE:
// 				UserInfo.curBokData.ansWerData = UserInfo.ansWerData;
// 				str = JSON.stringify(UserInfo.ansWerData);
// 				break;
// 			//成就存档
// 			case FILE_TYPE.CHENGJIU_FILE:
// 				UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
// 				str = JSON.stringify(UserInfo.achievementDics);
// 				break;
// 			//收藏存档
// 			case FILE_TYPE.COLLECTION_FILE:
// 				UserInfo.curBokData.allCollectionDatas = UserInfo.allCollectionDatas;
// 				str = JSON.stringify(UserInfo.allCollectionDatas)
// 				break;
// 			case FILE_TYPE.HIDE_FILE:
// 				// str = JSON.stringify(UserInfo.chapterDatas);
// 				break;
// 			case FILE_TYPE.GUIDE_TP:
// 				str = JSON.stringify(UserInfo.guideDic);
// 				UserInfo.curBokData.guideDic = UserInfo.guideDic;
// 				break;
// 			case FILE_TYPE.GOODS_FILE:
// 				let shopInfoDict = {};
// 				for (let id in ShopManager.getInstance().shopInfoDict) {
// 					let shopinfo: ShopInfoData = ShopManager.getInstance().shopInfoDict[id];
// 					shopInfoDict[shopinfo.id] = { num: shopinfo.num };
// 				}
// 				// GameCommon.getInstance().addChengJiuTips(JSON.stringify(shopInfoDict))
// 				str = JSON.stringify(shopInfoDict);
// 				break;
// 			case FILE_TYPE.TIMESTAMP:
// 				if (UserInfo.timestamp) {
// 					str = UserInfo.timestamp.toString();
// 				}
// 				break;
// 		}
// 		if (str) {
// 			this._storageData[fileTp] = str;
// 			GameCommon.getInstance().parseFiel(fileTp);
// 			this.addLocalStorage();
// 		}
// 	}
// 	/**获取指定的存档**/
// 	public getBookHistory(fileTp: FILE_TYPE) {
// 		if (!this._storageData) return;
// 		let fileData = JSON.parse(this._storageData[fileTp]);
// 		if (!fileData) {
// 			switch (fileTp) {
// 				case FILE_TYPE.FILE2:
// 				case FILE_TYPE.FILE3:
// 				case FILE_TYPE.FILE4:
// 				case FILE_TYPE.FILE5:
// 				case FILE_TYPE.FILE6:
// 					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), fileTp);
// 					break;
// 			}
// 			return;
// 		}
// 		switch (fileTp) {
// 			//自动存档和手动存档
// 			case FILE_TYPE.AUTO_FILE:
// 				UserInfo.curBokData = fileData;
// 				if (UserInfo.curBokData.allCollectionDatas) {
// 					UserInfo.allCollectionDatas = UserInfo.curBokData.allCollectionDatas;
// 				}
// 				if (UserInfo.curBokData.achievementDics) {
// 					UserInfo.achievementDics = UserInfo.curBokData.achievementDics;
// 				}
// 				if (UserInfo.curBokData.ansWerData) {
// 					UserInfo.ansWerData = UserInfo.curBokData.ansWerData;
// 				}
// 				if (UserInfo.curBokData.suipianMoney) {
// 					UserInfo.suipianMoney = UserInfo.curBokData.suipianMoney;
// 				}
// 				if (UserInfo.curBokData.guideDic) {
// 					UserInfo.guideDic = UserInfo.curBokData.guideDic;
// 				}
// 				// if (UserInfo.curBokData.chapterDatas) {
// 				// 	UserInfo.chapterDatas = UserInfo.curBokData.chapterDatas;
// 				// }
// 				if (UserInfo.curBokData.curchapter) {
// 					UserInfo.curchapter = UserInfo.curBokData.curchapter;
// 				}
// 				if (UserInfo.curBokData.main_Img) {
// 					UserInfo.main_Img = UserInfo.curBokData.main_Img;
// 				}
// 				if (UserInfo.curBokData.shopDic) {
// 					UserInfo.shopDic = UserInfo.curBokData.shopDic;
// 				}
// 				if (UserInfo.curBokData.allVideos) {
// 					UserInfo.allVideos = UserInfo.curBokData.allVideos;
// 				}
// 				if (UserInfo.curBokData.tipsDick) {
// 					UserInfo.tipsDick = UserInfo.curBokData.tipsDick;
// 				}

// 				// GameCommon.getInstance().addLikeTips('img'+UserInfo.main_Img);
// 				// GameCommon.getInstance().addLikeTips('UserInfo.curBokData.main_Img'+JSON.stringify(UserInfo.curBokData.main_Img))
// 				UserInfo.fileDatas[fileTp] = UserInfo.curBokData;
// 				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), fileTp);
// 				break;
// 			case FILE_TYPE.FILE2:
// 			case FILE_TYPE.FILE3:
// 			case FILE_TYPE.FILE4:
// 			case FILE_TYPE.FILE5:
// 			case FILE_TYPE.FILE6:
// 				if (GameDefine.ISFILE_STATE) {
// 					UserInfo.curBokData = fileData;
// 					if (UserInfo.allCollectionDatas) {
// 						UserInfo.curBokData.allCollectionDatas = UserInfo.allCollectionDatas;
// 					}
// 					if (UserInfo.achievementDics) {
// 						UserInfo.curBokData.achievementDics = UserInfo.achievementDics;
// 					}
// 					if (UserInfo.ansWerData) {
// 						UserInfo.curBokData.ansWerData = UserInfo.ansWerData;
// 					}
// 					if (UserInfo.suipianMoney) {
// 						UserInfo.curBokData.suipianMoney = UserInfo.suipianMoney;
// 					}
// 					if (UserInfo.guideDic) {
// 						UserInfo.curBokData.guideDic = UserInfo.guideDic;
// 					}
// 					// if (UserInfo.chapterDatas) {
// 					// 	UserInfo.curBokData.chapterDatas = UserInfo.chapterDatas;
// 					// }
// 					if (UserInfo.curchapter) {
// 						UserInfo.curBokData.curchapter = UserInfo.curchapter;
// 					}
// 					if (UserInfo.main_Img) {
// 						UserInfo.curBokData.main_Img = UserInfo.main_Img;
// 					}
// 					if (UserInfo.shopDic) {
// 						UserInfo.curBokData.shopDic = UserInfo.shopDic;
// 					}
// 					if (UserInfo.allVideos) {
// 						UserInfo.curBokData.allVideos = UserInfo.allVideos;
// 					}
// 					if (UserInfo.tipsDick) {
// 						UserInfo.curBokData.tipsDick = UserInfo.tipsDick;
// 					}
// 				}
// 				UserInfo.fileDatas[fileTp] = fileData;
// 				// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), tp);
// 				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.AUTO_UPDATA), fileTp);
// 				break;
// 			//成就存档
// 			case FILE_TYPE.CHENGJIU_FILE:
// 				UserInfo.achievementDics = JSON.parse(fileData);
// 				break;
// 			//收藏存档
// 			case FILE_TYPE.COLLECTION_FILE:
// 				UserInfo.allCollectionDatas = JSON.parse(fileData);
// 				break;
// 			case FILE_TYPE.HIDE_FILE:
// 				// UserInfo.chapterDatas = JSON.parse(data.data.content);
// 				break;
// 			//引导存档
// 			case FILE_TYPE.GUIDE_TP:
// 				// UserInfo.guideDic = JSON.parse(data.data.content);
// 				// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.UPDATA_REFRESH), JSON.stringify(UserInfo.guideDic));
// 				break;
// 			case FILE_TYPE.GOODS_FILE:
// 				// GameCommon.getInstance().addChengJiuTips(JSON.stringify(data.data.content));
// 				ShopManager.getInstance().debugShopInfos = JSON.parse(fileData);
// 				ShopManager.getInstance().getShopInfos();
// 				break;
// 		}
// 	}
// 	/**删档处理**/
// 	public deleteBookHistory(fileTp: FILE_TYPE) {
// 		if (platform.isDebug) {
// 			if (this._storageData[fileTp]) {
// 				delete this._storageData[fileTp];
// 			}

// 			let hasData: boolean = false;
// 			for (var i: number = 1; i < FILE_TYPE.SIZE; i++) {
// 				if (this._storageData[i]) {
// 					hasData = true;
// 					break;
// 				}
// 			}
// 			if (this.localStorageItem) {
// 				if (!hasData) this.clearLocalStorage();
// 				else this.addLocalStorage();
// 			}
// 		} else {
// 			let self = this;
// 			callbackdeleteBookHistory = function (data) {
// 				GameCommon.getInstance().showCommomTips('清档' + JSON.stringify(data));

// 				let slotId = data.data.slotId;
// 				if (self._storageData[slotId]) {
// 					delete self._storageData[slotId];
// 				}

// 				let hasData: boolean = false;
// 				for (var i: number = 1; i < FILE_TYPE.SIZE; i++) {
// 					if (this._storageData[i]) {
// 						hasData = true;
// 						break;
// 					}
// 				}
// 				if (this.localStorageItem) {
// 					if (!hasData) this.clearLocalStorage();
// 					else this.addLocalStorage();
// 				}
// 			}
// 			platform.deleteBookHistory(GameDefine.BOOKID, fileTp);
// 		}
// 	}
// }