/**
 * @author lzh
 * @date 2019年1月24日 下午5:00:03
 */
class UserInfo {
    //用户名
    public static user: string = '';
    //用户id
    public static id: number = 0;
    public static fileDatas = {};//
    public static ansWerData: AnswerData;
    public static achievementDics = {};//所有成就
    public static allCollectionDatas = {};//收藏列表解锁过的收藏 通过达成成就解锁
    public static allVideos = {};//所有看过的视频
    public static curBokData: BookData;
    public static shopDic = {};//所有购买过的商品
    public static lookAchievement = {};//所有查看过的收藏
    public static tipsDick = {};//所有提示过的问题
    public static guideDic = {};
    public static guideJson = {};
    public static main_Img: string = '';
    public static timestamp: number;//存档UNIX时间戳

    public constructor() {
        // UserInfo.chapterDatas = {};
        UserInfo.allCollectionDatas = {};
        UserInfo.achievementDics = {};
        UserInfo.guideDic = {};
        //0，或者undefine表示引导未开始，100表示引导已结束
        UserInfo.guideJson = {
            "buyLock": 0,//首次购买选项引导，发生在问题：0-5;
            "juQing": 0//首次打开剧情界面
        };
        UserInfo.shopDic = {};
        UserInfo.allVideos = {};
        UserInfo.tipsDick = {};
    }

    public static _suipianMoney: number = 0;

    public static get suipianMoney(): number {
        return this._suipianMoney;
    }

    public static set suipianMoney(n: number) {
        this._suipianMoney = n;
        GameCommon.getInstance().setBookData(FILE_TYPE.TASK);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.SUIPIAN_CHANGE));
    }

    private static _curchapter: number = 0;

    public static get curchapter() {
        return UserInfo._curchapter;
    }

    public static set curchapter(n) {
        console.trace('set curchapter ' + n);
        UserInfo._curchapter = n;
    }
}

class BookData {
    public ansWerData: AnswerData;
    public achievementDics = {};//所有成就
    public allCollectionDatas = {};//收藏列表解锁过的收藏 通过达成成就解锁
    //存档ID
    public slotId: number;
    //存档描述
    public title: string;
    public shopDic = {};
    public videoNames;
    public videoDic = {};
    public chapterDatas;//章节存档 通关章节后才会存储该存档
    //data 章节 ,选择的问题ID,答案  1,1,2;这种格式
    //存档UNIX时间戳
    public timestamp: number;
    public main_Img: string = '';
    //问题ID
    public wentiId: number[];
    public curchapter: number = 0;
    public tipsDick = {};
    public videoIds;
    public guideDic = {};
    public guideJson = {};
    // 这个存档内查看过的所有的视频 选择之前的剧情重玩时 不会清空 用来判定这个存档最远玩到过哪里
    public allVideos = {};
    public lookAchievement = {};
    //好感度
    public likes;
    //对应问题选择的答案
    public answerId;

    public constructor() {
        this.chapterDatas = [];
        this.shopDic = {};
        this.wentiId = [];
        this.answerId = {};
        this.allVideos = {};
        this.videoNames = {};
        this.videoDic = {};
        this.videoIds = {};
        this.tipsDick = {};
        this.likes = {};
        this.guideDic = {};
        this.allCollectionDatas = {};
        this.achievementDics = {};
    }

    //当前播放的videoID
    public _curVideoID: string;

    public get curVideoID() {
        return this._curVideoID;
    }

    public set curVideoID(ids) {
        this._curVideoID = ids;
    }
}

class AnswerData {
    //问题ID
    public wentiId;
    public answerId;

    public constructor() {
        this.wentiId = {};
        this.answerId = {};
    }
}

class ChengJiuData {
    //成就ID
    public id: number;
    //存档进度
    public progress: number;
    public canshu: string = '';
    //当前章节ID
    public chapterId: number;
    public iscomplete: number;
    //存档UNIX时间戳
    public timestamp: number;

    public constructor() {
        this.iscomplete = 0;
    }
}

function copyBookData(bookData: BookData) {
    return JSON.parse(JSON.stringify(bookData));
}