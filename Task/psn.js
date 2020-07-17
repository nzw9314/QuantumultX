/**
 * 每月PSN会员限免游戏提醒
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/psn.js
 */

const $ = API("psn");
const url =
    "https://store.playstation.com/zh-hant-hk/grid/STORE-MSF86012-PLUS_FTT_CONTENT/1";
$.get({
    url,
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
    },
})
    .then((resp) => {
        const body = resp.body;
        const data = JSON.parse(body.match(/({"@context"[\s\S]*?)<\/script>/)[1]);
        $.log(data);
        return parse(data['@graph']);
    })
    .catch((err) => $.error(err))
    .finally($.done());

function parse(products) {
    products.forEach(item => {
        let description = item.description;
        // clean up css codes
        description = description.replace(/\s+/g, '');
        description = description.replace(/br|\\r|\\n/g, '');
        description = description.replace(/\w*&\w*?;/g, '');
        description = description.replace(/\w+\s{0,1}\w+="\w+"/g, '')
        const name = item.name.trim();
        $.notify(
            `🎮 [PSN会免] ${name}`,
            `🗓 时间：${getTime()}`,
            `📦 类别：${item.category}\n💡 游戏简介：${description}`,
            {
                'media-url': `${item.image}`,
                'open-url': `https://store.playstation.com/zh-hant-hk/product/${item.sku}`
            }
        )
    })
}

function getTime() {
    const today = new Date();
    return `${today.getFullYear()}年${today.getMonth() + 1}月`;
}

function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){return{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(s){return this.then(function(t){return((s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)}))(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.read(data,s),this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),delete this.cache[s],-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.setValueForKey(null,s),this.isNode&&delete this.root[s]):this.cache[s]=data,this.persistCache()}notify(s,t="",e="",i={}){const o=i["open-url"],n=i["media-url"],r=e+(o?`\n点击跳转: ${o}`:"")+(n?`\n多媒体: ${n}`:"");if(this.isQX&&$notify(s,t,e,i),this.isSurge&&$notification.post(s,t,r),this.isLoon&&$notification.post(s,t,e,o),this.isNode)if(this.isJSBox){require("push").schedule({title:s,body:(t?t+"\n":"")+r})}else console.log(`${s}\n${t}\n${r}\n\n`)}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?$done(s):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}

