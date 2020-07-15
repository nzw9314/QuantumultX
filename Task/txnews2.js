/*
更新时间: 2020-07-12 22:40

腾讯新闻签到修改版，可以自动阅读文章获取红包，该活动为瓜分百万现金挑战赛，针对幸运用户参与

获取Cookie方法:
1.把以下配置复制到响应配置下
2.打开腾讯新闻app，阅读几篇文章，倒计时结束后即可获取阅读Cookie;
3.看一次推荐视频获取视频地址
4.可能腾讯有某些限制，有些号码无法领取红包，手动阅读几篇，能领取红包，一般情况下都是正常的，
5.此脚本根据视频红包数开启通知，默认4个红包一次，此版本和另一版本相同
版本更新日志:
1.01 修复无法自动获取视频红包，修改通知为视频红包到账通知间隔，即有红包到账且红包数除以间隔余0时通知，或者自定义常开或常关，

---------------------
Surge 4.0
[Script]
腾讯新闻 = type=cron,cronexp=0 8 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews2.js,script-update-interval=0

腾讯新闻 = type=http-request,pattern=https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews2.js, requires-body=true

~~~~~~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews2.js, enabled=true, tag=腾讯新闻

http-request https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\? script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews2.js, requires-body=true

-----------------

QX 1.0.7+ :
 [task_local]
0 9 * * * txnews2.js, tag=腾讯新闻
 [rewrite_local]
https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\? url script-request-body txnews2.js

~~~~~~~~~~~~~~~~~~
 [MITM]
hostname = api.inews.qq.com

---------------------------

Cookie获取后，请注释掉Cookie地址。

*/
const notifyInterval = 4; //视频红包间隔通知开为1，常关为0
const logs = 0; // 日志开关
const cookieName = '腾讯新闻'
const sy = init()
const signurlVal = sy.getdata('sy_signurl_txnews2')
const cookieVal = sy.getdata( 'sy_cookie_txnews2')
const videoVal = sy.getdata( 'video_txnews2')

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   all()
}

function GetCookie() {
if ($request && $request.method != 'OPTIONS' && $request.url.match(/user\/event\/report\?/)&&$request.body.indexOf("article_read")!= -1) {
  const signurlVal =  $request.url
  const cookieVal = $request.headers['Cookie'];
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`cookieVal:${cookieVal}`)
  if (signurlVal) sy.setdata(signurlVal, 'sy_signurl_txnews2')
  if (cookieVal) sy.setdata(cookieVal,  'sy_cookie_txnews2')
  sy.msg(cookieName, `获取Cookie: 成功🎉`, ``)
  }
if ($request && $request.method != 'OPTIONS' && $request.url.match(/user\/event\/report\?/)&&$request.body.indexOf("video_read")!= -1) {
  const videoVal =  $request.url
  sy.log(`videoVal:${videoVal}`)
  if (videoVal) sy.setdata(videoVal,  'video_txnews2')
  sy.msg(cookieName, `获取视频地址: 成功🎉`, ``)
  }
 }
async function all() 
{ 
  await getsign();
  await activity();
  await toRead();
  await lookVideo();
  await openApp();
  await shareApp();
  await Redpack();
  await videoPack();
  await StepsTotal();
  await getTotal();
  await showmsg();
}

//签到
function getsign() {
 return new Promise((resolve, reject) => {
  const llUrl = {
    url: `https://api.inews.qq.com/task/v1/user/signin/add?`,headers:{Cookie: cookieVal}
  };
   sy.post(llUrl, (error, response, data) => {   
      if(logs)sy.log(`${cookieName}签到 - data: ${data}`)
      const obj = JSON.parse(data)
      if (obj.info=="success"){
       next = obj.data.next_points
       tip =  obj.data.tip_soup
       Dictum = tip.replace(/[\<|\.|\>|br]/g,"")+""+obj.data.author.replace(/[\<|\.|\>|br|图|腾讯网友]/g,"")
       signinfo =  '【签到信息】连续签到' + obj.data.signin_days+'天 '+'明日+'+ next +'金币 成功🎉\n'}
      else {
       sy.msg('签到失败，🉐登录腾讯新闻app获取cookie', "", "")
       console.log('签到失败，🉐登录腾讯新闻app获取cookie'+data)
       return
     }
  resolve()
    })
  })
}


//阅读阶梯
function toRead() {
return new Promise((resolve, reject) => {
  const toreadUrl = {
    url: signurlVal, headers: {Cookie:cookieVal},
    body: 'event=article_read'
  };
   sy.post(toreadUrl,(error, response, data) =>{
     if(logs)sy.log(`${cookieName}阅读文章 - data: ${data}`)
    resolve()
    })
   })
  }
function lookVideo() {
 return new Promise((resolve, reject) => {
   const lookVideoUrl = {
    url: videoVal, 
    headers: {Cookie:cookieVal},
    body: 'event=video_read'
  };
   sy.post(lookVideoUrl,(error, response, data) =>{
    if (error){
      sy.msg(cookieName, '观看视频:'+ error)
        }else{
        if(logs)sy.log(`${cookieName}观看视频 - data: ${data}`)
    }
   resolve()
    })
   })
 }


//阅读文章统计
function StepsTotal() {
  const ID =  signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)
return new Promise((resolve, reject) => {
  const StepsUrl = {
    url: `https://api.inews.qq.com/activity/v1/activity/info/get?activity_id=${actid}&${ID}`,
   headers: {Cookie: cookieVal}
  }
    sy.get(StepsUrl, (error, response, data) => {
     if(logs)sy.log(`${cookieName}文章统计- data: ${data}`)
       totalred = JSON.parse(data)
        if (totalred.ret == 0){
     for (i=0;i<totalred.data.award.length;i++){
   if(totalred.data.award[i].type=='article'){
       readredtotal =totalred.data.award[i].total
       readtitle =
totalred.data.award[i].title.split("，")[0].replace(/[\u4e00-\u9fa5]/g,``)
       getreadred=totalred.data.award[i].can_get
       openreadred= totalred.data.award[i].opened
       readnum = totalred.data.award[i].event_num
        }
   if(totalred.data.award[i].type=='video'){
        videoredtotal = totalred.data.award[i].total
        videotitle = totalred.data.award[i].title.split("，")[0].replace(/[\u4e00-\u9fa5]/g,``)
        getreadred = totalred.data.award[i].can_get        
        openvideored = totalred.data.award[i].opened
        videonum = totalred.data.award[i].event_num/2
        }
      }
     }
    resolve()
    })
  })
}

function openApp() {
   ID = signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)
return new Promise((resolve, reject) => {
  const openUrl = {
    url: `https://api.inews.qq.com/activity/v1/activity/redpack/get?isJailbreak=0&${ID}`,
    headers: {Cookie: cookieVal},
    body: `redpack_type=free_redpack&activity_id=${actid}`
  }
   sy.post(openUrl, (error, response, data) => {
    if(logs)sy.log(`${cookieName}每日开启- data: ${data}`)
      let opcash = JSON.parse(data)
      if(opcash.data.award.num){
       redpackres = `【每日开启】到账`+opcash.data.award.num/100+` 元 🌷\n` 
        }
      })
    resolve()
   })
}
function shareApp() {
   ID = signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)
return new Promise((resolve, reject) => {
  const openUrl = {
    url: `https://gh.prize.qq.com/show/_by0n9/invPack/index.html?#/Share?info=17A2385EE6D27888DB9F9D6B0BE90EEA&referpage=defaults`,
    headers: {Cookie: cookieVal},
  }
   sy.get(openUrl, (error, response, data) => {
    //sy.log(`${cookieName}- data: ${data}`)
      })
    resolve()
   })
}
//阶梯红包到账
function Redpack() {
   ID = signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)
return new Promise((resolve, reject) => {
  const cashUrl = {
    url: `https://api.inews.qq.com/activity/v1/activity/redpack/get?isJailbreak=0&${ID}`,
    headers: {Cookie: cookieVal},
    body: `redpack_type=article&activity_id=${actid}`
  }
   sy.post(cashUrl, (error, response, data) => {
    if(logs)sy.log(`${cookieName}阅读红包- data: ${data}`)
        let rcash = JSON.parse(data)
            readredpack = Number()
            redpackres = ``
        if (rcash.ret == 0){
       for (i=0;i<rcash.data.award.length;i++){
        readredpack += rcash.data.award[i].num/100
            }
       if(readredpack!=0){
       redpackres += `【阅读红包】到账`+readredpack+`元 🌷\n` 
           }
         }
     resolve()
       })
   })
}

function videoPack() {
  const ID =  signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)
return new Promise((resolve, reject) => {
  const cashUrl = {
    url: `https://api.inews.qq.com/activity/v1/activity/redpack/get?isJailbreak=0&${ID}`,
    headers: {Cookie: cookieVal},
    body: `redpack_type=video&activity_id=${actid}`
  }
    sy.post(cashUrl, (error, response, data) => {
    if(logs)sy.log(`${cookieName}视频红包-data:${data}`)
        let vcash = JSON.parse(data)
            redpackres = ``
            videoredpack = Number()
        if (vcash.ret == 0){
       for (i=0;i<vcash.data.award.length;i++){
        videoredpack += vcash.data.award[i].num/100
             }
       if(videoredpack!=0){
        redpackres += `【视频红包】到账`+videoredpack+`元 🌷\n` 
          }
         }
     resolve()
      })
   })
}

//收益总计
function getTotal() {
return new Promise((resolve, reject) => {
  const totalUrl = {
    url: `https://api.inews.qq.com/activity/v1/usercenter/activity/list?isJailbreak`,
    headers: {Cookie: cookieVal}};
    sy.post(totalUrl, function(error,response, data) {
    if (error) {
      sy.msg("获取收益信息失败‼️", "", error)
    } else {
    if (logs) console.log("获取收益信息" +data)
     const obj = JSON.parse(data)
      subTile = '【收益总计】'+obj.data.wealth[0].title +'金币  '+"现金: " +obj.data.wealth[1].title+'元'
        }
     resolve()
      })
   })
 }
function activity() {
return new Promise((resolve, reject) => {
  const ID =  signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)
  const actUrl = {
    url: `https://api.inews.qq.com/activity/v1/user/activity/get?isJailbreak=0&${ID}`,
    headers: {Cookie: cookieVal}};
    sy.get(actUrl, function(error,response, data) {
    if (error) {
      sy.msg("获取活动Id失败‼️", "", error)
    } else {
     //console.log("获取活动Id" +data)
     const obj = JSON.parse(data)
      actid = obj.data.activity.id
      sy.log(`您的活动ID为:`+actid)
        }
     resolve()
      })
   })
 }

function showmsg() {
 return new Promise((resolve, reject) => {
  if(readnum&&videonum){
   detail = signinfo+redpackres + `【文章阅读】已读/再读: `+ readnum +`/`+readtitle+` 篇\n`+`【阅读红包】已开/总计: `+openreadred+`/`+readredtotal+` 个🧧\n`+ `【观看视频】已看/再看: `+ videonum +`/`+videotitle+` 分钟\n`+`【视频红包】已开/总计: `+openvideored+`/`+videoredtotal+` 个🧧\n【每日一句】`+Dictum
  }
   if
(openvideored%notifyInterval==0&&videocoins=="红包+1"){
   sy.msg(cookieName,subTile,detail)
  }
   else if (openreadred==readredtotal&&openvideored==videoredtotal){
   sy.msg(cookieName+` 今日任务已完成✅`,subTile,detail)
  }
   else if(notifyInterval==1){
   sy.msg(cookieName,subTile,detail)
  }
  sy.log(subTile+`\n`+detail)
 })
resolve()
}


function init() {
  isSurge = () => {
    return undefined !== this.$httpClient
  }
  isQuanX = () => {
    return undefined !== this.$task
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle = '', body = '') => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (msg) => {
    console.log(`${msg}\n`)
  }
  get = (options, callback) => {
    if (isQuanX()) {
      if (typeof options == 'string') options = { url: options }
      options['method'] = 'GET'
      return $task.fetch(options).then(
        (response) => {
          response['status'] = response.statusCode
          callback(null, response, response.body)
        },
        (reason) => callback(reason.error, null, null)
      )
    }
    if (isSurge()) return $httpClient.get(options, callback)
  }
  post = (options, callback) => {
    if (isQuanX()) {
      if (typeof options == 'string') options = { url: options }
      options['method'] = 'POST'
      $task.fetch(options).then(
        (response) => {
          response['status'] = response.statusCode
          callback(null, response, response.body)
        },
        (reason) => callback(reason.error, null, null)
      )
    }
    if (isSurge()) $httpClient.post(options, callback)
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
