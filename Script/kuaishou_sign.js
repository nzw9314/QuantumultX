/*
本脚本仅适用于快手极速版签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.APP登陆账号后，点击'钱包',即可获取Cookie.

仅测试Quantumult x，Surge、Loon自行测试
by Macsuny
感谢
@Chavy
@Nobyda
本人为初学者，专业问题请向大佬请教
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou_sign.js

# 获取快手极速版 Cookie.
http-request https:\/\/nebula\.kuaishou\.com\/rest\/n\/nebula\/activity\/earn\/overview,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou_cookie.js
~~~~~~~~~~~~~~~~
QX 1.0.5 :
[task_local]
0 9 * * * kuaishou_sign.js

[rewrite_local]
# Get bilibili cookie. QX 1.0.5(188+):
https:\/\/nebula\.kuaishou\.com\/rest\/n\/nebula\/activity\/earn\/overview url script-request-header kuaishou_cookie.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = nebula.kuaishou.com
~~~~~~~~~~~~~~~~

*/
const cookieName ='快手极速版'
const cookieKey = 'cookie_ks'
const sy = init()
const cookieVal = sy.getdata(cookieKey);
sign()
function sign() {
    let url = {url:'https://nebula.kuaishou.com/rest/n/nebula/sign/sign',
    headers: {Cookie:cookieVal}}
    url.headers['Connection'] = `keep-alive`
    url.headers['Content-Type'] = `application/json;charset=UTF-8`
    url.headers['Accept'] = `application/json, text/plain, */* `
    url.headers['Host'] = `nebula.kuaishou.com`
    url.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ksNebula/2.1.3.65`
    url.headers['Accept-Language'] = `zh-cn`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    url.headers['Referer'] = `https://nebula.kuaishou.com/nebula/task/earning?source=timer&layoutType=4`
    sy.get(url, (error, response, data) => {
      //sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
     const title = `${cookieName}`
      let subTitle = ``
      let detail = ``
      if (result.result == 1) {
        subTitle = `${result.data.toast}`
        detail = `获取金币收益: ${result.data.totalCoin}`
      } else if(result.result == 10007){
        subTitle = `签到结果: ${result.error_msg}`
      } else if(result.result == 10901){
        subTitle = `签到结果: 今日已签到`
        detail = '(说明：获取当日收益情况请看日志)'
      } else {
        subTitle = `签到结果: 未知`
      } 
      sy.log(subTitle)
     sy.msg(title,subTitle,detail)
  })
}

cash()
function cash() {
    let url1 = {url:'https://nebula.kuaishou.com/rest/n/nebula/activity/earn/overview',
    headers: {Cookie:cookieVal}}
    url1.headers['Connection'] = `keep-alive`
    url1.headers['Content-Type'] = `application/json;charset=UTF-8`
    url1.headers['Accept'] = `application/json, text/plain, */* `
    url1.headers['Host'] = `nebula.kuaishou.com`
    url1.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ksNebula/2.1.3.65`
    url1.headers['Accept-Language'] = `zh-cn`
    url1.headers['Accept-Encoding'] = `gzip, deflate, br`
    url1.headers['Referer'] = `https://nebula.kuaishou.com/nebula/task/earning?source=timer&layoutType=4` 
    sy.get(url1, (error, response, data) => {
      //sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      let detail = ``
     if (result.result == 1){
       detail = `现金收益:${result.data.allCash}元 金币收益: ${result.data.totalCoin}`
      } else if(result.result == 10901){
        detail = `现金收益:${result.data.allCash}元 金币收益: ${result.data.totalCoin}`
      } else {
        detail = `现金收益:${result.data.allCash}元 金币收益: ${result.data.totalCoin} `
      } 
      sy.log(detail)
     //sy.msg(title, subTitle, detail)
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