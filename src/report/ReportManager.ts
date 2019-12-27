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
            [GameEvent.ONSHOW_VIDEO]: this.onRefreshVideo,
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
            this.report("章节开始", {chapterID: data.data});
            const branchName = Config.getChapterBeganBranchName(data.data);
            if (branchName) {
                this.report("支线选择", {branchName});
            }
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
            this.report("章节结束", {chapterID: data.data});
        }

        private onAchievedEnding(data) {
            this.report("结局", data.data);
        }

        private onCompletedTask(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            this.report("完成BP任务", {taskName, taskID: data.data});
        }

        private onReceivedTaskReward(data) {
            const taskName = TaskManager.instance.getTaskName(data.data);
            this.report("领取BP任务奖励", {taskName, taskID: data.data});
        }

        private onShareActivationCode() {
            this.report("分享激活码");
        }

        private onShareCollectionImage(data) {
            this.report("分享收藏图片", data.data);
        }

        private onRefreshVideo(data) {
            const wenti = wentiModels[data.data.wentiId];
            const chapterID = wenti.chapter;
            const branchID = Config.getChapterBranchName(chapterID);
            const args = {
                chapterID,
                branchID,
                isDefault: !data.data.click,
                questionName: wenti.name,
            };
            if ([
                ActionType.CLICK_TIME,
                ActionType.CLICK,
                ActionType.SLIDE,
                ActionType.SLIDE_RECT,
                ActionType.SLIDE_TWO,
                ActionType.SEND_MSG,
            ].indexOf(wenti.type) !== -1) {
                args["isSelect"] = false;
                args["success"] = data.data.answerId == 1;
            } else {
                args["isSelect"] = true;
                args["answerID"] = data.data.answerId;
                args["answerDes"] = Config.getAnswerConfig(data.data.wentiId, data.data.answerId).des;
            }
            this.report("互动", args);
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
