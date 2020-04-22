/*
本脚本仅适用于京东来客有礼每日获取京豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.微信搜索'来客有礼'小程序,登陆京东账号，点击'领京豆->翻牌',即可获取Cookie. 
3.当日签过到需次日获取Cookie.
4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
lkyl.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js,script-update-interval=0

# 来客有礼 Cookie.
lkyl.js = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js,type=http-request,pattern=https:\/\/draw\.jdfcloud\.com\/\/api\/turncard\/sign\?

~~~~~~~~~~~~~~~~
QX 1.0.5+ :
[task_local]
0 9 * * * lkyl.js

[rewrite_local]
https:\/\/draw\.jdfcloud\.com\/\/api\/turncard\/sign\? url script-request-header lkyl.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = draw.jdfcloud.com
~~~~~~~~~~~~~~~~

*/
const cookieName = '来客有礼'
const signurlKey = 'sy_signurl_lkyl'
const signheaderKey = 'sy_signheader_lkyl'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   sign()
}
function GetCookie() {
const requrl = $request.url
if ($request && $request.method != 'OPTIONS') {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  const cookieVal = $request.headers['Cookie'];
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(cookieName, `获取Cookie: 成功🎉`, ``)
  }
 }
const token = JSON.parse(signheaderVal)
const openid = token['openId']
const appid = token['App-Id']
function sign() {
  return new Promise((resolve, reject) =>{
	  let signurl = {
		url: signurlVal,
		headers: JSON.parse(signheaderVal)
	}
    sy.post(signurl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (result.success == true) {
      subTitle = `签到结果: 成功🎉`
      detail = `${result.data.topLine},${result.data.rewardName},获得京豆: ${result.data.jdBeanQuantity}`
      } else if (result.errorMessage == `今天已经签到过了哦`) {
      subTitle = `签到结果: 重复‼️`
      detail = `说明: ${result.errorMessage}!`
      
      } else  {
      subTitle = `签到结果: 失败`
      detail = `说明: ${result.errorMessage}`
      }
     lottery(),
     resolve()
     })
   })
  }

function lottery() {
   return new Promise((resolve, reject) =>{
	  let daytaskurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/getTaskInfo?openId=${openid}&taskCode=lottery&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
     daytaskurl.headers['Content-Length'] = `0`;
    sy.get(daytaskurl, (error, response, data) => {
      //sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.success == true) {
      //detail += `\n今日抽奖获取银豆: ${result.data.rewardAmount}`
      }
    status()
    resolve()
      })
   })
}

function status() {
   return new Promise((resolve, reject) =>{
	  let statusurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/get?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal),
        }
     statusurl.headers['Content-Length'] = `0`;
    sy.get(statusurl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.success == true) {
      //detail += ``
      }
    video()
    resolve()
      })
   })
}

function video() {
   return new Promise((resolve, reject) =>{
	  let videourl = {
		url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/join?appId=${appid}`,
		headers: JSON.parse(signheaderVal),
          body: `{"openId": "['openid']","taskCode": "watch_video"}`}
     videourl.headers['Content-Length'] = `0`;
    sy.post(videourl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.success == true) {
      //detail += `\n`
      }
     let videotaskurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/silverBean/taskReward/get?openId=${openid}&taskCode=watch_video&inviterOpenId=&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
     }
     videotaskurl.headers['Content-Length'] = `0`;
    sy.get(videotaskurl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.success == true) {
      //detail += `\n`
      }
     })
    award()
    resolve()
      })
   })
}

function award() {
   return new Promise((resolve, reject) =>{
	 let weektaskurl = {
		url: `https://draw.jdfcloud.com//api/lottery/home/v2?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
     weektaskurl.headers['Content-Length'] = `0`;
    sy.get(weektaskurl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.success == true) {
        detail += `  您已参与${result.data.homeActivities.length}个抽奖`
     for (i=0;i < 3;i++)
{   
   lotteryId = result.data.homeActivities[i].activityId
   let awardurl = {  
        url: `https://draw.jdfcloud.com//api/lottery/participate?lotteryId=${lotteryId}&openId=${openid}&formId=123&source=HOME&appId=${appid}`,
	   headers: JSON.parse(signheaderVal)
	}
    sy.post(awardurl, (error, response, data) =>
  {
     sy.log(`${cookieName}, data: ${data}`)
       })
      }
     }
    bean()
    resolve()
   })
 })
}
function bean() {
return new Promise((resolve, reject) => {
 let beanurl = {
		url: `https://draw.jdfcloud.com//api/lottery/risk?relatedIdType=BEAN_SQUARE_ACTIVE_ID&relatedId=1&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
   beanurl.headers['Content-Length'] = `0`;
    sy.post(beanurl, (error, response, data) =>
  {
    sy.log(`${cookieName}, data: ${data}`)
   })
   total()
  resolve()
  })
}
function total() {
   return new Promise((resolve, reject) =>{
	 let lotteryurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/silverBean/getUserBalance?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
     lotteryurl.headers['Content-Length'] = `0`;
    sy.get(lotteryurl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.success == true) {
      SilverBean = `${result.data}`
      detail += `\n您共计${SilverBean}个银豆`
      }
    let hinturl = {
	    url: `https://draw.jdfcloud.com//api/bean/square/silverBean/getJdBeanList?openId=${openid}&appId=${appid}`,
	    headers: JSON.parse(signheaderVal)
	}
    hinturl.headers['Content-Length'] = `0`;
    sy.get(hinturl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (SilverBean >= 20) {
    for (k=0; k < result.datas.length;k++){
    if (result.datas[k].salePrice >= SilverBean && SilverBean > result.datas[k-1].salePrice)
     {
      detail += `   可兑换: ${result.datas[k-1].memo}`
      }
     }
   } else if (SilverBean < 20) 
    { 
    detail += `  银豆不足以兑换京豆`
    }
    sy.msg(title, subTitle, detail)
    })
   })
  resolve()
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
  msg = (title, subTitle, body) => {
    if (isSurge()) $notification.post(title, subTitle, body)
    if (isQuanX()) $notify(title, subTitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
