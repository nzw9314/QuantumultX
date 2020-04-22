/*
本脚本仅适用于快手极速版签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下
2.APP登陆账号后，点击'红包',即可获取Cookie.
3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
仅测试Quantumult x，Surge、Loon自行测试
by Macsuny
感谢
@Chavy
@Nobyda
~~~~~~~~~~~~~~~~

Surge 4.0 :
[Script]
kuaishou.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js,script-update-interval=0

# 获取快手极速版 Cookie.
dianshijia.js = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js,type=http-request,pattern=https:\/\/nebula\.kuaishou\.com\/rest\/n\/nebula\/activity\/earn\/overview

~~~~~~~~~~~~~~~~
QX 1.0.7+ :
[task_local]
0 9 * * * kuaishou.js

[rewrite_local]
# Get bilibili cookie. QX 1.0.5(188+):
https:\/\/nebula\.kuaishou\.com\/rest\/n\/nebula\/activity\/earn\/overview url script-request-header kuaishou.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = nebula.kuaishou.com
~~~~~~~~~~~~~~~~

*/
const CookieName = '快手极速版'
const cookieKey = 'cookie_ks'
const sy = init()
const cookieVal = sy.getdata(cookieKey);

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   GetCookie()
} else {
   sign()
}

function GetCookie() {
  if ($request.headers) {
    var CookieValue = $request.headers['Cookie'];
    
    if (sy.getdata(cookieKey) != (undefined || null)) {
      if (sy.getdata(cookieKey) != CookieValue) {
        var cookie = sy.setdata(CookieValue, cookieKey);
        if (!cookie) {
          sy.msg("更新" + CookieName + "Cookie失败‼️", "", "");
          sy.log(`[${CookieName}] 获取Cookie: 失败`);
        } else {
          sy.msg("更新" + CookieName + "Cookie成功 🎉", "", "");
          sy.log(`[${CookieName}] 获取Cookie: 成功, Cookie: ${CookieValue}`)
        }
      }
    } else {
      var cookie = sy.setdata(CookieValue, cookieKey);
      if (!cookie) {
        sy.msg("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        sy.msg("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    sy.msg("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
sy.done()
}

function sign() {
   return new Promise((resolve, reject) => {
	 let signurl = {
		url: 'https://nebula.kuaishou.com/rest/n/nebula/sign/sign',
		headers: {Cookie: cookieVal}}
    sy.get(signurl, (error, response, data) => {
      sy.log(`${CookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if(result.result == 10007){
        subTitle = `签到结果: ${result.error_msg}`
        sy.msg(CookieName,subTitle,'')}
        sy.log(`错误代码: ${result.result}, 返回信息: ${result.error_msg}`)
       })
     earn()
     info() 
     resolve()
   })
 }
function earn() {
   return new Promise((resolve, reject) => {
    earnurl = {
		url: 'https://nebula.kuaishou.com/rest/n/nebula/sign/query',
		headers: {Cookie: cookieVal}}
    sy.get(earnurl, (error, response, data) => {
      sy.log(`${CookieName}, data: ${data}`)
      let result = JSON.parse(data)
     if (result.data.nebulaSignInPopup.button == '立即签到'){ 
       subTitle = `签到成功: ${result.data.nebulaSignInPopup.subTitle}, ${result.data.nebulaSignInPopup.title}`
      resolve()
      } else if (result.data.nebulaSignInPopup.button == '好的'){ 
       detail = `重复签到: ${result.data.nebulaSignInPopup.subTitle}, ${result.data.nebulaSignInPopup.title}`
      resolve()
      }
     })
    })
  }
function info() {
   return new Promise((resolve, reject) => {
    let reurl = {url:'https://nebula.kuaishou.com/rest/n/nebula/activity/earn/overview',
    headers: {Cookie:cookieVal}}
	sy.get(reurl, (error, response, data) =>{
	sy.log(`${CookieName}, data: ${data}`)
	let result = JSON.parse(data) 
	if (result.result == 1) {
	     subTitle = `现金收益: 💵${result.data.allCash}元    金币收益: 💰${result.data.totalCoin}`
          resolve()
			} 
         sy.msg(CookieName,subTitle,detail)
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
