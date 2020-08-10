/*
哔哩哔哩番剧监控-lowking-v1.4

按下面配置完之后，手机哔哩哔哩点击我的-动态，即可获取cookie

hostname = *.bilibili.com

************************
Surge 4.2.0+ 脚本配置:
************************

[Script]
# > 哔哩哔哩番剧监控
哔哩哔哩番剧监控cookie = type=http-request,pattern=https?:\/\/app.bilibili.com\/x\/v2\/space\/bangumi,script-path=https://raw.githubusercontent.com/lowking/Scripts/master/bilibili/bangumiMonitor.js
哔哩哔哩番剧监控 = type=cron,cronexp="0 0 0,1 * * ?",wake-system=1,script-path=https://raw.githubusercontent.com/lowking/Scripts/master/bilibili/bangumiMonitor.js


************************
QuantumultX 本地脚本配置:
************************

[rewrite_local]
#哔哩哔哩番剧监控cookie
https?:\/\/app.bilibili.com\/x\/v2\/space\/bangumi url script-request-header https://raw.githubusercontent.com/lowking/Scripts/master/bilibili/bangumiMonitor.js

[task_local]
0 0 0,1 * * ? https://raw.githubusercontent.com/lowking/Scripts/master/bilibili/bangumiMonitor.js

************************
LOON 本地脚本配置:
************************

[Script]
http-request https?:\/\/app.bilibili.com\/x\/v2\/space\/bangumi script-path=https://raw.githubusercontent.com/lowking/Scripts/master/bilibili/bangumiMonitor.js, timeout=10, tag=哔哩哔哩番剧监控cookie
cron "0 0 0,1 * * *" script-path=https://raw.githubusercontent.com/lowking/Scripts/master/bilibili/bangumiMonitor.js, tag=哔哩哔哩番剧监控

*/
const lk = new ToolKit('哔哩哔哩番剧监控', 'BilibiliBangumiMonitor')
const vmid = lk.getVal('lkVmidBilibiliBangumiMonitor')
const bangumiListKey = `lkBilibiliBangumiList`

if (!lk.isExecComm) {
    if (lk.isRequest()) {
        getCookie();
        lk.done();
    } else {
        lk.boxJsJsonBuilder();
        all();
    }
}

function getCookie() {
    const url = $request.url
    if ($request && $request.method != 'OPTIONS' && url.match(/\/x\/v2\/space\/bangumi/)) {
        lk.setVal('lkVmidBilibiliBangumiMonitor', url.split("vmid=")[1].split("&")[0])
        lk.msg(``, `获取Cookie成功🎉`)
    }
}

async function all() {
    if (lk.isEmpty(vmid)) {
        lk.execFail()
        lk.appendNotifyInfo(`请获取Cookie之后再试❌`)
    } else {
        let curList = await getFollowList(1, 15)
        if (!lk.isEmpty(curList) && Object.keys(curList).length > 0) {
            await compareDiff(curList)
        }
    }
    lk.msg(``)
    lk.done()
}

function compareDiff(curList) {
    return new Promise((resolve, reject) => {
        if ((!lk.isEmpty(curList)) && (Object.keys(curList).length > 0)) {
            let storedList = lk.getVal(bangumiListKey)
            lk.setVal(bangumiListKey, JSON.stringify(curList))
            if (lk.isEmpty(storedList)) {
                lk.appendNotifyInfo(`首次运行，已保存追番列表`)
            } else {
                try {
                    storedList = JSON.parse(storedList)
                    if (Object.keys(storedList).length > 0) {
                        //curList转成对象
                        let curKeyList = []
                        for (let i in curList) {
                            curKeyList.push(i)
                        }
                        let storedKeyList = []
                        for (let i in storedList) {
                            storedKeyList.push(i)
                        }
                        let result = findDifferentElements2(storedKeyList, curKeyList)
                        if (lk.isEmpty(result) || result.length == 0) {
                            lk.appendNotifyInfo(`无番剧更新🔉`)
                        } else {
                            lk.log(`番剧更新如下：`)
                            for (let i in result) {
                                lk.execFail()
                                lk.appendNotifyInfo(`【${curList[result[i]].title}】- ${curList[result[i]].indexShow}`)
                                lk.log(`【${curList[result[i]].title}】- ${curList[result[i]].indexShow}`)
                            }
                        }
                    } else {
                        lk.execFail()
                        lk.appendNotifyInfo(`已保存的追番列表无数据，下次运行才有更新提醒⚠️`)
                    }
                } catch (e) {
                    lk.logErr(e)
                    lk.execFail()
                    lk.appendNotifyInfo(`已保存的追番列表数据格式错误❌，请使用BoxJs手动清空后再试`)
                }
            }
        } else {
            lk.execFail()
            lk.appendNotifyInfo(`未发现番剧更新⚠️`)
        }
        resolve()
    })
}

function findDifferentElements2(array1, array2) {
    // 定义一个空数res组作为返回值的容器，基本操作次数1。
    const res = []
    // 定义一个对象用于装数组一的元素，基本操作次数1。
    const objectA = {}
    // 使用对象的 hash table 存储元素，并且去重。基本操作次数2n。
    for(const ele of array1) { // 取出n个元素n次
        objectA[ele] = undefined // 存入n个元素n次
    }
    // 定义一个对象用于装数组二的元素，基本操作次数1。
    const objectB = {}
    // 使用对象的 hash table 存储元素，并且去重。基本操作次数2n。
    for(const ele of array2){ // 取出n个元素n次
        objectB[ele] = undefined // 存入n个元素n次
    }
    // 使用对象的 hash table 删除相同元素。基本操作次数4n。
    for(const key in objectA){ //取出n个key (n次操作)
        if(key in objectB){ // 基本操作1次 (外层循环n次)
            delete objectB[key] // 基本操作1次 (外层循环n次)
            delete objectA[key] // 基本操作1次 (外层循环n次)（总共是3n 加上n次取key的操作 一共是4n）
        }
    }
    // 将第二个对象剩下来的key push到res容器中，基本操作次数也是3n次(最糟糕的情况)。
    for(const key in objectB){ // 取出n个元素n次(最糟糕的情况)。
        res[res.length] = key // 读取n次length n次，存入n个元素n次，一共2n(最糟糕的情况)。
    }
    // 返回结果，基本操作次数1。
    return res
}

function getFollowList(pn, ps, preList) {
    return new Promise((resolve, reject) => {
        let listApi = `https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn=#{pn}&ps=#{ps}&vmid=#{vmid}&ts=#{ts}`
        let param = {
            "pn": pn,
            "ps": ps,
            "vmid": vmid,
            "ts": new Date().getTime()
        }
        listApi = lk.customReplace(listApi, param)
        let url = {
            url: listApi,
            headers: {
                "User-Agent": lk.userAgent
            }
        }
        lk.get(url, async (error, response, data) => {
            let curList = {}
            try {
                if (error) {
                    lk.execFail()
                    lk.appendNotifyInfo(`获取追番列表失败❌请稍后再试`)
                } else {
                    let ret = JSON.parse(data)
                    if (ret.code == 0) {
                        let list = ret.data.list
                        let total = ret.data.total
                        for (let i in list) {
                            let bangumit = {}
                            let bangumi = list[i]
                            let sessionId = bangumi["season_id"]
                            let newEpId = bangumi["new_ep"].id
                            let title = bangumi.title
                            let indexShow = bangumi["new_ep"]["index_show"]
                            // lk.log(`番剧【${sessionId}-${title}】最新【${newEpId}-${indexShow}】更新时间【${bangumi["new_ep"]["pub_time"]}】`)
                            //记录信息
                            bangumit.sessionId = sessionId
                            bangumit.newEpId = newEpId
                            bangumit.title = title
                            bangumit.indexShow = indexShow
                            curList[`${sessionId}${newEpId}`] = bangumit
                        }
                        if (!lk.isEmpty(preList)) {
                            curList = Object.assign(preList, curList)
                        } else {
                            preList = {}
                        }
                        // lk.log(JSON.stringify(curList))
                        // lk.appendNotifyInfo(`${pn}-${ps}-${total}-${preList.length}-${curList.length}`)
                        if (pn * ps < total) {
                            curList = await getFollowList(++pn, ps, curList)
                        }
                    } else {
                        lk.execFail()
                        lk.appendNotifyInfo(`❌获取追番列表失败：${ret.message}`)
                    }
                }
            } catch (e) {
                lk.logErr(e)
                lk.execFail()
                lk.appendNotifyInfo(`追番列表数据处理错误❌请带上日志联系作者`)
            } finally {
                resolve(curList)
            }
        })
    })
}

function ToolKit(t,s,i){return new class{constructor(t,s,i){this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=`${this.prefix}${this.id}.dat`;this.boxJsJsonFile=`${this.prefix}${this.id}.boxjs.json`;this.options=i;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n██";this.startTime=(new Date).getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.log(`${this.name}, 开始执行!`);this.execComm()}async execComm(){if(this.isNode()){this.comm=process.argv.slice(2);if(this.comm[0]=="p"){this.isExecComm=true;this.log(`开始执行指令【${this.comm[0]}】=> 发送到手机测试脚本！`);if(this.isEmpty(this.options)||this.isEmpty(this.options.httpApi)){if(this.isEmpty(this.options)){this.options={}}this.options.httpApi=`ffff@3.3.3.18:6166`}else{if(/.*?@.*?:[0-9]+/.test(this.options.httpApi)){this.log(`httpApi格式错误！格式：ffff@3.3.3.18:6166`);this.done()}}await this.callApi()}}}callApi(){let t=this.getCallerFileNameAndLine().split(":")[0].replace("[","");this.log(`获取【${t}】内容传给手机`);let s="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const i=this.path.resolve(t);const e=this.path.resolve(process.cwd(),t);const h=this.fs.existsSync(i);const o=!h&&this.fs.existsSync(e);if(h||o){const t=h?i:e;try{s=this.fs.readFileSync(t)}catch(t){s=""}}else{s=""}let n={url:`http://${this.options.httpApi.split("@")[1]}/v1/scripting/evaluate`,headers:{"X-Key":`${this.options.httpApi.split("@")[0]}`},body:{script_text:`${s}`,mock_type:"cron",timeout:5},json:true};this.post(n,(s,i,e)=>{this.log(`已将脚本【${t}】发给手机！`);this.done()})}getCallerFileNameAndLine(){let t;try{throw Error("")}catch(s){t=s}const s=t.stack;const i=s.split("\n");let e=1;if(e!==0){const t=i[e];this.path=this.path?this.path:require("path");return`[${t.substring(t.lastIndexOf(this.path.sep)+1,t.lastIndexOf(":"))}]`}else{return"[-]"}}getFunName(t){var s=t.toString();s=s.substr("function ".length);s=s.substr(0,s.indexOf("("));return s}boxJsJsonBuilder(t){if(this.isNode()){this.log("using node");let s=["keys","settings"];const i="https://raw.githubusercontent.com/Orz-3";let e={};e.id=`${this.prefix}${this.id}`;e.name=this.name;e.icons=[`${i}/mini/master/${this.id.toLocaleLowerCase()}.png`,`${i}/task/master/${this.id.toLocaleLowerCase()}.png`];e.keys=[];e.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}isEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];e.author="@lowking";e.repo="https://github.com/lowking/Scripts";if(!this.isEmpty(t)){for(let i in s){let h=s[i];if(!this.isEmpty(t[h])){e[h]=e[h].concat(t[h])}delete t[h]}}Object.assign(e,t);if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.boxJsJsonFile);const s=this.path.resolve(process.cwd(),this.boxJsJsonFile);const i=this.fs.existsSync(t);const h=!i&&this.fs.existsSync(s);const o=JSON.stringify(e,null,"\t");if(i){this.fs.writeFileSync(t,o)}else if(h){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}}}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);console.log(`\n${t.message}`)}}msg(t,s){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){}else{if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(!this.isEmpty(s)){if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);this.get({url:encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{if(this.isQuanX())$notify(this.name,t,s);if(this.isSurge())$notification.post(this.name,t,s);if(this.isNode())this.log("⭐️"+this.name+t+s);if(this.isJSBox())$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}}getVal(t){if(this.isSurge()||this.isLoon()){return $persistentStore.read(t)}else if(this.isQuanX()){return $prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();return this.data[t]}else{return this.data&&this.data[t]||null}}setVal(t,s){if(this.isSurge()||this.isLoon()){return $persistentStore.write(s,t)}else if(this.isQuanX()){return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else return{}}else return{}}writeData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const h=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,h)}else if(e){this.fs.writeFileSync(s,h)}else{this.fs.writeFileSync(t,h)}}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge())$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)});if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[0]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t){this.costTime();let s=`body`;if(this.isRequest()){if(this.isQuanX())s=`content`;if(this.isSurge())s=`body`}let i={};i[s]=t;if(this.isQuanX())this.isRequest()?$done(i):null;if(this.isSurge())this.isRequest()?$done(i):$done()}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){if(typeof t=="undefined"||t==null||t==""||t=="null"){return true}else{return false}}randomString(t){t=t||32;var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var i=s.length;var e="";for(let h=0;h<t;h++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,h,o,n,r,a,l){t+=``;if(t.length<h){while(t.length<h){if(o==0){t+=e}else{t=e+t}}}if(n){let s=``;for(var f=0;f<r;f++){s+=l}t=t.substring(0,a)+s+t.substring(r+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let h in s){t=t.replace(`${i}${h}${e}`,s[h])}}catch(t){this.logErr(t)}return t}toDBC(t){var s="";for(var i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}}(t,s,i)}