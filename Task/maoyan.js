//🗣 🆃🄷🄰🄽🄺🅂 🆃🄾 @xiaodie
const $ = API("maoyan",true);
const appname = "🎬 猫眼电影"
const url = "http://api.meituan.com/mmdb/movie/v2/list/rt/order/coming.json?ci=1&limit=12&token=&__vhost=api.maoyan.com";
const headers = {"User-Agent": "MeituanMovie/1560 CFNetwork/1126 Darwin/19.5.0"};
const request = {
    url: url,
    headers: headers
};

$.get(request)
  .then((resp) => {
    const data = JSON.parse(resp.body);
    const res = data.data.coming;
    for(var i in res) {
      wish = res[i].wish;
      if (wish >= 10000) {
        emoji = "🔥";
      } else if (wish >= 5000) {
        emoji = "💥";
      } else {
        emoji = "❄️";
      }
      name = "《" + res[i].nm + "》";
      hot = "    热度：" + wish + " 人想看 " + emoji;
      cat = "    类型：" + res[i].cat;
      star = "    主演：" + res[i].star;
      time = "    上映时间：" + res[i].comingTitle;
      if (typeof detail == "undefined") {
        detail = name + "\n" + hot + "\n" + cat + "\n" + star + "\n" + time;
      } else {
        detail += "\n\n" + name + "\n" + hot + "\n" + cat + "\n" + star + "\n" + time;
      }
    }
    detail = detail.replace(/undefined/g, "暂无数据");
    const j = Math.floor(Math.random()*i);
    var media = res[j].videourl
    if ( typeof media == "undefined") {
      var media = res[j].img.replace("/w.h","");
    }
    const extra = {"open-url" : "https://m.maoyan.com/#movie/.f-hot", "media-url" : media};
    $.log(res)
    $.notify(appname, "", detail, extra)
  })
  .catch((err) => $.notify("请求失败！", "", err));
  $.done();


// prettier-ignore
// OpenAPI from Peng-YM
/*********************************** API *************************************/
function API(t="untitled",s=!1){return new class{constructor(t,s){this.name=t,this.debug=s,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>this.isNode?{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(s){return((t,s)=>new Promise(function(e){setTimeout(e.bind(null,s),t)}))(t,s)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request.post(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,s){this.log(`SET ${s} = ${JSON.stringify(t)}`),this.cache[s]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,s,e,i){const o="string"==typeof i?i:void 0,n=e+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,s,e,{"open-url":o}):$notify(t,s,e,i)),this.isSurge&&$notification.post(t,s,n),this.isLoon&&$notification.post(t,s,e),this.isNode&&(this.isJSBox?require("push").schedule({title:t,body:s?s+"\n"+e:e}):console.log(`${t}\n${s}\n${n}\n\n`))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){console.log("ERROR: "+t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){this.isQX||this.isLoon||this.isSurge?$done(t):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=t.headers,$context.statusCode=t.statusCode,$context.body=t.body)}}(t,s)}
/*****************************************************************************/
