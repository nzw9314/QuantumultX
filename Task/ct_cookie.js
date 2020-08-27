/*
此脚本只适用于quanx
rewrite_local
#携程小程序
^https:\/\/m\.ctrip\.com\/restapi\/soa2\/16575\/getUserInfo url script-request-body ct_cookie.js
task_local
0 0 * * * tc_sign.js
host= m.ctrip.com 
cookie获取方式，
登录携程微信小程序，我的特权，不能正常获取，重新登录一次，都尝试几次
感谢：@nobyda
@chavy

*/

const chen = init()
const cookieName = '携程小程序签到'
const bodyKey = 'chen_body_xc'
const headerKey = 'chen_header_xc'
const urlKey = 'chen_url_xc'
  if ($request.url.match(/16575\/getUserInfo/)) {
    const urlVal = $request.url
    //const bodyVal = $request.body
    const headerVal = JSON.stringify($request.headers)
    const bodyVal = JSON.stringify($request.body)
    if (urlVal) chen.setdata(urlVal, urlKey)
    if (bodyVal) chen.setdata(bodyVal, bodyKey)
    if (headerVal) chen.setdata(headerVal, headerKey)
    chen.msg(`${cookieName}`, '获取Cookie: 成功 ', '')
    chen.log(`❕${cookieName} 获取Cookie: 成功, url: ${urlVal}`)
    chen.log(`❕ ${cookieName} 获取Cookie: 成功, body: ${bodyVal}`)
    chen.log(`❕ ${cookieName} 获取Cookie: 成功, header: ${headerVal}`)
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
