/*
QQ会员成长值-lowking-v1.7

按下面配置完之后，手机qq进入左侧会员，滑动即可
⚠️注：发现cookie存活时间较短，增加isEnableNotifyForGetCookie，用来控制获取cookie时的通知，默认关闭通知

点赞排除列表数据结构如下：
{
    "qq号":[
        "要拉黑的人，写排行榜中的名字",
        "要拉黑的人，写排行榜中的名字"
    ],
    "qq号2":[
        "要拉黑的人，写排行榜中的名字",
        "要拉黑的人，写排行榜中的名字"
    ]
}

************************
Surge 4.2.0+ 脚本配置:
************************

[Script]
# > qq会员成长值签到
qq会员获取cookie = type=http-request,pattern=https:\/\/proxy.vac.qq.com\/cgi-bin\/srfentry.fcgi,script-path=qqVipCheckIn.js
qq会员签到 = type=cron,cronexp="0 0 0,1 * * ?",wake-system=1,script-path=qqVipCheckIn.js

[mitm]
hostname = proxy.vac.qq.com

************************
QuantumultX 本地脚本配置:
************************

[rewrite_local]
#qq会员获取cookie
https:\/\/proxy.vac.qq.com\/cgi-bin\/srfentry.fcgi? url script-request-header qqVipCheckIn.js

[task_local]
0 0 0,1 * * ? qqVipCheckIn.js

[mitm]
hostname= proxy.vac.qq.com

************************
LOON 本地脚本配置:
************************

[Script]
http-request https:\/\/proxy.vac.qq.com\/cgi-bin\/srfentry.fcgi script-path=https://raw.githubusercontent.com/lowking/Scripts/master/QQVip/qqVipCheckIn.js, timeout=10, tag=qq会员获取
cron "0 0 0,1 * * *" script-path=https://raw.githubusercontent.com/lowking/Scripts/master/QQVip/qqVipCheckIn.js, tag=qq会员签到

mitm= proxy.vac.qq.com
*/
const signHeaderKey = 'lkQQSignHeaderKey'
const blockListKey = 'lkQQSignBlockListKey'
const lk = new ToolKit('QQ会员成长值签到', 'QQVipCheckIn')
const isEnableNotifyForGetCookie = !lk.getVal('lkIsEnableNotifyForGetCookie') ? false : JSON.parse(lk.getVal('lkIsEnableNotifyForGetCookie'))
const isDeleteAllCookie = !lk.getVal('lkIsDeleteAllCookie') ? false : JSON.parse(lk.getVal('lkIsDeleteAllCookie'))
const isEnableGetCookie = !lk.getVal('lkIsEnableGetCookieQQVIP') ? true : JSON.parse(lk.getVal('lkIsEnableGetCookieQQVIP'))
const signurlVal = `https://iyouxi3.vip.qq.com/ams3.0.php?actid=403490&g_tk=`
const praiseurlVal = `https://mq.vip.qq.com/m/growth/loadfrank?`
const mainTitle = `QQ会员成长值签到`
var accounts = !lk.getVal(signHeaderKey) ? [] : JSON.parse(lk.getVal(signHeaderKey))
var blockList = !lk.getVal(blockListKey) ? {} : JSON.parse(lk.getVal(blockListKey))
// accounts = []

if (!lk.isExecComm) {
    if (lk.isRequest()) {
        if (isEnableGetCookie) {
            getCookie()
        } else {
            lk.done()
        }
    } else {
        all();
    }
}

async function all() {
    lk.boxJsJsonBuilder()
    await signIn() //签到
    lk.msg(``)
    lk.done()
}

function getCookie() {
    const url = $request.url
    if ($request && $request.method != 'OPTIONS' && url.match(/\/cgi-bin\/srfentry/)) {
        try {
            const qqheader = JSON.stringify($request.headers.Cookie)
            lk.log(qqheader)
            if (!!qqheader) {
                let obj = {
                    qq: Number(getCookieProp(qqheader, `uin`).substring(1)),
                    skey: getCookieProp(qqheader, `skey`),
                    cookie: qqheader
                }
                //判断当前qq信息是否持久化
                if (accounts.length > 0) {
                    for (var i in accounts) {
                        if (accounts[i].qq == obj.qq) {
                            accounts.splice(i, 1);
                        }
                    }
                }
                accounts.push(obj)
                lk.setVal(signHeaderKey, JSON.stringify(accounts))
                lk.log(`${JSON.stringify(accounts)}`)
                lk.log(`${lk.getVal(signHeaderKey)}`)
                if (isEnableNotifyForGetCookie) {
                    lk.appendNotifyInfo(`${lk.autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)}获取cookie成功🎉`)
                }
            }
        } catch (e) {
            lk.appendNotifyInfo(`获取cookie失败，请重试❌`)
        }
    }
    lk.msg(``)
    lk.done()
}

function signIn() {
    return new Promise(async (resolve, reject) => {
        lk.log(`所有账号：${JSON.stringify(accounts)}`);
        if (!accounts || accounts.length <= 0) {
            lk.execFail()
            lk.appendNotifyInfo(`帐号列表为空，请获取cookie之后再试❌`)
        } else {
            if (isDeleteAllCookie) {
                lk.setVal(signHeaderKey, ``)
                lk.execFail()
                lk.appendNotifyInfo(`已清除所有cookie⭕️`)
            } else {
                for (let i in accounts) {
                    lk.log(`账号：${JSON.stringify(accounts[i])}`)
                    await qqVipSignIn(i, accounts[i])
                    let list = await praise(i, accounts[i])
                    if (list != null && list.length > 0) {
                        pcount = 0
                        arcount = 0
                        errorcount = 0
                        for (let ii = 0; ii < list.length; ii++) {
                            if (isBlock(list[ii]["memo"], accounts[i]["qq"])) {
                                lk.log(`点赞排除【${list[ii]["memo"]}】`)
                                continue
                            }
                            if (list[ii]["isPraise"] == 0) {
                                await doPraise(list[ii], accounts[i])
                            } else {
                                arcount++
                            }
                        }
                        lk.appendNotifyInfo(`🎉【${pcount}】个，🔁【${arcount}】个，❌【${errorcount}】个`)
                    }
                }
            }
        }
        resolve()
    })
}

function isBlock(name, qqno) {
    for(var key in blockList){
        if (key == qqno) {
            if (blockList[key].indexOf(name) != -1) {
                return true
            } else {
                return false
            }
        }
    }

    return false
}

var pcount = 0
var arcount = 0
var errorcount = 0
function praise(index, obj){
    return new Promise(async (resolve, reject) => {
        let qqno = lk.autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)
        let pskey = lk.randomString(44)
        let pstk = getPstk(pskey)
        let gtk = getCSRFToken(obj.skey)
        let praiseurlValReal = praiseurlVal
        let realHeader = {}
        // realHeader.Host = `iyouxi3.vip.qq.com`
        realHeader.Cookie = obj.cookie + `; p_skey=${pskey}`
        realHeader.Cookie = realHeader.Cookie.replace("\"", "")
        realHeader.Cookie = realHeader.Cookie.replace("\"", "")
        realHeader.Referer = `https://mq.vip.qq.com/m/growth/rank`
        let url = {
            url: praiseurlValReal + `pn=1&g_tk=${gtk}&ps_tk=${pstk}`,
            headers: realHeader
        }
        lk.get(url, (error, response, data) => {
            let list = null
            try {
                const result = JSON.parse(data)
                if (result.ret == 0) {
                    list = result.data
                } else if (result.ret == -7) {
                    lk.appendNotifyInfo(`${qqno}❌\ncookie失效，请重新获取`)
                    lk.execFail()
                } else {
                    //获取列表失败，返回
                    lk.appendNotifyInfo(`${qqno}会员点赞失败，请查看日志`)
                    lk.execFail()
                    lk.log(`当前帐号：${obj.qq}\n获取好友会员列表失败，请重新执行任务，若还是失败，请重新获取cookie`)
                }
            } catch (e) {
                lk.execFail()
                lk.log(`${qqno}的cookie失效`)
            } finally {
                resolve(list)
            }
        })
    })
}

function doPraise(item, obj){
    return new Promise(async (resolve, reject) => {
        if (item["me"] != `me`) {
            let pskey = lk.randomString(44)
            let pstk = getPstk(pskey)
            let gtk = getCSRFToken(obj.skey)
            let realHeader = {}
            realHeader.Cookie = obj.cookie + `; p_skey=${pskey}`
            realHeader.Cookie = realHeader.Cookie.replace("\"", "")
            realHeader.Cookie = realHeader.Cookie.replace("\"", "")
            realHeader.Referer = `https://mq.vip.qq.com/m/growth/rank`
            let purl = {
                url: `https://mq.vip.qq.com/m/growth/doPraise?method=0&toUin=${item["uin"]}&g_tk=${gtk}&ps_tk=${pstk}`,
                headers: realHeader
            }
            await lk.get(purl, (perror, presponse, pdata) => {
                try {
                    const presult = JSON.parse(pdata)
                    if (presult.ret == 0) {
                        lk.log(`给第${item["rank"]}名：${item["memo"]}点赞成功🎉`)
                        pcount++
                    } else {
                        lk.log(`第${item["rank"]}名：${item["memo"]}点赞失败❌`)
                        lk.execFail()
                        errorcount++
                    }
                } catch (e) {
                    console.log(e)
                    resolve()
                } finally {
                    resolve()
                }
            })
        }else{
            resolve()
        }
    })
}

function qqVipSignIn(index, obj) {
    return new Promise((resolve, reject) => {
        let signurlValReal = signurlVal
        let realHeader = {}
        realHeader.Host = `iyouxi3.vip.qq.com`
        realHeader.Cookie = obj.cookie.replace("\"", "")
        let url = {
            url: signurlValReal + getCSRFToken(obj.skey),
            headers: realHeader
        }
        let notifyInfo = ''
        lk.get(url, (error, response, data) => {
            try {
                notifyInfo += `${lk.autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)}`
                if (index == 3) {
                    lk.appendNotifyInfo(`【左滑 '查看' 以显示签到详情】`)
                }
                const result = JSON.parse(data)
                if (result.ret == 0) {
                    notifyInfo += `🎉`
                } else if (result.ret == 10601) {
                    notifyInfo += `🔁`
                } else {
                    notifyInfo += `❌`
                    lk.execFail()
                }
                lk.appendNotifyInfo(notifyInfo)
                lk.appendNotifyInfo(result.msg.indexOf(`火爆`) != -1 ? `cookie失效，请重新获取` : `${result.msg}`)
            } finally {
                resolve()
            }
        })
    })
}

function getCookieProp(ca, cname) {
    var name = cname + "="
    ca = ca.split(";")
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim()
        if (c.indexOf(name) == 0) {
            return c.substring(name.length).replace("\"", "")
        }
    }
    return ""
}

function notify() {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

function ToolKit(t,s,i){return new class{constructor(t,s,i){this.userAgent=`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`;this.prefix=`lk`;this.name=t;this.id=s;this.data=null;this.dataFile=`${this.prefix}${this.id}.dat`;this.boxJsJsonFile=`${this.prefix}${this.id}.boxjs.json`;this.options=i;this.isExecComm=false;this.isEnableLog=this.getVal(`${this.prefix}IsEnableLog${this.id}`);this.isEnableLog=this.isEmpty(this.isEnableLog)?true:JSON.parse(this.isEnableLog);this.isNotifyOnlyFail=this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`);this.isNotifyOnlyFail=this.isEmpty(this.isNotifyOnlyFail)?false:JSON.parse(this.isNotifyOnlyFail);this.isEnableTgNotify=this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`);this.isEnableTgNotify=this.isEmpty(this.isEnableTgNotify)?false:JSON.parse(this.isEnableTgNotify);this.tgNotifyUrl=this.getVal(`${this.prefix}TgNotifyUrl${this.id}`);this.isEnableTgNotify=this.isEnableTgNotify?!this.isEmpty(this.tgNotifyUrl):this.isEnableTgNotify;this.costTotalStringKey=`${this.prefix}CostTotalString${this.id}`;this.costTotalString=this.getVal(this.costTotalStringKey);this.costTotalString=this.isEmpty(this.costTotalString)?`0,0`:this.costTotalString.replace('"',"");this.costTotalMs=this.costTotalString.split(",")[0];this.execCount=this.costTotalString.split(",")[1];this.costTotalMs=this.isEmpty(this.costTotalMs)?0:parseInt(this.costTotalMs);this.execCount=this.isEmpty(this.execCount)?0:parseInt(this.execCount);this.logSeparator="\n██";this.startTime=(new Date).getTime();this.node=(()=>{if(this.isNode()){const t=require("request");return{request:t}}else{return null}})();this.execStatus=true;this.notifyInfo=[];this.log(`${this.name}, 开始执行!`);this.execComm()}async execComm(){if(this.isNode()){this.comm=process.argv.slice(2);if(this.comm[0]=="p"){this.isExecComm=true;this.log(`开始执行指令【${this.comm[0]}】=> 发送到手机测试脚本！`);if(this.isEmpty(this.options)||this.isEmpty(this.options.httpApi)){if(this.isEmpty(this.options)){this.options={}}this.options.httpApi=`ffff@3.3.3.18:6166`}else{if(/.*?@.*?:[0-9]+/.test(this.options.httpApi)){this.log(`httpApi格式错误！格式：ffff@3.3.3.18:6166`);this.done()}}await this.callApi()}}}callApi(){let t=this.getCallerFileNameAndLine().split(":")[0].replace("[","");this.log(`获取【${t}】内容传给手机`);let s="";this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const i=this.path.resolve(t);const e=this.path.resolve(process.cwd(),t);const h=this.fs.existsSync(i);const o=!h&&this.fs.existsSync(e);if(h||o){const t=h?i:e;try{s=this.fs.readFileSync(t)}catch(t){s=""}}else{s=""}let n={url:`http://${this.options.httpApi.split("@")[1]}/v1/scripting/evaluate`,headers:{"X-Key":`${this.options.httpApi.split("@")[0]}`},body:{script_text:`${s}`,mock_type:"cron",timeout:5},json:true};this.post(n,(s,i,e)=>{this.log(`已将脚本【${t}】发给手机！`);this.done()})}getCallerFileNameAndLine(){let t;try{throw Error("")}catch(s){t=s}const s=t.stack;const i=s.split("\n");let e=1;if(e!==0){const t=i[e];this.path=this.path?this.path:require("path");return`[${t.substring(t.lastIndexOf(this.path.sep)+1,t.lastIndexOf(":"))}]`}else{return"[-]"}}getFunName(t){var s=t.toString();s=s.substr("function ".length);s=s.substr(0,s.indexOf("("));return s}boxJsJsonBuilder(t){if(this.isNode()){this.log("using node");let s=["keys","settings"];const i="https://raw.githubusercontent.com/Orz-3";let e={};e.id=`${this.prefix}${this.id}`;e.name=this.name;e.icons=[`${i}/mini/master/${this.id.toLocaleLowerCase()}.png`,`${i}/task/master/${this.id.toLocaleLowerCase()}.png`];e.keys=[];e.settings=[{id:`${this.prefix}IsEnableLog${this.id}`,name:"开启/关闭日志",val:true,type:"boolean",desc:"默认开启"},{id:`${this.prefix}NotifyOnlyFail${this.id}`,name:"只当执行失败才通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}isEnableTgNotify${this.id}`,name:"开启/关闭Telegram通知",val:false,type:"boolean",desc:"默认关闭"},{id:`${this.prefix}TgNotifyUrl${this.id}`,name:"Telegram通知地址",val:"",type:"text",desc:"Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="}];e.author="@lowking";e.repo="https://github.com/lowking/Scripts";if(!this.isEmpty(t)){for(let i in s){let h=s[i];if(!this.isEmpty(t[h])){e[h]=e[h].concat(t[h])}delete t[h]}}Object.assign(e,t);if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.boxJsJsonFile);const s=this.path.resolve(process.cwd(),this.boxJsJsonFile);const i=this.fs.existsSync(t);const h=!i&&this.fs.existsSync(s);const o=JSON.stringify(e,null,"\t");if(i){this.fs.writeFileSync(t,o)}else if(h){this.fs.writeFileSync(s,o)}else{this.fs.writeFileSync(t,o)}}}}appendNotifyInfo(t,s){if(s==1){this.notifyInfo=t}else{this.notifyInfo.push(t)}}execFail(){this.execStatus=false}isRequest(){return typeof $request!="undefined"}isSurge(){return typeof $httpClient!="undefined"}isQuanX(){return typeof $task!="undefined"}isLoon(){return typeof $loon!="undefined"}isJSBox(){return typeof $app!="undefined"&&typeof $http!="undefined"}isNode(){return typeof require=="function"&&!this.isJSBox()}sleep(t){return new Promise(s=>setTimeout(s,t))}log(t){if(this.isEnableLog)console.log(`${this.logSeparator}${t}`)}logErr(t){if(this.isEnableLog){console.log(`${this.logSeparator}${this.name}执行异常:`);console.log(t);console.log(`\n${t.message}`)}}msg(t,s){if(!this.isRequest()&&this.isNotifyOnlyFail&&this.execStatus){}else{if(this.isEmpty(s)){if(Array.isArray(this.notifyInfo)){s=this.notifyInfo.join("\n")}else{s=this.notifyInfo}}if(!this.isEmpty(s)){if(this.isEnableTgNotify){this.log(`${this.name}Tg通知开始`);this.get({url:encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${s}`)},(t,s,i)=>{this.log(`Tg通知完毕`)})}else{if(this.isQuanX())$notify(this.name,t,s);if(this.isSurge())$notification.post(this.name,t,s);if(this.isNode())this.log("⭐️"+this.name+t+s);if(this.isJSBox())$push.schedule({title:this.name,body:t?t+"\n"+s:s})}}}}getVal(t){if(this.isSurge()||this.isLoon()){return $persistentStore.read(t)}else if(this.isQuanX()){return $prefs.valueForKey(t)}else if(this.isNode()){this.data=this.loadData();return this.data[t]}else{return this.data&&this.data[t]||null}}setVal(t,s){if(this.isSurge()||this.isLoon()){return $persistentStore.write(s,t)}else if(this.isQuanX()){return $prefs.setValueForKey(s,t)}else if(this.isNode()){this.data=this.loadData();this.data[t]=s;this.writeData();return true}else{return this.data&&this.data[t]||null}}loadData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);if(i||e){const e=i?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(t){return{}}}else return{}}else return{}}writeData(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs");this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile);const s=this.path.resolve(process.cwd(),this.dataFile);const i=this.fs.existsSync(t);const e=!i&&this.fs.existsSync(s);const h=JSON.stringify(this.data);if(i){this.fs.writeFileSync(t,h)}else if(e){this.fs.writeFileSync(s,h)}else{this.fs.writeFileSync(t,h)}}}adapterStatus(t){if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t}get(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge())$httpClient.get(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)});if(this.isNode()){this.node.request(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.get(t)}}post(t,s=(()=>{})){if(this.isQuanX()){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{s(null,this.adapterStatus(t),t.body)},t=>s(t.error,null,null))}if(this.isSurge()){$httpClient.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isNode()){this.node.request.post(t,(t,i,e)=>{s(t,this.adapterStatus(i),e)})}if(this.isJSBox()){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let i=t.error;if(i)i=JSON.stringify(t.error);let e=t.data;if(typeof e=="object")e=JSON.stringify(t.data);s(i,this.adapterStatus(t.response),e)};$http.post(t)}}costTime(){let t=`${this.name}执行完毕！`;if(this.isNode()&&this.isExecComm){t=`指令【${this.comm[0]}】执行完毕！`}const s=(new Date).getTime();const i=s-this.startTime;const e=i/1e3;this.execCount++;this.costTotalMs+=i;this.log(`${t}耗时【${e}】秒\n总共执行【${this.execCount}】次，平均耗时【${(this.costTotalMs/this.execCount/1e3).toFixed(4)}】秒`);this.setVal(this.costTotalStringKey,JSON.stringify(`${this.costTotalMs},${this.execCount}`))}done(t){this.costTime();let s=`body`;if(this.isRequest()){if(this.isQuanX())s=`content`;if(this.isSurge())s=`body`}let i={};i[s]=t;if(this.isQuanX())this.isRequest()?$done(i):null;if(this.isSurge())this.isRequest()?$done(i):$done()}getRequestUrl(){return $request.url}getResponseBody(){return $response.body}isGetCookie(t){return!!($request.method!="OPTIONS"&&this.getRequestUrl().match(t))}isEmpty(t){if(typeof t=="undefined"||t==null||t==""||t=="null"){return true}else{return false}}randomString(t){t=t||32;var s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var i=s.length;var e="";for(let h=0;h<t;h++){e+=s.charAt(Math.floor(Math.random()*i))}return e}autoComplete(t,s,i,e,h,o,n,r,a,l){t+=``;if(t.length<h){while(t.length<h){if(o==0){t+=e}else{t=e+t}}}if(n){let s=``;for(var f=0;f<r;f++){s+=l}t=t.substring(0,a)+s+t.substring(r+a)}t=s+t+i;return this.toDBC(t)}customReplace(t,s,i,e){try{if(this.isEmpty(i)){i="#{"}if(this.isEmpty(e)){e="}"}for(let h in s){t=t.replace(`${i}${h}${e}`,s[h])}}catch(t){this.logErr(t)}return t}toDBC(t){var s="";for(var i=0;i<t.length;i++){if(t.charCodeAt(i)==32){s=s+String.fromCharCode(12288)}else if(t.charCodeAt(i)<127){s=s+String.fromCharCode(t.charCodeAt(i)+65248)}}return s}}(t,s,i)}
function getPstk(r){for(var n=5381,t=0,a=r.length;a>t;++t)n+=(n<<5)+r.charCodeAt(t);return 2147483647&n}function getCSRFToken(r){var n="5381";var t="tencentQQVIP123443safde&!%^%1282";var a=r;var e=[],u;e.push(n<<5);for(var o=0,v=a.length;o<v;++o){u=a.charAt(o).charCodeAt(0);e.push((n<<5)+u);n=u}return md5z(e.join("")+t)}function md5z(r){var n=0;var t="";var a=8;var e=32;function u(r){return z(h(k(r),r.length*a))}function o(r){return F(h(k(r),r.length*a))}function v(r){return p(h(k(r),r.length*a))}function f(r,n){return z(s(r,n))}function c(r,n){return F(s(r,n))}function i(r,n){return p(s(r,n))}function h(r,n){r[n>>5]|=128<<n%32;r[(n+64>>>9<<4)+14]=n;var t=1732584193;var a=-271733879;var u=-1732584194;var o=271733878;for(var v=0;v<r.length;v+=16){var f=t;var c=a;var i=u;var h=o;t=l(t,a,u,o,r[v+0],7,-680876936);o=l(o,t,a,u,r[v+1],12,-389564586);u=l(u,o,t,a,r[v+2],17,606105819);a=l(a,u,o,t,r[v+3],22,-1044525330);t=l(t,a,u,o,r[v+4],7,-176418897);o=l(o,t,a,u,r[v+5],12,1200080426);u=l(u,o,t,a,r[v+6],17,-1473231341);a=l(a,u,o,t,r[v+7],22,-45705983);t=l(t,a,u,o,r[v+8],7,1770035416);o=l(o,t,a,u,r[v+9],12,-1958414417);u=l(u,o,t,a,r[v+10],17,-42063);a=l(a,u,o,t,r[v+11],22,-1990404162);t=l(t,a,u,o,r[v+12],7,1804603682);o=l(o,t,a,u,r[v+13],12,-40341101);u=l(u,o,t,a,r[v+14],17,-1502002290);a=l(a,u,o,t,r[v+15],22,1236535329);t=A(t,a,u,o,r[v+1],5,-165796510);o=A(o,t,a,u,r[v+6],9,-1069501632);u=A(u,o,t,a,r[v+11],14,643717713);a=A(a,u,o,t,r[v+0],20,-373897302);t=A(t,a,u,o,r[v+5],5,-701558691);o=A(o,t,a,u,r[v+10],9,38016083);u=A(u,o,t,a,r[v+15],14,-660478335);a=A(a,u,o,t,r[v+4],20,-405537848);t=A(t,a,u,o,r[v+9],5,568446438);o=A(o,t,a,u,r[v+14],9,-1019803690);u=A(u,o,t,a,r[v+3],14,-187363961);a=A(a,u,o,t,r[v+8],20,1163531501);t=A(t,a,u,o,r[v+13],5,-1444681467);o=A(o,t,a,u,r[v+2],9,-51403784);u=A(u,o,t,a,r[v+7],14,1735328473);a=A(a,u,o,t,r[v+12],20,-1926607734);t=d(t,a,u,o,r[v+5],4,-378558);o=d(o,t,a,u,r[v+8],11,-2022574463);u=d(u,o,t,a,r[v+11],16,1839030562);a=d(a,u,o,t,r[v+14],23,-35309556);t=d(t,a,u,o,r[v+1],4,-1530992060);o=d(o,t,a,u,r[v+4],11,1272893353);u=d(u,o,t,a,r[v+7],16,-155497632);a=d(a,u,o,t,r[v+10],23,-1094730640);t=d(t,a,u,o,r[v+13],4,681279174);o=d(o,t,a,u,r[v+0],11,-358537222);u=d(u,o,t,a,r[v+3],16,-722521979);a=d(a,u,o,t,r[v+6],23,76029189);t=d(t,a,u,o,r[v+9],4,-640364487);o=d(o,t,a,u,r[v+12],11,-421815835);u=d(u,o,t,a,r[v+15],16,530742520);a=d(a,u,o,t,r[v+2],23,-995338651);t=C(t,a,u,o,r[v+0],6,-198630844);o=C(o,t,a,u,r[v+7],10,1126891415);u=C(u,o,t,a,r[v+14],15,-1416354905);a=C(a,u,o,t,r[v+5],21,-57434055);t=C(t,a,u,o,r[v+12],6,1700485571);o=C(o,t,a,u,r[v+3],10,-1894986606);u=C(u,o,t,a,r[v+10],15,-1051523);a=C(a,u,o,t,r[v+1],21,-2054922799);t=C(t,a,u,o,r[v+8],6,1873313359);o=C(o,t,a,u,r[v+15],10,-30611744);u=C(u,o,t,a,r[v+6],15,-1560198380);a=C(a,u,o,t,r[v+13],21,1309151649);t=C(t,a,u,o,r[v+4],6,-145523070);o=C(o,t,a,u,r[v+11],10,-1120210379);u=C(u,o,t,a,r[v+2],15,718787259);a=C(a,u,o,t,r[v+9],21,-343485551);t=y(t,f);a=y(a,c);u=y(u,i);o=y(o,h)}if(e==16){return Array(a,u)}else{return Array(t,a,u,o)}}function g(r,n,t,a,e,u){return y(m(y(y(n,r),y(a,u)),e),t)}function l(r,n,t,a,e,u,o){return g(n&t|~n&a,r,n,e,u,o)}function A(r,n,t,a,e,u,o){return g(n&a|t&~a,r,n,e,u,o)}function d(r,n,t,a,e,u,o){return g(n^t^a,r,n,e,u,o)}function C(r,n,t,a,e,u,o){return g(t^(n|~a),r,n,e,u,o)}function s(r,n){var t=k(r);if(t.length>16)t=h(t,r.length*a);var e=Array(16),u=Array(16);for(var o=0;o<16;o++){e[o]=t[o]^909522486;u[o]=t[o]^1549556828}var v=h(e.concat(k(n)),512+n.length*a);return h(u.concat(v),512+128)}function y(r,n){var t=(r&65535)+(n&65535);var a=(r>>16)+(n>>16)+(t>>16);return a<<16|t&65535}function m(r,n){return r<<n|r>>>32-n}function k(r){var n=Array();var t=(1<<a)-1;for(var e=0;e<r.length*a;e+=a)n[e>>5]|=(r.charCodeAt(e/a)&t)<<e%32;return n}function p(r){var n="";var t=(1<<a)-1;for(var e=0;e<r.length*32;e+=a)n+=String.fromCharCode(r[e>>5]>>>e%32&t);return n}function z(r){var t=n?"0123456789ABCDEF":"0123456789abcdef";var a="";for(var e=0;e<r.length*4;e++){a+=t.charAt(r[e>>2]>>e%4*8+4&15)+t.charAt(r[e>>2]>>e%4*8&15)}return a}function F(r){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var a="";for(var e=0;e<r.length*4;e+=3){var u=(r[e>>2]>>8*(e%4)&255)<<16|(r[e+1>>2]>>8*((e+1)%4)&255)<<8|r[e+2>>2]>>8*((e+2)%4)&255;for(var o=0;o<4;o++){if(e*8+o*6>r.length*32)a+=t;else a+=n.charAt(u>>6*(3-o)&63)}}return a}return u(r)}