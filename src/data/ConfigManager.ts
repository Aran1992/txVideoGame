class ConfigManager {
    public getVideoBeganChapter(vid: string) {
        const chapters = JsonModelManager.instance.getModelchapter();
        for (const cid in chapters) {
            const chapter = chapters[cid];
            if (chapter.videoSrc.split(",")[0] === vid) {
                return chapter.id;
            }
        }
    }

    public getVideoEndedChapter(vid: string) {
        if (vid === "V019") {
            return 0;
        }
        const video = JsonModelManager.instance.getModelshipin()[vid];
        if (video.tiaozhuan == TIAOZHUAN_Type.RESULT) {
            return this.getChapterIDFromVid(vid);
        }
    }

    public getVideoAchievedEnding(vid: string) {
        if (vid === "") {
            return;
        }
        const video = JsonModelManager.instance.getModelshipin()[vid];
        if (video.ending) {
            return {endingVID: vid, endingName: video.ending, isBadEnding: video.be === 1};
        }
    }

    public getChapterBeganBranchName(chapter) {
        const map = {
            10: "韩小白",
            20: "夏子豪",
            31: "肖千也",
            41: "肖万寻",
        };
        return map[chapter];
    }

    private getChapterIDFromVid(vid) {
        vid = vid.replace("V", "");
        return parseInt(vid.substring(0, vid.length - 2));
    }
}

const Config = new ConfigManager();
