
/*
赞赏:电视家邀请码`893988`,农妇山泉 -> 有点咸，万分感谢

本脚本仅适用于电视家签到，
获取Cookie方法:
1.将下方[rewrite_local]和[Task]地址复制的相应的区域，无需添加 hostname，每日7点、12点、20点各运行一次，其他随意
2.APP登陆账号后，点击菜单栏'赚赚',即可获取Cookie，进入提现页面，点击随机金额，可获取提现地址!!

3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
更新日志:
v0527: 修复无法领取睡觉金币，增加激励视频等任务，更新通知方式，包含每日签到、走路任务、睡觉赚钱任务、分享任务、激励视频任务、双端活跃和手机在线时长共计7个任务，
v0530: 添加播放任务，共9次，需运行9次，添加随机提现，请添加Cookie，提现一次即可获取，仅测试
v0602 增加每日瓜分百万金币，每日12点准时运行，增加提现金额显示
v0603 增加618活动，修复错误，增加提现额度显示
v0604 增加游戏时长，取消自定义，时长就是对应金币，时长多少金币就多少，上限未知，默认888

By Facsuny
感谢 chavyleung 等

赞赏:电视家邀请码`893988`
~~~~~~~~~~~~~~~~~~~~
loon 2.10+ :
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, tag=电视家

http-request http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家
~~~~~~~~~~~~~~~~~~~~~
# 获取电视家 Cookie.
Surge 4.0
[Script]
电视家 = type=cron,cronexp=0 8 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,script-update-interval=0

电视家 = type=http-request,pattern=http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

~~~~~~~~~~~~~~~~~~

QX 1.0.6+ :
[task_local]
0 9 * * * dianshijia.js

[rewrite_local]
http:\/\/act\.gaoqingdianshi\.com\/\/api\/v4\/sign\/signin url script-request-header dianshijia.js

http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal url script-request-header dianshijia.js

~~~~~~~~~~~~~~~~~

*/
const walkstep = '20000';//每日步数设置，可设置0-20000
const logs = 0   //响应日志开关,默认关闭
const cookieName = '电视家 📺'
const signurlKey = 'sy_signurl_dsj'
const signheaderKey = 'sy_signheader_dsj'
const drawalKey = 'drawal_dsj'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)
const drawalVal = sy.getdata(drawalKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
  } else {
   time = new Date(new Date(new Date().toLocaleDateString()).getTime())/1000
   all()
  }
function GetCookie() {
 if ($request && $request.method != 'OPTIONS'&&$request.url.match(/\/sign\/signin/)) {
  const signurlVal = $request.url
  const signheaderVal = JSON.stringify($request.headers)
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(cookieName, `获取Cookie: 成功`, ``)
  }
 else if ($request && $request.method != 'OPTIONS'&&$request.url.match(/\/cash\/withdrawal/)) {
  const drawalVal = $request.url
  sy.log(`drawalVal:${drawalVal}`)
  if (drawalVal) sy.setdata(drawalVal, drawalKey)
  sy.msg(cookieName, `获取提现地址: 成功`, ``)
  }
 sy.done()
}
async function all() 
{ 
  await signin();     // 签到
  await signinfo();   // 签到信息
  await Withdrawal(); // 金额提现
//await Withdrawal2();// 固定金额
  await act618();     // 618活动
  await taskStatus(); // 任务状态
  await runtime();    // 运行时间
  await getGametime();// 游戏时长
  await total();      // 总计
  await cash();       // 现金
  await cashlist();   // 现金列表
  await coinlist();   // 金币列表
}

function signin() {      
   return new Promise((resolve, reject) =>
     {
      const url = { url: signurlVal, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) =>
       {
      if(logs)sy.log(`${cookieName}, 签到结果: ${data}\n`)
      const result = JSON.parse(data)
      if  (result.errCode == 0) 
          { signinres = `签到成功 `
            var h = result.data.reward.length
          if (h>1){
            detail = `【签到收益】`+signinres+`${result.data.reward[0].count}金币，奖励${result.data.reward[1].name} `
           }else
             {detail = `【签到收益】`+signinres+`+${result.data.reward[0].count}金币 `
             }
           }
    else if  (result.errCode == 4)
           {
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
     if(logs)sy.log(`${cookieName}, 总计: ${data}\n`)
     const result = JSON.parse(data)
     subTitle = `待兑换金币: ${result.data.coin} ` 
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
      err }
    resolve()
     })
  }) 
}
function cash() {
  return new Promise((resolve, reject) => {
      let url = { url: `http://api.gaoqingdianshi.com/api/cash/info`, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) => 
      {
      if(logs)sy.log(`现金: ${data}\n`)
      const result = JSON.parse(data)
      subTitle += '现金:'+ result.data.amount/100+'元 额度:'+result.data.withdrawalQuota/100+'元'
      })
  resolve()
   })
}

function taskStatus() {
 return new Promise((resolve, reject) => {    
    shareurl = { url: `http://act.gaoqingdianshi.com/api/v2/task/get`, headers: JSON.parse(signheaderVal)}
    sy.get(shareurl, (error, response, data) => {
    if(logs)sy.log(`${cookieName},任务状态: ${data}\n`)
      const result = JSON.parse(data)
      if (result.errCode == 0){
   for
(i=0;i<result.data.length;i++){
if(result.data[i].dayCompCount<result.data[i].dayDoCountMax){
      if(result.data[i].name=="双端活跃"){
         double()
       }
      if(result.data[i].name=="手机在线20分钟"){
         mobileOnline()
       }
       if(result.data[i].name=="手机版分享"){
         share()
       }
       if(result.data[i].name=="激励视频"){
         watchvideo()
       }
       if(result.data[i].name=="播放任务"){
         playTask()
       }
      }
     }
    }
   })
resolve()
 })
}

function share() {
 return new Promise((resolve, reject) => {    
    shareurl = { url: `http://api.gaoqingdianshi.com/api/v4/task/complete?code=1M005`, headers: JSON.parse(signheaderVal)}
    sy.get(shareurl, (error, response, data) => {
     if(logs)sy.log(`${cookieName}, 分享: ${data}\n`)
     })
   shareurl2 = { url: `http://m3.gsyxvip.com/activity/f/transfer?uid=&inviteCode=&type=mInvite&yrwe=1&code=0216Jaqu1LRHOh0AMjru1ZYgqu16Jaqy&state=code`, headers: JSON.parse(signheaderVal),}
    sy.get(shareurl2, (error, response, data) => {
     })
resolve()
  })
}

function mobileOnline() {
 return new Promise((resolve, reject) => {    
    shareurl = { url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=1M002`, headers: JSON.parse(signheaderVal)}
    sy.get(shareurl, (error, response, data) => {
     if(logs)sy.log(`${cookieName}, 手机在线: ${data}\n`)
     })
resolve()
  })
}

function signinfo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
    let awardurl = { url: `http://act.gaoqingdianshi.com/api/v4/sign/get`, headers: JSON.parse(signheaderVal)}
     sy.get(awardurl, (error, response, data) => 
  {
    if(logs)sy.log(`${cookieName}, 签到信息: ${data}\n`)
     const result = JSON.parse(data)
     if (result.errCode == 0) 
    {
     var d = `${result.data.currentDay}`
     for (i=0; i < result.data.recentDays.length;i++)      
        {
       if (d == result.data.recentDays[i].day)
          {  detail += ` 连续签到${d}天\n`
       var j = result.data.recentDays[i].rewards.length
       if (j > 1){
                detail += `【奖励信息】今日:${result.data.recentDays[i].rewards[1].name}  `
                 } 
          else   if (j == 1) 
                 { 
                detail += `【奖励信息】今日: 无 ` 
                 }
        var k = result.data.recentDays[i+1].rewards.length
        if ( k > 1 ) {
          detail += ` 明日: `+ result.data.recentDays[i+1].rewards[1].name+`\n`
           
                 }  
           else  { 
              detail += `明日: 无\n`
        
                 }
               }               
           }  
     resolve()
        }
      })
    })
  })
}             
function runtime() {
  var date = new Date();
  var hour = date.getHours();
  var sleeping = ""
     if(hour>20){
       sleep();
       CarveUp();
  }
   else if(hour > 11&&hour <14){
       getCUpcoin();
       walk();
   }
   else if(hour > 6&&hour <10){
       wakeup()
   }
}

function walk() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/taskext/getWalk?step=${walkstep}`, headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => 
      {
      if(logs)sy.log(`走路任务: ${data}\n`)
      const result = JSON.parse(data)
     walkcoin = result.data.unGetCoin
    if (walkcoin>10){
let url = { url: `http://act.gaoqingdianshi.com/api/taskext/getCoin?code=walk&coin=${walkcoin}&ext=1`, headers: JSON.parse(signheaderVal)}
      sy.get(url, (error, response, data) => 
      {
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
      if(logs)sy.log(`睡觉任务: ${data}\n`)
      const result = JSON.parse(data)
     if (result.errCode==0){
      cookieName += result.data.name+'报名成功 🛌'
      }
else if (result.errCode==4006){
      cookieName += '   睡觉中😴'
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
      if(logs)sy.log(`睡觉打卡: ${data}\n`)
   })
resolve()
 })
}

function SpWatchVideo() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=SpWatchVideo`, 
    headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => {
      if(logs)sy.log(`激励视频: ${data}\n`)
   })
resolve()
 })
}

function watchvideo() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=Mobilewatchvideo`, 
    headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => {
    if(logs)sy.log(`激励视频: ${data}\n`)
   })
resolve()
 })
}

function double() {
  return new Promise((resolve, reject) => {
    let url = { url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=MutilPlatformActive`, headers: JSON.parse(signheaderVal)}
    sy.get(url, (error, response, data) => {
     if(logs)sy.log(`双端活跃 data: ${data}\n`)
   })
resolve()
 })
}

function coinlist() {
 return new Promise((resolve, reject) => {
    let url = { url: `http://api.gaoqingdianshi.com/api/coin/detail`, 
    headers: JSON.parse(signheaderVal)}
   sy.get(url, (error, response, data) => {
   //if(logs)sy.log(`金币列表: ${data}`)
      const result = JSON.parse(data)
       let onlamount = Number()
         vdamount = new Number()
         gamestime = new Number()
    for (i=0;i<result.data.length&&result.data[i].ctime>=time;i++){
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
     if (result.data[i].from=="播放任务"){
      detail += `【播放任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="领取瓜分金币"){
      detail += `【瓜分金币】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="游戏时长奖励"){
      gamestime += result.data[i].amount
      }
     if (result.data[i].from =="激励视频"){
     vdamount += result.data[i].amount
     }
     if (result.data[i].from=="手机在线"){
     onlamount += result.data[i].amount
      }
   }
if(vdamount){
   detail += `【激励视频】✅ 获得金币`+vdamount+'\n'
}
if(onlamount){
   detail += `【手机在线】✅ 获得金币`+onlamount+'\n'
}
if(gamestime){
   detail += `【游戏时长】✅ 获得金币`+gamestime+'\n'
}
   if (i<7){
   detail += '【未完成/总计】'+`${i-1}/7`
}
   else if (i>=7){
   detail += `【任务统计】共完成${i-1}次任务🌷`
}
   sy.msg(cookieName, subTitle, detail)
   sy.log(subTitle+`\n`+detail)
   })
resolve()
 })
}

function CarveUp() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `http://api.gaoqingdianshi.com/api/v2/taskext/getCarveUp?ext=1`, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
      if(logs)sy.log(`瓜分百万金币: ${data}`)
      const result = JSON.parse(data)
     if (result.errCode == 0) {
      detail += `【金币瓜分】✅ 报名成功\n`
    } 
   })
resolve()
 })
}
function getCUpcoin() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `http://act.gaoqingdianshi.com/api/taskext/getCoin?code=carveUp&coin=0&ext=1`, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
    if(logs)sy.log(`瓜分百万金币: ${data}`)
   })
resolve()
 })
}

function act618() {
  return new Promise((resolve, reject) => {
   const userid = JSON.parse(signheaderVal)['userid']
    let url = { 
     url: `http://share.dianshihome.com/api/activity/618/attend?userid=${userid}&acode=act618`, 
     headers: JSON.parse(signheaderVal),
   }
     url.headers['host']= 'share.dianshihome.com'
    sy.get(url, (error, response, data) => {
    if(logs)sy.log(`618活动: ${data}`)
    const result = JSON.parse(data)
    if (result.errCode == 0) {
    actres = result.data.prize.name+` 机会:`+result.data.remainCount+`次 `
     }
   else {
    actres = ``
     }
resolve()
   })
 })
}
function cashlist() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `http://api.gaoqingdianshi.com/api/cash/detail`, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
     //if(logs)sy.log(`提现列表: ${data}`)
      const result = JSON.parse(data)
            totalcash = Number()
            total618 = Number()
            cashres = ""
     if (result.errCode == 0) {
    for (i=0;i<result.data.length;i++){
 if
(result.data[i].type==2&&result.data[i].ctime>=time){
      cashres = `✅ 今日提现:`+result.data[i].amount/100+`元 `
        } 
      if(result.data[i].type==2){
      totalcash += result.data[i].amount/100
       }
     if(result.data[i].from=="618活动"&&result.data[i].ctime>=time){
      total618 += result.data[i].amount/100
       }
      }
    if(cashres&&totalcash){
      detail += `【提现结果】`+cashres+`共计提现:`+totalcash.toFixed(2)+`元\n`
     }
    else if(totalcash){
     detail += `【提现结果】今日未提现 共计提现:`+totalcash.toFixed(2)+`元\n`
    }
    if(total618){
      detail += `【618活动】✅ `+actres+`今日共计:`+total618+`元\n`
     }
   }
   resolve()
    })
  })
}
function Withdrawal() {
  return new Promise((resolve, reject) => {
   if (drawalVal !=undefined||null){
    let url = { 
     url: drawalVal, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
    if(logs)sy.log(`金币随机兑换 : ${data}\n`)
      const result = JSON.parse(data)
     if (result.errCode == 0) {
      detail += `【金额提现】✅ 到账`+result.data.price/100+`元 🌷\n`
    } 
  resolve()
   })
  }
else {
      detail += `【金额提现】❌ 请获取提现地址 \n`
   }
resolve()
 })
}
//暂未使用
function Withdrawal2() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `http://api.gaoqingdianshi.com/api/v2/cash/withdrawal?code=tx000041`, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
    sy.log(`金额兑换 : ${data}\n`)
      const result = JSON.parse(data)
     if (result.errCode == 0) {
      detail += `【金额提现】✅ `+result.data.price/100+`元 🌷\n`
    } 
  resolve()
   })
 })
}
function playTask() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=playTask`, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
      if(logs)sy.log(`播放任务: ${data}\n`)
      const result = JSON.parse(data)
     if (result.errCode==0&&result.data.doneStatus == 3) {
     detail += `【播放任务】🔕 完成/共计 `+result.data.dayCompCount+`/`+result.data.dayDoCountMax+` 次\n`
    } 
   })
resolve()
 })
}
function getGametime() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `http://act.gaoqingdianshi.com/api/v4/task/complete?code=gameTime&time=888`, 
     headers: JSON.parse(signheaderVal),
   }
    sy.get(url, (error, response, data) => {
    if(logs)sy.log(`游戏时长: ${data}\n`)
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