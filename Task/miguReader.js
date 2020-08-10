/*
咪咕阅读签到脚本

更新时间: 2020.08.07 00:51
脚本兼容: QuantumultX

获取Cookie说明：打开咪咕阅读，点击更多福利/立即签到
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。

**********************
QuantumultX 脚本配置:
**********************
[task_local]
# 咪咕阅读签到
0 9 * * * miguReader.js, tag=咪咕阅读签到, enabled=true

[rewrite_local]
# 获取咪咕阅读Cookie
https?:\/\/wap\.cmread\.com url script-request-header miguReader.js

[mitm] 
hostname= wap.cmread.com

*/
const $ = vinewx("miguReader",true);
const appName = `咪咕阅读`;
const cookie = $.read("cookie");
const headers = {"Accept": "*/*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-cn","Connection": "keep-alive","Cookie": $.read("cookie"),"Host": "wap.cmread.com","Referer": "https://wap.cmread.com/nap/p/qdnew.jsp?z=1&ln=10002113_24057_3801_3_380_L1&cm=M8030001&vt=3","User-Agent": "CMREAD_iPhone_Appstore_1125*2436_V8.10.0(1125*2436;Apple;iPhone10,3;iOS 13.5;zh-Hans_US;JSBridge=1.0;https) iOSAmberV2.6.2","X-Requested-With": "XMLHttpRequest",};

if (typeof $request != "undefined") {
  GetCookie()
} else if (cookie) {
  Status()
} else {
  $.notify(appName, "签到失败：请先获取Cookie⚠️", "")
}


function Status() {
  const url = `https://wap.cmread.com/nap/a/ms.sns.snsService/signinAction.json?z=1&ln=4417_14559_3801_2_380_L2&cm=M8030001&vt=3&random=267&`;
  const request = {
      url: url,
      headers: headers,
  };

  $.get(request)
    .then((resp) => {
      const data = resp.body;
      $.log("\n\n" + JSON.stringify(data))
      let res = JSON.parse(data);
      let status = res.status;
      info = res.message
      $.notify(appName, "", info)
    })
    .catch((err) => {
      $.notify(appName, "状态获取失败⚠️", JSON.stringify(err))
      $.log(`状态获取失败⚠️\n ${JSON.stringify(err)}`)
    });
}

function GetCookie() {
  if ($request.headers && ($request.url.match(/signinAction\.json/) || $request.url.match(/qdnew\.jsp/))) {
    $.log($request.headers)
    var cookie = $request.headers['Cookie'];
    if ($.read("cookie")) {
$.log("get cookie" + "\n read cookie" + $.read("cookie") + "\n new cookie" + cookie)
      if ($.read("cookie") != cookie) {
$.log("write cookie")
        $.write(cookie, "cookie");
        if ($.read("cookie") != cookie) {
$.log("updated cookie failed")
          info = "更新Cookie失败‼️";
        } else {
$.log("updated cookie success")
          info = "更新Cookie成功 🎉";
        }
      } else {
        info = "Cookie未改变";
      }
    } else {
      $.write(cookie, "cookie");
      if ($.read("cookie") != cookie) {
        info = "首次写入Cookie失败‼️";
      } else {
        info = "首次写入Cookie成功 🎉";
      }
    }
    if (typeof info != "undefined") {
      $.notify(appName, "", info)
    }
  }

  $.done();
}

// prettier-ignore
// OpenAPI from Peng-YM
/*********************************** API *************************************/
function vinewx(t="untitled",s=!1){return new class{constructor(t,s){this.name=t,this.debug=s,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>this.isNode?{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(s){return((t,s)=>new Promise(function(e){setTimeout(e.bind(null,s),t)}))(t,s)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request.post(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,s){this.log(`SET ${s} = ${JSON.stringify(t)}`),this.cache[s]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,s,e,i){const o="string"==typeof i?i:void 0,n=e+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,s,e,{"open-url":o}):$notify(t,s,e,i)),this.isSurge&&$notification.post(t,s,n),this.isLoon&&$notification.post(t,s,e),this.isNode&&(this.isJSBox?require("push").schedule({title:t,body:s?s+"\n"+e:e}):console.log(`${t}\n${s}\n${n}\n\n`))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){console.log("ERROR: "+t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){this.isQX||this.isLoon||this.isSurge?$done(t):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=t.headers,$context.statusCode=t.statusCode,$context.body=t.body)}}(t,s)}
/*****************************************************************************/
