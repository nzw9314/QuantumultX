
/*
本脚本仅适用于电视家签到
获取Cookie方法:
1.将下方[rewrite_local]和[Task]地址复制的相应的区域
下，
2.APP登陆账号后，点击首页'每日签到',即可获取Cookie.

仅测试Quantumult x，Surge、Loon自行测试
By Macsuny
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
# 获取电视家 Cookie.
http-request http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin\?accelerate=0&ext=0&ticket=,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
~~~~~~~~~~~~~~~~

QX 1.0.6+ :
[task_local]
0 9 * * * dianshijia.js

[rewrite_local]

http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin\?accelerate=0&ext=0&ticket= url script-request-header dianshijia.js
~~~~~~~~~~~~~~~~

*/
const cookieName = '电视家 📺'
const signurlKey = 'sy_signurl_dsj'
const signheaderKey = 'sy_signheader_dsj'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
  } else {
   sign()
  }
function GetCookie() {
const requrl = $request.url
if ($request && $request.method != 'OPTIONS') {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(cookieName, `获取Cookie: 成功`, ``)
  sy.done
 }
}
function sign() {
    const title = `${cookieName}`
    let subTitle = ``
    let detail = ``
return new Promise((resolve, reject) =>
   {
      const url = { url: signurlVal, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) =>
      {
    sy.log(`${cookieName}, data: ${data}`)
    const result = JSON.parse(data)
    if (result.errCode == 0) 
         {
         subTitle = `签到结果: 成功🎉`
         detail = `已签到 ${result.data.conDay}天，获取金币${result.data.reward[0].count}，获得奖励${result.data.reward[1].name}`
         sy.msg(title, subTitle, detail)
         } 
    else if  (result.errCode == 6)
         {
          subTitle = `签到结果: 失败`
          detail = `原因: ${result.msg}`
          sy.msg(title, subTitle, detail)
         }
         sy.done()     
       })
            
    let url1 = { url: `http://api.gaoqingdianshi.com/api/coin/info`, headers: JSON.parse(signheaderVal)}
    sy.get(url1, (error, response, data) => {
    //sy.log(`${cookieName}, data: ${data}`)
    const result = JSON.parse(data)
    if (result.errCode == 0) {
      subTitle = `签到结果: 重复`
      detail = `金币收益: 💰${result.data.coin}`
      }
    let url2 = { url: `http://api.gaoqingdianshi.com/api/cash/info`, headers: JSON.parse(signheaderVal)}
    sy.get(url2, (error, response, data) => {
  //  sy.log(`${cookieName}, data: ${data}`)
    const result = JSON.parse(data)
    if (result.errCode == 0) {
      detail += `\n现金收益: 💴${result.data.amount/100}元`
      } 
   })      
      let url3 = { url: `http://act.gaoqingdianshi.com/api/v4/sign/get`, headers: JSON.parse(signheaderVal)}
    sy.get(url3, (error, response, data) => {
    sy.log(`${cookieName}, data: ${data}`)
    const result = JSON.parse(data)
    if (result.errCode == 0) 
  {
     var d = `${result.data.currentDay}`
     for (i=0; i < result.data.recentDays.length;i++)      
    {
       if (d == result.data.recentDays[i].day)
       {  
       
        for (r=0; r < result.data.recentDays[i].rewards.length;r++)
          {      
           if (r > 0 )
                 {
            subTitle += `     已连续签到${d}天`
            detail += `\n今日获取奖励: ${result.data.recentDays[i].rewards[1].name} `
                 }  
         
           }   //  今日奖励情况

       for ( s = 0; s < result.data.recentDays[i+1].rewards.length;s++)
          {  
            if ( s > 0)
                 {
              detail += `\n明日奖励: ${result.data.recentDays[i+1].rewards[1].name}`
                 }  
                    // 明日奖励情况
                }
              sy.msg(title, subTitle, detail)
             }                  
          }
        }
     })
   })
 })
}


function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
sy.done()
