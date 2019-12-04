declare const sendRequest;
declare const reportBusinessEvent;
declare const getBusinessEventData;

if (platform.getPlatform() === "plat_1001") {
    class ReportManager_ {
        private eventHandlerTable = {
            [GameEvent.BEGAN_READING_CHAPTER]: this.onBeganReadingChapter,
            [GameEvent.ENDED_READING_CHAPTER]: this.onEndedReadingChapter,
            [GameEvent.ACHIEVED_ENDING]: this.onAchievedEnding,
            [GameEvent.COMPLETED_TASK]: this.onCompletedTask,
            [GameEvent.RECEIVED_TASK_REWARD]: this.onReceivedTaskReward,
            [GameEvent.SHARE_ACTIVATION_CODE]: this.onShareActivationCode,
            [GameEvent.SHARE_COLLECTION_IMAGE]: this.onShareCollectionImage,
        };

        public init() {
            for (const event in this.eventHandlerTable) {
                GameDispatcher.getInstance().addEventListener(event, this.eventHandlerTable[event], this);
            }
        }

        public destroy() {
            for (const event in this.eventHandlerTable) {
                GameDispatcher.getInstance().removeEventListener(event, this.eventHandlerTable[event], this);
            }
        }

        private onBeganReadingChapter(data) {
            // 由于服务器上章节id不能为0 所以这边使用999来代替
            if (data.data === 0) {
                data.data = 999;
            }
            sendRequest({
                "bookId": GameDefine.BOOKID,
                "cmd": "addReadChapterInfo",
                "chapterId": data.data,
                "readState": 1
            }, data => {
                console.log("onBeganReadingChapter", data);
            });
        }

        private onEndedReadingChapter(data) {
            // 由于服务器上章节id不能为0 所以这边使用999来代替
            if (data.data === 0) {
                data.data = 999;
            }
            sendRequest({
                "bookId": GameDefine.BOOKID,
                "cmd": "addReadChapterInfo",
                "chapterId": data.data,
                "readState": 2
            }, data => {
                console.log("onEndedReadingChapter", data);
            });
        }

        private onAchievedEnding(data) {
            reportBusinessEvent(GameDefine.BOOKID, "结局", data.data, data => {
                console.log("onAchievedEnding", data);
            });
        }

        private onCompletedTask(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            reportBusinessEvent(GameDefine.BOOKID, "完成BP任务", taskName, data => {
                console.log("onCompletedTask", data);
            });
        }

        private onReceivedTaskReward(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            reportBusinessEvent(GameDefine.BOOKID, "领取BP任务奖励", taskName, data => {
                console.log("onReceivedTaskReward", data);
            });
        }

        private onShareActivationCode() {
            reportBusinessEvent(GameDefine.BOOKID, "分享激活码", "分享激活码", data => {
                console.log("onShareActivationCode", data);
            });
        }

        private onShareCollectionImage() {
            reportBusinessEvent(GameDefine.BOOKID, "分享收藏图片", "分享收藏图片", data => {
                console.log("onShareCollectionImage", data);
            });
        }
    }

    const ReportManager = new ReportManager_();
    ReportManager.init();
    getBusinessEventData(GameDefine.BOOKID, "完成BP任务", "0-0-0", data => {
        console.log("完成BP任务", data);
    });
    getBusinessEventData(GameDefine.BOOKID, "领取BP任务奖励", "0-0-0", data => {
        console.log("领取BP任务奖励", data);
    });
    getBusinessEventData(GameDefine.BOOKID, "分享激活码", "分享激活码", data => {
        console.log("分享激活码", data);
    });
    getBusinessEventData(GameDefine.BOOKID, "分享收藏图片", "分享收藏图片", data => {
        console.log("分享收藏图片", data);
    });
}
