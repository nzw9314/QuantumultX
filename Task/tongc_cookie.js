/*
此脚本只适用于quanx
rewrite_local
#同程签到
^https:\/\/wx\.17u\.cn\/wcsign\/sign\/GetSignInfo url script-request-body tongc_cookie.js
task_local
0 0 * * * tongc_sign.js
0 1 * * * tongc_info.js
host= wx.17u.cn
cookie获取方式，
登录同程艺龙微信小程序，我的->签到，即可获得cookie，
不完美版本，并没有解决异步问题，所以将签到和获取更多签到信息的脚本分开，
对于明日签到可以获得里程数和实际明日签到可以获得里程数不一致的问题，
是因为会员等级的加成，如果你是尊贵的，高贵的，十分耐斯的黑鲸会员/白金会员
就可以获得*3的神奇加成（手动滑稽）

感谢
@nobyda
@chavy
*/
const chen = init()
const cookieName = '同程小程序签到'
const bodyKey = 'chen_body_tc'
const headerKey = 'chen_header_tc'
const urlKey = 'chen_url_tc'
  if ($request.url.match(/\/sign\/GetSignInfo/)) {
    const urlVal = $request.url
    const bodyVal = $request.body
    const headerVal = JSON.stringify($request.headers)
    //const bodyVal = JSON.stringify($request.body)
    if(bodyVal )chen.setdata(bodyVal, bodyKey)
    if (urlVal) chen.setdata(urlVal, urlKey)
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
