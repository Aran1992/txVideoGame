class GameDefine {
    public static BOOKID: number = 110;//平台提供的书籍ID (游戏ID)
    public static MAX_CUNDAGN_NUM: number = 5;
    public static GAME_VIEW_WIDTH: number = 1600;
    public static GAME_VIEW_HEIGHT: number = 900;
    public static VIDEO_WIDTH: number = 1280;// 视频宽
    public static VIDEO_HEIGHT: number = 720;// 视频高
    public static ISMAINVIEW: boolean = false;
    public static EDGE_BEYOND_H: number = 75;//26;// 横向红框与边的距离
    public static EDGE_BEYOND_V: number = 75;//26;// 纵向红框与边的距离
    public static VIDEO_FULL_WIDTH: number = 3840;//全景视频宽
    public static VIDEO_FULL_HEIGHT: number = 1090;//全景视频高
    public static SCALENUMX: number = 1;
    public static SCALENUMY: number = 1;
    public static SCALENUM: number = 1;
    public static SLIDE_RECT = 300;
    public static ROLE_NAME: string[] = ['韩小白', '肖千也', '夏子豪', '肖万寻', '其他', '其他'];
    public static ROLE_HEAD: string[] = [
        "action_msg_head_0_png",// 韩小白
        "action_msg_head_1_png",// 肖千也
        "action_msg_head_2_png",// 夏子豪
        "action_msg_head_3_png",// 肖万寻
        "action_msg_head_4_png",// 江雪
        "action_msg_head_5_png",// 林薄荷
        "action_msg_head_6_png",// 艾黎柯
    ];
    public static GUANGLIPINGZHENG = 600001;//后台配置特价，本地表中配置特价
    public static GUANGLIPINGZHENGEX = 600003;//后台配置原价，本地表中也配置原价
    public static QUANQUANJINXI_ITEM = 103022;//后台配置原价，本地表中也配置原价
    public static SHOP_XINSHOU_ID: number = 600002;
    public static SELF_ROLE_HEAD_INDEX: number = 5;
    public static SHOUCANG_NAME: string[] = ['韩小白', '肖千也', '夏子豪', '肖万寻', '音乐', '其他'];
    public static ROLE_OCCUPATION: string[] = ['主唱', '贝斯手', '吉他手', '键盘手', '音乐', '其他'];
    public static START_JUQING_KUAI: number = 1;
    //角色对应的剧情块的show 1.韩小白 2.肖千也 3.夏子豪 4.肖万寻
    public static ROLE_JUQING_TREE: number[][] = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 31, 32],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 21, 22],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 41, 42]
    ];
    public static CUR_ROLEIDX: number = 0;
    public static SHOP_GOODS_STARTID: number = 100000;
    public static SHOP_CHAPTER_STARTID: number = 10000;
    public static IS_READ_PLAY: boolean = false;//播放器是否准备好
    public static ISFILE_STATE: boolean = false;//是获取存档还是 要读档看视频
    public static IS_SWITCH_VIDEO: boolean = false;//是否切换章节
    public static IS_DUDANG: boolean = false;
    public static VIDEO_VOLUME: number = 1;
    public static CUR_SPEED: number = 1;
    public static CUR_IS_MAINVIEW: boolean = false;
    public static CUR_PLAYER_VIDEO: number = 1;//1是正常跑2是预览商城或收藏
    public static CJ_LEVEL_COLOR: number[] = [0xFFFFFF, 0xffffff, 0x2ba663, 0x2697ff, 0xaf60b6, 0xe3d667];
    public static CJ_LEVEL_NAME: string[] = ['全部', '普通', '简单', '中等', '困难', '究极'];

    public static START_CHAPTER: number = 0;
    public static TEST_ACTION_SCENE_WENTI_ID: number = null;
    public static Currency_Icon = {
        SUIPIAN: "common_suipian_png",
        DIAMOND: "common_zuanshi_png"
    };
    // 控制是否检查章节开启
    public static ENABLE_CHECK_VIP = true;

    public static get sizeScaleX() {// 白鹭UI和视频的尺寸比（横向）
        return size.width / GameDefine.VIDEO_FULL_WIDTH;
    }

    public static get sizeScaleY() {// 白鹭UI和视频的尺寸比（纵向）
        return size.height / GameDefine.VIDEO_FULL_HEIGHT;
    }

    public static get sceneScaleX() {
        return size.width / wind.width;
    }

    public static get sceneScaleY() {
        return size.height / wind.height;
    }
}

/** 故事主角序号  '韩小白', '肖千也', '夏子豪', '肖万寻' */
enum ROLE_INDEX {
    XiaoBai_Han,
    QianYe_Xiao,
    ZiHao_Xia,
    WanXun_Xiao,
    SIZE,
}

enum FILE_TYPE {
    AUTO_FILE = 1,//自动存档
    // FILE1 = 1,//自动存档
    FILE2 = 2,//可选择存档2
    FILE3 = 3,//可选择存档3
    FILE4 = 4,//可选择存档4
    FILE5 = 5,//可选择存档5
    FILE6 = 6,//可选择存档6
    HIDE_FILE = 7,//隐藏存档
    ANSWER_FILE = 8,//选择的答案
    CHENGJIU_FILE = 9,//成就存档
    COLLECTION_FILE = 10,//收藏列表
    GUIDE_TP = 11,//引导存档
    GOODS_FILE = 12,//商品存档（debug版本使用）
    TIMESTAMP = 13,//时间戳
    TASK = 14,//时间戳
    SIZE = 15,
}

enum GOODS_TYPE {
    ITEM = 1,
    SUIPIAN,
    DIAMOND,
}

enum SHOUCANG_SUB_TYPE {
    SHOUCANG_IMG = 1,
    SHOUCANG_VIDEO,
    SHOUCANG_MUSIC,
}
