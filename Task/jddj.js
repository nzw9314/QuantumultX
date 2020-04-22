/*

> 感谢 [@barry](https://t.me/barrymchen) 编写
> 感谢 [@GideonSenku](https://github.com/GideonSenku) 对代码优化
本脚本仅适用于京东到家签到及获取鲜豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.APP登陆账号后，点击首页'签到',即可获取Cookie.

##3月25日10点修改:增加鲜豆信息，cookie、task二合一

仅测试Quantumult x，Surge、Loon自行测试
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
jddj.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js,script-update-interval=0

# 获取京东到家 Cookie.
jddj.js = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js,type=http-request,pattern=https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin

~~~~~~~~~~~~~~~~
QX 1.0.5+ :
[task_local]
0 9 * * * jddj.js

[rewrite_local]
# Get jddj cookie. QX 1.0.5(188+):
https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin url script-request-header jddj.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = daojia.jd.com
~~~~~~~~~~~~~~~~

task
0 0 * * * jddj.js

*/

const CookieName ='京东到家'
const CookieKey = 'sy_cookie_dj'
const sy = init()
const cookieVal = sy.getdata(CookieKey);

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   GetCookie()
} else {
   sign()
}
function GetCookie() {
  if ($request.headers) {
    var CookieValue = $request.headers['Cookie'];
    
    if (sy.getdata(CookieKey) != (undefined || null)) {
      if (sy.getdata(CookieKey) != CookieValue) {
        var cookie = sy.setdata(CookieValue, CookieKey);
        if (!cookie) {
          sy.msg("更新" + CookieName + "Cookie失败‼️", "", "");
          sy.log(`[${CookieName}] 获取Cookie: 失败`);
        } else {
          sy.msg("更新" + CookieName + "Cookie成功 🎉", "", "");
          sy.log(`[${CookieName}] 获取Cookie: 成功, Cookie: ${CookieValue}`)
        }
      }
    } else {
      var cookie = sy.setdata(CookieValue, CookieKey);
      if (!cookie) {
        sy.msg("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        sy.msg("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    sy.msg("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
}

function sign() {
     const title = `${CookieName}`
      let subTitle = ``
      let detail = ``
    let url = {url: 'https://daojia.jd.com/client?functionId=signin%2FuserSigninNew&body=%7B%7D',
    headers: { Cookie:cookieVal}}   
    sy.get(url, (error, response, data) => {
      sy.log(`${CookieName}, data: ${data}`)
      let result = JSON.parse(data)
       if (result.code == 0) {
        //subTitle = `签到结果: 成功🎉`
       //detail = `获取鲜豆：${result.result.points}`      
      }
    })
      let url2 = {url: `https://daojia.jd.com/client?functionId=signin%2FshowSignInMsgNew&body=%7B%7D`, headers: { Cookie:cookieVal}}   
      sy.get(url2, (error, response, data) => {
      sy.log(`${CookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.code != 0) {
      subTitle = `签到结果: 失败`
      detail = `说明: ${result.msg}`
      sy.msg(title, subTitle, detail)
    } else if (result.result.userInfoResponse.hasSign == true) {    
    for (let i = 0; i < result.result.sevenDaysRewardResponse.items.length; i++){
    if (result.result.sevenDaysRewardResponse.items[i].day == result.result.sevenDaysRewardResponse.alreadySignInDays){
        subTitle = `签到结果: 重复 ‼️`
        detail = `鲜豆总计：${result.result.userInfoResponse.points}   今日获取鲜豆:  ${result.result.sevenDaysRewardResponse.items[i].points}\n已签到${result.result.sevenDaysRewardResponse.alreadySignInDays}天，${result.result.sevenDaysRewardResponse.tomorrowSingInRewardText}`
        }
      }
     } else if (result.result.userInfoResponse.hasSign == false)   {    
       for (let i = 0; i < result.result.sevenDaysRewardResponse.items.length; i++){
          if (result.result.sevenDaysRewardResponse.items[i].day == result.result.sevenDaysRewardResponse.alreadySignInDays){
        subTitle = `签到结果: 成功🎉`
        detail = `鲜豆总计：${result.result.userInfoResponse.points}   今日获取鲜豆:  ${result.result.sevenDaysRewardResponse.items[i].points}\n已签到${result.result.sevenDaysRewardResponse.alreadySignInDays}天，${result.result.sevenDaysRewardResponse.tomorrowSingInRewardText}`
        }
       } 
     }       
     sy.msg(title, subTitle, detail)
     sy.log(`返回结果代码:${result.code}，返回信息:${result.msg}`)
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
