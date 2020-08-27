
const cookieName = '工商e生活签到'
const bodyKey = 'chen_body_icbc'
const headerKey = 'chen_header_icbc'
const chen = init()
let bodyVal = chen.getdata(bodyKey)
let headerVal = chen.getdata(headerKey)
sign()
function sign() {
    let url = {url: 'https://icbc1.wlphp.com:8444/js/api/index/signIn',headers: JSON.parse(headerVal),body: bodyVal}
    chen.post(url, (error, response, data) => {
        chen.log(`${cookieName}, data: ${data}`)
        const result = JSON.parse(data)
        let subTitle = ``
        let detail = ``
        if (result.RETCODE == 0) {
          subTitle = `签到结果: 成功`
          detail = `获得：${result.DATA.signinScore}积分，总积分${result.DATA.score},连续签到：${result.DATA.signinDays}天`
        } else if (result.RETCODE == 81000004) {
          subTitle = `签到结果: 成功 (重复签到)`
          detail = `说明: ${result.DATA}`
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
