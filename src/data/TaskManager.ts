const TASK = [
    {
        "chapter": "序章",
        "common": [
            {
                "name": "拳击女皇",
                "dsc": "完成第一次互动",
                "check": {
                    "type": "question",
                    "qid": 1
                },
                "reward": {
                    "type": "suipian",
                    "num": 100
                },
                "id": "0-0-0"
            },
            {
                "name": "初动心弦",
                "dsc": "完成序章全部互动",
                "check": {
                    "type": "question",
                    "cid": 0
                },
                "reward": {
                    "type": "suipian",
                    "num": 100
                },
                "id": "0-0-1"
            },
            {
                "name": "开始四重奏",
                "dsc": "完成序章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 0
                },
                "reward": {
                    "type": "suipian",
                    "num": 200
                },
                "id": "0-0-2"
            }
        ],
        "luxury": [
            null,
            null,
            {
                "name": "开始四重奏",
                "dsc": "完成序章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 0
                },
                "reward": {
                    "type": "quantao"
                },
                "id": "0-1-2"
            }
        ]
    },
    {
        "chapter": "第一章",
        "common": [
            {
                "name": "和弦初起",
                "dsc": "第一次与夏子豪达成好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "9": 1,
                        "10": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 200
                },
                "id": "1-0-0"
            },
            {
                "name": "追剧新人",
                "dsc": "累计在线观看时长超过25min",
                "check": {
                    "type": "duration",
                    "num": 25
                },
                "reward": {
                    "type": "suipian",
                    "num": 200
                },
                "id": "1-0-1"
            },
            {
                "name": "完成第一章",
                "dsc": "完成第一章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 1
                },
                "reward": {
                    "type": "quantao"
                },
                "id": "1-0-2"
            }
        ],
        "luxury": [
            {
                "name": "合奏前音",
                "dsc": "第一次与肖万寻达成好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "11": 2,
                        "12": 1,
                        "75": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 300
                },
                "id": "1-1-0"
            },
            {
                "name": "追剧新人",
                "dsc": "累计在线观看时长超过25min",
                "check": {
                    "type": "duration",
                    "num": 25
                },
                "reward": {
                    "type": "quantao"
                },
                "id": "1-1-1"
            },
            {
                "name": "完成第一章",
                "dsc": "完成第一章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 1
                },
                "reward": {
                    "type": "quantao"
                },
                "id": "1-1-2"
            }
        ]
    },
    {
        "chapter": "第二章、第三章",
        "common": [
            {
                "name": "中招？！",
                "dsc": "第二章达成死亡结局",
                "check": {
                    "type": "question",
                    "qa": {
                        "18": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 200
                },
                "id": "2-0-0"
            },
            null,
            {
                "name": "追剧老手",
                "dsc": "累计在线观看时长超过35min",
                "check": {
                    "type": "duration",
                    "num": 35
                },
                "reward": {
                    "type": "suipian",
                    "num": 300
                },
                "id": "2-0-2"
            },
            {
                "name": "完成二三章",
                "dsc": "完成第二、三章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 3
                },
                "reward": {
                    "type": "quantao"
                },
                "id": "2-0-3"
            }
        ],
        "luxury": [
            {
                "name": "低音浅拨",
                "dsc": "第一次与肖千也达成好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "16": 1,
                        "17": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 300
                },
                "id": "2-1-0"
            },
            {
                "name": "初啼之声",
                "dsc": "第一次与韩小白达成好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "13": 2,
                        "14": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 300
                },
                "id": "2-1-1"
            },
            {
                "name": "追剧老手",
                "dsc": "累计在线观看时长超过35min",
                "check": {
                    "type": "duration",
                    "num": 35
                },
                "reward": {
                    "type": "quantao",
                    "num": 2
                },
                "id": "2-1-2"
            },
            {
                "name": "完成二三章",
                "dsc": "完成第二、三章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 3
                },
                "reward": "少女情怀·林薄荷",
                "id": "2-1-3"
            }
        ]
    },
    {
        "chapter": "第四章、第五章",
        "common": [
            {
                "name": "乐动心弦",
                "dsc": "成功完成所有音乐游戏",
                "check": {
                    "type": "question",
                    "qa": {
                        "6": 1,
                        "22": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 300
                },
                "id": "3-0-0"
            },
            {
                "name": "完成四五章",
                "dsc": "完成第四章、第五章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 5
                },
                "reward": {
                    "type": "quantao",
                    "num": 2
                },
                "id": "3-0-1"
            }
        ],
        "luxury": [
            {
                "name": "加油你最棒",
                "dsc": "为乐队成长做出三次正确选择",
                "check": {
                    "type": "question",
                    "qa": {
                        "18": 2,
                        "20": 1,
                        "24": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 500
                },
                "id": "3-1-0"
            },
            {
                "name": "完成四五章",
                "dsc": "完成第四章、第五章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 5
                },
                "reward": {
                    "type": "quantao",
                    "num": 3
                },
                "id": "3-1-1"
            }
        ]
    },
    {
        "chapter": "第六章",
        "common": [
            {
                "name": "和弦对拍",
                "dsc": "成功触发与夏子豪的关键事件",
                "check": {
                    "type": "question",
                    "qa": {
                        "34": 2
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 500
                },
                "id": "4-0-0"
            },
            {
                "name": "升温：夏子豪",
                "dsc": "达成两次与夏子豪独处好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "27": 2,
                        "30": 1,
                        "34": 2,
                        "36": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 500
                },
                "id": "4-0-1"
            },
            null,
            null,
            null,
            null,
            {
                "name": "完成第六章",
                "dsc": "完成第六章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 6
                },
                "reward": {
                    "type": "quantao",
                    "num": 3
                },
                "id": "4-0-6"
            }
        ],
        "luxury": [
            {
                "name": "轻甜蜜意",
                "dsc": "成功触发与韩小白的关键事件",
                "check": {
                    "type": "question",
                    "qa": {
                        "34": 4
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 800
                },
                "id": "4-1-0"
            },
            {
                "name": "合音合律",
                "dsc": "成功触发与肖万寻的关键事件",
                "check": {
                    "type": "question",
                    "qa": {
                        "34": 3
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 800
                },
                "id": "4-1-1"
            },
            {
                "name": "起弦转合",
                "dsc": "成功触发与肖千也的关键事件",
                "check": {
                    "type": "question",
                    "qa": {
                        "34": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 800
                },
                "id": "4-1-2"
            },
            {
                "name": "升温：肖万寻",
                "dsc": "达成两次与肖万寻独处好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "27": 3,
                        "31": 2,
                        "33": 2,
                        "34": 3
                    }
                },
                "reward": {
                    "type": "erfan"
                },
                "id": "4-1-3"
            },
            {
                "name": "升温：韩小白",
                "dsc": "达成两次与韩小白独处好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "27": 4,
                        "32": 1,
                        "34": 4,
                        "38": 1,
                        "39": 1
                    }
                },
                "reward": {
                    "type": "erfan"
                },
                "id": "4-1-4"
            },
            {
                "name": "升温：肖千也",
                "dsc": "达成两次与肖千也独处好感度满分",
                "check": {
                    "type": "question",
                    "qa": {
                        "27": 1,
                        "28": 1,
                        "29": 1,
                        "33": 1,
                        "34": 1,
                        "35": 1
                    }
                },
                "reward": {
                    "type": "erfan"
                },
                "id": "4-1-5"
            },
            {
                "name": "完成第六章",
                "dsc": "完成第六章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 6
                },
                "reward": "梦想的模样·林薄荷&夏子豪 SR",
                "id": "4-1-6"
            }
        ]
    },
    {
        "chapter": "第七章、第八章",
        "common": [
            {
                "name": "平行不相交",
                "dsc": "达成默认结局",
                "check": {
                    "type": "question",
                    "qa": {
                        "40": 2,
                        "46": 5,
                        "47": 2
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 800
                },
                "id": "5-0-0"
            },
            {
                "name": "阳光的味道",
                "dsc": "达成五次与夏子豪的关键剧情",
                "check": {
                    "type": "question",
                    "qa": {
                        "19": 1,
                        "26": 4,
                        "27": 2,
                        "34": 2,
                        "50": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 800
                },
                "id": "5-0-1"
            },
            {
                "name": "响起四重奏！",
                "dsc": "成功带领乐队完成三次舞台演出",
                "check": {
                    "type": "question",
                    "qa": {
                        "5": 2,
                        "20": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 500
                },
                "id": "5-0-2"
            },
            null,
            {
                "name": "完成七八章",
                "dsc": "完成第七、八章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 8
                },
                "reward": {
                    "type": "erfan"
                },
                "id": "5-0-4"
            }
        ],
        "luxury": [
            {
                "name": "大橘已定",
                "dsc": "完成所有与江雪的关键剧情",
                "check": {
                    "type": "question",
                    "qa": {
                        "27": 5,
                        "46": 5
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 800
                },
                "id": "5-1-0"
            },
            {
                "name": "皮革的味道",
                "dsc": "达成五次与肖千也的关键剧情",
                "check": {
                    "type": "question",
                    "qa": {
                        "19": 3,
                        "26": 1,
                        "27": 1,
                        "34": 1,
                        "50": 4
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 1000
                },
                "id": "5-1-1"
            },
            {
                "name": "冷风的味道",
                "dsc": "达成五次与肖万寻的关键剧情",
                "check": {
                    "type": "question",
                    "qa": {
                        "19": 4,
                        "26": 2,
                        "27": 3,
                        "34": 3,
                        "50": 3
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 1000
                },
                "id": "5-1-2"
            },
            {
                "name": "甜甜的味道",
                "dsc": "达成五次与韩小白的关键剧情",
                "check": {
                    "type": "question",
                    "qa": {
                        "19": 2,
                        "26": 3,
                        "27": 4,
                        "34": 4,
                        "50": 2
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 1000
                },
                "id": "5-1-3"
            },
            {
                "name": "完成七八章",
                "dsc": "完成第七、八章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 8
                },
                "reward": {
                    "type": "erfan",
                    "num": 3
                },
                "id": "5-1-4"
            }
        ]
    },
    {
        "chapter": "第九章",
        "common": [
            {
                "name": "专属骑士",
                "dsc": "夏子豪全部好感度达成",
                "check": {
                    "type": "question",
                    "rid": 2
                },
                "reward": {
                    "type": "suipian",
                    "num": 1000
                },
                "id": "6-0-0"
            },
            {
                "name": "梦想照进现实",
                "dsc": "为乐队成长做出全部正确选择",
                "check": {
                    "type": "question",
                    "qa": {
                        "5": 2,
                        "8": 1,
                        "18": 2,
                        "20": 1,
                        "41": 1,
                        "47": 1,
                        "48": 2,
                        "53": 1
                    }
                },
                "reward": {
                    "type": "suipian",
                    "num": 1000
                },
                "id": "6-0-1"
            },
            null,
            null,
            {
                "name": "追剧达人",
                "dsc": "累计在线观看时长超过60min",
                "check": {
                    "type": "duration",
                    "num": 60
                },
                "reward": {
                    "type": "erfan",
                    "num": 2
                },
                "id": "6-0-4"
            },
            {
                "name": "完成第九章",
                "dsc": "完成第九章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 9
                },
                "reward": {
                    "type": "suipian",
                    "num": 2000
                },
                "id": "6-0-5"
            }
        ],
        "luxury": [
            {
                "name": "专属王子",
                "dsc": "肖万寻全部好感度达成",
                "check": {
                    "type": "question",
                    "rid": 4
                },
                "reward": {
                    "type": "suipian",
                    "num": 2000
                },
                "id": "6-1-0"
            },
            {
                "name": "专属游侠",
                "dsc": "肖千也全部好感度达成",
                "check": {
                    "type": "question",
                    "rid": 1
                },
                "reward": {
                    "type": "suipian",
                    "num": 2000
                },
                "id": "6-1-1"
            },
            {
                "name": "专属忍者",
                "dsc": "韩小白全部好感度达成",
                "check": {
                    "type": "question",
                    "rid": 0
                },
                "reward": {
                    "type": "suipian",
                    "num": 2000
                },
                "id": "6-1-2"
            },
            {
                "name": "隐藏的祝福",
                "dsc": "成功触发江雪结局",
                "check": {
                    "type": "video",
                    "vid": "V908"
                },
                "reward": "愿星伴你·江雪 ",
                "id": "6-1-3"
            },
            {
                "name": "追剧达人",
                "dsc": "累计在线观看时长超过60min",
                "check": {
                    "type": "duration",
                    "num": 60
                },
                "reward": {
                    "type": "erfan",
                    "num": 3
                },
                "id": "6-1-4"
            },
            {
                "name": "完成第九章",
                "dsc": "完成第九章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 9
                },
                "reward": {
                    "type": "suipian",
                    "num": 5000
                },
                "id": "6-1-5"
            }
        ]
    },
    {
        "chapter": "第十、十一章",
        "common": [
            {
                "name": "夏子豪",
                "dsc": "进入夏子豪结局",
                "check": "第十章判定进入夏子豪",
                "reward": {
                    "type": "suipian",
                    "num": 1000
                },
                "id": "7-0-0"
            },
            null,
            {
                "name": "结局？",
                "dsc": "完成第十、十一章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 11
                },
                "reward": {
                    "type": "erfan",
                    "num": 2
                },
                "id": "7-0-2"
            }
        ],
        "luxury": [
            {
                "name": "肖家兄弟",
                "dsc": "进入肖家兄弟",
                "check": "第十章判定进入肖家兄弟",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                },
                "id": "7-1-0"
            },
            {
                "name": "韩小白",
                "dsc": "进入韩小白结局",
                "check": "第十章判定进入夏子豪",
                "reward": {
                    "type": "suipian",
                    "num": 2000
                },
                "id": "7-1-1"
            },
            {
                "name": "结局？",
                "dsc": "完成第十、十一章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 11
                },
                "reward": [
                    {
                        "type": "yuepu"
                    },
                    {
                        "type": "erfan"
                    }
                ],
                "id": "7-1-2"
            }
        ]
    },
    {
        "chapter": "第十二章",
        "common": [
            {
                "name": "竹马青梅",
                "dsc": "达成夏子豪 TRUE END",
                "check": {
                    "type": "video",
                    "vid": "VX1204"
                },
                "reward": "美梦酩酊·夏子豪",
                "id": "8-0-0"
            },
            {
                "name": "心动碎片",
                "dsc": "成功触发夏子豪彩蛋剧情",
                "check": {
                    "type": "video",
                    "vid": "VX1205"
                },
                "reward": {
                    "type": "erfan",
                    "num": 2
                },
                "id": "8-0-1"
            },
            {
                "name": "梦想终点",
                "dsc": "达成全部默认结局",
                "check": "续命选项全达成",
                "reward": {
                    "type": "suipian",
                    "num": 5000
                },
                "id": "8-0-2"
            },
            null,
            null,
            {
                "name": "大结局",
                "dsc": "完成第十二章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 12
                },
                "reward": {
                    "type": "yuepu"
                },
                "id": "8-0-5"
            }
        ],
        "luxury": [
            {
                "name": "贝斯的弦",
                "dsc": "达成肖千也 TRUE END",
                "check": {
                    "type": "video",
                    "vid": "VY1206"
                },
                "reward": "B面人生·肖千也",
                "id": "8-1-0"
            },
            {
                "name": "琴键与誓言",
                "dsc": "达成肖万寻 TRUE END",
                "check": {
                    "type": "video",
                    "vid": "VW1206"
                },
                "reward": "B面人生·肖万寻",
                "id": "8-1-1"
            },
            {
                "name": "小手拉大手",
                "dsc": "达成韩小白 TRUE END",
                "check": {
                    "type": "video",
                    "vid": "VH1204"
                },
                "reward": "B面人生·韩小白",
                "id": "8-1-2"
            },
            {
                "name": "黑箱效应",
                "dsc": "成功触发韩小白彩蛋剧情",
                "check": {
                    "type": "video",
                    "vid": "VH1115"
                },
                "reward": {
                    "type": "yuepu"
                },
                "id": "8-1-3"
            },
            {
                "name": "好兄弟？！",
                "dsc": "成功触发肖家兄弟彩蛋剧情",
                "check": {
                    "type": "video",
                    "vid": "VW1207"
                },
                "reward": "兄弟？兄弟！·肖千也&肖万寻",
                "id": "8-1-4"
            },
            {
                "name": "大结局",
                "dsc": "完成第十二章剧情",
                "check": {
                    "type": "chapter",
                    "cid": 12
                },
                "reward": [
                    {
                        "type": "CD"
                    },
                    {
                        "type": "yuepu"
                    }
                ],
                "id": "8-1-5"
            }
        ]
    }
];

enum TASK_STATES {
    COMPLETED
}

class TaskManager {
    private tasks: any = {};
    private duration: number = 0;

    public static _instance: TaskManager;

    public static get instance() {
        if (!TaskManager._instance) {
            TaskManager._instance = new TaskManager();
        }
        return TaskManager._instance;
    }

    public init(data) {
        if (data) {
            this.tasks = data.tasks;
            this.duration = data.duration;
        }
    }

    public getTaskStates(): any {
        return {tasks: this.tasks, duration: this.duration};
    }

    public checkQuestionTask() {
        this.iterUncompletedTask(task => {
            if (task.check.type === "question") {
                if (task.check.rid !== undefined && this.isRoleLikeAllCompleted(task.check.rid)
                    || task.check.cid !== undefined && this.isChapterQuestionAllCompleted(task.check.cid)
                    || task.check.qid !== undefined && this.isSelectedWenti(wentiModels[task.check.qid])
                    || task.check.qa !== undefined && this.isQuestionSelectedAnswer(task.check.qa)) {
                    this.completeTask(task.id);
                }
            }
        });
    }

    public checkVideoTask() {
        this.iterUncompletedTask(task => {
            if (task.check.type === "video") {
                if (UserInfo.curBokData.videoDic[task.check.vid]) {
                    this.completeTask(task.id);
                }
            }
        });
    }

    public checkDurationTask() {
        this.iterUncompletedTask(task => {
            if (task.check.type === "duration") {
                if (this.duration >= task.check.num) {
                    this.completeTask(task.id);
                }
            }
        });
    }

    public checkChapterTask() {
        let chapterID = GameCommon.getInstance().getPlayingChapterId();
        for (let i = 0; i < GameDefine.ROLE_JUQING_TREE.length; i++) {
            const list = GameDefine.ROLE_JUQING_TREE[i];
            const index = list.indexOf(chapterID);
            if (index !== -1) {
                chapterID = index;
                break;
            }
        }
        this.iterUncompletedTask(task => {
            if (task.check.type === "chapter") {
                if (chapterID === task.check.cid) {
                    this.completeTask(task.id);
                }
            }
        });
    }

    public addDuration(seconds: number) {
        const old = this.duration;
        this.duration += seconds / 60;
        if (Math.floor(old) !== Math.floor(this.duration)) {
            GameCommon.getInstance().setBookData(FILE_TYPE.TASK);
        }
        this.checkDurationTask();
    }

    private iterUncompletedTask(handler: (task: any) => void) {
        const taskRarity = ["common", "luxury"];
        TASK.forEach(chapter => {
            taskRarity.forEach(rarity => {
                chapter[rarity].forEach(task => {
                    if (task && !this.isTaskCompleted(task.id)) {
                        handler(task);
                    }
                });
            });
        });
    }

    private isUnlockLuxuryTask(): boolean {
        return ShopManager.getInstance().getItemNum(GameDefine.GUANGLIPINGZHENG) > 0;
    }

    private isTaskCompleted(tid): boolean {
        return this.tasks[tid] >= TASK_STATES.COMPLETED;
    }

    private isRoleLikeAllCompleted(rid: number): boolean {
        // 遍历每个加这个好感的答案 同一个问题内有多个都加的话 找到其中最大的那些 如果其中有一个答案没有回答 那么就是失败了
        return !this.some(answerModels, answers => {
            // 找到这个问题里面会增加这个人好感 且是最高好感的选项
            let roleLikeAnswers = [];
            for (const key in answers) {
                if (answers.hasOwnProperty(key)) {
                    const answer = answers[key];
                    const roleLike = this.getRoleLike(answer, rid);
                    if (roleLike !== 0) {
                        if (roleLikeAnswers.length === 0) {
                            roleLikeAnswers.push(answer);
                        } else {
                            const finalRoleLike = this.getRoleLike(roleLikeAnswers[0], rid);
                            if (finalRoleLike < roleLike) {
                                roleLikeAnswers = [answer];
                            } else if (finalRoleLike === roleLike) {
                                roleLikeAnswers.push(answer);
                            }
                        }
                    }
                }
            }
            // 有这个好感的选项 但是没有完成其中任意选项 那么就说明没有全部完成 可以直接结束了
            if (roleLikeAnswers.length !== 0 && !roleLikeAnswers.some(answer => this.isSelectedAnswer(answer))) {
                return true;
            }
        });
    }

    private getRoleLike(answer: Modelanswer, rid: number): number {
        return parseInt(answer.like.split(",")[rid]);
    }

    private isSelectedAnswer(answer: Modelanswer): boolean {
        return parseInt(UserInfo.curBokData.answerId[answer.qid]) === answer.ansid;
    }

    private isSelectedWenti(wenti: Modelwenti): boolean {
        const answer = UserInfo.curBokData.answerId[wenti.id];
        return answer !== undefined && answer !== "";
    }

    private isChapterQuestionAllCompleted(cid: number): boolean {
        return !this.some(wentiModels, wenti => {
            if (wenti.chapter === cid) {
                // 如果某个未选中 那么就代表没有全部选中 就可以结束了
                return !this.isSelectedWenti(wenti);
            }
        });
    }

    private isQuestionSelectedAnswer(qa: any): boolean {
        for (const q in qa) {
            if (qa.hasOwnProperty(q)) {
                let answer: Modelanswer = this.getAnswerByQidAndAid(parseInt(q), qa[q]);
                if (!this.isSelectedAnswer(answer)) {
                    return false;
                }
            }
        }
        return true;
    }

    private getAnswerByQidAndAid(qid: number, aid: number): Modelanswer {
        return answerModels[qid][aid - 1];
    }

    private completeTask(tid) {
        this.tasks[tid] = TASK_STATES.COMPLETED;
        GameCommon.getInstance().setBookData(FILE_TYPE.TASK).then(r => r);
    }

    private getWatchedDuration(): number {
        return 0;
    }

    private some(obj, handler) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (handler(obj[key])) {
                    return true;
                }
            }
        }
        return false;
    }
}