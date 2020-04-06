/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
*/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion

/*
[task_local]
0 9 * * * sign_baidu_tieba_v2.js
 */
var cookieVal = $prefs.valueForKey("CookieTB");
var useParallel = 0; //0自动切换,1串行,2并行(当贴吧数量大于30个以后,并行可能会导致QX崩溃,所以您可以自动切换)
var singleNotifyCount = 30; //想签到几个汇总到一个通知里,这里就填几个(比如我有13个要签到的,这里填了5,就会分三次消息通知过去)
var process = {
    total: 0,
    result: [
        // {
        //     bar:'',
        //     level:0,
        //     exp:0,
        //     errorCode:0,
        //     errorMsg:''
        // }
    ]
};
var url_fetch_sign = {
    url: "https://tieba.baidu.com/mo/q/newmoindex",
    headers: {
        "Content-Type": "application/octet-stream",
        Referer: "https://tieba.baidu.com/index/tbwise/forum",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366"
    }
};
var url_fetch_add = {
    url: "https://tieba.baidu.com/sign/add",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.7.5.650 Mobile"
    },
    body: ""
};

function signTieBa() {
    if (!cookieVal) {
        $notify("贴吧签到", "签到失败", "未获取到cookie");
        return;
    }
    $task.fetch(url_fetch_sign).then(response => {
        // $notify("贴吧签到", "贴吧列表", response.body);
        var body = JSON.parse(response.body);
        var isSuccessResponse = body && body.no == 0 && body.error == "success" && body.data.tbs;
        if (!isSuccessResponse) {
            $notify("贴吧签到", "签到失败", (body && body.error) ? body.error : "接口数据获取失败");
            return;
        }
        process.total = body.data.like_forum.length;
        if (body.data.like_forum && body.data.like_forum.length > 0) {
            if (useParallel == 1 || (useParallel == 0 && body.data.like_forum.length >= 30)) {
                signBars(body.data.like_forum, body.data.tbs, 0);
            } else {
            for (const bar of body.data.like_forum) {
                    signBar(bar, body.data.tbs);
                }
            }
        } else {
            $notify("贴吧签到", "签到失败", "请确认您有关注的贴吧");
            return;
        }
    }, reason => {
        $notify("贴吧签到", "签到失败", "未获取到签到列表");
    });
}

function signBar(bar, tbs) {
    if (bar.is_sign == 1) { //已签到的,直接不请求接口了
        process.result.push({
            bar: `${bar.forum_name}`,
            level: bar.user_level,
            exp: bar.user_exp,
            errorCode: 9999,
            errorMsg: "已签到"
        });
        checkIsAllProcessed();
    } else {
        url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
        $task.fetch(url_fetch_add).then(response => {
            try {
                var addResult = JSON.parse(response.body);
                if (addResult.no == 0) {
                    process.result.push({
                        bar: bar.forum_name,
                        errorCode: 0,
                        errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                    });
                } else {
                    process.result.push({
                        bar: bar.forum_name,
                        errorCode: addResult.no,
                        errorMsg: addResult.error
                    });
                }
            } catch (e) {
                $notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
            }
            checkIsAllProcessed();
        }, reason => {
            process.result.push({
                bar: bar.forum_name,
                errorCode: 999,
                errorMsg: '接口错误'
            });
            checkIsAllProcessed();
        });
    }
}

function signBars(bars, tbs, index) {
    //$notify("贴吧签到", `进度${index}/${bars.length}`, "");
    if (index >= bars.length) {
        //$notify("贴吧签到", "签到已满", `${process.result.length}`);
        checkIsAllProcessed();
    } else {
        var bar = bars[index];
        if (bar.is_sign == 1) { //已签到的,直接不请求接口了
            process.result.push({
                bar: `${bar.forum_name}`,
                level: bar.user_level,
                exp: bar.user_exp,
                errorCode: 9999,
                errorMsg: "已签到"
            });
            signBars(bars, tbs, ++index);
        } else {
            url_fetch_add.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
            $task.fetch(url_fetch_add).then(response => {
                try {
                    var addResult = JSON.parse(response.body);
                    if (addResult.no == 0) {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: 0,
                            errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                        });
                    } else {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: addResult.no,
                            errorMsg: addResult.error
                        });
                    }
                } catch (e) {
                    $notify("贴吧签到", "贴吧签到数据处理异常", JSON.stringify(e));
                }
                signBars(bars, tbs, ++index)
            }, reason => {
                process.result.push({
                    bar: bar.forum_name,
                    errorCode: 999,
                    errorMsg: '接口错误'
                });
                signBars(bars, tbs, ++index);
            });
        }
    }
}

function checkIsAllProcessed() {
    //$notify("贴吧签到", `最终进度${process.result.length}/${process.total}`, "");
    if (process.result.length != process.total) return;
    for (var i = 0; i < Math.ceil(process.total / singleNotifyCount); i++) {
        var notify = "";
        var spliceArr = process.result.splice(0, singleNotifyCount);
        var notifySuccessCount = 0;
        for (const res of spliceArr) {
            if (res.errorCode == 0 || res.errorCode == 9999) {
                notifySuccessCount++;
            }
            if (res.errorCode == 9999) {
                notify += `【${res.bar}】已经签到，当前等级${res.level},经验${res.exp}
`;
            } else {
                notify += `【${res.bar}】${res.errorCode==0?'签到成功':'签到失败'}，${res.errorCode==0?res.errorMsg:('原因：'+res.errorMsg)}
`;
            }
        }
        $notify("贴吧签到", `签到${spliceArr.length}个,成功${notifySuccessCount}个`, notify);
    }
}

signTieBa()
$done()