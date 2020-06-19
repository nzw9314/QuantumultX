/*
更新时间: 2020-06-15 15:35 取消打卡挑战，ck时效短，可弃坑

本脚本仅适用于京东来客有礼每日获取京豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.微信搜索'来客有礼'小程序,登陆京东账号，点击'发现',即可获取Cookie，获取后请禁用或注释掉❗️
3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
4.5月17日增加自动兑换京豆，需设置兑换京豆数，现可根据100、200和500设置，不可设置随机兑换数，根据页面填写兑换数值，默认设置500，注意是京豆数❗️ 已取消自动兑换‼️
5.增加打卡挑战赛自动报名，需要5天后手动领取瓜分奖励‼️

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
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/lkyl.js, enabled=true, tag=来客有礼

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
const challengebean= 100 //默认挑战赛100档
const jdbean = "500" //兑换京豆数
const logs = 0   //响应日志开关,默认关闭
const cookieName = '来客有礼小程序'
const sy = init()
const signurlVal = sy.getdata('sy_signurl_lkyl')
const signheaderVal = sy.getdata('sy_signheader_lkyl')
const openid = sy.getdata('openid_lkyl')
const appid = sy.getdata('app_lkyl')
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
  if (signurlVal) sy.setdata(signurlVal, 'sy_signurl_lkyl')
  if (signheaderVal) sy.setdata(signheaderVal, 'sy_signheader_lkyl')
  if (openid) sy.setdata(openid,'openid_lkyl');
  if (appid) sy.setdata(appid,'app_lkyl');
    sy.log(`openid:${openid}`)
    sy.log(`appid:${appid}`)
  sy.msg(cookieName, `获取Cookie: 成功🎉`, ``)
  }
 }

async function all() 
{ 
  await sign();     // 签到
  await info();     // 账号信息
  await total();    // 总计
  await tasklist(); // 任务列表
  await lottery();  // 0元抽奖
  //await challenge();// 打卡挑战
  await status();   // 任务状态
  await video();    // 视频任务
  await Daily();    // 日常任务
  //await exChange(); // 银豆兑换
}
function sign() {
  return new Promise((resolve, reject) =>{
	let signurl = {
	  url: `https://draw.jdfcloud.com//api/turncard/sign?openId=${openid}&petSign=true&turnTableId=131&source=HOME&channelId=87&appId=${appid}`,
       headers:JSON.parse(signheaderVal)}
    sy.post(signurl, (error, response, data) => {
     if(logs) sy.log(`${cookieName}, 签到信息: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (result.success == true) {
      subTitle = `  签到成功🎉`
      detail = `${result.data.topLine},${result.data.rewardName}， 获得${result.data.jdBeanQuantity}个京豆\n`
      } else if (result.errorMessage == `今天已经签到过了哦`) {
      subTitle = `  重复签到 🔁`
      detail = ``
      } else if (result.errorCode =='L0001') {
      subTitle = `签到失败，Cookie 失效❌`
      detail = `说明: ${result.errorMessage}`
      sy.msg(cookieName, subTitle, detail)
      return
      }
     resolve()
     })
   })
 }
function status() {
 return new Promise((resolve, reject) =>{
   let statusurl = {
	  url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/get?openId=${openid}&appId=${appid}`,
     headers: JSON.parse(signheaderVal)}
   sy.get(statusurl, (error, response, data) =>{
   if(logs)sy.log(`${cookieName}, 任务状态: ${data}`)
     taskstatus = JSON.parse(data)
      if (taskstatus.data.dailyTasks[0].status!='received'){
      detail +=  `【日常抽奖】: 🔕 已完成/总计: ${doneSteps}/${totalSteps}次\n`
       };
     if (taskstatus.data.dailyTasks[0].status=='received'){
      detail += `【日常抽奖】: ✅  +${taskstatus.data.dailyTasks[0].taskReward} 银豆\n`
       };
      if (taskstatus.data.weeklyTasks[0].status!='received'){
    detail += `【每周任务】: 🔕 已完成/总计:${taskstatus.data.weeklyTasks[0].finishedCount}/${taskstatus.data.weeklyTasks[0].inviteAmount}次\n`
      weektask()
       }
  else if (taskstatus.data.weeklyTasks[0].status=='received'){
      detail += `【每周任务】: ✅  +${taskstatus.data.weeklyTasks[0].taskReward}个银豆\n`
      }
    resolve()
    })
  })
}

function video() {
 return new Promise((resolve, reject) =>{
  if (taskstatus.data.dailyTasks[1].status!='received'){
    bodyVal = '{"openId": '+'"'+openid+'","taskCode": "watch_video"}'
 for (j=0;j<4;j++){
   videourl = {
     url: `https://draw.jdfcloud.com//api/bean/square/silverBean/task/join?appId=${appid}`,headers: JSON.parse(signheaderVal),body: bodyVal}
   videotaskurl = {
	 url: `https://draw.jdfcloud.com//api/bean/square/silverBean/taskReward/get?openId=${openid}&taskCode=watch_video&inviterOpenId=&appId=${appid}`,headers: JSON.parse(signheaderVal)}
   sy.post(videourl, function(error, response, data){if(logs)sy.log(`${cookieName}, 视频: ${data}`)})
   sy.get(videotaskurl, function(error, response, data){if(logs)sy.log(`${cookieName}, 视频银豆: ${data}`)})
    }
  }
  if (taskstatus.data.dailyTasks[1].status=='received'){
    detail += `【视频任务】: ✅  +${taskstatus.data.dailyTasks[1].taskReward} 银豆\n`
   }
  resolve()
 })
}

function lottery() {
 return new Promise((resolve, reject) =>{
	  let daytaskurl = {
		url: `https://draw.jdfcloud.com//api/bean/square/getTaskInfo?openId=${openid}&taskCode=lottery&appId=${appid}`,
		headers: JSON.parse(signheaderVal)
	}
    sy.get(daytaskurl, (error, response, data) => {
    if(logs) sy.log(`${cookieName}, 0元抽奖 ${data}`)
    let lotteryres = JSON.parse(data)
     doneSteps = lotteryres.data.doneSteps
     totalSteps = lotteryres.data.totalSteps
     Incomplete = totalSteps - doneSteps
     rewardAmount= lotteryres.data.rewardAmount
     if (Incomplete >0 ){
        for (k=0;k<task.data.homeActivities.length&&task.data.homeActivities[k].participated==false;k++)   { 
     for (j=0;j<Incomplete;j++){
       lotteryId = task.data.homeActivities[k].activityId
       cycleLucky()
       }
      }
    }
  resolve()
   })
 })
}
function info() {
   return new Promise((resolve, reject) =>{
	 let infourl = {
		url: `https://draw.jdfcloud.com//api/user/user/detail?openId=${openid}&appId=${appid}`,
		headers: JSON.parse(signheaderVal)}
    sy.get(infourl, (error, response, data) => {
    if(logs)sy.log(`${cookieName}, 账号信息: ${data}`)
   let info = JSON.parse(data)  
    uesername = `${info.data.nickName}`
    resolve()
  })
 })
}          
function challenge() {
 return new Promise((resolve, reject) =>{
  let  d = new Date();
       M = ("0" + (d.getMonth()+1)).slice(-2);
       D = ("0" + (d.getDate())).slice(-2);
       Y = d.getFullYear()  
    nowday=Y+M+D
   let challurl = {
	 url: `https://draw.jdfcloud.com//api/sign/challenge/apply?appId=${appid}`,
	 headers: JSON.parse(signheaderVal),
     body: '{"appId":'+' "'+appid+'"'+', "openId":'+' "'+openid+'"'+',"challengeStage":"'+nowday+'","deductAmount":'+challengebean+',"signLevelAmount":'+challengebean+'}'
}
    sy.post(challurl, (error, response, data) => {
    sy.log(`${cookieName}, 打卡挑战赛: ${data}`)
   let challres = JSON.parse(data)  
   if(challres.data==true){
     detail += `【打卡挑战】: 报名成功，押金: `+challengebean+'\n'
    }
   if(challres.errorCode=="exist"){
     detail += `【打卡挑战】: 已报名，押金: `+challengebean+'银豆\n'
    }
if(challres.errorCode=="deduct_fail"){
     detail += `【打卡挑战】: ❎ 报名失败 押金: 不足\n`
    }
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
    if(logs)sy.log(`${cookieName}, 任务列表: ${data}`)
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
    if(logs)sy.log(`${cookieName}, 抽奖任务: ${data}`)
         })
     resolve()
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
    if(logs)sy.log(`${cookieName}, 日常银豆: ${data}`)
    })
   resolve()
 sy.msg(cookieName, '昵称: '+ uesername+' '+subTitle, detail)
  sy.log('昵称: '+ uesername+' '+subTitle+detail)
   })
}
// 每周银豆
function weektask() {
return new Promise((resolve, reject) => {
 let bean2url = {
      url: `https://draw.jdfcloud.com//api/bean/square/silverBean/taskReward/get?openId=${openid}&taskCode=lottery_multi&taskType=lottery_multi&inviterOpenId=&appId=${appid}`,
      headers: JSON.parse(signheaderVal)
	}
   bean2url.headers['Content-Length'] = `0`;
    sy.get(bean2url, (error, response, data) =>
  {
    if(logs)sy.log(`${cookieName}, 本周任务: ${data}`)
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
    sy.get(lotteryurl, (error, response, data) => {
    if(logs)sy.log(`${cookieName}, 统计: ${data}`)
      let result = JSON.parse(data)
      const title = `${cookieName}`
      if (result.success == true) {
      SilverBean = `${result.data}`
      Silvertotal = `收益总计：${SilverBean} 银豆  `
      }
  let hinturl = {
	 url: `https://draw.jdfcloud.com//api/bean/square/silverBean/getJdBeanList?openId=${openid}&appId=${appid}`,
	 headers: JSON.parse(signheaderVal)}
    hinturl.headers['Content-Length'] = `0`;
    sy.get(hinturl, (error, response, data) => {
    if(logs)sy.log(`${cookieName}, 可兑换: ${data}`)
      let excresult = JSON.parse(data)
      const title = `${cookieName}`
           exchangebean = ``
   if (SilverBean >excresult.datas[0].salePrice) {
  for (k=0; k < excresult.datas.length;k++){
   if (excresult.datas[k].productName==jdbean+'京豆'){
    exchangebean = excresult.datas[k].productName
   }
    if (SilverBean < excresult.datas[k].salePrice && SilverBean > excresult.datas[k-1].salePrice)
     { 
     detail += Silvertotal+ `${excresult.datas[k-1].salePrice}银豆兑换${excresult.datas[k-1].productPrice}京豆\n`
    }
    else if (excresult.datas[k].salePrice == SilverBean)
     { 
      detail += Silvertotal+ `${excresult.datas[k].salePrice}银豆兑换${excresult.datas[k].productPrice}京豆\n`
     }
    }
   } else if (SilverBean < excresult.datas[0].salePrice) 
    { 
    detail+= Silvertotal+ `银豆不足以兑换京豆\n`
    }
else if (SilverBean == excresult.datas[0].salePrice) 
    { 
       detail+= Silvertotal+ `${excresult.datas[0].salePrice}银豆随机兑换${excresult.datas[0].productName}\n`
       }
    resolve()
     })
    })
   })
 })
}
function exChange() {
 return new Promise((resolve, reject) => {
  if(exchangebean&&exchangebean==jdbean+'京豆'){
  let changeurl = {
      url: `https://draw.jdfcloud.com//api/bean/square/silverBean/exchange?appId=${appid}`,
      headers: JSON.parse(signheaderVal),
      body:  '{"appId":'+' "'+appid+'"'+', "openId":'+' "'+openid+'"'+', "jdPin":'+' "'+uesername+'"'+', "productCode":"jd_bean_'+jdbean+'"}'
 }
  sy.post(changeurl, (error, response,data) =>{
    if(logs) sy.log(`${cookieName}, 兑换京豆: ${data}`)
    let result = JSON.parse(data)
    if (result.errorCode== "success"){
      detail += '\n【自动兑换】 兑换'+result.data+'个京豆 ✅'
     }
    })
  }
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
