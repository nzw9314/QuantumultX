/*
本脚本仅适用于京东来客有礼每日获取京豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.微信搜索'来客有礼'小程序,登陆京东账号，点击'发现',即可获取Cookie. 
3.当日签过到需次日获取Cookie.
4. 4月26日更新，每日视频运行一次增加一次银币，未加入银豆兑换京豆功能，需手动
5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
lkyl.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js,script-update-interval=0

# 来客有礼 Cookie.
lkyl.js = type=http-request,pattern=https:\/\/draw\.jdfcloud\.com\/\/api\/bean\/square\/silverBean\/task\/get\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js,
~~~~~~~~~~~~~~~~
QX 1.0. 7+ :
[task_local]
0 9 * * * lkyl.js

[rewrite_local]
https:\/\/draw\.jdfcloud\.com\/\/api\/bean\/square\/silverBean\/task\/get\? url script-request-header lkyl.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = draw.jdfcloud.com
~~~~~~~~~~~~~~~~

*/
const cookieName = '来客有礼小程序'
const signurlKey = 'sy_signurl_lkyl'
const signheaderKey = 'sy_signheader_lkyl'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)
const token = JSON.parse(sy.getdata(signheaderKey))
const openid = token['openId']
const appid = token['App-Id']
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
function sign() {
  return new Promise((resolve, reject) =>{
	let signurl = {
	  url: `https://draw.jdfcloud.com//api/turncard/sign?openId=${openid}&petSign=true&turnTableId=131&source=HOME&channelId=87&appId=${appid}`,
       headers:JSON.parse(signheaderVal)}
    sy.post(signurl, (error, response, data) => {
     sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (result.success == true) {
      res = `  签到成功🎉`
      detail = `${result.data.topLine},${result.data.rewardName},获得京豆: ${result.data.jdBeanQuantity}  `
      } else if (result.errorMessage == `今天已经签到过了哦`) {
      res = `  重复签到`
      detail = ``
      } else  {
      res = `  签到失败`
      detail = `说明: ${result.errorMessage}`
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
       headers: JSON.parse(signheaderVal)}
     statusurl.headers['Content-Length'] = `0`;
   sy.get(statusurl, (error, response, data) =>{
     sy.log(`${cookieName}, data: ${data}`)
       video()
   },resolve)
  })
}
//每日视频
function video() {
   return new Promise((resolve, reject) =>{
    const bodyVal = '{"openId": '+'"'+openid+'","taskCode": "watch_video"}'
	let videourl = {
		url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/join?appId=${appid}`,
		headers: JSON.parse(signheaderVal),
          body: bodyVal}
    videourl.headers['Content-Length'] = `0`;
   sy.post(videourl, (error, response, data) =>{
      sy.log(`${cookieName}, 视频: ${data}`)
    let videotaskurl = {
	 url: `https://draw.jdfcloud.com//api/bean/square/silverBean/taskReward/get?openId=${openid}&taskCode=watch_video&inviterOpenId=&appId=${appid}`,headers: JSON.parse(signheaderVal)}
    videotaskurl.headers['Content-Length'] = `0`;
    sy.get(videotaskurl, (error, response, data) => { 
     sy.log(`${cookieName}, data: ${data}`)
     })
  lottery()
   })
resolve()
 })
}
function lottery() {
   return new Promise((resolve, reject) =>{
	  let daytaskurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/getTaskInfo?openId=${openid}&taskCode=lottery&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
     daytaskurl.headers[`Content-Length`] = `0`;
    sy.get(daytaskurl, (error, response, data) => {
    sy.log(`${cookieName}, 今日0元抽奖 ${data}`)
      let result = JSON.parse(data)
      Incomplete = result.data.totalSteps - result.data.doneSteps
      if (Incomplete == 0) {
       detail += `今日已完成0元抽奖任务, 获取${result.data.rewardAmount}个银豆`}
     else if (Incomplete > 0){
       detail += `今日还有${Incomplete}次抽奖任务未完成`}
    award()
      })
   resolve()
   })
}

//抽奖循环
function award() {
   return new Promise((resolve, reject) =>{
	 let weektaskurl = {
		url: `https://draw.jdfcloud.com//api/lottery/home/v2?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)}
     weektaskurl.headers['Content-Length'] = `0`;
    sy.get(weektaskurl, (error, response, data) => {
     sy.log(`${cookieName}, data: ${data}`)
      result = JSON.parse(data)
    if (result.success == true) {
        if (Incomplete >0 ){
          var k = 0;
          while (result.data.homeActivities[k].participated=false&& Incomplete<=3){
        lotteryId = result.data.homeActivities[k].activityId
    let awardurl = {  
            url: `https://draw.jdfcloud.com//api/lottery/participate?lotteryId=${lotteryId}&openId=${openid}&formId=123&source=HOME&appId=${appid}`,headers: JSON.parse(signheaderVal)}
   sy.post(awardurl, (error, response, data) =>{
       sy.log(`${cookieName}, 抽奖任务: ${data}`)
               });
             k++}
            }
          }
       resolve()
       })
    bean()
    })
  }
// 领取银豆
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
//总计
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
      const title = `${cookieName}`
      if (result.success == true) {
      SilverBean = `${result.data}`
      subTitle = `共计${SilverBean}个银豆，`
      }
  let hinturl = {
	 url: `https://draw.jdfcloud.com//api/bean/square/silverBean/getJdBeanList?openId=${openid}&appId=${appid}`,
	 headers: JSON.parse(signheaderVal)}
    hinturl.headers['Content-Length'] = `0`;
    sy.get(hinturl, (error, response, data) => {
      sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (SilverBean >= result.datas[0].salePrice) {
    for (k=0; k < result.datas.length;k++){
    if (result.datas[k].salePrice >= SilverBean && SilverBean > result.datas[k-1].salePrice)
     {
      subTitle += `${result.datas[k-1].memo}(手动兑换)`}
    }
   } else if (SilverBean < result.datas[0].salePrice) 
    { 
    subTitle += `  银豆不足以兑换京豆`
    }
    sy.msg(title+res, subTitle, detail)
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
