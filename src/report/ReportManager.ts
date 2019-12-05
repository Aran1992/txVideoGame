declare const sendRequest;
declare const report;

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
            let chapterID = data.data || 999;
            sendRequest({
                "bookId": GameDefine.BOOKID,
                "cmd": "addReadChapterInfo",
                "chapterId": chapterID,
                "readState": 1
            }, data => {
                console.log("onBeganReadingChapter sendRequest", data);
            });
            report(GameDefine.BOOKID, "章节开始", data.data, data => {
                console.log("onBeganReadingChapter report", data);
            });
        }

        private onEndedReadingChapter(data) {
            // 由于服务器上章节id不能为0 所以这边使用999来代替
            let chapterID = data.data || 999;
            sendRequest({
                "bookId": GameDefine.BOOKID,
                "cmd": "addReadChapterInfo",
                "chapterId": chapterID,
                "readState": 2
            }, data => {
                console.log("onEndedReadingChapter sendRequest", data);
            });
            report(GameDefine.BOOKID, "章节结束", data.data, data => {
                console.log("onEndedReadingChapter report", data);
            });
        }

        private onAchievedEnding(data) {
            report(GameDefine.BOOKID, "结局", data.data, data => {
                console.log("onAchievedEnding", data);
            });
        }

        private onCompletedTask(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            report(GameDefine.BOOKID, "完成BP任务", taskName, data => {
                console.log("onCompletedTask", data);
            });
        }

        private onReceivedTaskReward(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            report(GameDefine.BOOKID, "领取BP任务奖励", taskName, data => {
                console.log("onReceivedTaskReward", data);
            });
        }

        private onShareActivationCode() {
            report(GameDefine.BOOKID, "分享激活码", "分享激活码", data => {
                console.log("onShareActivationCode", data);
            });
        }

        private onShareCollectionImage() {
            report(GameDefine.BOOKID, "分享收藏图片", "分享收藏图片", data => {
                console.log("onShareCollectionImage", data);
            });
        }
    }

    const ReportManager = new ReportManager_();
    ReportManager.init();
}
