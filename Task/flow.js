/**
 * 本脚本旨在获取机场流量使用详情, 链接需支持Quantumult 显示流量使用情况
 * 原作者 @Meeta
 * @author: Peng-YM
 * 修改增加多机场信息显示，以及支持多平台，图标。优化通知显示。
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/flow.js
 * 推荐使用mini图标组：https://github.com/Orz-3/mini
 */

let subscriptions = [
    {
        link: "订阅地址1",
        name: "取个名字1",
        icon: "https://raw.githubusercontent.com/Orz-3/mini/master/pudding.png"
    },
    {
        link: "订阅地址2",
        name: "取个名字2",
        icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Nexitally.png"
    },
];

const $ = API("flow");
if ($.read("subscriptions") !== undefined) {
    subscriptions = JSON.parse($.read("subscriptions"));
}

Promise.all(subscriptions.map(async sub => await fetchInfo(sub)))
    .catch(err => $.error(err))
    .finally(() => $.done());

async function fetchInfo(sub) {
    const headers = {
        "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"
    };
    $.get({
        url: sub.link,
        headers
    }).then(resp => {
        const userinfo =
            resp.headers["Subscription-Userinfo"] ||
            resp.headers["subscription-userinfo"];
        const KEY_o_now = "o_now" + sub.name;
        const KEY_today_flow = "today_flow" + sub.name;
        $.log(userinfo);
        const upload_k = Number(userinfo.match(/upload=(\d+)/)[1]);
        const download_k = Number(userinfo.match(/download=(\d+)/)[1]);
        const total_k = Number(userinfo.match(/total=(\d+)/)[1]);
        const expire_time = userinfo.match(/expire=(\d+)/)
        let expires = "无信息"
        if (expire_time) {
            expires = formatTime(Number(expire_time[1] * 1000));
        }

        const residue_m =
            total_k / 1048576 - download_k / 1048576 - upload_k / 1048576;
        const residue = residue_m.toFixed(2).toString();
        const dnow = new Date().getTime().toString();
        const utime = dnow - $.read(KEY_o_now);
        const todayflow = $.read(KEY_today_flow) - residue;
        $.write(residue, KEY_today_flow);
        $.write(dnow, KEY_o_now);
        const title = `🚀 [机场流量] ${sub.name}`;
        const hutime = parseInt(utime / 3600000);
        const mutime = (utime / 60000) % 60;
        const subtitle = `剩余流量: ${(residue_m / 1024).toFixed(2)} G`;
        const details = `
📌 [使用情况]
${
            hutime == 0
                ? "在过去的" +
                mutime.toFixed(1) +
                "分钟内使用了: " +
                todayflow.toFixed(2) +
                " M流量"
                : "在过去的" +
                hutime +
                "时 " +
                mutime.toFixed(1) +
                "分钟内使用了: " +
                todayflow.toFixed(2) +
                " M流量"
        }
📝 [统计]
总上传: ${(upload_k / 1073741824).toFixed(2)} G
总下载: ${(download_k / 1073741824).toFixed(2)} G
🛎 [到期时间]
${expires}`;

        if (sub.icon) {
            $.notify(title, subtitle, details, {"media-url": sub.icon});
        } else {
            $.notify(title, subtitle, details);
        }
    });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() +
    1}月${date.getDate()}日${date.getHours()}时`;
}

// prettier-ignore
/*********************************** API *************************************/
function API(t="untitled",s=!1){return new class{constructor(t,s){this.name=t,this.debug=s,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>this.isNode?{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(s){return((t,s)=>new Promise(function(e){setTimeout(e.bind(null,s),t)}))(t,s)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request.post(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,s){this.log(`SET ${s} = ${JSON.stringify(t)}`),this.cache[s]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,s,e,i){const o="string"==typeof i?i:void 0,n=e+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,s,e,{"open-url":o}):$notify(t,s,e,i)),this.isSurge&&$notification.post(t,s,n),this.isLoon&&$notification.post(t,s,e),this.isNode&&(this.isJSBox?require("push").schedule({title:t,body:s?s+"\n"+e:e}):console.log(`${t}\n${s}\n${n}\n\n`))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){console.log("ERROR: "+t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){this.isQX||this.isLoon||this.isSurge?$done(t):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=t.headers,$context.statusCode=t.statusCode,$context.body=t.body)}}(t,s)}
/*****************************************************************************/

