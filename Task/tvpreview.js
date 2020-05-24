/* 
本脚本为电视节目预告
1.数据从电视家数据库获取
2.常用卫视代码
北京: btv1 | 湖南: hunan | 浙江: zhejiang
河南: henan| 江苏: jiangsu|广东: guangdong
更多电视台请参加电视家网络列表
3.需要更换电视台的，建议本地使用
4.借鉴sazs34大佬的smart脚本
～～～～～～～～～～～～～～～～
QX 1.0.6+ :

[task_local]
1 10 * * * tvpreview.js

～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
tvpreview.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js, enabled=true, tag=电视节目预告

-----------------

By Macsuny                   
*/
const c = 'cctv8'  //修改电视台

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

const method = "GET"
       d = new Date();
       M = d.getMonth()+1, D = d.getDate();
       h = ("0" + (d.getHours())).slice(-2);            
       m = ("0" + (d.getMinutes())).slice(-2);
      weekday = new Array(7);
      weekday[0]="星期日";
      weekday[1]="星期一";
      weekday[2]="星期二";
      weekday[3]="星期三";
      weekday[4]="星期四";
      weekday[5]="星期五";
      weekday[6]="星期六";
  n = weekday[d.getDay()]
const wurl = {
    url: "http://api.cntv.cn/epg/epginfo?serviceId=cbox&c="+c,
}
   $task.fetch(wurl).then(response => {    
   try { 
      let result = JSON.parse(response.body)                              
const title = `${result[`${c}`].channelName}频道节目  ` + M +'月'+ D +'日' + n + h +':'+ m
      detail = `正在播出: ${result[`${c}`].isLive}\n${result[`${c}`].program[0].showTime} ${result[`${c}`].program[0].t}`
      for (i = 1; i < result[`${c}`].program.length; i++)
       {      
         detail += `\n${result[`${c}`].program[i].showTime} ${result[`${c}`].program[i].t}`
       }
      var l = result[`${c}`].program.length
      if (l > 1) {
       for (i = 0; i < l && result[`${c}`].program[i].showTime.split(':')[0] < result[`${c}`].program[l-1].showTime.split(':')[0]; i++)
       { 
        if (result[`${c}`].liveSt == result[`${c}`].program[i].st)
         {   
         subTitle = `即将播出: ${result[`${c}`].program[i+1].t}`
         } 
        }
      }
    else {
      subTitle = ``
       }      
    $notify(title, subTitle, detail)
   console.log(title+`\n`+subTitle+`\n`+detail)
  } catch(err) { 
      $notify("无此频道节目信息或者台号错误❌", "请检查后重试", err)
     console.log(err)
    }
$done()
 })
