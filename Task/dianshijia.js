
/*
赞赏:电视家邀请码`939540`,农妇山泉 -> 有点咸，万分感谢

本脚本仅适用于电视家签到，
获取Cookie方法:
1.将下方[rewrite_local]和[Task]地址复制的相应的区域，无需添加 hostname
2.APP登陆账号后，点击菜单栏'赚赚',即可获取Cookie.
3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
更新日志:
v0418: 14:30变更surge地址
v0501: 添加走路金币，默认最低领取10金币,每日步数20000步，防止封号可以适当调低
v0527: 修复无法领取睡觉金币，增加激励视频等任务，更新通知方式，包含每日签到、走路任务、睡觉赚钱任务、分享任务、激励视频任务、双端活跃和手机在线时长共计7个任务，其中激励视频可多次叠加，即可多次运行，次数未知，激励视频金币未叠加在总金币中，原因未知

By Facsuny
感谢 chavyleung 等
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
dianshijia.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,script-update-interval=0

# 获取电视家 Cookie.
Surge 4.0
[Script]
电视家 = type=cron,cronexp=0 8 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,script-update-interval=0

电视家 = type=http-request,pattern=http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

~~~~~~~~~~~~~~~~

QX 1.0.6+ :
[task_local]
0 9 * * * dianshijia.js

[rewrite_local]
http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin\? url script-request-header dianshijia.js
~~~~~~~~~~~~~~~~

*/
const walkstep = '20000';//每日步数设置，可设置0-20000
const cookieName = '电视家 📺'
const signurlKey = 'sy_signurl_dsj'
const signheaderKey = 'sy_signheader_dsj'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)

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
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(cookieName, `获取Cookie: 成功`, ``)
  sy.done()
 }
}
async function all() 
{ 
  await sign();
  await walk();
  await sleep();
  await wakeup();
  await share();
  await double();
  await total();
  await cash();
  await signinfo();
  await SpWatchVideo();
  await coinlist();
}

function sign() {      
   return new Promise((resolve, reject) =>
     {
      const url = { url: signurlVal, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) =>
       {
      sy.log(`${cookieName}, 签到结果: ${data}`)
      const result = JSON.parse(data)
      if  (result.errCode == 0) 
          { subTitle = `【签到成功】🎉`
            var h = result.data.reward.length
          if (h>1){
            detail = `获取金币${result.data.reward[0].count}，获得奖励${result.data.reward[1].name} `
           }else
             {detail = ` 已签到 ${result.data.conDay}天，获取金币${result.data.reward[0].count}\n`
             }
           }
    else if  (result.errCode == 4)
           {
            subTitle = ``
            detail = `【签到结果】 重复 🔁 `
           }       
    else if  (result.errCode == 6)
           {
            subTitle = `【签到结果】 失败`
            detail = `原因: ${result.msg}`
           }  
       resolve()
       })
    })
}

function total() {
 return new Promise((resolve, reject) => {
    const coinurl = { url: `http://api.gaoqingdianshi.com/api/coin/info`, 
     headers: JSON.parse(signheaderVal)
   }
   sy.get(coinurl, (error, response, data) => {
     sy.log(`${cookieName}, 总计: ${data}`)
     const result = JSON.parse(data)
     subTitle += ` 待兑换${result.data.coin}金币   ` 
   try{
      if(result.data.tempCoin){
       for (i=0;i<result.data.tempCoin.length;i++) {  
      coinid = result.data.tempCoin[i].id
      url5 = { url: `http://api.gaoqingdianshi.com/api/coin/temp/exchange?id=`+coinid, 
      headers: JSON.parse(signheaderVal)
     }
      sy.get(url5, (error, response, data))    
        }
       }
      }
     catch(err){
      err };
     })
  resolve()
  }) 
}
function cash() {
  return new Promise((resolve, reject) => {
      let url = { url: `http://api.gaoqingdianshi.com/api/cash/info`, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) => 
      {
      sy.log(`现金余额: ${data}`)
      const result = JSON.parse(data)
      subTitle += ' 现金: '+ result.data.amount/100+'元   '
      resolve()
      })
   })
}

function share() {
 return new Promise((resolve, reject) => {    
    shareurl = { url: `http://api.gaoqingdianshi.com/api/v4/task/complete?code=1M005`, headers: JSON.parse(signheaderVal)}
    sy.get(shareurl, (error, response, data) => {
     sy.log(`${cookieName}, 分享: ${data}`)
        const result = JSON.parse(data)
     if (result.errCode == 0)  
       {
        //detail += `分享获取${result.data.getCoin}个金币`
      }
     })
resolve()
  })
}

function signinfo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
    let awardurl = { url: `http://act.gaoqingdianshi.com/api/v4/sign/get`, headers: signheaderVal}
     sy.get(awardurl, (error, response, data) => 
  {
    //sy.log(`${cookieName}, 签到信息: ${data}`)
     const result = JSON.parse(data)
     if (result.errCode == 0) 
    {
     var d = `${result.data.currentDay}`
     for (i=0; i < result.data.recentDays.length;i++)      
        {
       if (d == result.data.recentDays[i].day)
          {  detail += ` 连续签到${d}天`
       var j = result.data.recentDays[i].rewards.length
       if (j > 1){
                detail += `\n【今日奖励】 ${result.data.recentDays[i].rewards[1].name}  `
                 } 
          else   if (j == 1) 
                 { 
                detail += `\n【今日奖励】 无  `
                 }
        var k = result.data.recentDays[i+1].rewards.length
        if ( k > 1 ) {
                detail += `【明日奖励】 ${result.data.recentDays[i+1].rewards[1].name}\n`
           
                 }  
           else  { 
              detail += `【明日奖励】 无\n`
        
                 }
               }               
           }  
    resolve()
        }
      })
    })
  })
}             

function walk() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/taskext/getWalk?step=${walkstep}`, headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => 
      {
      sy.log(`走路任务: ${data}`)
      const result = JSON.parse(data)
     walkcoin = result.data.unGetCoin
    if (walkcoin>10){
let url = { url: `http://act.gaoqingdianshi.com/api/taskext/getCoin?code=walk&coin=${walkcoin}&ext=1`, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) => 
      {
      const result = JSON.parse(data)
      //detail += `【走路任务】${result.data}`
      })
     }
    resolve()
     })
  })
}

function sleep() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/taskext/getSleep?ext=1`, headers: JSON.parse(signheaderVal)}
     sy.get(url, (error, response, data) => {
  try {
      sy.log(`睡觉任务: ${data}`)
      const result = JSON.parse(data)
     if (result.errCode==0){
      sleeping = result.data.name+'报名成功 🛌'
      }
else if (result.errCode==4006){
      sleeping = '   睡觉中😴'
      }
else {
      sleeping = ''
    }
    }
 catch (e) {
        sy.msg(cookieName, `睡觉结果: 失败`, `说明: ${e}`)}
   })
resolve()
 })
}

function wakeup() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/taskext/getCoin?code=sleep&coin=1910&ext=1`, 
    headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => {
      sy.log(`睡觉打卡: ${data}`)
      const result = JSON.parse(data)
     if (result.errCode==0){
      //detail += `【睡觉打卡】 `+result.data
      }
   })
resolve()
 })
}

function SpWatchVideo() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=SpWatchVideo`, 
    headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => {
      sy.log(`激励视频: ${data}`)
      const result = JSON.parse(data)
     if (result.errCode==0){
      //detail += `【激励视频】: `+result.getCoin+'＼n'
      }
   })
resolve()
 })
}


function double() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=MutilPlatformActive`, headers: JSON.parse(signheaderVal)}
    sy.get(url, (error, response, data) => {
      sy.log(`双端活跃 data: ${data}`)
      const result = JSON.parse(data)
     if (result.errCode == 0) {
      //detail += `\n【双端活跃】${result.data.getCoin}`
    } else if (result.errCode == 4000) {
      //subTitle = `签到结果: 没有次数了`
    }
   })
resolve()
 })
}

function coinlist() {
 return new Promise((resolve, reject) => {
 const time = new Date(new Date(new Date().toLocaleDateString()).getTime())/1000
    let url = { url: `http://api.gaoqingdianshi.com/api/coin/detail`, 
    headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => {
      //sy.log(`金币列表: ${data}`)
      const result = JSON.parse(data)
     let onlamount = Number()
         vdamount = Number()
    for (i=0;i<result.data.length&&result.data[i].ctime>=time;i++){
  //  sy.log(result.data[i].from)
     if (result.data[i].from=="签到"){
      detail += `【每日签到】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="领取走路金币"){
      detail += `【走路任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="领取睡觉金币"){
      detail += `【睡觉任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="手机分享"){
      detail += `【分享任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="双端活跃"){
      detail += `【双端活跃】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="手机在线"){
      for (j=0;result.data[j].from=="手机在线";j++) {
     onlamount += result.data[j].amount
       }
      }
     if (result.data[i].from=="激励视频"){
      for (k=0;result.data[k].from=="激励视频";k++){
     vdamount += result.data[k].amount
       }
     }
   }
if(vdamount){
   detail += `【激励视频】✅ 访问${k+1}次，获得金币`+vdamount+'\n'
}
if(onlamount){
   detail += `【手机在线】✅ 共${j+1}次，获得金币`+onlamount+'\n'
}
   if (i<7){
   detail += '【未完成/总计】'+`${i}/7`
}
   else if (i>=7){
   detail += `【未完成/总计】共完成${i}次任务 🌷`
}
   sy.msg(cookieName+sleeping, subTitle, detail)
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
