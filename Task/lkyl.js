/*
本脚本仅适用于京东来客有礼每日获取京豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.微信搜索'来客有礼'小程序,登陆京东账号，点击'发现',即可获取Cookie.
3. 4月26日更新，每日视频运行一次增加一次银币，未加入银豆兑换京豆功能，需手动
4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
lkyl.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js,script-update-interval=0

# 来客有礼 Cookie.
lkyl.js = type=http-request,pattern=https:\/\/draw\.jdfcloud\.com\/\/api\/bean\/square\/silverBean\/task\/get\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js
~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=lkyl.js, enabled=true, tag=来客有礼

http-request https:\/\/draw\.jdfcloud\.com\/\/api\/bean\/square\/silverBean\/task\/get\? script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js

-----------------

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
const openkey = 'openid_lkyl'
const appIdkey = 'app_lkyl'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)
const openid = sy.getdata(openkey)
const appid = sy.getdata(appIdkey)
let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   all()
}
function GetCookie() {
const requrl = $request.url
if ($request && $request.method != 'OPTIONS') {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  const openid = $request.headers['openId'];
  const appid = $request.headers['App-Id'];
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  if (openid) sy.setdata(openid,openkey);
  if (appid) sy.setdata(appid,appIdkey);
    sy.log(`openid:${openid}`)
    sy.log(`appid:${appid}`)
  sy.msg(cookieName, `获取Cookie: 成功🎉`, ``)
  }
 }

async function all() 
{ 
  await sign();
  await lottery();
  await status();
  await Daily();
  await weektask();
  await total()
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
      detail = `${result.data.topLine},${result.data.rewardName}， 获得${result.data.jdBeanQuantity}个京豆\n`
      } else if (result.errorMessage == `今天已经签到过了哦`) {
      res = `  重复签到`
      detail = ``
      } else  {
      res = `  签到失败`
      detail = `说明: ${result.errorMessage}`
      }
    resolve()
     })
   })
 }

// 0元抽奖统计
function lottery() {
   return new Promise((resolve, reject) =>{
	  let daytaskurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/getTaskInfo?openId=${openid}&taskCode=lottery&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
     daytaskurl.headers[`Content-Length`] = `0`;
    sy.get(daytaskurl, (error, response, data) => {
    //sy.log(`${cookieName}, 今日0元抽奖 ${data}`)
      let lotteryres = JSON.parse(data)
      Incomplete = lotteryres.data.totalSteps - lotteryres.data.doneSteps
     if (Incomplete >0 ){
     award();
     detail += `您有${Incomplete}个0元抽奖未完成\n`
     }
     else if (Incomplete == 0 ){
detail += `今日0元抽奖任务已完成，获得${lotteryres.data.rewardAmount}个银币\n` }
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
     taskstatus = JSON.parse(data)
   if (taskstatus.data.dailyTasks[1].status!='received'){
    for (i=0;i<3;i++){
      video() 
       }
      }
   else if (taskstatus.data.dailyTasks[1].status=='received'){
   detail += `视频任务已完成，获得${taskstatus.data.dailyTasks[1].taskReward}个银币` }
  })
   resolve()
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
     //sy.log(`${cookieName}, data: ${data}`)
     })
   })
resolve()
 })
}

//0元抽奖循环
function award() {
   return new Promise((resolve, reject) =>{
	 let weektaskurl = {
		url: `https://draw.jdfcloud.com//api/lottery/home/v2?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)}
     weektaskurl.headers['Content-Length'] = `0`;
    sy.get(weektaskurl, (error, response, data) => {
     //sy.log(`${cookieName}, data: ${data}`)
      result = JSON.parse(data)
    if (result.success == true) {
      for (k=0;result.data.homeActivities[k].participated==false&&k<Incomplete;k++){
        lotteryId = result.data.homeActivities[k].activityId
    let awardurl = {  
         url: `https://draw.jdfcloud.com//api/lottery/participate?lotteryId=${lotteryId}&openId=${openid}&formId=123&source=HOME&appId=${appid}`,headers: JSON.parse(signheaderVal),body: '{}'
}
   sy.post(awardurl, (error, response, data) =>
    {
     //sy.log(`${cookieName}, 抽奖任务: ${data}`)
               });
             }
       resolve()
          }
       })
    })
  }

//日常抽奖银豆
function Daily() {
return new Promise((resolve, reject) => {
 let beanurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/silverBean/taskReward/get?openId=${openid}&taskCode=lottery&taskType=lottery&inviterOpenId=&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
   beanurl.headers['Content-Length'] = `0`;
    sy.get(beanurl, (error, response, data) =>
  {
     sy.log(`${cookieName}, data: ${data}`)
    })
   resolve()
   })
}
// 每周抽奖任务
function weektask() {
return new Promise((resolve, reject) => {
 let bean2url = {
      url: `https://draw.jdfcloud.com//api/bean/square/silverBean/taskReward/get?openId=${openid}&taskCode=lottery_multi&taskType=lottery_multi&inviterOpenId=&appId=${appid}`,
      headers: JSON.parse(signheaderVal)
	}
   bean2url.headers['Content-Length'] = `0`;
    sy.get(bean2url, (error, response, data) =>
  {
    })
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
      //sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`

   if (SilverBean >result.datas[0].salePrice) {
    for (k=0; k < result.datas.length;k++){
    if (result.datas[k].salePrice >= SilverBean && SilverBean > result.datas[k-1].salePrice)
     {
      subTitle += `${result.datas[k-1].memo}(手动兑换)`}

    }
   } else if (SilverBean < result.datas[0].salePrice) 
    { 
       subTitle += `  银豆不足以兑换京豆`
    }
else if (SilverBean = result.datas[0].salePrice) 
    { 
       subTitle +=`${result.datas[0].memo}(手动兑换)`
    }
    sy.msg(cookieName+res, subTitle, detail)
    })
   })
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
