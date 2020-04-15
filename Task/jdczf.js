const cookieName ='京东成长分'
const cookieKey = 'chen_cookie_jingdong'
const chen = init()
let cookieVal = chen.getdata(cookieKey)
sign()
function sign() {
    let url = {url: 'https://ms.jr.jd.com/gw/generic/bt/h5/m/doSign?',headers: { Cookie:cookieVal}}
    url.headers['Origin'] = 'https://btfront.jd.com'
    url.headers['Connection'] = `keep-alive`
    url.headers['Content-Type'] = `application/x-www-form-urlencoded`
    url.headers['Accept'] = `application/json, text/plain, */*`
    url.headers['Host'] = `ms.jr.jd.com`
    url.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 mediaCode=SFEXPRESSAPP-iOS-ML`
    url.headers['Accept-Language'] = `en-us`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    chen.get(url, (error, response, data) => {
      const result = JSON.parse(data)
      const title = `${cookieName}`
      let subTitle = ``
      let detail = ``
    
      if (result.resultCode == 0 && result.resultMsg == '操作成功') {
        subTitle = `签到结果: 成功`
      } else if (result.resultCode == 3) {
          subTitle = `签到结果: 失败,需要重新获得cookie`
      } else {
        subTitle = `签到结果: 未知`
        detail = `说明: ${result.resultrMsg}`
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
  
