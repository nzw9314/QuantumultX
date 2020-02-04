const cookieName = '网易新闻'
const cookieKey = 'chavy_cookie_neteasenews'
const bodyKey = 'chavy_body_neteasenews'
const chavy = init()
let cookieVal = null
let bodyVal = `trashId=%7B%22id_ver%22%3A%22IOS_1.2.1%22%2C%22rk%22%3A%2204puJuwt24ZfVun6xM%2FspLSL7uxFhDDgWEAssh%2F8pMDRRcYXCKExX3tcQIUIzoFCRxGE1lROimtFoYdCP4UFOoVMz6VyA2c2RGl6sw1DZ8FSSs%2BeGq1hOofEMN%2BjuUPP%2F5IB8hgXRxPTYs2RDnGf8u1JxLh8aAPmujBIbI88Sr4%3D%22%2C%22rdata%22%3A%228E8htZCY85Va4ezNR1%2B1%2BSR%2FBRxb%2FzkdSSDVetJcEZ2vKf%2BAr4b1Sz9o%2FuBN%2Ft1fZtY%2Fbgp0gBsScrcbLj3KkphOFPgogIcJWyHT5UWc2AOhT6nQORBuJItNVqi3nrZGA%2BJnQXnNOABtrM2FtO6x8YkBC442IaDiPo891EIiyfTeqp3oVnce%2BJNtybdWdZyi0yje0cRp2ZxiQnvTH01SNyueujV9LcgKu6CrECXuObkZoAJALusQZdAb4EyayNlLhx%2FF9X1M9%2BEXlavYrm9yLXZuyRzv1lvbmJZ%2BvqL5sNwWiw5Va6Y9685xm7H9TH0UmtJPMsb643sblIi3UrbCtbxkpydjBIszNl02ZZ7u%2Bpxo8T%2FdmOOcce%2BKJrMqzENK%22%2C%22datatype%22%3A%22aimt_datas%22%7D`

if ($request.body) {
  cookieVal = JSON.stringify($request.headers)
  bodyVal = bodyVal ? bodyVal : $request.body
} else {
  // ([^:]*):\s(.*)\n?
  // cookieObj['$1'] = $request.headers['$1']\n
  const cookieObj = {}
  cookieObj['Content-Length'] = `699`
  cookieObj['isDirectRequest'] = `1`
  cookieObj['X-NR-Trace-Id'] = $request.headers['X-NR-Trace-Id']
  cookieObj['User-DA'] = $request.headers['User-DA']
  cookieObj['Accept-Encoding'] = `gzip, deflate, br`
  cookieObj['Connection'] = `keep-alive`
  cookieObj['Content-Type'] = `application/x-www-form-urlencoded`
  cookieObj['User-D'] = $request.headers['User-D']
  cookieObj['User-U'] = $request.headers['User-U']
  cookieObj['User-id'] = $request.headers['User-id']
  cookieObj['User-C'] = $request.headers['User-C']
  cookieObj['User-tk'] = $request.headers['User-tk']
  cookieObj['User-N'] = $request.headers['User-N']
  cookieObj['User-Agent'] = `NewsApp/64.1 iOS/13.3 (iPhone10,1)`
  cookieObj['Host'] = `c.m.163.com`
  cookieObj['User-LC'] = $request.headers['User-LC']
  cookieObj['Accept-Language'] = `zh-cn`
  cookieObj['Accept'] = `*/*`
  cookieObj['User-L'] = $request.headers['User-L']
  cookieVal = JSON.stringify(cookieObj)
}

if (cookieVal) {
  chavy.setdata(cookieVal, cookieKey)
  chavy.msg(`${cookieName}`, '获取Cookie: 成功', '')
  chavy.log(`[${cookieName}] 获取Cookie: 成功, cookie: ${cookieVal}`)
} else {
  chavy.msg(`${cookieName}`, '获取Cookie: 失败', '说明: 未知')
  chavy.log(`[${cookieName}] 获取Cookie: 失败, cookie: ${cookieVal}`)
}
if (bodyVal) {
  chavy.setdata(bodyVal, bodyKey)
  chavy.msg(`${cookieName}`, '获取Body: 成功', '')
  chavy.log(`[${cookieName}] 获取Body: 成功, body: ${bodyVal}`)
} else {
  if (isQuanX()) {
    chavy.msg(`${cookieName}`, '获取Body: 失败', '说明: QuanX用户请手动抓包 body 参数!')
    chavy.log(`[${cookieName}] 获取Body: 失败, 说明: QuanX用户请手动抓包 body 参数!`)
  } else {
    chavy.msg(`${cookieName}`, '获取Body: 失败', '说明: 未知')
    chavy.log(`[${cookieName}] 获取Body: 失败, body: ${bodyVal}`)
  }
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
chavy.done()
