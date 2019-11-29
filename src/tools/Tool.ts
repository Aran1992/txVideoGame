// 工具类
class Tool {
    private static timerManager = {};
    private static callbacktimeManager = {};
    /***
     * 将HTML文本格式转化成富文本
     */
    private static _htmlParser: egret.HtmlTextParser;
    private static colorMatrix = [
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0, 0, 0, 1, 0
    ];

    public static logClassName(str) {
        // if (SDKManager.isLocal) {
        //     egret.log("className: " + str);
        // }
    }

    public static log(str) {
        // if (SDKManager.isLocal) {
        //     egret.log("log: " + str);
        // }
    }

    public static error(str) {
        egret.error(str);
    }

    public static isAndroid(): boolean {
        if (egret.Capabilities.os == 'Android') {
            return true;
        }
        // if (egret.Capabilities.os == 'IOS' || egret.Capabilities.os == 'Windows PC') {
        // }
        return false;
    }

    public static randomInt(a, b) {
        //return Math.floor(Math.random() * (b - a)) + a;
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    public static randomFloat(a, b) {
        return a + (Math.random() * (b - a));
    }

    public static callback(callback, target, ...param) {
        egret.callLater(callback, target, ...param);
        // callback.call(target, ...param);
    }

    public static callbackTime(callback, target, time, ...param) {
        let timeoutKey = -1;
        if (time > 0) {
            let callbackObj = {intervalId: 0, callback: callback, target: target, time: time, args: param};
            let callbackFunc = (callbackObj): void => {
                this.callback(callbackObj.callback, callbackObj.target, ...callbackObj.args);
                egret.clearTimeout(callbackObj.intervalId);
            };
            callbackObj.intervalId = egret.setTimeout(callbackFunc, this, time, callbackObj);
            timeoutKey = callbackObj.intervalId;
        } else {
            this.callback(callback, target, ...param);
        }
        return timeoutKey;
    }

    public static throwException(logstr = undefined, classz = ExceptionBase) {
        if (logstr) {
            egret.log(logstr);
        }
        throw new classz();
    }

    public static addTimer(callback, thisObject, time: number = 1000) {
        if (!Tool.timerManager[time.toString()]) {
            let timer: egret.Timer = new egret.Timer(time);
            timer.start();
            Tool.timerManager[time.toString()] = timer;
        }
        Tool.callback(callback, thisObject);
        Tool.timerManager[time.toString()].addEventListener(egret.TimerEvent.TIMER, callback, thisObject);
    }

    public static removeTimer(callback, thisObject, time: number = 1000) {
        if (Tool.timerManager[time.toString()]) {
            Tool.timerManager[time.toString()].removeEventListener(egret.TimerEvent.TIMER, callback, thisObject);
        }
    }

    public static removeArrayObj(array: any[], obj) {
        let idx = array.indexOf(obj);
        if (idx >= 0) {
            array.splice(idx, 1);
        }
    }

    // 计算两点间的距离
    public static pDisPoint(x1, y1, x2, y2) {
        return Math.pow(Math.abs((x1 - x2) * (x1 - x2)) + Math.abs((y1 - y2) * (y1 - y2)), 0.5);
    }

    public static angle(startx, starty, endx, endy) {
        let diff_x = endx - startx;
        let diff_y = endy - starty;
        // 返回角度，不是弧度
        return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
    }

    public static angleTo360(startPosx, startPosy, endPosx, endPosy) {
        let angle = this.angle(startPosx, startPosy, endPosx, endPosy);
        if (endPosy >= startPosy) {
            if (endPosx >= startPosx) {
                angle = 180 - angle;
            } else {
                angle = -angle;
            }
        } else {
            if (endPosx >= startPosx) {
                angle = 180 - angle;
            } else {
                angle = 360 - angle;
            }
        }
        return angle;
    }

    /**
     * 获取圆内坐标X
     *
     * @param r
     *            半径
     * @param ao
     *            角度(0-360)
     * @return
     */
    public static getArcX(r, ao) {
        return r * Math.cos(ao * Math.PI / 180);
    }

    /**
     * 获取圆内坐标Y
     *
     * @param r
     *            半径
     * @param ao
     *            角度(0-360)
     * @return
     */
    public static getArcY(r, ao) {
        return r * Math.sin(ao * Math.PI / 180);
    }

    public static isNumber(num: number): boolean {
        if (num != null) return !isNaN(num);
        return false;
    }

    //根据角度和距离计算坐标   angle是从计算机坐标系 0 - 360;
    public static beelinePointByAngle(x: number, y: number, angle: number, distance: number): egret.Point {
        let targetPoint: egret.Point = new egret.Point();
        let radian: number = 0;
        if (angle <= 90) {
            radian = angle * (Math.PI / 180);
            targetPoint.x = x + Math.sin(radian) * distance;
            radian = (90 - angle) * (Math.PI / 180);
            targetPoint.y = y + Math.sin(radian) * distance;
        } else if (angle <= 180) {
            radian = (180 - angle) * (Math.PI / 180);
            targetPoint.x = x + Math.sin(radian) * distance;
            radian = (angle - 90) * (Math.PI / 180);
            targetPoint.y = y - Math.sin(radian) * distance;
        } else if (angle <= 270) {
            radian = (angle - 180) * (Math.PI / 180);
            targetPoint.x = x - Math.sin(radian) * distance;
            radian = (270 - angle) * (Math.PI / 180);
            targetPoint.y = y - Math.sin(radian) * distance;
        } else {
            radian = (Math.max(0, 360 - angle)) * (Math.PI / 180);
            targetPoint.x = x - Math.sin(radian) * distance;
            radian = (angle - 270) * (Math.PI / 180);
            targetPoint.y = y + Math.sin(radian) * distance;
        }
        return targetPoint;
    }

    //根据中心点 + 半径 + 角度 计算圆上的一点
    public static randomPosByDistance(x: number, y: number, distance: number, point: egret.Point = null): egret.Point {
        let angle: number = Math.floor(Math.random() * 360);
        return this.getPosByRadiiAndAngle(x, y, angle, distance, point);
    }

    //解压ZIP
    // public static readZipToXml(xmlName: string): egret.XML {
    //     try {
    //         let zip = new JSZip().load(RES.getRes("model_bin"), new GameJSZipLoadOptions());
    //         let xml = zip.file(xmlName).asText();
    //         xml = xml.replace(/\<?.*?\/?>/, "");
    //         return egret.XML.parse(xml);
    //     } catch (e) {
    //         Tool.log("read zip to xml Error!! name: " + xmlName);
    //         this.throwException();
    //     }
    // }

    //根据角度算出圆上一点
    public static getPosByRadiiAndAngle(x: number, y: number, angle: number, distance: number, point: egret.Point = null): egret.Point {
        if (!point) point = new egret.Point();
        point.x = Math.ceil(x + distance * Math.cos(angle * Math.PI / 180));
        point.y = Math.ceil(y - distance * Math.sin(angle * Math.PI / 180));
        return point;
    }

    //根据起始到终止点的方向 算出距离n的坐标
    public static getPosByTwoPoint(startX: number, startY: number, endX: number, endY: number, distance: number): egret.Point {
        let angle = (-(Math.atan2((endY - startY), (endX - startX))) * (180 / Math.PI));
        angle = angle < 0 ? 360 + angle : angle;
        return this.getPosByRadiiAndAngle(startX, startY, angle, distance);
    }

    //异步加载配置文件内的资源
    public static getResAsync(key: string, compFunc, thisObject: any): void {
        if (RES.hasRes(key)) {
            if (RES.getRes(key)) {
                Tool.callback(compFunc, thisObject);
            } else {
                RES.getResAsync(key, compFunc, thisObject);
            }
        } else {
            Tool.callback(compFunc, thisObject);
        }
    }

    public static readZipToJson(jsonname: string) {
        // let config = RES.getRes('config_json');
        // if (jsonname) {
        //     jsonname = jsonname.replace('.json', '');
        //     return config[jsonname];
        // }
        // return null;
        try {
            if (jsonname) {
                return ModelManager.getInstance().configJson[jsonname];
            }
            return null;
        } catch (e) {
            Tool.log("read zip to json Error!! name: " + jsonname);
            // this.throwException();
        }
    }

    //截屏绘制
    public static onDrawDisObjToTexture(obj: egret.DisplayObject, clipBounds?: egret.Rectangle, scale: number = 1): egret.RenderTexture {
        let rt: egret.RenderTexture = new egret.RenderTexture;
        rt.drawToTexture(obj, clipBounds, scale);
        return rt;
    }

    /**属性对象转数组**/
    public static Object2Ary(param) {
        let arr: number[] = [];
        for (let key in param) {
            arr.push(param[key]);
        }
        return arr;
    }

    /**拼接属性加成字符串提示**/
    public static jointHintAttributeAddStr(arr) {
        let len = arr.length;
        let ret: egret.ITextElement[] = [];
        for (let i = 0; i < len; i++) {
            ret.push({text: arr[i][0], style: {textColor: 0XFFFFFF}});
            ret.push({text: "+" + arr[i][1], style: {textColor: 0X00FF00}});
            ret.push({text: "\n", style: {}});
        }
        ret.pop();
        return ret;
    }

    //时间戳转时间
    public static getCurrDayTime(tim) {
        const date = new Date(tim);
        let month: string | number = date.getMonth() + 1;
        let strDate: string | number = date.getDate();

        if (month <= 9) {
            month = "0" + month;
        }

        if (strDate <= 9) {
            strDate = "0" + strDate;
        }
        return date.getFullYear() + "-" + month + "-" + strDate + " "
            + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    public static formatZero(num, length) {
        let n = (Array(length).join('0') + num).slice(-length);
        return n;
    }

    //把日期格式化为整数
    public static formatTimeDay2Num(time: number = null) {
        if (!time) {
            time = platform.getServerTime();
        }
        const date = time ? new Date(time) : new Date();
        let str = String(date.getFullYear()) + String(Tool.formatZero(date.getMonth() + 1, 2)) + String(Tool.formatZero(date.getDate(), 2))
        return Number(str)
    }

    public static formatAddDay(addDay, time: number = null) {
        return Tool.formatTimeDay2Num(time * 1000 + addDay * (24 * 60 * 60 * 1000));
    }

    public static getCurrTime() {
        return new Date().getTime();
    }

    /**
     * 得到时间格式字符串
     * @param time 秒数
     */
    public static getTimeStr(time: number): string {
        if (time > 0) {
            let hour = Math.floor(time / 3600);
            let minute = Math.floor((time % 3600) / 60);
            let second = Math.floor(time % 60);
            return (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + ":" + (second < 10 ? "0" + second : second);
        }
        return "00:00:00";
    }

    /**
     * 得到时间格式字符串
     * @param time 秒数
     */
    public static getDayHourMinuteTimeStr(time: number): string {
        if (time > 0) {
            let day = Math.floor(time / 86400);
            let hour = Math.floor((time % 86400) / 3600);
            let minute = Math.floor((time % 3600) / 60);
            let second = Math.floor(time % 60);
            return day + "天" + (hour < 10 ? "0" + hour : hour) + "时" + (minute < 10 ? "0" + minute : minute) + "分";
        }
        return "00:00:00";
    }

    /**
     *
     * 时间归为今天0点毫秒数
     *
     */
    public static formatZeroDate(date: Date) {
        let str: string = date.toString();
        let reg = /[0-9]{2}:[0-9]{2}:[0-9]{2}/g;
        str = str.replace(reg, "00:00:00");
        date = new Date(Date.parse(str));
        return date;
    }

    /***
     * 返回一个HTML颜色格式字符串
     */
    public static getHtmlColorStr(desc: string, color: string): string {
        return `<font color='#${color}'>${desc}</font>`;
    }

    public static getHtmlITextElement(htmlTxt: string): egret.ITextElement[] {
        if (!this._htmlParser) {
            this._htmlParser = new egret.HtmlTextParser();
        }
        return this._htmlParser.parse(htmlTxt);
    }

    /**
     * 判断地址是不是IP地址
     * */
    public static isIPUrl(url: string): boolean {
        let reg = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/g;
        let matchStrAry = url.match(reg);
        return matchStrAry && matchStrAry.length > 0;
    }

    /**
     * 向下取整型
     */
    public static toInt(num: number): number {
        let floorvalue: number = Math.floor(num);
        return floorvalue > num ? floorvalue - 1 : floorvalue;
    }

    public static getChineseByImgNum(num): string {
        let chinese_digit: string = '' + (num);
        if (chinese_digit.length == 2) {
            if (chinese_digit[0] == '1') {
                if (chinese_digit[1] != '9')
                    chinese_digit = '9' + chinese_digit[1];
            }
            //  else if (num % 10 == 0) {
            // 	chinese_digit = chinese_digit;
            // } else {
            // 	chinese_digit = chinese_digit[0] + '0' + chinese_digit[1];
            // }
        }
        return chinese_digit;
    }

    // public static getChineseByNum(num: number): string {
    //     if (num <= 0) {
    //         return GameDefine.Chinese_Company_Ary[0];
    //     }
    //     if (num < 10) {
    //         return GameDefine.Chinese_Number_Ary[num];
    //     }
    //     if (num < 20) {
    //         return GameDefine.Chinese_Company_Ary[1] + GameDefine.Chinese_Number_Ary[num % 10];
    //     }
    //     let result = "";
    //     let numStr: string = num.toString();
    //     let length = numStr.length;
    //     let lastChar: number = -1;
    //     let wei = 0;
    //     for (let i = length - 1; i >= 0; --i) {
    //         let char = parseInt(numStr[i]);
    //         if (char == 0) {
    //             if (result.length > 0 && lastChar != 0) {
    //                 result = GameDefine.Chinese_Company_Ary[0] + result;
    //             }
    //         } else {
    //             if (wei > 0) {
    //                 result = GameDefine.Chinese_Number_Ary[char] + GameDefine.Chinese_Company_Ary[wei] + result;
    //             } else {
    //                 result = GameDefine.Chinese_Number_Ary[char] + result;
    //             }
    //         }
    //         wei++;
    //         lastChar = char;
    //     }
    //     return result;

    //转换成汉字格式数字
    public static toChineseNum(num: number): string {
        let chinese_digit: string = '' + num;
        if (chinese_digit.length == 2) {
            if (num < 20) {
                chinese_digit = '0' + (chinese_digit[1] != '0' ? chinese_digit[1] : "");
            } else if (num % 10 == 0) {
                chinese_digit = chinese_digit;
            } else {
                chinese_digit = chinese_digit[0] + '0' + chinese_digit[1];
            }
        }
        return chinese_digit;
    }

    // }
    public static currencyTo(sNum): string {
        let nNum = parseFloat(sNum);
        if (!isNaN(nNum)) {
            return nNum.toFixed(2);
        }
    }

    public static setDisplayGray(disp: egret.DisplayObject, isGray: boolean = true) {
        if (disp) {
            if (isGray) {
                disp.filters = [new egret.ColorMatrixFilter(Tool.colorMatrix)];
            } else {
                disp.filters = [];
            }
        }
    }

    /**
     * 获取video的缓冲进度
     * return 缓存的时间
     */
    public static getVideoCacheProg(video) {
        if (video) {
            let buf = video.buffered;
            if (buf) {
                if (buf.length > 0) {
                    return buf.end(0);
                }
            }
        }
        return -1;
    }

    /**
     * 截取链接里的参数值
     * **/
    public static getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null)
            return r[2].toString();
        return null;
    }

    public static iterObj(obj, handler) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (handler(obj[key], key, obj)) {
                    break;
                }
            }
        }
    }

    //The end
}

class ExceptionBase implements ExceptionInformation {
}

// class GameJSZipLoadOptions implements JSZipLoadOptions { }
