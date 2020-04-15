
const cookieName = '携程小程序签到'
const bodyKey = 'chen_body_xc'
const headerKey = 'chen_header_xc'
const chen = init()
let bodyVal = chen.getdata(bodyKey)
let headerVal = chen.getdata(headerKey)
sign()
function sign() {
    let url = {url: 'https://m.ctrip.com/restapi/soa2/16575/signin',headers: JSON.parse(headerVal),body: JSON.parse(bodyVal)}
    chen.post(url, (error, response, data) => {
        chen.log(`${cookieName}, data: ${data}`)
        const result = JSON.parse(data)
        let subTitle = ``
        let detail = ``
        if (result.errcode == 0) {
          subTitle = `签到结果: 成功`
          detail = `说明: ${result.errmsg}`
        } else if (result.errcode == 3) {
          subTitle = `签到结果: 成功 (重复签到)`
          detail = `说明: ${result.errmsg}`
        } else {
          subTitle = `签到结果: 失败`
          detail = `说明: ${result.errmsg}`
        }
        chen.msg(cookieName, subTitle, detail)
        chen.done()
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
  chen.done()
