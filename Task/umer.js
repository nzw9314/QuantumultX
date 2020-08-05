/*
优麦医生签到脚本

更新时间: 2020.07.03 15:00
脚本兼容: QuantumultX, Surge4, Loon

获取Cookie说明：
打开优麦医生App，如通知成功获取Cookie, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。

**********************
QuantumultX 脚本配置:
**********************
[task_local]
# 优麦医生签到
0 9 * * * https://ooxx.be/js/umer.js, tag=优麦医生, img-url=https://ooxx.be/js/icon/umer.png, enabled=true

[rewrite_local]
# 获取优麦医生Cookie
https?:\/\/api\.umer\.com\.cn\/.*getCurrentUmerSign url script-request-header https://ooxx.be/js/umer.js

[mitm] 
hostname= api.umer.com.cn

**********************
Surge 4.2.0+ 脚本配置:
**********************
[Script]
优麦医生签到 = type=cron,cronexp=0 9 * * *,script-path=https://ooxx.be/js/umer.js

获取优麦医生Cookie = type=http-request,pattern=https?:\/\/api\.umer\.com\.cn\/.*getCurrentUmerSign,script-path=https://ooxx.be/js/umer.js

[MITM] 
hostname= api.umer.com.cn

************************
Loon 2.1.0+ 脚本配置:
************************

[Script]
# 优麦医生签到
cron "0 9 * * *" script-path=https://ooxx.be/js/umer.js

# 获取优麦医生Cookie
http-request https?:\/\/api\.umer\.com\.cn\/.*getCurrentUmerSign script-path=https://ooxx.be/js/umer.js

[Mitm] 
hostname= api.umer.com.cn

*/
const $ = vinewx("UMER",true);
const appName = `优麦医生`;
const CookieUM = $.read("CookieUM");
if (typeof $request != "undefined") {
  GetCookie()
} else if (CookieUM) {
  const regex = /appVersion=([A-Za-z0-9]+)/;
  const appVersion = regex.exec(CookieUM)[1];
  const ver = appVersion.toString().replace(/\B(?=(\d{1})+(?!\d))/g, ".");
  const headers = {
      "User-Agent": `UmerChat/${ver} (iPhone; iOS 13.3.1; Scale/2.00)`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.umer.com.cn"
  };
  request = {
      url: `https://api.umer.com.cn/healthchat/doctor/getDoctorPsnInfo.do?${CookieUM}`,
      headers: headers
  };
  $.post(request)
    .then((resp) => {
      const data = resp.body;
      if (data.indexOf("fail") >= 0) {
        //$.delete("CookieUM");
        $.notify(appName, "签到失败：Cookie失效⁉️请重新获取⚠️", "")
      } else {
        let res = JSON.parse(data);
        var total = res.data.maidou;
        GetSignNum(total);
      }
      $.log(appName+" 签到🔔\n"+"getDoctorPsnInfo"+"\n"+data)
    });
} else {
  $.notify(appName, "签到失败：请先获取Cookie⚠️", "")
}

function GetSignNum(total) {
  let todo = `getCurrentUmerSign`;
  request.url = request.url.replace("getDoctorPsnInfo",todo);
  $.post(request)
    .then((resp) => {
      const data = resp.body;
      let res = JSON.parse(data);
      let dayOfWeek = res.data["dayOfWeek"];
      let signs = res.data["signs"];
      if (signs.indexOf(dayOfWeek) < 0) {
        Checkin(total);
      } else {
        info = `签到失败：今日已签到‼️`;
        let todo = `setUmerSign`;
        request.url = request.url.replace("getCurrentUmerSign",todo);
        GetDays(info, total);
      }
      $.log(todo+"\n"+data);
    });
}

function Checkin(total) {
  let todo = `setUmerSign`;
  request.url = request.url.replace("getCurrentUmerSign",todo);
  $.post(request)
    .catch((err) => $.notify(appName, "签到失败⚠️", JSON.stringify(err)))
    .then((resp) => {
      const data = resp.body;
      let res = JSON.parse(data);
      let coins = res.data.maidou;
      if (coins && coins.match(/\d/g)) {
        total = parseInt(total) + parseInt(coins);
        info = `签到成功：麦豆 +${coins}💰`;
      } else {
        info = `签到成功：麦豆 +0💰`;
      }
      GetDays(info, total);
      $.log(todo+"\n"+data);
    });
}

function GetDays(info, total) {
  let todo = `getContinuedUmerSignNum`;
  request.url = request.url.replace("setUmerSign",todo);
  $.post(request)
    .then((resp) => {
      const data = resp.body;
      let res = JSON.parse(data);
      let days = res.data.signs;
      info += `\n已连续签到：${days} 天🎉  麦豆总计：${total}💰`;
      $.notify(appName, "", info);
      $.log(todo+"\n"+data);
    });
      $.done();
}

function GetCookie() {
  var UMER = $request.url.split("?")[1];
  if ($.read("CookieUM")) {
    if ($.read("CookieUM") !== UMER) {
      $.write(UMER, "CookieUM");
      if ($.read("CookieUM") !== UMER) {
        $.notify("更新优麦医生Cookie失败‼️", "", "")
      } else {
        $.notify("更新优麦医生Cookie成功 🎉", "", "")
      }
    }
  } else {
    $.write(UMER, "CookieUM");
    if ($.read("CookieUM") !== UMER) {
      $.notify("首次写入优麦医生Cookie失败‼️", "", "")
    } else {
      $.notify("首次写入优麦医生Cookie成功 🎉", "", "")
    }
  }
  $.done();
}


// prettier-ignore
// OpenAPI from Peng-YM
/*********************************** API *************************************/
function vinewx(t="untitled",s=!1){return new class{constructor(t,s){this.name=t,this.debug=s,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>this.isNode?{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(s){return((t,s)=>new Promise(function(e){setTimeout(e.bind(null,s),t)}))(t,s)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?e(t):s({...i,body:o})}):this.node.request(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?e(t):s({...i,body:o})}):this.node.request.post(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,s){this.log(`SET ${s} = ${JSON.stringify(t)}`),this.cache[s]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,s,e,i){const o="string"==typeof i?i:void 0,n=e+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,s,e,{"open-url":o}):$notify(t,s,e,i)),this.isSurge&&$notification.post(t,s,n),this.isLoon&&$notification.post(t,s,e),this.isNode&&(this.isJSBox?require("push").schedule({title:t,body:s?s+"\n"+e:e}):console.log(`${t}\n${s}\n${n}\n\n`))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){console.log("ERROR: "+t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){this.isQX||this.isLoon||this.isSurge?$done(t):this.isNode&&!this.isJSBox&&($context.headers=t.headers,$context.statusCode=t.statusCode,$context.body=t.body)}}(t,s)}
/*****************************************************************************/
