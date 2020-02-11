/*
mimt:m.ctrip.com

https:\/\/m\.ctrip\.com\/restapi\/soa2\/14946\/json\/userBaseInfo url script-request-header ctrip_cookie.js

0 0 * * * ctrip.js
cookie获取
需要在携程app内获得
点击"我的",然后点击"我的积分",再点击下面的"签到.任务"即可
@nobyda
@chavy
感谢两位大佬



*/
const cookieName ='携程旅行'
const cookieKey = 'cookie_ctrip'
const chen = init()
let cookieVal = chen.getdata(cookieKey)
sign()
function sign() {
    let url = {url: 'https://m.ctrip.com/restapi/soa2/14946/json/saveDailyBonus?',headers: { Cookie:cookieVal}}
    url.headers['Origin'] = 'https://m.ctrip.com'
    url.headers['Connection'] = `keep-alive`
    url.headers['Content-Type'] = `application/json`
    url.headers['Accept'] = `application/json`
    url.headers['Host'] = `m.ctrip.com`
    url.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 mediaCode=SFEXPRESSAPP-iOS-ML`
    url.headers['Accept-Language'] = `zh-cn`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    url.headers['https://m.ctrip.com/webapp/membercenter/task?isHideNavBar=YES&from_native_page=1']
    chen.get(url, (error, response, data) => {
      const result = JSON.parse(data)
      const title = `${cookieName}`
      let subTitle = ``
      let detail = ``
    
      if (result.resultcode == 0){
        subTitle = `签到结果: 成功,总积分${result.integrated}`
      } else {
        subTitle = `签到结果: 未知`
        detail = `说明: ${result.resultmessage}`
      }
      chen.msg(title, subTitle, detail)
    })
    chen.done()
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
  
