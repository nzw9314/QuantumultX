/*
索尼俱乐部签到-lowking-v1.4

⚠️v1.2之后需要订阅BoxJs之后填写帐号密码

************************
Surge 4.2.0+ 脚本配置:
************************
[Script]
# > 索尼俱乐部签到
索尼俱乐部签到 = type=cron,cronexp="0 0 0 * * ?",wake-system=1,script-path=https://raw.githubusercontent.com/lowking/Scripts/master/sony/sonyClub.js




************************
QuantumultX 脚本配置:
************************
[task_local]
0 0 0 * * ? https://raw.githubusercontent.com/lowking/Scripts/master/sony/sonyClub.js




************************
LOON 脚本配置:
************************
[Script]
cron "0 0 0 * * *" script-path=https://raw.githubusercontent.com/lowking/Scripts/master/sony/sonyClub.js, tag=索尼俱乐部签到

*/
const sonyClubTokenKey = 'lkSonyClubToken'
const lk = new ToolKit('索尼俱乐部签到', 'SonyClub')
const signurlVal = `https://www.sonystyle.com.cn/eSolverOmniChannel/account/signupPoints.do?channel=WAP&access_token=`
var sonyClubToken = !lk.getVal(sonyClubTokenKey) ? `` : lk.getVal(sonyClubTokenKey)
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`

if (!lk.isExecComm) {
    all()

    async function all() {
        lk.boxJsJsonBuilder({"author": "@lowking"})
        await signIn() //签到
        await notify() //通知
    }

    function signIn() {
        return new Promise(async (resolve, reject) => {
            try {
                let url = {
                    url: `${signurlVal}${sonyClubToken}`,
                    headers: {
                        "User-Agent": userAgent
                    }
                }
                lk.log(`${JSON.stringify(url)}`)
                lk.post(url, async (error, response, data) => {
                    try {
                        lk.log(data)
                        if (data == undefined) {
                            lk.log(`进入自动登录`)
                            // 不通知直接登录获取token
                            if (loginCount > 3) {
                                lk.appendNotifyInfo(`登录尝试3次，均失败❌请确认帐号密码是否正确！`)
                                lk.execFail()
                            } else {
                                await loginSonyClub()
                            }
                        } else {
                            const result = JSON.parse(data)
                            if (result.resultMsg[0].code == "00") {
                                lk.appendNotifyInfo(`连续签到${result.resultData.successiveSignupDays}天🎉\n本次签到获得【${result.resultData.signupRankingOfDay}】成长值，共【${result.resultData.totalPoints}】成长值`)
                            } else if (result.resultMsg[0].code == "99") {
                                lk.appendNotifyInfo(`重复签到🔁`)
                            } else if (result.resultMsg[0].code == "98") {
                                if (loginCount > 3) {
                                    lk.appendNotifyInfo(`登录尝试3次，均失败❌请确认帐号密码是否正确！`)
                                    lk.execFail()
                                } else {
                                    await loginSonyClub()
                                }
                            } else {
                                lk.appendNotifyInfo(`签到失败❌\\n${result.resultMsg[0].message}`)
                                lk.execFail()
                            }
                        }
                    } catch (ee) {
                        throw ee
                    } finally {
                        resolve()
                    }
                })
            } catch (e) {
                lk.log(`${lk.name}异常：\n${e}`)
                lk.execFail()
                lk.appendNotifyInfo(`签到异常，请带上日志联系作者❌`)
                return resolve()
            }
        })
    }

    var loginCount = 0

    async function loginSonyClub() {
        ++loginCount
        return new Promise(async (resolve, reject) => {
            lk.log(`第${loginCount}次尝试登录`)
            let loginId = lk.getVal("lkSonyClubLoginId")
            let pwd = lk.getVal("lkSonyClubPassword")
            if (lk.isEmpty(loginId) || lk.isEmpty(pwd)) {
                lk.appendNotifyInfo(`请到BoxJs填写帐号密码⚠️`)
                lk.execFail()
                return resolve()
            }
            let loginUrl = {
                url: `https://www.sonystyle.com.cn/eSolverOmniChannel/account/login.do`,
                headers: {
                    "User-Agent": userAgent,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "channel": "WAP",
                    "loginID": loginId,
                    "password": pwd
                })
            };
            try {
                lk.log(JSON.stringify(loginUrl))
                lk.post(loginUrl, async (error, response, data) => {
                    try {
                        lk.log(data)
                        if (data == undefined) {
                            if (loginCount > 3) {
                                lk.appendNotifyInfo(`登录尝试3次，均失败❌请确认帐号密码是否正确！`)
                                lk.execFail()
                                return resolve()
                            } else {
                                await loginSonyClub()
                            }
                        } else {
                            const result = JSON.parse(data)
                            if (result.resultMsg[0].code == "00") {
                                //登录成功，调用签到
                                let accessToken = result.resultData["access_token"]
                                lk.log(`登录成功，token：${accessToken}`)
                                lk.setVal(sonyClubTokenKey, accessToken)
                                sonyClubToken = accessToken
                                await signIn()
                            } else {
                                lk.appendNotifyInfo(`登录失败❌\n${result.resultMsg[0].message}`)
                                lk.execFail()
                                return resolve()
                            }
                        }
                    } finally {
                        resolve()
                    }
                })
            } catch (e) {
                lk.execFail()
                throw e
            }
        })
    }
}

function notify() {
    return new Promise((resolve, reject) => {
        lk.msg(``)
        lk.done()
        return resolve()
    })
}

function ToolKit(t,s,i){return new class{constructor(t,s,i){this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=`${this.prefix}${this.id}.dat`;this.boxJsJsonFile=`${this.prefix}${this.id}.boxjs.json`;this.options=i;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n██";this.startTime=(new Date).getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.log(`${this.name}, 开始执行!`);this.execComm()}async execComm(){if(this.isNode()){this.comm=process.argv.slice(2);if(this.comm[0]=="p"){this.isExecComm=true;this.log(`开始执行指令【${this.comm[0]}】=> 发送到手机测试脚本！`);if(this.isEmpty(this.options)||this.isEmpty(this.options.httpApi)){if(this.isEmpty(this.options)){this.options={}}this.options.httpApi=`ffff@3.3.3.18:6166`}else{if(/.*?@.*?:[0-9]+/.test(this.options.httpApi)){this.log(`httpApi格式错误！格式：ffff@3.3.3.18:6166`);this.done()}}await this.callApi()}}}callApi(){let t=this.getCallerFileNameAndLine().split(":")[0].replace("[","");this.log(`获取【${t}】内容传给手机`);let s="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const i=this.path.resolve(t);const e=this.path.resolve(process.cwd(),t);const h=this.fs.existsSync(i);const o=!h&&this.fs.existsSync(e);if(h||o){const t=h?i:e;try{s=this.fs.readFileSync(t)}catch(t){s=""}}else{s=""}let n={url:`http://${this.options.httpApi.split("@")[1]}/v1/scripting/evaluate`,headers:{"X-Key":`${this.options.httpApi.split("@")[0]}`},body:{script_text:`${s}`,mock_type:"cron",timeout:5},json:true};this.post(n,(s,i,e)=>{this.log(`已将脚本【${t}】发给手机！`);this.done()})}getCallerFileNameAndLine(){let t;try{throw Error("")}catch(s){t=s}const s=t.stack;const i=s.split("\n");let e=1;if(e!==0){const t=i[e];this.path=this.path?this.path:require("path");return`[${t.substring(t.lastIndexOf(this.path.sep)+1,t.lastIndexOf(":"))}]`}else{return"[-]"}}getFunName(t){var s=t.toString();s=s.substr("function ".length);s=s.substr(0,s.indexOf("("));return s}boxJsJsonBuilder(t){if(this.isNode()){this.log("using node");let s=["keys","settings"];const i="https://raw.githubusercontent.com/Orz-3";let e={};e.id=`${this.prefix}${this.id}`;e.name=this.name;e.icons=[`${i}/mini/master/${this.id.toLocaleLowerCase()}.png`,`${i}/task/master/${this.id.toLocaleLowerCase()}.png`];e.keys=[];e.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}isEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];e.author="@lowking";e.repo="https://github.com/lowking/Scripts";if(!this.isEmpty(t)){for(let i in s){let h=s[i];if(!this.isEmpty(t[h])){e[h]=e[h].concat(t[h])}delete t[h]}}Object.assign(e,t);if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.boxJsJsonFile);const s=this.path.resolve(process.cwd(),this.boxJsJsonFile);const i=this.fs.existsSync(t);const h=!i&&this.fs.existsSync(s);const o=JSON.stringify(e,null,"\t");if(i){this.fs.writeFileSync(t,o)}else if(h){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}}}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);console.log(`\n${t.message}`)}}msg(t,s){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){}else{if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(!this.isEmpty(s)){if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);this.get({url:encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{if(this.isQuanX())$notify(this.name,t,s);if(this.isSurge())$notification.post(this.name,t,s);if(this.isNode())this.log("⭐️"+this.name+t+s);if(this.isJSBox())$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}}getVal(t){if(this.isSurge()||this.isLoon()){return $persistentStore.read(t)}else if(this.isQuanX()){return $prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();return this.data[t]}else{return this.data&&this.data[t]||null}}setVal(t,s){if(this.isSurge()||this.isLoon()){return $persistentStore.write(s,t)}else if(this.isQuanX()){return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else return{}}else return{}}writeData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const h=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,h)}else if(e){this.fs.writeFileSync(s,h)}else{this.fs.writeFileSync(t,h)}}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge())$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)});if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[0]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t){this.costTime();let s=`body`;if(this.isRequest()){if(this.isQuanX())s=`content`;if(this.isSurge())s=`body`}let i={};i[s]=t;if(this.isQuanX())this.isRequest()?$done(i):null;if(this.isSurge())this.isRequest()?$done(i):$done()}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){if(typeof t=="undefined"||t==null||t==""||t=="null"){return true}else{return false}}randomString(t){t=t||32;var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var i=s.length;var e="";for(let h=0;h<t;h++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,h,o,n,r,a,l){t+=``;if(t.length<h){while(t.length<h){if(o==0){t+=e}else{t=e+t}}}if(n){let s=``;for(var f=0;f<r;f++){s+=l}t=t.substring(0,a)+s+t.substring(r+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let h in s){t=t.replace(`${i}${h}${e}`,s[h])}}catch(t){this.logErr(t)}return t}toDBC(t){var s="";for(var i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}}(t,s,i)}