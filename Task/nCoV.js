/**
 *  疫情日报，自动获取当前位置的疫情信息
 *  API来自 https://lab.isaaclin.cn
 *  @author: Peng-YM
 *  感谢 @Mazetsz 提供腾讯API接口Token
 *  更新地址: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/nCov.js
 */

const $ = API("nCov");

const key = "NOUBZ-7BNHD-SZ64A-HUWCW-YBGZ7-DDBNK";
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
};

!(async () => {
  // get current location
  const province = await $.get(`https://apis.map.qq.com/ws/location/v1/ip?key=${key}`).then(resp => {
    const data = JSON.parse(resp.body);
    return data.result.ad_info.province;
  });
  $.log(province);

  const overall = await $.get({
    url: "https://lab.isaaclin.cn/nCoV/api/overall?latest=1",
    headers,
  })
    .then((resp) => JSON.parse(resp.body).results[0])
    .delay(1000);
  $.log(overall);
  const news = await $.get({
    url: `https://lab.isaaclin.cn/nCoV/api/news?page=1&num=1&province=${encodeURIComponent(province)}`,
    headers,
  }).then((resp) => JSON.parse(resp.body).results[0]);
  $.log(news);

  let title = `🗞【疫情日报】🇨🇳 ${province}`;
  let subtitle = `🗓 ${formatTime()}`;
  let detail =
    "「全国数据统计」" +
    "\n    -新增确诊: " +
    overall.currentConfirmedIncr +
    "\n    -现有确诊: " +
    overall.currentConfirmedCount +
    "\n    -累计确诊: " +
    overall.confirmedCount +
    "\n    -治愈: " +
    overall.curedCount +
    "\n    -死亡: " +
    overall.deadCount +
    "\n「疫情动态」\n     " +
    news.title +
    "\n「动态详情」\n     " +
    news.summary;
  $.notify(title, subtitle, detail);
})()
  .catch((err) => $.error(err))
  .finally(() => $.done());

function formatTime() {
    const date = new Date();
    return `${
        date.getMonth() + 1
    }月${date.getDate()}日${date.getHours()}时`;
}

// prettier-ignore
/*********************************** API *************************************/
function API(t="untitled",e=!1){return new class{constructor(t,e){this.name=t,this.debug=e,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.node=(()=>this.isNode?{request:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(e){return((t,e)=>new Promise(function(s){setTimeout(s.bind(null,e),t)}))(t,e)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((e,s)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?s(t):e({...i,body:o})}):this.node.request(t,(t,i,o)=>{t?s(t):e({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((e,s)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?s(t):e({...i,body:o})}):this.node.request.post(t,(t,i,o)=>{t?s(t):e({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,e){this.log(`SET ${e} = ${t}`),this.cache[e]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${this.cache[t]}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,e,s,i){const o="string"==typeof i?i:void 0,n=s+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,e,s,{"open-url":o}):$notify(t,e,s,i)),this.isSurge&&$notification.post(t,e,n),this.isLoon&&$notification.post(t,e,s),this.isNode&&("undefined"==typeof $jsbox?console.log(`${t}\n${e}\n${n}\n\n`):require("push").schedule({title:t,body:e?e+"\n"+s:s}))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){this.log("ERROR: "+t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){this.log("DONE"),this.isNode||$done(t)}}(t,e)}
/*****************************************************************************/
