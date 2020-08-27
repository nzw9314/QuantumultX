/* 
本脚本为电视节目预告  兼容chavyleung大佬的boxjs订阅优先生效
本仓库boxjs订阅地址: https://raw.githubusercontent.com/Sunert/Scripts/master/Task/sunert.boxjs.json

1.数据从电视家数据库获取
2.常用卫视代码
北京: btv1 | 湖南: hunan | 浙江: zhejiang | 
河南: henan| 江苏: jiangsu| 广东: guangdong
更多电视台请参加电视家网络列表
3.需要更换电视台的，建议本地使用或者使用boxjs订阅修改
4.借鉴chavyleung大佬的api脚本
～～～～～～～～～～～～～～～～
QX 1.0.6+ :

[task_local]
1 10 * * * tvpreview.js

～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
tvpreview.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js, enabled=true, tag=电视节目预告

-----------------

By Macsuny                   
*/
let tv = "cctv8"   //修改电视台

const $ = new Env("电视预告")

const tvnum = $.getdata("c")||tv

const  d = new Date();
      weekday = new Array(7);
      weekday[0]="星期日";
      weekday[1]="星期一";
      weekday[2]="星期二";
      weekday[3]="星期三";
      weekday[4]="星期四";
      weekday[5]="星期五";
      weekday[6]="星期六";
  n = weekday[d.getDay()]

 !(async () => {
  await playTV();
  //await showmsg()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
function playTV(){
return new Promise((resolve) => {
const wurl = {
    url: "http://api.cntv.cn/epg/epginfo?serviceId=cbox&c="+tvnum,
    headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'},
}
   $.get(wurl, (error, resp, data) => {    
   try { 
      let result = JSON.parse(data)                           
     //console.log(result)      
     $.title = `${result[`${tvnum}`].channelName}频道节目  ` + $.time('MM月dd日') + $.time('H:m')+n
      nowplay = `正在播出: ${result[`${tvnum}`].isLive}`
      let  playlist = ""
      let  playtime = ""
      for (i = 0; i < result[`${tvnum}`].program.length; i++)
       {      
          playdata = result[`${tvnum}`].program[i]
          playtime = "\n"+playdata.showTime
          duration = " 时长:"+Math.trunc(playdata.duration/60)+"分钟"
          playitem = playdata.t
          playlist += playtime+" "+playitem 
       }
     $.detail = nowplay + playlist
     let  l = result[`${tvnum}`].program.length
       for (i = 1; i < l && result[`${tvnum}`].program[i].showTime.split(':')[0] < result[`${tvnum}`].program[l-1].showTime.split(':')[0]; i++)
       { 
        if (result[`${tvnum}`].liveSt == result[`${tvnum}`].program[i].st)
         {   
         duration = "  时长: "+Math.trunc(result[`${tvnum}`].program[i+1].duration/60)+"分钟"
         $.subTitle = `即将播出: ${result[`${tvnum}`].program[i+1].t}` +duration
         } 
       }
     $.msg($.title, $.subTitle, $.detail)
      resolve()
      }
    catch(err) { 
     $.msg("无此频道节目信息或者台号错误❌", "请检查后重试", err)
        }
     })
   })
 }

  //console.log(playlist)
 
 
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t){return new Promise(s=>{const e=this.getdata("@chavy_boxjs_userCfgs.httpapi");console.log(e);const[i,o]=e.split("@"),h={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:5},headers:{"X-Key":i,Accept:"*/*"}};$.post(h,(t,e,i)=>s(i))})}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i),console.log(`${i}: ${JSON.stringify(h)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============📣系统通知📣=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`❗️${this.name}, 错误!`,t.stack):$.log("",`❗️${this.name}, 错误!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
