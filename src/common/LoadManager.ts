class LoadManager {
	public static loadUrl: string = "";//"https://xxx.xxx.xxx/";
	public static getVideoUrl(name: string): string {
		if (GameDefine.VIDEO_PINZHI == 1) {
			return this.loadUrl + "video/" + name + ".mp4";
		}
		else {
			return this.loadUrl + "video/" + name + "_gao.mp4";
		}
	}
	public static getAndroinVideoUrl(name: string): string {
		return this.loadUrl + "video/" + name + ".ts";
	}
	public static getResImg(url: string) {
		return this.loadUrl + url;
	}
}