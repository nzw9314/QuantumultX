/*
本脚本仅适用于快手极速版签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.APP登陆账号后，点击'红包',即可获取Cookie.

仅测试Quantumult x，Surge、Loon自行测试
by Macsuny
感谢
@Chavy
@Nobyda
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron "0 9 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou_sign.js

# 获取快手极速版 Cookie.
http-request https:\/\/nebula\.kuaishou\.com\/rest\/n\/nebula\/activity\/earn\/overview,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou_cookie.js
~~~~~~~~~~~~~~~~
QX 1.0.5 :
[task_local]
0 9 * * * kuaishou_sign.js

[rewrite_local]
# 获取快手极速版 Cookie. QX 1.0.5(188+):
https:\/\/nebula\.kuaishou\.com\/rest\/n\/nebula\/activity\/earn\/overview url script-request-header kuaishou_cookie.js
~~~~~~~~~~~~~~~~
QX or Surge MITM = nebula.kuaishou.com
~~~~~~~~~~~~~~~~

*/
const cookieName = '快手极速版'
const cookieKey = 'cookie_ks'
const sy = init() 
const title = `${cookieName}`
const cookieVal = sy.getdata(cookieKey);
sign() 
function sign() {
	let url = {
		url: 'https://nebula.kuaishou.com/rest/n/nebula/sign/sign',
		headers: {
			Cookie: cookieVal
		}
	}
	url.headers['Connection'] = `keep - alive`
	url.headers['Content-Type'] = `application / json;
	charset = UTF - 8`
	url.headers['Accept'] = `application / json, text / plain,*/* `
    url.headers['Host'] = `nebula.kuaishou.com`
    url.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ksNebula/2.1.3.65`
    url.headers['Accept-Language'] = `zh-cn`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    url.headers['Referer'] = `https://nebula.kuaishou.com/nebula/task/earning?source=timer&layoutType=4`
    sy.get(url, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      let subTitle = ``
      if(result.result == 10007){
        subTitle = `签到结果: ${result.error_msg}`
        sy.msg(title,subTitle,'')
      } else if (result.data.status == 2) {
        subTitle = `${result.data.toast} ${result.data.totalCoin}`
        sy.msg(title,subTitle,'')
      } 
        else {
      }

  })
Popup() 
function Popup() {
	let url = {
		url: 'https://nebula.kuaishou.com/rest/n/nebula/sign/query',
		headers: {
			Cookie: cookieVal
		}
	}
	url.headers['Connection'] = `keep - alive`
	url.headers['Content-Type'] = `application / json;
	charset = UTF - 8`
	url.headers['Accept'] = `application / json,text / plain,*/* `
    url.headers['Host'] = `nebula.kuaishou.com`
    url.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ksNebula/2.1.3.65`
    url.headers['Accept-Language'] = `zh-cn`
    url.headers['Accept-Encoding'] = `gzip, deflate, br`
    url.headers['Referer'] = `https://nebula.kuaishou.com/nebula/task/earning?source=timer&layoutType=4` 
    sy.get(url, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      let detail = ``
     if (result.data.nebulaSignInPopup.todaySigned == true){
       detail = `签到成功, ${result.data.nebulaSignInPopup.subTitle},${result.data.nebulaSignInPopup.title}`
       sy.msg(title,'',detail)
      } else {
      } 
    })

cash()
function cash() {
    let url = {url:'https://nebula.kuaishou.com/rest/n/nebula/activity/earn/overview',
    headers: {Cookie:cookieVal}}
    url.headers['Connection'] = `keep-alive`
    url.headers['Content-Type'] = `application/json;charset=UTF-8`
    url.headers['Accept'] = `application/json, text/plain, */* `
	url.headers['Host'] = `nebula.kuaishou.com`
	url.headers['User-Agent'] = `Mozilla / 5.0(iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit / 605.1.15(KHTML, like Gecko) Mobile / 15E148 ksNebula / 2.1.3.65`
	url.headers['Accept-Language'] = `zh - cn`
	url.headers['Accept-Encoding'] = `gzip,deflate,br`
	url.headers['Referer'] = `https: //nebula.kuaishou.com/nebula/task/earning?source=timer&layoutType=4` 
	sy.get(url, (error, response, data) =>{
		//sy.log(`${cookieName}, data: ${data}`)
		let result = JSON.parse(data) 
        let subTitle = ``
		let detail = ``
	  if (result.result == 1) {
	        subTitle = `签到结果:今日已签到`
			detail = `金币收益💰: ${result.data.totalCoin}   现金收益💵: ${result.data.allCash}元`
			sy.msg(title,subTitle,detail)
			} else {
		}
	    sy.log(title,subTitle,detail)
	})
   }
   sy.done()
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