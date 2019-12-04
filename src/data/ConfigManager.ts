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
        const noneEndingVideo = [
            "V019",
            "V119",
            "V226",
            "V307",
            "V416",
            "V519",
            "V620",
            "V718",
            "V812",
            "V912",
            "VH1007",
            "VH1118",
            "VX1004",
            "VX1112",
            "VWY1013",
            "VY1107",
            "VW1107",
        ];
        if (noneEndingVideo.indexOf(vid) !== -1) {
            return;
        }
        const video = JsonModelManager.instance.getModelshipin()[vid];
        if (video.tiaozhuan) {
            return vid;
        }
    }

    private getChapterIDFromVid(vid) {
        vid = vid.replace("V", "");
        return parseInt(vid.substring(0, vid.length - 2));
    }
}

const Config = new ConfigManager();
