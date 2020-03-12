/*

> 感谢 [@barry](https://t.me/barrymchen) 编写
> 
> 感谢 [@GideonSenku](https://github.com/GideonSenku) 对代码优化
本脚本是在以上两位的基础上进行的小小修改
本脚本仅适用于京东到家签到及获取鲜豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.APP登陆账号后，点击主页'签到',即可获取Cookie.

仅测试Quantumult x，Surge、Loon自行测试
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js
# 获取京东到家 Cookie.
http-request https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj_cookie.js
~~~~~~~~~~~~~~~~
QX 1.0.5 :
[task_local]
0 9 * * * jddj.js

[rewrite_local]
# Get jddj cookie. QX 1.0.5(188+):
https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin url script-request-header jddj_cookie.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = daojia.jd.com
~~~~~~~~~~~~~~~~

task
0 0 * * * jddj.js

*/
const CookieName = '京东到家'
const CookieKey = 'chen_cookie_dj'
const sy = init()
GetCookie();

function GetCookie() {
  if ($request.headers) {
    var CookieValue = $request.headers['Cookie'];
    
    if (sy.getdata(CookieKey) != (undefined || null)) {
      if (sy.getdata(CookieKey) != CookieValue) {
        var cookie = sy.setdata(CookieValue, CookieKey);
        if (!cookie) {
          sy.msg("更新" + CookieName + "Cookie失败‼️", "", "");
          sy.log(`[${CookieName}] 获取Cookie: 失败`);
        } else {
          sy.msg("更新" + CookieName + "Cookie成功 🎉", "", "");
      sy.log(`[${CookieName}] 获取Cookie: 成功, Cookie: ${CookieValue}`)
        }
      }
    } else {
      var cookie = sy.setdata(CookieValue, CookieKey);
      if (!cookie) {
        sy.msg("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        sy.msg("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    sy.msg("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
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
sy.done()