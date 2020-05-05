/*
新浪新闻标准版/极速版签到(二选一)

1.打开app,点击”我的“=>”签到“，获取第一个Cookie，通知获取信息成功
2.在未签到情况下，先禁用第一条Cookie链接，然后再次进入签到，通知获取签到Cookie成功 surge极速版配置请自行更换
Surge 4.0:
[Script]
新浪新闻 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/sinanews.js,script-update-interval=0
新浪新闻 = type=http-request,pattern=https:\/\/newsapi\.sina\.cn\/\?resource=hbpage&newsId=HB-1-sina_gold_center,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/sinanews.js
新浪新闻 = type=http-request,pattern=https:\/\/newsapi\.sina\.cn\/\?resource=userpoint\/signIn,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/sinanews.js

------------------

#QX 1.0.7+ :
[task_local]
0 9 * * * sinanews.js
[rewrite_local]
https:\/\/newsapi\.sina\.cn\/\?resource=hbpage&newsId=HB-1-sina_gold_center url script-request-header sinanews.js
https:\/\/newsapi\.sina\.cn\/\?resource=userpoint\/signIn url script-request-header sinanews.js

[MITM]
hostname = newsapi.sina.cn
~~~~~~~~~~~~~~~~
＃新浪新闻极速版配置

[rewrite_local]
https?:\/\/lite\.sina\.cn\/\?resource=hbpage&newsId=HB-1-sina_gold_center - script-request-header sinanews.js
https?:\/\/lite\.sina\.cn\/\?resource=userpoint\/signIn - script-request-header sinanews.js
[task_local]
0 9 * * * sinanews.js

~~~~~~~~~~~~~~~~

*/

const CookieName ='新浪新闻'
const signurlKey = `sy_signurl_snews`
const infourlKey = `sy_info_snews`
const signheaderKey = `sy_ck_snews`
const infoheaderKey = `sy_infoheader_snews`
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const infourlVal = sy.getdata(infourlKey)
const signheaderVal =sy.getdata(signheaderKey)
const infoheaderVal =sy.getdata(infoheaderKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
 } else {
   all()
}
function GetCookie() {
if ($request && $request.method != 'OPTIONS'&&
 $request.url.match(/userpoint\/signIn/)){
   const signurlVal = $request.url
   const signheaderVal = JSON.stringify($request.headers);
   sy.log(`signurlVal:${signurlVal}`)
   sy.log(`signheaderVal:${signheaderVal}`)
   if (signurlVal) sy.setdata(signurlVal,
signurlKey)
   if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
   sy.msg(CookieName, `获取签到地址: 成功`, ``)
 }
  else if ($request && $request.method != 'OPTIONS'&& $request.url.match(/gold_center%2Findex-gold/)){
   const infourlVal = $request.url
   const infoheaderVal = JSON.stringify($request.headers);
  sy.log(`infourlVal:${infourlVal}`)
  sy.log(`infoheaderVal:${infoheaderVal}`)
  if (infourlVal) sy.setdata(infourlVal,
infourlKey)
  if (infoheaderVal) sy.setdata(infoheaderVal, infoheaderKey)
  sy.msg(CookieName, `获取信息Cookie: 成功`, ``)
  } 
}
async function all() 
{ 
  await getsign();
  await signinfo();
}


//签到
function getsign() {
  return new Promise((resolve, reject) =>{
   let signurl =  {
      url:  signurlVal,
      headers: JSON.parse(signheaderVal)}
   sy.get(signurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data)
     if (result.status == 0){
         signres = `签到成功🎉`
         detail = `获得收益: ${result.data.message.title}💰\n`  
         }  
     else if (result.status == -1){
         signres = `今日`+ result.msg
          detail = ``
         }
     else {
         signres = `签到失败❌`
         detail = `说明: `+ result.msg
         sy.msg(CookieName,signres,detail)
         }
    resolve()
    })
  })
}
function signinfo() {
  return new Promise((resolve, reject) =>{
   let infourl =  {
      url: infourlVal,
      headers: JSON.parse(infoheaderVal)}
   sy.get(infourl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data)
     const nickName = `用户昵称: ${result.data.nickName}`  
     if (result.status == 0){
         signcoin = `金币总计: ${result.data.coins}💰，`
         detail += '已连续签到' + result.data.sign.conNum+"天，"+signcoin+'明日获取'+result.data.sign.timeline[1].name+": "
+ result.data.sign.timeline[1].num
         }  
      subTitle = nickName +" " +signres
      sy.msg(CookieName,subTitle,detail)
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

