/*
更新时间: 2020-07-27 22:35 

本脚本仅适用于数码之家每日签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，

2.登陆数码之家电脑版网页，签到一次,即可获取Cookie，获取后请禁用或注释掉❗️ 签过到的需次日获取

3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

by Macsuny
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
数码之家 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js,script-update-interval=0

# 数码之家 Cookie.
数码之家 = type=http-request,pattern=id=k_misign:sign&operation=qiandao&format=text,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js
~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js, enabled=true, tag=数码之家

http-request id=k_misign:sign&operation=qiandao&format=text script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js
-----------------

QX 1.0. 7+ :
[task_local]
0 9 * * * https ://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js

[rewrite_local]
id=k_misign:sign&operation=qiandao&format=text url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js
~~~~~~~~~~~~~~~~
[MITM]
hostname =      www.mydigit.cn
~~~~~~~~~~~~~~~~

*/


const $ = new Env("数码之家")
$.KEY_sign = 'sign_mydigit'

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
!(async () => {
  const session = {}
  session.url = $request.url
  session.headers = $request.headers
  if ($.setdata(JSON.stringify(session), $.KEY_sign)) {
    $.subt = `获取会话: 成功!`
  } else {
    $.subt = `获取会话: 失败!`
  }
  $.msg($.name, $.subt)
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
} else {
 !(async () => {
  await signin();
  await Idinfo();
  await Minfo();
  await showmsg()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
}

function signin() {
  return new Promise((resolve) => {
    const opts = JSON.parse($.getdata($.KEY_sign))
    $.get(opts, (err, resp, data) => {
       //console.log(data);
      try {
        $.digit = data
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}
function showmsg() {
  return new Promise((resolve) => {
    $.subt = '签到: '
   if ($.digit.match(/[\u4e00-\u9fa5]+/g)=='已签到') $.subt += '成功'
    else if ($.digit.match(/[\u4e00-\u9fa5]+/g)[0]=='今日已签') $.subt += '重复'
    else $.subt += '失败'
    $.desc = coin+"  "+Mcoin+"  会员等级: "+level+"  "+signday
    $.msg($.name, $.subt, $.desc)
    resolve()
  })
}

function Idinfo() {
  return new Promise((resolve) => {
   signheaders = JSON.parse($.getdata($.KEY_sign)).headers
   userInfo = JSON.parse($.getdata($.KEY_sign)).headers.Referer
   const url = { 
       url: userInfo,
       headers: signheaders,
}
    $.post(url, (err, resp, data) => {
     //console.log(data);
     coin = data.match(/积分: [0-9]+/g)[0];
     level = data.match(/Lv.[0-9]+/g)[0];
     signday = data.match(/连续签到<\/span>[0-9]+/g)[0].replace('</span>',"")+"天";
    resolve()
  })
 })
}

function Minfo() {
  return new Promise((resolve) => {
   cookieval = JSON.parse($.getdata($.KEY_sign)).headers.Cookie
   const url = { 
       url: `https://www.mydigit.cn/home.php?mod=spacecp&ac=credit&showcredit=1`,
       headers: {Cookie: cookieval},
}
//url.headers["Accept"]= `*/*`
    $.post(url, (err, resp, data) => {
      //console.log(data);
       Mcoin = data.match(/M币: (<\/span>||<\/em>)[-0-9]+/g)[0].replace(/[</spanem>]/g,"");
    resolve()
  })
 })
}

// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient}isLoon(){return"undefined"!=typeof $loon}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i),console.log(`${i}: ${JSON.stringify(h)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
