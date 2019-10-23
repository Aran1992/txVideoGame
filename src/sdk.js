var callbackId = 0;

function getCallbackName(callback) {
    callbackId++;
    var name = ['gameHelper', 'story', callbackId].join('_');
    window[name] = function (json) {
        delete window[name];
        callback(json);
    };
    return name;
}

function dealCommonResult(json, callback) {
    typeof callback == "function" && callback(json);
}


/**
 * 分享
 * @param bookId
 * @param title
 * @param summary
 * @param icon
 * @param url
 * @param platForm
 */
function share(bookId, title, summary, icon, url, platForm) {
    if (window.StoryPlatform && typeof StoryPlatform.share != 'undefined') {
        StoryPlatform.share(bookId, title, summary, icon, url, platForm);
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.share) {
        window.webkit.messageHandlers.share.postMessage({bookId: bookId, title: title, summary: summary, icon: icon, url: url, platForm: platForm});
    }
}

/**
 * 消耗商品
 * @param bookId
 * @param saleId
 * @param currentSlotId
 * @param num
 * @param callback
 */
function takeOffBookValue(bookId, saleId, currentSlotId, num, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.takeOffBookValue != 'undefined') {
        StoryPlatform.takeOffBookValue(bookId, saleId, currentSlotId, num, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.takeOffBookValue) {
        window.webkit.messageHandlers.takeOffBookValue.postMessage({
            bookId: bookId, saleId: saleId, currentSlotId: currentSlotId, num: num, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 退出webview
 */
function exit() {
    if (window.StoryPlatform && typeof StoryPlatform.finishPage != 'undefined') {
        StoryPlatform.finishPage();
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.finishPage) {
        window.webkit.messageHandlers.finishPage.postMessage({});
    }
}

/**
 * 功能接口
 * @param uri
 * @param params
 */
function openButton(uri, params, finishRead) {
    if (window.StoryPlatform && typeof StoryPlatform.openButton != 'undefined') {
        StoryPlatform.openButton(uri, params);
        if(finishRead){
            exit();
        }
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openButton) {
        var finish="NO";
        if(finishRead){
            finish="YES";
        }
        window.webkit.messageHandlers.openButton.postMessage({uri: uri, params: params, finishRead:finish });
    }
}

/**
 * 存档接口
 * @param bookId
 * @param slotId
 * @param currentSlotId
 * @param title
 * @param externParam
 * @param callback
 */
function saveBookHistory(bookId, slotId, currentSlotId, title, externParam, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.saveBookHistory != 'undefined') {
        StoryPlatform.saveBookHistory(bookId, slotId, currentSlotId, title, externParam, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.saveBookHistory) {
        window.webkit.messageHandlers.saveBookHistory.postMessage({
            bookId: bookId, slotId: slotId, currentSlotId: currentSlotId, title: title, externParam: externParam, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 删档
 * @param bookId
 * @param slotId
 * @param callback
 */
function deleteBookHistory(bookId, slotId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.deleteBookHistory != 'undefined') {
        StoryPlatform.deleteBookHistory(bookId, slotId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.deleteBookHistory) {
        window.webkit.messageHandlers.deleteBookHistory.postMessage({
            bookId: bookId, slotId: slotId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取某个存档id的商业化数值
 * @param bookId
 * @param currentSlotId
 * @param callback
 */
function getBookValues(bookId, slotId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookValues != 'undefined') {
        StoryPlatform.getBookValues(bookId, slotId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookValues) {
        window.webkit.messageHandlers.getBookValues.postMessage({
            bookId: bookId, slotId: slotId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取某个存档id的某个物品的商业化数值
 * @param bookId 书籍id
 * @param slotId 存档id
 * @param saleId 物品id
 * @param callback 回调函数
 */
function getBookValue(bookId, slotId, saleId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookValue != 'undefined') {
        StoryPlatform.getBookValue(bookId, slotId, saleId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookValue) {
        window.webkit.messageHandlers.getBookValue.postMessage({
            bookId: bookId, slotId: slotId, saleId: saleId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取最新的存档信息
 * @param bookId
 */
function getBookLastHistory(bookId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookLastHistory != 'undefined') {
        StoryPlatform.getBookLastHistory(bookId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookLastHistory) {
        window.webkit.messageHandlers.getBookLastHistory.postMessage({
            bookId: bookId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 购买物品
 * @param bookId
 * @param saleId
 * @param num
 * @param currentSlotId
 * @param callback
 */
function buyGoods(bookId, saleId, num, currentSlotId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.buyGoods != 'undefined') {
        StoryPlatform.buyGoods(bookId, saleId, num, currentSlotId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buyGoods) {
        window.webkit.messageHandlers.buyGoods.postMessage({
            bookId: bookId, saleId: saleId, num: num, currentSlotId: currentSlotId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取存档列表
 * @param bookId
 * @param callback
 */
function getBookHistoryList(bookId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookHistoryList != 'undefined') {
        StoryPlatform.getBookHistoryList(bookId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookHistoryList) {
        window.webkit.messageHandlers.getBookHistoryList.postMessage({
            bookId: bookId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取单条存档记录
 * @param bookId
 * @param callback
 */
function getBookHistory(bookId, slotId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookHistory != 'undefined') {
        StoryPlatform.getBookHistory(bookId, slotId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookHistory) {
        window.webkit.messageHandlers.getBookHistory.postMessage({
            bookId: bookId, slotId: slotId, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取基本信息
 * @param callback
 */
function getUserInfo(callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getUserInfo != 'undefined') {
        var result = StoryPlatform.getUserInfo();
        var retObj = JSON.parse(result);
        if (retObj.code == 0) {
            var dataObj = JSON.parse(retObj.data);
            dataObj.data = JSON.parse(retObj.data);
            callback(dataObj);
        } else {
            callback({});
        }
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getUserInfo) {
        window.webkit.messageHandlers.getUserInfo.postMessage({
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * web主动通知app
 * @param event
 * @param json
 */
function triggerEventNotify(event, json) {
    if (window.StoryPlatform && typeof StoryPlatform.onEventNotify != 'undefined') {
        StoryPlatform.onEventNotify(event, json);
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.onEventNotify) {
        window.webkit.messageHandlers.onEventNotify.postMessage({event: event, json: json});
    }
}


/**
 * 主动上报接口
 * @param bookId 书籍id
 * @param event 事件
 * @param param 自定义参数
 * @param callback 回调函数
 */
function report(bookId, event, param, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.report != 'undefined') {
        console.log(bookId, event, param);
        StoryPlatform.report(bookId, event, param, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.report) {
        window.webkit.messageHandlers.report.postMessage({
            bookId: bookId, event: event, param: param, callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取用户平台数据
 * @param callback
 */
function getUserPlatformData(callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getUserPlatformData != 'undefined') {
        StoryPlatform.getUserPlatformData(getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getUserPlatformData) {
        window.webkit.messageHandlers.getUserPlatformData.postMessage({
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取单本书籍消费统计数据
 * @param bookId
 * @param callback
 */
function getBookConsumeData(bookId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookConsumeData != 'undefined') {
        StoryPlatform.getBookConsumeData(bookId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookConsumeData) {
        window.webkit.messageHandlers.getBookConsumeData.postMessage({
            bookId: bookId,
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 获取单本书籍的业务数据
 * @param bookId
 * @param eventId
 * @param optionIds
 * @param callback
 */
function getBusinessEventData(bookId, eventId, optionIds, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBusinessEventData != 'undefined') {
        StoryPlatform.getBusinessEventData(bookId, eventId, optionIds, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBusinessEventData) {
        window.webkit.messageHandlers.getBusinessEventData.postMessage({
            bookId: bookId,
            eventId: eventId,
            optionIds: optionIds,
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 主动上报选项
 * @param bookId 书籍id
 * @param eventId 事件id
 * @param optionId 选项id
 * @param callback
 */
function reportBusinessEvent(bookId, eventId, optionId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.reportBusinessEvent != 'undefined') {
        StoryPlatform.reportBusinessEvent(bookId, eventId, optionId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.reportBusinessEvent) {
        window.webkit.messageHandlers.reportBusinessEvent.postMessage({
            bookId: bookId,
            eventId: eventId,
            optionId: optionId,
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}


/**
 * 显示toast
 * @param bookId 书籍id
 * @param tipId 管理端配置的id
 */
function showTips(bookId, tipId) {
    if (window.StoryPlatform && typeof StoryPlatform.showTips != 'undefined') {
        StoryPlatform.showTips(bookId, tipId);
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.showTips) {
        window.webkit.messageHandlers.showTips.postMessage({
            bookId: bookId,
            tipId: tipId
        });
    }
}

/**
 * 获取书籍阅读配置信息
 * @param bookId
 * @param callback
 */
function getReadConfigInfo(bookId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.reportBusinessEvent != 'undefined') {
        StoryPlatform.getReadConfigInfo(bookId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getReadConfigInfo) {
        window.webkit.messageHandlers.getReadConfigInfo.postMessage({
            bookId: bookId,
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 拉取简要书籍信息
 * @param bookId
 */
function getBookAbsInfo(bookId, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.getBookAbsInfo != 'undefined') {
        StoryPlatform.getBookAbsInfo(bookId, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getBookAbsInfo) {
        window.webkit.messageHandlers.getBookAbsInfo.postMessage({
            bookId: bookId,
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 敏感词检测
 * @param bookId
 */
function checkDirtyText(text, callback) {
    if (window.StoryPlatform && typeof StoryPlatform.checkDirtyText != 'undefined') {
        StoryPlatform.checkDirtyText(text, getCallbackName(function(json) {
            dealCommonResult(json, callback);
        }));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.checkDirtyText) {
        window.webkit.messageHandlers.checkDirtyText.postMessage({
            text: text,
            callback: getCallbackName(function(json) {
                dealCommonResult(json, callback);
            })
        });
    }
}

/**
 * 分享图片接口
 * @param bookId
 */
function shareImage(bookId, imageData) {
    if (window.StoryPlatform && typeof StoryPlatform.shareImage != 'undefined') {
        StoryPlatform.shareImage(bookId, imageData);
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.shareImage) {
        window.webkit.messageHandlers.shareImage.postMessage({
            bookId: bookId,
            imageData: imageData
        });
    }
}

function sendRequest(params, callback) {
    params.callback = getCallbackName(function (json) {
        dealCommonResult(json, callback);
    });
    if (window.StoryPlatform && typeof StoryPlatform.sendRequest != 'undefined') {
        StoryPlatform.sendRequest(JSON.stringify(params));
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.sendRequest) {
        window.webkit.messageHandlers.sendRequest.postMessage(params);
    }
}


/**
 * 异步获取js
 * @param url
 * @param callback
 */
function getScript(url, callback) {
    var head = document.getElementsByTagName('head')[0],
        js = document.createElement('script');

    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    js.setAttribute('crossorigin', 'anonymous');

    head.appendChild(js);

    //执行回调
    var callbackFn = function () {
        if (typeof callback === 'function') {
            callback();
        }
    };

    if (document.all) { //IE
        js.onreadystatechange = function () {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                callbackFn();
            }
        }
    } else {
        js.onload = function () {
            callbackFn();
        }
    }
}

window.onload = function () {
    getScript('https://cdn.ravenjs.com/3.26.4/raven.min.js', function(){
        Raven.config('https://14cef114f33b47f08cee380f27639b2f@report.url.cn/sentry/1220', {
                maxUrlLength: 2000,
                whitelistUrls: [
                    /cdn\.story\.qq\.com/
                ]
            }).install();
    });
};