/*
多点签到签到脚本

更新时间: 2020.08.07 00:51
脚本兼容: QuantumultX

获取Cookie说明：打开多点签到，点击更多福利/立即签到
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。

**********************
QuantumultX 脚本配置:
**********************
[task_local]
# 多点签到签到
0 9 * * * miguReader.js, tag=多点签到签到, enabled=true

[rewrite_local]
# 获取多点签到Cookie
https?:\/\/wap\.cmread\.com url script-request-header miguReader.js

[mitm] 
hostname= wap.cmread.com

*/
const $ = vinewx("duodian",true);
const appName = `多点签到`;
const cookie = $.read("cookie");
const headers = {"Accept": "*/*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "en-us","Connection": "keep-alive","Cookie": cookie,"Host": "appapis.dmall.com","Referer": "https://act.dmall.com/dac/signIn/index.html?dmShowTitleBar=false&dmfrom=wx&bounces=false&dmNeedLogin=true&dmTransStatusBar=true","User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148Dmall/4.7.1",};

if (typeof $request != "undefined") {
  GetCookie()
} else if (cookie) {
  Status()
} else {
  $.notify(appName, "签到失败：请先获取Cookie⚠️", "")
}


function Status() {
  const url = `https://appapis.dmall.com/static/signInProccess.jsonp?callback=jQuery2230820943780348657_1591288971718&isNew=1&phone=15819253212&apiVersion=4.7.1&platform=IOS&venderId=72&storeId=12313&addressId=&longitude=114.415108&latitude=23.104593&nowLongitude=&nowLatitude=&_=1591288971719`;
  const request = {
      url: url,
      headers: headers,
  };

  $.get(request)
    .then((resp) => {
      const data = resp.body;
      var str = JSON.stringify(data)
//$.log(str)
      let start = str.lastIndexOf(":")
      let end = str.indexOf("\"}}")
//$.log(start +"\n"+ end)
      info = str.substring(start+3, end-1)
      $.notify(appName, "", info)
    })
    .catch((err) => {
      $.notify(appName, "状态获取失败⚠️", JSON.stringify(err))
      $.log(`状态获取失败⚠️\n ${JSON.stringify(err)}`)
    });
}

function GetCookie() {
  if ($request.headers && ($request.url.match(/signInProccess\.jsonp/) || $request.url.match(/qdnew\.jsp/))) {
    $.log($request.headers)
    var cookie = $request.headers[`Cookie`];
    if ($.read("cookie")) {
      if ($.read("cookie") != cookie) {
        $.write(cookie, "cookie");
        if ($.read("cookie") != cookie) {
          info = "更新Cookie失败‼️";
        } else {
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
