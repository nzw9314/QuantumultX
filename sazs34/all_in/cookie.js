//#region 基础配置
const config = {
    baidu_tieba_h5: {
        cookie: 'CookieTB',
        name: '百度贴吧Cookie-H5',
        Host: 'tieba.baidu.com'
    },
    baidu_tieba_app: {
        cookie: 'CookieTB',
        name: '百度贴吧Cookie-App',
        Host: 'c.tieba.baidu.com'
    },
    iqiyi_app: {
        cookie: 'CookieQY',
        name: '爱奇艺Cookie-App',
        Host: 'passport.iqiyi.com'
    },
    _52pojie: {
        cookie: 'CookieWA',
        name: '吾爱破解Cookie',
        Host: 'www.52pojie.cn'
    },
    netease_music: {
        cookie: 'CookieWY',
        name: '网易云音乐Cookie',
        Host: 'music.163.com'
    },
    v2ex: {
        cookie: 'CookieV2ex',
        name: 'V2EX-Cookie',
        Host: 'www.v2ex.com'
    },
    jd: {
        cookie: 'CookieJD',
        name: '京东Cookie',
        Host: 'www.v2ex.com'
    }
}
//#endregion

//#region smartjs,用于兼容Surge和QuantumultX

/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task !== undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient !== undefined; //判断当前运行环境是否是surge
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

//#endregion

//#region 查重方法,用于检测Cookie值是否发生变化以便于更新Cookie

let updateCookie = (config, newVal) => {
    if (!newVal || !config) return;
    var historyCookie = $prefs.valueForKey(config.cookie);
    if (historyCookie) {
        if (historyCookie != newVal) {
            if ($prefs.setValueForKey(newVal, config.cookie)) {
                $notify(`更新 ${config.name} 成功🎉`, "", "无需禁用脚本，仅Cookie改变时才会重新获取");
            } else {
                $notify(`更新 ${config.name} 失败!!!`, "", "");
            }
        } else {
            //cookie未发生变化,不执行更新
        }
    } else {
        if ($prefs.setValueForKey(newVal, config.cookie)) {
            $notify(`首次写入 ${config.name} 成功🎉`, "", "无需禁用脚本，仅Cookie改变时才会重新获取");
        } else {
            $notify(`首次写入 ${config.name} 失败!!!`, "", "");
        }
    }
}

//#endregion

//#region 正式开始写入cookie
let request = $request;
var isValidRequest = request && request.header && request.headers.Cookie
if (!isValidRequest) {
    $done({});
    return;
}
let headers = request.headers;
//#region 百度贴吧-H5
if (headers.Host == config.baidu_tieba_h5.Host) {
    var regex = /(^|)BDUSS=([^;]*)(;|$)/;
    var headerCookie = headers.Cookie.match(regex)[0];
    updateCookie(config.baidu_tieba_h5, headerCookie);
}
//#endregion
//#region 百度贴吧-APP
if (headers.Host == config.baidu_tieba_app.Host) {
    var regex = /(^|)BDUSS=([^;]*)(;|$)/;
    var headerCookie = headers.Cookie.match(regex)[0];
    updateCookie(config.baidu_tieba_app, headerCookie);
}
//#endregion
//#region 爱奇艺-APP
if (headers.Host == config.iqiyi_app.Host) {
    var regex = /authcookie=([A-Za-z0-9]+)/;
    var headerCookie = regex.exec($request.url)[1];
    updateCookie(config.iqiyi_app, headerCookie);
}
//#endregion
//#region 吾爱破解
if (headers.Host == config._52pojie.Host) {
    var headerCookie = headers.Cookie;
    updateCookie(config._52pojie, headerCookie);
}
//#endregion
//#region 网易云音乐
if (headers.Host == config.netease_music.Host) {
    var headerCookie = headers.Cookie;
    updateCookie(config.netease_music, headerCookie);
}
//#endregion
//#region V2EX
if (headers.Host == config.v2ex.Host) {
    var headerCookie = headers.Cookie;
    updateCookie(config.v2ex, headerCookie);
}
//#endregion
//#region 京东
if (headers.Host == config.jd.Host) {
    var headerCookie = headers.Cookie;
    updateCookie(config.jd, headerCookie);
}
//#endregion
//#endregion

$done({});