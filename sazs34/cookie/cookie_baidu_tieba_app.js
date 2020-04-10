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

TieBa Checkin Get Cookie.

About the author:
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
When TieBa app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

Note that the following config is only a local script configuration, please put this scripts into Quantumult X/Script, and the cookie script only works for TieBa apps in china apple store

[rewrite_local]
https?:\/\/c\.tieba\.baidu\.com\/c\/s\/login url script-response-body TieBa_GetCookie_QX.js

# MITM = c.tieba.baidu.com

*/

var headerCookie = $request.headers["Cookie"];

if (headerCookie) {
  if ($prefs.valueForKey("CookieTB") != undefined) {
    if ($prefs.valueForKey("CookieTB") != headerCookie) {
      if (headerCookie.indexOf("BDUSS") != -1) {
        var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
        if (!cookie) {
          $notify("更新贴吧Cookie失败‼️", "", "");
        } else {
          $notify("更新贴吧Cookie成功 🎉", "", "");
        }
      }
    }else{
      console.log("更新贴吧签到cookie", "没有变化,无需更新")
    }
  } else {
    if (headerCookie.indexOf("BDUSS") != -1) {
      var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
      if (!cookie) {
        $notify("首次写入贴吧Cookie失败‼️", "", "");
      } else {
        $notify("首次写入贴吧Cookie成功 🎉", "", "");
      }
    }
  }
}
$done({})