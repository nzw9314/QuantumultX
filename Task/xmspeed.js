/*
本脚本仅适用于喜马拉雅极速版开启宝箱金币  无签到功能
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域下
2.APP登陆账号后，点击右下角'福利'选项,即可获取Cookie.
3.宝箱y从0点开始，可每隔一小时开启一次，每天最多5次，金币账户与喜马拉雅标准版不同账户
4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
5.转盘无效，仅开启宝箱
仅测试Quantumult x，Surge、Loon自行测试
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
喜马拉雅极速版 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/xmspeed.js,script-update-interval=0

# 获取喜马拉雅极速版 Cookie.
喜马拉雅极速版 = type=http-request,pattern=https:\/\/m\.ximalaya\.com\/speed\/task-center\/account\/coin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/xmspeed.js

~~~~~~~~~~~~~~~~
QX 1.0.6+ :
[task_local]
0 9 * * * xmspeed.js

[rewrite_local]
https:\/\/m\.ximalaya\.com\/speed\/task-center\/account\/coin url script-request-header xmspeed.js
~~~~~~~~~~~~~~~~
# QX or Surge 
[MITM]
hostname = m.ximalaya.com
~~~~~~~~~~~~~~~~

*/

const CookieName ='喜马拉雅极速版'
const CookieKey = 'sy_cookie_xmspeed'
const sy = init()
const cookieVal = sy.getdata(CookieKey);
let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   sign()
}
function GetCookie() {
if ($request && $request.method != 'OPTIONS') {
  const cookieVal = $request.headers['Cookie'];
  sy.log(`cookieVal:${cookieVal}`)
  if (cookieVal) sy.setdata(cookieVal, CookieKey)
  sy.msg(CookieName, `获取Cookie: 成功`, ``)
  sy.done()
 }
}

function sign() {
     const title = `${CookieName}`
   let signurl = {url: 'https://m.ximalaya.com/speed/task-center/config/task-center',
    headers: {Cookie:cookieVal}
     }        
     sy.get(signurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     if (result.total != ""){
      //detail += `金币收益:${result.total}💰`  
      }  
})
    shareurl = {url: 'https://m.ximalaya.com/speed/web-earn/inspire/lottery/action',
    	headers: {Cookie:cookieVal},
        body: ``
    } // 手动抓取请求"body"值无效果
     shareurl.headers['Content-Type'] = 'application/json;charset=utf-8'
    sy.post(shareurl, (error, response, data) => {
      sy.log(`${CookieName}, data: ${data}`)
      let result = JSON.parse(data) 
      if (result.code == 0){
       subTitle += `  每日转盘抽奖:${result.data.awardInfo.name} `
        }
       })
     let cashurl = {url: 'http://m.ximalaya.com/speed/web-earn/account/cash',
     headers: {Cookie:cookieVal}
    }        
     sy.get(cashurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     if (result.balance != ""){
      detail = `现金收益:${result.balance}元💸   `
      } 
     let totalurl = {url: 'https://m.ximalaya.com/speed/task-center/account/coin',
    headers: {Cookie:cookieVal}
     }        
     sy.get(totalurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     if (result.total != ""){
      detail += `金币收益:${result.total}💰`  
      }  

    baoxiangurl = {url: 'https://mobile.ximalaya.com/pizza-category/activity/getAward',
    headers: {Cookie:cookieVal},
    body: `activtyId=baoxiangAward`
    }        
    sy.post(baoxiangurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     if (result.ret == 0){
       subTitle = `开启宝箱成功`
       detail += `\n本时段开启宝箱成功，${result.awardDesc}`
      } 
else if (result.msg == "无法领取，今天领取额度已满"){
       subTitle = `今日宝箱已开完, 请明天再来`
       sy.log(`${result.msg}`)
     }
    else if (result.ret == 3){
       subTitle = `本时段宝箱已开启, 请下个时段继续`
       sy.log(`${result.msg}`)
     }
      sy.msg(title, subTitle, detail)
    })
    })
   })
    sy.done()
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
