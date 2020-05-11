/*
本脚本仅适用于马卡龙抠图神器  测试无效❌
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.打开马卡龙抠图神器app， 打开app，获取签到地址成功，点击右下角”我的“=> 账户名下 ”**蛋壳“， 即可获取Cookie,获取成功后请禁用cookie
3.蛋壳明细显示今日获取签到蛋壳，则表明签到正常
4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

5.仅测试Quantumult X

By Macsuny 制作
感谢 chavyleung
感谢 senku
感谢悟空大大和各位的测试
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron ”0 9 * * *“ script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/makal.js
# 马卡龙抠图神器 Cookie.
http-request https:\/\/activity\.versa-ai\.com\/api\/community\/user\/sign\/days script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/makal.js
http-request https:\/\/app\.api\.versa-ai\.com\/app\/text script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/makal.js
~~~~~~~~~~~~~~~~
QX 1.0.7+ :
[task_local]
0 9 * * * makal.js

[rewrite_local]
https:\/\/app\.api\.versa-ai\.com\/app\/text url script-request-header makal.js
https:\/\/activity\.versa-ai\.com\/api\/community\/user\/sign\/days url script-request-header makal.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = app.api.versa-ai.com, activity.versa-ai.com
~~~~~~~~~~~~~~~~
*/

const cookieName = `马卡龙抠图神器`
const signurlKey = `sy_signurl_mkl`
const cookieKey = `sy_signheader_mkl`
const tokenKey = `sy_token_mkl`
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const cookieVal = sy.getdata(cookieKey)
const tokenVal = sy.getdata(tokenKey)
const token = JSON.parse(tokenVal)
const uid = `${token.uid}`
const bedate = `${token.beginDate}`
const userToken = `${token.userToken}`
const deviceId = `${token.deviceId}`
const myDate = new Date();  

let isGetCookie = typeof $request !== `undefined`
if (isGetCookie) {
   GetCookie()
} else {
   all()
}

function GetCookie() {
  const requrl = $request.url
  if ($request && $request.method != `OPTIONS`&&$request.url.match(/\/app\/text/)) {
  const signurlVal = requrl
  sy.log(`signurlVal:${signurlVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  sy.msg(`${cookieName}`, `获取签到地址: 成功`, ``)
}
else if ($request && $request.method != `OPTIONS`&&$request.url.match(/\/user\/sign\/days/)) {
  const cookieVal = $request.headers['Cookie']
  const signbodyVal = $request.body
  sy.log(`cookieVal:${cookieVal}`)
  sy.log(`signbodyVal:${signbodyVal}`)
const queryparam = requrl.split(`?`)[1]
if (queryparam) {
  const params = {}
  for (param of requrl.split(`?`)[1].split(`&`)) {
    params[param.split(`=`)[0]] = param.split(`=`)[1]
  }
  const token = JSON.stringify(params)
  if (sy.setdata(token, tokenKey))
  if (cookieVal) sy.setdata(cookieVal, cookieKey)
  sy.msg(`${cookieName}`, `获取cookie: 成功`, ``)
  }
 }
} 

async function all() 
{ 
  await getsign();
  await sign();
  await info();
  await total();
}
function getsign() {
 return new Promise((resolve, reject) => {
    getsignurl = {
      url: signurlVal,
	headers: {Cookie: cookieVal}  }
    sy.get(getsignurl, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
      if (result.responseCode == 0000){
           subTitle = `签到结果: 成功 🎉`
            } 
     else {
           subTitle = `签到失败`
          }
        resolve()
          })
      })
   }
    
function sign() {
  return new Promise((resolve, reject) => {
  Y = myDate.getFullYear(); //获取当前年份  
  M = ("0" + (myDate.getMonth()+1)).slice(-2); //获取当前月份
  D = ("0" + (myDate.getDate())).slice(-2); //获取当前日(1-31)  
 var time1= Y+'-'+M+'-'+ D  +' 00:00:00'
    date=new Date(time1.replace(/-/g, '/'))   
    time2=date.getTime()
    time = Y +'/'+M+'/'+ D;
	 let signidurl = {
		url: `https://activity.versa-ai.com/api/community/user/sign/days?beginDate=${bedate}&endDate=${time}&uid=${uid}&userToken=${userToken}&deviceId=${deviceId}&imei=&osType=ios&lang=zh-cn&source=app`,
		headers: {Cookie: cookieVal}      
	}
   sy.get(signidurl, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     for (i=0; i < result.result.length;i++){
     if (time2 == result.result[i].signDate){
      Id = result.result[i].signId
    sign2url = {
		url: `https://activity.versa-ai.com/api/community/user/sign/get/point`,
		headers: {Cookie: cookieVal},      
	     body : `uid=${uid}&userToken=${userToken}&deviceId=${deviceId}&imei=&osType=ios&lang=zh-cn&source=app&signId=${Id}`}
   sy.post(sign2url, (error, response, data) =>{
    //sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
          })
         }
        }
    resolve()
      })
   })
}

function info(){
sy.log(subTitle)
return new Promise((resolve, reject) => {  
   n = myDate.getDay();//获取当前星期
   infourl = {
		url: `https://activity.versa-ai.com/api/community/user/sign/rule`,
		headers: {Cookie: cookieVal}}
    sy.get(infourl, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data)
     if (n<=6&&n>0){
        detail = `今日获取蛋壳:${result.result.weeks[n].point}  `
        }
    else if(n==0) {
        subTitle += `  ${result.result.keepSignItemName}`
        detail = `今日获取蛋壳:${result.result.weeks[7].point}`
          }
     resolve()
       })
   })
}

function total() {
return new Promise((resolve, reject) => {
  totalurl = {
		url: `https://activity.versa-ai.com/api/community/user/sign/info?uid=${uid}&userToken=${userToken}&deviceId=${deviceId}&imei=&osType=ios&lang=zh-cn&source=app`,
		headers: {Cookie: cookieVal}}
    sy.get(totalurl, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
   if (result.status == `success`){
       detail += `  蛋壳总计: ${result.result.userPoint}`
       resolve()
            }
     sy.msg(cookieName, subTitle, detail)
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
      url.method = `GET`
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = `POST`
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
