declare const bookapp;

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
        const chapterName = Config.getChapterName(data.data);
        this.onEvent(`开始阅读章节：${chapterName}`);
    }

    private onEndedReadingChapter(data) {
        const chapterName = Config.getChapterName(data.data);
        this.onEvent(`结束阅读章节：${chapterName}`);
    }

    private onAchievedEnding(data) {
        const endingName = Config.getEndingName(data.data);
        this.onEvent(`达成结局：${endingName}`);
    }

    private onCompletedTask(data) {
        const taskName = TaskManager.instance.getTaskName(data.data);
        this.onEvent(`完成BP任务：${taskName}`);
    }

    private onReceivedTaskReward(data) {
        const taskName = TaskManager.instance.getTaskName(data.data);
        this.onEvent(`领取BP任务奖励：${taskName}`);
    }

    private onShareActivationCode() {
        this.onEvent("分享激活码");
    }

    private onShareCollectionImage() {
        this.onEvent("分享收藏图片");
    }

    private onEvent(eventName: string) {
        bookapp.report_read_schedule(GameDefine.BOOKID, UserInfo.id, 'schedule', 'reading', eventName, eventName, 0);
    }
}

// if (platform.getPlatform() === "plat_1001") {
const ReportManager = new ReportManager_();
ReportManager.init();
// }
