/**
 * 每周Epic游戏限免提醒。
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/epic.js
 * 📌 注意 rsshub.app 需要代理访问，将下面的配置加到分流规则中：
 * 1. QX
 * host, rsshub.app, proxy
 * 2. Loon & Surge
 * domain, rsshub.app, proxy
 */
const $ = API("epic");
checkUpdate().then(() => $done());

async function checkUpdate() {
    const html = await $.get({
        url: "https://rsshub.app/epicgames/freegames"
    })
        .then((resp) => resp.body);
    const itemRegex = new RegExp(/<item>[\s\S]*?<\/item>/g);
    html.match(itemRegex).forEach(async (item) => {
        let name = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)[1];
        let url = item.match(/<link>([\s\S]*?)<\/link>/)[1];
        let imgurl = item.match(/<img src=\"(.*)\" referrerpolicy/)[1];
        let notificationURL = {
            "open-url": url,
            "media-url": imgurl
        }
        let time = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)[1];
        let {description, publisher} = await fetchGameInfo(url);
        $.notify(
            `🎮 [Epic 限免]  ${name}`,
            `⏰ 发布时间: ${formatTime(time)}`,
            `💡 游戏简介:\n${description}`,
            notificationURL
        );
    });
}

async function fetchGameInfo(url) {
    const html = await $.get({url}).then((resp) => resp.body);
    const description = html.match(/"og:description" content="([\s\S]*?)"/)[1];
    const publisher = "";
    return {
        description,
        publisher
    };
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${
        date.getMonth() + 1
    }月${date.getDate()}日${date.getHours()}时`;
}

// prettier-ignore
/*********************************** API *************************************/
function API(t="untitled",s=!1){return new class{constructor(t,s){this.name=t,this.debug=s,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>this.isNode?{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(s){return((t,s)=>new Promise(function(e){setTimeout(e.bind(null,s),t)}))(t,s)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request.post(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,s){this.log(`SET ${s} = ${JSON.stringify(t)}`),this.cache[s]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,s,e,i){const o="string"==typeof i?i:void 0,n=e+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,s,e,{"open-url":o}):$notify(t,s,e,i)),this.isSurge&&$notification.post(t,s,n),this.isLoon&&$notification.post(t,s,e),this.isNode&&(this.isJSBox?require("push").schedule({title:t,body:s?s+"\n"+e:e}):console.log(`${t}\n${s}\n${n}\n\n`))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){console.log("ERROR: "+t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){this.isQX||this.isLoon||this.isSurge?$done(t):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=t.headers,$context.statusCode=t.statusCode,$context.body=t.body)}}(t,s)}
/*****************************************************************************/