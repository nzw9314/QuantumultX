
/**
本任务脚本可查询实时货币汇率及换算
注意澳门元为澳门帕塔卡，香港元为港币，台湾为新台币
～～～～～～～～～～～～～～～～
QX 1.0.6+ :

[task_local]
0 * * * * exchangeRate.js
# Remote 远程
0 10 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/exchangeRate.js, 实时货币换算
～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
实时汇率 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/exchangeRate.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]

cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/exchangeRate.js, enabled=true, tag=实时汇率

-----------------

 */
const frommoney ='美元'          //使用币
const exchangemoney = '人民币'   //换算币
const moneynumb = '1'           //兑换金额

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

code()
function code() {
  return new Promise((resolve, reject) =>{
    const codeurl = {
    url: `http://www.40sishi.com/currency/rate`,
    method: 'GET',
};
    $task.fetch(codeurl).then(response => { 
     let result = JSON.parse(response.body)
   console.log('人民币汇率'+ response.body)
    try{
      for (i= 0; i<result.data.length;i++){
       if(result.data[i].name==frommoney){
         fromcode= result.data[i].code
         fromsymbol=result.data[i].symbol
        };
       if(result.data[i].name==exchangemoney){
         exchangecode= result.data[i].code
         exchangesymbol = result.data[i].symbol
         cnTorate = result.data[i].rate
        }
       }
      rate()
      }
       catch (erro){
        $notify('货币实时汇率换算失败', '请检查币种，币种详情请查看日志', erro)
        console.log(erro)
         }
      resolve()
      })
   })
}

function rate() {
  return new Promise((resolve, reject) =>{
    const rateurl = {
    url: `https://api.jisuapi.com/exchange/single?appkey=177469794ec67f09&currency=${fromcode}`,
    method: 'GET',
};
    $task.fetch(rateurl).then(response => { 
    //console.log('外币汇率'+ response.body)
     let result = JSON.parse(response.body)
  try{
      if (result.msg=="ok"){
        const rated = moneynumb*result.result.list[`${exchangecode}`].rate
         subTitle = frommoney+'兑'+exchangemoney+'汇率: '+ result.result.list[`${exchangecode}`].rate+'元'
         detail = fromsymbol+""+moneynumb+" "+fromcode+' = '+ exchangesymbol+ rated.toFixed(3)+" "+ exchangecode+'\n最后更新: '+result.result.list[`${exchangecode}`].updatetime
       }
        $notify('货币实时汇率 💶 ', subTitle, detail)
      }
      catch (erro){
         $notify('货币实时汇率换算失败', '请检查币种，币种详情请查看日志', erro)
        console.log(erro)
        resolve()
         }
      })
   $done()
   })
}
