/*
更新时间: 2020-07-31 19:15

赞赏:中青邀请码`46308484`,农妇山泉 -> 有点咸，万分感谢

本脚本仅适用于中青看点极速版领取青豆

增加每日打卡，打卡时间每日5:00-8:00❗️，请不要忘记设置运行时间，共3条Cookie，请全部获取，获取请注释掉

获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.进入app，进入任务中心或者签到一次,即可获取Cookie. 阅读一篇文章，获取阅读请求body，并获取阅读时长，在阅读文章最下面有个惊喜红包，点击获取惊喜红包请求
3.可随时获取Cookie.
4.增加转盘抽奖通知间隔，为了照顾新用户，前三次会有通知，以后默认每10次转盘抽奖通知一次，可自行修改❗️ 转盘完成后通知会一直开启
5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
6.更新日志: 
 31/05 v1.01 取消激励视频Cookie，添加阅读时长

阅读奖励和看视频得奖励一个请求只能运行三次‼️，请不要询问为什么，次日可以继续


仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
中青看点 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js,script-update-interval=0

中青看点 = type=http-request,pattern=https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign),script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/complete,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/red_packet,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, enabled=true, tag=中青看点

http-request https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
http-request https:\/\/ios\.baertt\.com\/v5\/article\/complete script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/article\/red_packet script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
-----------------
QX 1.0. 7+ :
[task_local]
0 9 * * * youth.js

[rewrite_local]
https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) url script-request-header youth.js

https?:\/\/ios\.baertt\.com\/v5\/article\/complete url script-request-body youth.js

https:\/\/ios\.baertt\.com\/v5\/article\/red_packet url script-request-body youth.js

https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json url script-request-body youth.js

~~~~~~~~~~~~~~~~
[MITM]
hostname = *.youth.cn, ios.baertt.com 
~~~~~~~~~~~~~~~~

*/
const setnotify = 50  //通知间隔，默认抽奖每50次通知一次，如需关闭全部通知请设为0
const resplogs = false;   //调试日志开关为false或true

const CookieName = "中青看点"
const $ = new Env(CookieName)
let notifyInterval = $.getdata("notifytimes")||setnotify
let logs = $.getdata("zqlogs")||resplogs

const signheaderKey = 'youthheader_zq'
const articlebodyKey = 'read_zq'
const redpbodyKey = 'red_zq'
const timebodyKey = 'readtime_zq'
const signheaderVal = $.getdata(signheaderKey)
const redpbodyVal = $.getdata(redpbodyKey)
const articlebodyVal = $.getdata(articlebodyKey)
const timebodyVal = $.getdata(timebodyKey)
let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
 !(async () => {
  await sign(),
  await signInfo(),
  await Invitant(),
  await getAdVideo(),
  await gameVideo(),
  await Articlered(),
  await rotary(),
  await rotaryCheck(),
  await punchCard(),
  await endCard(),
  await Cardshare(),
  await openbox(),
  await share(),
  await readArticle(),
  await readTime(),
  await earningsInfo(),
  await showmsg()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
}

function GetCookie() {
   if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/TaskCenter\/(sign|getSign)/)) {
   const signheaderVal = JSON.stringify($request.headers)
    if (signheaderVal)        $.setdata(signheaderVal,signheaderKey)
    $.log(`[${CookieName}] 获取Cookie: 成功,signheaderVal: ${signheaderVal}`)
    $.msg(CookieName, `获取Cookie: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/article\/complete/)) {
   const articlebodyVal = $request.body
    if (articlebodyVal)        $.setdata(articlebodyVal,articlebodyKey)
    $.log(`[${CookieName}] 获取阅读: 成功,articlebodyVal: ${articlebodyVal}`)
    $.msg(CookieName, `获取阅读请求: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/v5\/user\/app_stay/)) {
   const timebodyVal = $request.body
    if (timebodyVal)        $.setdata(timebodyVal,timebodyKey)
    $.log(`[${CookieName}] 获取阅读: 成功,timebodyVal: ${timebodyVal}`)
    $.msg(CookieName, `获取阅读时长: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/article\/red_packet/)) {
   const redpbodyVal = $request.body
    if (redpbodyVal)        $.setdata(redpbodyVal,redpbodyKey)
    $.log(`[${CookieName}] 获取惊喜红包: 成功,redpbodyVal: ${redpbodyVal}`)
    $.msg(CookieName, `获取惊喜红包请求: 成功🎉`, ``)
  }
 }

function sign() {      
 return new Promise((resolve, reject) =>
   {
    const signurl = { 
      url: 'https://kd.youth.cn/TaskCenter/sign', 
      headers: JSON.parse(signheaderVal),
}
     $.post(signurl, (error, response, data) =>{
       if(logs=="true")  $.log(`${CookieName}, data: ${data}`)
       signres =JSON.parse(data)
       if (signres.status == 1){
          signresult = `【签到信息】成功`
          detail= `金币: +${signres.score}，明日金币: +${signres.nextScore}\n`
           }
       else if(signres.status == 0){
          signresult = `【签到信息】重复`
          detail= ``
         }
        else if(signres.status == 2){
         signresult = `签到失败，Cookie已失效‼️`
         detail= ``
         $.msg(CookieName,signresult,detail)
         return
         }
       resolve()
       })
     })
  }
      
function signInfo() {      
 return new Promise((resolve, reject) => {
    const infourl = { 
      url: 'https://kd.youth.cn/TaskCenter/getSign', 
      headers: JSON.parse(signheaderVal),
}
   $.post(infourl, (error, response, data) =>
 {
        if(logs=="true")$.log(`${CookieName}, 签到信息: ${data}`)
      signinfo =JSON.parse(data)
      if (signinfo.status == 1){
         subTitle = `【收益总计】${signinfo.data.user.score}青豆  现金约${signinfo.data.user.money}元`
         nick =`  账号: ${signinfo.data.user.nickname}`
         detail = signresult+ ` 连续签到: ${signinfo.data.sign_day}天 签到 +${signinfo.data.sign_score}青豆\n<本次收益>：\n`
           }
       else {
          subTitle = `${signinfo.msg}`
          detail= ``
         }
    resolve()
       })
     })
  }

function Invitant() {      
 return new Promise((resolve, reject) => {
   const url = { 
     url: `https://kd.youth.cn/WebApi/User/fillCode`, 
     headers: JSON.parse(signheaderVal),
     body: `{"code": "46308484"}`,
}
   $.post(url, (error, response, data) =>
 {
   //$.log(`Invitdata:${data}`)
 })
  aticleshare()
  resolve()
 })
}

function aticleshare() {      
 return new Promise((resolve, reject) => {
     shareurl = { 
      url: `https://kd.youth.cn/n/27043840?46746961.html`, 
      headers: {Cookie: JSON.parse(signheaderVal)['Cookie']},
}
   $.get(shareurl, (error, response, data) =>{
   //$.log(`data:${data}`)
   })
resolve()
 })
}

//看视频奖励
function getAdVideo() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://kd.youth.cn/taskCenter/getAdVideoReward`, 
      headers: JSON.parse(signheaderVal),
      body: 'type=taskCenter'
}
   $.post(url, (error, response, data) =>{
     if(logs=="true") $.log(`视频广告:${data}`)
   adVideores = JSON.parse(data)
   if (adVideores.status==1){
      detail += `【观看视频】  +${adVideores.score}个青豆\n` }
   })
resolve()
 })
}
// 点我激励视频奖励
function gameVideo() {      
 return new Promise((resolve, reject) => {
   const url = { 
      url: `https://ios.baertt.com/v5/Game/GameVideoReward.json`, 
      body: articlebodyVal,
}
   $.post(url, (error, response, data) =>
 {
      if(logs=="true")$.log(`激励视频:${data}`)
   gameres = JSON.parse(data)
   if (gameres.success==true){
     detail += `【激励视频】  ${gameres.items.score}\n`}
    })
  resolve()
  })
}

//阅读奖励
function readArticle() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://ios.baertt.com/v5/article/complete.json`, 
      body: articlebodyVal,
}
   $.post(url, (error, response, data) =>
 {
    if(logs=="true") $.log(`阅读奖励:${data}`)
   readres = JSON.parse(data)
    if (readres.items.max_notice == '\u770b\u592a\u4e45\u4e86\uff0c\u63621\u7bc7\u8bd5\u8bd5'){
     //detail += ` \u770b\u592a\u4e45\u4e86\uff0c\u63621\u7bc7\u8bd5\u8bd5，`
     }
  else if (readres.items.read_score !== undefined){
     detail += `【阅读奖励】  +${readres.items.read_score}个青豆\n`
     }
  resolve()
   })
 })
}
//文章阅读附加
function Articlered() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://ios.baertt.com/v5/article/red_packet.json`, 
      body: redpbodyVal,
}
  $.post(url, (error, response, data) =>{
     if(logs=="true")$.log(`阅读附加:${data}`)
   redres = JSON.parse(data)
   if (redres.success==true){
     detail += `【惊喜红包】  +${redres.items.score}个青豆\n`  
     }
  resolve()
   })
 })
}
//转盘奖励
function rotary() {      
 const rotarbody = signheaderVal.split("&")[15]+'&'+signheaderVal.split("&")[8]
 return new Promise((resolve, reject) => {
    setTimeout(()=> {
   const time = new Date().getTime()
    const url = { 
      url: `https://kd.youth.cn/WebApi/RotaryTable/turnRotary?_=${time}`, 
      headers: JSON.parse(signheaderVal),
      body: rotarbody
}
  $.post(url, (error, response, data) =>{
    if(logs=="true")$.log(`转盘抽奖:${data}`)
   rotaryres = JSON.parse(data)
   if (rotaryres.status==1){
     detail += `【转盘抽奖】  +${rotaryres.data.score}个青豆 剩余${rotaryres.data.remainTurn}次\n`  
    }
   if(rotaryres.code!=10010&&rotaryres.data.doubleNum!=0){
      TurnDouble()
    }
  else if (rotaryres.code==10010){
    rotarynum = ` 转盘${rotaryres.msg}🎉`
      }
    resolve()
   })
  })
 })
}

//转盘宝箱判断
function rotaryCheck() { 
 return new Promise((resolve) => {
    time = new Date().getTime();   
    rotar = signheaderVal.split("&")[15]+'&'+signheaderVal.split("&")[8]+'&num='
  if(rotaryres.code!=10010){
for (i=0;i<4;i++){
   if(100-rotaryres.data.remainTurn==rotaryres.data.chestOpen[i].times){
   rotarbody = rotar+i+1
   const url = { 
      url: `https://kd.youth.cn/WebApi/RotaryTable/chestReward?_=${time}`, 
      headers: JSON.parse(signheaderVal),
      body: rotarbody
}
  $.post(url, (error, response, data) =>{
    if(logs=="true")$.log(`转盘宝箱抽奖:${data}`)
   rotaryres1 = JSON.parse(data)
   if (rotaryres1.status==1){
     detail += `【转盘宝箱】  +${rotaryres4.data.score}个青豆\n`
       }
     })
    }
   }
  }
  resolve()
 })
}

//开启打卡
function punchCard() {      
 return new Promise((resolve, reject) => {
  setTimeout(() =>  {
    const url = { 
      url: `https://kd.youth.cn/WebApi/PunchCard/signUp?`, 
      headers: JSON.parse(signheaderVal),
}
  $.post(url, (error, response, data) =>{
    if(logs=="true")$.log(`每日开启打卡:${data}`)
   punchcardstart = JSON.parse(data)
   if (punchcardstart.code==1){
     detail += `【打卡报名】  开启打卡${punchcardstart.msg} ✅ \n`  
       }
    else if(punchcardstart.code==0){
     //detail += `${punchcardstart.msg}`
       }
     })
   resolve()
   })
 })
}

//结束打卡
function endCard() {      
 return new Promise((resolve, reject) => {
  setTimeout(() =>  {
    const url = { 
      url: `https://kd.youth.cn/WebApi/PunchCard/doCard?`, 
      headers: JSON.parse(signheaderVal),
}
  $.post(url, (error, response, data) =>{
    if(logs=="true")$.log(`打卡结果:${data}`)
   punchcardend = JSON.parse(data)
   if (punchcardend.code==1){
     detail += `【早起打卡】  ${punchcardend.msg}打卡时间: ${punchcardend.data.card_time} ✅`  
       }
    else if(punchcardend.code==0){
     //detail += `${punchcardend.msg}`
       }
     })
   resolve()
   })
 })
}

//打卡分享
function Cardshare() {      
 return new Promise((resolve, reject) => {
  setTimeout(() =>  {
const starturl = { 
      url: `https://kd.youth.cn/WebApi/PunchCard/shareStart?`, 
      headers: JSON.parse(signheaderVal),
}
  $.post(starturl, (error, response, data) =>{
    if(logs=="true") $.log(`打卡分享开启:${data}`)
   sharestart = JSON.parse(data)
   if (sharestart.code==1){
     //detail += `分享${shareres.msg}`  
       }
    let endurl = { 
      url: `https://kd.youth.cn/WebApi/PunchCard/shareEnd?`, 
      headers: JSON.parse(signheaderVal),
     }
  $.post(endurl, (error, response, data) =>{
   if(logs=="true") $.log(`打卡分享:${data}`)
   shareres = JSON.parse(data)
   if (shareres.code==1){
     detail += `【手机分享】  +${shareres.data.score}个青豆\n`  
       }
    else if(shareres.code==0){
     //detail += `${shareres.msg}，`
       }
     })
    resolve()
    })
   })
 })
}
//开启时段宝箱
function openbox() {      
 return new Promise((resolve, reject) => {
  setTimeout(() =>  {
    const url = { 
      url: `https://kd.youth.cn/WebApi/invite/openHourRed`, 
      headers: JSON.parse(signheaderVal),
}
  $.post(url, (error, response, data) =>{
    if(logs=="true") $.log(`时段开启宝箱:${data}`)
   boxres = JSON.parse(data)
   if (boxres.code==1){
     detail += `【开启宝箱】  +${boxres.data.score}个青豆 下次奖励${boxres.data.time/60}分钟\n`  
       }
    else if(boxres.code==0){
     //detail += `${boxres.msg}，`
       }
   resolve()
     })
   })
 })
}

//宝箱分享
function share() {      
 return new Promise((resolve, reject) => {
  setTimeout(() =>  {
    const url = { 
      url: `https://kd.youth.cn/WebApi/invite/shareEnd`, 
      headers: JSON.parse(signheaderVal),
}
  $.post(url, (error, response, data) =>{
   if(logs==true) $.log(`宝箱分享:${data}`)
   shareres = JSON.parse(data)
   if (shareres.code==1){
     detail += `【宝箱分享】  +${shareres.data.score}个青豆\n`  
       }
    else if(shareres.code==0){
     //detail += `${shareres.msg}，`
       }
   resolve()
     })
   })
 })
}

//转盘双倍奖励
function TurnDouble() {      
 const rotarbody = signheaderVal.split("&")[15]+'&'+signheaderVal.split("&")[8]
 return new Promise((resolve, reject) => {
    setTimeout(()=> {
   const time = new Date().getTime()
    const url = { 
      url: `https://kd.youth.cn/WebApi/RotaryTable/toTurnDouble?_=${time}`, 
      headers: JSON.parse(signheaderVal),
      body: rotarbody
}
  $.post(url, (error, response, data) =>{
   if(logs==true) $.log(`转盘双倍奖励:${data}`)
   Doubleres = JSON.parse(data)
   if(Doubleres.status==1){
     detail += `【转盘双倍】  +${Doubleres.data.score1}个青豆 剩余${rotaryres.data.doubleNum}次\n`};
    })
   resolve()
  })
 })
}

function readTime() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://ios.baertt.com/v5/user/stay.json`, 
      body: timebodyVal,
}
  $.post(url, (error, response, data) =>{
    if(logs=="true")$.log(`阅读时长:${data}`)
    let timeres = JSON.parse(data)
   if (timeres.error_code==0){
     readtimes = timeres.time/60
     detail += `【阅读时长】  共计`+Math.floor(readtimes)+`分钟\n`  
       }
    else if(timeres.error_code==200001){
     detail += `【阅读时长】 ❎  未获取阅读时长Cookie\n`  
       }
    resolve()
   })
 })
}

function earningsInfo() {      
 return new Promise((resolve, reject) => {
   const token = JSON.parse(signheaderVal)['Referer'].split("?")[1]
  setTimeout(() =>  {
    const url = { 
      url: `https://kd.youth.cn/wap/user/balance?${token}`, 
      headers: signheaderVal,
}
  $.get(url, (error, response, data) =>{
   if(logs=="true") $.log(`收益信息:${data}`)
   infores = JSON.parse(data)
   if (infores.status==0){
     detail += `<收益统计>：\n`  
     for     (i=0;i<infores.history[0].group.length;i++)
{
     detail += '【'+infores.history[0].group[i].name+'】  '+ infores.history[0].group[i].money+'个青豆\n'
      }
     detail += '<今日合计>： '+infores.history[0].score+" 青豆"
      }
    resolve()
     })
   })
 })
}

function showmsg() {  
    if (rotaryres.status==1&&rotaryres.data.remainTurn>=97){
     $.msg(CookieName+" "+nick,subTitle,detail)  //默认前三次为通知
     }
    else if (rotaryres.status==1&&rotaryres.data.remainTurn%notifyInterval==0)    {
   $.msg(CookieName+" "+nick,subTitle,detail)//转盘次数/间隔整除时通知
      }
  else if (rotaryres.code==10010&&notifyInterval!=0){
    rotarynum = ` 转盘${rotaryres.msg}🎉`
   $.msg(CookieName+" "+nick+"  "+rotarynum,subTitle,detail)//任务全部完成且通知间隔不为0时通知
      }  
}

// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient}isLoon(){return"undefined"!=typeof $loon}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.exists$nc(t),i=!e&&this.fs.exists$nc(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFile$nc(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.exists$nc(t),i=!e&&this.fs.exists$nc(s),o=JSON.stringify(this.data);e?this.fs.writeFile$nc(t,o):i?this.fs.writeFile$nc(s,o):this.fs.writeFile$nc(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i),console.log(`${i}: ${JSON.stringify(h)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookie$nc(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
