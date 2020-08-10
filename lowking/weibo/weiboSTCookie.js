/*
微博超话签到-lowking-v1.3(原作者NavePnow，因为通知太多进行修改，同时重构了代码)

⚠️使用方法：按下面的配置完之后打开超话页面，点击签到按钮获取cookie

⚠️注：获取完cookie记得把脚本禁用
     如果关注的数量很多脚本会超时，注意超时配置

************************
Surge 4.2.0+ 脚本配置:
************************

[Script]
# > 微博超话签到
微博超话获取cookie = type=http-request,pattern=https:\/\/weibo\.com\/p\/aj\/general\/button\?ajwvr=6&api=http:\/\/i\.huati\.weibo\.com\/aj\/super\/checkin,script-path=weiboSTCookie.js
微博超话签到 = type=cron,cronexp="0 0 0,1 * * ?",wake-system=1,script-path=weiboST.js

[Header Rewrite]
#超话页面强制用pc模式打开
^https?://weibo\.com/p/[0-9] header-replace User-Agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15"

[mitm]
hostname = weibo.com

************************
QuantumultX 本地脚本配置:
************************

[rewrite_local]
#微博超话签到
https:\/\/weibo\.com\/p\/aj\/general\/button\?ajwvr=6&api=http:\/\/i\.huati\.weibo\.com\/aj\/super\/checkin url script-request-header weiboSTCookie.js
0 0 0,1 * * ? weiboST.js
#超话页面强制用pc模式打开
^https?://weibo\.com/p/[0-9] url request-header (\r\n)User-Agent:.+(\r\n) request-header $1User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15

[mitm]
hostname= weibo.com
*/
const signHeaderKey = 'lkWeiboSTSignHeaderKey'
const lk = new ToolKit(`微博超话签到cookie`, `WeiboSTSign`, `weiboSTCookie.js`)
const isEnableLog = !lk.getVal('lkIsEnableLogWeiboSTCookie') ? true : JSON.parse(lk.getVal('lkIsEnableLogWeiboSTCookie'))
const isEnableGetCookie = !lk.getVal('lkIsEnableGetCookieWeiboST') ? true : JSON.parse(lk.getVal('lkIsEnableGetCookieWeiboST'))
const myFollowUrl = `https://weibo.com/p/1005051760825157/myfollow?relate=interested&pids=plc_main&ajaxpagelet=1&ajaxpagelet_v6=1&__ref=%2F1760825157%2Ffollow%3Frightmod%3D1%26wvr%3D6&_t=FM_159231991868741erested__97_page`
const userFollowSTKey = `lkUserFollowSTKey`
var superTalkList = []
var cookie

async function getInfo() {
    if ($request.headers['Cookie']) {
        var url = $request.url;
        cookie = $request.headers['Cookie'];
        var super_cookie = lk.setVal(signHeaderKey, cookie);
        if (!super_cookie) {
            lk.execFail()
            lk.appendNotifyInfo(`写入微博超话Cookie失败❌请重试`)
        } else {
            lk.appendNotifyInfo(`写入微博超话Cookie成功🎉您可以手动禁用此脚本`)
        }
        //拿到cookie之后获取关注到超话列表
        await getFollowList(1)
        //持久化
        lk.setVal(userFollowSTKey, JSON.stringify(superTalkList))
        lk.log(`获取关注超话${superTalkList.length}个`)
    } else {
        lk.execFail()
        lk.appendNotifyInfo(`写入微博超话Cookie失败❌请退出账号, 重复步骤`)
    }
    lk.msg(``)
    lk.done()
}

if (isEnableGetCookie) {
    getInfo()
} else {
    lk.done()
}

function getFollowList(page) {
    return new Promise((resolve, reject) => {
        let option = {
            url: myFollowUrl + (page > 1 ? `&Pl_Official_RelationInterested__97_page=${page}` : ``),
            headers: {
                cookie: cookie,
                "User-Agent": lk.userAgent
            }
        }
        lk.log(`当前获取第【${page}】页`)
        lk.get(option, async (error, statusCode, body) => {
            try {
                // lk.log(body)
                let count = 0
                body.split(`<script>parent.FM.view(`).forEach((curStr) => {
                    if (curStr.indexOf(`关系列表模块`) != -1 && curStr.indexOf(`Pl_Official_RelationInterested`) != -1) {
                        let listStr = curStr.split(`)</script>`)[0]//.split(`"\n})</script>`)[0]
                        listStr = JSON.parse(listStr)
                        listStr.html.split(`<div class="title W_fb W_autocut`).forEach((curST, index) => {
                            if (index > 0) {
                                let superId = curST.split(`?`)[0].split(`/p/`)[1]
                                let screenName = curST.split(`target="_blank">`)[1].split(`</a>`)[0]
                                if (screenName.indexOf(`<img class=\\"W_face_radius\\"`) == -1 && !!screenName) {
                                    lk.log(`超话id：${superId}，超话名：${screenName}`);
                                    let st = [screenName, superId]
                                    let listStr = JSON.stringify(superTalkList)
                                    if (listStr.indexOf(superId) == -1) {
                                        superTalkList.push(st)
                                        count++
                                    }
                                }
                            }
                        })
                    }
                })
                if (count >= 30) {
                    await getFollowList(++page)
                } else {
                    if (superTalkList.length <= 0) {
                        lk.execFail()
                        lk.appendNotifyInfo(`获取关注超话列表失败❌请等待脚本更新`)
                    } else {
                        lk.appendNotifyInfo(`获取关注超话列表成功🎉请禁用获取cookie脚本`)
                    }
                }
                resolve()
            } catch (e) {
                lk.execFail()
                lk.logErr(e)
                lk.appendNotifyInfo(`获取关注超话列表失败❌请重试，或者把日志完整文件发给作者`)
            }
        })
    })
}
function ToolKit(t,s){return new class{constructor(t,s){this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=`${this.prefix}${this.id}.dat`;this.boxJsJsonFile=`${this.prefix}${this.id}.boxjs.json`;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n██";this.startTime=(new Date).getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.log(`${this.name}, 开始执行!`);this.execComm()}async execComm(){if(this.isNode()){this.comm=process.argv.slice(2);if(this.comm[0]=="p"){this.isExecComm=true;this.log(`发送到手机测试脚本！`);await this.callApi()}}}callApi(){let t=this.getCallerFileNameAndLine().split(":")[0].replace("[","");let s="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const i=this.path.resolve(t);const e=this.path.resolve(process.cwd(),t);const h=this.fs.existsSync(i);const o=!h&&this.fs.existsSync(e);if(h||o){const t=h?i:e;try{s=this.fs.readFileSync(t)}catch(t){s=""}}else{s=""}let r={url:"http://3.3.3.18:6166/v1/scripting/evaluate",headers:{"X-Key":"ffff"},body:JSON.stringify({script_text:s,mock_type:"cron",timeout:5})};this.post(r,(t,s,i)=>{this.log(`指令【${this.comm[0]}】执行返回结果:\n${i}`);this.done()})}getCallerFileNameAndLine(){function t(){try{throw Error("")}catch(t){return t}}const s=t();const i=s.stack;const e=i.split("\n");let h=0;for(let t=0;t<e.length;t++){if(e[t].indexOf("getCustomException")>0&&t+1<e.length){h=t;break}}if(h!==0){const t=e[h];this.path=this.path?this.path:require("path");return`[${t.substring(t.lastIndexOf(this.path.sep)+1,t.lastIndexOf(":"))}]`}else{return"[-]"}}boxJsJsonBuilder(t){if(this.isNode()){this.log("using node");let s=["keys","settings"];const i="https://raw.githubusercontent.com/Orz-3";let e={};e.id=`${this.prefix}${this.id}`;e.name=this.name;e.icons=[`${i}/mini/master/${this.id.toLocaleLowerCase()}.png`,`${i}/task/master/${this.id.toLocaleLowerCase()}.png`];e.keys=[];e.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}isEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];e.author="@lowking";e.repo="https://github.com/lowking/Scripts";if(!this.isEmpty(t)){for(let i in s){let h=s[i];if(!this.isEmpty(t[h])){e[h]=e[h].concat(t[h])}delete t[h]}}Object.assign(e,t);if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.boxJsJsonFile);const s=this.path.resolve(process.cwd(),this.boxJsJsonFile);const i=this.fs.existsSync(t);const h=!i&&this.fs.existsSync(s);const o=JSON.stringify(e,null,"\t");if(i){this.fs.writeFileSync(t,o)}else if(h){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}}}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);console.log(`\n${t.message}`)}}msg(t,s){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){}else{if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(!this.isEmpty(s)){if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);this.get({url:encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{if(this.isQuanX())$notify(this.name,t,s);if(this.isSurge())$notification.post(this.name,t,s);if(this.isNode())this.log("⭐️"+this.name+t+s);if(this.isJSBox())$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}}getVal(t){if(this.isSurge()||this.isLoon()){return $persistentStore.read(t)}else if(this.isQuanX()){return $prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();return this.data[t]}else{return this.data&&this.data[t]||null}}setVal(t,s){if(this.isSurge()||this.isLoon()){return $persistentStore.write(s,t)}else if(this.isQuanX()){return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else return{}}else return{}}writeData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const h=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,h)}else if(e){this.fs.writeFileSync(s,h)}else{this.fs.writeFileSync(t,h)}}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge())$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)});if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[0]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t){this.costTime();let s=`body`;if(this.isRequest()){if(this.isQuanX())s=`content`;if(this.isSurge())s=`body`}let i={};i[s]=t;if(this.isQuanX())this.isRequest()?$done(i):null;if(this.isSurge())this.isRequest()?$done(i):$done()}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){if(typeof t=="undefined"||t==null||t==""||t=="null"){return true}else{return false}}randomString(t){t=t||32;var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var i=s.length;var e="";for(let h=0;h<t;h++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,h,o,r,n,a,l){t+=``;if(t.length<h){while(t.length<h){if(o==0){t+=e}else{t=e+t}}}if(r){let s=``;for(var f=0;f<n;f++){s+=l}t=t.substring(0,a)+s+t.substring(n+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let h in s){t=t.replace(`${i}${h}${e}`,s[h])}}catch(t){this.logErr(t)}return t}toDBC(t){var s="";for(var i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}}(t,s)}