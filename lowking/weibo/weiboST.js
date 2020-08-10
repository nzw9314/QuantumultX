/*
微博超话签到-lowking-v1.5(原作者NavePnow，因为通知太多进行修改，同时重构了代码)

⚠️使用方法：按下面的配置完之后打开超话页面，点击签到按钮获取cookie

⚠️注：获取完cookie记得把脚本禁用

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
https:\/\/weibo\.com\/p\/aj\/general\/button\?ajwvr=6&api=http:\/\/i\.huati\.weibo\.com\/aj\/super\/checkin url script-request-header https://raw.githubusercontent.com/lowking/Scripts/master/weibo/weiboSTCookie.js
0 0 0,1 * * ? https://raw.githubusercontent.com/lowking/Scripts/master/weibo/weiboST.js
#超话页面强制用pc模式打开
^https?://weibo\.com/p/[0-9] url request-header (\r\n)User-Agent:.+(\r\n) request-header $1User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15

[mitm] 
hostname= weibo.com
*/
const signHeaderKey = 'lkWeiboSTSignHeaderKey'
const lk = new ToolKit(`微博超话签到`, `WeiboSTSign`)
const isEnableLog = !lk.getVal('lkIsEnableLogWeiboST') ? true : JSON.parse(lk.getVal('lkIsEnableLogWeiboST'))
const isClearCookie = !lk.getVal('lkIsClearCookie') ? false : JSON.parse(lk.getVal('lkIsClearCookie'))
const userFollowSTKey = `lkUserFollowSTKey`
var accounts = !lk.getVal(userFollowSTKey) ? false : JSON.parse(lk.getVal(userFollowSTKey))


if (!lk.isExecComm) {
    !(async () => {
        lk.boxJsJsonBuilder()
        let cookie = lk.getVal(signHeaderKey)
        //校验cookie
        lk.log(lk.getVal(userFollowSTKey))
        if (!cookie || isClearCookie || !accounts) {
            lk.execFail()
            lk.setVal(signHeaderKey, ``)
            lk.appendNotifyInfo(isClearCookie ? `手动清除cookie` : `未获取到cookie或关注列表，请重新获取❌`)
        } else {
            await signIn(); //签到
        }
        lk.msg(``)
        lk.done()
    })()
}

function signIn() {
    return new Promise(async (resolve, reject) => {
        for (let i in accounts) {
            let name = accounts[i][0]
            let super_id = accounts[i][1]
            await superTalkSignIn(i, name, super_id)
        }
        resolve()
    })
}

function superTalkSignIn(index, name, super_id) {
    return new Promise((resolve, reject) => {
        let super_url = {
            url: "https://weibo.com/p/aj/general/button?ajwvr=6&api=http://i.huati.weibo.com/aj/super/checkin&texta=%E7%AD%BE%E5%88%B0&textb=%E5%B7%B2%E7%AD%BE%E5%88%B0&status=0&id=" + super_id + "&location=page_100808_super_index&timezone=GMT+0800&lang=zh-cn&plat=MacIntel&ua=Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_15)%20AppleWebKit/605.1.15%20(KHTML,%20like%20Gecko)%20Version/13.0.4%20Safari/605.1.15&screen=375*812&__rnd=1576850070506",
            headers: {
                Cookie: lk.getVal(signHeaderKey),
                "User-Agent": lk.userAgent
            }
        }
        lk.get(super_url, (error, response, data) => {
            lk.log(`\n${JSON.stringify(data)}`);
            try {
                if (error) {
                    lk.execFail()
                    lk.appendNotifyInfo(`【${name}】超话签到错误！-${error}`)
                } else {
                    var obj = JSON.parse(data);
                    var code = obj.code;
                    var msg = obj.msg;
                    if (code == 100003) { // 行为异常，需要重新验证
                        lk.execFail()
                        lk.appendNotifyInfo(`【${name}】超话签到❕${msg}${obj.data.location}`)
                    } else if (code == 100000) {
                        let tipMessage = obj.data.tipMessage;
                        let alert_title = obj.data.alert_title;
                        let alert_subtitle = obj.data.alert_subtitle;
                        lk.appendNotifyInfo(`【${name}】超话签到成功🎉\n${alert_title}:${alert_subtitle}`)
                    } else if (code == 382004) {
                        msg = msg.replace("(382004)", "")
                        lk.appendNotifyInfo(`【${name}】超话${msg} 🎉`)
                    } else {
                        lk.execFail()
                        lk.appendNotifyInfo(`【${name}】超话签到${msg}`)
                    }
                }
            } catch (e) {
                lk.logErr(e)
                lk.execFail()
                lk.appendNotifyInfo(`签到失败❌，请重新获取cookie！`)
            } finally {
                resolve()
            }
        })
    })
}

function ToolKit(t,s,i){return new class{constructor(t,s,i){this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=`${this.prefix}${this.id}.dat`;this.boxJsJsonFile=`${this.prefix}${this.id}.boxjs.json`;this.options=i;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n██";this.startTime=(new Date).getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.log(`${this.name}, 开始执行!`);this.execComm()}async execComm(){if(this.isNode()){this.comm=process.argv.slice(2);if(this.comm[0]=="p"){this.isExecComm=true;this.log(`开始执行指令【${this.comm[0]}】=> 发送到手机测试脚本！`);if(this.isEmpty(this.options)||this.isEmpty(this.options.httpApi)){if(this.isEmpty(this.options)){this.options={}}this.options.httpApi=`ffff@3.3.3.18:6166`}else{if(/.*?@.*?:[0-9]+/.test(this.options.httpApi)){this.log(`httpApi格式错误！格式：ffff@3.3.3.18:6166`);this.done()}}await this.callApi()}}}callApi(){let t=this.getCallerFileNameAndLine().split(":")[0].replace("[","");this.log(`获取【${t}】内容传给手机`);let s="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const i=this.path.resolve(t);const e=this.path.resolve(process.cwd(),t);const h=this.fs.existsSync(i);const o=!h&&this.fs.existsSync(e);if(h||o){const t=h?i:e;try{s=this.fs.readFileSync(t)}catch(t){s=""}}else{s=""}let n={url:`http://${this.options.httpApi.split("@")[1]}/v1/scripting/evaluate`,headers:{"X-Key":`${this.options.httpApi.split("@")[0]}`},body:{script_text:`${s}`,mock_type:"cron",timeout:5},json:true};this.post(n,(s,i,e)=>{this.log(`已将脚本【${t}】发给手机！`);this.done()})}getCallerFileNameAndLine(){let t;try{throw Error("")}catch(s){t=s}const s=t.stack;const i=s.split("\n");let e=1;if(e!==0){const t=i[e];this.path=this.path?this.path:require("path");return`[${t.substring(t.lastIndexOf(this.path.sep)+1,t.lastIndexOf(":"))}]`}else{return"[-]"}}getFunName(t){var s=t.toString();s=s.substr("function ".length);s=s.substr(0,s.indexOf("("));return s}boxJsJsonBuilder(t){if(this.isNode()){this.log("using node");let s=["keys","settings"];const i="https://raw.githubusercontent.com/Orz-3";let e={};e.id=`${this.prefix}${this.id}`;e.name=this.name;e.icons=[`${i}/mini/master/${this.id.toLocaleLowerCase()}.png`,`${i}/task/master/${this.id.toLocaleLowerCase()}.png`];e.keys=[];e.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}isEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];e.author="@lowking";e.repo="https://github.com/lowking/Scripts";if(!this.isEmpty(t)){for(let i in s){let h=s[i];if(!this.isEmpty(t[h])){e[h]=e[h].concat(t[h])}delete t[h]}}Object.assign(e,t);if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.boxJsJsonFile);const s=this.path.resolve(process.cwd(),this.boxJsJsonFile);const i=this.fs.existsSync(t);const h=!i&&this.fs.existsSync(s);const o=JSON.stringify(e,null,"\t");if(i){this.fs.writeFileSync(t,o)}else if(h){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}}}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);console.log(`\n${t.message}`)}}msg(t,s){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){}else{if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(!this.isEmpty(s)){if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);this.get({url:encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{if(this.isQuanX())$notify(this.name,t,s);if(this.isSurge())$notification.post(this.name,t,s);if(this.isNode())this.log("⭐️"+this.name+t+s);if(this.isJSBox())$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}}getVal(t){if(this.isSurge()||this.isLoon()){return $persistentStore.read(t)}else if(this.isQuanX()){return $prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();return this.data[t]}else{return this.data&&this.data[t]||null}}setVal(t,s){if(this.isSurge()||this.isLoon()){return $persistentStore.write(s,t)}else if(this.isQuanX()){return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else return{}}else return{}}writeData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const h=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,h)}else if(e){this.fs.writeFileSync(s,h)}else{this.fs.writeFileSync(t,h)}}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge())$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)});if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[0]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t){this.costTime();let s=`body`;if(this.isRequest()){if(this.isQuanX())s=`content`;if(this.isSurge())s=`body`}let i={};i[s]=t;if(this.isQuanX())this.isRequest()?$done(i):null;if(this.isSurge())this.isRequest()?$done(i):$done()}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){if(typeof t=="undefined"||t==null||t==""||t=="null"){return true}else{return false}}randomString(t){t=t||32;var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var i=s.length;var e="";for(let h=0;h<t;h++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,h,o,n,r,a,l){t+=``;if(t.length<h){while(t.length<h){if(o==0){t+=e}else{t=e+t}}}if(n){let s=``;for(var f=0;f<r;f++){s+=l}t=t.substring(0,a)+s+t.substring(r+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let h in s){t=t.replace(`${i}${h}${e}`,s[h])}}catch(t){this.logErr(t)}return t}toDBC(t){var s="";for(var i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}}(t,s,i)}