/*

赞赏:中青邀请码`46308484`,农妇山泉 -> 有点咸，万分感谢

本脚本仅适用于中青看点极速版签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.进入app，签到一次,即可获取Cookie. 
3.当日签过到需次日获取Cookie.

5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
中青看点 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js,script-update-interval=0

中青看点 = type=http-request,pattern=https:\/\/kd\.youth\.cn\/TaskCenter\/sign,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
~~~~~~~~~~~~~~~~
QX 1.0. 7+ :
[task_local]
0 9 * * * youth.js

[rewrite_local]
https:\/\/kd\.youth\.cn\/TaskCenter\/sign url script-request-header youth.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = kd.youth.cn
~~~~~~~~~~~~~~~~

*/


// 赞赏:中青邀请码`46308484`
const CookieName = "中青看点"
const signurlKey ='youthurl_zq'
const signheaderKey = 'youthheader_zq'
const sy = init()
const signheaderVal = sy.getdata(signheaderKey); 

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   all()
}

function GetCookie() {
   if ($request && $request.method != `OPTIONS`) {
   const signheaderVal = JSON.stringify($request.headers);
    if (signheaderVal)        sy.setdata(signheaderVal,signheaderKey)
    sy.log(`[${CookieName}] 获取Cookie: 成功,signheaderVal: ${signheaderVal}`)
     sy.msg(CookieName, `获取Cookie: 成功🎉`, ``)
  }
 }
 
async function all() 
{ 
  await sign();
  await signInfo();
  await Invitant();
  await readcmp();
}

function sign() {      
  return new Promise((resolve, reject) =>
   {
    const signurl = { 
      url: 'https://kd.youth.cn/TaskCenter/sign', 
      headers: JSON.parse(signheaderVal),
}
     sy.get(signurl, (error, response, data) =>
 {
      sy.log(`${CookieName}, data: ${data}`)
       signresult =JSON.parse(data)
       if (signresult.status == 1){
          subTitle = `签到成功🎉`
          detail= `获取金币: ${signresult.score}，明日金币:${signresult.nextScore} `
           }
       else if(signresult.status == 0){
          subTitle = `重复签到`
          detail= ``
         }
       })
resolve()
     })
  }
      
function signInfo() {      
  return new Promise((resolve, reject) =>
   {
    const infourl = { 
      url: 'https://kd.youth.cn/TaskCenter/getSign', 
      headers: JSON.parse(signheaderVal),
}
   sy.post(infourl, (error, response, data) =>
 {
     sy.log(`${CookieName}, data: ${data}`)
      signinfo =JSON.parse(data)
      if (signinfo.status == 1){

         subTitle += ` 总计: ${signinfo.data.user.score}个青豆`
         detail += `账户昵称: ${signinfo.data.user.nickname}  已签到: ${signinfo.data.total_day}天，签到获得${signinfo.data.sign_score}个青豆`
           }
       else {
          subTitle += `${signinfo.msg}`
          detail= ``
         }
   sy.msg(CookieName,subTitle,detail)
       })
    resolve()
     })
  }

function Invitant() {      
  const time = new Date().getTime()
    const url = { 
      url: `https://kandian.youth.cn/user/share10?jsonpcallback=jQuery20308283175368764079_${time+4}&uid=46308484&_=${time}0`, 
      headers: JSON.parse(signheaderVal),
}
  url.headers['Host']='kandian.youth.cn'
   sy.get(url, (error, response, data) =>
 {
   //sy.log(`Invitdata:${data}`)
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
        url.method = `GET`
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

