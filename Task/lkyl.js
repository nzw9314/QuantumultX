/*
本脚本仅适用于京东来客有礼每日获取京豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.微信搜索'来客有礼'小程序,登陆京东账号，点击'发现',即可获取Cookie.
3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
4.5月17日增加自动兑换京豆，需设置兑换京豆数，现可根据100、200和500设置，不可设置随机兑换数，根据页面填写兑换数值，默认设置500，注意是京豆数❗️
5.版本更新日志:
05-19 v1.0: 变更通知方式


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
const jdbean = "500" //兑换京豆数
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
  await sign();     // 签到
  await info();     // 账号信息
  await tasklist(); // 任务列表
  await total();    // 总计
  await lottery();  // o元抽奖
  await status();   // 视频抽奖
  await Daily();    // 日常任务
  await exChange(); // 银豆兑换
 
}
function sign() {
  return new Promise((resolve, reject) =>{
	let signurl = {
	  url: `https://draw.jdfcloud.com//api/turncard/sign?openId=${openid}&petSign=true&turnTableId=131&source=HOME&channelId=87&appId=${appid}`,
       headers:JSON.parse(signheaderVal)}
    sy.post(signurl, (error, response, data) => {
     //sy.log(`${cookieName}, data: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (result.success == true) {
      subTitle = `  签到成功🎉`
      detail = `${result.data.topLine},${result.data.rewardName}， 获得${result.data.jdBeanQuantity}个京豆\n`
      } else if (result.errorMessage == `今天已经签到过了哦`) {
      subTitle = `  重复签到 🔁`
      detail = ``
      } else  {
      subTitle = `  签到失败❌`
      detail = `说明: ${result.errorMessage}`
      }
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
    sy.get(daytaskurl, (error, response, data) => {
    sy.log(`${cookieName}, 今日0元抽奖 ${data}`)
    let lotteryres = JSON.parse(data)
      Incomplete = lotteryres.data.totalSteps - lotteryres.data.doneSteps
     if (Incomplete >0 ){
    for (k=0;task.data.homeActivities[k].participated==false&&k<Incomplete;k++){
       lotteryId = task.data.homeActivities[k].activityId
       cycleLucky()
       };
    detail +=  `\n【抽奖任务】: 🔕 ${Incomplete}个未完成`
     resolve()
      }
     if (Incomplete == 0 ){
detail += `\n【抽奖任务】: ✅ 获得${lotteryres.data.rewardAmount}个银豆` 
    resolve()
   }
   }) 
  })
}
function status() {
 return new Promise((resolve, reject) =>{
   setTimeout(() => {
   let statusurl = {
	  url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/get?openId=${openid}&appId=${appid}`,
     headers: JSON.parse(signheaderVal)}
     statusurl.headers['Content-Length'] = `0`;
   sy.get(statusurl, (error, response, data) =>{
  //sy.log(`${cookieName}, data: ${data}`)
     taskstatus = JSON.parse(data)
      if (taskstatus.data.dailyTasks[1].status!='received'){
    for (i=0;i<3;i++){
      video()} }
   else if (taskstatus.data.dailyTasks[1].status=='received'){
   detail += `\n【视频任务】: ✅ 获得${taskstatus.data.dailyTasks[1].taskReward}个银豆` } 
   weekresult = taskstatus.data.weeklyTasks[0].inviteAmount-taskstatus.data.weeklyTasks[0].finishedCount
  if (weekresult >0){
      detail += `\n【每周任务】: 🔕 ${weekresult}个未完成`
      weektask()
    }
  else {
     detail += `\n【每周任务】: ✅ 获得${taskstatus.data.weeklyTasks[0].taskReward}个银豆`
      }
    resolve()
   sy.msg(cookieName, '昵称: '+ uesername+' '+subTitle, detail)
      },1000)
    })
  })
}
function video() {
   return new Promise((resolve, reject) =>{
    const bodyVal = '{"openId": '+'"'+openid+'","taskCode": "watch_video"}'
	let videourl = {
          url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/join?appId=${appid}`,
		headers: JSON.parse(signheaderVal),
          body: bodyVal}
    videourl.headers['Content-Length'] = `0`;
   sy.post(videourl, (error, response, data) =>{
  //sy.log(`${cookieName}, 视频: ${data}`)
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

function info() {
   return new Promise((resolve, reject) =>{
	 let infourl = {
		url: `https://draw.jdfcloud.com//api/user/user/detail?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)}
    sy.get(infourl, (error, response, data) => {
     //sy.log(`${cookieName}, 账号信息: ${data}`)
   let info = JSON.parse(data)  
    uesername = `${info.data.nickName}`
    resolve()
  })
 })
}

function tasklist() {
   return new Promise((resolve, reject) =>{
	 let taskurl = {
		url: `https://draw.jdfcloud.com//api/lottery/home/v2?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)}
     taskurl.headers['Content-Length'] = `0`;
    sy.get(taskurl, (error, response, data) => {
     //sy.log(`${cookieName}, 任务列表: ${data}`)
    task = JSON.parse(data)
    resolve()
  })
 })
}

function cycleLucky() {
   return new Promise((resolve, reject) =>{
    let luckyurl = {  
         url: `https://draw.jdfcloud.com//api/lottery/participate?lotteryId=${lotteryId}&openId=${openid}&formId=123&source=HOME&appId=${appid}`,headers: JSON.parse(signheaderVal),body: '{}'
}
 sy.post(luckyurl, (error, response, data) => {
 //sy.log(`${cookieName}, 抽奖任务循环: ${data}`)
         })
     resolve()
    })
  }

//领取抽奖银豆
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
  sy.log(`${cookieName}, 本周任务: ${data}`)
    })
   resolve()
   })
}

function total() {
 return new Promise((resolve, reject) =>{
  setTimeout(() => {
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
      beantotal = `共计${SilverBean}个银豆，`
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
      detail= beantotal+ `${result.datas[k-1].salePrice}银豆兑换${result.datas[k-1].productName}`}

    }
   } else if (SilverBean < result.datas[0].salePrice) 
    { 
       detail= beantotal+ `银豆不足以兑换京豆`
    }
else if (SilverBean = result.datas[0].salePrice) 
    { 
       detail= beantotal+ `${result.datas[k-1].salePrice}银豆兑换${result.datas[k-1].productName}`
       }
    resolve()
     })
    })
   })
 })
}
function exChange() {
  return new Promise((resolve, reject) => {
  let changeurl = {
      url: `https://draw.jdfcloud.com//api/bean/square/silverBean/exchange?appId=${appid}`,
      headers: JSON.parse(signheaderVal),
      body:  '{"appId":'+' "'+appid+'"'+', "openId":'+' "'+openid+'"'+', "jdPin":'+' "'+uesername+'"'+', "productCode":"jd_bean_'+jdbean+'"}'
 }
  sy.post(changeurl, (error, response,data) =>{
    sy.log(`${cookieName}, 兑换京豆: ${data}`)
    let result = JSON.parse(data)
    if (result.errorCode== "success"){
      detail += '成功兑换'+result.data+'个京豆'
     }
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
