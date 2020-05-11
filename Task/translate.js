
/**
 
[task_local]
0 * * * * translate.js, tag=谷歌中英互译(需quantumult x1.0.8+)

 * 谷歌中英互译，适合简单的中英短语单词互译
*/

const ENword = 'CL Online network Technology Co.LTD'  //翻译内容填入引号内

let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};

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


const word = encodeURI(ENword)
const cnToenUrl = {url: "http://translate.google.cn/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q="+word}
const enTocnUrl = {url: "http://translate.google.cn/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q="+word}

Translate(ENword)
function Translate(ENword) {
   if (/[^a-zA-Z.]+$/.test(ENword))
{
    $task.fetch(cnToenUrl).then(response => { 
      if(/[\u4e00-\u9fa5]/.test(response.body)) {
       const res = response.body.match(/[^\u4e00-\u9fa5]+/g)[0]
       const rest = res.replace(/[\,\[\"]/g, "")
       console.log(`谷歌翻译`+`\n原文:`+ENword+`\n翻译结果: `+ rest)
       $notify(`谷歌翻译  中译英`,`🇨🇳 中文原文:   `+ENword,`🇬🇧 翻译结果 :  `+ rest)
      }
   })
}
  else  {
    $task.fetch(enTocnUrl).then(response => { 
       //console.log(response.body)
      if(/[a-zA-Z]/.test(response.body)) {
        const rest = response.body.match(/[\u4e00-\u9fa5a-zA-Z]+/)
        console.log(`谷歌翻译`+`\n原文: `+ENword+`\n翻译结果: `+ rest)
        $notify(`谷歌翻译 英译中`,`🇬🇧 英文原文:   `+ENword,`🇨🇳 翻译结果 :  `+ rest)
      }
    })
   }
 }
