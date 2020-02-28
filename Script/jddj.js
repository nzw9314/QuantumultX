const cookieName ='京东到家'
const cookieKey = 'chen_cookie_dj'
const chen = init()

const cookieVal = 'cookie自己抓'
sign()
function sign() {
    let url = {url: 'https://daojia.jd.com/client?functionId=signin%2FuserSigninNew&body=%7B%7D',
    headers: { Cookie:cookieVal}}
    url.headers['Connection'] = `keep-alive`
    url.headers['Content-Type'] = `application/x-www-form-urlencoded;charset=UTF-8`
    url.headers['Accept'] = `*/*`
    url.headers['Host'] = `daojia.jd.com`
    url.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 application=JDJR-App&deviceld=D6B42097-7660-464C-AE01-E5A3CFB2F788&clientType=ios`
    url.headers['Accept-Language'] = `zn-ch`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    url.headers['Referer'] = `https://daojia.jd.com/taroh5/h5dist/`
   
    chen.get(url, (error, response, data) => {
      chen.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      
      const title = `${cookieName}`
      let subTitle = ``
      let detail = ``
    
      if (result.code == 0) {
        subTitle = `签到结果:   成功`
        detail = `获取鲜豆：${result.result.points}`
      } else if(result.code==201){
        subTitle = `签到结果: 失败`
        detail = `说明: 未知`
      } else {
        subTitle = `签到结果: 重复签到`
        detail = `说明: ${result.msg}`
      }
      chen.msg(title, subTitle, detail)
      chen.log(`${result.totalBalanceAmount}`)
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