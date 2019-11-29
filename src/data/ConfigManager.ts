class ConfigManager {
    public getVideoBeganChapter(vid: string) {
        const chapters = JsonModelManager.instance.getModelchapter();
        for (const cid in chapters) {
            const chapter = chapters[cid];
            if (chapter.videoSrc.split(",")[0] === vid) {
                return cid;
            }
        }
    }

    public getVideoEndedChapter(vid: string) {
        if (vid === "V019") {
            return 0;
        }
        let cid = undefined;
        const video = JsonModelManager.instance.getModelshipin()[vid];
        if (video.tiaozhuan) {
            cid = this.getChapterIDFromVid(vid);
        }
        return cid;
    }

    public getVideoAchievedEnding(vid: string) {
        if (vid === "V019") {
            return "V019";
        }
        let endingID = undefined;
        const video = JsonModelManager.instance.getModelshipin()[vid];
        if (video.tiaozhuan) {
            endingID = vid;
        }
        return endingID;
    }

    public getChapterName(cid) {
        return JsonModelManager.instance.getModelchapter()[cid].name;
    }

    // todo
    public getEndingName(eid) {
        return `结局${eid}`;
    }

    private getChapterIDFromVid(vid) {
        vid = vid.replace("V", "");
        return parseInt(vid.substring(0, vid.length - 2));
    }
}

const Config = new ConfigManager();
