/*
参考chavyleung和NobyDa的写法

//饿了么

> 代码已同时兼容 Surge & QuanX, 使用同一份签到脚本即可


## 配置 (Surge)

```properties
[MITM]
h5.ele.me

[Script]
http-response ^https:\/\/h5\.ele\.me\/restapi\/eus\/v\d\/current_user script-path=https://raw.githubusercontent.com/nzw9314/QuantumultX/master/Script/elemGetCookies.js
cron "0 5 0 * * *" script-path=https://raw.githubusercontent.com/nzw9314/QuantumultX/master/Script/elemSign.js
```

## 配置 (QuanX)

```properties
[MITM]
h5.ele.me

[rewrite_local]

^https:\/\/h5\.ele\.me\/restapi\/eus\/v\d\/current_user url script-response-body elemGetCookies.js



[task_local]
5 0 * * * elemSign.js
```

## 说明

1. 先把h5.ele.me`加到`[MITM]`
2. 再配置重写规则:
   - Surge: 把两条远程脚本放到`[Script]`
   - QuanX: 把`elemGetCookies.js`和`elemSign.js`传到`On My iPhone - Quantumult X - Scripts` (传到 iCloud 相同目录也可, 注意要打开 quanx 的 iCloud 开关)
3. 打开 APP, 访问下`我的`>`签到领红包`(左上角)
4. 系统提示: `获取Cookie: 成功` （如果不提示获取成功, 尝试杀进程再进`个人`>`每日签到`）
5. 最后就可以把第 1 条脚本注释掉了

> 第 1 条脚本是用来获取 cookie 的, 用浏览器访问一次获取 cookie 成功后就可以删掉或注释掉了, 但请确保在`登录成功`后再获取 cookie.

> 第 2 条脚本是签到脚本, 每天`00:05:00`执行一次.
*/


const cookieName = '饿了么'
const cookieKey = 'cookie_elem'
const sy = init()
var cookieVal =sy.getdata(cookieKey);
// var regx=/(USERID=)(\d+)(;)/;
// cookieVal.replace(regx,'$2');
var endurl='/sign_in'
sign()

function sign() {
  const timestamp = Date.parse(new Date())
  let url = { url: `https://h5.ele.me/restapi/member/v2/users/`, headers: { Cookie: cookieVal } }
  if(cookieVal==undefined||cookieVal=="0"||cookieVal==null){
	   sy.msg(cookieName, "未获取UserID", '');
	   return ;
  }
  url.headers['Origin']='https://tb.ele.me';
  url.url+=cookieVal;
  url.url+=endurl;
  sy.log(url.url);
  sy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    const title = `${cookieName}`
    let subTitle = ''
    let detail = ''
    sy.log(response);
    if (response == 200) {
      subTitle = '签到结果: 成功'
      // else subTitle = '签到结果: 成功 (重复签到)'
      // detail = `人人钻: ${result.data.userinfo.point}, 登录天数: ${result.data.usercount.cont_login} -> ${result.data.upgrade_day}`
     sy.msg(title, subTitle, detail)
    } else if(response == 400) {
      subTitle = '签到结果: 重复'
      sy.msg(title, subTitle, detail)
    }
	else{
      subTitle = '签到结果: 未知'
      sy.msg(title, subTitle, detail)
	}
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
      $task.fetch(url).then((resp) => cb(null, resp.statusCode, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}