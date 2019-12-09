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
            this.report("章节开始", {chapterID});
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
            this.report("章节结束", {chapterID});
        }

        private onAchievedEnding(data) {
            this.report("结局", {endingVID: data.data});
        }

        private onCompletedTask(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            this.report("完成BP任务", {taskName});
        }

        private onReceivedTaskReward(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            this.report("领取BP任务奖励", {taskName});
        }

        private onShareActivationCode() {
            this.report("分享激活码");
        }

        private onShareCollectionImage() {
            this.report("分享收藏图片");
        }

        private report(event, params = undefined) {
            console.log("start report", event, params);
            event = params ? `${event}-${JSON.stringify(params)}` : event;
            report(GameDefine.BOOKID, event, "", data => console.log("end report", data, event, params));
        }
    }

    const ReportManager = new ReportManager_();
    ReportManager.init();
}
